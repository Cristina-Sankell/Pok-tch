let loginForm = document.querySelector('#login-form');
let signupForm = document.querySelector('#signup-form');
let loginError = document.querySelector('#login-error-msg');
let signupError = document.querySelector('#signup-error-msg');
let user = {};
let users = JSON.parse(localStorage.getItem('users'));

//Kollar i local storage om någon användare finns sparad. Annars skapas en tom
//array och sparas till local storage
checkLocalStorage();

function checkLocalStorage() {
  if (localStorage.getItem('users') !== null) {
    isLoggedIn()
  } else {
    let users = [];
    localStorage.setItem('users', JSON.stringify(users));
  }
}

//Kollar om användare är "inloggad". I så fall kommer användaren direkt till home.
function isLoggedIn() {
  if (localStorage.getItem('activeUser') !== null) {
    window.location.href = "home.html";
  }
}

//Funktion för att kolla användarnamn och lösenord som skrivs in i inloggningsformuläret.
//Kollar om användarnamnet finns och om det finns kollas om lösenordet är rätt. Är båda
//rätt så körs funktionen logIn
function checkUser() {
  loginError.style.display = 'none'
  let checkUserName = document.querySelector('#username').value;
  let checkPassword = document.querySelector('#password').value;
  let users = JSON.parse(localStorage.getItem('users'));

  if (users.some(e => e.username === checkUserName)) {
    let i = users.findIndex(e => e.username === checkUserName);
    if (users[i].username === checkUserName && users[i].password === checkPassword) {
      logIn();
    } else {
      loginError.style.display = 'block'
      loginError.textContent = "Sorry, wrong password. Try again"
    }
  } else {
    loginError.style.display = 'block'
    loginError.textContent = "Sorry, wrong username. Try again"
  }
}

//Funktion som "loggar in" användare. Användaren hämtas från local storage med hjälp
//av inputen från inloggningsformuläret och sparas i activeUser, som sparas i
//local storage. Användaren kommer sedan till home.
function logIn() {

  let users = JSON.parse(localStorage.getItem('users'));
  let username = document.querySelector('#username').value
  let i = users.findIndex(e => e.username === username)
  let userId = users[i].userId
  let activeUser = {
    username: document.querySelector('#username').value,
    password: document.querySelector('#password').value,
    userId: userId,
  };
  localStorage.setItem('activeUser', JSON.stringify(activeUser));
  window.location.href = "home.html";
}

//Eventlistener som lyssnar på login-formuläret och kör funktionen checkUser vid submit
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  checkUser();
})

//Funktion för att slumpa fram ett id till ny användare.
function getId() {
  let numberOfIds = 100;
  let userId = Math.round(Math.random() * (numberOfIds - 1)) + 1;
  return userId
}

//Funktion för att "registrera" en användare. Input kollas så att användarnamnet inte redan
//är sparat i local storage och så att användarnamn och lösenord är längre än 4 respektive
//6 tecken. Är allt ok så sparas användaren till local storage.
function signUp() {
  signupError.style.display = 'none';
  let newUsername = document.querySelector('#new-username').value;
  let newPassword = document.querySelector('#new-password').value;
  let users = JSON.parse(localStorage.getItem('users'));
  if (users.some(e => e.username === newUsername)) {
    signupError.style.display = 'block';
    signupError.textContent = 'Username is already in use. Try a different one'
  } else if (newUsername.length < 4) {
    signupError.style.display = 'block'
    signupError.textContent = 'Username must be at least 4 characters'
  } else if (newPassword.length < 6) {
    signupError.style.display = 'block'
    signupError.textContent = 'Password must be at least 6 characters long'
  } else {
    let user = {
      username: newUsername,
      password: newPassword,
      userId: getId(),
    };
    let users = JSON.parse(localStorage.getItem('users'));
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    let activeUser = user;
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
    window.location.href = "home.html";
  };
}

//Eventlistener som lyssnar på sign up-formuläret och kör funktionen signUp vid submit
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  signUp();
})

//Lyssnare för knapp som visar formulär för att lägga till ny användare
let toSignUpBtn = document.querySelector('#to-signup-btn').addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
})

//Lyssnare för knapp som visar inloggningsformuläret
let toLogInBtn = document.querySelector('#to-login-btn').addEventListener('click', () => {
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
})
