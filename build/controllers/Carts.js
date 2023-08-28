"use strict";
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart"); // Import the Cart model

// Create a new cart instance using the constructor (use the new keyword)
router.post("/", async (req, res) => {
  try {
    const newCart = req.body;
    const cart = new Cart(newCart); // Use the new keyword
    await cart.save(); // Save the new cart instance
    res.status(201).json(cart);
  } catch (error) {
    console.error("Failed to create cart:", error);
    res.status(500).json({ error: "Failed to create cart" });
  }
});


router.get("/", async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (error) {
    console.error("Failed to retrieve carts:", error);
    res.status(500).json({ message: "Failed to retrieve carts" });
  }
});

router.get("/:cartId", async (req, res) => {
  const cartId = req.params.cartId;
  try {
    const cart = await Cart.findByPk(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Failed to retrieve cart:", error);
    res.status(500).json({ message: "Failed to retrieve cart" });
  }
});

router.put("/:cartId", async (req, res) => {
  const cartId = req.params.cartId;
  const updatedCart = req.body;
  try {
    const [affectedRows] = await Cart.update(updatedCart, {
      where: { id: cartId },
    });
    if (affectedRows === 0) {
      res.status(404).json({ message: "Cart not found" });
    } else {
      res.json(updatedCart);
    }
  } catch (error) {
    console.error("Failed to update cart:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

router.delete("/:cartId", async (req, res) => {
  const cartId = req.params.cartId;
  try {
    const affectedRows = await Cart.destroy({ where: { id: cartId } });
    if (affectedRows === 0) {
      res.status(404).json({ message: "Cart not found" });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Failed to delete cart:", error);
    res.status(500).json({ message: "Failed to delete cart" });
  }
});

module.exports = router;
