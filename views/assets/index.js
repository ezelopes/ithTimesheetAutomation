const inputPswElement = document.getElementById('username');
inputPswElement.addEventListener('keydown', ({key}) => {
  if (key === 'Enter') return callEndpoint();
})

const inputNameElement = document.getElementById('password');
inputNameElement.addEventListener('keydown', ({key}) => {
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

const getExcelBtn = document.getElementById('getExcelBtn');
const spinningItem = document.getElementById('spinningItem');
const buttonTxt = document.getElementById('buttonTxt');

const callEndpoint = async () => {
  try {
    getExcelBtn.disabled = true;
    spinningItem.classList.remove('visually-hidden');
    buttonTxt.innerHTML = 'Loading...';

    const apiUrl = '/api/createTemplate';
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const weekDropdown = document.getElementById('week');
    const selectedWeek = weekDropdown.options[weekDropdown.selectedIndex].value;
    console.log(selectedWeek)

    // if username missing, red border
    // if psw missing, red border

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        username, password, selectedWeek
      }),
      headers: {
        'content-type': 'application/json',
      }
    });
    const body = await response.json();
    const { workbookBase64, week, forename, last_name } = body;

    if (!workbookBase64) throw new Error(body.message);

    const uri = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${workbookBase64}`;

    const downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = `${last_name}, ${forename} Week ${week} - Timesheet.xlsx`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    

  } catch (err) {
    alert(err.message);    
  } finally {
    document.getElementById('getExcelBtn').disabled = false;
    buttonTxt.innerHTML = 'GET EXCEL';
    spinningItem.classList.add('visually-hidden');
  }
  
}