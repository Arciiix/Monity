import Typography from "@mui/material/Typography";

import styles from "./Logo.module.css";

function Logo({ logoHeight }: { logoHeight: string | number }) {
  return (
    <>
      <img
        src={`${process.env.PUBLIC_URL}/icon-1024-regular.png`}
        alt="Monity"
        style={{
          height: logoHeight,
        }}
        className={styles.logoImg}
      />
      <Typography variant="h1">Monity</Typography>
    </>
  );
}

export default Logo;
