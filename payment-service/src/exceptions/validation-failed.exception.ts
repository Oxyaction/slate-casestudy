export class ValidationFailedException {
  constructor(public readonly errors: Array<any>) {}
}