import Joi from "joi";

export const joiFilterSchema = Joi.object({
  q: Joi.string(),
  search: Joi.string(),
  page: Joi.number(),
  pageSize: Joi.number(),
  order: Joi.string(),
  orderby: Joi.string(),
});

/* Users Validate */

export const joiCreateUserSchema = Joi.object({
  user_login: Joi.string().required(),
  user_pass: Joi.string().required(),
  user_nicename: Joi.string(),
  user_email: Joi.string().required(),
  user_url: Joi.string(),
  user_status: Joi.number(),
  display_name: Joi.string(),
});

export const joiUpdateUserSchema = Joi.object({
  user_pass: Joi.string(),
  user_nicename: Joi.string(),
  user_email: Joi.string(),
  user_url: Joi.string(),
  user_status: Joi.number(),
  display_name: Joi.string(),
});

export const joiAuthUserSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
  expire: Joi.string(),
});

export const joiRegisterUserSchema = Joi.object({
  user_login: Joi.string().required(),
  user_pass: Joi.string().required(),
  user_email: Joi.string().required(),
});

/* Posts Validate */

export const joiCreatePostsSchema = Joi.object({
  post_date: Joi.date(),
  post_date_gmt: Joi.date(),
  post_content: Joi.string().required(),
  post_title: Joi.string().required(),
  post_excerpt: Joi.string(),
  post_status: Joi.string(),
  comment_status: Joi.string(),
  ping_status: Joi.string(),
  post_password: Joi.string(),
  post_name: Joi.string(),
  to_ping: Joi.string(),
  pinged: Joi.string(),
  post_modified: Joi.date(),
  post_modified_gmt: Joi.date(),
  post_content_filtered: Joi.string(),
  post_parent: Joi.string(),
  guid: Joi.string(),
  menu_order: Joi.number(),
  post_type: Joi.string(),
  post_mime_type: Joi.string(),
});

export const joiUpdatePostsSchema = Joi.object({
  post_date: Joi.date(),
  post_date_gmt: Joi.date(),
  post_content: Joi.string(),
  post_title: Joi.string(),
  post_excerpt: Joi.string(),
  post_status: Joi.string(),
  comment_status: Joi.string(),
  ping_status: Joi.string(),
  post_password: Joi.string(),
  post_name: Joi.string(),
  to_ping: Joi.string(),
  pinged: Joi.string(),
  post_modified: Joi.date(),
  post_modified_gmt: Joi.date(),
  post_content_filtered: Joi.string(),
  post_parent: Joi.string(),
  guid: Joi.string(),
  menu_order: Joi.number(),
  post_type: Joi.string(),
  post_mime_type: Joi.string(),
});

/* Comments Validate */

export const joiCreateCommentsSchema = Joi.object({
  post_id: Joi.string().required(),
  comment_author: Joi.string(),
  comment_author_email: Joi.string(),
  comment_author_url: Joi.string(),
  comment_author_ip: Joi.string(),
  comment_date: Joi.date(),
  comment_date_gmt: Joi.date(),
  comment_content: Joi.string().required(),
  comment_karma: Joi.number(),
  comment_approved: Joi.number(),
  comment_agent: Joi.string(),
  comment_type: Joi.string(),
  comment_parent: Joi.string(),
});

export const joiUpdateCommentsSchema = Joi.object({
  comment_author: Joi.string(),
  comment_author_email: Joi.string(),
  comment_author_url: Joi.string(),
  comment_author_ip: Joi.string(),
  comment_date: Joi.date(),
  comment_date_gmt: Joi.date(),
  comment_content: Joi.string(),
  comment_karma: Joi.number(),
  comment_approved: Joi.number(),
  comment_agent: Joi.string(),
  comment_type: Joi.string(),
});
