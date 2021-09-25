const chess_site = "lichess";
const move_table = "move_box_name"

const data = {
  ["lichess"]: {
      [move_table]: "l4x"
  }
};

const moveLocalName = "u8t";

const move_made = "move_made";

const ce_main_container = document.createElement('DIV');
const ce_name = document.createElement('DIV');
const ce_input = document.createElement('INPUT');
const ce_button = document.createElement('DIV');

ce_main_container.classList.add('ce_main');
ce_name.id = 'ce_name';
ce_input.id = 'ce_input';
ce_button.id = 'ce_button';

ce_name.innerHTML = `Hello NAME`;
ce_button.innerHTML = `Change name`;

ce_main_container.appendChild(ce_name);
ce_main_container.appendChild(ce_input);
ce_main_container.appendChild(ce_button);

// document.querySelector('body').appendChild(ce_main_container);

chrome.runtime.sendMessage({message: 'get_name'}, response => {
   if (response.message === 'success') {
       ce_name.innerHTML = `Hello ${response.payload}`;
   }
});

ce_button.addEventListener('click', () => {
    chrome.runtime.sendMessage({
            message: 'change_name',
            payload: ce_input.value
        }, response => {
            if (response.message === 'success') {
               ce_name.innerHTML = `Hello ${ce_input.value}`;
            }
        });
});



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
                    console.log('[backend]: ', response);
                });
            }
        }
    }
};



const moveBox = document.querySelector("#main-wrap > main > div.round__app.variant-standard > rm6");
const config = { attributes: true, childList: true, subtree: true };


const observer = new MutationObserver(callback);
if (moveBox) {
    console.log('Move box found [1/2]');
    observer.observe(moveBox, config);

    // const moveList = moveBox.querySelector(data[chess_site][move_table]);
    // if (moveList) {
    //     console.log('Move list found [2/2]');
    //     observer.observe(moveList, config);
    // }
}