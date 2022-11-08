import "../auth/login.scss";
import { FirebaseInit } from "../utility/firebase";
  console.log("init login");

window.onload = () => {
  $("input[name=name]").val("khinemyaezin");
  $("input[name=email]").val("admin@cs.com");
  $("input[name=password]").val("admin@123");

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
      alert(error);
    });
}
