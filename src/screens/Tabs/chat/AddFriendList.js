//#region import
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, Alert } from "react-native";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
//blockComponent
import EmptyListComp from "../../../components/blockComponent/EmptyListComp.js";
import Header from "../../../components/blockComponent/Header";
import { AddFriendViewRow } from "../../../components/blockComponent/OvnioCustomRow.js";
import { OvinoChatSearchBar } from "../../../components/blockComponent/OvinoSearchBar";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../../utils/Variable.js";
import HeaderRightIcon from "../../../components/blockComponent/HeaderRightIcon.js";
import { UseDebounce } from "../../../api/Config.js";
//#endregion

//#region Main
export default function AddFriendList({ navigation }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [sch, setSearch] = useState("");
  const [arrAddFriendList, setArrAddFriendList] = useState([
    1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 21,
  ]);
  const debouncedSch = UseDebounce(sch.trim(), 900);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (debouncedSch.length > 0) {
      // setArrSchResult([1, 2, 3, 4, 5, 6, 7, 7, 8]);
    } else {
      //setArrSchResult([]);
    }
  }, [debouncedSch]);
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
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? null : (
          <EmptyListComp title={"No Friend List now!"} desc={""} />
        )}
      </>
    );
  };
  const renderFlatListRow = ({ item }) => {
    return <AddFriendViewRow item={item} />;
  };
  const FlatListHeader = () => {
    return (
      <View style={{ marginVertical: scaleXiPhone15.eightteenH }}>
        <OvinoChatSearchBar
          placeholder={"Search.."}
          icon="search"
          sch={sch}
          setSearch={setSearch}
        />
      </View>
    );
  };
  const FlatListFooter = () => {
    return <View style={{ height: scaleXiPhone15.fortyH }} />;
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header
        title="Add Friend"
        onBackBtnPress={() => onBackBtnPress(navigation)}
      />
      <LoaderComp />
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ paddingHorizontal: scaleXiPhone15.eightteenH }}
        data={arrAddFriendList}
        keyExtractor={(item) => item}
        ListEmptyComponent={renderFlatListEmpty}
        renderItem={renderFlatListRow}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListFooterComponent={() => <FlatListFooter />}
        ListHeaderComponent={() => <FlatListHeader />}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region Actions
const onBackBtnPress = (navigation) => {
  navigation.goBack();
};
//#endregion
