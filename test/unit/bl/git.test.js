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
				403: "Account does not exist",
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
			BL.login(soajs, inputmaskData, (err, response) => {
				assert.deepEqual(response, {
					id: 1,
					message: "Repositories are being added..."
				});
				done();
			});
		});
	});
	
});