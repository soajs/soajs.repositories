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
const _ = require("lodash");


let bl = {
	"modelObj": null,
	"model": null,
	"soajs_service": null,
	"localConfig": null,
	"drivers": null,
	"handleError": (soajs, errCode, err) => {
		if (err && err.message) {
			soajs.log.error(err.message);
		}
		return ({
			"code": errCode,
			"msg": bl.localConfig.errors[errCode] + ((err && (errCode === 602 || errCode === 604) || errCode === 605) ? err.message : "")
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
			return data.provider && bl.drivers[data.provider] ? new bl.drivers[data.provider](bl.soajs_service, data) : null;
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
	
	"get_by_owner": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			owner: inputmaskData.owner,
			provider: inputmaskData.provider,
			token: inputmaskData.token
		};
		modelObj.getAccount(data, (err, accountRecord) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, accountRecord);
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
	
	"getRepoInfo": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
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
			data = {
				provider: repo.provider
			};
			
			if (!repo.source || repo.source.length === 0) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 409, err));
			}
			data.owner = repo.source[0].name;
			data.token = true;
			modelObj.getAccount(data, (err, accountRecord) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				if (!accountRecord) {
					return cb(bl.handleError(soajs, 404, null));
				}
				let response = {
					domain: repo.domain,
					repository: repo.repository,
					name: repo.name,
					owner: repo.owner,
					provider: repo.provider,
					access: accountRecord.access
				};
				if (accountRecord.token) {
					response.token = accountRecord.token;
				}
				return cb(null, response);
			});
		});
	},
	
	"getRepoFile": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id: inputmaskData.accountId
		};
		data.token = true;
		modelObj.getAccount(data, (err, account) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!account) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 403, err));
			}
			let driver = bl.mp.getDriver(account);
			
			if (!driver) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 603, null));
			}
			data = {
				path: inputmaskData.filepath,
				branch: inputmaskData.branch,
				repository: inputmaskData.repo,
				config: data.config
			};
			driver.getFile(data, (error, fileContent) => {
				bl.mp.closeModel(soajs, modelObj);
				if (error) {
					
					return cb(bl.handleError(soajs, 604, error));
				}
				return cb(null, {
					content: fileContent.content,
					path: inputmaskData.filepath,
					repository: inputmaskData.repo,
				});
			});
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
	
	"getBranch": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			owner: [inputmaskData.owner],
			name: inputmaskData.repo,
			provider: [inputmaskData.provider]
		};
		modelObj.searchRepositories(data, (err, repos) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!repos || repos.length === 0) {
				return cb(bl.handleError(soajs, 405, err));
			}
			let repo = repos[0];
			data = {
				provider: repo.provider
			};
			if (!repo.source || repo.source.length === 0) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 409, err));
			}
			data.owner = repo.source[0].name;
			data.token = true;
			modelObj.getAccount(data, (err, accountRecord) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				if (!accountRecord) {
					return cb(bl.handleError(soajs, 404, null));
				}
				let driver = bl.mp.getDriver(accountRecord);
				if (!driver) {
					return cb(bl.handleError(soajs, 603, null));
				}
				data = {
					config: bl.localConfig,
					repository: repo.repository,
					branch: inputmaskData.branch,
					commit: true
				};
				driver.getBranch(data, (err, branch) => {
					if (err) {
						return cb(bl.handleError(soajs, 410, err));
					}
					branch.repo = {
						id: repo._id.toString()
					};
					return cb(null, branch);
				});
			});
		});
	},
	
	"getTags": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
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
			data = {
				provider: repo.provider
			};
			
			if (!repo.source || repo.source.length === 0) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 409, err));
			}
			data.owner = repo.source[0].name;
			data.token = true;
			modelObj.getAccount(data, (err, accountRecord) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				if (!accountRecord) {
					return cb(bl.handleError(soajs, 404, null));
				}
				let driver = bl.mp.getDriver(accountRecord);
				if (!driver) {
					return cb(bl.handleError(soajs, 603, null));
				}
				data = {
					config: bl.localConfig,
					repository: repo.repository,
					page: inputmaskData.page,
					size: inputmaskData.size,
				};
				driver.listTags(data, (err, tags) => {
					if (err) {
						return cb(bl.handleError(soajs, 403, err));
					}
					return cb(null, {
						tags: tags ? tags : []
					});
				});
			});
		});
	},
	
	"getTag": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
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
			data = {
				provider: repo.provider
			};
			
			if (!repo.source || repo.source.length === 0) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 409, err));
			}
			data.owner = repo.source[0].name;
			data.token = true;
			modelObj.getAccount(data, (err, accountRecord) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				if (!accountRecord) {
					return cb(bl.handleError(soajs, 404, null));
				}
				let driver = bl.mp.getDriver(accountRecord);
				if (!driver) {
					return cb(bl.handleError(soajs, 603, null));
				}
				data = {
					config: bl.localConfig,
					repository: repo.repository,
					tag: inputmaskData.tag
				};
				driver.getTag(data, (err, tag) => {
					if (err || !tag) {
						return cb(bl.handleError(soajs, 416, err));
					}
					return cb(null, tag);
				});
			});
		});
	},
	
	/**
	 * Delete
	 */
	
	"logout": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id: inputmaskData.id
		};
		data.token = true;
		modelObj.getAccount(data, (err, account) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!account) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 403, err));
			}
			account.password = inputmaskData.password;
			let driver = bl.mp.getDriver(account);
			if (!driver) {
				return cb(bl.handleError(soajs, 603, null));
			}
			data = {
				owner: account.owner
			};
			modelObj.checkActiveRepositories(data, (err, count) => {
				if (err) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 602, err));
				}
				if (count > 0) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 413, err));
				}
				async.auto({
						logout: function (callback) {
							let data = {
								config: bl.localConfig
							};
							driver.logout(data, callback);
						},
						deleteAccount: ['logout', function (results, callback) {
							let data = {
								_id: account._id
							};
							modelObj.deleteAccount(data, callback);
						}],
						removeRepositories: ['logout', function (results, callback) {
							let data = {
								owner: account.owner
							};
							modelObj.removeRepositories(data, callback);
						}]
					},
					function (err) {
						bl.mp.closeModel(soajs, modelObj);
						if (err) {
							return cb(bl.handleError(soajs, 602, err));
						}
						return cb(null, `Your account ${account.owner} has been successfully logged out!`);
					});
			});
		});
	},
	
	"deleteRepo": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		let data = {
			id: inputmaskData.id
		};
		modelObj.getRepository(data, (err, repository) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!repository) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 405, err));
			}
			modelObj.deleteRepo(data, (err) => {
				bl.mp.closeModel(soajs, modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, "Repository Deleted!");
			});
		});
	},
	
	"deleteRepositories": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		modelObj.deleteRepositories((err) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, "Leaf Repositories Deleted!");
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
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 604, err));
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
	
	"search": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		async.parallel({
			search: function (callback) {
				modelObj.searchRepositories(inputmaskData, callback);
			},
			count: function (callback) {
				modelObj.countSearchRepositories(inputmaskData, callback);
			}
		}, function (err, results) {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			let response = {
				start: inputmaskData.skip ? inputmaskData.skip : 0,
				limit: inputmaskData.limit ? inputmaskData.limit : 100,
				size: results.search.length,
				repositories: results.search,
				count: results.count
			};
			
			return cb(null, response);
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
		data.token = true;
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
			soajs.log.info("Updating Repositories");
			lib.handleRepositories(bl, soajs, driver, modelObj, accountRecord.repositories ? accountRecord.repositories : {}, () => {
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
		data.token = true;
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
				modelObj.upgradeAccount(opts, (err) => {
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
				data.token = true;
				modelObj.getAccount(data, callback);
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
				if (error) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 602, err));
				}
				data = {
					branches: branches,
					active: true,
					_id: results.repo._id
				};
				modelObj.activateSyncRepo(data, (err) => {
					bl.mp.closeModel(soajs, modelObj);
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
			let activeBranch = false;
			if (repo.branches && repo.branches.length > 0) {
				repo.branches.forEach((oneBranch) => {
					if (oneBranch.active) {
						activeBranch = true;
					}
				});
			}
			if (activeBranch) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 414, err));
			}
			async.parallel([
					function (callback) {
						modelObj.removeRepository(repo, callback);
					},
					function (callback) {
						let opts = {
							provider: repo.provider,
							owner: repo.repository.split("/")[0],
							repo: repo.repository.split("/")[1],
						};
						lib.deleteCatalog_src(soajs, opts, callback);
					}
				],
				(err) => {
					bl.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(bl.handleError(soajs, 602, err));
					}
					return cb(null, "Repository deactivated!");
				});
		});
	},
	
	"activateBranch": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		
		async.parallel({
			account: function (callback) {
				let data = {
					provider: inputmaskData.provider,
					owner: inputmaskData.owner
				};
				data.token = true;
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
					modelObj
				};
				let opts = {
					repo: results.repo,
					branch: branch
				};
				lib.computeCatalog(bl, soajs, driver, models, opts, (err, response) => {
					bl.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(err);
					}
					return cb(null, response);
				});
			});
		});
	},
	
	"activateTag": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		
		async.parallel({
			account: function (callback) {
				let data = {
					provider: inputmaskData.provider,
					owner: inputmaskData.owner
				};
				data.token = true;
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
			if (results.repo.tags && results.repo.tags.length > 0) {
				let found = false;
				for (let x = 0; x < results.repo.tags.length; x++) {
					if (results.repo.tags[x].name === inputmaskData.tag && results.repo.tags[x].active) {
						found = true;
						break;
					}
				}
				if (found) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 418, err));
				}
			}
			let data = {
				config: bl.localConfig,
				repository: results.repo.repository,
				tag: inputmaskData.tag
			};
			driver.getTag(data, (err, tag) => {
				if (err || !tag) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 416, err));
				}
				let models = {
					modelObj
				};
				let opts = {
					repo: results.repo,
					tag: tag.name
				};
				lib.computeCatalog(bl, soajs, driver, models, opts, (err, response) => {
					bl.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(err);
					}
					return cb(null, response);
				});
			});
		});
	},
	
	"deactivateTag": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		async.parallel({
				account: function (callback) {
					let data = {
						provider: inputmaskData.provider,
						owner: inputmaskData.owner
					};
					data.token = true;
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
				if (results.repo.tags && results.repo.tags.length > 0) {
					let found = false;
					for (let x = 0; x < results.repo.tags.length; x++) {
						if (results.repo.tags[x].name === inputmaskData.tag && results.repo.tags[x].active) {
							found = true;
							break;
						}
					}
					if (!found) {
						bl.mp.closeModel(soajs, modelObj);
						return cb(bl.handleError(soajs, 416, err));
					}
				}
				let opts = {
					provider: results.repo.provider,
					owner: results.repo.owner,
					repo: results.repo.name
				};
				lib.getCatalogs(soajs, opts, (error, multiRepo) => {
					if (error) {
						return cb(bl.handleError(soajs, 605, error));
					}
					async.each(multiRepo, function (catalog, callback) {
						let opts = {
							"name": catalog.name,
							"type": catalog.type,
							"tag": inputmaskData.tag
						};
						lib.updateVersionTag(soajs, opts, callback);
					}, function (error) {
						if (error) {
							bl.mp.closeModel(soajs, modelObj);
							return cb(bl.handleError(soajs, 605, error));
						}
						let opts = {
							name: inputmaskData.tag,
							_id: results.repo._id,
							active: false
						};
						modelObj.updateTags(opts, (err) => {
							bl.mp.closeModel(soajs, modelObj);
							if (err) {
								return cb(bl.handleError(soajs, 602, err));
							}
							return cb(null, `Tag ${inputmaskData.tag} deactivated!`);
						});
					});
				});
			}
		);
	},
	
	"deactivateBranch": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		async.parallel({
				account: function (callback) {
					let data = {
						provider: inputmaskData.provider,
						owner: inputmaskData.owner
					};
					data.token = true;
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
					if (!found) {
						bl.mp.closeModel(soajs, modelObj);
						return cb(bl.handleError(soajs, 410, err));
					}
				}
				let opts = {
					provider: results.repo.provider,
					owner: results.repo.owner,
					repo: results.repo.name
				};
				lib.getCatalogs(soajs, opts, (error, multiRepo) => {
					if (error) {
						return cb(bl.handleError(soajs, 605, error));
					}
					async.each(multiRepo, function (catalog, callback) {
						let opts = {
							"name": catalog.name,
							"type": catalog.type,
							"branch": inputmaskData.branch
						};
						lib.updateVersionBranch(soajs, opts, callback);
					}, function (error) {
						if (error) {
							bl.mp.closeModel(soajs, modelObj);
							return cb(bl.handleError(soajs, 605, error));
						}
						let opts = {
							name: inputmaskData.branch,
							_id: results.repo._id,
							active: false
						};
						modelObj.updateBranches(opts, (err) => {
							bl.mp.closeModel(soajs, modelObj);
							if (err) {
								return cb(bl.handleError(soajs, 602, err));
							}
							return cb(null, `Branch ${inputmaskData.branch} deactivated!`);
						});
					});
				});
			}
		);
	},
	
	"syncRepo": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		async.parallel({
			account: function (callback) {
				let data = {
					provider: inputmaskData.provider,
					owner: inputmaskData.owner
				};
				data.token = true;
				modelObj.getAccount(data, callback);
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
			if (!results.repo.active) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 409, err));
			}
			let data = {
				config: bl.localConfig,
				repository: results.repo.repository
			};
			driver.listBranches(data, (error, branches) => {
				if (error) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 602, error));
				}
				data = {
					_id: results.repo._id
				};
				if (results.repo.branches) {
					let intersect = _.intersectionBy(results.repo.branches, branches, "name");
					data.branches = _.unionBy(intersect, branches, "name");
				} else {
					data.branches = branches;
				}
				modelObj.activateSyncRepo(data, (err) => {
					bl.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(bl.handleError(soajs, 602, err));
					}
					return cb(null, `Repository ${results.repo.repository} is synchronized!`);
				});
			});
		});
	},
	
	"syncBranch": (soajs, inputmaskData, cb) => {
		let modelObj = bl.mp.getModel(soajs);
		
		async.parallel({
			account: function (callback) {
				let data = {
					provider: inputmaskData.provider,
					owner: inputmaskData.owner
				};
				data.token = true;
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
				if (!found) {
					bl.mp.closeModel(soajs, modelObj);
					return cb(bl.handleError(soajs, 415, err));
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
					modelObj
				};
				let opts = {
					repo: results.repo,
					branch: branch,
					sync: true
				};
				lib.computeCatalog(bl, soajs, driver, models, opts, cb);
			});
		});
	},
};

module.exports = bl;