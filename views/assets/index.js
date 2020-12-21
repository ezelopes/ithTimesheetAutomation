const usernameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');
const getExcelBtn = document.getElementById('getExcelBtn');
const spinningItem = document.getElementById('spinningItem');
const buttonTxt = document.getElementById('buttonTxt');
const snackbar = document.getElementById("snackbar");

usernameElement.addEventListener('keydown', ({key}) => {
  if (key === 'Enter') return callEndpoint();
})

passwordElement.addEventListener('keydown', ({key}) => {
  if (key === 'Enter') return callEndpoint();
})

window.onload = function populateDropdown() {
  const firstSunday = new Date('09-06-2020');
  const today = new Date();
  const lastSunday = new Date(today.setDate(today.getDate()-today.getDay()));
  const currentWeek = Math.round((lastSunday - firstSunday) / (7 * 24 * 60 * 60 * 1000));

  const weekDropdown = document.getElementById('week');
  
  for (let i = 5; i < 52; i++) {
    const option = document.createElement("option");
    option.text = `Week ${i}`;
    option.value = i;
    weekDropdown.appendChild(option);
  }

  weekDropdown.value = currentWeek + 2;
};

const downloadFileProcess = (workbookBase64, week, forename, last_name) => {
  const uri = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${workbookBase64}`;

  const downloadLink = document.createElement('a');
  downloadLink.href = uri;
  downloadLink.download = `${last_name}, ${forename} Week ${week} - Timesheet.xlsx`;
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

const showToast = (message) => {
  snackbar.className = "show";
  snackbar.textContent = message; 
  setTimeout(function(){ snackbar.classList.remove('show'); }, 3500);
}

const callEndpoint = async () => {
  try {
    getExcelBtn.disabled = true;
    spinningItem.classList.remove('visually-hidden');
    buttonTxt.innerHTML = 'Loading...';

    const createTemplateApi = '/api/createTemplate';
    
    const username = usernameElement.value;
    const password = passwordElement.value;

    const weekDropdown = document.getElementById('week');
    const selectedWeek = weekDropdown.options[weekDropdown.selectedIndex].value;

    // if username missing, red border
    if (!username) {
      return usernameElement.classList.add('inputWrongStyle');
    } else { 
      usernameElement.classList.replace('inputWrongStyle', 'inputDefaultStyle');
    }

    // if psw missing, red border
    if (!password) {
      return passwordElement.classList.add('inputWrongStyle');
    } else { 
      passwordElement.classList.replace('inputWrongStyle', 'inputDefaultStyle');
    }

    const response = await fetch(createTemplateApi, {
      method: 'POST',
      body: JSON.stringify({ username, password, selectedWeek }),
      headers: { 'content-type': 'application/json' }
    });

    const body = await response.json();
    const { workbookBase64, week, forename, last_name } = body;

    if (!workbookBase64) throw new Error(body.message);

    downloadFileProcess(workbookBase64, week, forename, last_name);
    showToast('Download has started!');

  } catch (err) {
    showToast(err.message);
  } finally {
    document.getElementById('getExcelBtn').disabled = false;
    buttonTxt.innerHTML = 'GET EXCEL';
    spinningItem.classList.add('visually-hidden');
  }
  
}