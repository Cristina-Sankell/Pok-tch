let form = document.querySelector('#form');
let users = [];

form.addEventListener('submit', (e) => {

  e.preventDefault();

  let userName = document.querySelector('#username').value;
  let passWord = document.querySelector('#password').value;

  let user = {
    username: userName,
    password: passWord
  };

  console.log(users);

  console.log(user);
  users.push(user);

  localStorage.setItem('users', JSON.stringify(users));

})

users = JSON.parse(localStorage.getItem('users'));
