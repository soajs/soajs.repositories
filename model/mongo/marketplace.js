/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const colName = "marketplace";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = {};

function Marketplace(service, options, mongoCore) {
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
		__self.mongoCore.createIndex(colName,
			{'source.provider': 1, "source.name": 1, "source.owner": 1},
			{
				unique: true,
				partialFilterExpression: {
					"source.owner": {
						"$exists": true
					},
					"source.provider": {
						"$exists": true
					},
					"source.name": {
						"$exists": true
					}
				}
			}, (err, index) => {
				service.log.debug("Index: " + index + " created with error: " + err);
			});
		service.log.debug("Marketplace: Indexes for " + index + " Updated!");
	}
}

Marketplace.prototype.closeConnection = function () {
	let __self = this;
	__self.mongoCore.closeDb();
};

Marketplace.prototype.validateId = function (id, cb) {
	let __self = this;
	
	if (!id) {
		let error = new Error("id is required.");
		return cb(error, null);
	}
	
	try {
		id = __self.mongoCore.ObjectId(id);
		return cb(null, id);
	} catch (e) {
		return cb(e, null);
	}
};

Marketplace.prototype.updateCatalog = function (data, cb) {
	let __self = this;
	if (!data) {
		let error = new Error("Git: must provide data");
		return cb(error, error);
	}
	let condition = {};
	if (data._id) {
		condition._id = data._id;
	} else {
		condition = {
			name: data.name,
			type: data.type
		};
	}
	let options = {'upsert': true, 'safe': true};
	let fields = {
		'$set': data
	};
	__self.mongoCore.updateOne(colName, condition, fields, options, cb);
};

Marketplace.prototype.getCatalog = function (data, cb) {
	let __self = this;
	if (!data || !(data.name || data.type)) {
		let error = new Error("Git: must provide name and type.");
		return cb(error, error);
	}
	let condition = {
		name: data.name,
		type: data.type
	};
	__self.mongoCore.findOne(colName, condition, cb);
};

Marketplace.prototype.getCatalogs = function (data, cb) {
	let __self = this;
	if (!data || !(data.provider && data.owner && data.repo)) {
		let error = new Error("Git: must provide provider owner and repo.");
		return cb(error, error);
	}
	let condition = {
		"src.provider": data.provider,
		"src.owner": data.owner,
		"src.repo": data.repo
	};
	__self.mongoCore.find(colName, condition, cb);
};

Marketplace.prototype.removeCatalogs = function (data, cb) {
	let __self = this;
	if (!data || !(data.source || data.owner || data.repo)) {
		let error = new Error("No data provided.");
		return cb(error, error);
	}
	
	let condition = {
		"src.provider": data.provider,
		"src.owner": data.owner,
		"src.repo": data.repo
	};
	let options = {'upsert': false, 'safe': true};
	let fields = {
		'$set': {
			src: {}
		}
	};
	__self.mongoCore.updateMany(colName, condition, fields, options, cb);
};

module.exports = Marketplace;