import React, { Component } from 'react'

const UserInfo = ({userInfo}) => {
    return <>
        <div className='flex gap-4'>
            <h2>{userInfo.user_name}</h2>
            <h2>{userInfo.user_state}</h2>
            <h2>{userInfo.user_url}</h2>
        </div>
    </>
}
export default UserInfo;