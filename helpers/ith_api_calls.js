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

module.exports = { getShiftsAndWeekFromEndpoint };