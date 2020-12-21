const qs = require('qs');
const axios = require('axios');

const getUserInfo = async (PHPSESSID, secondCookie, ITH_USER_INFO_ENDPOINT) => {

  try {
    const headers = { 'content-type': 'application/x-www-form-urlencoded', cookie: `PHPSESSID=${PHPSESSID}; ZNPCQ003-31303700=${secondCookie};` }
    const dataGetUserID = qs.stringify({ action: 'getUserLoggedInDetails'});
  
    const options = {
      method: 'POST',
      headers: headers,
      data: dataGetUserID,
      url: ITH_USER_INFO_ENDPOINT,
    };

    const responseUserID = await axios(options);
    const userID = responseUserID.data.result.id;
    console.log(userID);
    
    const dataGetUserData = qs.stringify({ action: 'getUserData', user_id: userID });
    options.data = dataGetUserData;
    const responseUserData = await axios(options);
  
    const userInfo = responseUserData.data.result.user.data[0];
    const visa = responseUserData.data.result.visa.data; // double check with someone
    const { first_name, middle_name, last_name, payroll } = userInfo;
    console.log({ first_name, middle_name, last_name, payroll });
    console.log(visa);
  
    const forename = first_name + ' ' + middle_name;
  
    return { forename, last_name, payroll, visa };
  } catch (err) {
    console.log(err);
  }
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