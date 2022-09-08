const baseUrl = "https://web.archive.org/save/";

const getCurrentUrl = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await browser.tabs.query(queryOptions);
  return tab.url;
};

const sendError = (error) => new Promise((resolve) => {
  resolve({ error: error });
});

async function popupMsgReceived(msg, sender, sendRes) {
  console.log("Msg received", msg);

  let url = await getCurrentUrl();
  try {
    const response = await fetch(`${baseUrl}${url}`);
    console.log(response);

    if(response.ok){
      return new Promise((resolve) => {
        resolve({url: response.url});
      });
    }
    else{
      return sendError("Could not be saved");
    }


  } catch (error) {
    console.log(error);
    return sendError(error);
  }
        

}



browser.runtime.onMessage.addListener(popupMsgReceived);