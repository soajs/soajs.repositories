
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/index.js');

describe("Unit test for: BLs", () => {
	
	let soajs = {
		config: {
			"errors": {
				400: "Business logic required data are missing",
				
				401: "Username or Token required",
				402: "User account already exists",
				403: "Account does not exist",
				601: "Model not found",
				602: "Model error: ",
				603: "Provider not found",
			},
		},
		log: {
			error: () => {
				console.log();
			},
			debug: () => {
				console.log();
			}
		},
		registry: {
			get: () => {
				return {
					"coreDB": {
						"provision": {
							"name": "core_provision",
							"prefix": "",
							"servers": [
								{
									"host": "127.0.0.1",
									"port": 27017
								}
							],
							"credentials": null,
							"URLParam": {
							}
						}
					}
				};
			}
		}
	};
	
	describe("Unit test index init", () => {
		it("Success - init", (done) => {
			BL.init(soajs, soajs.config, () => {
				done();
			});
		});
	});
	
});
