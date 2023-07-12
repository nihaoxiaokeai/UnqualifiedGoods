import * as React from "react";
import * as styles from "./index.scss";
import ListModuleLeft from "./components/ListModuleLeft";
import ListModuleRight from "./components/ListModuleRight";
interface IProps {
  data: any;
  onSelectChange: any;
}

export default React.memo((props: IProps) => {
  const titles = [
    <span></span>,
    "下架条码",
    "下架名称",
    "品类",
    "生产日期",
    "不合格情况",
    "当前库存",
  ];

  return (
    <>
      <div className={styles.wrap}>
        <div>
          <div className={styles.leftContent}>
            <ListModuleLeft
              titles={titles}
              dataList={props.data}
              onSelectChange={props.onSelectChange}
            />
          </div>
          <div className={styles.right}>
            <div className={styles.rightContent}>
              <ListModuleRight titles={titles} dataList={props.data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
