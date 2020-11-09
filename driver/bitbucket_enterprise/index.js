/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const helper = require("./helper");

function Bitbucket_enterprise(service, data) {
	let __self = this;
	
	__self.type = data.accountType || data.type;
	__self.access = data.access;
	__self.provider = data.provider;
	__self.domain = data.domain;
	__self.service = service;
	__self.username = data.username || data.owner;
	__self.label = data.label;
	if (data.token) {
		__self.token = data.token;
	} else if (__self.access === "private") {
		__self.token = new Buffer.from(data.username + ":" + data.password).toString('base64');
	}
	service.log.debug("Bitbucket Enterprise Git Init!");
}

Bitbucket_enterprise.prototype.createRepositoryRecord = function (data) {
	let __self = this;
	return {
		repository: data.project.key + "/" + data.name,
		name: data.name,
		type: "repository",
		owner: data.project.key,
		provider: __self.provider,
		source: {
			name: __self.username,
			ts: data.ts
		},
		domain: __self.domain,
		ts: data.ts
	};
};

Bitbucket_enterprise.prototype.login = function (data, cb) {
	let __self = this;
	helper.validate(__self, data, (err) => {
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
			GID: __self.id
		};
		if (__self.access === 'private') {
			account.token = __self.token;
			return cb(null, account);
		} else {
			return cb(null, account);
		}
	});
};

Bitbucket_enterprise.prototype.getRepositories = function (data, cb) {
	let __self = this;
	if (!__self.manifest) {
		__self.manifest = {
			count: 0
		};
	}
	data.page = __self.manifest.count;
	helper.getRepositories(__self, data, (err, records) => {
		__self.manifest.count++;
		if (err) {
			return cb(err);
		}
		return cb(null, {
			records: records && records.values && records.values.length > 0 ? records.values : [],
			next: !records.isLastPage
		});
		
	});
};

Bitbucket_enterprise.prototype.getOwner = function () {
	let __self = this;
	return __self.username;
};

Bitbucket_enterprise.prototype.listBranches = function (data, cb) {
	let __self = this;
	helper.listBranches(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		let branches = [];
		if (response && response.values && response.values.length > 0) {
			response.values.forEach((oneValue) => {
				let temp = {};
				temp.name = oneValue.displayId;
				branches.push(temp);
			});
		}
		return cb(null, branches);
	});
};

Bitbucket_enterprise.prototype.listTags = function (data, cb) {
	let __self = this;
	helper.listTags(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		let tags = [];
		if (response && response.values && response.values.length > 0) {
			response.values.forEach((oneValue) => {
				let temp = {};
				temp.name = oneValue.displayId;
				tags.push(temp);
			});
		}
		return cb(null, tags);
	});
};

Bitbucket_enterprise.prototype.getOrganizations = function (data, cb) {
	let __self = this;
	helper.getProjects(__self, data, (err, records) => {
		if (err) {
			return cb(err);
		}
		let projects = [];
		if (records && records.values && records.values.length > 0) {
			records.values.forEach((project) => {
				projects.push(project.key);
			});
		}
		return cb(null, projects);
	});
	
};

Bitbucket_enterprise.prototype.getBranch = function (data, cb) {
	let __self = this;
	helper.listBranches(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		let branch = null;
		if (response && response.values && response.values.length > 0) {
			response.values.forEach((oneValue) => {
				if (oneValue.displayId === data.branch) {
					branch = {
						name: data.branch,
						commit: data.latestCommit
					};
				}
			});
		}
		return cb(!branch, branch);
	});
};

Bitbucket_enterprise.prototype.getTag = function (data, cb) {
	let __self = this;
	helper.getTag(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		return cb(null, response);
	});
};

Bitbucket_enterprise.prototype.getFile = function (data, cb) {
	let __self = this;
	helper.getFile(__self, data, (err, response) => {
		if (err) {
			return cb(err);
		}
		let content = "";
		for (let i = 0; i < response.lines.length; ++i) {
			content += response.lines[i].text;
			if (response.lines.length - 1 !== i) {
				content += "\n";
			}
		}
		return cb(null, {
			content: content.toString(),
		});
	});
};

Bitbucket_enterprise.prototype.logout = function (data, cb) {
	return cb(null, true);
};

module.exports = Bitbucket_enterprise;