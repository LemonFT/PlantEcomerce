/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import { useContext, useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getAllMessage } from "../../Data/message";
import { formatDateHHmmSS } from "../../Global";
import lg from "../../Images/lg.png";
import { DataContext } from "../../Provider/DataProvider";
import { EffectContext } from "../../Provider/EffectProvider";
import styles from "./index.module.scss";

function Message() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }

    const lastDivRef = useRef(null);
    const refInput = useRef(null)
    const {messOpen} = useContext(EffectContext)
    const {user} = useContext(DataContext)
    const style = messOpen ? { transform: 'translateY(0)' } : { transform: 'translateY(-100%) scale(0.5)' }

    const [messages, setMessages] = useState([])
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const data = await getAllMessage(user?.id)
                setMessages(data)
            } catch (error) {
            }
        }
        fetchMessage()
    }, [])


    useEffect(() => {
        setTimeout(() => {
            lastDivRef?.current?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
    }, [messages])


    useEffect(() => {
        const socket = new SockJS(process.env.REACT_APP_BASEURL+process.env.REACT_APP_URL_SOCKET);
        const client = Stomp.over(socket);
        const subscribeUrl = process.env.REACT_APP_FRONT_URL_SUBSCRIBE + process.env.REACT_APP_ADMIN_ROLE + process.env.REACT_APP_BACK_URL_SUBSCRIBE
        client.connect({}, () => {
            client.subscribe(subscribeUrl, async (response) => {
                const data = await getAllMessage(user?.id)
                setMessages(data)
            })
        }, () => {
        })


        setStompClient(client);

        return () => {
            if (!client) {
                client.disconnect();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendMessage = () => {
        const value = refInput.current.value
        stompClient.send(process.env.REACT_APP_SOCKET_SEND, {},
            JSON.stringify({
                user_send_id: user?.id,
                content: value,
            })
        );
        setMessages((prev) => ([
            ...prev, {
                message: {
                    id: user?.id,
                    user_send_id: user?.id,
                    content: value,
                    time: (new Date())
                }
            }
        ]))
        refInput.current.value = "";
    }


    return (<>
        <div className={cx('message')} style={style}>
            <div className={cx('header')}>
                <div className={cx('info')}>
                    <img src={lg} alt="" />
                </div>
            </div>
            <div className={cx('container')}>
                {
                    messages?.map((item, index) => {
                        return <div key={index} ref={index === (messages.length-1) ? lastDivRef : null} className={item.message.user_send_id === user?.id ? cx('customer') : cx('admin')}>
                                <div>
                                    {item.message.user_send_id !== user?.id && <img src={lg} alt="" />}
                                    <p>
                                        {item?.message?.content}
                                    </p>
                                </div>
                                <span>{formatDateHHmmSS(new Date(item?.message?.time))}</span>
                            </div>
                    })
                }
            </div>
            <div className={cx('edit_text')}>
                <input ref={refInput} placeholder="Bạn cần gì nào" onKeyDown={(event) => {
                    if(event.key === 'Enter'){
                        sendMessage()
                    }
                }}/>
                <button onClick={() => sendMessage()}><IoIosSend style={styleIcon} /></button>
            </div>
        </div>
    </>);
}

export default Message;