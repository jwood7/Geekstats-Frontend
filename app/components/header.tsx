'use client'

import { useState, useEffect} from "react";
import LoginModal from "../components/login";
import { Electrolize } from 'next/font/google';
import { getCookie } from "cookies-next";
import Link from "next/link";

const electrolize = Electrolize({weight: '400', subsets: ['latin']});

export default function Header() {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [username, setUsername] = useState("");
useEffect(()=>{
  setUsername(getCookie("username")?.toString() ?? "");
}, [getCookie("username")]);

  return (
    <div className={electrolize.className}>
      <header className="flex justify-between items-center w-full py-2.5 px-5">
        <div className="flex justify-between sm:gap-10 items-center">
          {process.env.NEXT_PUBLIC_IMAGE_URL ? <img className="w-[245.8px] sm:max-w-xs mr-2.5" src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/gf_header.gif"} alt="Geekfest"/> : <h1>Geekfest</h1>}
          <Link className="text-neutral-500 hover:text-red-800" href="/">Summary</Link>
          <Link className="text-neutral-500 hover:text-red-800" href="/teams">Teams</Link>
          {process.env.NEXT_PUBLIC_REFERENCE_URL && <Link className="text-neutral-500 hover:text-red-800" href={process.env.NEXT_PUBLIC_REFERENCE_URL+"/matches"}>Matches</Link>}
          {process.env.NEXT_PUBLIC_REFERENCE_URL && <Link className="text-neutral-500 hover:text-red-800" href={process.env.NEXT_PUBLIC_REFERENCE_URL+"/matches"}>Weapons</Link>}
          {process.env.NEXT_PUBLIC_REFERENCE_URL && <Link className="text-neutral-500 hover:text-red-800" href={process.env.NEXT_PUBLIC_REFERENCE_URL+"/matches"}>Awards</Link>}
        </div>
        <button className="pr-5" onClick={() => setOpenLoginModal(!openLoginModal)}>
          {
            !username || username.length <= 0 ? 
              <div>Login</div>
              :
              <div className="h-10 w-10 sm:h-16 sm:w-16 bg-neutral-500 rounded-full overflow-hidden border-2 border-silver">{process.env.NEXT_PUBLIC_IMAGE_URL && <img src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/geeks/" + (getCookie("username")?.toString() ?? "").toLowerCase() + ".png"} alt={getCookie("username")?.toString() ?? ""}/> }</div>
              
          }
        </button>
      </header>
      
      
      {openLoginModal && <div className="backdrop-blur-sm fixed h-full w-full text-center top-0 left-0 right-0 bg-neutral-500 bg-opacity-40 z-20"> <LoginModal setShowLogin={setOpenLoginModal}/></div>}
    </div>
  );
}
