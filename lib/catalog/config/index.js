/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const async = require('async');

module.exports = {
	"createCatalog": (data, catalog, cb) => {
		let soa = data.soa.content;
		let repo = data.repo;
		catalog.soa = {
			name: soa.name,
			type: "config",
			group: soa.group,
			description: soa.description,
			version: soa.version,
		};
		if (soa.subType) {
			catalog.soa.subType = soa.subType;
		}
		if (soa.tags) {
			catalog.soa.tags = soa.tags;
		}
		if (soa.attributes) {
			catalog.soa.tags = soa.attributes;
		}
		if (soa.tab) {
			catalog.soa.tags = soa.tab;
		}
		if (soa.program) {
			catalog.soa.program = soa.program;
		}
		if (soa.documentation) {
			catalog.soa.documentation = soa.documentation;
		}
		if (soa.profile) {
			catalog.soa.profile = soa.profile;
		}
		
		//src
		catalog.src = {
			"provider": repo.provider,
			"owner": repo.repository.split("/")[0],
			"repo": repo.repository.split("/")[1],
		};
		if (data.branch) {
			catalog.src.branch = data.branch;
		}
		if (data.tag) {
			catalog.src.tag = data.tag;
		}
		
		//documentation
		if (data.documentation && (data.documentation.readme || data.documentation.release)) {
			catalog.documentation = {};
			if (data.documentation.readme) {
				catalog.documentation.readme = data.documentation.readme;
			}
			if (data.documentation.release) {
				catalog.documentation.release = data.documentation.release;
			}
		}
		return cb(catalog);
	},
	
	"checkIfOldSchema": (data, cb) => {
		return cb();
	},
};
