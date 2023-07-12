import * as React from "react";

import { Checkbox, Icon, InputItem, Menu, Modal } from "antd-mobile";
import * as styles from "./index.scss";
interface IProps {
  data: any;
  onSelectChange: any;
  removeNumsHandle: any;
  style: any;
}
const { useState, useEffect, useCallback } = React;
const toDecimal2 = (x) => {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf(".");
  if (rs < 0) {
    rs = s.length;
    s += ".";
  }
  while (s.length <= rs + 2) {
    s += "0";
  }
  return s;
};
export default React.memo((props: IProps) => {
  const { data, style } = props;
  const [visible, setVisible] = useState(false);
  const [removeNums, setRemoveNums] = useState("");

  console.log(data);

  const listconfig = [
    {
      title: "门店",
      indexKey: "plant_name",
    },
    {
      title: "品类",
      indexKey: "datatype",
    },
    {
      title: "规格",
      indexKey: "specification",
    },
    {
      title: "生产日期",
      indexKey: "produce_date",
      psText: "(不分批次撤柜)",
    },
    {
      title: "当前库存",
      indexKey: "inventory",
    },
    {
      title: "撤柜数量",
      indexKey: "removeNums",
      renderHandle: toDecimal2,
    },
    // {
    //     title: '不合格情况',
    //     indexKey: 'unqualified_case',
    // },
  ];

  const handleString = (name: string) => {
    const beforeString = name.slice(0, name.length - 4);
    const afterString = name.substr(name.length - 4, 4);
    return (
      <>
        {beforeString}
        <span style={{ color: "red" }}>{afterString}</span>
      </>
    );
  };

  const handleChange = (event, index) => {
    const { target } = event;
    props.onSelectChange([index], target.checked);
  };

  const updataClick = () => {
    setVisible(true);
  };
  const onInputChange = useCallback(
    (e) => {
      setRemoveNums(e);
    },
    [removeNums]
  );
  return (
    <div style={style}>
      <div className={styles.itemwrap}>
        <div className={styles.line1}>
          <span className={styles.line1_Checkbox}>
            <Checkbox
              checked={data.isCheck === "true"}
              disabled={data.isSave === "true"}
              onChange={(e) => {
                handleChange(e, data);
              }}
            />
          </span>
          <span className={styles.line1_name}>
            <span className={styles.font}>{data.produce_name}</span>
          </span>
          <span className={styles.line1_code}>
            {handleString(data.produce_code)}
          </span>
        </div>
        <div className={styles.main}>
          {listconfig.map((item2, index) => {
            return (
              <div
                className={styles.line2}
                key={index}
                style={{
                  color: `${
                    data.removeNums != data.remove_nums &&
                    item2.indexKey == "removeNums"
                      ? "red"
                      : ""
                  }`,
                }}
              >
                <div className={styles.line2_tit}>{item2.title}</div>
                <div>
                  {item2.renderHandle
                    ? item2.renderHandle(data[item2.indexKey])
                    : data[item2.indexKey]}{" "}
                  <span className={styles.color_red}>
                    &nbsp;&nbsp;&nbsp;&nbsp;{item2.psText}
                  </span>
                  {data.isSave !== "true" && item2.indexKey == "removeNums" && (
                    <span className={styles.updata} onClick={updataClick}>
                      修改
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.main}>
          <div className={styles.line2}>
            <div className={styles.line2_tit}>不合格情况</div>
            <div style={{ color: "#323232" }}>{data.unqualified_case}</div>
          </div>
        </div>
      </div>

      <Modal
        visible={visible}
        className="modal"
        transparent
        maskClosable={false}
        title="修改撤柜数量"
        footer={[
          {
            text: "取消",
            onPress: () => setVisible(false),
          },
          {
            text: "确定",
            style: { color: `${true ? "#323232" : "#CCCCCC"}` },
            onPress: () => {
              props.removeNumsHandle(data, removeNums);
              setVisible(false);
            },
          },
        ]}
      >
        <InputItem
          className={styles.modal_input}
          value={removeNums}
          type="digit"
          placeholder="请输入撤柜数量"
          clear
          onChange={onInputChange}
        />
      </Modal>
    </div>
  );
});
