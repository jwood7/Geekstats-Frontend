'use client'

import { useState} from "react";
import SummaryPage from "./components/summary/summaryPage";
import LoginModal from "./components/login";
import { Electrolize } from 'next/font/google';
import { getCookie } from "cookies-next";
import TeamPicker from "./components/teamPicker/teamPicker";

// Should really move this stuff in to layout page

const electrolize = Electrolize({weight: '400', subsets: ['latin']});

export default function Home() {
  const [openLoginModal, setOpenLoginModal] = useState(false);


  return (
    <div className={electrolize.className}>
      <header className="flex justify-between items-center w-full">
        {process.env.NEXT_PUBLIC_IMAGE_URL ? <img className="max-w-xs p-2.5" src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/gf_header.gif"}/> : <h1>Geekfest</h1>}
        <button className="pr-5" onClick={() => setOpenLoginModal(!openLoginModal)}>
          {
            !getCookie("username") || (getCookie("username")?.toString() ?? "").length <= 0 ? 
              <div>Login</div>
              :
              <div className="h-10 w-10 sm:h-16 sm:w-16 bg-neutral-500 rounded-full overflow-hidden border-2 border-silver">{process.env.NEXT_PUBLIC_IMAGE_URL && <img src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/geeks/" + (getCookie("username")?.toString() ?? "").toLowerCase() + ".png"}/> }</div>
              
          }
        </button>
      </header>
      <main className="bg-neutral-200">
        <SummaryPage/>
        {/* <TeamPicker/> */}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
      
      {openLoginModal && <div className="backdrop-blur-sm fixed h-full w-full text-center top-0 left-0 right-0 bg-neutral-500 bg-opacity-40"> <LoginModal setShowLogin={setOpenLoginModal}/></div>}
    </div>
  );
}
