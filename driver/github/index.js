/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const Octokit = require("@octokit/rest");
const shortid = require("shortid");
const async = require("async");

const helper = require("./helper");

function Github(service, data) {
	let __self = this;
	
	let auth = {};
	
	__self.type = data.type;
	__self.access = data.access;
	__self.provider = data.provider;
	__self.domain = data.domain;
	__self.service = service;
	__self.username = data.username;
	__self.label = data.label;
	if (data.token) {
		auth.token = data.token;
		__self.token = data.token;
	}
	if (__self.access === "private") {
		if (data.password && data.username) {
			auth.password = data.password;
			auth.username = data.username;
			
			__self.password = data.password;
		}
	}
	if ((auth.token || auth.password) && data.on2fa) {
		auth.on2fa = () => {
			return Promise.resolve(data.on2fa)
		};
		__self.on2fa = data.on2fa;
	}
	
	__self.service.log.debug("Git Init!");
	if (Object.keys(auth).length > 0) {
		__self.github = new Octokit({auth: auth});
	} else {
		__self.github = new Octokit();
	}
}

Github.prototype.getRepositories = function (data, cb) {
	
	let __self = this;
	if (__self.access === "public") {
		if (__self.type === 'personal') {
			__self.github.repos.listForUser({
				username: __self.username,
				per_page: data.per_page || '100',
				page: data.page || 1
			}).then(({data, headers}) => {
				return cb(null, data, headers);
			}).catch((err) => {
				return cb(err);
			});
		} else {
			__self.github.repos.listForOrg({
				org: __self.username,
				per_page: data.per_page || '100',
				page: data.page || 1
			}).then(({data, headers}) => {
				return cb(null, data, headers);
			}).catch((err) => {
				return cb(err);
			});
		}
	} else {
		__self.github.repos.list({
			username: __self.username,
			visibility: "all",
			per_page: data.per_page || '500',
			page: data.page || 1
		}).then(({data, headers}) => {
			return cb(null, data, headers);
		}).catch((err) => {
			return cb(err);
		});
	}
};

Github.prototype.createAuthToken = function (data, cb) {
	let __self = this;
	__self.github.oauthAuthorizations.createAuthorization({
		note: 'SOAJS GitHub App Token (soajs_' + shortid.generate() + ')',
		scopes: data.config.gitAccounts.github.tokenScope,
	}).then(({data}) => {
		return cb(null, data);
	}).catch((err) => {
		return cb(err);
	});
};

Github.prototype.validate = function (data, cb) {
	let __self = this;
	if (__self.type === 'personal') {
		__self.github.users.getByUsername({
			username: __self.username
		}).then(({data}) => {
			return cb(null, data);
		}).catch((err) => {
			return cb(err);
		});
	} else {
		__self.github.orgs.get({
			org: __self.username
		}).then(({data}) => {
			return cb(null, data);
		}).catch((err) => {
			return cb(err);
		});
	}
};

Github.prototype.createAccountRecord = function (data, cb) {
	let __self = this;
	let record = {
		owner: __self.username,
		accountType: __self.type,
		access: __self.access,
		provider: __self.provider,
		domain: __self.domain,
		label: __self.label,
		type: "account",
		GID: data.id
	};
	if (data.token) {
		record.token = data.token
	}
	return record;
};

Github.prototype.createRepositoryRecord = function (data) {
	let __self = this;
	return {
		repository: data.full_name,
		name: data.name,
		type: data.owner.type,
		owner: __self.username,
		provider: __self.provider,
		domain: __self.domain
	};
};

Github.prototype.extractRepos = function (data) {
	let __self = this;
	let opts = {};
	__self.getRepositories(opts, (err, records, headers) => {
		if (err) {
			__self.service.log.error(err);
		}
		let count = 0;
		if (records && records.length > 0) {
			async.each(records, (record, call) => {
				count++;
				data.mongo.updateRepository(__self.createRepositoryRecord(record), call);
			}, (err) => {
				if (err) {
					__self.service.log.error(err);
				}
				helper.getRepoPages(headers, (err, pages) => {
					if (err) {
						__self.service.log.error(err);
					}
					if (pages > 1) {
						async.timesSeries(pages - 1, function (n, next) {
							//skip the first page
							__self.getRepositories({page: n + 2}, function (err, records) {
								if (err) {
									__self.service.log.error(err);
								}
								async.each(records, (record, call) => {
									count++;
									data.mongo.updateRepository(__self.createRepositoryRecord(record), call);
								}, next);
							});
							__self.service.log.info(count , "Repositories Added So Far... ");
						}, function (err) {
							if (err) {
								__self.service.log.error(err);
							}
							__self.service.log.info(count , "Repositories Added Successfully!");
						});
					}
					else {
						__self.service.log.info(count , "Repositories Added Successfully!");
					}
				});
			});
		}
	});
	
};

module.exports = Github;