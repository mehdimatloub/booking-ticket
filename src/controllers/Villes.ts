import  Ville from'../models/Ville'
import Evenement  from '../models/Evenement';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/', async (req:Request, res:Response) => {
  try {
    const nouvelleVille = req.body;
    const ville = await Ville.create(nouvelleVille);
    res.status(201).json(ville);
  } catch (error) {
    console.error('Échec de la création de la ville :', error);
    res.status(500).json({ message: 'Échec de la création de la ville' });
  }
});

router.get('/', async (req:Request, res:Response) => {
  try {
    const villes = await Ville.findAll();
    res.json(villes);
  } catch (error) {
    console.error('Échec de la récupération des villes :', error);
    res.status(500).json({ message: 'Échec de la récupération des villes' });
  }
});

// Route pour récupérer une ville spécifique
router.get('/:villeId', async (req:Request, res:Response) => {
  const villeId = req.params.villeId;

  try {
    const ville = await Ville.findByPk(villeId, { include: Evenement });
    if (ville) {
      res.json(ville);
    } else {
      res.status(404).json({ message: 'Ville introuvable' });
    }
  } catch (error) {
    console.error('Échec de la récupération de la ville :', error);
    res.status(500).json({ message: 'Échec de la récupération de la ville' });
  }
});

router.put('/:villeId', async (req:Request, res:Response) => {
  const villeId = req.params.villeId;
  const updatedVille = req.body;

  try {
    const [affectedRows] = await Ville.update(updatedVille, {
      where: { id: villeId },
    });

    if (affectedRows === 0) {
      res.status(404).json({ message: 'Ville introuvable' });
    } else {
      res.json(updatedVille);
    }
  } catch (error) {
    console.error('Échec de la mise à jour de la ville :', error);
    res.status(500).json({ message: 'Échec de la mise à jour de la ville' });
  }
});

// Route pour supprimer une ville spécifique
router.delete('/:villeId', async (req:Request, res:Response) => {
  const villeId = req.params.villeId;

  try {
    const affectedRows = await Ville.destroy({ where: { id: villeId } });

    if (affectedRows === 0) {
      res.status(404).json({ message: 'Ville introuvable' });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error('Échec de la suppression de la ville :', error);
    res.status(500).json({ message: 'Échec de la suppression de la ville' });
  }
});

// Route pour ajouter un événement à une ville
router.post('/:villeId/evenements', async (req:Request, res:Response) => {
  const villeId = req.params.villeId;
  const nouvelEvenement = req.body;

  try {
    const ville = await Ville.findByPk(villeId);
    if (ville) {
      const evenement = await Evenement.create(nouvelEvenement);
      await ville.addEvenement(evenement);
      res.status(201).json(evenement);
    } else {
      res.status(404).json({ message: 'Ville introuvable' });
    }
  } catch (error) {
    console.error('Échec de l\'ajout de l\'événement :', error);
    res.status(500).json({ message: 'Échec de l\'ajout de l\'événement' });
  }
});

router.get('/:villeId/evenements', async (req:Request, res:Response) => {
  const villeId = req.params.villeId;

  try {
    const ville = await Ville.findByPk(villeId, { include: Evenement });
    if (ville) {
      res.json(ville.getEvenements());
    } else {
      res.status(404).json({ message: 'Ville introuvable' });
    }
  } catch (error) {
    console.error('Échec de la récupération des événements :', error);
    res.status(500).json({ message: 'Échec de la récupération des événements' });
  }
});

export default router;
