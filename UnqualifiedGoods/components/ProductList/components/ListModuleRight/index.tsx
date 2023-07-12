import * as React from "react";
import * as styles from "./index.scss";

interface IProps {
  dataList: any;
  titles: any;
}
export default React.memo((props: IProps) => {
  // 每个分组的详细列表
  const { dataList = [], titles = [] } = props;
  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.title}>
          <tr className={styles.tr}>
            <td className={styles.td3}>{titles[3]}</td>
            <td className={styles.td4}>{titles[4]}</td>
            <td className={styles.td5}>{titles[5]}</td>
            <td className={styles.td6}>{titles[6]}</td>
          </tr>
        </div>
        <div className={styles.content}>
          {dataList &&
            dataList.map((item, index) => {
              return (
                <tr
                  className={`${styles.tr} ${styles.borderBottom}`}
                  key={index}
                >
                  <td className={styles.td3}>{item.datatype}</td>
                  <td className={styles.td4}>{item.produce_date}</td>
                  <td className={styles.td5}>
                    <span className={styles.font}>{item.unqualified_case}</span>
                  </td>
                  <td className={styles.td6}>
                    {item.inventory === "" ? 0 : item.inventory}
                  </td>
                </tr>
              );
            })}
        </div>
      </div>
    </>
  );
});
