const working_port = '9092';
const move_made = 'move_made';


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
            console.log('got response from python: ' + response.status);
            response.text().then((txt) => {
                sendResponse(txt);
            });
        });
  
        return true;
    }
});
