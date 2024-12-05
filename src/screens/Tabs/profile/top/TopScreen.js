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
import BtnApp from "../../../../components/baseComponent/BtnApp";
import CustomLoader from "../../../../components/baseComponent/CustomLoader";
//blockComponent
import Header from "../../../../components/blockComponent/Header";
import EmptyListComp from "../../../../components/blockComponent/EmptyListComp";
import { TopRow } from "../../../../components/blockComponent/OvnioCustomRow";

//utils
import TextStrings from "../../../../utils/TextStrings";
import Validation from "../../../../utils/Validation";
import { showMsgAlert, showCustomAlertWithMsg } from "../../../../utils/Alert";
import {
  ovnioColors,
  fonts,
  appSize,
  scaleXiPhone15,
} from "../../../../utils/Variable";

//api
import { PostTop8MarkUnmark } from "../../../../api/PostRequest";
import { GetTop8Users } from "../../../../api/GetRequest";
import { showAPIError } from "../../../../api/Config";
//#endregion

//#region Main
export default function TopScreen({ navigation }) {
  //#region useState
  const [loader, setLoader] = useState(false);
  const [arrUser, setArrUser] = useState([]);
  //#endregion

  //#region api
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      GetTop8UsersAPICall(setArrUser, setLoader);
    });
    return unsubscribe;
  }, [navigation]);

  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onAddFavClick = () => {
    const arrTmp = arrUser.map(function (item) {
      return item.userId;
    });
    navigation.navigate("WatchAppStack", {
      screen: "AddTop",
      params: { users: arrTmp.join() },
    });
  };
  const onRemoveClick = (item) => {
    const arrUpdate = arrUser.filter(
      (itemTmp) => itemTmp.userId !== item.userId
    );
    setArrUser(arrUpdate);
    PostTop8UnMarkAPICall(item.userId);
  };
  //#endregion

  //#region JSX
  const renderFlatListRow = ({ item }) => {
    return <TopRow type={1} item={item} onBtnClick={onRemoveClick} />;
  };
  const renderFlatListEmpty = () => {
    return (
      <View style={styles.containerEmpty}>
        {loader ? null : (
          <>
            <Text style={styles.txtTitle}>You have no users in your Top8.</Text>
            <BtnApp
              title="Add your Favorites !"
              marginVertical={scaleXiPhone15.eightH}
              onPress={onAddFavClick}
            />
          </>
        )}
      </View>
    );
  };
  const renderFlatListSep = () => {
    return <View style={{ height: scaleXiPhone15.eightH }} />;
  };
  const RenderFlatListFooter = () => {
    return (
      <View style={{ padding: scaleXiPhone15.sixteenH }}>
        {loader ? (
          <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
        ) : arrUser.length >= 8 || arrUser.length == 0 ? null : (
          <BtnApp title="Select Top 8" onPress={onAddFavClick} />
        )}
      </View>
    );
  };
  //#endregion

  return (
    <SafeAreaView style={{ backgroundColor: ovnioColors.background, flex: 1 }}>
      <Header title="Top 8" onBackBtnPress={onBackBtnPress} />
      <FlatList
        style={styles.containerList}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.id.toString()}
        data={arrUser}
        renderItem={renderFlatListRow}
        ItemSeparatorComponent={renderFlatListSep}
        ListEmptyComponent={renderFlatListEmpty}
      />
      <RenderFlatListFooter />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  containerList: {
    backgroundColor: ovnioColors.background,
    marginTop: scaleXiPhone15.sixteenH,
  },
  containerEmpty: {
    flex: 1,
    paddingHorizontal: scaleXiPhone15.sixteenH,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  txtTitle: {
    fontSize: scaleXiPhone15.twentyH,
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    textAlign: "center",
  },
});
//#endregion

//#region API
async function GetTop8UsersAPICall(setArrUser, setLoader) {
  setLoader(true);
  await GetTop8Users()
    .then((res) => {
      setLoader(false);
      const { data, status, msg } = res.data;
      console.log(
        "\u001b[1;32mTS.j : Res Top8 list = ",
        JSON.stringify(data.length, null, 4)
      );
      const arrTmp = [];
      for (userItem of data) {
        const { id, to_user } = userItem;
        const item = {
          id: id,
          userId: to_user.id,
          name: to_user.first_name,
          email: to_user.email,
          profile_pic: to_user.profile_pic,
          username: to_user.username,
        };
        arrTmp.push(item);
      }
      setArrUser(arrTmp);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Top 8 List");
    });
}
async function PostTop8UnMarkAPICall(user_id) {
  await PostTop8MarkUnmark({ user_id: user_id })
    .then((res) => {
      const { data, status, msg } = res.data;
      console.log(
        "\u001b[1;32mTS.j : Res Top8 Unmark = ",
        JSON.stringify(msg, null, 4)
      );
    })
    .catch((error) => {
      showAPIError(error, "Error | Top 8 Unmark");
    });
}
//#endregion
