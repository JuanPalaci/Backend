const { Schema, model } = require("mongoose");

const RecipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ingredients: [{
      type: String,
      required: true
    }],
    tags: [{
      type: String,
      required: true
    }],
    time: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    }, steps: [{
      type: String,
      required: true,
    }],
    cookinTime: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ratings: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    }],
    ratings: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    }],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

RecipeSchema.methods.calculateAverageRating = function () {
  const totalRatings = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
  this.averageRating = this.ratings.length > 0 ? totalRatings / this.ratings.length : 0;
};

RecipeSchema.pre('save', function (next) {
  this.calculateAverageRating();
  next();
});

module.exports = model("Recipe", RecipeSchema);