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
			"enum": ["static"]
		},
		"name": {
			"type": "string",
			"required": true
		},
		"subType": {
			"type": "string",
			"required": false
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
				"main": {
					"type": "string",
					"required": true
				},
				"sub": {
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
				"readme": {
					"type": "string",
					"required": true
				},
				"release": {
					"type": "string",
					"required": true
				}
			}
		},
		"version": {
			"type": "string",
			"required": false,
		}
	}
};

module.exports = validator;