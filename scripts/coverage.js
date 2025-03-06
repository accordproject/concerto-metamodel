#!/usr/bin/env node

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const globPattern = process.argv[2];

const util = require('util');
const fs = require('fs');
const path = require('path');
const copyFilePromise = util.promisify(fs.copyFile);
const glob = require('glob');

/**
 * Copies coverage files to the destination directory.
 * @param {Array<{ source: string, destination: string }>} files - List of files to copy.
 * @param {string} destDir - The destination directory.
 * @returns {Promise<void>} - A promise that resolves when the files are copied.
 */
function copyFiles(files, destDir) {
    if (!fs.existsSync('coverage')) {
        fs.mkdirSync('coverage');
    }
    return Promise.all(
        files.map((f) =>
            copyFilePromise(f.source, path.join(destDir, f.destination))
        )
    );
}

const lcovs = glob.sync(globPattern).map((dir) => {
    const packageName = dir.split('/').pop();
    return {
        source: path.join(dir, 'coverage/coverage-final.json'),
        destination: `${packageName}.json`,
    };
});

// usage
copyFiles(lcovs, 'coverage')
    .then(() => {
        console.log('done'); // eslint-disable-line no-console
    })
    .catch((err) => {
        console.error(err); // eslint-disable-line no-console
    });
