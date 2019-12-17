/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const request = require('request');

function requester(options, cb) {
	options.json = true;
	
	if (!options.headers) {
		options.headers = {};
	}
	console.log(options, cb)
	options.headers['Content-Type'] = 'application/json';
	request(options, function (error, response, body) {
		return cb(error, body);
	});
}

const helper = {
	"getRepoPages": (opts, cb) => {
		let count = 1;
		try {
			count = Math.ceil(opts.size / opts.pagelen);
			return cb(null, count);
		} catch (e) {
			return cb(null, count);
		}
	},
	"validate": (self, data, cb) => {
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain)
				+ data.config.gitAccounts.bitbucket_enterprise.routes.validateUser.replace("%USERNAME%", self.username)
		};
		if (self.token){
			options.headers = {
				Authorization: 'Basic ' + self.token
			};
		}
		requester(options, function (error, record) {
			if (error) {
				return cb(error);
			}
			if (!record || typeof record !== "object") {
				return cb({message: 'User does not exist'});
			}
			if (record.id) {
				self.id = record.id;
			}
			return cb(null, record);
		});
	},
	"getRepositories": (self, data, cb) => {
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain) +
				data.config.gitAccounts.bitbucket_enterprise.routes.getAllRepos,
			qs: {
				limit: data.pagelen || '100',
				start: data.page || 1,
			}
		};
		if (self.token) {
			options.headers = {
				Authorization: 'Basic ' + self.token
			};
		}
		requester(options, cb);
	}
};

module.exports = helper;