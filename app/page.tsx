'use client'

import { useState, useEffect, use } from "react";
import YourHighlights from "./components/YourHighlights";
import YourSummary from "./components/yourSummary";
import DataToggle from "./components/dataToggle";
import Scoreboard from "./components/Scoreboard";
import TeamRecap from "./components/TeamRecap";
import Highlights from "./components/highlights";
import { getSummaries, getDateInfo } from "./actions";

export default function Home() {
  const [isNightData, setIsNightData] = useState(true);
  const [isMobile, setIsMobile] = useState(false); //useState(window.innerWidth <= 768); // this doesn't work properly, should probably use grid instead anyway
  const [nightData, setNightData] = useState([]);
  const [seasonData, setSeasonData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [dateInfo, setDateInfo] = useState({
    start_event_date: (new Date()).toISOString().split('T')[0], // default to today's date
    end_event_date: (new Date()).toISOString().split('T')[0], // default to today's date
    season_info: {
      season_name : "",
      season_start_event: "",
      season_end_event: "",
    }
  });
  const pageComponents = [
    <YourSummary isNight={isNightData} stats={summaryData}/>,
    <YourHighlights isNight={isNightData}/>,
    <Scoreboard isNight={isNightData} tableData={summaryData}/>,
    <TeamRecap isNight={isNightData}/>,
    <div></div>,
    <Highlights isNight={isNightData}/>
  ];

  async function handleNightSummaries(){
    const nightSummaries = await getSummaries();
    setNightData(nightSummaries);
    if (isNightData) setSummaryData(nightSummaries);
  }

  async function handleDateAndSeasonSummaries(){
    const date = await getDateInfo();
    setDateInfo(date);
    const seasonSummaries = await getSummaries(date.season_info.season_start_event, date.season_info.season_end_event);
    setSeasonData(seasonSummaries);
    if (!isNightData) setSummaryData(seasonSummaries);
  }

  function parseDate(date: string){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[parseInt(date.slice(5,7)) + 1] + " " + date.slice(-2) + ", " + date.slice(0,4) + ": ";
  }

  useEffect(()=>{
    handleNightSummaries();
    handleDateAndSeasonSummaries();
  }, []);

  return (
    <div className="">
      <header>
        {process.env.NEXT_PUBLIC_IMAGE_URL ? <img className="max-w-lg p-2.5" src={process.env.NEXT_PUBLIC_IMAGE_URL + "gf_header.gif"}/> : <h1>Geekfest</h1>}
      </header>
      <main className="flex flex-col gap-2.5 p-2.5 bg-neutral-200">
        <div className="bg-red-800 rounded-xl flex flex-row justify-between font-bold drop-shadow-lg px-12 py-3">
          <h1 className="text-white text-2xl">{parseDate(dateInfo.end_event_date) + dateInfo.season_info.season_name}</h1>
          <DataToggle isNight={isNightData} setIsNight={setIsNightData} setSummary={setSummaryData} night={nightData} season={seasonData}/>
        </div>
        <div>
          <div>
            {pageComponents.map( (component, index) => {
              if (!isMobile) return component;
              if (index%2 == 0){
                return component;
              }
            })}
          </div>
          {isMobile && 
            <div>
              {pageComponents.map( (component, index) => {
                if (index%2 != 0){
                  return component;
                }
              })}
            </div>
          }
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}