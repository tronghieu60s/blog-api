export type ResponseRows = PaginationParams & {
  items: any[];
};
export type ResponseResult = {
  data: any[] | ResponseRows;
  insertId?: string | null;
  rowsAffected?: number | null;
};
export type ResponseCommon = {
  status?: number;
  success?: boolean;
  message?: string;
  results?: ResponseResult;
};
export type ResponseError = ResponseCommon & { errors?: Error | ResponseError };

export type PaginationParams = {
  page?: number;
  pageSize?: number;
  pageTotal?: number;
  nextPage?: number | null;
  previousPage?: number | null;
};
