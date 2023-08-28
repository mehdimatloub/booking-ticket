import React from 'react';

const SessionList = ({ sessions }) => {
  return (
    <div>
      {sessions.length > 0 ? (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
             Heure de début : {session.heure_debut} - Heure de fin : {session.heure_fin}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune session trouvée.</p>
      )}
    </div>
  );
};

export default SessionList;
