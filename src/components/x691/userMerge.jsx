import React from 'react'

const UserMerge = ({userMerge}) => 
{
    return <>
        {   userMerge.map((usermerge,key) => {
                <div className='flex flex-col'>
                    <div className='flex gap-4'>
                        <h2>{usermerge.author.toString()}</h2>
                        <h2>{usermerge.description}</h2>
                        <h2>{usermerge.merge_id}</h2>
                        <h2>{usermerge.state}</h2>
                        <h2>{usermerge.merged_by.toString()}</h2>
                        <h2>{usermerge.target_branch}</h2>
                        <h2>{usermerge.source_branch}</h2>
                        <h2>{usermerge.web_url}</h2>
                    </div>
                </div>
            })
        }
    </>
}

export default UserMerge;