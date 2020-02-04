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
const sinon = require('sinon');
const marketplace = helper.requireModule('bl/marketplace.js');
const lib = helper.requireModule('lib/index.js');

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
				this.login = (data, cb) => {
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
				this.getRepositories = (data, cb) => {
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
				this.createRepositoryRecord = () => {
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
								ts: 1576078535254.0
							}
						]
					};
				};
				
				this.getOrganizations = () => {
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
				assert.deepEqual(response, []);
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
			BL.modelObj = {
				searchRepositories: (nullObject, cb) => {
					return cb(null, [{
						_id: "5e31ca81efc9079372fa662e",
						domain: "github.com",
						repository: "soajs/soajs.oauth",
						name: "soajs.oauth",
						provider: "github",
						type: "repository",
						owner: "soajs",
						ts: 1,
						source: [
							{
								name: "RaghebAD",
								ts: 1580725311684
							}
						]
					}]);
				},
				countSearchRepositories: (nullObject, cb) => {
					return cb(null, 1);
				}
			};
			BL.search(soajs, {}, (err, response) => {
				assert.deepEqual(response, {
					start: 0,
					limit: 100,
					size: 1,
					repositories:
						[{
							_id: '5e31ca81efc9079372fa662e',
							domain: 'github.com',
							repository: 'soajs/soajs.oauth',
							name: 'soajs.oauth',
							provider: 'github',
							type: 'repository',
							owner: 'soajs',
							ts: 1,
							source: [{
								"name": "RaghebAD",
								"ts": 1580725311684
							}]
						}],
					count: 1
				});
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
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "RaghebAD",
						type: "account",
						metadata: {
							organizations: [
								"soajs",
								"HerronTech"
							]
						},
						GID: 1,
						token: "1",
						tokenId: 1
					});
				},
				checkActiveRepositories: (nullObject, cb) => {
					return cb(null, 0);
				},
				deleteAccount: (nullObject, cb) => {
					return cb(null, true);
				},
				removeRepositories: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			
			function Github() {
				this.logout = (data, cb) => {
					return cb(null, true);
				};
			}
			
			BL.drivers = {
				"github": Github
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
				this.login = (data, cb) => {
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
				this.getRepositories = (data, cb) => {
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
				this.createRepositoryRecord = () => {
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
								ts: 1576078535254.0
							}
						]
					};
				};
				
				this.getOrganizations = () => {
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
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						"provider": "github",
						"domain": "github.com",
						"label": "Soajs",
						"username": "soajs",
						"type": "personal",
						"access": "private",
						"token": "***"
					});
				},
				upgradeAccount: (nullObject, cb) => {
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
				this.login = (data, cb) => {
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
				this.getRepositories = (data, cb) => {
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
				this.createRepositoryRecord = () => {
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
								ts: 1576078535254.0
							}
						]
					};
				};
				
				this.getOrganizations = () => {
					return ['soajs', 'test'];
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
			};
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
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "RaghebAD",
						type: "account",
						metadata: {
							organizations: [
								"soajs",
								"HerronTech"
							]
						},
						GID: 234,
						token: "123",
						tokenId: 379529395
					});
				},
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa65a2",
						domain: "github.com",
						repository: "RaghebAD/soajs",
						name: "soajs",
						provider: "github",
						type: "repository",
						owner: "RaghebAD",
						ts: 1580725311684,
						source: [
							{
								name: "RaghebAD",
								ts: 1580725311684
							}
						]
					});
				},
				activateSyncRepo: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listBranches = (data, cb) => {
					return cb(null, [
						{
							name: "master",
						}
					]);
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
			};
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
			BL.modelObj = {
				removeRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "RaghebAD",
						type: "account",
						metadata: {
							organizations: [
								"soajs",
								"HerronTech"
							]
						},
						GID: 234,
						token: "123",
						tokenId: 379529395
					});
				},
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa65a2",
						domain: "github.com",
						repository: "RaghebAD/soajs",
						name: "soajs",
						provider: "github",
						type: "repository",
						owner: "RaghebAD",
						ts: 1580725311684,
						source: [
							{
								name: "RaghebAD",
								ts: 1580725311684
							}
						],
						branches: [{
							name: "master"
						}]
					});
				},
				removeCatalogs: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			soajs.inputmaskData = {
				"id": "master",
			};
			BL.deactivateRepo(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get activateBranch", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
			done();
		});
		
		it("Success - get activateBranch", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "RaghebAD",
						type: "account",
						metadata: {
							organizations: [
								"soajs",
								"HerronTech"
							]
						},
						GID: 234,
						token: "123",
						tokenId: 379529395
					});
				},
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa65a2",
						domain: "github.com",
						repository: "RaghebAD/soajs",
						name: "soajs",
						provider: "github",
						type: "repository",
						owner: "RaghebAD",
						ts: 1580725311684,
						source: [
							{
								name: "RaghebAD",
								ts: 1580725311684
							}
						],
						branches: [{
							name: "master"
						}]
					});
				},
				updateBranches: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, [{
						name: "branch"
					}]);
				};
				this.getFile = (data, cb) => {
					let soa = {
						"serviceName": "scheduler1",
						"serviceGroup": "ECOMP1",
						"servicePort": 111111,
						"serviceVersion": "2.0",
						
						"description": "ECOMP Scheduler API",
						
						"tags": ["scheduler", "ecomp"],
						"attributes": {
							"att1": ["att1.1", "att1.2"],
							"att2": ["att2.1", "att2.2"]
						},
						"program": ["5G"],
						
						"swaggerFilename": "/file01/swagger.json",
						
						"maintenance": {
							"port": {
								"type": "inherit"
							},
							"readiness": "/heartbeat"
						},
						
						"type": "service",
						"prerequisites": {
							"cpu": " ",
							"memory": " "
						},
						
						"requestTimeout": 30,
						"requestTimeoutRenewal": 6,
						
						"extKeyRequired": true,
						"oauth": true,
						"urac": true,
						"urac_Profile": true,
						"urac_ACL": false,
						"provision_ACL": false
					};
					return cb(null, JSON.stringify(soa));
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, true);
			});
			BL.activateBranch(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get deactivateBranch", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
			done();
		});
		
		it("Success - get deactivateBranch", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "RaghebAD",
						type: "account",
						metadata: {
							organizations: [
								"soajs",
								"HerronTech"
							]
						},
						GID: 234,
						token: "123",
						tokenId: 379529395
					});
				},
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa65a2",
						domain: "github.com",
						repository: "RaghebAD/soajs",
						name: "soajs",
						provider: "github",
						type: "repository",
						owner: "RaghebAD",
						ts: 1580725311684,
						source: [
							{
								name: "RaghebAD",
								active: true,
								ts: 1580725311684
							}
						],
						branches: [{
							name: "master"
						}]
					});
				},
				updateBranches: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, [{
						name: "branch"
					}]);
				};
				this.getFile = (data, cb) => {
					let soa = {
						"serviceName": "scheduler1",
						"serviceGroup": "ECOMP1",
						"servicePort": 111111,
						"serviceVersion": "2.0",
						
						"description": "ECOMP Scheduler API",
						
						"tags": ["scheduler", "ecomp"],
						"attributes": {
							"att1": ["att1.1", "att1.2"],
							"att2": ["att2.1", "att2.2"]
						},
						"program": ["5G"],
						
						"swaggerFilename": "/file01/swagger.json",
						
						"maintenance": {
							"port": {
								"type": "inherit"
							},
							"readiness": "/heartbeat"
						},
						
						"type": "service",
						"prerequisites": {
							"cpu": " ",
							"memory": " "
						},
						
						"requestTimeout": 30,
						"requestTimeoutRenewal": 6,
						
						"extKeyRequired": true,
						"oauth": true,
						"urac": true,
						"urac_Profile": true,
						"urac_ACL": false,
						"provision_ACL": false
					};
					return cb(null, JSON.stringify(soa));
				};
			}
			
			sinon.stub(marketplace, 'mp').returns({
				getModel: () => {
					return {
						getCatalogs: (nullObject, cb) => {
							return cb(null, [{
								_id: "5e388405efc9079372fe0b98",
								name: "scheduler",
								type: "service",
								description: "ECOMP Scheduler API",
								configuration: {
									port: 32556,
									group: "ECOMP",
									requestTimeout: 30,
									requestTimeoutRenewal: 6,
									maintenance: {
										port: {
											type: "inherit"
										},
										readiness: "/heartbeat"
									},
									swagger: true
								},
								metadata: {
									description: [
										"scheduler",
										"ecomp"
									],
									attributes: {
										att1: [
											"att1.1",
											"att1.2"
										],
										att2: [
											"att2.1",
											"att2.2"
										]
									},
									program: [
										"5G"
									]
								},
								src: {
									provider: "github",
									owner: "RaghebAD",
									repo: "soajs.test"
								},
								versions: [],
								ts: 1580762253665
							}]);
						},
						updateCatalog: (nullObject, cb) => {
							return cb(null, true);
						}
					};
				},
				closeModel: () => {
					return true;
				}
			});
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
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
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "RaghebAD",
						type: "account",
						metadata: {
							organizations: [
								"soajs",
								"HerronTech"
							]
						},
						GID: 234,
						token: "123",
						tokenId: 379529395
					});
				},
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa65a2",
						domain: "github.com",
						repository: "RaghebAD/soajs",
						name: "soajs",
						provider: "github",
						type: "repository",
						owner: "RaghebAD",
						ts: 1580725311684,
						source: [
							{
								name: "RaghebAD",
								ts: 1580725311684
							}
						]
					});
				},
				activateSyncRepo: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listBranches = (data, cb) => {
					return cb(null, [
						{
							name: "master",
						}
					]);
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
			};
			
			BL.syncRepo(soajs, {}, () => {
				done();
			});
		});
	});
	
	describe("Testing get syncBranch", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
			done();
		});
		
		it("Success - get syncBranch", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "github",
						domain: "github.com",
						label: "RaghebAD",
						type: "account",
						metadata: {
							organizations: [
								"soajs",
								"HerronTech"
							]
						},
						GID: 234,
						token: "123",
						tokenId: 379529395
					});
				},
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa65a2",
						domain: "github.com",
						repository: "RaghebAD/soajs",
						name: "soajs",
						provider: "github",
						type: "repository",
						owner: "RaghebAD",
						ts: 1580725311684,
						source: [
							{
								name: "RaghebAD",
								ts: 1580725311684
							}
						]
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listBranches = (data, cb) => {
					return cb(null, [
						{
							name: "master",
						}
					]);
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, true);
			});
			BL.syncBranch(soajs, {}, () => {
				done();
			});
		});
	});
});