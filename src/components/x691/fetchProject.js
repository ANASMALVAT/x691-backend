import axios from "axios";
import { Link, redirect } from 'react-router-dom'
import DisplayProject from "./displayProject";

const PROJECT_URL = process.env.REACT_APP_PROJECT_URL;

export async function FetchProject(rootURL, token, project_id) {

  const requestData = {
    project_id: project_id,
    token: token,
    rootURL: rootURL,
  };

  

  try {
    const response = await axios.post(PROJECT_URL, requestData); 
    console.log(response.data.requestData);
    sessionStorage.setItem("project",JSON.stringify(response.data.usersData));
    redirect("/project");
    
    
    

  } catch (error) {
    console.log(error);
    console.log("error");
  }
}