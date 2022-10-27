import "../auth/signup.scss";
import {FirebaseInit} from '../utility/firebase';

const firebase = new FirebaseInit();

window.onload = () => {
  $("input[name=name]").val("khinemyaezin");
  $("input[name=email]").val("khinemyaezin@gmail.com");
  $("input[name=password]").val("kmz@123!@#");

  $("#signup_form").on("submit", signup);
};

async function signup(event) {
  event.preventDefault();
  const email = $("#signup_form input[name=email]").val();
  const password = $("#signup_form input[name=password]").val();

  firebase.signUp(email, password).then(
    user=>{
        console.log( firebase.getCurrentuser );
    }
  ).catch(error=>{
    alert(error)
  })
}
