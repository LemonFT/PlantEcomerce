import classNames from "classnames/bind";
import { GiCheckMark } from "react-icons/gi";
import { MdCloseFullscreen } from "react-icons/md";
import styles from "./index.module.scss";

function Alert({setShow, type, title, content, centerVertical}) {
    const cx = classNames.bind(styles)
    const styleIcon = {fontSize: '25px'}
    return (<>
        <div className={cx('box_alert', type)} style={centerVertical ? {top: '50%'}: {}}>
            <div className={cx('icon')}>
                <span>
                    <GiCheckMark style={styleIcon}  />
                </span>
            </div>
            <div className={cx('text')}>
                <div className={cx('header')}>
                    <h3>{title}</h3>
                </div>
                <div className={cx('content')}>
                    <p>{content}</p>
                </div>
            </div>
            <span className={cx('close')} onClick={() => setShow()}>
                <MdCloseFullscreen  style={styleIcon}/>
            </span>
        </div>
    </>);
}

export default Alert;