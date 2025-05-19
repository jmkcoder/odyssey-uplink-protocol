import { methods } from "./controller.js";
import "./view.js";

const form = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const result = methods.submitForm();

  if (result.success) {
    console.log("Form data:", result.data);
    // Display success message
    successMessage.classList.remove("hidden");
  } else {
    console.error("Form validation failed:", result.errors);
  }
});
