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
				"password": "***",
				"on2fa": "123"
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
			assert.deepStrictEqual(response, { repository: 'soajs/soajs.urac.driver',
				name: 'soajs.urac.driver',
				type: 'repository',
				owner: 'soajs',
				source: { name: 'soajs', ts: 1576078535254 },
				provider: 'github',
				domain: 'github.com',
				ts: 1576078535254 })
			;
			done();
		});
	});
	
	describe("Testing login", () => {
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
			sinon.stub(githelper, 'validate').callsFake(function fakeFn(self, cb) {
				return cb(null, {
					id: 1
				});
			});
			sinon.stub(githelper, 'createToken').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					token : 123
				});
			});
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
			driver.login(data, (err, id) => {
				assert.ok(id);
				done();
			});
		});
	});
	
	describe("Testing getRepositories", () => {
		before((done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal",
				"access": "private",
				"token": "1234",
				"tokenId": "1234"
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
			driver.getRepositories(data, (err, id) => {
				assert.ok(id);
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
			sinon.stub(githelper, 'getOrganizations').callsFake(function fakeFn(self, cb) {
				return cb(null, [{
					login: "html link"
				}]);
			});
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
			driver.getOrganizations(data, (err, id) => {
				assert.ok(id);
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
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(githelper, 'deleteToken').callsFake(function fakeFn(self, cb) {
				return cb(null, true);
			});
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
					name : "master"
				}]);
			});
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
			driver.listBranches(data, (err, branches) => {
				assert.ifError(err);
				assert.deepStrictEqual(branches, [{
					name: "master"
				}]);
				done();
			});
		});
	});
	
	describe("Testing getFile", () => {
		before((done) => {
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
					content : "random content"
				});
			});
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
			driver.getFile(data, (err, res) => {
				assert.ifError(err);
				assert.deepStrictEqual(res, {
					content :  new Buffer("random content", 'base64').toString()
				});
				done();
			});
		});
	});
	
	describe("Testing getBranch", () => {
		before((done) => {
			let data = {
				"provider": "github",
				"domain": "github.com",
				"label": "Soajs",
				"username": "soajs",
				"type": "personal"
			};
			sinon.stub(githelper, 'getBranch').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					name : "master"
				});
			});
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
			driver.getBranch(data, (err, branches) => {
				assert.ifError(err);
				assert.deepStrictEqual(branches, "master");
				done();
			});
		});
	});
});