const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bikeshop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Bike Model
const Product = mongoose.model("Product", new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String
}));

// Seed the database with some bike data (optional)
const seedData = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    const products = [
      { name: "Mountain Bike", price: 499, description: "Perfect for rough terrain", imageUrl: "bike1.jpg" },
      { name: "Road Bike", price: 699, description: "Fast and efficient on roads", imageUrl: "bike2.jpg" },
      { name: "Hybrid Bike", price: 599, description: "Great for both streets and trails", imageUrl: "bike3.jpg" }
    ];
    await Product.insertMany(products);
  }
};

// API Routes

// Get all products
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get a specific product by ID
app.get("/api/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Product not found");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  seedData();
});
