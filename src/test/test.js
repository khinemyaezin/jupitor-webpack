import { FirebaseInit } from "../utility/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import StorageQuery from "../utility/storage-query";
import { getBase64Image, isBase64 } from "../utility/main";
import "jquery";

(async function () {
  const firebase = new FirebaseInit();
  const storageRef = new StorageQuery(firebase);
  const information = {
    section_hero: {
      title: "cable detection",
      pitch:
        "We provide a high quality product in a very efficient amount of time without the high cost of some competitors",
      image_url:
        "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/hero.jpg?alt=media&token=c7b35be8-d456-4572-8322-2e2ac1063645",
    },
    section_about: {
      values: [
        {
          title: "Education",
          desc: "B.Sc Const: Mgnt: (HWU,UK), SDip: Architectural Tech:, Dip CE LCDW, TCDW, CPUL",
        },
        {
          title: "Responsibility",
          desc: "Responsibilities in the workplace are duties that an individual or department carries out on a regular basis. When an employee or manager is responsible for a task, you can hold them accountable in case the task isn't carried out or praise them for a job well done.",
        },
        {
          title: "Experiences",
          desc: "Work experience should give you: an understanding of the work environment and what employers expect of their workers. an opportunity to explore possible career options. increased self-understanding, maturity, independence and self-confidence.",
        },
      ],
      project: {
        count: "123",
        title: "Successful projects",
      },
      description:
        "<h1><strong>Your One-stop Solution to Effective Underground Cables &amp; Utilities Detection</strong></h1><p>CDSE is a recognized leader in Cable Detection and Civil works in the Construction and Engineering industry. We are committed to delivering technical expertise with integrity, honesty and without compromising on safety and regulatory standards.</p>",
      image_url:
        "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/about.jpg?alt=media&token=e53b911d-0153-46ad-b5b0-7e15c00a0472",
    },
    section_gallery: {
      short_desc:
        "Our Team has worked on sites all around Sydney and NSW from small scaled jobs for independent plumbers to large scale government infrastructure projects, no job is too big or too small.",
      images: [
        {
          url: "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/gallery_0..jpeg?alt=media&token=53560470-f7f6-49c2-a1be-acae3241ef0b",
          title: "gallery 3",
          desc: "gallery 3",
        },
        {
          url: "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/gallery_1..jpeg?alt=media&token=3b5385fe-a1f1-4ab1-a1a0-90eacf72c6c0",
          title: "gallery 2",
          desc: "gallery 2",
        },
        {
          url: "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/gallery_2..jpeg?alt=media&token=9546d3a9-6eb7-4856-8939-8436ffcde61c",
          title: "1",
          desc: "here",
        },
      ],
    },
    section_service: {
      image_urls: [
        "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/service-1.jpg?alt=media&token=038540fa-b3b0-436e-98d9-c0059df78b2f",
        "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/service-2.jpg?alt=media&token=f34baaa8-041e-4228-b1c8-74f5f57c0daa",
        "http://localhost:9199/v0/b/jupitor2-webpack.appspot.com/o/service-3.jpg?alt=media&token=5a1c02aa-25be-4af8-a86b-9201fbd94cee",
      ],
      name: "Cable detection",
      process: [
        {
          icon: "bi bi-chat-left-fill",
          title: "Quotation",
        },
        {
          icon: "bi bi-check-square-fill",
          title: "Job Confirmation",
        },
        {
          icon: "bi bi-pencil-fill",
          title: "Plan Application",
        },
        {
          icon: "bi bi-cone-striped",
          title: "Construction",
        },
      ],
      desc: "<p><strong>Underground cables and pipes are</strong>&nbsp;one of the things that enables telecommunication, power transmission, as well as an undisrupted flow of clean water supplies to every household and commercial building.</p><p><strong>Cable Detection</strong>&nbsp;is conducted by a Licensed Cable Detection Worker (LCDW) with a set of instrument or locator to detect the presence and approximate location of an underground cable or pipe. This serves as an indicator that the cable or pipe is located nearby on site, and to proceed with care and caution.</p>",
      short_desc:
        "Years of experience in the industry along with partnerships with many major corporations.",
    },
    section_partner: {
      short_desc:
        "We are honored to have the opportunity to work with various partners and clients across different sectors and all walks of life. We are always open to new partnerships and provide our expertise to support your firm to achieve greater heights.",
      partners: [
        {
          title: "Gims & Associates Pte Ltd",
          desc: "M&E Consultancy for Building · Fire Safety Engineering · Green Mark Consultant",
          image_url: "",
        },
        {
          title: "Shimizu Corporation Singapore",
          desc: "Projects · Office · Medical and Welfare · Educational and Cultural · Residential ·",
          image_url: "",
        },
        {
          title: "Singapore Food Agency",
          desc: "SFA is the national authority entrusted with the mission to ensure a resilient supply of food safety.",
          image_url: "",
        },
      ],
    },
    section_quotation: {
      desc: "We are honored to have the opportunity to work with various partners and clients across",
    },
    section_footer: {
      desc: "",
    },
    contact: {
      email: {
        icon: "bi bi-envelope-fill",
        value: {
          icon: "bi bi-send",
          data: "cabledetection@gmail.com",
        },
        desc: "Please feel free to drop us a line. We will respond as soon as possible.",
        title: "Email us",
      },
      phone: {
        icon: "bi bi-headset",
        title: "Call us",
        desc: "Please feel free to drop us a line. We will respond as soon as possible.",
        values: [
          {
            icon: "bi bi-phone",
            data: "9777 4459",
          },
          {
            icon: "bi bi-telephone",
            data: "09423725185",
          },
        ],
      },
      social: {
        title: "Social media",
        icon: "bi bi-globe",
        desc: "Please feel free to drop us a line. We will respond as soon as possible.",
        values: [
          {
            data: "www.facebook.com",
            icon: "bi bi-facebook",
          },
          {
            data: "www.linkedin.com",
            icon: "bi bi-linkedin",
          },
          {
            data: "www.whatsapp.com",
            icon: "bi bi-whatsapp",
          },
        ],
      },
      address: "",
    },
  };
  // for (const key in information) {
  //   const ref = doc(firebase.getDb, "page", key);
  //   setDoc(ref, information[key], { merge: true })
  //     .then(() => {
  //       console.log("success");
  //     })
  //     .catch((e) => console.log(e));
  // }
  // }
  // const ref = doc(firebase.getDb, "page", 'section');
  // setDoc(ref, { hi: 'hello'}, { merge: true })
  //   .then(() => {
  //     console.log("success");
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });

  const base64 = "data:image/png;base64,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";
  const url = "http://127.0.0.1:9199/v0/b/jupitor2-webpack.appspot.com/o/gallery_0..jpeg?alt=media&token=5db095f1-07fc-4cfc-b2a0-26bdfa52facc";
  const asset = 'assets/image.jpg'
  // const regex = new RegExp('([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?');
  // console.log(regex.exec(url));
  // console.log(regex.exec(base64));
  console.log(isBase64(base64));

})();
