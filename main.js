const pokemonList = document.querySelector("#pokemon-list");
const botonesHeader = document.querySelectorAll(".btn-header");
// Base URL for the Pokemon API
let URL = "https://pokeapi.co/api/v2/pokemon/";

// Number of Pokemon to fetch
let number = 20;
let pokemonId;

/**
 * Fetches pokemon data from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of pokemon data.
 */

const fetchPokemon = async () => {
    const pokemons = [];
    for (let i = 1; i <= number; i++) {
        try {
            const response = await fetch(URL + i);
            const data = await response.json();
            pokemons.push(data);
        } catch (error) {
            console.error("Error al obtener el Pokémon:", error);
        }
    }
    return pokemons;
};

const updateList = async () => {
    const pokemons = await fetchPokemon();
    // Clean list
    pokemonList.innerHTML = "";
    // Display each pokemon
    pokemons.forEach(poke => displayPokemon(poke));
};

updateList();

function displayPokemon(poke) {
    let pokeID = poke.id.toString();
    if (pokeID.length === 1) {
        pokeID = "00" + pokeID;
    } 
    else if (pokeID.length === 2) {
        pokeID = "0" + pokeID;
}

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeID}</p>
        <div class="pokemon-image">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="name-container">
                <h2 class="pokemon-name">${poke.name}</h2>
            </div>
        </div>
    `;

    div.addEventListener("click", () => {
        window.location.href = `secondary.html?pokemonId=${poke.id}`;
    });

    pokemonList.append(div);
}

// Show more pokemons (20 more)
function showMore(){
    number += 20;
    updateList();
}

// Search for a specific pokemon
function searchPokemon() {
    const searchInput = document.getElementById("searchInput").value;
    if (searchInput !== "") {
        pokemonId = parseInt(searchInput);
        if (!isNaN(pokemonId) && pokemonId > 0 && pokemonId <= 1154) { // 1154 pokemones de la api
            window.location.href = `secondary.html?pokemonId=${pokemonId}`;
        } 
    else {
            alert("Please enter a valid Pokémon number");
        }
    }
}