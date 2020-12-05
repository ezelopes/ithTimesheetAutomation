const axios = require('axios');

const getShiftsAndWeekFromEndpoint = async (PHPSESSID, ITH_SHIFTS_ENDPOINT) => {
  const responseShifts = await axios.get(ITH_SHIFTS_ENDPOINT, {
    headers: {
      accept: '*/*',
      cookie: `PHPSESSID=${PHPSESSID}; ZNPCQ003-31303700=c283e8c3;`,
    },
  });

  const { week, shifts } = responseShifts.data;
  
  return { week, shifts };
}

const loginWithCredentials = async (username, password, ITH_LOGIN_ENDPOINT) => {

  const loginResponse = await axios.post(ITH_LOGIN_ENDPOINT, {
    'headers': {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'en,it-IT;q=0.9,it;q=0.8,en-US;q=0.7,en-GB;q=0.6',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded',
      'pragma': 'no-cache',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    'referrer': 'https://ith.port.ac.uk/',
    'referrerPolicy': 'strict-origin-when-cross-origin',
    'body': `username=${username}&password=${password}`,
    'method': 'POST',
    'mode': 'cors'
  });

  const responseCookies = loginResponse.headers['set-cookie'];
  const PHPSESSID = responseCookies[1].slice(10).split(';')[0]; 

  return PHPSESSID;
}

module.exports = { getShiftsAndWeekFromEndpoint, loginWithCredentials };