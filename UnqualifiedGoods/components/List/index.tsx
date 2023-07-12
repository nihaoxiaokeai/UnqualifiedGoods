import * as React from "react";
import * as styles from "./index.scss";
import Item from "./components/Item"
import {Checkbox} from "antd-mobile";
interface IProps {
    data: any;
    onSelectChange: any;
    allSave: boolean;
    removeNumsHandle: any;
    isDefinePage: any;
}
const { useState, useEffect, useCallback } = React;
export default React.memo((props: IProps) => {
    const { data, isDefinePage } = props
    const [allCheck, setAllCheck] = useState(false);

    useEffect(() => {
        const allCheckVal = data.every((item) => {
            return item.isCheck === 'true'
        })
        setAllCheck(allCheckVal)

    }, [data]);

    const handleAllChange = (event) => {
        const { data} = props;
        const { target } = event;
        props.onSelectChange(data, target.checked);
    };

    return (
        <>
            {!isDefinePage && <div className={styles.allCheck}>
                <Checkbox
                    checked={allCheck}
                    disabled={props.allSave}
                    onChange={handleAllChange}
                />
                <span className="text">全选</span>
            </div>}


            <div className={styles.wrap}>
                <div>
                    <div className={styles.leftContent}>
                        {props.data.length &&
                        props.data.map((item) => {
                                return <Item
                                    key={item.id}
                                    data={item}
                                    style={{display: (isDefinePage && item.remove_nums == 0) ? 'none' : 'inherit'}}
                                    removeNumsHandle={props.removeNumsHandle}
                                    onSelectChange={props.onSelectChange}
                                />
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
});