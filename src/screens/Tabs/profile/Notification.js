//#region import
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
import BtnApp from "../../../components/baseComponent/BtnApp.js";
//blockComponent
import EmptyListComp from "../../../components/blockComponent/EmptyListComp.js";
import Header from "../../../components/blockComponent/Header";
import { OvinoChatSearchBar } from "../../../components/blockComponent/OvinoSearchBar.js";
import {
  NotificationViewRow,
  RequestRow,
} from "../../../components/blockComponent/OvnioCustomRow.js";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../../utils/Variable";
import TextStrings from "../../../utils/TextStrings.js";
//api
import { UseDebounce } from "../../../api/Config.js";
import { GetUnreadtNotAPICall } from "../../../api/GlobalAPICall.js";
import { showAPIError } from "../../../api/Config.js";
import {
  DeleteAllNotification,
  GetChatConfirmFriendReq,
  GetChatFriendReqList,
  GetNotificationList,
  GetChatIgnoreFriendReq,
} from "../../../api/GetRequest.js";

//#endregion

//#region Main
export default function Notification({ navigation }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [selGenBtn, setSelGenBtn] = useState(true);
  const [arrData, setArrData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sch, setSearch] = useState("");
  const debouncedSch = UseDebounce(sch.trim(), 900);
  //page

  //#endregion

  //#region api
  useEffect(() => {
    callApiForListData(1, null);
  }, [selGenBtn]);
  useEffect(() => {
    if (debouncedSch.length > 0) {
      callApiForListData(1, debouncedSch);
    } else {
      if (!selGenBtn) {
        callApiForListData(1, null);
      }
    }
  }, [debouncedSch]);

  const fetchMoreDate = () => {
    console.log(
      "Fetch More List Data : totalCount | arrData.length",
      totalCount,
      arrData.length
    );
    if (loader || arrData.length === 0) return;
    if (arrData.length == totalCount) {
      console.log(
        "List End Reached no more call with totalCount = ",
        totalCount
      );
      return;
    }
    const nextPage = currentPage + 1;
    callApiForListData(nextPage, debouncedSch.length > 0 ? debouncedSch : null);
  };
  const callApiForListData = (page, schTmp) => {
    setCurrentPage(page);
    if (selGenBtn) {
      GetNotificationListAPICall(page, setTotalCount, setArrData, setLoader);
    } else {
      GetChatFriendReqListAPICall(
        schTmp,
        page,
        setTotalCount,
        setArrData,
        setLoader
      );
    }
  };
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    GetUnreadtNotAPICall();
    navigation.goBack();
  };
  const onDeleteBtnPress = () => {
    if (!selGenBtn) return;
    const callBackfn = (item) => {
      if (item === 1) {
        DeleteAllNotificationListAPICall(setLoader, setArrData);
      }
    };
    showAlertForDelAll(callBackfn);
  };
  const onTabItemChangeClick = () => {
    setArrData([]);
    setSelGenBtn((item) => !item);
  };
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
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? null : (
          <EmptyListComp
            ionIcons={"notifications"}
            title={
              selGenBtn ? "No notifications now!" : "No friend Request now!"
            }
            desc={""}
          />
        )}
      </>
    );
  };
  const renderFlatListRow = ({ item }) => {
    const onConfirmClick = () => {
      if (loader) return;
      GetChatConfirmFriendReqAPICall(
        item.id,
        totalCount,
        setArrData,
        setTotalCount,
        setLoader
      );
    };
    const onIgnoreClick = () => {
      if (loader) return;
      GetChatIgnoreFriendReqAPICall(
        item.id,
        totalCount,
        setArrData,
        setTotalCount,
        setLoader
      );
    };

    return selGenBtn ? (
      <NotificationViewRow item={item} />
    ) : (
      <RequestRow
        confirmClick={onConfirmClick}
        ignoreClick={onIgnoreClick}
        item={item}
        type={1}
      />
    );
  };

  const renderFlatListFooter = () => {
    return <View style={{ height: scaleXiPhone15.fortyH }} />;
  };
  const renderFlatListItemSep = () => {
    return <View style={{ height: 8 }} />;
  };
  const ViewAllComp = () => {
    // return null;
    if (selGenBtn) {
      return null;
    } else {
      return (
        <View
          style={{
            marginVertical: scaleXiPhone15.eightH,
            marginHorizontal: scaleXiPhone15.fortyH,
            //bottom: scaleXiPhone15.eightH,
          }}
        >
          <BtnApp
            isAPICall={loader}
            title="View all sent requests"
            onPress={() => navigation.navigate("ReqSent")}
          />
        </View>
      );
    }
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header
        title="Notification"
        actionText={selGenBtn ? "Delete All" : ""}
        onBackBtnPress={onBackBtnPress}
        onActionBtnPress={onDeleteBtnPress}
      />
      <ListHeader
        sch={sch}
        selGenBtn={selGenBtn}
        setSearch={setSearch}
        onTabItemChangeClick={onTabItemChangeClick}
      />
      <FlatList
        style={{ padding: scaleXiPhone15.sixteenH }}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        data={arrData}
        ListEmptyComponent={renderFlatListEmpty}
        renderItem={renderFlatListRow}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreDate}
        ItemSeparatorComponent={renderFlatListItemSep}
        ListFooterComponent={renderFlatListFooter}
      />
      <LoaderComp />
      <ViewAllComp />
    </SafeAreaView>
  );
}
//#endregion

//#region ListHeader
const ListHeader = (prop) => {
  return (
    <View
      style={{
        padding: scaleXiPhone15.sixteenH,
        gap: scaleXiPhone15.sixteenH,
        //backgroundColor: "red",
      }}
    >
      <NotiTabs
        selGenBtn={prop.selGenBtn}
        onTabClick={prop.onTabItemChangeClick}
      />
      {prop.selGenBtn ? null : (
        <OvinoChatSearchBar
          placeholder={"Search.."}
          icon="search"
          sch={prop.sch}
          setSearch={prop.setSearch}
        />
      )}
    </View>
  );
};
//#endregion

//#region NotiTabs
const NotiTabs = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={props.onTabClick}
        style={props.selGenBtn ? styles.selbutton : styles.unSelbutton}
      >
        <Text style={styles.buttonText}>General</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.onTabClick}
        style={!props.selGenBtn ? styles.selbutton : styles.unSelbutton}
      >
        <Text style={styles.buttonText}>Friend Requests</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: scaleXiPhone15.fourH,
    flexDirection: "row",
    borderRadius: scaleXiPhone15.eightH,
    backgroundColor: "#7676803D",
    //backgroundColor: "blue",
  },
  unSelbutton: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    height: scaleXiPhone15.fortyH,
  },
  selbutton: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    height: scaleXiPhone15.fortyH,
    backgroundColor: "#636366",
    borderRadius: scaleXiPhone15.eightH,
  },
  buttonText: {
    color: ovnioColors.white,
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.fouteenH,
  },
});
//#endregion

//#region Api
//not
async function GetNotificationListAPICall(
  currentPage,
  setTotalCount,
  setArrData,
  setLoader
) {
  setLoader(true);
  await GetNotificationList({ page: currentPage, limit: 10 })
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mNoti.js : Res GetNotification = ",
        JSON.stringify(res.data.data.length)
      );
      setTotalCount(res.data.total_count);
      if (currentPage === 1) {
        setArrData(res.data.data);
      } else {
        setArrData((prevData) => [...prevData, ...res.data.data]);
      }
    })
    .catch((error) => {
      setLoader(false);
      if (error.response.status === 400) {
        setArrNot([]);
        return;
      }
      showAPIError(error, "Notification Error");
    });
}
async function DeleteAllNotificationListAPICall(setLoader, setArrNot) {
  setLoader(true);
  await DeleteAllNotification()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mNoti.js : Res Delete all = ",
        JSON.stringify(res.data)
      );
      setArrNot([]);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Notification Error");
    });
}
//req
async function GetChatFriendReqListAPICall(
  search,
  currentPage,
  setTotalCount,
  setArrData,
  setLoader
) {
  setLoader(true);
  const para = { page: currentPage, count: 10 };
  if (search && search.length > 0) {
    para.search = search;
  }

  await GetChatFriendReqList(para)
    .then((res) => {
      setLoader(false);
      if (!res.data.data || res.data.data.length < 1) {
        currentPage === 1 ? setArrData([]) : null;
        return;
      }
      console.log(
        "\u001b[1;32mHD.js : Res Chat Friend Req List  = ",
        JSON.stringify(res.data)
      );

      setTotalCount(res.data.recordsTotal);

      if (currentPage === 1) {
        setArrData(res.data.data);
      } else {
        setArrData((prevData) => [...prevData, ...res.data.data]);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Request List Error");
    });
}
async function GetChatConfirmFriendReqAPICall(
  id,
  totalCount,
  setArrData,
  setTotalCount,
  setLoader
) {
  setLoader(true);
  await GetChatConfirmFriendReq(id)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mN.js : Res | Confirm frnd  = ",
        JSON.stringify(res.data)
      );
      setArrData((oldValues) => {
        return oldValues.filter((itemFrd) => itemFrd.id !== id);
      });
      let count = totalCount - 1;
      setTotalCount(count);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "confirm chat Request Error");
    });
}
async function GetChatIgnoreFriendReqAPICall(
  reqId,
  totalCount,
  setArrData,
  setTotalCount,
  setLoader
) {
  setLoader(true);
  await GetChatIgnoreFriendReq(reqId)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mN.js : Res | Ignore frnd  = ",
        JSON.stringify(res.data)
      );
      setArrData((oldValues) => {
        return oldValues.filter((itemFrd) => itemFrd.id !== reqId);
      });
      let count = totalCount - 1;
      setTotalCount(count);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Ignore Request Error");
    });
}

//#endregion

//#region Alert
function showAlertForDelAll(callBackfn) {
  Alert.alert(
    TextStrings.delAllNotifications,
    TextStrings.dellNotificationConfirm,
    [
      {
        text: "Yes",
        onPress: () => callBackfn(1),
      },
      {
        text: "No",
        onPress: () => callBackfn(2),
      },
    ],
    { cancelable: true }
  );
}
//#endregion
