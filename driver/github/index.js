/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const { Octokit } = require("@octokit/rest");
const helper = require("./helper");

function Github(service, data) {
	let __self = this;
	
	let auth = {};
	__self.type = data.accountType || data.type;
	__self.access = data.access;
	__self.provider = data.provider;
	__self.domain = data.domain;
	__self.service = service;
	__self.username = data.username || data.owner;
	__self.label = data.label;
	if (__self.access === "private" && data.token) {
			auth.token = data.token;
			__self.token = data.token;
	}
	else if (data.token) {
		auth.token = data.token;
		__self.token = data.token;
		
	}
	if (data.tokenId){
		__self.tokenId = data.tokenId;
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
				if (err) {
					return cb(err);
				}
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
			account.token = __self.token;
			return cb(null, account);
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
		if (orgs && orgs.length > 0) {
			orgs.forEach((org) => {
				organizations.push(org.login);
			});
		}
		return cb(null, organizations);
	});
};

Github.prototype.logout = function (data, cb) {
	return cb(null, true);
};

Github.prototype.getFile = function (data, cb) {
	let __self = this;
	helper.getFile(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		return cb(null, {
			content: response.content ? new Buffer.from(response.content, 'base64').toString() : response,
		});
	});
};

Github.prototype.listBranches = function (data, cb) {
	let __self = this;
	helper.listBranches(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		let branches = [];
		if (response && response.length > 0) {
			response.forEach((branch) => {
				let temp = {};
				temp.name = branch.name;
				branches.push(temp);
			});
		}
		return cb(null, branches);
	});
};

Github.prototype.listTags = function (data, cb) {
	let __self = this;
	helper.listTags(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		let tags = [];
		if (response && response.length > 0) {
			response.forEach((tag) => {
				let temp = {};
				temp.name = tag.name;
				tags.push(temp);
			});
		}
		return cb(null, tags);
	});
};

Github.prototype.getTag = function (data, cb) {
	let __self = this;
	
	helper.getTag(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		return cb(null, {
			name: response.ref.split("/")[2]
		});
	});
};

Github.prototype.getBranch = function (data, cb) {
	let __self = this;
	helper.getBranch(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		if (data.commit && response){
			return cb(null, {
				name : response.name,
				commit: response.commit.sha,
			});
		}
		if (response){
			return cb(null, response.name);
		}
		//no branch
		else {
			return cb(true);
		}
	});
};

module.exports = Github;
