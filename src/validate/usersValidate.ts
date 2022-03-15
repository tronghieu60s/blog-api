import Joi from "joi";

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
  outdated: Joi.string(),
});

export const joiRegisterUserSchema = Joi.object({
  user_login: Joi.string().required(),
  user_pass: Joi.string().required(),
  user_email: Joi.string().required(),
});
