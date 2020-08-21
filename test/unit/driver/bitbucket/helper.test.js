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
					account_id: 123,
					uuid: 12345
				});
			let data = {
				config: config
			};
			helperFile.validate(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		
		it("fail", (done) => {
			let self = {
				type: 'personal',
				username: 'username'
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.validateUser.replace("%USERNAME%", self.username))
				.reply(200, null);
			let data = {
				config: config
			};
			helperFile.validate(self, data, (err) => {
				assert.ok(err);
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
				.replyWithError('something awful happened');
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
	
	describe("Testing refreshToken", () => {
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
			helperFile.refreshToken(self, data, () => {
				done();
			});
		});
		
		it("fail", (done) => {
			let self = {
				type: 'personal',
				username: 'username',
				password: 'pass',
				oauthKey: 'oauthKey',
				oauthSecret: 'oauthSecret'
			};
			nock('https://bitbucket.org')
				.post('/site/oauth2/access_token')
				.replyWithError('something awful happened');
			let data = {
				config: config
			};
			helperFile.refreshToken(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing getRepositories", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			nock.cleanAll();
			done();
		});
		after(function (done) {
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
		
		it("fail with fail refresh token", (done) => {
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
				.replyWithError('something awful happened');
			helperFile.getRepositories(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("fail ", (done) => {
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
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.username))
				.query({
					pagelen: data.pagelen,
					page: data.page
				})
				.replyWithError('something awful happened');
			helperFile.getRepositories(self, data, (err) => {
				assert.ok(err);
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
				token: 1
			};
			let data = {
				config
			};
			helperFile.checkManifest(self, data, () => {
				assert.deepStrictEqual(self.manifest, {
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
				assert.deepStrictEqual(self.manifest, {
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
				assert.deepStrictEqual(self.manifest, 10);
				done();
			});
		});
		
	});
	
	describe("Testing getUserTeams", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
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
				assert.deepStrictEqual(self, {
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
		
		it("Success no manifest", (done) => {
			let self = {
				username: "username",
				account_id: "account_id",
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
				assert.deepStrictEqual(self, {
					"username": "username",
					"account_id": "account_id",
					"teams": [
						"ragheborg",
						"teamragheb"
					],
					"manifest": {
						"auditor": {
							"ragheborg": {
								"count": 0,
								"url": "https://api.bitbucket.org/2.0/repositories/ragheborg"
							},
							"teamragheb": {
								"count": 0,
								"url": "https://api.bitbucket.org/2.0/repositories/teamragheb"
							}
						}
					}
				});
				done();
			});
		});
		
		it("fail ", (done) => {
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
				.replyWithError('profile error');
			helperFile.getUserTeams(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing execManifest", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			nock.cleanAll();
			done();
		});
		after(function (done) {
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
					pagelen: 100,
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
				assert.deepStrictEqual(res, [{
					scm: 'git',
					website: '',
					has_wiki: false,
					name: 'soajs.nodejs.express'
				},
					{scm: 'git', website: '', has_wiki: false, name: 'catalog'},
					{scm: 'git', website: null, has_wiki: false, name: 'dashboard'}]);
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
					pagelen: 100,
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
				assert.deepStrictEqual(res, [{
					scm: 'git',
					website: '',
					has_wiki: false,
					name: 'soajs.nodejs.express'
				},
					{scm: 'git', website: '', has_wiki: false, name: 'catalog'},
					{scm: 'git', website: null, has_wiki: false, name: 'dashboard'}]);
				done();
			});
		});
		
		it("Success second take empty", (done) => {
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
					iterator: 3
				}
			};
			let data = {
				config
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.account_id))
				.query({
					pagelen: 100,
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
				assert.deepStrictEqual(res, []);
				done();
			});
		});
		
		it("Success second take empty iterators", (done) => {
			let self = {
				username: "username",
				account_id: "account_id",
				manifest: {
					total: 3,
					auditor: {
						["username"]: {
							total: 1,
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
					pagelen: 100,
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
				assert.deepStrictEqual(res, []);
				done();
			});
		});
		
		it("fail 2nd", (done) => {
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
				.get(config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.username))
				.query({
					pagelen: data.pagelen,
					page: data.page
				})
				.replyWithError('something awful happened');
			helperFile.execManifest(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("fail 1st", (done) => {
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
				.get(config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.username))
				.query({
					pagelen: data.pagelen,
					page: data.page
				})
				.replyWithError('something awful happened');
			helperFile.execManifest(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing getContent", () => {
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
				user: 'ragheb',
				token: 'personal',
			};
			let data = {
				config,
				repo: "soajs.repository",
				ref: 'MASTER',
				path: '/SWAGGER.JSON'
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getContent
					.replace('%USERNAME%', self.user)
					.replace('%REPO_NAME%', data.repo)
					.replace('%BRANCH%', data.ref || 'master')
					.replace('%FILE_PATH%', 'SWAGGER.JSON'))
				.reply(200, {
					account_id: 123
				});
			
			helperFile.getContent(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		
		it("fail", (done) => {
			let self = {
				user: 'ragheb',
			};
			let data = {
				config,
				repo: "soajs.repository",
				ref: 'MASTER',
				path: '/SWAGGER.JSON'
			};
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getContent
					.replace('%USERNAME%', self.user)
					.replace('%REPO_NAME%', data.repo)
					.replace('%BRANCH%', data.ref || 'master')
					.replace('%FILE_PATH%', 'SWAGGER.JSON'))
				.replyWithError('something awful happened');
			
			helperFile.getContent(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing listBranches", () => {
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
				user: 'ragheb',
				token: 'personal',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getBranches
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1]))
				.reply(200, {
					account_id: 123
				});
			
			helperFile.listBranches(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		it("fail", (done) => {
			let self = {
				user: 'ragheb',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getBranches
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1]))
				.replyWithError('something awful happened');
			
			helperFile.listBranches(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing listTags", () => {
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
				user: 'ragheb',
				token: 'personal',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getTags
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1]))
				.reply(200, {
					account_id: 123
				});
			
			helperFile.listTags(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		it("fail", (done) => {
			let self = {
				user: 'ragheb',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getTags
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1]))
				.replyWithError('something awful happened');
			
			helperFile.listTags(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing getBranch", () => {
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
				user: 'ragheb',
				token: 'personal',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
				branch: "master",
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getBranch
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1])
					.replace('%BRANCH%',  data.branch))
				.reply(200, {
					account_id: 123
				});
			
			helperFile.getBranch(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		it("fail", (done) => {
			let self = {
				user: 'ragheb',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
				branch: "master",
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getBranch
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1])
					.replace('%BRANCH%',  data.branch))
				.replyWithError('something awful happened');
			
			helperFile.getBranch(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing getTag", () => {
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
				user: 'ragheb',
				token: 'personal',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
				tag: "1.1",
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getTag
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1])
					.replace('%BRANCH%',  data.tag))
				.reply(200, {
					account_id: 123
				});
			
			helperFile.getTag(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		it("fail", (done) => {
			let self = {
				user: 'ragheb',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
				tag: "1.1",
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getTag
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1])
					.replace('%BRANCH%',  data.tag))
				.replyWithError('something awful happened');
			
			helperFile.getTag(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing getFile", () => {
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
				user: 'ragheb',
				token: 'personal',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
				branch: "master",
				path: "/swagger.json"
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getContent
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1])
					.replace('%BRANCH%', data.branch)
					.replace('%FILE_PATH%',"swagger.json"))
					.reply(200, {
						account_id: 123
					});
			
			helperFile.getFile(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		
		it("fail", (done) => {
			let self = {
				user: 'ragheb',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
				branch: "master",
				path: "/swagger.json"
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket.apiDomain)
				.get(config.gitAccounts.bitbucket.routes.getContent
					.replace('%USERNAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1])
					.replace('%BRANCH%', data.branch)
					.replace('%FILE_PATH%',"swagger.json"))
				.replyWithError('something awful happened');
			
			helperFile.getFile(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
});
