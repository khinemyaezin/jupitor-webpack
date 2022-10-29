import "../home/index.scss";
import "jquery";
import { jarallax } from "jarallax";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import Scrollax from "scrollax";
import Aos from "aos";
import { runHeaderControl } from "../utility/main";
import {FirebaseInit} from '../utility/firebase';
import 'bootstrap/js/dist/offcanvas';
import { Quote } from "../utility/model-quote";

import jsonUser from "../data-json/user-info.json";
import jsonFooter from "../data-json/section-footer.json";
import jsonAbout from "../data-json/section-about.json";
import jsonPartner from "../data-json/section-partners.json";

require.context("../assets", false, /\.(svg|png|jpe?g|gif)$/i);

const firebase = new FirebaseInit();

window.onload = () => {
  runHeaderControl();
  runJarallax();
  runMasonry();
  runScrollax();
  runAos();
  writeCopywrite();
  prepareHero();
  prepareAbout();
  createPartners();
  prepareFooter();
  $("#quote-form").on("submit", quote);

  //new TxtType(document.getElementById("text-type"),['Cable Detection'])
};

function runJarallax() {
  jarallax($(".jarallax"), {
    speed: 0.2,
  });
}

function runMasonry() {
  /** Masonry */
  const gridRef = document.querySelector(".grid");
  const moasonry = new Masonry(gridRef, {
    itemSelector: ".grid-item",
    percentPosition: true,
    columnWidth: ".grid-sizer",
  });
  imagesLoaded(gridRef).on("progress", function () {
    moasonry.layout();
  });
}

function runScrollax() {
  const parallax = new Scrollax();
  parallax.options = {
    horizontal: false, // Enable for horizontal scrolling.
    offset: 0, // Target area offset from start (top in vert., left in hor.).
  };
  // Initialize Scrollax instance
  parallax.init();
}

function runAos() {
  Aos.init();
}

function writeCopywrite() {
  $("#footer-fullyear").html(new Date().getFullYear());
}

function quote(event) {
  event.preventDefault();
  const username = $("#quote-form input[name=name]").val();
  const email = $("#quote-form input[name=email]").val();
  const message = $("#quote-form input[name=message]").val();
  firebase
    .setDocument(new Quote(username, email, message, false))
    .then(() => {
      alert("successfully submit");
      event.reset();
    })
    .catch((error) => {
      console.log(error);
    });
}

function prepareHero() {
  $("#hero-landing #hero-name").text(jsonUser.name + ",");
  $("#hero-landing #hero-nickname").text(jsonUser.nick_name);
  $("#hero-landing #text-type").text(jsonUser.carrier);
  $("#hero-landing #hero-pitch").html(jsonUser.pitch.join("<br>"));

  for (let social of jsonUser.socials) {
    $("#hero-landing #hero-socials").append(
      $.parseHTML(
        `<a class="${social.icon} text-dark text-decoration-none" href="${social.href}"></a>`
      )
    );
  }
}

function createPartners() {
  const list = jsonPartner.partners;
  for (let data of list) {
    const col = $.parseHTML(
      `<div class="col">
        <div class="d-flex mb-4 flex-column gap-3 justify-content-start">
          <div>
            <img class="me-3" src="${data.image}" alt="" height="50" width:"auto"> 
          </div>
          <h5>${data.name}</h5> 
        </div>
      </div>`
    );
    const learnMoreBtn = $.parseHTML(
      `<div> <a class="btn btn-outline-primary " href="${data.link}">Learn more</a> </div>`
    );
    const txtAdjHeight = $.parseHTML(
      `<div class="d-block position-relative txt-adj-h-container"></div>`
    );
    const detail = $.parseHTML(`<p class="font-pt">${data.detail}</p>`);
    $(txtAdjHeight).append(detail);
    $(col).append(txtAdjHeight);
    $(col).append(learnMoreBtn);
    $("#partners-list-ref").append(col);
  }
}

function _textAdjustHeight(groupContent, articleTitle, theme) {
  const longestArticle = theme._articles.reduce(function (a, b) {
    return a.title.length > b.title.length ? a : b;
  });
  $(articleTitle).text(longestArticle.title);
  $(articleTitle).addClass("position-relative invisible");
  const c = ".txt-adj-h-container";
  $(groupContent)
    .find(c)
    .each(function () {
      $(this).find(".article-title").addClass("position-absolute ");
      $(articleTitle).clone().appendTo(this);
    });
}

function prepareAbout() {
  $("#about #about-title").html(jsonAbout.title);
  $("#about #about-desc").html(jsonAbout.desc);

  const education = valueHtml(
    "Education",
    jsonUser.qualification.join("<br>"),
    "images/value_1.png"
  );
  $("#about-values").append($.parseHTML(education));
  for (let value of jsonAbout.values) {
    const s = valueHtml(value.title, value.desc, value.image);
    const valueRef = $.parseHTML(s);
    $("#about-values").append(valueRef);
  }
}

function valueHtml(title, desc, image) {
  return ` <div class="d-flex p-3 gap-3 align-items-center">
            <div class="display-2 text-white bg-dark fw-bold m-0 align-self-start p-1 ">${title.substring(0,1)}</div>
            <div class="flex-grow-1 ps-3">
              <div class="overflow-hidden">
                  <h5 class="mb-2 lead fw-bold">${title}</h5>
              </div>
              <p>${desc}</p>
            </div>
          </div>`;
}

function prepareFooter() {
  $("footer #copyright-txt").html(jsonFooter.copyright_txt);
  $("footer #footer-company-desc").text(jsonFooter.company_desc);
  $("footer #footer-company-address").text(jsonUser.office_address);
  $("footer #footer-email").text(jsonUser.email);
  $("footer #footer-email").attr("href", `mailto:${jsonUser.email}`);

  $("footer #footer-phone").text(jsonUser.phone);
  $("footer #footer-phone").attr("href", `tel:${jsonUser.phone}`);

  for (let social of jsonUser.socials) {
    $("footer #hero-socials").append(
      $.parseHTML(
        `<a class="${social.icon} text-muted text-decoration-none social-icons" href="${social.href}"></a>`
      )
    );
  }
}
