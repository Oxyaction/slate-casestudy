import { ValidationFailedException } from './validation-failed.exception';

export const validationErrorsFactory = errors => new ValidationFailedException(errors);