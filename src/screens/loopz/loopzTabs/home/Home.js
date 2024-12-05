//#region import
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
const { height, width } = Dimensions.get("window");
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EventRegister } from "react-native-event-listeners";
//3rd party
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";
//baseComponent
import { SharePopup } from "../../../../components/popup/SharePopup";
import FontIcons from "../../../../components/baseComponent/FontIcons";
//utils
import {
  fonts,
  ovnioColors,
  scaleXiPhone15,
  APP_SCREEN,
} from "../../../../utils/Variable";
import { stylesCommon } from "../../../../utils/CommonStyle";
import { ShareChannelLinkUtil } from "../../../../utils/ShareUtil";
//api
import GlobalValue from "../../../../api/GlobalVar";
import CustomLoader from "../../../../components/baseComponent/CustomLoader";
import { GetPostList } from "../../../../api/GetRequest";
import { showAPIError, validateUrl } from "../../../../api/Config";
import {
  PostUserFollow,
  PostLikeOrUnLike,
  PostArchiveOrUnArchive,
  PatchSavePostViewCount,
} from "../../../../api/PostRequest";
//assets
const plugrWatch = require("../../../../assets/images/lopz/splashOption/plugrWatch.png");
const ic_vote = require("../../../../assets/images/lopz/tabs/ic_vote.png");
const dm = require("../../../../assets/icon/DM/DM.png");
//#endregion

//#region Main
export default Home = ({ navigation, route }) => {
  console.log("Home route.params = ", JSON.stringify(route.params));

  //#region rowHT
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  GlobalValue.btmTabHeight = tabBarHeight;
  GlobalValue.btmSafeArearHt = insets.bottom;
  const HEADER_HEIGHT = Platform.OS === "ios" ? 44 : 56;
  const rowHt = height - tabBarHeight - insets.top - HEADER_HEIGHT;
  /* console.log("window height = ", Dimensions.get("window").height);
  console.log("screen height = ", Dimensions.get("screen").height);
  console.log("insets.top = ", insets.top);
  console.log("hT = ", height - GlobalValue.btmTabHeight - insets.top - 480);
  console.log("tabBarHeight = ", tabBarHeight); */
  //#endregion

  //#region useState
  const [isShowSharePopup, setIsShowSharePopup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setLoader] = useState(false);
  const [arrPost, setArrPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const videoRef = useRef(null);
  //#endregion

  //#region api
  useEffect(() => {
    console.log(
      "useEffect[] Home route.params = ",
      JSON.stringify(route.params)
    );
    if (route.params?.post_id) {
      GetPostListAPICall(
        route.params?.post_id,
        1,
        setArrPost,
        setTotalCount,
        setLoader
      );
    }
  }, [route.params?.post_id]);
  useEffect(() => {
    console.log(
      "useEffect[] Home route.params = ",
      JSON.stringify(route.params)
    );
    GetPostListAPICall(null, 1, setArrPost, setTotalCount, setLoader);
    const listner = EventRegister.addEventListener(
      GlobalValue.refreshHomePostList,
      (data) => {
        GetPostListAPICall(1, setArrPost, setTotalCount, setLoader);
      }
    );
    return () => {
      const isRemove = EventRegister.removeEventListener(listner);
      console.log(
        "\u001b[1;33mH.js | removeEventListener home post list refresh isRemove = ",
        isRemove
      );
    };
  }, []);

  const onRefreshFlatList = React.useCallback(() => {
    GetPostListAPICall(1, setArrPost, setTotalCount, setRefreshing);
  });

  //#endregion

  //#region action
  const onPlayIconClick = (index, item) => {
    setCurrentIndex(index);
    PatchSavePostViewCountAPICall(item.post_id);
  };
  const onRightIconClick = (index, item) => {
    console.log(
      "onRightIconClick | index , item.post_id | item.user_id = ",
      index,
      item.post_id,
      item.user_id
    );

    if (index === 0) {
      navigation.navigate("WatchAppStack", {
        screen: "BtmTabs",
        params: {
          screen: "Home",
        },
      });
    } else if (index === 1) {
      const updatedItems = arrPost.map((postTmp) => {
        if (postTmp.post_id === item.post_id) {
          return {
            ...postTmp,
            ...(postTmp.is_like = item.is_like ? false : true),
          };
        }
        return postTmp;
      });
      setArrPost(updatedItems);
      PostLikeOrUnLikeAPICall(item, item.is_like ? true : false);
    } else if (index === 4) {
      navigation.navigate(APP_SCREEN.LOOPZ_POSTCOMMENT, {
        post_id: item.post_id,
        share_url: item.share_url,
        safeAreaBtm: insets.bottom,
      });
    } else if (index === 5) {
      const updatedItems = arrPost.map((post_tmp) => {
        if (post_tmp.post_id === item.post_id) {
          return {
            ...post_tmp,
            ...(post_tmp.is_saved = item.is_saved ? false : true),
          };
        }
        return post_tmp;
      });
      setArrPost(updatedItems);
      PostArchiveOrUnArchiveAPICall(
        item,
        item.is_saved ? true : false,
        navigation
      );
    } else if (index === 6) {
      navigation.navigate(APP_SCREEN.LOOPZ_SHARE, {
        post_id: item.post_id,
        share_url: item.share_url,
      });
      return;
      navigation.navigate(APP_SCREEN.LOOPZ_TOAST_MSG);
      ShareChannelLinkUtil(
        "here should be title",
        "here should be URL OR Description"
      );
    } else if (index === 7) {
      const user = (({ user_id, first_name, username, profile_pic }) => ({
        user_id,
        first_name,
        username,
        profile_pic,
      }))(item.user);
      console.log("HOME user = ", user);
      navigation.navigate(APP_SCREEN.LOOPZ_DM, { user });
      return;

      if (GlobalValue.userId == 242) {
        const user = {
          user_id: 241,
          first_name: "plugr fourteen",
          username: "plugr14",
          profile_pic: null,
        };
        navigation.navigate(APP_SCREEN.LOOPZ_DM, { user });
      } else if (GlobalValue.userId == 241) {
        const user = {
          user_id: 242,
          first_name: "plugr fifteen",
          username: "plugr15",
          profile_pic: null,
        };
        navigation.navigate(APP_SCREEN.LOOPZ_DM, { user });
      } else {
        navigation.navigate(APP_SCREEN.LOOPZ_DM, { user });
      }
    }
  };
  //#endregion

  //#region JSX
  const SetUpPopUp = () => {
    const onFriendListItemClick = (item) => {
      console.log("onFriendListItemClick" + JSON.stringify(item));
    };
    return (
      <SharePopup
        headerTxt="Friend List"
        status={isShowSharePopup}
        safeAreaBtm={insets.bottom}
        onClose={() => setIsShowSharePopup(false)} // Play video on tap
        onItemClick={onFriendListItemClick}
      />
    );
  };
  const KeyExtractorList = (item, index) => {
    return item.post_id.toString();
  };
  const RenderListRow = ({ item, index }) => {
    const isVideoPlaying = currentIndex === index;
    const onVieoBuffer = ({ isBuffering }) => {
      console.log("onVieoBuffer  " + JSON.stringify(isBuffering));
    };
    const onVieoError = (error) => {
      console.log("onVieoError  " + JSON.stringify(error));
    };

    return (
      <View style={[styles.containerRow, { height: rowHt }]}>
        {isVideoPlaying ? (
          <TouchableOpacity
            onPress={() => setCurrentIndex(null)} // Pause on tap
            style={{ width: "100%", height: rowHt }}
          >
            <Video
              source={{
                uri: item.media_url,
              }}
              //ref={videoRef}
              style={{ width: "100%", height: rowHt, position: "absolute" }}
              poster={item.cover_image_url}
              posterResizeMode={"cover"}
              onBuffer={onVieoBuffer}
              onError={onVieoError}
              repeat={false}
              playInBackground={false}
              playWhenInactive={false}
              controls={false}
              resizeMode={"cover"} //NONE = "none",CONTAIN = "contain", COVER = "cover",      STRETCH = "stretch"
            />
          </TouchableOpacity>
        ) : (
          <ImageBackground
            style={styles.imgBg}
            source={{ uri: item.cover_image_url }}
          >
            <TouchableOpacity
              onPress={() => onPlayIconClick(index, item)} // Play video on tap
            >
              <FontIcons
                name="play-large-fill"
                size={scaleXiPhone15.sixtyH}
                color="#fff"
              />
            </TouchableOpacity>
          </ImageBackground>
        )}
        <View style={styles.rightContainer}>
          <RightIconComp
            iconName={dm}
            onIconClick={() => onRightIconClick(7, item)}
            index={7}
            isImage={true}
          />
          <RightIconComp
            iconName={plugrWatch}
            onIconClick={() => onRightIconClick(0, item)}
            index={0}
            isImage={true}
          />
          <RightIconComp
            color={item.is_like ? ovnioColors.primaryRed : null}
            iconName={"heart-fill"}
            onIconClick={() => onRightIconClick(1, item)}
            index={1}
          />
          <RightIconComp
            iconName={"shopping-cart-2-fill"}
            onIconClick={() => onRightIconClick(2, item)}
            index={2}
          />
          <RightIconComp
            onIconClick={() => onRightIconClick(3, item)}
            index={3}
            iconName={ic_vote}
            isImage={true}
          />
          <RightIconComp
            iconName={"message-2-fill"}
            onIconClick={() => onRightIconClick(4, item)}
            index={4}
          />
          <RightIconComp
            color={item.is_saved ? ovnioColors.primaryRed : null}
            iconName={"bookmark-fill"}
            onIconClick={() => onRightIconClick(5, item)}
            index={5}
          />
          <RightIconComp
            iconName={"share-forward-fill"}
            onIconClick={() => onRightIconClick(6, item)}
            index={6}
          />
        </View>
        <View style={styles.btmContainer}>
          <ProfileComp
            arrPost={arrPost}
            setArrPost={setArrPost}
            item={item.user}
          />
          <Text style={[styles.txtDesc, {}]}>{item.description}</Text>
        </View>
      </View>
    );
  };
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(null); // Stop video when scrolling to new item
    }
  };
  const renderFlatListFooter = () => {
    if (selCat.id || totalCount === arrGuide.length) {
      return null;
    } else {
      return (
        <TouchableOpacity
          disabled={loader}
          style={{
            paddingBottom: scaleXiPhone15.twentyFourH,
            paddingTop: scaleXiPhone15.eightH,
            justifyContent: "center",
            alignItems: "center",
            //backgroundColor: ovnioColors.blackContainerBg,
          }}
          onPress={onLoadMoreClicked}
        >
          {loader ? (
            <CustomLoader isSmall={false} color={ovnioColors.primaryRed} />
          ) : (
            <Text style={{ ...stylesCommon.txtBtn }}>Load More</Text>
          )}
        </TouchableOpacity>
      );
    }
  };
  //#endregion

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: ovnioColors.background,
      }}
    >
      <FlatList
        backgroundColor={ovnioColors.blackPlugrBg}
        data={arrPost}
        renderItem={RenderListRow}
        keyExtractor={KeyExtractorList}
        showsVerticalScrollIndicator={false}
        snapToInterval={rowHt}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        getItemLayout={(data, index) => ({
          length: rowHt,
          offset: rowHt * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        snapToAlignment="end"
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 100,
        }}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            tintColor={ovnioColors.primaryRed}
            refreshing={refreshing}
            onRefresh={onRefreshFlatList}
          />
        }
        //ListFooterComponent={renderFlatListFooter}
      />
      <LoaderComp loader={loader} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  containerRow: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ovnioColors.grayDesc,
  },
  rightContainer: {
    position: "absolute",
    right: scaleXiPhone15.eightH,
    bottom: scaleXiPhone15.sixteenH,
    justifyContent: "space-between",
    gap: scaleXiPhone15.eightH,
    //backgroundColor: "red",
  },
  btmContainer: {
    position: "absolute",
    bottom: scaleXiPhone15.sixteenH,
    left: scaleXiPhone15.eightH,
    gap: scaleXiPhone15.eightH,
    right:
      scaleXiPhone15.eightH + scaleXiPhone15.fivtySixH + scaleXiPhone15.eightH,
    // backgroundColor: "blue",
  },
  imgBg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "blue",
  },
  txtDesc: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.bold,
    color: ovnioColors.white,
  },
  videoContainer: {
    width: "100%",
    height: height,
  },
});
//#endregion

//#region RightIconComp
const RightIconComp = (props) => {
  return (
    <TouchableOpacity onPress={props.onIconClick} style={stylesRI.container}>
      {props.isImage ? (
        <Image
          source={props.iconName}
          resizeMode="contain"
          style={stylesRI.imgIcon}
        />
      ) : (
        <FontIcons
          name={props.iconName}
          size={scaleXiPhone15.twentyFourH}
          color={props.color ? props.color : "#EAEAEA"}
        />
      )}
    </TouchableOpacity>
  );
};
const stylesRI = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",

    width: scaleXiPhone15.fivtyH,
    height: scaleXiPhone15.fivtyH,
    borderRadius: scaleXiPhone15.fivtyH * 0.5,

    backgroundColor: "#1F1F1F",
  },
  imgIcon: {
    width: scaleXiPhone15.twentyEightH,
    height: scaleXiPhone15.twentyEightH,
    // backgroundColor: "green",
  },
});
//#endregion

//#region ProfileComp
const ProfileComp = (props) => {
  const { item } = props;

  const onFollowClick = () => {
    if (item.is_following) return;
    const updatedItems = props.arrPost.map((itemObj) => {
      if (itemObj.user.user_id === item.user_id) {
        return { ...itemObj, ...(itemObj.user.is_following = true) };
      }
      return itemObj;
    });
    props.setArrPost(updatedItems);
    PostUserFollowAPICall(item.user_id);
  };
  return (
    <View style={stylesPC.container}>
      <Image
        source={
          validateUrl(item?.profile_pic)
            ? {
                uri: item?.profile_pic,
              }
            : {
                uri: "https://zealous-cliff-082548f0f.5.azurestaticapps.net/assets/images/logo.png",
              }
        }
        style={stylesPC.profileIcon}
      />
      <View
        style={{
          alignItems: "flex-start",
        }}
      >
        <Text style={stylesPC.prflTitle}>
          {item?.first_name}
          {item?.last_name ? item?.last_name : ""}
        </Text>
        {item?.username ? (
          <Text
            style={[stylesPC.prflTitle, { fontSize: scaleXiPhone15.twelveH }]}
          >
            {item?.username}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={[
          stylesPC.btnBg,
          {
            backgroundColor: item?.is_following
              ? "#727272"
              : ovnioColors.primaryRed,
          },
        ]}
        onPress={onFollowClick}
      >
        <Text
          style={[
            stylesPC.btnTxt,
            { color: item?.is_following ? ovnioColors.white : "#000000" },
          ]}
        >
          {item?.is_following ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const stylesPC = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: scaleXiPhone15.eightH,
    alignContent: "center",
    alignItems: "center",
    //backgroundColor: "pink",
  },
  profileIcon: {
    width: scaleXiPhone15.fortyH,
    height: scaleXiPhone15.fortyH,
    borderRadius: scaleXiPhone15.fortyH / 2,
    borderWidth: scaleXiPhone15.twoH,
    borderColor: "#fff",
  },
  prflTitle: {
    fontSize: scaleXiPhone15.fouteenH,
    fontWeight: "800",
    fontFamily: fonts.medium,
    color: ovnioColors.white,
    lineHeight: scaleXiPhone15.fouteenH,
  },
  btnBg: {
    paddingHorizontal: scaleXiPhone15.fouteenH,
    paddingVertical: scaleXiPhone15.sixH,
    backgroundColor: ovnioColors.primaryRed,
    borderRadius: scaleXiPhone15.fourH,
  },
  btnTxt: {
    fontSize: scaleXiPhone15.twelveH,
    fontFamily: fonts.bold,
    color: "#000000",
  },
});
//#endregion

//#region LoaderComp
const LoaderComp = (prop) => {
  if (prop.loader) {
    return (
      <CustomLoader
        padding={scaleXiPhone15.sixteenH}
        isSmall={true}
        color={ovnioColors.primaryRed}
      />
    );
  } else {
    return null;
  }
};
//#endregion

//#region API
async function GetPostListAPICall(
  post_id,
  nextPage,
  setArrPost,
  setTotalCount,
  setLoader
) {
  setLoader(true);
  const para = post_id ? { post_id: post_id } : {};
  para.page = nextPage;
  para.limit = 40;

  await GetPostList(para)
    .then((res) => {
      setLoader(false);
      const { posts, totalRecord, recordsFiltered } = res.data;
      console.log(
        "\u001b[1;32mH.js : RES | Home post list = ",
        JSON.stringify(posts.length)
      );
      setTotalCount(totalRecord);
      if (nextPage === 1) {
        setArrPost(posts);
      } else {
        setArrPost((prevData) => [...prevData, ...posts]);
      }
    })
    .catch((error) => {
      setLoader(false);
      showAPIError(error, "Error | Post");
    });
}
async function PostUserFollowAPICall(userId) {
  const para = { action: "follow" };
  const body = {
    followe_id: userId,
  };
  await PostUserFollow(para, body)
    .then((res) => {
      console.log(
        "\u001b[1;32mH.js : RES | User follow = ",
        JSON.stringify(res.data)
      );
    })
    .catch((error) => {
      showAPIError(error, "Error | Follow");
    });
}
async function PostLikeOrUnLikeAPICall(item, isLike) {
  const para = { _l: isLike ? true : false };
  const body = {
    post_id: item.post_id,
  };
  await PostLikeOrUnLike(item.post_id, para, body)
    .then((res) => {
      console.log(
        "\u001b[1;32mH.js : RES | Like or Unlike = ",
        JSON.stringify(res.data)
      );
    })
    .catch((error) => {
      showAPIError(error, "Error | Like or Unlike");
    });
}
async function PostArchiveOrUnArchiveAPICall(item, isSave, navigation) {
  const para = { action: isSave ? "add" : "remove" };
  const body = {
    post_id: item.post_id,
  };
  await PostArchiveOrUnArchive(para, body)
    .then((res) => {
      console.log(
        "\u001b[1;32mH.js : RES | Archive Video= ",
        JSON.stringify(res.data)
      );
      if (isSave) {
        navigation.navigate(APP_SCREEN.LOOPZ_TOAST_MSG, {
          btnTitle: "Saved Successfully !",
        });
      }
    })
    .catch((error) => {
      showAPIError(error, "Error | Add Archive");
    });
}
async function PatchSavePostViewCountAPICall(post_id) {
  await PatchSavePostViewCount(post_id)
    .then((res) => {
      console.log(
        "\u001b[1;32mH.js : RES | Save post count = ",
        JSON.stringify(res.data)
      );
    })
    .catch((error) => {
      showAPIError(error, "Error | Save Post Count");
    });
}

//#endregion
