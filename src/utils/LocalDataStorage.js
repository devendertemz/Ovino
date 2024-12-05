import AsyncStorage from "@react-native-async-storage/async-storage";

const userIDKey = "userID";
const userSetPin = "USERSETPIN";
const userEmailKey = "userEmail";
const FCMToken = "FCMTOKEN";

//#region user ID
export const saveUserID = async (User_ID) => {
  try {
    await AsyncStorage.setItem(userIDKey, String(User_ID));
  } catch (error) {
    console.error("Error : While saving userIDKey :" + error);
  }
};
export const getUserID = async () => {
  try {
    let value = await AsyncStorage.getItem(userIDKey);
    return value;
  } catch (error) {
    console.error("Error : While retrieving userIDKey :" + error);
  }
};
export const removeUserID = async () => {
  await AsyncStorage.removeItem(userIDKey);
};
//#endregion

//#region user Email
export const saveUserEmail = async (user_email) => {
  try {
    await AsyncStorage.setItem(userEmailKey, String(user_email));
  } catch (error) {
    console.error("Error : While saving userEmailKey = ", error);
  }
};
export const getUserEmail = async () => {
  try {
    let value = await AsyncStorage.getItem(userEmailKey);
    return value;
  } catch (error) {
    console.error("Error : While retrieving userEmailKey = ", error);
  }
};
export const removeUserEmail = async () => {
  await AsyncStorage.removeItem(userEmailKey);
};
//#endregion

//#region FCM Token
export const saveFCMTOken = async (fcm_token) => {
  try {
    await AsyncStorage.setItem(FCMToken, String(fcm_token));
  } catch (error) {
    console.error("Error : While saving fcm_token :" + error);
  }
};
export const getFCMToken = async () => {
  try {
    let value = await AsyncStorage.getItem(FCMToken);
    return value;
  } catch (error) {
    console.error("Error : While retrieving fcm_token :" + error);
  }
};
export const removeFCMToken = async () => {
  await AsyncStorage.removeItem(FCMToken);
};
//#endregion

//#region SetPin
export const saveUserSetPin = async (SetPin) => {
  try {
    await AsyncStorage.setItem(userSetPin, JSON.stringify(SetPin));
  } catch (error) {
    console.error("Error : While saving SetPin boolean Value :" + error);
  }
};
export const getUserSetPin = async () => {
  try {
    let value = await AsyncStorage.getItem(userSetPin);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error("Error : While retrieving SetPin :" + error);
  }
};
export const removeUserSetPin = async () => {
  await AsyncStorage.removeItem(userSetPin);
};
//#endregion
