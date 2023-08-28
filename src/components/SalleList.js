import React from 'react';

const SalleList = ({ salles }) => {
  return (
    <div>
      {salles.length > 0 ? (
        <ul>
          {salles.map((salle) => (
            <li key={salle.id}>
              Salle {salle.nom} - Capacité : {salle.capacité}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune salle trouvée.</p>
      )}
    </div>
  );
};

export default SalleList;
