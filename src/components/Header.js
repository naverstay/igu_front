import React, {useState, useEffect} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {FaBars, FaTimes, FaPhone} from "react-icons/fa"
import {useNavigation} from "../context/NavigationContext";

import "./header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const {menu} = useNavigation();

  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  console.log('menu', menu);

  return (
    <header className="header">
      <div className="header-inner container">
        {/* ЛОГОТИП */}
        <div className="logo">
          <NavLink to="/">
            <img src="/logo.png" alt="Logo" className="logo-img"/>
          </NavLink>
        </div>

        <nav className={"nav " + (open ? " open" : "")}>
          {menu.map(item => (
            !item.isChild && <div key={item.id} className="nav-link"><NavLink
              to={item.url}>{item.title}</NavLink> {item.navigation_items && item.navigation_items.length > 0 && (
              <div className="submenu"> {item.navigation_items.map(sub => (
                <NavLink key={sub.id} to={sub.url}> {sub.title} </NavLink>))}
              </div>)}
            </div>))
          }

          {/*<NavLink to="/">Home</NavLink>*/}
          {/*<NavLink to="/portfolio">Portfolio</NavLink>*/}
          {/*<NavLink to="/leitlinien">Leitlinien / Themen</NavLink>*/}
          {/*<NavLink to="/unterstuetzung">Unterstützung</NavLink>*/}
          {/*<NavLink to="/kontakt">Kontakt</NavLink>*/}
          {/*<NavLink to="/impressum">Impressum</NavLink>*/}
          {/*<NavLink to="/ferienbetreuung">Ferienbetreuung in Köln</NavLink>*/}
        </nav>

        <button
          className="burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <FaTimes size={22}/> : <FaBars size={22}/>}
        </button>

        <a className="phone" href="tel:4917624173246" aria-label="Telefon: +49 176 24173246">
          <FaPhone size={22} style={{transform: "scaleX(-1)"}}/>
        </a>
      </div>
    </header>
  );
}
