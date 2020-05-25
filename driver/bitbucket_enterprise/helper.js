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
			return cb(null, Number.isNaN(count) ? 1 : count);
		} catch (e) {
			return cb(null, count);
		}
	},
	"validate": (self, data, cb) => {
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain) +
				data.config.gitAccounts.bitbucket_enterprise.routes.validateUser.replace("%USERNAME%", self.username)
		};
		if (self.token) {
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
			if (record.errors) {
				return cb(record.errors);
			}
			if (record.message && record.message.search("'status-code': 404")){
				return cb({message: "Domain not found!"});
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
				start: data.page || 0,
			}
		};
		if (self.token) {
			options.headers = {
				Authorization: 'Basic ' + self.token
			};
		}
		requester(options, cb);
	},
	"getProjects": (self, data, cb) => {
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain) +
				data.config.gitAccounts.bitbucket_enterprise.routes.getUserProjects
		};
		if (self.token) {
			options.headers = {
				Authorization: 'Basic ' + self.token
			};
		}
		requester(options, cb);
	},
	"listBranches": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain) +
				data.config.gitAccounts.bitbucket_enterprise.routes.getBranches.replace('%PROJECT_NAME%', repoInfo[0]).replace('%REPO_NAME%', repoInfo[1])
		};
		if (data.branch) {
			options.qs = {
				filterText: data.branch
			};
		}
		if (self.token) {
			options.headers = {
				Authorization: 'Basic ' + self.token
			};
		}
		requester(options, cb);
	},
	
	"listTags": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain) +
				data.config.gitAccounts.bitbucket_enterprise.routes.getTags.replace('%PROJECT_NAME%', repoInfo[0]).replace('%REPO_NAME%', repoInfo[1])
		};
		if (self.token) {
			options.headers = {
				Authorization: 'Basic ' + self.token
			};
		}
		requester(options, cb);
	},
	
	"getTag": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain) +
				data.config.gitAccounts.bitbucket_enterprise.routes.getTags.replace('%PROJECT_NAME%', repoInfo[0]).replace('%REPO_NAME%', repoInfo[1]).replace("%TAG_NAME%", data.tag)
		};
		if (self.token) {
			options.headers = {
				Authorization: 'Basic ' + self.token
			};
		}
		requester(options, cb);
	},
	"getFile": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		if (data.path[0] !== "/") {
			data.path = "/" + data.path;
		}
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket_enterprise.apiDomain.replace("%PROVIDER_DOMAIN%", self.domain) +
				data.config.gitAccounts.bitbucket_enterprise.routes.getContent
					.replace('%PROJECT_NAME%', repoInfo[0])
					.replace('%REPO_NAME%', repoInfo[1]) + data.path
		};
		options.qs = {
			"limit": 1000,
			"branch": data.branch
		};
		
		if (self.token) {
			options.headers = {
				Authorization: 'Basic ' + self.token
			};
		}
		let lines = [];
		
		let max = 1000 * 1000;
		
		function getFile(start, cb) {
			options.qs.start = start;
			requester(options, (err, response) => {
				if (err) {
					return cb(err);
				}
				if (response.errors) {
					return cb(response.errors);
				}
				if (response["status-code"] === 404) {
					return cb(response);
				}
				if (response.lines) {
					lines = lines.concat(response.lines);
				}
				if (options.qs.start > max) {
					return cb({message: "File is too Large"});
				}
				if (!response.isLastPage) {
					return getFile((response.start + response.size), cb);
				} else {
					return cb(null, {lines: lines});
				}
			});
		}
		
		getFile(0, cb);
	}
};

module.exports = helper;