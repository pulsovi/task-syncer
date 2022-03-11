import 'core-js/actual/aggregate-error';

import type ModuleLoader from '../ModuleLoader';

import InvalidArgTypeErrorManager from './InvalidArgTypeErrorManager';
import ModuleNotFoundErrorManager from './ModuleNotFoundErrorManager';
import type { BaseErrorManager, ErrorWithCode } from './types';

export default class ImportErrorManager<U> implements BaseErrorManager {
  private readonly moduleLoader: ModuleLoader<U>;
  private readonly specificManager: BaseErrorManager;

  public constructor (error: Error, moduleLoader: ModuleLoader<U>) {
    this.moduleLoader = moduleLoader;
    if (!ImportErrorManager.isManageable(error)) {
      throw new AggregateError([
        new TypeError('Only errors with a "code" property of type string can be handled.'),
        error,
      ], 'Unable to manage this error');
    }
    if (error.code === 'MODULE_NOT_FOUND')
      this.specificManager = new ModuleNotFoundErrorManager(error);
    else if (error.code === 'ERR_INVALID_ARG_TYPE')
      this.specificManager = new InvalidArgTypeErrorManager(error);
    else {
      console.info(error);
      throw new Error(`Aucun gestionnaire n'est défini pour les erreurs de ce type : "${error.code}".`);
    }
  }

  public static isManageable (error: unknown): error is ErrorWithCode {
    const testedError = error as ErrorWithCode;
    return testedError instanceof Error && 'string' === typeof testedError.code;
  }

  public async manage (): Promise<void> {
    await this.specificManager.manage();
  }
}
