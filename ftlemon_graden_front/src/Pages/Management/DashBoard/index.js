/* eslint-disable react-hooks/exhaustive-deps */
import { defaults } from "chart.js/auto";
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { BsCashCoin } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { GrVisa } from "react-icons/gr";
import { RiPlantFill } from "react-icons/ri";
import { getCostImport } from "../../../Data/import";
import { getRevenueFromSuccess } from "../../../Data/order";
import { getStatistics } from "../../../Data/statistic";
import styles from "./index.module.scss";
function DashBoard() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    defaults.maintainAspectRatio = false
    defaults.responsive = true
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [costImportChart, setCostImportChart] = useState([])
    const [costImport, setCostImport] = useState([])
    const [revenueChart, setRevenueChart] = useState([])
    const [revenue, setRevenue] = useState([])
    const [statistics, setStatistics] = useState(null)
    const [categoryName, setCategoryName] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const year = new Date().getFullYear()
    const dateToRef = useRef(null)
    const dateFromRef = useRef(null)

    useEffect(() => {
        fetchDataProduct()
        fetchDataRevenueSuccess()
        fetchDataStatistics()
    }, [])

    const fetchDataProduct = async () => {
        const result = await getCostImport(year)
        if (result !== null) {
            setCostImport(result)
        }
    }

    const fetchDataRevenueSuccess = async () => {
        const result = await getRevenueFromSuccess(year)
        console.log(result)
        if (result !== null) {
            setRevenue(result)
        }
    }

    const fetchDataStatistics = async () => {
        const result = await getStatistics(year)
        if (result !== null) {
            setStatistics(result)
        }
    }


    const getValueByMonth = (data, month) => {
        return data.find((item) => item.month === month)?.cost || 0;
    }

    useEffect(() => {
        const list = months.map((item, index) => getValueByMonth(costImport, index));
        setCostImportChart(list);
    }, [costImport]);

    useEffect(() => {
        const list = months.map((item, index) => getValueByMonth(revenue, index));
        setRevenueChart(list);
    }, [revenue])

    useEffect(() => {
        setCategoryName(statistics?.categoryNumberProducts?.map((item) => item?.categoryName))
        setCategoryData(statistics?.categoryNumberProducts?.map((item) => item?.amount))
    }, [statistics])

    return (<>
        <div className={cx('dashboard')}>
            <div className={cx('topic-1')}>
                <div className={cx('topic-1-container')}>
                    <div className={cx('total-user', 'topic-1-item')}>
                        <div className={cx('title')}>
                            <FaUsers style={styleIcon} />
                        </div>
                        <div className={cx('data')}>
                            <h1 className={cx('total')}>{statistics?.users}<span>USER</span></h1>
                        </div>
                    </div>
                    <div className={cx('plants', 'topic-1-item')}>
                        <div className={cx('title')}>
                            <RiPlantFill style={styleIcon} />
                        </div>
                        <div className={cx('data')}>
                            <h1 className={cx('total')}>{statistics?.costProduct}<span>VND</span></h1>
                        </div>
                    </div>
                    <div className={cx('total-revenue-cash', 'topic-1-item')}>
                        <div className={cx('title')}>
                            <BsCashCoin style={styleIcon} />
                        </div>
                        <div className={cx('data')}>
                            <h1 className={cx('total')}>{statistics?.revenueCash}<span>VND</span></h1>
                        </div>
                    </div>
                    <div className={cx('total-revenue-vnpay', 'topic-1-item')}>
                        <div className={cx('title')}>
                            <GrVisa style={styleIcon} />
                        </div>
                        <div className={cx('data')}>
                            <h1 className={cx('total')}>{statistics?.revenueVnPay}<span>VND</span></h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('topic-2-3')}>
                <div className={cx('topic-2')}>
                    <Line
                        data={{
                            labels: months, // X-axis labels
                            datasets: [
                                {
                                    label: 'Revenue from successful order', // Label for the dataset
                                    data: revenueChart,
                                    borderColor: 'rgba(255, 0, 0, 0.6)', // Màu đường biên cho dữ liệu doanh thu
                                    pointBackgroundColor: 'red', // Màu nền điểm cho dữ liệu doanh thu
                                    backgroundColor: 'rgba(255, 0, 0, 0.2)' // Màu nền cho dữ liệu doanh thu
                                },
                                {
                                    label: 'Product Cost Of Goods Sold', // Label for the dataset
                                    data: costImportChart,
                                    borderColor: 'rgba(0, 128, 0, 0.6)', // Màu xanh lá cây cho đường biên cho dữ liệu sản phẩm
                                    pointBackgroundColor: 'green', // Màu xanh lá cây cho nền điểm cho dữ liệu sản phẩm
                                    backgroundColor: 'rgba(0, 128, 0, 0.2)' // Màu xanh lá cây cho nền cho dữ liệu sản phẩm
                                }
                            ]

                        }}
                        options={{
                            elements: {
                                line: {
                                    tension: 0.2,
                                }
                            },
                        }}
                    />
                </div>
                <div className={cx('topic-3')}>
                    {categoryName?.length > 0 && categoryData?.length > 0 && (
                        <Doughnut
                            data={{
                                labels: categoryName,
                                datasets: [{
                                    data: categoryData
                                }]
                            }}
                        />
                    )}
                </div>
            </div>
            {/* <div className={cx('filter')}>
                <input ref={dateFromRef} onChange={() => {  }} type="date" id="from" name="birthday" />
                <input ref={dateToRef} onChange={() => {  }} type="date" id="to" name="birthday" />
            </div>
            <div>
                <table>
                    <tr>
                        <td></td>
                    </tr>
                </table>
            </div> */}
        </div>
    </>);
}

export default DashBoard;