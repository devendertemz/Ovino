import { Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

export const ovnioColors = {
  //white
  white: "#ffff",
  text: "#ffff",
  txtOffWhite: "#7E7F83",

  //black
  POPUP_BG_TRANS: "rgba(66, 66, 6D, 1)",
  background: "#141519",
  blackContainerBg: "#3d3e42", //#28292e , #3d3e42 , #525357 ---> more gray
  blackInputBg: "#232429",
  blackInputBorder: "#303035",
  blackPlugrBg: "#000000",

  //gray
  grayIconColor: "#7C7C87", //#666873,#565C65 ------> more gray
  grayRemoteBg: "#373d4a",
  grayDot: "#3e4652",
  grayDesc: "#c7c8ca",
  grayLoopzInActiveColor: "#A7A6A6",

  //red | orange
  primaryRed: "#FBB231", //#DD003D , "#FBB231"
  Remote_Red_Trans: "rgba(251,178,49,0.3)",
  androidBgRemoteColor: "rgba(251,178,49,0.85)",

  //green
  greenOnline: "#0FE16D",

  //misc
  inputBackground: "#333",
  textSecondary: "#999",
  fbBg: "#3b5998",
  googlePlusBg: "#db4437",
  pinkMsg: "#C972D2",
  purpleDVR: "#7088D2",
  blueTravel: "#0CBDCC",
  yellowFood: "#CDC771",
};
export const fonts = {
  black: "Gilroy-Black",
  bold: "Gilroy-Bold",
  heavy: "Gilroy-Heavy",
  medium: "Gilroy-Medium",
  regular: "Gilroy-Regular",
  thin: "Gilroy-Thin",
  ultraLight: "Gilroy-UltraLight",
};

//iPhoneSE 4.7-inch
//iphone 15 6.1-inch
//iPad mini 8.3 inches

//height : 852  : 1, 2, 3, 4, 6, 12, 71, 142, 213, 284, 426, 852
//width  : 393  : 1, 3, 131, 393.
export const scaleXiPhone15 = {
  //height
  oneH: height * 0.00117370892,
  twoH: height * 0.00234741784,
  threeH: height * 0.003521126761,
  fourH: height * 0.004694835681,
  sixH: height * 0.007042253521,
  eightH: height * 0.009389671362,
  tenH: height * 0.0117370892,
  twelveH: height * 0.01408450704,
  fouteenH: height * 0.01643192488,
  sixteenH: height * 0.01877934272,
  eightteenH: height * 0.02112676056,
  twentyH: height * 0.04694835681 * 0.5,
  twentyFourH: height * 0.02816901408,
  twentyEightH: height * 0.03286384977,
  thrityH: height * 0.04694835681 * 0.75,
  thrityTwoH: height * 0.03755868545,
  thrityFourH: height * 0.03990610329,
  fortyH: height * 0.04694835681,
  fivtyH: height * 0.05868544601,
  fivtySixH: height * 0.06572769953,
  sixtyH: height * 0.04694835681 * 0.75 * 2,
  seventyH: height * 0.08215962441,
  sixtyEightH: height * 0.07981220657,
  eightyH: height * 0.04694835681 * 2,
  ninetyFourH: height * 0.1103286385,
  hundredH: height * 0.117370892,
  hundredTwentyH: height * 0.1408450704,
  hundredFiftyH: height * 0.176056338,
  hundredSixtyH: height * 0.1877934272,
  twoHundredH: height * 0.234741784,
  twoHundredFiftyH: height * 0.29342723,
  twoHundredNinetyOne: height * 0.3415492958,
  threeHunderd: height * 0.3521126761,

  //Width
  oneW: width * 0.002544529262,
  twoW: width * 0.005089058524,
  threeW: width * 0.007633587786,
  fourW: width * 0.01017811705,
  eightW: width * 0.0203562341,
  tenW: width * 0.02544529262,
  twelveW: width * 0.03053435115,
  fouteenW: width * 0.03562340967,
  sixteenW: width * 0.04071246819,
  eightteenW: width * 0.04580152672,
  twentyW: width * 0.05089058524,
  twentyFourW: width * 0.06106870229,
  thrityW: width * 0.07633587786,
  fortyW: width * 0.07633587786 * 1.3333333333,
  sixtyW: width * 0.07633587786 * 2,
  eightyW: width * 0.07633587786 * 1.3333333333 * 2,
  hundredW: width * 0.2544529262,
  hundredTwentyW: width * 0.3053435115,
  hundredFiftyW: width * 0.3816793893,
  hundredSixtyW: width * 0.4071246819,
  hundredEightyW: width * 0.4580152672,
  twoHundredW: width * 0.5089058524,
};
export const checkForTablet = () => {
  // const isTablet = aspectRatio < 1.6; // Assumes 4:3 aspect ratio for tablets
  // const isSmallDevice = width < 375; // Assumes iPhone 6/7/8 width as small device
  const aspectRatio = height / width;
  const isTablet = aspectRatio < 1.6;
  return isTablet;
};
export const appSize = {
  forty: 40,
  fortyFour: 44,
  fifty: 50,
  thirtySex: 36,
  thirtyTwo: 32,
  thirty: 30,
  twentyFive: 25,
  twentyTwo: 22,
  twenty: 20,
  eighteen: 18,
  sixteen: 16,
  fourteen: 14,
  twelve: 12,
  ten: 10,
  eight: 8,
  five: 5,
  four: 4,
  two: 2,
  one: 1,
};

export const APP_SCREEN = {
  LOOPZ_HOME_TABBAR: "LOOPZ_HOME_TABBAR",
  LOOPZ_FOLLOWERS: "LOOPZ_FOLLOWERS",
  LOOPZ_FOLLOWING: "LOOPZ_FOLLOWING",
  LOOPZ_POSTCOMMENT: "LOOPZ_POSTCOMMENT",
  APP_SELECTMODAL: "APP_SELECT_MODAL",
  APP_VERIFY_CODE: "APP_VERIFY_CODE",
  APP_REG_PREF: "APP_REG_PREF",
  APP_SPLASH_OPTION: "APP_SPLASH_OPTION",
  APP_SUB_ALERT: "APP_SUB_ALERT",
  LOOPZ_SHARE: "LOOPZ_SHARE",
  LOOPZ_TOAST_MSG: "LOOPZ_TOAST_MSG",
  LOOPZ_DM: "LOOPZ_DM",
};
