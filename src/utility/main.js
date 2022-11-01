import { Timestamp } from "firebase/firestore";
import moment from "moment";
import "jquery";

export function runHeaderControl() {
  $(window).scroll(function () {
    var $w = $(this),
      st = $w.scrollTop(),
      navbar = $(".js-navbar"),
      sd = $(".js-scroll-wrap");

    if (st > 150) {
      if (!navbar.hasClass("scrolled")) {
        navbar.addClass("scrolled");
      }
    }
    if (st < 150) {
      if (navbar.hasClass("scrolled")) {
        navbar.removeClass("scrolled sleep");
      }
    }
    if (st > 350) {
      if (!navbar.hasClass("awake")) {
        navbar.addClass("awake");
      }

      if (sd.length > 0) {
        sd.addClass("sleep");
      }
    }
    if (st < 350) {
      if (navbar.hasClass("awake")) {
        navbar.removeClass("awake");
        navbar.addClass("sleep");
      }
      if (sd.length > 0) {
        sd.removeClass("sleep");
      }
    }
  });
}
export function formatDate(jsdate) {
  const aMoment = moment(jsdate);
  return aMoment.format("DD / MM / YYYY");
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
