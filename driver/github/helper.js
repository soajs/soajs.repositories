/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const parseUrl = require("parse-url")

const helper = {
	"getRepoPages": (headers, cb) => {
		if (!headers || !headers.link) {
			return cb(null, 1);
		}
		let regex = /(?<=\<)(.*?)(?=\>)/gi;
		let links = headers.link.match(regex);
		let repo = [];
		links.forEach((one) => {
			let temp = parseUrl(one);
			repo.push(temp)
		});
		return cb(null, repo[1].query.page);
	},
};

module.exports = helper;