const prodSignalServerURL = 'https://signal.noop.live'; // move to .env
let devSignalServerURL = import.meta.env.VITE_DEV_SIGNAL_SERVER_URL; // value set in `/client/.env.local`
const RTC_CONFIG = JSON.parse(import.meta.env.VITE_RTC_CONFIG);

// const SIGNAL_SERVER_URL = import.meta.env.DEV ? devSignalServerURL : prodSignalServerURL;  // for dev 
const SIGNAL_SERVER_URL = prodSignalServerURL; // for live test


export { SIGNAL_SERVER_URL, RTC_CONFIG }