let logOutBtn = document.querySelector('#logout-btn');
logOutBtn.addEventListener('click', logOut);
let editNameForm = document.querySelector('#edit-form')
editNameForm.style.display = 'none';
let displayUser = document.querySelector('#display-user');
let activeUser = JSON.parse(localStorage.getItem('activeUser'));


if (JSON.parse(localStorage.getItem('activeUser')) !== null) {
  displayUser.textContent = activeUser.username;
  displayFavorites()
} else {
  window.location.href = "index.html"
}

function logOut() {
  localStorage.removeItem('activeUser');
  window.location.href = "index.html";
}


//Get random Pokemon from api
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


//Save and display Pokemons in favorite list
let fav;
function displayFavorites() {

  fetch('https://avancera.app/cities/')
    .then((response) => {
      return response.json();
    })
    .then(result => {
      for (i = 0; i < result.length; i++) {
        let pokomans = result[i].name;
        if (pokomans.includes(activeUser.userId)) {
          fav = pokomans;
          createFavList();
        }
      }
    })
}

let favPokemon = {};
function savePokemon() {

  favPokemon = {
    name: activeUser.userId + document.getElementById('pokemonName').innerHTML,
    id: document.getElementById('pokemonNumber').innerHTML,
  }
  fetch('https://avancera.app/cities/', {
    body: JSON.stringify({ name: favPokemon.name, population: parseInt(favPokemon.id) }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
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
      let favObj = (result.find(e => e.name === stringPokemon));
      fav = favObj.name;
      createFavList();
    })
}

let deleteButton;
let editButton;
let list;
let add;
let element;

function createFavList() {
  list = document.createElement('li')
  add = document.getElementById('citiesPokemon');
  element = document.createTextNode(fav.slice(2))
  deleteButton = document.createElement('button');
  editButton = document.createElement('button')
  editButton.setAttribute('id', fav + 'edit')
  editButton.setAttribute('class', 'editBtn')
  deleteButton.setAttribute('id', fav + 'delete')
  deleteButton.setAttribute('class', 'deleteBtn')
  list.setAttribute('id', fav)
  //list.setAttribute('class', 'favListItems')
  list.appendChild(element)
  add.appendChild(list)
  list.appendChild(deleteButton)
  list.appendChild(editButton)
  deleteButton.innerText = 'kill'
  editButton.innerText = 'edit'
  editrPokemon()
  deleterPokemon()
}


//Delete and edit Pokemons in Favorite list
let slicedId;
let userOne;
let polkamon;
let pokemonCitiesId;
let favListItem;
let newName
let newCitiesName;


function editrPokemon() {
  document.querySelectorAll('.editBtn').forEach(item => {
    item.addEventListener('click', (event) => {
      let clickedBtnId = event.target.getAttribute('id')
      console.log('clicked')
      polkamon = clickedBtnId.length - 4;
      slicedId = clickedBtnId.slice(0, polkamon)
      editNameForm.style.display = 'block';
      document.querySelector('#edit-name-label').textContent = 'Edit ' + slicedId.slice(2);
      favListItem = document.getElementById(slicedId)
      document.querySelector('#edit-close-btn').addEventListener('click', () => {
        editNameForm.style.display = 'none';
      })
      document.querySelector('#edit-btn').addEventListener('click', () => {
        if (document.querySelector('#edit-input-field').value !== '') {
          newName = document.querySelector('#edit-input-field').value;
          console.log(newName)
          favListItem.textContent = newName;
          newCitiesName = activeUser.userId + newName;
          pokeUrl = `https://avancera.app/cities/?name=${slicedId}`;
          fetch(pokeUrl)
            .then((response) => response.json())
            .then((result) => {
              pokemonCitiesId = result[0].id;
            })
          function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
          }
          delay(500).then(() => patchPokemon());
        }
      })
    })
  })
}

function deleterPokemon() {
  document.querySelectorAll('.deleteBtn').forEach(item => {
    item.addEventListener('click', event => {
      console.log('clicked');
      let clickedBtnId = event.target.getAttribute('id')
      polkamon = clickedBtnId.length - 6;
      slicedId = clickedBtnId.slice(0, polkamon)
      console.log(slicedId)
      favListItem = document.getElementById(slicedId)
      pokeUrl = `https://avancera.app/cities/?name=${slicedId}`;
      fetch(pokeUrl)
        .then((response) => response.json())
        .then((result) => {
          pokemonCitiesId = result[0].id;
        })
      function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }
      delay(500).then(() => deletePokemon());
    })
  })
}

function deletePokemon() {
  fetch('https://avancera.app/cities/' + pokemonCitiesId, {
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'DELETE'
  })
  favListItem.style.display = 'none';
}

function patchPokemon() {
  console.log('patching');
  fetch('https://avancera.app/cities/' + pokemonCitiesId, {
    body: JSON.stringify({ name: newCitiesName }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH'
  })
    .then(response => {
      console.log(response)
    })
  editNameForm.style.display = 'none';
}



//CHart with chart.js
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
      plugins:{
        title:{
          display: true,
          text:'thr 20 heighterst los pollos men EVER',
          color:'#B3A125',
          font:{
            size:50,
          },
        },
        legend: {
          display: false,
        }
      },
      scales: {
        y: {
          ticks:{ color: 'black', beginAtZero: true}
        },
        x: {
          ticks:{ color: 'black', beginAtZero: true}
        }
      }
    },
    data: {
      labels: chartLabels,
      datasets: [{
        label:'Height',
        data: chartData,
        backgroundColor: [
          '#3B4CCA', '#FFDE00','#FF0000','#B3A125',
        ],
        borderColor: [
          'rgba(0, 0, 0,)',
        ],
        borderWidth: 1
      }]
    }
  })
}
