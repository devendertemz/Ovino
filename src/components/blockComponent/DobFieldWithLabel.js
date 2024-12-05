//#region import
import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  Text,
} from "react-native";
//package
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

//utils
import { fonts, ovnioColors, scaleXiPhone15 } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

//#region DobFieldWithLabel -  RegPrefrences.js | Reg.js | AddPost.js
const DobFieldWithLabel = ({
  label,
  placeholder,
  selicon,
  value,
  onPress,
  marginBottom,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          marginBottom: marginBottom ? marginBottom : 0,
          //backgroundColor: "pink",
        },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onPress} style={styles.inputWrapper}>
        <Text
          numberOfLines={1}
          style={[
            styles.input,
            {
              color: value
                ? ovnioColors.white
                : ovnioColors.grayLoopzInActiveColor,
            },
          ]}
        >
          {value ? value : placeholder}
        </Text>
        {/* <TextInput
          selectTextOnFocus={false}
          editable={false}
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          //backgroundColor={"blue"}
        />
 */}
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name={selicon}
            size={scaleXiPhone15.twentyFourH}
            color={ovnioColors.white}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scaleXiPhone15.fourH,
    borderWidth: scaleXiPhone15.twoH,
    backgroundColor: "#161616",
    borderColor: "#8E8E8E",
    //backgroundColor: "green",
  },

  input: {
    flex: 1,
    fontFamily: fonts.regular,

    fontSize: scaleXiPhone15.sixteenH,
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    // backgroundColor: "green",
  },
  container: {
    alignItems: "flex-start",
  },
  label: {
    color: ovnioColors.white,
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.fouteenH,
    lineHeight: scaleXiPhone15.twelveH,
    paddingVertical: scaleXiPhone15.eightH,
    // backgroundColor:"red"
  },
  icon: {
    flex: 0.2,
    alignItems: "center",
    //backgroundColor: "yellow",
  },
});
//#endregion

export default DobFieldWithLabel;
