module.exports = {
  plain: {
    color: "#ffffff",
    backgroundColor: "#1b2b34",
  },
  styles: [
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ["punctuation"],
      style: {
        color: "#5FB3B3",
      },
    },
    {
      types: ["parameter"],
      style: {
        color: "#EB9A6D",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "rgb(101, 115, 126)",
        fontStyle: "italic",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "rgb(205, 211, 222)",
      },
    },
    {
      types: ["string"],
      style: {
        color: "#99C794",
      },
    },
    {
      types: ["operator", "constant"],
      style: {
        color: "rgb(95, 179, 179)",
      },
    },
    {
      types: ["keyword", "builtin", "number", "char"],
      style: {
        color: "#C5A5C5",
      },
    },
    {
      types: ["tag", "deleted"],
      style: {
        color: "rgb(237, 111, 125)",
      },
    },
    {
      types: ["function"],
      style: {
        color: "rgb(90, 155, 207)",
      },
    },
    {
      types: ["symbol", "inserted"],
      style: {
        color: "rgb(153, 199, 148)",
      },
    },
    {
      types: ["class-name", "changed"],
      style: {
        color: "rgb(250, 200, 99)",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "rgb(187, 128, 179)",
        fontStyle: "italic",
      },
    },
  ],
}
