import { getPokemonsApi } from './app.js';
import { getPokemonByIdOrName } from './app.js';
/*
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
*/
/*
import { getPokemonByIdOrName } from './app.js';

async function loadPokemon() {
  try {
    const pokemon = await getPokemonByIdOrName("pikachu");
    console.log("Pokémon cargado:", pokemon.name);
    console.log("Tipos:", pokemon.types.map(t => t.type.name));
    console.log("Stats:", pokemon.stats);
    console.log("Sprite:", pokemon.sprites.front_default);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

loadPokemon();

*/

const entradaBusqueda = document.getElementById('entrada-busqueda');
const formularioBusqueda = document.querySelector('.formulario-busqueda');
const botonAleatorio = document.querySelector('.boton.aleatorio');
const nombrePokemon = document.querySelector('.nombre-pokemon');
const idPokemon = document.querySelector('.id-pokemon');
const imagenPokemon = document.getElementById('imagen-pokemon');
const tiposPokemon = document.querySelector('.tipos-pokemon');
const listaMovimientos = document.querySelector('.lista-movimientos');
const botonesEstadisticas = document.querySelectorAll('.estadistica-item');
const botonAnterior = document.querySelector('.boton.anterior');
const botonSiguiente = document.querySelector('.boton.siguiente');

// Estado actual
let pokemonActualId = 1;

// Formatear nombre (capitalizar)
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Formatear ID (ej: 1 → #001)
const formatId = (id) => `#${String(id).padStart(3, '0')}`;

// Obtener color por tipo
const getTypeColor = (type) => {
  const colors = {
    normal: '#A8A878', fuego: '#F08030', agua: '#6890F0',
    planta: '#78C850', electrico: '#F8D030', hielo: '#98D8D8',
    lucha: '#C03028', veneno: '#A040A0', tierra: '#E0C068',
    volador: '#A890F0', psiquico: '#F85888', bicho: '#A8B820',
    roca: '#B8A038', fantasma: '#705898', oscuro: '#705848',
    dragon: '#7038F8', acero: '#B8B8D0', hada: '#EE99AC'
  };
  return colors[type] || '#A8A878';
};

// Renderizar tipos
const renderTipos = (types) => {
  tiposPokemon.innerHTML = '';
  types.forEach(tipo => {
    const span = document.createElement('span');
    span.className = 'tipo-tag';
    span.textContent = capitalize(tipo.type.name);
    span.style.backgroundColor = getTypeColor(tipo.type.name);
    tiposPokemon.appendChild(span);
  });
};

// Renderizar estadísticas
const renderEstadisticas = (stats) => {
  const labels = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  const statElements = Array.from(botonesEstadisticas);

  stats.slice(0, 6).forEach((stat, index) => {
    const barra = statElements[index].querySelector('.progreso');
    const valor = statElements[index].querySelector('.valor');
    
    barra.style.width = `${stat.base_stat}%`;
    valor.textContent = stat.base_stat;
  });
};

// Renderizar movimientos (primeros 4)
const renderMovimientos = async (moves) => {
  listaMovimientos.innerHTML = '';
  const movesToDisplay = moves.slice(0, 4);

  for (const move of movesToDisplay) {
    try {
      const data = await getMoveDetails(move.move.url);
      const li = document.createElement('div');
      li.className = 'movimiento-item';
      li.innerHTML = `
        <strong>${capitalize(move.move.name)}</strong>
        <p>Tipo: ${capitalize(data.type.name)} | Potencia: ${data.power || '—'} | Precisión: ${data.accuracy || '—'}%</p>
      `;
      listaMovimientos.appendChild(li);
    } catch (error) {
      console.warn(`No se pudo cargar el movimiento ${move.move.name}`);
    }
  }
};

// Mostrar Pokémon en la tarjeta
const mostrarPokemon = (data) => {
  nombrePokemon.textContent = capitalize(data.name);
  idPokemon.textContent = formatId(data.id);
  imagenPokemon.src = data.sprites.front_default || 'https://via.placeholder.com/100';
  imagenPokemon.alt = data.name;

  renderTipos(data.types);
  renderEstadisticas(data.stats);
  renderMovimientos(data.moves).catch(console.error);

  pokemonActualId = data.id;
};

// Buscar Pokémon
const buscarPokemon = async (idOrName) => {
  try {
    const data = await getPokemonByIdOrName(idOrName);
    mostrarPokemon(data);
  } catch (error) {
    alert("Pokémon no encontrado. Intenta de nuevo.");
    console.error(error);
  }
};

// Eventos
formularioBusqueda.addEventListener('submit', (e) => {
  e.preventDefault();
  const valor = entradaBusqueda.value.trim();
  if (valor) buscarPokemon(valor);
});

botonAleatorio.addEventListener('click', () => {
  const idRandom = Math.floor(Math.random() * 1010) + 1;
  buscarPokemon(idRandom);
});

botonAnterior.addEventListener('click', () => {
  if (pokemonActualId > 1) buscarPokemon(pokemonActualId - 1);
});

botonSiguiente.addEventListener('click', () => {
  buscarPokemon(pokemonActualId + 1);
});

// Cargar Pokémon inicial (ej: Bulbasaur)
document.addEventListener('DOMContentLoaded', () => {
  buscarPokemon(1);
});