export type ResponseRows = ResponsePaginationResult & {
  items: any[];
};
export type ResponseResult = {
  data?: any | ResponseRows;
  insertId?: string | null;
  rowsAffected?: number | null;
};
export type ResponsePaginationResult = {
  page?: number;
  pageSize?: number;
  pageTotal?: number;
  nextPage?: number | null;
  previousPage?: number | null;
};
export type ResponseCommon = {
  status?: number;
  success?: boolean;
  message?: string;
  results?: ResponseResult;
};
export type ResponseError = ResponseCommon & { errors?: Error | ResponseError };

export type TokenParams = {
  login: string | null;
  login_ip: string;
  expire_in: number;
};
