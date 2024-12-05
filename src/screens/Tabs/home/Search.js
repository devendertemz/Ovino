//#region import
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//blockComponent
import { OvinoHomeSearchBar } from "../../../components/blockComponent/OvinoSearchBar";
import {
  GridSearch,
  TrendChannelRow,
} from "../../../components/blockComponent/OvinoGridCell";
//utils
import {
  appSize,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../../utils/Variable";
//api
import { UseDebounce } from "../../../api/Config";
import { PostSearchChannels, PostSearchShows } from "../../../api/PostRequest";
import { showAPIError } from "../../../api/Config";
import { FreeChannelViewingCheck } from "../../../api/GlobalAPICall";
//#endregion

//#region Main
export default function Search({ navigation }) {
  //#region useState
  const [loaderChannel, setLoaderChannel] = useState(false);
  const [loaderShow, setLoaderShow] = useState(false);
  const [sch, setSearch] = useState("");
  const [arrChannel, setArrChannel] = useState([]);
  const [arrSchShow, setArrSearchShow] = useState([]);
  const debouncedSch = UseDebounce(sch.trim(), 900);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (debouncedSch.length > 0) {
      console.log("debouncedSch = ", debouncedSch);
      PostChannelLiveAPICall(debouncedSch, setArrChannel, setLoaderChannel);
      PostSearchLiveAPICall(debouncedSch, setArrSearchShow, setLoaderShow);
    } else {
      setArrChannel([]);
      setArrSearchShow([]);
    }
  }, [debouncedSch]);
  //#endregion

  //#region action
  const onCancelClick = () => {
    navigation.goBack();
  };
  const onTVChannelClick = (item) => {
    if (!FreeChannelViewingCheck(item.id, navigation)) return;
    const chDet = {
      id: item.id,
    };
    navigation.navigate("WatchAppStack", {
      screen: "HomeDetails",
      params: { ChannelDetails: chDet, navType: 6 },
    });
  };
  const onTVShowClick = (item) => {
    if (!FreeChannelViewingCheck(item.channel_id, navigation)) return;
    const chDet = {
      id: item.channel_id,
    };
    navigation.navigate("WatchAppStack", {
      screen: "HomeDetails",
      params: { ChannelDetails: chDet, navType: 6 },
    });
  };
  //#endregion

  //#region JSX
  const renderFlatListShowRow = ({ item }) => {
    return <GridSearch item={item} onPress={onTVShowClick} />;
  };
  const renderFlatListChannelRow = (props) => {
    return <TrendChannelRow item={props} onPress={onTVChannelClick} />;
  };
  const renderChannelFlatListSep = () => {
    return <View style={{ height: scaleXiPhone15.sixteenH }} />;
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background }} flex={1}>
      <OvinoHomeSearchBar
        placeholder={"Search"}
        sch={sch}
        setSearch={setSearch}
        onCancelClick={onCancelClick}
      />
      <ListHeader title={"Shows"} loader={loaderShow} />
      <FlatList
        style={{ backgroundColor: ovnioColors.background, flexGrow: 0 }}
        keyExtractor={(item, index) => index}
        horizontal={true}
        data={arrSchShow}
        showsHorizontalScrollIndicator={false}
        renderItem={renderFlatListShowRow}
      />
      <ListHeader title={"Channels"} loader={loaderChannel} />
      <FlatList
        style={{ backgroundColor: ovnioColors.background, flexGrow: 0 }}
        keyExtractor={(item, index) => index}
        horizontal={false}
        numColumns={3}
        data={arrChannel}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={renderChannelFlatListSep}
        renderItem={renderFlatListChannelRow}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region ListHeader
const ListHeader = ({ title, loader }) => {
  return loader ? (
    <CustomLoader
      padding={scaleXiPhone15.sixteenH}
      isSmall={true}
      color={ovnioColors.primaryRed}
    />
  ) : (
    <Text
      style={{
        fontFamily: fonts.medium,
        color: ovnioColors.grayDesc,
        fontSize: scaleXiPhone15.fouteenH,
        paddingHorizontal: scaleXiPhone15.eightteenH,
        paddingVertical: scaleXiPhone15.tenH,
        marginVertical: scaleXiPhone15.twentyH,
        backgroundColor: ovnioColors.blackInputBg,
      }}
    >
      {title}
    </Text>
  );
};
//#endregion

//#region API
async function PostChannelLiveAPICall(sch, setArrChannel, setLoader) {
  setLoader(true);
  const para = { key: sch, page: 1, count: 30 };
  await PostSearchChannels(para)
    .then((res) => {
      setLoader(false);
      const { data, msg } = res.data;
      console.log(
        "\u001b[1;32mS.js : Res sch channels = ",
        JSON.stringify(data.length)
      );
      setArrChannel(data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Channel Search");
    });
}
async function PostSearchLiveAPICall(sch, setArrSearch, setLoader) {
  setLoader(true);
  const para = { key: sch, page: 1, count: 30 };
  await PostSearchShows(para)
    .then((res) => {
      setLoader(false);
      const { data, msg } = res.data;
      console.log(
        "\u001b[1;32mS.js : Res sch sch = ",
        JSON.stringify(data.length)
      );
      setArrSearch(data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Show Search");
    });
}
//#endregion
