/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

let bl = {
	"modelObj": null,
	"model": null,
	"soajs_service": null,
	"localConfig": null,
	
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
		"getDriver": (data, driver) => {
			return new driver(bl.soajs_service, data);
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
	"login": (soajs, inputmaskData, driverFile, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		if (!(inputmaskData.username) && !(inputmaskData.token)) {
			return cb(bl.handleError(soajs, 602, null), null);
		}
		let driver = bl.mp.getDriver(inputmaskData, driverFile);
		let data = {
			config: bl.localConfig
		};
		driver.validate(data, (err, response) => {
			if (err) {
				return cb(bl.handleError(soajs, 403, err), null);
			}
			data = {
				provider: inputmaskData.provider,
				id: response.id
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
				let opts = {
					mongo: modelObj,
					config: bl.localConfig
				};
				if (inputmaskData.access === 'public') {
					modelObj.saveNewAccount(driver.createAccountRecord(response), (err, final) => {
						if (err) {
							return cb(bl.handleError(soajs, 602, err), null);
						} else {
							driver.extractRepos(opts);
							soajs.log.info("Adding Repositories");
							return cb(null, {
								id: final.id.toString(),
								message: "Repositories are being added..."
							});
						}
						
					});
				} else {
					driver.createAuthToken(data, (err, token) => {
						if (err) {
							return cb(bl.handleError(soajs, 403, err), null);
						}
					
						modelObj.saveNewAccount(driver.createAccountRecord(token), (err, final) => {
							if (err) {
								return cb(bl.handleError(soajs, 602, err), null);
							}
							driver.extractRepos(opts);
							soajs.log.info("Adding Repositories");
							return cb(null, {
								id: final.id.toString(),
								message: "Repositories are being added..."
							});
						});
					});
				}
			});
		});
	},
	
};

module.exports = bl;