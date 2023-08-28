const VilleList = ({ villes, onSelectVille }) => {
  return (
    <div>
      <ul>
        {villes.map((ville, index) => (
          <li key={index} onClick={() => onSelectVille(ville)}>
            {ville}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VilleList;
