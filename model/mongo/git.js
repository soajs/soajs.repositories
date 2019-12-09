
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const colName = "git";
const core = require("soajs");
//const async = require("async");
const Mongo = core.mongo;

let indexing = {};

function Git(service, options, mongoCore) {
    let __self = this;

    if (mongoCore) {
        __self.mongoCore = mongoCore;
    }
    if (!__self.mongoCore) {
        if (options && options.dbConfig) {
            __self.mongoCore = new Mongo(options.dbConfig);
        } else {
            let registry = service.registry.get();
            __self.mongoCore = new Mongo(registry.coreDB.provision);
        }
    }
    let index = "default";
    if (options && options.index) {
        index = options.index;
    }
    if (indexing && !indexing[index]) {
        indexing[index] = true;


        service.log.debug("Git: Indexes for " + index + " Updated!");
    }
}

Git.prototype.closeConnection = function () {
    let __self = this;
    __self.mongoCore.closeDb();
};


Git.prototype.checkIfAccountExists = function (data, cb) {
	let __self = this;
	
	if (!data || !(data.id || data.provider)) {
		let error = new Error("Git: must provide owner and provider.");
		return cb(error, null);
	}
	let condition = {
		provider: data.provider,
		GID: data.id
	};
	__self.mongoCore.countDocuments(colName, condition, null, (err, count) => {
		return cb(err, count);
	});
};
Git.prototype.saveNewAccount = function (data, cb) {
	let __self = this;
	__self.mongoCore.insertOne(colName, data, (err, record) => {
		if (record && Array.isArray(record)) {
			record = record [0];
		}
		return cb(err, {
			id : record.insertedId
		});
	});
};

Git.prototype.updateRepository = function (data, cb) {
	let __self = this;
	let condition = {'repository': data.repository, domain: data.domain};
	let options = {'upsert': true, 'safe': true};
	let fields = {
		'$set': {
			repository: data.repository,
			name: data.name,
			provider: data.provider,
			domain: data.domain,
			type: data.type,
			ts: new Date().getTime()
		},
		'$addToSet' : {
			owners: data.owner
		}
	};
	__self.mongoCore.updateOne(colName, condition, fields, options, (err, response) => {
		return cb(err, response);
	});
};

module.exports = Git;