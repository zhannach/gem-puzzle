const input = document.querySelector('.interactive__amount')
const radios = document.querySelectorAll('.linear__input')

input.addEventListener('input', (e) => {
  e.target.value = e.target.value.slice(0, 4)
})

radios.forEach((item) => {
  item.addEventListener('change', updateRadioAmount)
})

function updateRadioAmount(event) {
  input.value = event.target.value
}

const existing = {
  5000: 0,
  2000: 1,
  1000: 2,
  500: 3,
  250: 4,
  100: 5,
  50: 6,
  25: 7,
}

const empty = document.getElementById('amount-0')
input.addEventListener('keyup', (event) => {
  const index = existing[event.target.value]
  if (index !== undefined && radios[index]) {
    radios[index].checked = true
  } else {
    empty.checked = true
  }
})
