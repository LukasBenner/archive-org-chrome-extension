const baseUrl = "https://web.archive.org/save/";

const getCurrentUrl = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await browser.tabs.query(queryOptions);
  return tab.url;
};

function saveInBrowserStorage(storageRequest, response) {
  var savedPages = [];
  storageRequest.then((result) => {
    console.log(result, 'result');
    if('savedPages' in result){
      savedPages = result['savedPages'];
    }
    const re = /https:\/\/web.archive.org\/web\/[0-9]*\/(.*)/i;
    const found = response.url.match(re);
    const savedUrl = found[1];
    savedPages.push({'savedUrl':savedUrl, 'archiveLink': response.url, 'date': Date.now()});
    console.log(savedPages, 'savedPages');
    browser.storage.local.set({ 'savedPages': savedPages });
  })
}

const sendError = (error) => new Promise((resolve) => {
  resolve({ error: error });
});

const sendResponse = (response) => new Promise((resolve) => {
  resolve({url: response.url})
})

async function popupMsgReceived() {
  const url = await getCurrentUrl();
  try {
    const response = await fetch(`${baseUrl}${url}`);
    console.log(response);

    if(response.ok){
      try {
        var storageRequest =  browser.storage.local.get('savedPages');
        saveInBrowserStorage(storageRequest, response);

      } catch (error) {
        return sendError("Problem saving the url in browser storage!")
      }
      return sendResponse({url: response.url})
    }
    else{
      if(response.statusText == 'No Reason Phrase')
        return sendError('This url is a page saved on archive.org!');
      else
        return sendError(response.statusText);
    }
  } catch (error) {
    console.log(error);
    return sendError("Problem reaching archive.org!");
  }
}


browser.runtime.onMessage.addListener(popupMsgReceived);