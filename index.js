let loginForm = document.querySelector('#login-form');
let signupForm = document.querySelector('#signup-form');
let user = {};
let users = JSON.parse(localStorage.getItem('users'));
console.log(users);


checkLocalStorage();

function checkLocalStorage() {
  if (localStorage.getItem('users') !== null) {
    isLoggedIn()
  } else {
    let users = [];
    localStorage.setItem('users', JSON.stringify(users));
  }
}

function isLoggedIn() {
  if (localStorage.getItem('activeUser') !== null) {
    window.location.href = "home.html";
  }
}

function checkUser() {
  let checkUserName = document.querySelector('#username').value;
  let checkPassword = document.querySelector('#password').value;
  let users = JSON.parse(localStorage.getItem('users'));

  if (users.some(e => e.username === checkUserName)) {
    let i = users.findIndex(e => e.username === checkUserName);
    if (users[i].username === checkUserName && users[i].password === checkPassword) {
      logIn();
    } else {
      console.log('Sorry, wrong password')
    }
  } else {
    console.log('Sorry, wrong username')
  }
}

function logIn() {

  let users = JSON.parse(localStorage.getItem('users'));
  let username = document.querySelector('#username').value
  let i = users.findIndex(e => e.username === username)
  let userId = users[i].userId
  let favPokemons = users[i].favPokemons
  let activeUser = {
    username: document.querySelector('#username').value,
    password: document.querySelector('#password').value,
    userId: userId,
    favPokemons: favPokemons
  };
  localStorage.setItem('activeUser', JSON.stringify(activeUser));
  window.location.href = "home.html";
}

function getId() {
  let numberOfIds = 100;
  let userId = Math.round(Math.random() * (numberOfIds - 1)) + 1;
  return userId
}

function signUp() {
  let newUsername = document.querySelector('#new-username').value;
  let newPassword = document.querySelector('#new-password').value;
  let users = JSON.parse(localStorage.getItem('users'));
  if (users.some(e => e.username === newUsername)) {
    console.log('username already in use');
  } else if (newUsername.length < 4) {
    console.log('username must be at least 4 characters');
  } else if (newPassword.length < 6) {
    console.log('password must be at least 6 characters');
  } else {
    let user = {
      username: newUsername,
      password: newPassword,
      userId: getId(),
      favPokemons: []
    };
    let users = JSON.parse(localStorage.getItem('users'));
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    let activeUser = user;
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
    window.location.href = "home.html";
  };
}
function loginError() {
  let loginErrorText = document.createElement('p');
  let loginFirstInput = document.querySelector('#username')
  loginForm.insertBefore(loginErrorText, loginFirstInput);
  loginErrorText.textContent = errorText;
  loginErrorText.classList.add('error-message')
}

function signupError() {
  let signupErrorText = document.createElement('p');
  let signupFirstInput = document.querySelector('#new-username')
  signupForm.insertBefore(signupErrorText, signupFirstInput);
  signupErrorText.textContent = errorText;
  signupErrorText.classList.add('error-message')
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  checkUser();
})

let toSignUpBtn = document.querySelector('#to-signup-btn').addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
})

let toLogInBtn = document.querySelector('#to-login-btn').addEventListener('click', () => {
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
})

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  signUp();
})
