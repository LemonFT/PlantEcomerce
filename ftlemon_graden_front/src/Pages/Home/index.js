import classNames from "classnames/bind";
import React, { useContext, useState } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import { BsBoxSeam, BsChatRightQuote, BsTelephoneInbound } from "react-icons/bs";
import { CiSearch, CiStar } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";
import { SiMobxstatetree } from "react-icons/si";

import Header from "../../Components/Header";

import ar1 from "../../Images/arrow-freestyle-.png";
import ar2 from "../../Images/arrow_freestyle.png";
import img_bg_sl_05 from "../../Images/bg.png";
import img_product_sl_one from "../../Images/bgtree3.jpeg";
import img_product01_sl_one from "../../Images/re.webp";

import Footer from "../../Components/Footer";
import SideBar from "../../Components/SideBar";
import { DataContext } from "../../Provider/DataProvider";
import Message from "../Message";
import styles from "./index.module.scss";

function Home() {
    AOS.init({
        offset: 200,
        duration: 600,
        easing: 'ease-in-sine',
        once: false,
        delay: 100,
    });
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const {user} = useContext(DataContext)
    
    const SlideOne = () => {
        return <>
            <div className={cx('slide-one')}>
                <div className={cx('content')}>
                    <div className={cx('title')} >
                        <h1>Buy Your Dream Plants?</h1>
                    </div>
                    <div className={cx('statistics')}>
                        <div className={cx('plant-specials')}>
                            <h3>50+</h3>
                            <h5>Plant specials</h5>
                        </div>
                        <div className={cx('customers')}>
                            <h3>100+</h3>
                            <h5>Customers</h5>
                        </div>
                    </div>
                    <div className={cx('box-input')}  >
                        <input placeholder="What are you looking for?" />
                        <span><CiSearch style={styleIcon} /></span>
                    </div>
                </div>
                <div className={cx('image')}>
                    <img className={cx('ar1')} src={ar1} alt=""   />
                    <div className={cx('img-product')}>
                        <img src={img_product_sl_one} alt=""  />
                    </div>
                    <img className={cx('ar2')} src={ar2} alt="" />
                </div>
            </div>
        </>
    }
    const SlideTwo = () => {
        const Product = ({ img, name, price }) => {
            return <>
                <div className={cx('product')}>
                    <img src={img} alt="" />
                    <h3>{name}</h3>
                    <span>{price}</span>
                </div>
            </>
        }
        return <>
            <div className={cx('slide-two')}>
                <div className={cx('left')} data-aos='fade-right'>
                    <div className={cx('title')}>
                        <h2>Best selling plants</h2>
                    </div>
                    <div className={cx('para')}>
                        <h5>Easiest way to healthy life by buying your favorite plants</h5>
                    </div>
                    <div className={cx('button')}>
                        <button>See more</button>
                        <span><IoIosArrowRoundForward style={styleIcon} /></span>
                    </div>
                </div>
                <div className={cx('right')}>
                    <div className={cx('list-product')}>
                        <Product img={img_product01_sl_one} name={"Natural Plants"} price={"1 400 000"} />
                        <Product img={img_product01_sl_one} name={"Natural Plants"} price={"1 400 000"} />
                        <Product img={img_product01_sl_one} name={"Natural Plants"} price={"1 400 000"} />
                        <Product img={img_product01_sl_one} name={"Natural Plants"} price={"1 400 000"} />
                        <Product img={img_product01_sl_one} name={"Natural Plants"} price={"1 400 000"} />
                        <Product img={img_product01_sl_one} name={"Natural Plants"} price={"1 400 000"} />
                    </div>
                </div>
            </div>
        </>
    }
    const SlideThree = () => {
        const Item = ({ icon, title, text, delay }) => {
            return <>
                <div className={cx('item')} data-aos="fade-up" data-aos-delay={delay ? { delay } : "300"}>
                    <div className={cx('icon')}>
                        <span>{icon}</span>
                    </div>
                    <div className={cx('title')}>
                        <h4>{title}</h4>
                    </div>
                    <div className={cx('text')}>
                        <p>{text}</p>
                    </div>
                </div>
            </>
        }
        return <>
            <div className={cx('slide-three')}>
                <div className={cx('bgColor')} data-aos='zoom-in' data-aos-delay='300'></div>
                <div className={cx('title')}>
                    <h2>About us</h2>
                </div>
                <div className={cx('desc')}>
                    <p>Order now and appreciate the beauty of nature</p>
                </div>
                <div className={cx('content')}>
                    <Item icon={<SiMobxstatetree style={styleIcon} />} title={"Large Assortment"} text={"we offer many different types of products with fewer variations in each category"} delay={"100"} />
                    <Item icon={<BsBoxSeam style={styleIcon} />} title={"Fast & Free shipping"} text={"4-day or less delivery time, free shipping and an expedited delivery option"} />
                    <Item icon={<BsTelephoneInbound style={styleIcon} />} title={"24/7 Support"} text={"answer to any bussiness related inquiry 24/7 and in real-time"} delay={"200"} />
                </div>
            </div>
        </>
    }
    const SlideFour = () => {
        const Item = ({ img, name, textDesc }) => {
            return <>
                <div className={cx('item')} data-aos='zoom-in'>
                    <div className={cx('img')}>
                        <img src={img} alt="" />
                    </div>
                    <div className={cx('name_desc')}>
                        <h4>{name}</h4>
                        <p>{textDesc}</p>
                    </div>
                </div>
            </>
        }
        return <>
            <div className={cx('slide-four')}>
                <div className={cx('title')} data-aos='fade-right'>
                    <h2>Categories</h2>
                </div>
                <div className={cx('desc')} data-aos='fade-left'>
                    <p>Find what you are looking for</p>
                </div>
                <div className={cx('content')} >
                    <Item img={"https://www.thespruce.com/thmb/DyIlrPA8eFm8mkK7kol4qVLMdGg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/grow-dracaena-marginata-indoors-1902749-2-d24676ea7eae47718573d21f95698acf.jpg"} name={"Natural Plants"} textDesc={"Horem ipsum dolor sit amet, consectetur adipiscing elit"} />
                    <Item img={"https://www.thespruce.com/thmb/X2MKBmSm9dWCoTZMLsxOp_zZOgg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/grow-sedum-morganianum-1902975-recirc-839104cec16c4a96a402ea77521c097c-92cf3b6835ee41188e95b6f811dca3b8.jpg"} name={"Natural Plants"} textDesc={"Horem ipsum dolor sit amet, consectetur adipiscing elit"} />
                    <Item img={"https://www.thespruce.com/thmb/KfCbulbsf1ktBb3j-J-I6-0rPtw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/growing-string-of-buttons-5091592-hero-b31274a4900c41b8b2e46c849be9a5d2.jpg"} name={"Natural Plants"} textDesc={"Horem ipsum dolor sit amet, consectetur adipiscing elit"} />
                </div>
            </div>
        </>
    }
    const SlideFive = () => {
        const [focus, setFocus] = useState(1);
        const handleFocus = (id) => {
            setFocus(id);
        }
        const Item = ({ text, img, star }) => {
            return <>
                <div className={cx('item')}>
                    <div className={cx('text')}>
                        <p>{text}</p>
                    </div>
                    <div className={cx('by')}>
                        <div className={cx('avatar')}>
                            <BsChatRightQuote style={styleIcon}/>
                            <img src={img} alt="" />
                        </div>
                        <div className={cx('star')}>
                            <b>{star}</b>
                            <span> <CiStar style={styleIcon} /></span>
                        </div>
                    </div>
                </div>
            </>
        }
        return <>
            <div className={cx('slide-five')}>
                <div className={cx('bg')}>
                    <img src={img_bg_sl_05} alt="" />
                </div>
                <div className={cx('header')}>
                    <div className={cx('title')}>
                        <h2>What customers say about GREEMIND?</h2>
                    </div>
                    <div className={cx('navi')}>
                        <span className={cx('lineNavi')} onClick={() => handleFocus(1)} style={focus === 1 ? { width: '40px' } : { width: '20px' }}></span>
                        <span className={cx('lineNavi')} onClick={() => handleFocus(2)} style={focus === 2 ? { width: '40px' } : { width: '20px' }}></span>
                        <span className={cx('lineNavi')} onClick={() => handleFocus(3)} style={focus === 3 ? { width: '40px' } : { width: '20px' }}></span>
                    </div>
                </div>
                <div className={cx('recomments')}>
                    <Item text={"Note that the development build is not optimized.To create a production build"}
                        img={"https://lh3.googleusercontent.com/a/ACg8ocI1NUQG518i-DNJGnhW59N0pO4w2UnqhT4tRVSHUMhqumE=s360-c-no"}
                        star={"5"}
                    />
                    <Item text={"Note that the development build is not optimized.To create a production build"}
                        img={"https://lh3.googleusercontent.com/a/ACg8ocI1NUQG518i-DNJGnhW59N0pO4w2UnqhT4tRVSHUMhqumE=s360-c-no"}
                        star={"5"}
                    />
                </div>
            </div>
        </>
    }
    return (
        <>
            <Header />
            {user && <Message />}
            <div className={cx('home')}>
                <SlideOne />
                <SlideTwo />
                <SlideThree />
                <SlideFour />
                <SlideFive />
            </div>
            <Footer />
            <SideBar />
        </>
    );
}

export default Home;