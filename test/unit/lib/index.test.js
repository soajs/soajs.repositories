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
const config = helper.requireModule('config.js');

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
				value: ["soajs"],
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
				value: ["soajs"],
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
				value: ["soajs"],
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
				value: ["soajs"],
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
	
	describe("Unit test validateSoa", () => {
		it("Success - service", (done) => {
			let catalogDriver =  helper.requireModule(`lib/catalog/service/index.js`);
			let data = {
				soa : {
					"content": {
						"type": "service",
						"subType": "soajs",
						"description": "This service handles soajs integration with git providers.",
						"prerequisites": {
							"cpu": "",
							"memory": ""
						},
						"serviceVersion": 1,
						"serviceName": "repositories",
						"serviceGroup": "Console",
						"servicePort": 4006,
						"requestTimeout": 180,
						"requestTimeoutRenewal": 5,
						"oauth": true,
						"extKeyRequired": true,
						"tags": [
							"github",
							"bitbucket",
							"private",
							"public"
						],
						"attributes": {
							"github": [
								"personal",
								"organization",
								"twitter",
								"github"
							],
							"bitbucket": [
								"saas",
								"enterprise",
								"projects"
							]
						},
						"program": [
							"soajs"
						],
						"documentation": {
							"readme": "/README.md",
							"release": "/RELEASE.md"
						},
						"gitAccounts": {
							"github": {},
							"bitbucket": {
								"apiDomain": "https://api.bitbucket.org/2.0",
								"routes": {
									"validateUser": "/workspaces/%USERNAME%",
									"getAllRepos": "/repositories/%USERNAME%",
									"getUserTeams": "/user/permissions/teams",
									"getContent": "/repositories/%USERNAME%/%REPO_NAME%/src/%BRANCH%/%FILE_PATH%",
									"getBranches": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches",
									"getTags": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags",
									"getBranch": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches/%BRANCH%",
									"getTag": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags/%BRANCH%"
								},
								"oauth": {
									"domain": "https://bitbucket.org/site/oauth2/access_token"
								},
								"hash": {
									"algorithm": "sha256"
								}
							},
							"bitbucket_enterprise": {
								"apiDomain": "%PROVIDER_DOMAIN%/rest/api/1.0",
								"routes": {
									"validateUser": "/users/%USERNAME%",
									"getUserProjects": "/projects",
									"getAllRepos": "/repos",
									"getContent": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/browse",
									"getBranches": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/branches",
									"getTags": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags",
									"getTag": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags/%TAG_NAME%"
								},
								"hash": {
									"algorithm": "sha256"
								}
							}
						},
						"interConnect": [
							{
								"name": "marketplace",
								"version": "1"
							}
						],
						"catalogs": [
							"custom",
							"service",
							"daemon",
							"static",
							"config"
						],
						"errors": {
							"400": "Business logic required data are missing",
							"401": "Username or Token required.",
							"402": "User account already exists.",
							"403": "Git Account does not exist.",
							"404": "Account not found. Login first.",
							"405": "Repository not found.",
							"406": "Username not found.",
							"407": "No need to upgrade.",
							"408": "Repository already active.",
							"409": "Repository is not active.",
							"410": "Branch is is not found",
							"411": "Catalog validation",
							"412": "Branch is already active",
							"413": "Unable to logout. One or more repositories are active.",
							"414": "Unable to deactivate repository, one or more branch is currently active.",
							"415": "Branch is not active",
							"416": "Tag not found",
							"417": "Catalog Entry with same DNA detected!",
							"418": "Tag is already active",
							"500": "Invalid soa.json file schema",
							"601": "Model not found.",
							"602": "Model error: ",
							"603": "Provider not found.",
							"604": "error: ",
							"605": "Service Error: "
						},
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {
								"type": "maintenance"
							},
							"commands": [
								{
									"label": "Reload Registry",
									"path": "/reloadRegistry",
									"icon": "fas fa-undo"
								},
								{
									"label": "Resource Info",
									"path": "/resourceInfo",
									"icon": "fas fa-info"
								}
							]
						},
						"schema": {
							"get": {
								"/git/accounts": {
									"_apiInfo": {
										"l": "Get accounts information and their organization(s)",
										"group": "Account information"
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Account information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account/owner": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Internal"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Get repository information",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/info": {
									"_apiInfo": {
										"l": "Get repository and account information",
										"group": "Internal"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch": {
									"_apiInfo": {
										"l": "Get repository branch information",
										"group": "Repository information"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branches": {
									"_apiInfo": {
										"l": "Get repository branches",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tags": {
									"_apiInfo": {
										"l": "Get repository tags",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"page": {
										"source": [
											"query.page"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"size": {
										"source": [
											"query.size"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag": {
									"_apiInfo": {
										"l": "Get repository tag",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/file": {
									"_apiInfo": {
										"l": "Get a file from repository",
										"group": "Repository management"
									},
									"accountId": {
										"source": [
											"query.accountId"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"filepath": {
										"source": [
											"query.filepath"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"post": {
								"/git/account": {
									"_apiInfo": {
										"l": "Login and add account",
										"group": "Git Accounts"
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"label": {
										"source": [
											"body.label"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"github",
												"bitbucket",
												"bitbucket_enterprise"
											]
										}
									},
									"domain": {
										"source": [
											"body.domain"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"type": {
										"source": [
											"body.type"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"personal",
												"organization"
											]
										}
									},
									"access": {
										"source": [
											"body.access"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"public",
												"private"
											]
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repos": {
									"_apiInfo": {
										"l": "Search and filter repository",
										"group": "Repository information"
									},
									"name": {
										"source": [
											"body.name"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"active": {
										"source": [
											"body.active"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									},
									"owner": {
										"source": [
											"body.owner"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"textSearch": {
										"source": [
											"body.textSearch"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"skip": {
										"source": [
											"body.skip"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"limit": {
										"source": [
											"body.limit"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"leaf": {
										"source": [
											"body.leaf"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									}
								}
							},
							"put": {
								"/git/sync/account": {
									"_apiInfo": {
										"l": "Sync account and all its repositories",
										"group": "Git Accounts"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Upgrade account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/activate": {
									"_apiInfo": {
										"l": "Activate repository and sync branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/deactivate": {
									"_apiInfo": {
										"l": "Deactivate repository",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/activate": {
									"_apiInfo": {
										"l": "Activate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/deactivate": {
									"_apiInfo": {
										"l": "Deactivate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/activate": {
									"_apiInfo": {
										"l": "Activate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/deactivate": {
									"_apiInfo": {
										"l": "Deactivate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/repository": {
									"_apiInfo": {
										"l": "Sync repository and all its branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/branch": {
									"_apiInfo": {
										"l": "Sync branch and update the corresponding catalog",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"delete": {
								"/git/account": {
									"_apiInfo": {
										"l": "Logout and delete account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"query.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Delete Repository",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repositories": {
									"_apiInfo": {
										"l": "Delete Orphan Repositories",
										"group": "Account management"
									}
								}
							}
						}
					}
				},
				repo :{
					"_id": "5f3fca7db458b8e2b4268184",
					"domain": "github.com",
					"repository": "soajs/soajs.repositories",
					"name": "soajs.repositories",
					"owner": "soajs",
					"provider": "github",
					"source": [
						{
							"name": "soajs",
							"ts": 1598016140548
						}
					],
					"ts": 1598016140548,
					"type": "repository",
					"active": true,
					"branches": [
						{
							"name": "develop",
							"active": true,
							"ts": 1598016165799
						},
						{
							"name": "feature/HER-2146-7-8"
						},
						{
							"name": "master"
						},
						{
							"name": "release/v1.x"
						}
					]
				},
				branch: "develop",
				ts : 123,
				config
			};
			lib.validateSoa(catalogDriver, data, config, ()=>{
				done();
			});
		});
		
		it("Success - daemon", (done) => {
			let catalogDriver =  helper.requireModule(`lib/catalog/daemon/index.js`);
			let data = {
				soa : {
					"content": {
						"type": "daemon",
						"subType": "soajs",
						"description": "This service handles soajs integration with git providers.",
						"prerequisites": {
							"cpu": "",
							"memory": ""
						},
						"serviceVersion": 1,
						"serviceName": "repositories",
						"serviceGroup": "Console",
						"servicePort": 4006,
						"requestTimeout": 180,
						"requestTimeoutRenewal": 5,
						"oauth": true,
						"extKeyRequired": true,
						"tags": [
							"github",
							"bitbucket",
							"private",
							"public"
						],
						"attributes": {
							"github": [
								"personal",
								"organization",
								"twitter",
								"github"
							],
							"bitbucket": [
								"saas",
								"enterprise",
								"projects"
							]
						},
						"program": [
							"soajs"
						],
						"documentation": {
							"readme": "/README.md",
							"release": "/RELEASE.md"
						},
						"gitAccounts": {
							"github": {},
							"bitbucket": {
								"apiDomain": "https://api.bitbucket.org/2.0",
								"routes": {
									"validateUser": "/workspaces/%USERNAME%",
									"getAllRepos": "/repositories/%USERNAME%",
									"getUserTeams": "/user/permissions/teams",
									"getContent": "/repositories/%USERNAME%/%REPO_NAME%/src/%BRANCH%/%FILE_PATH%",
									"getBranches": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches",
									"getTags": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags",
									"getBranch": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches/%BRANCH%",
									"getTag": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags/%BRANCH%"
								},
								"oauth": {
									"domain": "https://bitbucket.org/site/oauth2/access_token"
								},
								"hash": {
									"algorithm": "sha256"
								}
							},
							"bitbucket_enterprise": {
								"apiDomain": "%PROVIDER_DOMAIN%/rest/api/1.0",
								"routes": {
									"validateUser": "/users/%USERNAME%",
									"getUserProjects": "/projects",
									"getAllRepos": "/repos",
									"getContent": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/browse",
									"getBranches": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/branches",
									"getTags": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags",
									"getTag": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags/%TAG_NAME%"
								},
								"hash": {
									"algorithm": "sha256"
								}
							}
						},
						"interConnect": [
							{
								"name": "marketplace",
								"version": "1"
							}
						],
						"catalogs": [
							"custom",
							"service",
							"daemon",
							"static",
							"config"
						],
						"errors": {
							"400": "Business logic required data are missing",
							"401": "Username or Token required.",
							"402": "User account already exists.",
							"403": "Git Account does not exist.",
							"404": "Account not found. Login first.",
							"405": "Repository not found.",
							"406": "Username not found.",
							"407": "No need to upgrade.",
							"408": "Repository already active.",
							"409": "Repository is not active.",
							"410": "Branch is is not found",
							"411": "Catalog validation",
							"412": "Branch is already active",
							"413": "Unable to logout. One or more repositories are active.",
							"414": "Unable to deactivate repository, one or more branch is currently active.",
							"415": "Branch is not active",
							"416": "Tag not found",
							"417": "Catalog Entry with same DNA detected!",
							"418": "Tag is already active",
							"500": "Invalid soa.json file schema",
							"601": "Model not found.",
							"602": "Model error: ",
							"603": "Provider not found.",
							"604": "error: ",
							"605": "Service Error: "
						},
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {
								"type": "maintenance"
							},
							"commands": [
								{
									"label": "Reload Registry",
									"path": "/reloadRegistry",
									"icon": "fas fa-undo"
								},
								{
									"label": "Resource Info",
									"path": "/resourceInfo",
									"icon": "fas fa-info"
								}
							]
						},
						"schema": {
							"get": {
								"/git/accounts": {
									"_apiInfo": {
										"l": "Get accounts information and their organization(s)",
										"group": "Account information"
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Account information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account/owner": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Internal"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Get repository information",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/info": {
									"_apiInfo": {
										"l": "Get repository and account information",
										"group": "Internal"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch": {
									"_apiInfo": {
										"l": "Get repository branch information",
										"group": "Repository information"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branches": {
									"_apiInfo": {
										"l": "Get repository branches",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tags": {
									"_apiInfo": {
										"l": "Get repository tags",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"page": {
										"source": [
											"query.page"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"size": {
										"source": [
											"query.size"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag": {
									"_apiInfo": {
										"l": "Get repository tag",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/file": {
									"_apiInfo": {
										"l": "Get a file from repository",
										"group": "Repository management"
									},
									"accountId": {
										"source": [
											"query.accountId"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"filepath": {
										"source": [
											"query.filepath"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"post": {
								"/git/account": {
									"_apiInfo": {
										"l": "Login and add account",
										"group": "Git Accounts"
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"label": {
										"source": [
											"body.label"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"github",
												"bitbucket",
												"bitbucket_enterprise"
											]
										}
									},
									"domain": {
										"source": [
											"body.domain"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"type": {
										"source": [
											"body.type"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"personal",
												"organization"
											]
										}
									},
									"access": {
										"source": [
											"body.access"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"public",
												"private"
											]
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repos": {
									"_apiInfo": {
										"l": "Search and filter repository",
										"group": "Repository information"
									},
									"name": {
										"source": [
											"body.name"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"active": {
										"source": [
											"body.active"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									},
									"owner": {
										"source": [
											"body.owner"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"textSearch": {
										"source": [
											"body.textSearch"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"skip": {
										"source": [
											"body.skip"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"limit": {
										"source": [
											"body.limit"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"leaf": {
										"source": [
											"body.leaf"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									}
								}
							},
							"put": {
								"/git/sync/account": {
									"_apiInfo": {
										"l": "Sync account and all its repositories",
										"group": "Git Accounts"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Upgrade account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/activate": {
									"_apiInfo": {
										"l": "Activate repository and sync branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/deactivate": {
									"_apiInfo": {
										"l": "Deactivate repository",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/activate": {
									"_apiInfo": {
										"l": "Activate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/deactivate": {
									"_apiInfo": {
										"l": "Deactivate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/activate": {
									"_apiInfo": {
										"l": "Activate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/deactivate": {
									"_apiInfo": {
										"l": "Deactivate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/repository": {
									"_apiInfo": {
										"l": "Sync repository and all its branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/branch": {
									"_apiInfo": {
										"l": "Sync branch and update the corresponding catalog",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"delete": {
								"/git/account": {
									"_apiInfo": {
										"l": "Logout and delete account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"query.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Delete Repository",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repositories": {
									"_apiInfo": {
										"l": "Delete Orphan Repositories",
										"group": "Account management"
									}
								}
							}
						}
					}
				},
				repo :{
					"_id": "5f3fca7db458b8e2b4268184",
					"domain": "github.com",
					"repository": "soajs/soajs.repositories",
					"name": "soajs.repositories",
					"owner": "soajs",
					"provider": "github",
					"source": [
						{
							"name": "soajs",
							"ts": 1598016140548
						}
					],
					"ts": 1598016140548,
					"type": "repository",
					"active": true,
					"branches": [
						{
							"name": "develop",
							"active": true,
							"ts": 1598016165799
						},
						{
							"name": "feature/HER-2146-7-8"
						},
						{
							"name": "master"
						},
						{
							"name": "release/v1.x"
						}
					]
				},
				branch: "develop",
				ts : 123,
				config
			};
			lib.validateSoa(catalogDriver, data, config, ()=>{
				done();
			});
		});
		
		it("Success - config", (done) => {
			let catalogDriver =  helper.requireModule(`lib/catalog/config/index.js`);
			let data = {
				soa : {
					"content": {
						"type": "config",
						"subType": "soajs",
						"description": "This service handles soajs integration with git providers.",
						"prerequisites": {
							"cpu": "",
							"memory": ""
						},
						"serviceVersion": 1,
						"serviceName": "repositories",
						"serviceGroup": "Console",
						"servicePort": 4006,
						"requestTimeout": 180,
						"requestTimeoutRenewal": 5,
						"oauth": true,
						"extKeyRequired": true,
						"tags": [
							"github",
							"bitbucket",
							"private",
							"public"
						],
						"attributes": {
							"github": [
								"personal",
								"organization",
								"twitter",
								"github"
							],
							"bitbucket": [
								"saas",
								"enterprise",
								"projects"
							]
						},
						"program": [
							"soajs"
						],
						"documentation": {
							"readme": "/README.md",
							"release": "/RELEASE.md"
						},
						"gitAccounts": {
							"github": {},
							"bitbucket": {
								"apiDomain": "https://api.bitbucket.org/2.0",
								"routes": {
									"validateUser": "/workspaces/%USERNAME%",
									"getAllRepos": "/repositories/%USERNAME%",
									"getUserTeams": "/user/permissions/teams",
									"getContent": "/repositories/%USERNAME%/%REPO_NAME%/src/%BRANCH%/%FILE_PATH%",
									"getBranches": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches",
									"getTags": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags",
									"getBranch": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches/%BRANCH%",
									"getTag": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags/%BRANCH%"
								},
								"oauth": {
									"domain": "https://bitbucket.org/site/oauth2/access_token"
								},
								"hash": {
									"algorithm": "sha256"
								}
							},
							"bitbucket_enterprise": {
								"apiDomain": "%PROVIDER_DOMAIN%/rest/api/1.0",
								"routes": {
									"validateUser": "/users/%USERNAME%",
									"getUserProjects": "/projects",
									"getAllRepos": "/repos",
									"getContent": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/browse",
									"getBranches": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/branches",
									"getTags": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags",
									"getTag": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags/%TAG_NAME%"
								},
								"hash": {
									"algorithm": "sha256"
								}
							}
						},
						"interConnect": [
							{
								"name": "marketplace",
								"version": "1"
							}
						],
						"catalogs": [
							"custom",
							"service",
							"daemon",
							"static",
							"config"
						],
						"errors": {
							"400": "Business logic required data are missing",
							"401": "Username or Token required.",
							"402": "User account already exists.",
							"403": "Git Account does not exist.",
							"404": "Account not found. Login first.",
							"405": "Repository not found.",
							"406": "Username not found.",
							"407": "No need to upgrade.",
							"408": "Repository already active.",
							"409": "Repository is not active.",
							"410": "Branch is is not found",
							"411": "Catalog validation",
							"412": "Branch is already active",
							"413": "Unable to logout. One or more repositories are active.",
							"414": "Unable to deactivate repository, one or more branch is currently active.",
							"415": "Branch is not active",
							"416": "Tag not found",
							"417": "Catalog Entry with same DNA detected!",
							"418": "Tag is already active",
							"500": "Invalid soa.json file schema",
							"601": "Model not found.",
							"602": "Model error: ",
							"603": "Provider not found.",
							"604": "error: ",
							"605": "Service Error: "
						},
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {
								"type": "maintenance"
							},
							"commands": [
								{
									"label": "Reload Registry",
									"path": "/reloadRegistry",
									"icon": "fas fa-undo"
								},
								{
									"label": "Resource Info",
									"path": "/resourceInfo",
									"icon": "fas fa-info"
								}
							]
						},
						"schema": {
							"get": {
								"/git/accounts": {
									"_apiInfo": {
										"l": "Get accounts information and their organization(s)",
										"group": "Account information"
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Account information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account/owner": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Internal"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Get repository information",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/info": {
									"_apiInfo": {
										"l": "Get repository and account information",
										"group": "Internal"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch": {
									"_apiInfo": {
										"l": "Get repository branch information",
										"group": "Repository information"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branches": {
									"_apiInfo": {
										"l": "Get repository branches",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tags": {
									"_apiInfo": {
										"l": "Get repository tags",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"page": {
										"source": [
											"query.page"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"size": {
										"source": [
											"query.size"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag": {
									"_apiInfo": {
										"l": "Get repository tag",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/file": {
									"_apiInfo": {
										"l": "Get a file from repository",
										"group": "Repository management"
									},
									"accountId": {
										"source": [
											"query.accountId"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"filepath": {
										"source": [
											"query.filepath"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"post": {
								"/git/account": {
									"_apiInfo": {
										"l": "Login and add account",
										"group": "Git Accounts"
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"label": {
										"source": [
											"body.label"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"github",
												"bitbucket",
												"bitbucket_enterprise"
											]
										}
									},
									"domain": {
										"source": [
											"body.domain"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"type": {
										"source": [
											"body.type"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"personal",
												"organization"
											]
										}
									},
									"access": {
										"source": [
											"body.access"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"public",
												"private"
											]
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repos": {
									"_apiInfo": {
										"l": "Search and filter repository",
										"group": "Repository information"
									},
									"name": {
										"source": [
											"body.name"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"active": {
										"source": [
											"body.active"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									},
									"owner": {
										"source": [
											"body.owner"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"textSearch": {
										"source": [
											"body.textSearch"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"skip": {
										"source": [
											"body.skip"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"limit": {
										"source": [
											"body.limit"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"leaf": {
										"source": [
											"body.leaf"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									}
								}
							},
							"put": {
								"/git/sync/account": {
									"_apiInfo": {
										"l": "Sync account and all its repositories",
										"group": "Git Accounts"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Upgrade account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/activate": {
									"_apiInfo": {
										"l": "Activate repository and sync branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/deactivate": {
									"_apiInfo": {
										"l": "Deactivate repository",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/activate": {
									"_apiInfo": {
										"l": "Activate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/deactivate": {
									"_apiInfo": {
										"l": "Deactivate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/activate": {
									"_apiInfo": {
										"l": "Activate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/deactivate": {
									"_apiInfo": {
										"l": "Deactivate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/repository": {
									"_apiInfo": {
										"l": "Sync repository and all its branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/branch": {
									"_apiInfo": {
										"l": "Sync branch and update the corresponding catalog",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"delete": {
								"/git/account": {
									"_apiInfo": {
										"l": "Logout and delete account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"query.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Delete Repository",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repositories": {
									"_apiInfo": {
										"l": "Delete Orphan Repositories",
										"group": "Account management"
									}
								}
							}
						}
					}
				},
				repo :{
					"_id": "5f3fca7db458b8e2b4268184",
					"domain": "github.com",
					"repository": "soajs/soajs.repositories",
					"name": "soajs.repositories",
					"owner": "soajs",
					"provider": "github",
					"source": [
						{
							"name": "soajs",
							"ts": 1598016140548
						}
					],
					"ts": 1598016140548,
					"type": "repository",
					"active": true,
					"branches": [
						{
							"name": "develop",
							"active": true,
							"ts": 1598016165799
						},
						{
							"name": "feature/HER-2146-7-8"
						},
						{
							"name": "master"
						},
						{
							"name": "release/v1.x"
						}
					]
				},
				branch: "develop",
				ts : 123,
				config
			};
			lib.validateSoa(catalogDriver, data, config, ()=>{
				done();
			});
		});
		
		it("Success - custom", (done) => {
			let catalogDriver =  helper.requireModule(`lib/catalog/custom/index.js`);
			let data = {
				soa : {
					"content": {
						"type": "custom",
						"subType": "soajs",
						"description": "This service handles soajs integration with git providers.",
						"prerequisites": {
							"cpu": "",
							"memory": ""
						},
						"serviceVersion": 1,
						"serviceName": "repositories",
						"serviceGroup": "Console",
						"servicePort": 4006,
						"requestTimeout": 180,
						"requestTimeoutRenewal": 5,
						"oauth": true,
						"extKeyRequired": true,
						"tags": [
							"github",
							"bitbucket",
							"private",
							"public"
						],
						"attributes": {
							"github": [
								"personal",
								"organization",
								"twitter",
								"github"
							],
							"bitbucket": [
								"saas",
								"enterprise",
								"projects"
							]
						},
						"program": [
							"soajs"
						],
						"documentation": {
							"readme": "/README.md",
							"release": "/RELEASE.md"
						},
						"gitAccounts": {
							"github": {},
							"bitbucket": {
								"apiDomain": "https://api.bitbucket.org/2.0",
								"routes": {
									"validateUser": "/workspaces/%USERNAME%",
									"getAllRepos": "/repositories/%USERNAME%",
									"getUserTeams": "/user/permissions/teams",
									"getContent": "/repositories/%USERNAME%/%REPO_NAME%/src/%BRANCH%/%FILE_PATH%",
									"getBranches": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches",
									"getTags": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags",
									"getBranch": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches/%BRANCH%",
									"getTag": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags/%BRANCH%"
								},
								"oauth": {
									"domain": "https://bitbucket.org/site/oauth2/access_token"
								},
								"hash": {
									"algorithm": "sha256"
								}
							},
							"bitbucket_enterprise": {
								"apiDomain": "%PROVIDER_DOMAIN%/rest/api/1.0",
								"routes": {
									"validateUser": "/users/%USERNAME%",
									"getUserProjects": "/projects",
									"getAllRepos": "/repos",
									"getContent": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/browse",
									"getBranches": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/branches",
									"getTags": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags",
									"getTag": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags/%TAG_NAME%"
								},
								"hash": {
									"algorithm": "sha256"
								}
							}
						},
						"interConnect": [
							{
								"name": "marketplace",
								"version": "1"
							}
						],
						"catalogs": [
							"custom",
							"service",
							"daemon",
							"static",
							"config"
						],
						"errors": {
							"400": "Business logic required data are missing",
							"401": "Username or Token required.",
							"402": "User account already exists.",
							"403": "Git Account does not exist.",
							"404": "Account not found. Login first.",
							"405": "Repository not found.",
							"406": "Username not found.",
							"407": "No need to upgrade.",
							"408": "Repository already active.",
							"409": "Repository is not active.",
							"410": "Branch is is not found",
							"411": "Catalog validation",
							"412": "Branch is already active",
							"413": "Unable to logout. One or more repositories are active.",
							"414": "Unable to deactivate repository, one or more branch is currently active.",
							"415": "Branch is not active",
							"416": "Tag not found",
							"417": "Catalog Entry with same DNA detected!",
							"418": "Tag is already active",
							"500": "Invalid soa.json file schema",
							"601": "Model not found.",
							"602": "Model error: ",
							"603": "Provider not found.",
							"604": "error: ",
							"605": "Service Error: "
						},
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {
								"type": "maintenance"
							},
							"commands": [
								{
									"label": "Reload Registry",
									"path": "/reloadRegistry",
									"icon": "fas fa-undo"
								},
								{
									"label": "Resource Info",
									"path": "/resourceInfo",
									"icon": "fas fa-info"
								}
							]
						},
						"schema": {
							"get": {
								"/git/accounts": {
									"_apiInfo": {
										"l": "Get accounts information and their organization(s)",
										"group": "Account information"
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Account information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account/owner": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Internal"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Get repository information",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/info": {
									"_apiInfo": {
										"l": "Get repository and account information",
										"group": "Internal"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch": {
									"_apiInfo": {
										"l": "Get repository branch information",
										"group": "Repository information"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branches": {
									"_apiInfo": {
										"l": "Get repository branches",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tags": {
									"_apiInfo": {
										"l": "Get repository tags",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"page": {
										"source": [
											"query.page"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"size": {
										"source": [
											"query.size"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag": {
									"_apiInfo": {
										"l": "Get repository tag",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/file": {
									"_apiInfo": {
										"l": "Get a file from repository",
										"group": "Repository management"
									},
									"accountId": {
										"source": [
											"query.accountId"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"filepath": {
										"source": [
											"query.filepath"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"post": {
								"/git/account": {
									"_apiInfo": {
										"l": "Login and add account",
										"group": "Git Accounts"
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"label": {
										"source": [
											"body.label"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"github",
												"bitbucket",
												"bitbucket_enterprise"
											]
										}
									},
									"domain": {
										"source": [
											"body.domain"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"type": {
										"source": [
											"body.type"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"personal",
												"organization"
											]
										}
									},
									"access": {
										"source": [
											"body.access"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"public",
												"private"
											]
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repos": {
									"_apiInfo": {
										"l": "Search and filter repository",
										"group": "Repository information"
									},
									"name": {
										"source": [
											"body.name"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"active": {
										"source": [
											"body.active"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									},
									"owner": {
										"source": [
											"body.owner"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"textSearch": {
										"source": [
											"body.textSearch"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"skip": {
										"source": [
											"body.skip"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"limit": {
										"source": [
											"body.limit"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"leaf": {
										"source": [
											"body.leaf"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									}
								}
							},
							"put": {
								"/git/sync/account": {
									"_apiInfo": {
										"l": "Sync account and all its repositories",
										"group": "Git Accounts"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Upgrade account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/activate": {
									"_apiInfo": {
										"l": "Activate repository and sync branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/deactivate": {
									"_apiInfo": {
										"l": "Deactivate repository",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/activate": {
									"_apiInfo": {
										"l": "Activate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/deactivate": {
									"_apiInfo": {
										"l": "Deactivate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/activate": {
									"_apiInfo": {
										"l": "Activate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/deactivate": {
									"_apiInfo": {
										"l": "Deactivate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/repository": {
									"_apiInfo": {
										"l": "Sync repository and all its branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/branch": {
									"_apiInfo": {
										"l": "Sync branch and update the corresponding catalog",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"delete": {
								"/git/account": {
									"_apiInfo": {
										"l": "Logout and delete account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"query.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Delete Repository",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repositories": {
									"_apiInfo": {
										"l": "Delete Orphan Repositories",
										"group": "Account management"
									}
								}
							}
						}
					}
				},
				repo :{
					"_id": "5f3fca7db458b8e2b4268184",
					"domain": "github.com",
					"repository": "soajs/soajs.repositories",
					"name": "soajs.repositories",
					"owner": "soajs",
					"provider": "github",
					"source": [
						{
							"name": "soajs",
							"ts": 1598016140548
						}
					],
					"ts": 1598016140548,
					"type": "repository",
					"active": true,
					"branches": [
						{
							"name": "develop",
							"active": true,
							"ts": 1598016165799
						},
						{
							"name": "feature/HER-2146-7-8"
						},
						{
							"name": "master"
						},
						{
							"name": "release/v1.x"
						}
					]
				},
				branch: "develop",
				ts : 123,
				config
			};
			lib.validateSoa(catalogDriver, data, config, ()=>{
				done();
			});
		});
		
		it("Success - static", (done) => {
			let catalogDriver =  helper.requireModule(`lib/catalog/static/index.js`);
			let data = {
				soa : {
					"content": {
						"type": "static",
						"subType": "soajs",
						"description": "This service handles soajs integration with git providers.",
						"prerequisites": {
							"cpu": "",
							"memory": ""
						},
						"serviceVersion": 1,
						"serviceName": "repositories",
						"serviceGroup": "Console",
						"servicePort": 4006,
						"requestTimeout": 180,
						"requestTimeoutRenewal": 5,
						"oauth": true,
						"extKeyRequired": true,
						"tags": [
							"github",
							"bitbucket",
							"private",
							"public"
						],
						"attributes": {
							"github": [
								"personal",
								"organization",
								"twitter",
								"github"
							],
							"bitbucket": [
								"saas",
								"enterprise",
								"projects"
							]
						},
						"program": [
							"soajs"
						],
						"documentation": {
							"readme": "/README.md",
							"release": "/RELEASE.md"
						},
						"gitAccounts": {
							"github": {},
							"bitbucket": {
								"apiDomain": "https://api.bitbucket.org/2.0",
								"routes": {
									"validateUser": "/workspaces/%USERNAME%",
									"getAllRepos": "/repositories/%USERNAME%",
									"getUserTeams": "/user/permissions/teams",
									"getContent": "/repositories/%USERNAME%/%REPO_NAME%/src/%BRANCH%/%FILE_PATH%",
									"getBranches": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches",
									"getTags": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags",
									"getBranch": "/repositories/%USERNAME%/%REPO_NAME%/refs/branches/%BRANCH%",
									"getTag": "/repositories/%USERNAME%/%REPO_NAME%/refs/tags/%BRANCH%"
								},
								"oauth": {
									"domain": "https://bitbucket.org/site/oauth2/access_token"
								},
								"hash": {
									"algorithm": "sha256"
								}
							},
							"bitbucket_enterprise": {
								"apiDomain": "%PROVIDER_DOMAIN%/rest/api/1.0",
								"routes": {
									"validateUser": "/users/%USERNAME%",
									"getUserProjects": "/projects",
									"getAllRepos": "/repos",
									"getContent": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/browse",
									"getBranches": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/branches",
									"getTags": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags",
									"getTag": "/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags/%TAG_NAME%"
								},
								"hash": {
									"algorithm": "sha256"
								}
							}
						},
						"interConnect": [
							{
								"name": "marketplace",
								"version": "1"
							}
						],
						"catalogs": [
							"custom",
							"service",
							"daemon",
							"static",
							"config"
						],
						"errors": {
							"400": "Business logic required data are missing",
							"401": "Username or Token required.",
							"402": "User account already exists.",
							"403": "Git Account does not exist.",
							"404": "Account not found. Login first.",
							"405": "Repository not found.",
							"406": "Username not found.",
							"407": "No need to upgrade.",
							"408": "Repository already active.",
							"409": "Repository is not active.",
							"410": "Branch is is not found",
							"411": "Catalog validation",
							"412": "Branch is already active",
							"413": "Unable to logout. One or more repositories are active.",
							"414": "Unable to deactivate repository, one or more branch is currently active.",
							"415": "Branch is not active",
							"416": "Tag not found",
							"417": "Catalog Entry with same DNA detected!",
							"418": "Tag is already active",
							"500": "Invalid soa.json file schema",
							"601": "Model not found.",
							"602": "Model error: ",
							"603": "Provider not found.",
							"604": "error: ",
							"605": "Service Error: "
						},
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {
								"type": "maintenance"
							},
							"commands": [
								{
									"label": "Reload Registry",
									"path": "/reloadRegistry",
									"icon": "fas fa-undo"
								},
								{
									"label": "Resource Info",
									"path": "/resourceInfo",
									"icon": "fas fa-info"
								}
							]
						},
						"schema": {
							"get": {
								"/git/accounts": {
									"_apiInfo": {
										"l": "Get accounts information and their organization(s)",
										"group": "Account information"
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Account information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account/owner": {
									"_apiInfo": {
										"l": "Get account information and its organization(s)",
										"group": "Internal"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Get repository information",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/info": {
									"_apiInfo": {
										"l": "Get repository and account information",
										"group": "Internal"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch": {
									"_apiInfo": {
										"l": "Get repository branch information",
										"group": "Repository information"
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branches": {
									"_apiInfo": {
										"l": "Get repository branches",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tags": {
									"_apiInfo": {
										"l": "Get repository tags",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"page": {
										"source": [
											"query.page"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"size": {
										"source": [
											"query.size"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag": {
									"_apiInfo": {
										"l": "Get repository tag",
										"group": "Repository information"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/file": {
									"_apiInfo": {
										"l": "Get a file from repository",
										"group": "Repository management"
									},
									"accountId": {
										"source": [
											"query.accountId"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"repo": {
										"source": [
											"query.repo"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"filepath": {
										"source": [
											"query.filepath"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"post": {
								"/git/account": {
									"_apiInfo": {
										"l": "Login and add account",
										"group": "Git Accounts"
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"label": {
										"source": [
											"body.label"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"github",
												"bitbucket",
												"bitbucket_enterprise"
											]
										}
									},
									"domain": {
										"source": [
											"body.domain"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"type": {
										"source": [
											"body.type"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"personal",
												"organization"
											]
										}
									},
									"access": {
										"source": [
											"body.access"
										],
										"required": true,
										"validation": {
											"type": "string",
											"enum": [
												"public",
												"private"
											]
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repos": {
									"_apiInfo": {
										"l": "Search and filter repository",
										"group": "Repository information"
									},
									"name": {
										"source": [
											"body.name"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"active": {
										"source": [
											"body.active"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									},
									"owner": {
										"source": [
											"body.owner"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"provider": {
										"source": [
											"body.provider"
										],
										"required": false,
										"validation": {
											"type": "array",
											"uniqueItems": true,
											"items": {
												"type": "string"
											}
										}
									},
									"textSearch": {
										"source": [
											"body.textSearch"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"skip": {
										"source": [
											"body.skip"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"limit": {
										"source": [
											"body.limit"
										],
										"required": false,
										"validation": {
											"type": "integer"
										}
									},
									"leaf": {
										"source": [
											"body.leaf"
										],
										"required": false,
										"validation": {
											"type": "boolean"
										}
									}
								}
							},
							"put": {
								"/git/sync/account": {
									"_apiInfo": {
										"l": "Sync account and all its repositories",
										"group": "Git Accounts"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/account": {
									"_apiInfo": {
										"l": "Upgrade account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"username": {
										"source": [
											"body.username"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"body.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"token": {
										"source": [
											"body.token"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthKey": {
										"source": [
											"body.oauthKey"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									},
									"oauthSecret": {
										"source": [
											"body.oauthSecret"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/activate": {
									"_apiInfo": {
										"l": "Activate repository and sync branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo/deactivate": {
									"_apiInfo": {
										"l": "Deactivate repository",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/activate": {
									"_apiInfo": {
										"l": "Activate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/branch/deactivate": {
									"_apiInfo": {
										"l": "Deactivate branch",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/activate": {
									"_apiInfo": {
										"l": "Activate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/tag/deactivate": {
									"_apiInfo": {
										"l": "Deactivate tag",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"tag": {
										"source": [
											"query.tag"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/repository": {
									"_apiInfo": {
										"l": "Sync repository and all its branches",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/sync/branch": {
									"_apiInfo": {
										"l": "Sync branch and update the corresponding catalog",
										"group": "Repository management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"owner": {
										"source": [
											"query.owner"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"provider": {
										"source": [
											"query.provider"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"branch": {
										"source": [
											"query.branch"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								}
							},
							"delete": {
								"/git/account": {
									"_apiInfo": {
										"l": "Logout and delete account",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									},
									"password": {
										"source": [
											"query.password"
										],
										"required": false,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repo": {
									"_apiInfo": {
										"l": "Delete Repository",
										"group": "Account management"
									},
									"id": {
										"source": [
											"query.id"
										],
										"required": true,
										"validation": {
											"type": "string"
										}
									}
								},
								"/git/repositories": {
									"_apiInfo": {
										"l": "Delete Orphan Repositories",
										"group": "Account management"
									}
								}
							}
						}
					}
				},
				repo :{
					"_id": "5f3fca7db458b8e2b4268184",
					"domain": "github.com",
					"repository": "soajs/soajs.repositories",
					"name": "soajs.repositories",
					"owner": "soajs",
					"provider": "github",
					"source": [
						{
							"name": "soajs",
							"ts": 1598016140548
						}
					],
					"ts": 1598016140548,
					"type": "repository",
					"active": true,
					"branches": [
						{
							"name": "develop",
							"active": true,
							"ts": 1598016165799
						},
						{
							"name": "feature/HER-2146-7-8"
						},
						{
							"name": "master"
						},
						{
							"name": "release/v1.x"
						}
					]
				},
				branch: "develop",
				ts : 123,
				config
			};
			lib.validateSoa(catalogDriver, data, config, ()=>{
				done();
			});
		});
	});
});
