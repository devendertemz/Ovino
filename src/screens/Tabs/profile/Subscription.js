//#region import
import React from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";

//package
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";

//utils
import { ovnioColors, fonts, appSize } from "../../../utils/Variable";
import Header from "../../../components/blockComponent/Header";
//#endregion

//#region Subscription
export default function Subscription({ navigation }) {
  const onBackBtnPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header title="Subscription" onBackBtnPress={onBackBtnPress} />
      <View
        style={[styles.container, { backgroundColor: ovnioColors.primaryRed }]}
      >
        <View style={styles.containerSub}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.txtSub, { marginRight: appSize.eight }]}>
              Standard
            </Text>
            <MaterialCommunityIcons
              name={"information-outline"}
              size={22}
              color={"yellow"}
            />
          </View>

          <Text>
            <Text style={styles.txtSub}>$150</Text>
            <Text style={styles.txtEmail}>/month</Text>
          </Text>
        </View>
        <Text style={styles.txtDesc}>
          Watch on your laptop, TV, phone and tablet Unlimited films and TV
          programmes Cancel at any time Watch on your laptop, TV, phone and
          tablet Unlimited films and TV programmes Cancel at any time Watch on
          your laptop, TV, phone and tablet Unlimited films and TV programmes
          Cancel at any time Watch on your laptop, TV, phone and tablet
          Unlimited films and TV programmes Cancel at any time{" "}
        </Text>
      </View>

      <View
        style={[styles.container, { backgroundColor: ovnioColors.grayDot }]}
      >
        <View style={styles.containerSub}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name={"calendar-month"}
                size={22}
                color={ovnioColors.grayDesc}
              />
              <Text
                style={[
                  styles.txtEmail,
                  { marginLeft: appSize.eight, color: ovnioColors.grayDesc },
                ]}
              >
                Start From
              </Text>
            </View>
            <Text style={[styles.txtEmail, { margin: appSize.five }]}>
              11-30-2019
            </Text>
          </View>

          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name={"calendar-month"}
                size={22}
                color={ovnioColors.grayDesc}
              />
              <Text
                style={[
                  styles.txtEmail,
                  { marginLeft: appSize.eight, color: ovnioColors.grayDesc },
                ]}
              >
                Expire Date
              </Text>
            </View>

            <Text style={[styles.txtEmail, { margin: appSize.five }]}>
              11-30-2019
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.containerr}>
        <View style={styles.centered}>
          {/* Your content goes here */}
          <Text style={styles.txtSub}>36</Text>
          <Text style={[styles.txtEmail]}>Days Remaining</Text>
        </View>
      </View>

      <View
        style={{
          alignItems: "center",
          backgroundColor: ovnioColors.grayDesc,
        }}
      ></View>
    </SafeAreaView>
  );
}

//#endregion
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderRadius: 8,
    margin: appSize.eight,
  },

  txtEmail: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: "white",
  },
  txtDesc: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: ovnioColors.white,
    width: "70%",
    fontSize: appSize.twelve,
    lineHeight: appSize.twenty,
  },
  containerSub: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  txtSub: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: "white",
  },

  containerr: {
    marginTop: -35,
    flex: 1,
    alignItems: "center",
  },
  centered: {
    paddingHorizontal: appSize.eighteen,
    paddingVertical: appSize.five,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#818898",
    borderRadius: appSize.fifty,
    // width: '80%', // You can adjust the width as per your requirement
  },
});
//#endregion
