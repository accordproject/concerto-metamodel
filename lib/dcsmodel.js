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

/* eslint-disable */

'use strict';

const DcsCto = "/*\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nnamespace org.accordproject.decoratorcommands@0.4.0\n\nimport concerto.metamodel@1.0.0.Decorator\n\n/**\n * A reference to an existing named & versioned DecoratorCommandSet\n */\nconcept DecoratorCommandSetReference {\n    o String name\n    o String version\n}\n\n/**\n * Whether to upsert or append the decorator\n */\nenum CommandType {\n    o UPSERT\n    o APPEND\n}\n\n/**\n * Which models elements to add the decorator to. Any null\n * elements are 'wildcards'.\n */\nconcept CommandTarget {\n    o String namespace optional\n    o String declaration optional\n    o String property optional\n    o String[] properties optional // property and properties are mutually exclusive\n    o String type optional\n    o MapElement mapElement optional\n}\n\n/**\n * Map Declaration elements which might be used as a target\n */\nenum MapElement {\n    o KEY\n    o VALUE\n    o KEY_VALUE\n}\n\n/**\n * Applies a decorator to a given target\n */\nconcept Command {\n    o CommandTarget target\n    o Decorator decorator\n    o CommandType type\n    o String decoratorNamespace optional\n}\n\n/**\n * A named and versioned set of commands. Includes are supported for modularity/reuse.\n */\nconcept DecoratorCommandSet {\n    o String name\n    o String version\n    o DecoratorCommandSetReference[] includes optional // not yet supported\n    o Command[] commands\n}";

module.exports = DcsCto;