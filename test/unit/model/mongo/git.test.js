
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
	let model;
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
								"poolSize": 5,
								"autoReconnect": true
							}
						}
					}
				};
			}
		}
	};
	
	describe("Testing checkIfAccountExists", () => {
		before((done) => {
			model = new Git(service);
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
				assert.deepEqual(id, 0);
				done();
			});
		});
		
		it("Fails", (done) => {
			model.checkIfAccountExists(null, (err, id) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing saveNewAccount", () => {
		before((done) => {
			model = new Git(service);
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
				assert.deepEqual(Object.keys(record), ["id"]);
				done();
			});
		});
		
		it("Fails", (done) => {
			model.saveNewAccount(null, (err, id) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing updateRepository", () => {
		before((done) => {
			model = new Git(service);
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
				source: "RaghebAD"
			};
			model.updateRepository(data, (err, record) => {
				assert.deepEqual(record.n, 1);
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
	
	describe("Testing git with instance", () => {
		it("Success", (done) => {
			model = new Git(service, null, true);
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
					"poolSize": 5,
					"autoReconnect": true
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
					"poolSize": 5,
					"autoReconnect": true
				},
				"dbConfig" : {}
			}, null);
			done();
		});
	});
});