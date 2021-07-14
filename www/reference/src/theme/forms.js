export default {
  invalidInput: {
    color: "dark",
    backgroundColor: "lightest",

    border: 0,
    outline: 0,

    cursor: "text",
    transition: "all 0.2s ease",

    borderRadius: "3px",
    boxShadow: "invalidBoxShadow",
    "&.tag__focus": {
      boxShadow: "inputBoxShadowHover",
    },
    "&:focus": {
      boxShadow: "inputBoxShadowHover",
    },
    "&::placeholder": {
      color: "danger",
    },
  },
  input: {
    color: "dark",
    backgroundColor: "lightest",

    border: 0,
    outline: 0,

    cursor: "text",
    transition: "all 0.2s ease",

    borderRadius: "3px",
    boxShadow: "inputBoxShadow",
    "&.tag__focus": {
      boxShadow: "inputBoxShadowHover",
    },
    "&:focus": {
      boxShadow: "inputBoxShadowHover",
    },
    "&::placeholder": {
      color: "placeholder",
    },
  },
  textarea: {
    color: "dark",
    backgroundColor: "lightest",

    border: 0,
    outline: 0,

    cursor: "text",
    transition: "all 0.2s ease",

    borderRadius: "3px",
    boxShadow: "inputBoxShadow",
    "&.tag__focus": {
      boxShadow: "inputBoxShadowHover",
    },
    "&:focus": {
      boxShadow: "inputBoxShadowHover",
    },
    "&::placeholder": {
      color: "placeholder",
    },
  },
  dropdown: {
    color: "dark",
    backgroundColor: "lightest",

    border: 0,
    outline: 0,

    paddingTop: "3px",
    paddingBottom: "3px",

    cursor: "pointer",

    borderRadius: "3px",
    boxShadow: "buttonPrimaryBoxShadow",

    "&:hover": {
      color: "darkest",
      boxShadow: "buttonPrimaryBoxShadowHover",
    },

    "&:active": {
      boxShadow: "buttonPrimaryBoxShadowActive",
    },
  },
}
