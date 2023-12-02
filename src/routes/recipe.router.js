const express = require("express");
const router = express.Router();
const ROLES = require("../data/roles.constants.json");

const { authentication, authorization} = require ("../middlewares/auth.middleware");

const {
    createRecipe,
    getRecipes,
    getOneRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeByTags,
    addRatingToRecipe
  } = require("../controllers/recipe.controller");

  const {
    idInParams,
    createRecipeValidator,
    updateRecipeValidator,
  } = require("../validators/recipe.validator");


  const { runValidation } = require("../middlewares/validator.middleware");

  router.post("/", authentication,authorization(ROLES.MOD),createRecipeValidator,runValidation,createRecipe);
  router.get("/", getRecipes);
  router.post("/bytags" ,getRecipeByTags);
  router.post("/details",authentication,runValidation, addRatingToRecipe);
  router.get("/:id",idInParams,runValidation, getOneRecipe);
  router.put("/:id", idInParams, authentication,authorization(ROLES.MOD),updateRecipeValidator,runValidation,updateRecipe);
  router.delete("/:id",idInParams,authentication,authorization(ROLES.MOD), runValidation ,deleteRecipe);
  module.exports = router; 