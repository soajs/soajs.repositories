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
const Bitbucket = helper.requireModule('driver/bitbucket/index.js');
const bitbucketHelper = helper.requireModule('driver/bitbucket/helper.js');


describe("Unit test for: Drivers - bitbucket, index", () => {
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
				"provider": "bitbucket",
				"domain": "bitbucket.com",
				"label": "Ragheb",
				"username": "123@soajs.org",
				"password": "1234",
				"type": "personal",
				"access": "private",
				"oauthKey": "123",
				"oauthSecret": "123"
			};
			driver = new Bitbucket(service, data);
			done();
		});
		
		afterEach((done) => {
			done();
		});
		after(function (done) {
			sinon.restore();
			done();
		});
		it("Success ", (done) => {
			let data = {
				"id": 77149728,
				"node_id": "jkhjk==",
				"name": "soajs.urac.driver",
				"full_name": "soajs/soajs.urac.driver",
				"private": false,
				"ts": 1576078535254
			};
			
			let response = driver.createRepositoryRecord(data);
			assert.deepStrictEqual(response, {
				"repository": "soajs/soajs.urac.driver",
				"name": "soajs.urac.driver",
				"type": "repository",
				"owner": "soajs",
				"provider": "bitbucket",
				"source": {
					"name": "123@soajs.org",
					"ts": 1576078535254
				},
				"domain": "bitbucket.com",
				"ts": 1576078535254
			});
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
				"provider": "bitbucket",
				"domain": "bitbucket.com",
				"label": "Ragheb",
				"username": "123@soajs.org",
				"password": "1234",
				"type": "personal",
				"access": "private",
				"oauthKey": "123",
				"oauthSecret": "123"
			};
			sinon.stub(bitbucketHelper, 'validate').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					id: 1,
				});
			});
			sinon.stub(bitbucketHelper, 'createToken').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					access_token: 123,
					refresh_token: 123,
					expires_in: 1234
				});
			});
			driver = new Bitbucket(service, data);
			driver.login(data, (err, id) => {
				assert.ok(id);
				done();
			});
		});
		
		it("Success public", (done) => {
			let data = {
				"provider": "bitbucket",
				"domain": "bitbucket.com",
				"label": "Ragheb",
				"username": "123@soajs.org",
				"password": "1234",
				"type": "personal",
				"access": "public",
				"oauthKey": "123",
				"oauthSecret": "123"
			};
			sinon.stub(bitbucketHelper, 'validate').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					id: 1,
				});
			});
			sinon.stub(bitbucketHelper, 'createToken').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					access_token: 123,
					refresh_token: 123,
					expires_in: 1234
				});
			});
			driver = new Bitbucket(service, data);
			driver.login(data, (err, id) => {
				assert.ok(id);
				done();
			});
		});
		
		it("fail validate", (done) => {
			let data = {
				"provider": "bitbucket",
				"domain": "bitbucket.com",
				"label": "Ragheb",
				"username": "123@soajs.org",
				"password": "1234",
				"type": "personal",
				"access": "private",
				"oauthKey": "123",
				"oauthSecret": "123"
			};
			sinon.stub(bitbucketHelper, 'validate').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			sinon.stub(bitbucketHelper, 'createToken').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					access_token: 123,
					refresh_token: 123,
					expires_in: 1234
				});
			});
			driver = new Bitbucket(service, data);
			driver.login(data, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("fail createToken", (done) => {
			let data = {
				"provider": "bitbucket",
				"domain": "bitbucket.com",
				"label": "Ragheb",
				"username": "123@soajs.org",
				"password": "1234",
				"type": "personal",
				"access": "private",
				"oauthKey": "123",
				"oauthSecret": "123"
			};
			sinon.stub(bitbucketHelper, 'validate').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					id: 1,
				});
			});
			sinon.stub(bitbucketHelper, 'createToken').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket(service, data);
			driver.login(data, (err) => {
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
				"token": "123",
				"tokenInfo": "12asd3",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'checkManifest').callsFake(function fakeFn(self, data, cb) {
				self.manifest = {
					total: 2,
					iterator: 1
				};
				return cb(null);
			});
			sinon.stub(bitbucketHelper, 'execManifest').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					records: [{
						full_name: "SOAJS/repo"
					}]
				});
			});
			driver = new Bitbucket(service, data);
			driver.getRepositories(data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
		
		it("fail checkManifest", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'checkManifest').callsFake(function fakeFn(self, data, cb) {
				self.manifest = {
					total: 2,
					iterator: 1
				};
				return cb(true);
			});
			sinon.stub(bitbucketHelper, 'execManifest').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					records: [{
						full_name: "SOAJS/repo"
					}]
				});
			});
			driver = new Bitbucket(service, data);
			driver.getRepositories(data, (err) => {
				assert.ok(err);
				done();
			});
		});
		
		it("fail execManifest", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'checkManifest').callsFake(function fakeFn(self, data, cb) {
				self.manifest = {
					total: 2,
					iterator: 1
				};
				return cb(null);
			});
			sinon.stub(bitbucketHelper, 'execManifest').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket(service, data);
			driver.getRepositories(data, (err) => {
				assert.ok(err);
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
				"password": "***",
				"on2fa": "123"
			};
			driver = new Bitbucket(service, data);
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
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			driver = new Bitbucket(service, data);
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
			driver.getOrganizations({}, () => {
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
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'listBranches').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					values: [{
						name: "master"
					}]
				});
			});
			driver = new Bitbucket(service, data);
			driver.listBranches({}, (err, response) => {
				assert.ifError(err);
				assert.deepStrictEqual(response, [{
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
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'listBranches').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket(service, data);
			driver.listBranches(data, (err) => {
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
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'listTags').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					values: [{
						name: "1.1"
					}]
				});
			});
			driver = new Bitbucket(service, data);
			driver.listTags({}, (err, response) => {
				assert.ifError(err);
				assert.deepStrictEqual(response, [{
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
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'listTags').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket(service, data);
			driver.listTags(data, (err) => {
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
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'getFile').callsFake(function fakeFn(self, data, cb) {
				return cb(null, "content data");
			});
			driver = new Bitbucket(service, data);
			driver.getFile(data, (err, response) => {
				assert.ifError(err);
				assert.deepStrictEqual(response, {
					content : "content data"
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
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'getFile').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket(service, data);
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
				"type": "personal",
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'getBranch').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					name : "master"
				});
			});
			driver = new Bitbucket(service, data);
			driver.getBranch(data, (err, response) => {
				assert.ifError(err);
				assert.deepStrictEqual(response,  "master");
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
				"access": "private",
				"password": "***",
				"commit": "123"
			};
			sinon.stub(bitbucketHelper, 'getBranch').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					name : "master",
					target: {
						"hash": "123"
					}
				});
			});
			driver = new Bitbucket(service, data);
			driver.getBranch(data, (err, response) => {
				assert.ifError(err);
				assert.deepStrictEqual(response,  {
					name: "master",
					commit: "123"
				});
				done();
			});
		});
		
		it("fail no branch", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'getBranch').callsFake(function fakeFn(self, data, cb) {
				return cb(null, null);
			});
			driver = new Bitbucket(service, data);
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
				"type": "personal",
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'getBranch').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket(service, data);
			driver.getBranch(data, (err) => {
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
				"access": "private",
				"password": "***",
			};
			sinon.stub(bitbucketHelper, 'getTag').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					name : "1.1"
				});
			});
			driver = new Bitbucket(service, data);
			driver.getTag(data, (err, response) => {
				assert.ifError(err);
				assert.deepStrictEqual(response,  "1.1");
				done();
			});
		});
		
		it("fail no tag", (done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"password": "***",
			};
			sinon.stub(bitbucketHelper, 'getTag').callsFake(function fakeFn(self, data, cb) {
				return cb(null, null);
			});
			driver = new Bitbucket(service, data);
			driver.getTag(data, (err) => {
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
				"type": "personal",
				"access": "private",
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'getTag').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket(service, data);
			driver.getTag(data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing logout", () => {
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
			driver.logout({}, () => {
				done();
			});
		});
	});
});