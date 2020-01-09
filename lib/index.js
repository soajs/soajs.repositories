/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';
const async = require("async");

let lib = {
	"handleRepositories": (bl, soajs, driver, modelObj, update) => {
		let opts = {
			config: bl.localConfig
		};
		let ts = new Date().getTime();
		driver.getRepositories(opts, (err, firstSet) => {
			if (err) {
				soajs.log.error(err);
			}
			let count = 0;
			if (firstSet && firstSet.records && firstSet.records.length > 0) {
				async.each(firstSet.records, (oneRecord, call) => {
					count++;
					oneRecord.ts = ts;
					let finalRecord = driver.createRepositoryRecord(oneRecord);
					modelObj.updateRepository(finalRecord, call);
				}, (err) => {
					if (err) {
						soajs.log.error(err);
					}
					let complete = firstSet.next;
					if (complete) {
						async.whilst(function (cb) {
								cb(null, complete);
							},
							function (next) {
								//skip the first page
								opts = {
									config: bl.localConfig
								};
								driver.getRepositories(opts, function (err, sets) {
									if (err) {
										return next(err);
									}
									complete = sets.next;
									if (sets && sets.records && sets.records.length > 0) {
										async.each(sets.records, (oneRecord, call) => {
											count++;
											oneRecord.ts = ts;
											let finalRecord = driver.createRepositoryRecord(oneRecord);
											modelObj.updateRepository(finalRecord, call);
										}, (err) => {
											if (update) {
												soajs.log.debug(count, "Repositories Updated So Far... ");
											} else {
												soajs.log.debug(count, "Repositories Added So Far... ");
											}
											return next(err, sets);
										});
									} else {
										return next(null, sets);
									}
								});
							}, function (err) {
								if (err) {
									soajs.log.error(err);
								}
								opts = {
									config: bl.localConfig
								};
								driver.getOrganizations(opts, (err, organizations) => {
									if (err) {
										soajs.log.error(err);
								
									}
									modelObj.updateAccount({
										id : soajs.inputmaskData.id,
										metadata: {organizations}
									}, (err) => {
										if (err) {
											soajs.log.error(err);
										}
										if (update) {
											soajs.log.debug(count, "Repositories Updated Successfully!");
											modelObj.syncRepository({
												ts,
												owner: driver.getOwner()
											}, (err) => {
												if (err) {
													soajs.log.error(err);
												}
											});
										} else {
											soajs.log.debug(count, "Repositories Added Successfully!");
										}
									});
								});
							});
					} else {
						opts = {
							config: bl.localConfig
						};
						driver.getOrganizations(opts, (err, organizations) => {
							if (err) {
								soajs.log.error(err);
							}
							modelObj.updateAccount({
								id : soajs.inputmaskData.id,
								metadata: {organizations}
							}, (err) => {
								if (err) {
									soajs.log.error(err);
								}
								if (update) {
									soajs.log.debug(count, "Repositories Updated Successfully!");
									modelObj.syncRepository({
										ts,
										owner: driver.getOwner()
									}, (err) => {
										if (err) {
											soajs.log.error(err);
										}
									});
								} else {
									soajs.log.debug(count, "Repositories Added Successfully!");
								}
							});
						});
					}
				});
			}
		});
	}
};


module.exports = lib;