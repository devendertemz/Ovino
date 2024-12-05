//#region import
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  Image,
  Text,
  BackHandler,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
const { height, width } = Dimensions.get("window");
//package
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
//baseComponents
import { PageControl } from "../../components/baseComponent/PageControl";
//util
import { stylesCommon } from "../../utils/CommonStyle";
import TextStrings from "../../utils/TextStrings";
import { ovnioColors, scaleXiPhone15 } from "../../utils/Variable";
//#endregion

//#region asset
const image1 = require("../../assets/images/banner/introOne.png");
const image2 = require("../../assets/images/banner/introTwo.png");
const image3 = require("../../assets/images/banner/introThree.png");
//#endregion

//#region Main
export default function Welcome({ navigation, route }) {
  //1-Stay Here
  //2-Move to Login - [Logo Out case]
  const { navType } = route.params;
  const flatListRef = useRef(FlatList);

  /* useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("\u001b[1;31mW.js : navType  = ", navType);
      if (navType === 2) {
        setTimeout(() => {
          navigation.navigate("Login");
        }, 5);
      }
    });
    return unsubscribe;
  }, [navigation, navType]); */

  /* useEffect(() => {
    const timer = setTimeout(() => {
      console.log("\u001b[1;31mW.js : navType  = ", navType);
      if (navType === 2) {
        console.log("\u001b[1;31mW.js : inside navType === 2");
        navigation.push("Login");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [navigation, navType]); */

  //#region back btn disable (on andriod)
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

  //#region useState
  const [loader, setLoader] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reloadIndex, setReloadIndex] = useState(false);
  const [arrWelcome, setArrWelcome] = React.useState([
    {
      id: 1,
      title1: TextStrings.titleOne,
      desc: TextStrings.descOne,
      imageurl: image1,
    },
    {
      id: 2,
      title1: TextStrings.titleTwo,
      desc: TextStrings.descTwo,
      imageurl: image2,
    },
    {
      id: 3,
      title1: TextStrings.titleThree,
      desc: TextStrings.descThree,
      imageurl: image3,
    },
  ]);
  //#endregion

  //#region action
  const onRightClicked = () => {
    if (selectedIndex >= 0 && selectedIndex < 2) {
      flatListRef?.current?.scrollToIndex({
        animated: true,
        index: selectedIndex + 1,
      });
    } else {
      navigation.navigate("Login");
    }
  };
  const onLeftClicked = () => {
    if (selectedIndex <= 2 && selectedIndex > 0) {
      flatListRef?.current?.scrollToIndex({
        animated: true,
        index: selectedIndex - 1,
      });
    }
  };
  //#endregion

  //#region renderFlatList
  const renderFlatListRow = ({ item, index }) => {
    return <IntroRow item={item} />;
  };

  //#endregion

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    >
      <FlatList
        style={{ flexGrow: 0 }}
        ref={flatListRef}
        initialNumToRender={1}
        showsHorizontalScrollIndicator={false}
        data={arrWelcome}
        horizontal={true} // Horizontal scrolling
        renderItem={renderFlatListRow}
        keyExtractor={(item) => item.id}
        pagingEnabled={true} // Enable paging
        snapToInterval={width} // Snap to each item's width
        decelerationRate="fast" // Speed of deceleration
        onScroll={({ nativeEvent }) => {
          const x = nativeEvent.contentOffset.x;
          //const point = x < 0 ? 0 : Math.abs(Math.floor(x / width));
          const point = x < 0 ? 0 : Math.abs(Math.floor((x / width) * 1.1));
          setSelectedIndex(point);
          setReloadIndex(!reloadIndex);
        }}
      />
      <SliderComp
        arrWelcome={arrWelcome}
        selectedIndex={selectedIndex}
        onLeftClicked={onLeftClicked}
        onRightClicked={onRightClicked}
      />
    </SafeAreaView>
  );
}

//#endregion

//#region IntroRow
const IntroRow = (prop) => {
  const { item } = prop;
  return (
    <View style={stylesIR.rowContainer}>
      <Image style={stylesIR.img} source={item.imageurl} resizeMode={"cover"} />
      <Text
        style={[stylesIR.title, { marginHorizontal: scaleXiPhone15.sixteenW }]}
      >
        {item.title1}
      </Text>
      <Text
        style={[stylesIR.desc, { marginHorizontal: scaleXiPhone15.sixteenW }]}
      >
        {item.desc}
      </Text>
    </View>
  );
};
const stylesIR = StyleSheet.create({
  rowContainer: {
    width: width,
    height: height * 0.7,
    alignItems: "center",
    justifyContent: "space-evenly",
    //backgroundColor: "yellow",
  },
  img: {
    width: "100%",
    height: height * 0.5,
    alignSelf: "center",
    //backgroundColor: "pink",
  },
  title: {
    ...stylesCommon.titleWelcome,
  },
  desc: {
    ...stylesCommon.subTitleWelcome,
  },
});
//#endregion

//#region SliderComp
const SliderComp = (prop) => {
  return (
    <View style={stylesSC.container}>
      <TouchableOpacity
        disabled={prop.selectedIndex === 0}
        style={[
          stylesSC.containerLeft,
          {
            backgroundColor:
              prop.selectedIndex != 0
                ? ovnioColors.blackContainerBg
                : ovnioColors.background,
          },
        ]}
        onPress={prop.onLeftClicked}
      >
        {prop.selectedIndex != 0 ? (
          <Ionicons
            name="arrow-back-outline"
            size={scaleXiPhone15.twentyH}
            color={ovnioColors.white}
          />
        ) : null}
      </TouchableOpacity>
      <View style={stylesSC.containerMiddle}>
        <PageControl
          count={prop.arrWelcome.length}
          selIndex={prop.selectedIndex}
        />
      </View>
      <TouchableOpacity
        style={stylesSC.containerRight}
        onPress={prop.onRightClicked}
      >
        <Ionicons
          name="arrow-forward-outline"
          size={scaleXiPhone15.twentyH}
          color={ovnioColors.blackContainerBg}
        />
      </TouchableOpacity>
    </View>
  );
};
const stylesSC = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    flexDirection: "row",
    //backgroundColor: "green",
  },
  containerLeft: {
    alignItems: "center",
    justifyContent: "center",
    height: scaleXiPhone15.fortyH,
    width: scaleXiPhone15.fortyH,
    borderRadius: scaleXiPhone15.fortyH * 0.5,
    backgroundColor: ovnioColors.blackContainerBg,
  },
  containerMiddle: {
    justifyContent: "center",
    //backgroundColor: "green",
  },
  containerRight: {
    alignItems: "center",
    justifyContent: "center",
    height: scaleXiPhone15.fortyH,
    width: scaleXiPhone15.fortyH,
    borderRadius: scaleXiPhone15.fortyH * 0.5,
    backgroundColor: ovnioColors.grayDesc,
  },
});
//#endregion
