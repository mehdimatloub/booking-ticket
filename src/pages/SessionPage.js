import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SessionList from '../../components/SessionList';

const SessionPage = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions :', error);
    }
  };

  return (
    <div>
      <h2>Liste des Sessions :</h2>
      <SessionList sessions={sessions} />
    </div>
  );
};

export default SessionPage;
