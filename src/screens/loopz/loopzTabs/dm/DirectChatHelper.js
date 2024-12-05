//#region import
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SectionList,
  Dimensions,
  TextInput,
} from "react-native";
const height = Dimensions.get("window").height;
//package
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
//utils
import { ovnioColors, scaleXiPhone15, fonts } from "../../../../utils/Variable";
//api
import GlobalValue from "../../../../api/GlobalVar";
import { validateUrl } from "../../../../api/Config";
//assets
const place_small = require("../../../../assets/images/placeHolder/place_small/place_small.png");
//#endregion

//#region HeaderChatDetails
const HeaderChatDetails = ({ title, profile_pic, onClose }) => {
  return (
    <View style={stylesHCD.headerContainer}>
      <TouchableOpacity style={stylesHCD.containerBack} onPress={onClose}>
        <Ionicons
          name="arrow-back"
          size={scaleXiPhone15.twentyFourH}
          color="white"
        />
      </TouchableOpacity>
      <Image
        style={stylesHCD.img}
        resizeMode={"cover"}
        source={
          profile_pic && validateUrl(profile_pic)
            ? {
                uri: profile_pic,
              }
            : place_small
        }
      />
      <Text numberOfLines={1} style={stylesHCD.title}>
        {title}
      </Text>
    </View>
  );
};
const stylesHCD = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.fourH,
    //backgroundColor: "green",
  },
  containerBack: {
    //backgroundColor: "blue",
  },
  img: {
    height: scaleXiPhone15.fivtyH,
    width: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.fivtyH * 0.5,
    backgroundColor: ovnioColors.grayDesc,
  },
  title: {
    flex: 1,
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
  },
});
//#endregion

//#region MsgSectionHeader
const MsgSectionHeader = (props) => {
  return (
    <View style={stylesMH.container}>
      <Text style={stylesMH.txtDate}>{props.title}</Text>
    </View>
  );
};
const stylesMH = StyleSheet.create({
  container: {
    paddingHorizontal: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.sixH,
    borderRadius: scaleXiPhone15.eightH,
    alignSelf: "center",
    backgroundColor: "#3F3F3F",
  },
  txtDate: {
    color: "#F5F5F5",
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
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
            // maxHeight: scaleXiPhone15.sixtyH,
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
    paddingVertical: scaleXiPhone15.eightH,
    paddingHorizontal: scaleXiPhone15.sixteenH,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ovnioColors.blackContainerBg,
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

export { MsgSectionHeader, HeaderChatDetails, ChatMsgComp, SendIconOption };
