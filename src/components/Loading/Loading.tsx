import styles from "./Loading.module.css";

interface ILoadingProps {
  fullSize?: boolean;
  hideText?: boolean;
}
function Loading({ fullSize = true, hideText = false }: ILoadingProps) {
  return (
    <div
      className={`${styles.loadingContainer}${
        fullSize ? ` ${styles.fullSize}` : ""
      }`}
    >
      <div className={styles.animationContainer}>
        <div className={`${styles.line}`}></div>
        <div className={`${styles.line}`}></div>
        <div className={`${styles.line}`}></div>
      </div>
      {!hideText && <span className={styles.loadingText}>Ładowanie</span>}
    </div>
  );
}
export default Loading;
