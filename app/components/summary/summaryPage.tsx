'use client'

import { useState, useEffect } from "react";
import YourHighlights from "./yourHighlights";
import YourSummary from "./yourSummary";
import DataToggle from "./dataToggle";
import Scoreboard from "./scoreboard";
// import TeamRecap from "./components/teamRecap";
import Highlights from "./highlights";
import { getSummaries, getDateInfo } from "../../actions";


export default function SummaryPage() {
  const [isNightData, setIsNightData] = useState(true);
  // const [isMobile, setIsMobile] = useState(false); //useState(window.innerWidth <= 768); // this doesn't work properly, should probably use grid instead anyway
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
  // const pageComponents = [
  //   <YourSummary isNight={isNightData} stats={summaryData}/>,
  //   <YourHighlights isNight={isNightData}/>,
  //   <Scoreboard isNight={isNightData} tableData={summaryData}/>,
  //   <TeamRecap isNight={isNightData}/>,
  //   <div></div>,
  //   <Highlights isNight={isNightData}/>
  // ];

  async function handleNightSummaries(){
    const nightSummaries = await getSummaries();
    setNightData(nightSummaries);
    if (isNightData) setSummaryData(nightSummaries);
  }

  async function handleDateAndSeasonSummaries(){
    const date = await getDateInfo();
    setDateInfo(date);
    if (date.season_info.season_name != "Offseason"){
      const seasonSummaries = await getSummaries(date.season_info.season_start_event, date.season_info.season_end_event);
      setSeasonData(seasonSummaries);
      if (!isNightData) setSummaryData(seasonSummaries);
    }else{
      setIsNightData(true);
    }
  }

  function parseDate(date: string){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[parseInt(date.slice(5,7))-1] + " " + date.slice(-2) + ", " + date.slice(0,4) + ": ";
  }

  useEffect(()=>{
    handleNightSummaries();
    handleDateAndSeasonSummaries();
  }, []);


  return (
    <div className="m-auto flex flex-col gap-2.5 p-2.5 lg:w-fit">
        <div className="bg-red-800 rounded-xl flex md:flex-row flex-col justify-between font-bold drop-shadow-lg px-12 py-3 items-center">
            <h1 className="text-white text-2xl">{dateInfo && (parseDate(dateInfo.end_event_date) + dateInfo.season_info.season_name)}</h1>
            {dateInfo.season_info?.season_name != "Offseason" && <DataToggle isNight={isNightData} setIsNight={setIsNightData} setSummary={setSummaryData} night={nightData} season={seasonData}/> }
        </div>
        <div className="flex gap-2.5 flex-wrap justify-center">
            {/* <div>
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
            } */}
            <div className="flex flex-col gap-2.5">
            <YourSummary isNight={isNightData} stats={summaryData}/>
            <Scoreboard isNight={isNightData} tableData={summaryData}/>

            </div>
            <div className="flex flex-wrap lg:flex-col gap-2.5 items-center justify-center lg:justify-start">
            <YourHighlights isNight={isNightData} seasonStart={dateInfo.season_info.season_start_event} seasonEnd={dateInfo.season_info.season_end_event}/>
            {/* <TeamRecap isNight={isNightData}/> */}
            <Highlights isNight={isNightData} seasonStart={dateInfo.season_info.season_start_event} seasonEnd={dateInfo.season_info.season_end_event}/>
            </div>
        </div>
    </div>
  );
}
