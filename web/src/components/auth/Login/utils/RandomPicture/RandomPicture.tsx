import Box from "@mui/material/Box";
import { useLayoutEffect, useState } from "react";
import Logo from "../../../../Logo/Logo";

import styles from "./RandomPicture.module.css";

function RandomPicture() {
  let [currentImgURL, setCurrentImgURL] = useState("");
  let [preloadURL, setPreloadURL] = useState("");
  let [size, setSize] = useState({ width: 1280, height: 1080 }); // 1920 times 2/3

  const updateSize = (): void => {
    //It's 8/12 (0.6666667) (grid item size)
    let updatedSize = getWindowSize();
    setSize({
      width: Math.floor(updatedSize.width * 0.6666667),
      height: updatedSize.height,
    });
  };

  const getWindowSize = (): { width: number; height: number } => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };

  const generateNewURL = (newSize: { width: number; height: number }) => {
    let urlPattern = `https://source.unsplash.com/random/${newSize.width}x${newSize.height}`;
    // let urlPattern = `https://picsum.photos/${newSize.width}/${newSize.height}`;

    setPreloadURL(urlPattern);

    setTimeout(() => {
      setCurrentImgURL(urlPattern);
    }, 1000);
  };

  useLayoutEffect(() => {
    //Calculate the initial size
    updateSize();
    generateNewURL(size);

    window.addEventListener("resize", () => {
      updateSize();
    });
  }, []);

  useLayoutEffect(() => {
    let timer = setTimeout(() => {
      generateNewURL(size);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [size]);
  return (
    <Box
      sx={{
        width: size.width + "px",
        height: size.height + "px",
        backgroundImage: `url(${currentImgURL})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        "::before": {
          content: `url(${preloadURL})`,
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          zIndex: "-1",
        },
      }}
    >
      <Box className={styles.logoWrapper}>
        <Logo logoHeight={"max(30%, 150px)"} />
      </Box>
    </Box>
  );
}

export default RandomPicture;
