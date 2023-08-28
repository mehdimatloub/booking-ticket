import express, { Request, Response } from 'express';
import Utilisateur from '../models/Utilisateur';
import Siege from '../models/Siege';
import Reservation from '../models/Reservation';
import bcrypt from 'bcrypt';


const router = express.Router();

const connecterUtilisateur=async(req:Request,res:Response)=>{
  const{email,motDePasse}=req.body;
  try{
    const utilisateur=await Utilisateur.findOne({where:{email}});
    if(!utilisateur){
      res.status(401).json({message:'Adresse e-mail incorrect'});
      return;
    }
    const motDePasseCorrect=await bcrypt.compare(motDePasse,utilisateur.motDePasse);
    if(!motDePasseCorrect){
      res.status(401).json({message:'Motde passe incorrect'});
      return;
    }
    res.json({message:'Connexion réussie'})
  }catch(error){
    console.error('Echec de la connexion de l\'utilisateur:',error);
    res.status(500).json({message:'Echec de la connexion de l\'utilisateur'})
  }
};


const afficherUtilisateurs = async (req: Request, res: Response) => {
  try {
    const utilisateurs = await Utilisateur.findAll();

    res.json(utilisateurs);
  } catch (error) {
    console.error('Échec de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Échec de la récupération des utilisateurs' });
  }
};

const afficherUtilisateurParId = async (req: Request, res: Response) => {
  const utilisateurId = req.params.utilisateurId;

  try {
    const utilisateur = await Utilisateur.findByPk(utilisateurId, {
      include: [{ model: Siege, as: 'sieges' }, { model: Reservation, as: 'reservations' }],
    });

    if (!utilisateur) {
      res.status(404).json({ message: 'Utilisateur introuvable' });
      return;
    }

    res.json(utilisateur);
  } catch (error) {
    console.error('Échec de la récupération de l\'utilisateur :', error);
    res.status(500).json({ message: 'Échec de la récupération de l\'utilisateur' });
  }
};



// Méthode pour mettre à jour un utilisateur
const mettreAJourUtilisateur = async (req: Request, res: Response) => {
  const utilisateurId = req.params.utilisateurId;
  const { nom, motDePasse, email } = req.body;

  try {
    const utilisateur = await Utilisateur.findByPk(utilisateurId);

    if (!utilisateur) {
      res.status(404).json({ message: 'Utilisateur introuvable' });
      return;
    }

    utilisateur.nom = nom;
    utilisateur.motDePasse = motDePasse;
    utilisateur.email = email;
    await utilisateur.save();

    res.json(utilisateur);
  } catch (error) {
    console.error('Échec de la mise à jour de l\'utilisateur :', error);
    res.status(500).json({ message: 'Échec de la mise à jour de l\'utilisateur' });
  }
};

const supprimerUtilisateur = async (req: Request, res: Response) => {
  const utilisateurId = req.params.utilisateurId;

  try {
    const utilisateur = await Utilisateur.findByPk(utilisateurId);

    if (!utilisateur) {
      res.status(404).json({ message: 'Utilisateur introuvable' });
      return;
    }

    await utilisateur.destroy();

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Échec de la suppression de l\'utilisateur :', error);
    res.status(500).json({ message: 'Échec de la suppression de l\'utilisateur' });
  }
};
const enregistrerUtilisateur = async (req: Request, res: Response) => {
  const { nom, motDePasse, email } = req.body;

  try {
    const utilisateurExist = await Utilisateur.findOne({ where: { email } });
    if (utilisateurExist) {
      res.status(400).json({ message: 'L\'utilisateur existe déjà' });
      return;
    }

    // Générer un sel pour le hachage du mot de passe
    const salt = await bcrypt.genSalt(10);

    const motDePasseHash = await bcrypt.hash(motDePasse, salt);

    const nouvelUtilisateur = await Utilisateur.create({
      nom,
      email,
      motDePasse: motDePasseHash,
    });

    res.json({ message: 'Enregistrement réussi', utilisateur: nouvelUtilisateur });
  } catch (error) {
    console.error('Échec de l\'enregistrement de l\'utilisateur :', error);
    res.status(500).json({ message: 'Échec de l\'enregistrement de l\'utilisateur' });
  }
};
router.post('/register', enregistrerUtilisateur);
router.get('/', afficherUtilisateurs);
router.get('/:utilisateurId', afficherUtilisateurParId);
router.post('/login',connecterUtilisateur)
router.put('/:utilisateurId', mettreAJourUtilisateur);
router.delete('/:utilisateurId', supprimerUtilisateur);

export default router;
