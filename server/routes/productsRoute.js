const router = require("express").Router();
const Product = require("../models/productModel");
const authMiddleware = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer  = require('multer')



router.post("/add-product", authMiddleware, async (req, res) => {


  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

    res
      .status(200)
      .send({ success: true, message: "product Added successfully" });
  }
  
  catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all products

router.get("/get-products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.send({
      success: true,
      products: products,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//edit a product

router.put("/edit-product/:id", authMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.send({
        success: false,
        message: "Product not found",
      });
    }

    res.send({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//delete a product

router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.send({
        success: false,
        message: "Product not found",
      });
    }

    res.send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//image to multer

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});      




router.post(
  "/upload-image-to-product",
  authMiddleware,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
      // console.log(req.file); // Check request body

    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });

      // Update product with new image
      const productId = req.body.productId;
      await Product.findByIdAndUpdate(productId, {
        $push: { images: result.secure_url },
      });

      // Send success response
      res.send({
        success: true,
        message: "Image uploaded successfully",
        data: result.secure_url
      });
    } catch (error) {
        console.log(error);
      // Send error response
      res.send({
        success: false,
        message: "image uploading failed",
      });
    }
  }
);

module.exports = router;
