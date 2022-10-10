const animalsCardsOrig = document.querySelector('.animals__cards')
for (let i = 0; i < 5; i += 1) {
  const animalsCards = animalsCardsOrig.cloneNode(true)
  for (let j = animalsCards.children.length; j >= 0; j -= 1) {
    animalsCards.appendChild(animalsCards.children[(Math.random() * j) | 0])
  }
  animalsCardsOrig.parentElement.appendChild(animalsCards)
}

// ________Swiper-slider Animals_________

const animalsSwiper = new Swiper('.animals-slider', {
  slidesPerView: 1,
  navigation: {
    nextEl: '.card__btn-right',
    prevEl: '.card__btn-left',
  },
  spaceBetween: 30,
  loop: true,
  speed: 800,
})

// Testimonials popUp

const testPopup = document.querySelector('.testimonials__popup')
const crossPopup = document.querySelector('.popup__close')
const popupContent = document.querySelector('.popup_wrapper')
const testItems = document.querySelectorAll('.testimonials__item')

testItems.forEach((item) => {
  item.addEventListener('click', openPopup)
})

crossPopup.addEventListener('click', closePopup)
testPopup.addEventListener('click', closePopup)

function openPopup(event) {
  testPopup.classList.toggle('seePopup')
  document.body.classList.toggle('has-overlay')
  let html = ''
  if (event.target.classList.contains('testimonials__item')) {
    html = event.target.outerHTML
  } else {
    html = event.target.closest('.testimonials__item').outerHTML
  }
  popupContent.innerHTML = html
}

function closePopup() {
  testPopup.classList.remove('seePopup')
  document.body.classList.remove('has-overlay')
}

// // Swiper-slider Testimonials

const testimonialsSlider = new Swiper('.testimonials-slider', {
  spaceBetween: 15,
  snapOnRelease: true,
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
    dragSize: 50,
  },
  breakpoints: {
    1600: {
      slidesPerView: 4,
    },
    1000: {
      slidesPerView: 3,
    },
    640: {
      slidesPerView: 1,
    },
  },
})
