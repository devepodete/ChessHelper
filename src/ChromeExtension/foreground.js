const supported_sites = ['lichess.org'];
const lichess = 'lichess';


const href = window.location.href;
var current_chess_site = null;

for (const site of supported_sites) {
    if (href.indexOf(site) != -1) {
        current_chess_site = site.split('.')[0];
        break;
    }
}

const Color = Object.freeze({
    WHITE: Symbol("white"),
    BLACK: Symbol("black")
});


const chess_board_name = 'chess_board_name';
const move_table_name = 'move_table_name';
const move_table_placeholder_name = 'move_table_placeholder_name';

console.log('href:', href);
console.log('current_chess_site:', current_chess_site);


const selectors = {
    [chess_board_name]: {
        [lichess]: '#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board',
    },
    [move_table_name]: {
        [lichess]: '#main-wrap > main > div.round__app.variant-standard > rm6',
    },
    [move_table_placeholder_name]: {
        [lichess]: 'l4x',
    }
}

function getPlayerColor() {
    switch (current_chess_site) {
        case 'lichess':
            var orientationDiv = document.querySelector('#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board > div');
            if (orientationDiv) {
                if (orientationDiv.className.search('black') != -1) {
                    return Color.BLACK;
                }
                return Color.WHITE;
            }    
            break;
    }

    return null;
}

var orientation = getPlayerColor();
console.log('orientation:', orientation);

const moveLocalName = 'u8t';
const move_made = 'move_made';

var board = document.querySelector(selectors[chess_board_name][current_chess_site]);
var ranks = document.querySelector('#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board > div > cg-container > coords.ranks');
var files = document.querySelector('#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board > div > cg-container > coords.files');

function parseMoveString(moveString) {
    const pos1letter = moveString[0];
    const pos1number = moveString[1];
    const pos2letter = moveString[2];
    const pos2number = moveString[3];

    return [pos1letter, pos1number, pos2letter, pos2number];
}


var squareWidth = 10;
var squareHeight = 10;

function getCircleCoords(moveLetter, moveNumber) {
    if (board == null) {
        return null;
    }

    const boardRect = board.getBoundingClientRect();
    const left = boardRect.left;
    const right = boardRect.right;
    const top = boardRect.top;
    const bottom = boardRect.bottom;

    squareWidth = (right - left) / 8; 
    squareHeight = (bottom - top) / 8; 

    var x, y;

    const charInt = moveLetter.charCodeAt(0);
    const numInt = parseInt(moveNumber);

    if (orientation === Color.WHITE) {
        x = left + (charInt - 'a'.charCodeAt(0)) * squareWidth;
        y = bottom - (numInt) * squareHeight;
    } else {
        x = right - (charInt - 'a'.charCodeAt(0) + 1) * squareWidth;
        y = top + (numInt - 1) * squareHeight;
    }

    return [x + squareWidth / 4, y + squareHeight / 4];
}

function createCircle(x, y, radius) {
    var circle = document.createElement('DIV');
    circle.classList.add('ce_circle');

    circle.style['width'] = radius + 'px';
    circle.style['height'] = radius + 'px';
    circle.style['left'] = x + 'px';
    circle.style['top'] = y + 'px';

    return circle;
}


var activeCircles = [];

const callback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const addedNode = mutation.addedNodes[0];
            if (addedNode != null) {
                var move = null;
                if (addedNode.localName === moveLocalName) {
                    move = addedNode.innerText;
                } else if (addedNode.localName === selectors[move_table_placeholder_name][current_chess_site]) {
                    move = addedNode.innerText.split('\n')[1];
                }

                if (move == null) {
                    continue;
                }

                const moves = document.querySelector(selectors[move_table_name][current_chess_site]);
                var allMoves = '\n';
                var moveCount = 0;
                if (moves) {
                    const moveList = moves.getElementsByTagName(selectors[move_table_placeholder_name][current_chess_site]);
                    if (moveList && moveList[0]) {
                        for (const el of moveList[0].children) {
                            if (el.localName === 'u8t') {
                                allMoves += el.innerText + '\n';
                                moveCount++;
                            }
                        }
                    }
                }

                const msg = allMoves + moveCount;

                chrome.runtime.sendMessage({
                    message: move_made,
                    payload: msg
                }, response => {
                    console.log('[backend]:', response);

                    activeCircles.forEach((el) => {el.remove()});
                    activeCircles = [];

                    const m = parseMoveString(response);

                    for (let i = 0; i <= 2; i += 2) {                            
                        const p = getCircleCoords(m[i], m[i+1]);
                        const circle = createCircle(p[0], p[1], squareWidth / 2);

                        activeCircles.push(document.querySelector('body').appendChild(circle));
                    }
            });
            }
        }
    }
};



const moveBox = document.querySelector(selectors[move_table_name][current_chess_site]);
const config = { attributes: true, childList: true, subtree: true };


const observer = new MutationObserver(callback);
if (moveBox && board) {
    console.log('Move box found');
    observer.observe(moveBox, config);
}
