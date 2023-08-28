import React, { useState } from 'react';

const ReservationForm = ({ onSubmitReservation }) => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservationData = {
      nom,
      email,
    };
    onSubmitReservation(reservationData);
  };

  return (
    <div>
      <h2>Formulaire de réservation :</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nom">Nom :</label>
        <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
        <label htmlFor="email">Email :</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Réserver</button>
      </form>
    </div>
  );
};

export default ReservationForm;
