//#region Import
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
const { height, width } = Dimensions.get("window");
//package
import Ionicons from "react-native-vector-icons/Ionicons";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//utils
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../../utils/Variable";
import TextStrings from "../../../utils/TextStrings";
//api
import { GetTvChannelCatList } from "../../../api/GetRequest";
import { showAPIError } from "../../../api/Config";
import { stylesCommon } from "../../../utils/CommonStyle";
//#endregion

//#region asset
const place_small = require("../../../assets/images/placeHolder/place_small/place_small.png");
//#endregion

//#region Main
export default function ChannelCategories({ navigation, route }) {
  const { catSel, type } = route.params;

  console.log("\u001b[1;35mCC.js : catSel = ", JSON.stringify(catSel.name));
  console.log("\u001b[1;35mCC.js : type = ", type);

  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrCat, setArrCat] = useState([]);
  const [selCat, setSelCat] = useState(catSel);
  //#endregion

  //#region api
  useEffect(() => {
    GetTvChannelCatAPICall(setLoader, setArrCat);
  }, []);
  //#endregion

  //#region action
  const onResetClicked = () => {
    setSelCat({});
    if (type === 1) {
      navigation.navigate("TV Guide", { catSel: {} });
    } else {
      navigation.navigate("Channels", { catSel: {} });
    }
  };
  const onFilterClicked = () => {
    if (selCat.id) {
      if (type === 1) {
        navigation.navigate("TV Guide", { catSel: selCat });
      } else {
        navigation.navigate("Channels", { catSel: selCat });
      }
    }
  };
  //#endregion

  //#region renderFlatList
  const onFlatListRowClicked = (item) => {
    setSelCat(item);
  };
  const renderFlatListRow = (props) => {
    const { item } = props;
    if (selCat?.id === item.id) {
      return <CatRow item={item} onPress={onFlatListRowClicked} isSel={true} />;
    } else {
      return (
        <CatRow item={item} onPress={onFlatListRowClicked} isSel={false} />
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
  const renderFlatListHeader = () => {
    return (
      <CatHeader
        onResetClicked={onResetClicked}
        onFilterClicked={onFilterClicked}
        navigation={navigation}
      />
    );
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background, flex: 1 }}>
      <FlatList
        style={{ backgroundColor: ovnioColors.background }}
        numColumns={4}
        horizontal={false}
        data={arrCat}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => (item.id, index)}
        renderItem={renderFlatListRow}
        ListHeaderComponent={renderFlatListHeader}
        ListEmptyComponent={renderFlatListEmpty}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: scaleXiPhone15.sixteenH,
              backgroundColor: ovnioColors.background,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region CatHeader
const CatHeader = (props) => {
  return (
    <View style={stylesHeader.container}>
      <View style={stylesHeader.containerHead}>
        <View style={stylesHeader.containerClose}></View>
        <Text style={[stylesHeader.txtTitle, { flex: 0.8 }]}>
          {TextStrings.filter}
        </Text>
        <TouchableOpacity
          style={stylesHeader.containerClose}
          onPress={() => props.navigation.pop()}
        >
          <Ionicons
            name="close-outline"
            size={scaleXiPhone15.thrityH}
            color={ovnioColors.white}
          />
        </TouchableOpacity>
      </View>
      <Text style={stylesHeader.txtChoose}>
        {TextStrings.chooseCategorywhichyouwanttowatch}
      </Text>
      <View style={stylesHeader.containerBtn}>
        <Text
          style={[stylesCommon.txtBtn, { color: ovnioColors.primaryRed }]}
          onPress={props.onResetClicked}
        >
          {TextStrings.RESET}
        </Text>
        <Text
          style={[stylesCommon.txtBtn, { color: ovnioColors.primaryRed }]}
          onPress={props.onFilterClicked}
        >
          {TextStrings.FILTER}
        </Text>
      </View>
    </View>
  );
};
const stylesHeader = StyleSheet.create({
  container: {
    paddingVertical: scaleXiPhone15.twelveH,
    paddingHorizontal: scaleXiPhone15.eightW,
    marginBottom: scaleXiPhone15.twelveH,
    gap: scaleXiPhone15.eightH,
    //backgroundColor: "red",
  },
  containerHead: {
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "green",
  },
  containerClose: {
    flex: 0.1,
    alignItems: "flex-end",
    //backgroundColor: "yellow",
  },
  txtTitle: {
    color: ovnioColors.white,
    textAlign: "center",
    fontSize: scaleXiPhone15.twentyFourH,
    fontFamily: fonts.bold,
    //backgroundColor: "pink",
  },
  txtChoose: {
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: scaleXiPhone15.sixteenH,
    color: ovnioColors.txtOffWhite,
  },
  containerBtn: {
    paddingHorizontal: scaleXiPhone15.fourW,
    marginTop: scaleXiPhone15.eightH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "blue",
  },
});
//#endregion

//#region CatRow
const CatRow = (props) => {
  const { item, isSel } = props;
  return (
    <TouchableOpacity
      style={stylesR.container}
      onPress={() => props.onPress(item)}
    >
      <View
        style={[
          stylesR.containerIcon,
          {
            backgroundColor: isSel
              ? ovnioColors.primaryRed
              : ovnioColors.grayDot,
          },
        ]}
      >
        <Image
          style={{
            width: width * 0.15,
            height: width * 0.15,
            borderRadius: width * 0.15 * 0.5,
          }}
          source={props.item.image ? { uri: props.item.image } : place_small}
        />
      </View>
      <Text style={[stylesR.txtCat]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const stylesR = StyleSheet.create({
  container: {
    gap: scaleXiPhone15.eightH,
    alignItems: "center",
    marginLeft: scaleXiPhone15.eightW,
    width: (width - scaleXiPhone15.eightW * 5) / 4,
    //backgroundColor: ovnioColors.fbBg,
  },
  containerIcon: {
    width: (width - scaleXiPhone15.eightW * 5) / 4 - 8,
    height: (width - scaleXiPhone15.eightW * 5) / 4 - 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scaleXiPhone15.eightH,
    backgroundColor: ovnioColors.grayDot,
  },
  txtCat: {
    fontFamily: fonts.regular,
    fontSize: scaleXiPhone15.twelveH,
    color: ovnioColors.white,
    textAlign: "center",
  },
});
//#endregion

//#region API
async function GetTvChannelCatAPICall(setLoader, setArrCat) {
  setLoader(true);
  await GetTvChannelCatList()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mCC.js : Res GetCat = ",
        JSON.stringify(res.data.data.length)
      );
      setArrCat(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Category Error");
    });
}

//#endregion
