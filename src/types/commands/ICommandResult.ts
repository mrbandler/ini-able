/**
 * Command result interface.
 *
 * @export
 * @interface ICommandResult
 */
export default interface ICommandResult {
    /**
     * Return code of the command.
     *
     * @type {number}
     * @memberof ICommandResult
     */
    code: number;

    /**
     * Message of the command.
     *
     * @type {string}
     * @memberof ICommandResult
     */
    message: string;
}