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
		catalog.type = "daemon";
		if (soa.description) {
			catalog.description = soa.description
		}
		
		//configuration
		if (!catalog.configuration){
			catalog.configuration = {};
		}
		if (soa.port) {
			catalog.configuration.port = soa.port;
		}
		if (soa.group) {
			catalog.configuration.group = soa.group;
		}
		if (soa.requestTimeout) {
			catalog.configuration.requestTimeout = soa.requestTimeout;
		}
		if (soa.requestTimeoutRenewal) {
			catalog.configuration.requestTimeoutRenewal = soa.requestTimeoutRenewal;
		}
		if (soa.maintenance) {
			catalog.configuration.maintenance = soa.maintenance;
		}
		if (soa.subType) {
			catalog.configuration.subType = soa.subType;
		}
		if (soa.subType) {
			catalog.configuration.subType = soa.subType;
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
			"provider": repo.provider,
			"owner": repo.repository.split("/")[0],
			"repo": repo.repository.split("/")[1]
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
				"apis": soa.schema,
				"branches": [
					data.branch
				]
			};
			if (soa.jobs){
				temp.jobs = {};
				soa.jobs.forEach((job)=>{
					temp.jobs[job] = {};
				});
				
			}
			if (data.swagger.content && data.swagger.content) {
				temp.swagger = JSON.stringify(data.swagger.content);
				catalog.configuration.swagger = true;
			}
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
					oneVersion.apis = soa.schema;
					if (data.swagger.content && data.swagger.content) {
						oneVersion.swagger = JSON.stringify(data.swagger.content);
						catalog.configuration.swagger = true;
					}
					if (!oneVersion.branches){
						oneVersion.branches = []
					}
					if (soa.jobs){
						oneVersion.jobs = {};
						soa.jobs.forEach((job)=>{
							oneVersion.jobs[job] = {};
						});
						
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
	"createCatalogBackWordCompatibility": (catalog, soajs, cb) => {
		let daemon = {};
		daemon.name = catalog.name;
		daemon.description = catalog.description;
		daemon.type = catalog.type;
		
		if (catalog.configuration) {
			daemon.port = catalog.configuration.port;
			daemon.subType = catalog.configuration.subType;
			daemon.group = catalog.configuration.group;
			daemon.requestTimeout = catalog.configuration.requestTimeout;
			daemon.requestTimeoutRenewal = catalog.configuration.requestTimeoutRenewal;
			daemon.maintenance = catalog.configuration.maintenance;
			daemon.swagger = catalog.configuration.swagger;
			daemon.prerequisites = catalog.configuration.prerequisites;
			daemon.jobs = catalog.configuration.jobs;
		}
		
		if (catalog.metadata) {
			daemon.tags = catalog.metadata.tags;
			daemon.attributes = catalog.metadata.attributes;
			daemon.program = catalog.metadata.program;
		}
		
		daemon.tab = catalog.ui;
		
		daemon.source = catalog.source;
		
		daemon.versions = {};
		catalog.versions.forEach((oneVersion) => {
			let v = JSON.parse(JSON.stringify(oneVersion));
			daemon.versions[v.version.replace(".", "x")] = v;
			delete v.version;
		});
		return cb(null, daemon);
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
					|| response.src.owner !== info.src.owner
					|| response.src.repo !== info.src.repo) {
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
