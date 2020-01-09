'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const soajs = require('soajs');

let config = require('./config.js');
config.packagejson = require("./package.json");

const bl = require("./bl/index.js");

const service = new soajs.server.service(config);

service.init(() => {
	bl.init(service, config, (error) => {
		if (error) {
			throw new Error('Failed starting service');
		}
		
		//GET methods
		
		service.get("/git/accounts/list", function (req, res) {
			bl.git.list(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.get("/git/accounts", function (req, res) {
			bl.git.get(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		//DELETE methods
		
		//PUT methods
		
		service.put("/git/sync/account", function (req, res) {
			bl.git.sync(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		//POST methods
		
		service.post("/gitAccounts/login", function (req, res) {
			bl.git.login(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.start();
	});
});