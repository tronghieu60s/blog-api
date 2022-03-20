import Joi from "joi";

export const joiFilterSchema = Joi.object({
  q: Joi.string(),
  search: Joi.string(),
  page: Joi.number(),
  pageSize: Joi.number(),
  order: Joi.string(),
  orderby: Joi.string(),
});

export const joiDeleteManySchema = Joi.object({
  ids: Joi.array().items(Joi.string()),
});

export const joiCreateMetaSchema = Joi.object({
  meta_key: Joi.string().required(),
  meta_value: Joi.string().allow(""),
});

export const joiUpdateMetaSchema = Joi.object({
  meta_value: Joi.string().allow(""),
});

export const joiSendEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  content: Joi.string().required(),
});
