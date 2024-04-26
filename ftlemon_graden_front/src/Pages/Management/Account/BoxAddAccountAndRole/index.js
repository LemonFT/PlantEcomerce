/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { TiArrowBackOutline } from "react-icons/ti";
import validator from "validator";
import { errorAlert, processAlert, successAlert, warningAlert } from "../../../../Components/Alert";
import Combobox from "../../../../Components/Selected";
import { getAllPermisson, getAllPermissonByRoleId, updatePermissionsByRole } from "../../../../Data/permission";
import { getAllRole } from "../../../../Data/role";
import { createAccount } from "../../../../Data/user";
import styles from "../index.module.scss";

function BoxAddAccountAndRole({ close, loadAccount }) {
    const cx = classNames.bind(styles)
    const styleIcon = { fontSize: '25px' }
    const emailRef = useRef(null)
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const [roles, setRoles] = useState([])
    const [permissions, setPermissions] = useState([])
    const [permissionsChecked, setPermissionsChecked] = useState([]) // save checked permission granted
    const [selectedRoleAccount, setSelectedRoleAccount] = useState()
    const [selectedRolePermission, setSelectedRolePermission] = useState() // combobox role selected form permisson
    const [permissionsGranted, setPermissionsGranted] = useState([]) //permission by role
    const [formUpdateNameRole, setUpdateNameRole] = useState(false)

    useEffect(() => {
        fetchRole()
        fetchPermission()
    }, [])

    useEffect(() => {
        handleRoleSelected(selectedRolePermission)
    }, [selectedRolePermission])

    useEffect(() => {
        setPermissionsChecked(permissions.map((item) => {
            return { ...item, checked: checkGrantedPermission(item.id) }
        }))
    }, [permissionsGranted, permissions])

    const fetchRole = async () => {
        const result = await getAllRole()
        if (result !== null) setRoles(result)
    }

    const fetchPermission = async () => {
        const result = await getAllPermisson()
        if (result !== null) setPermissions(result)
    }

    const convertOptionRole = () => {
        return roles?.map((item) => {
            if (item.id.toString() !== process.env.REACT_APP_CUSTOMER_ROLE.toString()) {
                return {
                    value: item?.id,
                    label: item?.name
                }
            } else {
                return null
            }
        }).filter(Boolean)
    }

    const handleRoleSelected = async (roleId) => {
        if (roleId) {
            const result = await getAllPermissonByRoleId(roleId)
            if (result !== null) {
                setPermissionsGranted(result)
            }
        }
    }

    const checkGrantedPermission = (permissionId) => {
        return permissionsGranted.some((item) => item.permissionId === permissionId);
    };

    const handleCheckboxChange = (permissionId) => {
        const updatedPermissions = permissionsChecked.map(item => {
            if (item.id === permissionId) {
                return { ...item, checked: !item.checked };
            }
            return item;
        });
        setPermissionsChecked(updatedPermissions);
    };

    const updatePermissionByRole = async () => {
        const roleId = selectedRolePermission
        const permissions = permissionsChecked
            .filter(item => item.checked === true)
            .map(item => item.id);
        const resultUpdate = await updatePermissionsByRole({
            roleId: roleId,
            permissions: permissions
        })
        if (resultUpdate) {
            handleRoleSelected(roleId)
            successAlert("Update permissons by role successful")
        } else {
            errorAlert("Update permissions by role failed!")
        }
    }

    const FormUpdateName = () => {
        const [role, setRole] = useState()
        const handleUpdateName = () => {
            
        }
        return <>
            <div className={cx('form_update_name')}>
                <span onClick={() => {setUpdateNameRole(false)}}><IoMdClose style={styleIcon}/> </span>
                <h3>Enter new role name</h3>
                <Combobox options={convertOptionRole()} returnValue={(value) => {setRole(value)}} />
                <div className={cx('name_role')}>
                    <input placeholder="Name role..." />
                </div>
                <button onClick={() => handleUpdateName()}>Save</button>
            </div>
        </>
    }


    const handleCreateNewAccount = async () => {
        const emailStr = emailRef.current.value
        const usernameStr = usernameRef.current.value
        const pwdStr = passwordRef.current.value
        if (!validator.isEmail(emailStr)) {
            warningAlert("Email invalid!")
            return;
        }
        if ((usernameStr).length < 6) {
            warningAlert("Username invalid (>=6)!")
            return;
        }
        if ((pwdStr).length < 8) {
            warningAlert("Password invalid (>=8)!")
            return;
        }
        if (isNaN(selectedRoleAccount)){
            warningAlert("Choose role account, please!")
            return
        }
        const result = await createAccount({
            email: emailStr,
            username: usernameStr,
            password: pwdStr,
            roleId: selectedRoleAccount
        })
        processAlert("The update is in progress", "Completed in");
        setTimeout(() => {
            if(result === "Create account successful"){
                successAlert(result)
                loadAccount()
            }else{
                errorAlert(result)
            }
        }, 1000);
    }

    const clearForm = () => {
        emailRef.current.value = ""
        usernameRef.current.value = ""
        passwordRef.current.value = ""
    }


    return (<>
        <div className={cx('box_add_account')}>
            {
                formUpdateNameRole && <FormUpdateName />
            }
            <div className={cx('icon_back')} onClick={() => { close() }}>
                <span>Back</span>
                <TiArrowBackOutline style={styleIcon} />
            </div>
            <div className={cx('form_add_account')}>
                <div className={cx('title_add_account')}>
                    <h4>Account Information</h4>
                </div>
                <div className={cx('edt', 'edt_email')}>
                    <input ref={emailRef} id="email" placeholder="" />
                    <label htmlFor="email">Email</label>
                </div>
                <div className={cx('edt', 'edt_username')}>
                    <input ref={usernameRef} id="edt_username" placeholder="" />
                    <label htmlFor="edt_username">Username</label>
                </div>
                <div className={cx('edt', 'edt_pwd')}>
                    <input type="password" ref={passwordRef} id="edt_pwd" placeholder="" />
                    <label htmlFor="edt_pwd">Password</label>
                </div>
                <div className={cx('role')}>
                    <Combobox width={300} options={convertOptionRole()} placeholder={"Select role ..."} returnValue={(value) => setSelectedRoleAccount(value)} />
                </div>
                <div className={cx('btns')}>
                    <button className={cx('btn_clear')} onClick={() => {clearForm()}}>
                        Clear Form
                    </button>
                    <button onClick={() => {handleCreateNewAccount()}}>Save</button>
                </div>
            </div>
            <div className={cx('form_permission')}>
                <div className={cx('header_role')}>
                    <div className={cx('delete_update_role')}>
                        <div className={cx('role_cbb')}>
                            <Combobox width={280} options={convertOptionRole()} returnValue={(value) => { setSelectedRolePermission(value) }} />
                        </div>
                        <div className={cx('btn_update_permission')}>
                            <button onClick={() => updatePermissionByRole()}>Update</button>
                        </div>
                        <div className={cx('btn_update_name')}>
                            <button onClick={() => {setUpdateNameRole(true)}}>Update name</button>
                        </div>
                    </div>
                    <div className={cx('create_role')}>
                        <div className={cx('edt', 'rolename')}>
                            <input id="email" placeholder="" />
                            <label htmlFor="email">Name role</label>
                        </div>
                        <div className={'btn_save_role'}>
                            <button>Save</button>
                        </div>
                    </div>
                </div>
                <div className={cx('table_permission')}>
                    <div className={cx('table')}>
                        <table>
                            <thead>
                                <tr>
                                    <td>Permission id</td>
                                    <td>Permission name</td>
                                    <td>Permission description</td>
                                    <td>Permission granted</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    permissionsChecked?.map((item) => {
                                        return <>
                                            <tr>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.descr}</td>
                                                <td>
                                                    <input type="checkbox" checked={item.checked} onChange={() => handleCheckboxChange(item.id)} />
                                                </td>
                                            </tr>
                                        </>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default BoxAddAccountAndRole;