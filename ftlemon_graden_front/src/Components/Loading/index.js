import classNames from "classnames/bind";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import styles from "./index.module.scss";

function Loading() {
    const cx = classNames.bind(styles)
    return (<>
        <div className={cx('loading')}>
            <span>
                <AiOutlineLoading3Quarters style={{ fontSize: '50px', fontWeight: 'bold' }} />
            </span>
        </div>
    </>);
}

export default Loading;