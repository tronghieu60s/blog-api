export type GetUsersParams = {
  q: string;
  search: string;
  page: number;
  pageSize: number;
  order: string;
  orderby: string;
};

export type CreateUserParams = {
  user_login: string;
  user_pass: string;
  user_nicename?: string;
  user_email: string;
  user_url?: string;
  user_status?: number;
  display_name?: string;
};