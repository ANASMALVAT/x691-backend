import React from 'react'

const UserCommit = ({userCommit}) => 
{   
    console.log(userCommit);
    return <>
        {userCommit.map((usercommit,key) => {
            <div className='flex flex-col'>
                <div className='flex  gap-4'>
                    <h2>{usercommit.commit_id}</h2>
                    <h2>{usercommit.commit_message}</h2>
                    <h2>{usercommit.commit_stats.toString()}</h2>
                    <h2>{usercommit.commit_id}</h2>
                    <h3><a>{usercommit.commit_url}</a></h3>
                    <h3>{usercommit.committed_date}</h3>
                </div>
            </div>
        })}
    </>
}

export default UserCommit;