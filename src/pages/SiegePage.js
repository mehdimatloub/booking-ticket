import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SiegeList from '../../components/SiegeList';

const SiegePage = () => {
  const [sieges, setSieges] = useState([]);
  const [salleId, setSalleId] = useState(null);
  const [salleNom, setSalleNom] = useState(null);
  const [salles, setSalles] = useState([]);

  useEffect(() => {
    fetchSalles(); // Récupère la liste des salles
  }, []);

  const fetchSalles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/salles'); // Récupère toutes les salles
      setSalles(response.data);
      if (response.data.length > 0) {
        const firstSalle = response.data[0]; // Utilise la première salle par défaut
        setSalleId(firstSalle.id);
        setSalleNom(firstSalle.nom);
        fetchSieges(firstSalle.id); // Récupère les sièges de la salle sélectionnée
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des salles:', error);
    }
  };

  const handleSalleChange = (event) => {
    const selectedSalleId = event.target.value;
    const selectedSalle = salles.find((salle) => salle.id === parseInt(selectedSalleId));
    if (selectedSalle) {
      setSalleId(selectedSalle.id);
      setSalleNom(selectedSalle.nom);
      fetchSieges(selectedSalle.id);
    }
  };

  const fetchSieges = async (salleId) => {
    try {
      const response = await axios.get(`http://localhost:3000/sieges/${salleId}`);
      setSieges(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des sièges:', error);
    }
  };

  return (
    <div>
      <h2>Gestion des Sièges</h2>
      {salles.length > 0 && (
        <div>
          <label htmlFor="salle-select">Sélectionnez une salle :</label>
          <select id="salle-select" onChange={handleSalleChange} value={salleId}>
            {salles.map((salle) => (
              <option key={salle.id} value={salle.id}>
                {salle.nom}
              </option>
            ))}
          </select>
        </div>
      )}
      {salleNom && (
        <>
          <p>Salle sélectionnée : {salleNom}</p>
          <SiegeList sieges={sieges} />
        </>
      )}
    </div>
  );
};

export default SiegePage;
