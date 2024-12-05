//#region import
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
//package
import Feather from "react-native-vector-icons/Feather";
//utils
import { ovnioColors, fonts, scaleXiPhone15 } from "../../utils/Variable";
import { stylesCommon } from "../../utils/CommonStyle";
//#endregion

const PasswordInputFieldwithLabel = ({
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
        styles.container,
        { marginBottom: marginBottom ? marginBottom : 0 },
      ]}
    >
      <Text style={styles.label}>{placeholder}</Text>
      <View style={styles.inputWrapper}>
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
            color={ovnioColors.white}
          />
        </TouchableOpacity>
      </View>
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
  },

  input: {
    flex: 1,
    ...stylesCommon.txtInput,
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    //backgroundColor: "green",
  },
  eyeIcon: {
    flex: 0.2,
    alignItems: "center",
    //backgroundColor: 'yellow',
  },
  label: {
    color: ovnioColors.white,
    fontFamily: fonts.medium,
    fontSize: scaleXiPhone15.fouteenH,
    lineHeight: scaleXiPhone15.twelveH,
    paddingVertical: scaleXiPhone15.eightH,
    // backgroundColor:"red"
  },
  container: {
    alignItems: "flex-start",
  },
});
export default PasswordInputFieldwithLabel;
