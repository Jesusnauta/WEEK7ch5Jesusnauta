export interface CustomError extends Error {
  statusCode: number;
  statusMessage: string;
}
export class HTTPError extends Error implements CustomError {
  constructor(
    public statusCode: number,
    public statusMessage: string,
    public message: string
  ) {
    super(message);
    this.name = 'HTTPError';
  }
}
