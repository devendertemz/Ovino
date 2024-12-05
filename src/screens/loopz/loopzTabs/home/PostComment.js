//#region import
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  SectionList,
  TextInput,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
//baseComponent
import BtnApp from "../../../../components/baseComponent/BtnApp";
import CustomLoader from "../../../../components/baseComponent/CustomLoader";
//blockComponent
import PopupHeader from "../../../../components/blockComponent/PopupHeader";
import EmptyListComp from "../../../../components/blockComponent/EmptyListComp";

//utils
import { stylesCommon } from "../../../../utils/CommonStyle";
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../../../utils/Variable";
import { getMessageTimePassed } from "../../../../utils/DateTimeUtil";
//api
import GlobalValue from "../../../../api/GlobalVar";
import { showAPIError, validateUrl } from "../../../../api/Config";
import { GetPostCommentsList } from "../../../../api/GetRequest";
import { PostCommentOnPost } from "../../../../api/PostRequest";
//assets
const plugr_logo = require("../../../../assets/images/plugr_logo/plugr_logo.png");
//#endregion

//#region Main
export default PostComment = ({ navigation, route }) => {
  let { post_id } = route.params;

  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrComment, setArrComment] = useState([]);
  const [selCommment, setSelCmt] = useState({}); //to send reply to a comment
  const [replyCmtId, setReplyCmtId] = useState(0); //show reply count
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  //#endregion

  // api
  useEffect(() => {
    GetPostCommentsAPICall(1, post_id, setArrComment, setTotalCount, setLoader);
  }, []);

  //#region action
  const onCommentReplyCicked = (item) => {
    console.log("onCommentReplyCicked item = ", item);
    setReplyCmtId(item.comment_id);
    setSelCmt(item);
    //ref_input.current.focus();
  };
  const onReplyNumClick = (item) => {
    setReplyCmtId(item.comment_id);
  };
  const onLoadMoreClicked = () => {
    console.log(
      "Fetch More List Data : totalCount | arrComment.length",
      totalCount,
      arrComment.length
    );
    if (totalCount == arrComment.length) {
      return;
    }
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    GetPostCommentsAPICall(
      nextPage,
      post_id,
      setArrComment,
      setTotalCount,
      setLoader
    );
  };
  //#endregion

  //#region JSX
  const KeyExtractorFun = (item, index) => {
    return String(item.reply_id);
  };
  const onSectionHeaderRender = ({ section: { title } }) => {
    return (
      <PostCommentComp
        title={title}
        onCommentReplyCicked={onCommentReplyCicked}
      />
    );
  };
  const onSectionFooterRender = ({ section: { title } }) => {
    if (replyCmtId === title.comment_id) {
      return null;
    } else {
      return (
        <PostCommentReplyNumComp
          title={title}
          onReplyNumClick={onReplyNumClick}
        />
      );
    }
  };
  const onReplyItemRender = ({ item, section: { title } }) => {
    if (replyCmtId === title.comment_id) {
      return <PostReplyComp item={item} />;
    } else {
      return null;
    }
  };
  const renderFlatListFooter = () => {
    if (totalCount == arrComment.length) {
      return null;
    } else {
      return (
        <TouchableOpacity
          disabled={loader}
          style={{
            paddingBottom: scaleXiPhone15.twentyFourH,
            paddingTop: scaleXiPhone15.eightH,
            justifyContent: "center",
            alignItems: "center",
            //backgroundColor: ovnioColors.blackContainerBg,
          }}
          onPress={onLoadMoreClicked}
        >
          {loader ? (
            <CustomLoader isSmall={true} color={ovnioColors.primaryRed} />
          ) : (
            <Text style={{ ...stylesCommon.txtBtn }}>Load More</Text>
          )}
        </TouchableOpacity>
      );
    }
  };
  const renderSectionListEmpty = () => {
    return (
      <>
        {loader ? (
          <CustomLoader isSmall={true} color={ovnioColors.primaryRed} />
        ) : (
          <EmptyListComp
            ionIcons={"chatbox-ellipses-outline"}
            title={"No Comments !"}
            desc={""}
          />
        )}
      </>
    );
  };

  //#endregion

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ flex: 0.3 }}
        onPress={() => navigation.goBack()}
      ></TouchableOpacity>
      <View style={styles.bottomView}>
        <PopupHeader title="Comments" />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={arrComment}
          keyExtractor={KeyExtractorFun}
          renderSectionHeader={onSectionHeaderRender}
          renderSectionFooter={onSectionFooterRender}
          renderItem={onReplyItemRender}
          ListEmptyComponent={renderSectionListEmpty}
          // ListFooterComponent={renderFlatListFooter}
        />
        <SendCommentComp
          post_id={post_id}
          selCommment={selCommment}
          arrComment={arrComment}
          setArrComment={setArrComment}
          setTotalCount={setTotalCount}
          onCommentReplyCicked={onCommentReplyCicked}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  bottomView: {
    height: "80%",
    //paddingHorizontal: scaleXiPhone15.eightH,
    paddingTop: scaleXiPhone15.sixteenH,
    gap: scaleXiPhone15.sixteenH,
    position: "absolute",
    width: "100%",
    bottom: 0,
    borderTopLeftRadius: scaleXiPhone15.thrityFourH,
    borderTopRightRadius: scaleXiPhone15.thrityFourH,
    backgroundColor: ovnioColors.background,
    //backgroundColor: "yellow",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
  },
});

//#endregion

//#region PostCommentRow
const PostCommentComp = ({ title, onCommentReplyCicked }) => {
  const onReplyClicked = () => {
    console.log("onReplyClicked");
  };

  return (
    <View style={stylesCmt.container}>
      <Image
        style={stylesCmt.containerProfile}
        source={
          validateUrl(title.profile_pic)
            ? { uri: title.profile_pic }
            : plugr_logo
        }
      />
      <View style={stylesCmt.containerCmt}>
        <Text style={stylesCmt.txtUser}>
          {title.username ? title.username : "Plugr User"}
        </Text>
        <Text style={stylesCmt.txtCmt}>{title.comment_text}</Text>
        <Text
          onPress={() => onCommentReplyCicked(title)}
          style={[
            stylesCmt.txtCmt,
            {
              color: ovnioColors.grayLoopzInActiveColor,
              alignSelf: "flex-start",
            },
          ]}
        >
          Reply&nbsp;&nbsp;{getMessageTimePassed(title.created_at)}
        </Text>
      </View>
    </View>
  );
};
const PostCommentReplyNumComp = ({ title, onReplyNumClick }) => {
  const onMoreReplyClicked = () => {
    onReplyNumClick(title);
  };

  if (title.total_replies == 0) {
    return null;
  } else {
    return (
      <View style={stylesCmt.containerNumReply}>
        <Text
          onPress={onMoreReplyClicked}
          style={[
            stylesCmt.txtCmt,
            { color: ovnioColors.grayLoopzInActiveColor },
          ]}
        >
          ━━ View {title.total_replies} more Reply
        </Text>
      </View>
    );
  }
};
const stylesCmt = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: scaleXiPhone15.eightH,
    marginVertical: scaleXiPhone15.tenH,
    paddingHorizontal: scaleXiPhone15.eightH,
  },
  containerProfile: {
    height: scaleXiPhone15.fivtyH,
    width: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.fivtyH * 0.5,
    //backgroundColor: "lightblue",
  },
  containerCmt: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-between",
    gap: scaleXiPhone15.fourH,
    //backgroundColor: "lightgreen",
  },
  containerNumReply: {
    paddingVertical: scaleXiPhone15.eightH,
    paddingHorizontal: scaleXiPhone15.fivtyH,
    marginLeft: scaleXiPhone15.sixteenH,
    //marginBottom: scaleXiPhone15.eightH,
    //backgroundColor: "pink",
  },
  txtUser: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.white,
  },
  txtCmt: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.white,
  },
});
//#endregion

//#region PostReplyComp
const PostReplyComp = ({ item }) => {
  // console.log("PostReplyComp = ", JSON.stringify(props));
  // const { item } = props;

  return (
    <View style={stylesReply.container}>
      <Image
        style={stylesCmt.containerProfile}
        source={item.profile_pic ? { uri: item.profile_pic } : plugr_logo}
      />

      <View style={stylesReply.containerCmt}>
        <Text style={stylesCmt.txtUser}>
          {item.username ? item.username : ""}
        </Text>
        <Text style={stylesReply.txtCmt}>{item.reply_comment_text}</Text>
        <Text
          style={[
            stylesReply.txtCmt,
            { color: ovnioColors.grayLoopzInActiveColor },
          ]}
        >
          {getMessageTimePassed(item.posted_at)}
        </Text>
      </View>
    </View>
  );
};
const stylesReply = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: scaleXiPhone15.eightH,
    paddingLeft: scaleXiPhone15.fivtyH,
    marginBottom: scaleXiPhone15.eightH,
    //backgroundColor: "pink",
  },
  containerProfile: {
    height: scaleXiPhone15.fivtyH,
    width: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.fivtyH * 0.5,
    //backgroundColor: "lightblue",
  },
  containerCmt: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-between",
    gap: scaleXiPhone15.fourH,
    //backgroundColor: "lightgreen",
  },
  txtUser: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.white,
  },
  txtCmt: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.white,
    //backgroundColor: "green",
  },
});
//#endregion

//#region SendCommentComp
const SendCommentComp = (prop) => {
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
      setMsgTxt("");
      PostCommentAPICall(
        prop.post_id,
        prop.selCommment?.comment_id,
        msgTmp,
        prop.arrComment,
        prop.setArrComment,
        prop.setTotalCount
      );
    }
  };

  if (prop.selCommment?.comment_id) {
    const replyTxt = `Reply to @${
      prop.selCommment?.username ? prop.selCommment?.username : "Plugr user"
    }`;
    return (
      <Animated.View
        style={[
          {
            bottom: GlobalValue.btmSafeArearHt,
            paddingHorizontal: scaleXiPhone15.fourH,
            backgroundColor: ovnioColors.background,
            //backgroundColor: "green",
          },
          animatedStyles,
        ]}
      >
        <View style={stylesSend.containerReplyUser}>
          <Text style={stylesSend.txtReplyTo}>{replyTxt}</Text>
          <TouchableOpacity onPress={() => prop.onCommentReplyCicked({})}>
            <Ionicons
              name={"close"}
              size={scaleXiPhone15.twentyFourH}
              style={{
                color: ovnioColors.primaryRed,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={[stylesSend.container]}>
          <Image
            style={stylesSend.containerProfile}
            resizeMode={"cover"}
            source={
              GlobalValue.profile_pic
                ? { uri: GlobalValue.profile_pic }
                : plugr_logo
            }
          />
          <TextInput
            style={[
              stylesSend.txtInput,
              {
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
            color={ovnioColors.white}
            multiline={true}
          />
          <TouchableOpacity
            onPress={onSendClick}
            style={stylesSend.containerSend}
          >
            <Ionicons
              name={"send"}
              size={scaleXiPhone15.thrityH}
              style={{
                transform: [{ rotate: "320deg" }],
                color: ovnioColors.primaryRed,
              }}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  } else {
    return (
      <Animated.View
        style={[
          stylesSend.container,
          {
            bottom: GlobalValue.btmSafeArearHt,
            paddingHorizontal: scaleXiPhone15.fourH,
          },
          animatedStyles,
        ]}
      >
        <Image
          style={stylesSend.containerProfile}
          resizeMode={"cover"}
          source={
            GlobalValue.profile_pic
              ? { uri: GlobalValue.profile_pic }
              : plugr_logo
          }
        />
        <TextInput
          style={[
            stylesSend.txtInput,
            {
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
          color={ovnioColors.white}
          multiline={true}
        />
        <TouchableOpacity
          onPress={onSendClick}
          style={stylesSend.containerSend}
        >
          <Ionicons
            name={"send"}
            size={scaleXiPhone15.thrityH}
            style={{
              transform: [{ rotate: "320deg" }],
              color: ovnioColors.primaryRed,
            }}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
};
const stylesSend = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: scaleXiPhone15.eightH,
    height: scaleXiPhone15.fivtySixH,
    backgroundColor: ovnioColors.background,
    //backgroundColor: "lightgreen",
  },
  containerReplyUser: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //backgroundColor: "blue",
  },
  containerProfile: {
    height: scaleXiPhone15.fivtyH,
    width: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.fivtyH * 0.5,
    backgroundColor: "lightblue",
  },
  txtInput: {
    height: scaleXiPhone15.fivtyH,
    paddingHorizontal: scaleXiPhone15.twelveH,
    flex: 1,
    textAlign: "left",
    fontSize: scaleXiPhone15.sixteenH,
    backgroundColor: "#232325",

    fontFamily: fonts.medium,
    //border
    borderRadius: scaleXiPhone15.eightH,
    borderWidth: 1,
    borderColor: ovnioColors.grayLoopzInActiveColor,

    //backgroundColor: "red",
  },
  containerSend: {
    paddingHorizontal: scaleXiPhone15.fourH,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "red",
  },
  txtReplyTo: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.grayLoopzInActiveColor,
  },
});
//#endregion

//#region API
async function GetPostCommentsAPICall(
  currentPage,
  post_id,
  setArrComment,
  setTotalCount,
  setLoader
) {
  setLoader(true);
  await GetPostCommentsList(post_id, { limit: 100, page: currentPage })
    .then((res) => {
      setLoader(false);
      const { comments, totalRecord } = res.data;
      console.log(
        "\u001b[1;32mPC.j : Res | comment list = ",
        JSON.stringify(comments.length, null, 4)
      );
      setTotalCount(totalRecord);
      const arrComTmp = [];
      for (com of comments.reverse()) {
        const {
          comment_id,
          comment_text,
          profile_pic,
          username,
          created_at,
          total_replies,
          replies,
        } = com;
        const obj = {
          title: {
            comment_id: comment_id,
            comment_text: comment_text,
            profile_pic: profile_pic, //"https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
            username: username,
            created_at: created_at,
            total_replies: total_replies,
          },
          data: replies,
        };
        arrComTmp.push(obj);
      }
      if (currentPage === 1) {
        setArrComment(arrComTmp);
      } else {
        setArrComment((prevData) => [...prevData, ...arrComTmp]);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Post Comment List");
    });
}
async function PostCommentAPICall(
  post_id,
  parent_comment_id,
  cmtTxt,
  arrComment,
  setArrComment,
  setTotalCount
) {
  console.log("parent_comment_id = ", parent_comment_id);

  const data = {};
  data.post_id = post_id;
  data.comment_text = cmtTxt;
  if (parent_comment_id) {
    data.parent_comment_id = parent_comment_id;
  }

  const created_at = new Date().toISOString();
  await PostCommentOnPost(post_id, data)
    .then((res) => {
      const { status, msg, data } = res.data;
      console.log("\u001b[1;32mPC.j : Res | post comment data = ", data);
      if (parent_comment_id) {
        const arrCmtTmp = [...arrComment];
        const index = arrCmtTmp.findIndex(
          (item) => item.title.comment_id === parent_comment_id
        );
        const itemCmt = arrCmtTmp[index];
        itemCmt.title.total_replies = Number(itemCmt.title.total_replies) + 1;
        const reply = {
          reply_id: data.comment_id,
          reply_comment_text: cmtTxt,
          profile_pic: GlobalValue.profile_pic,
          username: GlobalValue.username,
          posted_at: created_at,
        };
        itemCmt.data.push(reply);
        arrCmtTmp[index] = itemCmt;
        setArrComment(arrCmtTmp);
      } else {
        const cmt = {
          title: {
            comment_id: data.comment_id,
            comment_text: cmtTxt,
            profile_pic: GlobalValue.profile_pic,
            username: GlobalValue.username,
            total_replies: 0,
            created_at: created_at,
          },
          data: [],
        };
        setArrComment((prevData) => [cmt, ...prevData]);
        setTotalCount((prevTime) => prevTime + 1);
      }
    })
    .catch((error) => {
      showAPIError(error, "Error | Post Comment");
    });
}
//#endregion
