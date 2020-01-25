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
		//todo add indexes
		service.log.debug("Git: Indexes for " + index + " Updated!");
	}
}

Git.prototype.closeConnection = function () {
	let __self = this;
	__self.mongoCore.closeDb();
};

Git.prototype.validateId = function (id, cb) {
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

Git.prototype.checkIfAccountExists = function (data, cb) {
	let __self = this;
	
	if (!data || !(data.id || data.provider)) {
		let error = new Error("Git: must provide owner and provider.");
		return cb(error, error);
	}
	let condition = {
		provider: data.provider,
		GID: data.id
	};
	__self.mongoCore.countDocuments(colName, condition, null, cb);
};

Git.prototype.getAccount = function (data, cb) {
	let __self = this;
	if (!data || !(data.id || !data._id) || !(data.provider && data.owner)) {
		let error = new Error("Git: must provide id or _id or provider and an owner.");
		return cb(error, error);
	}
	let condition = {};
	condition.type = "account";
	if (data.id) {
		__self.validateId(data.id, (err, id) => {
			if (err) {
				return cb(err, null);
			}
			condition._id = id;
			__self.mongoCore.findOne(colName, condition, cb);
		});
	} if (data._id) {
		condition._id = data._id;
		__self.mongoCore.findOne(colName, condition, cb);
	}
	else {
		condition.provider = data.provider;
		condition.owner = data.owner;
		__self.mongoCore.findOne(colName, condition, cb);
	}
};

Git.prototype.getRepository = function (data, cb) {
	let __self = this;
	if (!data || !(data.id || data._id)) {
		let error = new Error("Git: must provide id.");
		return cb(error, error);
	}
	let condition = {};
	condition.type = "repository";
	if (data.id) {
		__self.validateId(data.id, (err, id) => {
			if (err) {
				return cb(err, null);
			}
			condition._id = id;
			__self.mongoCore.findOne(colName, condition, cb);
		});
	} else {
		condition._id = data._id;
		__self.mongoCore.findOne(colName, condition, cb);
	}
};

Git.prototype.saveNewAccount = function (data, cb) {
	let __self = this;
	if (!data) {
		let error = new Error("No data provided.");
		return cb(error, error);
	}
	__self.mongoCore.insertOne(colName, data, (err, record) => {
		return cb(err, {
			id: record.insertedId
		});
	});
};

Git.prototype.updateAccount = function (data, cb) {
	let __self = this;
	if (!data || !(data.id || data.metadata || Object.keys(data.metadata).length === 0)) {
		let error = new Error("No data provided.");
		return cb(error, error);
	}
	let condition = {};
	__self.validateId(data.id, (err, id) => {
		if (err) {
			return cb(err, null);
		}
		condition = {'_id': id};
		let options = {'upsert': false, 'safe': true};
		let fields = {
			'$set': {}
		};
		Object.keys(data.metadata).forEach(key => {
			fields.$set[`metadata.${key}`] = data.metadata[key];
		});
		__self.mongoCore.updateOne(colName, condition, fields, options, cb);
	});
};

Git.prototype.upgradeAccount = function (data, cb) {
	let __self = this;
	if (!data || !(data._id || data.set)) {
		let error = new Error("No data provided.");
		return cb(error, error);
	}
	let condition = {
		"_id": data._id
	};
	let options = {'upsert': false, 'safe': true};
	let fields = {
		'$set': data.set
	};
	__self.mongoCore.updateOne(colName, condition, fields, options, cb);
};

Git.prototype.updateRepository = function (data, cb) {
	let __self = this;
	if (!data || !(data.id || data.provider)) {
		let error = new Error("Git: must provide owner and provider.");
		return cb(error, error);
	}
	let condition = {
		repository: data.repository,
		domain: data.domain
	};
	let options = {'upsert': true, 'safe': true};
	let fields = {
		'$set': {
			repository: data.repository,
			name: data.name,
			provider: data.provider,
			domain: data.domain,
			type: data.type,
			owner: data.owner,
			ts: data.ts
		},
		'$addToSet': {
			source: data.source
		}
	};
	__self.mongoCore.updateOne(colName, condition, fields, options, cb);
};

Git.prototype.syncRepository = function (data, cb) {
	let __self = this;
	if (!data || !(data.ts || data.owner)) {
		let error = new Error("Git: must provide ts and owner.");
		return cb(error, error);
	}
	let condition = {
		"source.name": data.owner,
		type: "repository"
	};
	let options = {'upsert': true, 'safe': true};
	let fields = {
		'$pull': {
			"source": {
				ts: {
					"$ne": data.ts
				}
			}
		}
	};
	__self.mongoCore.updateMany(colName, condition, fields, options, (err, response) => {
		return cb(err, response);
	});
};

Git.prototype.getAccounts = function (cb) {
	let __self = this;
	let condition = {
		type: "account"
	};
	__self.mongoCore.find(colName, condition, (err, response) => {
		return cb(err, response);
	});
};

Git.prototype.deleteAccount = function (data, cb) {
	let __self = this;
	if (!data || !(data._id)) {
		let error = new Error("Git: must provide id");
		return cb(error, error);
	}
	let condition = {
		type: "account",
		_id: data._id
	};
	__self.mongoCore.deleteOne(colName, condition, (err, response) => {
		return cb(err, response);
	});
};

Git.prototype.removeRepositories = function (data, cb) {
	let __self = this;
	if (!data || !(data.owner)) {
		let error = new Error("Git: must provide owner.");
		return cb(error, error);
	}
	let condition = {
		"source.name": data.owner,
		"type": "repository"
	};
	let options = {'upsert': true, 'safe': true};
	let fields = {
		'$pull': {
			source: {
				name: {
					"$eq": data.owner
				}
			}
		}
	};
	__self.mongoCore.updateMany(colName, condition, fields, options, (err, response) => {
		return cb(err, response);
	});
};

Git.prototype.activateRepo = function (data, cb) {
	let __self = this;
	if (!data || !(data._id)) {
		let error = new Error("Git: must provide _id.");
		return cb(error, error);
	}
	let condition = {
		type: "repository",
		_id: data._id
	};
	let options = {'upsert': false, 'safe': true};
	let fields = {
		'$set': {
			branches : data.branches,
			active: data.active
		}
	};
	__self.mongoCore.updateOne(colName, condition, fields, options, (err, response) => {
		return cb(err, response);
	});
};

Git.prototype.updateBranches = function (data, cb) {
	let __self = this;
	if (!data || !(data._id)) {
		let error = new Error("Git: must provide _id.");
		return cb(error, error);
	}
	let condition = {
		type: "repository",
		_id: data._id,
		"branches.name": data.name
	};
	let options = {'upsert': false, 'safe': true};
	let fields = {
		'$set': {}
	};
	fields.$set["branches.$"] = {
		name : data.name,
		active: data.active
	};
	if (data.configSHA){
		fields.$set["branches.$"].configSHA = data.configSHA;
	}
	if (data.swaggerSHA){
		fields.$set["branches.$"].swaggerSHA = data.swaggerSHA;
	}
	__self.mongoCore.updateOne(colName, condition, fields, options, (err, response) => {
		return cb(err, response);
	});
};

Git.prototype.removeRepository = function (data, cb) {
	let __self = this;
	if (!data || !(data._id)) {
		let error = new Error("Git: must provide owner and provider.");
		return cb(error, error);
	}
	let condition = {
		_id: data._id,
		type: data.type
	};
	let options = {'upsert': false, 'safe': true};
	let fields = {
		'$set': {
			active: data.active,
			branches: data.branches
		}
	};
	__self.mongoCore.updateOne(colName, condition, fields, options, cb);
};

module.exports = Git;