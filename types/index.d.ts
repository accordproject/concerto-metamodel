import MetaModelUtil = require("./lib/metamodelutil");
import { DcsCto } from "./lib/dcsmodel";
import { DcsNamespace } from "./lib/dcsmodel";
export declare let MetaModelNamespace: string;
export { MetaModelUtil, DcsCto, DcsNamespace };

export * from './lib/concerto@1.0.0';
export * from './lib/concerto.metamodel@1.0.0';
export * as concertoWithUnions from './lib/unions/concerto@1.0.0';
export * as concertoMetamodelWithUnions from './lib/unions/concerto.metamodel@1.0.0';
