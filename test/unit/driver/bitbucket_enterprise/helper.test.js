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
const helperFile = helper.requireModule('driver/bitbucket_enterprise/helper.js');
const config = helper.requireModule('config.js');


describe("Unit test for: Drivers - bitbucket_enterprise, helper", () => {
	
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
				username: 'username',
				domain: 'http://localhost:7990',
			};
			nock(config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain))
				.get(config.gitAccounts.bitbucket_enterprise.routes.validateUser.replace("%USERNAME%", self.username))
				.reply(200, {
					id: 123
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
				username: 'username',
				domain: 'http://localhost:7990',
				token: '123'
			};
		
			nock(config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain))
				.get(config.gitAccounts.bitbucket_enterprise.routes.validateUser.replace("%USERNAME%", self.username))
				.reply(200, null);
			let data = {
				config: config
			};
			helperFile.validate(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("Error response is error", (done) => {
			let self = {
				type: 'personal',
				username: 'username',
				domain: 'http://localhost:7990',
				token: '123'
			};
			
			nock(config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain))
				.get(config.gitAccounts.bitbucket_enterprise.routes.validateUser.replace("%USERNAME%", self.username))
				.reply(200, {
					errors: []
				});
			let data = {
				config: config
			};
			helperFile.validate(self, data, (err) => {
				assert.ok(err);
				done();
			});
		});
		it("Error", (done) => {
			let self = {
				type: 'personal',
				username: 'username',
				domain: 'http://localhost:7990',
				token: '123'
			};
			
			nock(config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain))
				.get(config.gitAccounts.bitbucket_enterprise.routes.validateUser.replace("%USERNAME%", self.username))
				.replyWithError({
				message: 'something awful happened',
				code: 'AWFUL_ERROR',
			});
			let data = {
				config: config
			};
			helperFile.validate(self, data, (err) => {
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
				domain: 'http://localhost:7990',
				token: 'yes',
			};
			let data = {
				config,
				pagelen: 3,
				page: 1
			};
			nock(config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain))
				.get(config.gitAccounts.bitbucket_enterprise.routes.getAllRepos)
				.query({
					limit: data.pagelen,
					start: data.page
				})
				.reply(200, {
					"size": 1,
					"limit": 100,
					"isLastPage": true,
					"values": [
						{
							"slug": "test1",
							"id": 35,
							"name": "test1",
							"scmId": "git",
							"state": "AVAILABLE",
							"statusMessage": "Available",
							"forkable": true,
							"project": {
								"key": "NEW",
								"id": 22,
								"name": "newPr",
								"public": false,
								"type": "NORMAL",
								"links": {
									"self": [
										{
											"href": "http://localhost:7990/projects/NEW"
										}
									]
								}
							},
							"public": false,
							"links": {
								"clone": [
									{
										"href": "http://localhost:7990/scm/new/test1.git",
										"name": "http"
									},
									{
										"href": "ssh://git@localhost:7999/new/test1.git",
										"name": "ssh"
									}
								],
								"self": [
									{
										"href": "http://localhost:7990/projects/NEW/repos/test1/browse"
									}
								]
							}
						}
					],
					"start": 0
				});
			
			helperFile.getRepositories(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
	});
	
	describe("Testing getProjects", () => {
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
				domain: 'http://localhost:7990',
				token: 'yes',
			};
			let data = {
				config
			};
			nock(config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain))
				.get(config.gitAccounts.bitbucket_enterprise.routes.getUserProjects)
				.reply(200, {
					"size": 1,
					"limit": 100,
					"isLastPage": true,
					"values": [
					
					],
					"start": 0
				});
			
			helperFile.getProjects(self, data, (err, res) => {
				assert.ok(res);
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
				type: 'personal',
				username: 'username',
				domain: 'http://localhost:7990',
				token: 'yes',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
				branch: "master",
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain))
				.get(config.gitAccounts.bitbucket_enterprise.routes.getBranches.replace('%PROJECT_NAME%', repoInfo[0]).replace('%REPO_NAME%',  repoInfo[1]))
				.query({
					filterText: data.branch
				})
				.reply(200, {
					"size": 1,
					"limit": 100,
					"isLastPage": true,
					"values": [
					{}
					],
					"start": 0
				});
			helperFile.listBranches(self, data, (err, res) => {
				assert.ok(res);
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
				type: 'personal',
				username: 'username',
				domain: 'http://localhost:7990',
				token: 'yes',
			};
			let data = {
				config,
				repository: "soajs/soajs.repository",
				branch: "master",
				path: "swagger.json"
			};
			let repoInfo = data.repository.split('/');
			nock(config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain))
				.get(config.gitAccounts.bitbucket_enterprise.routes.getContent.replace('%PROJECT_NAME%', repoInfo[0]).replace('%REPO_NAME%',  repoInfo[1]) + "/" + data.path)
				.query({
					limit: 1000,
					branch: data.branch,
					start : 0
				})
				.reply(200, {
					"size": 1,
					"limit": 100,
					"isLastPage": true,
					"lines": [
						"first line"
					],
					"start": 0
				});
			helperFile.getFile(self, data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
	});
});
