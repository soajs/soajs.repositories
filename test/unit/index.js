
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const imported = require("../data/import.js");

describe.skip("Starting Unit test", () => {

    before((done) => {
        let rootPath = process.cwd();
        imported(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/unit/", (err, msg) => {
            if (err) {
	            console.log(err);
            }
            if (msg){
	            console.log(msg);
            }
            done();
        });
    });

    it("Unit test for BL", (done) => {
	    require("./bl/index.test.js");
	    require("./bl/git.test.js");
        done();
    });
	
	it("Unit test for Lib", (done) => {
		require("./lib/index.test.js");
		done();
	});
	
    it("Unit test for Model", (done) => {
	   require("./model/mongo/git.test.js");
        done();
    });
	
	it("Unit test for Drivers", (done) => {
		
		require("./driver/github/index.test.js");
		require("./driver/github/helper.test.js");
		require("./driver/bitbucket/index.test.js");
		require("./driver/bitbucket/helper.test.js");
		require("./driver/bitbucket_enterprise/index.test.js");
		require("./driver/bitbucket_enterprise/helper.test.js");
		done();
	});
	

    after((done) => {
        done();
    });

});