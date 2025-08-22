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



/**
 * Concerto metamodel management. Concerto is a framework for defining domain
 * specific models.
 *
 * @module concerto-metamodel
 */

// MetaModel handling
const MetaModelUtil = require('./lib/metamodelutil');
const { DcsCto, DcsNamespace } = require('./lib/dcsmodel');

module.exports = {
    MetaModelUtil,
    MetaModelNamespace: 'concerto.metamodel@1.0.0',
    DcsCto,
    DcsNamespace,
};
