//#region import
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  SectionList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../../utils/Variable.js";
//#endregion

//#region ChatDetail
export default function ChatDetail({ navigation }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [customText, setCustomText] = useState("");

  const sections = [
    {
      title: "Today",
      data: [
        { id: "1", type: "received", message: "Hello!" },
        { id: "2", type: "sent", message: "Hi there!" },
        { id: "3", type: "received", message: "How are you?" },
        { id: "4", type: "sent", message: "I'm good, thanks!" },
      ],
    },
    {
      title: "Yesterday",
      data: [
        { id: "5", type: "sent", message: "Did you complete the task?" },
        { id: "6", type: "received", message: "Yes, I did!" },
      ],
    },
  ];
  const [arrChat, setArrChat] = useState(sections);

  //#endregion

  //#region JSX
  const LoaderComp = () => {
    if (loader) {
      return (
        <CustomLoader
          padding={scaleXiPhone15.sixteenH}
          isSmall={false}
          color={ovnioColors.primaryRed}
        />
      );
    } else {
      return null;
    }
  };

  //#endregion
  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <HeaderChatDetails
        iconRightTwo={"search"}
        title="Peter Robinson"
        onBackBtnPress={() => onBackBtnPress(navigation)}
        onShareBtnPress={() => console.log("search")}
      />
      <LoaderComp />
      <SectionList
        style={{ paddingHorizontal: scaleXiPhone15.twelveH }}
        onEndReachedThreshold={0.2}
        sections={arrChat}
        inverted={true}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <RenderItemData item={item} nav={navigation} />
        )}
        renderSectionFooter={({ section: { title } }) => (
          <MsgSectionHeader title={title} />
        )}
      />
      <View
        style={{
          height: scaleXiPhone15.oneH / 2,
          width: "100%",
          backgroundColor: "#EEFAF8",
          marginVertical: scaleXiPhone15.eightH,
        }}
      ></View>
      <SendIconOption
        arrChat={arrChat}
        setArrChat={setArrChat}
        nav={navigation}
        customText={customText}
        setCustomText={setCustomText}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region Actions
const onBackBtnPress = (navigation) => {
  navigation.goBack();
};
//#endregion

//#region RenderItemData
const RenderItemData = (props) => {
  // console.log("RenderItemData:-"+JSON.stringify(props.item.type))
  return (
    <>
      {props.item.type === "received" ? (
        <ChatLeftComp item={props.item} />
      ) : (
        <ChatRightComp item={props.item} />
      )}
    </>
  );
};
//#endregion

//#region ChatLeftComp
const ChatLeftComp = (props) => {
  //  console.log('ChatLeftComp--->' + JSON.stringify(props.item));

  return (
    <View style={stylesChatLeft.ViewContainer}>
      <MsgComp left={true} item={props.item} />

      <Text style={stylesChatLeft.txtTime}>09:25 AM</Text>
    </View>
  );
};
const stylesChatLeft = StyleSheet.create({
  ViewContainer: {
    alignSelf: "flex-start",
    marginTop: scaleXiPhone15.tenH,
  },
  txtTime: {
    marginVertical: scaleXiPhone15.sixH,
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: "#797C7B80",
    paddingHorizontal: scaleXiPhone15.twelveH,
  },
});
//#endregion

//#region ChatRightComp
const ChatRightComp = (props) => {
  // console.log('ChatRightComp--->' + JSON.stringify(props.item));

  return (
    <View
      style={{
        alignSelf: "flex-end",
        marginTop: scaleXiPhone15.tenH,
      }}
    >
      <MsgComp item={props.item} />
      <Text style={[stylesChatLeft.txtTime, { alignSelf: "flex-end" }]}>
        09:25 AM
      </Text>
    </View>
  );
};

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
      <Text style={stylesMsg.message}>{props.item.message}</Text>
    </View>
  );
};
const stylesMsg = StyleSheet.create({
  messageContainer: {
    //  alignSelf: 'flex-end',
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
  const onSendClick = () => {
    if (props.customText === "") return;

    if (props.arrChat.length > 0) {
      const arrChat = props.arrChat;
      const arrData = arrChat[0].data;

      const localMsg = {
        id: new Date(),
        type: "sent",
        message: props.customText,
      };

      arrData.unshift(localMsg);

      props.setArrChat([]);
      props.setArrChat(arrChat);
      props.setCustomText("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "android" ? "" : "padding"}
      style={[stylesSend.containerTitle]}
    >
      <TextInput
        style={stylesSend.txtInput}
        placeholder={"Write your message"}
        placeholderTextColor={"#747476"}
        onChangeText={props.setCustomText}
        autoCapitalize="none"
        value={props.customText}
        keyboardType="default"
        autoCorrect={false}
        color={"#747476"}
      />
      <TouchableOpacity
        onPress={onSendClick}
        style={{ paddingStart: scaleXiPhone15.tenH }}
      >
        <Ionicons
          name={"send"}
          size={scaleXiPhone15.thrityH}
          style={{
            color: ovnioColors.primaryRed,
          }}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const stylesSend = StyleSheet.create({
  containerTitle: {
    marginVertical: scaleXiPhone15.sixteenH,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scaleXiPhone15.sixteenH,

    //backgroundColor: "green",
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

    // backgroundColor: 'red',
  },
});
//#endregion

//#region MsgSectionHeader
const MsgSectionHeader = (props) => {
  return (
    <View
      style={{
        backgroundColor: "#3F3F3F",
        paddingHorizontal: scaleXiPhone15.sixteenH,
        paddingVertical: scaleXiPhone15.sixH,
        borderRadius: scaleXiPhone15.eightH,

        alignSelf: "center",
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

//#region HeaderChatDetails
const HeaderChatDetails = ({
  title,
  onBackBtnPress,
  onShareBtnPress,
  iconRightTwo,
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={{ flex: 0.2 }} onPress={onBackBtnPress}>
        <Ionicons
          name="arrow-back"
          size={scaleXiPhone15.thrityH}
          color="white"
        />
      </TouchableOpacity>
      <Image
        imageStyle={styles.img}
        style={styles.containerIcon}
        resizeMode={"stretch"}
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu_ze8ULmRywXGNzUgKEcH166XrXgTBoqQZg&s",
        }}
      />

      <View
        style={{
          flex: 0.6,
          marginHorizontal: scaleXiPhone15.eightH,
          gap: scaleXiPhone15.twoH,
        }}
      >
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.txtActive}>Active now</Text>
      </View>

      <TouchableOpacity
        style={{
          marginLeft: "auto", // Push the icon to the right
        }}
        onPress={onShareBtnPress}
      >
        <Ionicons
          name={iconRightTwo}
          size={scaleXiPhone15.thrityH}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scaleXiPhone15.tenH,
    paddingHorizontal: scaleXiPhone15.twelveW,
    backgroundColor: ovnioColors.background,
    //backgroundColor: 'yellow',
  },
  txtActive: {
    //  marginRight:scaleXiPhone15.thrityH,

    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: "#797C7BCC",

    //  backgroundColor:"red",
  },
  title: {
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
    //textAlign: "center",

    //backgroundColor: "pink",
  },
  containerIcon: {
    height: scaleXiPhone15.fivtyH,
    width: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.twentyFourH,

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#818898",
  },
  img: {
    height: scaleXiPhone15.fivtyH,
    width: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.twentyFourH,
  },
});
//#endregion
