//#region import
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
const { height, width } = Dimensions.get("window");
//baseComponent
import BtnApp from "../../../../components/baseComponent/BtnApp";
//blockComponent
import Header from "../../../../components/blockComponent/Header";
import DobFieldWithLabel from "../../../../components/blockComponent/DobFieldWithLabel";
//utils
import { stylesCommon } from "../../../../utils/CommonStyle";
import { showCustomAlertWithMsg } from "../../../../utils/Alert";
import {
  APP_SCREEN,
  fonts,
  ovnioColors,
  scaleXiPhone15,
} from "../../../../utils/Variable";
//api
import { showAPIError } from "../../../../api/Config";
import { PostCreate, PostUploadMedia } from "../../../../api/PostRequest";
//#endregion

//#region Main
export default function AddPost({ navigation, route }) {
  const { mediaObj } = route.params ? route.params : false;
  console.log("AddPost.js mediaObj:--" + JSON.stringify(mediaObj));

  //#region useState
  const [loader, setLoader] = useState(false);
  const [isAllowCmnt, setisAllowCmnt] = useState(false); // State for checkbox
  const [desc, setDesc] = useState("");
  const [arrVisibility, setArrVisibility] = useState([
    { id: "1", name: "everyone" },
  ]);
  const [visibilityObj, setVisibilityObj] = useState({
    id: "1",
    name: "everyone",
  });
  useEffect(() => {
    if (route.params?.selItem?.id) {
      const { selItem, type } = route.params;
      console.log("type=" + type + "\n selItem=" + JSON.stringify(selItem));
      setVisibilityObj(selItem);
    }
  }, [route.params?.selItem, route.params?.type]);
  //#endregion

  //#region action
  const onBackBtnPress = () => {
    navigation.goBack();
  };
  const onShowDropDownClick = () => {
    return;
    navigation.navigate(APP_SCREEN.APP_SELECTMODAL, {
      type: 0,
      title: "Select",
      arrData: arrVisibility,
    });
  };
  const AddPostClick = () => {
    if (mediaObj.mediaType === 1) {
      showCustomAlertWithMsg(
        "Uploading a Image post in progress.....",
        navigation
      );
      return;
    }
    requriedData(
      mediaObj,
      desc,
      isAllowCmnt,
      visibilityObj,
      setLoader,
      navigation
    );
  };
  const onDiscardClick = () => {
    navigation.navigate("LoopzAppStack", {
      screen: APP_SCREEN.LOOPZ_HOME_TABBAR,
      params: {
        screen: "homeloopz",
      },
    });
  };
  //#endregion

  //JSX
  const CustomCheckboxWithText = () => {
    // Toggle the checkbox state
    const toggleCheckbox = () => {
      setisAllowCmnt(!isAllowCmnt);
    };

    return (
      <TouchableOpacity
        style={stylesCheckBox.container}
        onPress={toggleCheckbox}
      >
        {/* Custom Checkbox */}
        <View
          style={[
            stylesCheckBox.checkbox,
            isAllowCmnt && stylesCheckBox.checked,
          ]}
        />

        {/* Right-Aligned Text */}
        <Text style={stylesCheckBox.txt}>Allow users to comment</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    >
      <Header title="Create Post" onBackBtnPress={onBackBtnPress} />
      <View
        style={{
          padding: scaleXiPhone15.sixteenH,
          marginTop: scaleXiPhone15.twentyFourH,
        }}
      >
        <View style={styles.containerTxt}>
          <Text style={styles.txt}>
            {getFileNameWithExtension(mediaObj.path, false)}
          </Text>

          <Text style={styles.txt}>
            {mediaObj?.size ? getSizeInMB(mediaObj.size) : ""}
            {mediaObj?.duration ? getDurationInMin(mediaObj?.duration) : ""}
          </Text>
        </View>
        <Text style={[styles.txt, {}]}>Description</Text>
        <InputAndImage desc={desc} setDesc={setDesc} mediaObj={mediaObj} />
        <DobFieldWithLabel
          selicon="chevron-down"
          label="Who can watch this video"
          placeholder="Select visibility"
          value={visibilityObj?.name}
          onPress={onShowDropDownClick}
        />
        <CustomCheckboxWithText />
        <View style={{ paddingVertical: scaleXiPhone15.eightteenH }} />
        <BtnApp
          isAPICall={loader}
          title="Post"
          marginVertical={scaleXiPhone15.eightH}
          onPress={AddPostClick}
        />
        <Text onPress={onDiscardClick} style={styles.btnTxt}>
          Discard
        </Text>
      </View>
    </SafeAreaView>
  );
}
const InputAndImage = (props) => {
  const onEditCoverClick = () => {
    // chooseFromGallery()
  };
  return (
    <View style={stylesInputAndImage.container}>
      {/* Input Box (60% width) */}
      <TextInput
        style={stylesInputAndImage.input}
        placeholderTextColor={ovnioColors.textSecondary}
        placeholder="Enter description"
        multiline // To allow for multi-line input
        numberOfLines={4} // Specify how many lines you want to show
        textAlignVertical="top" // Align text to the top
        value={props.desc}
        onChangeText={props.setDesc}
        returnKeyType="done"
        blurOnSubmit={true}
      />

      {/* Image (40% width) */}
      <ImageBackground
        source={{
          uri:
            props.mediaObj?.mediaType == "1"
              ? props.mediaObj.path
              : props.mediaObj.thumbLink,
        }} // Placeholder image URL
        style={stylesInputAndImage.image}
        imageStyle={{ borderRadius: scaleXiPhone15.eightH }} // Apply borderRadius to image
      >
        {/*
            <TouchableOpacity
          style={stylesInputAndImage.bottomView}
          onPress={onEditCoverClick}>
          <Text style={[stylesInputAndImage.btnTxt]}>Edit Cover</Text>
        </TouchableOpacity>
            */}
      </ImageBackground>
    </View>
  );
};
//#endregion

//#region StyleSheet
const styles = StyleSheet.create({
  containerTxt: {
    flexDirection: "row", // Arrange children in a row
    justifyContent: "space-between", // Distribute space between the texts
    alignItems: "center", // Center vertically
    paddingVertical: scaleXiPhone15.eightteenH,
  },

  txt: {
    fontSize: scaleXiPhone15.fouteenH,
    fontFamily: fonts.medium,
    color: ovnioColors.white,
  },
  btnTxt: {
    paddingVertical: scaleXiPhone15.eightteenH,
    fontSize: scaleXiPhone15.sixteenH,
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    textAlign: "center",
  },
});
const stylesInputAndImage = StyleSheet.create({
  container: {
    flexDirection: "row", // Arrange children in a row
    alignItems: "flex-start", // Align items to the start
    paddingVertical: scaleXiPhone15.tenH,
  },
  input: {
    paddingVertical: scaleXiPhone15.sixteenH,
    paddingHorizontal: scaleXiPhone15.fouteenH,
    ...stylesCommon.txtInput,
    flex: 0.6, // 60% width for the input
    borderColor: ovnioColors.white,
    borderWidth: scaleXiPhone15.oneH,
    borderRadius: scaleXiPhone15.eightH,
    marginRight: scaleXiPhone15.tenH, // Add some space between input and image
    height: height / 4, // Set a fixed height for the image
  },
  image: {
    flex: 0.4, // 40% width for the image
    width: "100%", // Make the image responsive to the container
    height: height / 4, // Set a fixed height for the image
    resizeMode: "cover", // Adjust how the image is resized

    // backgroundColor:"red"
  },
  bottomView: {
    position: "absolute",
    bottom: scaleXiPhone15.eightH,

    alignSelf: "center",
    paddingHorizontal: scaleXiPhone15.fouteenH,
    paddingVertical: scaleXiPhone15.sixH,
    borderRadius: scaleXiPhone15.eightH,
    backgroundColor: ovnioColors.primaryRed,
  },

  btnTxt: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.bold,
    color: "#000000",
  },
});
const stylesCheckBox = StyleSheet.create({
  container: {
    flexDirection: "row", // Arrange checkbox and text in a row
    alignItems: "center", // Align items vertically centered
    paddingVertical: scaleXiPhone15.eightteenH,
  },
  checkbox: {
    width: 20, // Width of the checkbox
    height: 20, // Height of the checkbox
    borderWidth: 2, // Border width
    borderColor: "#ccc", // Border color
    borderRadius: 4, // Rounded corners
    marginRight: 10, // Space between checkbox and text
  },
  checked: {
    backgroundColor: ovnioColors.primaryRed, // Background color when checked
  },
  txt: {
    fontSize: scaleXiPhone15.fouteenH,
    fontFamily: fonts.medium,
    color: ovnioColors.white,
  },
});
//#endregion

//#region API
async function requriedData(
  mediaObj,
  desc,
  isAllowCmnt,
  visibilityObj,
  setLoader,
  navigation
) {
  //#region Validation
  if (desc.trim().length == 0) {
    showCustomAlertWithMsg("enter description", navigation);
    return;
  } else if (!visibilityObj?.id) {
    showCustomAlertWithMsg("Please select visibility ", navigation);
    return;
  }

  const createPostBody = {
    description: desc,
    visibility: "everyone",
    allow_comments: isAllowCmnt,
  };

  if (mediaObj.mediaType === 2) {
    uploadVideoPostAPICall(
      mediaObj,
      createPostBody,
      setLoader,
      navigation,
      true
    );
  } else {
    console.log("Uploading a Image post in progress.....");
  }

  //#endregion
}

async function uploadVideoPostAPICall(
  mediaObj,
  createPostBody,
  setLoader,
  navigation,
  isVideo
) {
  const para = {
    _t: "post",
    _m: isVideo ? "media" : "image",
  };

  let formData = new FormData();
  formData.append("file", {
    uri: isVideo ? mediaObj.path : mediaObj.thumbLink,
    name: getFileNameWithExtension(
      isVideo
        ? mediaObj.path
        : mediaObj.thumbLink + "." + mediaObj.thumbMime.split("/")[1],
      true
    ),
    type: isVideo ? mediaObj.mime : mediaObj.thumbMime,
  });
  // return;
  setLoader(true);
  await PostUploadMedia(para, formData)
    .then((res) => {
      // setLoader(false);
      console.log(
        "\u001b[1;32AD.js : ",
        isVideo ? "Video uploaded" : "Image uploaded"
      );
      console.log(
        "\u001b[1;32AD.js : Res Post upload ",
        JSON.stringify(res.data)
      );
      if (isVideo) {
        createPostBody.file_name = res.data.data;
        uploadVideoPostAPICall(
          mediaObj,
          createPostBody,
          setLoader,
          navigation,
          false
        );
      } else {
        console.log("\u001b[1;32AD.js Both uploaded");

        createPostBody.cover_image_url = res.data.data;
        postCreateAPICall(createPostBody, setLoader, navigation);
      }
    })
    .catch((error) => {
      console.log(
        "\u001b[1;32AD.js : error ",
        isVideo ? "Video uploaded" : "Image uploaded" + JSON.stringify(error)
      );
      setLoader(false);
      showAPIError(error, "upload Error");
    });
}
async function postCreateAPICall(createPostBody, setLoader, navigation) {
  await PostCreate(createPostBody)
    .then((res) => {
      setLoader(false);
      console.log(
        "\u001b[1;32AD.js : Res Post Create ",
        JSON.stringify(res.data)
      );
      navigation.navigate("LoopzAppStack", {
        screen: APP_SCREEN.LOOPZ_HOME_TABBAR,
        params: {
          screen: "profileloopz",
        },
      });
      navigation.navigate(APP_SCREEN.LOOPZ_TOAST_MSG, {
        btnTitle: "Your video has been successfully uploaded !!",
      });
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "create Post Error");
    });
}

//#endregion

//#region Helpper
const getFileNameWithExtension = (uri, isFull) => {
  // Get the file name with extension
  const fileNameWithExtension = uri.split("/").pop() || "";
  if (isFull) {
    return fileNameWithExtension;
  } else {
    // If the file name with extension is longer than 10 characters
    return fileNameWithExtension.length > 10
      ? ".." + fileNameWithExtension.slice(-10) // Take last 10 characters and prepend with '..'
      : fileNameWithExtension; // Otherwise return the full name
  }
};

const getSizeInMB = (size) => {
  const sizeInMB = size / (1024 * 1024); // Convert bytes to MB

  return "Size: " + sizeInMB.toFixed(2) + "MB";
};
const getDurationInMin = (duration) => {
  const durationInMin = duration / 60;

  return " Duration: " + durationInMin.toFixed(2) + "m";
};

//#endregion
