type ResponseConstant = {
	STATUS: number;
	MESSAGE: string;
  };

  type ResponseMap = {
	[key: string]: ResponseConstant;
  };

  export enum HttpStatus {
	OK = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	INTERNAL_SERVER_ERROR = 500,
  }

  function createResponse(status: number, message: string): ResponseConstant {
	return { STATUS: status, MESSAGE: message };
  }

  export const RESPONSE: ResponseMap = {
	INTERNAL_SERVER_ERROR: createResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error."),
	MISSING_ID: createResponse(HttpStatus.BAD_REQUEST, "Missing ID in request."),
	FAILED_TO_DELETE_DATA: createResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete data."),
	FAILED_TO_UPDATE_DATA: createResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update data."),
	INVALID_DATA: createResponse(HttpStatus.BAD_REQUEST, "Invalid data provided."),
	SUCCESS: createResponse(HttpStatus.OK, "Operation completed successfully."),
	CREATED: createResponse(HttpStatus.CREATED, "Resource created successfully."),
  };
