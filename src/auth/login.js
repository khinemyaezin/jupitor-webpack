import "../auth/login.scss";
import {FirebaseInit} from '../utility/firebase';
import {
  runHeaderControl,
} from "../utility/main";

const firebase = new FirebaseInit();

firebase.signOut();

window.onload = () => {
  runHeaderControl();
  $("input[name=name]").val("khinemyaezin");
  $("input[name=email]").val("khinemyaezin@gmail.com");
  $("input[name=password]").val("kmz@123!@#");

  $("#signup_form").on("submit", signin);
};

async function signin(event) {
  event.preventDefault();
  const email = $("#signup_form input[name=email]").val();
  const password = $("#signup_form input[name=password]").val();

  firebase
    .signIn(email, password)
    .then(() => {
      window.location.replace("/quote.html");

    })
    .catch((error) => {
      alert(error);
    });
}
