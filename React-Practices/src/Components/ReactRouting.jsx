import Home from "../React-Router/Home"
import Menu from "../React-Router/Menu"
import Services from "../React-Router/Services"
import About from "../React-Router/ABout"

import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

const ReactRouting = () => {
      return (
        <>
           <h1>React Routing !</h1>

           <BrowserRouter>
           <nav>
                <Link to="/Home">Home</Link>
                <Link to="/Menu">Menu</Link>
                <Link to="/Services">Services</Link>
                <Link to="/About">About</Link>
           </nav>
          
          <Routes>
            <Route path="/Home" element={<Home/>}></Route>
            <Route path="/Menu" element={<Menu/>}></Route>
            <Route path="/Services" element={<Services/>}></Route>
            <Route path="/About" element={<About/>}></Route>
          </Routes>


           
           </BrowserRouter>

         
        </>
      )
}
export default ReactRouting