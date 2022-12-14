const saving = document.querySelector("#saving");
const errors = document.querySelector("#errors");
const saveButton = document.querySelector("#save");
const visit = document.querySelector("#visit");
const success = document.querySelector(".success");
const copyToClipboard = document.querySelector("#copyToClipboard");
const pagesDiv = document.querySelector(".pages")
const clearPagesButton = document.querySelector('#clearPages');


saving.style.display = "none";
success.style.display = "none";
errors.style.display = "none";
pagesDiv.style.display = "none";


function createNewPageFragment( {savedUrl, archiveLink, date }){

  var link = document.createElement('a');
  link.innerText = savedUrl;
  link.setAttribute('href', savedUrl);
  link.setAttribute('target', '_blank');

  var copyButton = document.createElement('button');
  copyButton.classList.add('btn', 'btn-copy')
  copyButton.innerText = 'Copy';
  copyButton.addEventListener('click', async () => {
    navigator.clipboard.writeText(archiveLink);
  })

  var dateLabel = document.createElement('label');
  dateLabel.classList.add('dateLabel')
  dateLabel.innerText = `${new Date(date).toLocaleString("de-de")}`;
 
  var page = document.createElement('div');
  page.className = "savedPage"

  var savedPageFragment = document.createDocumentFragment();
  page.appendChild(link);
  page.appendChild(copyButton);
  page.appendChild(dateLabel);
  savedPageFragment.appendChild(page);

  return savedPageFragment;
}


function handleResponse(response) {
  console.log(response);
  saving.style.display = "none";
  if(response.url){
    redirectUrl = response.url;
    success.style.display = "block";
  }
  else if(response.error){
    errors.style.display = "block";
    errors.textContent = response.error;
  }
}

const handleSubmit = () => {
  saving.style.display = "block";
  errors.style.display = "none";
  success.style.display= "none";

  browser.runtime.sendMessage({action: "save"}).then(handleResponse);
};

const handleCopyToClipboard = async () => {
  navigator.clipboard.writeText(redirectUrl);
}

const handleVisit = async () => {
  window.open(redirectUrl, "_blank");
}

function updateSavedPagesList() {
  browser.storage.local.get('savedPages').then(function (result) {
    var savedPages = [];
    if (result['savedPages']) {
      savedPages = result['savedPages'];
    }
    savedPages.sort(function(pageA, pageB){return pageB.date - pageA.date});
    
    if(savedPages.length > 0)
      pagesDiv.style.display = "block";
    else
    pagesDiv.style.display = "none";

    pagesDiv.innerHTML = '';
    savedPages.forEach(page => {
      const child = createNewPageFragment(page);
      pagesDiv.appendChild(child);
    });
  });
}

const handleClearPages  = () => {
  browser.runtime.sendMessage({action: "clear"});
}

saveButton.addEventListener("click", e => handleSubmit(e));
clearPagesButton.addEventListener("click", () => handleClearPages())
copyToClipboard.addEventListener("click", () => handleCopyToClipboard())
visit.addEventListener("click", () => handleVisit());
browser.storage.local.onChanged.addListener(updateSavedPagesList);
updateSavedPagesList();