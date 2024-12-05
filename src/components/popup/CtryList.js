//#region import
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
//baseComponent
import RowSeparator from "../baseComponent/RowSep";
//utils
import TextStrings from "../../utils/TextStrings";
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../utils/Variable";
import { showMsgAlert } from "../../utils/Alert";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

//#region CtryListPopUp
const CtryListPopUp = (prop) => {
  //#region  useState
  const [sch, setSearch] = useState("");
  const [arrSchCtry, setCtrySchData] = useState([]);
  //#endregion

  // console.log("CtryListPopUp prop.arrCtry.length = ", prop.arrCtry?.length);

  //#region  actions
  const onChnageSearchTerm = (sch) => {
    const arrFilter = prop.arrCtry.filter((user) =>
      user.name.toLowerCase().search(sch.toLowerCase()) === -1 ? false : true
    );
    setCtrySchData(arrFilter);
    setSearch(sch);
  };
  //#endregion

  //#region JSX
  const onRenderFlalistRow = (props) => {
    const item = props.item;
    return (
      <TouchableOpacity onPress={() => prop.onClose(item)}>
        <CtryListRow item={item} />
      </TouchableOpacity>
    );
  };
  //#endregion

  return (
    <Modal animationType="fade" transparent={true} visible={prop.status}>
      <View style={styles.containerBg}>
        <View style={[styles.container]}>
          <HeaderInfo title={prop.title} onClose={prop.onClose} />
          <FlatList
            style={{
              paddingVertical: 8,
              backgroundColor: ovnioColors.white,
            }}
            keyExtractor={(item) => item.id}
            maxToRenderPerBatch={20}
            showsVerticalScrollIndicator={false}
            extraData={arrSchCtry}
            data={arrSchCtry.length === 0 ? prop.arrCtry : arrSchCtry}
            renderItem={onRenderFlalistRow}
            ItemSeparatorComponent={<RowSeparator />}
            ListHeaderComponentStyle={{
              paddingVertical: scaleXiPhone15.sixteenH,
              paddingHorizontal: scaleXiPhone15.fourW,
            }}
            ListHeaderComponent={
              <SearchBar
                editable={true}
                placeHolder={TextStrings.search}
                value={sch}
                keyboardType="numeric"
                onChangeText={onChnageSearchTerm}
              />
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerBg: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: ovnioColors.background,
  },
  container: {
    padding: scaleXiPhone15.sixteenW,
    height: "90%",
    backgroundColor: ovnioColors.white,
  },
});
//#endregion

//#region HeaderInfo
const HeaderInfo = (props) => {
  const onCloseClick = () => {
    props.onClose(null);
  };
  return (
    <View style={stylesH.containerHeader}>
      <Text style={stylesH.textHead}>{props.title}</Text>
      <TouchableOpacity onPress={onCloseClick}>
        <Fontisto
          name="close-a"
          size={scaleXiPhone15.twentyFourH}
          style={{
            color: ovnioColors.primaryRed,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
const stylesH = StyleSheet.create({
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "red",
  },
  textHead: {
    ...stylesCommon.titleWelcome,
    color: ovnioColors.primaryRed,
    textAlign: "left",
  },
});
//#endregion

//#region SearchBar
const SearchBar = (props) => {
  return (
    <View
      style={[
        stylesSearchBar.container,
        {
          backgroundColor: ovnioColors.white,
          borderWidth: 1,
          borderColor: ovnioColors.grayDesc,
        },
      ]}
    >
      <Fontisto
        name={"search"}
        color={ovnioColors.grayDesc}
        size={scaleXiPhone15.twentyH}
      />
      <TextInput
        style={stylesSearchBar.searchTxtInput}
        placeholder={props.placeHolder}
        editable={props.editable}
        placeholderTextColor={"#BCBFCF"}
        autoCapitalize="none"
        keyboardType="default"
        onChangeText={props.onChangeText}
        value={props.value}
      />
    </View>
  );
};
const stylesSearchBar = StyleSheet.create({
  container: {
    paddingLeft: scaleXiPhone15.sixteenW,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: scaleXiPhone15.twentyFourH,
    height: scaleXiPhone15.fivtyH,
  },
  searchTxtInput: {
    flex: 1,
    marginHorizontal: scaleXiPhone15.sixteenW,
    ...stylesCommon.txtInput,
    color: ovnioColors.background,

    //backgroundColor: "green",
  },
});
//#endregion

//#region CtryListRow
const CtryListRow = (props) => {
  const { item } = props;
  return (
    <View style={styleCtry.container}>
      <Text style={styleCtry.txt}>{item.name}</Text>
      <Text style={styleCtry.txt}>{"+" + item.dial_code}</Text>
    </View>
  );
};
const styleCtry = StyleSheet.create({
  container: {
    paddingVertical: scaleXiPhone15.eightH,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    //backgroundColor: "red",
  },
  txt: {
    ...stylesCommon.txtCtryName,
  },
});

//#endregion

export { CtryListPopUp };
