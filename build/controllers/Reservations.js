const express = require("express");
const Reservation = require("../models/Reservation");
const Utilisateur = require("../models/Utilisateur");
const Siege = require("../models/Siege");
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY || "nhpfeproject2023@07";

const router = express.Router();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.split(' ')[1] : null;
  console.log(token);
  if (!token) {
    console.log('Aucun jeton trouvé.');
    return res.status(401).json({ error: 'Accès non autorisé.' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    console.log('decodedToken:', decodedToken);
    if (!decodedToken) {
      console.log('Jeton invalide.');
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    const utilisateur = await Utilisateur.findByPk(decodedToken.id);
    if (!utilisateur) {
      console.log('Utilisateur non trouvé.');
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    req.user = decodedToken; 
    next(); 
  } catch (err) {
    console.log('Erreur lors de la vérification du jeton:', err); 
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
};

// Endpoint pour la création d'une réservation
// Endpoint pour la création d'une réservation
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      console.log('Utilisateur non authentifié.');
      return res.status(401).json({ error: 'Accès non autorisé.' });
    }
    console.log(req.body);
    const nouvelleReservation = req.body;
    const siege = await Siege.findByPk(nouvelleReservation.siegeId);
    const utilisateur = await Utilisateur.findByPk(nouvelleReservation.utilisateurId);

    console.log('siege:', siege);
    console.log('utilisateur:', utilisateur);

    if (!siege || !utilisateur) {
      console.log('Siège ou Utilisateur non trouvé.');
      return res.status(404).json({ message: 'Siège ou Utilisateur non trouvé' });
    }

    
    if (utilisateur.id !== req.body.utilisateurId) {
      console.log('Le token et l\'ID utilisateur ne correspondent pas.');
      return res.status(401).json({ error: 'Accès non autorisé.' });
    }

    
    const reservation = await Reservation.create(nouvelleReservation);

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Échec de la création d\'une réservation:', error);
    res.status(500).json({ message: 'Échec de la création d\'une réservation' });
  }
});



router.get('/' ,async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (error) {
    console.error('Échec de la récupération des réservations:', error);
    return res.status(500).json({ message: 'Échec de la récupération des réservations' });
  }
});


router.get('/:reservationId', async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
       return res.status(404).json({ message: 'Réservation non trouvée' });
     
    }
    res.json(reservation);
  } catch (error) {
    console.error('Échec de la récupération de la réservation:', error);
    res.status(500).json({ message: 'Échec de la récupération de la réservation' });
  }
});


router.put('/:reservationId', async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const updatedReservation = req.body;
    const [rowsAffected] = await Reservation.update(updatedReservation, {
      where: { id: reservationId },
    });
    if (rowsAffected === 0) {
       return res.status(404).json({ message: 'Réservation non trouvée' });
    
    }
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error('Échec de la mise à jour de la réservation:', error);
   return res.status(500).json({ message: 'Échec de la mise à jour de la réservation' });
  }
});


router.delete('/:reservationId', async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const rowsAffected = await Reservation.destroy({ where: { id: reservationId } });
    if (rowsAffected === 0) {
     return res.status(404).json({ message: 'Réservation non trouvée' });
      
    }
   return  res.status(200).json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    console.error('Échec de la suppression de la réservation:', error);
    res.status(500).json({ message: 'Échec de la suppression de la réservation' });
  }
});

module.exports = router;
