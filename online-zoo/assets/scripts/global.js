const burger = document.querySelector('.header__burger')
const menu = document.querySelector('.header__nav')
const overlay = document.querySelector('.overlay')

burger.addEventListener('click', showBurger)

function showBurger() {
  burger.classList.toggle('header__burger-active')
  menu.classList.toggle('active')
  document.body.classList.toggle('has-overlay')
  document.body.classList.toggle('burger-open')
}

overlay.addEventListener('click', closeBurger)

function closeBurger() {
  burger.classList.toggle('header__burger-active')
  menu.classList.toggle('active')
  document.body.classList.toggle('has-overlay')
  document.body.classList.toggle('burger-open')
}
