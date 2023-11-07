const SIGNAL_SERVER_URL = import.meta.env.VITE_DEV_SIGNAL_SERVER_URL; // value set in `/client/.env.local`

console.log(import.meta.env)
const RTC_CONFIG = import.meta.env.VITE_RTC_CONFIG 
  ? JSON.parse(import.meta.env.VITE_RTC_CONFIG) 
  : undefined;

export { SIGNAL_SERVER_URL, RTC_CONFIG };