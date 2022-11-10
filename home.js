let logOutBtn = document.querySelector('#logout-btn');
logOutBtn.addEventListener('click', logOut);

function logOut() {
  activeUser = {};
  localStorage.setItem('activeUser', JSON.stringify(activeUser));
  window.location.href = "index.html";
}

function fetchPokemon() {
  function load() {
    const numberOfPokemon = 493;
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
        const myObject = {
          id: id
        }
        console.log(myObject)
      })
  };

  load();
}