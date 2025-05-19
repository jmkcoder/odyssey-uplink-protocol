import { FormController } from "../../../../form-controller/dist/index.js";
import { useUplink, ControllerAdapter } from "../../../dist/index.js";

const formConfig = {
  steps: [
    {
      id: "contact",
      title: "Contact Information",
      fields: {
        name: {
          id: "name",
          value: "",
          label: "Full Name",
          type: "text",
          required: true,
        },
        email: {
          id: "email",
          value: "",
          label: "Email Address",
          type: "email",
          required: true,
          validation: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessages: {
              pattern: "Invalid email format",
            },
          },
        },
        message: {
          id: "message",
          value: "",
          label: "Message",
          type: "textarea",
          required: true,
        },
      },
    },
  ],
};

// Initialize the form controller
const controller = FormController(formConfig);

// Create a controller adapter for reactive UI updates
export const adapter = new ControllerAdapter(controller);

// Set up enhanced uplink bindings
export const { state, methods } = useUplink(controller, {
  trackBindings: "all",
});
