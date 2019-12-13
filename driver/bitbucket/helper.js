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
			return cb(null, count);
		} catch (e) {
			return cb(null, count);
		}
	},
	"validate": (self, data, cb) => {
		const options = {
			method: 'GET',
			url: data.config.gitAccounts.bitbucket.apiDomain + data.config.gitAccounts.bitbucket.routes.validateUser.replace("%USERNAME%", self.username)
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
	"getRepositories": (data, cb) => {
		const options = {
			method: 'GET',
			url: data.url,
			qs: {
				pagelen: data.pagelen || '100',
				page: data.page || 1,
			}
		};
		if (data.token) {
			options.headers = {
				authorization: 'Bearer ' + data.token
			};
		}
		requester(options, cb);
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
			if (!teams || !teams.values || teams.values.length === 0) {
				return cb(null, true);
			}
			async.each(teams.values, (oneTeam, call) => {
				if (oneTeam && oneTeam.team
					&& oneTeam.team.username
					&& oneTeam.team.links
					&& oneTeam.team.links.self
					&& oneTeam.team.links.self.href) {
					if (!self.manifest) {
						self.manifest = {
							auditor: {}
						};
					}
					self.manifest.auditor[oneTeam.team.username] = {
						count: 0,
						url: oneTeam.team.links.self.href + "/repositories"
					};
				}
				return call();
			}, cb)
		});
	},
	"execManifest": (self, data, cb) => {
		console.log(JSON.stringify(self.manifest, null, 2))
		if (self.manifest.iterator === 0) {
			let repositories = [];
			async.eachOfSeries(self.manifest.auditor, function (value, key, callback) {
				let opts = {
					page: 1,
					url: value.url,
					token: self.token
				};
				helper.getRepositories(opts, (err, repos) => {
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
						//create each auditor count and remove the current iteration
						self.manifest.auditor[key].total = pages;
						self.manifest.auditor[key].count++;
						//merge repos
						if (repos && repos.values) {
							repositories = repositories.concat(repos.values);
						}
						return callback(err);
					})
					
				});
			}, function (err) {
				if (err) {
					return cb(err);
				}
				//update count
				self.manifest.iterator++;
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
				helper.getRepositories(opts, (err, repos) => {
					if (err) {
						return cb(err);
					}
					
					self.manifest.auditor[key].total = repos.size;
					self.manifest.auditor[key].count++;
					self.manifest.iterator++;
					return cb(null, repos && repos.values ? repos.values : repos);
				});
			}
		}
	}
};

module.exports = helper;