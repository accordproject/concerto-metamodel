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
 * The exception thrown by the MetaModelUtil functions, for example when a model
 * refers to a name that cannot be resolved or contains an unrecognized $class.
 *
 * It has the same shape as BaseException from @accordproject/concerto-util
 * (`name`, `message`, `component` and `errorType`), so callers can tell it apart
 * from other errors without matching on the message. It does not extend
 * BaseException because this package has no runtime dependencies, and
 * @accordproject/concerto-core itself depends on this package.
 * @extends Error
 * @class
 * @memberof module:concerto-metamodel
 */
class MetaModelUtilException extends Error {
    /**
     * Create the MetaModelUtilException.
     * @param {string} message - The exception message.
     */
    constructor(message) {
        super(message);
        // Set explicitly rather than from this.constructor.name, which minifiers rename
        this.name = 'MetaModelUtilException';
        this.component = '@accordproject/concerto-metamodel';
        this.errorType = 'MetaModelUtilException';
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = MetaModelUtilException;
