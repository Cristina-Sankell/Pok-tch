let logOutBtn = document.querySelector('#logout-btn');
logOutBtn.addEventListener('click', logOut);
let displayUser = document.querySelector('#display-user');
displayUser.textContent = JSON.parse(localStorage.getItem('activeUser')).username;

function logOut() {
  localStorage.removeItem('activeUser');
  window.location.href = "index.html";
}

function fetchPokemon() {
  function load() {
    const numberOfPokemon = 649;
    const id = Math.round(Math.random() * (numberOfPokemon - 1)) + 1;
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let img = document.getElementById('pokemonSprite').innerHTML = data['sprites']['front_default'];
        document.getElementById('pokemonName').innerHTML = data['name'];
        document.getElementById('pokemonNumber').innerHTML = data['id'];
        document.getElementById('pokemonType1').innerHTML = data?.types['0']?.type['name'];
        document.getElementById('pokemonType2').innerHTML = data?.types['1']?.type['name'] || "";
        document.getElementById('pokemonAbility1').innerHTML = data?.abilities['0']?.ability['name'];
        document.getElementById('pokemonAbility2').innerHTML = data?.abilities['1']?.ability['name'] || "           ";
        document.getElementById('pokemonSprite').setAttribute('src', img);
      })
  };

  load();
}

function savePokemon() {

  let favPokemon = {
    name: document.getElementById('pokemonName').innerHTML,
    id: document.getElementById('pokemonNumber').innerHTML,
  }
  let favurl = `https://pokeapi.co/api/v2/pokemon/${favPokemon.id}`;
  fetch(favurl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let img = document.getElementById('favpokemonSpriteOne').innerHTML = data['sprites']['front_default'];
      document.getElementById('favpokemonSpriteOne').setAttribute('src', img);
    })
  document.getElementById('favpokemonNameOne').innerHTML = favPokemon.name;
  console.log(favPokemon);
}
