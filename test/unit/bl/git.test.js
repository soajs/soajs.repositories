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
				assert.deepStrictEqual(response, {
					_id: "123"
				});
				done();
			});
		});
		
		it("fail - get account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("Dummy hour"));
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.get(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing get account by owner", () => {
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
				owner: "ragheb",
				provider:"github",
				token:  "!23"
			};
			soajs.inputmaskData = inputmaskData;
			BL.get_by_owner(soajs, inputmaskData, (err, response) => {
				assert.deepStrictEqual(response, {
					_id: "123"
				});
				done();
			});
		});
		
		it("fail - get account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("Dummy hour"));
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.get_by_owner(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
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
				assert.deepStrictEqual(response, [{
					_id: "123"
				}]);
				done();
			});
		});
		it("fail - get accounts", (done) => {
			BL.modelObj = {
				getAccounts: (cb) => {
					return cb(new Error("Dummy hour"));
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.list(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing get getRepoInfo", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get getRepoInfo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "123",
						domain: "github.com",
						repository: "soajs/soajs.urac",
						name: "soajs.urac",
						owner: "soajs",
						provider: "github",
						source: [
							{
								name: "soajs",
								ts: 1593472712313
							},
						],
						ts: 594916911310,
						type: "repository"
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoInfo(soajs, inputmaskData, (err, response) => {
				assert.deepStrictEqual(response, {
					"domain": "github.com",
					"repository": "soajs/soajs.urac",
					"name": "soajs.urac",
					"owner": "soajs",
					"provider": "github",
					"access": "public",
					"token": "1234op"
				});
				done();
			});
		});
		
		it("fail - get getRepoInfo - err", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(new Error("Dummy hour"));
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoInfo(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get getRepoInfo - repo not found", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoInfo(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - get getRepoInfo - no source", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "123",
						domain: "github.com",
						repository: "soajs/soajs.urac",
						name: "soajs.urac",
						owner: "soajs",
						provider: "github",
						source: [
						
						],
						ts: 594916911310,
						type: "repository"
					});
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoInfo(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - get getRepoInfo - err no account", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "123",
						domain: "github.com",
						repository: "soajs/soajs.urac",
						name: "soajs.urac",
						owner: "soajs",
						provider: "github",
						source: [
							{
								name: "soajs",
								ts: 1593472712313
							},
						],
						ts: 594916911310,
						type: "repository"
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoInfo(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 404);
				done();
			});
		});
		
		it("fail - get getRepoInfo - err getting account", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "123",
						domain: "github.com",
						repository: "soajs/soajs.urac",
						name: "soajs.urac",
						owner: "soajs",
						provider: "github",
						source: [
							{
								name: "soajs",
								ts: 1593472712313
							},
						],
						ts: 594916911310,
						type: "repository"
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(new Error("Dummy error"));
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoInfo(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
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
				assert.deepStrictEqual(response, {
					_id: "123"
				});
				done();
			});
		});
		
		it("fail - get getRepo - err", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(new Error("Dummy hour"));
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepo(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get getRepo - repo not found", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepo(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 405);
				done();
			});
		});
	});
	
	describe("Testing get getRepoFile", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get getRepoFile", (done) => {
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
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getFile = (data, cb) => {
					return cb(null, {
						content: JSON.stringify({data: "test"})
					});
				};
			}
			
			let inputmaskData = {
				"accountId": "5e37f43f9248dc603616f7e7",
				"repo": "RaghebAd/soajs.test",
				"filepath": "soa.json",
				"branch": "master"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoFile(soajs, inputmaskData, (err, response) => {
				assert.deepStrictEqual(response, {
					"content": JSON.stringify({data: "test"}),
					"path": "soa.json",
					"repository": "RaghebAd/soajs.test"
				});
				done();
			});
		});
		it("fail - get getRepoFile", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("Dummy Error"));
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getFile = (data, cb) => {
					return cb(null, {
						content: JSON.stringify({data: "test"})
					});
				};
			}
			
			let inputmaskData = {
				"accountId": "5e37f43f9248dc603616f7e7",
				"repo": "RaghebAd/soajs.test",
				"filepath": "soa.json",
				"branch": "master"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoFile(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get getRepoFile no account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getFile = (data, cb) => {
					return cb(null, {
						content: JSON.stringify({data: "test"})
					});
				};
			}
			
			let inputmaskData = {
				"accountId": "5e37f43f9248dc603616f7e7",
				"repo": "RaghebAd/soajs.test",
				"filepath": "soa.json",
				"branch": "master"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoFile(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 403);
				done();
			});
		});
		it("fail - get getRepoFile no account", (done) => {
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
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getFile = (data, cb) => {
					return cb(new Error("dummy error"));
				};
			}
			
			let inputmaskData = {
				"accountId": "5e37f43f9248dc603616f7e7",
				"repo": "RaghebAd/soajs.test",
				"filepath": "soa.json",
				"branch": "master"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoFile(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 604);
				done();
			});
		});
		
		it("fail - get getRepoFile wrong provider", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "githubs",
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
				}
			};
			BL.drivers = {
				"github": Github
			};
			function Github() {
				this.getFile = (data, cb) => {
					return cb(null, {
						content: JSON.stringify({data: "test"})
					});
				};
			}
			let inputmaskData = {
				"accountId": "5e37f43f9248dc603616f7e7",
				"repo": "RaghebAd/soajs.test",
				"filepath": "soa.json",
				"branch": "master"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getRepoFile(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 603);
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
				assert.deepStrictEqual(response, []);
				done();
			});
		});
		
		it("fail - get getRepo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(new Error("dummy error"));
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getBranches(soajs, inputmaskData, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Success - get getRepo no repo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			let inputmaskData = {
				"id": "123"
			};
			soajs.inputmaskData = inputmaskData;
			BL.getBranches(soajs, inputmaskData, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing get getBranch", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get getBranch", (done) => {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					}]);
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						"name" : "master"
					});
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getBranch(soajs, inputmaskData, (err, response) => {
				assert.deepStrictEqual(response, {
					"name" : "master",
					"repo": {
						id: "5e31ca81efc9079372fa662e"
					}
				});
				done();
			});
		});
		
		it("fail - searchRepositories error ", (done) => {
			BL.modelObj = {
				searchRepositories: (nullObject, cb) => {
					return cb(new Error("dummy error"));
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						"name" : "master"
					});
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getBranch(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - searchRepositories no repo", (done) => {
			BL.modelObj = {
				searchRepositories: (nullObject, cb) => {
					return cb(null, null);
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						"name" : "master"
					});
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getBranch(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - no source", (done) => {
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
						
						]
					}]);
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						"name" : "master"
					});
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getBranch(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - getAccount error", (done) => {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					}]);
				},
				getAccount: (nullObject, cb) => {
					return cb(new Error("new error"));
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						"name" : "master"
					});
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getBranch(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - getAccount no account", (done) => {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					}]);
				},
				getAccount: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						"name" : "master"
					});
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getBranch(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 404);
				done();
			});
		});
		
		it("fail - provider not found", (done) => {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					}]);
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "githubs",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						"name" : "master"
					});
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getBranch(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - error in get branch", (done) => {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					}]);
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(new Error("dummy error"));
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getBranch(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 410);
				done();
			});
		});
	});
	
	describe("Testing get getTags", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get getTags", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listTags = (data, cb) => {
					return cb(null, [{
						"name" : "1.0.1"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTags(soajs, inputmaskData, (err, response) => {
				assert.deepStrictEqual(response, {
					"tags": [{
						"name" : "1.0.1"
					}]
				});
				done();
			});
		});
		
		it("fail - getRepository error ", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(new Error("dummy error"));
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listTags = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTags(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - getRepository no repo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, null);
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listTags = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTags(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - no source", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa662e",
						domain: "github.com",
						repository: "soajs/soajs.oauth",
						name: "soajs.oauth",
						provider: "github",
						type: "repository",
						owner: "soajs",
						ts: 1,
						source: [
						
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listTags = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTags(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - getAccount error", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(new Error("new error"));
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listTags = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTags(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - getAccount no account", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listTags = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTags(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 404);
				done();
			});
		});
		
		it("fail - provider not found", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "githubs",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listTags = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTags(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - error in get branch", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.listTags = (data, cb) => {
					return cb(new Error("dummy error"));
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTags(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 403);
				done();
			});
		});
	});
	
	describe("Testing get getTag", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - get getTag", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getTag = (data, cb) => {
					return cb(null, {
						"name" : "1.0.1"
					});
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTag(soajs, inputmaskData, (err, response) => {
				assert.deepStrictEqual(response, {
					"name" : "1.0.1"
				});
				done();
			});
		});
		
		it("fail - getRepository error ", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(new Error("dummy error"));
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getTag = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTag(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - getRepository no repo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, null);
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getTag = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTag(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - no source", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa662e",
						domain: "github.com",
						repository: "soajs/soajs.oauth",
						name: "soajs.oauth",
						provider: "github",
						type: "repository",
						owner: "soajs",
						ts: 1,
						source: [
						
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getTag = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTag(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - getAccount error", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(new Error("new error"));
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getTag = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTag(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - getAccount no account", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, null);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getTag = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTag(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 404);
				done();
			});
		});
		
		it("fail - provider not found", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "githubs",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getTag = (data, cb) => {
					return cb(null, [{
						"name" : "master"
					}]);
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTag(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - error in get branch", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
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
								name: "soajs",
								ts: 1580725311684
							}
						]
					});
				},
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "12312",
						owner: "soajs",
						accountType: "personal",
						access: "public",
						provider: "github",
						domain: "github.com",
						label: "Soajs",
						type: "account",
						metadata: {
							organizations: [
							]
						},
						token: "1234op",
						GID: 123345
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getTag = (data, cb) => {
					return cb(new Error("dummy error"));
				};
			}
			let inputmaskData = {
				"id": "5e31ca81efc9079372fa662e"
			};
			BL.getTag(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 416);
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
				"id": "123",
				"on2fa": 123
			};
			BL.logout(soajs, inputmaskData, (err, res) => {
				assert.deepStrictEqual(res, `Your account RaghebAD has been successfully logged out!`);
				done();
			});
		});
		
		it("fail - get logout - model error 1", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy error"));
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
				"id": "123",
				"on2fa": 123
			};
			BL.logout(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get logout - model error 2", (done) => {
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
					return cb(new Error("dummy error"));
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
				"id": "123",
				"on2fa": 123
			};
			BL.logout(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get logout - count not zero", (done) => {
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
					return cb(null, 1);
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
				"id": "123",
				"on2fa": 123
			};
			BL.logout(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 413);
				done();
			});
		});
		
		it("fail - get logout - no account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
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
				"id": "123",
			};
			BL.logout(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - no driver", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "githubs",
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
				"id": "123",
				"on2fa": 123
			};
			BL.logout(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - error logout", (done) => {
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
					return cb(new Error("test"), true);
				};
			}
			
			BL.drivers = {
				"github": Github
			};
			
			let inputmaskData = {
				"id": "123",
				"on2fa": 123
			};
			BL.logout(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing delete deleteRepo", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - delete deleteRepo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa662e",
						domain: "github.com",
						repository: "soajs/soajs.oauth",
						name: "soajs.oauth",
						provider: "github",
						type: "repository",
						owner: "soajs",
						ts: 1,
						source: [
						
						]
					});
				},
				deleteRepo: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			BL.deleteRepo(soajs, {}, (err, response) => {
				assert.deepStrictEqual(response, "Repository Deleted!");
				done();
			});
		});
		
		it("fail - delete deleteRepo error", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(new Error("dummy"), null);
				},
				deleteRepo: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			BL.deleteRepo(soajs, {}, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - delete deleteRepo no repo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, null);
				},
				deleteRepo: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			BL.deleteRepo(soajs, {}, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - deleteRepo", (done) => {
			BL.modelObj = {
				getRepository: (nullObject, cb) => {
					return cb(null, {
						_id: "5e31ca81efc9079372fa662e",
						domain: "github.com",
						repository: "soajs/soajs.oauth",
						name: "soajs.oauth",
						provider: "github",
						type: "repository",
						owner: "soajs",
						ts: 1,
						source: [
						
						]
					});
				},
				deleteRepo: (nullObject, cb) => {
					return cb(new Error("dummy"), true);
				}
			};
			BL.deleteRepo(soajs, {}, (err) => {
				assert.ok(err);
				assert.deepEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing delete deleteRepositories", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			done();
		});
		
		it("Success - delete deleteRepositories", (done) => {
			BL.modelObj = {
				deleteRepositories: (cb) => {
					return cb(null, true);
				}
			};
			BL.deleteRepositories(soajs, {}, (err, response) => {
				assert.deepStrictEqual(response, "Leaf Repositories Deleted!");
				done();
			});
		});
		it("fail - delete deleteRepositories error", (done) => {
			BL.modelObj = {
				deleteRepositories: (cb) => {
					return cb(new Error("dummy"), true);
				}
			};
			BL.deleteRepositories(soajs, {}, (err) => {
				assert.ok(err);
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing login Git Accounts", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
			done();
		});
		
		it("Success - login github", (done) => {
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
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
				"token": "***"
			};
			soajs.inputmaskData = inputmaskData;
			BL.login(soajs, inputmaskData, (err, response) => {
				assert.deepStrictEqual(response, {
					id: "1",
					message: "Repositories are being added..."
				});
				done();
			});
		});
		
		it("fail - login no username", (done) => {
			let inputmaskData = {};
			BL.login(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - no driver error", (done) => {
			let inputmaskData = {
				"provider": "githubs",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"token": "***"
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
			BL.login(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - login error", (done) => {
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
					return cb(new Error("error"));
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
				"token": "***"
			};
			soajs.inputmaskData = inputmaskData;
			BL.login(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 604);
				done();
			});
		});
		
		it("fail - login checkIfAccountExists error", (done) => {
			BL.modelObj = {
				checkIfAccountExists: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
				"token": "***"
			};
			soajs.inputmaskData = inputmaskData;
			BL.login(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - account exist ", (done) => {
			BL.modelObj = {
				checkIfAccountExists: (nullObject, cb) => {
					return cb(null, 1);
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
				"token": "***"
			};
			soajs.inputmaskData = inputmaskData;
			BL.login(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 402);
				done();
			});
		});
		
		it("fail - saveNewAccount error", (done) => {
			BL.modelObj = {
				checkIfAccountExists: (nullObject, cb) => {
					return cb(null, 0);
				},
				saveNewAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
				"token": "***"
			};
			soajs.inputmaskData = inputmaskData;
			BL.login(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 602);
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
				assert.deepStrictEqual(response, {
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
		
		it("fail - error search", (done) => {
			BL.modelObj = {
				searchRepositories: (nullObject, cb) => {
					return cb(new Error("dummy"));
				},
				countSearchRepositories: (nullObject, cb) => {
					return cb(null, 1);
				}
			};
			BL.search(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing get syncAccount", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
			done();
		});
		
		it("Success - get syncAccount", (done) => {
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
			function Github() {
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
		
		it("fail - error syncAccount", (done) => {
			
			function Github() {
				this.getOrganizations = () => {
					return ['soajs', 'test'];
				};
			}
			
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
			BL.syncAccount(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - no account", (done) => {
			
			function Github() {
				this.getOrganizations = () => {
					return ['soajs', 'test'];
				};
			}
			
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
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
			BL.syncAccount(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 404);
				done();
			});
		});
		
		it("fail - driver no found", (done) => {
			
			function Github() {
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
						provider: "githubs",
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
			BL.syncAccount(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
	});
	
	describe("Testing get upgrade", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
			done();
		});
		
		it("Success - get upgrade", (done) => {
			
			function Github() {
				this.login = (data, cb) => {
					return cb(null, {
						owner: "soajs",
						accountType: "personal",
						access: "public",
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
			}
			
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e1de864a34d5d3b94d10c07",
						owner: "ragheb",
						accountType: "personal",
						access: "public",
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
					});
				},
				upgradeAccount: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			let inputmaskData = {
				id: "5e1de864a34d5d3b94d10c07",
				username: "ragheb",
				token: "password",
			};
			BL.drivers = {
				"github": Github
			};
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
			BL.upgrade(soajs, inputmaskData, (err, res) => {
				assert.deepStrictEqual(res, {
					id : "5e1de864a34d5d3b94d10c07",
					message: "Account Upgraded. Repositories are being updated..."
				});
				done();
			});
		});
		
		it("fail - get upgrade public", (done) => {
			
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
					});
				},
				upgradeAccount: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			let inputmaskData = {
				id: "5e1de864a34d5d3b94d10c07",
				username: "ragheb",
				token: "password",
			};
			BL.drivers = {
				"github": Github
			};
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
			BL.upgrade(soajs, inputmaskData, (err) => {
				assert.ok(err);
				assert.deepStrictEqual(err.code, 407);
				done();
			});
		});
		
		it("fail - getAccount error", (done) => {
			
			function Github() {
				this.login = (data, cb) => {
					return cb(null, {
						owner: "soajs",
						accountType: "personal",
						access: "public",
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
			}
			
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
				},
				upgradeAccount: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			let inputmaskData = {
				id: "5e1de864a34d5d3b94d10c07",
				username: "ragheb",
				token: "password",
			};
			BL.drivers = {
				"github": Github
			};
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
			BL.upgrade(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - getAccount no account", (done) => {
			
			function Github() {
				this.login = (data, cb) => {
					return cb(null, {
						owner: "soajs",
						accountType: "personal",
						access: "public",
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
			}
			
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
				},
				upgradeAccount: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			let inputmaskData = {
				id: "5e1de864a34d5d3b94d10c07",
				username: "ragheb",
				token: "password",
			};
			BL.drivers = {
				"github": Github
			};
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
			BL.upgrade(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - getAccount different owner", (done) => {
			
			function Github() {
				this.login = (data, cb) => {
					return cb(null, {
						owner: "soajs",
						accountType: "personal",
						access: "public",
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
			}
			
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e1de864a34d5d3b94d10c07",
						owner: "ragheb",
						accountType: "personal",
						access: "public",
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
					});
				},
				upgradeAccount: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			let inputmaskData = {
				id: "5e1de864a34d5d3b94d10c07",
				username: "antoine",
				token: "password",
			};
			BL.drivers = {
				"github": Github
			};
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
			BL.upgrade(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 406);
				done();
			});
		});
		
		it("fail - no driver", (done) => {
			
			function Github() {
				this.login = (data, cb) => {
					return cb(null, {
						owner: "soajs",
						accountType: "personal",
						access: "public",
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
			}
			
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e1de864a34d5d3b94d10c07",
						owner: "ragheb",
						accountType: "personal",
						access: "public",
						provider: "githubs",
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
					});
				},
				upgradeAccount: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			let inputmaskData = {
				id: "5e1de864a34d5d3b94d10c07",
				username: "ragheb",
				token: "password",
			};
			BL.drivers = {
				"github": Github
			};
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
			BL.upgrade(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - bad login ", (done) => {
			
			function Github() {
				this.login = (data, cb) => {
					return cb(new Error("dummy"));
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
			}
			
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e1de864a34d5d3b94d10c07",
						owner: "ragheb",
						accountType: "personal",
						access: "public",
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
					});
				},
				upgradeAccount: (nullObject, cb) => {
					return cb(null, {});
				}
			};
			let inputmaskData = {
				id: "5e1de864a34d5d3b94d10c07",
				username: "ragheb",
				token: "password",
			};
			BL.drivers = {
				"github": Github
			};
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
			BL.upgrade(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - err upgradeAccount", (done) => {
			
			function Github() {
				this.login = (data, cb) => {
					return cb(null, {
						owner: "soajs",
						accountType: "personal",
						access: "public",
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
			}
			
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e1de864a34d5d3b94d10c07",
						owner: "ragheb",
						accountType: "personal",
						access: "public",
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
					});
				},
				upgradeAccount: (nullObject, cb) => {
					return cb(new Error("duumy"));
				}
			};
			let inputmaskData = {
				id: "5e1de864a34d5d3b94d10c07",
				username: "ragheb",
				token: "password",
			};
			BL.drivers = {
				"github": Github
			};
			sinon.stub(lib, 'handleRepositories').callsFake(function fakeFn() {
				return true;
			});
			BL.upgrade(soajs, inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 602);
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
			BL.activateRepo(soajs, {}, (err, res) => {
				assert.deepStrictEqual(res, `Repository RaghebAD/soajs is active!`);
				done();
			});
		});
		
		it("fail - get activateRepo error", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
			BL.activateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get activateRepo no account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
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
			BL.activateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - get activateRepo no driver", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "githubs",
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
			BL.activateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - get activateRepo no repo", (done) => {
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
					return cb(null, null);
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
			BL.activateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - get activateRepo repo not active", (done) => {
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
						active: true,
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
						active: true,
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
			BL.activateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 408);
				done();
			});
		});
		
		it("fail - get activateRepo error in listBranches", (done) => {
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
					return cb(new Error("test"));
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
			};
			BL.activateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get activateRepo activateSyncRepo error", (done) => {
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
					return cb(new Error("dummy"));
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
			BL.activateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing get deactivateRepo", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
			done();
		});
		it("Success - get deactivateRepo", (done) => {
			sinon.stub(lib, 'deleteCatalog_src').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			BL.modelObj = {
				removeRepository: (nullObject, cb) => {
					return cb(null, null);
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
			BL.deactivateRepo(soajs, {}, (err, res) => {
				assert.deepStrictEqual(res, `Repository deactivated!`);
				done();
			});
		});
		
		it("fail - get deactivateRepo getRepository error", (done) => {
			sinon.stub(lib, 'deleteCatalog_src').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			BL.modelObj = {
				removeRepository: (nullObject, cb) => {
					return cb(null);
				},
				getRepository: (nullObject, cb) => {
					return cb(new Error("dummy"));
				},
				removeCatalogs: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			soajs.inputmaskData = {
				"id": "master",
			};
			BL.deactivateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get deactivateRepo no repo", (done) => {
			sinon.stub(lib, 'deleteCatalog_src').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			BL.modelObj = {
				removeRepository: (nullObject, cb) => {
					return cb(null);
				},
				getRepository: (nullObject, cb) => {
					return cb(null, null);
				},
				removeCatalogs: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			soajs.inputmaskData = {
				"id": "master",
			};
			BL.deactivateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - get deactivateRepo error", (done) => {
			sinon.stub(lib, 'deleteCatalog_src').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			BL.modelObj = {
				removeRepository: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
			BL.deactivateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get deactivateRepo", (done) => {
			sinon.stub(lib, 'deleteCatalog_src').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
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
							name: "master",
							active: true
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
			BL.deactivateRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 414);
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
						}],
						active: true
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
				return cb(null, "this is the response");
			});
			BL.activateBranch(soajs, {}, (err, res) => {
				assert.deepStrictEqual(res, "this is the response");
				done();
			});
		});
		
		it("fail - get activateBranch getAccount error", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
						}],
						active: true
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
				return cb(null, "this is the response");
			});
			BL.activateBranch(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get activateBranch no account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
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
						}],
						active: true
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
				return cb(null, "this is the response");
			});
			BL.activateBranch(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - get activateBranch no driver", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "githubs",
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
						}],
						active: true
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
				return cb(null, "this is the response");
			});
			BL.activateBranch(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - get activateBranch no repo", (done) => {
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
					return cb(null, null);
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
				return cb(null, "this is the response");
			});
			BL.activateBranch(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - get activateBranch repo active", (done) => {
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
						}],
						active: false
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
				return cb(null, "this is the response");
			});
			BL.activateBranch(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - get activateBranch branch active", (done) => {
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
							name: "master",
							active: true
						}],
						active: true
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
				return cb(null, "this is the response");
			});
			BL.activateBranch(soajs, soajs.inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 412);
				done();
			});
		});
		
		it("fail - get activateBranch no branch ", (done) => {
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
						}],
						active: true
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
					return cb(new Error("dummy"));
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
				return cb(null, "this is the response");
			});
			BL.activateBranch(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 410);
				done();
			});
		});
		
		it("fail - get activateBranch computeCatalog error", (done) => {
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
						}],
						active: true
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
				return cb("test");
			});
			BL.activateBranch(soajs, {}, (err) => {
				assert.deepStrictEqual(err, "test");
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
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
							name: "master",
							active: true
						}],
						active: true
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err, res) => {
				assert.deepStrictEqual(res, `Branch ${soajs.inputmaskData.branch} deactivated!`);
				done();
			});
		});
		
		it("fail - get deactivateBranch getAccount error ", (done) => {
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
							name: "master",
							active: true
						}],
						active: true
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get deactivateBranch no account ", (done) => {
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
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
							name: "master",
							active: true
						}],
						active: true
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err) => {
				assert.deepStrictEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - get deactivateBranch no driver", (done) => {
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "githubs",
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
							name: "master",
							active: true
						}],
						active: true
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - get deactivateBranch no repo", (done) => {
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
					return cb(null, null);
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err) => {
				assert.deepStrictEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - get deactivateBranch not active", (done) => {
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
							name: "master",
							active: true
						}],
						active: false
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err) => {
				assert.deepStrictEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - get deactivateBranch branch active", (done) => {
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
							name: "develop",
							active: true
						}],
						active: true
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err) => {
				assert.deepStrictEqual(err.code, 410);
				done();
			});
		});
		
		it("fail - get deactivateBranch getCatalogs error", (done) => {
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(new Error("dummy"));
			});
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
							name: "master",
							active: true
						}],
						active: true
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err) => {
				assert.deepStrictEqual(err.code, 605);
				done();
			});
		});
		
		it("fail - get deactivateBranch updateVersionBranch error ", (done) => {
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(new Error("dummy"));
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
							name: "master",
							active: true
						}],
						active: true
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err) => {
				assert.deepStrictEqual(err.code, 605);
				done();
			});
		});
		
		it("fail - get deactivateBranch updateBranches error", (done) => {
			sinon.stub(lib, 'updateVersionBranch').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
							name: "master",
							active: true
						}],
						active: true
					});
				},
				updateBranches: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
			BL.deactivateBranch(soajs, {
				"id": "123",
				"branch": "master"
			}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
	});
	
	describe("Testing get activateTag", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
			done();
		});
		
		it("Success - get activateTag", (done) => {
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
						tags: [{
							name: "1.1"
						}],
						active: true
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
				this.getTag = (data, cb) => {
					return cb(null, [{
						name: "1.1"
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
				"tag": "1.1"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is the response");
			});
			BL.activateTag(soajs, {}, (err, res) => {
				assert.deepStrictEqual(res, "this is the response");
				done();
			});
		});
		
		it("fail - get activateTag getAccount error", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
						tags: [{
							name: "1.1"
						}],
						active: true
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
				this.getTag = (data, cb) => {
					return cb(null, [{
						name: "1.1"
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
				tag: "1.1"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is the response");
			});
			BL.activateTag(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get activateTag no account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
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
						tags: [{
							name: "1.1"
						}],
						active: true
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
				this.getTag = (data, cb) => {
					return cb(null, [{
						name: "1.1"
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
				"tag": "1.1"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is the response");
			});
			BL.activateTag(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - get activateTag no driver", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "githubs",
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
							tag: "1.1"
						}],
						active: true
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
				this.getTag = (data, cb) => {
					return cb(null, [{
						name: "1.1"
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
				"tag": "1.1"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is the response");
			});
			BL.activateTag(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - get activateTag no repo", (done) => {
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
					return cb(null, null);
				},
				updateBranches: (nullObject, cb) => {
					return cb(null, true);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getTag = (data, cb) => {
					return cb(null, [{
						name: "1.1"
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
				"tag": "1.1"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is the response");
			});
			BL.activateTag(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - get activateTag repo active", (done) => {
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
						tags: [{
							name: "1.1"
						}],
						active: false
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
				this.getTag = (data, cb) => {
					return cb(null, [{
						name: "1.1"
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
				"tag": "1.1"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is the response");
			});
			BL.activateTag(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - get activateTag branch active", (done) => {
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
						tags: [{
							name: "1.1",
							active: true
						}],
						active: true
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
				this.getTag = (data, cb) => {
					return cb(null, [{
						name: "1.1"
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
				"tag": "1.1"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is the response");
			});
			BL.activateTag(soajs, soajs.inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 418);
				done();
			});
		});
		
		it("fail - get activateTag no branch ", (done) => {
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
						tags: [{
							name: "master"
						}],
						active: true
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
				this.getTag = (data, cb) => {
					return cb(new Error("dummy"));
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
				"tag": "1.1"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is the response");
			});
			BL.activateTag(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 416);
				done();
			});
		});
		
		it("fail - get activateTag computeCatalog error", (done) => {
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
						tags: [{
							name: "master"
						}],
						active: true
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
				this.getTag = (data, cb) => {
					return cb(null, [{
						name: "1.1"
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
				"tag": "1.1"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb("test");
			});
			BL.activateTag(soajs, {}, (err) => {
				assert.deepStrictEqual(err, "test");
				done();
			});
		});
		
	});
	
	describe("Testing get deactivateTag", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
			done();
		});
		
		it("Success - get deactivateTag", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
						tags: [{
							name: "1.1",
							active: true
						}],
						active: true
					});
				},
				updateTags: (nullObject, cb) => {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err, res) => {
				assert.deepStrictEqual(res, `Tag ${soajs.inputmaskData.tag} deactivated!`);
				done();
			});
		});
		
		it("fail - get deactivateTag error getAccount", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
						tags: [{
							name: "1.1",
							active: true
						}],
						active: true
					});
				},
				updateTags: (nullObject, cb) => {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get deactivateTag no account", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
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
						tags: [{
							name: "1.1",
							active: true
						}],
						active: true
					});
				},
				updateTags: (nullObject, cb) => {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err) => {
				assert.deepStrictEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - get deactivateTag no provider", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "githubs",
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
						tags: [{
							name: "1.1",
							active: true
						}],
						active: true
					});
				},
				updateTags: (nullObject, cb) => {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - get deactivateTag no repo", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
					return cb(null, null);
				},
				updateTags: (nullObject, cb) => {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err) => {
				assert.deepStrictEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - get deactivateTag repo not active", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
						tags: [{
							name: "1.1",
							active: true
						}],
						active: false
					});
				},
				updateTags: (nullObject, cb) => {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err) => {
				assert.deepStrictEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - get deactivateTag tag not active", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
						tags: [{
							name: "1.1",
							active: false
						}],
						active: true
					});
				},
				updateTags: (nullObject, cb) => {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err) => {
				assert.deepStrictEqual(err.code, 416);
				done();
			});
		});
		
		it("fail - get deactivateTag error getCatalogs", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(new Error("dummy"));
			});
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
						tags: [{
							name: "1.1",
							active: true
						}],
						active: true
					});
				},
				updateTags: (nullObject, cb) => {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err) => {
				assert.deepStrictEqual(err.code, 605);
				done();
			});
		});
		
		it("fail - get deactivateTag error updateVersionTag", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(new Error("dummy"), true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
						tags: [{
							name: "1.1",
							active: true
						}],
						active: true
					});
				},
				updateTags: (nullObject, cb) => {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err) => {
				assert.deepStrictEqual(err.code, 605);
				done();
			});
		});
		
		it("fail - get deactivateTag error updateTags ", (done) => {
			sinon.stub(lib, 'updateVersionTag').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, true);
			});
			sinon.stub(lib, 'getCatalogs').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null, [{
					"name": "test",
					"type": "service",
					"branch": "master"
				}]);
			});
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
						tags: [{
							name: "1.1",
							active: true
						}],
						active: true
					});
				},
				updateTags: (nullObject, cb) => {
					return cb(new Error("dummy"));
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
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
				"tag": "1.1"
			};
			BL.deactivateTag(soajs, {
				"id": "123",
				"tag": "1.1"
			}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
	});
	
	describe("Testing get syncRepo", () => {
		afterEach((done) => {
			BL.modelObj = null;
			BL.drivers = {};
			sinon.restore();
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
						],
						active: true
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
			
			sinon.stub(lib, 'update_items_branches').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null);
			});
			BL.syncRepo(soajs, {}, (err, res) => {
				assert.deepStrictEqual(res, `Repository RaghebAD/soajs is synchronized!`);
				done();
			});
		});
		
		it("fail - get syncRepo account error ", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
						active: true
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
			
			BL.syncRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get syncRepo no account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
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
						active: true
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
			
			BL.syncRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - get syncRepo no provider", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "githubs",
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
						active: true
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
			
			BL.syncRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - get syncRepo no repo", (done) => {
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
					return cb(null, null);
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
			
			BL.syncRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - get syncRepo repo not active", (done) => {
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
						active: false
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
			
			BL.syncRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - get syncRepo listBranches error", (done) => {
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
						active: true
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
					return cb(new Error("dummy"));
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
			};
			
			BL.syncRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get syncRepo activateSyncRepo error", (done) => {
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
						active: true
					});
				},
				activateSyncRepo: (nullObject, cb) => {
					return cb(new Error("dummy"), true);
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
			
			sinon.stub(lib, 'update_items_branches').callsFake(function fakeFn(soajs, opts, cb) {
				return cb(null);
			});
			BL.syncRepo(soajs, {}, (err) => {
				assert.deepStrictEqual(err.code, 602);
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
						branches: [
							{
								name: "master",
								ts: 1580725311684,
								active: true
							}
						],
						active: true
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						name: "master",
					});
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is done");
			});
			BL.syncBranch(soajs, soajs.inputmaskData, (err, res) => {
				assert.deepStrictEqual(res, "this is done");
				done();
			});
		});
		
		it("fail - get syncBranch getAccount error", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(new Error("dummy"));
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
						branches: [
							{
								name: "master",
								ts: 1580725311684,
								active: true
							}
						],
						active: true
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						name: "master",
					});
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is done");
			});
			BL.syncBranch(soajs, soajs.inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 602);
				done();
			});
		});
		
		it("fail - get syncBranch no account", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, null);
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
						branches: [
							{
								name: "master",
								ts: 1580725311684,
								active: true
							}
						],
						active: true
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						name: "master",
					});
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is done");
			});
			BL.syncBranch(soajs, soajs.inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 403);
				done();
			});
		});
		
		it("fail - get syncBranch no provider", (done) => {
			BL.modelObj = {
				getAccount: (nullObject, cb) => {
					return cb(null, {
						_id: "5e37f43f9248dc603616f7e7",
						owner: "RaghebAD",
						accountType: "personal",
						access: "private",
						provider: "githubs",
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
						branches: [
							{
								name: "master",
								ts: 1580725311684,
								active: true
							}
						],
						active: true
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						name: "master",
					});
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is done");
			});
			BL.syncBranch(soajs, soajs.inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 603);
				done();
			});
		});
		
		it("fail - get syncBranch no repo", (done) => {
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
					return cb(null, null);
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						name: "master",
					});
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is done");
			});
			BL.syncBranch(soajs, soajs.inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 405);
				done();
			});
		});
		
		it("fail - get syncBranch repo not active", (done) => {
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
						branches: [
							{
								name: "master",
								ts: 1580725311684,
								active: true
							}
						],
						active: false
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						name: "master",
					});
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is done");
			});
			BL.syncBranch(soajs, soajs.inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 409);
				done();
			});
		});
		
		it("fail - get syncBranch branch not active", (done) => {
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
						branches: [
							{
								name: "master",
								ts: 1580725311684,
								active: false
							}
						],
						active: true
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(null, {
						name: "master",
					});
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is done");
			});
			BL.syncBranch(soajs, soajs.inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 415);
				done();
			});
		});
		
		it("fail - get syncBranch getBranch error", (done) => {
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
						branches: [
							{
								name: "master",
								ts: 1580725311684,
								active: true
							}
						],
						active: true
					});
				}
			};
			BL.drivers = {
				"github": Github
			};
			
			function Github() {
				this.getBranch = (data, cb) => {
					return cb(new Error("dummy"));
				};
			}
			
			soajs.inputmaskData = {
				"id": "123",
				"branch": "master"
			};
			sinon.stub(lib, 'computeCatalog').callsFake(function fakeFn(bl, soajs, driver, models, opts, cb) {
				return cb(null, "this is done");
			});
			BL.syncBranch(soajs, soajs.inputmaskData, (err) => {
				assert.deepStrictEqual(err.code, 410);
				done();
			});
		});
	});
});