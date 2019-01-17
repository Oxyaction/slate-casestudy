import { ApiError } from './api-error.interface';

export class ApiValidationAttributeError {
  public readonly attribute: string;
  public readonly errors: string[];
}

export class ApiValidationError extends ApiError {
  public readonly errors: ApiValidationAttributeError[];
}