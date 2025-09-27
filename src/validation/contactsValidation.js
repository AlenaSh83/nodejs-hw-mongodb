import Joi from 'joi';

// Схема для створення контакту
export const createContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must be at most 20 characters long',
      'any.required': 'Name is required',
    }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.base': 'Phone number must be a string',
      'string.min': 'Phone number must be at least 3 characters long',
      'string.max': 'Phone number must be at most 20 characters long',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string()
    .email()
    .min(3)
    .max(20)
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.min': 'Email must be at least 3 characters long',
      'string.max': 'Email must be at most 20 characters long',
    }),
  isFavourite: Joi.boolean()
    .messages({
      'boolean.base': 'isFavourite must be a boolean',
    }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.base': 'Contact type must be a string',
      'any.only': 'Contact type must be one of: work, home, personal',
      'any.required': 'Contact type is required',
    }),
});

// Схема для оновлення контакту
export const updateContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must be at most 20 characters long',
    }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .messages({
      'string.base': 'Phone number must be a string',
      'string.min': 'Phone number must be at least 3 characters long',
      'string.max': 'Phone number must be at most 20 characters long',
    }),
  email: Joi.string()
    .email()
    .min(3)
    .max(20)
    .messages({
      'string.email': 'Email must be a valid email address',
      'string.min': 'Email must be at least 3 characters long',
      'string.max': 'Email must be at most 20 characters long',
    }),
  isFavourite: Joi.boolean()
    .messages({
      'boolean.base': 'isFavourite must be a boolean',
    }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .messages({
      'string.base': 'Contact type must be a string',
      'any.only': 'Contact type must be one of: work, home, personal',
    }),
});