/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

module.exports = {
	"createCatalog": (data, catalog, cb) => {
		let soa = data.soa.content;
		let repo = data.repo;
		if (data.oldCatalog){
			catalog = JSON.parse(JSON.stringify(data.catalog));
		}
		catalog.name = soa.name;
		catalog.type = "custom";
		if (soa.description) {
			catalog.description = soa.description
		}
		//metadata
		if (!catalog.metadata){
			catalog.metadata = {};
		}
		if (soa.tags) {
			catalog.metadata.description = soa.tags;
		}
		if (soa.attributes) {
			catalog.metadata.attributes = soa.attributes;
		}
		if (soa.program) {
			catalog.metadata.program = soa.program;
		}
		
		//src
		catalog.src = {
			"provider" : repo.provider,
			"owner" : repo.repository.split("/")[0],
			"repo" : repo.repository.split("/")[1]
		};
		
		//ui
		if (soa.tab) {
			catalog.ui = soa.tab;
		}
		
		//documentation
		if (data.documentation) {
			if (!catalog.documentation){
				catalog.documentation = {};
			}
			if (data.documentation.readme) {
				catalog.documentation.readme = JSON.stringify(data.documentation.readme);
			}
			if (data.documentation.release) {
				catalog.documentation.release = JSON.stringify(data.documentation.release);
			}
		}
		
		//version
		catalog.versions = [];
		let temp = {
			"version": soa.version ? soa.version : "1",
			"lastSync": {
				"branch": data.branch,
				"ts": data.ts
			},
			"soa": JSON.stringify(soa),
			"branches": [
				data.branch
			]
		};
		if (data.documentation){
			temp.documentation = {};
			if (data.documentation.readme){
				temp.documentation.readme = JSON.stringify(data.documentation.readme);
			}
			if (data.documentation.release){
				temp.documentation.release = JSON.stringify(data.documentation.release);
			}
		}
		catalog.versions.push(temp);
		
		//version
		let newVersions = [];
		let v = soa.version ? soa.version : "1";
		if (!catalog.versions){
			//new record
			catalog.versions = [];
			let temp = {
				"version": v,
				"lastSync": {
					"branch": data.branch,
					"ts": data.ts
				},
				"soa": JSON.stringify(soa),
				"branches": [
					data.branch
				]
			};
			catalog.versions.push(temp);
			return cb(null, true);
		}
		else {
			async.each(catalog.versions, function(oneVersion, callback) {
				if (oneVersion.version === v){
					oneVersion.lastSync = {
						"branch": data.branch,
						"ts": data.ts
					};
					oneVersion.soa = JSON.stringify(soa);
					if (!oneVersion.branches){
						oneVersion.branches = []
					}
					oneVersion.branches.push(data.branch);
					newVersions.push(oneVersion);
				}
				else {
					if (oneVersion.branches ){
						let index = oneVersion.branches.indexOf(oneVersion);
						if (index > -1){
							oneVersion.branches = oneVersion.branches.splice(index, 1);
						}
						if (oneVersion.branches.length > 0){
							newVersions.push(oneVersion);
						}
					}
				}
				callback();
			}, function() {
				catalog.versions = newVersions;
				return cb(null, true);
			});
		}
	},
	"createCatalogBackWordCompatibility": (catalog, soajs, models, cb) => {
		return cb(null, true);
	},
	"checkCanUpdate": (data, catalog, models, cb) => {
		let opts = {
			type: catalog.type,
			name: catalog.name
		};
		models.modelObjMarketPlace.getCatalog(opts, (error, response) => {
			if (error) {
				return cb(error);
			}
			if (!response) {
				return cb(null, true);
			}
			let duplicate = false;
			if (response && response.src){
				if (response.src.provider !== catalog.src.provider
					|| response.src.owner !== catalog.src.owner
					|| response.src.repo !== catalog.src.repo) {
					duplicate = true;
				}
			}
			if (duplicate){
				return cb(new Error("Duplicate found"));
			}
			else {
				data.oldCatalog = response;
				return cb(null, true);
			}
		});
	}
};
