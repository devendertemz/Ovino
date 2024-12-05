//#region import
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Linking,
} from "react-native";
import { Header, getHeaderTitle } from "@react-navigation/elements";
const { height, width } = Dimensions.get("window");

//package
import messaging from "@react-native-firebase/messaging";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { EventRegister } from "react-native-event-listeners";
//utils
import {
  fonts,
  ovnioColors,
  scaleXiPhone15,
  checkForTablet,
  APP_SCREEN,
} from "./src/utils/Variable";
import { stylesCommon } from "./src/utils/CommonStyle";
//baseComp
import FontIcons from "./src/components/baseComponent/FontIcons";

//navigation
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
const StackAuth = createNativeStackNavigator();
const StackWatch = createNativeStackNavigator();
const StackLoopz = createNativeStackNavigator();
const TabWatch = createBottomTabNavigator();
const TabLoopz = createBottomTabNavigator();
const DrawerLoopz = createDrawerNavigator();

//auth
import Reg from "./src/screens/auth/Reg";
import SplashScreen from "./src/screens/SplashScreen";
import Login from "./src/screens/auth/Login";
import Welcome from "./src/screens/appIntro/Welcome";
import VerifyCode from "./src/screens/auth/VerifyCode";
import RegPrefrences from "./src/screens/auth/RegPrefrences";
import SplashOption from "./src/screens/auth/SplashOption";

//sub
import PaymentStatus from "./src/screens/payment/PaymentStatus";
//helper
import CustomMsgAlert from "./src/components/popup/CustomMsgAlert";

//tabs - home
import Home from "./src/screens/Tabs/home/Home";
import Search from "./src/screens/Tabs/home/Search";
import TrendingChannels from "./src/screens/Tabs/home/TrendingChannels";
import TvShow from "./src/screens/Tabs/home/TvShow";
import HomeDetails from "./src/screens/Tabs/home/HomeDetails";
import Pin from "./src/screens/Tabs/home/Pin";

//tabs - tv guide
import TVGuide from "./src/screens/Tabs/guide/TVGuide";
//tabs - tv remote

//tabs - channle
import Channel from "./src/screens/Tabs/channel/Channel";
import ChannelCategories from "./src/screens/Tabs/channel/ChannelCategories";
import ChannelDetails from "./src/screens/Tabs/channel/ChannelDetails";
import ShopNow from "./src/screens/Tabs/channel/ShopNow";

//tabs - profile
import Profile from "./src/screens/Tabs/profile/Profile";
import ProfileView from "./src/screens/Tabs/profile/ProfileView";
import ProfileEdit from "./src/screens/Tabs/profile/ProfileEdit";
import FavChannel from "./src/screens/Tabs/profile/FavChannel";
import Reminder from "./src/screens/Tabs/profile/Reminder";
import BlockAndParental from "./src/screens/Tabs/profile/BlockAndParental";
import Subscription from "./src/screens/Tabs/profile/Subscription";
import Notification from "./src/screens/Tabs/profile/Notification";
import ChangePassword from "./src/screens/Tabs/profile/setting/ChangePassword";
import Setting from "./src/screens/Tabs/profile/setting/Setting";
import UseFulLink from "./src/screens/Tabs/profile/usefulLink/UseFulLink";
import WebPage from "./src/screens/Tabs/profile/usefulLink/WebPage";
import ReqSent from "./src/screens/Tabs/profile/ReqSent";
import TopScreen from "./src/screens/Tabs/profile/top/TopScreen";
import AddTop from "./src/screens/Tabs/profile/top/AddTop";
import ReferralInsights from "./src/screens/Tabs/profile/ReferralInsights";
import PrefView from "./src/screens/Tabs/profile/PrefView";

//chat flow
import FriendList from "./src/screens/Tabs/chat/FriendList";
import AddFriendList from "./src/screens/Tabs/chat/AddFriendList";
import ChatDetail from "./src/screens/Tabs/chat/ChatDetail";

//loopz - BtmTab
import HomeLoopz from "./src/screens/loopz/loopzTabs/home/Home";
import Live from "./src/screens/loopz/loopzTabs/live/Live";
import SearchLoopz from "./src/screens/loopz/loopzTabs/dm/DMChatList";
import ProfileLoopz from "./src/screens/loopz/loopzTabs/profile/Profile";
import FollowAndFollowing from "./src/screens/loopz/drawer/FollowAndFollowing";
import Saved from "./src/screens/loopz/drawer/Saved";

//api
import GlobalValue from "./src/api/GlobalVar";
import { LogoutConfirmationAlert } from "./src/api/GlobalAPICall";
//#endregion

//#region asset
const ovnioHeader = require("./src/assets/images/header/header.png");
const ic_tvRemote = require("./src/assets/images/remote/ic_tvRemote.png");
const ic_Msg = require("./src/assets/images/header/ic_Msg.png");
const plugrLoopz = require("./src/assets/images/lopz/splashOption/plugrLoopz.png");
const ic_addTabs = require("./src/assets/images/lopz/tabs/addTabs.png");
//#endregion

//#region AuthStack
function AuthStack({ navigation }) {
  return (
    <StackAuth.Navigator
      screenOptions={{
        headerShown: false,
        orientation: "portrait",
      }}
    >
      <StackAuth.Screen name="SplashScreen" component={SplashScreen} />
      <StackAuth.Screen
        name="Welcome"
        component={Welcome}
        options={{ gestureEnabled: false }}
      />
      <StackAuth.Screen
        name="Login"
        component={Login}
        options={{ gestureEnabled: false }}
      />
      <StackAuth.Screen name="Reg" component={Reg} />
      <StackAuth.Screen
        name={APP_SCREEN.APP_VERIFY_CODE}
        component={VerifyCode}
      />
      <StackAuth.Screen
        name={APP_SCREEN.APP_REG_PREF}
        component={RegPrefrences}
      />
      <StackAuth.Screen
        name={APP_SCREEN.APP_SPLASH_OPTION}
        component={SplashOption}
      />
    </StackAuth.Navigator>
  );
}
//#endregion

//#region WatchAppStack
const WatchAppStack = ({ navigation }) => {
  return (
    <StackWatch.Navigator
      screenOptions={{
        headerShown: false,
        orientation: "portrait",
      }}
    >
      <StackWatch.Screen
        name="BtmTabs"
        component={BtmTabs}
        options={{ gestureEnabled: false }}
      />
      <StackWatch.Screen
        name="HomeDetails"
        component={HomeDetails}
        options={{ title: "Home Detail" }}
      />
      <StackWatch.Screen name="Search" component={Search} />
      <StackWatch.Screen name="ProfileView" component={ProfileView} />
      <StackWatch.Screen name="ProfileEdit" component={ProfileEdit} />
      <StackWatch.Screen name="FavChannel" component={FavChannel} />
      <StackWatch.Screen name="Reminder" component={Reminder} />
      <StackWatch.Screen name="BlockAndParental" component={BlockAndParental} />
      <StackWatch.Screen name="Subscription" component={Subscription} />
      <StackWatch.Screen name="Notification" component={Notification} />
      <StackWatch.Screen name="ChangePassword" component={ChangePassword} />
      <StackWatch.Screen name="Setting" component={Setting} />
      <StackWatch.Screen name="UseFulLink" component={UseFulLink} />
      <StackWatch.Screen name="TopScreen" component={TopScreen} />
      <StackWatch.Screen name="AddTop" component={AddTop} />
      <StackWatch.Screen name="ReferralInsights" component={ReferralInsights} />
      <StackWatch.Screen name="WebPage" component={WebPage} />
      <StackWatch.Screen name="TrendingChannels" component={TrendingChannels} />
      <StackWatch.Screen name="TvShow" component={TvShow} />
      <StackWatch.Screen name="Pin" component={Pin} />
      <StackWatch.Screen name="ReqSent" component={ReqSent} />
      <StackWatch.Screen
        name="ShopNow"
        component={ShopNow}
        options={{ headerShown: false }}
      />
      <StackWatch.Screen name="FriendList" component={FriendList} />
      <StackWatch.Screen name="AddFriendList" component={AddFriendList} />
      <StackWatch.Screen name="ChatDetail" component={ChatDetail} />
      <StackWatch.Screen name="PrefView" component={PrefView} />
      <StackWatch.Group
        screenOptions={{
          presentation: "transparentModal", //formSheet
          contentStyle: { backgroundColor: "#40404040" },
        }}
      >
        <StackWatch.Screen
          name="ChannelCategories"
          component={ChannelCategories}
        />
      </StackWatch.Group>
    </StackWatch.Navigator>
  );
};
//#endregion

//#region BtmTabs
const tabBarStyle = {
  tabBarShowLabel: true,
  tabBarLabelPosition: "below-icon",
  tabBarActiveTintColor: ovnioColors.primaryRed,
  tabBarInactiveTintColor: ovnioColors.grayDesc,
};
const navBarStyle = {
  headerShown: true,
  headerTitleAlign: "center",
  headerTintColor: "black",
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  headerBackVisible: false,
  /* headerTitleStyle: {
    fontFamily: fonts.medium,
    fontSize: 16,
  }, */
  headerTitleAlign: "center",
  headerStyle: {
    backgroundColor: ovnioColors.background,
    //backgroundColor: ovnioColors.fbBg,
  },
};
const OvnioNavTitle = () => {
  return (
    <Image
      source={ovnioHeader}
      resizeMode="contain"
      style={{
        width: 44,
        height: 44,
        //backgroundColor: "green",
      }}
    />
  );
};
function BtmTabs({ navigation }) {
  const insets = useSafeAreaInsets();
  GlobalValue.btmSafeArearHt = insets.bottom;
  console.log("AN.js | insets.bottom = ", insets.bottom);

  return (
    <TabWatch.Navigator
      screenOptions={({ route }) => ({
        ...tabBarStyle,

        tabBarStyle: {
          backgroundColor: "#24252a",
          height: scaleXiPhone15.sixtyH + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: scaleXiPhone15.fouteenH,
          fontFamily: fonts.medium,
          marginTop: -insets.bottom * 0.25,
          //backgroundColor: "blue",
        },
        //nav bar
        ...navBarStyle,
        headerTitle: (props) => <OvnioNavTitle />,
        headerRight: () => <CustomRightHeader nav={navigation} />,

        tabBarIcon: ({ focused, color, size }) => {
          let iconColor = focused
            ? ovnioColors.primaryRed
            : ovnioColors.grayDesc;
          let iconName;
          let iconSize = scaleXiPhone15.twentyFourH;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "TV Guide") {
            iconName = focused ? "monitor" : "monitor";
          } else if (route.name === "Channels") {
            iconName = focused ? "tv" : "tv";
          } else if (route.name === "Profile") {
            iconName = focused ? "user" : "user";
          }
          return <Feather name={iconName} size={iconSize} color={iconColor} />;
        },
      })}
    >
      <TabWatch.Screen
        name="Home"
        component={Home}
        options={{ gestureEnabled: false }}
      />
      <TabWatch.Screen
        name="TV Guide"
        component={TVGuide}
        options={{ gestureEnabled: false }}
      />
      <TabWatch.Screen
        name={"Remote"}
        component={EmptyScreen}
        options={{
          tabBarButton: () => <TVRemoteComp navigation={navigation} />,
        }}
      ></TabWatch.Screen>
      <TabWatch.Screen
        name="Channels"
        component={Channel}
        options={{ headerShown: true, gestureEnabled: false }}
      />
      <TabWatch.Screen name="Profile" component={Profile} />
    </TabWatch.Navigator>
  );
}
const CustomRightHeader = (props) => {
  const [notCount, setNotCount] = React.useState(0);
  React.useEffect(() => {
    EventRegister.addEventListener(GlobalValue.unReadNotification, (data) => {
      console.log(
        "App.js : EventRegister AuthEmit unReadNotification  = ",
        data
      );
      setNotCount(data);
    });
  }, []);
  const NotificationIcon = ({ count }) => {
    return (
      <View>
        <Ionicons
          name={"notifications-outline"}
          size={scaleXiPhone15.twentyFourH}
          color={ovnioColors.white}
        />
        {count > 0 && (
          <View style={stylesHeader.badgeContainer}>
            <Text style={stylesHeader.badgeText}>{count}</Text>
          </View>
        )}
      </View>
    );
  };
  const onPlugrLoopzLogoClicked = () => {
    props.nav.navigate("LoopzAppStack", {
      screen: APP_SCREEN.LOOPZ_HOME_TABBAR,
      params: {
        screen: "homeloopz",
      },
    });
  };

  return (
    <View style={stylesHeader.containerRight}>
      <TouchableOpacity
        style={{ marginRight: scaleXiPhone15.sixteenW }}
        onPress={onPlugrLoopzLogoClicked}
      >
        <Image
          source={plugrLoopz}
          resizeMode="contain"
          style={{
            width: scaleXiPhone15.sixtyH,
            //marginBottom: scaleXiPhone15.fourH,
            //backgroundColor: "blue",
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginRight: scaleXiPhone15.sixteenW }}
        onPress={() => props.nav.push("Search")}
      >
        <Feather
          name={"search"}
          size={scaleXiPhone15.twentyFourH}
          color={ovnioColors.white}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginRight: scaleXiPhone15.sixteenW }}
        onPress={() => props.nav.push("Notification")}
      >
        <NotificationIcon count={notCount} />
      </TouchableOpacity>
    </View>
  );
};
const stylesHeader = StyleSheet.create({
  containerRight: {
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "green",
  },
  badgeContainer: {
    position: "absolute",
    right: -scaleXiPhone15.sixteenH * 0.5,
    top: -scaleXiPhone15.sixteenH * 0.5,
    backgroundColor: ovnioColors.primaryRed,
    borderRadius: scaleXiPhone15.twentyH * 0.5,
    width: scaleXiPhone15.twentyH,
    height: scaleXiPhone15.twentyH,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: scaleXiPhone15.twelveH,
    fontWeight: fonts.bold,
    color: ovnioColors.white,
  },
});
//#endregion

//#region TV Remote
function EmptyScreen() {
  return null;
}
const TVRemoteComp = (prop) => {
  const onTVRemoteBtmBarClick = () => {
    prop.navigation.navigate("TVRemote");
  };

  return (
    <TouchableOpacity
      style={{
        //position: "absolute",
        height: height * 0.09,
        width: height * 0.09,
        marginTop: -scaleXiPhone15.sixteenH,
        borderRadius: (height * 0.09) / 2,
        transform: [{ scaleY: 1.0 }],

        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ovnioColors.primaryRed,
      }}
      onPress={onTVRemoteBtmBarClick}
    >
      <Image
        source={ic_tvRemote}
        resizeMode="contain"
        style={{
          height: height * 0.07,
          //marginBottom: scaleXiPhone15.fourH,
          //backgroundColor: "green",
        }}
      />
    </TouchableOpacity>
  );
};
//#endregion

//#region LoopzStack
function LoopzAppStack({ navigation }) {
  return (
    <DrawerLoopz.Navigator
      initialRouteName={APP_SCREEN.LOOPZ_HOME_TABBAR}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        //nav bar
        headerTintColor: ovnioColors.white,
        headerTitle: (props) => <PlugrLoopzNavBarTitle />,
        headerRight: () => <PlugrLoopzRightBarBtn />,

        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: ovnioColors.blackPlugrBg,
        },
        orientation: "portrait",
        //drawer
        drawerType: "front",
        drawerStyle: {
          backgroundColor: ovnioColors.blackPlugrBg,
        },
        drawerLabelStyle: {
          ...stylesCommon.plugrDrawerTxt,
        },
        drawerActiveTintColor: ovnioColors.white,
        drawerInactiveTintColor: ovnioColors.grayLoopzInActiveColor,
      }}
    >
      <DrawerLoopz.Screen
        name={APP_SCREEN.LOOPZ_HOME_TABBAR}
        component={LoopzAppBtmBar}
        options={{
          title: "For You",
          drawerIcon: ({ focused, color, size }) => {
            return (
              <FontIcons name={"compass-3-fill"} size={size} color={color} />
            );
          },
        }}
      />
      <DrawerLoopz.Screen
        name={APP_SCREEN.LOOPZ_FOLLOWERS}
        component={FollowAndFollowing}
        initialParams={{ isFollow: true }}
        options={{
          title: "Follower",
          drawerIcon: ({ focused, color, size }) => {
            return (
              <FontIcons name={"heart-3-fill"} size={size} color={color} />
            );
          },
          headerTitle: "Follower",
        }}
      />
      <DrawerLoopz.Screen
        name={APP_SCREEN.LOOPZ_FOLLOWING}
        component={FollowAndFollowing}
        initialParams={{ isFollow: false }}
        options={{
          title: "Following",
          drawerIcon: ({ focused, color, size }) => {
            return <FontIcons name={"group-fill"} size={size} color={color} />;
          },
          headerTitle: "Following",
        }}
      />
      <DrawerLoopz.Screen
        name="Saved"
        component={Saved}
        options={{
          title: "Saved",
          drawerIcon: ({ focused, color, size }) => {
            return (
              <FontIcons name={"bookmark-fill"} size={size} color={color} />
            );
          },
          headerTitle: "Saved",
        }}
      />
    </DrawerLoopz.Navigator>
  );
}
function LoopzAppBtmBar({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <TabLoopz.Navigator
      screenOptions={({ route }) => ({
        orientation: "portrait",
        //nav bar
        headerShown: false,

        //btm bar
        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarActiveTintColor: ovnioColors.primaryRed,
        tabBarInactiveTintColor: ovnioColors.grayDesc,
        tabBarStyle: {
          backgroundColor: "#010101",
          height: scaleXiPhone15.sixtyH + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: scaleXiPhone15.fouteenH,
          fontFamily: fonts.medium,
          marginTop: -insets.bottom * 0.25,
          //backgroundColor: "blue",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconColor = focused ? ovnioColors.primaryRed : ovnioColors.white;
          let iconName;
          let iconSize = scaleXiPhone15.twentyFourH;
          if (route.name === "homeloopz") {
            iconName = focused ? "home-4-line" : "home-4-line";
          } else if (route.name === "live") {
            iconName = focused ? "live-fill" : "live-fill";
          } else if (route.name === "searchloopz") {
            iconName = focused ? "message-2-fill" : "message-2-fill";
          } else if (route.name === "profileloopz") {
            iconName = focused ? "user-3-line" : "user-3-line";
          }
          return (
            <FontIcons name={iconName} size={iconSize} color={iconColor} />
          );
        },
      })}
    >
      <TabLoopz.Screen
        name="homeloopz"
        component={HomeLoopz}
        options={{ tabBarLabel: "Home" }}
      />
      <TabLoopz.Screen
        name="live"
        component={Live}
        options={{ tabBarLabel: "Live" }}
      />
      <TabLoopz.Screen
        name={"Add"}
        component={EmptyScreen}
        options={{
          tabBarButton: () => <PlugrTaBarLiveBtn navigation={navigation} />,
        }}
      ></TabLoopz.Screen>
      <TabLoopz.Screen
        name="searchloopz"
        component={SearchLoopz}
        options={{ tabBarLabel: "Message" }}
      />
      <TabLoopz.Screen
        name="profileloopz"
        component={ProfileLoopz}
        options={{ tabBarLabel: "Profile" }}
      />
    </TabLoopz.Navigator>
  );
}
function CustomDrawerContent(props) {
  //console.log("CustomDrawerContent = ", JSON.stringify(props, null, 4));

  const onLogoutClick = () => {
    LogoutConfirmationAlert(props.navigation);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View
          //backgroundColor={"red"}
          style={{
            paddingHorizontal: scaleXiPhone15.sixteenH,
            paddingBottom: scaleXiPhone15.sixteenH * 2,
          }}
        >
          <Image
            source={plugrLoopz}
            resizeMode="contain"
            style={{
              width: scaleXiPhone15.sixtyH,
              height: scaleXiPhone15.sixtyH * 0.5,
            }}
          />
        </View>
        <DrawerItemList {...props} />
        <View
          style={{
            height: 1,
            backgroundColor: ovnioColors.grayLoopzInActiveColor,
          }}
        ></View>
        {/*  <DrawerItem
          label="Settings"
          labelStyle={{
            color: ovnioColors.grayLoopzInActiveColor,
            ...stylesCommon.plugrDrawerTxt,
          }}
          onPress={() => Linking.openURL("https://mywebsite.com/help")}
        /> */}
      </DrawerContentScrollView>
      <DrawerItem
        style={{
          marginBottom: GlobalValue.btmSafeArearHt,
        }}
        label="Logout"
        labelStyle={{
          color: ovnioColors.grayLoopzInActiveColor,
          ...stylesCommon.plugrDrawerTxt,
        }}
        icon={({ focused, color, size }) => (
          <FontIcons
            name={"logout-box-r-fill"}
            size={size}
            color={ovnioColors.grayLoopzInActiveColor}
          />
        )}
        onPress={onLogoutClick}
      />
    </View>
  );
}
const PlugrLoopzNavBarTitle = () => {
  return (
    <Image
      source={plugrLoopz}
      resizeMode="contain"
      style={{
        width: scaleXiPhone15.sixtyH,
        height: scaleXiPhone15.sixtyH * 0.5,
        bottom: scaleXiPhone15.eightH,
        //backgroundColor: "green",
      }}
    />
  );
};
const PlugrLoopzRightBarBtn = () => {
  return (
    <TouchableOpacity
      style={{ paddingRight: scaleXiPhone15.eightH }}
      onPress={() => console.log("Influencr")}
    >
      <FontIcons
        name={"influencer-fill"}
        size={scaleXiPhone15.twentyFourH}
        color="#fff"
      />
    </TouchableOpacity>
  );
};
const PlugrTaBarLiveBtn = (prop) => {
  return (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        //backgroundColor: "red",
      }}
      onPress={() => {
        prop.navigation.navigate("CameraScreen");
      }}
    >
      <Image
        source={ic_addTabs}
        resizeMode="contain"
        style={{
          width: scaleXiPhone15.seventyH,
          height: scaleXiPhone15.seventyH * 0.6,
          //backgroundColor: "green",
        }}
      />
    </TouchableOpacity>
  );
};
//#endregion

export { AuthStack, WatchAppStack, LoopzAppStack };
