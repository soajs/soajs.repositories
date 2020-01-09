/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const Octokit = require("@octokit/rest");
const helper = require("./helper");

function Github(service, data) {
	let __self = this;
	
	let auth = {};
	
	__self.type = data.type;
	__self.access = data.access;
	__self.provider = data.provider;
	__self.domain = data.domain;
	__self.service = service;
	__self.username = data.username || data.owner;
	__self.label = data.label;
	if (data.token) {
		auth.token = data.token;
		__self.token = data.token;
	} else if (__self.access === "private") {
		if (data.password && data.username) {
			auth.token = {
				password: data.password,
				username: data.username
			};
			__self.password = data.password;
		}
	}
	
	if (auth.token && data.on2fa) {
		auth.on2fa = () => {
			return Promise.resolve(data.on2fa);
		};
		__self.on2fa = data.on2fa;
	}
	
	__self.service.log.debug("Github Git Init!");
	if (Object.keys(auth).length > 0) {
		__self.github = new Octokit({auth: auth.token});
	} else {
		__self.github = new Octokit();
	}
}

Github.prototype.getRepositories = function (data, cb) {
	let __self = this;
	if (!__self.manifest) {
		__self.manifest = {
			total: 0,
			count: 0
		};
	}
	__self.manifest.count++;
	data.page = __self.manifest.count;
	helper.getRepositories(__self, data, (err, records, headers) => {
		if (err) {
			return cb(err);
		}
		if (__self.manifest.count === 1) {
			helper.getRepoPages(headers, (err, pages) => {
				__self.manifest.total = Number(pages);
				return cb(null, {
					records: records && records.length > 0 ? records : [],
					pages,
					next: pages > 1
				});
			});
		} else {
			return cb(null, {
				records: records && records.length > 0 ? records : [],
				pages: __self.manifest.total,
				next: __self.manifest.count < __self.manifest.total
			});
		}
	});
};

Github.prototype.login = function (data, cb) {
	let __self = this;
	helper.validate(__self, (err, record) => {
		if (err) {
			return cb(err);
		}
		let account = {
			owner: __self.username,
			accountType: __self.type,
			access: __self.access,
			provider: __self.provider,
			domain: __self.domain,
			label: __self.label,
			type: "account",
			metadata: {
				organizations: [],
			},
			GID: record.id
		};
		if (__self.access === 'private') {
			helper.createToken(__self, data, (err, result) => {
				if (err) {
					return cb(err);
				} else {
					account.token = result.token;
					return cb(null, account);
				}
			});
		} else {
			return cb(null, account);
		}
		
	});
};

Github.prototype.createRepositoryRecord = function (data) {
	let __self = this;
	return {
		repository: data.full_name,
		name: data.name,
		type: "repository",
		owner: data.owner.login,
		source: {
			name: __self.username,
			ts: data.ts
		},
		provider: __self.provider,
		domain: __self.domain,
		ts: data.ts
	};
};

Github.prototype.getOwner = function () {
	let __self = this;
	return __self.username;
};

Github.prototype.getOrganizations = function (data, cb) {
	let __self = this;
	helper.getOrganizations(__self, (err, orgs) => {
		if (err) {
			return cb(err);
		}
		let organizations = [];
		if (orgs && orgs.length > 0){
			orgs.forEach((org)=>{
				organizations.push(org.login);
			});
		}
		return cb(null, organizations);
	});
};

module.exports = Github;
