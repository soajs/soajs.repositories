
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

let validator = {
	"type": "object",
	"required": true,
	"properties": {
		"type": {
			"type": "string",
			"required": true,
			"enum": ["service"]
		},
		"subType": {
			"type": "string",
			"required": false,
			"pattern": /^[a-zA-Z0-9_-]+$/
		},
		"name": {
			"type": "string",
			"required": true,
			"pattern": /^[a-zA-Z0-9_-]+$/
		},
		"group": {
			"type": "string",
			"required": true
		},
		"description": {
			"type": "string",
			"required": true
		},
		"tags": {
			"type": "array",
			"required": false,
			"items": {
				"type": "string",
				"uniqueItems": true,
				"minItems": 1
			}
		},
		"attributes": {
			"type": "object",
			"required": false,
		},
		"tab": {
			"type": "object",
			"required": false,
			"additionalProperties": false,
			"properties": {
				"main" : {
					"type": "string",
					"required": true,
					"maxLength": 20,
					"pattern": /^[a-zA-Z0-9_-]+$/
				},
				"sub" : {
					"type": "string",
					"required": true,
					"maxLength": 20,
					"pattern": /^[a-zA-Z0-9_-]+$/
				}
			}
		},
		"program": {
			"type": "array",
			"required": false,
			"items": {
				"type": "string",
				"uniqueItems": true,
				"minItems": 1
			}
		},
		"documentation": {
			"type": "object",
			"required": false,
			"additionalProperties": false,
			"properties": {
				"readme" : {
					"type": "string",
					"required": false
				},
				"release" : {
					"type": "string",
					"required": false
				}
			}
		},
		"swaggerFilename": {
			"type": "string",
			"required": false
		},
		"port": {
			"type": "integer",
			"required": true
		},
		"version": {
			"type": "string",
			"required": true,
		},
		"extKeyRequired": {
			"type": "boolean",
			"required": false,
			"default": true
		},
		"oauth": {
			"type": "boolean",
			"required": false,
			"default": false
		},
		"urac": {
			"type": "boolean",
			"required": false,
			"default": false
		},
		"urac_Profile": {
			"type": "boolean",
			"required": false,
			"default": false
		},
		"urac_ACL": {
			"type": "boolean",
			"required": false,
			"default": false
		},
		"tenant_Profile": {
			"type": "boolean",
			"required": false,
			"default": false
		},
		"provision_ACL": {
			"type": "boolean",
			"required": false,
			"default": false
		},
		"requestTimeout": {
			"type": "integer",
			"required": false
		},
		"requestTimeoutRenewal": {
			"type": "integer",
			"required": false
		},
		"maintenance": {
			"type": "object",
			"required": false,
			"additionalProperties": false,
			"properties": {
				"port" : {
					"type": "object",
					"required": true,
					"properties": {
						"type" : {
							"type": "string",
							"required": true
						},
						"value" : {
							"type": "integer",
							"required": false
						}
					}
				},
				"readiness" : {
					"type": "string",
					"required": true
				},
				"commands": {
					"type": "array",
					"required": false
				}
			}
		},
		"prerequisites": {
			"type": "object",
			"required": false,
			"additionalProperties": false,
			"properties": {
				"cpu" : {
					"type": "string",
					"required": true
				},
				"memory" : {
					"type": "string",
					"required": true
				}
			}
		}
	}
};

module.exports = validator;