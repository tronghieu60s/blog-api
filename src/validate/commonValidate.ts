import Joi from "joi";

export const joiFilterSchema = Joi.object({
  q: Joi.string(),
  search: Joi.string(),
  page: Joi.number(),
  pageSize: Joi.number(),
  order: Joi.string(),
  orderby: Joi.string(),
});
