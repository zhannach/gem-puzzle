class GemPuzzle {
  colsNum = 4 // number
  digits // array of strings
  results = [] // array of [moves, seconds]
  areaElem // Element
  movesElem // Element
  movesCount = 0
  timerElem // Element
  timerSeconds = 0
  shuffleElem
  btnResultsElem
  btnAudioElem
  popupElem
  sizeElem
  moveAudio
  moveEffect
  moveTime
  moveAudio
  soundEnabled = true
  // handler functions
  dragstart_handler
  dragover_handler
  dragend_handler
  click_handler

  constructor(linkElems, areaElem, colsNumDefault = 4) {
    this.areaElem = areaElem
    this.moveAudio = new Audio('move.mp3')
    this.genereteFooterLinks(linkElems, 3, 8)
    this.movesElem = document.querySelector('.moves__number')
    this.timerElem = document.querySelector('.times__number')
    this.popupElem = document.querySelector('.popup')
    this.closePopup = document.querySelector('.popup__close')
    this.btnResultsElem = document.querySelector('.button__results')
    this.moveEffect = [
      {transform: 'translate(0)'},
      {transform: 'translate(100%)'}
    ]
    this.moveTime = {
      duration: 1000,
      iteration: 1,
    }
    this.shuffleElem = document.querySelector('.button__shuffle')
    this.shuffleElem.addEventListener('click', () => {
      this.startNewGame()
    })
    this.generateHandlers()
    this.movesCount = parseInt(window.localStorage.getItem('move')) || 0
    this.movesElem.innerText = this.movesCount
    this.timerSeconds = parseInt(window.localStorage.getItem('time')) || 0
    this.updateTimerSeconds()
    this.generateCells(colsNumDefault, true)
    this.sizeElem = document.querySelector('.current__value')
    this.sizeElem.innerText = `${this.colsNum}*${this.colsNum}`
    setInterval(() => {
      this.updateTimerSeconds()
    }, 1000)
    if (window.localStorage.getItem('results')) {
      this.results = JSON.parse(window.localStorage.getItem('results'))
    }
    this.btnResultsElem.addEventListener('click', () => {
      this.showResultsPopup()
    })
    this.closePopup.addEventListener('click', () => {
      this.popupElem.classList.remove('active')
      document.body.classList.remove('lock')
    })

    document.querySelector('.btn__audio').addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled
      document.querySelector('.btn__audio').innerText = this.soundEnabled ? 'Sound off' : 'Sound on'
      document.querySelector('.btn__audio').classList.toggle('active')
    })
  }

  generateDigitsRange() {
    this.digits = []
    for (let i = 1; i < this.colsNum * this.colsNum; i++) {
      this.digits.push(i.toString())
    }
    this.digits.push('')
    this.digits = this.digits.sort(() => 0.5 - Math.random())
    if (!this.checkSolvable()) {
      this.generateDigitsRange()
    }
    // this.digits = ['1', '2', '3', '4', '7', '5', '6', '', '8']
  }

  generateCells(newColsNum, isInit = false) {
    if (isInit && window.localStorage.getItem('digits')) {
      this.digits = JSON.parse(window.localStorage.getItem('digits'))
      this.colsNum = Math.sqrt(this.digits.length)
    } else {
      this.colsNum = newColsNum
      this.generateDigitsRange()
    }
    areaElem.innerHTML = ''
    areaElem.style.gridTemplateColumns = `repeat(${this.colsNum}, 1fr)`

    this.digits.forEach((digit, index) => {
      const cell = document.createElement('div')
      cell.className = digit === '' ? 'cell-empty' : 'field__cell'
      cell.innerText = digit
      cell.id = 'c' + (index + 1)
      this.areaElem.appendChild(cell)
    })
    this.addCellEvents()
    window.localStorage.setItem('digits', JSON.stringify(this.digits))
  }

  genereteFooterLinks(linkElems, start, end) {
    for (; start <= end; start++) {
      const link = document.createElement('a')
      link.setAttribute('href', '#')
      link.classList.add('sizes__link')
      link.innerText = `${start}*${start}`
      const numCols = start
      link.addEventListener('click', (e) => {
        e.preventDefault()
        this.sizeElem.innerText = link.innerText
        this.startNewGame(numCols)
      })
      linkElems.appendChild(link)
    }
  }

  getMatrix() {
    let j = 0
    const arr = []
    for (let i = 0; i < this.colsNum; i++) {
      arr.push(this.digits.slice(j, j + this.colsNum))
      j += this.colsNum
    }
    return arr
  }

  getEmptyCell(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === '') {
          return [i, j]
        }
      }
    }
  }

  addCellEvents() {
    const matrix = this.getMatrix()
    const [row, col] = this.getEmptyCell(matrix)
    let left,
      right,
      top,
      bottom = null
    if (matrix[row][col - 1]) {
      left = matrix[row][col - 1]
    }
    if (matrix[row][col + 1]) {
      right = matrix[row][col + 1]
    }
    if (matrix[row + 1] !== undefined) {
      top = matrix[row + 1][col]
    }
    if (matrix[row - 1] !== undefined) {
      bottom = matrix[row - 1][col]
    }

    this.areaElem.childNodes.forEach((child) => {
      this.removeDragEvents(child)
      child.draggable = false
      /*if (child.innerText === top) {
        this.moveEffect = [
          {transform: 'translateY(0)'},
          {transform: 'translateY(100%)'}
        ]
        this.listenDragEvents(child)
        child.draggable = true
        child.addEventListener('click', () => {
          child.animate(this.moveEffect, this.moveTime)
        })
      }
      if(child.innerText === bottom) {
        this.moveEffect = [
          {transform: 'translateY(0)'},
          {transform: 'translateY(-100%)'}
        ]
        this.listenDragEvents(child)
        child.draggable = true
        child.addEventListener('click', () => {
          child.animate(this.moveEffect, this.moveTime)
        })
      }
      if(child.innerText === right) {
        this.moveEffect = [
          {transform: 'translateX(0%)'},
          {transform: 'translateX(-100%)'}
        ]
        this.listenDragEvents(child)
        child.draggable = true
        child.addEventListener('click', () => {
          child.animate(this.moveEffect, this.moveTime)
        })
      }
      if(child.innerText === left) {
        this.moveEffect = [
          {transform: 'translateX(0)'},
          {transform: 'translateX(100%)'}
        ]
        this.listenDragEvents(child)
        child.draggable = true
        child.addEventListener('click', () => {
          child.animate(this.moveEffect, this.moveTime)
        })
      }*/
      if(child.innerText === left || child.innerText === right || child.innerText === top || child.innerText === bottom) {
        this.listenDragEvents(child)
        child.draggable = true
      } else if (child.innerHTML === '') {
        child.addEventListener('drop', this.drop_handler)
        child.addEventListener('dragover', this.dragover_handler)
      }
    })
  }

  listenDragEvents(elem) {
    elem.addEventListener('dragstart', this.dragstart_handler)
    elem.addEventListener('dragover', this.dragover_handler)
    elem.addEventListener('dragend', this.dragend_handler)
    elem.addEventListener('click', this.click_handler)
  }

  removeDragEvents(elem) {
    elem.removeEventListener('dragstart', this.dragstart_handler)
    elem.removeEventListener('dragover', this.dragover_handler)
    elem.removeEventListener('dragend', this.dragend_handler)
    elem.removeEventListener('drop', this.drop_handler)
    elem.removeEventListener('click', this.click_handler)
  }

  checkSolvable() {
    let num = 0
    const arr = this.digits
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) {
          num++
        }
      }
    }
    return num % 2 === 0
  }

  isGameOver() {
    let t = 0
    for (let num of this.digits) {
      num = parseInt(num) || t
      if (num < t) {
        return false
      }
      t = num
    }
    return true
  }

  updateMovesCount() {
    this.movesCount++
    this.movesElem.innerText = this.movesCount
    window.localStorage.setItem('move', this.movesCount.toString())
  }

  updateTimerSeconds() {
    if (this.movesCount > 0) {
      this.timerSeconds++
      const minutes = Math.floor(this.timerSeconds / 60)
      const seconds = this.timerSeconds - minutes * 60
      this.timerElem.innerText = `${minutes < 10 ? '0' : ''}${minutes}:${
        seconds < 10 ? '0' : ''}${seconds}`
    }
    window.localStorage.setItem('time', this.timerSeconds.toString())
  }

  startNewGame(newColsNum = 0) {
    this.movesCount = -1
    this.updateMovesCount()
    this.timerSeconds = 0
    this.updateTimerSeconds()
    this.timerElem.innerText = '00:00'
    this.generateCells(newColsNum || this.colsNum)
  }

  showResultsPopup() {
    this.popupElem.classList.add('active')
    document.body.classList.add('lock')
    let topList = ''
    for (const res of this.results) {
      topList += `<li>${res[0]} moves in ${res[1]} secs</li>`
    }
    document.querySelector('.popup__text').innerHTML = `<h3>Top 10 results:</h3><ol>${topList}</ol>`
  }

  showGameOver() {
    this.popupElem.classList.add('active')
    document.body.classList.add('lock')
    this.timerSeconds++
    document.querySelector('.popup__text').innerHTML = `Hooray! <br> You solved the puzzle in
                ${this.timerSeconds} seconds and ${this.movesCount} moves!`
    this.results.push([this.movesCount, this.timerSeconds])
    this.results = this.results.sort((a, b) => a[1] - b[1]).slice(0, 11)
    window.localStorage.setItem('results', JSON.stringify(this.results))
    this.startNewGame()
  }

  processCellMoved(emptyEl, baseEL) {
    if (this.soundEnabled) {
      this.moveAudio.load()

      
    }
    emptyEl.innerText = baseEL.innerText
    baseEL.innerText = ''
    baseEL.className = 'cell-empty'
    emptyEl.className = 'field__cell'
    this.digits = []
    this.areaElem.childNodes.forEach((child) => {
      this.digits.push(child.innerText)
    })
    this.addCellEvents()
    this.updateMovesCount()
    window.localStorage.setItem('digits', JSON.stringify(this.digits))
    if (this.isGameOver()) {
      this.showGameOver()
    }
  }

  generateHandlers() {

    this.dragstart_handler = (event) => {
      console.log('dragstart')
      event.dataTransfer.setData('text/plain', event.target.id)
      event.dataTransfer.dropEffect = 'move'
    }

    this.dragover_handler = (event) => {
      console.log('dragOver')
      event.preventDefault()
    }

    this.drop_handler = (event) => {
      console.log('drop')
      event.preventDefault()
      const emptyEl = event.target
      const data = event.dataTransfer.getData('text/plain')
      const baseEL = document.getElementById(data)
      if (!baseEL || !baseEL.innerText) return
      this.processCellMoved(emptyEl, baseEL)
     }

    this.click_handler = (event) => {
      console.log('click')
      event.preventDefault()
      const emptyEl = document.querySelector('.cell-empty')
      this.processCellMoved(emptyEl, event.target)
    }

    this.dragend_handler = (event) => {
      console.log('dragEnd')
      event.dataTransfer.clearData()
    }
  }
}

// GemPuzzle class end

document.body.innerHTML = `
 <div class="container">
  <header>
    <div class="header__buttons">
      <button class="btn button__shuffle">Shuffle and start</button>
      <button class="btn button__stop">Stop</button>
      <button class="btn button__save">Save</button>
      <button class="btn button__results">Results</button>
    </div>
  </header>
  <main>
    <div class="area__count">
      <div class="count__moves">
        <span class="moves__title">Moves:</span>
        <span class="moves__number">0</span>
      </div>
      <div class="count__times">
        <span class="times__title">Time:</span>
        <span class="times__number">00:00</span>
      </div>
    </div>
    <div class="area__field">
    </div>
    <div class="area__sizes">
      <div class="size__current">
        <span class="current__title">Frame size:
        <span class="current__value">4*4</span>
        </span>
        <button class="btn__audio">Sound on</button>
      </div>
      <div class="sizes__links">
      <span class="sizes__title">Others sizes:</span>
      </div>
    </div>
    <div class="popup">
    <div class="popup__body">
      <div class="popup__content">
        <div class="popup__close">x</div>
        <div class="popup__text"></div>
      </div>
    </div>
  </div>
  </main>
  </div>
`
const linkElems = document.querySelector('.sizes__links')
const areaElem = document.querySelector('.area__field')
const game = new GemPuzzle(linkElems, areaElem)
