import { defaults } from "chart.js/auto";
import classNames from "classnames/bind";
import { Doughnut, Line } from "react-chartjs-2";
import styles from "./index.module.scss";
function DashBoard() {
    const cx = classNames.bind(styles)
    defaults.maintainAspectRatio = false
    defaults.responsive = true

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const revenueData = [1000, 1500, 2000, 1800, 2200, 2500, 2300, 2100, 1900, 1800, 1700, 1600];
    const product = [2000, 900, 2000, 1900, 2200, 2800, 1000, 1800, 1900, 2800, 1600, 1900];

    const category = ['Mini', 'Big size', 'House']
    const data = [200, 500, 900]
    return (<>
        <div className={cx('dashboard')}>
            <div className={cx('topic-1')}>
                <div className={cx('topic-1-container')}>
                    <div className={cx('total-user', 'topic-1-item')}>
                        <div className={cx('title')}>User</div>
                        <div className={cx('data')}>
                            <h1 className={cx('total')}>167<span>USER</span></h1>
                        </div>
                    </div>
                    <div className={cx('total-revenue-day', 'topic-1-item')}>
                        <div className={cx('title')}>Daily Revenue</div>
                        <div className={cx('data')}>
                            <h1 className={cx('total')}>1300000<span>VND</span></h1>
                        </div>
                    </div>
                    <div className={cx('total-revenue-month', 'topic-1-item')}>
                        <div className={cx('title')}>Monthly Revenue</div>
                        <div className={cx('data')}>
                            <h1 className={cx('total')}>17889999<span>VND</span></h1>
                        </div>
                    </div>
                    <div className={cx('total-revenue-month', 'topic-1-item')}>
                        <div className={cx('title')}>Monthly Revenue</div>
                        <div className={cx('data')}>
                            <h1 className={cx('total')}>17889999<span>VND</span></h1>
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
                                    label: 'Revenue', // Label for the dataset
                                    data: revenueData,
                                    borderColor: 'rgba(255, 0, 0, 0.6)', // Màu đường biên cho dữ liệu doanh thu
                                    pointBackgroundColor: 'red', // Màu nền điểm cho dữ liệu doanh thu
                                    backgroundColor: 'rgba(255, 0, 0, 0.2)' // Màu nền cho dữ liệu doanh thu
                                  },
                                  {
                                    label: 'Product', // Label for the dataset
                                    data: product,
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
                    <Doughnut
                        data = {{
                            labels: category,
                            datasets: [{
                                data: data
                            }]
                        }}
                    />
                </div>
            </div>
        </div>
    </>);
}

export default DashBoard;