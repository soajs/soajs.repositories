/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

let lib = {
	"createCatalog": (data, catalog, cb) => {
		let soa = data.soa.content;
		let repo = data.repo;
		catalog.soa = {
			name: soa.name,
			type: "service",
			group: soa.group,
			description: soa.description,
			port: soa.port,
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
			catalog.soa.tab = soa.tab;
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
		if (soa.interConnect) {
			catalog.soa.interConnect = soa.interConnect;
		}
		if (soa.requestTimeout) {
			catalog.soa.requestTimeout = soa.requestTimeout;
		}
		if (soa.requestTimeoutRenewal) {
			catalog.soa.requestTimeoutRenewal = soa.requestTimeoutRenewal;
		}
		if (soa.maintenance) {
			catalog.soa.maintenance = soa.maintenance;
		}
		if (soa.prerequisites) {
			catalog.soa.prerequisites = soa.prerequisites;
		}
		if (soa.hasOwnProperty("extKeyRequired")){
			catalog.soa.extKeyRequired = soa.extKeyRequired;
		}
		if (soa.hasOwnProperty("oauth")){
			catalog.soa.oauth = soa.oauth;
		}
		if (soa.hasOwnProperty("urac")){
			catalog.soa.urac = soa.urac;
		}
		if (soa.hasOwnProperty("urac_Profile")){
			catalog.soa.urac_Profile = soa.urac_Profile;
		}
		if (soa.hasOwnProperty("urac_Config")){
			catalog.soa.urac_Config = soa.urac_Config;
		}
		if (soa.hasOwnProperty("urac_GroupConfig")){
			catalog.soa.urac_GroupConfig = soa.urac_GroupConfig;
		}
		if (soa.hasOwnProperty("urac_ACL")){
			catalog.soa.urac_ACL = soa.urac_ACL;
		}
		if (soa.hasOwnProperty("tenant_Profile")){
			catalog.soa.tenant_Profile = soa.tenant_Profile;
		}
		if (soa.hasOwnProperty("provision_ACL")){
			catalog.soa.provision_ACL = soa.provision_ACL;
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
		if (soa.subType === "soajs"){
			if (data.swagger && data.swagger.content) {
				catalog.apiList = {
					schema :  data.swagger.content,
					type : "swagger"
				}
			}
			else if (soa.schema) {
				catalog.apiList = {
					schema :  soa.schema,
					type : "schema"
				}
			}
		}
		else {
			if (data.swagger && data.swagger.content) {
				catalog.swagger = data.swagger.content;
			}
		}
		return cb(catalog);
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
