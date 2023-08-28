"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express =require("express");
const Session =require("../models/Session");

const router = express.Router();
const afficherSessions = async (req, res) => {
    try {
        const sessions = await Session.findAll({
            include: [{ all: true, nested: true }]});
        res.json(sessions);
    }
    catch (error) {
        console.error('Échec de la récupération des sessions :', error);
        res.status(500).json({ message: 'Échec de la récupération des sessions' });
    }
};
router.post('/', async (req, res) =>  {
    const nouvelleSession = req.body;
    try {
        const session = await Session.create(nouvelleSession);
        res.status(201).json(session);
    }
    catch (error) {
        console.error('Échec de la création de la session :', error);
        res.status(500).json({ message: 'Échec de la création de la session' });
    }
});
router.get('/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    try {
        const session = await Session.findByPk(sessionId, {
            include: [{ all: true, nested: true }]});
        
        if (!session) {
            res.status(404).json({ message: 'Session introuvable' });
            return;
        }
        res.json(session);
    }
    catch (error) {
        console.error('Échec de la récupération de la session :', error);
        res.status(500).json({ message: 'Échec de la récupération de la session' });
    }
});
router.put('/:sessionId', async (req, res) =>  {
    const sessionId = req.params.sessionId;
    const miseAJourSession = req.body;
    try {
        const session = await Session.findByPk(sessionId);
        if (!session) {
            res.status(404).json({ message: 'Session introuvable' });
            return;
        }
        await session.update(miseAJourSession);
        res.json(session);
    }
    catch (error) {
        console.error('Échec de la mise à jour de la session :', error);
        res.status(500).json({ message: 'Échec de la mise à jour de la session' });
    }
});
router.delete('/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    try {
        const session = await Session.findByPk(sessionId);
        if (!session) {
            res.status(404).json({ message: 'Session introuvable' });
            return;
        }
        await session.destroy();
        res.json({ message: 'Session supprimée' });
    }
    catch (error) {
        console.error('Échec de la suppression de la session :', error);
        res.status(500).json({ message: 'Échec de la suppression de la session' });
    }
});
router.get('/', afficherSessions);
module.exports = router;
