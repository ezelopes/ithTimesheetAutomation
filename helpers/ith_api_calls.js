const qs = require('qs');
const axios = require('axios');

const getUserInfo = async (PHPSESSID, secondCookie, ITH_USER_INFO_ENDPOINT) => {

  const dataGetUserLoggedInDetails = qs.stringify({ action: 'getUserLoggedInDetails' })
  const headers = { 
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    cookie: `PHPSESSID=${PHPSESSID}; ZNPCQ003-31303700=${secondCookie};`
  };

  const responseUserID = await axios.post(ITH_USER_INFO_ENDPOINT, dataGetUserLoggedInDetails, headers);
  const userID = responseUserID.data.result ? responseUserID.data.result.id : 230;
  console.log(userID)
  
  const dataGetUserData = qs.stringify({ action: 'getUserData', user_id: userID });
  const responseUserData = await axios.post(ITH_USER_INFO_ENDPOINT, dataGetUserData, headers);
  console.log(responseUserData.data.result)

  return responseUserData;
}

const getShiftsAndWeekFromEndpoint = async (PHPSESSID, secondCookie, ITH_SHIFTS_ENDPOINT) => {
  const responseShifts = await axios.get(ITH_SHIFTS_ENDPOINT, {
    headers: {
      accept: '*/*',
      cookie: `PHPSESSID=${PHPSESSID}; ZNPCQ003-31303700=${secondCookie};`,
    },
  });

  return { week, shifts } = responseShifts.data;
}

const loginWithCredentials = async (username, password, ITH_LOGIN_ENDPOINT) => {

  const data = qs.stringify({ username: username, password: password });
  const headers = { 'content-type': 'application/x-www-form-urlencoded' };

  const loginResponse = await axios.post(ITH_LOGIN_ENDPOINT, data, headers);

  const responseCookies = loginResponse.headers['set-cookie'];
  const PHPSESSID = responseCookies[1].slice(10).split(';')[0]; 
  const secondCookie = responseCookies[2].slice(18).split(';')[0];

  return { PHPSESSID, secondCookie };
}

module.exports = { getShiftsAndWeekFromEndpoint, loginWithCredentials, getUserInfo };

// ith id
// fetch("https://ith.port.ac.uk/public/app/global/php/router.php", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en,it-IT;q=0.9,it;q=0.8,en-US;q=0.7,en-GB;q=0.6",
//     "cache-control": "no-cache",
//     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//     "pragma": "no-cache",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-requested-with": "XMLHttpRequest",
//     "cookie": "PHPSESSID=f13b3ngsuaf6p2j8tu129eg7dr; ZNPCQ003-31303700=02eee342"
//   },
//   "referrer": "https://ith.port.ac.uk/app/users/mydetails",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "action=getUserLoggedInDetails",
//   "method": "POST",
//   "mode": "cors"
// });

// user info
// fetch("https://ith.port.ac.uk/public/app/global/php/router.php", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en,it-IT;q=0.9,it;q=0.8,en-US;q=0.7,en-GB;q=0.6",
//     "cache-control": "no-cache",
//     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//     "pragma": "no-cache",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-requested-with": "XMLHttpRequest",
//     "cookie": "PHPSESSID=f13b3ngsuaf6p2j8tu129eg7dr; ZNPCQ003-31303700=02eee342"
//   },
//   "referrer": "https://ith.port.ac.uk/app/users/mydetails",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "action=getUserData&user_id=230",
//   "method": "POST",
//   "mode": "cors"
// });