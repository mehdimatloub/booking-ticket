const fetchEvenements = async () => {
  try {
    const response = await axios.get('/api/evenements');
    setEvenements(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
  }
};
