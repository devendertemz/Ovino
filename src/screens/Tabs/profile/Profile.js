//#region import
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  Image,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
const { height } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
//package
import Clipboard from "@react-native-clipboard/clipboard";
import ImagePicker from "react-native-image-crop-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//utils
import { showCustomAlertWithMsg } from "../../../utils/Alert";
import {
  ovnioColors,
  fonts,
  scaleXiPhone15,
  APP_SCREEN,
} from "../../../utils/Variable";
import { stylesCommon } from "../../../utils/CommonStyle";
import TextStrings from "../../../utils/TextStrings";
import {
  removeUserEmail,
  removeUserID,
  removeUserSetPin,
} from "../../../utils/LocalDataStorage";
//api
import GlobalValue from "../../../api/GlobalVar";
import { GetLogOut, GetAffiliateLink } from "../../../api/GetRequest";
import { PostUploadFile } from "../../../api/PostRequest";
import { showAPIError } from "../../../api/Config";
//asset
const place_small = require("../../../assets/images/placeHolder/place_small/place_small.png");
const referral = require("../../../assets/icon/profile/referral/referral.png");
const top8 = require("../../../assets/icon/profile/top8/top8.png");
//#endregion

//#region Main
export default function Profile({ navigation }) {
  const [loader, setLoader] = useState(false);
  const [referralLink, setReferralLink] = useState(false);
  const arrData = [
    { id: 1, title: TextStrings.profile, icon: "user" },
    { id: 12, title: "Prefrences", icon: "form-select" },
    { id: 2, title: TextStrings.blockedChannels, icon: "television-stop" },
    { id: 3, title: TextStrings.parentalChannels, icon: "stop-circle-outline" },
    { id: 4, title: TextStrings.reminders, icon: "clock-time-nine-outline" },
    { id: 5, title: TextStrings.favorite, icon: "cards-heart-outline" },
    { id: 6, title: TextStrings.notification, icon: "bell-outline" },
    { id: 9, title: TextStrings.UsefulLinks, icon: "progress-question" },
    { id: 7, title: TextStrings.Dashboard, icon: "qrcode-plus" },
    { id: 11, title: "Referral Insights", icon: referral },
    { id: 10, title: "Top 8", icon: top8 },
    { id: 8, title: TextStrings.Logout, icon: "power" },
  ];

  //#region api
  useEffect(() => {
    GetAffiliateLinkAPICall(setReferralLink, setLoader);
  }, []);
  //#endregion

  //#region flatlist
  const onFlatListRowClick = (item) => {
    if (item.id === 1) {
      navigation.navigate("ProfileView");
    } else if (item.id === 2) {
      navigation.navigate("BlockAndParental", {
        isBlockedChannel: true,
      });
    } else if (item.id === 3) {
      navigation.navigate("BlockAndParental", {
        isBlockedChannel: false,
      });
    } else if (item.id === 4) {
      navigation.navigate("Reminder");
    } else if (item.id === 5) {
      navigation.navigate("FavChannel");
    } else if (item.id === 6) {
      navigation.navigate("Notification");
      //navigation.navigate("ReqSent");
    } else if (item.id === 7) {
      navigation.navigate("Setting");
    } else if (item.id === 8) {
      showAlertForLogout(navigation, setLoader);
    } else if (item.id === 9) {
      navigation.navigate("UseFulLink");
    } else if (item.id === 10) {
      navigation.navigate("WatchAppStack", {
        screen: "TopScreen",
      });
    } else if (item.id === 11) {
      navigation.navigate("WatchAppStack", {
        screen: "ReferralInsights",
      });
    } else if (item.id === 12) {
      navigation.navigate("WatchAppStack", {
        screen: "PrefView",
      });
    }
  };
  const renderFlatListRow = ({ item }) => {
    return <ProfileRow item={item} onFlatListRowClick={onFlatListRowClick} />;
  };
  const renderFlatListHeader = () => {
    return (
      <FlatListHeader
        loader={loader}
        referralLink={referralLink}
        navigation={navigation}
      />
    );
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <FlatList
        style={{ padding: scaleXiPhone15.sixteenW }}
        data={arrData}
        renderItem={renderFlatListRow}
        ListHeaderComponent={renderFlatListHeader}
        ListFooterComponent={() => (
          <View style={{ height: scaleXiPhone15.fortyH }} />
        )}
      />
    </SafeAreaView>
  );
}

//#endregion

//#region ProfileRow
const ProfileRow = (prop) => {
  const IconComp = ({ id }) => {
    if (id === 1 || id === 8) {
      return (
        <Feather
          name={prop.item.icon}
          size={scaleXiPhone15.twentyEightH}
          color={ovnioColors.white}
        />
      );
    } else if (id === 10 || id === 11) {
      return (
        <Image
          style={{
            width: scaleXiPhone15.twentyH,
            height: scaleXiPhone15.twentyH,
          }}
          source={prop.item.icon}
        ></Image>
      );
    } else {
      return (
        <MaterialCommunityIcons
          name={prop.item.icon}
          size={scaleXiPhone15.twentyEightH}
          color={ovnioColors.white}
        />
      );
    }
  };

  return (
    <TouchableOpacity
      style={stylesPR.container}
      onPress={() => prop.onFlatListRowClick(prop.item)}
    >
      <View
        style={{
          gap: scaleXiPhone15.twelveH,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconComp id={prop.item.id} />
        <Text style={stylesPR.txtTitle}>{prop.item.title}</Text>
      </View>
      <Feather
        name={"chevron-right"} //trophy-outline
        size={scaleXiPhone15.twentyEightH}
        color={ovnioColors.white}
      />
    </TouchableOpacity>
  );
};
const stylesPR = StyleSheet.create({
  container: {
    // borderWidth: scaleXiPhone15.oneH,
    borderLeftWidth: scaleXiPhone15.oneH,
    borderRightWidth: scaleXiPhone15.oneH,
    borderTopWidth: scaleXiPhone15.twoH,
    borderColor: ovnioColors.grayIconColor,
    marginTop: scaleXiPhone15.tenH,
    paddingHorizontal: scaleXiPhone15.twelveH,
    paddingVertical: scaleXiPhone15.fouteenH,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scaleXiPhone15.fourH,
    backgroundColor: "#3c3c40",
    justifyContent: "space-between",
  },
  txtTitle: {
    fontFamily: fonts.regular,
    fontSize: scaleXiPhone15.eightteenH,
    color: ovnioColors.white,
  },
});
//#endregion

//#region FlatListHeader
const FlatListHeader = (props) => {
  console.log(
    "\u001b[1;33mP.js | GlobalValue.profile_pic = ",
    GlobalValue.profile_pic
  );
  const [proImg, setProImg] = useState(GlobalValue.profile_pic);
  const choosePhotoFromGallery = () => {
    const callBackfn = (item) => {
      console.log("callBackfn itme = ", item);
      if (item === 1) {
        ImagePicker.openPicker({
          mediaType: "photo",
          multiple: false,
          width: 200,
          height: 200,
          cropping: true,
        })
          .then(async (image) => {
            setProImg(image.path);
            UploadFileAPICall(image.path);
          })
          .catch((error) => {
            console.log(
              "\u001b[1;31mP.js : Error | Device gallery = ",
              JSON.stringify(error.message)
            );
          });
      } else {
        ImagePicker.openCamera({
          width: 200,
          height: 200,
          cropping: true,
        })
          .then((image) => {
            setProImg(image.path);
            UploadFileAPICall(image.path);
          })
          .catch((error) => {
            console.log(
              "\u001b[1;31mP.js : Error | Device camera = ",
              JSON.stringify(error.message)
            );
          });
      }
    };
    showAlertForProfile(callBackfn);
    return;
  };
  const onCopyLinkClick = () => {
    Clipboard.setString(props.referralLink);
  };

  return (
    <View style={stylesH.container}>
      <View style={stylesH.containerProfileImg}>
        <Image
          style={stylesH.containerImg}
          source={proImg ? { uri: proImg } : place_small}
        ></Image>
      </View>
      <TouchableOpacity
        style={stylesH.containerCameraIcon}
        onPress={choosePhotoFromGallery}
      >
        <Feather
          name={"camera"}
          size={height * 0.03}
          color={ovnioColors.primaryRed}
        />
      </TouchableOpacity>
      {props.loader ? (
        <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
      ) : null}
      <Text style={stylesH.txtFullName}>Full Name</Text>
      <Text style={[stylesH.txtFullName, { marginTop: scaleXiPhone15.sixH }]}>
        {GlobalValue.firstName}&nbsp;{GlobalValue.lastName}
      </Text>
      <Text
        style={[stylesH.txtFullName, { marginTop: scaleXiPhone15.twelveH }]}
        onPress={onCopyLinkClick}
      >
        {"Affiliate link  ❒"}
      </Text>
      <Text
        onPress={onCopyLinkClick}
        style={[
          stylesH.txtCrtSub,
          { marginTop: scaleXiPhone15.sixH, textAlign: "center" },
        ]}
      >
        {props.referralLink}
      </Text>
      <Text
        style={[
          stylesH.txtCrtSub,
          { alignSelf: "flex-start", marginTop: scaleXiPhone15.twentyFourH },
        ]}
      >
        CURRENT SUBSCRIPTION
      </Text>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Subscription")}
        style={stylesH.containerSub}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[stylesH.txtSub, { marginRight: scaleXiPhone15.fourH }]}>
            Standard
          </Text>
          <MaterialCommunityIcons
            name={"information-outline"}
            size={scaleXiPhone15.twentyFourH}
            color={"yellow"}
          />
        </View>
        <Text>
          <Text style={stylesH.txtSub}>$150/</Text>
          <Text style={stylesH.txtEmail}>month</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const stylesH = StyleSheet.create({
  container: {
    paddingVertical: scaleXiPhone15.sixteenH,
    alignItems: "center",
    //backgroundColor: "yellow",
  },
  containerProfileImg: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.2,
    width: height * 0.2,
    borderRadius: (height * 0.2) / 2,
    borderWidth: 4,
    borderColor: ovnioColors.primaryRed,
    //backgroundColor: 'gray',
  },
  containerImg: {
    height: height * 0.19,
    width: height * 0.19,
    borderRadius: (height * 0.2) / 2,
  },
  containerCameraIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: height * 0.06,
    height: height * 0.06,
    borderRadius: height * 0.06 * 0.5,
    marginLeft: height * 0.1,
    marginTop: -(height * 0.06),
    marginBottom: scaleXiPhone15.sixteenH,
    backgroundColor: "white",
  },
  txtFullName: {
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
    textAlign: "center",
  },
  txtEmail: {
    ...stylesCommon.subTitleWelcome,
  },
  txtCrtSub: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.regular,
    color: ovnioColors.white,
  },
  containerSub: {
    flexDirection: "row",
    marginTop: scaleXiPhone15.eightH,
    paddingHorizontal: scaleXiPhone15.eightH,
    paddingVertical: scaleXiPhone15.twentyH,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: scaleXiPhone15.eightH,
    width: "100%",
    backgroundColor: ovnioColors.primaryRed,
  },
  txtSub: {
    fontSize: scaleXiPhone15.twentyFourH,
    fontFamily: fonts.bold,
    color: "white",
  },
});
//#endregion

//#region API
async function GetAffiliateLinkAPICall(setReferralLink, setLoader) {
  setLoader(true);
  await GetAffiliateLink()
    .then((res) => {
      setLoader(false);
      const { referralLink } = res.data;
      console.log("\u001b[1;32mP.js : Res referralLink = ", referralLink);
      setReferralLink(referralLink);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Referral Link");
    });
}
function showAlertForLogout(navigation, setLoader) {
  Alert.alert(
    TextStrings.Logout,
    TextStrings.sureLogout,
    [
      {
        text: "NO",
        style: "cancel",
      },
      {
        text: "YES",
        onPress: () => {
          GetLogOutAPICall(navigation, setLoader);
        },
        style: "destructive",
      },
    ],
    { cancelable: true }
  );
}
async function UploadFileAPICall(filePath) {
  //setLoader(true);

  let filename = filePath.split("/").pop();
  const typeTmp = "image";
  const mediaTy = 1;
  const fileType = 1;

  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `${typeTmp}/${match[1]}` : typeTmp;
  /* console.log("filePath : " + filePath);
  console.log("filename : " + filename);
  console.log("filetype : " + type); */

  let formData = new FormData();
  formData.append("file", { uri: filePath, name: filename, type });
  console.log("formData : ", JSON.stringify(formData));

  await PostUploadFile(formData)
    .then((res) => {
      console.log(
        "\u001b[1;32mP.js | Res Upload File = ",
        JSON.stringify(res.data)
      );
      GlobalValue.profile_pic = res.data.file_name;
    })
    .catch((error) => {
      showAPIError(error, "Error | Profile Image");
    });
}
async function GetLogOutAPICall(navigation, setLoader) {
  setLoader(true);
  await GetLogOut()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mCH.js : Res GetLogOut = ",
        JSON.stringify(res.data)
      );
      Logout(navigation);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Log out Error");
    });
}
async function Logout(navigation) {
  await removeUserID();
  await removeUserEmail();
  await removeUserSetPin();
  GlobalValue.userId = 0;
  GlobalValue.emailId = "";
  GlobalValue.pinSet = false;
  // const { routes, index } = navigation.getState();
  // console.log("routes = ", JSON.stringify(routes));
  // console.log("index = ", JSON.stringify(index));
  // navigation.pop(index - 2);
  //navigation.jumpTo("HomeStack");

  setTimeout(() => {
    navigation.navigate("AuthStack", {
      screen: "Welcome",
      params: { navType: 2 },
    });
  }, 50);
}
//#endregion

//#region ALERT
function showAlertForProfile(callBackfn) {
  Alert.alert(
    TextStrings.selProfilePic,
    "",
    [
      {
        text: "Gallery",
        onPress: () => callBackfn(1),
      },
      {
        text: "Camera",
        onPress: () => callBackfn(2),
      },
    ],
    { cancelable: true }
  );
}
//#endregion
