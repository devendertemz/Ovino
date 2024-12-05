//#region import
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { EventRegister } from "react-native-event-listeners";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
//blockComponent
import EmptyListComp from "../../../components/blockComponent/EmptyListComp.js";
import { LoopzSearchBar } from "../../../components/blockComponent/OvinoSearchBar.js";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../../utils/Variable.js";
//api
import GlobalValue from "../../../api/GlobalVar.js";
import { showAPIError, UseDebounce, validateUrl } from "../../../api/Config.js";
import { PostUserFollow } from "../../../api/PostRequest.js";
import {
  GetUserFollowerList,
  GetUserFollowingList,
} from "../../../api/GetRequest.js";
//asset
const place_square = require("../../../assets/images/placeHolder/place_square/place_square.png");
const place_small = require("../../../assets/images/placeHolder/place_small/place_small.png");

//#endregion

//#region Main
export default function FollowAndFollowing({ navigation, route }) {
  const { isFollow } = route.params ? route.params : false;

  //#region useState
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [sch, setSearch] = useState("");
  const [arrUser, setArrUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const debouncedSch = UseDebounce(sch.trim(), 900);
  //#endregion

  //#region api
  useFocusEffect(
    React.useCallback(() => {
      if (isFollow) {
        GetUserFollowerListAPICall(
          1,
          setArrUser,
          setTotalCount,
          setLoader,
          null
        );
      } else {
        GetUserFollowingListAPICall(
          1,
          setArrUser,
          setTotalCount,
          setLoader,
          null
        );
      }
      setSearch("");
    }, [navigation])
  );
  useEffect(() => {
    if (debouncedSch.length > 0) {
      console.log("debouncedSch:--" + debouncedSch);

      if (isFollow) {
        GetUserFollowerListAPICall(
          1,
          setArrUser,
          setTotalCount,
          setLoader,
          debouncedSch
        );
      } else {
        GetUserFollowingListAPICall(
          1,
          setArrUser,
          setTotalCount,
          setLoader,
          debouncedSch
        );
      }
    } else {
      if (isFollow) {
        GetUserFollowerListAPICall(
          1,
          setArrUser,
          setTotalCount,
          setLoader,
          null
        );
      } else {
        GetUserFollowingListAPICall(
          1,
          setArrUser,
          setTotalCount,
          setLoader,
          null
        );
      }
    }
  }, [debouncedSch]);
  const onRefreshFlatList = React.useCallback(() => {
    if (isFollow) {
      GetUserFollowerListAPICall(
        1,
        setArrUser,
        setTotalCount,
        setRefreshing,
        null
      );
    } else {
      GetUserFollowingListAPICall(
        1,
        setArrUser,
        setTotalCount,
        setRefreshing,
        null
      );
    }
  });
  const fetchMoreDate = () => {
    console.log(
      "Fetch More List Data : totalCount | arrData.length",
      totalCount,
      arrUser.length
    );
    if (loader || arrUser.length === 0) return;
    if (arrUser.length == totalCount) {
      console.log(
        "List End Reached no more call with totalCount = ",
        totalCount
      );
      return;
    }
    const nextPage = currentPage + 1;
    setCurrentPage(currentPage + 1);
    if (isFollow) {
      GetUserFollowerListAPICall(
        nextPage,
        setArrUser,
        setTotalCount,
        setLoader,
        debouncedSch
      );
    } else {
      GetUserFollowingListAPICall(
        1,
        setArrUser,
        setTotalCount,
        setRefreshing,
        debouncedSch
      );
    }
  };
  const onFollowRemoveClick = (item) => {
    PostFollowAndUnFollowAPICall(
      isFollow,
      item.user_id,
      setRefreshing,
      arrUser,
      setArrUser
    );
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
            ionIcons={"sad-outline"}
            title={isFollow ? "No Follow now!" : "No Following now!"}
            desc={""}
          />
        )}
      </>
    );
  };
  const renderFlatListItemSep = () => {
    return <View style={{ height: scaleXiPhone15.tenH }} />;
  };
  const renderFlatListFooter = () => {
    return <View style={{ height: scaleXiPhone15.fortyH }} />;
  };
  const renderFlatListRow = ({ item }) => {
    return (
      <FollowRowComp
        isFollow={isFollow}
        item={item}
        onPress={onFollowRemoveClick}
      />
    );
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <FlatList
        style={{ padding: scaleXiPhone15.sixteenH }}
        keyExtractor={(item, index) => item.user_id.toString()}
        data={arrUser}
        renderItem={renderFlatListRow}
        ListEmptyComponent={renderFlatListEmpty}
        ItemSeparatorComponent={renderFlatListItemSep}
        ListFooterComponent={renderFlatListFooter}
        ListHeaderComponent={
          <ListHeader isFollow={isFollow} sch={sch} setSearch={setSearch} />
        }
        onEndReachedThreshold={0.2}
        contentContainerStyle={{ flexGrow: 1 }}
        onEndReached={fetchMoreDate}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            tintColor={ovnioColors.primaryRed}
            refreshing={refreshing}
            onRefresh={onRefreshFlatList}
          />
        }
      />

      <LoaderComp />
    </SafeAreaView>
  );
}
//#endregion

//#region FollowRowComp
const FollowRowComp = (props) => {
  const { item } = props;
  return (
    <View style={stylesF.container}>
      <Image
        style={stylesF.profileIcon}
        source={
          item?.profile_pic
            ? {
                uri: item?.profile_pic,
              }
            : place_small
        }
      />
      <View style={{ flex: 1 }}>
        <Text style={stylesF.txtName}>
          {item?.first_name + " "}
          {item?.last_name ? item?.last_name : ""}
        </Text>

        {item?.username ? (
          <Text
            style={[stylesF.prflTitle, { fontSize: scaleXiPhone15.fouteenH }]}
          >
            {item?.username}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={[stylesF.btnBg]}
        onPress={() => props.onPress(item)}
      >
        <Text style={[stylesF.btnTxt]}>
          {props.isFollow ? "Follow" : "Unfollow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const stylesF = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: scaleXiPhone15.eightH,
    alignItems: "center",
  },
  profileIcon: {
    width: scaleXiPhone15.fivtySixH,
    height: scaleXiPhone15.fivtySixH,
    borderRadius: scaleXiPhone15.fivtySixH / 2,
  },
  txtName: {
    fontSize: scaleXiPhone15.sixteenH,
    fontWeight: "800",
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    lineHeight: scaleXiPhone15.eightteenH,
  },
  btnBg: {
    width: scaleXiPhone15.eightyH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    paddingVertical: scaleXiPhone15.eightH,
    borderRadius: scaleXiPhone15.fourH,
    backgroundColor: ovnioColors.primaryRed,
  },
  btnTxt: {
    textAlign: "center",
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.bold,
    color: "#000000",
  },
  prflTitle: {
    fontSize: scaleXiPhone15.sixteenH,
    fontWeight: "800",
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    // textAlign: 'center',
    lineHeight: scaleXiPhone15.eightteenH,
  },
});

//#endregion

//#region ListHeader
const ListHeader = (prop) => {
  const onClearClick = () => {
    prop.setSearch("");
  };

  return (
    <View
      style={{
        marginTop: scaleXiPhone15.eightteenH,
        gap: scaleXiPhone15.sixteenH,
        //backgroundColor: "red",
      }}
    >
      <LoopzSearchBar
        onClearClick={onClearClick}
        placeholder={"Search.."}
        icon="x-circle"
        sch={prop.sch}
        setSearch={prop.setSearch}
      />
      <Text style={styles.title}>
        {prop.isFollow ? "All Followers" : "All Following "}
      </Text>
    </View>
  );
};
//#endregion

//#region StyleSheet
const styles = StyleSheet.create({
  prflCont: {
    flexDirection: "row",
    gap: scaleXiPhone15.eightH,
    alignItems: "center",
    justifyContent: "space-between",
    //backgroundColor: 'red',
  },
  title: {
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
    textAlign: "left",
    paddingVertical: scaleXiPhone15.eightteenH,
  },
  profileIcon: {
    width: scaleXiPhone15.fivtySixH,
    height: scaleXiPhone15.fivtySixH,
    borderRadius: scaleXiPhone15.fivtySixH / 2,
  },
  btnBg: {
    width: scaleXiPhone15.eightyH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    paddingVertical: scaleXiPhone15.sixH,
    borderRadius: scaleXiPhone15.fourH,
    backgroundColor: ovnioColors.primaryRed,
  },
  btnTxt: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.bold,
    color: "#000000",
  },
});
//#endregion

//#region API
async function GetUserFollowerListAPICall(
  nextPage,
  setArrUser,
  setTotalCount,
  setLoader,
  search
) {
  setLoader(true);
  const para = { page: nextPage, limit: 10 };
  console.log("GetUserFollowerListAPICall " + search);
  if (search && search.length > 0) {
    para.search = search;
  }

  await GetUserFollowerList(para)
    .then((res) => {
      setLoader(false);
      const { followers, totalRecord } = res.data;
      console.log(
        "\u001b[1;32mFAF.js : RES | Follower list = ",
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
async function GetUserFollowingListAPICall(
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

  await GetUserFollowingList(para)
    .then((res) => {
      setLoader(false);
      const { followers, totalRecord } = res.data;
      console.log(
        "\u001b[1;32mFAF.js : RES | Following list = ",
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
async function PostFollowAndUnFollowAPICall(
  isFollow,
  userId,
  setRefreshing,
  arrUser,
  setArrUser
) {
  const para = { action: isFollow ? "follow" : "unfollow" };
  const body = {
    followe_id: userId,
  };
  setRefreshing(true);
  await PostUserFollow(para, body)
    .then((res) => {
      console.log(
        "\u001b[1;32mFAF.js : RES | User unfollow = ",
        JSON.stringify(res.data)
      );
      if (!isFollow) {
        EventRegister.emit(GlobalValue.refreshHomePostList, true);
        const updatedItems = arrUser.filter((item) => item.user_id !== userId);
        setArrUser(updatedItems);
      }
      setRefreshing(false);
    })
    .catch((error) => {
      setRefreshing(false);
      showAPIError(error, "Error | Unfollow");
    });
}
//#endregion
