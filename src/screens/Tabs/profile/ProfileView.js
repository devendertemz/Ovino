//#region import
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList } from "react-native";

//blockComponent
import Header from "../../../components/blockComponent/Header";

import { ProfileViewRow } from "../../../components/blockComponent/OvnioCustomRow.js";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../../utils/Variable";
import { GetUserProfile } from "../../../api/GetRequest.js";
import { showAPIError } from "../../../api/Config.js";
import CustomLoader from "../../../components/baseComponent/CustomLoader.js";
import { convertToCustomFormat } from "../../../utils/DateTimeUtil.js";
import { convertDateToDisplayFormat } from "../../../utils/DateTimeUtil.js";
//#endregion

//#region Main
export default function ProfileView({ navigation }) {
  //#region useState
  const [arrProfile, setArrProfile] = useState([]);
  const [loader, setLoader] = useState(false);
  //#endregion

  //#region api
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      GetUserProfileAPICall(setArrProfile, setLoader);
    });
    return unsubscribe;
  }, [navigation]);
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
  const renderFlatListRow = ({ item }) => {
    return <ProfileViewRow item={item} />;
  };
  //#endregion

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header
        title="Profile"
        actionText={"Edit Profile"}
        onBackBtnPress={() => onBackBtnPress(navigation)}
        onActionBtnPress={() => onEditBtnPress(navigation)}
      />
      <LoaderComp />
      <FlatList
        style={{ padding: 16 }}
        data={arrProfile}
        ListFooterComponent={() => (
          <View style={{ height: scaleXiPhone15.fortyH }} />
        )}
        renderItem={renderFlatListRow}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region Actions
const onBackBtnPress = (navigation) => {
  navigation.goBack();
};
const onEditBtnPress = (navigation) => {
  navigation.navigate("ProfileEdit");
};
//#endregion

//#region Api
async function GetUserProfileAPICall(setArrProfile, setLoader) {
  setLoader(true);
  await GetUserProfile()
    .then((res) => {
      setLoader(false);
      console.log("\u001b[1;32mPV.js: RES  = ", JSON.stringify(res.data));
      const user = res.data.user;
      console.log("\u001b[1;32mPV.js: user  = ", JSON.stringify(user));
      const arrProf = [
        {
          id: 1,
          title: "Name",
          value: user.name ? user.name : user.first_name,
          icon: "users",
        },
        {
          id: 2,
          title: "Username",
          value: user.username ? user.username : user.username,
          icon: "user",
        },
        {
          id: 3,
          title: "Email Address",
          value: user.email_id,
          icon: "email-outline",
        },
        {
          id: 5,
          title: "Birth Date",
          value:
            user.dob != null
              ? convertDateToDisplayFormat(new Date(user.dob))
              : "",
          icon: "calendar-today",
        },
        {
          id: 6,
          title: "Country",
          value: user.country_name ? user.country_name : "",
          icon: "flag",
        },
        {
          id: 10,
          title: "Created",
          value: convertToCustomFormat(user.created_at),
          icon: "clock-time-eight-outline",
        },
        {
          id: 11,
          title: "Updated",
          value: convertToCustomFormat(user.updated_at),
          icon: "clock-time-one-outline",
        },
      ];
      setArrProfile(arrProf);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Get User Profile");
    });
}
//#endregion
