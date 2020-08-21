/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const assert = require('assert');
const sinon = require('sinon');

const helper = require("../../../helper.js");
const Github = helper.requireModule('driver/github/index.js');
const githelper = helper.requireModule('driver/github/helper.js');


describe("Unit test for: Drivers - github, index", () => {
	let driver;
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
		}
	};
	
	describe("Testing createRepositoryRecord", () => {
		before((done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"token": "***",
			};
			driver = new Github(service, data);
			done();
		});
		
		afterEach((done) => {
			done();
		});
		after(function (done) {
			done();
		});
		it("Success ", (done) => {
			let data = {
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
			};
			
			let response = driver.createRepositoryRecord(data);
			assert.deepStrictEqual(response, {
				repository: 'soajs/soajs.urac.driver',
				name: 'soajs.urac.driver',
				type: 'repository',
				owner: 'soajs',
				source: {name: 'soajs', ts: 1576078535254},
				provider: 'github',
				domain: 'github.com',
				ts: 1576078535254
			})
			;
			done();
		});
	});
	
	describe("Testing login", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success private", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"token": "***",
			};
			sinon.stub(githelper, 'validate').callsFake(function fakeFn(self, cb) {
				return cb(null, {
					id: 1
				});
			});
			driver = new Github(service, data);
			driver.login(data, (err, id) => {
				assert.ok(id);
				done();
			});
		});
		
		it("Success public", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "public",
				"token": "***",
			};
			sinon.stub(githelper, 'validate').callsFake(function fakeFn(self, cb) {
				return cb(null, {
					id: 1
				});
			});
			driver = new Github(service, data);
			driver.login(data, (err, id) => {
				assert.ok(id);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "public",
				"token": "***",
			};
			sinon.stub(githelper, 'validate').callsFake(function fakeFn(self, cb) {
				return cb(new Error("dummy"));
			});
			driver = new Github(service, data);
			driver.login(data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing getRepositories", () => {
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		
		it("Success", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"token": "1234",
				"tokenId": "1"
			};
			sinon.stub(githelper, 'getRepositories').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					link: "html link"
				});
			});
			sinon.stub(githelper, 'getRepoPages').callsFake(function fakeFn(headers, cb) {
				return cb(null, {
					pages: 2,
					records: [{
						full_name: "SOAJS/repo"
					}]
				});
			});
			driver = new Github(service, data);
			driver.getRepositories(data, (err, id) => {
				assert.ok(id);
				driver.getRepositories(data, (err, id) => {
					assert.ok(id);
					done();
				});
			});
		});
		
		it("fail getRepositories", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"token": "1234"
			};
			sinon.stub(githelper, 'getRepositories').callsFake(function fakeFn(self, data, cb) {
				return cb(new Error("dummy"));
			});
			sinon.stub(githelper, 'getRepoPages').callsFake(function fakeFn(headers, cb) {
				return cb(null, {
					pages: 2,
					records: [{
						full_name: "SOAJS/repo"
					}]
				});
			});
			driver = new Github(service, data);
			driver.getRepositories(data, (err) => {
				assert.ok(err);
				assert.deepStrictEqual(err.message, "dummy");
				done();
			});
		});
		
		it("fail getRepoPages", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"token": "1234"
			};
			sinon.stub(githelper, 'getRepositories').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					link: "html link"
				});
			});
			sinon.stub(githelper, 'getRepoPages').callsFake(function fakeFn(headers, cb) {
				return cb(new Error("dummy 2"));
			});
			driver = new Github(service, data);
			driver.getRepositories(data, (err) => {
				assert.ok(err);
				assert.deepStrictEqual(err.message, "dummy 2");
				done();
			});
		});
		
	});
	
	describe("Testing getOwner", () => {
		before((done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"token": "***",
			};
			driver = new Github(service, data);
			
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let res = driver.getOwner();
			assert.deepStrictEqual(res, "soajs");
			done();
		});
	});
	
	describe("Testing getOrganizations", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
			};
			sinon.stub(githelper, 'getOrganizations').callsFake(function fakeFn(self, cb) {
				return cb(null, [{
					login: "html link"
				}]);
			});
			driver = new Github(service, data);
			driver.getOrganizations(data, (err, id) => {
				assert.ok(id);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
			};
			sinon.stub(githelper, 'getOrganizations').callsFake(function fakeFn(self, cb) {
				return cb(new Error("dummy"));
			});
			driver = new Github(service, data);
			driver.getOrganizations(data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing logout", () => {
		before((done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"token": "***",
			};
			driver = new Github(service, data);
			
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let data = {};
			driver.logout(data, (err) => {
				assert.ifError(err);
				done();
			});
		});
	});
	
	describe("Testing listBranches", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"token": "***"
			};
			sinon.stub(githelper, 'listBranches').callsFake(function fakeFn(self, data, cb) {
				return cb(null, [{
					name: "master"
				}]);
			});
			driver = new Github(service, data);
			driver.listBranches(data, (err, branches) => {
				assert.ifError(err);
				assert.deepStrictEqual(branches, [{
					name: "master"
				}]);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"token": "***"
			};
			sinon.stub(githelper, 'listBranches').callsFake(function fakeFn(self, data, cb) {
				return cb(new Error("dummy"));
			});
			driver = new Github(service, data);
			driver.listBranches(data, (err) => {
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
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"token": "***"
			};
			sinon.stub(githelper, 'getFile').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					content: "random content"
				});
			});
			driver = new Github(service, data);
			
			driver.getFile(data, (err, res) => {
				assert.ifError(err);
				assert.deepStrictEqual(res, {
					content: new Buffer("random content", 'base64').toString()
				});
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"token": "***"
			};
			sinon.stub(githelper, 'getFile').callsFake(function fakeFn(self, data, cb) {
				return cb(new Error("dummy"));
			});
			driver = new Github(service, data);
			
			driver.getFile(data, (err) => {
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
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal"
			};
			sinon.stub(githelper, 'getBranch').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					name: "master"
				});
			});
			driver = new Github(service, data);
			driver.getBranch(data, (err, branches) => {
				assert.ifError(err);
				assert.deepStrictEqual(branches, "master");
				done();
			});
		});
		
		it("Success commit", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"commit": "123"
			};
			sinon.stub(githelper, 'getBranch').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					name: "master",
					commit: {
						"sha": "!23"
					}
				});
			});
			driver = new Github(service, data);
			driver.getBranch(data, (err, branches) => {
				assert.ifError(err);
				assert.deepStrictEqual(branches, {
					name: "master",
					commit: "!23"
				});
				done();
			});
		});
		
		it("fail no response", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal"
			};
			sinon.stub(githelper, 'getBranch').callsFake(function fakeFn(self, data, cb) {
				return cb(null, null);
			});
			driver = new Github(service, data);
			driver.getBranch(data, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal"
			};
			sinon.stub(githelper, 'getBranch').callsFake(function fakeFn(self, data, cb) {
				return cb(new Error("dummy"));
			});
			driver = new Github(service, data);
			driver.getBranch(data, (err) => {
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
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"token": "***"
			};
			sinon.stub(githelper, 'listTags').callsFake(function fakeFn(self, data, cb) {
				return cb(null, [{
					name: "1.1"
				}]);
			});
			driver = new Github(service, data);
			driver.listTags(data, (err, tags) => {
				assert.ifError(err);
				assert.deepStrictEqual(tags, [{
					name: "1.1"
				}]);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"token": "***"
			};
			sinon.stub(githelper, 'listTags').callsFake(function fakeFn(self, data, cb) {
				return cb(new Error("dummy"));
			});
			driver = new Github(service, data);
			driver.listTags(data, (err) => {
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
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"token": "***"
			};
			sinon.stub(githelper, 'getTag').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					ref : "test/test1/test2"
				});
			});
			driver = new Github(service, data);
			driver.getTag(data, (err, tags) => {
				assert.ifError(err);
				assert.deepStrictEqual(tags, {
					name: "test2"
				});
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"token": "***"
			};
			sinon.stub(githelper, 'getTag').callsFake(function fakeFn(self, data, cb) {
				return cb(new Error("dummy"));
			});
			driver = new Github(service, data);
			driver.getTag(data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
});