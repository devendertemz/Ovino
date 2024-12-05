//#region import
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, Alert } from "react-native";

//baseComponent
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
//blockComponent
import Header from "../../../components/blockComponent/Header";
import EmptyListComp from "../../../components/blockComponent/EmptyListComp";
import { ReminderRow } from "../../../components/blockComponent/OvnioCustomRow.js";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../../utils/Variable";
import TextStrings from "../../../utils/TextStrings.js";
import { getLocalStartEndTimeStampFromUTCStartDate } from "../../../utils/DateTimeUtil.js";
//api
import { showAPIError } from "../../../api/Config.js";
import {
  GetRemindersList,
  DeleteAllReminder,
} from "../../../api/GetRequest.js";
//#endregion

//#region Main
export default function Reminder({ navigation }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrReminder, setArrReminder] = useState([]);
  //#endregion

  //#region api
  useEffect(() => {
    GetReminderListAPiCall(setLoader, setArrReminder);
  }, []);
  //#endregion

  //#region actions
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onDelAllBtnPress = () => {
    const callBackfn = (item) => {
      console.log("callBackfn itme = ", item);
      if (item === 1) {
        DelAllRemindersAPiCall(setLoader, setArrReminder);
      }
    };
    showAlertForDelAll(callBackfn);
  };
  const onReminderClicked = (item) => {
    //navigation.navigate("ReminderAlert");
  };
  //#endregion

  //#region flalist render
  const renderFlatListRow = ({ item }) => {
    return <ReminderRow item={item} onClockPress={onReminderClicked} />;
  };
  const renderFlatListEmpty = () => {
    return (
      <>
        {loader ? null : (
          <EmptyListComp title={"No Reminder found"} desc={""} />
        )}
      </>
    );
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header
        title="Reminders"
        actionText={"Delete All"}
        onBackBtnPress={onBackBtnPress}
        onActionBtnPress={onDelAllBtnPress}
      />
      {loader ? (
        <CustomLoader
          padding={16}
          isSmall={false}
          color={ovnioColors.primaryRed}
        />
      ) : null}
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          padding: scaleXiPhone15.eightW,
          marginTop: scaleXiPhone15.eightH,
        }}
        data={arrReminder}
        renderItem={renderFlatListRow}
        ListEmptyComponent={renderFlatListEmpty}
        ItemSeparatorComponent={() => (
          <View style={{ height: scaleXiPhone15.eightW }} />
        )}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region Api
async function GetReminderListAPiCall(setLoader, setArrReminder) {
  setLoader(true);
  await GetRemindersList()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mR.js : Res reminder list = ",
        JSON.stringify(res.data.data.length)
      );
      for (ch of res.data.data) {
        const { time_start, time_end } =
          getLocalStartEndTimeStampFromUTCStartDate(ch.start_time, ch.duration);
        ch.time_start = time_start;
        ch.time_end = time_end;
      }
      setArrReminder(res.data.data);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Reminder List Error");
    });
}
async function DelAllRemindersAPiCall(setLoader, setArrReminder) {
  setLoader(true);
  await DeleteAllReminder()
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32mR.js : Res del reminder = ",
        JSON.stringify(res.data)
      );
      setArrReminder([]);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Delete All Reminder Error");
    });
}
//#endregion

//#region Alert
function showAlertForDelAll(callBackfn) {
  Alert.alert(
    TextStrings.delAllReminder,
    TextStrings.dellReminderConfirm,
    [
      {
        text: "Yes",
        onPress: () => callBackfn(1),
      },
      {
        text: "No",
        onPress: () => callBackfn(2),
      },
    ],
    { cancelable: true }
  );
}
//#endregion
