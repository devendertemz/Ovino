//#region import
import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView } from "react-native";
const { height, width } = Dimensions.get("window");
import WebView from "react-native-webview";
//component
import Header from "../../../../components/blockComponent/Header";
import CustomLoader from "../../../../components/baseComponent/CustomLoader";
import { ovnioColors, scaleXiPhone15 } from "../../../../utils/Variable";
//api
import { GetAboutUs, GetPrivacyPolicy } from "../../../../api/GetRequest";
import { showAPIError } from "../../../../api/Config";
//#endregion

//#region Main
export default function WebPage({ navigation, route }) {
  const { id, title } = route.params?.item;
  const [loader, setLoader] = useState(false);
  const [html, setHtml] = useState({});

  useEffect(() => {
    if (id == 1) {
      GetAboutUsAPICall(setHtml, setLoader);
    } else {
      GetPrivacyPolicyAPICall(setHtml, setLoader);
    }
  }, []);

  const onBackBtnPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView flex={1} backgroundColor={ovnioColors.background}>
      <Header title={title} onBackBtnPress={onBackBtnPress} />
      {loader ? (
        <CustomLoader
          margin={scaleXiPhone15.eightteenH}
          isSmall={false}
          color={ovnioColors.primaryRed}
        />
      ) : null}
      <WebView
        style={{ backgroundColor: ovnioColors.background, marginTop: 16 }}
        scalesPageToFit={false}
        cacheEnabled={true}
        originWhitelist={["*"]}
        onLoadStart={() => setLoader(true)}
        onLoad={() => setLoader(false)}
        onLoadEnd={() => setLoader(false)}
        source={{ html: html }}
      />
    </SafeAreaView>
  );
}
//#endregion

//#region API
async function GetAboutUsAPICall(setHtml, setLoader) {
  setLoader(true);
  await GetAboutUs()
    .then((res) => {
      setLoader(false);
      const {
        data: { description },
      } = res.data;
      setHtml(description);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | About Us");
    });
}
async function GetPrivacyPolicyAPICall(setHtml, setLoader) {
  setLoader(true);
  await GetPrivacyPolicy()
    .then((res) => {
      setLoader(false);
      const {
        data: { description },
      } = res.data;
      setHtml(description);
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Privacy Policy");
    });
}
//#endregion
