//#region import
import messaging from "@react-native-firebase/messaging";
import GlobalValue from "../api/GlobalVar";
import notifee from "@notifee/react-native";
//local
import { saveFCMTOken, getFCMToken } from "./LocalDataStorage";
import { GetUnreadtNotAPICall } from "../api/GlobalAPICall.js";
//#endregion

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log(
      "NotificationService :  messaging.AuthorizationStatus = ",
      authStatus
    );
    // Register the device with FCM
    /* if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    } */
    getFCMTokenFromLocallORFirebase();
  } else {
    console.error(
      "NotificationService Error :  messaging.AuthorizationStatus = ",
      authStatus
    );
  }
}
const getFCMTokenFromLocallORFirebase = async () => {
  let fcm_token = await getFCMToken();
  console.log("NotificationService : fcm token from local:", fcm_token);
  if (!fcm_token) {
    try {
      const fcm_token = await messaging().getToken();
      GlobalValue.fcmToken = fcm_token;
      if (fcm_token) {
        console.log(
          "NotificationService : fcm token from google cloud",
          fcm_token
        );
        await saveFCMTOken(fcm_token);
      }
    } catch (error) {
      console.error(
        "NotificationService Error : in getting fcm token from google cloud  = ",
        error.message
      );
    }
  } else {
    GlobalValue.fcmToken = fcm_token;
  }
};
export const notificationListener = async () => {
  //Handling Interaction : When the application is running, but in the background.
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "NotificationService : Notification caused app to open from background state = ",
      JSON.stringify(remoteMessage.notification)
    );
  });
  //Handling Interaction : When the application is opened from a quit state.
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "NotificationService : Notification caused app to open from quit state = " +
            JSON.stringify(remoteMessage.notification)
        );
      }
    });
};
export async function onDisplayNotification(msg) {
  console.log("NS.js : push forward = ", JSON.stringify(msg));
  if (!isNaN(GlobalValue.userId) || Number(GlobalValue.userId) !== 0) {
    GetUnreadtNotAPICall();
  }

  // Request permissions (required for iOS)
  if (Platform.OS == "ios") {
    await notifee.requestPermission();
  }

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  // Display a notification
  await notifee.displayNotification({
    title: msg.notification?.title,
    body: msg.notification?.body,
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
    },
  });
}
