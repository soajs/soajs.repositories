/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const Module = require('module');
const path = require('path');
const yamljs = require("yamljs");

let utils;
utils = {
	"requireFromString": (code) => {
		let filename = '';
		let paths = Module._nodeModulePaths(path.dirname(filename));
		
		let parent = module.parent;
		let m = new Module(filename, parent);
		m.filename = filename;
		m.paths = [].concat(paths);
		m._compile(code, filename);
		
		let exports = m.exports;
		//parent && parent.children && parent.children.splice(parent.children.indexOf(m), 1);
		
		return exports;
	},
	"parseSwagger": (swaggerContent, cb) => {
		let swaggerJSON;
		
		try {
			swaggerJSON = yamljs.parse(swaggerContent);
		} catch (e) {
			try {
				if (typeof swaggerContent === "string"){
					swaggerJSON = JSON.parse(swaggerContent);
				}
				else {
					swaggerJSON = JSON.parse(JSON.stringify(swaggerContent));
				}
			} catch (l) {
				return cb(new Error("Unable to parse swagger file"));
			}
		}
		try {
			utils.validateYaml(swaggerJSON);
		} catch (e) {
			return cb(e);
		}
		return cb(null, {
			content: swaggerJSON,
		});
		
	},
	"validateYaml": (yamlJson) => {
		if (typeof yamlJson !== 'object') {
			throw new Error("Yaml file was converted to a string");
		}
		
		if (!yamlJson.paths || Object.keys(yamlJson.paths).length === 0) {
			throw new Error("Yaml file is missing api schema");
		}
		
		//loop in path
		for (let onePath in yamlJson.paths) {
			//loop in methods
			if (onePath && yamlJson.paths[onePath]) {
				for (let oneMethod in yamlJson.paths[onePath]) {
					if (oneMethod && yamlJson.paths[onePath][oneMethod]) {
						if (!yamlJson.paths[onePath][oneMethod].summary || yamlJson.paths[onePath][oneMethod].summary === "") {
							if (yamlJson.paths[onePath][oneMethod].description && yamlJson.paths[onePath][oneMethod].description !== "") {
								yamlJson.paths[onePath][oneMethod].summary = yamlJson.paths[onePath][oneMethod].description;
							} else {
								yamlJson.paths[onePath][oneMethod].summary = "No summary [please add one]";
							}
						}
					}
				}
			}
		}
	},
	"computeCatalogRes": (res, cb) => {
		if (res.result){
			return cb(null, res.data);
		}
		else {
			let error = "";
			if (res.errors && res.errors && res.errors.details && res.errors.details.length > 0){
				res.errors.details.forEach((detail)=>{
					if (error === ""){
						error += detail.message;
					}
					else {
						error += " - " + detail.message;
					}
				});
			}
			return cb(new Error(error));
		}
	}
};

module.exports = utils;