import React, { useEffect, useState } from 'react'
import UserInfo from './userInfo';
import UserCommit from './userCommit';
import UserMerge from './userMerge';


const DisplayProject = () => {
    const [users,setUsers] = useState([]);
    useEffect(()=>{
        setUsers(JSON.parse(sessionStorage.getItem('project')));
        console.log(JSON.parse(sessionStorage.getItem('project')));
    },[])
    if(!users || users == null){
        return <>No Project Available</>
    }
    

    return <>
    <div>
        {/* <h2>User List</h2> */}
            <ul>
                {Object.keys(users).map((userName, index) => (

                    <div className='main flex'>
                        <h2>{userName}</h2>
                        <div className='user-info'>
                            <UserInfo userInfo={users[userName].user_info}/>
                        </div>
                        <div className='user-commit'>
                            <UserCommit  userCommit={users[userName].user_commits}/>
                        </div>
                        <div className='user-merge'>
                            <UserMerge userMerge={users[userName].user_merge_requests}/>
                        </div>
                    </div>
                    // <li key={index} className='flex gap-4'>
                    //     <h3>{userName}</h3>
                    //     <p>User-id: {users[userName].user_info.user_id}</p>
                    //     <p>User Name: {users[userName].user_info.user_name}</p>
                    //     <p>User State: {users[userName].user_info.user_state}</p>
                    //     <p>User Membership State: {users[userName].user_info.user_membership_state}</p>
                    //     <p>
                    //         User URL: <a href={users[userName].user_info.user_url}>{users[userName].user_info.user_url}</a>
                    //     </p>
                        
                    // </li>
                    
                    
                ))}
            </ul>
        </div>
    </>
}

export default DisplayProject;