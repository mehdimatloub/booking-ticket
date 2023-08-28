
import VilleList from '../../components/VilleList';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const VillePage = ({ setSelected }) => {
  const [villes, setVilles] = useState([]);

  useEffect(() => {
    fetchVilles();
  }, []);

  const fetchVilles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/villes');
      const villesNoms = response.data.map((ville) => ville.nom); 
      setVilles(villesNoms);
    } catch (error) {
      console.error('Erreur lors de la récupération des villes :', error);
    }
  };

  return (
    <div>
      <VilleList villes={villes} onSelectVille={setSelected}/>
    </div>
  );
};

export default VillePage;
