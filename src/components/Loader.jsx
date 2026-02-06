import {FaSpinner} from "react-icons/fa";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import {GoDotFill} from "react-icons/go";
import {BsDot} from "react-icons/bs";

import "./loader.css";

export default function Loader({loading, loaderType = 0}) {
  return <div className={"loader" + (loading ? " loading" : "")}>
    {loaderType === 0 ? <FaSpinner className="spin" size={32}/> :
      loaderType === 1 ? <GoDotFill className="pulse" size={32}/> :
        loaderType === 2 ? <AiOutlineLoading3Quarters className="spin" size={32}/> :
          <div className="dots"><BsDot size={24}/> <BsDot size={24}/> <BsDot size={24}/></div>
    }
  </div>;
}
