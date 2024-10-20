class ErrorResponse extends Error {
  constructor(message, status, errorCode, extra) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.extra = extra;
  }
}

export default ErrorResponse;
