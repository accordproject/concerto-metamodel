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

const semver = require('semver');
const targetVersion = process.argv[2];

/**
 * Determines the tag type based on the version number.
 * @param {string} version - The version to evaluate.
 * @returns {string} - Returns 'unstable' if the version is a prerelease, otherwise 'latest'.
 */
function determineTag(version) {
    if (!semver.valid(version)) {
        console.error(`Error: the version "${version}" is invalid!`); // eslint-disable-line no-console
        process.exit(1);
    }
    return semver.prerelease(version) ? 'unstable' : 'latest';
}

const tag = determineTag(targetVersion);
console.log(`::set-output name=tag::--tag=${tag}`); // eslint-disable-line no-console
