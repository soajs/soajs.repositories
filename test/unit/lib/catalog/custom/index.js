/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../../../helper.js");
const lib = helper.requireModule('lib/catalog/custom/index.js');

describe("Unit test for: index", () => {
	describe("Unit test createCatalog", () => {
		it("Success - custom", (done) => {
			let data = {
				"branch" : "test",
				"tag" : "test",
				"soa" : {
					"content": {
						"name": "micro1",
						"group": "config",
						"description": "sdsdsdsd",
						"version": "1.0",
						"type": "custom",
						"subType": "config",
						"tags": ["github", "bitbucket", "private", "public"],
						"attributes": {
							"github": ["personal", "organization", "twitter", "github"],
							"bitbucket": ["saas", "enterprise", "projects"]
						},
						"program": ["soajs"],
						"profile" : {},
						"tab": {
							"main": "Main-tab",
							"sub": "Sub-tab"
						},
						"documentation": {
							"readme": "README.md",
							"release": "RELEASE.md"
						}
					}
				},
				"repo": {
					"_id": "5f3fca7db458b8e2b4268184",
					"domain": "github.com",
					"repository": "soajs/soajs.repositories",
					"name": "soajs.repositories",
					"owner": "soajs",
					"provider": "github",
					"source": [
						{
							"name": "soajs",
							"ts": 1598016140548
						}
					],
					"ts": 1598016140548,
					"type": "repository",
					"active": true,
					"branches": [
						{
							"name": "develop",
							"active": true,
							"ts": 1598016165799
						},
						{
							"name": "feature/HER-2146-7-8"
						},
						{
							"name": "master"
						},
						{
							"name": "release/v1.x"
						}
					]
				},
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				}
			};
			lib.createCatalog(data, {}, ()=>{
				done();
			});
		});
	});
});