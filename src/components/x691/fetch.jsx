import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { FetchProject } from './fetchProject';

const FetchGitlab = () => {
    let x691Token = "glpat-TjmPsUbFRmyxWWvzHxJG";
    let url = "https://git.cs.dal.ca/";
    let proId = "67288";

    const [rootURL,setRootURL] = useState("");
    const [group,setGroup] = useState("");
    const [project,setProject] = useState("");
    const [token,setToken] = useState("");

    const changeURL = (event) => {
        const value = event.target.value;
        setRootURL(event.target.value);

    }
    const changeGroup = (event) => {
        setGroup(event.target.value);
        console.log(group);
    }
    const changeToken = (event) => {
        setToken(event.target.value);
        console.log(token);
    }
    const changeProject = (event) => {
        setProject(event.target.value);
    }
    const getProject = () => {
        FetchProject(rootURL,token,project);
    }

    const getGroup = () => {
        FetchProject(token,project);
    }

    return (<>
        <div className=' flex flex-col gap-2 h-[500px] w-[500px] mt-4 m-auto'>
            <TextField onChange={changeURL}  id="outlined-basic" label="Root Url" variant="outlined" />
            <TextField onChange={changeToken}  id="outlined-basic" label="Token" variant="outlined" />
            <TextField onChange={changeGroup} id="outlined-basic" label="Group-ID" variant="outlined" />
            <TextField onChange={changeProject}  id="outlined-basic" label="Project-ID" variant="outlined" />
            <div className='flex gap-4'>
                <Button onClick={getProject} variant="outlined">Get Project</Button>
                <Button onClick={getGroup} variant="outlined">Get Group</Button>
            </div>
        </div>
    </>)

}

export default FetchGitlab;