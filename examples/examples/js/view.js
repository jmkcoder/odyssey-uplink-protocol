import { state, methods, adapter } from "./controller.js";

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
const submitButton = document.querySelector("#submit");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const messageError = document.querySelector("#message-error");

// Subscribe to state changes to update UI
adapter.watchProperty("formData", (formData) => {
  console.log("Form data updated:", formData);
    // Sync input values (only if not focused)
  if (document.activeElement !== nameInput) {
    console.log('Name input value updated:', formData.contact?.name);
    nameInput.value = formData.contact?.name || "";
  }

  if (document.activeElement !== emailInput) {
    emailInput.value = formData.contact?.email || "";
  }

  if (document.activeElement !== messageInput) {
    messageInput.value = formData.contact?.message || "";
  }
});

adapter.watchProperty("fieldErrors", (fieldErrors) => {
  // Show error errorMessages
  nameError.textContent = fieldErrors.contact?.name || "";
  nameError.style.display = nameError.textContent ? "block" : "none";

  emailError.textContent = fieldErrors.contact?.email || "";
  emailError.style.display = emailError.textContent ? "block" : "none";

  messageError.textContent = fieldErrors.contact?.message || "";
  messageError.style.display = messageError.textContent ? "block" : "none";
});

// Input event listeners update controller state
nameInput.addEventListener("input", (e) => {
  methods.updateField("contact", "name", e.target.value);
});

emailInput.addEventListener("input", (e) => {
  methods.updateField("contact", "email", e.target.value);
});

messageInput.addEventListener("input", (e) => {
  methods.updateField("contact", "message", e.target.value);
});
