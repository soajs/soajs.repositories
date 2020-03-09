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
const crypto = require("crypto");

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
			url: data.config.gitAccounts.bitbucket.apiDomain +
				data.config.gitAccounts.bitbucket.routes.validateUser.replace("%USERNAME%", self.username)
		};
		
		requester(options, function (error, record) {
			if (error) {
				return cb(error);
			}
			if (!record || typeof record !== "object") {
				return cb({message: 'User does not exist'});
			}
			if (record.account_id) {
				self.account_id = record.account_id;
			}
			return cb(null, record);
		});
	},
	"createToken": (self, data, cb) => {
		let formData = {};
		formData.grant_type = 'password';
		formData.username = self.username;
		formData.password = self.password;
		let options = {
			method: 'POST',
			json: true,
			url: data.config.gitAccounts.bitbucket.oauth.domain,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			auth: {
				user: self.oauthKey,
				pass: self.oauthSecret
			},
			form: formData
		};
		requester(options, cb);
	},
	"refreshToken": (self, data, cb) => {
		let formData = {};
		formData.grant_type = 'refresh_token';
		formData.refresh_token = self.refresh_token;
		let options = {
			method: 'POST',
			json: true,
			url: data.config.gitAccounts.bitbucket.oauth.domain,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			auth: {
				user: self.oauthKey,
				pass: self.oauthSecret
			},
			form: formData
		};
		requester(options, (err, res) => {
			if (err) {
				return cb(err);
			} else {
				self.token = res.access_token;
				return cb(null);
			}
		});
	},
	"getRepositories": (self, data, cb) => {
		const options = {
			method: 'GET',
			url: data.url,
			qs: {
				pagelen: data.pagelen || 100,
				page: data.page || 0,
			}
		};
		if (data.token) {
			options.headers = {
				authorization: 'Bearer ' + data.token
			};
		}
		requester(options, (err, response) => {
			if (err) {
				if (err.type === "error" && err.error && err.error.message === "Access token expired. Use your refresh token to obtain a new access token.") {
					helper.refreshToken(self, data, (err) => {
						if (err) {
							return cb(err);
						} else {
							helper.getRepositories(self, data, cb);
						}
					});
				} else {
					return cb(err);
				}
			} else {
				return cb(null, response);
			}
		});
	},
	"checkManifest": (self, data, cb) => {
		if (!self.manifest) {
			
			self.manifest = {
				total: 0,
				auditor: {
					[self.username]: {
						count: 0,
						url: data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", self.account_id)
					}
				},
				iterator: 0
			};
			// if not public no access to teams
			if (!self.token) {
				return cb(null, true);
			}
			helper.getUserTeams(self, data, cb);
		} else {
			return cb(null, true);
		}
	},
	"getUserTeams": (self, data, cb) => {
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getUserTeams,
			qs: {
				pagelen: data.per_page || '100'
			}
		};
		if (self.token) {
			options.headers = {
				authorization: 'Bearer ' + self.token
			};
		}
		requester(options, function (error, teams) {
			if (error) {
				return cb(error);
			}
			self.teams = [];
			if (!teams || !teams.values || teams.values.length === 0) {
				return cb(null, true);
			}
			async.each(teams.values, (oneTeam, call) => {
				if (oneTeam && oneTeam.team &&
					oneTeam.team.username) {
					if (!self.manifest) {
						self.manifest = {
							auditor: {}
						};
					}
					self.teams.push(oneTeam.team.username);
					self.manifest.auditor[oneTeam.team.username] = {
						count: 0,
						url: data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getAllRepos.replace("%USERNAME%", oneTeam.team.username)
					};
				}
				return call();
			}, cb);
		});
	},
	"execManifest": (self, data, cb) => {
		if (self.manifest.iterator === 0) {
			let repositories = [];
			async.eachOfSeries(self.manifest.auditor, function (value, key, callback) {
				let opts = {
					page: 1,
					url: value.url,
					token: self.token
				};
				helper.getRepositories(self, opts, (err, repos) => {
					if (err) {
						return callback(err);
					}
					let pageInfo = {
						pagelen: repos.pagelen,
						size: repos.size
					};
					helper.getRepoPages(pageInfo, (err, pages) => {
						//create total count
						self.manifest.total += pages;
						if (pages >= 1) {
							self.manifest.iterator++;
						}
						//create each auditor count and remove the current iteration
						self.manifest.auditor[key].total = pages;
						self.manifest.auditor[key].count++;
						//merge repos
						if (repos && repos.values) {
							repositories = repositories.concat(repos.values);
						}
						return callback(err);
					});
				});
			}, function (err) {
				if (err) {
					return cb(err);
				}
				//update count
				return cb(null, repositories);
			});
		} else {
			if (self.manifest.iterator >= self.manifest.total) {
				return cb(null, []);
			} else {
				let keys = Object.keys(self.manifest.auditor);
				let key;
				for (let i = 0; i < keys.length; i++) {
					if (self.manifest.auditor[keys[i]].count < self.manifest.auditor[keys[i]].total) {
						key = keys[i];
						break;
					}
				}
				if (!key) {
					return cb(null, []);
				}
				let opts = {
					page: self.manifest.auditor[key].count,
					url: self.manifest.auditor[key].url,
					token: self.token
				};
				helper.getRepositories(self, opts, (err, repos) => {
					if (err) {
						return cb(err);
					}
					
					self.manifest.auditor[key].count++;
					self.manifest.iterator++;
					return cb(null, repos && repos.values ? repos.values : repos);
				});
			}
		}
	},
	"getContent": (self, data, cb) => {
		if (data.path[0] === "/"){
			data.path = data.path.substr(1);
		}
		let url = data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getContent
			.replace('%USERNAME%', self.user)
			.replace('%REPO_NAME%', data.repo)
			.replace('%BRANCH%', data.ref || 'master')
			.replace('%FILE_PATH%', data.path);
		const options = {
			method: 'GET',
			url: url
		};
		if (self.token) {
			options.headers = {
				authorization: 'Bearer ' + self.token
			};
		}
		if (!options.headers) {
			options.headers = {};
		}
		let configSHA = data.repo + data.path;
		let hash = crypto.createHash(data.config.gitAccounts.bitbucket.hash.algorithm);
		configSHA = hash.update(configSHA).digest('hex');
		requester(options, function (error, response, body) {
			if (error){
				return cb(error);
			}
			return cb(null, {
				downloadLink: url,
				content: body,
				configSHA
			});
		});
	},
	
	"listBranches": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		let url = data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getBranches
			.replace('%USERNAME%', repoInfo[0])
			.replace('%REPO_NAME%', repoInfo[1]);
		const options = {
			method: 'GET',
			url: url
		};
		if (self.token) {
			options.headers = {
				authorization: 'Bearer ' + self.token
			};
		}
		if (!options.headers) {
			options.headers = {};
		}
		
		requester(options, function (error, response) {
			if (error){
				return cb(error);
			}
			return cb(null, response);
		});
	},
	
	"getBranch": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		let url = data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getBranches
			.replace('%USERNAME%', repoInfo[0])
			.replace('%REPO_NAME%', repoInfo[1])
			.replace('%BRANCH%',  data.branch);
		const options = {
			method: 'GET',
			url: url
		};
		if (self.token) {
			options.headers = {
				authorization: 'Bearer ' + self.token
			};
		}
		if (!options.headers) {
			options.headers = {};
		}
		
		requester(options, function (error, response) {
			if (error){
				return cb(error);
			}
			return cb(null, response);
		});
	},
	
	"getFile": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		if (data.path[0] === "/"){
			data.path = data.path.substr(1);
		}
		let url = data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.getContent
			.replace('%USERNAME%', repoInfo[0])
			.replace('%REPO_NAME%', repoInfo[1])
			.replace('%BRANCH%', data.branch)
			.replace('%FILE_PATH%', data.path);
		const options = {
			method: 'GET',
			url: url
		};
		if (self.token) {
			options.headers = {
				authorization: 'Bearer ' + self.token
			};
		}
		if (!options.headers) {
			options.headers = {};
		}
		
		requester(options, function (error, response) {
			if (error){
				return cb(error);
			}
			return cb(null, response);
		});
	},
};

module.exports = helper;