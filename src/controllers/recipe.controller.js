const httpError = require("http-errors");
const Recipe = require("../models/recipe.model");
const debug = require("debug")("MyMeal-api  :recipe-controller");


const createRecipe = async (req, res, next) => {
    //la ruta autenticada
    // Code goes here...
    try {
        // Happy path code...
        const { body } = req;
        const {user} = req;
         body.user = user._id;
      //  debug({user});
        const newRecipe = new Recipe(body);
        const savedRecipe = await newRecipe.save();
        if (!savedRecipe) throw httpError(500, "Recipe not created");
        res.status(201).json({ message: "Recipe created", data: savedRecipe });
    } catch (error) {
        next(error);
    }
};

const getRecipes = async (req, res, next) => {
    try {
        // Happy path goes here...
        const Recipes = await Recipe.find();
        if (!Recipes) throw httpError(404, "Recipes not found");
        res.status(200).json({ data: Recipes });
    } catch (error) {
        next(error);
    }
};

const getOneRecipe = async (req, res, next) => {
    try {
        // Happy path goes here...
        const { id } = req.params;
        const recipe = await Recipe.findById(id);
        if (!recipe) throw httpError(404, "Recipe not found");
        res.status(200).json({ data: recipe });
    } catch (error) {
        next(error);
    }
};

const getRecipeByTags = async (req, res, next) =>{
    try {
        
        const { tags } = req.body;
        console.log(tags);
        debug(tags)
        if (!tags|| !Array.isArray(tags)) {
            throw httpError(400, "Tag parameter is required");
        }

        const query = {
            tags: { $in: tags }
        };

        const recipes = await Recipe.find(query);

        if (recipes.length === 0) {
            throw httpError(404, `No recipes found with the tag: ${tag}`);
        }

        res.status(200).json({ data: recipes });


    } catch (error) {
        next(error);
    }
}

const updateRecipe = async (req, res, next) => {
    try {
        // Happy path goes here...
        const { id } = req.params;
        const { body } = req;
        const {user} = req;

        const toUpdateRecipe = await Recipe.findById(id);
        if (!toUpdateRecipe) throw httpError(404, "Recipe not found");
         // Verificar si el _id en la solicitud coincide con el _id del usuario
         if (toUpdateRecipe.user && !toUpdateRecipe.user.equals(user._id)  ) {
            return res.status(403).json({ error: "This is not your receta mamasota" });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(id, body, {
            new: true,
        });
        if (!updatedRecipe) throw httpError(500, "Recipe not updated");
        res.status(200).json({ message: "Recipe updated", data: updatedRecipe });
    } catch (error) {
        next(error);
    }
};

const deleteRecipe = async(req,res,next) =>{
    try {
        const {id} = req.params;
        const recipe = await Recipe.findById(id);
        const {user} = req;
        
        if (!recipe) throw httpError(404, "Recipe not found");

                     // Verificar si el _id en la solicitud coincide con el _id del usuario
         if (recipe.user && !recipe.user.equals(user._id)  ) {
            return res.status(403).json({ error: "This is not your receta mamasota" });
        }

        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) throw httpError(500, "Recipe not deleted");
        res.status(200).json({ message: "Deleted recipe"});
    } catch (error) {
        next(error);
    }
  }
  
const addRatingToRecipe = async(req,res, next)=>{
    try {
        const { recipeId, rating } = req.body;
    
        if (!recipeId || !rating) {
          throw httpError(400, "Recipe ID and rating are required");
        }
    
        if (rating < 1 || rating > 5) {
          throw httpError(400, "Rating must be between 1 and 5");
        }
    
        const recipe = await Recipe.findById(recipeId);
    
        if (!recipe) {
          throw httpError(404, "Recipe not found");
        }
    
        recipe.ratings.push({ user: req.user._id, rating });
        
        await recipe.save();
    
        res.status(200).json({ message: "Rating added successfully" });
      } catch (error) {
        next(error);
      }
}
module.exports = {
    createRecipe,
    getRecipes,
    getOneRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeByTags,
    addRatingToRecipe
  };