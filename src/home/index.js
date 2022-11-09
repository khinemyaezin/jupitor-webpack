import "../home/index.scss";
import "jquery";
import { jarallax } from "jarallax";
import Aos from "aos";
import {
  runHeaderControl,
  copyright,
  dialog,
  getFileSize,
  getFileNameWithExt,
} from "../utility/main";
import { FirebaseInit } from "../utility/firebase";
import { v4 as uuidv4 } from "uuid";

import "bootstrap/js/dist/offcanvas";
import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/scrollspy";
import "bootstrap/js/dist/carousel";

import { Quote } from "../utility/model-quote";
import TxtType from "../utility/text-writer";
import StorageQuery from "../utility/storage-query";

require.context("../assets", false, /\.(png|jpe?g)$/i);
const firebase = new FirebaseInit();

//copy right
copyright();

window.onload = async () => {
  runHeaderControl();
  writeCopywrite();

  const page = await downloadPage();
  if (typeof page === "string" || Object.keys(page).length == 0) {
    dialog(
      "Sorry",
      "Our site is not avaliable in your region",
      () => {},
      []
    ).showModal();
    return;
  }

  prepareHero(page?.section_hero, page?.contact);
  prepareAbout(page?.section_about);
  prepareServices(page?.section_service);
  prepareGallery(page?.section_gallery);
  createPartners(page?.section_partner);
  prepreQuotation(page?.section_quotation, page?.contact);
  prepareFooter(page?.section_footer, page?.contact);
  runAos();
  $("#quote-form").on("submit", quote);

  // Remove loading splash
  $("body").removeClass("wait");
};

async function downloadPage() {
  let data = {};
  await firebase
    .onFirstData("page", [])
    .then((snapshot) => {
      snapshot.docs.forEach((doc, i) => {
        data[doc.id] = doc.data();
      });
    })
    .catch((error) => {
      return "Our site is not avaliable in your region!";
    });
  return data;
}

function runAos() {
  return Aos.init({ once: true });
}

function writeCopywrite() {
  $("#footer-fullyear").html(new Date().getFullYear());
}

async function quote(event) {
  event.preventDefault();

  const email = $("#quote-form input[name=email]").val().toLowerCase();
  const username = $("#quote-form input[name=name]").val().toLowerCase();
  const message = $("#quote-form input[name=message]").val();
  let attachment = "";

  // Upload attachment file before submit;
  if ($("#ref-chooser").val() == "file" && $("#ref-file")[0].files[0]) {
    const storageQuery = new StorageQuery(firebase);
    const file = $("#ref-file")[0].files[0];
    const fileName = `attachments/${uuidv4()}.${getFileNameWithExt(file)}`;
    const downloadURL = await storageQuery
      .uploadFile(file, fileName)
      .catch(() => {
        return null;
      });

    if (downloadURL) {
      attachment = downloadURL;
    }
  } else {
    attachment = $("#ref-url").val();
  }

  // Progress 
  let query = (operation) => {
    if (operation) {
      $("#quote-form button[type=submit]").addClass("query");
    } else {
      $("#quote-form button[type=submit]").removeClass("query");
    }
    $("#quote-form button[type=submit]").prop("disabled", operation);
  };
  query(true);

  // Upload quotation request;
  const quote = new Quote(username, email, message, false, attachment);
  firebase
    .setDocument("quote", quote.convert)
    .then(() => {
      alert("successfully submit");
      document.getElementById("quote-form").reset();
      $("#ref-chooser").trigger('change');
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
      `<div class="col" >
        <div class="card card-body card-hover h-100 border-0" data-aos="zoom-in">
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
    const phoneHtml = $.parseHTML(`<span class="d-flex gap-2 text-primary">
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
        `<a class="${svalue.icon} text-muted text-decoration-none p-2 bg-light rounded-3" href="${svalue.data}"></a>`
      )
    );
  }

  //Entry
  document.getElementById("ref-file").addEventListener("change", function () {
    var _size = this.files[0].size;
    if (_size >= 2000000) {
      // 2MB in bytes
      dialog(
        "Over limit",
        "Your selected file excceds 2MB. Please choose another one.",
        () => {},
        [{ title: "OK", value: "go&check", priority: "primary" }]
      ).showModal();
      $("#ref-file").val("");
      $("#ref-file-btn").html("No file (max 2MB)");
    }

    const sizeString = getFileSize(_size);

    $("#ref-file-btn").html(
      `${this.files[0].name}  <span class="position-absolute file-size-bage end-0 text-muted">${sizeString}</span> `
    );
  });

  $("#ref-chooser").on("change", function () {
    $("#ref-file").val("");
    $("#ref-file-btn").text("No file selected (max 2MB)");
    $("#ref-url").val("");
    if ($("#ref-chooser").val() == "url") {
      $("#ref-file-btn").hide();
      $("#ref-url").show();
    } else {
      $("#ref-file-btn").show();
      $("#ref-url").hide();
    }
  });
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
