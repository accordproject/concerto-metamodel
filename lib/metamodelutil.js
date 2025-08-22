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
 * The metamodel itself, as an AST.
 * @type unknown
 */
const metaModelAst = require('./metamodel.json');

/**
 * The namespace for the metamodel
 */
const MetaModelNamespace = 'concerto.metamodel@1.0.0';

/**
 * The metamodel itself, as a CTO string
 */
const metaModelCto = require('./metamodel.js');

/**
 * Find the model for a given namespace
 * @param {*} priorModels - known models
 * @param {string} namespace - the namespace
 * @returns {*} the model
 */
function findNamespace(priorModels, namespace) {
    return priorModels.models.find((thisModel) => thisModel.namespace === namespace);
}

/**
 * Find a declaration for a given name in a model
 * @param {*} thisModel - the model
 * @param {string} name - the declaration name
 * @returns {*} the declaration
 */
function findDeclaration(thisModel, name) {
    return thisModel.declarations.find((thisDecl) => thisDecl.name === name);
}

/**
 * Create a name resolution table
 * @param {*} priorModels - known models
 * @param {object} metaModel - the metamodel (JSON)
 * @returns {object} mapping from a name to its namespace
 */
function createNameTable(priorModels, metaModel) {
    const concertoNs = 'concerto@1.0.0';
    const table = {
        'Concept': {namespace: concertoNs, name: 'Concept'},
        'Asset': {namespace: concertoNs, name: 'Asset'},
        'Participant': {namespace: concertoNs, name: 'Participant'},
        'Transaction': {namespace: concertoNs, name: 'Transaction'},
        'Event': {namespace: concertoNs, name: 'Event'},
    };

    // First list the imported names in order (overriding as we go along)
    (metaModel.imports || []).forEach((imp) => {
        const namespace = imp.namespace;
        const modelFile = findNamespace(priorModels, namespace);
        if (imp.$class === `${MetaModelNamespace}.ImportType`) {
            if (!findDeclaration(modelFile, imp.name)) {
                throw new Error(`Declaration ${imp.name} in namespace ${namespace} not found`);
            }
            table[imp.name] = {namespace, name: imp.name};
        } else if (imp.$class === `${MetaModelNamespace}.ImportTypes`) {
            // Create a map of aliased types if they exist, otherwise initialize an empty map.
            const aliasedMap = imp.aliasedTypes
                ? new Map(imp.aliasedTypes.map(({ name, aliasedName }) => [name, aliasedName]))
                : new Map();
            imp.types.forEach((type) => {
                // 'localName' is the identifier used to refer to the imported type, as it can be aliased..
                const localName = aliasedMap.get(type) || type;

                // Verify if the type declaration exists in the model file.
                // Here, 'type' refers to the actual declaration name within the model file that is being imported.
                if (!findDeclaration(modelFile, type)) {
                    throw new Error(`Declaration ${type} in namespace ${namespace} not found`);
                }
                table[localName] = localName !== type ? {namespace, name: localName, resolvedName: type} : {namespace, name: type};
            });
        } else {
            (modelFile.declarations || []).forEach((decl) => {
                table[decl.name] = {namespace, name: decl.name};
            });
        }
    });

    // Then add the names local to this metaModel (overriding as we go along)
    (metaModel.declarations || []).forEach((decl) => {
        table[decl.name] = {namespace: metaModel.namespace, name: decl.name};
    });

    return table;
}

/**
 * Resolve a name using the name table
 * @param {string} name - the name of the type to resolve
 * @param {object} table - the name table
 * @returns {string} the namespace for that name
 */
function resolveName(name, table) {
    if (!table[name]) {
        throw new Error(`Name ${name} not found`);
    }
    return table[name].namespace;
}

/**
 * Name resolution for metamodel
 * @param {object} metaModel - the metamodel (JSON)
 * @param {object} table - the name table
 * @returns {object} the metamodel with fully qualified names
 */
function resolveTypeNames(metaModel, table) {
    // any element can have a decorator (including primitive fields) , so lets resolve those first
    (metaModel.decorators || []).forEach((decorator) => {
        resolveTypeNames(decorator, table);
    });

    switch (metaModel.$class) {
    case `${MetaModelNamespace}.Model`: {
        (metaModel.declarations || []).forEach((decl) => {
            resolveTypeNames(decl, table);
        });
    }
        break;
    case `${MetaModelNamespace}.EnumDeclaration`:
    case `${MetaModelNamespace}.AssetDeclaration`:
    case `${MetaModelNamespace}.ConceptDeclaration`:
    case `${MetaModelNamespace}.EventDeclaration`:
    case `${MetaModelNamespace}.TransactionDeclaration`:
    case `${MetaModelNamespace}.ParticipantDeclaration`: {
        if (metaModel.superType) {
            const name = metaModel.superType.name;
            metaModel.superType.namespace = resolveName(name, table);
            metaModel.superType.name = table[name].name;
            if (table[name]?.resolvedName) {
                metaModel.superType.resolvedName = table[name].resolvedName;
            }
        }
        (metaModel.properties || []).forEach((property) => {
            resolveTypeNames(property, table);
        });
    }
        break;
    case `${MetaModelNamespace}.MapDeclaration`: {
        resolveTypeNames(metaModel.key, table);
        resolveTypeNames(metaModel.value, table);
    }
        break;
    case `${MetaModelNamespace}.Decorator`: {
        (metaModel.arguments || []).forEach((argument) => {
            resolveTypeNames(argument, table);
        });
    }
        break;
    case `${MetaModelNamespace}.ObjectProperty`:
    case `${MetaModelNamespace}.RelationshipProperty`:
    case `${MetaModelNamespace}.DecoratorTypeReference`:
    case `${MetaModelNamespace}.ObjectMapKeyType`:
    case `${MetaModelNamespace}.ObjectMapValueType`:
    case `${MetaModelNamespace}.RelationshipMapValueType`: {
        metaModel.type.namespace = resolveName(metaModel.type.name, table);
        metaModel.type.name = table[metaModel.type.name].name;
        if (table[metaModel.type.name]?.resolvedName) {
            metaModel.type.resolvedName = table[metaModel.type.name].resolvedName;
        }
    }
        break;
    case `${MetaModelNamespace}.StringScalar`:
    case `${MetaModelNamespace}.BooleanScalar`:
    case `${MetaModelNamespace}.DateTimeScalar`:
    case `${MetaModelNamespace}.DoubleScalar`:
    case `${MetaModelNamespace}.LongScalar`:
    case `${MetaModelNamespace}.IntegerScalar`: {
        metaModel.namespace = resolveName(metaModel.name, table);
        metaModel.name = table[metaModel.name].name;
    }
        break;
    }
    return metaModel;
}

/**
 * Resolve the namespace for names in the metamodel
 * @param {*} priorModels - known models
 * @param {object} metaModel - the MetaModel
 * @returns {object} the resolved metamodel
 */
function resolveLocalNames(priorModels, metaModel) {
    const result = JSON.parse(JSON.stringify(metaModel));
    const nameTable = createNameTable(priorModels, metaModel);
    // This adds the fully qualified names to the same object
    resolveTypeNames(result, nameTable);
    return result;
}

/**
 * Resolve the namespace for names in the metamodel
 * @param {*} allModels - known models
 * @returns {object} the resolved metamodel
 */
function resolveLocalNamesForAll(allModels) {
    const result = {
        $class: `${MetaModelNamespace}.Models`,
        models: [],
    };
    allModels.models.forEach((metaModel) => {
        const resolved = resolveLocalNames(allModels, metaModel);
        result.models.push(resolved);
    });
    return result;
}

/**
 * Return the fully qualified name for an import
 * @param {object} imp - the import
 * @returns {string[]} - the fully qualified names for that import
 * @private
 */
function importFullyQualifiedNames(imp) {
    const result = [];

    switch (imp.$class) {
    case `${MetaModelNamespace}.ImportAll`:
        result.push(`${imp.namespace}.*`);
        break;
    case `${MetaModelNamespace}.ImportType`:
        result.push(`${imp.namespace}.${imp.name}`);
        break;
    case `${MetaModelNamespace}.ImportTypes`: {
        imp.types.forEach(type => {
            result.push(`${imp.namespace}.${type}`);
        });
    }
        break;
    default:
        throw new Error(`Unrecognized imports ${imp.$class}`);
    }
    return result;
}

/**
 * Returns an object that maps from the import declarations to the URIs specified
 * @param {*} ast - the model ast
 * @returns {Object} keys are import declarations, values are URIs
 * @private
 */
function getExternalImports(ast) {
    const uriMap = {};
    if (ast.imports) {
        ast.imports.forEach((imp) => {
            const fqns = importFullyQualifiedNames(imp);
            if (imp.uri) {
                uriMap[fqns[0]] = imp.uri;
            }
        });
    }
    return uriMap;
}

module.exports = {
    metaModelAst,
    metaModelCto,
    resolveLocalNames,
    resolveLocalNamesForAll,
    importFullyQualifiedNames,
    getExternalImports,
};
