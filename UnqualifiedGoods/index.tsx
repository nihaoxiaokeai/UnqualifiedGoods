import * as React from 'react';
import { Tabs, Badge, Button, Flex, Modal, ImagePicker, Icon, Toast, Checkbox } from 'antd-mobile';
import * as qs from 'query-string';
import List from './components/List';
import * as api from '../../services/unqualifiedGoods';
import * as styles from './index.scss';
import ImagePickerModal from '../../components/ImagePickerModal';

const genUUID = () => {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i += 1) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

    // eslint-disable-next-line
    s[8] = s[13] = s[18] = s[23] = '-';
    return s.join('');
};

let allSave = false;
let isSubmit = false;
const { useState, useEffect, useCallback } = React;

export default React.memo(() => {
    const params = qs.parse(window.location.search);
    const { msgid } = params;
    // const msgid = "0b14e6e1-29ca-457e-b528-9588e0d118dc";

    document.title = '不合格商品下架通知';

    // 不合格
    const [Data, setData] = useState([]);

    // 上传弹框显示
    const [VasibleModal, setVasibleModal] = useState(false);

    // 上传文件
    const [Files, setFiles] = useState([]);

    // 保存按钮
    const [allCheck, setAllCheck] = useState(false);

    const [isSave, setisSave] = useState(false);

    const [define, setDefine] = useState(false);

    const [isDefinePage, setIsDefinePage] = useState(false);

    const [definePageListLength, setDefinePageListLength] = useState(0);

    // 时间
    const [date, setdate] = useState('');

    const handleArray = arr => {
        const newArr = arr.map(item => {
            return {
                ...item,
                isCheck: item.isSave,
                id: genUUID(),
                removeNums: item.remove_nums,
            };
        });
        return newArr;
    };

    useEffect(() => {
        getList();
    }, []);
    const toastLoading = isShow => {
        if (isShow) {
            Toast.loading('Loading...', 0);
        } else {
            Toast.hide();
        }
    };
    const getList = useCallback(() => {
        toastLoading(true);
        api.getProductList(msgid, true).then((res: any) => {
            console.log('...', res);
            const { unqualifiedDataDetails, reportDate } = res;
            const data = handleArray(unqualifiedDataDetails);
            setdate(reportDate);
            const getIsSubmit = data.length > 0 ? data[0] : {};
            isSubmit = getIsSubmit.isDispose === 'true' ? true : false;
            if (getIsSubmit.isDispose && getIsSubmit.isDispose === 'true') {
                const files = [];
                getIsSubmit.url.forEach(item => {
                    const image = {
                        url: item,
                        id: genUUID(),
                    };
                    files.push(image);
                });
                setFiles(files);
            }
            allSave = data.every(index => {
                return index.isSave === 'true';
            });
            const save = data.some(item => {
                return item.isCheck === 'true' && item.isSave !== 'true';
            });
            setisSave(save);
            setData(data);
            toastLoading(false);
        });
    }, [msgid]);

    const goDefinePage = useCallback(() => {
        setIsDefinePage(true);
    }, []);

    useEffect(() => {
        if (!isDefinePage) return;
        let definePageListLength = 0;
        Data.forEach(item => {
            if (item.remove_nums != '0') {
                definePageListLength++;
            }
        });
        setDefinePageListLength(definePageListLength);
    }, [isDefinePage]);

    const handleSaveData = (params, cb, type) => {
        api.saveProductList(params).then((res: any) => {
            if (cb) {
                cb();
            }
        });
    };
    // 保存
    const handleSave = () => {
        const saveData = Data.filter(item => {
            return item.isCheck === 'true' ? item : '';
        }).map(item => {
            return {
                msgseq: item.msgseq,
                removenums: !item.removeNums || item.removeNums === '' ? 0 : item.removeNums,
            };
        });
        let param = {
            disposeMode: 1,
            msgid: msgid,
            unqualifiedDateResultDetailList: saveData,
            url: [],
        };
        handleSaveData(
            param,
            () => {
                Toast.success('保存成功', 1, getList);
            },
            'save'
        );
    };

    // 选择
    const onSelectChange = (selectList = [], selectStatue) => {
        console.log('selectList', selectList);
        const status = selectStatue ? 'true' : '';
        const data = [...Data];
        data.forEach(item => {
            selectList.forEach(select => {
                if (select.id === item.id) {
                    item.isCheck = status;
                }
            });
        });

        const allCheck = data.every(item => {
            return item.isCheck === 'true';
        });
        if (allCheck) {
            setAllCheck(true);
        }
        const save = data.some(item => {
            return item.isCheck === 'true' && item.isSave !== 'true';
        });
        setisSave(save);
        setData(data);
    };

    const uploadImage = () => {
        setVasibleModal(true);
    };

    const submitData = () => {
        if ((definePageListLength > 0 && Files.length >= 1) || definePageListLength == 0) {
            const saveData = Data.filter(item => {
                return item.isCheck === 'true' ? item : '';
            }).map(item => {
                return {
                    msgseq: item.msgseq,
                    removenums: !item.removeNums || item.removeNums === '' ? 0 : item.removeNums,
                };
            });
            const files = [];
            Files.forEach(item => {
                files.push(item.url);
            });
            let param = {
                disposeMode: 2,
                msgid: msgid,
                msgseq: saveData,
                url: files,
                unqualifiedDateResultDetailList: saveData,
            };
            handleSaveData(
                param,
                () => {
                    Toast.success('提审成功', 1, getList);
                },
                'submit'
            );
        } else {
            Toast.info('请先上传封装图片', 1);
        }
    };

    const defineClick = files => {
        if (files && !files.length) {
            Toast.show('请上传图片');
            return;
        }
        if (!isSubmit) {
            setFiles(files);
            setDefine(true);
        }
        setVasibleModal(false);
    };

    const removeNumsHandle = (data, val) => {
        const list = [...Data];
        list.forEach(item => {
            if (item.id === data.id) {
                item.removeNums = val;
            }
        });
        setData(list);
    };
    const footer = !isSubmit
        ? [
              {
                  text: '取消',
                  onPress: () => {
                      setVasibleModal(false);
                  },
              },
              {
                  text: '提交审核',
                  onPress: () => {
                      submitData();
                  },
              },
          ]
        : [
              {
                  text: '取消',
                  onPress: () => {
                      setVasibleModal(false);
                  },
              },
          ];
    console.log(Data, 'ddds');
    return (
        <div>
            <div className={styles.contentFlex}>
                <div className={styles.title}>{date || ''}</div>
                {Data && !!Data.length && (
                    <List
                        data={Data}
                        onSelectChange={onSelectChange}
                        isDefinePage={isDefinePage}
                        allSave={allSave}
                        removeNumsHandle={removeNumsHandle}
                    />
                )}
                {isDefinePage && definePageListLength == 0 && (
                    <div className={styles.no_data}>无撤柜数据</div>
                )}
            </div>
            <div className={styles.BottomButton}>
                <Flex>
                    {isSubmit && isDefinePage && definePageListLength > 0 && (
                        <Flex.Item>
                            <Button
                                type="primary"
                                inline
                                size="small"
                                disabled={!allSave}
                                className={styles.buttons}
                                onClick={uploadImage}
                            >
                                查看封装图片
                            </Button>
                        </Flex.Item>
                    )}
                    {!isDefinePage && (
                        <>
                            <Flex.Item>
                                <Button
                                    type="primary"
                                    inline
                                    size="small"
                                    className={styles.buttons}
                                    onClick={handleSave}
                                    disabled={!isSave}
                                >
                                    保存
                                </Button>
                            </Flex.Item>
                            <Flex.Item>
                                <Button
                                    type="primary"
                                    inline
                                    size="small"
                                    disabled={!allSave}
                                    className={styles.buttons}
                                    onClick={goDefinePage}
                                >
                                    撤柜清单
                                </Button>
                            </Flex.Item>
                        </>
                    )}
                    {!isSubmit && isDefinePage && definePageListLength > 0 && (
                        <Flex.Item>
                            <Button
                                type="primary"
                                inline
                                size="small"
                                disabled={!allSave && define}
                                className={styles.buttons}
                                onClick={uploadImage}
                            >
                                上传封装图片
                            </Button>
                        </Flex.Item>
                    )}
                    {!isSubmit && isDefinePage && (
                        <Flex.Item>
                            <Button
                                type="primary"
                                inline
                                size="small"
                                disabled={
                                    (!allSave && !define) || (!allSave && definePageListLength == 0)
                                }
                                className={styles.buttons}
                                onClick={submitData}
                            >
                                确认核查
                            </Button>
                        </Flex.Item>
                    )}
                </Flex>
            </div>
            {VasibleModal && (
                <ImagePickerModal isSubmit={isSubmit} filesData={Files} defineClick={defineClick} />
            )}
        </div>
    );
});
