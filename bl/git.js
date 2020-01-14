/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';
const lib = require("../lib/index.js");
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
	
	/**
	 * Get
	 */
	
	"get": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id : inputmaskData.id
		};
		modelObj.getAccount(data, (err, accountRecords) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			return cb(null, accountRecords);
		});
	},
	
	"list": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		
		modelObj.getAccounts((err, accountRecords) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			return cb(null, accountRecords);
		});
	},
	
	"getRepo": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id : inputmaskData.id
		};
		modelObj.getRepository(data, (err, repository) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!repository) {
				return cb(bl.handleError(soajs, 405, err), null);
			}
			return cb(null, repository);
		});
	},
	
	"getBranches": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id : inputmaskData.id
		};
		modelObj.getRepository(data, (err, repository) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!repository) {
				return cb(bl.handleError(soajs, 405, err), null);
			}
			return cb(null, repository.branches ? repository.branches : []);
		});
	},
	
	"search": (soajs, inputmaskData, cb) => {
		return cb(null, true);
	},
	
	/**
	 * Delete
	 */
	
	"logout": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id : inputmaskData.id
		};
		modelObj.getAccount(data, (err, repository) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!repository) {
				return cb(bl.handleError(soajs, 405, err), null);
			}
			async.parallel([
					function(callback) {
						let data = {
							_id : repository._id
						};
						modelObj.deleteAccount(data, callback);
					},
					function(callback) {
						let data = {
							owner : repository.owner
						};
						modelObj.removeRepositories(data, callback);
					}
				],
				function(err) {
					if (err) {
						return cb(bl.handleError(soajs, 602, err), null);
					}
					return cb(null, `Your account ${repository.owner} has been successfully logged out!`);
				});
		});
	},
	
	/**
	 * Post
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
						soajs.inputmaskData.id = final.id.toString();
						lib.handleRepositories(bl, soajs, driver, modelObj, false);
						return cb(null, {
							id: final.id.toString(),
							message: "Repositories are being added..."
						});
					}
				});
			});
		});
	},
	
	/**
	 * Put
	 */
	
	"syncAccount": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id: inputmaskData.id
		};
		
		modelObj.getAccount(data, (err, accountRecord) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err), null);
			}
			if (!accountRecord) {
				return cb(bl.handleError(soajs, 404, null), null);
			}
			let driver = bl.mp.getDriver(accountRecord);
			if (!driver) {
				return cb(bl.handleError(soajs, 603, null), null);
			}
			data = {
				config: bl.localConfig
			};
			soajs.log.info("Updating Repositories");
			lib.handleRepositories(bl, soajs, driver, modelObj, true);
			return cb(null, {
				message: "Repositories are being updated..."
			});
		});
	},
	
	"upgrade": (soajs, inputmaskData, cb) => {
		return cb(null, true);
	},
	
	"activateRepo": (soajs, inputmaskData, cb) => {
		return cb(null, true);
	},
	
	"deactivateRepo": (soajs, inputmaskData, cb) => {
		return cb(null, true);
	},
	
	"activateBranch": (soajs, inputmaskData, cb) => {
		return cb(null, true);
	},
	
	"deactivateBranch": (soajs, inputmaskData, cb) => {
		return cb(null, true);
	},
	
	"syncRepo": (soajs, inputmaskData, cb) => {
		return cb(null, true);
	},
	
	"syncBranch": (soajs, inputmaskData, cb) => {
		return cb(null, true);
	},
};

module.exports = bl;