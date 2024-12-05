import axios from "react-native-axios";
import { HttpRequestBaseURLConfig, HttpRequestEndPointConfig } from "./Config";

const ConsoleLogUrlParaAndBody = (key, urlTmp, params, body) => {
  console.log(`\u001b[1;34m${key} : urlTmp = `, urlTmp);
  if (params) {
    console.log("\u001b[1;34m params = ", JSON.stringify(params));
  }
  if (body) {
    console.log("\u001b[1;34m body = ", JSON.stringify(body));
  }
};

//#region auth
export const GetCountriesList = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointCountriesList;
  ConsoleLogUrlParaAndBody("GET : Countries List ", urlTmp, null, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetLogOut = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserLogOut;
  ConsoleLogUrlParaAndBody("Log out", urlTmp, null, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetUserTypes = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserTypes;
  ConsoleLogUrlParaAndBody("Get : User Types ", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetBrandVideo = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointBrand;
  ConsoleLogUrlParaAndBody("Get : Brand video ", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region TV Channel
export const GetTvChannelList = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserTvChannel;
  ConsoleLogUrlParaAndBody("Tv Channel List ", urlTmp, null, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetTvChannelByCat = async (para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserTvChannelByCat;
  ConsoleLogUrlParaAndBody("Channel by cat", urlTmp, para, null);
  const response = await axios({
    method: "get",
    params: para,
    url: urlTmp,
  });
  return response;
};
export const GetChannelDetail = async (chId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelDetailNew +
    chId;
  ConsoleLogUrlParaAndBody("Channel Detail", urlTmp, null, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};

export const GetTvChannelCatList = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserTvChannelCat;
  ConsoleLogUrlParaAndBody("Tv Channel Cat List ", urlTmp, null, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};

//#endregion

//#region Home
export const GetChannelLive = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelLive;
  ConsoleLogUrlParaAndBody("ChannelLive", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};

//#endregion

//#region Products
export const GetProductList = async (para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointProductList;
  ConsoleLogUrlParaAndBody("Product List ", urlTmp, para, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
//#endregion

//#region BlockChannels | Parental Control
export const GetSetChannelBlock = async (data) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelBlock +
    data;
  ConsoleLogUrlParaAndBody("ChannelBlock", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetAllChannelsBlockedList = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelsBlocked;
  ConsoleLogUrlParaAndBody("ChannelsBlocked list", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetChannelUnblock = async (chId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelUnblock +
    chId;
  ConsoleLogUrlParaAndBody("Channel Unblock", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const DeleteAllChannelUnblock = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelsUnblock;
  ConsoleLogUrlParaAndBody("All Channel Unblock", urlTmp);
  const response = await axios({
    method: "DELETE",
    url: urlTmp,
  });
  return response;
};
export const DeleteUnlockChannel = async (chId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelPin +
    chId;
  ConsoleLogUrlParaAndBody("Channel Unblock", urlTmp);
  const response = await axios({
    method: "DELETE",
    url: urlTmp,
  });
  return response;
};
export const GetAllChannelParentalList = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelsPin;
  ConsoleLogUrlParaAndBody("Channel Parental List", urlTmp);
  const response = await axios({
    method: "Get",
    url: urlTmp,
  });
  return response;
};
export const DeleteAllChannelUnlock = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelsPin;
  ConsoleLogUrlParaAndBody("All Channel Unlock", urlTmp);
  const response = await axios({
    method: "DELETE",
    url: urlTmp,
  });
  return response;
};
export const UpdateAllChannelPin = async (body) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelsPin;
  ConsoleLogUrlParaAndBody("Update All Channel Pin", urlTmp, null, body);
  const response = await axios({
    method: "Put",
    url: urlTmp,
    data: body,
  });
  return response;
};

export const GetChannelBlockWithId = async (Id) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelPin +
    Id;
  ConsoleLogUrlParaAndBody("GetChannelBlockWithId", urlTmp, null, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Reminder
export const GetRemindersList = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointReminderList;
  ConsoleLogUrlParaAndBody("Reminder List", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetSetReminder = async (schedule_id, ch_id, content_id, para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointSetReminder +
    schedule_id +
    "/" +
    ch_id +
    "/" +
    content_id;
  ConsoleLogUrlParaAndBody("Reminder Set", urlTmp, para);
  const response = await axios({
    method: "get",
    params: para,
    url: urlTmp,
  });
  return response;
};
export const DeleteSingleReminder = async (showId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointDelReminder +
    "/" +
    showId;
  ConsoleLogUrlParaAndBody("Reminder Del", urlTmp);
  const response = await axios({
    method: "delete",
    url: urlTmp,
  });
  return response;
};
export const DeleteAllReminder = async (showId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointDelReminder;
  ConsoleLogUrlParaAndBody("Reminder Del All", urlTmp);
  const response = await axios({
    method: "delete",
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Notification
export const GetNotificationList = async (params) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointNotificationsList;
  ConsoleLogUrlParaAndBody("Notification List", urlTmp, params);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: params,
  });
  return response;
};
export const DeleteAllNotification = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointNotifications;
  ConsoleLogUrlParaAndBody("Notification Del All", urlTmp);
  const response = await axios({
    method: "delete",
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Fav
export const GetUserFavChannelList = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChUserFav;
  ConsoleLogUrlParaAndBody("GET : User Fav Channel List", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetAddChannelAsFav = async (chId, content_id, schedule_id) => {
  ///channels/favourite/:watching_schedule_id/:favourite_channel_id/:watching_content_id
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChFav +
    schedule_id +
    "/" +
    chId +
    "/" +
    content_id;
  ConsoleLogUrlParaAndBody("GET : Add Channel As Fav", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const DeleteAllUserFavChannels = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChUnFav;
  ConsoleLogUrlParaAndBody("DEL : User All Fav Channels", urlTmp);
  const response = await axios({
    method: "delete",
    url: urlTmp,
  });
  return response;
};
export const DeleteSingleUserFavChannel = async (chId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChUnFav +
    "/" +
    chId;
  ConsoleLogUrlParaAndBody("DEL : Single User Fav Channel", urlTmp);
  const response = await axios({
    method: "delete",
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Misc|Analytics
export const GetAddProduct = async (ch_id, watching_content_id, productId) => {
  ///addproduct/:watching_channel_id/:watching_content_id/:product_id

  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointProductAddProduct +
    ch_id +
    "/" +
    watching_content_id +
    "/" +
    productId;
  ConsoleLogUrlParaAndBody("GET : Product View", urlTmp, null, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetChannelWatched = async (para) => {
  ///channel/watched?watching_schedule_id=73&watching_channel_id=40&watching_content_id=34&watching_ad_id=1&ad_duration=20
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelWatched;
  ConsoleLogUrlParaAndBody("GET : Content Watched", urlTmp, para, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetChannelWatchedCount = async (chId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelWatchedCount +
    chId;
  ConsoleLogUrlParaAndBody("GET : Count Watched", urlTmp, null, null);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};

//#endregion

//#region Profile
export const GetUserProfile = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserGetProfile;
  ConsoleLogUrlParaAndBody("GET : User Profile", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetPrefList = async () => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "preferences";
  ConsoleLogUrlParaAndBody("GET : Pref", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetProfilePref = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointProfilePref;
  ConsoleLogUrlParaAndBody("GET : Profile Pref", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const PutProfileUpdate = async (body) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointProfileUpdate;
  ConsoleLogUrlParaAndBody("Patch : Profile Update", urlTmp, null, body);
  const response = await axios({
    method: "put",
    data: body,
    url: urlTmp,
  });
  return response;
};
export const GetUnreadtNotification = async () => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointNotificationCount;
  ConsoleLogUrlParaAndBody("Get : Unread not count", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetUserPref = async () => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "preferences/user";
  ConsoleLogUrlParaAndBody("GET : User Pref", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};

//#endregion

//#region Chat
export const GetChatSendFriendReq = async (userId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChatSendFriendReq +
    userId;
  ConsoleLogUrlParaAndBody("Get : Chat Send Friend Req", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetChatUserList = async (para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChatUserList;
  ConsoleLogUrlParaAndBody("Get : Chat User List", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetChatFriendReqList = async (para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChatFriendReqList;
  ConsoleLogUrlParaAndBody("Get : Chat Friend Req List", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetChatConfirmFriendReq = async (id) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChatConfirmFriendReq +
    id;
  ConsoleLogUrlParaAndBody("Get : Chat Confirm Friend Req", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetChatIgnoreFriendReq = async (reqId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChatIgnoreFriendReq +
    reqId;
  ConsoleLogUrlParaAndBody("Get : Chat Ignore Friend Req", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetChatFriendList = async (para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChatFriendList;
  ConsoleLogUrlParaAndBody("Get : Chat  Friend List", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetChatMsg = async (userId, para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChatGetMsg +
    userId;
  ConsoleLogUrlParaAndBody("Get : Chat Msg List", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetSentReqList = async (para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChatSentRequestList;
  ConsoleLogUrlParaAndBody("Get : Sent req list ", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};

//#endregion

//#region Plugr
export const GetShareLink = async (chId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointLinkGet +
    chId;
  ConsoleLogUrlParaAndBody("Get : Share Link ", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region UsefulLinks
export const GetAboutUs = async () => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "aboutus";
  ConsoleLogUrlParaAndBody("Get : About Us ", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetTermsAndCondition = async () => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "terms-and-conditions";
  ConsoleLogUrlParaAndBody("Get : Terms & Cond ", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetPrivacyPolicy = async () => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "privacy-and-policy";
  ConsoleLogUrlParaAndBody("Get : Privacy Policy ", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Top8
export const GetTop8Users = async () => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "top-eight/users";
  ConsoleLogUrlParaAndBody("Get : Top8Users ", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Affiliate
export const GetAffiliateLink = async () => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "user/affiliate-link";
  ConsoleLogUrlParaAndBody("Get : Affiliate Link", urlTmp);
  const response = await axios({
    method: "get",
    url: urlTmp,
  });
  return response;
};
export const GetReferredUsersList = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "referral/users";
  ConsoleLogUrlParaAndBody("Get : Affiliate Link", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
//#endregion

//#region Plugr LOOPZ
//post operation
export const GetPostList = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "post";
  ConsoleLogUrlParaAndBody("Get : Post List", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetPostCommentsList = async (postId, para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost + `post/${postId}/comment`;
  ConsoleLogUrlParaAndBody("Get : Post comments", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetArchievePost = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "post/archive";
  ConsoleLogUrlParaAndBody("Get Archieve Post", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const DeleteArchievePost = async (archieveId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost + "post/archive/" + archieveId;
  ConsoleLogUrlParaAndBody("Delete Archieve Post", urlTmp);
  const response = await axios({
    method: "DELETE",
    url: urlTmp,
  });
  return response;
};
//users
export const GetUserFollowerList = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "user/followees";
  ConsoleLogUrlParaAndBody("Get : User Follower ", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetUserFollowingList = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "user/followers";
  ConsoleLogUrlParaAndBody("Get : User Following ", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetUserFollowingAndFollowersList = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "user/follow-relation";
  ConsoleLogUrlParaAndBody("Get : User Following & Followers ", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
//dm
export const GetDMUserList = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "chat/list";
  ConsoleLogUrlParaAndBody("Get : DM User list ", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
export const GetDMSearchUserList = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "chat/search";
  ConsoleLogUrlParaAndBody("Get : DM Search list ", urlTmp, para);
  const response = await axios({
    method: "get",
    url: urlTmp,
    params: para,
  });
  return response;
};
//#endregion
