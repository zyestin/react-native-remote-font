// main index.js
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
  NativeModules
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import RNFS from "react-native-fs";

const kFontLoadStatus = {
  IDLE: "idle",
  LOADING: "loading",
  LOADEND: "loadend",
};

//todo: 用于缓存字体状态，避免一些不必要的文件存在判断、load到缓存等异步操作
const kFontStatusCache = {
  // [fontName]: kFontLoadStatus.IDLE | kFontLoadStatus.LOADING | kFontLoadStatus.LOADEND
};

const ArtText = ({ text, style, fontInfo }) => {
  let { fontUrl, fontName } = fontInfo;

  console.log("fontUrl, fontName:: ", fontUrl, fontName);

  const [fontLoadStatus, setFontLoadStatus] = useState(
    fontUrl
      ? {
          [fontUrl]: kFontLoadStatus.IDLE,
        }
      : null
  );

  const textCompRef = useRef();
  const currentFontNameRef = useRef(null);

  useEffect(() => {
    console.log("useEffect~~", fontUrl, fontName);
    //异步加载字体，载入缓存
    if (fontUrl) {
      setFontLoadStatus({
        [fontUrl]: kFontLoadStatus.LOADING,
      });
      downloadIfNotExistWithUrl(fontUrl)
        .then((path) => {
          let fontPath = path;
          console.log("path:::", path);
          if (Platform.OS == "ios") {
            // fontPath = path.split("/").pop();
          } else {
            fontPath.startsWith("/") && (fontPath = path.substring(1));
          }
          console.log("fontPath:::", fontPath);
          // setTimeout(() => {
          let fontNodeId = findNodeHandle(textCompRef.current);
          if (!fontNodeId) {
            console.log("fontNodeId is null");
            setFontLoadStatus({
              [fontUrl]: kFontLoadStatus.LOADEND,
            });
            return;
          }
          NativeModules.RemoteFontLoader.loadFontFile(fontPath, fontNodeId)
            .then(() => {
              console.log("loadFontFile success~");
              currentFontNameRef.current = fontName;
            })
            .catch((err) => {
              //todo: toast
              console.log("loadFontFile err:::", err);
            })
            .finally(() => {
              console.log("loadFontFile finally");
              setFontLoadStatus({
                [fontUrl]: kFontLoadStatus.LOADEND,
              });
            });
          // }, 10);
        })
        .catch((err) => {
          //todo: toast
          console.log("downloadIfNotExist err:::", err);
          setFontLoadStatus({
            [fontUrl]: kFontLoadStatus.LOADEND,
          });
        });
    }

    return () => {};
  }, [fontUrl, fontName]);

  const textStyle = useMemo(() => {
    // Fix: iOS 在字体未达到可应用状态时，提前为Text设置了fontfamily，debugging时会报错
    if (fontLoadStatus?.[fontUrl] == kFontLoadStatus.LOADEND) {
      return [
        style,
        {
          //Fix: Android端通过原生去设置远程下载的字体，若再在style里设置fontFamily，会导致字体应用失效。。。
          fontFamily: Platform.OS == "ios" ? fontName : undefined,
        },
      ];
    } else {
      return style;
    }
  }, [fontLoadStatus, fontUrl, fontName, style]);

  console.log("textStyle:", textStyle);

  return (
    <View style={{ backgroundColor: "red" }}>
      <Text ref={textCompRef} style={textStyle}>
        {text}
      </Text>

      {fontLoadStatus?.[fontUrl] == kFontLoadStatus.LOADING ? (
        <ActivityIndicator
          animating
          size="small"
          color="black"
          style={{
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
        />
      ) : null}
    </View>
  );
};

export default ArtText;

const styles = StyleSheet.create({});

const fontsDir = RNFS.CachesDirectoryPath + "/fonts";

async function downloadIfNotExistWithUrl(url) {
  console.log("downloadIfNotExistWithUrl:", url);
  if (!url) {
    return Promise.reject({ code: -1, msg: "url is null" });
  }
  let fileName = url.substr(url.lastIndexOf("/") + 1);

  if (!(fileName?.length > 0)) {
    return Promise.reject({ code: -1, msg: "fileName is null" });
  }

  // yousheziyoubangbangti3.ttf
  console.log("fileName::", fileName);

  let filePath = fontsDir + "/" + fileName;
  // /var/mobile/Containers/Data/Application/5D44C3B2-A022-49D6-8FE2-5F06CA2E03EF/Library/Caches/fonts/yousheziyoubangbangti3.ttf

  let isExist = await RNFS.exists(fontsDir);
  console.log("RNFS.exists fontsDir:", isExist);

  if (!isExist) {
    let mkdirResult = await RNFS.mkdir(fontsDir);
    console.log("mkdir fontsDir: ", mkdirResult);
  }

  let result = await downloadIfNotExistWithFilePath(filePath, url);
  return result;
}

function downloadIfNotExistWithFilePath(filePath, url) {
  console.log("downloadIfNotExistWithFilePath::", filePath);
  return RNFS.exists(filePath)
    .then((isExist) => {
      if (isExist) {
        console.log("isExist ~:", filePath);
        return filePath;
      } else {
        return RNFS.downloadFile({
          fromUrl: url,
          toFile: filePath,
          background: true,
          discretionary: true,
        })
          .promise.then((res) => {
            if (res && res.statusCode == 200) {
              console.log("download ok ~");
              return filePath;
            } else {
              console.log("文件下载错误:", res);
              return Promise.reject(res);
            }
          })
          .catch((err) => {
            console.log("文件下载错误:::", err);
            return Promise.reject(err);
          });
      }
    })
    .catch((err) => {
      console.log("文件判断错误:::::", err);
      return Promise.reject(err);
    });
}
