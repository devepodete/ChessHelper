var switchState = document.getElementsByClassName('button')[0];

function setButton(state) {
	if (state) {
		switchState.children[0].innerText = 'Enabled';
		switchState.style.backgroundColor = '1baca6';
	} else {
		switchState.children[0].innerText = 'Disabled';
		switchState.style.backgroundColor = 'a4a4a4';
	}
}

var curState = true;

chrome.storage.local.get('isActive', (data) => {
	curState = data.isActive;
    setButton(curState);
});


switchState.onclick = (element) => {
	chrome.runtime.sendMessage({message: 'switch_state'});
	curState = !curState;
	setButton(curState);
};