
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Utilisateur = require("../models/Utilisateur");
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const connecterUtilisateur = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  console.log(`${email} and password is ${mot_de_passe}`)
  try {
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      res.status(401).json({ message: "Adresse e-mail incorrecte" });
      return;
    }
    if (mot_de_passe !== utilisateur.mot_de_passe) {
      res.status(401).json({ message: "Mot de passe incorrect" });
      return;
    }
    const payload = {
      id: utilisateur.id,
      nom: utilisateur.nom,
      email: utilisateur.email,
    };
    // Sign the payload with the secret key from .env file
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Échec de la connexion de l'utilisateur" });
  }
};


const afficherUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll();
    res.json(utilisateurs);
  } catch (error) {
    console.error("Échec de la récupération des utilisateurs :", error);
    res
      .status(500)
      .json({ message: "Échec de la récupération des utilisateurs" });
  }
};

const afficherUtilisateurParId = async (req, res) => {
  const utilisateurId = req.params.utilisateurId;
  try {
    const utilisateur = await Utilisateur.findByPk(utilisateurId, {
      include: [{ all: true, nested: true }]} ,
    );
    if (!utilisateur) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }
    res.json(utilisateur);
  } catch (error) {
    console.error("Échec de la récupération de l'utilisateur :", error);
    res
      .status(500)
      .json({ message: "Échec de la récupération de l'utilisateur" });
  }
};

const mettreAJourUtilisateur = async (req, res) => {
  const utilisateurId = req.params.utilisateurId;
  const { nom, mot_de_passe, email } = req.body;
  try {
    const utilisateur = await Utilisateur.findByPk(utilisateurId);
    if (!utilisateur) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }
    utilisateur.nom = nom;
    utilisateur.mot_de_passe = mot_de_passe;
    utilisateur.email = email;
    await utilisateur.save();
    res.json(utilisateur);
  } catch (error) {
    console.error("Échec de la mise à jour de l'utilisateur :", error);
    res
      .status(500)
      .json({ message: "Échec de la mise à jour de l'utilisateur" });
  }
};

const supprimerUtilisateur = async (req, res) => {
  const utilisateurId = req.params.utilisateurId;
  try {
    const utilisateur = await Utilisateur.findByPk(utilisateurId);
    if (!utilisateur) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }
    await utilisateur.destroy();
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Échec de la suppression de l'utilisateur :", error);
    res
      .status(500)
      .json({ message: "Échec de la suppression de l'utilisateur" });
  }
};

const enregistrerUtilisateur = async (req, res) => {
  const { nom, mot_de_passe, email } = req.body;
  try {
    const utilisateurExist = await Utilisateur.findOne({ where: { email } });
    if (utilisateurExist) {
      res.status(400).json({ message: "L'utilisateur existe déjà" });
      return;
    }
    const nouvelUtilisateur = await Utilisateur.create({
      nom,
      email,
      mot_de_passe,
    });
    res.json({ message: "Enregistrement réussi", utilisateur: nouvelUtilisateur });
  } catch (error) {
    console.error("Échec de l'enregistrement de l'utilisateur :", error);
    res
      .status(500)
      .json({ message: "Échec de l'enregistrement de l'utilisateur" });
  }
};

router.post("/register", enregistrerUtilisateur);
router.get("/", afficherUtilisateurs);
router.get("/:utilisateurId", afficherUtilisateurParId);
router.post("/login", connecterUtilisateur);
router.put("/:utilisateurId", mettreAJourUtilisateur);
router.delete("/:utilisateurId", supprimerUtilisateur);

module.exports = router;
