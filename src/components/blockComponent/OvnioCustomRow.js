//#region import
import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  Image,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
const widthRow = Dimensions.get("window").width - 32;
const widthRowEight = Dimensions.get("window").width - 16;
const height = Dimensions.get("window").height;

//package
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";

//utils
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
import {
  convertToCustomFormat,
  getMessageTimePassed,
} from "../../utils/DateTimeUtil";
//api
import { validateUrl } from "../../api/Config";

//#endregion

//#region asset
const cnbc = require("../../assets/images/guide/cnbc.png");
const place_width = require("../../assets/images/placeHolder/place_width/place_width.png");
const place_square = require("../../assets/images/placeHolder/place_square/place_square.png");
const place_small = require("../../assets/images/placeHolder/place_small/place_small.png");
const reminder = require("../../assets/icon/reminder/reminder.png");
//#endregion

//#region ProfileViewRow -
const ProfileViewRow = ({ item }) => {
  return (
    <View style={stylesPV.container}>
      <View style={stylesPV.containerIcon}>
        {item.id === 1 || item.id === 2 || item.id === 6 || item.id === 7 ? (
          <Feather
            name={item.icon}
            size={28}
            color={ovnioColors.grayIconColor}
          />
        ) : (
          <MaterialCommunityIcons
            name={item.icon}
            size={28}
            color={ovnioColors.grayIconColor}
          />
        )}
      </View>
      <View style={stylesPV.containerTxt}>
        <Text style={stylesPV.txtTitle}>{item.title}</Text>
        <Text style={stylesPV.txtValue}>{item.value}</Text>
      </View>
    </View>
  );
};
const stylesPV = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    backgroundColor: ovnioColors.grayRemoteBg,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  containerTxt: {
    gap: 4,
    //alignItems: "center",
  },
  txtTitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: ovnioColors.grayIconColor,
  },
  txtValue: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: ovnioColors.grayDesc,
  },
});
//#endregion

//#region ReminderRow - Reminder.js
const ReminderRow = ({ item, onClockPress }) => {
  return (
    <View style={stylesR.container}>
      <ChannelNameRemindComp item={item} />
      <ChannelScheduleRemindComp
        item={item}
        onClockPress={(item) => onClockPress(item)}
      />
    </View>
  );
};
const ChannelNameRemindComp = (prop) => {
  return (
    <View style={stylesR.containerChName}>
      <Image
        source={prop.item.image ? { uri: prop.item.image } : place_square}
        style={stylesR.chImg}
        resizeMode={"contain"}
      />
    </View>
  );
};
const ChannelScheduleRemindComp = (prop) => {
  const { item } = prop;
  return (
    <View style={stylesR.containerChSch}>
      <View style={stylesR.containerWatch}>
        <Text style={stylesR.txtTime}>{item.time_start}</Text>
        {item.active == 1 ? (
          <Text style={stylesR.txtTime}>{item.time_left}mins left</Text>
        ) : null}
      </View>
      <Text style={[stylesCommon.txtCtryName, { color: ovnioColors.white }]}>
        {item.name}
      </Text>
      <View style={stylesR.containerWatch}>
        <Text numberOfLines={2} style={[stylesR.txtTime, { flex: 1 }]}>
          {item.season}&nbsp;{"●"}&nbsp;{item.episode}
        </Text>
        <TouchableOpacity
          disabled={true}
          onPress={() => prop.onClockPress(prop.item)}
        >
          <Image
            style={{
              width: scaleXiPhone15.twentyFourH,
              height: scaleXiPhone15.twentyFourH,
            }}
            resizeMode={"contain"}
            source={reminder}
          />
        </TouchableOpacity>
      </View>
      {item.active == 1 ? (
        <View style={[stylesR.containerLine, { width: 50 + "%" }]}></View>
      ) : null}
    </View>
  );
};
const stylesR = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: scaleXiPhone15.eightW,
    height: scaleXiPhone15.hundredH,
    //backgroundColor: "yellow",
  },
  containerChName: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ovnioColors.blackContainerBg,
  },
  chImg: {
    width: widthRow * 0.25 * 0.75,
    height: scaleXiPhone15.eightyH,
    //backgroundColor: "green",
  },
  containerChSch: {
    flex: 0.75,
    paddingHorizontal: scaleXiPhone15.eightW,
    justifyContent: "space-evenly",
    backgroundColor: ovnioColors.blackContainerBg,
  },
  txtTime: {
    ...stylesCommon.txtGuideTime,
    //backgroundColor: "green",
  },
  containerWatch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "blue",
  },
  containerLine: {
    height: scaleXiPhone15.twoH,
    position: "absolute",
    //width: scaleXiPhone15.twoHundredW,
    bottom: 0,
    backgroundColor: "yellow",
  },
});
//#endregion

//#region NotificationViewRow -
const NotificationViewRow = ({ item }) => {
  return (
    <View style={stylesNV.container}>
      <Text
        style={[
          stylesNV.txtTitle,
          {
            textAlign: "right",
            fontSize: scaleXiPhone15.tenH,
            //backgroundColor: "pink",
          },
        ]}
      >
        {convertToCustomFormat(item.created_at)}
      </Text>
      <View
        style={{
          flexDirection: "row",
          gap: scaleXiPhone15.sixteenH,
          alignItems: "center",
          marginVertical: scaleXiPhone15.sixH,
          //backgroundColor: "red",
        }}
      >
        <View style={stylesNV.containerIcon}>
          {item.image ? (
            <Image
              style={{
                width: scaleXiPhone15.twentyH, //as flex : 0.25
                height: scaleXiPhone15.twentyH,
              }}
              resizeMode={"stretch"}
              source={{
                uri: item.image,
              }}
            />
          ) : (
            <MaterialCommunityIcons
              name={"alarm-note"}
              size={scaleXiPhone15.twentyH}
              color={ovnioColors.white}
            />
          )}
        </View>
        <View style={stylesNV.containerTxt}>
          <Text style={stylesNV.txtValue}>{item.title}</Text>
          <Text style={stylesNV.txtTitle}>{item.body}</Text>
        </View>
      </View>
    </View>
  );
};
const stylesNV = StyleSheet.create({
  container: {
    padding: scaleXiPhone15.eightH,
    borderRadius: scaleXiPhone15.eightH,
    backgroundColor: "#27282d",
  },
  containerIcon: {
    height: scaleXiPhone15.fortyH,
    width: scaleXiPhone15.fortyH,
    borderRadius: scaleXiPhone15.twentyH,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#818898",
  },
  containerTxt: {
    flex: 1,
    gap: scaleXiPhone15.fourH,
    //backgroundColor: "green",
    //alignItems: "center",
  },
  txtTitle: {
    fontSize: appSize.twelve,
    fontFamily: fonts.regular,
    color: ovnioColors.grayDesc,
    //paddingRight: scaleXiPhone15.thrityH,
    // backgroundColor:"red",
  },
  txtValue: {
    //paddingRight: scaleXiPhone15.thrityH,
    color: ovnioColors.white,
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    // backgroundColor:"red",
  },
});
//#endregion

//#region ChannelGuideRow - TVGuide.js | Home.js | ChannelDetail.js | HomeDetails.js
const ChannelGuideRow = (props) => {
  return (
    <View
      style={[stylesCG.container, { opacity: props.item.blocked ? 0.5 : 1 }]}
    >
      <ChannelName
        imgUrl={props.item?.image == "" ? null : props.item.image}
        name={props.item?.name}
      />
      <ChannelSchedule
        arrPrograms={props.item?.programs}
        isClock={props.isClock}
        onClockClicked={props.onClockClicked}
      />
    </View>
  );
};
const stylesCG = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: scaleXiPhone15.eightW,
    height: scaleXiPhone15.hundredH,
    width: "100%",
    //backgroundColor: "yellow",
  },
});

const ChannelName = (props) => {
  return (
    <View style={stylesCN.container}>
      {props.imgUrl ? (
        <Image
          style={stylesCN.imgCh}
          resizeMode={"contain"}
          source={{
            uri: props.imgUrl,
          }}
        />
      ) : (
        <Text
          style={[
            {
              paddingHorizontal: scaleXiPhone15.fourW,
              ...stylesCommon.txtFgetPswd,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            },
          ]}
        >
          {props.name ? props.name.toUpperCase() : "Channel"}
        </Text>
      )}
    </View>
  );
};
const stylesCN = StyleSheet.create({
  container: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ovnioColors.blackContainerBg,
  },
  imgCh: {
    width: widthRowEight * 0.25 * 0.75, //as flex : 0.25
    height: scaleXiPhone15.eightyH,
    //backgroundColor: ovnioColors.grayDesc,
  },
});
const ChannelSchedule = (props) => {
  const ChannelShowComp = (data) => {
    // console.log("ChannelShowComp:-" + JSON.stringify(data.item));
    return (
      <View style={stylesCS.containerSch}>
        <View style={stylesCS.containerTime}>
          <Text style={stylesCommon.txtGuideTime}>{data.item.time_start}</Text>
          {data.item.active == 1 ? (
            <Text style={stylesCommon.txtGuideTime}>
              {data.item.time_left} mins left
            </Text>
          ) : null}
        </View>
        <Text
          style={[stylesCommon.txtCtryName, { color: ovnioColors.white }]}
          numberOfLines={1}
        >
          {data.item.name}
        </Text>
        <View style={stylesCS.containerWatch}>
          <Text
            numberOfLines={2}
            style={[stylesCommon.txtGuideTime, { flex: 1 }]}
          >
            {data.item.season}&nbsp;-&nbsp;{data.item.episode}
          </Text>
          {props.isClock ? (
            <TouchableOpacity onPress={() => props.onClockClicked(data.item)}>
              <MaterialCommunityIcons
                name={"alarm"}
                size={scaleXiPhone15.twentyFourH}
                color={
                  data.item.isreminder
                    ? ovnioColors.primaryRed
                    : ovnioColors.grayIconColor
                }
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {data.item.active == 1 ? (
          <View
            style={[
              stylesCS.containerLine,
              { width: data.item.percent_left + "%" },
            ]}
          ></View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={stylesCS.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {props.arrPrograms?.map((item, key) => {
          return <ChannelShowComp index key={key} item={item} />;
        })}
      </ScrollView>
    </View>
  );
};
const stylesCS = StyleSheet.create({
  container: {
    flex: 0.75,
    //backgroundColor: "blue",
  },
  containerSch: {
    marginRight: scaleXiPhone15.eightW,
    paddingHorizontal: scaleXiPhone15.eightW,
    //padding: scaleXiPhone15.fourH,
    justifyContent: "space-around",
    width: scaleXiPhone15.twoHundredW,
    height: "100%",
    backgroundColor: ovnioColors.blackContainerBg,
    //backgroundColor: "red",
  },
  containerTime: {
    justifyContent: "space-between",
    flexDirection: "row",
    //backgroundColor: "green",
  },
  containerLine: {
    height: scaleXiPhone15.twoH,
    position: "absolute",
    //width: scaleXiPhone15.twoHundredW,
    bottom: 0,
    backgroundColor: "yellow",
  },
  containerWatch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "blue",
  },
});

//#endregion

//#region FriendViewRow - FriendListPopUp.js
const FriendViewRow = ({ item, onItemClick }) => {
  //console.log('FriendViewRow =' + JSON.stringify(item));
  const dotColor = item.isActive
    ? ovnioColors.greenOnline
    : ovnioColors.grayDesc;

  return (
    <TouchableOpacity onPress={onItemClick} style={stylesFV.container}>
      <ImageBackground
        imageStyle={stylesFV.img}
        style={stylesFV.containerIcon}
        resizeMode={"stretch"}
        source={
          item.profile_pic && validateUrl(item.profile_pic)
            ? {
                uri: item.profile_pic,
              }
            : place_small
        }
      >
        <View
          style={[
            stylesFV.circle,
            {
              backgroundColor: dotColor,
            },
          ]}
        />
      </ImageBackground>
      <View style={stylesFV.containerTxt}>
        <View style={stylesFV.containerTime}>
          <Text style={stylesFV.txtValue}>{item.name}</Text>
          <Text style={[stylesFV.txtTitle, { flex: 0.2, textAlign: "right" }]}>
            {item.msg_time != null
              ? getMessageTimePassed(item.msg_time)
              : getMessageTimePassed(item.friends_at)}
            {" ago"}
          </Text>
        </View>
        <Text style={stylesFV.txtTitle}>
          {item.msg ? item.msg : "User is available"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const stylesFV = StyleSheet.create({
  container: {
    marginVertical: scaleXiPhone15.eightH,
    flexDirection: "row",
    gap: scaleXiPhone15.sixteenH,
    alignItems: "center",
    //backgroundColor:"red"
    // marginVertical:scaleXiPhone15.sixH,
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
  containerTxt: {
    flex: 1,
    gap: scaleXiPhone15.twoH,
    //backgroundColor:"red"
    //alignItems: "center",
  },
  containerTime: {
    gap: scaleXiPhone15.twoH,
    flexDirection: "row",
    justifyContent: "space-between", // Space between the texts
    alignItems: "center",
    //alignItems: "center",
  },
  txtTitle: {
    //  marginRight:scaleXiPhone15.thrityH,

    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: "#797C7BCC",

    //backgroundColor:"red",
  },

  txtValue: {
    // marginRight:scaleXiPhone15.thrityH,

    //backgroundColor:"red",
    flex: 0.8,
    color: "#CCCCCC",
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
  },
  circle: {
    position: "absolute",
    bottom: scaleXiPhone15.fourH, // Moves the circle partially outside the bottom of the image
    right: -scaleXiPhone15.threeH,
    width: scaleXiPhone15.fouteenH,
    height: scaleXiPhone15.fouteenH,
    borderRadius: scaleXiPhone15.eightH, // Makes the view circular
  },
});
//#endregion

//#region AddFriendViewRow -
const AddFriendViewRow = ({ item, onAddClick }) => {
  return (
    <View style={stylesAFV.container}>
      <ImageBackground
        imageStyle={stylesAFV.img}
        style={stylesAFV.containerIcon}
        resizeMode={"stretch"}
        source={{
          uri: item.profile_pic != "" ? item.profile_pic : null,
        }}
      />
      <View style={stylesAFV.containerTxt}>
        <View style={stylesAFV.containerTime}>
          <View style={{ flex: 0.85 }}>
            <Text style={stylesAFV.txtValue}>{item.name}</Text>
            <Text style={stylesAFV.txtTitle}>
              {item.isfriend
                ? "Already a friend "
                : item.send
                ? "Friend request already send"
                : "Send Friend Request"}
            </Text>
          </View>
          <TouchableOpacity
            disabled={item.send || item.isfriend}
            style={stylesAFV.txtWithBg}
            onPress={() => onAddClick(item)}
          >
            <Text style={stylesAFV.addTxt}>
              {item.isfriend ? "Friend" : item.send ? "Sent" : "+Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const stylesAFV = StyleSheet.create({
  container: {
    marginVertical: scaleXiPhone15.eightH,
    flexDirection: "row",
    gap: scaleXiPhone15.sixteenH,
    alignItems: "center",
    //backgroundColor:"red"
    // marginVertical:scaleXiPhone15.sixH,
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
  containerTxt: {
    flex: 1,
    gap: scaleXiPhone15.twoH,
    //backgroundColor:"red"
    //alignItems: "center",
  },
  containerTime: {
    gap: scaleXiPhone15.twoH,
    flexDirection: "row",
    justifyContent: "space-between", // Space between the texts
    alignItems: "center",
    //alignItems: "center",
  },
  txtTitle: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: "#A7A7A7",
  },
  txtWithBg: {
    flex: 0.15,
    backgroundColor: "#FBB231",
    padding: scaleXiPhone15.sixH,
    borderRadius: scaleXiPhone15.sixH,
  },
  addTxt: {
    color: "#000000",
    textAlign: "center",
    fontSize: scaleXiPhone15.fouteenH,
    fontFamily: fonts.medium,
  },
  txtValue: {
    color: "#CCCCCC",
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
  },
  circle: {
    position: "absolute",
    bottom: scaleXiPhone15.fourH, // Moves the circle partially outside the bottom of the image
    right: -scaleXiPhone15.threeH,
    width: scaleXiPhone15.fouteenH,
    height: scaleXiPhone15.fouteenH,
    borderRadius: scaleXiPhone15.eightH, // Makes the view circular
  },
});
//#endregion

//#region RequestRow - Notification.js
const RequestRow = (props) => {
  const widthM =
    Dimensions.get("window").width -
    2 * scaleXiPhone15.sixteenH -
    scaleXiPhone15.eightH * 2 -
    scaleXiPhone15.seventyH -
    scaleXiPhone15.eightyH -
    scaleXiPhone15.fourH * 2 -
    scaleXiPhone15.sixH * 8;
  const FriendImageComp = (prop) => {
    //console.log("FriendImageComp--"+JSON.stringify(prop.item));
    return (
      <Image
        style={stylesRR.imgProfile}
        source={{
          uri: prop.item.profile_pic != "" ? prop.item.profile_pic : null,
        }}
      />
    );
  };
  const FriendTextComp = (prop) => {
    return (
      <View
        style={[
          stylesRR.containerTxt,
          {
            width: widthM,
          },
        ]}
      >
        <Text style={stylesRR.txtName}>{prop.item.name}</Text>
        <Text style={stylesRR.txtMsg}>
          {prop.item.status === "1" ? " Approve " : "Awaiting "}

          {"friend request " + getMessageTimePassed(props.item.created_at)}
        </Text>
      </View>
    );
  };
  const FriendBtnComp = (prop) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={prop.ignoreClick}
          style={[
            stylesRR.btnBg,
            {
              borderColor: ovnioColors.grayDesc,
              backgroundColor: ovnioColors.grayDesc,
            },
          ]}
        >
          <Text style={[stylesRR.btnTxt]}>ignore</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={prop.confirmClick}
          style={[
            stylesRR.btnBg,
            {
              borderColor: ovnioColors.primaryRed,
              backgroundColor: ovnioColors.primaryRed,
            },
          ]}
        >
          <Text style={[stylesRR.btnTxt]}>Confirm</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const FriendReqStatus = (prop) => {
    const colTmp =
      prop.item.status === "1" ? ovnioColors.primaryRed : ovnioColors.grayDesc;
    return (
      <View style={[stylesRR.btnBg, { borderColor: colTmp }]}>
        <Text
          style={[
            stylesRR.btnTxt,
            { color: colTmp, marginHorizontal: scaleXiPhone15.eightH },
          ]}
        >
          {prop.item.status === "1" ? "Accepted" : "Pending"}
        </Text>
      </View>
    );
  };

  return (
    <View style={stylesRR.container}>
      <FriendImageComp item={props.item} />
      <FriendTextComp item={props.item} />
      {props.type === 1 ? (
        <FriendBtnComp
          confirmClick={props.confirmClick}
          ignoreClick={props.ignoreClick}
        />
      ) : (
        <FriendReqStatus item={props.item} />
      )}
    </View>
  );
};
const stylesRR = StyleSheet.create({
  container: {
    gap: scaleXiPhone15.fourH,
    padding: scaleXiPhone15.eightH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //backgroundColor: "#27282d",
  },
  imgProfile: {
    width: scaleXiPhone15.seventyH,
    height: scaleXiPhone15.seventyH,
    borderRadius: scaleXiPhone15.seventyH * 0.5,
    backgroundColor: ovnioColors.blackContainerBg,
  },
  containerTxt: {
    gap: scaleXiPhone15.eightH,
    justifyContent: "center",
    //backgroundColor: "green",
  },
  btnBg: {
    margin: scaleXiPhone15.threeH,
    //width: scaleXiPhone15.eightyH,

    padding: scaleXiPhone15.sixH,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: scaleXiPhone15.twoH,
    borderRadius: scaleXiPhone15.fourH,
  },
  btnTxt: {
    fontSize: scaleXiPhone15.fouteenH,
    fontFamily: fonts.medium,
  },
  txtName: {
    color: "#CCCCCC",
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
  },
  txtMsg: {
    fontSize: scaleXiPhone15.fouteenH,
    fontFamily: fonts.medium,
    color: "#A7A7A7",
  },
});
//#endregion

//#region TopRow - TopScreen.js | type = 1 [Remove] | 2 [Add] | 3 [Added] | 4 [No btn]
const TopRow = ({ item, type, onBtnClick }) => {
  const SetBtnComp = () => {
    if (type == 1) {
      return (
        <TouchableOpacity
          style={[
            stylesTR.containerRemove,
            {
              paddingHorizontal: scaleXiPhone15.eightH,
            },
          ]}
          onPress={() => onBtnClick(item)}
        >
          <Text style={stylesTR.txtRemove}>Remove</Text>
        </TouchableOpacity>
      );
    } else if (type == 2) {
      return (
        <TouchableOpacity
          style={[
            stylesTR.containerRemove,
            {
              paddingHorizontal: scaleXiPhone15.sixteenH,
            },
          ]}
          onPress={() => onBtnClick(item)}
        >
          <Text style={stylesTR.txtRemove}>{"Add"}</Text>
        </TouchableOpacity>
      );
    } else if (type == 3) {
      return (
        <TouchableOpacity
          style={[
            stylesTR.containerRemove,
            {
              backgroundColor: "#95989A",
              paddingHorizontal: scaleXiPhone15.eightH,
            },
          ]}
          onPress={() => onBtnClick(item)}
        >
          <Text style={stylesTR.txtRemove}>{"Added"}</Text>
        </TouchableOpacity>
      );
    } else if (type == 4) {
      return (
        <TouchableOpacity
          disabled={true}
          style={[
            stylesTR.containerRemove,
            {
              opacity: 0.4,
              // backgroundColor: "#95989A",
              paddingHorizontal: scaleXiPhone15.twelveH,
            },
          ]}
          onPress={() => onBtnClick(item)}
        >
          <Text style={stylesTR.txtRemove}>{"Top 8"}</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };
  return (
    <View style={stylesTR.container}>
      <Image
        style={stylesTR.img}
        resizeMode={"cover"}
        source={
          item.profile_pic && validateUrl(item.profile_pic)
            ? {
                uri: item.profile_pic,
              }
            : place_small
        }
      />
      <View style={stylesTR.containerTxt}>
        <Text style={stylesTR.txtValue}>{item.name}</Text>
        <Text style={[stylesTR.txtTitle]}>
          {item.username ? item.username : item.email}
        </Text>
      </View>
      <SetBtnComp />
    </View>
  );
};
const stylesTR = StyleSheet.create({
  container: {
    paddingHorizontal: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.eightH,
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "red",
  },
  img: {
    height: scaleXiPhone15.fivtyH,
    width: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.fivtyH * 0.5,
  },
  containerTxt: {
    flex: 1,
    gap: scaleXiPhone15.fourH,
    marginLeft: scaleXiPhone15.sixteenH,
    marginRight: scaleXiPhone15.eightH,
    //backgroundColor: "blue",
  },
  txtValue: {
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    color: "#CCCCCC",
  },
  txtTitle: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: "#A7A7A7",
  },
  containerRemove: {
    paddingVertical: scaleXiPhone15.eightH,
    borderRadius: scaleXiPhone15.sixH,
    backgroundColor: "#FBB231",
  },
  txtRemove: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: "black",
  },
});
//#endregion

export {
  ProfileViewRow,
  ReminderRow,
  NotificationViewRow,
  ChannelGuideRow,
  FriendViewRow,
  AddFriendViewRow,
  RequestRow,
  TopRow,
};
