let loginForm = document.querySelector('#login-form');
let signupForm = document.querySelector('#signup-form');
let users = [];
let user = {};

isLoggedIn();

function isLoggedIn() {
  if (Object.keys(JSON.parse(localStorage.getItem('activeUser'))).length !== 0) {
    window.location.href = "home.html";
  }
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  checkUser();
})

function checkUser() {
  let checkUserName = document.querySelector('#username').value;
  let checkPassword = document.querySelector('#password').value;
  users = JSON.parse(localStorage.getItem('users'));

  if (users.some(e => e.username === checkUserName)) {
    let i = users.findIndex(e => e.username === checkUserName);
    if (users[i].username === checkUserName && users[i].password === checkPassword) {
      logIn();
    } else {
      console.log('sorry, wrong password')
    }
  } else {
    console.log('sorry, wrong username')
  }
}

function logIn() {
  let activeUser = {
    username: document.querySelector('#username').value,
    password: document.querySelector('#password').value
  };
  localStorage.setItem('activeUser', JSON.stringify(activeUser));
  window.location.href = "home.html";
}

function signUp() {
  let newUsername = document.querySelector('#new-username').value;
  let newPassword = document.querySelector('#new-password').value;
  console.log(newUsername)
  users = JSON.parse(localStorage.getItem('users'));
  console.log(newUsername)
  if (users.some(e => e.username === newUsername)) {
    console.log('username already in use');
  } else if (newUsername.length < 4) {
    console.log(newUsername)
    console.log('username must be at least 4 characters')
  } else if (newPassword.length < 6) {
    console.log('username must be at least 6 characters')
  } else {
    let user = {
      username: newUsername,
      password: newPassword
    };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    let activeUser = user;
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
    window.location.href = "home.html";
  };
}

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
