'use strict';
const Joi = require('joi');
const loginSchema = Joi.object({
  userId: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(50)
    .required(),
});

module.exports = {loginSchema};
