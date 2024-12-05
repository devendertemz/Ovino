//#region import
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
//blockComponents
import { ChannelBlockGrid } from "../../../components/blockComponent/OvinoGridCell";
import Header from "../../../components/blockComponent/Header";
//utils
import { appSize, ovnioColors, scaleXiPhone15 } from "../../../utils/Variable";
//api
import {
  DeleteAllChannelUnblock,
  DeleteUnlockChannel,
  GetAllChannelParentalList,
  GetAllChannelUnblock,
  GetAllChannelsBlockedList,
  GetChannelParentalList,
  GetChannelUnblock,
} from "../../../api/GetRequest";
import CustomLoader from "../../../components/baseComponent/CustomLoader";
import { showAPIError } from "../../../api/Config";
import BtnApp from "../../../components/baseComponent/BtnApp";
import { useFocusEffect } from "@react-navigation/native";
import EmptyListComp from "../../../components/blockComponent/EmptyListComp";
import GlobalValue from "../../../api/GlobalVar";
//#endregion

//#region Main
export default function BlockAndParental({ navigation, route }) {
  const { isBlockedChannel } = route.params;
  console.log("\u001b[1;31mBAP.js : isBlockedChannel = ", isBlockedChannel);

  //#region useState
  const [arrBlock, setArrBlock] = useState([]);
  const [loader, setLoader] = useState(false);
  //#endregion

  //#region api
  useFocusEffect(
    useCallback(() => {
      if (isBlockedChannel) {
        GetChannelsBlocksListAPICall(setLoader, setArrBlock);
      } else {
        GetAllChannelParentalListAPICall(setLoader, setArrBlock);
      }
    }, [])
  );

  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onActionBtnPress = () => {
    if (arrBlock.length === 0) {
      return;
    }
    if (isBlockedChannel) {
      GetAllChannelUnblockAPICall(setLoader, setArrBlock);
    } else {
      navigation.navigate("Pin", {
        chObj: {
          chId: arrBlock[0]?.id,
          ispinned: true,
          pinType: 4,
        },
      });
    }
  };
  const onItemBtnPress = (item) => {
    if (isBlockedChannel) {
      GetChannelUnblockAPICall(setLoader, item.id, setArrBlock);
    } else {
      navigation.navigate("Pin", {
        chObj: {
          chId: item?.id,
          channel: item?.channel,
          channel_name: item?.name,
          ispinned: true,
          pinType: 3,
        },
      });
    }
  };
  const onUpdateParentalCtrlPinClick = () => {
    navigation.navigate("Pin", {
      chObj: {
        pinType: 5,
      },
    });
  };
  //#endregion

  //#region flatList render
  const renderFlatListRow = (props) => {
    return (
      <ChannelBlockGrid
        btnPress={(item) => onItemBtnPress(item)}
        item={props.item}
        type={isBlockedChannel ? 1 : 2}
      />
    );
  };
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? null : (
          <EmptyListComp
            title={
              isBlockedChannel
                ? "No channels blocked now!"
                : "No channels with parental control!"
            }
            desc={""}
          />
        )}
      </>
    );
  };
  //#endregion

  //#region JSX
  const HeaderTitle = () => {
    return isBlockedChannel
      ? TextStrings.blockedChannels
      : TextStrings.parentalChannels;
  };
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
  const BtmComp = () => {
    if (isBlockedChannel) {
      return null;
    } else {
      if (GlobalValue.pinSet) {
        return (
          <View style={{ bottom: 0, margin: scaleXiPhone15.sixteenH }}>
            <BtnApp
              onPress={onUpdateParentalCtrlPinClick}
              title="Change Pin"
              marginVertical={scaleXiPhone15.eightH}
            />
          </View>
        );
      } else {
        return null;
      }
    }
  };

  //#endregion

  return (
    <SafeAreaView backgroundColor={ovnioColors.background} flex={1}>
      <Header
        title={HeaderTitle()}
        actionText={isBlockedChannel ? "Unblock All" : "Unlock All"}
        onBackBtnPress={onBackBtnPress}
        onActionBtnPress={onActionBtnPress}
      />
      <LoaderComp />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ marginTop: scaleXiPhone15.sixteenH }}
        numColumns={3}
        horizontal={false}
        data={arrBlock}
        showsHorizontalScrollIndicator={false}
        renderItem={renderFlatListRow}
        ListEmptyComponent={renderFlatListEmpty}
      />
      <BtmComp />
    </SafeAreaView>
  );
}
//#endregion

//#region Api
//block channel
async function GetChannelsBlocksListAPICall(setLoader, setArrBlock) {
  setLoader(true);
  await GetAllChannelsBlockedList()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mBAP.js : Block list =  ",
        JSON.stringify(res.data)
      );
      setArrBlock(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      if (error.response.status === 400) {
        setArrBlock([]);
        return;
      }
      showAPIError(error, "BlockList Error");
    });
}
async function GetChannelUnblockAPICall(setLoader, chId, setArrBlock) {
  setLoader(true);
  await GetChannelUnblock(chId)
    .then((res) => {
      console.log(
        "\u001b[1;32mBAP.js : Res UnBlock  =  ",
        JSON.stringify(res.data)
      );
      GlobalValue.isChannelRefresh = true;
      GetChannelsBlocksListAPICall(setLoader, setArrBlock);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Unblock Error");
    });
}
async function GetAllChannelUnblockAPICall(setLoader, setArrBlock) {
  setLoader(true);
  await DeleteAllChannelUnblock()
    .then((res) => {
      console.log(
        "\u001b[1;32mBAP.js :Res All UnBlock  =  ",
        JSON.stringify(res.data)
      );
      GlobalValue.isChannelRefresh = true;
      GetChannelsBlocksListAPICall(setLoader, setArrBlock);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Unblock Error");
    });
}
//parental control
async function GetAllChannelParentalListAPICall(setLoader, setArrBlock) {
  setLoader(true);
  await GetAllChannelParentalList()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mBAP.js : Channel Parental List =  ",
        JSON.stringify(res.data)
      );
      setArrBlock(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      if (error.response.status === 400) {
        setArrBlock([]);
        return;
      }
      showAPIError(error, "Parental List Error");
    });
}

//#endregion
