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
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it.skip("Success - will login account github", (done) => {
		let params = {
			"provider": "github",
			"domain": "github.com",
			"label": "soajs",
			"username": "soajs",
			"type": "organization",
			"access": "public"
		};
		requester('/gitAccounts/login', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			//add asserts
			done();
		});
	});
});
