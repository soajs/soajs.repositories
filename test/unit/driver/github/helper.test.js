/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const assert = require('assert');
const sinon = require('sinon');

const helper = require("../../../helper.js");
const helperFile = helper.requireModule('driver/github/helper.js');


describe("Unit test for: Drivers - github, helper", () => {
	
	describe("Testing getRepoPages", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success", (done) => {
			let data = {
				link:
					'<https://api.github.com/user/repos?username=RaghebAd&page=2>; rel="next", <https://api.github.com/user/repos?username=RaghebAd&page=4>; rel="last"',
			};
			helperFile.getRepoPages(data, (err, pages) => {
				assert.ok(pages);
				assert.equal(pages, 4);
				done();
			});
		});
		
		it("Success bad link", (done) => {
			let data = {
				link:
					'bad link',
			};
			helperFile.getRepoPages(data, (err, pages) => {
				assert.ok(pages);
				assert.equal(pages, 1);
				done();
			});
		});
		it("Success no headers", (done) => {
			let data = {};
			helperFile.getRepoPages(data, (err, pages) => {
				assert.ok(pages);
				assert.equal(pages, 1);
				done();
			});
		});
	});
	
	describe("Testing validate", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success personal", (done) => {
			let self = {
				type: 'personal',
				username: 'username',
				github: {
					users: {
						getByUsername: () => {
							return new Promise((resolve, reject) => {
								resolve({
									body: true
								});
								reject(true);
							});
						}
					}
				}
			};
			helperFile.validate(self, () => {
				done();
			});
		});
		
		it("Success personal error", (done) => {
			let self = {
				type: 'personal',
				username: 'username',
				github: {
					users: {
						getByUsername: () => {
							return new Promise((resolve, reject) => {
								reject(true);
							});
						}
					}
				}
			};
			helperFile.validate(self, () => {
				done();
			});
		});
		
		it("Success organization", (done) => {
			let self = {
				type: 'organization',
				username: 'username',
				github: {
					orgs: {
						get: () => {
							return new Promise((resolve, reject) => {
								resolve({
									body: true
								});
								reject(true);
							});
						}
					}
				}
			};
			helperFile.validate(self, () => {
				done();
			});
		});
		
		it("Success organization error", (done) => {
			let self = {
				type: 'organization',
				username: 'username',
				github: {
					orgs: {
						get: () => {
							return new Promise((resolve, reject) => {
								reject(true);
							});
						}
					}
				}
			};
			helperFile.validate(self, () => {
				done();
			});
		});
	});
	
	describe("Testing getRepositories", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success access public, type personal", (done) => {
			let self = {
				access: 'public',
				type: 'personal',
				username: 'username',
				github: {
					repos: {
						listForUser: () => {
							return new Promise((resolve, reject) => {
								resolve({
									body: true
								});
								reject(true);
							});
						}
					}
				}
			};
			let data = {
				per_page: '100',
				page: 1,
			};
			helperFile.getRepositories(self, data, () => {
				done();
			});
		});
		
		it("Success access public, type personal  with error", (done) => {
			let self = {
				access: 'public',
				type: 'personal',
				username: 'username',
				github: {
					repos: {
						listForUser: () => {
							return new Promise((resolve, reject) => {
								reject(true);
							});
						}
					}
				}
			};
			let data = {};
			helperFile.getRepositories(self, data, () => {
				done();
			});
		});
		
		it("Success access public, type organization", (done) => {
			let self = {
				access: 'public',
				type: 'organization',
				per_page: '100',
				page: 1,
				username: 'username',
				github: {
					repos: {
						listForOrg: () => {
							return new Promise((resolve, reject) => {
								resolve({
									body: true
								});
								reject(true);
							});
						}
					}
				}
			};
			let data = {
				per_page: '100',
				page: 1,
			};
			helperFile.getRepositories(self, data, () => {
				done();
			});
		});
		
		it("Success access public, type organization with error ", (done) => {
			let self = {
				access: 'public',
				type: 'organization',
				username: 'username',
				github: {
					repos: {
						listForOrg: () => {
							return new Promise((resolve, reject) => {
								reject(true);
							});
						}
					}
				}
			};
			let data = {};
			helperFile.getRepositories(self, data, () => {
				done();
			});
		});
		
		it("Success access private", (done) => {
			let self = {
				access: 'private',
				type: 'personal',
				username: 'username',
				github: {
					repos: {
						listForAuthenticatedUser: () => {
							return new Promise((resolve, reject) => {
								resolve({
									body: true
								});
								reject(true);
							});
						}
					}
				}
			};
			let data = {
				per_page: '100',
				page: 1,
			};
			helperFile.getRepositories(self, data, () => {
				done();
			});
		});
		
		it("Success access private with error", (done) => {
			let self = {
				access: 'private',
				type: 'personal',
				username: 'username',
				github: {
					repos: {
						listForAuthenticatedUser: () => {
							return new Promise((resolve, reject) => {
								reject(true);
							});
						}
					}
				}
			};
			let data = {};
			helperFile.getRepositories(self, data, () => {
				done();
			});
		});
	});
	
	describe("Testing getOrganizations", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success ", (done) => {
			let self = {
				username: 'username',
				github: {
					orgs: {
						listForUser: () => {
							return new Promise((resolve, reject) => {
								resolve({
									body: true
								});
								reject(true);
							});
						}
					}
				}
			};
			helperFile.getOrganizations(self, () => {
				done();
			});
		});
		
		it("fail ", (done) => {
			let self = {
				username: 'username',
				github: {
					orgs: {
						listForUser: () => {
							return new Promise((resolve, reject) => {
								reject(true);
							});
						}
					}
				}
			};
			helperFile.getOrganizations(self, () => {
				done();
			});
		});
	});
	
	describe("Testing getFile", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success ", (done) => {
			let self = {
				github: {
					repos: {
						getContent: () => {
							return new Promise((resolve, reject) => {
								resolve({
									body: true
								});
								reject(true);
							});
						}
					}
				}
			};
			let data = {
				repository: "soajs/soajs.repositories",
				path: "soa.json",
				ref: "master"
			};
			helperFile.getFile(self, data, () => {
				done();
			});
		});
		
		it("fail ", (done) => {
			let self = {
				github: {
					repos: {
						getContent: () => {
							return new Promise((resolve, reject) => {
								reject(true);
							});
						}
					}
				}
			};
			let data = {
				repository: "soajs/soajs.repositories"
			};
			helperFile.getFile(self, data, () => {
				done();
			});
		});
	});
	
	describe("Testing listBranches", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success ", (done) => {
			let self = {
				github: {
					repos: {
						listBranches: () => {
							return new Promise((resolve, reject) => {
								resolve({
									body: true
								});
								reject(true);
							});
						}
					}
				}
			};
			let data = {
				repository: "soajs/soajs.repositories",
			};
			helperFile.listBranches(self, data, () => {
				done();
			});
		});
		
		it("fail ", (done) => {
			let self = {
				github: {
					repos: {
						listBranches: () => {
							return new Promise((resolve, reject) => {
								reject(true);
							});
						}
					}
				}
			};
			let data = {
				repository: "soajs/soajs.repositories"
			};
			helperFile.listBranches(self, data, () => {
				done();
			});
		});
	});
	
	describe("Testing getBranch", () => {
		before((done) => {
			done();
		});
		
		afterEach((done) => {
			sinon.restore();
			done();
		});
		after(function (done) {
			done();
		});
		
		it("Success ", (done) => {
			let self = {
				github: {
					repos: {
						getBranch: () => {
							return new Promise((resolve, reject) => {
								resolve({
									body: true
								});
								reject(true);
							});
						}
					}
				}
			};
			let data = {
				repository: "soajs/soajs.repositories",
				branch: "master"
			};
			helperFile.getBranch(self, data, () => {
				done();
			});
		});
		
		it("fail ", (done) => {
			let self = {
				github: {
					repos: {
						getBranch: () => {
							return new Promise((resolve, reject) => {
								reject(true);
							});
						}
					}
				}
			};
			let data = {
				repository: "soajs/soajs.repositories"
			};
			helperFile.getBranch(self, data, () => {
				done();
			});
		});
	});
});