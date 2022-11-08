import "../home-editor/home-editor.scss";
import "jquery";
import Quill from "quill";
import {
  readFile,
  runHeaderControl,
  prepareMedia,
  loadingEl,
  dialog,
} from "../utility/main";
import "bootstrap/js/dist/carousel";
import "bootstrap/js/dist/collapse";

import { FirebaseInit } from "../utility/firebase";
import StorageQuery from "../utility/storage-query";
import { doc, setDoc } from "firebase/firestore";

const quillOptions = {
  debug: "info",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme

      ["clean"], // remove formatting button
    ],
  },
  placeholder: "Compose an epic...",
  readOnly: true,
  theme: "snow",
};
const social = [
  { icon: "bi bi-facebook", title: "Facebook" },
  { icon: "bi bi-linkedin", title: "LinkedIn" },
  { icon: "bi bi-whatsapp", title: "Whatsapp" },
];
const processIcons = [
  { icon: "bi bi-chat-left-fill", html: "&#xF24E" },
  { icon: "bi bi-check-square-fill", html: "&#xF26C" },
  { icon: "bi bi-pencil-fill", html: "&#xF4C9" },
  { icon: "bi bi-cone-striped", html: "&#xF2D2" },
];

let firebaseInit = new FirebaseInit();
let storageQuery = new StorageQuery(firebaseInit);
const el = loadingEl();

window.onload = async () => {

  el.present();
  el.progress("Please wait..");

  runHeaderControl();
  const page = await init();
  console.log(page);
  if (Object.keys(page).length === 0 && page.constructor === Object) {
  }

  const hero = new Hero();
  hero.prepare(page?.section_hero, page?.contact);

  const service = new Service();
  service.prepare(page?.section_service);

  const gallery = new Gallery();
  gallery.prepare(page?.section_gallery);

  const partner = new Partner();
  partner.prepare(page?.section_partner);

  const quotation = new Quotation();
  quotation.prepare(page?.section_quotation);

  const about = new About();
  about.prepare(page?.section_about);

  const footer = new Footer();
  footer.prepare(page?.section_footer, page?.contact);

  const contact = new Contact();
  contact.prepare(page?.contact);

  el.close();
  
  // Firebase
  $("#btn-submit").on("click", async () => {
    await el.present("Do not close the browser");
    /*
    await Promise.all([
      hero.exports(),
      about.exports(),
      gallery.exports(),
      service.exports(),
      partner.exports(),
    ]).then((promise) => {
      console.log(promise);
      newPage['section_hero'] = promise[0];
      newPage['section_about'] = promise[1];
      newPage['section_gallery'] = promise[2];
      newPage['section_service'] = promise[3];
      newPage['section_partner'] = promise[4];
      newPage['section_quotation'] = quotation.exports();
      newPage['section_footer'] = footer.exports();
      newPage['contact'] = contact.exports();
    });
    */
    const newPage = {
      section_hero: await hero.exports(),
      section_about: await about.exports(),
      section_gallery: await gallery.exports(),
      section_service: await service.exports(),
      section_partner: await partner.exports(),
      section_quotation: quotation.exports(),
      section_footer: footer.exports(),
      contact: contact.exports(),
    };

    console.log(newPage);
    el.progress("Preparing data");
    for (const key in newPage) {
      const ref = doc(firebaseInit.getDb, "page", key);
      await setDoc(ref, newPage[key], { merge: true })
        .then(() => {
          console.log("success");
          el.progress(`${key} uploaded`);
        })
        .catch((e) => console.log(e));
    }
    el.close();
    dialog("Successfully saved!","Enjoy your new website.",(rs)=>{
      if(rs === 'go&check') {
        window.location.replace("index.html");
      }
    },[
      {title:'Go & check',value:'go&check', priority:'primary'},
      {title:'No thanks',value:'no', priority:'outline-primary'}
    ]).showModal();
  });
};

class Hero {
  prepare(hero, contact) {
    if (hero && contact) {
      $("#hero-landing #hero-carrier").val(hero.title);
      $("#hero-landing #hero-pitch").html(hero.pitch);
      $("#hero-landing #hero-name").val(
        [contact.official, contact.nickname].join(",")
      );
      insertImage(
        hero.image_url,
        document.getElementById("hero-dropzone-single")
      );
    }

    document.getElementById("hero-image").addEventListener("change", (e) => {
      readFile(e.target.files[0]).then((f) => {
        insertImage(f, document.getElementById("hero-dropzone-single"));
      });
    });
  }
  async exports() {
    this.expData = {
      title: $("#hero-carrier").val().trim(),
      pitch: $("#hero-pitch").val().trim(),
      image_url: $("#hero-dropzone-single img").attr("src"),
    };

    try {
      const uploadResult = await prepareMedia(
        storageQuery,
        this.expData.image_url,
        "hero"
      );
      this.expData.image_url = await storageQuery.getURL(uploadResult);
      if (el) {
        el.progress("Uploaded hero image");
      }
    } catch {
      this.expData.image_url = "";
    }

    return this.expData;
  }
}
class About {
  prepare(about) {
    document.getElementById("about-image").addEventListener("change", (e) => {
      this.aboutImage = e.target.files[0];
      readFile(e.target.files[0]).then((f) => {
        insertImage(f, document.getElementById("about-dropzone-single"));
      });
    });
    this.aboutDescEditor = new Quill(
      document.getElementById("about-desc"),
      quillOptions
    );
    this.aboutDescEditor.enable(true);

    document
      .getElementById("about-values-entry")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.addValue(
          $("#about-values-entry input[name=about-value-title]").val(),
          $("#about-values-entry textarea[name=about-value-desc]").val()
        );
        document.getElementById("about-values-entry").reset();
      });

    //init
    if (about) {
      this.aboutDescEditor.root.innerHTML = about.description;
      $("#about #about-project-count").val(about.project.count);
      $("#about #about-project-title").val(about.project.title);

      insertImage(
        about.image_url,
        document.getElementById("about-dropzone-single")
      );

      for (let value of about.values) {
        this.addValue(value.title, value.desc);
      }
    }
  }
  async exports() {
    this.expData = {
      values: (() => {
        let coreValues = [];
        $("#about-values .about-value").each(function (el, index) {
          coreValues.push({
            title: $(this)
              .find("[data-about-value-title]")
              .attr("data-about-value-title")
              .trim(),
            desc: $(this)
              .find("[data-about-value-desc]")
              .attr("data-about-value-desc")
              .trim(),
          });
        });
        return coreValues;
      })(),
      project: {
        count: $("#about #about-project-count").val().trim(),
        title: $("#about #about-project-title").val().trim(),
      },
      description: this.aboutDescEditor.root.innerHTML,
      image_url: $("#about-dropzone-single img").attr("src"),
    };
    try {
      const uploadResult = await prepareMedia(
        storageQuery,
        this.expData.image_url,
        `about`
      );
      this.expData.image_url = await storageQuery.getURL(uploadResult);
      if (el) {
        el.progress("Uploaded about image");
      }
    } catch {
      this.expData.image_url = "";
    }

    return this.expData;
  }
  aboutValueParser(title, desc) {
    return ` <div class="d-flex p-3 gap-3 align-items-center about-value position-relative">
                <div class="display-2 text-white bg-dark fw-bold m-0 align-self-start p-1 ">${title.substring(
                  0,
                  1
                )}</div>
                <div class="flex-grow-1 ps-3">
                  <div class="overflow-hidden">
                      <h5 class="mb-2 lead fw-bold" data-about-value-title="${title}">${title}</h5>
                  </div>
                  <p data-about-value-desc="${desc}">${desc}</p>
                </div>
                <button class="position-absolute btn btn-close btn-about-value-close"></button>
              </div>`;
  }
  addValue(title, desc) {
    const s = this.aboutValueParser(title, desc);
    const valueRef = $.parseHTML(s);
    $(valueRef)
      .find(".btn-about-value-close")
      .on("click", function () {
        $(this).closest(".about-value").remove();
      });
    $("#about-values").append(valueRef);
  }
}
class Service {
  serviceDescEditor;

  prepare(service) {
    document
      .getElementById("service-carousel-chooser")
      .addEventListener("change", (e) => {
        $("#services #service-carousel-inner").html("");
        for (let index = 0; index < e.target.files.length; index++) {
          readFile(e.target.files[index]).then((base64) => {
            const slide = $.parseHTML(this.innerCarousel(base64, index));
            $("#services #service-carousel-inner").append(slide);
          });
        }
      });

    this.serviceDescEditor = new Quill(
      document.getElementById("service-desc"),
      quillOptions
    );
    this.serviceDescEditor.enable(true);

    processIcons.forEach((icon) => {
      $("#service-process-icons").append(
        $.parseHTML(
          `<option value="${icon.icon}" class="py-2">${icon.html}</option>`
        )
      );
    });

    document
      .getElementById("service-process-entry")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const title = $(
          "#service-process-entry input[name=service-process-title]"
        )
          .val()
          .trim();
        const icon = $(
          "#service-process-entry select[name=service-process-icons]"
        )
          .val()
          .trim();

        this.#prepareProcess(icon, title);

        document.getElementById("service-process-entry").reset();
      });

    // init
    if (service) {
      $("#services #service-short-desc").val(service.short_desc);
      $("#services #service-name").val(service.name);
      this.serviceDescEditor.root.innerHTML = service.desc;

      //inner carousel
      $("#services #service-carousel-inner").html("");
      for (let index = 0; index < service.image_urls.length; index++) {
        const slide = $.parseHTML(
          this.innerCarousel(service.image_urls[index], index)
        );
        $("#services #service-carousel-inner").append(slide);
      }
      //Process
      service.process.forEach((process) => {
        this.#prepareProcess(process.icon, process.title);
      });
    }
  }
  async exports() {
    // Prepare data;
    this.expData = {
      image_urls: (() => {
        let sources = [];
        $("#service-carousel-inner img").each(function () {
          sources.push($(this).attr("src"));
        });
        return sources;
      })(),
      name: $("#service-name").val().trim(),
      process: (() => {
        let processArray = [];
        $("#service-process-row [service-process]").each(function () {
          processArray.push({
            icon: $(this)
              .find("[service-process-icon]")
              .attr("service-process-icon"),
            title: $(this)
              .find("[service-process-title]")
              .attr("service-process-title")
              .trim(),
          });
        });
        return processArray;
      })(),
      desc: this.serviceDescEditor.root.innerHTML,
      short_desc: $("#service-short-desc").val().trim(),
    };

    // Upload images to server and store url
    try {
      for (let i = 0; i < this.expData.image_urls.length; i++) {
        const uploadResult = await prepareMedia(
          storageQuery,
          this.expData.image_urls[i],
          `service_${i}`
        );
        this.expData.image_urls[i] = await storageQuery.getURL(uploadResult);
        if (el) {
          el.progress(`Uploaded service(${i + 1}) image`);
        }
      }
    } catch {}
    return this.expData;
  }

  innerCarousel(base64, index) {
    return `<div class="carousel-item ${
      index == 0 ? "active" : ""
    }"><img src="${base64}" class="d-block w-100" alt="service-${index}"></div>
                    `;
  }

  htmlProcess(icon, title) {
    return `
    <div class="col-12 col-sm-6 col-lg-3 d-flex align-items-center position-relative" service-process>
      <div class="flex-shrink-0 text-accent-3" style="min-width: 42px;" >
          <i class="${icon} fs-1" service-process-icon="${icon}"></i>
      </div>
      <div class="flex-grow-1 ms-3">
          <h5 class="m-0" service-process-title="${title}">${title}</h5>
      </div>
      <button class="position-absolute btn btn-close btn-process-close"></button>
    </div>`;
  }

  #prepareProcess(icon, title) {
    const processHtml = $.parseHTML(this.htmlProcess(icon, title));
    $(processHtml)
      .find(".btn-process-close")
      .on("click", function () {
        $(this).closest("[service-process]").remove();
      });
    $("#service-process-row").append(processHtml);
  }
}
class Gallery {
  prepare(gallery) {
    document
      .getElementById("gallery-entry")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = $("#gallery-entry input[name=gallery-title]").val();
        const desc = $("#gallery-entry textarea[name=gallery-desc]").val();
        const file = $("#gallery-image-chooser")[0].files[0];

        const base64 = await readFile(file);
        this.#prepareGallery(title, desc, base64);
        document.getElementById("gallery-entry").reset();
      });

    if (gallery) {
      $("#gallery #gallery-short-desc").val(gallery.short_desc);

      //Grid
      gallery.images.forEach((g) => {
        this.#prepareGallery(g.title, g.desc, g.url);
      });
    }
  }
  async exports() {
    this.expData = {
      short_desc: $("#gallery-short-desc").val().trim(),
      images: (() => {
        let imgArray = [];
        $("#gallery-grid .grid-item").each(function () {
          imgArray.push({
            url: $(this).find("img").attr("src"),
            title: $(this)
              .find("[data-gallery-title]")
              .attr("data-gallery-title"),
            desc: $(this)
              .find("[data-gallery-desc]")
              .attr("data-gallery-desc")
              .trim(),
          });
        });
        return imgArray;
      })(),
    };
    for (let i = 0; i < this.expData.images.length; i++) {
      const uploadResult = await prepareMedia(
        storageQuery,
        this.expData.images[i].url,
        `gallery_${i}`
      );
      this.expData.images[i].url = await storageQuery.getURL(uploadResult);
      if (el) {
        el.progress(`Uploaded gallery(${i + 1}) image`);
      }
    }
    return this.expData;
  }
  htmlGrid(title, desc, base64) {
    return `<div class="grid-item position-relative" >
              <img loading="lazy" src="${base64}" >
              <span class="background-color"></span>
              <div class="img-overlay">
                  <article class="p-2">
                      <div class="title h5" data-gallery-title="${title}">${title}</div>
                      <div class="subtitle" data-gallery-desc="${desc}">${desc}</div>
                  </article>
              </div>
              <button class="position-absolute btn btn-close btn-gallery-close"></button>
          </div>`;
  }
  #prepareGallery(title, desc, base64) {
    const gallery = $.parseHTML(this.htmlGrid(title, desc, base64));
    $(gallery)
      .find(".btn-gallery-close")
      .on("click", function () {
        $(this).closest(".grid-item").remove();
      });
    $("#gallery-grid").append(gallery);
  }
}
class Partner {
  prepare(partner) {
    document
      .getElementById("partners-entry")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = $("#partners-entry input[name=partner-title]").val();
        const desc = $("#partners-entry textarea[name=partner-desc]").val();
        const file = $("#partner-image-chooser")[0].files[0];

        const base64 = await readFile(file);
        this.preparePartner(title, desc, base64);
        document.getElementById("partners-entry").reset();
      });

    //init
    if (partner) {
      $("#partner #partner-short-desc").val(partner.short_desc);

      partner.partners.forEach((p) => {
        this.preparePartner(p.title, p.desc, p.image_url);
      });
    }
  }
  async exports() {
    this.expData = {
      short_desc: $("#partner-short-desc").val().trim(),
      partners: (() => {
        let partnerList = [];
        $("#partners-list-ref [partner]").each(function () {
          partnerList.push({
            title: $(this)
              .find("[data-partner-title]")
              .attr("data-partner-title")
              .trim(),
            desc: $(this)
              .find("[data-partner-desc]")
              .attr("data-partner-desc")
              .trim(),
            image_url: $(this).find("img").attr("src"),
          });
        });
        return partnerList;
      })(),
    };

    for (let i = 0; i < this.expData.partners.length; i++) {
      const uploadResult = await prepareMedia(
        storageQuery,
        this.expData.partners[i].image_url,
        `partner_${i}`
      );
      this.expData.partners[i].image_url = await storageQuery.getURL(
        uploadResult
      );
      if (el) {
        el.progress(`Uploaded partner(${i + 1}) image`);
      }
    }

    return this.expData;
  }

  htmlPartner(title, desc, base64) {
    return `<div class="col">
          <div class="card card-body card-hover h-100 border-0 bg-primary bg-opacity-10 position-relative" partner>
            <button class="position-absolute btn btn-close btn-partner-close"></button>
            <img class="d-block mb-3" src="${base64}" alt="${title}">
            <h6 class="fw-bold" data-partner-title="${title}">${title}</h6>
            <p class="fs-sm mb-0" data-partner-desc="${desc}">${desc}</p>
          </div>
        </div>`;
  }
  preparePartner(title, desc, base64) {
    const col = $.parseHTML(this.htmlPartner(title, desc, base64));
    $(col)
      .find(".btn-partner-close")
      .on("click", function () {
        $(this).closest(".col").remove();
      });
    $("#partners-list-ref").append(col);
  }
}
class Quotation {
  prepare(quote) {
    $("#quotation-social-entry-add-btn").on("click", function () {
      if ($("#social-entry-list .input-group").length == social.length) return;
      const socialEntry = $.parseHTML(`<div class="input-group mb-2">
        <input type="text" class="form-control" placeholder="Url" data-quotation-social-url>
        <select class="form-select" data-quotation-social-type>
            <option selected disabled>Choose...</option>
           ${social.map((s) => {
             return `<option value="${s.icon}">${s.title}</option>`;
           })}
        </select>
        <button class="btn btn-close m-auto p-1"></button>
      </div>`);
      $(socialEntry)
        .find(".btn-close")
        .on("click", function () {
          $(this).closest(".input-group").remove();
        });
      $("#social-entry-list").append(socialEntry);
    });

    $("#quotation-email-value").on("change", function () {
      $("footer #footer-email").text($(this).val());
      $("footer #footer-email").attr("href", `mailto:${$(this).val()}`);
    });
    $("#quotation-phone-primary").on("change", function () {
      $("footer #footer-phone").text($(this).val());
      $("footer #footer-phone").attr("href", `tel:${$(this).val()}`);
    });

    if (quote) {
      $("#quotation-short-desc").val(quote.desc);
    }
  }
  exports() {
    return {
      desc: $("#quotation-short-desc").val().trim(),
    };
  }
}
class Footer {
  prepare(footer, contact) {
    if (footer && contact) {
      $("#footer-company-desc").val(footer.desc);
      const auther = $.parseHTML(
        `<a href="login.html" class="text-decoration-none text-reset admin-link ">${contact.company}</a>`
      );

      $("footer #copyright-txt").append(auther);
      $("footer #copyright-txt").append(" All Rights Reserved");
      $("footer #footer-company-address").val(contact.address);
    }
  }
  exports() {
    return {
      desc: $("#footer-company-desc").val().trim(),
    };
  }
}
class Contact {
  prepare(contact) {
    if (contact) {
      //email
      $("#quotation-email-title").val(contact.email.title);
      $("#quotation-email-desc").val(contact.email.desc);
      $("#quotation-email-value").val(contact.email.value.data);
      $("#quotation-email-value").trigger("change");

      //phone
      $("#quotation-phone-title").val(contact.phone.title);
      $("#quotation-phone-desc").val(contact.phone.desc);
      contact.phone.values.forEach((p, i) => {
        $(`#quotation-phone-${i == 0 ? "primary" : "secondary"}`).val(p.data);
        $(`#quotation-phone-${i == 0 ? "primary" : "secondary"}`).trigger(
          "change"
        );
      });

      //social
      $("#quotation-social-title").val(contact.social.title);
      $("#quotation-social-desc").val(contact.social.desc);

      contact.social.values.forEach((svalue, i) => {
        const socialEntry = $.parseHTML(`<div class="input-group mb-2">
        <input type="text" value="${
          svalue.data
        }" class="form-control" placeholder="Url" data-quotation-social-url >
        <select class="form-select" data-quotation-social-type>
            <option selected disabled>Choose...</option>
           ${social.map((s) => {
             return `<option value="${s.icon}" ${
               s.icon == svalue.icon ? "selected" : ""
             }>${s.title}</option>`;
           })}
        </select>
        <button class="btn btn-close m-auto p-1"></button>
      </div>`);
        $(socialEntry)
          .find(".btn-close")
          .on("click", function () {
            $(this).closest(".input-group").remove();
          });
        $("#social-entry-list").append(socialEntry);
      });
    }
  }
  exports() {
    const name = ["official", "nickname"];
    let names = $("#hero-name").val().trim().split(",");
    let exp = {
      email: {
        icon: "bi bi-envelope-fill",
        value: {
          icon: "bi bi-send",
          data: $("#quotation-email-value").val().trim(),
        },
        desc: $("#quotation-email-desc").val().trim(),
        title: $("#quotation-email-title").val().trim(),
      },
      phone: {
        icon: "bi bi-headset",
        title: $("#quotation-phone-title").val().trim(),
        desc: $("#quotation-phone-desc").val().trim(),
        values: [
          {
            icon: "bi bi-phone",
            data: $("#quotation-phone-primary").val().trim(),
          },
          {
            icon: "bi bi-telephone",
            data: $("#quotation-phone-secondary").val().trim(),
          },
        ],
      },
      social: {
        title: $("#quotation-social-title").val().trim(),
        icon: "bi bi-globe",
        desc: $("#quotation-social-desc").val().trim(),
        values: (() => {
          let socialArray = [];
          $("#social-entry-list .input-group").each(function () {
            socialArray.push({
              data: $(this).find("[data-quotation-social-url]").val().trim(),
              icon: $(this).find("[data-quotation-social-type]").val().trim(),
            });
          });
          return socialArray;
        })(),
      },
      address: $("#footer-company-address").val().trim(),
      official: "",
      nickname: "",
      auther: "Kyaw Thu Myint",
      company: "Cable Detection",
    };
    names.forEach((n, i) => {
      exp[name[i]] = n;
    });
    return exp;
  }
}

function insertImage(base64, dropzoneSingleRef) {
  let imageContainer = document.createElement("div");
  imageContainer.classList.add(
    "dz-preview-cover",
    "dz-processing",
    "dz-image-preview"
  );
  imageContainer.innerHTML = `
                <img class="dz-preview-img" src="${base64}">
        `;
  let preview = dropzoneSingleRef.querySelector(
    "div.dz-preview.dz-preview-single"
  );
  preview.innerHTML = "";
  preview.appendChild(imageContainer);
  dropzoneSingleRef.classList.add("dz-max-files-reached");
}

async function init() {
  let data = {};
  await firebaseInit.onFirstData("page", []).then((snapshot) => {
    snapshot.docs.forEach((doc, i) => {
      data[doc.id] = doc.data();
    });
  });
  return data;
}
