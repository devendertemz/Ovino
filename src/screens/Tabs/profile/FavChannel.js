//#region import
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
const { height, width } = Dimensions.get("window");

//package
import Ionicons from "react-native-vector-icons/Ionicons";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//blockComponents
import { ChannelBlockGrid } from "../../../components/blockComponent/OvinoGridCell";
import Header from "../../../components/blockComponent/Header";
import EmptyListComp from "../../../components/blockComponent/EmptyListComp";
//utils
import { ovnioColors, scaleXiPhone15 } from "../../../utils/Variable";
//api
import {
  GetUserFavChannelList,
  DeleteAllUserFavChannels,
  DeleteSingleUserFavChannel,
} from "../../../api/GetRequest";
import { showAPIError } from "../../../api/Config";
//#endregion

//#region Main
export default function FavChannel({ navigation }) {
  //#region useState
  const [arrFav, setArrFav] = useState([]);
  const [loader, setLoader] = useState(false);
  //#endregion

  //#region api
  useEffect(() => {
    GetFavChannelListAPICall(setArrFav, setLoader);
  }, []);
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onItemBtnPress = (favItem) => {
    const arrFilter = arrFav.filter((item) => item.id !== favItem.id);
    setArrFav(arrFilter);
    DeleteSingleChannelAsFavAPICall(favItem.id);
  };
  const onActionBtnPress = () => {
    arrFav.length ? DeleteAllChannelAsFavAPICall(setArrFav, setLoader) : null;
  };
  //#endregion

  //#region renderFlatList
  const renderFlatListRow = (props) => {
    return (
      <ChannelBlockGrid
        btnPress={(item) => onItemBtnPress(item)}
        item={props.item}
        type={3}
      />
    );
  };
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? null : (
          <EmptyListComp
            ionIcons={"heart-outline"}
            title={"No favorite channel"}
            desc={""}
          />
        )}
      </>
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
  //#endregion

  return (
    <SafeAreaView backgroundColor={ovnioColors.background} flex={1}>
      <Header
        title="Favorites"
        actionText={"Remove All"}
        onBackBtnPress={onBackBtnPress}
        onActionBtnPress={onActionBtnPress}
      />
      <LoaderComp />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ marginTop: 16 }}
        numColumns={3}
        horizontal={false}
        data={arrFav}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => (item.id, index)}
        renderItem={renderFlatListRow}
        ListEmptyComponent={renderFlatListEmpty}
      />
    </SafeAreaView>
  );
}

//#endregion

//#region Api
async function GetFavChannelListAPICall(setArrFav, setLoader) {
  setLoader(true);
  await GetUserFavChannelList()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mFC.js : Res | Fav list =  ",
        JSON.stringify(res.data.data.length)
      );
      setArrFav(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Fav List");
    });
}
async function DeleteAllChannelAsFavAPICall(setArrFav, setLoader) {
  setLoader(true);
  await DeleteAllUserFavChannels()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mFC.js: RES | Remove All Fav = ",
        JSON.stringify(res.data.msg)
      );
      setArrFav([]);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | All Fav Channel Del");
    });
}
async function DeleteSingleChannelAsFavAPICall(chId) {
  await DeleteSingleUserFavChannel(chId)
    .then((res) => {
      console.log(
        "\u001b[1;32mFC.js: RES | Remove Single Fav = ",
        JSON.stringify(res.data.msg)
      );
    })
    .catch((error) => {
      showAPIError(error, "Error | Channel Del Fav");
    });
}
//#endregion
