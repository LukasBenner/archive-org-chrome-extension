const saving = document.querySelector("#saving");
const errors = document.querySelector("#errors");
const saveButton = document.querySelector("#save");
const visit = document.querySelector("#visit");
const success = document.querySelector(".success");
const copyToClipboard = document.querySelector("#copyToClipboard");


saving.style.display = "none";
success.style.display = "none";
errors.style.display = "none";


// const savePage = async url => {
//   saving.style.display = "block";
//   try {
    

//     saving.style.display = "none";

//     if(response.status == 200){
//       visit.setAttribute("href", response.url);
//       redirectUrl = response.url;
//       success.style.display = "block";
//     }
//     else {
//       errors.style.display = "block";
//       errors.textContent = "Could not save page";
//     }

//   } catch (error) {
//     saving.style.display = "none";
//     errors.style.display = "block";
//     errors.textContent = "Could not save page";
//   }
// }

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

saveButton.addEventListener("click", e => handleSumbit(e));
copyToClipboard.addEventListener("click", () => handleCopyToClipboard())
visit.addEventListener("click", () => handleVisit());