const pokemonList = document.querySelector("#pokemonList");
const headerButtons = document.querySelectorAll(".btn-header");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchButton");
const closeSidebar = document.getElementById("closeSidebar");

let URL = "";

fetch("./config.json")
  .then(res => res.json())
  .then(config => {
    URL = config.API_URL;
    loadPokemons();
});

function loadPokemons() {
  for (let i = 1; i <= 898; i++) {
    fetch(URL + i)
      .then(response => response.json())
      .then(data => showPokemon(data));
   }
}

const genRanges = {
  kanto: [1,151],
  johto: [152,251],
  hoenn: [252,386],
  sinnoh: [387,493],
  unova: [494,649],
  kalos: [650,721],
  alola: [722,809],
  galar: [810,898]
};

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    pokemonList.innerHTML = "";
    fetch(`${URL}${query}`)
      .then(res => {
        if (!res.ok) throw new Error("Pokemon not found");
        return res.json();
      })
      .then(data => showPokemon(data))
      .catch(() => {
        pokemonList.innerHTML = `<p style="color:white;text-align:center">Not found</p>`;
      });
  }
});

function showPokemon(poke) {
  let types = poke.types.map(type => `<p class="${type.type.name} type">${type.type.name}</p>`).join("");
  let pokeId = poke.id.toString().padStart(3, "0");
  const div = document.createElement("div");
  div.classList.add("pokemon");

  div.innerHTML = `
        <div class="pokemon-image">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
            <div class="pokemon-info">
                <div class="name-container">
                    <h2 class="pokemon-name">${poke.name}</h2>
                </div>
                <div class="pokemon-types">${types}</div>
                <div class="pokemon-stats">
                    <p class="stat">${poke.height}m</p>
                    <p class="stat">${poke.weight}kg</p>
                </div>
        </div>
  `;

    div.addEventListener("click", () => {
        const modal = document.getElementById("pokemonModal");
        const modalBody = document.getElementById("modalBody");

        const abilities = poke.abilities.map(h => h.ability.name).join(", ");
        const moves = poke.moves.slice(0, 5).map(m => m.move.name).join(", ");

        modalBody.innerHTML = `
        <h2>${poke.name.toUpperCase()} (#${pokeId})</h2>
        <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}" style="max-width:200px;">
        <p><strong>Height:</strong> ${poke.height} m</p>
        <p><strong>Weight:</strong> ${poke.weight} kg</p>
        <p><strong>Types:</strong> ${types}</p>
        <p><strong>Base Experience:</strong> ${poke.base_experience}</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
        <p><strong>Moves:</strong> ${moves}...</p>
        `;
        modal.style.display = "block";
  });
  pokemonList.append(div);
}

headerButtons.forEach(button => button.addEventListener("click", (event) => {
  const buttonId = event.currentTarget.id.toLowerCase();
  pokemonList.innerHTML = "";

  if (genRanges[buttonId]) {
    const [start, end] = genRanges[buttonId];
    for (let i = start; i <= end; i++) {
      fetch(URL + i)
        .then(res => res.json())
        .then(data => showPokemon(data));
    }
    return;
  }

  if (buttonId === "view-all") {
        for (let i = 1; i <= 898; i++) {
        fetch(URL + i)
            .then(res => res.json())
            .then(data => showPokemon(data));
        }
        return;
  }

  for (let i = 1; i <= 898; i++) {
        fetch(URL + i)
        .then(res => res.json())
        .then(data => {
            const types = data.types.map(type => type.type.name.toLowerCase());
            if (types.includes(buttonId)) {
            showPokemon(data);
            }
        });
    }
}));

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("pokemonModal").style.display = "none";
});

window.addEventListener("click", (e) => {
  const modal = document.getElementById("pokemonModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
