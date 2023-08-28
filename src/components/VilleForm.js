import React, { useState } from 'react';

const VilleForm = () => {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');

  const handleNomChange = (e) => {
    setNom(e.target.value);
  };

  const handleAdresseChange = (e) => {
    setAdresse(e.target.value);
  };

  const handleCodePostalChange = (e) => {
    setCodePostal(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Logique pour soumettre le formulaire de création de ville
    // Vous pouvez envoyer les données au backend via une requête HTTP ici

    // Réinitialiser les champs du formulaire
    setNom('');
    setAdresse('');
    setCodePostal('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nom">Nom :</label>
      <input type="text" id="nom" value={nom} onChange={handleNomChange} />

      <label htmlFor="adresse">Adresse :</label>
      <input type="text" id="adresse" value={adresse} onChange={handleAdresseChange} />

      <label htmlFor="codePostal">Code Postal :</label>
      <input type="text" id="codePostal" value={codePostal} onChange={handleCodePostalChange} />

      <button type="submit">Créer</button>
    </form>
  );
};

export default VilleForm;
