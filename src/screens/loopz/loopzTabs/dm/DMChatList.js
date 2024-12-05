//#region import
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from "react-native";
const height = Dimensions.get("window").height;
//blockComponent
import EmptyListComp from "../../../../components/blockComponent/EmptyListComp";
import { LoopzSearchBar } from "../../../../components/blockComponent/OvinoSearchBar";
import { FriendViewRow } from "../../../../components/blockComponent/OvnioCustomRow";
//baseComponent
import CustomLoader from "../../../../components/baseComponent/CustomLoader";
//utils
import {
  ovnioColors,
  scaleXiPhone15,
  APP_SCREEN,
} from "../../../../utils/Variable";
import { stylesCommon } from "../../../../utils/CommonStyle";
import { getLocalTimeStampFromUTCDate } from "../../../../utils/DateTimeUtil";
//api
import { UseDebounce } from "../../../../api/Config";
import { GetDMUserList } from "../../../../api/GetRequest";
import { GetDMSearchUserList } from "../../../../api/GetRequest";
import { showAPIError } from "../../../../api/Config";
//#endregion

//#region Main
export default DirectChat = ({ navigation, route }) => {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [arrUser, setArrUser] = useState([]);
  const [sch, setSearch] = useState("");
  const debouncedSch = UseDebounce(sch.trim(), 900);
  //#endregion

  //#region api
  useEffect(() => {
    GetDMUserListAPICall(1, setArrUser, setLoader);
  }, []);
  useEffect(() => {
    if (debouncedSch.length > 0) {
      GetDMSearchListAPICall(debouncedSch, setArrUser, setRefreshing);
    } else {
      console.log("ELSE debouncedSch = ", debouncedSch);
    }
  }, [debouncedSch]);
  //#endregion

  //#region action
  const onAddClick = (item) => {
    const user = {
      user_id: item.userId,
      first_name: item.name,
      username: item.name,
      profile_pic: item.profile_pic,
    };
    console.log("onAddClick user = ", JSON.stringify(item));
    navigation.navigate(APP_SCREEN.LOOPZ_DM, { user });
  };
  const onSearchBarCrossClick = () => {
    setSearch("");
    GetDMUserListAPICall(1, setArrUser, setLoader);
  };
  const onRefreshFlatList = React.useCallback(() => {
    setSearch("");
    GetDMUserListAPICall(1, setArrUser, setRefreshing);
  });
  //#endregion

  //#region JSX
  const renderFlatListRow = ({ item }) => {
    return <FriendViewRow item={item} onItemClick={() => onAddClick(item)} />;
  };
  const renderFlatListFooter = () => {
    return null;
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
  //#endregion

  return (
    <FlatList
      refreshing={refreshing}
      style={{ backgroundColor: "black", padding: scaleXiPhone15.sixteenH }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      data={arrUser}
      keyExtractor={(item, index) => item.userId.toString()}
      renderItem={renderFlatListRow}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      ListHeaderComponent={
        <ListHeader
          sch={sch}
          setSearch={setSearch}
          onCrossClick={onSearchBarCrossClick}
        />
      }
      ListFooterComponent={renderFlatListFooter}
      ListEmptyComponent={renderFlatListEmpty}
      refreshControl={
        <RefreshControl
          tintColor={ovnioColors.primaryRed}
          refreshing={refreshing}
          onRefresh={onRefreshFlatList}
        />
      }
    />
  );
};
const styles = StyleSheet.create({
  title: {
    ...stylesCommon.titleWelcome,
  },
});

//#endregion

//#region ListHeader
const ListHeader = (prop) => {
  return (
    <View
      style={{
        paddingVertical: scaleXiPhone15.eightH,
        //backgroundColor: "red",
      }}
    >
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
async function GetDMUserListAPICall(nextPage, setArrUser, setLoader) {
  setLoader(true);
  const para = { page: nextPage, count: 30 };
  await GetDMUserList(para)
    .then((res) => {
      setLoader(false);
      const { data, recordsTotal } = res.data;
      console.log(
        "\u001b[1;32mS.j : Res DM list = ",
        JSON.stringify(data, null, 4)
      );
      const arrTmp = [];
      for (userItem of data) {
        const { other_user, latest_message } = userItem;
        const item = {
          userId: other_user.id,
          name: other_user.first_name,
          profile_pic: other_user.profile_pic,
          msg: latest_message.msg,
          msg_time: latest_message.created_at,
        };
        arrTmp.push(item);
      }
      setArrUser(arrTmp);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | DM User List");
    });
}
async function GetDMSearchListAPICall(schTerm, setArrUser, setLoader) {
  setLoader(true);
  const para = { key: schTerm, page: 1, count: 30 };
  await GetDMSearchUserList(para)
    .then((res) => {
      setLoader(false);
      const { data, recordsTotal } = res.data;
      console.log(
        "\u001b[1;32mS.j : Res DM Sch list = ",
        JSON.stringify(data.length, null, 4)
      );
      const arrTmp = [];
      for (userItem of data) {
        const { other_user, latest_message } = userItem;
        const item = {
          userId: other_user.id,
          name: other_user.first_name,
          profile_pic: other_user.profile_pic,
          msg: latest_message.msg,
          msg_time: latest_message.created_at,
        };
        arrTmp.push(item);
      }
      setArrUser(arrTmp);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | DM User Search List");
    });
}
//#endregion
