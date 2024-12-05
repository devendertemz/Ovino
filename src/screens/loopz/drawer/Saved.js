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
  Dimensions,
  ImageBackground,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { useFocusEffect } from "@react-navigation/native";
const { height, width } = Dimensions.get("window");
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
import FontIcons from "../../../components/baseComponent/FontIcons";
//blockComponent
import EmptyListComp from "../../../components/blockComponent/EmptyListComp.js";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../../utils/Variable.js";
//api
import GlobalValue from "../../../api/GlobalVar.js";
import { showAPIError, validateUrl } from "../../../api/Config.js";
import {
  DeleteArchievePost,
  GetArchievePost,
} from "../../../api/GetRequest.js";

//asset
const place_square = require("../../../assets/images/placeHolder/place_square/place_square.png");
const place_small = require("../../../assets/images/placeHolder/place_small/place_small.png");

//#endregion

//#region Main
export default function Saved({ navigation, route }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [arrArchivePost, setArrArchivePost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  //#endregion

  //#region api
  useFocusEffect(
    React.useCallback(() => {
      GetArchievePostListAPICall(
        1,
        setArrArchivePost,
        setTotalCount,
        setLoader
      );
    }, [navigation])
  );
  const onRefreshFlatList = React.useCallback(() => {
    GetArchievePostListAPICall(
      1,
      setArrArchivePost,
      setTotalCount,
      setRefreshing
    );
  });
  const fetchMoreDate = () => {
    console.log(
      "Fetch More List Data : totalCount | arrData.length",
      totalCount,
      arrArchivePost.length
    );
    if (loader || arrArchivePost.length === 0) return;
    if (arrArchivePost.length == totalCount) {
      console.log(
        "List End Reached no more call with totalCount = ",
        totalCount
      );
      return;
    }
    const nextPage = currentPage + 1;
    setCurrentPage(currentPage + 1);

    GetArchievePostListAPICall(
      nextPage,
      setArrArchivePost,
      setTotalCount,
      setRefreshing
    );
  };
  const onRemoveClick = (item) => {
    DeleteArchievePostAPICall(
      item,
      setRefreshing,
      arrArchivePost,
      setArrArchivePost
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
            title={"No Saved now!"}
            desc={""}
          />
        )}
      </>
    );
  };
  const renderFlatListItemSep = () => {
    return (
      <View style={{ height: scaleXiPhone15.tenH, backgroundColor: "green" }} />
    );
  };
  const renderFlatListFooter = () => {
    return <View style={{ height: scaleXiPhone15.fortyH }} />;
  };
  const renderFlatListRow = ({ item }) => {
    return (
      <SaveGridComp item={item} onRemoveClick={() => onRemoveClick(item)} />
    );
  };
  //#endregion

  //#region SavedComp
  const SavedComp = (prop) => {
    const { item } = prop;
    const onRemoveClick = (item) => {
      DeleteArchievePostAPICall(
        item,
        setRefreshing,
        arrArchivePost,
        setArrArchivePost
      );
    };
    return (
      <View>
        <ImageBackground
          style={styleSave.container}
          source={
            validateUrl(item?.cover_image_url)
              ? {
                  uri: item?.cover_image_url,
                }
              : place_square
          }
        >
          <View
            style={{
              bottom: scaleXiPhone15.fourH,
              left: scaleXiPhone15.eightH,
              position: "absolute",
            }}
          >
            <PlayComp item={item} />
          </View>
        </ImageBackground>
        <TouchableOpacity
          style={[styleSave.btnBg]}
          onPress={() => onRemoveClick(item)}
        >
          <Text style={[styleSave.btnTxt]}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  //#endregion

  //#region PlayComp
  const PlayComp = (prop) => {
    const { item } = prop;

    return (
      <View style={stylePlay.container}>
        <FontIcons
          name="play-large-fill"
          size={scaleXiPhone15.twentyH}
          color="#fff"
        />

        <Text style={stylePlay.txt}>{item.view_count}</Text>
      </View>
    );
  };
  const stylePlay = StyleSheet.create({
    container: {
      gap: scaleXiPhone15.eightH,
      flexDirection: "row",
      //backgroundColor: "pink",
    },
    txt: {
      fontFamily: fonts.bold,
      color: "white",
      fontSize: scaleXiPhone15.sixteenH,
    },
  });
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <FlatList
        style={{
          paddingVertical: scaleXiPhone15.eightH,
        }}
        //contentContainerStyle={{ alignItems: "center" }}
        keyExtractor={(item, index) => index.toString()}
        data={arrArchivePost}
        numColumns={3}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        renderItem={renderFlatListRow}
        ListEmptyComponent={renderFlatListEmpty}
        //ItemSeparatorComponent={renderFlatListItemSep}
        ListFooterComponent={renderFlatListFooter}
        // contentContainerStyle={{ flexGrow: 1 }}
        onEndReachedThreshold={0.2}
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

//#region SaveGridComp
const SaveGridComp = (prop) => {
  const { item } = prop;
  return (
    <View style={styleSave.container}>
      <ImageBackground
        style={styleSave.imgBg}
        source={
          item?.cover_image_url
            ? {
                uri: item?.cover_image_url,
              }
            : place_square
        }
      >
        <View
          style={{
            bottom: scaleXiPhone15.fourH,
            left: scaleXiPhone15.eightH,
            position: "absolute",
          }}
        >
          <PlayComp item={item} />
        </View>
      </ImageBackground>
      <TouchableOpacity
        style={[styleSave.btnBg]}
        onPress={() => prop.onRemoveClick(item)}
      >
        <Text style={[styleSave.btnTxt]}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};
const PlayComp = (prop) => {
  const { item } = prop;

  return (
    <View style={styleSave.containerPlay}>
      <FontIcons
        name="play-large-fill"
        size={scaleXiPhone15.twentyH}
        color="#fff"
      />

      <Text style={styleSave.txt}>{item.view_count}</Text>
    </View>
  );
};
const styleSave = StyleSheet.create({
  container: {
    width: width / 3,
    alignItems: "center",
    //backgroundColor: "yellow",
  },
  imgBg: {
    width: width / 3 - scaleXiPhone15.tenH,
    height: width / 2.5,
    //backgroundColor: "blue",
  },
  btnBg: {
    paddingVertical: scaleXiPhone15.sixH,
    marginVertical: scaleXiPhone15.tenH,
    alignSelf: "center",
    paddingHorizontal: scaleXiPhone15.fouteenH,
    borderRadius: scaleXiPhone15.fourH,
    backgroundColor: ovnioColors.primaryRed,
  },
  btnTxt: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.bold,
    color: "#000000",
  },
  containerPlay: {
    alignItems: "center",
    gap: scaleXiPhone15.eightH,
    flexDirection: "row",
    //backgroundColor: "pink",
  },
  txt: {
    fontFamily: fonts.bold,
    color: "white",
    fontSize: scaleXiPhone15.sixteenH,
  },
});
//#endregion

//#region API
async function GetArchievePostListAPICall(
  nextPage,
  setArrArchivePost,
  setTotalCount,
  setLoader
) {
  setLoader(true);
  await GetArchievePost({ page: nextPage, limit: 10 })
    .then((res) => {
      setLoader(false);
      const { posts, totalRecord } = res.data;
      console.log(
        "\u001b[1;32mS.js : RES | Archive post list = ",
        JSON.stringify(posts)
      );
      setTotalCount(totalRecord);
      if (nextPage === 1) {
        setArrArchivePost(posts);
      } else {
        setArrArchivePost((prevData) => [...prevData, ...posts]);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Archieve");
    });
}
async function DeleteArchievePostAPICall(
  item,
  setLoader,
  arrArchivePost,
  setArrArchivePost
) {
  setLoader(true);
  await DeleteArchievePost(item.archieve_id)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mSaved.js : RES | Delete Archieve  = ",
        JSON.stringify(res.data)
      );
      EventRegister.emit(GlobalValue.refreshHomePostList, true);

      //      delete an item by its id
      // Filter out the item with the matching id
      const updatedItems = arrArchivePost.filter(
        (itemObj) => itemObj.archieve_id !== item.archieve_id
      );
      // Update the state with the new array
      setArrArchivePost(updatedItems);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Delete Archieve");
    });
}
//#endregion
