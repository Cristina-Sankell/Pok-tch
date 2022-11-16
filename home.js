let logOutBtn = document.querySelector('#logout-btn');
logOutBtn.addEventListener('click', logOut);
let editNameForm = document.querySelector('#edit-form')
editNameForm.style.display = 'none';
let displayUser = document.querySelector('#display-user');
let activeUser = JSON.parse(localStorage.getItem('activeUser'));

//Kollar om användare är "inloggad", alltså om activeUser finns i local storage.
//Finns activeUser så skrivs användarnamnet ut och användarens sparade favoriter
//hämtas från cities-tjänsten
//Finns inte activeUser så kommer användaren tillbaka till index-sidan
if (JSON.parse(localStorage.getItem('activeUser')) !== null) {
  displayUser.textContent = activeUser.username;
  displayFavorites()
} else {
  window.location.href = "index.html"
}


//"Loggar ut" användaren och tar bort activeUser från local storage.
//Användaren kommer till index-sidan
function logOut() {
  localStorage.removeItem('activeUser');
  window.location.href = "index.html";
}


//Get random Pokemon from api
//Funktion som hämtar slumpade Pokemon från API och visar upp namn, sprite och
//olika data om hämtad Pokemon.
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


//Display Pokemons in favorite list
//Hämtar data från cities-tjänsten och plockar ut en användares sparade Pokemon
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


//Sparar ner Pokemon till cities-tjänsten med användares användar-id som prefix
//till namnet
let favPokemon = {};
function savePokemon() {

  favPokemon = {
    name: activeUser.userId + document.getElementById('pokemonName').innerHTML,
    id: document.getElementById('pokemonNumber').innerHTML,
  }
  fav = favPokemon.name;
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
  delay(500).then(() => createFavList());
}

let deleteButton;
let editButton;
let list;
let add;
let element;

//Skapar li-element samt buttons för att kunna visa och ta bort/ändra sparade
//Pokemon
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
  list.appendChild(element)
  add.appendChild(list)
  list.appendChild(deleteButton)
  list.appendChild(editButton)
  deleteButton.innerText = 'kill'
  editButton.innerText = 'edit'
  editrPokemon()
  deleterPokemon()
}


let slicedId;
let userOne;
let polkamon;
let pokemonCitiesId;
let favListItem;
let newName
let newCitiesName;

//Funktion för att ändra namn på favorit-Pokemon
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


//Funktion för att ta bort favorit-Pokemon
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

//Funktion som tar bort sparad Pokemon från cities-tjänsten
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

//Funktion som ändrar namn på sparad Pokemon i cities-tjänsten
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



//Knapp med eventListener för att öppna tabell över längsta Pokemon
let showChartBtn = document.querySelector('#show-chart-btn')
showChartBtn.addEventListener('click', showChart)

let pokemonId;
let fetchUrl;
let chartData = [];
let chartLabels = [];

//Loopar igenom och hämtar Pokemon och sparar ner de som har en 'height'
//över 29
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

//Tabell med chart.js som visar de längsta Pokemon från API:t
function showChart() {
  showChartBtn.style.display = 'none';
  const ctx = document.querySelector('#myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    options: {
      plugins: {
        title: {
          display: true,
          text: 'thr 20 heighterst los pollos men EVER',
          color: '#B3A125',
          font: {
            size: 50,
          },
        },
        legend: {
          display: false,
        }
      },
      scales: {
        y: {
          ticks: { color: 'black', beginAtZero: true }
        },
        x: {
          ticks: { color: 'black', beginAtZero: true }
        }
      }
    },
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Height',
        data: chartData,
        backgroundColor: [
          '#3B4CCA', '#FFDE00', '#FF0000', '#B3A125',
        ],
        borderColor: [
          'rgba(0, 0, 0,)',
        ],
        borderWidth: 1
      }]
    }
  })
}
