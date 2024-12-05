//#region import
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  Image,
  ImageBackground,
  FlatList,
  ScrollView,
  Text,
  Alert,
  Share,
  Linking,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Video from "react-native-video";
import WebView from "react-native-webview";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  ChannelGuideRegion,
  FeatureShowRegion,
  HomeBtmTabBar,
} from "./ChDetailHelper";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//blockComponent
import { TVShowRowComp } from "../../../components/blockComponent/OvinoGridCell";
import HeaderRightIcon from "../../../components/blockComponent/HeaderRightIcon";
import { ChannelGuideRow } from "../../../components/blockComponent/OvnioCustomRow";
import ChatRoom from "../../../components/popup/ChatRoom";
import {
  FriendListPopUp,
  SendFriendReqPopUp,
} from "../../../components/popup/FriendListPopUp";

//utils
import {
  getLocalStartEndTimeStampFromUTCStartDate,
  getLocalTimeStampFromUTCDate,
  addZeroToSingleDigitNum,
  convertDateToAPIFormat,
} from "../../../utils/DateTimeUtil";
import { ShareChannelLinkUtil } from "../../../utils/ShareUtil";
import { ovnioColors, scaleXiPhone15, fonts } from "../../../utils/Variable";
import { stylesCommon } from "../../../utils/CommonStyle";
import { showCustomAlertWithMsg, showMsgAlert } from "../../../utils/Alert";
import TextStrings from "../../../utils/TextStrings";
//api
import {
  GetChannelDetail,
  GetSetChannelBlock,
  GetChannelUnblock,
  GetAddChannelAsFav,
  DeleteSingleUserFavChannel,
  GetChannelWatched,
  GetChannelWatchedCount,
  GetShareLink,
} from "../../../api/GetRequest";
import {
  PostChannelGuideWithId,
  PostChannelFeaturedContent,
} from "../../../api/PostRequest";
import { showAPIError, UseDebounce } from "../../../api/Config";
import GlobalValue from "../../../api/GlobalVar";
//#endregion

//#region assets
const ic_Msg = require("../../../assets/images/header/ic_Msg.png");
const smsChat = require("../../../assets/images/smsChat/smsChat.png");
const ic_Sms = require("../../../assets/images/ic_sms/ic_Sms.png");
const place_width = require("../../../assets/images/placeHolder/place_width/place_width.png");
const thumbnail = require("../../../assets/images/sample/thumbnail.png");
const place_square = require("../../../assets/images/placeHolder/place_square/place_square.png");
const favIcon = require("../../../assets/images/fav/fav.png");
const vcIcon = require("../../../assets/images/vc/video/vc.png");
//#endregion

//#region Main
export default function HomeDetails({ navigation, route }) {
  //Channel.js | Home.js | TvSHow.js | KeyPad.js | TVRemote.js //navType = 1,2,3,4,5
  //Search.js  | //navType = 6
  //console.log("\u001b[1;31mHD.js : route  = ", JSON.stringify(route.params));

  //#region rowHT
  const insets = useSafeAreaInsets();
  GlobalValue.btmSafeArearHt = insets.bottom;
  const HEADER_HEIGHT = Platform.OS === "ios" ? 44 : 56;
  const chatHt =
    height -
    height * 0.28 -
    //GlobalValue.btmTabHeight -
    insets.top -
    HEADER_HEIGHT;
  //#endregion

  //#region useState
  const [loader, setLoader] = useState(false);
  const [loaderList, setLoaderList] = useState(false);
  const [chDetail, setChDet] = useState({ ...route.params?.ChannelDetails });
  const [chGuide, setChGuide] = useState({});
  const [arrContent, setArrContent] = useState([]);
  const [countWatch, setWatchCount] = useState(0);
  const [isVideoPlay, setVideoPlay] = useState(false);
  //chat
  const [isFrindListVisible, setFrindListShow] = useState(false);
  const [isFrindReqVisible, setFrindReqVisible] = useState(false);
  const [isChatDetailsVisible, setChatDetailsVisible] = useState(false);
  const [selFriend, setSelFriend] = useState({});

  const chDet = {
    id: chDetail.id,
    channel: chDetail.channel,
    channel_name: chDetail.channel_name,
    image: chDetail.image,
    ispinned: chDetail.ispinned,
    blocked: chDetail.blocked,
    content_id: chDetail.content_id,
    schedule_id: chDetail.schedule_id,
  };
  GlobalValue.crtChannel = chDet;
  console.log(
    "\u001b[1;31mHD.js : chDetail | navType = ",
    JSON.stringify(GlobalValue.crtChannel),
    route.params?.navType
  );

  //#endregion

  //#region api
  useEffect(() => {
    GetChannelWatchedCountAPICall(GlobalValue.crtChannel.id, setWatchCount);
    PostChannelFeaturedContentAPICall(
      GlobalValue.crtChannel.id,
      setArrContent,
      setLoaderList
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      GetChannelDetailAPICall(GlobalValue.crtChannel.id, setChDet, setLoader);
      PostChannelGuideAPICall(
        GlobalValue.crtChannel.id,
        setChGuide,
        setLoaderList
      );
    }, [])
  );
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
    return;
    if (route.params?.navType === 1) {
      navigation.pop();
      //navigation.navigate("Channels", { catSel: {} });
      navigation.navigate("Channels");
    } else {
      navigation.goBack();
    }
  };
  const onShareBtnPress = async () => {
    GetShareLinkAPICall(chDetail.id);
  };
  const onFavBtnPress = async () => {
    setChDet({
      ...chDetail,
      isfavourite: !chDetail?.isfavourite,
    });
    if (chDetail?.isfavourite) {
      DeleteChannelAsFavAPICall(chDetail.id);
    } else {
      GetAddChannelAsFavAPICall(
        chDetail.id,
        chDetail.content_id,
        chDetail.schedule_id
      );
    }
  };
  const onAddReminder = async (item) => {
    if (item.isreminder && item.schedule_id) {
      navigation.navigate("ReminderAlert", {
        remind: item,
        remindType: 2,
        extradata: { prev_schedule_id: item.schedule_id },
      });
    } else {
      navigation.navigate("ReminderAlert", { remind: item, remindType: 1 });
    }
  };
  const onRemoveParentalCtrlClick = () => {
    navigation.navigate("Pin", {
      chObj: {
        chId: chDetail?.id,
        channel: chDetail?.channel,
        channel_name: chDetail?.channel_name,
        ispinned: true,
        pinType: 3,
      },
    });
  };
  const onFeatureShowArrowClick = () => {
    navigation.navigate("TvShow", {
      type: 2,
      chId: GlobalValue.crtChannel.id,
    });
  };
  //chat
  const onSmsBtnPress = async () => {
    const smsUrl = "sms:";

    // Open the SMS app with prefilled data
    Linking.openURL(smsUrl).catch((error) => {
      //Alert.alert('Error', 'Unable to open SMS app');
      console.error("Error:", error);
    });
  };
  const onChatBtnPress = async () => {
    setFrindListShow(true);
  };
  //#endregion

  //#region JSX
  const HeaderTitle = () => {
    return chDetail?.title
      ? chDetail.title
      : GlobalValue.crtChannel?.channel_name;
  };
  const DetailComp = () => {
    if (loader) {
      return (
        <CustomLoader
          padding={scaleXiPhone15.sixteenW}
          isSmall={false}
          color={ovnioColors.primaryRed}
        />
      );
    } else {
      return (
        <ContentDetailsComp
          countWatch={countWatch}
          chDetail={chDetail}
          setChDet={setChDet}
          setLoader={setLoader}
          onSmsBtnPress={onSmsBtnPress}
          onChatBtnPress={onChatBtnPress}
          navigation={navigation}
        />
      );
    }
  };
  const ShowFriendListPopUp = () => {
    const onFriendListItemClick = (item) => {
      setSelFriend(item);
      setFrindListShow(false);
      setChatDetailsVisible(true);
    };
    const onAddFriendClick = () => {
      setFrindListShow(false);
      setFrindReqVisible(true);
    };
    const onFriendListCloseClick = () => {
      setFrindListShow(false);
    };
    return (
      <FriendListPopUp
        headerTxt="Friend List"
        status={isFrindListVisible}
        onClose={onFriendListCloseClick}
        onAddFriendClick={onAddFriendClick}
        onItemClick={onFriendListItemClick}
      />
    );
  };
  const ShowSendFriendReqPopUp = () => {
    return (
      <SendFriendReqPopUp
        headerTxt="Add Friend"
        status={isFrindReqVisible}
        onClose={() => setFrindReqVisible(false)}
      />
    );
  };
  const ShowChatDetailsPopUp = () => {
    return (
      <ChatRoom
        height={chatHt}
        selFriend={selFriend}
        headerTxt="Add Friend"
        status={isChatDetailsVisible}
        onClose={() => setChatDetailsVisible(false)}
      />
    );
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <ShowFriendListPopUp />
      <ShowSendFriendReqPopUp />
      <ShowChatDetailsPopUp />
      <ScrollView>
        <HeaderRightIcon
          iconRightTwo={"share-social"}
          iconRightOne={
            chDetail?.schedule_id
              ? chDetail?.isfavourite
                ? "heart"
                : "heart-outline"
              : null
          }
          // isIconRightShow={chDetail?.schedule_id}
          title={HeaderTitle()}
          onBackBtnPress={onBackBtnPress}
          onShareBtnPress={onShareBtnPress}
          onFavBtnPress={onFavBtnPress}
        />
        {isVideoPlay && !chDetail?.ispinned && !chDetail?.blocked ? (
          <VideoPlayComp
            liveUrl={chDetail?.liveUrl}
            imageurl={
              chDetail?.schImg
                ? chDetail.schImg
                : chDetail?.image
                ? chDetail?.image
                : null
            }
          />
        ) : (
          <TopImageComp
            chDetail={chDetail}
            setVideoPlay={setVideoPlay}
            imageurl={
              chDetail?.schImg
                ? chDetail.schImg
                : chDetail?.image
                ? chDetail?.image
                : null
            }
            isBlock={chDetail?.blocked ? true : false}
            isParentalCtrl={chDetail?.ispinned ? true : false}
            onRemoveParentalCtrlClick={onRemoveParentalCtrlClick}
          />
        )}
        <DetailComp />
        {loaderList ? null : (
          <>
            {chGuide?.programs ? (
              <ChannelGuideRegion
                chGuide={chGuide}
                onAddReminder={onAddReminder}
              />
            ) : null}
            <FeatureShowRegion
              arrContent={arrContent}
              onArrowClick={onFeatureShowArrowClick}
            />
          </>
        )}
      </ScrollView>
      <HomeBtmTabBar navigation={navigation} navType={route.params?.navType} />
    </SafeAreaView>
  );
}
//#endregion

//#region TopImageComp
const TopImageComp = (prop) => {
  const onPlayVideo = () => {
    if (prop.isBlock) return;
    if (prop.isParentalCtrl) return;
    if (!prop.chDetail.content_id || !prop.chDetail.schedule_id) return;
    GetChannelWatchedAPICall({
      watching_channel_id: prop.chDetail.id,
      watching_content_id: prop.chDetail.content_id,
      watching_schedule_id: prop.chDetail.schedule_id,
    });
    prop.setVideoPlay(true);
  };
  const BlockComp = () => {
    if (prop.isBlock) {
      return (
        <View style={styleTI.containerBlur}>
          <Ionicons
            name={"ban-outline"}
            size={scaleXiPhone15.fivtyH}
            color={ovnioColors.primaryRed}
          />
          <Text
            style={[stylesCommon.txtCtryName, { color: ovnioColors.white }]}
          >
            {"This Channel is Blocked"}
          </Text>
        </View>
      );
    } else if (prop.isParentalCtrl) {
      return (
        <View style={styleTI.containerBlur}>
          <Ionicons
            name={"lock-closed"}
            size={scaleXiPhone15.fivtyH}
            color={ovnioColors.primaryRed}
          />
          <Text
            style={[stylesCommon.txtCtryName, { color: ovnioColors.white }]}
          >
            {"This Channel is Locked"}
          </Text>
          <TouchableOpacity
            style={styleTI.containerRemove}
            onPress={prop.onRemoveParentalCtrlClick}
          >
            <Text style={stylesCommon.txtBtn}>
              {"Remove from Parental Control"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };
  return (
    <TouchableOpacity onPress={onPlayVideo}>
      <ImageBackground
        style={styleTI.container}
        source={
          prop.imageurl
            ? {
                uri: prop.imageurl,
              }
            : place_width
        }
      >
        <BlockComp />
      </ImageBackground>
    </TouchableOpacity>
  );
};
const styleTI = StyleSheet.create({
  container: {
    height: height * 0.28,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    //backgroundColor: ovnioColors.primaryRed,
  },
  containerBlur: {
    height: "100%",
    width: "100%",
    gap: scaleXiPhone15.sixteenH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)", // Dark semi-transparent overlay
  },
  containerRemove: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.tenH,
    borderRadius: scaleXiPhone15.tenH * 2,
    backgroundColor: ovnioColors.primaryRed,
  },
});
//#endregion

//#region VideoPlayComp
const VideoPlayComp = (prop) => {
  const onVieoBuffer = ({ isBuffering }) => {
    //console.log("onVieoBuffer  " + JSON.stringify(isBuffering));
  };
  const onVieoError = (error) => {
    console.log("onVieoError  " + JSON.stringify(error));
    showMsgAlert("Error", JSON.stringify(error));
  };
  //https://ovinio-uploads.s3.amazonaws.com/videos/big_buck_bunny_720p_30mb.mp4
  //https://ovnio-transcoded-video.s3.amazonaws.com/transcoded/ovinio-player.m3u8

  return (
    <Video
      source={{
        uri: prop.liveUrl,
      }}
      style={styleTI.container}
      poster={prop.imageurl}
      posterResizeMode={"cover"}
      onBuffer={onVieoBuffer}
      onError={onVieoError}
      repeat={false}
      playInBackground={false}
      playWhenInactive={false}
      resizeMode={"contain"} //NONE = "none",CONTAIN = "contain", COVER = "cover",      STRETCH = "stretch"
      controls={true}
    />
  );
};

//#endregion

//#region ContentDetailsComp
const ContentDetailsComp = (prop) => {
  //useState
  const [showDesc, setShowDesc] = useState(false);
  const [isBgAPICall, setBgAPICall] = useState(false);
  const [isEnabled, setIsEnabled] = useState(
    prop.chDetail?.blocked ? prop.chDetail?.blocked : false
  );

  //action
  const toggleSwitch = () => {
    if (prop.chDetail?.blocked) {
      prop.setChDet({
        ...prop.chDetail,
        blocked: false,
      });
      GetChannelUnblockAPICall(prop.chDetail, prop.setChDet, setBgAPICall);
    } else {
      prop.setChDet({
        ...prop.chDetail,
        blocked: true,
      });
      GetSetChannelBlockAPICall(prop.chDetail, prop.setChDet, setBgAPICall);
    }
    setIsEnabled((previousState) => !previousState);
  };
  const onParentalCtrlPress = () => {
    prop.navigation.navigate("Pin", {
      chObj: {
        chId: prop.chDetail?.id,
        channel: prop.chDetail?.channel,
        channel_name: prop.chDetail?.channel_name,
        ispinned: prop.chDetail?.ispinned,
        pinType: GlobalValue.pinSet ? (prop.chDetail?.ispinned ? 3 : 2) : 1,
      },
    });
  };

  //JSX
  const NameTimeComp = () => {
    return (
      <View style={styleCD.subContainer}>
        <Text style={styleCD.txtTitle}>
          {"Ch"}&nbsp;{prop.chDetail?.channel}&nbsp;
          {prop.chDetail?.channel_name}
        </Text>
        <View style={{ flexDirection: "row", gap: scaleXiPhone15.fourH }}>
          <Text style={styleCD.txtTitle}>EASTERN STANDARD</Text>
          <Text style={[styleCD.txtTitle, { color: ovnioColors.white }]}>
            {prop.chDetail?.current_time}
          </Text>
        </View>
      </View>
    );
  };
  const ParentalBlockComp = () => {
    const parentalType = GlobalValue.pinSet
      ? prop.chDetail.ispinned
        ? 3 // Remove
        : 2 // Enter
      : 1; //Set

    const ChannelBlockTitle = () => {
      return prop.chDetail?.blocked
        ? "Unblock this channel"
        : "Block this channel";
    };
    const ChannelParentTitle = () => {
      if (parentalType === 1) {
        return "Set Pin for Parental Control";
      } else if (parentalType === 2) {
        return "Enter Pin for Parental Control";
      } else {
        return "Remove from Parental Control";
      }
    };

    return (
      <View style={styleCD.subContainer}>
        <TouchableOpacity
          style={
            parentalType === 3
              ? styleCD.containerRemove
              : styleCD.conatinerParentControlBtn
          }
          onPress={onParentalCtrlPress}
        >
          <Text
            style={[
              styleCD.txtTitle,
              {
                color:
                  parentalType === 3
                    ? ovnioColors.white
                    : ovnioColors.primaryRed,
                fontFamily: fonts.medium,
              },
            ]}
          >
            {ChannelParentTitle()}
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={[
              styleCD.txtTitle,
              {
                color: ovnioColors.white,
                fontFamily: fonts.medium,
                paddingRight: scaleXiPhone15.eightH,
              },
            ]}
          >
            {ChannelBlockTitle()}
          </Text>
          <Switch
            disabled={isBgAPICall}
            trackColor={{
              false: ovnioColors.grayIconColor,
              true: ovnioColors.primaryRed,
            }}
            ios_backgroundColor={ovnioColors.grayIconColor}
            thumbColor={isEnabled ? ovnioColors.white : ovnioColors.grayDesc}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
    );
  };
  const ViewsComp = () => {
    return (
      <View>
        <View>
          <TouchableOpacity
            onPress={() => setShowDesc(!showDesc)}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={[styleCD.txtHeading, { flex: 1 }]}>
              {prop.chDetail?.title}
            </Text>
            <Ionicons
              name={showDesc ? "chevron-up-sharp" : "chevron-down-sharp"}
              size={scaleXiPhone15.sixteenH}
              color={ovnioColors.grayIconColor}
            />
          </TouchableOpacity>
          <Text style={[styleCD.txtTitle, { color: ovnioColors.yellowFood }]}>
            {prop.chDetail?.category_name
              ? prop.chDetail?.category_name
              : "category name"}
          </Text>
        </View>
        <View style={styleCD.containerIcons}>
          <TouchableOpacity onPress={() => console.log("video flow")}>
            <Image
              source={vcIcon}
              tintColor={ovnioColors.grayIconColor}
              style={styleCD.iconImg}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("fav flow")}>
            <Image
              source={favIcon}
              resizeMode="contain"
              tintColor={ovnioColors.grayIconColor}
              style={styleCD.iconImg}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => prop.onSmsBtnPress()}>
            <Image
              source={ic_Sms}
              tintColor={ovnioColors.grayIconColor}
              style={styleCD.iconImg}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => prop.onChatBtnPress()}>
            <Image
              source={ic_Msg}
              resizeMode="contain"
              tintColor={ovnioColors.grayIconColor}
              style={styleCD.iconImg}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              gap: scaleXiPhone15.fourH,
              alignItems: "center",
              //backgroundColor: "red",
            }}
          >
            <Ionicons
              name={"eye"}
              size={scaleXiPhone15.twentyEightH}
              color={ovnioColors.grayIconColor}
            />
            <Text style={styleCD.txtTitle}>
              {addZeroToSingleDigitNum(prop.countWatch)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styleCD.container}>
      <NameTimeComp />
      <ParentalBlockComp />
      {prop.chDetail?.schedule_id ? <ViewsComp /> : null}
      {showDesc ? <ChDescComp chDetail={prop.chDetail} /> : null}
    </View>
  );
};
const ChDescComp = (prop) => {
  let des = prop.chDetail?.description?.replace(/<[^>]+>/g, "");
  des = des?.replace("&nbsp;", " ");
  return (
    <View style={{ gap: scaleXiPhone15.sixteenH }}>
      <View style={styleCD.containerDesc}>
        <Text
          style={[
            styleCD.txtHeading,
            {
              flex: 1,
              fontFamily: fonts.medium,
              paddingRight: scaleXiPhone15.twelveH,
            },
          ]}
        >
          {prop.chDetail?.episode}
        </Text>
        <View style={styleCD.containerDescTime}>
          <Text style={styleCD.txtReactangleBg}>
            {prop.chDetail?.time_start}
            {" - "}
            {prop.chDetail?.time_end}
          </Text>
        </View>
      </View>
      {/* <WebView
        style={{
          backgroundColor: ovnioColors.background,
          width: "100%",
          height: 100,
        }}
        originWhitelist={["*"]}
        source={{ html: prop.chDetail?.description }}
      /> */}
      <Text style={styleCD.txtDesc}>{des}</Text>
    </View>
  );
};
const styleCD = StyleSheet.create({
  container: {
    gap: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.twelveW,
    backgroundColor: "#27282c",
    //backgroundColor: "yellow",
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //backgroundColor: "green",
  },
  txtTitle: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveH,
    color: "#a3a4a6",
  },
  conatinerParentControlBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scaleXiPhone15.tenH,
    paddingHorizontal: scaleXiPhone15.twelveW,
    //border
    borderRadius: scaleXiPhone15.tenH * 2,
    borderColor: ovnioColors.primaryRed,
    borderWidth: scaleXiPhone15.oneH,
  },
  containerRemove: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scaleXiPhone15.twelveW,
    paddingVertical: scaleXiPhone15.tenH,
    borderRadius: scaleXiPhone15.tenH * 2,
    backgroundColor: ovnioColors.primaryRed,
  },
  txtParentCtrl: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.tenH,
    color: ovnioColors.primaryRed,
  },
  txtHeading: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.sixteenH,
    color: ovnioColors.white,
    paddingRight: scaleXiPhone15.fourH,
  },
  containerEye: {
    alignItems: "center",
    gap: scaleXiPhone15.eightH,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "blue",
  },
  containerDesc: {
    //paddingVertical: scaleXiPhone15.eightH,
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "green",
  },
  containerDescTime: {
    paddingVertical: scaleXiPhone15.fourH,
    paddingHorizontal: scaleXiPhone15.fourH,
    borderRadius: scaleXiPhone15.twoH,
    backgroundColor: ovnioColors.white,
  },
  txtReactangleBg: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.blackContainerBg,
  },
  txtDesc: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twelveH,
    color: "#a3a4a6",
  },
  containerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: scaleXiPhone15.eightH,
    //backgroundColor: "green",
  },
  iconImg: {
    height: scaleXiPhone15.twentyEightH,
    width: scaleXiPhone15.twentyEightH,
  },
});
//#endregion

//#region Api
async function GetChannelDetailAPICall(chId, setChDet, setLoader) {
  setLoader(true);
  await GetChannelDetail(chId)
    .then((res) => {
      setLoader(false);
      const { channel, schedules } = res.data.data;
      /* console.log(
        "\u001b[1;32mHD.js : Res GetChannelDetail = ",
        JSON.stringify(res.data.data)
      ); */

      if (schedules.length > 0) {
        const arrTmp = schedules.filter((item) => item.active == 1);
        const schData = arrTmp.length === 1 ? arrTmp[0] : schedules[0];
        const current_time = getLocalTimeStampFromUTCDate(schData.current_time);
        const { time_start, time_end } =
          getLocalStartEndTimeStampFromUTCStartDate(
            schData.start_time,
            schData.duration
          );

        const chDet = {
          id: channel.id,
          channel: channel.seq_no,
          channel_name: channel.channel_name,
          image: channel.channel_image,
          ispinned: channel.ispinned,
          blocked: channel.blocked,
          content_id: schData.content_id,
          schedule_id: schData.id,
        };
        GlobalValue.crtChannel = chDet;
        const chData = { ...chDet };
        chData.isfavourite = channel.isfavourite;
        chData.ch_description = channel.description;
        chData.liveUrl = channel.liveUrl;

        //schdeule info
        chData.title = schData.name;
        chData.season = schData.season;
        chData.episode = schData.episode;
        chData.description = schData.description;
        chData.uri = schData.uri;
        chData.schImg = schData.image;
        chData.current_time = current_time;
        chData.time_start = time_start;
        chData.time_end = time_end;

        console.log("\u001b[1;32mHD.js :  chData = ", JSON.stringify(chData));
        setChDet(chData);
      } else {
        const chDet = {
          id: channel.id,
          channel: channel.seq_no,
          channel_name: channel.channel_name,
          image: channel.channel_image,
          ispinned: channel.ispinned,
          blocked: channel.blocked,
        };
        GlobalValue.crtChannel = chDet;
        const chData = { ...chDet };
        chData.isfavourite = channel.isfavourite;
        chData.ch_description = channel.description;
        chData.liveUrl = channel.liveUrl;
        console.log("\u001b[1;32mHD.js :  chData = ", JSON.stringify(chData));
        setChDet(chData);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Detail");
    });
}
async function PostChannelGuideAPICall(chId, setChGuide, setLoader) {
  const crtDate = convertDateToAPIFormat(new Date());
  const body = {
    channel: chId,
    showLimit: 10,
    current_date: crtDate,
  };
  setLoader(true);
  await PostChannelGuideWithId(body, chId)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mHD.js :Channel Guide Res = ",
        JSON.stringify(res.data.data?.programs?.length)
      );
      if (res.data.data?.programs) {
        for (prog of res.data.data.programs) {
          const { time_start, time_end } =
            getLocalStartEndTimeStampFromUTCStartDate(
              prog.start_time,
              prog.duration,
              prog.id
            );
          prog.time_start = time_start;
          prog.time_end = time_end;
        }
      }
      setChGuide(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Guide Error");
    });
}
async function PostChannelFeaturedContentAPICall(
  chId,
  setArrContent,
  setLoader
) {
  setLoader(true);
  const body = {
    showLimit: 10,
  };
  await PostChannelFeaturedContent(chId, body)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mHD.js : Res PostChannelFeaturedContent = ",
        JSON.stringify(res.data.data.length)
      );
      setArrContent(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      if (!error.response.status === 400) {
        showAPIError(error, "Channel Featured Content");
      }
    });
}
//fav
async function GetAddChannelAsFavAPICall(chId, content_id, schedule_id) {
  await GetAddChannelAsFav(chId, content_id, schedule_id)
    .then((res) => {
      console.log(
        "\u001b[1;32mHD.js: RES | Add Fav = ",
        JSON.stringify(res.data.msg)
      );
    })
    .catch((error) => {
      showAPIError(error, "Channel Add Fav");
    });
}
async function DeleteChannelAsFavAPICall(chId) {
  await DeleteSingleUserFavChannel(chId)
    .then((res) => {
      console.log(
        "\u001b[1;32mHD.js: RES | Remove Fav = ",
        JSON.stringify(res.data.msg)
      );
    })
    .catch((error) => {
      showAPIError(error, "Channel Del Fav");
    });
}
//block channel
async function GetSetChannelBlockAPICall(chDetail, setChDet, setLoader) {
  setLoader(true);
  await GetSetChannelBlock(chDetail?.id)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mHD.js : SetChannel Block = ",
        JSON.stringify(res.data)
      );
      GlobalValue.isChannelRefresh = true;
    })
    .catch((error) => {
      setLoader(false);
      setChDet({
        ...chDetail,
        blocked: false,
      });
      showAPIError(error, "Set Block Error");
    });
}
async function GetChannelUnblockAPICall(chDetail, setChDet, setLoader) {
  setLoader(true);
  await GetChannelUnblock(chDetail?.id)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mHD.js :Res unblock channel = ",
        JSON.stringify(res.data)
      );
      GlobalValue.isChannelRefresh = true;
    })
    .catch((error) => {
      setLoader(false);
      setChDet({
        ...chDetail,
        blocked: true,
      });
      showAPIError(error, "Unblock Error");
    });
}
//content watched
async function GetChannelWatchedAPICall(para) {
  await GetChannelWatched(para)
    .then((res) => {
      console.log(
        "\u001b[1;32mHD.js : Res GetChannelWatched = ",
        JSON.stringify(res.data)
      );
    })
    .catch((error) => {
      showAPIError(error, "Channel Watched Error");
    });
}
//watched count
async function GetChannelWatchedCountAPICall(chId, setWatchCount) {
  await GetChannelWatchedCount(chId)
    .then((res) => {
      console.log(
        "\u001b[1;32mHD.js : Res GetChannelWatchedCount = ",
        JSON.stringify(res.data.data.usercount)
      );
      setWatchCount(res.data.data.usercount);
    })
    .catch((error) => {
      showAPIError(error, "Error | Channel Watched Count");
    });
}
//Share Link
async function GetShareLinkAPICall(chId) {
  await GetShareLink(chId)
    .then((res) => {
      console.log(
        "\u001b[1;32mHD.js : Res GetShareLinkAPICall = ",
        JSON.stringify(res.data)
      );
      // return;
      ShareChannelLinkUtil(GlobalValue.crtChannel?.name, res.data.data.link);
    })
    .catch((error) => {
      showAPIError(error, "Error | Share Link");
    });
}
//#endregion
