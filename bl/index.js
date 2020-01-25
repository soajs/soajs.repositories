/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const async = require("async");
const fs = require("fs");

let SSOT = {};
let model = process.env.SOAJS_SERVICE_MODEL || "mongo";
const BLs = ["git", "service", "daemon", "marketplace"];
const DLs = ["bitbucket", "github", "bitbucket_enterprise"];

let BL = {
	init: init,
	git: null
};

function init(service, localConfig, cb) {
	
	function getDriver(temp, dlName, cb) {
		let pathToDriver = __dirname + `/../driver/${dlName}/index.js`;
		if (fs.existsSync(pathToDriver)) {
			temp.drivers[dlName] = require(pathToDriver);
			return cb(null);
		} else {
			return cb({driver: dlName});
		}
	}
	
	let fillModels = (blName, cb) => {
		let typeModel = __dirname + `/../model/${model}/${blName}.js`;
		
		if (fs.existsSync(typeModel)) {
			SSOT[`${blName}Model`] = require(typeModel);
			SSOT[`${blName}ModelObj`] = new SSOT[`${blName}Model`](service, null, null);
		}
		if (SSOT[`${blName}ModelObj`]) {
			let temp = require(`./${blName}.js`);
			temp.modelObj = SSOT[`${blName}ModelObj`];
			temp.model = SSOT[`${blName}Model`];
			temp.soajs_service = service;
			temp.localConfig = localConfig;
			temp.drivers = {};
			async.each(DLs, async.apply(getDriver, temp), function (err) {
				if (err) {
					return cb({name: blName, driver: err.driver});
				}
				BL[blName] = temp;
				return cb(null);
			});
		} else {
			return cb({name: blName, model: typeModel});
		}
	};
	async.each(BLs, fillModels, function (err) {
		if (err) {
			if (err.model) {
				service.log.error(`Requested model not found. make sure you have a model for ${err.name} @ ${err.model}`);
				return cb({"code": 601, "msg": localConfig.errors[601]});
			} else {
				service.log.error(`Requested driver not found. make sure you have a driver for ${err.name} @ ${err.driver}`);
				return cb({"code": 603, "msg": localConfig.errors[603]});
			}
			
		}
		return cb(null);
	});
}


module.exports = BL;