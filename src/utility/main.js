import { Timestamp } from "firebase/firestore";
import moment from "moment";
import "jquery";
import StorageQuery from "./storage-query";

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

/**
 *
 * @param { Date } jsdate
 * @returns string
 */
export function formatDate(jsdate) {
  const aMoment = moment(jsdate);
  return aMoment.format("DD/MM/YYYY");
}

/**
 *
 * @param { Date } date
 * @returns { Timestamp }
 */
export function getStartOfDay(date) {
  let myDate = date;
  myDate.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(myDate);
}

/**
 *
 * @param { Date } date
 * @returns { Timestamp }
 */
export function getEndOfDay(date) {
  let myDate = date;
  myDate.setHours(23, 59, 59, 999);
  return Timestamp.fromDate(myDate);
}
/**
 *
 * @param {File} f
 * @returns { Promise<string|null>}
 */
export function readFile(f) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });
}
/**
 *
 * @param { number } _size
 * @returns {string}
 */
export function getFileSize(_size) {
  var fSExt = new Array("Bytes", "KB", "MB", "GB"),
    i = 0;
  while (_size > 900) {
    _size /= 1024;
    i++;
  }
  return Math.round(_size * 100) / 100 + " " + fSExt[i];
}
/**
 *
 * @param { File } file
 * @returns string
 */
export function getFileNameWithExt(file) {
  const name = file.name;
  const lastDot = name.lastIndexOf(".");
  return name.substring(lastDot + 1);
}
/**
 *
 * @param {string} base64
 * @returns {string}
 */
export function getBase64FileType(base64) {
  let parts = base64.split(",");
  const regex = new RegExp("(/)(.*);");
  var matched = regex.exec(parts[0]);
  return "." + matched[2];
}

/**
 *
 * @param { string } source
 * @param { StorageQuery } storageQuery
 * @param { string } name
 */
export function prepareMedia(storageQuery, source, name) {
  // source could be url or base64 string
  if (source.startsWith("http")) {
    return new Promise((res, rej) => res(source));
  } else {
    return storageQuery.uploadBase64(
      source,
      `${name}${getBase64FileType(source)}`
    );
  }
}

/**
 *
 * @param {string} title
 * @param {string} message
 * @param {function} callback
 * @param {Array} buttons
 * @returns
 */
export function dialog(title, message, callback, buttons = []) {
  const dialogEl = document.createElement("dialog");
  const formEl = $.parseHTML(
    `<form method="dialog">
      <h2>${title}</h2>
      <p>${message}</p>
      <div class="d-flex pt-2 gap-2 justify-content-end">
          ${buttons
            .map((b) => {
              return `<button class="btn btn-${b.priority}" value="${b.value}">${b.title}</button>`;
            })
            .join("")}
      </div>
    </form>`
  );

  $(dialogEl).append(formEl);
  $(dialogEl).on("close", () => {
    const returnValue = dialogEl.returnValue;
    $(dialogEl).remove();
    callback(returnValue);
  });
  $("body").append(dialogEl);
  return dialogEl;
}

/**
 *
 * @param {string} title
 * @param {string} message
 * @param {function} callback
 * @returns
 */
export function loadingEl() {
  const dialogEl = document.createElement("dialog");
  $(dialogEl).addClass("loading-dialog");
  const formEl = $.parseHTML(
    `<div class="d-flex justify-content-between align-items-center">
      <span id="dialog-progress-value" class="text-capitalize"></span>
      <span class="loader-1 me-0"></span>
    </div>`
  );

  $(dialogEl).append(formEl);

  $("body").append(dialogEl);
  return {
    present: (message) => {
      dialogEl.showModal();
      $(formEl).find("#dialog-progress-value").html(message);
      return new Promise((rs) => {
        setTimeout(() => {
          rs();
        }, 2000);
      });
    },
    progress: (value) => {
      $(formEl).find("#dialog-progress-value").html(value);
    },
    close: () => {
      dialogEl.close();
    },
  };
}

export function copyright() {
  console.log(`



  
𝗖𝗔𝗕𝗟𝗘𝗗𝗘𝗧𝗘𝗖𝗧𝗜𝗢𝗡 by

█▀▀ █▀█ █▀█ █░░ █▀ ▀█▀ █░█ █▀▀ █▀▀
█▄▄ █▄█ █▄█ █▄▄ ▄█ ░█░ █▄█ █▀░ █▀░

Copyright @ ${new Date().getFullYear()} coolstuff. All right reserved.




`);
}

export function isEmptyOrSpaces(str) {
  return str === null || str === undefined || str.match(/^ *$/) !== null;
}

export function capitalizeName(name) {
  return name.replace(/\b(\w)/g, s => s.toUpperCase());
}