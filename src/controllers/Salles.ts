import express, { Request, Response } from 'express';
import  Salle  from '../models/Salle';
import  Ville  from '../models/Ville';
import  Siege  from '../models/Siege';

const router = express.Router();

const afficherPlan = async (req: Request, res: Response) => {
  const salleId = req.params.salleId;

  try {
    const salle = await Salle.findOne({
      where: { id: salleId },
      include: [{ model: Ville, as: 'ville' }],
    });

    if (!salle) {
      res.status(404).json({ message: 'Venue not found' });
      return;
    }

    res.json(salle.plan);
  } catch (error) {
    console.error('Failed to retrieve the venue plan:', error);
    res.status(500).json({ message: 'Failed to retrieve the venue plan' });
  }
};

const verifierDisponibiliteSiege = async (req: Request, res: Response) => {
  const salleId = req.params.salleId;
  const numeroSiege = req.params.numeroSiege;

  try {
    const siege = await Siege.findOne({
      where: { salleId, numero: numeroSiege },
    });

    if (!siege) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    console.error('Failed to check seat availability:', error);
    res.status(500).json({ message: 'Failed to check seat availability' });
  }
};

router.post('/', async (req: Request, res: Response) => {
  const nouvelleSalle = req.body;

  try {
    const salle = await Salle.create(nouvelleSalle);

    res.status(201).json(salle);
  } catch (error) {
    console.error('Failed to create a venue:', error);
    res.status(500).json({ message: 'Failed to create a venue' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const salles = await Salle.findAll();

    res.json(salles);
  } catch (error) {
    console.error('Failed to retrieve venues:', error);
    res.status(500).json({ message: 'Failed to retrieve venues' });
  }
});

router.get('/:salleId', async (req: Request, res: Response) => {
  const salleId = req.params.salleId;

  try {
    const salle = await Salle.findOne({
      where: { id: salleId },
      include: [{ model: Ville, as: 'ville' }],
    });

    if (!salle) {
      res.status(404).json({ message: 'Venue not found' });
      return;
    }

    res.json(salle);
  } catch (error) {
    console.error('Failed to retrieve the venue:', error);
    res.status(500).json({ message: 'Failed to retrieve the venue' });
  }
});

router.put('/:salleId', async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Failed to update the venue:', error);
    res.status(500).json({ message: 'Failed to update the venue' });
  }
});

router.delete('/:salleId', async (req: Request, res: Response) => {
  const salleId = req.params.salleId;

  try {
    const salle = await Salle.findOne({ where: { id: salleId } });

    if (!salle) {
      res.status(404).json({ message: 'Venue not found' });
      return;
    }

    await salle.destroy();

    res.json({ message: 'Venue deleted' });
  } catch (error) {
    console.error('Failed to delete the venue:', error);
    res.status(500).json({ message: 'Failed to delete the venue' });
  }
});

router.get('/:salleId/plan', afficherPlan);
router.get('/:salleId/seats/:numeroSiege', verifierDisponibiliteSiege);

export default router;
