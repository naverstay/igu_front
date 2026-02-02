import React, {useState, useEffect} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {FaBars, FaTimes, FaPhone} from "react-icons/fa"
import {FiChevronDown} from "react-icons/fi";
import {useNavigation} from "../context/NavigationContext";

import "./header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState(null);
  const {menu} = useNavigation();

  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setNav(menu.filter(f => f.isLogo)?.[0] ?? null);
  }, [menu]);

  console.log('menu', menu);

  return (
    <header className="header">
      <a href="#main" id="skip-link" className="skip-link">Zum Inhalt springen</a>

      <div className="header-inner container">
        <div className="logo">
          <NavLink to="/">
            {nav?.logoUrl?.url ?
              <img src={(import.meta.env.DEV ? import.meta.env.VITE_API_URL : '') + (nav.logoUrl.url)
              } alt="Inclutopia gUG" role="img" className="logo-img"/> : <span/>}
          </NavLink>
        </div>

        <nav className={"nav " + (open ? " open" : "")} role="menu">
          {menu.filter(f => !f.isLogo).filter(f => f.visible).map(item => (
            <div key={item.id} role="menuitem"
                 className={"nav-link" + (item.navigation_items && item.navigation_items.length > 0 ? " dropdown" : "")}>
              <NavLink to={item.url === 'home' ? '' : item.url}>{item.title}</NavLink>
              {item.navigation_items && item.navigation_items.length > 0 && (
                <>
                  <button className="submenu-icon" title="submenu" aria-label="submenu"
                          onKeyDown={event => {
                            if (event.key === "Enter") {
                              event.target.closest('.dropdown').classList.toggle('__open')
                            }
                            if (event.key === "ArrowDown") {
                              event.target.closest('.dropdown').classList.add('__open')
                            }
                            if (event.key === "ArrowUp") {
                              event.target.closest('.dropdown').classList.remove('__open')
                            }
                          }}><FiChevronDown/></button>

                  <div className="submenu" aria-expanded>
                    {item.navigation_items.map(sub => <NavLink key={sub.id} to={sub.url}> {sub.title} </NavLink>)}
                  </div>
                </>)
              }
            </div>))
          }
        </nav>

        <button
          className="burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <FaTimes size={22}/> : <FaBars size={22}/>}
        </button>

        <a className="phone" href={"tel:" + nav?.phone?.replaceAll(' ', '')} aria-label={"Telefon: " + nav?.phone}>
          <FaPhone size={22} style={{transform: "scaleX(-1)"}}/>
        </a>
      </div>
    </header>
  );
}
