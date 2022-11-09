import "../auth/login.scss";
import { FirebaseInit } from "../utility/firebase";
import { dialog } from "../utility/main";

window.onload = () => {
  $("#signup_form").on("submit", signin);
};

async function signin(event) {
  event.preventDefault();
  const firebase = new FirebaseInit();
  const email = $("#signup_form input[name=email]").val();
  const password = $("#signup_form input[name=password]").val();

  firebase
    .signIn(email, password)
    .then(() => {
      window.location.replace("quote.html");
    })
    .catch((error) => {
      dialog("User not found","Please try again",()=>{},[{title:'OK',value:'ok',priority:'primary'}]).showModal();
    });
}
