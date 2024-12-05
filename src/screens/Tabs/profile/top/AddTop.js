//#region import
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
//baseComponent
import BtnApp from "../../../../components/baseComponent/BtnApp";
import CustomLoader from "../../../../components/baseComponent/CustomLoader";
//blockComponent
import Header from "../../../../components/blockComponent/Header";
import EmptyListComp from "../../../../components/blockComponent/EmptyListComp";
import { TopRow } from "../../../../components/blockComponent/OvnioCustomRow";
import { OvinoChatSearchBar } from "../../../../components/blockComponent/OvinoSearchBar";
import { LoopzSearchBar } from "../../../../components/blockComponent/OvinoSearchBar";
//utils
import TextStrings from "../../../../utils/TextStrings";
import Validation from "../../../../utils/Validation";
import { stylesCommon } from "../../../../utils/CommonStyle";
import { showMsgAlert, showCustomAlertWithMsg } from "../../../../utils/Alert";
import {
  ovnioColors,
  fonts,
  appSize,
  scaleXiPhone15,
} from "../../../../utils/Variable";
//api
import { UseDebounce } from "../../../../api/Config";
import { GetChatUserList } from "../../../../api/GetRequest";
import { PostTop8MarkUnmark } from "../../../../api/PostRequest";
import { showAPIError } from "../../../../api/Config";
import GlobalValue from "../../../../api/GlobalVar";
//#endregion

//#region Main
export default function AddTop({ navigation, route }) {
  const { users } = route.params;
  const arrUserPass = users.length === 0 ? [] : users.split(",");

  //#region useState
  const [loader, setLoader] = useState(false);
  const [apicall, setApiCall] = useState(false);
  const [sch, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [arrUserData, setArrUserData] = useState([]);
  const [arrSelUser, setArrSelUser] = useState([]);
  const debouncedSch = UseDebounce(sch.trim(), 900);
  //#endregion

  //#region api
  useEffect(() => {
    userListAPICall(1, null);
  }, []);
  useEffect(() => {
    if (debouncedSch.length > 0) {
      setCurrentPage(1);
      userListAPICall(1, debouncedSch);
    } else {
      console.log(
        "ELSE debouncedSch |  currentPage= ",
        debouncedSch,
        currentPage
      );
    }
  }, [debouncedSch]);
  const fetchMoreDate = () => {
    console.log(
      "Fetch More List Data : totalCount | arrUserData.length",
      totalCount,
      arrUserData.length
    );
    if (loader || arrUserData.length === 0) return;
    if (arrUserData.length == totalCount) {
      console.log(
        "List End Reached no more call with totalCount = ",
        totalCount
      );
      return;
    }
    setCurrentPage(currentPage + 1);
    userListAPICall(currentPage + 1, debouncedSch);
  };
  function userListAPICall(page, serachTerm) {
    GetUserListAPICall(
      setLoader,
      page,
      setTotalCount,
      setArrUserData,
      serachTerm
    );
  }

  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onAddRowClick = (item) => {
    if (String(item.userId) == GlobalValue.userId) {
      showCustomAlertWithMsg("Cannot select loggined user", navigation);
      return;
    }
    if (arrUserPass.includes(String(item.userId))) {
      showCustomAlertWithMsg(
        "Selected user already exists in Top8 List",
        navigation
      );
      return;
    }
    if (arrSelUser.some((itemTmp) => itemTmp.userId === item.userId)) {
      const arrUpdate = arrSelUser.filter(
        (itemTmp) => itemTmp.userId !== item.userId
      );
      setArrSelUser(arrUpdate);
    } else {
      setArrSelUser((prevData) => [...prevData, item]);
    }
  };
  const onAddSelClick = (item) => {
    if (arrSelUser.length === 0) {
      showCustomAlertWithMsg("Please select user", navigation);
      return;
    }
    const leftCount = arrUserPass.length + arrSelUser.length;
    if (leftCount > 8) {
      const msg =
        arrUserPass.length === 0
          ? "You can only select up to 8 users. !!"
          : `You can select maximum ${8 - arrUserPass.length} user now`;
      showCustomAlertWithMsg(msg, navigation);
      return;
    }
    function callBackFunForApICall(index) {
      if (arrSelUser[index]) {
        PostTop8MarkAPICall(
          arrSelUser[index].userId,
          index,
          callBackFunForApICall
        );
      } else {
        setApiCall(false);
        navigation.goBack();
      }
    }
    setApiCall(true);
    PostTop8MarkAPICall(
      arrSelUser[0].userId,
      0,
      callBackFunForApICall,
      setApiCall
    );
  };
  const onLoadMorePress = () => {
    fetchMoreDate();
  };
  const onSearchBarCrossClick = () => {
    setSearch("");
    setCurrentPage(1);
    userListAPICall(1, null);
  };
  //#endregion

  //#region JSX
  const renderFlatListRow = ({ item }) => {
    const isSel = arrSelUser.some((itemTmp) => itemTmp.userId === item.userId);
    const isTop8 = arrUserPass.some(
      (itemTmp) => String(itemTmp) === String(item.userId)
    );
    return (
      <TopRow
        type={isSel ? 3 : isTop8 ? 4 : 2}
        item={item}
        onBtnClick={onAddRowClick}
      />
    );
  };
  const renderFlatListFooter = () => {
    if (loader) {
      return <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />;
    } else if (
      totalCount == arrUserData.length ||
      arrUserData.length === 0 ||
      apicall
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
  const BottomBtnComp = () => {
    return (
      <View style={{ padding: scaleXiPhone15.sixteenH }}>
        {loader ? null : (
          <BtnApp
            isAPICall={apicall}
            title="Add Selected"
            onPress={onAddSelClick}
          />
        )}
      </View>
    );
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background, flex: 1 }}>
      <Header title="Add Top 8" onBackBtnPress={onBackBtnPress} />
      <FlatListHeader
        sch={sch}
        setSearch={setSearch}
        onCrossClick={onSearchBarCrossClick}
      />
      <FlatList
        style={styles.containerList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={(item, index) => index.toString()}
        data={arrUserData}
        renderItem={renderFlatListRow}
        ListFooterComponent={renderFlatListFooter}
      />
      <BottomBtnComp />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  containerList: {
    backgroundColor: ovnioColors.background,
  },
});
//#endregion

//#region FlatListHeader
const FlatListHeader = (prop) => {
  return (
    <View style={{ padding: scaleXiPhone15.sixteenH }}>
      <LoopzSearchBar
        onClearClick={prop.onCrossClick}
        placeholder={"Search.."}
        icon="x-circle"
        sch={prop.sch}
        setSearch={prop.setSearch}
      />
    </View>
  );
};
//#endregion

//#region API
async function GetUserListAPICall(
  setLoader,
  nextPage,
  setTotalCount,
  setArrUser,
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
      const { data, status, msg, recordsTotal } = res.data;
      if (!data || data.length < 1) {
        setArrUser([]);
        return;
      }
      console.log(
        "\u001b[1;32mAT.js : Res User List  = ",
        JSON.stringify(data.length)
      );
      setTotalCount(recordsTotal);
      const arrTmp = [];
      if (nextPage === 1) {
        for (userItem of data) {
          const item = {
            userId: userItem.id,
            name: userItem.name,
            email: userItem.email_id,
            profile_pic: userItem.profile_pic,
            username: userItem.username,
          };
          arrTmp.push(item);
        }
        setArrUser(arrTmp);
      } else {
        for (userItem of data) {
          const item = {
            userId: userItem.id,
            name: userItem.name,
            email: userItem.email_id,
            profile_pic: userItem.profile_pic,
            username: userItem.username,
          };
          arrTmp.push(item);
        }
        setArrUser((prevData) => [...prevData, ...arrTmp]);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | User List");
    });
}
async function PostTop8MarkAPICall(user_id, index, callbackfn, setLoader) {
  await PostTop8MarkUnmark({ user_id: user_id })
    .then((res) => {
      const { data, status, msg } = res.data;
      console.log(
        "\u001b[1;32mAT.j : Res Top8 Marrk - index | msg ",
        index,
        msg
      );
      callbackfn(index + 1);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Top 8 Unmark");
    });
}
//#endregion
