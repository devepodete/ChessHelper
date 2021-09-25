const move_made = "move_made";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
       name: "Jack"
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: ["./foreground.css"]
        })
        .then(() => {
            console.log("INJECTED FOREGROUND STYLES");
            
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: ["./foreground.js"]
            })
                .then(() => {
                    console.log("INJECTED FOREGROUND");
                })
        })
        .catch(err => console.log(err));
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_name') {
        chrome.storage.local.get('name', data => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    message: 'fail'
                });
                return;
            }
            sendResponse({
                message: 'success',
                payload: data.name
            });
        });
        
        return true;
    } else if(request.message === 'change_name') {
        console.log('change event');
        chrome.storage.local.set({
            name: request.payload
        }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({message: 'fail'});
                return;
            }
            
            sendResponse({message: 'success'});
        })
        
        return true;
    } else if (request.message === move_made) {
        //console.log(request.message);
        //console.log(request.payload);

        fetch('http://localhost:9090', {
            method: 'POST',
            body: request.payload
        }).then((response) => {
            console.log('got response from python: ' + response.status);
            response.text().then((txt) => {
                sendResponse(txt);
            });    
        });
  
        return true;
    }
});
