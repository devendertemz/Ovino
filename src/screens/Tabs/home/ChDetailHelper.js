//#region import
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
//blockComponent
import { TVShowRowComp } from "../../../components/blockComponent/OvinoGridCell";
//utils
import { compareDateTimeStampWithCrtTime } from "../../../utils/DateTimeUtil";
import { ovnioColors, scaleXiPhone15, fonts } from "../../../utils/Variable";
import { stylesCommon } from "../../../utils/CommonStyle";
//api
import GlobalValue from "../../../api/GlobalVar";

//#endregion

//#region asset
const ic_tvRemote = require("../../../assets/images/remote/ic_tvRemote.png");
//#endregion

//#region ChannelGuideRegion
const ChannelGuideRegion = (prop) => {
  //#region action
  let posX = 0;
  const scrollViewRef = useRef(null);
  const onRightOrLeftIconCLick = (isForward) => {
    //console.log("scrollViewRef = ", scrollViewRef?.current);
    if (isForward) {
      scrollViewRef.current?.scrollTo({
        x: posX + scaleXiPhone15.twoHundredW,
        animated: true,
      });
    } else {
      scrollViewRef.current?.scrollTo({
        x: posX - scaleXiPhone15.twoHundredW,
        animated: true,
      });
    }

    // console.log("onRightOrLeftIconCLick = ", isForward);
    // console.log("prop = ", prop.chGuide);
  };

  //#endregion

  //#region JSX
  const ChannelSchedule = () => {
    return (
      <View style={stylesCS.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const scrolling = event.nativeEvent.contentOffset.x;
            posX = scrolling;
          }}
          scrollEventThrottle={16}
        >
          {prop.chGuide?.programs?.map((item, key) => {
            return (
              <ChannelShowComp
                key={key}
                item={item}
                onAddReminder={prop.onAddReminder}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  };
  //#endregion

  return (
    <View style={styleGR.container}>
      <TVGuideHeader onArrowClicked={onRightOrLeftIconCLick} />
      <View style={styleGR.containerGuide}>
        <ChannelName
          imgUrl={prop.chGuide?.image == "" ? null : prop.chGuide.image}
          name={prop.chGuide?.name}
        />
        <ChannelSchedule />
      </View>
    </View>
  );
};

const TVGuideHeader = (prop) => {
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
      <View style={styleGR.containerIcon}>
        <TouchableOpacity onPress={() => prop.onArrowClicked(false)}>
          <Ionicons
            name={"arrow-back-circle-outline"}
            size={scaleXiPhone15.thrityTwoH}
            color={ovnioColors.grayDesc}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => prop.onArrowClicked(true)}>
          <Ionicons
            name={"arrow-forward-circle-outline"}
            size={scaleXiPhone15.thrityTwoH}
            color={ovnioColors.grayDesc}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styleGR = StyleSheet.create({
  container: {
    paddingHorizontal: scaleXiPhone15.twelveW,
    paddingTop: scaleXiPhone15.twentyH,
    gap: scaleXiPhone15.eightH,
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
  containerGuide: {
    flexDirection: "row",
    gap: scaleXiPhone15.eightW,
    height: scaleXiPhone15.hundredH,
    width: "100%",
    //backgroundColor: "yellow",
  },
});

const ChannelName = (props) => {
  const widthRow = Dimensions.get("window").width - scaleXiPhone15.twelveW;
  return (
    <View style={styleCN.container}>
      {props.imgUrl ? (
        <Image
          style={{
            width: widthRow * 0.25 * 0.75, //as flex : 0.25
            height: scaleXiPhone15.eightyH,
          }}
          resizeMode={"contain"}
          source={{
            uri: props.imgUrl,
          }}
        />
      ) : (
        <Text style={styleCN.txtChName}>
          {props.name ? props.name.toUpperCase() : "Channel"}
        </Text>
      )}
    </View>
  );
};
const styleCN = StyleSheet.create({
  container: {
    flex: 0.25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ovnioColors.blackContainerBg,
  },
  txtChName: {
    paddingHorizontal: scaleXiPhone15.fourW,
    ...stylesCommon.txtFgetPswd,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

const ChannelShowComp = (data) => {
  return (
    <View style={stylesCS.containerSch}>
      <View style={stylesCS.containerTime}>
        <Text style={stylesCommon.txtGuideTime}>{data.item.time_start}</Text>
        {data.item.active == 1 ? (
          <Text style={stylesCommon.txtGuideTime}>{data.item.time_left}</Text>
        ) : null}
      </View>
      <Text
        style={[stylesCommon.txtCtryName, { color: ovnioColors.white }]}
        numberOfLines={1}
      >
        {data.item.name}
      </Text>
      <View style={stylesCS.containerWatch}>
        <Text
          numberOfLines={2}
          style={[stylesCommon.txtGuideTime, { flex: 1 }]}
        >
          {data.item.season}&nbsp;-&nbsp;{data.item.episode}
        </Text>
        {compareDateTimeStampWithCrtTime(data.item.start_time) ? (
          <TouchableOpacity onPress={() => data.onAddReminder(data.item)}>
            <MaterialCommunityIcons
              name={"alarm"}
              size={scaleXiPhone15.twentyFourH}
              color={
                data.item.isreminder
                  ? ovnioColors.primaryRed
                  : ovnioColors.grayIconColor
              }
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {data.item.active == 1 ? (
        <View
          style={[
            stylesCS.containerLine,
            { width: data.item.percent_left + "%" },
          ]}
        ></View>
      ) : null}
    </View>
  );
};
const stylesCS = StyleSheet.create({
  container: {
    flex: 0.75,
    //backgroundColor: "lightblue",
  },
  containerSch: {
    marginRight: scaleXiPhone15.eightW,
    paddingHorizontal: scaleXiPhone15.eightW,
    //padding: scaleXiPhone15.fourH,
    justifyContent: "space-around",
    width: scaleXiPhone15.twoHundredW,
    height: "100%",
    backgroundColor: ovnioColors.blackContainerBg,
    //backgroundColor: "red",
  },
  containerTime: {
    justifyContent: "space-between",
    flexDirection: "row",
    //backgroundColor: "green",
  },
  containerLine: {
    height: scaleXiPhone15.twoH,
    position: "absolute",
    //width: scaleXiPhone15.twoHundredW,
    bottom: 0,
    backgroundColor: "yellow",
  },
  containerWatch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "blue",
  },
});
//#endregion

//#region FeatureShowRegion
const FeatureShowRegion = (prop) => {
  const renderTVShowRow = (props) => {
    return <TVShowRowComp isShowEye={true} item={props.item} />;
  };
  return (
    <View style={styleFR.container}>
      <FeaturedShoweHeader
        isHideArrow={prop.arrContent.length === 0}
        onArrowClick={prop.onArrowClick}
      />
      <FlatList
        keyExtractor={(item) => item.feature_id}
        style={styleFR.flatListTVShow}
        renderItem={renderTVShowRow}
        data={prop.arrContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
const FeaturedShoweHeader = (prop) => {
  return (
    <View style={styleFR.containerHeader}>
      <Text
        style={[
          stylesCommon.titleWelcome,
          { textAlign: "left", fontFamily: fonts.medium },
        ]}
      >
        Featured Show
      </Text>
      {prop.isHideArrow ? null : (
        <TouchableOpacity onPress={prop.onArrowClick}>
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
const styleFR = StyleSheet.create({
  container: {
    paddingHorizontal: scaleXiPhone15.twelveW,
    paddingVertical: scaleXiPhone15.twentyH,
    gap: scaleXiPhone15.eightH,
    //backgroundColor: "lightblue",
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "orange",
  },
  flatListTVShow: {
    flexGrow: 0,
    marginHorizontal: -scaleXiPhone15.twelveW,
    //paddingVertical: -scaleXiPhone15.eightH,
    //height: height * 0.22,
    // backgroundColor: "pink",
  },
});
//#endregion

//#region HomeBtmTabBar
const HomeBtmTabBar = (prop) => {
  /* console.log("H.js | tabBarHeight  = ", GlobalValue.btmTabHeight);
  console.log("H.js | btmSafeArearHt  = ", GlobalValue.btmSafeArearHt); */
  const ht = GlobalValue.btmTabHeight - GlobalValue.btmSafeArearHt;
  function getTabIndex(navType) {
    if (navType === 1) {
      return 4;
    } else {
      return 1;
    }
  }
  const tabSel = prop.navType ? getTabIndex(prop.navType) : 1;
  const [selTab, setTabSel] = useState(tabSel);
  const onTabPress = (index) => {
    setTabSel(index);
    if (index == 1) {
      prop.navigation.goBack();
    } else if (index == 2) {
      prop.navigation.navigate("TV Guide");
    } else if (index == 3) {
      prop.navigation.navigate("TVRemote");
    } else if (index == 4) {
      prop.navigation.navigate("Channels");
    } else if (index == 5) {
      prop.navigation.navigate("Profile");
    }
  };

  return (
    <View
      style={{
        height: ht,
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 0.25,
        borderTopColor: ovnioColors.grayDesc,
      }}
    >
      <TabBarComp
        index={1}
        isSel={selTab === 1}
        name="Home"
        iconName={"home"}
        onPress={onTabPress}
      />
      <TabBarComp
        index={2}
        isSel={selTab === 2}
        name="TV Guide"
        iconName={"monitor"}
        onPress={onTabPress}
      />
      <TVRemoteComp index={3} onPress={onTabPress} />
      <TabBarComp
        index={4}
        isSel={selTab === 4}
        name="Channels"
        iconName={"tv"}
        onPress={onTabPress}
      />
      <TabBarComp
        index={5}
        isSel={selTab === 5}
        name="Profile"
        iconName={"user"}
        onPress={onTabPress}
      />
    </View>
  );
};
const TabBarComp = (prop) => {
  const selColor = prop.isSel ? ovnioColors.primaryRed : ovnioColors.grayDesc;
  return (
    <TouchableOpacity
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
      }}
      onPress={() => {
        prop.onPress(prop.index);
      }}
    >
      <Feather
        name={prop.iconName}
        size={scaleXiPhone15.twentyFourH}
        color={selColor}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: scaleXiPhone15.fouteenH,
          fontFamily: fonts.medium,
          marginTop: scaleXiPhone15.eightH,
          color: selColor,
        }}
      >
        {prop.name}
      </Text>
    </TouchableOpacity>
  );
};
const TVRemoteComp = (prop) => {
  return (
    <TouchableOpacity
      style={{
        //position: "absolute",
        //flex: 0.28,
        height: height * 0.09,
        width: height * 0.09,
        marginTop: -scaleXiPhone15.sixteenH,
        borderRadius: (height * 0.09) / 2,
        transform: [{ scaleY: 1.0 }],

        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ovnioColors.primaryRed,
      }}
      onPress={() => {
        prop.onPress(prop.index);
      }}
    >
      <Image
        source={ic_tvRemote}
        resizeMode="contain"
        style={{
          height: height * 0.07,
        }}
      />
    </TouchableOpacity>
  );
};
//#endregion

export { ChannelGuideRegion, FeatureShowRegion, HomeBtmTabBar };
