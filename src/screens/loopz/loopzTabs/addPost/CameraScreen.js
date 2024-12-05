//#region import
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
//package
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import ImagePicker from "react-native-image-crop-picker";
import { createThumbnail } from "react-native-create-thumbnail";
//local
import CustomLoader from "../../../../components/baseComponent/CustomLoader";
import GlobalValue from "../../../../api/GlobalVar";
import { fonts, ovnioColors, scaleXiPhone15 } from "../../../../utils/Variable";
import {
  requestCameraPermission,
  requestMicrophonePermission,
  showAPIError,
} from "../../../../api/Config";

//#endregion

//#region Main
export default function CameraScreen({ navigation, route }) {
  //#region camera set up
  const camera = useRef(null);

  const backCameraMove = useCameraDevice("back"); // Fetches back camera
  const frontCameraMove = useCameraDevice("front"); // Fetches front camera

  const isFocused = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [videoRecordOn, setVideoRecordOn] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      async function getPermission() {
        const permReq = await requestPermission();
        console.log("permReq = ", permReq);
        if (!permReq) await Linking.openSettings();
      }
      getPermission();
    }
  }, [hasPermission]);
  console.log("hasPermission = ", hasPermission);
  if (!hasPermission) return <PermissionsPageComp />;
  if (backCameraMove == null) return <NoCameraDeviceComp />;
  //#endregion

  //#region action
  const onCrossIconClick = () => {
    navigation.goBack();
  };
  const onTakePhotoClicked = async () => {
    if (camera != null) {
      if (videoRecordOn) {
        setVideoRecordOn(false);
        await camera.current.stopRecording();
      } else {
        const photo = await camera.current.takePhoto({});
        CreateMediaObj(photo, true, navigation);
      }
    }
  };
  const onLongPressStartVideo = async () => {
    if (camera != null && videoRecordOn === false) {
      setVideoRecordOn(true);
      await camera.current.startRecording({
        fileType: "mp4",
        onRecordingFinished: (video) => {
          CreateMediaObj(video, false, navigation);
        },
        onRecordingError: (error) => {
          showAPIError("Error", error.message);
        },
      });
    }
  };
  const chooseFromGallery = () => {
    ImagePicker.openPicker({
      multiple: false,
      width: 200,
      height: 200,
    })
      .then(async (obj) => {
        console.log("Gallery Obj" + JSON.stringify(obj));
        if (obj?.duration) {
          obj.duration = Math.floor(obj.duration / 1000); // Convert to seconds;
          CreateMediaObj(obj, false, navigation);
        } else {
          CreateMediaObj(obj, true, navigation);
        }
      })
      .catch((error) => {
        console.log(
          "\u001b[1;31mP.js : Error | Device gallery = ",
          JSON.stringify(error.message)
        );
      });
  };
  //#endregion

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    >
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={frontCamera ? frontCameraMove : backCameraMove}
        isActive={isFocused}
        photo
        video={true}
      />
      <HeaderComp onCrossClick={onCrossIconClick} />
      <View style={styles.containerFooter}>
        <CameraButton
          videoRecordOn={videoRecordOn}
          onTakePhotoClicked={onTakePhotoClicked}
          onLongPressStartVideo={onLongPressStartVideo}
        />
        <CameraFooter
          setFrontCamera={setFrontCamera}
          chooseFromGallery={chooseFromGallery}
        />
      </View>
    </SafeAreaView>
  );
}
const PermissionsPageComp = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomLoader color={ovnioColors.primaryRed} />
      </View>
    </SafeAreaView>
  );
};
const NoCameraDeviceComp = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: ovnioColors.white, textAlign: "center" }}>
          No camera device found
        </Text>
      </View>
    </SafeAreaView>
  );
};
const HeaderComp = (prop) => {
  return (
    <TouchableOpacity style={styles.containerHead} onPress={prop.onCrossClick}>
      <Feather
        name="x-circle"
        size={scaleXiPhone15.twentyEightH}
        color={ovnioColors.white}
      />
    </TouchableOpacity>
  );
};
const CameraButton = (prop) => {
  return (
    <TouchableOpacity
      onPress={prop.onTakePhotoClicked}
      onLongPress={prop.onLongPressStartVideo}
      style={[
        stylesFooter.cameraCntr,
        {
          backgroundColor: prop.videoRecordOn ? "red" : ovnioColors.primaryRed,
        },
      ]}
    ></TouchableOpacity>
  );
};
const CameraFooter = (prop) => {
  return (
    <View style={stylesFooter.footerCntr}>
      <IconWithBg
        iconName="images"
        onPress={prop.chooseFromGallery}
        title={"Gallery"}
      />
      <View style={stylesFooter.textContainer}>
        <Text style={[stylesFooter.iconText, { color: ovnioColors.white }]}>
          Camera
        </Text>
        <View style={stylesFooter.underline} />
      </View>
      <IconWithBg
        iconName="camera-reverse"
        onPress={() => prop.setFrontCamera((prevState) => !prevState)}
      />
    </View>
  );
};
const IconWithBg = (props) => {
  return (
    <View style={{ flexDirection: "column" }}>
      <TouchableOpacity onPress={props.onPress} style={stylesFooter.iconCtnr}>
        <Ionicons
          name={props.iconName}
          size={scaleXiPhone15.twentyEightH}
          color={ovnioColors.white}
        />
      </TouchableOpacity>
      {props.title ? (
        <Text
          style={[stylesFooter.iconText, { marginTop: scaleXiPhone15.eightH }]}
        >
          {props.title}
        </Text>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  containerHead: {
    marginLeft: scaleXiPhone15.sixteenH,
    top: GlobalValue.btmSafeArearHt + 24,
    position: "absolute",
    //backgroundColor: "red",
  },
  containerFooter: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: scaleXiPhone15.eightteenH,
    bottom: scaleXiPhone15.twentyEightH,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "red",
  },
});
const stylesFooter = StyleSheet.create({
  footerCntr: {
    marginTop: scaleXiPhone15.eightH,
    flexDirection: "row",
    justifyContent: "space-between",
    //backgroundColor: "blue",
  },
  iconText: {
    fontSize: scaleXiPhone15.fouteenH,
    fontWeight: "800",
    fontFamily: fonts.heavy,
    color: "#B3B3B3",
    textAlign: "center",
  },

  textContainer: {
    flex: 1,
    alignItems: "center",
    //backgroundColor: "green",
  },
  underline: {
    height: scaleXiPhone15.twoH, // Underline thickness (2px)
    backgroundColor: ovnioColors.primaryRed,
    width: "18%", // Underline width matches the text width automatically
    marginTop: scaleXiPhone15.threeH, // Space between the text and underline
  },

  iconCtnr: {
    alignItems: "center",
    justifyContent: "center",

    width: scaleXiPhone15.fivtyH,
    height: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.eightH,

    backgroundColor: "#695C41",
  },
  cameraCntr: {
    width: scaleXiPhone15.seventyH,
    height: scaleXiPhone15.seventyH,
    borderRadius: scaleXiPhone15.seventyH / 2,
    borderColor: "#695C41",
    borderWidth: scaleXiPhone15.eightH,
    alignItems: "center",
    justifyContent: "center",
  },
});
//#endregion

//#region Media Processing
const CreateMediaObj = (fileObj, isPhoto, navigation) => {
  //console.log("CreateMediaObj fileObj = ", JSON.stringify(fileObj));

  const mediaObj = {
    path: getImagePath(fileObj.path),
    mime: fileObj?.mime ? fileObj.mime : getFileMime(fileObj, isPhoto),
    size: fileObj.size,
    height: fileObj.height,
    width: fileObj.width,
    mediaType: isPhoto ? 1 : 2,
  };
  if (fileObj?.duration) {
    mediaObj.duration = fileObj.duration;
  }

  if (!isPhoto) {
    CreateVideoThumbnail(mediaObj, navigation);
  } else {
    //console.log("CreateMediaObj mediaObj = ", JSON.stringify(mediaObj));
    navigation.navigate("CapturedPreview", { mediaObj: mediaObj });
  }
};
const getImagePath = (imgPath) => {
  if (imgPath) {
    if (imgPath.startsWith("file://")) {
      return imgPath;
    } else {
      return "file://" + imgPath;
    }
  } else {
    return null;
  }
};
const getFileMime = (fileObj, isPhoto) => {
  const filename = fileObj.path.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const mutimediaType = isPhoto ? "image" : "video";
  const mime = match ? `${mutimediaType}/${match[1]}` : mutimediaType;
  return mime;
};
const CreateVideoThumbnail = (mediaObj, navigation) => {
  createThumbnail({
    url: mediaObj.path,
    timeStamp: 0,
  })
    .then((response) => {
      mediaObj.thumbLink = response.path;
      mediaObj.thumbMime = response.mime;
      console.log(
        "CreateVideoThumbnail mediaObj = " + JSON.stringify(mediaObj)
      );
      navigation.navigate("CapturedPreview", { mediaObj: mediaObj });
    })
    .catch((err) => showAPIError("Error", err.message));
};
//#endregion
