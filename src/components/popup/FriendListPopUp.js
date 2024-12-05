//#region import
import React, { useState, useEffect } from "react";
import {
  Modal,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SectionList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
} from "react-native";
const height = Dimensions.get("window").height;
import Ionicons from "react-native-vector-icons/Ionicons";
//baseComponent
import CustomLoader from "../baseComponent/CustomLoader";
//blockComponent
import EmptyListComp from "../blockComponent/EmptyListComp";
import { OvinoChatSearchBar } from "../blockComponent/OvinoSearchBar";
import {
  AddFriendViewRow,
  FriendViewRow,
} from "../blockComponent/OvnioCustomRow";
//utils
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
  checkForTablet,
} from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//api
import GlobalValue from "../../api/GlobalVar";
import {
  GetChatSendFriendReq,
  GetChatUserList,
  GetChatFriendList,
} from "../../api/GetRequest";
import { showAPIError, UseDebounce } from "../../api/Config";

//#endregion

//#region FriendListPopUp
const FriendListPopUp = (prop) => {
  const [loader, setLoader] = useState(false);
  const [arrFrnd, setArrFrnd] = useState([]);

  //api
  useEffect(() => {
    if (prop.status) {
      GetChatFriendListAPICall(setLoader, setArrFrnd);
    }
  }, []);

  //JSX
  const renderFlatListRow = ({ item }) => {
    return (
      <FriendViewRow item={item} onItemClick={() => prop.onItemClick(item)} />
    );
  };
  const renderFlatListEmpty = () => {
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
      return null;
    }
  };
  return (
    <Modal animationType="fade" transparent={true} visible={prop.status}>
      <View style={stylesFL.centeredView}>
        <View style={[stylesFL.container]}>
          <HeaderPopUp headerTxt={prop.headerTxt} onClose={prop.onClose} />
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            style={{ maxHeight: height * 0.55 }}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={renderFlatListEmpty}
            data={arrFrnd}
            renderItem={renderFlatListRow}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListFooterComponent={renderFlatListFooter}
          />
          <TouchableOpacity
            style={stylesFL.containerAddFrnd}
            onPress={prop.onAddFriendClick}
          >
            <Text style={stylesFL.txtAddFrnd}>+ Add Friend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const stylesFL = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(52, 52, 52, 0.7)",
  },
  container: {
    borderTopLeftRadius: scaleXiPhone15.fortyH,
    borderTopRightRadius: scaleXiPhone15.fortyH,
    padding: scaleXiPhone15.sixteenH,
    backgroundColor: "#2E2E2E",
    //backgroundColor: "yellow",
  },
  containerAddFrnd: {
    marginHorizontal: -scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.eightH,
    backgroundColor: ovnioColors.POPUP_BG_TRANS,
  },
  txtAddFrnd: {
    color: "#CECECE",
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.sixteenH,
    textAlign: "center",
  },
});
//#endregion

//#region SendFriendReqPopUp
const SendFriendReqPopUp = (prop) => {
  //useState
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [arrUserData, setArrUserData] = useState([]);
  const [sch, setSearch] = useState("");
  const debouncedSch = UseDebounce(sch.trim(), 900);

  //api
  useEffect(() => {
    if (debouncedSch.length > 0) {
      setCurrentPage(1);
      GetUserListAPICall(
        setLoader,
        1,
        setTotalCount,
        setArrUserData,
        debouncedSch
      );
    } else {
      if (prop.status) {
        setCurrentPage(1);
        GetUserListAPICall(setLoader, 1, setTotalCount, setArrUserData, null);
      }
    }
  }, [debouncedSch]);

  //action
  const onLoadMorePress = () => {
    console.log(
      "Load More : totalCount | arrUserData.length = ",
      totalCount,
      arrUserData.length
    );
    if (
      totalCount == arrUserData.length + 1 ||
      totalCount == arrUserData.length ||
      loader
    )
      return null;
    setCurrentPage(currentPage + 1);
    GetUserListAPICall(
      setLoader,
      currentPage + 1,
      setTotalCount,
      setArrUserData,
      debouncedSch
    );
  };

  //JSX
  const renderFlatListRow = ({ item }) => {
    const onAddClick = (item) => {
      console.log("onAddClick item = ", JSON.stringify(item, null, 4));
      GetChatSendFriendReqAPICall(setLoader, item.id);
      const arrUpdate = arrUserData.map((itemTmp) => {
        if (itemTmp.id === item.id) {
          return { ...itemTmp, send: true };
        }
        return itemTmp;
      });
      setArrUserData(arrUpdate);
    };
    return <AddFriendViewRow item={item} onAddClick={onAddClick} />;
  };
  const renderFlatListFooter = () => {
    if (loader) {
      return <CustomLoader isSmall={true} color={ovnioColors.primaryRed} />;
    } else if (
      totalCount == arrUserData.length + 1 ||
      totalCount == arrUserData.length ||
      arrUserData.length === 0
    ) {
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
          onPress={onLoadMorePress}
        >
          <Text style={{ ...stylesCommon.txtBtn }}>Load More</Text>
        </TouchableOpacity>
      );
    }
  };
  const renderFlatListEmpty = () => {
    return (
      <View style={{ height: loader ? height * 0.55 : height * 0.25 }}>
        {loader ? (
          <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
        ) : (
          <EmptyListComp
            ionIcons={"chatbox-outline"}
            title={"No Results  found !"}
            desc={""}
          />
        )}
      </View>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={prop.status}>
      <View style={stylesSFR.centeredView}>
        <View style={[stylesSFR.container]}>
          <HeaderPopUp headerTxt={prop.headerTxt} onClose={prop.onClose} />
          <FlatListHeader sch={sch} setSearch={setSearch} />
          <FlatList
            showsVerticalScrollIndicator={false}
            //style={{ maxHeight: height * 0.55 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={arrUserData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFlatListRow}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListFooterComponent={renderFlatListFooter}
            ListEmptyComponent={renderFlatListEmpty}
          />
        </View>
      </View>
    </Modal>
  );
};

const FlatListHeader = (prop) => {
  return (
    <View style={{ marginVertical: scaleXiPhone15.eightteenH }}>
      <OvinoChatSearchBar
        placeholder={"Search.."}
        icon="search"
        sch={prop.sch}
        setSearch={prop.setSearch}
      />
    </View>
  );
};
const stylesSFR = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    //backgroundColor: "#2E2E2E",
  },
  container: {
    height: height * 0.5,
    borderTopLeftRadius: scaleXiPhone15.fortyH,
    borderTopRightRadius: scaleXiPhone15.fortyH,
    padding: scaleXiPhone15.sixteenH,
    backgroundColor: "#2E2E2E",
    // backgroundColor: "yellow",
  },
});
//#endregion

//#region HeaderPopUp
const HeaderPopUp = (prop) => {
  return (
    <View
      style={{
        paddingTop: scaleXiPhone15.sixH,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        //backgroundColor: "green",
      }}
    >
      <Text
        style={{
          color: "#CECECE",
          fontFamily: fonts.bold,
          fontSize: scaleXiPhone15.sixteenH,
        }}
      >
        {prop.headerTxt}
      </Text>
      <TouchableOpacity onPress={() => prop.onClose()}>
        <Ionicons
          name="close"
          size={scaleXiPhone15.thrityH}
          color={"#8E8E8E"}
        />
      </TouchableOpacity>
    </View>
  );
};
//#endregion

//#region API
async function GetChatFriendListAPICall(setLoader, setArrChatFriendList) {
  const para = { page: 1, count: 30 };
  setLoader(true);
  await GetChatFriendList(para)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mFL.js : Res Chat User List  = ",
        JSON.stringify(res.data)
      );
      if (!res.data.data || res.data.data.length < 1) {
        setArrChatFriendList([]);
        return;
      }
      console.log(
        "\u001b[1;32mFL.js : Res Chat User List  = ",
        JSON.stringify(res.data.data.length)
      );
      setArrChatFriendList(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Friend List Error");
    });
}
async function GetUserListAPICall(
  setLoader,
  nextPage,
  setTotalCount,
  setArrChatUserList,
  debouncedSch
) {
  setLoader(true);
  let para = {};
  para.page = nextPage;
  para.count = 10;
  if (debouncedSch != undefined && debouncedSch.length > 0) {
    para.search = debouncedSch;
  }
  await GetChatUserList(para)
    .then((res) => {
      setLoader(false);
      if (!res.data.data || res.data.data.length < 1) {
        setArrChatUserList([]);
        return;
      }
      console.log(
        "\u001b[1;32mULP.js : Res Chat User List  = ",
        JSON.stringify(res.data)
      );
      setTotalCount(res.data.recordsTotal);
      if (nextPage === 1) {
        const filteredArray = res.data.data.filter(
          (item) => item.id != GlobalValue.userId
        );
        setArrChatUserList(filteredArray);
      } else {
        const filteredArray = res.data.data.filter(
          (item) => item.id != GlobalValue.userId
        );
        setArrChatUserList((prevData) => [...prevData, ...filteredArray]);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Chat User List Error");
    });
}
async function GetChatSendFriendReqAPICall(setLoader, userId) {
  setLoader(true);

  await GetChatSendFriendReq(userId)
    .then((res) => {
      setLoader(false);

      console.log(
        "\u001b[1;32mHD.js :Res Chat Send Friend Request  = ",
        JSON.stringify(res.data)
      );
    })
    .catch((error) => {
      setLoader(false);

      showAPIError(error, "Chat Send Request Error");
    });
}
//#endregion

export { FriendListPopUp, SendFriendReqPopUp };
