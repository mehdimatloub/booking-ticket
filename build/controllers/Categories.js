"use strict";

const Category = require("../models/Category");
const Evenement = require("../models/Evenement");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const nouvelleCategory = req.body;
    const category = await Category.create(nouvelleCategory);
    res.status(201).json(category);
  } catch (error) {
    console.error("Échec de la création de la catégorie :", error);
    res.status(500).json({ message: "Échec de la création de la catégorie" });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Échec de la récupération des catégories :", error);
    res.status(500).json({ message: "Échec de la récupération des catégories" });
  }
});

router.get("/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findByPk(categoryId, {
      include: [{ all: true, nested: true }],
    });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Catégorie introuvable" });
    }
  } catch (error) {
    console.error("Échec de la récupération de la catégorie :", error);
    res.status(500).json({ message: "Échec de la récupération de la catégorie" });
  }
});

router.put("/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  const updatedCategory = req.body;
  try {
    const [affectedRows] = await Category.update(updatedCategory, {
      where: { id: categoryId },
    });
    if (affectedRows === 0) {
      res.status(404).json({ message: "Catégorie introuvable" });
    } else {
      res.json(updatedCategory);
    }
  } catch (error) {
    console.error("Échec de la mise à jour de la catégorie :", error);
    res.status(500).json({ message: "Échec de la mise à jour de la catégorie" });
  }
});

router.delete("/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const affectedRows = await Category.destroy({ where: { id: categoryId } });
    if (affectedRows === 0) {
      res.status(404).json({ message: "Catégorie introuvable" });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Échec de la suppression de la catégorie :", error);
    res.status(500).json({ message: "Échec de la suppression de la catégorie" });
  }
});

router.post("/:categoryId/evenements", async (req, res) => {
  const categoryId = req.params.categoryId;
  const nouvelEvenement = req.body;
  try {
    const category = await Category.findByPk(categoryId);
    if (category) {
      const evenement = await Evenement.create(nouvelEvenement);
      await category.addEvenement(evenement);
      res.status(201).json(evenement);
    } else {
      res.status(404).json({ message: "Catégorie introuvable" });
    }
  } catch (error) {
    console.error("Échec de l'ajout de l'événement :", error);
    res.status(500).json({ message: "Échec de l'ajout de l'événement" });
  }
});

router.get("/:categoryId/evenements", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findByPk(categoryId);
    if (category) {
      const evenements = await Evenement.findAll({
        where: { categoryId: categoryId },
      });
      res.json(evenements);
    } else {
      res.status(404).json({ message: "Catégorie introuvable" });
    }
  } catch (error) {
    console.error("Échec de la récupération des événements :", error);
    res
      .status(500)
      .json({ message: "Échec de la récupération des événements" });
  }
});

module.exports = router;
