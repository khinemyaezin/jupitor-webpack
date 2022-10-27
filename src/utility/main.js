import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

export function runHeaderControl() {
  document.addEventListener("scroll", (e) => {
    if (document.documentElement.scrollTop == 0) {
      $(".header").removeClass("header-small header-shadow");
    } else {
      $(".header").addClass("header-small header-shadow");
    }
  });
}
export function formatDate(jsdate) {
  const aMoment = moment(jsdate);
  return aMoment.format("DD MM YYYY");
}

export function getStartOfDay(date) {
  let myDate = date;
  myDate.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(myDate);
}

export function getEndOfDay(date) {
  let myDate = date;
  myDate.setHours(23, 59, 59, 999);
  return Timestamp.fromDate(myDate);
}