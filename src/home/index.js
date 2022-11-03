import "../home/index.scss";
import "jquery";
import { jarallax } from "jarallax";
import Aos from "aos";
import { runHeaderControl } from "../utility/main";
import { FirebaseInit } from "../utility/firebase";

import "bootstrap/js/dist/offcanvas";
import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/scrollspy";
import "bootstrap/js/dist/carousel";

import { Quote } from "../utility/model-quote";
import TxtType from "../utility/text-writer";
//import Flickity from 'flickity';
import jsonUser from "../data-json/user-info.json";
import jsonFooter from "../data-json/section-footer.json";
import jsonAbout from "../data-json/section-about.json";
import jsonPartner from "../data-json/section-partners.json";
import jsonGallery from "../data-json/section-gallery.json";

require.context("../assets", false, /\.(png|jpe?g)$/i);

window.onload = () => {
  console.log("dom loaded");
  runHeaderControl();
  runJarallax();
  writeCopywrite();
  prepareHero();
  prepareAbout();
  prepareServices();
  prepareGallery();
  //runMasonry();
  createPartners();
  prepreQuotation();
  prepareFooter();
  runAos();
  $("#quote-form").on("submit", quote);
};

function runJarallax() {
  jarallax($(".jarallax"), {
    speed: 0.2,
  });
}

// function runMasonry() {
//   /** Masonry */
//   // const gridRef = document.querySelector(".grid");
//   // const moasonry = new Masonry(gridRef, {
//   //   itemSelector: ".grid-item",
//   //   percentPosition: true,
//   //   columnWidth: '.grid-sizer',
//   //   gutter: 10,
//   //   stagger: 30,
//   //   originLeft:false
//   // });
//   // imagesLoaded(gridRef).on("progress", function () {
//   //   moasonry.layout();
//   // });
// }

// function runScrollax() {
//   const parallax = new Scrollax();
//   parallax.options = {
//     horizontal: false, // Enable for horizontal scrolling.
//     offset: 0, // Target area offset from start (top in vert., left in hor.).
//   };
//   // Initialize Scrollax instance
//   parallax.init();
// }

function runAos() {
  return Aos.init();
}

function writeCopywrite() {
  $("#footer-fullyear").html(new Date().getFullYear());
}

function quote(event) {
  event.preventDefault();
  const firebase = new FirebaseInit();

  const username = $("#quote-form input[name=name]").val();
  const email = $("#quote-form input[name=email]").val();
  const message = $("#quote-form input[name=message]").val();

  let query = (operation) => {
    if (operation) {
      $("#quote-form button[type=submit]").addClass("query");
    } else {
      $("#quote-form button[type=submit]").removeClass("query");
    }
    $("#quote-form button[type=submit]").prop("disabled", operation);
  };
  query(true);

  firebase
    .setDocument(new Quote(username, email, message, false))
    .then(() => {
      alert("successfully submit");
      document.getElementById("quote-form").reset();
      query(false);
    })
    .catch((error) => {
      console.log(error);
      query(false);
    });
}

/** Sections */
function prepareHero() {
  $("#hero-landing #hero-carrier").text(jsonUser.carrier);
  $("#hero-landing #hero-pitch").html(jsonUser.pitch.join("<br>"));
  new TxtType(document.getElementById("hero-name"), [
    jsonUser.name,
    jsonUser.nick_name,
  ]);
}

function prepareAbout() {
  $("#about #about-title").html(jsonAbout.title);
  $("#about #about-desc").html(jsonAbout.desc);

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
        <div class="card card-body card-hover h-100 border-0 bg-primary bg-opacity-10" data-aos="zoom-in">
          <img class="d-block mb-3" src="${data.url}" alt="${data.name}">
          <h6 class="fw-bold">${data.name}</h6>
          <p class="fs-sm mb-0">${data.desc}</p>
        </div>
      </div>`
    );
    
    $("#partners-list-ref").append(col);
  }
}

function prepareServices() {
  //$('#services #service-image').attr('src','assets/service.svg')
}

function prepareGallery() {
  const initDelay = 100;
  jsonGallery.works.forEach((work, index) => {
    const gallery = $.parseHTML(
      `<div class="grid-item" data-aos="zoom-in">
        <img loading="lazy" src="${work.url}" alt="work-gallery-${index + 1}">
        <span class="background-color"></span>
        <div class="img-overlay">
            <article class="p-2">
                <div class="title h5">${work.title}</div>
                <div class="subtitle">${work.desc}</div>
            </article>
        </div>
      </div>`
    );

    $("#gallery-grid").append(gallery);
  });
}

function prepreQuotation() {
  $("#quotation #quotation-company-address").text(jsonUser.office_address);
  $("#quotation #quotation-email").text(jsonUser.email);
  $("#quotation #quotation-email").attr("href", `mailto:${jsonUser.email}`);

  $("#quotation #quotation-phone").text(jsonUser.phone);
  $("#quotation #quotation-phone").attr("href", `tel:${jsonUser.phone}`);

  for (let social of jsonUser.socials) {
    $("#quotation #quotation-socials").append(
      $.parseHTML(
        `<a class="${social.icon} text-muted text-decoration-none p-2 bg-white rounded-3" href="${social.href}"></a>`
      )
    );
  }
}

function prepareFooter() {
  const auther = $.parseHTML(
    `<a href="login.html" class="text-decoration-none text-reset admin-link ">${jsonFooter.auther}</a>`
  );

  $("footer #copyright-txt").append(auther);
  $("footer #copyright-txt").append(jsonFooter.copyright_txt);
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

function valueHtml(title, desc, image) {
  return ` <div class="d-flex p-3 gap-3 align-items-center" data-aos="fade-right">
            <div class="display-2 text-white bg-dark fw-bold m-0 align-self-start p-1 ">${title.substring(
              0,
              1
            )}</div>
            <div class="flex-grow-1 ps-3">
              <div class="overflow-hidden">
                  <h5 class="mb-2 lead fw-bold">${title}</h5>
              </div>
              <p>${desc}</p>
            </div>
          </div>`;
}
