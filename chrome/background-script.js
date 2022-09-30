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
    console.log(result, 'result');
    if('savedPages' in result)
      savedPages = result['savedPages'];
    savedPages.push(response.url);
    console.log(savedPages, 'savedPages');
    chrome.storage.local.set({ 'savedPages': savedPages });
  })
}


function popupMsgReceived(request, sender, sendResponse) {
  console.log("entered function");

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
        if(response.statusText == 'No Reason Phrase')
          sendResponse({error: 'This url is a page saved on archive.org!'});
        else
          sendResponse({error: response.statusText});
      }
    }));
  })
  return true;
}


chrome.runtime.onMessage.addListener(popupMsgReceived);