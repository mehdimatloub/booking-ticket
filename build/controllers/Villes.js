"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Ville = require("../models/Ville");
const Evenement = require("../models/Evenement");
const express = require("express");
const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const nouvelleVille = req.body;
        const ville = await Ville.create(nouvelleVille);
        res.status(201).json(ville);
    }
    catch (error) {
        console.error('Échec de la création de la ville :', error);
        res.status(500).json({ message: 'Échec de la création de la ville' });
    }
});
router.get('/', async (req, res) =>  {
    try {
        const villes = await Ville.findAll();
        res.json(villes);
    }
    catch (error) {
        console.error('Échec de la récupération des villes :', error);
        res.status(500).json({ message: 'Échec de la récupération des villes' });
    }
});
router.get('/:villeId', async (req, res) => {
    const villeId = req.params.villeId;
    try {
        const ville = await Ville.findByPk(villeId, {
            include:[ { all: true, nested: true }]} 
               );
        if (ville) {
            res.json(ville);
        }
        else {
            res.status(404).json({ message: 'Ville introuvable' });
        }
    }
    catch (error) {
        console.error('Échec de la récupération de la ville :', error);
        res.status(500).json({ message: 'Échec de la récupération de la ville' });
    }
});
router.put('/:villeId', async (req, res) =>  {
    const villeId = req.params.villeId;
    const updatedVille = req.body;
    try {
        const [affectedRows] = await Ville.update(updatedVille, {
            where: { id: villeId },
        });
        if (affectedRows === 0) {
            res.status(404).json({ message: 'Ville introuvable' });
        }
        else {
            res.json(updatedVille);
        }
    }
    catch (error) {
        console.error('Échec de la mise à jour de la ville :', error);
        res.status(500).json({ message: 'Échec de la mise à jour de la ville' });
    }
});
router.delete('/:villeId', async (req, res) =>  {
    const villeId = req.params.villeId;
    try {
        const affectedRows = await Ville.destroy({ where: { id: villeId } });
        if (affectedRows === 0) {
            res.status(404).json({ message: 'Ville introuvable' });
        }
        else {
            res.sendStatus(204);
        }
    }
    catch (error) {
        console.error('Échec de la suppression de la ville :', error);
        res.status(500).json({ message: 'Échec de la suppression de la ville' });
    }
});
router.post('/:villeId/evenements', async (req, res) => {
    const villeId = req.params.villeId;
    const nouvelEvenement = req.body;
    try {
        const ville = await Ville.findByPk(villeId);
        if (ville) {
            const evenement = await Evenement.create(nouvelEvenement);
            await ville.addEvenement(evenement);
            res.status(201).json(evenement);
        }
        else {
            res.status(404).json({ message: 'Ville introuvable' });
        }
    }
    catch (error) {
        console.error('Échec de l\'ajout de l\'événement :', error);
        res.status(500).json({ message: 'Échec de l\'ajout de l\'événement' });
    }
});
router.get('/:villeId/evenements', async (req, res) => {
    const villeId = req.params.villeId;
    try {
      const ville = await Ville.findByPk(villeId);
      if (ville) {
        const evenements = await Evenement.findAll({
          where: { villeId: villeId },
        });
        res.json(evenements);
      } else {
        res.status(404).json({ message: 'Ville introuvable' });
      }
    } catch (error) {
      console.error('Échec de la récupération des événements :', error);
      res.status(500).json({ message: 'Échec de la récupération des événements' });
    }
  });
  
  module.exports = router;