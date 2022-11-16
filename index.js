let loginForm = document.querySelector('#login-form');
let signupForm = document.querySelector('#signup-form');
let loginError = document.querySelector('#login-error-msg');
let signupError = document.querySelector('#signup-error-msg');
let user = {};
let users = JSON.parse(localStorage.getItem('users'));

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

function getId() {
  let numberOfIds = 100;
  let userId = Math.round(Math.random() * (numberOfIds - 1)) + 1;
  return userId
}

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
