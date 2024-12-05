//#region import
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";

//baseComponent
import BtnApp from "../../../components/baseComponent/BtnApp";
import CustomLoader from "../../../components/baseComponent/CustomLoader";
//blockComponent
import Header from "../../../components/blockComponent/Header";
import EmptyListComp from "../../../components/blockComponent/EmptyListComp";

//utils
import TextStrings from "../../../utils/TextStrings";
import Validation from "../../../utils/Validation";
import {
  convertUTCDateTimeStampToDate,
  convertToCustomFormat,
} from "../../../utils/DateTimeUtil";
import { showMsgAlert, showCustomAlertWithMsg } from "../../../utils/Alert";
import {
  ovnioColors,
  fonts,
  appSize,
  scaleXiPhone15,
} from "../../../utils/Variable";

//api
import { GetReferredUsersList } from "../../../api/GetRequest";
import { showAPIError } from "../../../api/Config";

//asset
const referral = require("../../../assets/icon/profile/referral/referral.png");
//#endregion

//#region Main
export default function ReferralInsights({ navigation }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrRef, setArrRef] = useState([]);
  const [totalAmt, setTotalAmt] = useState("");
  //#endregion

  //#region api
  useEffect(() => {
    GetReferredUsersListAPICall(setArrRef, setTotalAmt, setLoader);
  }, []);
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  //#endregion

  //#region JSX
  const renderFlatListRow = ({ item }) => {
    return <ReferralRow item={item} />;
  };
  const renderFlatListHeader = () => {
    if (arrRef.length === 0) {
      return null;
    } else {
      return (
        <View style={styles.conatinerHeader}>
          <Text style={styles.txtTitle}>Total Amount Earned</Text>
          <Text style={styles.txtPoints}> {`$  ${totalAmt}`}</Text>
        </View>
      );
    }
  };
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? (
          <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
        ) : (
          <EmptyListComp title={"No Referral Insights"} desc={""} />
        )}
      </>
    );
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background, flex: 1 }}>
      <Header title="Referral Insights" onBackBtnPress={onBackBtnPress} />
      <FlatList
        style={{ marginTop: scaleXiPhone15.sixteenH }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.id.toString()}
        data={arrRef}
        renderItem={renderFlatListRow}
        ListHeaderComponent={renderFlatListHeader}
        ListEmptyComponent={renderFlatListEmpty}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  conatinerHeader: {
    padding: scaleXiPhone15.sixteenH,
    alignItems: "center",
    gap: scaleXiPhone15.tenH,
  },
  txtTitle: {
    fontSize: scaleXiPhone15.twentyFourH,
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    textAlign: "center",
  },
  txtPoints: {
    fontSize: scaleXiPhone15.twentyH,
    fontFamily: fonts.bold,
    color: ovnioColors.primaryRed,
    textAlign: "center",
  },
});
//#endregion

//#region ReferralRow
const ReferralRow = ({ item }) => {
  const ReferralItem = ({ title, value }) => {
    return (
      <View style={stylesRR.conatinerRefItem}>
        <Text style={stylesRR.txtTitle}>{title}</Text>
        <Text style={stylesRR.txtTitle}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={stylesRR.conatiner}>
      <ReferralItem title={"Referral ID"} value={item.id} />
      <ReferralItem
        title={"Referral Name"}
        value={item.referred_user.first_name}
      />
      <ReferralItem
        title={"Date of Signup"}
        value={convertUTCDateTimeStampToDate(item.created_at)}
      />
      <ReferralItem
        title={"Subscription Status"}
        value={item.is_subscription_active ? "Completed" : "Pending"}
      />
      <ReferralItem
        title={"Rewards Earned"}
        value={`$ ${item.referral_amount}`}
      />
    </View>
  );
};
const stylesRR = StyleSheet.create({
  conatiner: {
    paddingHorizontal: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.eightH,
    gap: scaleXiPhone15.twoH,
  },
  conatinerRefItem: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: scaleXiPhone15.sixteenH,
    backgroundColor: "black",
  },
  txtTitle: {
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
  },
});

//#endregion

//#region API
async function GetReferredUsersListAPICall(setArrRef, setTotalAmt, setLoader) {
  setLoader(true);
  await GetReferredUsersList({ page: 1, count: 20 })
    .then((res) => {
      setLoader(false);
      const { data, status, msg, total_amount } = res.data;
      console.log(
        "\u001b[1;32mRI.j : Res referral list = ",
        JSON.stringify(data.length, null, 4)
      );
      setTotalAmt(total_amount);
      setArrRef(data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Referral List");
    });
}
//#endregion
