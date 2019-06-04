export class ParsingException extends Error {
  constructor(message, fileName, lineNumber) {
    super();
    this.message = message;
    this.fileName = fileName;
    this.lineNumber = lineNumber;
    Error.captureStackTrace(this, ParsingException);
  }
}

export class RowException extends Error {
  constructor(message, fileName, lineNumber) {
    super();
    this.message = message;
    this.fileName = fileName;
    this.lineNumber = lineNumber;
    Error.captureStackTrace(this, RowException);
  }
}
