/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CiSearch, CiTrash } from "react-icons/ci";
import { FaRegMessage } from "react-icons/fa6";
import { LuSendHorizonal } from "react-icons/lu";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { errorAlert, successAlert } from "../../../Components/Alert";
import { deleteUserChat, getAllMessage } from "../../../Data/message";
import { formatDate } from "../../../Global";
import user_img from "../../../Images/user_img.png";
import { DataContext } from "../../../Provider/DataProvider";
import styles from "./index.module.scss";


function Message() {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '30px' }

    const refInput = useRef(null)
    const keySearch = useRef(null)
    const lastDivRef = useRef(null);
    const messageListRef = useRef(null)
    const [messages, setMessages] = useState([])
    const [listMessCustomer, setListMessCustomer] = useState([])
    const [listMessCustomerRender, setListMessCustomerRender] = useState([])
    const [listMessageAdmin, setListMessAdmin] = useState([])
    const [focus, setFocus] = useState(0);
    const [userChat, setUserChat] = useState()
    const [messageRender, setMessageRender] = useState([])
    const [stompClient, setStompClient] = useState(null)
    const { user } = useContext(DataContext)


    //load mess api
    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const data = await getAllMessage(user?.id);
                setMessages(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchMessage()
    }, [])

    //Lấy tin nhắn theo user_id
    useEffect(() => {
        let listMessages = []
        setListMessCustomer([])
        setListMessAdmin([])
        messages?.forEach((item) => {
            if (listMessages.length === 0) {
                listMessages.push({
                    user_id: item.user.id,
                    avatar: item.user.avatar,
                    name: item.user.username,
                    isCustomer: item.user.roleId.toString() === process.env.REACT_APP_CUSTOMER_ROLE,
                    messages: [
                        {
                            content: item.message.content,
                            time: item.message.time,
                            user_send_id: item.message.user_send_id,
                            user_receive_id: item.message.user_receive_id
                        }
                    ]
                })
            } else {
                let userFound = false;
                listMessages.forEach((i) => {
                    if (i.user_id === item.user.id) {
                        i.messages = [
                            ...i.messages,
                            {
                                content: item.message.content,
                                time: item.message.time,
                                user_send_id: item.message.user_send_id,
                                user_receive_id: item.message.user_receive_id
                            }
                        ];
                        (i.messages)?.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
                        userFound = true;
                    }
                });
                if (!userFound) {
                    listMessages.push({
                        user_id: item.user.id,
                        avatar: item.user.avatar,
                        name: item.user.username,
                        isCustomer: item.user.roleId.toString() === process.env.REACT_APP_CUSTOMER_ROLE,
                        messages: [
                            {
                                content: item.message.content,
                                time: item.message.time,
                                user_send_id: item.message.user_send_id,
                                user_receive_id: item.message.user_receive_id
                            }
                        ]

                    });
                }
            }
        })
        listMessages.sort((a, b) => {
            return new Date((b.messages)[0].time)?.getTime() - new Date((a.messages)[0].time)?.getTime()
        })
        listMessages.forEach((item) => {
            if (item.isCustomer) {
                setListMessCustomer((prevList) => [...prevList, item]);
            } else {
                setListMessAdmin((prevList) => [...prevList, item]);
            }
        })
    }, [messages])

    useEffect(() => {
        setListMessCustomerRender(listMessCustomer)
    }, [listMessCustomer])

    const searchUserMessage = () => {
        const filteredMessages = listMessCustomer.filter((item) => {
            return item.name.toLowerCase().includes(keySearch.current.value.toLowerCase())
                    || keySearch.current.value.toLowerCase().includes(item.name.toLowerCase())
        });
        setTimeout(() => {
            setListMessCustomerRender(filteredMessages);
        }, 1000)
    }
    

    //render message
    useEffect(() => {
        let listChat = []
        userChat?.messages?.forEach((item) => {
            listChat.push({
                isCustomer: true,
                avatar: userChat.avatar,
                name: userChat.name,
                content: item.content,
                time: item.time
            })
        })
        listMessageAdmin?.forEach((item) => {
            (item.messages)?.forEach((mess) => {
                if (userChat?.user_id === mess.user_receive_id) {
                    listChat.push({
                        isCustomer: false,
                        avatar: item.avatar,
                        name: item.name,
                        content: mess.content,
                        time: mess.time
                    })
                }
            })
        })
        listChat.sort((a, b) => {
            return new Date(a.time).getTime() - new Date(b.time).getTime()
        })
        setMessageRender(listChat)
    }, [userChat])

    useLayoutEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messageRender]);

    //socket
    useEffect(() => {
        const socket = new SockJS(process.env.REACT_APP_BASEURL + process.env.REACT_APP_URL_SOCKET);
        const client = Stomp.over(socket);
        const subscribeUrl = process.env.REACT_APP_CUSTOMER_CHANEL
        client.connect({}, () => {
            client.subscribe(subscribeUrl, async (response) => {
                const data = await getAllMessage(1)
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
    }, [])

    function getCurrentISOString() {
        const date = new Date();
        const isoString = date.toISOString();
        return isoString;
    }

    const sendMessage = async () => {
        const value = refInput.current.value
        stompClient.send(process.env.REACT_APP_SOCKET_SEND, {},
            JSON.stringify({
                user_send_id: user?.id,
                user_receive_id: userChat.user_id,
                content: value,
            })
        );

        setMessageRender((prev) => (
            [
                ...prev, {
                    isCustomer: false,
                    avatar: user.avatar,
                    name: user.name,
                    content: value,
                    time: getCurrentISOString()
                }
            ]
        ))
        refInput.current.value = ""
    }

    useEffect(() => {
        setTimeout(() => {
            lastDivRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 200);
    }, [messages, userChat])

    const Item = ({ index, item, image, name, mess, count }) => {
        const handleFocus = (index) => {
            setFocus(index)
        }

        useEffect(() => {
            if (index === focus) {
                setUserChat(item);
            }
        }, [index, focus, item]);

        const truncateContent = (str, maxLength) => {
            return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
        };

        const deleteMessUser = async (userId) => {
            const result = await deleteUserChat(userId)
            if (result) {
                const data = await getAllMessage(user?.id);
                setMessages(data);
                setFocus(0)
                successAlert("Chat deleted successful")
            } else {
                errorAlert("Failed to delete chat!")
            }
        }
        return <>
            <div className={index === focus ? cx('item', 'focus') : cx('item')} onClick={() => handleFocus(index)}>
                <div className={cx('avatar')}>
                    <img src={image || user_img} alt="" />
                </div>
                <div className={cx('content')}>
                    <div className={cx('name')}>
                        {name}
                    </div>
                    <div className={cx('mess')}>
                        {truncateContent(mess, 20)}
                    </div>
                </div>
                <div className={cx('delete')}>
                    <CiTrash style={styleIcon} onClick={() => deleteMessUser(item.user_id)} />
                </div>
            </div>
        </>
    }
    return (<>
        <div className={cx('chat')}>
            <div className={cx('customers')}>
                <div className={cx('input')}>
                    <input placeholder="Search" ref={keySearch} />
                    <span onClick={() => {
                        searchUserMessage()
                    }}><CiSearch style={styleIcon} /></span>
                </div>
                <div className={cx('items')}>
                    {
                        listMessCustomerRender?.map((item, index) => {
                            return item.isCustomer && <>
                                <Item key={index} item={item} index={index} image={item.avatar}
                                    name={item.name}
                                    mess={item.messages[0]?.content} />
                            </>
                        })
                    }
                    {
                        listMessCustomerRender?.length === 0 && <>
                            <div style={{marginTop: '200px', textTransform: 'uppercase', fontSize: '13px'}}>Chưa có tin nhắn nào</div>
                            <div><FaRegMessage style={{fontSize: '50px'}}/></div>
                        </>
                    }
                </div>
            </div>
            <div className={cx('container_chat')}>
                <div className={cx('header')}>
                    <div className={cx('image')}>
                        <img src={userChat?.avatar || user_img} alt="" />
                    </div>
                    <div className={cx('name')}>
                        {userChat?.name}
                    </div>
                </div>
                <div className={cx('box_messages')} ref={messageListRef}>
                    {
                        messageRender?.map((item, index) => {
                            return <>
                                <div>
                                    <div ref={index === (messageRender.length - 1) ? lastDivRef : null} className={item?.isCustomer ? cx('message', 'customer') : cx('message', 'admin')}>
                                        <div className={cx('avatar')}>
                                            <img src={item?.avatar || user_img} alt="" />
                                        </div>
                                        <div className={cx('content')}>
                                            <div className={cx('mess')}>
                                                <h4>{item?.content}</h4>
                                            </div>
                                            <div className={cx('time')}>
                                                <span>
                                                    {formatDate(new Date(item?.time))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        })
                    }
                </div>
                <div className={cx('input_chat')}>
                    <input ref={refInput} placeholder="Nhập tin nhắn..." onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            sendMessage()
                        }
                    }} />
                    <span onClick={() => sendMessage()}><LuSendHorizonal style={styleIcon} /></span>
                </div>
            </div>
        </div>
    </>);
}

export default Message;