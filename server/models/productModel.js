const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: [],
      required: true,
    },
    billAvailable: {
      type: Boolean,
      default: false,
      require: true,
    },
    warrantyAvailable: {
      type: Boolean,
      default: false,
      require: true,
    },
    accessorAvailable: {
      type: Boolean,
      default: false,
      require: true,
    },
    boxAvailable: {
      type: Boolean,
      default: false,
      require: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",     //refering to the users collection
      require: true,
    },
    status: {
      type: String,
      default: "pending",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("products", productSchema);
module.exports = User;
