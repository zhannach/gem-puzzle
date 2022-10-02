const burger = document.querySelector('.header__burger')
const menu = document.querySelector('.header__nav')

burger.addEventListener('click', showBurger)

function showBurger() {
  burger.classList.toggle('header__burger-active')
  menu.classList.toggle('header__nav')
  menu.classList.toggle('header__nav-active')
}
