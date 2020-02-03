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
		
		service.get("/git/account", function (req, res) {
			bl.git.get(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.get("/git/accounts", function (req, res) {
			bl.git.list(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.get("/git/repo", function (req, res) {
			bl.git.getRepo(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.get("/git/repo/file", function (req, res) {
			bl.git.getRepoFile(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.get("/git/branches", function (req, res) {
			bl.git.getBranches(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		//DELETE methods
		
		service.delete("/git/account", function (req, res) {
			bl.git.logout(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		//PUT methods
		
		service.put("/git/sync/account", function (req, res) {
			bl.git.syncAccount(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.put("/git/account", function (req, res) {
			bl.git.upgrade(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.put("/git/repo/activate", function (req, res) {
			bl.git.activateRepo(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.put("/git/repo/deactivate", function (req, res) {
			bl.git.deactivateRepo(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.put("/git/branch/activate", function (req, res) {
			bl.git.activateBranch(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.put("/git/branch/deactivate", function (req, res) {
			bl.git.deactivateBranch(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.put("/git/sync/repository", function (req, res) {
			bl.git.syncRepo(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.put("/git/sync/branch", function (req, res) {
			bl.git.syncBranch(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		//POST methods
		
		service.post("/git/account", function (req, res) {
			bl.git.login(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.post("/git/repos", function (req, res) {
			bl.git.search(req.soajs, req.soajs.inputmaskData, (error, data) => {
				return res.json(req.soajs.buildResponse(error, data));
			});
		});
		
		service.start();
	});
});