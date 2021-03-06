require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const { buildExcelFile } = require('./helpers/timesheetCalculations')
const { getShiftsAndWeekFromEndpoint, loginWithCredentials, getUserInfo } = require('./helpers/ith_api_calls')

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

  try {
    const { username, password, selectedWeek } = req.body;
 
    const  ITH_SHIFTS_ENDPOINT = process.env.ITH_SHIFTS_ENDPOINT + `?week=${selectedWeek}`;
    // if (selectedWeek) ITH_SHIFTS_ENDPOINT += `?week=${selectedWeek}`
   
    const { PHPSESSID, secondCookie } = await loginWithCredentials(username, password, process.env.ITH_LOGIN_ENDPOINT);
    console.table({PHPSESSID, secondCookie });

    const { week, shifts } = await getShiftsAndWeekFromEndpoint(PHPSESSID, secondCookie, ITH_SHIFTS_ENDPOINT);
    const { forename, last_name, payroll, visa } = await getUserInfo(PHPSESSID, secondCookie, process.env.ITH_USER_INFO_ENDPOINT);

    const workbookBase64 = await buildExcelFile(week, shifts, forename, last_name, payroll, visa);
    res.status(200).send({ workbookBase64, week, forename, last_name });

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Wrong Credentials. Try again!' });
  }
})

app.listen(PORT, () => { console.log(`Listening on http://localhost:${PORT}`) })