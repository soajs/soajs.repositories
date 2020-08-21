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
const Bitbucket_enterprise = helper.requireModule('driver/bitbucket_enterprise');
const bitbucketHelper = helper.requireModule('driver/bitbucket_enterprise/helper.js');


describe("Unit test for: Drivers - bitbucket_enterprise, index", () => {
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
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"password": "123"
			};
			driver = new Bitbucket_enterprise(service, data);
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
				"ts": 1576078535254
			};
			
			let response = driver.createRepositoryRecord(data);
			assert.deepStrictEqual(response, {
				"repository": "NEW/test1",
				"name": "test1",
				"type": "repository",
				"owner": "NEW",
				"provider": "bitbucket_enterprise",
				"source": {
					"name": "ragheb",
					"ts": 1576078535254
				},
				"domain": "http://localhost:7990",
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
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			sinon.stub(bitbucketHelper, 'validate').callsFake(function fakeFn(self, data, cb) {
				self.id = 1;
				return cb(null);
			});
			driver = new Bitbucket_enterprise(service, data);
			let opts = {};
			driver.login(opts, (err, id) => {
				assert.ok(id);
				done();
			});
		});
		
		it("Success public", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "public",
			};
			sinon.stub(bitbucketHelper, 'validate').callsFake(function fakeFn(self, data, cb) {
				self.id = 1;
				return cb(null);
			});
			driver = new Bitbucket_enterprise(service, data);
			let opts = {};
			driver.login(opts, (err, id) => {
				assert.ok(id);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "public",
			};
			sinon.stub(bitbucketHelper, 'validate').callsFake(function fakeFn(self, data, cb) {
				self.id = 1;
				return cb(true);
			});
			driver = new Bitbucket_enterprise(service, data);
			let opts = {};
			driver.login(opts, (err) => {
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
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			sinon.stub(bitbucketHelper, 'getRepositories').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
						values: [{
							id: 1
						}]
					}
				);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.getRepositories(data, (err, records) => {
				assert.ok(records);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			sinon.stub(bitbucketHelper, 'getRepositories').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.getRepositories(data, (err) => {
				assert.ok(err);
				done();
			});
		});
	});
	
	describe("Testing getOwner", () => {
		before((done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			driver = new Bitbucket_enterprise(service, data);
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
			assert.deepStrictEqual(res, "ragheb");
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
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			sinon.stub(bitbucketHelper, 'getProjects').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
						values: [{
							name: "ptr"
						}]
					}
				);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.getOrganizations(data, (err, records) => {
				assert.ok(records);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			sinon.stub(bitbucketHelper, 'getProjects').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.getOrganizations(data, (err) => {
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
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			sinon.stub(bitbucketHelper, 'listBranches').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
						values: [{
							displayId: "master"
						}]
					}
				);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.listBranches(data, (err, records) => {
				assert.ifError(err);
				assert.ok(records);
				assert.deepStrictEqual(records, [{
					name: "master"
				}]);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			sinon.stub(bitbucketHelper, 'listBranches').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket_enterprise(service, data);
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
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			sinon.stub(bitbucketHelper, 'listTags').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
						values: [{
							displayId: "1.1"
						}]
					}
				);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.listTags(data, (err, records) => {
				assert.ifError(err);
				assert.ok(records);
				assert.deepStrictEqual(records, [{
					name: "1.1"
				}]);
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123"
			};
			sinon.stub(bitbucketHelper, 'listTags').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.listTags(data, (err) => {
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
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123",
				"branch": "master"
			};
			sinon.stub(bitbucketHelper, 'listBranches').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
						values: [{
							displayId: "master"
						}]
					}
				);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.getBranch(data, (err, record) => {
				assert.ok(record);
				assert.deepStrictEqual(record.name, 'master');
				done();
			});
		});
		it("fail", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123",
				"branch": "master"
			};
			sinon.stub(bitbucketHelper, 'listBranches').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket_enterprise(service, data);
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
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123",
				"branch": "master"
			};
			sinon.stub(bitbucketHelper, 'getTag').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
						name: "1.1"
					}
				);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.getTag(data, (err, record) => {
				assert.ok(record);
				assert.deepStrictEqual(record.name, '1.1');
				done();
			});
		});
		it("fail", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123",
				"branch": "master"
			};
			sinon.stub(bitbucketHelper, 'getTag').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.getTag(data, (err) => {
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
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123",
				"branch": "master"
			};
			sinon.stub(bitbucketHelper, 'getFile').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
						lines: [{text: "1st line"}, {text: "second line"}]
					}
				);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.getFile(data, (err, record) => {
				assert.ok(record);
				assert.deepStrictEqual(record, {content: ["1st line", "second line"].join("\n")});
				done();
			});
		});
		
		it("fail", (done) => {
			let data = {
				"provider": "bitbucket_enterprise",
				"domain": "http://localhost:7990",
				"label": "Ragheb",
				"username": "ragheb",
				"type": "personal",
				"access": "private",
				"token": "123",
				"branch": "master"
			};
			sinon.stub(bitbucketHelper, 'getFile').callsFake(function fakeFn(self, data, cb) {
				return cb(true);
			});
			driver = new Bitbucket_enterprise(service, data);
			driver.getFile(data, (err) => {
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
			let data = {};
			driver.logout(data, (err, record) => {
				assert.ok(record);
				done();
			});
		});
	});
});