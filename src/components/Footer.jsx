import React, {useEffect, useState} from "react";
import {useNavigation} from "../context/NavigationContext";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";

import "./footer.css";

export default function Footer() {
  const [nav, setNav] = useState(null);
  const {menu} = useNavigation();

  useEffect(() => {
    setNav(menu.filter(f => f.isLogo)?.[0] ?? null);
  }, [menu]);

  return (
    <footer className="footer">
      <div className="footer-inner container">
        {nav?.footer && <BlocksRenderer content={nav?.footer}/>}
      </div>
    </footer>
  );
}
