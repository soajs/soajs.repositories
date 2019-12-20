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
	let driver, helperStub;
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
			assert.deepEqual(response, {
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
				})
			});
			sinon.stub(bitbucketHelper, 'createToken').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					access_token: 123,
					refresh_token: 123,
					expires_in: 1234
				})
			});
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
				"password": "***",
				"on2fa": "123"
			};
			sinon.stub(bitbucketHelper, 'checkManifest').callsFake(function fakeFn(self, data, cb) {
				self.manifest = {
					total: 2,
					iterator: 1
				};
				return cb(null)
			});
			sinon.stub(bitbucketHelper, 'execManifest').callsFake(function fakeFn(self, data, cb) {
				return cb(null, {
					records: [{
						full_name: "SOAJS/repo"
					}]
				})
			});
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
			let data = {};
			driver.getRepositories(data, (err, res) => {
				assert.ok(res);
				done();
			});
		});
	});
});