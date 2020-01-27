/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';
const async = require("async");
const core = require('soajs').core;
const helper = require('./helper.js');

let lib = {
	"handleRepositories": (bl, soajs, driver, modelObj, update) => {
		let opts = {
			config: bl.localConfig
		};
		let ts = new Date().getTime();
		driver.getRepositories(opts, (err, firstSet) => {
			if (err) {
				soajs.log.error(err);
			}
			let count = 0;
			if (firstSet && firstSet.records && firstSet.records.length > 0) {
				async.each(firstSet.records, (oneRecord, call) => {
					oneRecord.ts = ts;
					let finalRecord = driver.createRepositoryRecord(oneRecord);
					if (update && update.value && update.value.length > 0){
						if (update.type === "whitelist"){
							if (update.value.indexOf(finalRecord.repository) === -1){
								return call();
							}
						}
						else if (update.type === "blacklist"){
							if (update.value.indexOf(finalRecord.repository) > -1){
								return call();
							}
						}
					}
					count++;
					modelObj.updateRepository(finalRecord, call);
				}, (err) => {
					if (err) {
						soajs.log.error(err);
					}
					let complete = firstSet.next;
					if (complete) {
						async.whilst(function (cb) {
								cb(null, complete);
							},
							function (next) {
								//skip the first page
								opts = {
									config: bl.localConfig
								};
								driver.getRepositories(opts, function (err, sets) {
									if (err) {
										return next(err);
									}
									complete = sets.next;
									if (sets && sets.records && sets.records.length > 0) {
										async.each(sets.records, (oneRecord, call) => {
											oneRecord.ts = ts;
											let finalRecord = driver.createRepositoryRecord(oneRecord);
											if (update && update.value && update.value.length > 0){
												if (update.type === "whitelist"){
													if (update.value.indexOf(finalRecord.repository) === -1){
														return call();
													}
												}
												else if (update.type === "blacklist"){
													if (update.value.indexOf(finalRecord.repository) > -1){
														return call();
													}
												}
											}
											count++;
											modelObj.updateRepository(finalRecord, call);
										}, (err) => {
											if (update) {
												soajs.log.debug(count, "Repositories Updated So Far... ");
											} else {
												soajs.log.debug(count, "Repositories Added So Far... ");
											}
											return next(err, sets);
										});
									} else {
										return next(null, sets);
									}
								});
							}, function (err) {
								if (err) {
									soajs.log.error(err);
								}
								opts = {
									config: bl.localConfig
								};
								driver.getOrganizations(opts, (err, organizations) => {
									if (err) {
										soajs.log.error(err);
										
									}
									modelObj.updateAccount({
										id: soajs.inputmaskData.id,
										metadata: {organizations}
									}, (err) => {
										if (err) {
											soajs.log.error(err);
										}
										if (update) {
											soajs.log.debug(count, "Repositories Updated Successfully!");
											modelObj.syncRepository({
												ts,
												owner: driver.getOwner()
											}, (err) => {
												if (err) {
													soajs.log.error(err);
												}
											});
										} else {
											soajs.log.debug(count, "Repositories Added Successfully!");
										}
									});
								});
							});
					} else {
						opts = {
							config: bl.localConfig
						};
						driver.getOrganizations(opts, (err, organizations) => {
							if (err) {
								soajs.log.error(err);
							}
							modelObj.updateAccount({
								id: soajs.inputmaskData.id,
								metadata: {organizations}
							}, (err) => {
								if (err) {
									soajs.log.error(err);
								}
								if (update) {
									soajs.log.debug(count, "Repositories Updated Successfully!");
									modelObj.syncRepository({
										ts,
										owner: driver.getOwner()
									}, (err) => {
										if (err) {
											soajs.log.error(err);
										}
									});
								} else {
									soajs.log.debug(count, "Repositories Added Successfully!");
								}
							});
						});
					}
				});
			}
		});
	},
	
	"computeCatalog": (bl, soajs, driver, models, catalogInfo, cb) => {
		let data = {
			repo: catalogInfo.repo,
			prefix: null,
			branch: catalogInfo.branch,
			config: bl.localConfig
		};
		let ts = new Date().getTime();
		lib.getSoaJson(driver, data, (err, soa) => {
			if (err) {
				soa = {
					content: {
						"type": "custom",
						"name": catalogInfo.repo.repository.split("/")[1]
					}
				};
				startProcessing(soa, cb);
			}
			if (soa.content.type === "multi") {
				if (soa.content.folders && Array.isArray(soa.content.folders) && soa.content.folders.length > 0) {
					async.each(soa.content.folders, function (file, callback) {
						let opts = JSON.parse(JSON.stringify(data));
						opts.prefix = file;
						lib.getSoaJson(driver, opts, (err, soa) => {
							if (err) {
								soa = {
									content: {
										"type": "custom",
										"name": catalogInfo.repo.repository.split("/")[1]
									}
								};
							}
							startProcessing(soa, callback);
						});
					}, cb);
				} else {
					soa = {
						content: {
							"type": "custom",
							"name": catalogInfo.repo.repository.split("/")[1]
						}
					};
					startProcessing(soa, cb);
				}
			} else {
				startProcessing(soa, cb);
			}
			
			function startProcessing(soa, cb) {
				if (!soa.content.type || bl.localConfig.catalogs.indexOf(soa.content.type) === -1) {
					soa.content.type = "custom";
				}
				let catalogDriver = require(`./catalog/${soa.content.type}/index.js`);
				let catalog = {};
				let data = {
					soa: soa,
					repo: catalogInfo.repo,
					ts: ts,
					branch: catalogInfo.branch,
					config: bl.localConfig
				};
				async.series({
					validateSoa: function (callback) {
						lib.validateSoa(data, bl.localConfig, (err) => {
							if (err) {
								return callback(bl.handleError(soajs, 604, err));
							}
							return callback();
						});
					},
					getSwagger: function (callback) {
						lib.getSwagger(soajs, driver, data, callback);
					},
					getExtras: function (callback) {
						lib.getExtras(soajs, driver, data, callback);
					},
					checkCanUpdate: function (callback) {
						catalogDriver.checkCanUpdate(data, soa.content, models, callback);
					},
					createCatalog: function (callback) {
						catalogDriver.createCatalog(data, catalog, callback);
					},
					updateCatalogMarketPlace: function (callback) {
						lib.updateCatalogMarketPlace(data, catalog, soajs, models, catalogDriver, (err) => {
							if (err) {
								return callback(bl.handleError(soajs, 602, err));
							}
							return callback();
						});
					},
					updateGitRepo: function (callback) {
						lib.updateGitRepo(data, catalog, soajs, models, (err) => {
							if (err) {
								return callback(bl.handleError(soajs, 602, err));
							}
							return callback();
						});
					},
					
				}, () => {
					if (err) {
						if (err.message === "Duplicate found"){
							return cb(bl.handleError(soajs, 417, err));
						}
						if (!err.code){
							return cb(bl.handleError(soajs, 602, err));
						}
						return cb(err);
					}
					return cb(null, `Repository ${data.repo.repository} branch ${data.branch.name} is active!`);
				});
			}
		});
	},
	"validateSoa": (data, config, cb) => {
		lib.checkIfOldSchema(data, () => {
			if (!data.soa.content.type || config.catalogs.indexOf(data.soa.content.type) === -1) {
				data.soa.content.type = "custom";
			}
			const validator = new core.validator.Validator();
			let check = validator.validate(data.soa.content, require(`./catalog/${data.soa.content.type}/validator.js`));
			if (check.valid) {
				return cb(null, true);
			} else {
				return cb({
					message: check.errors
				});
			}
		});
	},
	
	"checkIfOldSchema": (data, cb) => {
		if (data.soa.content.serviceName) {
			data.soa.content.name = data.soa.content.serviceName;
			delete data.soa.content.serviceName;
		}
		if (data.soa.content.serviceGroup) {
			data.soa.content.group = data.soa.content.serviceGroup;
			delete data.soa.content.serviceGroup;
		}
		if (data.soa.content.serviceVersion) {
			data.soa.content.version = data.soa.content.serviceVersion;
			delete data.soa.content.serviceVersion;
		}
		if (data.soa.content.servicePort) {
			data.soa.content.port = data.soa.content.servicePort;
			delete data.soa.content.servicePort;
		}
		return cb();
	},
	
	"getSoaJson": (driver, data, cb) => {
		getFiles("/soa.json", (err, soaJSON) => {
			if (err) {
				getFiles("/config.js", (err, config) => {
					if (err) {
						getFiles("/soa.js", (err, soa) => {
							if (err) {
								return cb(err);
							} else {
								try {
									soa.content = helper.requireFromString(soa.content);
									return cb(null, soa);
								} catch (e) {
									return cb(e);
								}
							}
						});
					} else {
						try {
							config.content = helper.requireFromString(config.content);
							return cb(null, config);
						} catch (e) {
							return cb(e);
						}
					}
				});
			} else {
				try {
					soaJSON.content = JSON.parse(soaJSON.content);
					return cb(null, soaJSON);
				} catch (e) {
					return cb(e);
				}
			}
		});
		
		function getFiles(path, cb) {
			if (data.prefix) {
				if (typeof data.prefix !== "string") {
					return cb(new Error("Bad Multi configuration"));
				}
				path = data.prefix + "/" + path;
			}
			let opts = {
				path,
				branch: data.branch.name,
				repository: data.repo.repository,
				config: data.config
			};
			driver.getFile(opts, cb);
		}
	},
	
	"getExtras": (soajs, driver, data, cb) => {
		if (data.soa.content.documentation) {
			async.parallel({
				readme: function (callback) {
					if (data.soa.content.documentation.readme) {
						let opts = {
							path: data.soa.content.documentation.readme,
							branch: data.branch.name,
							repository: data.repo.repository,
							config: data.config
						};
						driver.getFile(opts, callback);
					} else {
						return callback();
					}
				},
				release: function (callback) {
					if (data.soa.content.documentation.release) {
						let opts = {
							path: data.soa.content.documentation.readme,
							branch: data.branch.name,
							repository: data.repo.repository,
							config: data.config
						};
						driver.getFile(opts, callback);
					} else {
						return callback();
					}
				}
			}, function (err, results) {
				if (err) {
					soajs.log.error(err);
				}
				data.documentation = {};
				if (results.readme && results.readme.content) {
					data.documentation.readme = results.readme.content;
				}
				if (results.release && results.release.content) {
					data.documentation.release = results.release.content;
				}
				return cb();
			});
			
		} else {
			return cb();
		}
	},
	
	"updateCatalogMarketPlace": (data, catalog, soajs, models, catalogDriver, cb) => {
		let opts = catalog;
		models.modelObjMarketPlace.updateCatalog(opts, (err)=>{
			if (err){
				return cb(err);
			}
			return cb(null, true);
		});
	},
	"updateGitRepo": (data, catalog, soajs, models, cb) => {
		let opts = {
			"name": data.branch.name,
			"_id": data.repo._id,
			"active": true
		};
		models.modelObj.updateBranches(opts, (err)=>{
			if (err){
				return cb(err);
			}
			return cb(null, true);
		});
	},
	"getSwagger": (soajs, driver, data, cb) => {
		let opts = {
			path: data.soa.content.swaggerFilename ? data.soa.content.swaggerFilename : "/swagger.yaml",
			branch: data.branch.name,
			repository: data.repo.repository,
			config: data.config
		};
		driver.getFile(opts, (err, swagger) => {
			if (err) {
				soajs.log.error(err);
			} else {
				helper.parseSwagger(swagger.content, (err, response) => {
					if (err) {
						return cb(err);
					}
					swagger.content = response.content;
					data.soa.content.schema = helper.extractAPIsList(response.schema);
					data.swagger = swagger;
					return cb(null, true);
				});
			}
		});
	}
};


module.exports = lib;