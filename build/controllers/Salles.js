"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const  Salle = require("../models/Salle");
const Siege= require("../models/Siege");

const router = express.Router();
// Method to display the venue plan
const afficherPlan = async (req, res) =>  {
    const salleId = req.params.salleId;
    try {
        const salle = await Salle.findOne({
            where: { id: salleId },
            include:[ { all: true, nested: true }]} 
        );
        if (!salle) {
            res.status(404).json({ message: 'Venue not found' });
            return;
        }
        res.json(salle.plan);
    }
    catch (error) {
        console.error('Failed to retrieve the venue plan:', error);
        res.status(500).json({ message: 'Failed to retrieve the venue plan' });
    }
};
const verifierDisponibiliteSiege = async (req, res) =>  {
    const salleId = req.params.salleId;
    const numeroSiege = req.params.numeroSiege;
    try {
        const siege = await Siege.findOne({
            where: { salleId, numero: numeroSiege },
        });
        if (!siege) {
            res.json({ available: false });
        }
        else {
            res.json({ available: true });
        }
    }
    catch (error) {
        console.error('Failed to check seat availability:', error);
        res.status(500).json({ message: 'Failed to check seat availability' });
    }
};
router.post('/', async (req, res) =>  {
    const nouvelleSalle = req.body;
    try {
        const salle = await Salle.create(nouvelleSalle);
        res.status(201).json(salle);
    }
    catch (error) {
        console.error('Failed to create a venue:', error);
        res.status(500).json({ message: 'Failed to create a venue' });
    }
});
router.get('/', async (req, res) => {
    try {
        const salles = await Salle.findAll();
        res.json(salles);
    }
    catch (error) {
        console.error('Failed to retrieve venues:', error);
        res.status(500).json({ message: 'Failed to retrieve venues' });
    }
});
router.get('/:salleId', async (req, res) =>  {
    const salleId = req.params.salleId;
    try {  
        const salle = await Salle.findOne({
            
            where: { id: salleId },
            include:[ { all: true, nested: true }]} 
         
        
        );
    
             
        if (!salle) {
            res.status(404).json({ message: 'Venue not found' });
            return;
        }
        res.json(salle);
    }
    catch (error) {
        console.error('Failed to retrieve the venue:', error);
        res.status(500).json({ message: 'Failed to retrieve the venue' });
    }
});
router.put('/:salleId', async (req, res) => {
    const salleId = req.params.salleId;
    const miseAJourSalle = req.body;
    try {
        const salle = await Salle.findOne({ where: { id: salleId } });
        if (!salle) {
            res.status(404).json({ message: 'Venue not found' });
            return;
        }
        await salle.update(miseAJourSalle);
        res.json(salle);
    }
    catch (error) {
        console.error('Failed to update the venue:', error);
        res.status(500).json({ message: 'Failed to update the venue' });
    }
});
router.delete('/:salleId', async (req, res) =>  {
    const salleId = req.params.salleId;
    try {
        const salle = await Salle.findOne({ where: { id: salleId } });
        if (!salle) {
            res.status(404).json({ message: 'Venue not found' });
            return;
        }
        await salle.destroy();
        res.json({ message: 'Venue deleted' });
    }
    catch (error) {
        console.error('Failed to delete the venue:', error);
        res.status(500).json({ message: 'Failed to delete the venue' });
    }
});
router.get('/:salleId/plan', afficherPlan);
router.get('/:salleId/seats/:numeroSiege', verifierDisponibiliteSiege);
module.exports = router;
