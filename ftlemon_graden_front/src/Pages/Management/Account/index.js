/* eslint-disable react-hooks/exhaustive-deps */
import Tippy from "@tippyjs/react";
import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { IoPersonAddOutline } from "react-icons/io5";
import { MdOutlineSaveAlt } from "react-icons/md";
import validator from "validator";
import { errorAlert, processAlert, successAlert, warningAlert } from "../../../Components/Alert";
import { getAllRole } from "../../../Data/role";
import { deleteAccount, getAllAccounts, updateAccount } from "../../../Data/user";
import { formatDate, useDebounce } from "../../../Global";
import { DataContext } from "../../../Provider/DataProvider";
import BoxAddAccountAndRole from "./BoxAddAccountAndRole";
import styles from "./index.module.scss";

function Account() {
    const cx = classNames.bind(styles)
    const keySearch = useRef(null)
    const styleIcon = { fontSize: '30px' }
    const {user} = useContext(DataContext)
    const [accounts, setAccounts] = useState([])
    const [roles, setRoles] = useState([])
    const [showFormAddAccount, setShowFormAddAccount] = useState(false)
    const [accountsRender, setAccountsRender] = useState([])

    useEffect(() => {
        fetchUsers()
        fetchRole()
    }, [])

    useEffect(() => {
        handleSearch(keySearch.current.value)
    }, [accounts]);

    const handleSearch = (searchValue) => {
        const keySearchStrLowerCase = searchValue.toString().toLowerCase();
        const filteredAccounts = accounts.filter((item) => {
            return (
                (item.id.toString().toLowerCase().includes(keySearchStrLowerCase) ||
                keySearchStrLowerCase.includes(item.id.toString().toLowerCase()) ||
                item.email.toLowerCase().includes(keySearchStrLowerCase) ||
                keySearchStrLowerCase.includes(item.email.toLowerCase()) ||
                item.name.toLowerCase().includes(keySearchStrLowerCase) ||
                keySearchStrLowerCase.includes(item.name.toLowerCase())) && item.id !== user.id
            );
        });
        setAccountsRender(filteredAccounts);
    }

    const fetchUsers = async () => {
        const result = await getAllAccounts()
        setAccounts(result)
    }

    const fetchRole = async () => {
        const result = await getAllRole()
        setRoles(result)
    }

    const getRoleById = (id) => {
        const roleItem = roles?.find((item) => item.id === id)
        return roleItem?.name || ""
    }

    const resultSearch = useDebounce(handleSearch, 1000)
    const handleSearchDebounce = () => {
        resultSearch(keySearch.current.value)
    }

    const Row = ({ account, index }) => {
        const emailRef = useRef(null)
        const usernameRef = useRef(null)
        const blockRef = useRef(null)

        const getPermissionString = () => {
            let str = "";
            if (account && account.permissions) {
                str = account.permissions.map(item => item.name).join(" - ");
            }
            return str;
        };

        const saveUpdate = async () => {
            console.log(blockRef.current.checked)
            const emailStr = emailRef.current.value
            const usernameStr = usernameRef.current.value
            if(!validator.isEmail(emailStr)){
                warningAlert("Email invalid!")
                return
            }
            if(usernameStr.length < 6){
                warningAlert("Username invalid (>=6)!")
                return
            }
            const resultUpdate = await updateAccount({
                id: account.id,
                email: emailStr,
                username: usernameStr,
                block: blockRef.current.checked
            })
            processAlert("The update is in progress", "Completed in");
            setTimeout(() => {
                if(resultUpdate === "Update successful"){
                    successAlert(resultUpdate)
                    fetchUsers()
                }else{
                    errorAlert(resultUpdate)
                }
            }, 1200);
        }

        const deleteAcc = async () => {
            const resultDelete = await deleteAccount(account.id)
            processAlert("The delete is in progress", "Completed in");
            setTimeout(() => {
                if(resultDelete === "Delete account successful"){
                    successAlert(resultDelete)
                    fetchUsers()
                }else{
                    errorAlert(resultDelete)
                }
            }, 1200);
        }

    

        return <>
            <tr key={index} className={cx('row')}>
                <td>{account.id}</td>
                <td><input ref={emailRef} defaultValue={account.email} /></td>
                <td><input ref={usernameRef} defaultValue={account.name} /></td>
                <td>{formatDate(new Date(account.joinDate))}</td>
                <td>
                    <span>
                        {getRoleById(account.role)}
                    </span>
                    <Tippy content="Edit now">
                        <span>
                            <CiEdit style={{ fontSize: '20px' }} />
                        </span>
                    </Tippy>
                </td>
                <td>{getPermissionString()}</td>
                <td>
                    <input ref={blockRef} type="checkbox" defaultChecked={account.block} />
                </td>
                <td>
                    <button className={cx('update-button')} onClick={() => saveUpdate()}>
                        <MdOutlineSaveAlt style={styleIcon} />
                    </button>
                </td>
                <td>
                    <button className={cx('delete-button')}  onClick={() => deleteAcc()}>
                        <CiTrash style={styleIcon} />
                    </button>
                </td>
            </tr>
        </>
    }

    return (<>
        <div className={cx('account')}>
            <div className={cx('header')}>
                <div className={cx('search')}><input onChange={() => handleSearchDebounce()} ref={keySearch} placeholder="Search..." /></div>
                <button onClick={() => {
                    setShowFormAddAccount(true)
                }}>
                    <span>Add account</span>
                    <span>
                        <IoPersonAddOutline style={styleIcon} />
                    </span>
                </button>
            </div>
            <div className={cx('container')}>
                <div className={cx('table_account')}>
                    <div className={cx('table')}>
                        <table>
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>EMAIL</td>
                                    <td>USERNAME</td>
                                    <td>JOIN DATE</td>
                                    <td>ROLE_ID</td>
                                    <td>PERMISSIONS</td>
                                    <td>BLOCK</td>
                                    <td>Save</td>
                                    <td>DELETE</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    accountsRender?.map((item, index) => (
                                        <Row key={item.id} account={item} index={index} />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                showFormAddAccount && <BoxAddAccountAndRole loadAccount={() => {fetchUsers()}} close={() => setShowFormAddAccount(false)} />
            }
        </div>
    </>);
}
export default Account;