import Joi from "joi";

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
