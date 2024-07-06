export class NotFoundError extends Error {
  constructor(model: string, ...attr: string[]) {
    super(`${model} not found [${attr.join(' | ')}]`);
    this.name = 'NotFoundError';
  }
}
