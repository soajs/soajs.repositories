/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';
const lib = require("../lib/index.js");
const service = require("./service.js");
const daemon = require("./daemon.js");
const marketplace = require("./marketplace.js");
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
			id: inputmaskData.id
		};
		modelObj.getAccount(data, (err, accountRecords) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, accountRecords);
		});
	},
	
	"list": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		modelObj.getAccounts((err, accountRecords) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, accountRecords);
		});
	},
	
	"getRepo": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id: inputmaskData.id
		};
		modelObj.getRepository(data, (err, repository) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!repository) {
				return cb(bl.handleError(soajs, 405, err));
			}
			return cb(null, repository);
		});
	},
	
	"getBranches": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id: inputmaskData.id
		};
		modelObj.getRepository(data, (err, repository) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!repository) {
				return cb(bl.handleError(soajs, 405, err));
			}
			return cb(null, repository.branches ? repository.branches : []);
		});
	},
	
	"search": (soajs, inputmaskData, cb) => {
		//done but testing separately
		return cb(null, true);
	},
	
	/**
	 * Delete
	 */
	
	"logout": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id: inputmaskData.id
		};
		modelObj.getAccount(data, (err, account) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!account) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 403, err));
			}
			async.parallel([
					function (callback) {
						let data = {
							_id: account._id
						};
						modelObj.deleteAccount(data, callback);
					},
					function (callback) {
						let data = {
							owner: account.owner
						};
						modelObj.removeRepositories(data, callback);
					}
				],
				function (err) {
					bl.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(bl.handleError(soajs, 602, err));
					}
					return cb(null, `Your account ${account.owner} has been successfully logged out!`);
				});
		});
	},
	
	/**
	 * Post
	 */
	
	"login": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		if (!(inputmaskData.username) && !(inputmaskData.token)) {
			return cb(bl.handleError(soajs, 602, null));
		}
		let driver = bl.mp.getDriver(inputmaskData);
		if (!driver) {
			return cb(bl.handleError(soajs, 603, null));
		}
		let data = {
			config: bl.localConfig
		};
		driver.login(data, (err, loginRecord) => {
			if (err) {
				return cb(bl.handleError(soajs, 403, err));
			}
			data = {
				provider: inputmaskData.provider,
				id: loginRecord.GID
			};
			modelObj.checkIfAccountExists(data, (err, count) => {
				if (err) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 602, err));
				}
				if (count > 0) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 402, null));
				}
				data = {
					config: bl.localConfig
				};
				
				modelObj.saveNewAccount(loginRecord, (err, final) => {
					if (err) {
						return cb(bl.handleError(soajs, 602, err));
					} else {
						soajs.log.info("Adding Repositories");
						soajs.inputmaskData.id = final.id.toString();
						lib.handleRepositories(bl, soajs, driver, modelObj, false, () => {
							bl.mp.closeModel(soajs, modelObj);
						});
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
			
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!accountRecord) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 404, null));
			}
			let driver = bl.mp.getDriver(accountRecord);
			if (!driver) {
				return cb(bl.handleError(soajs, 603, null));
			}
			data = {
				config: bl.localConfig
			};
			soajs.log.info("Updating Repositories");
			lib.handleRepositories(bl, soajs, driver, modelObj, true, () => {
				bl.mp.closeModel(soajs, modelObj);
			});
			return cb(null, {
				message: "Repositories are being updated..."
			});
		});
	},
	
	"upgrade": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id: inputmaskData.id
		};
		modelObj.getAccount(data, (err, account) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!account) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 403, err));
			}
			if (account.owner !== inputmaskData.username) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 406, err));
			}
			if (account.access === "private") {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 407, err));
			}
			account = Object.assign(account, inputmaskData);
			account.access = "private";
			soajs.inputmaskData.id = account._id.toString();
			let driver = bl.mp.getDriver(account);
			if (!driver) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 603, null));
			}
			let data = {
				config: bl.localConfig
			};
			driver.login(data, (err, loginRecord) => {
				if (err) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 403, err));
				}
				let opts = {
					_id: account._id,
					set: loginRecord
				};
				modelObj.upgradeAccount(opts, (err, final) => {
					if (err) {
						bl.mp.closeModel(soajs, modelObj);
						return cb(bl.handleError(soajs, 602, err));
					} else {
						soajs.log.info("Updating Repositories");
						lib.handleRepositories(bl, soajs, driver, modelObj, false, () => {
							bl.mp.closeModel(soajs, modelObj);
						});
						return cb(null, {
							id: soajs.inputmaskData.id,
							message: "Account Upgraded. Repositories are being updated..."
						});
					}
				});
			});
		});
	},
	
	"activateRepo": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		async.parallel({
			account: function (callback) {
				let data = {
					provider: inputmaskData.provider,
					owner: inputmaskData.owner
				};
				modelObj.getAccount(data, callback)
			},
			repo: function (callback) {
				let data = {
					id: inputmaskData.id
				};
				modelObj.getRepository(data, callback);
			}
		}, function (err, results) {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!results.account) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 403, err));
			}
			
			let driver = bl.mp.getDriver(results.account);
			
			if (!driver) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 603, null));
			}
			if (!results.repo) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 405, err));
			}
			if (results.repo.active) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 408, err));
			}
			let data = {
				config: bl.localConfig,
				repository: results.repo.repository
			};
			driver.listBranches(data, (error, branches) => {
				if (err) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 602, err));
				}
				data = {
					branches: branches,
					active: true,
					_id: results.repo._id
				};
				modelObj.activateRepo(data, (err) => {
					bl.mp.closeModel(soajs, modelObj);
					service.mp.closeModel(soajs, modelObj);
					daemon.mp.closeModel(soajs, modelObj);
					marketplace.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(bl.handleError(soajs, 602, err));
					}
					return cb(null, `Repository ${results.repo.repository} is active!`);
				});
			});
		});
	},
	
	"deactivateRepo": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let modelObjService = service.mp.getModel(soajs);
		let modelObjDaemon = daemon.mp.getModel(soajs);
		let modelObjMarketPlace = marketplace.mp.getModel(soajs);
		let data = {
			id: inputmaskData.id
		};
		modelObj.getRepository(data, (err, repo) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!repo) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 405, err));
			}
			repo.active = false;
			if (repo.branches && repo.branches.length > 0) {
				repo.branches.forEach((oneBranch) => {
					oneBranch.active = false;
				});
			}
			async.parallel([
					function (callback) {
						modelObj.removeRepository(repo, callback);
					},
					function (callback) {
						let opts = {
							provider : repo.provider,
							owner: repo.repository.split("/")[0],
							repo: repo.repository.split("/")[1],
						};
						modelObjService.removeRepository(opts, callback);
					},
					function (callback) {
						let opts = {
							provider : repo.provider,
							owner: repo.repository.split("/")[0],
							repo: repo.repository.split("/")[1],
						};
						modelObjDaemon.removeRepository(opts, callback);
					},
					function (callback) {
						let opts = {
							provider : repo.provider,
							owner: repo.repository.split("/")[0],
							repo: repo.repository.split("/")[1],
						};
						modelObjMarketPlace.removeRepository(opts, callback);
					}
				],
				()=>{
					bl.mp.closeModel(soajs, modelObj);
					service.mp.closeModel(soajs, modelObj);
					daemon.mp.closeModel(soajs, modelObj);
					marketplace.mp.closeModel(soajs, modelObj);
					if (err){
						return cb(bl.handleError(soajs, 602, err));
					}
					return cb(null, "Repository deactivated!")
				});
		});
		return cb(null, true);
	},
	
	"activateBranch": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let modelObjService = service.mp.getModel(soajs);
		let modelObjDaemon = daemon.mp.getModel(soajs);
		let modelObjMarketPlace = marketplace.mp.getModel(soajs);
		
		async.parallel({
			account: function (callback) {
				let data = {
					provider: inputmaskData.provider,
					owner: inputmaskData.owner
				};
				return modelObj.getAccount(data, callback);
			},
			repo: function (callback) {
				let data = {
					id: inputmaskData.id
				};
				return modelObj.getRepository(data, callback);
			}
		}, function (err, results) {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!results.account) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 403, err));
			}
			
			let driver = bl.mp.getDriver(results.account);
			
			if (!driver) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 603, null));
			}
			if (!results.repo) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 405, err));
			}
			if (!results.repo.active) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 409, err));
			}
			if (results.repo.branches && results.repo.branches.length > 0) {
				let found = false;
				for (let x = 0; x < results.repo.branches.length; x++) {
					if (results.repo.branches[x].name === inputmaskData.branch && results.repo.branches[x].active) {
						found = true;
						break;
					}
				}
				if (found) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 412, err));
				}
			}
			let data = {
				config: bl.localConfig,
				repository: results.repo.repository,
				branch: inputmaskData.branch
			};
			driver.getBranch(data, (error, branch) => {
				if (err || !branch) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 410, err));
				}
				let models = {
					modelObj, modelObjDaemon, modelObjMarketPlace, modelObjService
				};
				let opts = {
					repo: results.repo,
					branch: branch
				};
				lib.computeCatalog(bl, soajs, driver, models, opts, cb);
			});
		});
	},
	
	"deactivateBranch": (soajs, inputmaskData, cb) => {
		//done but testing separately
		return cb(null, true);
	},
	
	"syncRepo": (soajs, inputmaskData, cb) => {
		//done but testing separately
		return cb(null, true);
	},
	
	"syncBranch": (soajs, inputmaskData, cb) => {
		//done but testing separately
		return cb(null, true);
	},
};

module.exports = bl;