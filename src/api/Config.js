import { useEffect, useState } from "react";
import { showMsgAlert } from "../utils/Alert";
import Validation from "../utils/Validation";

export const HttpRequestBaseURLConfig = {
  baseURLHost: "https://ovniobackend.azurewebsites.net/api/",
  baseSocketURL: " https://ovniobackend.azurewebsites.net/sockets",
  appVersion: "Version : 1.0 [44.0]\t 26Nov | 01:00 PM",
  repoVersion: "12 Nov | 12:00 pm",
};
export const HttpRequestEndPointConfig = {
  //#region auth
  endPointUserRegister: "user/register",
  endPointUserLogin: "user/login",
  endPointCountriesList: "countries/list",
  endPointUserLogOut: "user/logout",
  endPointUserResendOtp: "user/resend/otp",
  endPointUserVerifyOtp: "user/verify/otp",
  endPointUserTypes: "user/types",
  endPointBrand: "brand",
  endPointPreferencesUpdate: "preferences/update",
  //#endregion

  //#region Channel
  endPointUserTvChannel: "channels/list",
  endPointUserTvChannelCat: "categories/list",
  endPointUserTvChannelByCat: "channels/bycategory",
  endPointGuideByCat: "channels/guide/bycategory/",
  endPointProductList: "products/filteredList",
  endPointChannelDetail: "channels/details/",
  endPointChannelDetailNew: "channels/details-new/",
  endPointChannelContent: "channels/contents/",
  endPointChannelFeaturedContent: "channels/featured/content/",

  //#endregion

  //#region TV Remote
  endPointChannelFind: "channels/find",
  endPointChannelPrevious: "channels/previous",
  endPointChannelNext: "channels/next",
  //#endregion

  //#region Home
  endPointChannelLive: "channels/live",
  endPointChannelGuide: "channels/guide",
  endPointChannelContentsLive: "channels/contents/live",
  //#endregion

  //#region BlockChannels | Parental Control
  endPointChannelBlock: "channel/block/",
  endPointChannelsBlocked: "channels/blocked",
  endPointChannelUnblock: "channel/unblock/",
  endPointChannelsUnblock: "channels/unblock",
  endPointChannelPin: "channel/pin/",
  endPointChannelPinVerify: "channel/pin/verify/",
  endPointChannelsPin: "channels/pin/",
  //#endregion

  //#region Reminder
  endPointReminderList: "reminders/list",
  endPointSetReminder: "reminders/set/",
  endPointDelReminder: "reminders",

  //#endregion

  //#region Notification
  endPointNotificationsList: "notifications/list",
  endPointNotifications: "notifications",
  //#endregion

  //#region Fav
  endPointChUnFav: "channels/unfavourite",
  endPointChFav: "channels/favourite/",
  endPointChUserFav: "channels/user/favourite",
  //#endregion

  //#region Profile
  endPointUserGetProfile: "user/get/profile",
  endPointProfilePref: "user/profile/preferences",
  endPointProfileUpdate: "user/profile/update",
  endPointNotificationCount: "notifications/count",
  endPointProfileImage: "user/profile/image/upload",

  //#endregion

  //#region Chat
  endPointChatUserList: "chat/userList",
  endPointChatSendFriendReq: "chat/sendFrientsRequest/",
  endPointChatFriendReqList: "chat/friendRequestList",
  endPointChatConfirmFriendReq: "chat/confirmFriendsRequest/",
  endPointChatFriendList: "chat/friendsList",
  endPointChatIgnoreFriendReq: "chat/ignoreFriendsRequest/",
  endPointChatGetMsg: "chat/getMessages/",
  endPointChatSentRequestList: "chat/sentRequestList",

  //#endregion

  //#region Misc
  endPointProductAddProduct: "products/addproduct/",
  endPointChannelWatched: "channel/watched",
  endPointChannelWatchedCount: "channels/usercount/",
  endPointLinkGet: "link/get/",
  //#endregion
};

//#region Helper
export const UseDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(function () {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debounceValue;
};
export const showAPIError = (error, title) => {
  if (error.response) {
    console.error(
      "errResponse : status | data | ",
      error.response.status,
      JSON.stringify(error.response.data, null, 4)
    );
    const errResponse = error.response?.data;
    if (errResponse?.errors) {
      const error = errResponse.errors[0];
      showMsgAlert(error.message, title);
    } else {
      const msg = getAPIError(error.response.status, error.response);
      showMsgAlert(msg, title);
    }
  } else {
    showMsgAlert(error.message, title);
  }
};
const getAPIError = (code, msg) => {
  return code + JSON.stringify(msg);
};
export const validateUrl = (url) => {
  const regex = new RegExp(Validation.validateUrl);
  return regex.test(url);
};
//#endregion
