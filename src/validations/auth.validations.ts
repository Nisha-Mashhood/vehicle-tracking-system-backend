import * as Yup from "yup"

export const registerSchema = Yup.object({

  firstName: Yup.string()
    .required("First name is required")
    .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .test(
      "no-multiple-spaces",
      "Cannot contain multiple spaces",
      value => !/\s{2,}/.test(value || "")
    )
    .test(
      "no-start-special",
      "Cannot start with special character",
      value => !/^[^A-Za-z0-9]/.test(value || "")
    )
    .test(
      "no-excessive-repeat",
      "Character repeated too many times",
      value => !/(.)\1{3,}/.test(value || "")
    ),

  lastName: Yup.string()
    .required("Last name is required")
    .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
    .min(3)
    .max(50),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100)
    .test(
      "no-uppercase-email",
      "Email must not contain uppercase letters",
      value => !/[A-Z]/.test(value || "")
    ),

  password: Yup.string()
    .required("Password is required")
    .min(8)
    .max(20)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Must include uppercase, lowercase, number, special char"
    )
    .test(
      "no-repeat-digits",
      "Repeated digits not allowed",
      value => !/(\d)\1{2,}/.test(value || "")
    )
    .test(
      "no-repeat-letters",
      "Repeated letters not allowed",
      value => !/([A-Za-z])\1{2,}/.test(value || "")
    )

})

export const loginSchema = Yup.object({

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),

  password: Yup.string()
    .required("Password is required")

})