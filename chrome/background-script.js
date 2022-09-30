const baseUrl = "https://web.archive.org/save/";

const getCurrentUrl = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
};

function saveInBrowserStorage(storageRequest, response) {
  var savedPages = [];
  storageRequest.then((result) => {
    if('savedPages' in result){
      savedPages = result['savedPages'];
    }
    const re = /https:\/\/web.archive.org\/web\/[0-9]*\/(.*)/i;
    const found = response.url.match(re);
    const savedUrl = found[1];
    savedPages.push({'savedUrl':savedUrl, 'archiveLink': response.url, 'date': Date.now()});
    chrome.storage.local.set({ 'savedPages': savedPages });
  })
}

const clearPages = () => {
  chrome.storage.local.clear();
}

const savePage = (sendResponse) => {
  const urlRequest = getCurrentUrl();
  urlRequest.then((url) => {
    const saveRequest = fetch(`${baseUrl}${url}`);
    saveRequest.then((response => {
      if(response.ok){
        try {
          var storageRequest =  chrome.storage.local.get('savedPages');
          saveInBrowserStorage(storageRequest, response);
  
        } catch (error) {
          sendResponse({error: "Problem saving the url in browser storage!"});
        }
        sendResponse({url: response.url})
      }
      else{
          sendResponse({error: "No Reason to save this page!"});
      }
    })).catch((err) => {
      console.log(err);
      sendResponse({error: "Problem reaching archive.org!"});
    });
  })
  .catch((err) => {
    sendResponse({error: "Couldn't get current tab url!"});
  })
}

function popupMsgReceived(request, sender, sendResponse) {

  if(request.action == "save"){
    savePage(sendResponse);
  }
  else if(request.action == "clear"){
    clearPages();
  }
  return true;
}


chrome.runtime.onMessage.addListener(popupMsgReceived);