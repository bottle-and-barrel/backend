export enum AuthErrorCode {
  Exists = 0,
  NotFound = 1,
  InvalidCredentials = 2,
}

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(msg: string, code: AuthErrorCode) {
    super(`${AuthError.name}: [${code}] ${msg}`);
    this.code = code;
  }
}
