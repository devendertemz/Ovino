//#region import
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";

//blockComponent
import { TrendChannelRow } from "../../../components/blockComponent/OvinoGridCell";
import Header from "../../../components/blockComponent/Header";

//utils
import { appSize, ovnioColors, scaleXiPhone15 } from "../../../utils/Variable";
//#endregion

//#region Main
export default function TrendingChannels({ navigation }) {
  const renderFlatListRow = (props) => {
    return <TrendChannelRow />;
  };

  const onBackBtnPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background }} flex={1}>
      <Header
        title="Trending Channels"
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
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 7, 7, 7]}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => (item.id, index)}
        renderItem={renderFlatListRow}
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
