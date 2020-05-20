/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const assert = require('assert');
const requester = require('../requester');


describe("Testing get Git API", () => {
	let accountId;
	let account;
	let repo;
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Step 1: login account github", (done) => {
		let params = {
			"body" : {
				"provider": "github",
				"domain": "github.com",
				"label": "soajs",
				"username": "soajs",
				"type": "organization",
				"access": "public",
			}
		};
		requester('/git/account', 'post', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			accountId = body.data.id.toString();
			setTimeout(function(){
				done();
			}, 10000);
		});
	});
	
	it("Step 2: list all account", (done) => {
		let params = {};
		requester('/git/accounts', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.deepStrictEqual(body.data.length , 1);
			assert.deepStrictEqual(body.data[0]._id.toString(), accountId);
			done();
		});
	});
	
	it("Step 3: confirm account github", (done) => {
		let params = {
			"qs" : {
				"id": accountId
			}
		};
		requester('/git/account', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.deepStrictEqual(body.data._id.toString(), accountId);
			account = body.data;
			done();
		});
	});
	
	it("Step 4: search repository github", (done) => {
		let params = {
		
		};
		requester('/git/repos', 'post', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data.repositories.length > 0);
			done();
		});
	});
	it("Step 5: search repository github", (done) => {
		let params = {
			body: {
				name : "soajs.repositories"
			}
		};
		requester('/git/repos', 'post', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data.repositories.length === 1);
			repo = body.data.repositories[0];
			done();
		});
	});
	
	it("Step 6: get file from repo", (done) => {
		let params = {
			qs: {
				accountId : accountId,
				repo : repo.repository,
				filepath : 'config.js',
				branch: "develop"
			}
		};
		requester('/git/repo/file', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data.content);
			done();
		});
	});
	
	it("Step 7: get branches from repo", (done) => {
		let params = {
			qs: {
				id : repo._id.toString(),
			}
		};
		requester('/git/branches', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	it("Step 8: get tags from repo", (done) => {
		let params = {
			qs: {
				id : repo._id.toString(),
			}
		};
		requester('/git/tags', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	
	it("Step 9: sync account", (done) => {
		let params = {
			qs: {
				id : accountId,
			}
		};
		requester('/git/sync/account', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			setTimeout(function(){
				done();
			}, 10000);
		});
	});
	
	it("Step 10: get repo", (done) => {
		let params = {
			qs: {
				id : repo._id.toString(),
			}
		};
		requester('/git/repo/', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			setTimeout(function(){
				done();
			}, 10000);
		});
	});
	
	it("Step 11: activate repo", (done) => {
		let params = {
			qs: {
				id : repo._id.toString(),
				owner : account.owner,
				provider: account.provider
			}
		};
		requester('/git/repo/activate', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	
	it("Step 12: sync repo ", (done) => {
		let params = {
			qs: {
				id : repo._id.toString(),
				owner : account.owner,
				provider: account.provider
			}
		};
		requester('/git/sync/repository', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	it("Step 13: activate branch ", (done) => {
		let params = {
			qs: {
				id : repo._id.toString(),
				owner : account.owner,
				provider: account.provider,
				branch: "develop"
			}
		};
		requester('/git/branch/activate', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	it("Step 14: sync branch ", (done) => {
		let params = {
			qs: {
				id : repo._id.toString(),
				owner : account.owner,
				provider: account.provider,
				branch: "develop"
			}
		};
		requester('/git/sync/branch', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	it("Step 15: deactivate branch ", (done) => {
		let params = {
			qs: {
				id : repo._id.toString(),
				owner : account.owner,
				provider: account.provider,
				branch: "develop"
			}
		};
		requester('/git/branch/deactivate', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	it("Step 16: deactivate repo ", (done) => {
		let params = {
			qs: {
				id : repo._id.toString(),
				owner : account.owner,
				provider: account.provider,
			}
		};
		requester('/git/repo/deactivate', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	it("Step 17: logout ", (done) => {
		let params = {
			qs: {
				id : accountId,
			}
		};
		requester('/git/account', 'delete', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
	
	it("Step 18: delete repo ", (done) => {
		let params = {
			id : repo._id.toString()
		};
		requester('/git/repo', 'delete', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			done();
		});
	});
	it("Step 19: delete repo ", (done) => {
		let params = {};
		requester('/git/repositories', 'delete', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			done();
		});
	});
});
