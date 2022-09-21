
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../../helper.js");
const Git = helper.requireModule('model/mongo/git.js');
const assert = require('assert');

describe("Unit test for: Model - git", () => {
	let accountID;
	let service = {
		config: {
			"errors": {},
		},
		log: {
			error: () => {
				console.log();
			},
			debug: () => {
				console.log();
			}
		},
		registry: {
			get: () => {
				return {
					coreDB: {
						provision: {
							"name": "core_provision",
							"prefix": '',
							"servers": [
								{
									"host": "127.0.0.1",
									"port": 27017
								}
							],
							"credentials": null,
							"URLParam": {
							}
						}
					}
				};
			}
		}
	};
	let model = new Git(service);
	
	describe("Testing checkIfAccountExists", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				id: 1,
				provider: "github"
			};
			model.checkIfAccountExists(data, (err, id) => {
				assert.deepStrictEqual(id, 0);
				done();
			});
		});
		
		it("Fails", (done) => {
			model.checkIfAccountExists(null, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing validateId", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success", (done) => {
			let id = '5e1d9ef5d5d4be2f55868250';
			model.validateId(id, () => {
				done();
			});
		});
		
		it("Fails", (done) => {
			let id = '123';
			model.validateId(id, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails", (done) => {
			model.validateId(null, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing saveNewAccount", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				owner: "RaghebAD",
				accountType: "personal",
				access: "private",
				provider: "github",
				domain: "github.com",
				label: "Ragheb",
				type: "account",
				GID: 123,
				token: "123123"
			};
			model.saveNewAccount(data, (err, record) => {
				accountID = record;
				assert.deepStrictEqual(Object.keys(record), ["id"]);
				done();
			});
		});
		
		it("Fails", (done) => {
			model.saveNewAccount(null, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing getAccount", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success using id", (done) => {
			let data = {
				id: accountID.id.toString()
			};
			model.getAccount(data, (err, record) => {
				assert.deepStrictEqual(record._id, accountID.id);
				done();
			});
		});
		
		it("Success using _id", (done) => {
			let data = {
				_id: accountID.id
			};
			model.getAccount(data, (err, record) => {
				assert.deepStrictEqual(record._id, accountID.id);
				done();
			});
		});
		
		it("Fails using bad id", (done) => {
			let data = {
				id: "bad-id"
			};
			model.getAccount(data, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		
		it("Fails", (done) => {
			model.getAccount(null, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing updateAccount", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				id: accountID.id.toString(),
				metadata: {
					"organizations": ["soajs", "123"]
				}
			};
			model.updateAccount(data, (err, record) => {
				assert.deepStrictEqual(record.nModified, 1);
				done();
			});
		});
		
		it("Fails bad id", (done) => {
			let data = {
				id: '123',
				metadata: {
					"organizations": ["soajs", "123"]
				}
			};
			model.updateAccount(data, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Fails", (done) => {
			model.updateAccount(null, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing updateRepository", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				domain: "github.com",
				repository: "HerronTech/gcs",
				name: "gcs",
				provider: "github",
				type: "repository",
				owner: "HerronTech",
				ts: 1576846947977,
				source: {
					"name": "HerronTech",
					"ts": 1576846947977
				}
			};
			model.updateRepository(data, (err, record) => {
				assert.deepStrictEqual(record.n, 1);
				done();
			});
		});
		
		it("Fails", (done) => {
			model.updateRepository(null, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing syncRepository", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				owner: "HerronTech",
				ts: 123,
			};
			model.syncRepository(data, (err, record) => {
				assert.deepStrictEqual(record.nModified, 1);
				done();
			});
		});
		
		it("Fails", (done) => {
			model.syncRepository(null, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing getAccounts", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success", (done) => {
			model.getAccounts((err, record) => {
				assert.deepStrictEqual(record.length, 1);
				done();
			});
		});
	});
	
	describe("Testing deleteAccount", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				_id: accountID.id
			};
			model.deleteAccount(data, (err, record) => {
				assert.deepStrictEqual(record.deletedCount, 1);
				done();
			});
		});
		it("Fails", (done) => {
			model.deleteAccount(null, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing removeRepositories", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				owner: "HerronTech",
			};
			model.removeRepositories(data, () => {
				done();
			});
		});
		it("Fails", (done) => {
			model.removeRepositories(null, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing git with instance", () => {
		it("Success", (done) => {
			done();
		});
		it("Success", (done) => {
			model = new Git(service, {
				"name": "core_provision",
				"prefix": '',
				"servers": [
					{
						"host": "127.0.0.1",
						"port": 27017
					}
				],
				"index": "test",
				"credentials": null,
				"URLParam": {
				},
			}, null);
			model.closeConnection();
			done();
		});
		
		it("Success", (done) => {
			model = new Git(service, {
				"name": "core_provision",
				"prefix": '',
				"servers": [
					{
						"host": "127.0.0.1",
						"port": 27017
					}
				],
				"index": "test",
				"credentials": null,
				"URLParam": {
				},
				"dbConfig" : {}
			}, null);
			done();
		});
	});
});
