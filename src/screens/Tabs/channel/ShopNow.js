//#region Import
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  Share,
  Image,
  FlatList,
  Text,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
import Ionicons from "react-native-vector-icons/Ionicons";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//blockComponent
import HeaderRightIcon from "../../../components/blockComponent/HeaderRightIcon";
import WebViewPopup from "../../../components/popup/WebViewPopup";

//utils
import { ovnioColors, scaleXiPhone15, fonts } from "../../../utils/Variable";
import { stylesCommon } from "../../../utils/CommonStyle";
//api
import GlobalValue from "../../../api/GlobalVar";
import {
  GetProductList,
  GetChannelDetail,
  GetAddProduct,
} from "../../../api/GetRequest";
import { showAPIError } from "../../../api/Config";
//#endregion

//#region Assets
const place_width = require("../../../assets/images/placeHolder/place_width/place_width.png");
const place_square = require("../../../assets/images/placeHolder/place_square/place_square.png");
//#endregion

//#region Main
export default function ShopNow({ navigation }) {
  /* console.log(
    "\u001b[1;33mSN.js : GlobalValue.crtChannel = ",
    JSON.stringify(GlobalValue.crtChannel)
  ); */
  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrCat, setArrCat] = useState([]);
  const [selProd, setSelProd] = useState({});
  const [isShowWebView, setWebViewShow] = useState(false);
  //#endregion

  //#region api
  useEffect(() => {
    GetProductsAPICall(setLoader, setArrCat);
    GetChannelDetailAPICall(GlobalValue.crtChannel?.id, setLoader);
  }, []);
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onShareBtnPress = async () => {
    try {
      const result = await Share.share({
        title: GlobalValue.crtChannel?.name,
        message: "https://www.instagram.com/ovnio_/",
      });
      if (result.action === Share.sharedAction) {
        console.log(
          "\u001b[1;33mSN.js : result.activityType = ",
          JSON.stringify(result.activityType)
        );
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const onFavBtnPress = () => {
    GlobalValue.crtChannel.isfavourite = GlobalValue.crtChannel?.isfavourite
      ? false
      : true;
  };
  const onCartBtnClicked = async (item) => {
    setSelProd(item);
    GetAddProductAPICall(
      GlobalValue.crtChannel?.id,
      item.product_id,
      item.content_id
    );
    setWebViewShow(true);

    return;
    Linking.openURL(item.url).catch((err) =>
      console.error("An error occurred", err)
    );
  };
  //#endregion

  //#region JSX
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? (
          <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
        ) : null}
      </>
    );
  };
  const renderFlatListRow = (props) => {
    return <ShopGridCell item={props.item} onCartClicked={onCartBtnClicked} />;
  };
  const renderFlatListHeader = () => {
    return (
      <ListHeaderComp
        img={GlobalValue.crtChannel?.image}
        onCrossClick={onBackBtnPress}
      />
    );
  };

  const ShowPopUp = () => {
    return (
      <WebViewPopup
        selItem={selProd}
        status={isShowWebView}
        onClose={() => setWebViewShow(false)}
      />
    );
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <ShowPopUp />
      <HeaderRightIcon
        iconRightTwo={"share-social"}
        iconRightOne={
          GlobalValue.crtChannel?.isfavourite ? "heart" : "heart-outline"
        }
        title={GlobalValue.crtChannel?.channel_name}
        onBackBtnPress={onBackBtnPress}
        onShareBtnPress={onShareBtnPress}
        onFavBtnPress={onFavBtnPress}
      />
      <FlatList
        numColumns={2}
        horizontal={false}
        data={arrCat}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => (item.product_id, index)}
        renderItem={renderFlatListRow}
        ListHeaderComponent={renderFlatListHeader}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: scaleXiPhone15.twelveW,
              backgroundColor: ovnioColors.background,
            }}
          />
        )}
        ListEmptyComponent={renderFlatListEmpty}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region TopImageComp
const ListHeaderComp = (prop) => {
  return (
    <View style={{ gap: scaleXiPhone15.eightH }}>
      <Image
        style={styleTI.imgCh}
        source={
          prop.img
            ? {
                uri: prop.img,
              }
            : place_width
        }
      />
      <View style={styleTI.containerBtm}>
        <Text style={stylesCommon.txtBtn}>Shop</Text>
        {/* <TouchableOpacity onPress={prop.onCrossClick}>
          <Ionicons
            name={"close"}
            size={scaleXiPhone15.twentyFourH}
            color={ovnioColors.white}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};
const styleTI = StyleSheet.create({
  imgCh: {
    height: scaleXiPhone15.hundredEightyW,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    //backgroundColor: "green",
  },
  containerBtm: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scaleXiPhone15.twelveW,
    paddingVertical: scaleXiPhone15.eightW,
    //backgroundColor: "pink",
  },
});
//#endregion

//#region ShopGridCell
const ShopGridCell = (prop) => {
  const { item } = prop;
  return (
    <View style={styleSG.container}>
      <Image
        style={styleSG.imgShop}
        source={
          item.image
            ? {
                uri: item.image,
              }
            : place_square
        }
      ></Image>
      <View style={styleSG.containerBtm}>
        <View style={styleSG.containerTxt}>
          <Text numberOfLines={2} style={styleSG.txtName}>
            {item.name ? item.name.toLowerCase() : ""}
          </Text>
          <View style={styleSG.containerPrice}>
            <Text style={styleSG.txtDiscPrice}>
              {"$"}
              {item.discounted_price}
            </Text>
            <Text style={styleSG.txtPrice}>
              {"$"}
              {item.price}
            </Text>
          </View>
        </View>
        <View style={styleSG.containerIcon}>
          <TouchableOpacity
            style={styleSG.iconBg}
            onPress={() => prop.onCartClicked(item)}
          >
            <Ionicons
              name={"bag"}
              size={scaleXiPhone15.sixteenW}
              color={ovnioColors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styleSG = StyleSheet.create({
  container: {
    marginLeft: scaleXiPhone15.twelveW,
    width: (width - 3 * scaleXiPhone15.twelveW) / 2,
    height: scaleXiPhone15.twoHundredW,
    alignItems: "center",
    backgroundColor: ovnioColors.grayDot,
  },
  imgShop: {
    height: scaleXiPhone15.hundredFiftyW,
    justifyContent: "center",
    alignItems: "center",
    width: (width - 3 * scaleXiPhone15.twelveW) / 2,
    borderTopLeftRadius: scaleXiPhone15.fourH,
    borderTopRightRadius: scaleXiPhone15.fourH,
    //backgroundColor: "pink",
  },
  containerBtm: {
    paddingVertical: scaleXiPhone15.fourH,
    paddingHorizontal: scaleXiPhone15.eightH,
    gap: scaleXiPhone15.fourH,
    flexDirection: "row",
    width: (width - 3 * scaleXiPhone15.twelveW) / 2,
    height: scaleXiPhone15.twoHundredW - scaleXiPhone15.hundredFiftyW, //50
    borderBottomLeftRadius: scaleXiPhone15.fourH,
    borderBottomRightRadius: scaleXiPhone15.fourH,
    //backgroundColor: "blue",
  },
  containerTxt: {
    gap: scaleXiPhone15.fourH,
    flex: 0.75,
    height: "100%",
    justifyContent: "center",
    //backgroundColor: "orange",
  },
  containerPrice: {
    gap: scaleXiPhone15.eightW,
    flexDirection: "row",
    //backgroundColor: "green",
  },
  txtName: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twelveW,
    color: ovnioColors.white,
  },
  txtDiscPrice: {
    fontFamily: fonts.bold,
    fontSize: scaleXiPhone15.twelveW,
    color: ovnioColors.white,
  },
  txtPrice: {
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.twelveW,
    color: ovnioColors.white,
    textDecorationLine: "line-through",
  },
  containerIcon: {
    flex: 0.25,
    alignItems: "flex-end",
    justifyContent: "center",
    //backgroundColor: "pink",
  },
  iconBg: {
    alignItems: "center",
    justifyContent: "center",
    width: scaleXiPhone15.thrityW,
    height: scaleXiPhone15.thrityW,
    borderRadius: scaleXiPhone15.thrityW,
    backgroundColor: ovnioColors.primaryRed,
  },
});
//#endregion

//#region Api
async function GetProductsAPICall(setLoader, setArrCat) {
  //setLoader(true);
  await GetProductList({ content_id: GlobalValue.crtChannel.content_id })
    .then((res) => {
      //setLoader(false);
      console.log(
        "\u001b[1;32mSN.js : Res GetProductList = ",
        JSON.stringify(res.data.data)
      );
      setArrCat(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Filter");
    });
}
async function GetChannelDetailAPICall(chId, setLoader) {
  setLoader(true);
  await GetChannelDetail(chId)
    .then((res) => {
      // console.log(
      //   "\u001b[1;32mSN.js : Res GetChannelDetail = ",
      //   JSON.stringify(res.data.data)
      // );
      const { channel, schedules } = res.data.data;

      if (schedules.length > 0) {
        const arrTmp = schedules.filter((item) => item.active == 1);
        const schData = arrTmp.length === 1 ? arrTmp[0] : schedules[0];
        const chDet = {
          id: channel.id,
          channel: channel.seq_no,
          channel_name: channel.channel_name,
          image: channel.channel_image,
          ispinned: channel.ispinned,
          blocked: channel.blocked,
          content_id: schData.content_id,
          schedule_id: schData.id,
        };
        GlobalValue.crtChannel = chDet;
      } else {
        const chDet = {
          id: channel.id,
          channel: channel.seq_no,
          channel_name: channel.channel_name,
          image: channel.channel_image,
          ispinned: channel.ispinned,
          blocked: channel.blocked,
        };
        GlobalValue.crtChannel = chDet;
        const chData = { ...chDet };
        chData.isfavourite = channel.isfavourite;
        chData.ch_description = channel.description;
        chData.liveUrl = channel.liveUrl;
        GlobalValue.crtChannel = chData;
      }
      console.log(
        "\u001b[1;32mHD.js :  GlobalValue.crtChannel = ",
        JSON.stringify(GlobalValue.crtChannel)
      );
      setLoader(false);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Channel Detail");
    });
}
async function GetAddProductAPICall(ch_id, productId, content_id) {
  await GetAddProduct(ch_id, content_id, productId)
    .then((res) => {
      console.log(
        "\u001b[1;32mHD.js : Res GetAddProduct = ",
        JSON.stringify(res.data)
      );
    })
    .catch((error) => {
      showAPIError(error, "Add Product");
    });
}
//#endregion
