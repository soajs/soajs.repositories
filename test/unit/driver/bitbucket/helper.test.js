/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const assert = require('assert');
const nock = require('nock');

const helper = require("../../../helper.js");
const helperFile = helper.requireModule('driver/bitbucket/helper.js');
const config = helper.requireModule('config.js');


describe("Unit test for: Drivers - bitbucket, helper", () => {
	
	describe("Testing getRepoPages", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let opts = {
				size: 10,
				pagelen: 3
			};
			helperFile.getRepoPages(opts, (err, pages) => {
				assert.ok(pages);
				assert.equal(pages, 4);
				done();
			});
		});
		
		it("Success empty object", (done) => {
			let opts = {
				size: 0,
				pagelen: 0
			};
			helperFile.getRepoPages(opts, (err, pages) => {
				assert.ok(pages);
				assert.equal(pages, 1);
				done();
			});
		});
		it("Success with null", (done) => {
			helperFile.getRepoPages(null, (err, pages) => {
				assert.ok(pages);
				assert.equal(pages, 1);
				done();
			});
		});
	});
	
	describe("Testing validate", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		after(function (done) {
			nock.cleanAll();
			done();
		});
		
		it("Success", (done) => {
			let self = {
				type: 'personal',
				username: 'username'
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.validateUser.replace("%USERNAME%", self.username))
				.reply(200, {
					account_id: 123
				});
			let data = {
				config: config
			};
			helperFile.validate(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		
		it("Error null", (done) => {
			let self = {
				type: 'personal',
				username: 'username'
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.validateUser.replace("%USERNAME%", self.username))
				.reply(400, null);
			let data = {
				config: config
			};
			helperFile.validate(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing createToken", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		after(function (done) {
			nock.cleanAll();
			done();
		});
		
		it("Success", (done) => {
			let self = {
				type: 'personal',
				username: 'username',
				password: 'pass',
				oauthKey: 'oauthKey',
				oauthSecret: 'oauthSecret'
			};
			nock('https://bitbucket.org')
				.post('/site/oauth2/access_token')
				.reply(200, {
					access_token: 123,
					refresh_token: 123,
					expires_in: 1234
				});
			let data = {
				config: config
			};
			helperFile.createToken(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
	});
	
	describe("Testing getRepositories", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		after(function (done) {
			nock.cleanAll();
			done();
		});
		
		it("Success", (done) => {
			let self = {
				type: 'personal',
				username: 'username',
				password: 'pass',
				oauthKey: 'oauthKey',
				oauthSecret: 'oauthSecret'
			};
			let data = {
				pagelen: 3,
				page: 1,
				token: 'yes',
				url: config.gitAccounts.bitbucket.apiDomain + config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.username),
				oauthSecret: 'oauthSecret'
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.username))
				.query({
					pagelen: data.pagelen,
					page: data.page
				})
				.reply(200, {
					account_id: 123
				});
			
			helperFile.getRepositories(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		
		it("Success with refresh token", (done) => {
			let self = {
				type: 'personal',
				username: 'username',
				password: 'pass',
				oauthKey: 'oauthKey',
				oauthSecret: 'oauthSecret'
			};
			let data = {
				config,
				pagelen: 3,
				page: 1,
				token: '123',
				url: config.gitAccounts.bitbucket.apiDomain + config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.username),
				oauthSecret: 'oauthSecret'
			};
			let count = 0;
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.username))
				.query({
					pagelen: data.pagelen,
					page: data.page
				})
				.reply((uri, requestBody, cb) => {
					count++;
					if (count === 1) {
						cb({
							type: "error",
							error: {
								message: "Access token expired. Use your refresh token to obtain a new access token."
							}
						});
					} else {
						cb(null, [201, 'THIS IS THE REPLY BODY']);
					}
				});
			nock('https://bitbucket.org')
				.post('/site/oauth2/access_token')
				.reply(200, {
					access_token: 123,
					refresh_token: 123,
					expires_in: 1234
				});
			helperFile.getRepositories(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
	});
	
	describe("Testing checkManifest", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		after(function (done) {
			nock.cleanAll();
			done();
		});
		
		it("Success without manifest with token", (done) => {
			let self = {
				username: "username",
				account_id: "account_id",
				token : 1
			};
			let data = {
				config
			};
			helperFile.checkManifest(self, data, () => {
				assert.deepEqual(self.manifest, {
					total: 0,
					auditor: {
						[self.username]: {
							count: 0,
							url: data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.account_id)
						}
					},
					iterator: 0
				});
				done();
			});
		});
		it("Success without manifest with out token", (done) => {
			let self = {
				username: "username",
				account_id: "account_id"
			};
			let data = {
				config
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getUserTeams)
				.query({
					pagelen: 100,
				})
				.reply(200, {
					values: []
				});
			helperFile.checkManifest(self, data, () => {
				assert.deepEqual(self.manifest, {
					total: 0,
					auditor: {
						[self.username]: {
							count: 0,
							url: data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.account_id)
						}
					},
					iterator: 0
				});
				done();
			});
		});
		it("Success with manifest", (done) => {
			let self = {
				manifest: 10,
			};
			let data = {
				config
			};
			helperFile.checkManifest(self, data, () => {
				assert.deepEqual(self.manifest, 10);
				done();
			});
		});
		
	});
	
	describe("Testing getUserTeams", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		after(function (done) {
			nock.cleanAll();
			done();
		});
		
		it("Success ", (done) => {
			let self = {
				username: "username",
				account_id: "account_id",
				manifest: {
					total: 0,
					auditor: {
						["username"]: {
							count: 0,
							url: config.gitAccounts.bitbucket.apiDomain + config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", "account_id")
						}
					},
					iterator: 0
				}
			};
			let data = {
				config
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getUserTeams)
				.query({
					pagelen: 100,
				})
				.reply(200, {
					"pagelen": 100,
					"values": [
						{
							"permission": "admin",
							"type": "team_permission",
							"user": {
								"display_name": "zzzzz",
								"uuid": "zzzz",
								"links": {
									"self": {
										"href": "https://api.bitbucket.org/2.0/users/11"
									},
									"html": {
										"href": "https://bitbucket.org/%123"
									}
								},
								"nickname": "123",
								"type": "user",
								"account_id": "44444"
							},
							"team": {
								"username": "ragheborg",
								"display_name": "ragheborganization",
								"type": "team",
								"uuid": "123",
								"links": {
									"self": {
										"href": "https://api.bitbucket.org/2.0/teams/123"
									},
									"html": {
										"href": "https://bitbucket.org/123"
									}
								}
							}
						},
						{
							"permission": "admin",
							"type": "team_permission",
							"user": {
								"display_name": "Ragheb",
								"uuid": "123123",
								"links": {
									"self": {
										"href": "https://api.bitbucket.org/2.0/users/43434"
									},
									"html": {
										"href": "https://bitbucket.org/3434"
									}
								},
								"nickname": "Ragheb Bou Dargham",
								"type": "user",
								"account_id": "342423"
							},
							"team": {
								"username": "teamragheb",
								"display_name": "teamragheb",
								"type": "team",
								"uuid": "{234234",
								"links": {
									"self": {
										"href": "https://api.bitbucket.org/2.0/teams/234"
									},
									"html": {
										"href": "https://bitbucket.org/23423/"
									}
								}
							}
						}
					],
					"page": 1,
					"size": 2
				});
			helperFile.getUserTeams(self, data, () => {
				assert.deepEqual(self, {
					"username": "username",
					"account_id": "account_id",
					"manifest": {
						"total": 0,
						"auditor": {
							"username": {
								"count": 0,
								"url": "https://api.bitbucket.org/2.0/repositories/account_id"
							},
							"ragheborg": {
								"count": 0,
								"url": "https://api.bitbucket.org/2.0/repositories/ragheborg"
							},
							"teamragheb": {
								"count": 0,
								"url": "https://api.bitbucket.org/2.0/repositories/teamragheb"
							}
						},
						"iterator": 0
					},
					"teams": [
						"ragheborg",
						"teamragheb"
					]
				});
				done();
			});
		});
	});
	
	describe("Testing execManifest", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			done();
		});
		after(function (done) {
			nock.cleanAll();
			done();
		});
		
		it("Success first take", (done) => {
			let self = {
				username: "username",
				account_id: "account_id",
				manifest: {
					total: 0,
					auditor: {
						["username"]: {
							count: 0,
							url: config.gitAccounts.bitbucket.apiDomain + config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", "account_id")
						}
					},
					iterator: 0
				}
			};
			let data = {
				config
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.account_id))
				.query({
					pagelen: 3,
					page: 1,
				})
				.reply(200, {
					"pagelen": 3,
					"size": 11,
					"values": [
						{
							"scm": "git",
							"website": "",
							"has_wiki": false,
							"name": "soajs.nodejs.express",
							
						},
						{
							"scm": "git",
							"website": "",
							"has_wiki": false,
							"name": "catalog",
							
						},
						{
							"scm": "git",
							"website": null,
							"has_wiki": false,
							"name": "dashboard",
							
						}
					],
					"page": 1,
					"next": "2"
				});
			helperFile.execManifest(self, data, (err, res) => {
				assert.deepEqual(res, [ { scm: 'git',
					website: '',
					has_wiki: false,
					name: 'soajs.nodejs.express' },
					{ scm: 'git', website: '', has_wiki: false, name: 'catalog' },
					{ scm: 'git', website: null, has_wiki: false, name: 'dashboard' } ]);
				done();
			});
		});
		
		it("Success second take", (done) => {
			let self = {
				username: "username",
				account_id: "account_id",
				manifest: {
					total: 3,
					auditor: {
						["username"]: {
							total: 3,
							count: 1,
							url: config.gitAccounts.bitbucket.apiDomain + config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", "account_id")
						}
					},
					iterator: 1
				}
			};
			let data = {
				config
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.account_id))
				.query({
					pagelen: 3,
					page: 1,
				})
				.reply(200, {
					"pagelen": 3,
					"size": 11,
					"values": [
						{
							"scm": "git",
							"website": "",
							"has_wiki": false,
							"name": "soajs.nodejs.express",
							
						},
						{
							"scm": "git",
							"website": "",
							"has_wiki": false,
							"name": "catalog",
							
						},
						{
							"scm": "git",
							"website": null,
							"has_wiki": false,
							"name": "dashboard",
							
						}
					],
					"page": 1,
					"next": "3"
				});
			helperFile.execManifest(self, data, (err, res) => {
				assert.deepEqual(res, [ { scm: 'git',
					website: '',
					has_wiki: false,
					name: 'soajs.nodejs.express' },
					{ scm: 'git', website: '', has_wiki: false, name: 'catalog' },
					{ scm: 'git', website: null, has_wiki: false, name: 'dashboard' } ]);
				done();
			});
		});
	});
});
