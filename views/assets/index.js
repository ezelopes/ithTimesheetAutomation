const callEndpoint = async () => {
  try {
    const apiUrl = '/api/createTemplate';
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const cookie = document.getElementById('cookie').value;

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        cookie, username, password
      }),
      headers: {
        'content-type': 'application/json',
      }
    });
    const body = await response.json();


    const { workbookBase64, week } = body;
    const uri = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${workbookBase64}`;

    const downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = `Lopes, Ezequiel Week ${week} - Timesheet.xlsx`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (err) {
    console.log(err);
  }
  
}