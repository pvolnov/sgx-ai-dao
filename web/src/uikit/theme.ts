export const getVar = (v: string) => {
  const style = getComputedStyle(document.body);
  return style.getPropertyValue(v.replace("var(", "").slice(0, -1));
};

export const colors = {
  border: "var(--Stroke)",

  borderHight: "var(--Border-High)",
  borderLow: "var(--Border-Low)",
  borderLowest: "var(--Border-Lowest)",

  elevation0: "var(--Elevation-0)",
  elevation1: "var(--Elevation-1)",
  elevation2: "var(--Elevation-2)",
  blackPrimary: "var(--Black-Primary)",
  blackSecondary: "var(--Black-Secondary)",
  green: "var(--Green-Classic)",
  red: "var(--Red-Primary)",

  orange: "var(--Orange-Primary)",
  orange_30: "var(--Orange-30)",

  warningAlpha: "var(--Orange-Warning-Alpha)",
  warning: "var(--Orange-Warning)",
  warning_warning: "var(--Orange-Warning-Warning)",
  pink: "var(--Pink-Primary)",

  yellow: "var(--Yellow-Primary)",
  yellow_40: "var(--Yellow-40)",

  white: "var(--White-Primary)",

  blue: "var(--Blue-Primary)",
  blueSecondary: "var(--Blue-Secondary)",

  tertiary: "var(--Tertiary)",
  tertiary_1: "var(--Tertiary-1)",
  tertiary_3: "var(--Tertiary-3)",

  controlsDarkDark: "var(--Controls-Dark-Dark)",

  hotLow: "var(--Hot-Progress-low)",
  hotHigh: "var(--Hot-Progress-high)",

  greenAlpha: "var(--Green-Alpha)",
  greenBorder: "var(--Green-Secondary)",
  redAlpha: "var(--Red-Alpha)",

  greenText: "var(--Green-Text)",
  greenTransparent: "var(--Green-Transparent)",

  disableButton: "var(--Disabled-Button)",
  darkDark: "var(--Dark-Dark)",

  containerLow: "var(--Container-low)",
  surfaceCommonDefault: "var(--Surface-common-default)",
  surfaceCommonContainerLow: "var(--Surface-common-container-low)",

  controlsSecondary: "var(--Controls-Secondary)",

  iconSecondary: "var(--Icon-Secondary)",

  shadowStroke: "var(--Shadow-stroke)",

  score: "var(--Score)",
};

export const oldColors = {
  border: "#C7BAB8",
  elevation0: "#F3EBEA",
  elevation1: "rgb(235, 222, 220)",
  elevation2: "#D9CDCB",
  blackPrimary: "#2c3034",
  blackSecondary: "#6B6661",
  green: "rgba(8, 113, 100, 1)",
  red: "#D63E3E",
  orange: "#FDBF1E",
  warning: "#DB8520",
  pink: "rgba(253, 132, 227, 1)",
  yellow: "#FCE823",
  white: "#fff",

  blue: "#0258F7",
  blueSecondary: "#95A7E8",

  tertiary: "#B4AFAE",

  greenAlpha: "#ACC4BF",
  redAlpha: "rgba(214, 62, 62, 0.15)",
};

export const fonts = {
  mainFont: "var(--main-font)",
  headlineFont: "var(--headline-font)",
};
