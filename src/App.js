import logo from './logo.svg';
import './App.css';
import FetchGitlab from './components/x691/fetch';
import DisplayProject from './components/x691/displayProject';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";


const router = createBrowserRouter
  ([
    {
      path: "/",
      element: <FetchGitlab/>
    },
    {
      path: "/project",
      element:<DisplayProject/>
      
    },
   
  ]);
  

function App() {
  return (
    <div className="App flex justify-center items-center">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
