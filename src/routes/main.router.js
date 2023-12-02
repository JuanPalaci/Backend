const express = require('express');
const router = express.Router();

const recipesRouter = require('./recipe.router');
const authRouter = require('./auth.router');

router.use('/auth',authRouter);
router.use('/recipes', recipesRouter);

module.exports = router;
