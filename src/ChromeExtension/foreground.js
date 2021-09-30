const chess_site = 'lichess';
const move_table = 'move_box_name'

const data = {
  ['lichess']: {
      [move_table]: 'l4x'
  }
};

const moveLocalName = 'u8t';
const move_made = 'move_made';

var board = document.querySelector('#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board');
var ranks = document.querySelector('#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board > div > cg-container > coords.ranks');
var files = document.querySelector('#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board > div > cg-container > coords.files');

var orientationDiv = document.querySelector('#main-wrap > main > div.round__app.variant-standard > div.round__app__board.main-board > div');
var orientation = null;


if (orientationDiv) {
    if (orientationDiv.className.search('black') != -1) {
        orientation = 'black';
    } else {
        orientation = 'white';
    }
    console.log('orientation:', orientation);
}


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

    console.log('l, r, t, b:', left, right, top, bottom);
    console.log('sh, sw', squareHeight, squareWidth);

    if (orientation === 'white') {
        x = left + (charInt - 'a'.charCodeAt(0)) * squareWidth;
        y = bottom - (numInt) * squareHeight;
    } else {
        x = right - (charInt - 'a'.charCodeAt(0) + 1) * squareWidth;
        y = top + (numInt - 1) * squareHeight;
    }

    return [x + squareWidth / 4, y + squareHeight / 4];
}

var activeCircles = []


const callback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const addedNode = mutation.addedNodes[0];
            if (addedNode != null) {
                var move = null;
                if (addedNode.localName === moveLocalName) {
                    move = addedNode.innerText;
                } else if (addedNode.localName === data[chess_site][move_table]) {
                    move = addedNode.innerText.split('\n')[1];
                }

                if (move == null) {
                    continue;
                }

                chrome.runtime.sendMessage({
                    message: move_made,
                    payload: move
                }, response => {
                    console.log('[backend]:', response);

                    activeCircles.forEach((el) => {el.remove()});
                    activeCircles = [];

                    if (board != null) {
                        const m = parseMoveString(response);

                        for (let i = 0; i <= 2; i += 2) {
                            const circle = document.createElement('DIV');
                            circle.classList.add('ce_circle');
                            
                            const p = getCircleCoords(m[i], m[i+1]);
                            console.log('circle cords:', p);

                            circle.style['width'] = squareWidth / 2 + 'px';
                            circle.style['height'] = squareHeight / 2 + 'px';
                            circle.style['left'] = p[0] + 'px';
                            circle.style['top'] = p[1] + 'px';

                            activeCircles.push(document.querySelector('body').appendChild(circle));
                        }
                    }
                });
            }
        }
    }
};



const moveBox = document.querySelector('#main-wrap > main > div.round__app.variant-standard > rm6');
const config = { attributes: true, childList: true, subtree: true };


const observer = new MutationObserver(callback);
if (moveBox) {
    console.log('Move box found');
    observer.observe(moveBox, config);
}

    

