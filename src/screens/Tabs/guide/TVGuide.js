//#region import
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  View,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
const widthRow = Dimensions.get("window").width - 16;
import Ionicons from "react-native-vector-icons/Ionicons";
//baseComponent
import BtnApp from "../../../components/baseComponent/BtnApp";
import BtnFilter from "../../../components/baseComponent/BtnFilter";
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//blockComponent
import { ChannelGuideRow } from "../../../components/blockComponent/OvnioCustomRow";
//utils
import { fonts, ovnioColors, scaleXiPhone15 } from "../../../utils/Variable";
import {
  getLocalStartEndTimeStampFromUTCStartDate,
  convertDateToAPIFormat,
} from "../../../utils/DateTimeUtil";
//api
import {
  PostChannelGuide,
  PostChannelGuideByCat,
} from "../../../api/PostRequest";
import { showAPIError } from "../../../api/Config";
import { stylesCommon } from "../../../utils/CommonStyle";
//#endregion

//#region Main
export default function TVGuide({ navigation, route }) {
  //#region useState
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setLoader] = useState(false);
  const [arrGuide, setArrGuide] = useState([]);
  const [selCat, setSelCat] = useState({});
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  //#endregion

  //#region api
  const onRefreshFlatList = React.useCallback(() => {
    if (selCat.id) {
      PostChannelGuideByCatAPICall(setLoader, selCat.id, setArrGuide);
    } else {
      setCurrentPage(1);
      PostChannelGuideAPICall(1, setTotalCount, setArrGuide, setRefreshing);
    }
  }, [selCat]);
  useEffect(() => {
    PostChannelGuideAPICall(1, setTotalCount, setArrGuide, setRefreshing);
    setSelCat({});
  }, []);
  useEffect(() => {
    if (route.params?.catSel) {
      console.log(
        "\u001b[1;35mTG.js : catSel = ",
        JSON.stringify(route.params.catSel)
      );
      if (route.params?.catSel?.id) {
        PostChannelGuideByCatAPICall(
          setLoader,
          route.params.catSel.id,
          setArrGuide
        );
        setSelCat(route.params.catSel);
      } else {
        setCurrentPage(1);
        PostChannelGuideAPICall(1, setTotalCount, setArrGuide, setRefreshing);
        setSelCat({});
      }
    }
  }, [route.params?.catSel]);
  //#endregion

  //#region onaction
  const onCatSelClicked = () => {
    navigation.push("ChannelCategories", { catSel: selCat, type: 1 });
  };
  const onLoadMoreClicked = () => {
    setCurrentPage(currentPage + 1);
    PostChannelGuideAPICall(
      currentPage + 1,
      setTotalCount,
      setArrGuide,
      setLoader
    );
  };
  //#endregion

  //#region flatList
  const renderFlatListRow = (prop) => {
    return <ChannelGuideRow item={prop.item} />;
  };
  const renderFlatListHeader = () => {
    return null;
    //return <TVGuideHeader />;
  };
  const renderFlatListFooter = () => {
    if (selCat.id || totalCount === arrGuide.length) {
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
          onPress={onLoadMoreClicked}
        >
          {loader ? (
            <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
          ) : (
            <Text style={{ ...stylesCommon.txtBtn }}>Load More</Text>
          )}
        </TouchableOpacity>
      );
    }
  };
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? (
          <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
        ) : null}
      </>
    );
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <FlatList
        style={{ padding: scaleXiPhone15.eightW }}
        data={arrGuide}
        renderItem={renderFlatListRow}
        ListHeaderComponent={renderFlatListHeader}
        ListFooterComponent={renderFlatListFooter}
        ListEmptyComponent={renderFlatListEmpty}
        ItemSeparatorComponent={() => (
          <View style={{ height: scaleXiPhone15.eightW }} />
        )}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            tintColor={ovnioColors.primaryRed}
            refreshing={refreshing}
            onRefresh={onRefreshFlatList}
          />
        }
      />
      <BtnFilter onPress={onCatSelClicked} />
    </SafeAreaView>
  );
}
//#endregion

//#region TVGuideHeader
const TVGuideHeader = () => {
  return (
    <View
      style={{
        padding: scaleXiPhone15.eightW,
        flexDirection: "row",
        justifyContent: "flex-end",
        //backgroundColor: "green",
      }}
    >
      <Ionicons
        name={"arrow-back-circle-outline"}
        size={scaleXiPhone15.thrityTwoH}
        color={ovnioColors.grayDesc}
      />
      <Ionicons
        name={"arrow-forward-circle-outline"}
        size={scaleXiPhone15.thrityTwoH}
        color={ovnioColors.grayDesc}
      />
    </View>
  );
};
//#endregion

//#region API
async function PostChannelGuideAPICall(
  nextPage,
  setTotalCount,
  setArrGuide,
  setLoader
) {
  const crtDate = convertDateToAPIFormat(new Date());
  const para = { page: nextPage, count: 10 };
  const body = {
    showLimit: 5,
    current_date: crtDate,
  };
  setLoader(true);
  await PostChannelGuide(body, para)
    .then((res) => {
      setLoader(false);
      if (!res.data.data || res.data.data.length < 1) {
        return;
      }
      console.log(
        "\u001b[1;32mTVG.js :Channel Guide Res = ",
        JSON.stringify(res.data.data.length)
      );
      setTotalCount(res.data.recordsTotal);
      for (ch of res.data.data) {
        if (!ch.programs) continue;
        for (prog of ch.programs) {
          const { time_start, time_end } =
            getLocalStartEndTimeStampFromUTCStartDate(
              prog.start_time,
              prog.duration,
              prog.id
            );
          prog.time_start = time_start;
          prog.time_end = time_end;
        }
      }

      if (nextPage === 1) {
        setArrGuide(res.data.data);
      } else {
        setArrGuide((prevData) => [...prevData, ...res.data.data]);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Guide Error");
    });
}
async function PostChannelGuideByCatAPICall(setLoader, selCatId, setArrGuide) {
  const crtDate = convertDateToAPIFormat(new Date());
  const body = {
    showLimit: 5,
    current_date: crtDate,
  };
  setLoader(true);
  await PostChannelGuideByCat(body, selCatId)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mTVG.js : Res  PostChannelGuideByCat = ",
        JSON.stringify(res.data.data)
      );
      for (ch of res.data.data) {
        if (!ch.programs) continue;
        for (prog of ch.programs) {
          const { time_start, time_end } =
            getLocalStartEndTimeStampFromUTCStartDate(
              prog.start_time,
              prog.duration,
              prog.id
            );
          prog.time_start = time_start;
          prog.time_end = time_end;
        }
      }
      setArrGuide(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Guide Filter");
    });
}
//#endregion
