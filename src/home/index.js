import "../home/index.scss";
import "jquery";
import { jarallax } from "jarallax";
import Scrollax from "scrollax";
import Aos from "aos";
import { runHeaderControl } from "../utility/main";
import {FirebaseInit} from '../utility/firebase';
import 'bootstrap/js/dist/offcanvas';
import { Quote } from "../utility/model-quote";
import TxtType from "../utility/text-writer";
//import Flickity from 'flickity';
import jsonUser from "../data-json/user-info.json";
import jsonFooter from "../data-json/section-footer.json";
import jsonAbout from "../data-json/section-about.json";
import jsonPartner from "../data-json/section-partners.json";
import jsonGallery from "../data-json/section-gallery.json";
//require.context("../assets", false, /\.(svg|png|jpe?g|gif)$/i)
// const images = importAll(require.context("../assets", false, /\.(svg|png|jpe?g|gif)$/i));
// function importAll(r) {
//   let images = {};
//   r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
//   return images;
// }

const firebase = new FirebaseInit();

window.onload = () => {
  runHeaderControl();
  runJarallax();
  runScrollax();
  runAos();
  writeCopywrite();
  prepareHero();
  prepareAbout();
  prepareServices();
  prepareGallery();
  runMasonry();
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
  // const gridRef = document.querySelector(".grid");
  // const moasonry = new Masonry(gridRef, {
  //   itemSelector: ".grid-item",
  //   percentPosition: true,
  //   columnWidth: '.grid-sizer',
  //   gutter: 10,
  //   stagger: 30,
  //   originLeft:false
  // });
  // imagesLoaded(gridRef).on("progress", function () {
  //   moasonry.layout();
  // });
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

/** Sections */
function prepareHero() {
  $("#hero-landing #hero-carrier").text(jsonUser.carrier);
  $("#hero-landing #hero-pitch").html(jsonUser.pitch.join("<br>"));
  new TxtType(document.getElementById('hero-name'),[jsonUser.name,jsonUser.nick_name])
}
function prepareAbout() {
  $("#about #about-title").html(jsonAbout.title);
  $("#about #about-desc").html(jsonAbout.desc);
  //$('#about #about-image').attr('src',images['about.jpg']);
  const education = valueHtml(
    "Education",
    jsonUser.qualification.join("<br>"),
    ""
  );
  $("#about-values").append($.parseHTML(education));
  for (let value of jsonAbout.values) {
    const s = valueHtml(value.title, value.desc, value.image);
    const valueRef = $.parseHTML(s);
    $("#about-values").append(valueRef);
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
    $(txtAdjHeight).append(learnMoreBtn);
    $(col).append(txtAdjHeight);
    $("#partners-list-ref").append(col);
  }
}
function prepareServices() {
  //$('#services #service-image').attr('src',images['service.svg'])
}
function prepareGallery(){
  jsonGallery.works.forEach( (work,index) => {
    const gallery = $.parseHTML(
      `<a class="grid-item" href="#">
        <img loading="lazy" src="${work.url}" alt="work-gallery-${index+1}">
        <span class="background-color"></span>
        <div class="img-overlay">
            <article class="p-2">
                <div class="title h5">${work.title}</div>
                <div class="subtitle">${work.desc}</div>
            </article>
        </div>
      </a>`
    );

    $('#gallery-grid').append(gallery);
  })
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

