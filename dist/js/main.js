/**
 * Pokédex Digital - main.js
 * Controlador principal de la interfaz de usuario.
 * Gestiona búsqueda, navegación, filtros por tipo y renderizado de datos.
 * 
 * @fileoverview Lógica de UI y flujo de usuario
 * @author [Cristian Camilo Osorio, Lorenzo Lopez]
 * @version 1.0
 */

// Importaciones
import { getPokemonByIdOrName, getMoveDetails } from './app.js';

// === Selección de elementos del DOM ===
/** @type {HTMLInputElement} */
const entradaBusqueda = document.getElementById('entrada-busqueda');
const formulario = document.querySelector('.formulario-busqueda');
const botonAleatorio = document.querySelector('.boton.aleatorio');
const nombrePokemon = document.querySelector('.nombre-pokemon');
const idPokemon = document.querySelector('.id-pokemon');
const imagenPokemon = document.getElementById('imagen-pokemon');
const tiposPokemon = document.querySelector('.tipos-pokemon');
const listaMovimientos = document.querySelector('.lista-movimientos');
const progresoBars = document.querySelectorAll('.progreso');
const valorStats = document.querySelectorAll('.valor');
const botonAnterior = document.querySelector('.anterior');
const botonSiguiente = document.querySelector('.siguiente');
const spinner = document.getElementById('spinner');
const mensajeError = document.getElementById('mensaje-error');
const textoError = document.getElementById('texto-error');
const cerrarError = document.getElementById('cerrar-error');


// === Estado global ===
/** @type {number} */
let currentId = 2;
// === Utilidades ===
/**
 * Capitaliza la primera letra de una cadena.
 * @param {string} str - Texto a capitalizar
 * @returns {string} Texto con primera letra en mayúscula
 * @example capitalize("pikachu") // "Pikachu"
 */
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Formatea un ID numérico a formato de Pokédex (ej: #001).
 * @param {number} id - ID del Pokémon
 * @returns {string} ID formateado como #001, #025, etc.
 * @example formatId(25) // "#025"
 */
const formatId = id => `#${String(id).padStart(3, '0')}`;


// === Renderizado de UI ===

/**
 * Renderiza los tipos del Pokémon como etiquetas con color.
 * Cada tipo tiene una clase CSS asociada (ej: .tipo.fuego).
 * @param {Array} types - Array de objetos de tipo desde la API
 * @returns {void}
 * @example renderTipos(data.types)
 */
const renderTipos = (types) => {
  tiposPokemon.innerHTML = '';
  types.forEach(t => {
    const span = document.createElement('span');
    span.className = `tipo ${t.type.name}`;
    span.textContent = capitalize(t.type.name);
    tiposPokemon.appendChild(span);
  });
};


/**
 * Renderiza las estadísticas base del Pokémon (HP, Ataque, etc.).
 * Actualiza las barras de progreso y valores numéricos.
 * @param {Array} stats - Array de objetos stats desde la API
 * @returns {void}
 * @example renderStats(data.stats)
 */
const renderStats = (stats) => {
  const baseStats = stats.slice(0, 6);
  baseStats.forEach((stat, i) => {
    progresoBars[i].style.width = `${stat.base_stat}%`;
    valorStats[i].textContent = stat.base_stat;
  });
};

/**
 * Renderiza hasta 4 movimientos del Pokémon.
 * Obtiene detalles adicionales (tipo, potencia, precisión) desde la API.
 * @async
 * @param {Array} moves - Array de movimientos desde la API
 * @returns {void}
 * @example renderMoves(data.moves)
 */
const renderMoves = async (moves) => {
  listaMovimientos.innerHTML = '<p>Cargando movimientos...</p>';
  const movesToShow = moves.slice(0, 4);
  const results = await Promise.allSettled(
    movesToShow.map(async m => {
      try {
        const data = await getMoveDetails(m.move.url);
        return {
          name: m.move.name,
          type: data.type.name,
          power: data.power || '—',
          accuracy: data.accuracy || '—'
        };
      } catch (e) {
        return { name: m.move.name, type: 'desconocido', power: '—', accuracy: '—' };
      }
    })
  );

  listaMovimientos.innerHTML = '';
  results.forEach(r => {
    if (r.status === 'fulfilled') {
      const move = r.value;
      const div = document.createElement('div');
      div.className = 'move-item';
      div.innerHTML = `
        <strong>${capitalize(move.name)}</strong>
        <p>Tipo: ${capitalize(move.type)} | Potencia: ${move.power} | Precisión: ${move.accuracy}%</p>
      `;
      listaMovimientos.appendChild(div);
    }
  });
};

/**
 * Muestra los datos de un Pokémon en la interfaz.
 * Actualiza nombre, ID, imagen, tipos, estadísticas y movimientos.
 * @param {Object} data - Datos completos del Pokémon desde la API
 * @returns {void}
 * @example mostrarPokemon(pikachuData)
 */
const mostrarPokemon = (data) => {
  nombrePokemon.textContent = capitalize(data.name);
  idPokemon.textContent = formatId(data.id);
  imagenPokemon.src = data.sprites.front_default;
  imagenPokemon.alt = data.name;
  imagenPokemon.loading = "lazy";
  renderTipos(data.types);
  renderStats(data.stats);
  renderMoves(data.moves).catch(console.error);
  currentId = data.id;
};

/**
 * Busca y muestra un Pokémon por su ID o nombre.
 * Muestra spinner de carga y maneja errores.
 * @async
 * @function buscarPokemon
 * @param {string|number} idOrName - ID (1-898) o nombre del Pokémon
 * @returns {void}
 * @example buscarPokemon("pikachu")
 * @example buscarPokemon(25)
 */
const buscarPokemon = async (idOrName) => {
  spinner.style.display = 'flex';
  mensajeError.style.display = 'none';
  try {
    const data = await getPokemonByIdOrName(idOrName);
    mostrarPokemon(data);
    spinner.style.display = 'none';
  } catch (error) {
    spinner.style.display = 'none';
    textoError.textContent = "Pokémon no encontrado. Verifica el nombre o ID.";
    mensajeError.style.display = 'flex';
    console.error(error);
  }
};

cerrarError.addEventListener('click', () => {
  mensajeError.style.display = 'none';
});
/**
 * Filtra Pokémon por tipo y muestra el primero de la lista.
 * @async
 * @function handleFilterByType
 * @param {string} typeName - Nombre del tipo (ej: "fire", "water")
 * @returns {void}
 * @example handleFilterByType("fire")
 */
const handleFilterByType = async (typeName) => {
  try {
    // Mostrar mensaje de carga
    nombrePokemon.textContent = 'Cargando...';
    idPokemon.textContent = '';
    imagenPokemon.src = '';
    tiposPokemon.innerHTML = '';
    listaMovimientos.innerHTML = '<p>Filtrando por tipo...</p>';

    const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    if (!response.ok) throw new Error('Tipo no encontrado');

    const data = await response.json();
    const pokemons = data.pokemon.map(p => p.pokemon);

    if (pokemons.length > 0) {
      const firstPokemonUrl = pokemons[0].url;
      const id = firstPokemonUrl.split('/').filter(Boolean).pop();
      buscarPokemon(id);
    } else {
      alert(`No hay Pokémon disponibles para el tipo "${capitalize(typeName)}".`);
    }
  } catch (error) {
    console.error("Error al filtrar por tipo:", error);
    alert("Hubo un error al cargar Pokémon de este tipo.");
  }
};













formulario.addEventListener('submit', e => {
  e.preventDefault();
  const value = entradaBusqueda.value.trim();
  if (value) buscarPokemon(value);
});

botonAleatorio.addEventListener('click', () => {
  const id = Math.floor(Math.random() * 898) + 1;
  buscarPokemon(id);
});

botonAnterior.addEventListener('click', () => {
  if (currentId > 1) buscarPokemon(currentId - 1);
});

botonSiguiente.addEventListener('click', () => {
  buscarPokemon(currentId + 1);
});


//Escuchar clics en los botones de tipo
document.querySelectorAll('.boton-tipo').forEach(boton => {
  boton.addEventListener('click', (e) => {
    const typeId = e.target.id;

    if (typeId === 'ver-todos') {
      buscarPokemon(1);
      return;
    }

    handleFilterByType(typeId);
  });
});



document.addEventListener('DOMContentLoaded', () => {
  buscarPokemon(1);
});