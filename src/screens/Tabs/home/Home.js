//#region import
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  ImageBackground,
  Image,
  FlatList,
  ScrollView,
  Text,
  Platform,
  BackHandler,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
import Ionicons from "react-native-vector-icons/Ionicons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//blockComponent
import {
  EyeComp,
  TVShowRowComp,
} from "../../../components/blockComponent/OvinoGridCell";
import { ChannelGuideRow } from "../../../components/blockComponent/OvnioCustomRow";
//utils
import {
  ovnioColors,
  scaleXiPhone15,
  fonts,
  APP_SCREEN,
} from "../../../utils/Variable";
import { stylesCommon } from "../../../utils/CommonStyle";
import {
  getLocalStartEndTimeStampFromUTCStartDate,
  convertDateToAPIFormat,
} from "../../../utils/DateTimeUtil";
import TextStrings from "../../../utils/TextStrings";
//api
import GlobalValue from "../../../api/GlobalVar";
import {
  PostChannelContentLive,
  PostChannelGuide,
} from "../../../api/PostRequest";
import { showAPIError } from "../../../api/Config";
import {
  GetChannelLive,
  GetChannelWatchedCount,
} from "../../../api/GetRequest";
import { FreeChannelViewingCheck } from "../../../api/GlobalAPICall";
//#endregion

//#region asset
const place_width = require("../../../assets/images/placeHolder/place_width/place_width.png");
//#endregion

//#region Main
export default function Home({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  GlobalValue.btmTabHeight = tabBarHeight;
  console.log("H.js | tabBarHeight  = ", tabBarHeight);

  const scrollViewRef = useRef(null);
  //#region useState
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setLoader] = useState(false);
  const [arrTopBanner, setArrTopBanner] = useState([]);
  const [arrChannelGuide, setArrChannelGuide] = useState([]);
  const [arrTvShow, setArrTvShow] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  //#endregion

  //#region back btn close app (on andriod)
  useEffect(() => {
    if (Platform.OS === "android") {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        if (e.data.action.type == "GO_BACK") {
          e.preventDefault();
          BackHandler.exitApp();
        }
      });
      return unsubscribe;
    }
  }, [navigation]);
  //#endregion

  //#region api
  useEffect(() => {
    GetChannelLiveAPICall(setLoader, setArrTopBanner);
    PostChannelContentLiveAPICall(setLoader, setArrTvShow);
    PostChannelGuideAPICall(setLoader, setArrChannelGuide);
    setTimeout(() => {
      if (!GlobalValue.is_subscribed)
        navigation.navigate(APP_SCREEN.APP_SUB_ALERT);
    }, 1000);
  }, []);
  const onRefreshFlatList = React.useCallback(() => {
    GetChannelLiveAPICall(setRefreshing, setArrTopBanner);
    PostChannelContentLiveAPICall(setRefreshing, setArrTvShow);
    PostChannelGuideAPICall(setRefreshing, setArrChannelGuide);
  }, []);
  //#endregion

  //#region action
  const scrollToItem = (index) => {
    const itemWidth = 100; // Adjust this value based on your item width and margin
    scrollViewRef.current.scrollTo({ x: index * itemWidth, animated: true });
    setCurrentIndex(index);
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
    navigation.navigate("HomeDetails", { ChannelDetails: chDet, navType: 2 });
    /* navigation.navigate("HomeStack", {
      screen: "HomeDetails",
      params: { ChannelDetails: chDet, navType: 2 },
    }); */
  };
  const moveLeft = () => {
    console.log("props.moveLeft");
    return;
    if (currentIndex > 0) {
      scrollToItem(currentIndex - 1);
    }
  };
  const moveRight = () => {
    return;

    if (currentIndex < arrChannelGuide[0].programs.length - 1) {
      scrollToItem(currentIndex + 1);
    }
  };
  //#endregion

  //#region flatList
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? (
          <View
            style={{
              width: width,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
          </View>
        ) : null}
      </>
    );
  };
  const renderTopBannerFlatListRow = (props) => {
    return <HomeBannerRow item={props.item} navigation={navigation} />;
  };
  const renderTVShowRow = (props) => {
    return (
      <TVShowRowComp
        item={props.item}
        isPressEnabled={true}
        onPress={onTVShowRowClick}
      />
    );
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <ScrollView
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            tintColor={ovnioColors.primaryRed}
            refreshing={refreshing}
            onRefresh={onRefreshFlatList}
          />
        }
      >
        <FlatList
          style={style.flatListBanner}
          keyExtractor={(item, index) => (item.id, index)}
          renderItem={renderTopBannerFlatListRow}
          data={arrTopBanner}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={renderFlatListEmpty}
        />
        <HomeSepComp
          title={TextStrings.tvShows}
          isHideArrow={arrTvShow.length === 0}
          navigation={navigation}
        />
        <FlatList
          style={style.flatListTVShow}
          renderItem={renderTVShowRow}
          data={arrTvShow}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
        <ChannelGuideRegion
          loader={loader}
          data={arrChannelGuide}
          moveLeft={moveLeft}
          moveRight={moveRight}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  flatListBanner: {
    flexGrow: 0,
    paddingVertical: scaleXiPhone15.eightH,
    //height: scaleXiPhone15.hundredSixtyW,
    //backgroundColor: "yellow",
  },
  flatListTrending: {
    flexGrow: 0,
    paddingVertical: scaleXiPhone15.eightH,
    //height: height * 0.22,
    //backgroundColor: "pink",
  },
  flatListTVShow: {
    flexGrow: 0,
    paddingVertical: scaleXiPhone15.eightH,
    //height: height * 0.22,
    //backgroundColor: "pink",
  },
});
//#endregion

//#region HomeSepComp
const HomeSepComp = (prop) => {
  const onArrowClick = () => {
    prop.navigation.navigate("TvShow", { type: 1 });
  };
  return (
    <View style={stylehSC.container}>
      <Text
        style={[
          stylesCommon.titleWelcome,
          { textAlign: "left", fontFamily: fonts.medium },
        ]}
      >
        {prop.title}
      </Text>
      {prop.isHideArrow ? null : (
        <TouchableOpacity onPress={onArrowClick}>
          <Ionicons
            name={"arrow-forward"}
            size={scaleXiPhone15.twentyEightH}
            color={ovnioColors.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
const stylehSC = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scaleXiPhone15.eightW,
    //backgroundColor: "green",
  },
});
//#endregion

//#region HomeBannerRow
const HomeBannerRow = (prop) => {
  const onActionChDetail = (item) => {
    if (!FreeChannelViewingCheck(item.channel, prop.navigation)) return;

    const chDet = {
      id: item.channel_id,
      channel: item.channel,
      channel_name: item.channel_name,
      image: item.image,
      ispinned: item.ispinned,
      blocked: item.blocked,
    };

    prop.navigation.navigate("HomeDetails", {
      ChannelDetails: chDet,
      navType: 2,
    });

    /* prop.navigation.navigate("HomeStack", {
      screen: "HomeDetails",
      params: { ChannelDetails: chDet, navType: 2 },
    }); */
    //TODO: Navigation when using "ChannelDetails"
    /*
    prop.navigation.jumpTo("Channel");
    setTimeout(() => {
      prop.navigation.navigate("ChannelDetails");
    }, 50);
    */
    /* prop.navigation.navigate("Channel", {
      screen: "ChannelList",
      params: {
        screen: "ChannelDetails",
      },
    }); */
  };
  return (
    <TouchableOpacity onPress={() => onActionChDetail(prop.item)}>
      <ImageBackground
        style={styleHB.container}
        imageStyle={styleHB.img}
        source={
          prop.item.image
            ? {
                uri: prop.item.image,
              }
            : place_width
        }
      >
        <Text style={styleHB.txtTitle}>
          {prop.item.name
            ? prop.item.name[0].toUpperCase() + prop.item.name.slice(1)
            : ""}
        </Text>
        <View style={styleHB.containerBtm}>
          <View style={styleHB.containerCh}>
            <Text style={styleHB.txtCh}>{prop.item.channel_name}</Text>
          </View>
          <Text
            style={[styleHB.txtTime, { marginLeft: scaleXiPhone15.eightH }]}
          >
            {prop.item.time_start}-{prop.item.time_end}
          </Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <EyeComp userCount={prop.item.usercount} />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
const styleHB = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    padding: scaleXiPhone15.eightW,
    // width: width - scaleXiPhone15.eightyW,
    width: width - 2 * scaleXiPhone15.eightW,
    height: scaleXiPhone15.hundredSixtyW,
    marginLeft: scaleXiPhone15.eightW,
    //backgroundColor: "green",
  },
  img: {
    resizeMode: "cover",
    borderWidth: scaleXiPhone15.oneH,
    borderRadius: scaleXiPhone15.tenH,
    borderColor: ovnioColors.blackContainerBg,
  },
  txtTitle: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.eightteenW,
    color: ovnioColors.white,
  },
  containerBtm: {
    marginTop: scaleXiPhone15.eightH,
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: "space-between",
    //backgroundColor: "red",
  },
  containerCh: {
    padding: scaleXiPhone15.sixH,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scaleXiPhone15.twoH,
    backgroundColor: ovnioColors.white,
  },
  txtCh: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.blackContainerBg,
  },
  txtTime: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.white,
  },
});
//#endregion

//#region ChannelGuideRegion
const ChannelGuideRegion = (props) => {
  return (
    <View style={styleGR.container}>
      {props.loader ? (
        <CustomLoader
          padding={scaleXiPhone15.sixteenH}
          isSmall={false}
          color={ovnioColors.primaryRed}
        />
      ) : (
        <TVGuideHeader moveLeft={props.moveLeft} moveRight={props.moveRight} />
      )}
      {props.data.map((item, key) => {
        return <ChannelGuideRow key={key} item={item} />;
      })}
    </View>
  );
};
const TVGuideHeader = (props) => {
  return (
    <View style={styleGR.containerHeader}>
      <Text
        style={[
          stylesCommon.titleWelcome,
          { textAlign: "left", fontFamily: fonts.medium },
        ]}
      >
        Channel Guide
      </Text>

      {/* <View style={styleGR.containerIcon}>
        <TouchableOpacity onPress={props.moveLeft}>
          <Ionicons
            name={"arrow-back-circle-outline"}
            size={scaleXiPhone15.thrityTwoH}
            color={ovnioColors.grayDesc}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.moveRight}>
          <Ionicons
            name={"arrow-forward-circle-outline"}
            size={scaleXiPhone15.thrityTwoH}
            color={ovnioColors.grayDesc}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};
const styleGR = StyleSheet.create({
  container: {
    padding: scaleXiPhone15.eightW,
    gap: scaleXiPhone15.eightW,
    //backgroundColor: "pink",
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "orange",
  },
  containerIcon: {
    gap: scaleXiPhone15.eightW,
    flexDirection: "row",
    justifyContent: "flex-end",
    //backgroundColor: "green",
  },
});
//#endregion

//#region API
async function GetChannelLiveAPICall(setLoader, setArrTopBanner) {
  setLoader(true);
  await GetChannelLive()
    .then((res) => {
      if (!res.data.data || res.data.data.length < 1) {
        setLoader(false);
        return;
      }
      const { data } = res.data;
      console.log(
        "\u001b[1;32mH.j : Res Channel Live data = ",
        JSON.stringify(data.length, null, 4)
      );
      for (ch of data) {
        const { time_start, time_end } =
          getLocalStartEndTimeStampFromUTCStartDate(ch.start_time, ch.duration);
        ch.time_start = time_start;
        ch.time_end = time_end;
      }

      const arrTmp = data.filter((item) => item.active == 1);
      const chData = arrTmp.length === 1 ? arrTmp[0] : res.data.data[0];
      const chDet = {
        id: chData.channel_id,
        channel: chData.channel,
        channel_name: chData.channel_name,
        image: chData.image,
        ispinned: false,
        isfavourite: chData.isfavourite,
        blocked: chData.blocked,
        content_id: chData.content_id,
        schedule_id: chData.id,
      };
      GlobalValue.crtChannel = chDet;
      if (data.length === 1) {
        GetChannelWatchedCountAPICall(
          chData.channel_id,
          chData,
          setArrTopBanner,
          setLoader
        );
      } else {
        setLoader(false);
        setArrTopBanner(data);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Live Error");
    });
}
async function GetChannelWatchedCountAPICall(
  chId,
  bannerCH,
  setArrTopBanner,
  setLoader
) {
  await GetChannelWatchedCount(chId)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mH.js : Res GetChannelWatchedCount = ",
        JSON.stringify(res.data.data.usercount)
      );
      bannerCH.usercount = res.data.data.usercount;
      setArrTopBanner([bannerCH]);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Channel Watched Count");
    });
}
async function PostChannelContentLiveAPICall(setLoader, setArrTvShow) {
  const body = {
    showLimit: 10,
  };
  setLoader(true);
  await PostChannelContentLive(body)
    .then((res) => {
      setLoader(false);
      if (!res.data.data || res.data.data.length < 1) {
        return;
      }
      console.log(
        "\u001b[1;32mH.j : Res TV Shows = ",
        JSON.stringify(res.data.data.length)
      );
      setArrTvShow(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "TV Show Error");
    });
}
async function PostChannelGuideAPICall(setLoader, setArrChannelGuide) {
  const crtDate = convertDateToAPIFormat(new Date());
  const para = { page: 1, count: 2 };
  const body = {
    showLimit: 10,
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
        "\u001b[1;32mH.j : Res Channel Guide = ",
        JSON.stringify(res.data.data.length)
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
      setArrChannelGuide(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Guide Error");
    });
}
//#endregion
