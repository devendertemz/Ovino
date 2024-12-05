import { scaleXiPhone15 } from "../utils/Variable";

const GlobalValue = {
  userId: "",
  emailId: "",
  firstName: "",
  lastName: "",
  username: "",
  profile_pic: "",
  created_at: "2024-10-18T08:16:22.000Z",
  freeHrsLeft: 24,
  is_subscribed: false,
  free_channel: 1,
  pinSet: false,
  fcmToken: "",
  crtChannel: {
    id: 59,
    channel: "1",
    channel_name: "Plugr Dropz",
    image:
      "https://ovinio-uploads.s3.amazonaws.com/channel/88ab7a89f93ec485cf958159d0ba526fb628.png",
    blocked: false,
    ispinned: false,
    isfavourite: false,
    content_id: "",
    schedule_id: "",
  },
  pinCode: "",
  isLockParentalControl: false,

  isChannelRefresh: false, //Refresh Channel.js when any channel is blocked / unblocked in HomeDetail.js or BlockAndParental.js

  brandLink: null,

  //tabbarheight
  btmTabHeight: scaleXiPhone15.ninetyFourH,
  btmSafeArearHt: scaleXiPhone15.thrityFourH,

  //emitter name
  unReadNotification: "unReadNotification",
  logoutRemote: "logoutRemote",
  refreshHomePostList: "refreshHomePostList",
};

export default GlobalValue;
