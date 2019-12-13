/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const helper = require("./helper");

function Bitbucket(service, data) {
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
		__self.tokenInfo = data.tokenInfo;
	}
	else if (__self.access === "private") {
		__self.password = data.password;
		__self.oauthKey = data.oauthKey;
		__self.oauthSecret = data.oauthSecret;
	}
	service.log.debug("Bitbucket Git Init!");
}

Bitbucket.prototype.createRepositoryRecord = function (data) {
	let __self = this;
	return {
		repository: data.full_name,
		name: data.name,
		accountType: data.owner.type,
		type: "repository",
		owner: data.full_name.split("/")[0],
		provider: __self.provider,
		source: {
			name: __self.username,
			ts : data.ts
		},
		domain: __self.domain,
		ts: data.ts
	};
};

Bitbucket.prototype.login = function (data, cb) {
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
			GID: __self.account_id
		};
		if (__self.access === 'private') {
			helper.createToken(__self, data, (err, result) => {
				if (err) {
					return cb(err);
				} else {
					if (result && result.access_token) {
						account.token = result.access_token;
						__self.token = result.access_token;
						__self.expires_in = result.expires_in;
						__self.refresh_token = result.refresh_token;
						if (result.refresh_token && result.expires_in) {
							account.tokenInfo = {
								refresh_token: result.refresh_token,
								created: (new Date).getTime(),
								expires_in: result.expires_in * 1000
							};
						}
					}
					return cb(null, account);
				}
			});
		} else {
			return cb(null, account);
		}
	});
};

Bitbucket.prototype.getRepositories = function (data, cb) {
	let __self = this;
	helper.checkManifest(__self, data, (err)=>{
		if (err) {
			return cb(err);
		}
		helper.execManifest(__self, data, (err, records) => {
			if (err) {
				return cb(err);
			}
			console.log(__self.manifest)
			return cb(null, {
				records: records.length > 0 ? records : [],
				pages : __self.manifest.total
			});
		});
	});
	
};

module.exports = Bitbucket;