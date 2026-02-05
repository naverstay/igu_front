import {FaSpinner} from "react-icons/fa";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import {GoDotFill} from "react-icons/go";
import {BsDot} from "react-icons/bs";

import "./loader.css";

export default function Loader({loading, loaderId = 0}) {
  return <div className={"loader" + (loading ? " loading" : "")}>
    {loaderId === 0 ? <FaSpinner className="spin" size={32}/> :
      loaderId === 1 ? <GoDotFill className="pulse" size={32}/> :
        loaderId === 2 ? <AiOutlineLoading3Quarters className="spin" size={32}/> :
          <div className="dots"><BsDot/> <BsDot/> <BsDot/></div>
    }
  </div>;
}
