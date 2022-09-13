const saving = document.querySelector("#saving");
const errors = document.querySelector("#errors");
const saveButton = document.querySelector("#save");
const visit = document.querySelector("#visit");
const success = document.querySelector(".success");
const copyToClipboard = document.querySelector("#copyToClipboard");
const pagesDiv = document.querySelector(".pages")


saving.style.display = "none";
success.style.display = "none";
errors.style.display = "none";


function createNewPageFragment(url){

  const re = /https:\/\/web.archive.org\/web\/[0-9]*\/(.*)/i;
  const found = url.match(re);

  var link = document.createElement('a');
  link.innerText = found[1];
  link.setAttribute('href', url);
  link.setAttribute('target', '_blank');

  var copyButton = document.createElement('button');
  copyButton.classList.add('btn', 'btn-copy')
  copyButton.innerText = 'Copy';
  copyButton.addEventListener('click', async () => {
    navigator.clipboard.writeText(url);
  })

  var page = document.createElement('div');
  page.className = "savedPage"

  var savedPageFragment = document.createDocumentFragment();
  page.appendChild(link);
  page.appendChild(copyButton);
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

const handleSumbit = () => {
  saving.style.display = "block";
  errors.style.display = "none";
  success.style.display= "none";

  browser.runtime.sendMessage({
    action: "save"
  }).then(handleResponse);
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
    pagesDiv.innerHTML = '';
    savedPages.forEach(page => {
      const child = createNewPageFragment(page);
      pagesDiv.appendChild(child);
    });

  });
}

saveButton.addEventListener("click", e => handleSumbit(e));
copyToClipboard.addEventListener("click", () => handleCopyToClipboard())
visit.addEventListener("click", () => handleVisit());
browser.storage.local.onChanged.addListener(updateSavedPagesList);
updateSavedPagesList();