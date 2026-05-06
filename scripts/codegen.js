'use strict';

const fs = require('fs');
const { ModelManager } = require('@accordproject/concerto-core');
const { CodeGen: { TypescriptVisitor }} = require('@accordproject/concerto-codegen');
const { FileWriter } = require('@accordproject/concerto-util');
const path = require('path');

const INDEX_DTS = path.resolve(__dirname, '..', 'types', 'index.d.ts');

const EXTRA_EXPORTS = [
    'export * from \'./lib/concerto@1.0.0\';',
    'export * from \'./lib/concerto.metamodel@1.0.0\';',
    'export * as concertoWithUnions from \'./lib/unions/concerto@1.0.0\';',
    'export * as concertoMetamodelWithUnions from \'./lib/unions/concerto.metamodel@1.0.0\';',
].join('\n');

/**
 * Generate TypeScript files from the metamodel.
 */
async function main() {
    const modelManager = new ModelManager({addMetamodel:true, strict: true});
    const visitor = new TypescriptVisitor();

    const fileWriter = new FileWriter(path.resolve(__dirname, '..', 'types', 'lib'));
    modelManager.accept(visitor, { fileWriter });

    const fileWriter2 = new FileWriter(path.resolve(__dirname, '..', 'types', 'lib/unions'));
    modelManager.accept(visitor, { fileWriter: fileWriter2, flattenSubclassesToUnion: true });

    // Append the extra re-exports to types/index.d.ts (which tsc regenerates from
    // index.js and therefore does not include these generated-type exports).
    let indexDts = fs.readFileSync(INDEX_DTS, 'utf-8').trimEnd();
    if (!indexDts.includes('export * from \'./lib/concerto@1.0.0\'')) {
        indexDts += '\n\n' + EXTRA_EXPORTS + '\n';
        fs.writeFileSync(INDEX_DTS, indexDts, 'utf-8');
    }
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
