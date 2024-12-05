//#region Import
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  FlatList,
} from "react-native";
const { height, width } = Dimensions.get("window");
//package
import Ionicons from "react-native-vector-icons/Ionicons";
//baseComp
import CustomLoader from "../../../components/baseComponent/CustomLoader";
import BtnFilter from "../../../components/baseComponent/BtnFilter";
//blockComponents
import { ChannelGrid } from "../../../components/blockComponent/OvinoGridCell";
//utils

import { appSize, ovnioColors, scaleXiPhone15 } from "../../../utils/Variable";
import { showMsgAlert } from "../../../utils/Alert";
//api
import { FreeChannelViewingCheck } from "../../../api/GlobalAPICall";
import { GetTvChannelList, GetTvChannelByCat } from "../../../api/GetRequest";
import { showAPIError } from "../../../api/Config";
import GlobalValue from "../../../api/GlobalVar";
//#endregion

//#region Main
export default function Channel({ navigation, route }) {
  //#region useState
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selCat, setSelCat] = useState({});
  const [arrChannel, setArrChannel] = useState([]);
  //#endregion

  //#region onaction
  const onCatSelClicked = () => {
    navigation.push("ChannelCategories", { catSel: selCat, type: 2 });
  };
  const onChClicked = (item) => {
    if (!FreeChannelViewingCheck(item.item.channel, navigation)) return;
    const chDet = {
      id: item.item.id,
      channel: item.item.channel,
      channel_name: item.item.name,
      image: item.item.image,
      blocked: item.item.blocked,
      ispinned: false,
    };

    navigation.navigate("HomeDetails", {
      ChannelDetails: chDet,
      navType: 1,
    });
  };
  //#endregion

  //#region api
  const onRefreshFlatList = React.useCallback(() => {
    if (selCat.id) {
      GetTvChannelByCatAPICall(setRefreshing, selCat.id, setArrChannel);
    } else {
      GetTvChannelListAPICall(setRefreshing, setArrChannel);
    }
  }, [selCat]);
  useFocusEffect(
    React.useCallback(() => {
      if (GlobalValue.isChannelRefresh) {
        console.log(
          "\u001b[1;35mCH.js : useFocusEffect selCat = ",
          JSON.stringify(selCat)
        );
        if (selCat.id) {
          GetTvChannelByCatAPICall(setLoader, selCat.id, setArrChannel);
        } else {
          GetTvChannelListAPICall(setLoader, setArrChannel);
        }
      }
    }, [navigation, selCat])
  );
  useEffect(() => {
    GetTvChannelListAPICall(setLoader, setArrChannel);
  }, []);
  useEffect(() => {
    if (route.params?.catSel) {
      console.log(
        "\u001b[1;35mCH.js : useEffect catSel = ",
        JSON.stringify(route.params.catSel)
      );
      if (route.params?.catSel?.id) {
        setSelCat(route.params.catSel);
        GetTvChannelByCatAPICall(
          setLoader,
          route.params.catSel.id,
          setArrChannel
        );
      } else {
        GetTvChannelListAPICall(setLoader, setArrChannel);
        setSelCat({});
      }
    }
  }, [route.params?.catSel]);
  //#endregion

  //#region flatlist Render
  const renderFlatListRow = (props) => {
    return <ChannelGrid item={props.item} onPress={onChClicked} />;
  };
  const LoaderComp = () => {
    return (
      <>
        {loader ? (
          <CustomLoader
            padding={scaleXiPhone15.sixteenH}
            isSmall={false}
            color={ovnioColors.primaryRed}
          />
        ) : null}
      </>
    );
  };
  //#endregion

  return (
    <SafeAreaView backgroundColor={ovnioColors.background} flex={1}>
      <LoaderComp />
      <FlatList
        style={{
          paddingTop: scaleXiPhone15.eightH,
        }}
        numColumns={3}
        horizontal={false}
        data={arrChannel}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => (item.id, index)}
        renderItem={renderFlatListRow}
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

//#region Api
async function GetTvChannelListAPICall(setLoader, setArrChannel) {
  setLoader(true);
  await GetTvChannelList()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mCH.js : Res = ",
        JSON.stringify(res.data.data.length)
      );
      setArrChannel(res.data.data);
      GlobalValue.isChannelRefresh = false;
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Error");
    });
}
async function GetTvChannelByCatAPICall(setLoader, selCatId, setArrCat) {
  setLoader(true);
  const para = { id: selCatId, page: 1, count: 10 };
  await GetTvChannelByCat(para)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mCC.js : Res GetChannelbyCat = ",
        JSON.stringify(res.data.data.length)
      );
      setArrCat(res.data.data);
      GlobalValue.isChannelRefresh = false;
    })
    .catch((error) => {
      setLoader(false);
      if (error.response.status === 400) {
        setArrCat([]);
      } else {
        showAPIError(error, "Channel Filter");
      }
    });
}
//#endregion
