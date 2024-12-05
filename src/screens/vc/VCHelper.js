//#region import
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  Modal,
} from "react-native";
const height = Dimensions.get("window").height;
import { useSafeAreaInsets } from "react-native-safe-area-context";
//blockComponent
//utils
import TextStrings from "../../utils/TextStrings";
import Validation from "../../utils/Validation";
import { showMsgAlert, showCustomAlertWithMsg } from "../../utils/Alert";
import {
  ovnioColors,
  fonts,
  scaleXiPhone15,
  checkForTablet,
  APP_SCREEN,
} from "../../utils/Variable";

//api
import GlobalValue from "../../api/GlobalVar";
import { showAPIError } from "../../api/Config";
import { stylesCommon } from "../../utils/CommonStyle";
import FontIcons from "../../components/baseComponent/FontIcons";
//asset
const mic = require("../../assets/images/vc/mic/mic.png");
const adduser = require("../../assets/images/vc/adduser/adduser.png");
const comment = require("../../assets/images/vc/comment/comment.png");
const share = require("../../assets/images/vc/share/share.png");
const bag = require("../../assets/images/vc/bag/bag.png");
const record = require("../../assets/images/vc/record/record.png");
const logout = require("../../assets/images/vc/logout/logout.png");
const unmute = require("../../assets/images/vc/unmute/unmute.png");
const check = require("../../assets/icon/check/check.png");
const uncheck = require("../../assets/icon/uncheck/uncheck.png");
//#endregion

//#region UserHeaderList
const UserHeaderList = (prop) => {
  //#region JSX
  const renderFlatListSep = (props) => {
    return (
      <View
        style={{
          width: scaleXiPhone15.sixteenH,
        }}
      ></View>
    );
  };
  //#endregion

  const renderTopFlatListRow = (props) => {
    return (
      <View style={stylesUL.containerRow}>
        <Image
          resizeMode="contain"
          tintColor={ovnioColors.grayIconColor}
          style={stylesUL.imgUser}
        />
        <Text
          style={{
            color: "white",
            fontFamily: fonts.bold,
            fontSize: scaleXiPhone15.tenH,
          }}
        >
          First & Last Name
        </Text>
      </View>
    );
  };

  return (
    <View style={stylesUL.containerView}>
      <FlatList
        keyExtractor={(item, index) => index}
        data={[1, 2, 3]}
        horizontal
        renderItem={renderTopFlatListRow}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={renderFlatListSep}
      />
    </View>
  );
};
const stylesUL = StyleSheet.create({
  containerView: {
    flex: 0.2,
  },
  containerRow: {
    width: height * 0.2,
    gap: scaleXiPhone15.sixteenH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#28292E",
  },
  imgUser: {
    borderRadius: height * 0.1 * 0.5,
    height: height * 0.1,
    width: height * 0.1,
    backgroundColor: "gray",
  },
});
//#endregion

//#region VideoCtlComp
const VideoCtlComp = ({ isMuteStatus, onPress }) => {
  return (
    <View style={stylesC.containerView}>
      <VideoCtrlIcon
        color={
          isMuteStatus === 1 ? ovnioColors.primaryRed : ovnioColors.grayDesc
        }
        icon={isMuteStatus === 1 ? unmute : mic}
        onPress={() => onPress(1)}
      />
      <VideoCtrlIcon
        color={ovnioColors.grayDesc}
        icon={adduser}
        onPress={() => onPress(2)}
      />
      <VideoCtrlIcon
        color={ovnioColors.grayDesc}
        icon={comment}
        onPress={() => onPress(3)}
      />
      <VideoCtrlIcon
        color={ovnioColors.grayDesc}
        icon={share}
        onPress={() => onPress(4)}
      />
      <VideoCtrlIcon
        color={ovnioColors.grayDesc}
        icon={bag}
        onPress={() => onPress(5)}
      />
      <VideoCtrlIcon
        color={ovnioColors.grayDesc}
        icon={record}
        onPress={() => onPress(6)}
      />
      <VideoCtrlIcon
        color={ovnioColors.grayDesc}
        icon={logout}
        onPress={() => onPress(7)}
      />
    </View>
  );
};
const VideoCtrlIcon = ({ icon, color, onPress }) => {
  return (
    <TouchableOpacity style={stylesC.containerIcon} onPress={onPress}>
      <Image
        resizeMode="contain"
        tintColor={color}
        source={icon}
        style={stylesC.img}
      />
    </TouchableOpacity>
  );
};
const stylesC = StyleSheet.create({
  containerView: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.1,
    justifyContent: "space-around",
    paddingHorizontal: scaleXiPhone15.fourH,
    backgroundColor: "#28292E",
  },
  containerIcon: {
    width: height * 0.1 * 0.5,
    height: height * 0.1 * 0.5,
    borderRadius: scaleXiPhone15.fourH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ovnioColors.background,
  },
  img: {
    width: height * 0.1 * 0.3,
    height: height * 0.1 * 0.3,
  },
});

//#endregion

//#region SingleSelection
const SingleSelection = ({ status, arrData, onClose, onItemClick }) => {
  const insets = useSafeAreaInsets();

  //#region JSX
  const renderFlatListRow = ({ item, index }) => {
    return (
      <View
        style={{
          paddingVertical: scaleXiPhone15.eightH,
          paddingHorizontal: scaleXiPhone15.sixteenH,
        }}
      >
        <Text onPress={() => onItemClick(index)} style={stylesSS.txtRow}>
          {item}
        </Text>
      </View>
    );
  };
  const renderFlatListSep = () => {
    return (
      <View
        style={{
          height: scaleXiPhone15.fourH,
        }}
      ></View>
    );
  };
  //#endregion

  return (
    <Modal animationType="fade" transparent={true} visible={status}>
      <View style={[stylesSS.centeredView]}>
        <View style={[stylesSS.containerBtm, { bottom: insets.bottom }]}>
          <HeaderSingleSel onClose={onClose} />
          <FlatList
            style={stylesSS.containerList}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            data={arrData}
            renderItem={renderFlatListRow}
            ItemSeparatorComponent={renderFlatListSep}
          />
        </View>
      </View>
    </Modal>
  );
};
const HeaderSingleSel = ({ onClose }) => {
  return (
    <TouchableOpacity style={stylesSS.containerHeader} onPress={onClose}>
      <FontIcons
        name={"close-circle-line"}
        size={scaleXiPhone15.twentyFourH}
        color={"gray"}
      />
    </TouchableOpacity>
  );
};
const stylesSS = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  containerBtm: {
    //backgroundColor: "green",
  },
  containerHeader: {
    paddingTop: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.sixteenH,
    borderTopRightRadius: scaleXiPhone15.sixteenH * 2,
    borderTopLeftRadius: scaleXiPhone15.sixteenH * 2,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#2E2E2E",
    //backgroundColor: "red",
  },
  containerList: {
    paddingBottom: scaleXiPhone15.eightH,
    backgroundColor: "#2E2E2E",
  },
  txtRow: {
    fontSize: scaleXiPhone15.fouteenH,
    fontFamily: fonts.bold,
    color: "white",
  },
});
//#endregion

//#region MultiSelection
const MultiSelection = ({ status, arrData, onClose, onDone }) => {
  const insets = useSafeAreaInsets();
  const [arrSel, setArrSel] = useState([]);

  const onCheckIconClick = (item) => {
    const index = arrSel.indexOf(item);
    if (index === -1) {
      setArrSel([...arrSel, item]);
    } else {
      setArrSel(arrSel.filter((itemTmp) => itemTmp !== item));
    }
    console.log("arrSel = ", arrSel);
  };

  //#region JSX
  const renderFlatListRow = ({ item, index }) => {
    const isSel = arrSel.some((itemTmp) => itemTmp === item);
    console.log("isSel = ", isSel);
    return (
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          paddingVertical: scaleXiPhone15.eightH,
          paddingHorizontal: scaleXiPhone15.sixteenH,
        }}
      >
        <Text onPress={() => onItemClick(index)} style={stylesMS.txtRow}>
          {item}
        </Text>
        <TouchableOpacity onPress={() => onCheckIconClick(item)}>
          <Image
            resizeMode="contain"
            //tintColor={ovnioColors.primaryRed}
            source={isSel ? check : uncheck}
            style={stylesC.img}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const renderFlatListSep = () => {
    return (
      <View
        style={{
          height: scaleXiPhone15.fourH,
        }}
      ></View>
    );
  };
  //#endregion

  return (
    <Modal animationType="fade" transparent={true} visible={status}>
      <View style={[stylesMS.centeredView]}>
        <View style={[stylesMS.containerBtm, { bottom: insets.bottom }]}>
          <HeaderMultiSel onClose={onClose} onDone={onDone} />
          <FlatList
            style={stylesSS.containerList}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            data={arrData}
            renderItem={renderFlatListRow}
            ItemSeparatorComponent={renderFlatListSep}
          />
        </View>
      </View>
    </Modal>
  );
};
const HeaderMultiSel = ({ onDone, onClose }) => {
  return (
    <TouchableOpacity style={stylesMS.containerHeader} onPress={onClose}>
      <Text onPress={onDone} style={stylesMS.txtBtn}>
        Done
      </Text>
      <Text onPress={onClose} style={stylesMS.txtBtn}>
        Cancel
      </Text>
    </TouchableOpacity>
  );
};
const stylesMS = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  containerBtm: {
    // backgroundColor: "green",
  },
  containerHeader: {
    paddingTop: scaleXiPhone15.twentyH,
    paddingBottom: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.sixteenH,
    borderTopRightRadius: scaleXiPhone15.sixteenH * 2,
    borderTopLeftRadius: scaleXiPhone15.sixteenH * 2,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    // backgroundColor: "red",
  },
  txtBtn: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.fouteenH,
    color: ovnioColors.primaryRed,
  },
  txtRow: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.sixteenH,
    color: ovnioColors.white,
  },
});
//#endregion

export { UserHeaderList, VideoCtlComp, SingleSelection, MultiSelection };
