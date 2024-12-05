//#region import
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  SectionList,
  Dimensions,
  View,
} from "react-native";
const height = Dimensions.get("window").height;
//baseComponent
import CustomLoader from "../../../../components/baseComponent/CustomLoader";
//blockComponent
import EmptyListComp from "../../../../components/blockComponent/EmptyListComp";
//utils
import SocketServcies from "../../../../utils/SocketService";
import { stylesCommon } from "../../../../utils/CommonStyle";
import { ovnioColors, scaleXiPhone15, fonts } from "../../../../utils/Variable";
import {
  convertUTCDateTimeStampToDate,
  getLocalTimeStampFromUTCDate,
} from "../../../../utils/DateTimeUtil";
//api
import { GetChatMsg } from "../../../../api/GetRequest";
import { showAPIError } from "../../../../api/Config";
//misc
import {
  MsgSectionHeader,
  HeaderChatDetails,
  ChatMsgComp,
  SendIconOption,
} from "./DirectChatHelper";
//#endregion

//#region Main
let arrChat = [];
export default DirectChat = ({ navigation, route }) => {
  const { user } = route.params;
  console.log("user = ", user);

  //#region useState
  const [reload, setReload] = useState(false);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [isLoadMore, setLoadMore] = useState(false);
  //#endregion

  //#region api
  useEffect(() => {
    GetPrevChatAPICall(user.user_id, 1, setReload, setLoadMore, setLoader);
    SocketServcies.initializeSocket();
    SocketServcies.on("Online", async (res) => {
      console.log("Online = ", JSON.stringify(res)); //user object
    });
    SocketServcies.on("Offline", async (res) => {
      console.log("Offline = ", JSON.stringify(res));
    });
    SocketServcies.on("Ack", async (res, chatObj) => {
      console.log("Ack on sender end |  res = ", JSON.stringify(res));
      console.log("Ack on sender end |  chatObj = ", JSON.stringify(chatObj));
      if (Number(chatObj.module_type) === 2) {
        chatObj.sectionDate = convertUTCDateTimeStampToDate(chatObj.created_at);
        chatObj.chatTime = getLocalTimeStampFromUTCDate(chatObj.created_at);
        sendMsg(chatObj, setReload);
      }
    });
    SocketServcies.on("ServerToClient", async (res) => {
      console.log("ServerToClient = ", JSON.stringify(res));
      if (Number(res.module_type) === 2) {
        serverToClientRec(res);
      }
    });
    return () => {
      SocketServcies.disconnect();
      console.log("SocketServcies.disconnect");
      arrChat = [];
      console.log(
        "DC.js : useEffect[] return call arrChat.length = ",
        arrChat.length
      );
    };
  }, []);
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onSendClick = (msgTxt) => {
    const msgChat = {
      to_user_id: user.user_id,
      msg: msgTxt.trim(),
      module_type: 2,
    };
    console.log("msgChat = ", msgChat);
    SocketServcies.emit("ClientToServer", msgChat);
    //SocketServcies.emit("ClientToServer", JSON.stringify(msgChat));
  };
  function serverToClientRec(res) {
    recMsg(res, setReload);
  }
  const onLoadMoreClicked = () => {
    const nextPage = pageCount + 1;
    setPageCount(nextPage);
    GetPrevChatAPICall(
      user.user_id,
      nextPage,
      setReload,
      setLoadMore,
      setLoader
    );
  };
  //#endregion

  //#region JSX
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
  const renderFlatListEmpty = () => {
    return (
      <View
        style={{
          height: height * 0.8,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ rotate: "180deg" }],
        }}
      >
        {loader ? (
          <CustomLoader isSmall={true} color={ovnioColors.primaryRed} />
        ) : (
          <EmptyListComp ionIcons={"chatbubbles-outline"} />
        )}
      </View>
    );
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background, flex: 1 }}>
      <HeaderChatDetails
        title={user.first_name}
        profile_pic={user.profile_pic}
        onClose={onBackBtnPress}
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
        ListEmptyComponent={renderFlatListEmpty}
      />
      <SendIconOption onSendClick={onSendClick} />
    </SafeAreaView>
  );
};
//#endregion

//#region API
async function GetPrevChatAPICall(
  userId,
  pageCount,
  setReload,
  setLoadMore,
  setLoader
) {
  setLoader(true);
  const para = { page: pageCount, module_type: 2, count: 10 };
  await GetChatMsg(userId, para)
    .then((res) => {
      setLoader(false);
      const { data, recordsTotal } = res.data;
      const resData = data.reverse();
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
      console.log("\u001b[1;32mDC.js : Res arrChat.length  = ", arrChat.length);
      console.log("\u001b[1;32mDC.js : Res recordsTotal  = ", recordsTotal);
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
    //console.log("obj = ", JSON.stringify(obj, null, 4));
    arrChat.push(obj);
  }
}
//#endregion

//#region Helper
function recMsg(res, setReload) {
  const sectionDate = convertUTCDateTimeStampToDate(res.created_at);
  const chatTime = getLocalTimeStampFromUTCDate(res.created_at);
  res.sectionDate = sectionDate;
  res.chatTime = chatTime;
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
  console.log("sendMsg |  res = ", JSON.stringify(res));
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
