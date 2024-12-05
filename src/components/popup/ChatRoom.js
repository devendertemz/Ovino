//#region import
import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SectionList,
  TextInput,
  KeyboardAvoidingView,
  Image,
} from "react-native";
const height = Dimensions.get("window").height;
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
//baseComponent
//baseComponent
import CustomLoader from "../baseComponent/CustomLoader";
//blockComponent
import EmptyListComp from "../blockComponent/EmptyListComp";
//utils
import SocketServcies from "../../utils/SocketService";
import {
  convertUTCDateTimeStampToDate,
  getLocalTimeStampFromUTCDate,
} from "../../utils/DateTimeUtil";
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
  checkForTablet,
} from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//api
import { HttpRequestBaseURLConfig } from "../../api/Config";
import { GetChatMsg } from "../../api/GetRequest";
import { showAPIError } from "../../api/Config";
import GlobalValue from "../../api/GlobalVar";
//#endregion

let arrChat = [];

//#region Main
export default ChatRoom = (prop) => {
  const [loader, setLoader] = useState(false);
  const [reload, setReload] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [isLoadMore, setLoadMore] = useState(false);

  //api
  useEffect(() => {
    if (prop.status) {
      setPageCount(1);
      GetPrevChatAPICall(
        prop.selFriend.id,
        1,
        setReload,
        setLoadMore,
        setLoader
      );
      SocketServcies.initializeSocket();
      SocketServcies.on("Online", async (res) => {
        console.log("Online = ", JSON.stringify(res));
      });
      SocketServcies.on("Offline", async (res) => {
        console.log("Offline = ", JSON.stringify(res));
      });
      SocketServcies.on("Ack", async (res) => {
        console.log("Ack = ", JSON.stringify(res));
      });
      SocketServcies.on("ServerToClient", async (res) => {
        serverToClientRec(res);
      });
    }
    return () => {
      prop.status ? onUseEffectReturnCall() : null;
    };
  }, []);

  //#region action
  function onUseEffectReturnCall() {
    arrChat = [];
    console.log(
      "CR.js : useEffect[] return call arrChat.length = ",
      arrChat.length
    );
  }
  function serverToClientRec(res) {
    recMsg(res, setReload);
  }
  const onLoadMoreClicked = () => {
    const nextPage = pageCount + 1;
    setPageCount(nextPage);
    GetPrevChatAPICall(
      prop.selFriend.id,
      nextPage,
      setReload,
      setLoadMore,
      setLoader
    );
  };
  const onCloseBtnClick = () => {
    SocketServcies.disconnect();
    prop.onClose();
  };
  const onSendClick = (msgTxt) => {
    const msgChat = {
      to_user_id: prop.selFriend.id,
      msg: msgTxt.trim(),
    };
    // SocketServcies.emit("ClientToServer", JSON.stringify(msgChat));
    SocketServcies.emit("ClientToServer", msgChat);

    //crt local msg item
    const msgItem = {
      from_user_id: GlobalValue.userId,
      to_user_id: prop.selFriend.id,
      msg: msgTxt.trim(),
      created_at: new Date().toUTCString(),
    };
    msgItem.sectionDate = convertUTCDateTimeStampToDate(msgItem.created_at);
    msgItem.chatTime = getLocalTimeStampFromUTCDate(msgItem.created_at);
    sendMsg(msgItem, setReload);
  };

  //#endregion

  const renderSectionListRow = (props) => {
    return <ChatMsgComp item={props.item} />;
  };
  const renderListFooter = (props) => {
    if (isLoadMore) {
      return (
        <TouchableOpacity
          disabled={loader}
          style={{
            marginBottom: scaleXiPhone15.sixteenH,
            paddingVertical: scaleXiPhone15.sixteenH,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(52, 52, 52, 0.8)",
          }}
          onPress={onLoadMoreClicked}
        >
          {loader ? (
            <CustomLoader isSmall={true} color={ovnioColors.primaryRed} />
          ) : arrChat.length === 0 ? null : (
            <Text style={{ ...stylesCommon.txtBtn }}>Load More</Text>
          )}
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={prop.status}>
      <View style={[styles.centeredView]}>
        <View style={[styles.container, { height: prop.height }]}>
          <HeaderChatDetails
            isOnline={prop.selFriend.isActive}
            title={prop.selFriend.name}
            profile_pic={prop.selFriend.profile_pic}
            onClose={onCloseBtnClick}
          />
          <SectionList
            extraData={reload}
            inverted={true}
            sections={arrChat}
            keyExtractor={(item, index) => item + index}
            renderItem={renderSectionListRow}
            renderSectionFooter={({ section: { title } }) => (
              <MsgSectionHeader title={title} />
            )}
            ListFooterComponent={renderListFooter}
          />
          <SendIconOption onSendClick={onSendClick} />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    //backgroundColor: "#2E2E2E",
  },
  container: {
    //height: "55%",
    borderTopLeftRadius: scaleXiPhone15.fortyH,
    borderTopRightRadius: scaleXiPhone15.fortyH,
    backgroundColor: "#2E2E2E",
    // backgroundColor: "yellow",
  },
});
//#endregion

//#region HeaderChatDetails
const HeaderChatDetails = ({ title, profile_pic, isOnline, onClose }) => {
  return (
    <View style={stylesHCD.headerContainer}>
      <Image
        style={stylesHCD.img}
        resizeMode={"cover"}
        source={{
          uri: profile_pic ? profile_pic : "",
        }}
      />
      <View style={stylesHCD.containerName}>
        <Text numberOfLines={1} style={stylesHCD.title}>
          {title}
        </Text>
        <Text style={stylesHCD.txtActive}>
          {isOnline ? "Active now" : "Offline"}
        </Text>
      </View>
      <TouchableOpacity style={stylesHCD.containerClose} onPress={onClose}>
        <Ionicons
          name="close"
          size={scaleXiPhone15.thrityH}
          color={"#8E8E8E"}
        />
      </TouchableOpacity>
    </View>
  );
};
const stylesHCD = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: scaleXiPhone15.sixteenH,
    //backgroundColor: "yellow",
  },
  img: {
    height: scaleXiPhone15.fivtyH,
    width: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.fivtyH * 0.5,
    backgroundColor: ovnioColors.grayDesc,
  },
  containerName: {
    flex: 1,
    marginHorizontal: scaleXiPhone15.eightH,
    gap: scaleXiPhone15.twoH,
    //backgroundColor: "pink",
  },
  containerClose: {
    marginLeft: "auto", // Push the icon to the right
    //backgroundColor: "orange",
  },
  title: {
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
  },
  txtActive: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: "#797C7BCC",
  },
});
//#endregion

//#region ChatMsgComp
const ChatMsgComp = (props) => {
  const typeIsRec = props.item.to_user_id == GlobalValue.userId;
  return (
    <View
      style={{
        alignSelf: typeIsRec ? "flex-start" : "flex-end",
        marginTop: scaleXiPhone15.tenH,
        //backgroundColor: "pink",
      }}
    >
      <MsgComp left={typeIsRec} item={props.item} />
      <Text
        style={[
          stylesCM.txtTime,
          { alignSelf: typeIsRec ? "flex-start" : "flex-end" },
        ]}
      >
        {props.item.chatTime}
      </Text>
    </View>
  );
};
const stylesCM = StyleSheet.create({
  txtTime: {
    paddingHorizontal: scaleXiPhone15.twelveH,
    marginVertical: scaleXiPhone15.sixH,
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: "#797C7B80",
  },
});

//#endregion

//#region MsgComp
const MsgComp = (props) => {
  return (
    <View
      style={[
        stylesMsg.messageContainer,
        props.left
          ? { borderTopLeftRadius: 0, backgroundColor: "#525252" }
          : { borderTopRightRadius: 0, backgroundColor: "#FBB231" },
      ]}
    >
      <Text style={stylesMsg.message}>{props.item.msg}</Text>
    </View>
  );
};
const stylesMsg = StyleSheet.create({
  messageContainer: {
    borderRadius: scaleXiPhone15.sixteenH,
    maxWidth: "75%",
    padding: scaleXiPhone15.tenH,
    marginHorizontal: scaleXiPhone15.tenH,
  },
  message: {
    fontSize: scaleXiPhone15.fouteenH,
    color: ovnioColors.white,
    fontFamily: fonts.medium,
  },
});
//#endregion

//#region MsgSectionHeader
const MsgSectionHeader = (props) => {
  return (
    <View
      style={{
        paddingHorizontal: scaleXiPhone15.sixteenH,
        paddingVertical: scaleXiPhone15.sixH,
        borderRadius: scaleXiPhone15.eightH,
        alignSelf: "center",
        backgroundColor: "#3F3F3F",
      }}
    >
      <Text
        style={[
          {
            color: "#F5F5F5",
            fontSize: scaleXiPhone15.twelveH,
            fontFamily: fonts.medium,
          },
        ]}
      >
        {props.title}
      </Text>
    </View>
  );
};
//#endregion

//#region SendIconOption
const SendIconOption = (props) => {
  const [msgTxt, setMsgTxt] = useState("");
  const keyboard = useAnimatedKeyboard();
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));
  const onSendClick = () => {
    if (msgTxt.trim().length === 0) {
      setMsgTxt("");
      return;
    } else {
      const msgTmp = msgTxt;
      props.onSendClick(msgTmp);
      setMsgTxt("");
    }
  };

  return (
    <Animated.View style={[stylesSend.container, animatedStyles]}>
      <TextInput
        style={[
          stylesSend.txtInput,
          {
            //maxHeight: scaleXiPhone15.sixtyH,
            paddingTop: scaleXiPhone15.sixteenH,
            textAlign: "left",
            textAlignVertical: "top", //only andriod
          },
        ]}
        autoCorrect={false}
        spellCheck={false}
        placeholder={"Write your message"}
        placeholderTextColor={"#747476"}
        onChangeText={setMsgTxt}
        autoCapitalize="none"
        value={msgTxt}
        keyboardType="default"
        color={"#747476"}
        multiline={true}
      />
      <TouchableOpacity
        onPress={onSendClick}
        style={{ paddingStart: scaleXiPhone15.tenH }}
      >
        <Ionicons
          name={"send"}
          size={scaleXiPhone15.thrityH}
          style={{
            marginBottom: scaleXiPhone15.eightH,
            transform: [{ rotate: "320deg" }],
            color: ovnioColors.primaryRed,
          }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
const stylesSend = StyleSheet.create({
  container: {
    marginVertical: scaleXiPhone15.sixteenH,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scaleXiPhone15.sixteenH,
    // backgroundColor: "green",
  },
  txtInput: {
    paddingHorizontal: scaleXiPhone15.twelveH,
    flex: 1,
    textAlign: "left",
    fontSize: scaleXiPhone15.sixteenH,
    borderRadius: scaleXiPhone15.eightH,

    alignItems: "center",
    backgroundColor: "#232325",
    height: scaleXiPhone15.fivtyH,
    color: "#747476",
    fontFamily: fonts.medium,

    //backgroundColor: "red",
  },
});
//#endregion

//#region Api
async function GetPrevChatAPICall(
  userId,
  pageCount,
  setReload,
  setLoadMore,
  setLoader
) {
  setLoader(true);
  const para = { page: pageCount, count: 10 };
  await GetChatMsg(userId, para)
    .then((res) => {
      setLoader(false);
      const recordsTotal = res.data.recordsTotal;
      const resData = res.data.data.reverse();
      if (!resData || resData.length < 1) {
        pageCount === 1 ? (arrChat = []) : null;
        setLoadMore(false);
        return;
      }

      let arrSection = [];
      for (item of resData) {
        const sectionDate = convertUTCDateTimeStampToDate(item.created_at);
        const chatTime = getLocalTimeStampFromUTCDate(item.created_at);
        item.sectionDate = sectionDate;
        item.chatTime = chatTime;
        arrSection.push(sectionDate);
      }
      arrSection = Array.from(new Set(arrSection));
      if (pageCount === 1) {
        console.log(
          "\u001b[1;32mCR.js : recordsTotal  = ",
          JSON.stringify(recordsTotal)
        );

        //console.log("\u001b[1;32mCR.js : resData  = ", JSON.stringify(resData));
        parseDateForChat(arrSection, resData);
        if (recordsTotal === 10) {
          setLoadMore(true);
        }
      } else {
        if (arrChat[arrChat.length - 1].title === arrSection[0]) {
          const arrTmp = resData.filter(
            (item) => item.sectionDate === arrSection[0]
          );
          const objLastChat = arrChat[arrChat.length - 1];
          objLastChat.data.push(...arrTmp);
          arrChat[arrChat.length - 1] = objLastChat;
          //remove first item
          arrSection.shift();
          parseDateForChat(arrSection, resData);
        } else {
          parseDateForChat(arrSection, resData);
        }
      }
      setReload((flag) => !flag);
      console.log("\u001b[1;32mCR.js : Res arrChat.length  = ", arrChat.length);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Chat List Error");
    });
}
function parseDateForChat(arrDates, resData) {
  for (secdate of arrDates) {
    const obj = {};
    obj.title = secdate;
    const arrTmp = resData.filter((item) => item.sectionDate === secdate);
    obj.data = arrTmp;
    arrChat.push(obj);
  }
}
function recMsg(res, setReload) {
  const sectionDate = convertUTCDateTimeStampToDate(res.created_at);
  const chatTime = getLocalTimeStampFromUTCDate(res.created_at);
  res.sectionDate = sectionDate;
  res.chatTime = chatTime;
  console.log("ServerToClient = ", JSON.stringify(res));
  console.log("arrChat = ", JSON.stringify(arrChat.length));
  // console.log("arrTmp = ", JSON.stringify(arrTmp));

  const arrTmp = arrChat.filter((item) => item.title === sectionDate);
  if (arrTmp.length === 0) {
    const obj = {};
    obj.title = sectionDate;
    obj.data = [res];
    arrChat.unshift(obj);
  } else {
    const crtItem = arrTmp[0];
    crtItem.data.unshift(res);
    arrChat[0] = crtItem;
  }
  setReload((flag) => !flag);
}
function sendMsg(res, setReload) {
  if (arrChat.length == 0) {
    const obj = {};
    obj.title = res.sectionDate;
    obj.data = [res];
    arrChat.unshift(obj);
  } else {
    const latestChat = arrChat[0];
    if (latestChat.title === res.sectionDate) {
      latestChat.data.unshift(res);
      arrChat[0] = latestChat;
    } else {
      const obj = {};
      obj.title = res.sectionDate;
      obj.data = [res];
      arrChat.unshift(obj);
    }
  }
  setReload((flag) => !flag);
}
//#endregion
