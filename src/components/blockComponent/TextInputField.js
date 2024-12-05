//#region import
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
//package
import Feather from "react-native-vector-icons/Feather";
//utils
import { ovnioColors, scaleXiPhone15 } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

//#region TextInputField - login.js | reg.js
const TextInputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  marginBottom,
}) => {
  return (
    <View
      style={[
        styles.inputWrapper,
        { marginBottom: marginBottom ? marginBottom : 0 },
      ]}
    >
      <View style={styles.icon}>
        <Feather name={icon} size={scaleXiPhone15.twentyFourH} color="#999" />
      </View>
      <TextInput
        allowFontScaling={false}
        numberOfLines={1}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
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
    backgroundColor: ovnioColors.blackInputBg,
    borderColor: ovnioColors.blackInputBorder,
  },
  icon: {
    flex: 0.15,
    alignItems: "center",
    //backgroundColor: "yellow",
  },
  input: {
    flex: 0.85,
    ...stylesCommon.txtInput,
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    //backgroundColor: "green",
  },
});
//#endregion

export default TextInputField;
