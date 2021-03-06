/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

module.exports = {
	"type": 'service',
	'subType': 'soajs',
	"description": "This service handles soajs integration with git providers.",
	"prerequisites": {
		cpu: '',
		memory: ''
	},
	"serviceVersion": "1",
	"serviceName": "repositories",
	"serviceGroup": "Console",
	"servicePort": 4006,
	"requestTimeout": 180,
	"requestTimeoutRenewal": 5,
	"oauth": true,
	"extKeyRequired": true,
	
	"tags": ["github", "bitbucket", "private", "public"],
	"attributes": {
		"github": ["personal", "organization", "twitter", "github"],
		"bitbucket": ["saas", "enterprise", "projects"]
	},
	"program": ["soajs"],
	"documentation": {
		"readme": "/README.md",
		"release": "/RELEASE.md"
	},
	
	"gitAccounts": {
		"github" : {},
		"bitbucket": {
			"apiDomain": 'https://api.bitbucket.org/2.0',
			"routes": {
				"validateUser": '/workspaces/%USERNAME%',
				"getAllRepos": '/repositories/%USERNAME%',
				"getUserTeams": '/user/permissions/teams',
				"getContent": '/repositories/%USERNAME%/%REPO_NAME%/src/%BRANCH%/%FILE_PATH%',
				"getBranches": '/repositories/%USERNAME%/%REPO_NAME%/refs/branches',
				"getTags": '/repositories/%USERNAME%/%REPO_NAME%/refs/tags',
				"getBranch": '/repositories/%USERNAME%/%REPO_NAME%/refs/branches/%BRANCH%',
				"getTag": '/repositories/%USERNAME%/%REPO_NAME%/refs/tags/%BRANCH%'
			},
			"oauth": {
				"domain": 'https://bitbucket.org/site/oauth2/access_token'
			},
			"hash": {
				"algorithm": "sha256"
			}
		},
		"bitbucket_enterprise": {
			"apiDomain": '%PROVIDER_DOMAIN%/rest/api/1.0',
			"routes": {
				"validateUser": '/users/%USERNAME%',
				"getUserProjects": '/projects',
				"getAllRepos": '/repos',
				"getContent": '/projects/%PROJECT_NAME%/repos/%REPO_NAME%/browse',
				"getBranches": '/projects/%PROJECT_NAME%/repos/%REPO_NAME%/branches',
				"getTags": '/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags',
				"getTag": '/projects/%PROJECT_NAME%/repos/%REPO_NAME%/tags/%TAG_NAME%'
			},
			"hash": {
				"algorithm": "sha256"
			},
		}
	},
	"interConnect": [{
		"name": "marketplace",
		"version": "1"
	}],
	"catalogs" : ["custom", "service", "daemon", "static", "config"],
	"errors": {
		400: "Business logic required data are missing",
		
		401: "Username or Token required.",
		402: "User account already exists.",
		403: "Git Account does not exist.",
		404: "Account not found. Login first.",
		405: "Repository not found.",
		406: "Username not found.",
		407: "No need to upgrade.",
		408: "Repository is already active.",
		409: "Repository is not active.",
		410: "Branch is not found",
		411: "Catalog validation",
		412: "Branch is already active",
		413: "Unable to logout. One or more repositories are active.",
		414: "Unable to deactivate repository, one or more branch is currently active.",
		415: "Branch is not active",
		416: "Tag not found",
		417: "Catalog Entry with same DNA detected!",
		418: "Tag is already active",
		
		//420: "Tow factor authentication is enabled. Verification code required",
		
		500: "Invalid soa.json file schema",
		
		601: "Model not found.",
		602: "Model error: ",
		603: "Provider not found.",
		604: "error: ",
		605: "Service Error: ",
	},
	"maintenance": {
		"readiness": "/heartbeat",
		"port": {"type": "maintenance"},
		"commands": [
			{"label": "Reload Registry", "path": "/reloadRegistry", "icon": "fas fa-undo"},
			{"label": "Resource Info", "path": "/resourceInfo", "icon": "fas fa-info"}
		]
	},
	"schema": {
		"get": {
			"/git/accounts": {
				"_apiInfo": {
					"l": "Get accounts information and their organization(s)",
					"group": "Account information"
				}
			},
			"/git/account": {
				"_apiInfo": {
					"l": "Get account information and its organization(s)",
					"group": "Account information"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			"/git/account/owner": {
				"_apiInfo": {
					"l": "Get account information and its organization(s)",
					"group": "Internal"
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			"/git/repo": {
				"_apiInfo": {
					"l": "Get repository information",
					"group": "Repository information"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			
			"/git/repo/info": {
				"_apiInfo": {
					"l": "Get repository and account information",
					"group": "Internal"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			
			"/git/branch": {
				"_apiInfo": {
					"l": "Get repository branch information",
					"group": "Repository information"
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"repo": {
					"source": ['query.repo'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"branch": {
					"source": ['query.branch'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/branches": {
				"_apiInfo": {
					"l": "Get repository branches",
					"group": "Repository information"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			"/git/tags": {
				"_apiInfo": {
					"l": "Get repository tags",
					"group": "Repository information"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"page": {
					"source": ['query.page'],
					"validation": {
						"type": "string"
					}
				},
				"size": {
					"source": ['query.size'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/tag": {
				"_apiInfo": {
					"l": "Get repository tag information",
					"group": "Repository information"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"tag": {
					"source": ['query.tag'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			"/git/repo/file": {
				"_apiInfo": {
					"l": "Get a file from the repository",
					"group": "Repository management"
				},
				"accountId": {
					"source": ['query.accountId'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"repo": {
					"source": ['query.repo'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"filepath": {
					"source": ['query.filepath'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"branch": {
					"source": ['query.branch'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			}
		},
		"post": {
			"/git/account": {
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
					"validation": {
						"type": "string"
					}
				},
				"token": {
					"source": ['body.token'],
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
				"oauthKey": {
					"source": ['body.oauthKey'],
					"validation": {
						"type": "string"
					}
				},
				"oauthSecret": {
					"source": ['body.oauthSecret'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/repos": {
				"_apiInfo": {
					"l": "Search and filter repository",
					"group": "Repository information"
				},
				"name": {
					"source": ['body.name'],
					"validation": {
						"type": "string"
					}
				},
				"active": {
					"source": ['body.active'],
					"validation": {
						"type": "boolean"
					}
				},
				"owner": {
					"source": ['body.owner'],
					"validation": {
						'type': 'array',
						"uniqueItems": true,
						'items': {'type': 'string'}
					}
				},
				"provider": {
					"source": ['body.provider'],
					"validation": {
						'type': 'array',
						"uniqueItems": true,
						'items': {'type': 'string'}
					}
				},
				"textSearch": {
					"source": ['body.textSearch'],
					"validation": {
						"type": "string"
					}
				},
				"skip": {
					"source": ['body.skip'],
					"validation": {
						"type": "integer"
					}
				},
				"limit": {
					"source": ['body.limit'],
					"validation": {
						"type": "integer"
					}
				},
				"leaf": {
					"source": ['body.leaf'],
					"validation": {
						"type": "boolean"
					}
				}
			}
		},
		"put": {
			"/git/sync/account": {
				"_apiInfo": {
					"l": "Sync account and all its repositories",
					"group": "Git Accounts"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/account": {
				"_apiInfo": {
					"l": "Upgrade account",
					"group": "Account management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
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
					"validation": {
						"type": "string"
					}
				},
				"token": {
					"source": ['body.token'],
					"validation": {
						"type": "string"
					}
				},
				"oauthKey": {
					"source": ['body.oauthKey'],
					"validation": {
						"type": "string"
					}
				},
				"oauthSecret": {
					"source": ['body.oauthSecret'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/repo/activate": {
				"_apiInfo": {
					"l": "Activate repository and sync branches",
					"group": "Repository management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			"/git/repo/deactivate": {
				"_apiInfo": {
					"l": "Deactivate repository",
					"group": "Repository management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			"/git/branch/activate": {
				"_apiInfo": {
					"l": "Activate branch",
					"group": "Repository management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"branch": {
					"source": ['query.branch'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			"/git/branch/deactivate": {
				"_apiInfo": {
					"l": "Deactivate branch",
					"group": "Repository management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"branch": {
					"source": ['query.branch'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/tag/activate": {
				"_apiInfo": {
					"l": "Activate tag",
					"group": "Repository management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"tag": {
					"source": ['query.tag'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
			"/git/tag/deactivate": {
				"_apiInfo": {
					"l": "Deactivate tag",
					"group": "Repository management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"tag": {
					"source": ['query.tag'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/sync/repository": {
				"_apiInfo": {
					"l": "Sync repository and all its branches",
					"group": "Repository management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/sync/branch": {
				"_apiInfo": {
					"l": "Sync branch and update the corresponding catalog",
					"group": "Repository management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"branch": {
					"source": ['query.branch'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
			},
		},
		"delete": {
			"/git/account": {
				"_apiInfo": {
					"l": "Logout and delete account",
					"group": "Account management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"password": {
					"source": ['query.password'],
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/repo": {
				"_apiInfo": {
					"l": "Delete Repository",
					"group": "Account management"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/git/repositories": {
				"_apiInfo": {
					"l": "Delete Orphan Repositories",
					"group": "Account management"
				}
			}
		}
	}
};