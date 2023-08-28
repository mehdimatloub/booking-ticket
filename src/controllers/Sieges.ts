import express, { Request, Response } from 'express';
import Siege  from '../models/Siege';
import  Salle  from '../models/Salle';
import  Reservation  from '../models/Reservation';

const router = express.Router();

const afficherSieges = async (req: Request, res: Response) => {
  const salleId = req.params.salleId;

  try {
    const sieges = await Siege.findAll({
      where: { salleId },
      include: [{ model: Salle, as: 'salle' }, { model: Reservation, as: 'reservations' }],
    });

    res.json(sieges);
  } catch (error) {
    console.error('Échec de la récupération des sièges :', error);
    res.status(500).json({ message: 'Échec de la récupération des sièges' });
  }
};

const verifierDisponibiliteSiege = async (req: Request, res: Response) => {
  const siegeId = req.params.siegeId;

  try {
    const siege = await Siege.findByPk(siegeId, {
      include: [{ model: Salle, as: 'salle' }, { model: Reservation, as: 'reservations' }],
    });

    if (!siege) {
      res.status(404).json({ message: 'Siège introuvable' });
      return;
    }

    if (siege.getReservations.length > 0) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    console.error('Échec de la vérification de la disponibilité du siège :', error);
    res.status(500).json({ message: 'Échec de la vérification de la disponibilité du siège' });
  }
};

router.get('/:salleId', afficherSieges);
router.get('/:siegeId/availability', verifierDisponibiliteSiege);

export default router;
