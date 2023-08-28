import express, { Request, Response } from 'express';
import Reservation from '../models/Reservation';
import Utilisateur from '../models/Utilisateur';
import Siege from '../models/Siege';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const nouvelleReservation = req.body;
    const siege = await Siege.findByPk(nouvelleReservation.siegeId);
    const utilisateur = await Utilisateur.findByPk(nouvelleReservation.utilisateurId);

    if (!siege || !utilisateur) {
      res.status(404).json({ message: 'Siege or Utilisateur not found' });
      return;
    }

    const createdReservation = await Reservation.create(nouvelleReservation);
    res.status(201).json(createdReservation);
  } catch (error) {
    console.error('Failed to create a reservation:', error);
    res.status(500).json({ message: 'Failed to create a reservation' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (error) {
    console.error('Failed to retrieve reservations:', error);
    res.status(500).json({ message: 'Failed to retrieve reservations' });
  }
});

router.get('/:reservationId', async (req: Request, res: Response) => {
  try {
    const reservationId = req.params.reservationId;
    const reservation = await Reservation.findByPk(reservationId);

    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }

    res.json(reservation);
  } catch (error) {
    console.error('Failed to retrieve the reservation:', error);
    res.status(500).json({ message: 'Failed to retrieve the reservation' });
  }
});

router.put('/:reservationId', async (req: Request, res: Response) => {
  try {
    const reservationId = req.params.reservationId;
    const updatedReservation = req.body;
    const [rowsAffected] = await Reservation.update(updatedReservation, {
      where: { id: reservationId },
    });

    if (rowsAffected === 0) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error('Failed to update the reservation:', error);
    res.status(500).json({ message: 'Failed to update the reservation' });
  }
});

router.delete('/:reservationId', async (req: Request, res: Response) => {
  try {
    const reservationId = req.params.reservationId;
    const rowsAffected = await Reservation.destroy({ where: { id: reservationId } });

    if (rowsAffected === 0) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Failed to delete the reservation:', error);
    res.status(500).json({ message: 'Failed to delete the reservation' });
  }
});

export default router;
