//#region import
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
//package
import Feather from "react-native-vector-icons/Feather";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

const PasswordInputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  marginBottom,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      style={[
        styles.inputWrapper,
        { marginBottom: marginBottom ? marginBottom : 0 },
      ]}
    >
      <View style={styles.icon}>
        <Feather name="lock" size={scaleXiPhone15.twentyFourH} color="#999" />
      </View>
      <TextInput
        placeholderTextColor={ovnioColors.textSecondary}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        style={styles.eyeIcon}
      >
        <Feather
          name={showPassword ? "eye-off" : "eye"}
          size={scaleXiPhone15.twentyFourH}
          color="#999"
        />
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
    borderWidth: 1,
    backgroundColor: ovnioColors.blackInputBg,
    borderColor: ovnioColors.blackInputBorder,
  },
  icon: {
    flex: 0.15,
    alignItems: "center",
    //backgroundColor: 'yellow',
  },
  input: {
    flex: 0.75,
    ...stylesCommon.txtInput,
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    //backgroundColor: "green",
  },
  eyeIcon: {
    flex: 0.1,
    alignItems: "center",
    //backgroundColor: 'yellow',
  },
});
export default PasswordInputField;
