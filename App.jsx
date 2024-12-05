/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//#region import
import "./gesture-handler.native";
import React, { useEffect } from "react";
import { Linking, Platform } from "react-native";
//package
import messaging from "@react-native-firebase/messaging";
//utils
import {
  requestUserPermission,
  notificationListener,
  onDisplayNotification,
} from "./src/utils/NotificationService";

//navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStack, WatchAppStack, LoopzAppStack } from "./AppNav";
const Stack = createNativeStackNavigator();

//files import
import SelectModal from "./src/components/popup/SelectModal";
import CustomMsgAlert from "./src/components/popup/CustomMsgAlert";
import PostComment from "./src/screens/loopz/loopzTabs/home/PostComment";
import SubscriptionAlert from "./src/components/popup/SubscriptionAlert";
import SharePopup from "./src/components/popup/SharePopup";
import ToastMsg from "./src/components/popup/ToastMsg";
import TVRemote from "./src/screens/Tabs/remote/TVRemote";
import Keypad from "./src/screens/Tabs/remote/Keypad";
import WebViewASM from "./src/components/popup/WebViewASM";
import ReminderAlert from "./src/components/popup/ReminderAlert";
import MutipleSelect from "./src/components/popup/MutipleSelect";
//loopz crt post
import CameraScreen from "./src/screens/loopz/loopzTabs/addPost/CameraScreen";
import AddPost from "./src/screens/loopz/loopzTabs/addPost/AddPost";
import CapturedPreview from "./src/screens/loopz/loopzTabs/addPost/CapturedPreview";
//chat
import DirectChat from "./src/screens/loopz/loopzTabs/dm/DirectChat";
//vc
import VCScreen from "./src/screens/vc/VCScreen";
//utils
import { APP_SCREEN } from "./src/utils/Variable";
//#endregion

//#region App
function App({ navigation }) {
  const navigationRef = React.createRef();

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);
  useEffect(() => {
    //Foreground state messages : To listen to messages in the foreground
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  //#region deep linking
  //plugrapp://postshare/34
  const linking = {
    prefixes: ["plugrapp://"],
    config: {
      initialRouteName: "LoopzAppStack",
      screens: {
        LoopzAppStack: {
          screens: {
            LOOPZ_HOME_TABBAR: {
              screens: {
                homeloopz: {
                  path: "postshare/:post_id",
                },
              },
            },
          },
        },
      },
    },
  };
  /*
  <NavigationContainer ref={navigationRef}>
  React.useEffect(() => {
    const handleDeepLink = (prop) => {
      const route = prop.url.replace(/.*?:\/\//g, "");
      const routeName = route.split("/")[0];
      if (routeName === "postshare") {
        const post_id = route.split("/")[1];
        console.log("route = ", route);
        console.log("routeName = ", routeName);
        console.log("post_id = ", post_id);

        navigationRef.current?.navigate("LoopzAppStack", {
          screen: APP_SCREEN.LOOPZ_HOME_TABBAR,
          params: {
            screen: "homeloopz",
            params: {
              post_id: post_id,
            },
          },
        });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);
  */

  //#endregion

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          orientation: "portrait",
        }}
      >
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="WatchAppStack" component={WatchAppStack} />
        <Stack.Screen name="LoopzAppStack" component={LoopzAppStack} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="AddPost" component={AddPost} />
        <Stack.Screen name="CapturedPreview" component={CapturedPreview} />
        <Stack.Screen name={APP_SCREEN.LOOPZ_DM} component={DirectChat} />
        <Stack.Screen name={"VCScreen"} component={VCScreen} />
        <Stack.Group
          screenOptions={{
            presentation: "transparentModal", //formSheet
            contentStyle: { backgroundColor: "#40404040" },
          }}
        >
          <Stack.Screen name="WebViewASM" component={WebViewASM} />
          <Stack.Screen
            name="ReminderAlert"
            component={ReminderAlert}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CustomMsgAlert"
            component={CustomMsgAlert}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={APP_SCREEN.LOOPZ_POSTCOMMENT}
            component={PostComment}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={APP_SCREEN.APP_SELECTMODAL}
            component={SelectModal}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={APP_SCREEN.APP_SUB_ALERT}
            component={SubscriptionAlert}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={APP_SCREEN.LOOPZ_SHARE}
            component={SharePopup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={APP_SCREEN.LOOPZ_TOAST_MSG}
            component={ToastMsg}
            options={{
              headerShown: false,
              presentation: Platform.OS == "ios" ? "modal" : "transparentModal",
            }}
          />
          <Stack.Screen
            name="TVRemote"
            component={TVRemote}
            options={{
              headerShown: false,
              orientation: "all",
            }}
          />
          <Stack.Screen
            name="Keypad"
            component={Keypad}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MutipleSelect"
            component={MutipleSelect}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
//#endregion

export default App;
