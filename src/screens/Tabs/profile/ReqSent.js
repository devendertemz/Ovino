//#region import
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList } from "react-native";
//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
//blockComponent
import EmptyListComp from "../../../components/blockComponent/EmptyListComp.js";
import Header from "../../../components/blockComponent/Header";
import { RequestRow } from "../../../components/blockComponent/OvnioCustomRow.js";
//utils
import { ovnioColors, scaleXiPhone15 } from "../../../utils/Variable";
//api
import { showAPIError } from "../../../api/Config.js";
import { GetSentReqList } from "../../../api/GetRequest.js";
//#endregion

//#region Main
export default function ReqSent({ navigation }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrReqSent, setArrReqSent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  //#endregion

  //#region api
  useEffect(() => {
    GetReqListApICall(currentPage, setTotalCount, setArrReqSent, setLoader);
  }, []);
  const fetchMoreData = () => {
    console.log(
      "Fetch More Data | arrReqSent.length : totalCount = " + arrReqSent.length,
      totalCount
    );
    if (loader || arrReqSent.length === 0) return;
    if (arrReqSent.length == totalCount) {
      console.log(
        "List End Reached no more call with totalCount = ",
        totalCount
      );
      return;
    }
    const nextPage = currentPage + 1;
    setCurrentPage(currentPage + 1);
    GetReqListApICall(nextPage, setTotalCount, setArrReqSent, setLoader);
  };
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
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
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? null : (
          <EmptyListComp
            ionIcons={"notifications"}
            title={"No Sent Request now!"}
            desc={""}
          />
        )}
      </>
    );
  };
  const renderFlatListRow = ({ item }) => {
    return <RequestRow item={item} type={2} />;
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header title="View all sent requests" onBackBtnPress={onBackBtnPress} />
      <FlatList
        style={{ padding: scaleXiPhone15.sixteenH }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={(item, index) => index.toString()}
        data={arrReqSent}
        renderItem={renderFlatListRow}
        ListEmptyComponent={renderFlatListEmpty}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListHeaderComponent={() => (
          <View style={{ height: scaleXiPhone15.tenH }} />
        )}
        ListFooterComponent={() => (
          <View style={{ height: scaleXiPhone15.fortyH }} />
        )}
        onEndReached={fetchMoreData}
      />
      <LoaderComp />
    </SafeAreaView>
  );
}

//#endregion

//#region API
async function GetReqListApICall(
  nextPage,
  setTotalCount,
  setArrReqSent,
  setLoader
) {
  setLoader(true);
  await GetSentReqList({ page: nextPage, count: 10 })
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mRS.js : Res | Sent Req List = ",
        JSON.stringify(res.data) //data.length
      );
      setTotalCount(res.data.recordsTotal);
      if (nextPage === 1) {
        setArrReqSent(res.data.data);
      } else {
        setArrReqSent((prevData) => [...prevData, ...res.data.data]);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Sent Request Error");
    });
}
//#endregion
