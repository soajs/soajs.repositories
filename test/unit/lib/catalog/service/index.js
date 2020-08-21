/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../../../helper.js");
const lib = helper.requireModule('lib/catalog/service/index.js');

describe("Unit test for: index", () => {
	describe("Unit test createCatalog", () => {
		it("Success - service swagger", (done) => {
			let data = {
				"branch" : "test",
				"tag" : "test",
				"soa" : {
					"content": {
						"name": "micro1",
						"group": "config",
						"description": "sdsdsdsd",
						"version": "1.0",
						"type": "config",
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
						"interConnect": [{
							"name": "marketplace",
							"version": "1"
						}],
						"requestTimeout": 5,
						"requestTimeoutRenewal" : 5,
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {"type": "maintenance"},
							"commands": [
								{"label": "Reload Registry", "path": "/reloadRegistry", "icon": "fas fa-undo"},
								{"label": "Resource Info", "path": "/resourceInfo", "icon": "fas fa-info"}
							]
						},
						"oauth": true,
						"extKeyRequired": true,
						"urac": true,
						"urac_Profile": true,
						"urac_Config": true,
						"urac_GroupConfig": true,
						"urac_ACL": true,
						"tenant_Profile": true,
						"provision_ACL": true,
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
				},
				"swagger" :{
					"content" : {
						"data" : "dummy"
					}
				}
			};
			lib.createCatalog(data, {}, ()=>{
				done();
			});
		});
		
		it("Success - service ", (done) => {
			let data = {
				"branch" : "test",
				"tag" : "test",
				"soa" : {
					"content": {
						"name": "micro1",
						"group": "config",
						"description": "sdsdsdsd",
						"version": "1.0",
						"type": "config",
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
						"interConnect": [{
							"name": "marketplace",
							"version": "1"
						}],
						"requestTimeout": 5,
						"requestTimeoutRenewal" : 5,
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {"type": "maintenance"},
							"commands": [
								{"label": "Reload Registry", "path": "/reloadRegistry", "icon": "fas fa-undo"},
								{"label": "Resource Info", "path": "/resourceInfo", "icon": "fas fa-info"}
							]
						},
						"prerequisites": {},
						"oauth": true,
						"extKeyRequired": true,
						"urac": true,
						"urac_Profile": true,
						"urac_Config": true,
						"urac_GroupConfig": true,
						"urac_ACL": true,
						"tenant_Profile": true,
						"provision_ACL": true,
						"documentation": {
							"readme": "README.md",
							"release": "RELEASE.md"
						},
						"schema" : {}
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
				},
			};
			lib.createCatalog(data, {}, ()=>{
				done();
			});
		});
	});
});