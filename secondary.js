const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pokemonId = urlParams.get('pokemonId');

const fetchPokemonDetails = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();
    return pokemon;
};

// Function to obtain the next evolution of pokemon
const getNextEvolution = async (pokemon) => {

    // Check species property
    if (!pokemon.species || !pokemon.species.url) {
        return "<li>No evolution data available</li>";
    }

    const response = await fetch(pokemon.species.url);
    const speciesData = await response.json();

    if (!speciesData.evolution_chain || !speciesData.evolution_chain.url) {
        return "<li>No evolution data available</li>";
    }

    const evoChainResponse = await fetch(speciesData.evolution_chain.url);
    const evoChainData = await evoChainResponse.json();

    // Recursively find the next evolution in the chain
    const findNextEvolution = (chain) => {
        if (chain.species.name === pokemon.name) {
            if (chain.evolves_to.length > 0) {
                return `<li>${chain.evolves_to[0].species.name}</li>`;
            } 
            else {
                return "<li>No further evolution</li>";
            }
        } 
        else {
            for (let i = 0; i < chain.evolves_to.length; i++) {
                const nextEvolution = findNextEvolution(chain.evolves_to[i]);
                if (nextEvolution) return nextEvolution;
            }
            return null;
        }
    };

    const nextEvolution = findNextEvolution(evoChainData.chain);
    return nextEvolution || "<li>No further evolution</li>";
};

// Function to display the details of the pokemon
const displayPokemonDetails = async () => {
    const pokemon = await fetchPokemonDetails(pokemonId);
    const pokemonDetails = document.getElementById("pokemon-details");
    const div = document.createElement("div");
    div.classList.add("pokemon");

    div.innerHTML = `
    <p class="pokemon-title">#${pokemon.id}</p>
    <p class="pokemon-name">${pokemon.name}</p>
    <div id="pokemon-details" class="pokemon-details">
        <div class="pokemon-images">
            <p class="type">Normal</p>
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}-front-normal">
            <img src="${pokemon.sprites.other['showdown'].front_default}" alt="${pokemon.name}-front">
            <img src="${pokemon.sprites.other['showdown'].back_default}" alt="${pokemon.name}-back">
        </div>
        <div class="pokemon-images">
            <p class="type">Shiny</p>
            <img src="${pokemon.sprites.other['official-artwork'].front_shiny}" alt="${pokemon.name}-front-normal">
            <img src="${pokemon.sprites.other['showdown'].front_shiny}" alt="${pokemon.name}-front-shiny">
            <img src="${pokemon.sprites.other['showdown'].back_shiny}" alt="${pokemon.name}-back-shiny">
        </div>
        <div class="info-container">
            <p class="category">Height: <span class="height">${pokemon.height} dm</p>
            <p class="category">Weight: <span class="weight">${pokemon.weight} hg</p>
            <ul>
            <p class="category">Next evolution:</p>
            <ul class="next-evolution-list">
                ${await getNextEvolution(pokemon)}
            </ul>
                
            </ul>
        </div>
        <div class="info-container">
        <p class="category">Moves:</p>
            <ul class="moves-list">
            ${pokemon.moves.slice(0, 10).map(moveData => `<li>${moveData.move.name}</li>`).join('')}
            </ul>
        </div>
    </div>
    `;

    pokemonDetails.appendChild(div);
};

displayPokemonDetails();