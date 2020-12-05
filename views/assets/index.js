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

const callEndpoint = async () => {
  try {
    const apiUrl = '/api/createTemplate';
    const forename = document.getElementById('forename').value;
    const surname = document.getElementById('surname').value;
    const payrollNumber = document.getElementById('payrollNumber').value;
    const cookie = document.getElementById('cookie').value;
    
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    const weekDropdown = document.getElementById('week');
    const selectedWeek = weekDropdown.options[weekDropdown.selectedIndex].value;
    console.log(selectedWeek)

    const visaDropdown = document.getElementById('visa');
    const visa = visaDropdown.options[visaDropdown.selectedIndex].value === 'YES' ? true : false;
    console.log(visa)

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        cookie, forename, surname, payrollNumber, selectedWeek, visa,
        username, password
      }),
      headers: {
        'content-type': 'application/json',
      }
    });
    const body = await response.json();
    const { workbookBase64, week } = body;

    if (!workbookBase64) return alert(body.message)

    const uri = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${workbookBase64}`;

    const downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = `${surname}, ${forename} Week ${week} - Timesheet.xlsx`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (err) {
    console.log(err);
  }
  
}