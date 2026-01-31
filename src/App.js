import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import "./App.css"

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Leitlinien from "./pages/Leitlinien";
import Unterstuetzung from "./pages/Unterstuetzung";
import Kontakt from "./pages/Kontakt";
import Impressum from "./pages/Impressum";
import Ferienbetreuung from "./pages/Ferienbetreuung";

export default function App() {
  return (
    <Router>
      <Header/>

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/portfolio" element={<Portfolio/>}/>
            <Route path="/leitlinien" element={<Leitlinien/>}/>
            <Route path="/unterstuetzung" element={<Unterstuetzung/>}/>
            <Route path="/kontakt" element={<Kontakt/>}/>
            <Route path="/impressum" element={<Impressum/>}/>
            <Route path="/ferienbetreuung" element={<Ferienbetreuung/>}/>
          </Routes>
        </div>
      </main>

      <Footer/>
    </Router>
  );
}
