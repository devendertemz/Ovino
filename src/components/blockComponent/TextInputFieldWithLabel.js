//#region import
import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
//utils
import { fonts, ovnioColors, scaleXiPhone15 } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

//#region TextInputFieldWithLabel - login.js | reg.js
const TextInputFieldWithLabel = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  marginBottom,
}) => {
  return (
    <View
      style={[
        styles.container,
        { marginBottom: marginBottom ? marginBottom : 0 },
      ]}
    >
      <Text style={styles.label}>{placeholder}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#979797"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scaleXiPhone15.fourH,
    borderWidth: scaleXiPhone15.twoH,
    backgroundColor: "#161616",
    borderColor: "#8E8E8E",
  },

  input: {
    flex: 1,
    ...stylesCommon.txtInput,
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    //backgroundColor: "green",
  },
  label: {
    color: ovnioColors.white,
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.fouteenH,
    lineHeight: scaleXiPhone15.twelveH,
    paddingVertical: scaleXiPhone15.eightH,
    // backgroundColor:"red"
  },
});
//#endregion

export default TextInputFieldWithLabel;
