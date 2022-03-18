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
  login_level: number;
  expire_in: number;
};

export type CreateCommentParams = {
  post_id: string;
  comment_author: string;
  comment_author_email: string;
  comment_author_url: string;
  comment_author_ip: string;
  comment_date: Date;
  comment_date_gmt: Date;
  comment_content: string;
  comment_karma: number;
  comment_approved: number;
  comment_agent: string;
  comment_type: string;
  comment_parent: string;
};
