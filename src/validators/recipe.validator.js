const { param, body } = require("express-validator");

const TagsValidator = ['allMeat', 'noMeat','withModetarionMeat', 'RedMeat', 'WhiteMeat', 'vegan', 'vegetarian', 'lactoseFree', 'noGluten', 'lowSodium', 'integralFood', 'SugarFree', 'withoutRestriction'
, 'almdonMilk', 'soyMilk', 'cowMilk', 'coconutMilk', 'withoutmilk', 'cheap', 'expensive', 'whiteRice', 'BrownRice', 'withoutRice', 'noMilk'];

const createRecipeValidator = [
  body('title')
    .isString().withMessage("title should be a string")
    .trim()
    .isLength({ min: 2 }).withMessage("title should have at least 2 characters"),

  body('ingredients')
    .isArray().withMessage("Ingredientes should be in an Array")
    .trim()
    .isLength({ min: 2, max: 240 })
    .withMessage("review should have between 8 and 240 characters"),

  body('tags')
    .isArray().withMessage("tags in an Array")
   .isIn(TagsValidator).withMessage("invalid tag"),

  body('image')
    .isURL().withMessage("cover should be a valid URL"),

  body('steps')
    .isArray().withMessage("Steps in an Array")
    .trim()
    .isLength({ max: 500 }),

  body('time')
    .isString().withMessage("Time should be a string")
    .trim()
    .custom((value, { req }) => {
      const validTimes = ['breakfast', 'lunch', 'dinner'];
      if (!validTimes.includes(value.toLowerCase())) {
        throw new Error('Time should be either "breakfast", "lunch" or "dinner"');
      }
      return true;
    }),

  body('cookinTime')
    .isNumeric().withMessage("Time of cooking should be a number")
    .trim(),
];

const updateRecipeValidator = [
  body('title')
    .optional()
    .isString().withMessage("title should be a string")
    .trim()
    .isLength({ min: 2 }).withMessage("title should have at least 2 characters"),

  body('ingredients')
    .optional()
    .isString().withMessage("ingredients should be a string")
    .trim()
    .isLength({ min: 2, max: 240 })
    .withMessage("review should have between 8 and 240 characters"),

  body('tags')
  .optional()
    .isArray().withMessage("tags in an Array")
   .isIn(TagsValidator).withMessage("invalid tag"),

  body('image')
    .optional()
    .isURL().withMessage("cover should be a valid URL"),

  body('steps')
    .optional()
    .isArray().withMessage("Steps in an Array")
    .isLength({ max: 500 }),

  body('time')
    .optional()
    .isString().withMessage("Time should be a string")
    .trim()
    .custom((value, { req }) => {
      const validTimes = ['breakfast', 'lunch', 'dinner'];
      if (!validTimes.includes(value.toLowerCase())) {
        throw new Error('Time should be either "breakfast", "lunch" or "dinner"');
      }
      return true;
    }),

  body('cookinTime')
    .optional()
    .isNumeric().withMessage("Time of cooking should be a number")
    .trim(),
];

const idInParams = [
  param("id")
    .notEmpty().withMessage("id field is required")
    .isMongoId().withMessage("id must be mongo id")
]

module.exports = { idInParams, createRecipeValidator, updateRecipeValidator };