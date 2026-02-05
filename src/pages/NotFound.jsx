import {NavLink} from "react-router-dom";

export default function NotFound() {
  return <div className="container">
    <div className="page-not-found">
      <h1>404 — Die gesuchte Seite wurde nicht gefunden</h1>
      <NavLink to="/">Zur Startseite</NavLink>
    </div>
  </div>;
}
