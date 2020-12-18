const qs = require('qs');
const axios = require('axios');

const getUserInfo = async (PHPSESSID, secondCookie, ITH_USER_INFO_ENDPOINT) => {

  const dataGetUserID = qs.stringify({ action: 'getUserLoggedInDetails' })
  const headers = { 'content-type': 'application/x-www-form-urlencoded', cookie: `PHPSESSID=${PHPSESSID}; ZNPCQ003-31303700=${secondCookie};` };

  const responseUserID = await axios.post(ITH_USER_INFO_ENDPOINT, dataGetUserID, headers);
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