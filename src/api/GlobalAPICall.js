//#region import
import { Alert } from "react-native";
import { EventRegister } from "react-native-event-listeners";
//api
import { showAPIError } from "./Config";
import {
  GetUnreadtNotification,
  GetUserProfile,
  GetLogOut,
} from "./GetRequest";
import GlobalValue from "./GlobalVar";
//utils
import { showCustomAlertWithMsg } from "../utils/Alert";
import TextStrings from "../utils/TextStrings";
import { getHrDiffBteweenCrtTimeAndTimeStamp } from "../utils/DateTimeUtil";
import {
  saveUserID,
  saveUserSetPin,
  removeUserID,
  removeUserEmail,
  removeUserSetPin,
} from "../utils/LocalDataStorage";
//#endregion

//#region API CALL
export const GetUnreadtNotAPICall = async () => {
  await GetUnreadtNotification()
    .then((res) => {
      console.log(
        "\u001b[1;32m RES | Unread not  = ",
        JSON.stringify(res.data)
      );
      EventRegister.emit(
        GlobalValue.unReadNotification,
        res.data.data.unread_count
      );
    })
    .catch((error) => {
      showAPIError(error, "Error | Unread Notification");
    });
};
export const GetUserProfileAPICall = async () => {
  await GetUserProfile()
    .then((res) => {
      const user = res.data.user;
      console.log(
        "\u001b[1;32mGPC.js : RES | User Pro = ",
        JSON.stringify(user.id),
        user.email_id
      );
      //userId | pinSet - will be already in local
      GlobalValue.emailId = user.email_id;
      GlobalValue.firstName = user.first_name;
      GlobalValue.username = user.username;
      GlobalValue.profile_pic = user.profile_pic;
      const regHr = getHrDiffBteweenCrtTimeAndTimeStamp(user.created_at);
      GlobalValue.freeHrsLeft = 24 - regHr;
      GlobalValue.is_subscribed = user.is_subscribed;
    })
    .catch((error) => {
      showAPIError(error, "Error | User Profile");
    });
};
//#endregion

//#region SaveUserData
export const SaveUserData = async (user) => {
  console.log("\u001b[1;32mGPC.js : user = ", JSON.stringify(user));
  GlobalValue.userId = user.id;
  GlobalValue.emailId = user.email_id;
  GlobalValue.firstName = user.first_name;
  GlobalValue.username = user.username;
  GlobalValue.profile_pic = user.profile_pic;
  GlobalValue.pinSet = user.pinset;
  const regHr = getHrDiffBteweenCrtTimeAndTimeStamp(user.created_at);
  GlobalValue.freeHrsLeft = 24 - regHr;
  GlobalValue.is_subscribed = user.is_subscribed;

  await saveUserID(user.id);
  await saveUserSetPin(user.pinset);
};
//#endregion

//#region Logout Flow
export const LogoutConfirmationAlert = (navigation) => {
  Alert.alert(
    TextStrings.Logout,
    TextStrings.sureLogout,
    [
      {
        text: "NO",
        style: "cancel",
      },
      {
        text: "YES",
        onPress: () => {
          GetLogOutAPICall(navigation);
        },
        style: "destructive",
      },
    ],
    { cancelable: true }
  );
};
async function GetLogOutAPICall(navigation) {
  await GetLogOut()
    .then((res) => {
      console.log(
        "\u001b[1;32mCH.js : Res GetLogOut = ",
        JSON.stringify(res.data)
      );
      Logout(navigation);
    })
    .catch((error) => {
      showAPIError(error, "Log out Error");
    });
}
async function Logout(navigation) {
  await removeUserID();
  await removeUserEmail();
  await removeUserSetPin();
  GlobalValue.userId = 0;
  GlobalValue.emailId = "";
  GlobalValue.pinSet = false;
  setTimeout(() => {
    navigation.navigate("AuthStack", {
      screen: "Welcome",
      params: { navType: 2 },
    });
  }, 50);
}
//#endregion

//#region Free channel check
export const FreeChannelViewingCheck = (
  channel,
  navigation,
  showAlert = true,
  isChannelId = false
) => {
  console.log("FreeChannelViewingCheck : showAlert = ", showAlert);

  const checkNum = isChannelId ? 59 : Number(GlobalValue.free_channel);
  if (!GlobalValue.is_subscribed && checkNum !== Number(channel)) {
    showAlert
      ? showCustomAlertWithMsg(
          "Only one channel 1 is available for free viewing",
          navigation
        )
      : null;
    return false;
  } else {
    return true;
  }
};
//#endregion
