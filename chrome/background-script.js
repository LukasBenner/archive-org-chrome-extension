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


async function popupMsgReceived(request, sender, sendResponse) {
  const url = await getCurrentUrl();
  try {
    const response = await fetch(`${baseUrl}${url}`);
    console.log(response);

    if(response.ok){
      try {
        var storageRequest =  chrome.storage.local.get('savedPages');
        saveInBrowserStorage(storageRequest, response);

      } catch (error) {
        sendResponse({error: "Problem saving the url in browser storage!"});
      }
      return Promise.resolve({url: response.url});
    }
    else{
      if(response.statusText == 'No Reason Phrase')
        sendResponse({error: 'This url is a page saved on archive.org!'});
      else
        sendResponse({error: response.statusText});
    }
  } catch (error) {
    console.log(error);
    sendResponse({error: "Problem reaching archive.org!"});
  }
  return true;
}


chrome.runtime.onMessage.addListener(popupMsgReceived);