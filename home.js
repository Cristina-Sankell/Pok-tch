let logOutBtn = document.querySelector('#logout-btn');
logOutBtn.addEventListener('click', logOut);
let displayUser = document.querySelector('#display-user');
let activeUser = JSON.parse(localStorage.getItem('activeUser'));
function displayList(){

}
if (JSON.parse(localStorage.getItem('activeUser')) !== null){
  displayUser.textContent = activeUser.username;
  displayFavorites()
}
else{
  window.location.href = "index.html"
}

console.log(activeUser);


console.log(activeUser.favPokemons);

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
/* fetch('https://avancera.app/cities/?name' + stringPokemon)
  .then((response) => {
    return response.json();
  })
  .then(result => {
    console.log(result)
    let hej = (result.find(e => e.name === stringPokemon));
    let list = document.createElement('li')
    let add = document.getElementById('citiesPokemon');
    let element = document.createTextNode(hej.name)
    list.appendChild(element)
    add.appendChild(list)
  }) */
let deleteButton;
let editButton;
/*
deleteButton.addEventListener('click',deletePokoman)
function deletePokoman(){
  let deadPokemon = deleteButton.id;
  fetch('https://avancera.app/cities/'+deadPokemon, {
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'DELETE'
  })
  console.log(deadPokemon);
}
*/
function displayFavorites() {
  for (i = 0; i < activeUser.favPokemons.length; i++) {
    let favPokemonName = activeUser.favPokemons[i].name;
    fetch('https://avancera.app/cities/?name' + favPokemonName)
      .then((response) => {
        return response.json();
      })
      .then(result => {
        console.log(result)
        let fav = (result.find(e => e.name === favPokemonName));
        let list = document.createElement('li')
        let add = document.getElementById('citiesPokemon');
        let element = document.createTextNode(fav.name)
        deleteButton = document.createElement('button');
        editButton = document.createElement('button');
        editButton.setAttribute('id',fav.name + 'edit')
        deleteButton.setAttribute('id',fav.name + 'delete')
        list.appendChild(element)
        add.appendChild(list)
        list.appendChild(deleteButton)
        list.appendChild(editButton)
        deleteButton.innerText='kill'
        editButton.innerText='edit'
      })
  }

}

let favPokemon = {};
function savePokemon() {

  favPokemon = {
    name: activeUser.userId + document.getElementById('pokemonName').innerHTML,
    id: document.getElementById('pokemonNumber').innerHTML,
  }/*
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
  */
  fetch('https://avancera.app/cities/', {
    body: JSON.stringify({ name: favPokemon.name, population: parseInt(favPokemon.id) }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
  //activeUser = JSON.parse(localStorage.getItem('activeUser'))
  activeUser.favPokemons.push(favPokemon);
  localStorage.setItem('activeUser', JSON.stringify(activeUser));
  let users = JSON.parse(localStorage.getItem('users'));
  if (users.some(e => e.username === activeUser.username)) {
    let i = users.findIndex(e => e.username === activeUser.username);
    let user = users[i];
    user.favPokemons = activeUser.favPokemons;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
  }

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  delay(500).then(() => favouritePokemon());
}

function favouritePokemon() {
  let stringPokemon = favPokemon.name
  fetch('https://avancera.app/cities/?name' + stringPokemon)
    .then((response) => {
      return response.json();
    })
    .then(result => {
      let fav = (result.find(e => e.name === stringPokemon));
      let list = document.createElement('li')
      let add = document.getElementById('citiesPokemon');
      let element = document.createTextNode(fav.name)
      deleteButton = document.createElement('button');
      editButton = document.createElement('button')
      editButton.setAttribute('id',fav.name + 'edit')
      deleteButton.setAttribute('id',fav.name + 'delete')
      list.appendChild(element)
      add.appendChild(list)
      list.appendChild(deleteButton)
      list.appendChild(editButton)
      deleteButton.innerText='kill'
      editButton.innerText='edit'
    })
}


let showChartBtn = document.querySelector('#show-chart-btn')
showChartBtn.addEventListener('click', showChart)

let pokemonId;
let fetchUrl;
let chartData = [];
let chartLabels = [];

for (i = 1; i < 649; i++) {
  pokemonId = i;
  fetchUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
  fetch(fetchUrl)
    .then((response) => response.json())
    .then((result) => {
      if (result.height > 29) {
        chartData.push(result.height);
        chartLabels.push(result.name);
      }
    })
}

function showChart() {
  const ctx = document.querySelector('#myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Height',
        data: chartData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    }
  })
}
