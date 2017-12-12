var body = document.querySelector('body')
var board = document.createElement('div')
board.id = 'board'
body.appendChild(board)


const makeWhite = () => {
    var white = document.createElement('div')
    white.classList.add('white')
    board.appendChild(white)
}

const makeBlack = () => {
    var black = document.createElement('div')
    black.classList.add('black')
    board.appendChild(black)
}




const makeBoard = () => {
    for (var i = 0; i < 8; i++) {
        for (var k = 0; k < 8; k++) {
            if (i % 2 === 0) {
                if (k % 2 === 0) {
                    makeWhite()
                } else {
                    makeBlack()
                }
            } else {
                if (k % 2 === 0) {
                    makeBlack()
                } else {
                    makeWhite()
                }
            }
        }
    }
}
makeBoard()



var white = Array.from(document.querySelectorAll('.white'))
var black = Array.from(document.querySelectorAll('.black'))


const assignCellClass = () => {
    white.map(function (cells) {
        cells.classList.add('cell')
    })
    black.map(function (cells) {
        cells.classList.add('cell')
    })
}
assignCellClass()



var cells = Array.from(document.querySelectorAll('.cell'))




const makeArmies = () => {
    let rk = [0,7]
    let kn = [1,6]
    let bs = [2,5]
    let qn = 3
    let k = 4
    for (var x = 0; x < 16; x++){
        let inverse = 63 - x
        if (rk.includes(x)){
            cells[x].classList.add('b-rook')
            cells[inverse].classList.add('w-rook')
        }
        else if (kn.includes(x)){
            cells[x].classList.add('b-knight')
            cells[inverse].classList.add('w-knight')
        }
        else if (bs.includes(x)){
            cells[x].classList.add('b-bishop')
            cells[inverse].classList.add('w-bishop')
        }
        else if (x === qn){
            cells[x].classList.add('b-queen')
            cells[inverse].classList.add('w-queen')
        }
        else if (x === k){
            cells[x].classList.add('b-king')
            cells[inverse].classList.add('w-king')
        }
        else {
            cells[x].classList.add('b-pawn')
            cells[inverse].classList.add('w-pawn')
        }
    }
}
makeArmies()


const pieces = {
    w:[
    'w-rook', 'w-knight', 
    'w-pawn', 'w-bishop', 
    'w-queen', 'w-king'
    ],
    b:[
    'b-rook', 'b-knight', 
    'b-pawn', 'b-bishop', 
    'b-queen', 'b-king'
    ]
}


const matrix = [
    [], [],
    [], [],
    [], [],
    [], []
]


const mtxCrds = (num) => {
    var vertical = 0
    var horizontal = 0
    var start = 7
    var coordinates = []
    for (var i = 0; i <= 7; i++) {
        if (num <= start) {
            horizontal = num - (8 * vertical)
            coordinates.push(vertical, horizontal)
            return coordinates
        } else {
            vertical = vertical + 1
            start = start + 8
        }
    }
}


const fillMatrix = () => {
    for (var i = 0; i < cells.length; i++) {
        var piece = cells[i].className.slice(11)
        var crds = mtxCrds(i)
        if (pieces.w.includes(piece) || pieces.b.includes(piece)) {
            matrix[crds[0]][crds[1]] = piece
        } else {
            matrix[crds[0]][crds[1]] = null
        }
    }
}
fillMatrix()





const color = (str) => {
    if (str === 'w') {
        return 'white'
    } else if (str === 'b') {
        return 'black'
    }
    return null
}


const removePiece = (num, str) => {
    let spot = mtxCrds(num)
    let vert = spot[0]
    let horz = spot[1]
    matrix[vert][horz] = null
    cells[num].classList.remove(str)
}


const addPiece = (num, str) => {
    let spot = mtxCrds(num)
    let vert = spot[0]
    let horz = spot[1]
    matrix[vert][horz] = str
    cells[num].classList.add(str)
}


const vertMoves = (num, num2) => {
    let fwd = (num2 - num) % 8 === 0
    let bkwd = ((num - num2) * -1) % 8 === 0
    return fwd || bkwd
}

const sideways = (num, num2) => {
    let leftLimit = 8 * num
    let rightLimit = leftLimit + 7
    return num2 >= leftLimit && num2 <= rightLimit
}

const allyLct = []

const noJump = (piece) => {
    
}




const moves = {
    pawn: (piece, num, num2) => {
        let pColor = color(piece[0])
        let pChk = cells[num2].className.slice(11)
        let diagonal = (num2 - num === 7) || (num2 - num === 9)
        let inverseDg = (num - num2 === 7) || (num - num2 === 9)
        if (pColor === 'black') {
            if (pieces.w.includes(pChk) && diagonal) {
                removePiece(num, piece)
                removePiece(num2, pChk)
                addPiece(num2, piece)
            }
            else if (num <= 15) {
                if (num2 === num + 8 || num2 === num + 16 && !pChk) {
                    removePiece(num, piece)
                    addPiece(num2, piece)
                }
            }
            else if (num2 === num + 8 && !pChk) {
                removePiece(num, piece)
                addPiece(num2, piece)
            } else {
                throw error
            }
        }
        else {
            if (pieces.b.includes(pChk) && inverseDg) {
                removePiece(num, piece)
                removePiece(num2, pChk)
                addPiece(num2, piece)
            }
            else if (num >= 48) {
                if (num2 === num - 8 || num2 === num - 16 && !pChk) {
                    removePiece(num, piece)
                    addPiece(num2, piece)
                }
            }
            else if (num2 === num - 8 && !pChk) {
                removePiece(num, piece)
                addPiece(num2, piece)
            } else {
                throw error
            }
        }
    },
    rook: (piece, num, num2) => {
        let pColor = color(piece[0])
        let spot = mtxCrds(num)
        let nxtMv = mtxCrds(num2)
        let pChk = matrix[nxtMv[0]][nxtMv[1]]
        let next = cells[num2].className.slice(11)
        let nColor = color(next[0])
        if (pColor !== nColor) {
            if (vertMoves(num, num2)) {
                removePiece(num, piece)
                removePiece(num2, pChk)
                addPiece(num2, piece)
            }
            else if (sideways(spot[0], num2)) {
                removePiece(num, piece)
                removePiece(num2, pChk)
                addPiece(num2, piece)
            }
            else {
                throw error
            }
        }
    },
    bishop: (piece, num, num2) => {
        let pColor = color(piece[0])
        let next = cells[num2].className.slice(11)
        let dg = num2 - num
        let nxCrd = mtxCrds(num2)
        let pChk = matrix[nxCrd[0]][nxCrd[1]]
        let dgChk = dg % 7 === 0 || dg % 9 === 0
        let box = cells[num].className.slice(0,5)
        let nxtBx = cells[num2].className.slice(0,5)
        let bxChk = box === nxtBx
        if (pColor === color(next[0])) {
            throw error
        }
        else if (dgChk && bxChk) {
            removePiece(num, piece)
            removePiece(num2, pChk)
            addPiece(num2, piece)
        }
        else {
            throw error 
        }
    },
    knight: (piece, num, num2) => {
        let spot = mtxCrds(num)
        let next = mtxCrds(num2)
        let spotVert = spot[0]
        let spotHorz = spot[1]
        let nextVert = next[0]
        let nextHorz = next[1]
        let pColor = color(piece[0])
        let nxtValue = cells[num2].className.slice(11)
        let nxtClr = color(nxtValue[0])
        let pChk = matrix[next[0]][next[1]]
        if (pColor === nxtClr) {
            throw error
        } else {
            if (nextHorz === spotHorz + 2 && spotVert + 1 === nextVert) {
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else if (nextHorz === spotHorz - 2 && spotVert + 1 === nextVert) {
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else if (nextHorz === spotHorz + 2 && spotVert - 1 === nextVert) {
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else if (nextHorz === spotHorz - 2 && spotVert - 1 === nextVert) {
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else if (nextVert === spotVert + 2 && spotHorz === nextHorz + 1) {
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else if (nextVert === spotVert + 2 && spotHorz === nextHorz - 1) {
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else if (nextVert === spotVert - 2 && spotHorz === nextHorz + 1) {
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else if (nextVert === spotVert - 2 && spotHorz === nextHorz - 1) {
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else {
                throw error 
            }
        }
    },
    queen:(piece, num, num2) => {
        let dg = num2 - num
        let pColor = color(piece[0])
        let queenVert = vertMoves(num,num2)
        let spot = mtxCrds(num)
        let next = mtxCrds(num2)
        let queenSide = sideways(spot[0],num2)
        let pChk = matrix[next[0]][next[1]]
        let nxtValue = cells[num2].className.slice(11)
        let nxtClr = color(nxtValue[0])
        let boxClr = cells[num].className.slice(0,5)
        let nxtBxClr = cells[num2].className.slice(0,5)
        let boxChk = boxClr === nxtBxClr
        let dgChk = dg % 7 === 0 || dg % 9 === 0
        if (pColor === nxtClr){
            throw error 
        }
        else {
            if (dgChk && boxChk){
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else if (queenSide){
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            } 
            else if (queenVert){
                removePiece(num2,pChk)
                addPiece(num2, piece)
                removePiece(num, piece)
            }
            else {
                throw error 
            }
        }
    },
    king:(piece,num,num2) => {
        let pColor = color(piece[0])
    }
}


let index
let piece
let nxtSpt
let blackTurn = false
let whiteTurn = true 
let check = false 

cells.map(function (box) {
    box.addEventListener('click', function () {
        if (piece) {
            nxtSpt = cells.indexOf(box)
            try {
                moves[piece.slice(2)](piece, index, nxtSpt)
            } catch (error) {
                console.log('invalid move')
            }
            piece = undefined
        }
        else if (piece === undefined && box.className.slice(11)) {
            piece = box.className.slice(11)
            index = cells.indexOf(box)
        }
    })
})