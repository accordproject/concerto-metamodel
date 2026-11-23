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

const { MetaModelUtil, MetaModelUtilException } = require('..');

const chai = require('chai');
chai.should();

const MM = 'concerto.metamodel@1.0.0';

/**
 * Builds a Models object with an empty org.vehicle model followed by the given model
 * @param {object} model - the model under test
 * @return {object} the Models object
 */
function withVehicleModel(model) {
    return {
        $class: `${MM}.Models`,
        models: [
            { $class: `${MM}.Model`, namespace: 'org.vehicle', imports: [], declarations: [] },
            Object.assign({ $class: `${MM}.Model`, namespace: 'org.test', imports: [], declarations: [] }, model),
        ],
    };
}

/**
 * Runs fn and returns what it throws
 * @param {Function} fn - the function expected to throw
 * @return {*} the thrown value
 */
function thrownBy(fn) {
    try {
        fn();
    } catch (err) {
        return err;
    }
    throw new Error('Expected the function to throw');
}

describe('MetaModelUtilException', () => {
    it('should look like a BaseException', () => {
        const err = new MetaModelUtilException('boom');
        err.should.be.an.instanceof(Error);
        err.should.be.an.instanceof(MetaModelUtilException);
        err.name.should.equal('MetaModelUtilException');
        err.message.should.equal('boom');
        err.component.should.equal('@accordproject/concerto-metamodel');
        err.errorType.should.equal('MetaModelUtilException');
        err.stack.should.contain('MetaModelUtilException: boom');
    });

    describe('is thrown by MetaModelUtil', () => {
        const cases = [
            {
                title: 'for an ImportType whose declaration does not exist',
                message: 'Declaration Wheel in namespace org.vehicle not found',
                fn: () => MetaModelUtil.resolveLocalNamesForAll(withVehicleModel({
                    imports: [{ $class: `${MM}.ImportType`, namespace: 'org.vehicle', name: 'Wheel' }],
                })),
            },
            {
                title: 'for an ImportTypes entry whose declaration does not exist',
                message: 'Declaration Wheel in namespace org.vehicle not found',
                fn: () => MetaModelUtil.resolveLocalNamesForAll(withVehicleModel({
                    imports: [{ $class: `${MM}.ImportTypes`, namespace: 'org.vehicle', types: ['Wheel'] }],
                })),
            },
            {
                title: 'for a type name that cannot be resolved',
                message: 'Name Wheel not found',
                fn: () => MetaModelUtil.resolveLocalNamesForAll(withVehicleModel({
                    declarations: [{
                        $class: `${MM}.ConceptDeclaration`,
                        name: 'Car',
                        isAbstract: false,
                        properties: [{
                            $class: `${MM}.ObjectProperty`,
                            name: 'wheel',
                            type: { $class: `${MM}.TypeIdentifier`, name: 'Wheel' },
                            isArray: false,
                            isOptional: false,
                        }],
                    }],
                })),
            },
            {
                title: 'for a node without a $class',
                message: 'Unrecognized $class undefined',
                fn: () => MetaModelUtil.resolveLocalNamesForAll(withVehicleModel({
                    declarations: [{ name: 'Car', properties: [] }],
                })),
            },
            {
                title: 'for an unrecognized import',
                message: `Unrecognized imports ${MM}.MyImportType`,
                fn: () => MetaModelUtil.importFullyQualifiedNames({ $class: `${MM}.MyImportType`, namespace: 'test' }),
            },
        ];

        cases.forEach(({ title, message, fn }) => {
            it(title, () => {
                const err = thrownBy(fn);
                err.should.be.an.instanceof(MetaModelUtilException);
                err.message.should.equal(message);
                err.component.should.equal('@accordproject/concerto-metamodel');
            });
        });
    });
});
