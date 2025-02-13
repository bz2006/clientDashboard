import moment from "moment-timezone";

export const DateTimeFRMT=(date,time)=>{
   return (moment(date+time, 'DDMMYYHHmmss').format('MMM DD, YYYY, hh:mm A'))
}