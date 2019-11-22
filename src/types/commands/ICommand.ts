import ICommandResult from "./ICommandResult";

/**
 * Command interface. 
 *
 * @export
 * @interface ICommand
 * @template T
 */
export default interface ICommand<T> {
    /**
     * Executes the command.
     *
     * @param {T} args Agrument object.
     * @returns {ICommandResult} Command result.
     * @memberof ICommand
     */
    execute(args: T): ICommandResult;
}