/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const imported = require("../data/import.js");
let helper = require("../helper.js");

let service, controller, marketplace;

describe("starting integration tests", () => {
	
	before((done) => {
		let rootPath = process.cwd();
		imported.runPath(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/integration/", true, null, (err, msg) => {
			if (err) {
				console.log(err);
			}
			if (msg) {
				console.log(msg);
			}
			console.log("Starting Controller");
			controller = require("soajs.controller/_index.js");
			controller.runService(() => {
				console.log("Starting marketplace ...");
				marketplace = require('soajs.marketplace/_index.js');
				marketplace.runService(() => {
					console.log("Starting repositories ...");
					service = helper.requireModule('./_index.js');
					service.runService(() => {
						setTimeout(function () {
							done();
						}, 5000);
					});
				});
			});
		});
	});
	
	it("loading USE Case", (done) => {
		require("./UC1/test.js");
		done();
	});
	
	it("loading use cases", (done) => {
		done();
	});
});
