import express, { Request, Response } from 'express';
import  Session  from '../models/Session';
import  Evenement  from '../models/Evenement';
import  Salle  from '../models/Salle';

const router = express.Router();

const afficherSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await Session.findAll({
      include: [
        { model: Evenement, as: 'evenement' },
        { model: Salle, as: 'salle' },
      ],
    });

    res.json(sessions);
  } catch (error) {
    console.error('Échec de la récupération des sessions :', error);
    res.status(500).json({ message: 'Échec de la récupération des sessions' });
  }
};

router.post('/', async (req: Request, res: Response) => {
  const nouvelleSession = req.body;

  try {
    const session = await Session.create(nouvelleSession);

    res.status(201).json(session);
  } catch (error) {
    console.error('Échec de la création de la session :', error);
    res.status(500).json({ message: 'Échec de la création de la session' });
  }
});

router.get('/:sessionId', async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;

  try {
    const session = await Session.findByPk(sessionId, {
      include: [
        { model: Evenement, as: 'evenement' },
        { model: Salle, as: 'salle' },
      ],
    });

    if (!session) {
      res.status(404).json({ message: 'Session introuvable' });
      return;
    }

    res.json(session);
  } catch (error) {
    console.error('Échec de la récupération de la session :', error);
    res.status(500).json({ message: 'Échec de la récupération de la session' });
  }
});

router.put('/:sessionId', async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Échec de la mise à jour de la session :', error);
    res.status(500).json({ message: 'Échec de la mise à jour de la session' });
  }
});

router.delete('/:sessionId', async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;

  try {
    const session = await Session.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: 'Session introuvable' });
      return;
    }

    await session.destroy();

    res.json({ message: 'Session supprimée' });
  } catch (error) {
    console.error('Échec de la suppression de la session :', error);
    res.status(500).json({ message: 'Échec de la suppression de la session' });
  }
});

router.get('/', afficherSessions);

export default router;
