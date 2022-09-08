const baseUrl = "https://web.archive.org/save/";
const saving = document.querySelector("#saving");
const saved = document.querySelector("#saved");
const errors = document.querySelector("#errors");
const saveButton = document.querySelector("#save");
const visit = document.querySelector("#visit");
const success = document.querySelector(".success");
const copyToClipboard = document.querySelector("#copyToClipboard");

saving.style.display = "none";
success.style.display = "none";
errors.style.display = "none";

var redirectUrl = "";

const savePage = async url => {
  saving.style.display = "block";
  try {
    const response = await fetch(`${baseUrl}${url}`);

    saving.style.display = "none";

    if(response.status == 200){
      visit.setAttribute("href", response.url);
      redirectUrl = response.url;
      success.style.display = "block";
    }
    else {
      errors.style.display = "block";
      errors.textContent = "Could not save page";
    }

  } catch (error) {
    saving.style.display = "none";
    errors.style.display = "block";
    errors.textContent = "Could not save page";
  }
}

const getCurrentUrl = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
};

const handleSumbit = async () => {
  const url = await getCurrentUrl();
  savePage(url);
};


const handleCopyToClipboard = async () => {
  navigator.clipboard.writeText(redirectUrl);
}

const handleVisit = async () => {
  window.open(redirectUrl, "_blank");
}

saveButton.addEventListener("click", e => handleSumbit(e));
copyToClipboard.addEventListener("click", () => handleCopyToClipboard())
visit.addEventListener("click", () => handleVisit());