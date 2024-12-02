import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=20') // Limit to 20 Pokémon for simplicity
      .then((response) => {
        const result = response.data.results;
        // Fetch additional details for each Pokémon (images, etc.)
        const detailedPromises = result.map((pokemon) =>
          axios.get(pokemon.url).then((res) => ({
            name: pokemon.name,
            image: res.data.sprites.front_default, // Fetch image from Pokémon details
          }))
        );
        // Resolve all promises and update the state
        Promise.all(detailedPromises).then((detailedData) => {
          setPokemonList(detailedData);
        });
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to fetch data.');
      });
  }, []); // Runs once when the component mounts

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Pokedex</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
        }}
      >
        {pokemonList.map((pokemon, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: '#f9f9f9',
            }}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              style={{ marginBottom: '0.5rem', width: '100px' }}
            />
            <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
              {pokemon.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
