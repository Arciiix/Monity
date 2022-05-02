import styles from "./Loading.module.css";

interface ILoadingProps {
  hideText?: boolean;
}

function Loading({ hideText = false }: ILoadingProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.animationContainer}>
        <div className={`${styles.line}`}></div>
        <div className={`${styles.line}`}></div>
        <div className={`${styles.line}`}></div>
      </div>
      {!hideText && <span className={styles.loadingText}>Loading</span>}
    </div>
  );
}
export default Loading;
export type { ILoadingProps };
