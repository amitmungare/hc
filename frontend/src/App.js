import React from "react";
import Header from "./components/Header";
import {Route, Routes} from "react-router-dom"
import Auth from "./components/Auth"
import Report from "./components/Report"
import Aboutus from "./components/aboutus"
import Contactus from "./components/contactus"
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state)=>state.isLoggedIn);
  console.log(isLoggedIn)
   return <React.Fragment>

    <header>
      <Header/>
    </header>

    <main>
      <Routes>
        <Route path="/aboutus" element={<Aboutus/>}/>
        <Route path="/contactus" element={<Contactus/>}/>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/report" element={<Report/>}/>
      </Routes>
    </main>

   </React.Fragment>
}

export default App;
        