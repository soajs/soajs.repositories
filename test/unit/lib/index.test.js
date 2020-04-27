/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../helper.js");
const lib = helper.requireModule('lib/index.js');

describe("Unit test for: index", () => {
	
	describe("Unit test handleRepositories", () => {
		it("Success - multiple", (done) => {
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
							"coreDB": {
								"provision": {
									"name": "core_provision",
									"prefix": "",
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
			soajs.inputmaskData = {
				id: "1"
			};
			let count = 0;
			let driver = {
				getRepositories: (opts, cb) => {
					let response = {
						records: [{
							id: 1,
							node_id: 'weqwe==',
							name: 'soajs.repo.ui',
							full_name: 'soajs/soajs.repo.ui',
							private: false,
							description: null,
							fork: false,
						}]
					};
					response.next = count === 0;
					count++;
					return cb(null, response);
				},
				createRepositoryRecord: (record) => {
					return record;
				},
				getOrganizations: (opts, cb) => {
					return cb(null, ["soajs"]);
				},
				getOwner: () => {
					return "ragheb";
				}
			};
			let modelObj = {
				updateRepository: (opts, cb) => {
					return cb(null, true);
				},
				updateAccount: (opts, cb) => {
					return cb(null, true);
				},
				syncRepository: (opts, cb) => {
					return cb(null, true);
				}
			};
		
			setTimeout(function () {
				lib.handleRepositories({
					config: soajs.config
				}, soajs, driver, modelObj, null);
				done();
			}, 200);
		});
		it("Success - whitelist multiple", (done) => {
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
							"coreDB": {
								"provision": {
									"name": "core_provision",
									"prefix": "",
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
			soajs.inputmaskData = {
				id: "1"
			};
			let count = 0;
			let driver = {
				getRepositories: (opts, cb) => {
					let response = {
						records: [{
							id: 1,
							node_id: 'weqwe==',
							name: 'soajs.repo.ui',
							full_name: 'soajs/soajs.repo.ui',
							private: false,
							description: null,
							fork: false,
						}]
					};
					response.next = count === 0;
					count++;
					return cb(null, response);
				},
				createRepositoryRecord: (record) => {
					return record;
				},
				getOrganizations: (opts, cb) => {
					return cb(null, ["soajs"]);
				},
				getOwner: () => {
					return "ragheb";
				}
			};
			let modelObj = {
				updateRepository: (opts, cb) => {
					return cb(null, true);
				},
				updateAccount: (opts, cb) => {
					return cb(null, true);
				},
				syncRepository: (opts, cb) => {
					return cb(null, true);
				}
			};
			let update = {
				value : ["soajs"],
				type: "whitelist"
			};
			setTimeout(function () {
				lib.handleRepositories({
					config: soajs.config
				}, soajs, driver, modelObj, update);
				done();
			}, 200);
		});
		it("Success - blacklist multiple", (done) => {
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
							"coreDB": {
								"provision": {
									"name": "core_provision",
									"prefix": "",
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
			soajs.inputmaskData = {
				id: "1"
			};
			let count = 0;
			let driver = {
				getRepositories: (opts, cb) => {
					let response = {
						records: [{
							id: 1,
							node_id: 'weqwe==',
							name: 'soajs.repo.ui',
							full_name: 'soajs/soajs.repo.ui',
							private: false,
							description: null,
							fork: false,
						}]
					};
					response.next = count === 0;
					count++;
					return cb(null, response);
				},
				createRepositoryRecord: (record) => {
					return record;
				},
				getOrganizations: (opts, cb) => {
					return cb(null, ["soajs"]);
				},
				getOwner: () => {
					return "ragheb";
				}
			};
			let modelObj = {
				updateRepository: (opts, cb) => {
					return cb(null, true);
				},
				updateAccount: (opts, cb) => {
					return cb(null, true);
				},
				syncRepository: (opts, cb) => {
					return cb(null, true);
				}
			};
			let update = {
				value : ["soajs"],
				type: "blacklist"
			};
			setTimeout(function () {
				lib.handleRepositories({
					config: soajs.config
				}, soajs, driver, modelObj, update);
				done();
			}, 200);
		});
		
		it("Success - single", (done) => {
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
							"coreDB": {
								"provision": {
									"name": "core_provision",
									"prefix": "",
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
			soajs.inputmaskData = {
				id: "1"
			};
			let driver = {
				getRepositories: (opts, cb) => {
					let response = {
						records: [{
							id: 1,
							node_id: 'weqwe==',
							name: 'soajs.repo.ui',
							full_name: 'soajs/soajs.repo.ui',
							private: false,
							description: null,
							fork: false,
						}]
					};
					response.next = false;
					return cb(null, response);
				},
				createRepositoryRecord: (record) => {
					return record;
				},
				getOrganizations: (opts, cb) => {
					return cb(null, ["soajs"]);
				},
				getOwner: () => {
					return "ragheb";
				}
			};
			let modelObj = {
				updateRepository: (opts, cb) => {
					return cb(null, true);
				},
				updateAccount: (opts, cb) => {
					return cb(null, true);
				},
				syncRepository: (opts, cb) => {
					return cb(null, true);
				}
			};
			
			setTimeout(function () {
				lib.handleRepositories({
					config: soajs.config
				}, soajs, driver, modelObj, null);
				done();
			}, 200);
		});
		it("Success - whitelist single", (done) => {
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
							"coreDB": {
								"provision": {
									"name": "core_provision",
									"prefix": "",
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
			soajs.inputmaskData = {
				id: "1"
			};
			let driver = {
				getRepositories: (opts, cb) => {
					let response = {
						records: [{
							id: 1,
							node_id: 'weqwe==',
							name: 'soajs.repo.ui',
							full_name: 'soajs/soajs.repo.ui',
							private: false,
							description: null,
							fork: false,
						}]
					};
					response.next = false;
					return cb(null, response);
				},
				createRepositoryRecord: (record) => {
					return record;
				},
				getOrganizations: (opts, cb) => {
					return cb(null, ["soajs"]);
				},
				getOwner: () => {
					return "ragheb";
				}
			};
			let modelObj = {
				updateRepository: (opts, cb) => {
					return cb(null, true);
				},
				updateAccount: (opts, cb) => {
					return cb(null, true);
				},
				syncRepository: (opts, cb) => {
					return cb(null, true);
				}
			};
			let update = {
				value : ["soajs"],
				type: "whitelist"
			};
			setTimeout(function () {
				lib.handleRepositories({
					config: soajs.config
				}, soajs, driver, modelObj, update);
				done();
			}, 200);
		});
		it("Success - blacklist single", (done) => {
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
							"coreDB": {
								"provision": {
									"name": "core_provision",
									"prefix": "",
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
			soajs.inputmaskData = {
				id: "1"
			};
			let driver = {
				getRepositories: (opts, cb) => {
					let response = {
						records: [{
							id: 1,
							node_id: 'weqwe==',
							name: 'soajs.repo.ui',
							full_name: 'soajs/soajs.repo.ui',
							private: false,
							description: null,
							fork: false,
						}]
					};
					response.next = false;
					return cb(null, response);
				},
				createRepositoryRecord: (record) => {
					return record;
				},
				getOrganizations: (opts, cb) => {
					return cb(null, ["soajs"]);
				},
				getOwner: () => {
					return "ragheb";
				}
			};
			let modelObj = {
				updateRepository: (opts, cb) => {
					return cb(null, true);
				},
				updateAccount: (opts, cb) => {
					return cb(null, true);
				},
				syncRepository: (opts, cb) => {
					return cb(null, true);
				}
			};
			let update = {
				value : ["soajs"],
				type: "blacklist"
			};
			setTimeout(function () {
				lib.handleRepositories({
					config: soajs.config
				}, soajs, driver, modelObj, update);
				done();
			}, 200);
		});
	});
	
	describe("Unit test computeCatalog", () => {
		it("Success - computeCatalog multiple", (done) => {
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
							"coreDB": {
								"provision": {
									"name": "core_provision",
									"prefix": "",
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
			soajs.inputmaskData = {
				id: "1"
			};
			let count = 0;
			let driver = {
				getRepositories: (opts, cb) => {
					let response = {
						records: [{
							id: 1,
							node_id: 'weqwe==',
							name: 'soajs.repo.ui',
							full_name: 'soajs/soajs.repo.ui',
							private: false,
							description: null,
							fork: false,
						}]
					};
					response.next = count === 0;
					count++;
					return cb(null, response);
				},
				createRepositoryRecord: (record) => {
					return record;
				},
				getOrganizations: (opts, cb) => {
					return cb(null, ["soajs"]);
				},
				getOwner: () => {
					return "ragheb";
				}
			};
			let models = {
				updateRepository: (opts, cb) => {
					return cb(null, true);
				},
				updateAccount: (opts, cb) => {
					return cb(null, true);
				},
				syncRepository: (opts, cb) => {
					return cb(null, true);
				}
			};
			//bl, soajs, driver, models, catalogInfo, cb
			lib.computeCatalog({
				config: soajs.config
			}, soajs, driver, models, catalogInfo, ()=>{
			
			});
			done();
		});
	});
});