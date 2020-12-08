require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const { buildExcelFile } = require('./helpers/timesheetCalculations')
const { getShiftsAndWeekFromEndpoint, loginWithCredentials } = require('./helpers/ith_api_calls')

const PORT = parseInt(process.env.PORT) || 8055;
const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('index.html');
});

app.post('/api/createTemplate', async (req, res) => {

  const {
     cookie, forename, surname, payrollNumber, selectedWeek, visa,
     username, password
   } = req.body;

  let ITH_SHIFTS_ENDPOINT = process.env.ITH_SHIFTS_ENDPOINT;
  if (selectedWeek) ITH_SHIFTS_ENDPOINT += `?week=${selectedWeek}`
  
  const { PHPSESSID, secondCookie } = await loginWithCredentials(username, password, process.env.ITH_LOGIN_ENDPOINT);

  // const token = cookie ? cookie : PHPSESSID;
  // console.table({PHPSESSID, cookie, token });

  const { week, shifts } = await getShiftsAndWeekFromEndpoint(PHPSESSID, secondCookie, ITH_SHIFTS_ENDPOINT);
  
  if (week) { 
    const workbookBase64 = await buildExcelFile(week, shifts, forename, surname, payrollNumber, visa);
    res.send({ workbookBase64, week });
  } else res.send({ message: 'Invalid Cookie!' })
})

app.listen(PORT, () => { console.log(`Listening on http://localhost:${PORT}`) })