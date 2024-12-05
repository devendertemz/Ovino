//#region import
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Dimensions,
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
} from "react-native";
const { height, width } = Dimensions.get("window");
import FontAwesome from "react-native-vector-icons/FontAwesome";
//utils
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../utils/Variable";
import TextStrings from "../../utils/TextStrings";
import { stylesCommon } from "../../utils/CommonStyle";
import { addZeroToSingleDigitNum } from "../../utils/DateTimeUtil";
//api
import { validateUrl } from "../../api/Config";

//#endregion

//#region asset
const image1 = require("../../assets/images/banner/introOne.png");
const place_width = require("../../assets/images/placeHolder/place_width/place_width.png");
const place_small = require("../../assets/images/placeHolder/place_small/place_small.png");
//#endregion

//#region GridChannel - Channel.js
const ChannelGrid = (props) => {
  return (
    <TouchableOpacity
      style={stylesCG.container}
      disabled={props.item.blocked}
      onPress={() => props.onPress(props)}
    >
      <View
        style={[
          stylesCG.containerCell,
          { opacity: props.item.blocked ? 0.5 : 1 },
        ]}
      >
        <View style={stylesCG.containerTop}>
          <Text style={stylesCG.title}>{TextStrings.channelNo}</Text>
          <Text style={[stylesCG.txtChNo]}>
            {props.item ? props.item?.channel : 100}
          </Text>
        </View>
        <View style={stylesCG.containerBtm}>
          <View style={stylesCG.containerIcon}>
            <Image
              style={stylesCG.imgCH}
              source={
                props.item.image ? { uri: props.item.image } : place_small
              }
            />
          </View>
          <Text style={stylesCG.txtChannel}>
            {props.item ? props.item?.name.toUpperCase() : "TEST"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const stylesCG = StyleSheet.create({
  container: {
    padding: scaleXiPhone15.sixH,
    width: width / 3,
    //backgroundColor: "yellow",
    //backgroundColor: ovnioColors.grayRemoteBg, //grayRemoteBg
  },
  containerCell: {
    //boder
    borderWidth: scaleXiPhone15.oneH,
    borderRadius: scaleXiPhone15.tenH,
    borderColor: ovnioColors.blackContainerBg,
    height: scaleXiPhone15.hundredSixtyH,
    //backgroundColor: "pink",
    //backgroundColor: ovnioColors.grayRemoteBg, //grayRemoteBg
  },
  containerTop: {
    flex: 0.5,
    paddingTop: scaleXiPhone15.eightH,
    gap: scaleXiPhone15.eightH,

    //boder
    borderTopLeftRadius: scaleXiPhone15.tenH,
    borderTopRightRadius: scaleXiPhone15.tenH,

    //backgroundColor: ovnioColors.fbBg,
  },
  containerBtm: {
    flex: 0.5,
    justifyContent: "space-around",
    //boder
    borderBottomLeftRadius: scaleXiPhone15.tenH,
    borderBottomRightRadius: scaleXiPhone15.tenH,

    backgroundColor: ovnioColors.grayDot,
  },
  containerIcon: {
    ...stylesCommon.elvation,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -scaleXiPhone15.fivtySixH * 0.5,
    width: scaleXiPhone15.fivtySixH,
    height: scaleXiPhone15.fivtySixH,
    borderRadius: scaleXiPhone15.fivtySixH * 0.5,
    alignSelf: "center",
    backgroundColor: ovnioColors.white,
  },
  imgCH: {
    width: scaleXiPhone15.fivtySixH,
    height: scaleXiPhone15.fivtySixH,
    borderRadius: scaleXiPhone15.fivtySixH * 0.5,
  },
  txtChannel: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    textAlign: "center",
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twelveH,
    color: "#959597",
    textAlign: "center",
  },
  txtChNo: {
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twentyFourH,
    color: ovnioColors.txtOffWhite,
  },
});
//#endregion

//#region ChannelBlockGrid - BlockAndParental.js | FavChannel.js
const ChannelBlockGrid = (props) => {
  return (
    <View style={stylesCBG.container}>
      <View style={stylesCBG.containerCell}>
        <View style={stylesCBG.containerTop}>
          <Text style={stylesCBG.title}>{TextStrings.channelNo}</Text>
          <Text style={[stylesCBG.txtChNo]}>
            {props.item ? props.item?.channel : 100}
          </Text>
        </View>
        <View style={stylesCBG.containerBtm}>
          <View style={stylesCBG.containerIcon}>
            <Image
              style={stylesCBG.imgCH}
              source={
                props.item?.image ? { uri: props.item?.image } : place_small
              }
            />
          </View>
          <Text style={stylesCBG.txtChannel}>
            {props.item ? props.item?.name.toUpperCase() : "TEST"}
          </Text>
        </View>
      </View>
      {props.type === 1 || props.type === 2 ? (
        <TouchableOpacity
          style={stylesCBG.conatinerBlock}
          onPress={() => props.btnPress(props.item)}
        >
          <Text style={[stylesCBG.txtUnblock]}>
            {props.type === 1 ? TextStrings.unblock : TextStrings.unlock}
          </Text>
        </TouchableOpacity>
      ) : null}
      {props.type === 3 ? (
        <TouchableOpacity
          style={stylesCBG.conatinerHeart}
          onPress={() => props.btnPress(props.item)}
        >
          <FontAwesome
            name="heart"
            size={scaleXiPhone15.eightteenH}
            color={ovnioColors.white}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
const stylesCBG = StyleSheet.create({
  container: {
    padding: scaleXiPhone15.sixH,
    width: width / 3,
    //backgroundColor: "yellow",
    //backgroundColor: ovnioColors.grayRemoteBg, //grayRemoteBg
  },
  containerCell: {
    //boder
    borderWidth: scaleXiPhone15.oneH,
    borderRadius: scaleXiPhone15.tenH,
    borderColor: ovnioColors.blackContainerBg,
    height: scaleXiPhone15.hundredSixtyH,
    //backgroundColor: "pink",
    //backgroundColor: ovnioColors.grayRemoteBg, //grayRemoteBg
  },
  containerTop: {
    flex: 0.5,
    paddingTop: scaleXiPhone15.eightH,
    gap: scaleXiPhone15.eightH,

    //boder
    borderTopLeftRadius: scaleXiPhone15.tenH,
    borderTopRightRadius: scaleXiPhone15.tenH,

    //backgroundColor: ovnioColors.fbBg,
  },
  containerBtm: {
    flex: 0.5,
    gap: scaleXiPhone15.tenH,
    //justifyContent: "space-around",
    //boder
    borderBottomLeftRadius: scaleXiPhone15.tenH,
    borderBottomRightRadius: scaleXiPhone15.tenH,
    backgroundColor: ovnioColors.grayDot,
  },
  conatinerBlock: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -scaleXiPhone15.twelveH,
    paddingVertical: scaleXiPhone15.eightH,
    paddingHorizontal: scaleXiPhone15.twelveW,
    backgroundColor: "#808797",
    borderRadius: scaleXiPhone15.fourH,
  },
  conatinerHeart: {
    alignSelf: "center",
    marginTop: -scaleXiPhone15.twelveH,

    height: scaleXiPhone15.thrityH,
    width: scaleXiPhone15.thrityH,
    borderRadius: scaleXiPhone15.thrityH * 0.5,

    backgroundColor: "#808797",

    justifyContent: "center",
    alignItems: "center",
  },
  containerIcon: {
    ...stylesCommon.elvation,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -scaleXiPhone15.fivtySixH * 0.45,
    width: scaleXiPhone15.fivtySixH,
    height: scaleXiPhone15.fivtySixH,
    borderRadius: scaleXiPhone15.fivtySixH * 0.5,
    alignSelf: "center",
    backgroundColor: ovnioColors.white,
  },
  imgCH: {
    width: scaleXiPhone15.fivtySixH,
    height: scaleXiPhone15.fivtySixH,
    borderRadius: scaleXiPhone15.fivtySixH * 0.5,
    resizeMode: "contain",
  },
  txtChannel: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    textAlign: "center",
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twelveH,
    color: "#959597",
    textAlign: "center",
  },
  txtChNo: {
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twentyFourH,
    color: ovnioColors.txtOffWhite,
  },
  txtUnblock: {
    color: "#f8fbfc",
    fontFamily: fonts.regular,
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.bold,
  },
});
//#endregion

//#region GridSearch - Search.js | TV Show Sch
const GridSearch = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <ImageBackground
        style={stylesGridSearch.container}
        imageStyle={stylesGridSearch.img}
        source={
          item?.content_banner && validateUrl(item?.content_banner)
            ? {
                uri: item?.content_banner,
              }
            : place_small
        }
      ></ImageBackground>
    </TouchableOpacity>
  );
};
const stylesGridSearch = StyleSheet.create({
  container: {
    alignItems: "center",
    width: (width - 4 * scaleXiPhone15.eightW) / 3,
    height: (width - 3 * scaleXiPhone15.eightW) / 2.7,
    marginLeft: scaleXiPhone15.eightW,
  },
  img: {
    borderWidth: scaleXiPhone15.oneH,
    borderRadius: scaleXiPhone15.tenH,
    borderColor: ovnioColors.blackContainerBg,
  },
});
//#endregion

//#region TrendChannelRow | Search.js - Channel Sch
const TrendChannelRow = (prop) => {
  const { item } = prop?.item;
  return (
    <TouchableOpacity
      style={styleTC.container}
      onPress={() => prop.onPress(item)}
    >
      <ImageBackground
        style={styleTC.containerCh}
        imageStyle={styleTC.imgBorder}
        source={
          item?.image && validateUrl(item?.image)
            ? {
                uri: item?.image,
              }
            : place_small
        }
      ></ImageBackground>
      <View style={styleTC.containerChName}>
        <Text style={styleTC.txtCh}>Ch {item?.seq_no}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styleTC = StyleSheet.create({
  container: {
    alignItems: "center",
    //justifyContent: "center",
    width: (width - 4 * scaleXiPhone15.eightW) / 3,
    marginLeft: scaleXiPhone15.eightW,
    //backgroundColor: "green",
  },
  containerCh: {
    width: (width - 4 * scaleXiPhone15.eightW) / 3 - scaleXiPhone15.sixteenW,
    height: (width - 4 * scaleXiPhone15.eightW) / 3 - scaleXiPhone15.sixteenW,
    //backgroundColor: "red",
  },
  imgBorder: {
    borderWidth: scaleXiPhone15.oneH,
    borderRadius:
      ((width - 4 * scaleXiPhone15.eightW) / 3 - scaleXiPhone15.sixteenW) * 0.5,
    borderColor: ovnioColors.blackContainerBg,
  },
  containerChName: {
    marginTop: -scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.sixH,
    paddingHorizontal: scaleXiPhone15.twelveW,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scaleXiPhone15.twelveW,
    backgroundColor: ovnioColors.blackContainerBg,
  },
  txtCh: {
    ...stylesCommon.txtFgetPswd,
    color: ovnioColors.white,
  },
});
//#endregion

//#region TVShowRow - Home.js | TVShow.js | HomeDetail.js
const TVShowRowComp = (prop) => {
  return (
    <TouchableOpacity
      disabled={!prop.isPressEnabled}
      onPress={() => prop.onPress(prop.item)}
    >
      <ImageBackground
        style={styleTR.container}
        imageStyle={styleTR.img}
        source={prop.item.image ? { uri: prop.item.image } : place_small}
      >
        {prop.isShowEye ? (
          <View
            style={{
              bottom: scaleXiPhone15.fourH,
              right: scaleXiPhone15.eightH,
              position: "absolute",
            }}
          >
            <EyeComp />
          </View>
        ) : null}
      </ImageBackground>
    </TouchableOpacity>
  );
};
const styleTR = StyleSheet.create({
  container: {
    alignItems: "center",
    width: (width - 4 * scaleXiPhone15.eightW) / 3,
    height: (width - 3 * scaleXiPhone15.eightW) / 2.7,
    marginLeft: scaleXiPhone15.eightW,
    //backgroundColor: "green",

    // shadowColor: "#000", // Shadow color for iOS
    // shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    // shadowOpacity: 0.25, // Shadow opacity for iOS
    // shadowRadius: 3.84, // Shadow radius for iOS
    // elevation: 5, // Elevation for Android
  },
  img: {
    borderWidth: scaleXiPhone15.oneH,
    borderRadius: scaleXiPhone15.tenH,
    borderColor: ovnioColors.blackContainerBg,
  },
});
//#endregion

//#region EyeComp
const EyeComp = (prop) => {
  return (
    <View style={styleEye.container}>
      <FontAwesome
        name={"eye"}
        size={scaleXiPhone15.fouteenH}
        color={ovnioColors.white}
      />
      <Text style={styleEye.txt}>
        {prop.userCount ? addZeroToSingleDigitNum(prop.userCount) : "00"}
      </Text>
    </View>
  );
};
const styleEye = StyleSheet.create({
  container: {
    gap: scaleXiPhone15.eightH,
    flexDirection: "row",
    //backgroundColor: "pink",
  },
  txt: {
    fontFamily: fonts.bold,
    color: "white",
    fontSize: scaleXiPhone15.fouteenH,
  },
});
//#endregion

export {
  GridSearch,
  TrendChannelRow,
  TVShowRowComp,
  EyeComp,
  ChannelGrid,
  ChannelBlockGrid,
};
