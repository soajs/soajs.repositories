/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const parseUrl = require("parse-url");
const shortid = require("shortid");

const helper = {
	
	"getRepoPages": (headers, cb) => {
		if (!headers || !headers.link) {
			return cb(null, 1);
		}
		let regex = /(?<=<)(.*?)(?=>)/gi;
		let links = headers.link.match(regex);
		let repo = [];
		if (links) {
			links.forEach((one) => {
				let temp = parseUrl(one);
				repo.push(temp);
			});
		}
		return cb(null, repo[1] ? repo[1].query.page : 1);
	},
	
	"validate": (self, cb) => {
		if (self.type === 'personal') {
			self.github.users.getByUsername({
				username: self.username
			}).then(({data}) => {
				return cb(null, data);
			}).catch((err) => {
				return cb(err);
			});
		} else {
			self.github.orgs.get({
				org: self.username
			}).then(({data}) => {
				return cb(null, data);
			}).catch((err) => {
				return cb(err);
			});
		}
	},
	"createToken": (self, data, cb) => {
		self.github.oauthAuthorizations.createAuthorization({
			note: 'SOAJS GitHub App Token (soajs_' + shortid.generate() + ')',
			scopes: data.config.gitAccounts.github.tokenScope,
		}).then(({data}) => {
			return cb(null, data);
		}).catch((err) => {
			return cb(err);
		});
	},
	
	"getOrganizations": (self, cb) => {
		self.github.orgs.listForUser({
			username: self.username
		}).then(({data}) => {
			return cb(null, data);
		}).catch((err) => {
			return cb(err);
		});
	},
	
	"getRepositories": (self, data, cb) => {
		if (self.access === "public") {
			if (self.type === 'personal') {
				self.github.repos.listForUser({
					username: self.username,
					per_page: data.per_page || '100',
					page: data.page || 1
				}).then(({data, headers}) => {
					return cb(null, data, headers);
				}).catch((err) => {
					return cb(err);
				});
			} else {
				self.github.repos.listForOrg({
					org: self.username,
					per_page: data.per_page || '100',
					page: data.page || 1
				}).then(({data, headers}) => {
					return cb(null, data, headers);
				}).catch((err) => {
					return cb(err);
				});
			}
		} else {
			self.github.repos.list({
				username: self.username,
				visibility: "all",
				per_page: data.per_page || '100',
				page: data.page || 1
			}).then(({data, headers}) => {
				return cb(null, data, headers);
			}).catch((err) => {
				return cb(err);
			});
		}
	},
	
	"getFile": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		self.github.repos.getContents({
			owner: repoInfo[0],
			repo: repoInfo[1],
			path: data.path,
			ref: data.branch
		}).then(({data}) => {
			return cb(null, data);
		}).catch((err) => {
			return cb(err);
		});
	},
	
	"listBranches": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		self.github.repos.listBranches({
			owner: repoInfo[0],
			repo: repoInfo[1],
		}).then(({data}) => {
			return cb(null, data);
		}).catch((err) => {
			return cb(err);
		});
	},
	"getBranch": (self, data, cb) => {
		let repoInfo = data.repository.split('/');
		self.github.repos.getBranch({
			owner: repoInfo[0],
			repo: repoInfo[1],
			branch: data.branch,
		}).then(({data}) => {
			return cb(null, data);
		}).catch((err) => {
			return cb(err);
		});
	},
	"deleteToken": (self, cb) => {
		self.github.oauthAuthorizations.deleteAuthorization({
			authorization_id: self.tokenId
		}).then(({data}) => {
			return cb(null, data);
		}).catch((err) => {
			return cb(err);
		});
	},
};

module.exports = helper;