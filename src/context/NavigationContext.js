import {createContext, useContext, useEffect, useState} from "react";
import {api} from "../api";

const NavigationContext = createContext();

export function NavigationProvider({children}) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    async function loadMenu() {
      const res = await api.get("/navigation-items?populate=navigation_items");
      setMenu(res.data.data.sort((a, b) => a.order - b.order));
    }

    loadMenu();
  }, []);

  return (
    <NavigationContext.Provider value={{menu}}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
