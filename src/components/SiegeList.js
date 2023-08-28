import React from 'react';

const SiegeList = ({ sieges }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Numéro</th>
          <th>Disponible</th>
        </tr>
      </thead>
      <tbody>
        {sieges.map((siege) => (
          <tr key={siege.id}>
            <td>{siege.id}</td>
            <td>{siege.numero}</td>
            <td>{siege.statut ? 'Oui' : 'Non'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SiegeList;
