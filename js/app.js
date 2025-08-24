/**
 * Módulo de acceso a la PokéAPI.
 * Funciones para obtener listados, detalles de Pokémon y movimientos.
 * 
 * @fileoverview Capa de datos (API) para la Pokédex
 * @author [Cristian Camilo Osorio, Lorenzo Lopez]
 * @version 1.0
 */

// Importar la URL base de la API
import { API_HOST } from "./helpers/constants.js";

/**
 * Obtiene detalles de un movimiento desde la API.
 * 
 * @async
 * @function getMoveDetails
 * @param {string} url - URL del endpoint del movimiento (ej: https://pokeapi.co/api/v2/move/1/)
 * @returns {Promise<Object>} Objeto con datos del movimiento (nombre, tipo, potencia, efecto, etc.)
 * @throws {Error} Si la respuesta de la API no es exitosa
 * 
 * @example
 * const move = await getMoveDetails("https://pokeapi.co/api/v2/move/1/");
 * console.log(move.name); // "pound"
 */

export async function getMoveDetails(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('No se pudo obtener el movimiento');
  return await response.json();
}


/**
 * Obtiene un listado de Pokémon desde la API.
 * Actualmente trae los primeros 20 Pokémon (de 0 a 20).
 * 
 * @async
 * @function getPokemonsApi
 * @returns {Promise<Object>} Objeto con lista de Pokémon ({ count, next, previous, results })
 * @throws {Error} Si hay error en la red o respuesta inválida
 * 
 * @example
 * const data = await getPokemonsApi();
 * console.log(data.results[0].name); // "bulbasaur"
 */
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

/**
 * Obtiene un Pokémon específico por su ID o nombre.
 * 
 * @async
 * @function getPokemonByIdOrName
 * @param {string|number} idOrName - ID numérico (1-898) o nombre en inglés (ej: "pikachu", "charizard")
 * @returns {Promise<Object>} Datos completos del Pokémon (nombre, tipos, stats, sprites, movimientos, etc.)
 * @throws {Error} Si el Pokémon no existe o hay error de red
 * 
 * @example
 * const pokemon = await getPokemonByIdOrName("pikachu");
 * console.log(pokemon.name); // "pikachu"
 * console.log(pokemon.id);   // 25
 */

export async function getPokemonByIdOrName(idOrName) {
  const idOrNameStr = String(idOrName).toLowerCase().trim();
  const url = `${API_HOST}/pokemon/${idOrNameStr}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Pokémon no encontrado");
  return await response.json();
}