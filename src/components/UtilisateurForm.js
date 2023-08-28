import React, { useState } from 'react';

const UtilisateurForm = ({ onSubmitUtilisateur }) => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const utilisateurData = {
      nom,
      email,
    };
    onSubmitUtilisateur(utilisateurData);
  };

  return (
    <div>
      <h2>Formulaire d&apos;ajout d&apos;utilisateur :</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nom">Nom :</label>
        <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
        <label htmlFor="email">Email :</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Ajouter Utilisateur</button>
      </form>
    </div>
  );
};

export default UtilisateurForm;
