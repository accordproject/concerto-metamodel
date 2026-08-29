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

'use strict';

/**
 * Concerto metamodel management. Concerto is a framework for defining domain
 * specific models.
 *
 * @module concerto-metamodel
 */

// MetaModel handling
const MetaModelUtil = require('./lib/metamodelutil');
const { DcsCto, DcsNamespace } = require('./lib/dcsmodel');

// Hoisted to a local binding (rather than an inline string literal in the
// object below) so that cjs-module-lexer - the static analyzer Node's ESM
// loader uses to detect named exports of a CommonJS module - can see it.
// The lexer only recognises `key: identifier` assignments; a `key: <string
// literal>` entry stops it from scanning any properties that follow it,
// which silently hid DcsCto and DcsNamespace from ESM `import { ... }`.
const MetaModelNamespace = /** @type {string} */ ('concerto.metamodel@1.0.0');

exports.MetaModelUtil = MetaModelUtil;
exports.MetaModelNamespace = MetaModelNamespace;
exports.DcsCto = DcsCto;
exports.DcsNamespace = DcsNamespace;
