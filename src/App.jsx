import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {NavigationProvider} from "./context/NavigationContext";

import "./App.css"

import Header from "./components/Header";
import Footer from "./components/Footer";

import ArticlePage from "./pages/ArticlePage";
import NotFound from "./pages/NotFound";
import ArticleEditor from "./pages/ArticleEditor";

export default function App() {
  return (
    <NavigationProvider>
      <Router>
        <Header/>

        <main id="main" className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<ArticlePage slug="home"/>}/>
              <Route path="/editor" element={<ArticleEditor/>}/>
              <Route path="/editor/:id" element={<ArticleEditor/>}/>
              <Route path="/:slug" element={<ArticlePage/>}/>
              <Route path="/404" element={<NotFound/>}/>
            </Routes>
          </div>
        </main>

        <Footer/>
      </Router>
    </NavigationProvider>
  );
}
