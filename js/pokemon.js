/**
 * Obtiene un listado paginado de Pokémon desde la PokéAPI.
 * 
 * Esta función consume el endpoint oficial de Pokémon para obtener una lista
 * con nombres y URLs. Es útil para cargar un conjunto inicial de Pokémon.
 * 
 * @fileoverview Módulo de listado de Pokémon
 * @author [Cristian Camilo Osorio, Lorenzo Lopez]
 * @version 1.0
 */

// ✅ Importación 
import {API_HOST} from "../js/helpers/constants"

/**
 * Obtiene un listado de Pokémon con paginación.
 * 
 * @async
 * @function getPokemonsApi
 * @param {Object} [options] - Opciones de paginación
 * @param {number} [options.limit=20] - Número máximo de Pokémon a obtener
 * @param {number} [options.offset=0] - Número de Pokémon a omitir al inicio
 * @returns {Promise<Object>} - Promesa que resuelve en un objeto con:
 * - `count`: número total de Pokémon
 * - `next`: URL del siguiente grupo (puede ser null)
 * - `previous`: URL del grupo anterior (puede ser null)
 * - `results`: Array de objetos `{ name, url }`
 * 
 * @throws {Error} Si falla la conexión o la respuesta no es válida
 * 
 * @example
 * const data = await getPokemonsApi();
 * console.log(data.count); // 10251 (total de especies)
 * data.results.forEach(p => console.log(p.name));
 * 
 * @example
 * // Obtener 10 Pokémon desde el 100
 * const data = await getPokemonsApi({ limit: 10, offset: 100 });
 */
export async function getPokemonsApi() {
  try {
    const url = `${API_HOST}/pokemon?limit=20&offset=0`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}