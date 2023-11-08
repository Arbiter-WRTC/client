const SIGNAL_SERVER_URL = import.meta.env.VITE_DEV_SIGNAL_SERVER_URL; // value set in `/client/.env.local`

console.log(import.meta.env)
const RTC_CONFIG = import.meta.env.VITE_RTC_CONFIG 
  ? JSON.parse(import.meta.env.VITE_RTC_CONFIG) 
  : undefined;

// const SIGNAL_SERVER_URL = import.meta.env.DEV 
//   ? devSignalServerURL 
//   : prodSignalServerURL;  // for dev 

const API_STACK_URL = import.meta.env.VITE_API_STACK_URL;

export { SIGNAL_SERVER_URL, RTC_CONFIG, API_STACK_URL };