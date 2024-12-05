//#region import
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  SafeAreaView,
} from "react-native";
import Share from "react-native-share";
import Clipboard from "@react-native-clipboard/clipboard";
const height = Dimensions.get("window").height;
//baseComponent
import CustomLoader from "../baseComponent/CustomLoader";
import FontIcons from "../baseComponent/FontIcons";
//blockComponent
import PopupHeader from "../blockComponent/PopupHeader";
import EmptyListComp from "../blockComponent/EmptyListComp";
import { LoopzSearchBar } from "../blockComponent/OvinoSearchBar";
import { ProfileCompGrid } from "../blockComponent/LoopzGridCell";
//utils
import { fonts, ovnioColors, scaleXiPhone15 } from "../../utils/Variable";
import { showMsgAlert } from "../../utils/Alert";
//api
import { showAPIError } from "../../api/Config";
import { GetUserFollowingAndFollowersList } from "../../api/GetRequest.js";
//#endregion

//#region Main
export default function SharePopup({ navigation, route }) {
  const { safeAreaBtm, post_id, share_url } = route.params;
  const arrShareIcon = [
    { id: 1, iconName: "facebook-circle-fill", name: "Facebook" },
    { id: 2, iconName: "whatsapp-fill", name: "WhatsApp" },
    { id: 3, iconName: "twitter-fill", name: "Twitter" },
    { id: 4, iconName: "linkedin-box-fill", name: "Linkedin" },
    { id: 5, iconName: "file-copy-fill", name: "Copy" },
  ];

  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrUser, setArrUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  //#endregion

  //#region api
  useEffect(() => {
    GetUserFollowerAndFollowingListAPICall(
      1,
      setArrUser,
      setTotalCount,
      setLoader,
      ""
    );
  }, []);
  //#endregion

  //#region JSX
  const renderFlatListRow = ({ item }) => {
    return <ProfileCompGrid item={item} type={1} />;
  };
  const FlatListEmptyComp = () => {
    return (
      <View style={{ height: loader ? height * 0.55 : height * 0.25 }}>
        {loader ? (
          <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
        ) : (
          <EmptyListComp
            ionIcons={"chatbox-outline"}
            title={"No friend found !"}
            desc={""}
          />
        )}
      </View>
    );
  };
  const renderFlatListFooter = () => {
    if (loader) {
      return <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />;
    } else {
    }
  };
  //#endregion

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => navigation.goBack()}
      ></TouchableOpacity>
      <View style={stylesFL.bottomView}>
        <PopupHeader title="Share" />
        <FlatList
          style={stylesFL.flatList}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item, index) => index.toString()}
          data={arrUser}
          ListHeaderComponent={ListHeaderComp}
          ListHeaderComponentStyle={{
            paddingVertical: scaleXiPhone15.eightteenH,
          }}
          ListEmptyComponent={FlatListEmptyComp}
          renderItem={renderFlatListRow}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: scaleXiPhone15.sixteenH,
                // backgroundColor: "yellow",
              }}
            />
          )}
          ListFooterComponent={renderFlatListFooter}
        />
        <View
          style={[
            stylesFL.footerContainer,
            {
              paddingBottom: safeAreaBtm ? safeAreaBtm : scaleXiPhone15.tenH,
            },
          ]}
        >
          {arrShareIcon.map((item, index) => (
            <ShareIconComp key={index} item={item} shareUrl={share_url} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
const stylesFL = StyleSheet.create({
  bottomView: {
    height: "75%",
    paddingVertical: scaleXiPhone15.sixteenH,
    position: "absolute",
    width: "100%",
    bottom: 0,
    borderTopLeftRadius: scaleXiPhone15.thrityFourH,
    borderTopRightRadius: scaleXiPhone15.thrityFourH,
    backgroundColor: ovnioColors.background,
  },
  flatList: {
    paddingHorizontal: scaleXiPhone15.sixteenH,
    //backgroundColor: ovnioColors.primaryRed,
  },
  footerContainer: {
    // height: scaleXiPhone15.fivtySixH,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: scaleXiPhone15.tenH,
    paddingVertical: scaleXiPhone15.tenH,
    backgroundColor: "#2F2F2F",
  },
  icon: {
    marginHorizontal: 10, // Add spacing between icons
  },
  labelText: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.regular,
    color: ovnioColors.white,
    textAlign: "center",
    lineHeight: scaleXiPhone15.eightteenH,
  },
});
//#endregion

//#region ListHeaderComp
const ListHeaderComp = () => {
  const [sch, setSearch] = useState("");
  const onClearClick = () => {
    setSearch("");
  };
  return (
    <LoopzSearchBar
      onClearClick={onClearClick}
      placeholder={"Search.."}
      icon="x-circle"
      sch={sch}
      setSearch={setSearch}
    />
  );
};

//#endregion

//#region ShareIconComp
const ShareIconComp = (prop) => {
  const { shareUrl } = prop;

  const onShareIconClick = (item) => {
    if (item.id === 1) {
      const shareFacebook = {
        title: "Plugr Loopz",
        message: "POST",
        url: shareUrl,
        social: Share.Social.FACEBOOK,
      };
      shareToWhatsApp(shareFacebook, true);
    } else if (item.id === 2) {
      const shareWhatsapp = {
        url: "whatsapp://send?text=" + shareUrl,
      };
      shareToWhatsApp(shareWhatsapp, false);
    } else if (item.id === 3) {
      const shareTwiter = {
        title: "Plugr Loopz",
        message: "POST",
        url: shareUrl,
        social: Share.Social.TWITTER,
      };
      shareToWhatsApp(shareTwiter, true);
    } else if (item.id === 4) {
      const shareLinkedIn = {
        title: "Plugr Loopz",
        message: "POST",
        url: shareUrl,
        social: Share.Social.LINKEDIN,
      };
      shareToWhatsApp(shareLinkedIn, true);
    } else if (item.id === 5) {
      Clipboard.setString(shareUrl);
    }
  };
  return (
    <TouchableOpacity onPress={() => onShareIconClick(prop.item)}>
      <FontIcons
        name={prop.item.iconName}
        size={scaleXiPhone15.fortyH}
        color="#fff"
        style={stylesFL.icon}
      />
      <Text style={stylesFL.labelText}>{prop.item.name}</Text>
    </TouchableOpacity>
  );
};
const shareToWhatsApp = async (shareOptions, isLib) => {
  if (isLib) {
    Share.shareSingle(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  } else {
    Linking.openURL(shareOptions.url)
      .then((data) => {
        console.log(" Opened App");
      })
      .catch(() => {
        showMsgAlert("Make sure App installed on your device");
      });
  }
};
//#endregion

//#region API
async function GetUserFollowerAndFollowingListAPICall(
  nextPage,
  setArrUser,
  setTotalCount,
  setLoader,
  search
) {
  setLoader(true);
  const para = { page: nextPage, limit: 10 };
  if (search && search.length > 0) {
    para.search = search;
  }
  await GetUserFollowingAndFollowersList(para)
    .then((res) => {
      setLoader(false);
      const { followers, totalRecord } = res.data;
      console.log(
        "\u001b[1;32mSP.js : RES | Follower&Following list = ",
        JSON.stringify(followers.length)
      );
      setTotalCount(totalRecord);
      if (nextPage === 1) {
        setArrUser(followers);
      } else {
        setArrUser((prevData) => [...prevData, ...followers]);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | User Follower");
    });
}
//#endregion
