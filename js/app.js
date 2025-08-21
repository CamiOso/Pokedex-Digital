import { API_HOST } from "./helpers/constants.js";

export async function getPokemonsApi() {
  try {
    const url = `${API_HOST}/pokemon?limit=20&offset=0`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al obtener Pokémon:", error);
    throw error;
  }
}


export async function getPokemonByIdOrName(idOrName) {
  const idOrNameStr = String(idOrName).toLowerCase().trim();
  const url = `${API_HOST}/pokemon/${idOrNameStr}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Pokémon no encontrado");
  return await response.json();
}