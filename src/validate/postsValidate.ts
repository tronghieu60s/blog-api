import Joi from "joi";

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