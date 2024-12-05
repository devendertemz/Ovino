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
} from "react-native";
//blockComponent
const height = Dimensions.get("window").height;
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
//local
import {
  UserHeaderList,
  VideoCtlComp,
  SingleSelection,
  MultiSelection,
} from "./VCHelper";
//api
import GlobalValue from "../../api/GlobalVar";
import { showAPIError } from "../../api/Config";
import { stylesCommon } from "../../utils/CommonStyle";
//asset
const mic = require("../../assets/images/vc/mic/mic.png");
//#endregion

//#region Main
export default function VCScreen({ navigation }) {
  //#region useState
  const [isMuteOptShow, setMuteOptShow] = useState(false);
  const [isMuteStatus, setMuteStatus] = useState(0); //0 - no one mute ,1 - user mute ,2 - mute all
  const [isShareOptShow, setShareOptShow] = useState(false);
  const [isShareStatus, setShareStatus] = useState(0); //0 - no one mute ,1 - single  ,2 - multi
  const [isShareMultiShow, setShareMultiShow] = useState(false);
  //#endregion

  //#region action
  const onPressCtrl = (index) => {
    console.log("onPressCtrl = index", index);
    if (index === 1) {
      setMuteOptShow(true);
    } else if (index === 4) {
      setShareMultiShow(true);
      //setShareOptShow(true);
    }
  };
  const onMuteShowClick = (index) => {
    console.log("onMuteShowClick = index", index);
    setMuteStatus(index + 1);
    setMuteOptShow(false);
  };
  const onShareShowClick = (index) => {
    console.log("onShareShowClick = index", index);
    setShareOptShow(false);
    setShareStatus(index + 1);
  };
  const onShareMultiDoneClick = (index) => {
    setShareMultiShow(false);
  };
  //#endregion

  //#region JSX
  const ShowSingleMuteSel = () => {
    return (
      <SingleSelection
        status={isMuteOptShow}
        arrData={["Mute", "Mute All"]}
        onClose={() => setMuteOptShow(false)}
        onItemClick={onMuteShowClick}
      />
    );
  };
  const ShowSingleShareSel = () => {
    return (
      <SingleSelection
        status={isShareOptShow}
        arrData={[
          "One Participant can share screen",
          "multiple Participant can share screen",
        ]}
        onClose={() => setShareOptShow(false)}
        onItemClick={onShareShowClick}
      />
    );
  };
  const ShowMutiShareSel = () => {
    const arrUser = ["John", "Mary", "Tommy", "Rick", "Kite", "Cat"];
    return (
      <MultiSelection
        status={isShareMultiShow}
        arrData={arrUser}
        onClose={() => setShareMultiShow(false)}
        onDone={onShareMultiDoneClick}
      />
    );
  };
  //#endregion

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    >
      <ShowSingleMuteSel />
      <ShowSingleShareSel />
      <ShowMutiShareSel />
      <View style={styles.containerView}>
        <UserHeaderList />
        <View style={styles.containerMiddle}>
          <Image resizeMode="contain" style={styles.containerMiddleImg} />
        </View>
        <VideoCtlComp isMuteStatus={isMuteStatus} onPress={onPressCtrl} />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    gap: scaleXiPhone15.sixteenH,
    padding: scaleXiPhone15.sixteenH,
  },
  containerMiddle: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#28292E",
  },
  containerMiddleImg: {
    width: height * 0.15,
    height: height * 0.15,
    borderRadius: height * 0.15 * 0.5,
    backgroundColor: "gray",
  },
});
//#endregion
