import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReservationList from '../../components/ReservationList';

const ReservationPage = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations :', error);
    }
  };

  return (
    <div>
      <h2>Liste des Réservations :</h2>
      <ReservationList reservations={reservations} />
    </div>
  );
};

export default ReservationPage;
