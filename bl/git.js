/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';
const async = require("async");

let bl = {
	"modelObj": null,
	"model": null,
	"soajs_service": null,
	"localConfig": null,
	"drivers": null,
	"handleError": (soajs, errCode, err) => {
		if (err) {
			soajs.log.error(err);
		}
		return ({
			"code": errCode,
			"msg": bl.localConfig.errors[errCode] + ((err && errCode === 602) ? err.message : "")
		});
	},
	
	"mp": {
		"getModel": (soajs) => {
			let modelObj = bl.modelObj;
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				let options = {
					"dbConfig": soajs.tenant.dbConfig,
					"index": soajs.tenant.id
				};
				modelObj = new bl.model(bl.soajs_service, options, null);
			}
			return modelObj;
		},
		"getDriver": (data) => {
			return new bl.drivers[data.provider](bl.soajs_service, data);
		},
		"closeModel": (soajs, modelObj) => {
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				modelObj.closeConnection();
			}
		}
	},
	
	/**
	 * Git
	 */
	"login": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		if (!(inputmaskData.username) && !(inputmaskData.token)) {
			return cb(bl.handleError(soajs, 602, null), null);
		}
		let driver = bl.mp.getDriver(inputmaskData);
		if (!driver) {
			return cb(bl.handleError(soajs, 603, null), null);
		}
		let data = {
			config: bl.localConfig
		};
		let ts = new Date().getTime();
		driver.login(data, (err, loginRecord) => {
			if (err) {
				return cb(bl.handleError(soajs, 403, err), null);
			}
			data = {
				provider: inputmaskData.provider,
				id: loginRecord.GID
			};
			modelObj.checkIfAccountExists(data, (err, count) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err), null);
				}
				if (count > 0) {
					return cb(bl.handleError(soajs, 402, null), null);
				}
				data = {
					config: bl.localConfig
				};
				
				modelObj.saveNewAccount(loginRecord, (err, final) => {
					if (err) {
						return cb(bl.handleError(soajs, 602, err), null);
					} else {
						soajs.log.info("Adding Repositories");
						handleRepositories();
						return cb(null, {
							id: final.id.toString(),
							message: "Repositories are being added..."
						});
					}
				});
			});
		});
		
		function handleRepositories() {
			let opts = {
				config: bl.localConfig
			};
			driver.getRepositories(opts, (err, firstSet) => {
				if (err) {
					soajs.log.error(err);
				}
				console.log(firstSet)
				let count = 0;
				if (firstSet && firstSet.records && firstSet.records.length > 0) {
					async.each(firstSet.records, (oneRecord, call) => {
						count++;
						oneRecord.ts = ts;
						let finalRecord = driver.createRepositoryRecord(oneRecord);
						modelObj.updateRepository(finalRecord, call);
					}, (err) => {
						if (err) {
							soajs.log.error(err);
						}
						let pages = firstSet.pages;
						if (pages > 1) {
							async.timesSeries(pages - 1, function (n, next) {
								//skip the first page
								opts = {
									config: bl.localConfig
								};
								driver.getRepositories(opts, function (err, sets) {
									if (err) {
										return next(err);
									}
									if (sets && sets.records && sets.records.length > 0) {
										async.each(sets.records, (oneRecord, call) => {
											count++;
											oneRecord.ts = ts;
											let finalRecord = driver.createRepositoryRecord(oneRecord);
											modelObj.updateRepository(finalRecord, call);
										}, (err) => {
											soajs.log.debug(count, "Repositories Added So Far... ");
											return next(err);
										});
									} else {
										return next();
									}
								});
							}, function (err) {
								if (err) {
									soajs.log.error(err);
								}
								soajs.log.info(count, "Repositories Added Successfully!");
							});
						} else {
							soajs.log.debug(count, "Repositories Added Successfully!");
						}
					});
				}
			});
		}
	},
	
};

module.exports = bl;