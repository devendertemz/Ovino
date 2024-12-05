//#region import
import React, {useState} from 'react';
import {
  SafeAreaView,
  Switch,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';

//blockComponent
import Header from '../../../../components/blockComponent/Header';

import {NotificationViewRow} from '../../../../components/blockComponent/OvnioCustomRow.js';
//utils
import {ovnioColors, fonts, appSize} from '../../../../utils/Variable';
//#endregion
//package
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

//#region ProfileView
export default function Setting({navigation}) {
  const [isEnabled, setIsEnabled] = useState(false);

  const [arrSetting, setArrSetting] = useState([
    {
      id: 1,
      title: 'Notification',
      leftIcon: 'bell-outline',
    },
    {
      id: 2,
      title: 'Change Password',
      leftIcon: 'lock',
    },
    {
      id: 3,
      title: 'Blocked Channels',
      leftIcon: 'television-stop',
    },
    {
      id: 4,
      title: 'Parental Control',
      leftIcon: 'stop-circle-outline',
    },
  ]);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  const renderFlatListRow = props => {
    const onRowClicked = () => {
      if (props.item.id === 2) {
        navigation.navigate('ChangePassword');
      }
    };
    return (
      <TouchableOpacity onPress={onRowClicked}>
        <View style={styles.container}>
          <View style={styles.containerIcons}>
            {props.item.id === 2 ? (
              <Feather name={props.item.leftIcon} size={20} color="#999" />
            ) : (
              <MaterialCommunityIcons
                name={props.item.leftIcon}
                size={25}
                color={ovnioColors.grayIconColor}
              />
            )}
            <Text style={[styles.txtTitle]}>{props.item.title}</Text>
          </View>
          {props.item.id === 2 ? null : (
            <Switch
              trackColor={{
                false: ovnioColors.grayIconColor,
                true: ovnioColors.primaryRed,
              }}
              thumbColor={isEnabled ? ovnioColors.white : ovnioColors.grayDesc}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header
        title="Settings"
        onBackBtnPress={() => onBackBtnPress(navigation)}
      />
      <FlatList
        style={{padding: 16}}
        data={arrSetting}
        renderItem={renderFlatListRow}
        ItemSeparatorComponent={() => <View style={styles.containerSep} />}
      />
    </SafeAreaView>
  );
}
//#endregion

const styles = StyleSheet.create({
  container: {
    //paddingVertical: appSize.sixteen,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: appSize.eight,
    //backgroundColor: "red",
  },
  containerIcons: {
    alignItems: 'center',
    flexDirection: 'row',
    //backgroundColor: "green",
  },
  containerSep: {
    height: 0.5,
    backgroundColor: ovnioColors.grayIconColor,
  },
  txtTitle: {
    paddingLeft: 16,
    fontFamily: fonts.regular,
    fontSize: appSize.fourteen,
    color: ovnioColors.grayIconColor,
    lineHeight: 24,
  },
});

//#region Actions
const onBackBtnPress = navigation => {
  navigation.goBack();
};

//#endregion
