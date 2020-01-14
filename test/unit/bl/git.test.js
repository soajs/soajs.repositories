/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/git.js');
const assert = require('assert');

describe("Unit test for: BL - Git", () => {
	
	let soajs = {
		config: {
			"errors": {
				400: "Business logic required data are missing",
				
				401: "Username or Token required",
				402: "User account already exists",
				403: "Git Account does not exist",
				404: "Account not found. Login first.",
				405: "Repository not found",
				601: "Model not found",
				602: "Model error: ",
				603: "Provider not found",
			},
			"console": {
				"product": "DSBRD"
			},
		},
		tenant: {
			application: {
				product: "TPROD",
				package: "TPROD_TEST",
			}
		},
		log: {
			error: () => {
				console.log();
			},
			info: () => {
				console.log();
			},
			debug: () => {
				console.log();
			},
		}
	};
	
	describe("Testing login Git Accounts", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - login github", (done) => {
			BL.modelObj = {
				checkIfAccountExists: (nullObject, cb) => {
					return cb(null, 0);
				},
				saveNewAccount: (nullObject, cb) => {
					return cb(null, {id: 1});
				},
				updateRepository: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			BL.drivers = {
				"github": Github
			};
			function Github() {
				this.login = (data, cb)=>{
					return cb(null, {
						owner: "soajs",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						GID: "1111",
						token: "token"
					});
				};
				this.getRepositories = (data, cb)=>{
					return cb(null, {
						pages: 2,
						records: [
							{
								"id": 77149728,
								"node_id": "jkhjk==",
								"name": "soajs.urac.driver",
								"full_name": "soajs/soajs.urac.driver",
								"private": false,
								"owner": {
									"login": "soajs",
									"id": 10834185,
									"type": "Organization",
									"site_admin": false
								},
								"ts": 1576078535254
							}
						]
					});
				};
				this.createRepositoryRecord = ()=>{
					return {
						domain: "github.com",
						repository: "Soajs/soajs.core.drivers",
						name: "soajs.core.drivers",
						provider: "github",
						type: "repository",
						owner: "Soajs",
						ts: 1576078535254.0,
						source: [
							{
								name: "Soajs",
								ts:1576078535254.0
							}
						]
					};
				};
				
				this.getOrganizations = ()=>{
					return ['soajs', 'test'];
				};
			}
			let inputmaskData = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"password": "***"
			};
			soajs.inputmaskData = inputmaskData;
			BL.login(soajs, inputmaskData, (err, response) => {
				assert.deepEqual(response, {
					id: 1,
					message: "Repositories are being added..."
				});
				done();
			});
		});
	});
	
	describe("Testing get account", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "123"
					});
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.get(soajs, inputmaskData, (err, response) => {
				assert.deepEqual(response, {
					_id: "123"
				});
				done();
			});
		});
	});
	
	describe("Testing get accounts", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get accounts", (done) => {
			BL.modelObj = {
				getAccounts: (cb) => {
					return cb(null, [{
						_id: "123"
					}]);
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.list(soajs, inputmaskData, (err, response) => {
				assert.deepEqual(response, [{
					_id: "123"
				}]);
				done();
			});
		});
	});
	
	describe("Testing get getRepo", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get getRepo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "123"
					});
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepo(soajs, inputmaskData, (err, response) => {
				assert.deepEqual(response, {
					_id: "123"
				});
				done();
			});
		});
	});
	
	describe("Testing get getBranches", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get getRepo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "123",
						"branches": []
					});
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getBranches(soajs, inputmaskData, (err, response) => {
				assert.deepEqual(response,  []);
				done();
			});
		});
	});
	
	describe("Testing get search", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get search", (done) => {
			BL.search(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get logout", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
	
		it("Success - get logout", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "123",
						"branches": []
					});
				},
				deleteAccount: (nullObject, cb) => {
					return cb(null, true);
				},
				removeRepositories: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			BL.logout(soajs, inputmaskData, () => {
				done();
			});
		});
	});
	
	describe("Testing get syncAccount", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get syncAccount", (done) => {
			
			function Github() {
				this.login = (data, cb)=>{
					return cb(null, {
						owner: "soajs",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						GID: "1111",
						token: "token"
					});
				};
				this.getRepositories = (data, cb)=>{
					return cb(null, {
						pages: 2,
						records: [
							{
								"id": 77149728,
								"node_id": "jkhjk==",
								"name": "soajs.urac.driver",
								"full_name": "soajs/soajs.urac.driver",
								"private": false,
								"owner": {
									"login": "soajs",
									"id": 10834185,
									"type": "Organization",
									"site_admin": false
								},
								"ts": 1576078535254
							}
						]
					});
				};
				this.createRepositoryRecord = ()=>{
					return {
						domain: "github.com",
						repository: "Soajs/soajs.core.drivers",
						name: "soajs.core.drivers",
						provider: "github",
						type: "repository",
						owner: "Soajs",
						ts: 1576078535254.0,
						source: [
							{
								name: "Soajs",
								ts:1576078535254.0
							}
						]
					};
				};
				
				this.getOrganizations = ()=>{
					return ['soajs', 'test'];
				};
			}
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e1de864a34d5d3b94d10c07",
						owner: "ragheb",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "ragheb",
						type: "account",
						metadata: {
							organizations: [
								"soajs",
								"HerronTech"
							]
						},
						GID: 123,
						token: "123"
					});
				},
				updateRepository: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			let inputmaskData = {
				id: "5e1de864a34d5d3b94d10c07"
			};
			BL.drivers = {
				"github": Github
			};
			BL.syncAccount(soajs, inputmaskData, () => {
				done();
			});
		});
	});
	
	describe("Testing get upgrade", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get upgrade", (done) => {
			BL.upgrade(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get activateRepo", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get activateRepo", (done) => {
			BL.activateRepo(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get deactivateRepo", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get deactivateRepo", (done) => {
			BL.deactivateRepo(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get activateBranch", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get activateBranch", (done) => {
			BL.activateBranch(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get deactivateBranch", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get deactivateBranch", (done) => {
			BL.deactivateBranch(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get syncRepo", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get syncRepo", (done) => {
			BL.syncRepo(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get syncBranch", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get syncBranch", (done) => {
			BL.syncBranch(soajs, {}, () => {
				done();
			});
		});
	});
});