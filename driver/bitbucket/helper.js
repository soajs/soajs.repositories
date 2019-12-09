/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = {
	"getRepoPages": (opts, cb) => {
		let count = 1;
		try {
			count = Math.ceil(opts.size/opts.pagelen);
			return cb(null, count);
		}
		catch (e){
			return cb(null, count);
		}
	},
};

module.exports = helper;