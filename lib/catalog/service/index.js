/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const async = require('async');

let lib = {
	"createCatalog": (data, catalog, cb) => {
		let soa = data.soa.content;
		let repo = data.repo;
		if (data.oldCatalog) {
			catalog = JSON.parse(JSON.stringify(data.oldCatalog));
		}
		catalog.name = soa.name;
		catalog.type = "service";
		if (soa.description) {
			catalog.description = soa.description;
		}
		
		//configuration
		if (!catalog.configuration) {
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
		
		//metadata
		if (!catalog.metadata) {
			catalog.metadata = {};
		}
		if (soa.tags) {
			catalog.metadata.tags = soa.tags;
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
		
		//version
		let newVersions = [];
		let v = soa.version ? soa.version : "1";
		
		if (!catalog.versions) {
			//new record
			catalog.versions = [];
			let temp = {
				"version": v,
				"lastSync": {
					"ts": data.ts
				},
				"soa": JSON.stringify(soa),
				"apis": soa.schema
			};
			if (data.branch) {
				temp.lastSync.branch = data.branch;
				temp.branches = [data.branch];
			} else if (data.tag) {
				temp.lastSync.tag = data.tag;
				temp.tags = [data.tag];
			}
			
			if (data.documentation) {
				if (!temp.documentation) {
					temp.documentation = {};
				}
				if (data.documentation.readme) {
					temp.documentation.readme = data.documentation.readme;
				}
				if (data.documentation.release) {
					temp.documentation.release = data.documentation.release;
				}
			}
			if (data.swagger && data.swagger.content) {
				temp.swagger = JSON.stringify(data.swagger.content);
				catalog.configuration.swagger = true;
			}
			catalog.versions.push(temp);
			return cb(catalog);
		} else {
			let found = false;
			async.each(catalog.versions, function (oneVersion, callback) {
				if (oneVersion.version === v) {
					found = true;
					oneVersion.lastSync = {
						"ts": data.ts
					};
					if (data.branch) {
						oneVersion.lastSync.branch = data.branch;
						if (!oneVersion.branches) {
							oneVersion.branches = [];
						}
						let index = oneVersion.branches.indexOf(data.branch);
						if (index === -1) {
							oneVersion.branches.push(data.branch);
						}
					} else if (data.tag) {
						oneVersion.lastSync.tag = data.tag;
						if (!oneVersion.tags) {
							oneVersion.tags = [];
						}
						let index = oneVersion.tags.indexOf(data.tag);
						if (index === -1) {
							oneVersion.tags.push(data.tag);
						}
					}
					oneVersion.soa = JSON.stringify(soa);
					oneVersion.apis = soa.schema;
					if (data.swagger && data.swagger.content) {
						oneVersion.swagger = JSON.stringify(data.swagger.content);
						catalog.configuration.swagger = true;
					}
					if (data.documentation) {
						if (!oneVersion.documentation) {
							oneVersion.documentation = {};
						}
						if (data.documentation.readme) {
							oneVersion.documentation.readme = data.documentation.readme;
						}
						if (data.documentation.release) {
							oneVersion.documentation.release = data.documentation.release;
						}
					}
					newVersions.push(oneVersion);
				} else {
					if (data.branch) {
						if (oneVersion.branches) {
							let index = oneVersion.branches.indexOf(v);
							if (index > -1) {
								oneVersion.branches = oneVersion.branches.splice(index, 1);
							}
							if (oneVersion.branches.length > 0) {
								newVersions.push(oneVersion);
							}
						}
					} else if (data.tag) {
						if (oneVersion.tags) {
							let index = oneVersion.tags.indexOf(v);
							if (index > -1) {
								oneVersion.tags = oneVersion.tags.splice(index, 1);
							}
							if (oneVersion.tags.length > 0) {
								newVersions.push(oneVersion);
							}
						}
					}
					
				}
				return callback();
			}, function () {
				if (!found) {
					let temp = {
						"version": v,
						"lastSync": {
							"ts": data.ts
						},
						"soa": JSON.stringify(soa),
						"apis": soa.schema,
					};
					if (data.branch) {
						temp.lastSync.branch = data.branch;
						temp.branches = [data.branch];
					} else if (data.tag) {
						temp.lastSync.tag = data.tag;
						temp.tags = [data.tag];
					}
					if (data.documentation) {
						if (!temp.documentation) {
							temp.documentation = {};
						}
						if (data.documentation.readme) {
							temp.documentation.readme = data.documentation.readme;
						}
						if (data.documentation.release) {
							temp.documentation.release = data.documentation.release;
						}
					}
					if (data.swagger && data.swagger.content) {
						temp.swagger = JSON.stringify(data.swagger.content);
						catalog.configuration.swagger = true;
					}
					newVersions.push(temp);
				}
				catalog.versions = newVersions;
				return cb(catalog);
			});
		}
	},
	"createCatalogBackWordCompatibility": (catalog, soajs, cb) => {
		let service = {};
		service.name = catalog.name;
		service.description = catalog.description;
		service.type = catalog.type;
		
		if (catalog.configuration) {
			service.port = catalog.configuration.port;
			service.subType = catalog.configuration.subType;
			service.group = catalog.configuration.group;
			service.requestTimeout = catalog.configuration.requestTimeout;
			service.requestTimeoutRenewal = catalog.configuration.requestTimeoutRenewal;
			service.maintenance = catalog.configuration.maintenance;
			service.swagger = catalog.configuration.swagger;
			service.prerequisites = catalog.configuration.prerequisites;
		}
		
		if (catalog.metadata) {
			service.tags = catalog.metadata.tags;
			service.attributes = catalog.metadata.attributes;
			service.program = catalog.metadata.program;
		}
		
		service.tab = catalog.ui;
		
		service.src = catalog.src;
		
		service.versions = {};
		catalog.versions.forEach((oneVersion) => {
			let v = JSON.parse(JSON.stringify(oneVersion));
			service.versions[v.version.replace(".", "x")] = v;
			delete v.version;
		});
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
			if (response && response.src) {
				if (response.src.provider !== data.repo.provider ||
					response.src.owner !== data.repo.repository.split("/")[0] ||
					response.src.repo !== data.repo.repository.split("/")[1]) {
					duplicate = true;
				}
			}
			if (duplicate) {
				return cb(new Error("Duplicate found"));
			} else {
				delete response._id;
				data.oldCatalog = response;
				return cb(null, true);
			}
		});
	},
	"checkIfOldSchema": (data, cb) => {
		if (data.soa.content.serviceName) {
			data.soa.content.name = data.soa.content.serviceName;
			delete data.soa.content.serviceName;
		}
		if (data.soa.content.serviceGroup) {
			data.soa.content.group = data.soa.content.serviceGroup;
			delete data.soa.content.serviceGroup;
		}
		if (data.soa.content.serviceVersion) {
			data.soa.content.version = data.soa.content.serviceVersion.toString();
			delete data.soa.content.serviceVersion;
		}
		if (data.soa.content.servicePort) {
			data.soa.content.port = data.soa.content.servicePort;
			delete data.soa.content.servicePort;
		}
		return cb();
	},
};
module.exports = lib;
