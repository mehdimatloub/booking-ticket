import React from 'react';

const ReservationList = ({ reservations }) => {
  return (
    <div>
      {reservations.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Numéro de réservation</th>
              <th>Siège</th>
              <th>Utilisateur</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation. code_reservation}</td>
                <td>{reservation.siegeId}</td>
                <td>{reservation.montant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune réservation trouvée.</p>
      )}
    </div>
  );
};

export default ReservationList;
