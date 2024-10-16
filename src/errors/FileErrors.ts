import { CatchableError } from './CatchableError';

//////////////////////////////////////////////////

export class FileNotFoundError extends CatchableError {
	constructor(fullPath: string, error?: any) {
		super(`Can't find ${fullPath}`, error);
	}
}

export class FileAlreadyExistError extends CatchableError {
	constructor(fullPath: string, error?: any) {
		super(`File ${fullPath} already exits`, error);
	}
}

export class JSONParseError extends CatchableError {
	constructor(fullPath: string, error?: any) {
		super(`Problem parsing ${fullPath} to JSON`, error);
	}
}

export class SaveFileError extends CatchableError {
	constructor(fullPath: string, error?: any) {
		super(`Problem saving ${fullPath} `, error);
	}
}
