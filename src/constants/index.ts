const prodSignalServerURL = 'https://signal.noop.live'; // move to .env
const devSignalServerURL = import.meta.env.VITE_DEV_SIGNAL_SERVER_URL; // value set in `/client/.env.local`

const RTC_CONFIG = import.meta.env.VITE_RTC_CONFIG 
  ? JSON.parse(import.meta.env.VITE_RTC_CONFIG) 
  : undefined;

const SIGNAL_SERVER_URL = import.meta.env.DEV 
  ? devSignalServerURL 
  : prodSignalServerURL;  // for dev 

export { SIGNAL_SERVER_URL, RTC_CONFIG };