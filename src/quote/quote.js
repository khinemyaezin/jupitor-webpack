import "../quote/quote.scss";
import "jquery";
import { Quote } from "../utility/model-quote";
import {
  runHeaderControl,
  formatDate,
  getEndOfDay,
  getStartOfDay,
  isEmptyOrSpaces,
  capitalizeName,
  copyright,
} from "../utility/main";
import { FirebaseInit } from "../utility/firebase";
import QuoteService from "../utility/quote-query";
import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/offcanvas";
import Dropdown from "bootstrap/js/dist/dropdown";
import { easepick, RangePlugin, TimePlugin } from "@easepick/bundle";

// init dao;
const firebase = new FirebaseInit();
const quoteService = new QuoteService(firebase);

let filterDate = null;
const operators = firebase.operators;
let filterDropdown = null;

copyright();


window.onload = async () => {
  // Auth
  firebase.watchUser((isAuth) => {
    if (!isAuth) {
      window.location.replace("login.html");
    } else {
      prepareNav();
      runHeaderControl();
      datePicker();
      importOperators();
      prepareFilterDropdown();
      search();
      preparePrevSearch();
      prepareNextSearch();
      prepareReset();

      queryState(true);
      quoteService.onFirstData([]).then(renderQuote);
      //prepareDemo();
    }
  });
};

function prepareFilterDropdown() {
  filterDropdown = new Dropdown(document.getElementById("filter-dropdown-btn"));
}

function renderQuote(snapshot) {
  if (snapshot) {
    const rowCount = $("#quote-tbody tr").length;
    snapshot.docs.forEach((doc, i) => {
      const row = prepareRow(
        setQuoteFromQuery(doc.id, doc.data()),
        rowCount + i + 1
      );
      $("#quote-tbody").append(row);
    });
  } else {
    console.log("Nothing more to fetch");
    alert("Nothing more to fetch");
  }
  queryState(false);
}

function setQuoteFromQuery(id, doc) {
  let quote = new Quote(
    doc.username,
    doc.email,
    doc.message,
    doc.resolve,
    doc?.attachment
  );
  quote.docId = id;
  quote.timestamp = doc.timestamp;
  return quote;
}

function prepareNav() {
  if (firebase.getCurrentuser) {
    $("#nav-user-email").text(firebase.getCurrentuser.email);
  }
  $("#btn-logout").on("click", () => {
    firebase.signOut();
  });
}

function prepareRow(quote, rowCount) {
  if (!quote instanceof Quote) throw new Error("Invalid quote");

  let row = $.parseHTML(`<tr></tr>`);

  const no = $.parseHTML(`<td class="td-no">${rowCount}</td>`);
  $(no).appendTo(row);

  const name = $.parseHTML(`<td class="td-username">${capitalizeName(quote.username)}</td>`);
  $(name).appendTo(row);

  const email = $.parseHTML(`<td class="td-email">${quote.email}</td>`);
  $(email).appendTo(row);

  const message = $.parseHTML(`<td class="td-message">${quote.message}</td>`);
  $(message).appendTo(row);

  const date = $.parseHTML(
    `<td class="td-timestamp">${formatDate(quote.timestamp.toDate())}</td>`
  );
  $(date).appendTo(row);

  const resolve = $.parseHTML(
    `<td class="td-resolve">
      <div class="form-check">
          <input class="form-check-input" type="checkbox" id="resolve-${
            quote.docId
          }" ${quote.resolve ? "checked" : ""} query-disabled-btn>
          <label class="d-block" for="resolve-${
            quote.docId
          }">Completed</label>
      </div>
    </td>`
  );
  $(resolve)
    .find("input")
    .on("change", function onChange() {
      updateResolve(quote.docId, this.checked);
    });
  $(resolve).appendTo(row);

  const attachment = $.parseHTML(`<td class="td-attachment text-center">
  ${
    isEmptyOrSpaces(quote.attachment)
      ? `-`
      : `<a type="button" class="btn" href="${quote.attachment}" download><i class="bi bi-download"></i></a>`
  }
     
    </td>`);
  $(attachment).appendTo(row);

  return row;
}

function updateResolve(docID, value) {
  queryState(true);
  quoteService
    .onUpdate(docID, {
      resolve: value,
    })
    .then(() => {
      alert("Success");
      queryState(false);
    })
    .catch((err) => {
      console.log("unable to update");
    });
}

function datePicker() {
  const erasePick = new easepick.create({
    element: "#filter-date-picker",
    css: ["https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css"],
    zIndex: 1200,
    format: "DD MMM YYYY",
    plugins: [RangePlugin, TimePlugin],
  });
  erasePick.on("select", (event) => {
    filterDate = event;
  });
  $("#filter-box-form").on("reset", () => {
    erasePick.clear();
  });
}

function search() {
  $("#filter-box-form").on("submit", (e) => {
    e.preventDefault();
    let filterModel = [
      {
        field: "username",
        value: $("#filter-name").val().toLowerCase(),
        operator: $("#filter-name-operator").val(),
      },
      {
        field: "email",
        value: $("#filter-email").val().toLowerCase(),
        operator: $("#filter-email-operator").val(),
      },
    ];

    /** Filter for query */
    let filter = filterModel.filter((data) => {
      return !(
        data.value === null ||
        data.value === undefined ||
        data.value.match(/^ *$/) !== null
      );
    });
    if (filterDate) {
      filter.push({
        field: "timestamp",
        operator: "<=",
        value: getEndOfDay(filterDate.detail.end),
      });
      filter.push({
        field: "timestamp",
        operator: ">=",
        value: getStartOfDay(filterDate.detail.start),
      });
    }
    $("#quote-tbody").html("");
    queryState(true);
    quoteService.onFirstData(filter).then(renderQuote);
    filterDropdown.toggle();
  });
}

function preparePrevSearch() {
  $("#btn-prev").on("click", () => {
    queryState(true);

    quoteService.onPrevData().then(renderQuote);
  });
}

function prepareNextSearch() {
  $("#btn-next").on("click", () => {
    queryState(true);
    quoteService.onNextData().then(renderQuote);
  });
}

function importOperators() {
  $(".data-operators").each(function (index) {
    operators.forEach((operator) => {
      $(this).append(
        $.parseHTML(
          `<option value="${operator}" ${
            operator == "==" ? "selected" : ""
          }>${operator}</option>`
        )
      );
    });
  });
}

function prepareReset() {
  $("#filter-reset-btn").on("click", () => {
    document.getElementById("filter-box-form").reset();
    queryState(true);
    $("#quote-tbody").html("");
    quoteService.onFirstData([]).then(renderQuote);
    filterDropdown.toggle();
  });
}

function queryState(operation) {
  if (operation) $("#filter-spinner").removeClass("d-none");
  else $("#filter-spinner").addClass("d-none");
  $("[query-disabled-btn]").each(function () {
    $(this).prop("disabled", operation);
  });
}
