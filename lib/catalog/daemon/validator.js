
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
			"enum": ["daemon"]
		},
		"subType": {
			"type": "string",
			"required": false
		},
		"name": {
			"type": "string",
			"required": true
		},
		"group": {
			"type": "string",
			"required": true
		},
		"description": {
			"type": "string",
			"required": false
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
					"required": true
				},
				"sub" : {
					"type": "string",
					"required": true
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
					"required": true
				},
				"release" : {
					"type": "string",
					"required": true
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
			"required": false
		},
		"oauth": {
			"type": "boolean",
			"required": false
		},
		"urac": {
			"type": "boolean",
			"required": false
		},
		"urac_Profile": {
			"type": "boolean",
			"required": false
		},
		"urac_ACL": {
			"type": "boolean",
			"required": false
		},
		"tenant_Profile": {
			"type": "boolean",
			"required": false
		},
		"provision_ACL": {
			"type": "boolean",
			"required": false
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
						}
					}
				},
				"readiness" : {
					"type": "string",
					"required": true
				},
				"commands": {
					"type": "object",
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
		},
		"jobs": {
			"type": "array",
			"required": false,
			"items": {
				"type": "string",
				"uniqueItems": true,
				"minItems": 1
			}
		}
	}
};

module.exports = validator;