import LocalizedStrings from "react-native-localization";

export default TextStrings = new LocalizedStrings({
  en: {
    //#region appIntro
    titleOne: "Yes! We Hear You",
    descOne:
      "Chromecast is here. Now cast your favourite PLUGR videos on your tv screen.",
    titleTwo: "Your Favorite",
    descTwo: "Blockbuster movies, Entertainment loaded!",
    titleThree: "Watch All Your Favorite",
    descThree: "Live sport at one place.",
    //#endregion

    //#region auth
    search: "search",
    otpVerifiedSuccess: "OTP verified and User Registerd  successfully",
    SelectCountry: "Select Country",
    countryCodeMsg: "Please select country code.",
    validNameMsg: "Full name must only contain alphabetic characters.",
    Logout: "Turn off Plugr",
    sureLogout: "Would you like to Turn off Plugr ?",

    //reg
    register: "Register",
    fullName: "Full Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    continue: "Continue",
    signin: "Sign in",
    alreadyOvinoMember: "Already a Plugr member?",
    genderMsg: "Please select gender.",
    countryMsg: "Please select country.",
    ethnicityMsg: "Please select Ethnicity.",
    orientationMsg: "Please select Orientation.",
    smokerMsg: "Please select Smoker type.",
    drinkMsg: "Please select Preferred Drink.",
    dobMsg: "Please select DOB",
    alertUserName: "Please enter user name",
    alertUserType: "Please select user type",

    //#endregion

    //#region Tabs
    tvShows: "TV Shows",
    channelGuide: "Channel Guide",
    //#endregion

    //#region Parental Ctrl
    setThePin: "Set the Pin",

    //#endregion

    //#region ChannelCat - ChannelCategories.js
    filter: "Filter",
    chooseCategorywhichyouwanttowatch:
      "Choose Category which you want to watch",
    channelNo: "CHANNEL NO",
    FILTER: "FILTER",
    RESET: "RESET",
    //#endregion

    //#region Profile
    profile: "Profile",
    blockedChannels: "Blocked Channels",
    parentalChannels: "Parental Control",
    reminders: "Reminders",
    favorite: "Favorite",
    notification: "Notification",
    setting: "Setting",
    gallery: "Gallery",
    camera: "Camera",
    unlockAll: "Unlock All",
    unblockAll: "Unblock All",
    unblock: "Unblock",
    unlock: "Unlock",
    changePin: "Change Pin",
    Dashboard: "Dashboard",
    UsefulLinks: "Useful Links",
    //reminder
    delAllReminder: "Delete All Reminders",
    dellReminderConfirm: "Are you sure you want to delete all reminders ?",
    //#endregion

    //#region Channel block
    blockThisChannel: "Block this Channel",
    unblockThisChannel: "Unblock this Channel",
    pinIsSuccessfullySet: "PIN is successfully set!",
    enterThePin: "Enter the pin",
    unlockChnnel: "Unlock Channel",
    //#endregion

    //#region Delete not
    delAllNotifications: "Delete All Notifications",
    dellNotificationConfirm:
      "Are you sure you want to delete all Notifications ?",
    //#endregion

    //#region Auth -- Alert
    fullNameMsg: "Please enter full name.",
    phoneNumberMsg: "Please enter your mobile number.",
    validPhoneNumberMsg: "Please enter a valid phone number.",
    emailMsg: "Please enter your email address.",
    emailInvalidMsg: "Please enter valid email address",
    emailOrPhoneNumberMsg: "Please enter your email",
    emailOrValidPhoneNumberMsg:
      "Please enter a valid phone number of 10 digits or email address.",
    passwordMsg: "Please enter your password.",
    passwordformate: "a letter, a number and a symbol",
    alertPassAllowedSpecialChar:
      "Symbols allowed @,$,!,%,*,#,?,& (No other symbol allowed)",
    Minimum8characters: "The password should be at least Minimum 8 characters",
    alertConfirmPassword: "confirm password should be same as password",
    //verify OTP
    Pleaseenterthefourdigitcodesentto:
      "Please enter the four-digit code sent to ",
    otpMsg: "OTP is required field.",
    validotpMsg: "Please enter a valid 4  digits.",
    otpResend: "OTP Resend successfully",
    newPasswordMsg: "Please enter new password.",
    //#endregion

    //#region profile - Alert
    selProfilePic: "Select profile picture",
    alertPin: "Please enter 4 digit pin",
    //#endregion

    //#region ChannelDetail - Alert | HomeDetails.js
    alertReminderSuccess: "Reminder added successfully",
    //#endregion
  },
  it: {
    //#region appIntro
    titleOne: "SÌ! Ti ascoltiamo",
    descOne:
      "Chromecast è qui. Ora trasmetti i tuoi video OVNIO preferiti sullo schermo della TV.",
    titleTwo: "Il tuo preferito",
    descTwo: "Film di successo, intrattenimento carico!",
    titleThree: "Guarda tutti i tuoi preferiti",
    descThree: "Lo sport dal vivo in un unico posto.",
    //#endregion

    how: "Come vuoi il tuo uovo oggi?",
    lang: "italian",
  },
  fr: {
    how: "Comment voulez-vous votre œuf aujourd hui ?",
    lang: "French",
  },
  es: {
    how: "'¿Cómo quieres tu huevo hoy?'",
    lang: "Spanish",
  },
  de: {
    how: "Wie möchtest du dein Ei heute?",
    lang: "German",
  },
});
