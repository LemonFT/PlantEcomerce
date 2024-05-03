import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { errorAlert, successAlert } from "../../../Components/Alert";
import { getAllOrders, updateStatusOrder, updateStatusOrders } from "../../../Data/order";
import { formatDate, useDebounce } from "../../../Global";
import styles from "./index.module.scss";

function Order() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const searchRef = useRef(null)
    const dateToRef = useRef(null)
    const dateFromRef = useRef(null)
    const [headerItem, setHeaderItem] = useState(1)
    const [orders, setOrders] = useState([])
    const [ordersRender, setOrdersRender] = useState([])
    const [formUpdateStatus, setFormUpdateStatus] = useState([-1, -1, -1])
    const optionStatus = [
        { value: 0, label: "Wait for confirmation" },
        { value: 1, label: "Being packaged" },
        { value: 2, label: "Being transported" },
        { value: 3, label: "Complete" },
        { value: 4, label: "Cancel by customer" },
        { value: 5, label: "Cancel by shop" },
    ]

    const fetchOrder = async () => {
        const ords = await getAllOrders()
        if (ords !== null) {
            setOrders(ords)
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [])

    useEffect(() => {
        setOrdersRender(headerItem === 1 ? orders : orders.filter((item) => {
            if (headerItem === 6) {
                return item.progressingOrder.statusOrder === 5 || item.progressingOrder.statusOrder === 4
            } else {
                return item.progressingOrder.statusOrder === headerItem - 2
            }
        }))
        setFormUpdateStatus([-1, -1, -1])
    }, [orders, headerItem])

    const getNameOrderStatus = (status) => {
        return optionStatus?.find((item) => item.value === status)?.label
    }

    const search = (searchKey) => {
        const dateFrom = dateFromRef.current.value
        const dateTo = dateToRef.current.value
        const dateF = dateFrom ? new Date(dateFrom).getTime() : new Date('1000-01-01').getTime()
        const dateT = dateTo ? new Date(dateTo).getTime() : new Date('9999-12-31').getTime()
        const list = headerItem === 1 ? orders : orders.filter((item) => {
            if (headerItem === 6) {
                return item.progressingOrder.statusOrder === 5 || item.progressingOrder.statusOrder === 4
            } else {
                return item.progressingOrder.statusOrder === headerItem - 2
            }
        })
        setFormUpdateStatus([-1, -1, -1])
        setOrdersRender(list.filter((item) => {
            const itemCode = item?.order?.code.toLowerCase()
            const timeInit = new Date(item?.order?.initTime).getTime()
            return (itemCode.includes(searchKey) || searchKey.includes(itemCode)) &&
                dateF <= timeInit && timeInit <= dateT
        }))
    }

    const searchDebounceFunction = useDebounce(search, 1000)
    const handleSearch = () => {
        const searchKey = searchRef.current.value
        searchDebounceFunction(searchKey.toLowerCase())
    }

    const updateAll = async () => {
        const orderIds = ordersRender.map((item) => {
            return item?.order?.id
        })
        const orderStatus = ordersRender[0].progressingOrder?.statusOrder+1;
        const resultUpdateOrders = await updateStatusOrders(orderIds, orderStatus)
        if(resultUpdateOrders){
            successAlert("Update all orders status successful")
            fetchOrder()
        }else{
            errorAlert("Update all orders status failed, try again later!")
        }
    }

    const cancelAll = async () => {
        const orderIds = ordersRender.map((item) => {
            return item?.order?.id
        })
        const orderStatus = 5
        const resultUpdateOrders = await updateStatusOrders(orderIds, orderStatus)
        if(resultUpdateOrders){
            successAlert("Update all orders status successful")
            fetchOrder()
        }else{
            errorAlert("Update all orders status failed, try again later!")
        }
    }

    const FormUpdateStatus = ({ orderCode, orderId, statusN, close }) => {
        const optionStatusUpdate = [
            { statusNow: 0, label: "Being packaged", status: 1 },
            { statusNow: 1, label: "Being transported", status: 2 },
            { statusNow: 2, label: "Complete", status: 3 },
            { statusNow: 3, label: "Complete, not update", status: statusN },
            { statusNow: 4, label: "Cancel by customer, not update", status: statusN },
            { statusNow: 5, label: "Cancel by shop, not update", status: statusN },
        ]


        const getNameOrderStatus = (status) => {
            return optionStatusUpdate?.find((item) => item.statusNow === status)?.label || "Complete, not update"
        }

        const getStatusOrderUpdate = (status) => {
            return optionStatusUpdate?.find((item) => item.statusNow === status)?.status
        }

        const updateStatus = async () => {
            const statusUpdate = getStatusOrderUpdate(statusN)
            console.log(statusUpdate)
            if (statusUpdate === 3 || statusUpdate === 4 || statusUpdate === 5) {
                return;
            }
            const result = await updateStatusOrder(orderId, statusUpdate)
            if (result) {
                successAlert("Update order status successful")
            } else {
                errorAlert("Update order status failed!")
            }
            close()
        }

        const cancelOrder = async () => {
            const result = await updateStatusOrder(orderId, 5)
            if (result) {
                successAlert("Cancel order status successful")
            } else {
                errorAlert("Cancel order status failed!")
            }
            close()
        }


        return <>
            <div className={cx('form_update')}>
                <div className={cx('order_code')}>
                    {orderCode}
                </div>
                <div className={cx('btn_update')}>
                    {
                        <button onClick={() => updateStatus()}>
                            {getNameOrderStatus(statusN)}
                        </button>
                    }
                </div>
                {statusN !== 3 && statusN !== 4 && statusN !== 5 &&
                    <div className={cx('btn_cancel')}>
                        <button onClick={() => cancelOrder()}>Cancel Order</button>
                    </div>
                }
                <div className={cx('btn_exit')}>
                    <button onClick={() => { close() }}>Exit</button>
                </div>
            </div>
        </>
    }

    const Row = ({ item, index }) => {
        return <>
            <tr key={index}>
                <td>{index}</td>
                <td>{item?.order?.code}</td>
                <td>{formatDate(new Date(item?.order?.initTime))}</td>
                <td><span className={cx(item?.progressingOrder?.exchangeId === null ? 'w' : 's')}>{item?.progressingOrder?.exchangeId === null ? "Unpaid" : "Paid"}</span></td>
                <td><span className={cx(item?.progressingOrder?.statusOrder === 3 ? 's' : (item?.progressingOrder?.statusOrder > 3 ? 'e' : 'w'))}>{getNameOrderStatus(item?.progressingOrder?.statusOrder)}</span></td>
                <td>
                    <button className={cx('btn_update')}
                        onClick={() => { setFormUpdateStatus([item?.order?.code, item?.order?.id, item?.progressingOrder?.statusOrder]) }}>
                        Update
                    </button>
                </td>
                <td><button className={cx('btn_see_details')}>View order details</button></td>
            </tr>
        </>
    }

    return (<>
        <div className={cx('orders')}>
            <div className={cx('header')}>
                <div className={cx('header_item')} style={headerItem === 1 ? { borderBottom: '5px solid green' } : {}}
                    onClick={() => setHeaderItem(1)}>All{headerItem === 1 && "(" + ordersRender.length + ")"}
                </div>
                <div className={cx('header_item')} style={headerItem === 2 ? { borderBottom: '5px solid green' } : {}}
                    onClick={() => setHeaderItem(2)}>Wait Confirmation{headerItem === 2 && "(" + ordersRender.length + ")"}
                </div>
                <div className={cx('header_item')} style={headerItem === 3 ? { borderBottom: '5px solid green' } : {}}
                    onClick={() => setHeaderItem(3)}>Being packaged{headerItem === 3 && "(" + ordersRender.length + ")"}
                </div>
                <div className={cx('header_item')} style={headerItem === 4 ? { borderBottom: '5px solid green' } : {}}
                    onClick={() => setHeaderItem(4)}>Being transported{headerItem === 4 && "(" + ordersRender.length + ")"}
                </div>
                <div className={cx('header_item')} style={headerItem === 5 ? { borderBottom: '5px solid green' } : {}}
                    onClick={() => setHeaderItem(5)}>Complete{headerItem === 5 && "(" + ordersRender.length + ")"}
                </div>
                <div className={cx('header_item')} style={headerItem === 6 ? { borderBottom: '5px solid green' } : {}}
                    onClick={() => setHeaderItem(6)}>Cancel{headerItem === 6 && "(" + ordersRender.length + ")"}
                </div>
            </div>
            <div className={cx('search_bar')}>
                <input ref={searchRef} placeholder="Search ..." onChange={() => { handleSearch() }} />
                <CiSearch style={{ fontSize: '35px' }} />
                <input ref={dateFromRef} onChange={() => { handleSearch() }} type="date" id="from" name="birthday" />
                <input ref={dateToRef} onChange={() => { handleSearch() }} type="date" id="to" name="birthday" />
            </div>
            <div className={cx('active')}>
                {
                    ((headerItem === 2 || headerItem === 3 || headerItem === 4) && ordersRender.length > 0) &&
                    <>
                        <button className={cx('update_all')} onClick={() => { updateAll() }}>
                            Update All
                        </button>
                        <button className={cx('cancel_all')} onClick={() => {cancelAll()}}>
                            Cancel All
                        </button>
                    </>
                }
            </div>
            <div className={cx('table')}>
                {formUpdateStatus[0] !== -1 && formUpdateStatus[0] !== -1 && formUpdateStatus[0] !== -1 &&
                    <FormUpdateStatus
                        orderCode={formUpdateStatus[0]}
                        orderId={formUpdateStatus[1]}
                        statusN={formUpdateStatus[2]} close={() => {
                            fetchOrder()
                            setFormUpdateStatus([-1, -1, -1])
                        }} />}
                <table>
                    <thead>
                        <tr>
                            <td>id</td>
                            <td>code</td>
                            <td>time</td>
                            <td>payment status</td>
                            <td>order status</td>
                            <td>update order status</td>
                            <td>View order details</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ordersRender?.map((item, index) => {
                                return <Row item={item} index={index} />
                            })
                        }
                        {
                            ordersRender?.length === 0 && <>
                                <tr className={cx('no-data')}>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>NO DATA</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </>);
}

export default Order;