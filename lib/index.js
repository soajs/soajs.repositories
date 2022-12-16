/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';
const async = require("async");
const request = require("request");
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
				if (err.message) {
					soajs.log.error(err.message);
				} else {
					soajs.log.error(err);
				}
			}
			let count = 0;
			if (firstSet && firstSet.records && firstSet.records.length > 0) {
				async.each(firstSet.records, (oneRecord, call) => {
					oneRecord.ts = ts;
					let finalRecord = driver.createRepositoryRecord(oneRecord);
					if (update && update.value && update.value.length > 0) {
						if (update.type === "whitelist") {
							if (update.value.indexOf(finalRecord.repository) === -1) {
								return call();
							}
						} else if (update.type === "blacklist") {
							if (update.value.indexOf(finalRecord.repository) > -1) {
								return call();
							}
						}
					}
					count++;
					modelObj.updateRepository(finalRecord, call);
				}, (err) => {
					if (err) {
						if (err.message) {
							soajs.log.error(err.message);
						} else {
							soajs.log.error(err);
						}
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
											if (update && update.value && update.value.length > 0) {
												if (update.type === "whitelist") {
													if (update.value.indexOf(finalRecord.repository) === -1) {
														return call();
													}
												} else if (update.type === "blacklist") {
													if (update.value.indexOf(finalRecord.repository) > -1) {
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
									if (err.message) {
										soajs.log.error(err.message);
									} else {
										soajs.log.error(err);
									}
								}
								opts = {
									config: bl.localConfig
								};
								driver.getOrganizations(opts, (err, organizations) => {
									if (err) {
										if (err.message) {
											soajs.log.error(err.message);
										} else {
											soajs.log.error(err);
										}
									}
									modelObj.updateAccount({
										id: soajs.inputmaskData.id,
										metadata: {organizations}
									}, (err) => {
										if (err) {
											if (err.message) {
												soajs.log.error(err.message);
											} else {
												soajs.log.error(err);
											}
										}
										if (update) {
											soajs.log.debug(count, "Repositories Updated Successfully!");
											modelObj.syncRepository({
												ts,
												owner: driver.getOwner()
											}, (err) => {
												if (err) {
													if (err.message) {
														soajs.log.error(err.message);
													} else {
														soajs.log.error(err);
													}
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
								if (err.message) {
									soajs.log.error(err.message);
								} else {
									soajs.log.error(err);
								}
							}
							modelObj.updateAccount({
								id: soajs.inputmaskData.id,
								metadata: {organizations}
							}, (err) => {
								if (err) {
									if (err.message) {
										soajs.log.error(err.message);
									} else {
										soajs.log.error(err);
									}
								}
								if (update) {
									soajs.log.debug(count, "Repositories Updated Successfully!");
									modelObj.syncRepository({
										ts,
										owner: driver.getOwner()
									}, (err) => {
										if (err) {
											if (err.message) {
												soajs.log.error(err.message);
											} else {
												soajs.log.error(err);
											}
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
			tag: catalogInfo.tag,
			config: bl.localConfig
		};
		let response = [];
		let ts = new Date().getTime();
		lib.getSoaJson(driver, data, (err, soa) => {
			if (err) {
				if (err.message === "500") {
					return cb(bl.handleError(soajs, 500, err));
				}
				soa = {
					content: {
						"type": "custom",
						"name": catalogInfo.repo.repository.split("/")[1]
					}
				};
				startProcessing(soa, cb);
			} else if (soa.content.type === "multi") {
				if (soa.content.folders && Array.isArray(soa.content.folders) && soa.content.folders.length > 0) {
					async.eachSeries(soa.content.folders, function (file, callback) {
						let opts = JSON.parse(JSON.stringify(data));
						opts.prefix = file;
						lib.getSoaJson(driver, opts, (err, soa) => {
							if (err) {
								if (err.message === "500") {
									return callback(bl.handleError(soajs, 500, err));
								}
								soa = {
									content: {
										"type": "custom",
										"name": catalogInfo.repo.repository.split("/")[1]
									}
								};
							}
							startProcessing(soa, (err, response) => {
								return callback(null, response);
							});
						});
					}, (err) => {
						return cb(err, response);
					});
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
					tag: catalogInfo.tag,
					config: bl.localConfig,
					sync: !!catalogInfo.sync
				};
				
				async.series({
					validateSoa: function (callback) {
						lib.validateSoa(catalogDriver, data, bl.localConfig, (err) => {
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
					createCatalog: function (callback) {
						catalogDriver.createCatalog(data, catalog, (newCatalog) => {
							catalog = newCatalog;
							return callback();
						});
					},
					updateCatalogMarketPlace: function (callback) {
						lib.updateCatalog(soajs, catalog, (err) => {
							if (err) {
								return callback(bl.handleError(soajs, 605, err));
							}
							return callback();
						});
					},
					updateGitRepo: function (callback) {
						lib.updateGitRepo(data, soajs, models, (err) => {
							if (err) {
								return callback(bl.handleError(soajs, 602, err));
							}
							return callback();
						});
					},
					
				}, (err) => {
					let oneResponse = {
						repository: data.repo.repository,
						status: "active",
						name: data.soa.content.name,
						type: data.soa.content.type,
						swagger: !!data.swagger
					};
					if (soa.error) {
						oneResponse.swagger = soa.error;
					}
					if (err) {
						oneResponse.error = err.message ? err.message : err.msg;
						response.push(oneResponse);
						if (err.message === "Duplicate found") {
							return cb(bl.handleError(soajs, 417, err));
						}
						if (!err.code) {
							return cb(bl.handleError(soajs, 602, err));
						}
						return cb(err);
					}
					if (data.branch) {
						oneResponse.branch = data.branch;
						response.push(oneResponse);
						return cb(null, oneResponse);
					} else if (data.tag) {
						response.push(oneResponse);
						oneResponse.tag = data.tag;
						return cb(null, oneResponse);
					}
				});
			}
		});
	},
	
	"validateSoa": (catalogDriver, data, config, cb) => {
		catalogDriver.checkIfOldSchema(data, () => {
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
	
	"getSoaJson": (driver, data, cb) => {
		getFiles("soa.json", (err, soaJSON) => {
			if (err) {
				getFiles("config.js", (err, config) => {
					if (err) {
						getFiles("soa.js", (err, soa) => {
							if (err) {
								return cb(err);
							} else {
								try {
									config.content = helper.requireFromString(config.content.replace(/require\s*\(.+\)/g, '{}'));
									return cb(null, soa);
								} catch (e) {
									return cb(new Error("500"));
								}
							}
						});
					} else {
						try {
							config.content = helper.requireFromString(config.content.replace(/require\s*\(.+\)/g, '{}'));
							return cb(null, config);
						} catch (e) {
							console.log(e);
							return cb(new Error("500"));
							
						}
					}
				});
			} else {
				try {
					if (typeof soaJSON.content === "string") {
						soaJSON.content = JSON.parse(soaJSON.content);
					}
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
				path = data.prefix + path;
			}
			let opts = {
				path,
				branch: data.branch,
				tag: data.tag,
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
							branch: data.branch ? data.branch : null,
							tag: data.tag ? data.tag : null,
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
							path: data.soa.content.documentation.release,
							branch: data.branch ? data.branch : null,
							tag: data.tag ? data.tag : null,
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
					if (err.message) {
						soajs.log.error(err.message);
					} else {
						soajs.log.error(err);
					}
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
	
	"updateGitRepo": (data, soajs, models, cb) => {
		let opts = {
			"name": data.branch || data.tag,
			"_id": data.repo._id,
			"active": true
		};
		if (data.branch) {
			models.modelObj.updateBranches(opts, (err) => {
				if (err) {
					return cb(err);
				}
				return cb(null, true);
			});
		} else if (data.tag) {
			models.modelObj.updateTags(opts, (err) => {
				if (err) {
					return cb(err);
				}
				return cb(null, true);
			});
		}
		
	},
	
	"getSwagger": (soajs, driver, data, cb) => {
		let opts = {
			path: data.soa.content.swaggerFilename ? data.soa.content.swaggerFilename : "/swagger.yml",
			branch: data.branch ? data.branch : null,
			tag: data.tag ? data.tag : null,
			repository: data.repo.repository,
			config: data.config
		};
		driver.getFile(opts, (err, swagger) => {
			if (err) {
				if (err.message) {
					soajs.log.error(err.message + " - " + opts.path);
				} else {
					soajs.log.error(err);
				}
				return cb(null, true);
			} else {
				helper.parseSwagger(swagger.content, (err, response) => {
					if (err) {
						return cb(err);
					}
					swagger.content = response.content;
					data.swagger = swagger;
					return cb(null, true);
				});
			}
		});
	},
	
	"deleteCatalog_src": (soajs, opts, cb) => {
		soajs.awareness.connect('marketplace', '1', function (res) {
			let options = {
				method: "delete",
				uri: "http://" + res.host + "/items/src",
				headers: res.headers,
				json: true,
				qs: {
					provider: opts.provider,
					owner: opts.owner,
					repo: opts.repo
				}
			};
			request(options, (error, response, body) => {
				if (error) {
					return cb(error);
				}
				helper.computeCatalogRes(body, cb);
			});
		});
	},
	
	"getCatalogs": (soajs, opts, cb) => {
		soajs.awareness.connect('marketplace', '1', function (res) {
			let options = {
				"method": "get",
				uri: "http://" + res.host + "/items/src",
				headers: res.headers,
				json: true,
				qs: {
					provider: opts.provider,
					owner: opts.owner,
					repo: opts.repo
				}
			};
			request(options, (error, response, body) => {
				if (error) {
					return cb(error);
				}
				helper.computeCatalogRes(body, cb);
			});
		});
	},
	
	"updateCatalog": (soajs, opts, cb) => {
		soajs.awareness.connect('marketplace', '1', function (res) {
			let route = "/item/" + opts.soa.type;
			if (opts.soa.type === "service" && opts.soa.subType === "soajs") {
				route = "/item/service/soajs";
			}
			let options = {
				"method": "put",
				uri: "http://" + res.host + route,
				headers: res.headers,
				json: true,
				body: {
					item: opts
				}
			};
			request(options, (error, response, body) => {
				if (error) {
					return cb(error);
				}
				helper.computeCatalogRes(body, cb);
			});
		});
	},
	"updateVersionTag": (soajs, opts, cb) => {
		soajs.awareness.connect('marketplace', '1', function (res) {
			let options = {
				"method": "put",
				uri: "http://" + res.host + "/item/" + "tag",
				headers: res.headers,
				json: true,
				qs: {
					"name": opts.name,
					"type": opts.type,
					"tag": opts.tag
				}
			};
			request(options, (error, response, body) => {
				if (error) {
					return cb(error);
				}
				helper.computeCatalogRes(body, cb);
			});
		});
	},
	"updateVersionBranch": (soajs, opts, cb) => {
		soajs.awareness.connect('marketplace', '1', function (res) {
			let options = {
				"method": "put",
				uri: "http://" + res.host + "/item/" + "branch",
				headers: res.headers,
				json: true,
				qs: {
					"name": opts.name,
					"type": opts.type,
					"branch": opts.branch
				}
			};
			request(options, (error, response, body) => {
				if (error) {
					return cb(error);
				}
				helper.computeCatalogRes(body, cb);
			});
		});
	},

	"update_items_branches": (soajs, opts, cb) => {
		soajs.awareness.connect('marketplace', '1', function (res) {
			let options = {
				"method": "put",
				uri: "http://" + res.host + "/items/" + "branches",
				headers: res.headers,
				json: true,
				qs: {
					"provider": opts.provider,
					"owner": opts.owner,
					"repo": opts.repo,
					"branches": opts.branches
				}
			};
			request(options, (error, response, body) => {
				if (error) {
					return cb(error);
				}
				helper.computeCatalogRes(body, cb);
			});
		});
	}
};


module.exports = lib;