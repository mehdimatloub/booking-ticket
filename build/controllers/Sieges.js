'use strict';

const express = require('express');
const Siege = require('../models/Siege'); // Adjust import paths if needed


const router = express.Router();

const afficherSieges = async (req, res) => {
  const id = req.params.id;
  try {
    const siege = await Siege.findByPk(id, {
      include: [{ all: true, nested: true }],
    });

    if (!siege) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    res.json(siege);
  } catch (error) {
    console.error('Error retrieving seat:', error);
    res.status(500).json({ message: 'Failed to retrieve seat' });
  }
};

const getAllSieges = async (req, res) => {
  try {
    const sieges = await Siege.findAll();
    res.json(sieges);
  } catch (error) {
    console.error('Failed to retrieve seats:', error);
    res.status(500).json({ message: 'Failed to retrieve seats' });
  }
};

const verifierDisponibiliteSiege = async (req, res) => {
    const siegeId = req.params.siegeId;
    try {
      // Find the siege by its ID
      const siege = await Siege.findByPk(siegeId);
  
      if (!siege) {
        return res.status(404).json({ message: 'Seat not found' });
      }
  
      // Check the value of the 'statut' column
      if (siege.statut === 'Disponible') {
        res.json({ available: true });
      } else {
        res.json({ available: false });
      }
    } catch (error) {
      console.error('Failed to verify seat availability:', error);
      res
        .status(500)
        .json({ message: 'Failed to verify seat availability' });
    }
  };
  

const addSiege = async (req, res) => {
  const { numero, statut, salleId, prix } = req.body;

  try {
    const newSiege = await Siege.create({
      numero,
      statut,
      salleId,
      prix,
    });

    res.status(201).json(newSiege);
  } catch (error) {
    console.error('Failed to add seat:', error);
    res.status(500).json({ message: 'Failed to add seat' });
  }
};

const updateSiege = async (req, res) => {
  const siegeId = req.params.siegeId;
  const updatedData = req.body;

  try {
    const siegeToUpdate = await Siege.findByPk(siegeId);

    if (!siegeToUpdate) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    await siegeToUpdate.update(updatedData);

    res.json({ message: 'Seat updated successfully' });
  } catch (error) {
    console.error('Failed to update seat:', error);
    res.status(500).json({ message: 'Failed to update seat' });
  }
};

router.post('/', addSiege);
router.put('/:siegeId', updateSiege);
router.get('/', getAllSieges);
router.get('/:id', afficherSieges); // Changed parameter name to match the function
router.get('/:siegeId/availability', verifierDisponibiliteSiege);
module.exports = router;
