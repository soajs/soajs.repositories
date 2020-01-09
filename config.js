/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

module.exports = {
	type: 'service',
	prerequisites: {
		cpu: '',
		memory: ''
	},
	"serviceVersion": 1,
	"serviceName": "repositories",
	"serviceGroup": "SOAJS Core Services",
	"servicePort": 4005,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"oauth": true,
	"extKeyRequired": true,
	
	"gitAccounts": {
		"github" : {
			"tokenScope": ["repo", "admin:repo_hook"]
		},
		"bitbucket": {
			"apiDomain": 'https://api.bitbucket.org/2.0',
			"routes": {
				"validateUser": '/users/%USERNAME%',
				"getAllRepos": '/repositories/%USERNAME%',
				"getUserTeams": '/user/permissions/teams',
			},
			"oauth": {
				"domain": 'https://bitbucket.org/site/oauth2/access_token'
			}
		},
		"bitbucket_enterprise": {
			"apiDomain": '%PROVIDER_DOMAIN%/rest/api/1.0',
			"routes": {
				"validateUser": '/users/%USERNAME%',
				"getUserProjects": '/projects',
				"getAllRepos": '/repos'
			},
		}
	},
	
	"errors": {
		400: "Business logic required data are missing",
		
		401: "Username or Token required",
		402: "User account already exists",
		403: "Git Account does not exist",
		404: "Account not found. Login first.",
		601: "Model not found",
		602: "Model error: ",
		603: "Provider not found",
		
	},
	"schema": {
		"get": {
			"/git/accounts/list": {
				"_apiInfo": {
					"l": "Get All Accounts",
					"group": "Git Accounts"
				}
			},
			"/git/accounts": {
				"_apiInfo": {
					"l": "Get account owner information and organization(s)",
					"group": "Git Accounts"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			}
		},
		"post": {
			"/gitAccounts/login": {
				"_apiInfo": {
					"l": "Login and add account",
					"group": "Git Accounts"
				},
				"username": {
					"source": ['body.username'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"password": {
					"source": ['body.password'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"label": {
					"source": ['body.label'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['body.provider'],
					"required": true,
					"validation": {
						"type": "string",
						"enum": ["github", "bitbucket", "bitbucket_enterprise"]
					}
				},
				"domain": {
					"source": ['body.domain'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"type": {
					"source": ['body.type'],
					"required": true,
					"validation": {
						"type": "string",
						"enum": ["personal", "organization"]
					}
				},
				"access": {
					"source": ['body.access'],
					"required": true,
					"validation": {
						"type": "string",
						"enum": ["public", "private"]
					}
				},
				"on2fa": {
					"source": ['body.on2fa'],
					"required": false,
					"validation": {
						"type": "string",
					}
				},
				"oauthKey": {
					"source": ['body.oauthKey'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"oauthSecret": {
					"source": ['body.oauthSecret'],
					"required": false,
					"validation": {
						"type": "string"
					}
				}
			}
		},
		"put": {
			"/git/sync/account": {
				"_apiInfo": {
					"l": "Sync account and add all repositories by account owner and organization(s)",
					"group": "Git Accounts"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			}
		}
		
	}
};