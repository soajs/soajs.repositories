/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const request = require('request');
const async = require('async');

const helper = require("./helper");

function requester(options, cb) {
	options.json = true;
	
	if (!options.headers) {
		options.headers = {};
	}
	
	options.headers['Content-Type'] = 'application/json';
	request(options, function (error, response, body) {
		return cb(error, body);
	});
}

function Bitbucket(service, data) {
	let __self = this;
	
	__self.type = data.type;
	__self.access = data.access;
	__self.provider = data.provider;
	__self.domain = data.domain;
	__self.service = service;
	__self.username = data.username;
	__self.label = data.label;
	__self.password = data.password;
	__self.oauthKey = data.oauthKey;
	__self.oauthSecret = data.oauthSecret;
	service.log.debug("Git Init!");
}



Bitbucket.prototype.createAuthToken = function (data, cb) {
	let __self = this;
	let formData = {};
	formData.grant_type = 'password';
	formData.username = __self.username;
	formData.password = __self.password;
	let options = {
		method: 'POST',
		json: true,
		url: data.config.gitAccounts.bitbucket.oauth.domain,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		auth: {
			user: __self.oauthKey,
			pass: __self.oauthSecret
		},
		form: formData
	};
	requester(options, cb);
};

Bitbucket.prototype.validate = function (data, cb) {
	let __self = this;
	const options = {
		method: 'GET',
		url: data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.validateUser.replace("%USERNAME%", __self.username)
	};
	
	requester(options, function (error, record) {
		if (error) {
			return cb(error);
		}
		if (!record || typeof record !== "object") {
			return cb({message: 'User does not exist'});
		}
		if (record.account_id){
			__self.account_id = record.account_id;
		}
		record.id = record.account_id;
		return cb(null, record);
	});
};

Bitbucket.prototype.createAccountRecord = function (response) {
	let __self = this;
	let record = {
		owner: __self.username,
		accountType: __self.type,
		access: __self.access,
		provider: __self.provider,
		domain: __self.domain,
		label: __self.label,
		type: "account",
		GID: __self.account_id
	};
	if (response && response.access_token){
		record.token = response.access_token;
		__self.token = response.access_token;
		__self.expires_in = response.expires_in;
		__self.refresh_token = response.refresh_token;
		if ( response.refresh_token && response.expires_in){
			record.tokenInfo = {
				refresh_token: response.refresh_token,
				created: (new Date).getTime(),
				expires_in: response.expires_in * 1000
			};
			
		}
	}
	return record;
};

Bitbucket.prototype.getRepositories = function (data, cb) {
	let __self = this;
	const options = {
		method: 'GET',
		url: data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", __self.account_id || __self.username),
		qs: {
			pagelen: data.per_page || '5',
			page:  data.page || 1,
		}
	};
	if (__self.token) {
		options.headers = {
			authorization: 'Bearer ' + __self.token
		};
	}
	requester(options, function (error, records) {
		if (error) {
			return cb(error);
		}
		return cb(null, records);
	});
};

Bitbucket.prototype.createRepositoryRecord = function (data) {
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

Bitbucket.prototype.extractRepos = function (data) {
	let __self = this;
	let opts = {
		config: data.config
	};
	
	__self.getRepositories(opts, (err, records) => {
		if (err) {
			__self.service.log.error(err);
		}
		let count = 0;
		if (records && records.values && records.values.length > 0) {
			async.each(records.values, (record, call) => {
				count++;
				data.mongo.updateRepository(__self.createRepositoryRecord(record), call);
			}, (err) => {
				if (err) {
					__self.service.log.error(err);
				}
				let pageInfo = {
					pagelen: records.pagelen,
					size: records.size
				};
				helper.getRepoPages(pageInfo, (err, pages) => {
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

module.exports = Bitbucket;