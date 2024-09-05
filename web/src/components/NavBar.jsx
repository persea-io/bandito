import '../NavBar.css'
import {Link, Route, Routes} from 'react-router-dom'
import About from './About.jsx'
import Home from './Home.jsx'

function NavBar() {
    return (
        <div>
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="stylesheet" href="./NavBar.css"/>
            <title>Navbar Example</title>
        </head>

        <body>
            <nav class="navbar">
                <div class="navbar-container">
                <a href="/" class="brand-logo">Bandito</a>
                <ul class="nav-links">
                    <li><a href="/home">Home</a></li>
                    {/* <li><Link to="/about">About</Link></li> */}
                    <li><a href="/services">Services</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
                </div>
            </nav>
        </body> 
        {/* <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes> */}
        </div>


    );
}

export default NavBar;

