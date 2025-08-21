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
const formulario = document.querySelector('.formulario-busqueda');
const botonAleatorio = document.querySelector('.boton.aleatorio');
const nombrePokemon = document.querySelector('.nombre-pokemon');
const idPokemon = document.querySelector('.id-pokemon');
const imagenPokemon = document.getElementById('imagen-pokemon');
const tiposPokemon = document.querySelector('.tipos-pokemon');
const listaMovimientos = document.querySelector('.lista-movimientos-scroll');
const progresoBars = document.querySelectorAll('.progreso');
const valorStats = document.querySelectorAll('.valor');
const botonAnterior = document.querySelector('.anterior');
const botonSiguiente = document.querySelector('.siguiente');

let currentId = 2;

// Utils
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const formatId = id => `#${String(id).padStart(3, '0')}`;

// Renderizar tipos
const renderTipos = (types) => {
  tiposPokemon.innerHTML = '';
  types.forEach(t => {
    const span = document.createElement('span');
    span.className = `tipo ${t.type.name}`;
    span.textContent = capitalize(t.type.name);
    tiposPokemon.appendChild(span);
  });
};

// Renderizar estadísticas
const renderStats = (stats) => {
  const baseStats = stats.slice(0, 6);
  baseStats.forEach((stat, i) => {
    progresoBars[i].style.width = `${stat.base_stat}%`;
    valorStats[i].textContent = stat.base_stat;
  });
};

// Renderizar movimientos
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

// Mostrar Pokémon
const mostrarPokemon = (data) => {
  nombrePokemon.textContent = capitalize(data.name);
  idPokemon.textContent = formatId(data.id);
  imagenPokemon.src = data.sprites.front_default;
  imagenPokemon.alt = data.name;
  renderTipos(data.types);
  renderStats(data.stats);
  renderMoves(data.moves).catch(console.error);
  currentId = data.id;
};

// Buscar Pokémon
const buscarPokemon = async (idOrName) => {
  try {
    const data = await getPokemonByIdOrName(idOrName);
    mostrarPokemon(data);
  } catch (error) {
    alert("Pokémon no encontrado. Verifica el nombre o ID.");
    console.error(error);
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


document.addEventListener('DOMContentLoaded', () => {
  buscarPokemon(1);
});