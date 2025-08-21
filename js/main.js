import { getPokemonsApi } from './app.js';

async function init() {
  console.log("Iniciando Pokédex...");

  try {
    const data = await getPokemonsApi();
    console.log("✅ Datos obtenidos de la API:", data);

    console.log(" Lista de Pokémon:");
    data.results.forEach((pokemon, index) => {
      console.log(`${index + 1}. ${pokemon.name}`);
    });

  } catch (error) {
    console.error(" No se pudo cargar la Pokédex:", error);
  }
}


document.addEventListener('DOMContentLoaded', init);