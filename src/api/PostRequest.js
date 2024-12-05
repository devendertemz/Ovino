import axios from "react-native-axios";
import { HttpRequestBaseURLConfig, HttpRequestEndPointConfig } from "./Config";

const ConsoleLogUrlParaAndBody = (key, urlTmp, params, body) => {
  console.log(`\u001b[1;34m ${key} : urlTmp = `, urlTmp);
  if (params) {
    console.log("\u001b[1;34m params = ", JSON.stringify(params));
  }
  if (body) {
    console.log("\u001b[1;34m body = ", JSON.stringify(body));
  }
};

//#region Auth
export const PostRegister = async (data) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserRegister;
  ConsoleLogUrlParaAndBody("PostRegister", urlTmp, null, data);
  const response = await axios({
    method: "post",
    data: data,
    url: urlTmp,
  });
  return response;
};
export const PostLogin = async (data) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserLogin;
  ConsoleLogUrlParaAndBody("PostLogin", urlTmp, null, data);
  const response = await axios({
    method: "post",
    data: data,
    url: urlTmp,
  });
  return response;
};
export const ResendOtp = async (data) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserResendOtp;
  ConsoleLogUrlParaAndBody("ResendOtp", urlTmp, null, data);
  const response = await axios({
    method: "post",
    data: data,
    url: urlTmp,
  });
  return response;
};
export const VerifyOtp = async (data) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointUserVerifyOtp;
  ConsoleLogUrlParaAndBody("VerifyOtp", urlTmp, null, data);
  const response = await axios({
    method: "post",
    data: data,
    url: urlTmp,
  });
  return response;
};
export const PostPreferencesUpdate = async (body) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointPreferencesUpdate;
  ConsoleLogUrlParaAndBody("Preferences Update", urlTmp, null, body);
  const response = await axios({
    method: "post",
    data: body,
    url: urlTmp,
  });
  return response;
};

//#endregion

//#region TV Remote
export const PostChannelFind = async (body, para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelFind;
  ConsoleLogUrlParaAndBody("ChannelFind", urlTmp, para, body);
  const response = await axios({
    method: "post",
    data: body,
    params: para,
    url: urlTmp,
  });
  return response;
};
export const PostChannelNext = async (body, para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelNext;
  ConsoleLogUrlParaAndBody("ChannelNext", urlTmp, para, body);
  const response = await axios({
    method: "post",
    data: body,
    params: para,
    url: urlTmp,
  });
  return response;
};
export const PostChannelPrevious = async (body, para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelPrevious;
  ConsoleLogUrlParaAndBody("ChannelPrevious", urlTmp, para, body);
  const response = await axios({
    method: "post",
    data: body,
    params: para,
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Home
export const PostChannelGuide = async (body, para) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelGuide;
  ConsoleLogUrlParaAndBody("ChannelGuide", urlTmp, para, body);
  const response = await axios({
    method: "post",
    data: body,
    params: para,
    url: urlTmp,
  });
  return response;
};
export const PostChannelContentLive = async (body) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelContentsLive;
  ConsoleLogUrlParaAndBody("ChannelGuide", urlTmp, null, body);
  const response = await axios({
    method: "post",
    data: body,
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Channel Guide
export const PostChannelGuideWithId = async (body, Id) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelGuide +
    "/" +
    Id;
  ConsoleLogUrlParaAndBody("ChannelGuideWithId", urlTmp, null, body);
  const response = await axios({
    method: "post",
    data: body,
    url: urlTmp,
  });
  return response;
};
export const PostChannelGuideByCat = async (body, catId) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointGuideByCat +
    catId;
  ConsoleLogUrlParaAndBody("Post : Guide by Cat", urlTmp, null, body);
  const response = await axios({
    method: "post",
    data: body,
    url: urlTmp,
  });
  return response;
};

//#endregion

//#region Channel
export const PostChannelContent = async (chId, body) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelContent +
    chId;
  ConsoleLogUrlParaAndBody("Channel content", urlTmp, null, body);
  const response = await axios({
    method: "post",
    data: body,
    url: urlTmp,
  });
  return response;
};
export const PostChannelFeaturedContent = async (chId, body) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelFeaturedContent +
    chId;
  ConsoleLogUrlParaAndBody(
    "POST | Channel Featured content",
    urlTmp,
    null,
    body
  );
  const response = await axios({
    method: "post",
    data: body,
    url: urlTmp,
  });
  return response;
};

//#endregion

//#region Parental Control
export const PostChannelPinVerify = async (body, Id) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointChannelPinVerify +
    Id;
  ConsoleLogUrlParaAndBody("ChannelPinVerify", urlTmp, null, body);
  const response = await axios({
    method: "post",
    data: body,
    url: urlTmp,
  });
  return response;
};

//#endregion

//#region Profile
export const PostUploadFile = async (data) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost +
    HttpRequestEndPointConfig.endPointProfileImage;
  ConsoleLogUrlParaAndBody("POST | Profile Img", urlTmp, null, data);

  const response = await axios({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "post",
    data: data,
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Search Watch
export const PostSearchChannels = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + `search/channels`;
  ConsoleLogUrlParaAndBody("POST | Sch channels", urlTmp, para, null);
  const response = await axios({
    method: "post",
    url: urlTmp,
    params: para,
  });
  return response;
};

export const PostSearchShows = async (para) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + `search/shows`;
  ConsoleLogUrlParaAndBody("POST | Sch shows", urlTmp, para, null);
  const response = await axios({
    method: "post",
    url: urlTmp,
    params: para,
  });
  return response;
};

//#endregion

//#region Top8
export const PostTop8MarkUnmark = async (body) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + `top-eight/mark-unmark`;
  ConsoleLogUrlParaAndBody("POST | Top8MarkUnmark", urlTmp, null, body);
  const response = await axios({
    method: "post",
    data: body,
    url: urlTmp,
  });
  return response;
};
//#endregion

//#region Plugr LOOPZ
//post comment
export const PostCommentOnPost = async (postId, data) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost + `post/${postId}/comment`;
  ConsoleLogUrlParaAndBody("POST | Comment", urlTmp, null, data);
  const response = await axios({
    method: "post",
    data: data,
    url: urlTmp,
  });
  return response;
};
export const PostUserFollow = async (para, data) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "user/follow";
  ConsoleLogUrlParaAndBody("POST | UserFollow", urlTmp, para, data);
  const response = await axios({
    method: "post",
    data: data,
    params: para,
    url: urlTmp,
  });
  return response;
};
export const PostLikeOrUnLike = async (postId, para, data) => {
  const urlTmp =
    HttpRequestBaseURLConfig.baseURLHost + `post/${postId}/like-dislike`;
  ConsoleLogUrlParaAndBody("POST | LikeOrUnLike", urlTmp, para, data);
  const response = await axios({
    method: "post",
    data: data,
    params: para,
    url: urlTmp,
  });
  return response;
};
export const PostArchiveOrUnArchive = async (para, data) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + `post/archive`;
  ConsoleLogUrlParaAndBody("POST |  Archive Or UnArchive ", urlTmp, para, data);
  const response = await axios({
    method: "post",
    data: data,
    params: para,
    url: urlTmp,
  });
  return response;
};
export const PatchSavePostViewCount = async (post_id) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + `post/view/${post_id}`;
  ConsoleLogUrlParaAndBody("Patch | Post count save ", urlTmp, null, null);
  const response = await axios({
    method: "PATCH",
    url: urlTmp,
  });
  return response;
};
//crt post
export const PostUploadMedia = async (para, data) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "upload";
  ConsoleLogUrlParaAndBody("POST |Post Upload", urlTmp, para, data);
  const response = await axios({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "post",
    data: data,
    params: para,
    url: urlTmp,
  });
  return response;
};
export const PostCreate = async (data) => {
  const urlTmp = HttpRequestBaseURLConfig.baseURLHost + "post";
  ConsoleLogUrlParaAndBody("POST | Create", urlTmp, null, data);
  const response = await axios({
    method: "post",
    data: data,
    url: urlTmp,
  });
  return response;
};
//#endregion
