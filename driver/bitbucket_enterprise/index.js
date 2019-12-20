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
	
	__self.type = data.type;
	__self.access = data.access;
	__self.provider = data.provider;
	__self.domain = data.domain;
	__self.service = service;
	__self.username = data.username;
	__self.label = data.label;
	if (data.token) {
		__self.token = data.token;
	}
	else if (__self.access === "private") {
		__self.token = new Buffer(data.username + ":" + data.password).toString('base64');
	}
	service.log.debug("Bitbucket Enterprise Git Init!");
}

Bitbucket_enterprise.prototype.createRepositoryRecord = function (data) {
	let __self = this;
	return {
		repository: data.project.name + "/" + data.name,
		name: data.name,
		type: "repository",
		owner: data.project.name,
		provider: __self.provider,
		source: {
			name: __self.username,
			ts : data.ts
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
	if (!__self.manifest){
		__self.manifest = {
			count : 0
		};
	}
	__self.manifest.count++;
	data.page = __self.manifest.count;
	helper.getRepositories(__self, data, (err, records) => {
		if (err) {
			return cb(err);
		}
		return cb(null, {
			records: records && records.values && records.values.length > 0 ? records.values : [],
			next : !records.isLastPage
		});
		
	});
};

module.exports = Bitbucket_enterprise;