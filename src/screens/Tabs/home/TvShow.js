//#region import
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//blockComponent
import { TVShowRowComp } from "../../../components/blockComponent/OvinoGridCell";
import Header from "../../../components/blockComponent/Header";
import EmptyListComp from "../../../components/blockComponent/EmptyListComp";
//utils
import { appSize, ovnioColors, scaleXiPhone15 } from "../../../utils/Variable";
import {
  PostChannelContentLive,
  PostChannelFeaturedContent,
} from "../../../api/PostRequest";
//api
import { showAPIError } from "../../../api/Config";
import { FreeChannelViewingCheck } from "../../../api/GlobalAPICall";
//#endregion

//#region Main
export default function TvShow({ navigation, route }) {
  const { type, chId } = route.params;
  //* 1 - From Home.js | 2 - From HomeDetail.js

  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrTvShow, setArrTvShow] = useState([]);
  //#endregion

  //#region api
  useEffect(() => {
    if (type === 1) {
      PostChannelContentLiveAPICall(setLoader, setArrTvShow);
    } else {
      PostChannelFeaturedContentAPICall(chId, setArrTvShow, setLoader);
    }
  }, []);
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onTVShowRowClick = (item) => {
    if (!FreeChannelViewingCheck(item.channel, navigation)) return;
    const chDet = {
      id: item.channel_id,
      channel: item.channel,
      channel_name: item.channel_name,
      image: item.image,
      blocked: item.blocked,
      ispinned: false,
    };

    navigation.navigate("HomeDetails", {
      ChannelDetails: chDet,
      navType: 3,
    });
  };
  //#endregion

  //#region flatList render
  const renderFlatListRow = (props) => {
    return (
      <TVShowRowComp
        item={props.item}
        isPressEnabled={true}
        onPress={onTVShowRowClick}
      />
    );
  };
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? (
          <CustomLoader
            padding={scaleXiPhone15.sixteenH}
            isSmall={false}
            color={ovnioColors.primaryRed}
          />
        ) : (
          <EmptyListComp title={"No Show now!"} desc={""} />
        )}
      </>
    );
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background }} flex={1}>
      <Header
        title={type === 1 ? "TV Shows" : "Feature Show"}
        isBackDisable={false}
        onBackBtnPress={onBackBtnPress}
      />
      <FlatList
        style={{
          marginVertical: scaleXiPhone15.sixteenH,
          backgroundColor: ovnioColors.background,
        }}
        numColumns={3}
        horizontal={false}
        data={arrTvShow}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => (item.id, index)}
        renderItem={renderFlatListRow}
        ListEmptyComponent={renderFlatListEmpty}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: scaleXiPhone15.twelveH,
              backgroundColor: ovnioColors.background,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region API
async function PostChannelContentLiveAPICall(setLoader, setArrTvShow) {
  const body = {
    showLimit: 40,
  };
  setLoader(true);
  await PostChannelContentLive(body)
    .then((res) => {
      setLoader(false);
      if (!res.data.data || res.data.data.length < 1) {
        return;
      }
      console.log(
        "\u001b[1;32mTvShow.js :tv show  = ",
        JSON.stringify(res.data.data.length)
      );
      setArrTvShow(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Tv Show Error");
    });
}
async function PostChannelFeaturedContentAPICall(
  chId,
  setArrContent,
  setLoader
) {
  setLoader(true);
  const body = {
    showLimit: 40,
  };
  await PostChannelFeaturedContent(chId, body)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mTv.js : Res PostChannelFeaturedContent = ",
        JSON.stringify(res.data.data.length)
      );
      setArrContent(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      if (!error.response.status === 400) {
        showAPIError(error, "Channel Featured Content");
      }
    });
}
//#endregion
