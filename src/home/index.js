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

require.context("../assets", false, /\.(png|jpe?g)$/i);
const firebase = new FirebaseInit();

// const information = {
//   section_hero: {
//     title: "cable detection",
//     pitch: "my picth",
//     image_url:
//       "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/hero.jpg?alt=media&token=aaf753a6-fb93-41d2-a52e-464af02d0b4d",
//   },
//   section_about: {
//     values: [
//       {
//         title: "Education",
//         desc: "educated",
//       },
//     ],
//     project: {
//       count: "222",
//       title: "Success",
//     },
//     description: "<h1><strong>About Desc</strong></h1>",
//     image_url:
//       "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/about.jpg?alt=media&token=74243d9c-4619-4adf-be7e-499339f44959",
//   },
//   section_gallery: {
//     short_desc:
//       "We are honored to have the opportunity to work with various partners and clients across different sectors and all walks of life. We are always open to new partnerships and provide our expertise to support your firm to achieve greater heights.",
//     images: [
//       {
//         url: "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/gallery_0..jpeg?alt=media&token=22fe8354-a408-40c5-9549-e03fe86942bc",
//         title: "2",
//         desc: "2",
//       },
//       {
//         url: "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/gallery_1..webp?alt=media&token=8465aa56-b4bb-4e14-8be8-41578767b81e",
//         title: "1",
//         desc: "1",
//       },
//     ],
//   },
//   section_service: {
//     image_urls: [
//       "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/service_0.jpg?alt=media&token=39e5b456-c1f1-42d0-9110-d6eb1d143ff6",
//       "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/service_1.jpg?alt=media&token=5cf7705a-6d88-4153-bc60-cb8d37fc13a7",
//       "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/service_2.jpg?alt=media&token=e8d4a219-d3b1-4ead-afe3-3287b21b81df",
//     ],
//     name: "cable detection",
//     process: [
//       {
//         icon: "bi bi-chat-left-fill",
//         title: "Quotation",
//       },
//     ],
//     desc: "<p><strong>Underground cables and pipes are</strong>&nbsp;one of the things that enables telecommunication, power transmission, as well as an undisrupted flow of clean water supplies to every household and commercial building.</p><p><strong>Cable Detection</strong>&nbsp;is conducted by a Licensed Cable Detection Worker (LCDW) with a set of instrument or locator to detect the presence and approximate location of an underground cable or pipe. This serves as an indicator that the cable or pipe is located nearby on site, and to proceed with care and caution.</p>",
//     short_desc:
//       "We are honored to have the opportunity to work with various partners and clients across different sectors and all walks of life. We are always open to new partnerships and provide our expertise to support your firm to achieve greater heights.",
//   },
//   section_partner: {
//     short_desc:
//       "We are honored to have the opportunity to work with various partners and clients across different sectors and all walks of life. We are always open to new partnerships and provide our expertise to support your firm to achieve greater heights.",
//     partners: [
//       {
//         title: "Shewar",
//         desc: "2222",
//         image_url:
//           "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/partner_0..png?alt=media&token=3b41abe5-210e-47a8-903a-3274a8f6fc6e",
//       },
//     ],
//   },
//   section_quotation: {
//     desc: "We are honored to have the opportunity to work with various partners and clients across different sectors and all walks of life. We are always open to new partnerships and provide our expertise to support your firm to achieve greater heights.",
//   },
//   section_footer: {
//     desc: "support your firm to achieve greater heights.",
//   },
//   contact: {
//     email: {
//       icon: "bi bi-envelope-fill",
//       value: {
//         icon: "bi bi-send",
//         data: "cabledetection@gmail.com",
//       },
//       desc: "support your firm to achieve greater heights.",
//       title: "Email us",
//     },
//     phone: {
//       icon: "bi bi-headset",
//       title: "Call us",
//       desc: "support your firm to achieve greater heights.",
//       values: [
//         {
//           icon: "bi bi-phone",
//           data: "09795957915",
//         },
//         {
//           icon: "bi bi-telephone",
//           data: "09423725185",
//         },
//       ],
//     },
//     social: {
//       title: "Socials",
//       icon: "bi bi-globe",
//       desc: "support your firm to achieve greater heights.",
//       values: [
//         {
//           data: "www.facebook.com",
//           icon: "bi bi-facebook",
//         },
//       ],
//     },
//     address: "address",
//     official: "John",
//     nickname: "Alex",
//     auther: "Kyaw Thu Myint",
//     company: "Cable Detection",
//   },
// };

window.onload = async () => {
  runHeaderControl();
  writeCopywrite();

  $('body').addClass('wait')
  const page = await downloadPage();
  $('body').removeClass('wait')


  prepareHero(page?.section_hero, page?.contact);
  prepareAbout(page?.section_about);
  prepareServices(page?.section_service);
  prepareGallery(page?.section_gallery);
  createPartners(page?.section_partner);
  prepreQuotation(page?.section_quotation, page?.contact);
  prepareFooter(page?.section_footer, page?.contact);
  runAos();
  $("#quote-form").on("submit", quote);
};

async function downloadPage() {
  let data = {};
  await firebase.onFirstData("page", []).then((snapshot) => {
    snapshot.docs.forEach((doc, i) => {
      data[doc.id] = doc.data();
    });
  });
  return data;
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

  const quote = new Quote(username, email, message, false);
  firebase
    .setDocument("quote", quote.convert)
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
function prepareHero(hero, contact) {
  $("#hero-landing #hero-carrier").text(hero.title);
  $("#hero-landing #hero-pitch").html(hero.pitch);
  new TxtType(document.getElementById("hero-name"), [
    contact.official,
    contact.nickname,
  ]);
  jarallax($("#hero-jarallax"), {
    speed: 0.2,
    imgSrc: hero.image_url,
  });
}

function prepareAbout(about) {
  $("#about #about-desc").html(about.description);
  $("#about #about-project-count").html(about.project.count);
  $("#about #about-project-title").html(about.project.title);
  $("#about #about-image").attr("src", about.image_url);
  for (let value of about.values) {
    const s = valueHtml(value.title, value.desc);
    const valueRef = $.parseHTML(s);
    $("#about-values").append(valueRef);
  }
}

function createPartners(partner) {
  $("#partner #partner-short-desc").html(partner.short_desc);

  for (let data of partner.partners) {
    const col = $.parseHTML(
      `<div class="col">
        <div class="card card-body card-hover h-100 border-0 bg-primary bg-opacity-10" data-aos="zoom-in">
          <img class="d-block mb-3" src="${data.image_url}" alt="${data.title}">
          <h6 class="fw-bold">${data.title}</h6>
          <p class="fs-sm mb-0">${data.desc}</p>
        </div>
      </div>`
    );

    $("#partners-list-ref").append(col);
  }
}

function prepareServices(service) {
  $("#services #service-short-desc").text(service.short_desc);
  $("#services #service-desc").html(service.desc);
  $("#services #service-name").html(service.name);
  service.image_urls.forEach((url, index) => {
    const slide = $.parseHTML(`<div class="carousel-item ${
      index == 0 ? "active" : ""
    }"><img src="${url}" class="d-block w-100" alt="service-${index}"></div>
      `);
    $("#services #service-carousel-inner").append(slide);
  });
  const delay = 100;
  service.process.forEach((process, index) => {
    const processHtml = $.parseHTML(`
        <div class="col-12 col-sm-6 col-lg-3 d-flex align-items-center forward-icon" data-aos="fade-right" data-aos-delay="${
          delay * index
        }">
          <div class="flex-shrink-0 text-accent-3" style="min-width: 42px;" >
              <i class="${process.icon} fs-1"></i>
          </div>
          <div class="flex-grow-1 ms-3">
              <h5 class="m-0">${process.title}</h5>
          </div>
        </div>`);
    $("#service-process-row").append(processHtml);
  });
}

function prepareGallery(gallery) {
  $("#gallery #gallery-short-desc").html(gallery.short_desc);
  const initDelay = 100;
  gallery.images.forEach((work, index) => {
    const gallery = $.parseHTML(
      `<div class="grid-item" data-aos="zoom-in">
        <img loading="lazy" src="${work.url}" alt="work-gallery-${
        initDelay * index
      }">
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

function prepreQuotation(quote, contact) {
  $("#quotation #quotation-short-desc").html(quote.short_desc);

  $("#quotation #quotation-email-title").html(contact.email.title);
  $("#quotation #quotation-email-desc").html(contact.email.desc);
  $("#quotation #quotation-email-value").html(contact.email.value.data);
  $("#quotation #quotation-email-value").attr(
    "href",
    `mailto:${contact.email.value.data}`
  );

  $("#quotation #quotation-phone-title").html(contact.phone.title);
  $("#quotation #quotation-phone-desc").html(contact.phone.desc);

  contact.phone.values.forEach((phone, index) => {
    const phoneHtml =
      $.parseHTML(`<span class="d-flex gap-2 text-primary p-2 bg-${
        index == 0 ? "primary" : "secondary"
      } bg-opacity-10  rounded-3">
      <i class="${phone.icon}"></i>
      <a href="tel:${phone.data}" class="text-decoration-none">${phone.data}</a>
    </span>`);
    $("#quotation #quotation-phones").append(phoneHtml);
  });

  $("#quotation  #quotation-social-title").html(contact.social.title);
  $("#quotation  #quotation-social-desc").html(contact.social.desc);
  for (let svalue of contact.social.values) {
    $("#quotation #quotation-socials").append(
      $.parseHTML(
        `<a class="${svalue.icon} text-muted text-decoration-none p-2 bg-white rounded-3" href="${svalue.data}"></a>`
      )
    );
  }
}

function prepareFooter(footer, contact) {
  const auther = $.parseHTML(
    `<a href="login.html" class="text-decoration-none text-reset admin-link ">${contact.company}</a>`
  );

  $("footer #copyright-txt").append(auther);
  $("footer #copyright-txt").append(" All Rights Reserved");

  $("footer #footer-company-desc").text(footer.desc);
  $("footer #footer-company-address").text(contact.address);
  $("footer #footer-email").text(contact.email.value.data);
  $("footer #footer-email").attr("href", `mailto:${contact.email.value.data}`);

  $("footer #footer-phone").text(contact.phone.values[0].data);
  $("footer #footer-phone").attr("href", `tel:${contact.phone.values[0].data}`);

  for (let social of contact.social.values) {
    $("footer #hero-socials").append(
      $.parseHTML(
        `<a class="${social.icon} text-muted text-decoration-none social-icons" href="${social.data}"></a>`
      )
    );
  }
}

function valueHtml(title, desc) {
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

function init() {}
