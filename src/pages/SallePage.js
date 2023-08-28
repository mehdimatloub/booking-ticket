import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SalleList from '../../components/SalleList';

const SallePage = () => {
  const [salles, setSalles] = useState([]);

  useEffect(() => {
    // Effectuez une requête GET pour récupérer les salles depuis votre API
    axios
      .get('http://localhost:3000/salles')
      .then((response) => {
        setSalles(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des salles:', error);
      });
  }, []);

  return (
    <div>
      <h2>Liste des salles</h2>
      <SalleList salles={salles} />
    </div>
  );
};

export default SallePage;
