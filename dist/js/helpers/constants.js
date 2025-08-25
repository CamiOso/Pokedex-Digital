/**
 * Constantes globales del proyecto Pokédex Digital.
 * Define la URL base de la API utilizada para obtener datos de Pokémon.
 * 
 * @fileoverview Configuración principal de la API
 * @author [Cristian Camilo Osorio, Lorenzo Lopez]
 * @version 1.0
 */

/**
 * URL base de la PokéAPI.
 * Esta constante se usa en todas las llamadas a la API.
 * 
 * @constant {string}
 * @default "https://pokeapi.co/api/v2"
 * 
 * @example
 * import { API_HOST } from './helpers/constants.js';
 * const response = await fetch(`${API_HOST}/pokemon/1`);
 */


export const API_HOST="https://pokeapi.co/api/v2/";
