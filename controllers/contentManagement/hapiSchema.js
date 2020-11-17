'use strict';
const Joi = require('joi');
const createContentSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(20)
    .required(),
  contentType: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required(),
  format: Joi.string()
    .trim()
    .min(1)
    .max(50),
  fileId: Joi.string()
    .trim()
    .min(3)
    .max(20),
  context: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required(),
});

const moveContentSchema = Joi.object({
  contentId: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required(),
  context: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required(),
});

module.exports = {createContentSchema, moveContentSchema};
