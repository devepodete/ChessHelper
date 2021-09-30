const working_port = '9092';
const move_made = 'move_made';
const switch_state = 'switch_state';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
       isActive: true
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === switch_state) {
        chrome.storage.local.get('isActive', (data) => {
            chrome.storage.local.set({isActive: !data.isActive});

            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {message: switch_state, state: !data.isActive});
            });
        });
    }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: ['./foreground.css']
        })
        .then(() => {
            console.log('INJECTED FOREGROUND STYLES');
            
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: ['./foreground.js']
            })
            .then(() => {
                console.log('INJECTED FOREGROUND');
            })
        })
        .catch(err => console.log(err));
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === move_made) {
        fetch('http://localhost:' + working_port, {
            method: 'POST',
            body: request.payload
        })
        .then((response) => {
            response.text().then((txt) => {
                sendResponse(txt);
            });
        });
  
        return true;
    }
});
