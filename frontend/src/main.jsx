import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Home from './Components/Home/Home.jsx'
import Track from './Components/Track/Track.jsx'
import Layout from'./Layout/Layout.jsx'
import Signup from './Components/Auth/Signup.jsx'
import Login from './Components/Auth/Login.jsx'
import Practice from './Components/Practice/Practice.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/track" element={<Track/>} />
      <Route path="/Signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/Practice" element={<Practice/>} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
