export = MetaModelUtilException;
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
declare class MetaModelUtilException extends Error {
    /**
     * Create the MetaModelUtilException.
     * @param {string} message - The exception message.
     */
    constructor(message: string);
    component: string;
    errorType: string;
}
