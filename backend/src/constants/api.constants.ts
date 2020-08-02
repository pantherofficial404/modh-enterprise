export const STATUS_CODE = {
  'Ok': 200,
  'Created': 201,
  'No Content': 204,
  'Not Modified': 304,
  'Bad Request': 400,
  'Unauthorized': 401,
  'Forbidden': 403,
  'Not Found': 404,
  'Gone': 410,
  'Internal Server Error': 500,
  'Service Unavailable': 503,
}

export enum ERROR_CODE {
  INVALID_OBJECTID = 100,
  INVALID_BODY = 101,
  USER_ALREADY_EXISTS = 201,
}
