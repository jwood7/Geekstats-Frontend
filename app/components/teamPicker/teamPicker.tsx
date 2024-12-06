'use client'
import WeeklyMap from "./weeklyMap";
import TeamPlayerCard from "./teamPlayerCard";
import { useState, useEffect, act } from "react";
import { getTeams } from "../../actions";
import { getKdrChange } from "./teamPlayerCard"; // should move this eventually




export type Geek = {
    "geek_id": number,
    "handle": string,
    "tier": number, // might change to number
    "tier_last_season": number, // might change to number
    "alltime_kdr": number,
    "year_kdr": number,
    "last90_kdr": number,
    "attendance_pct": number,
    "kdr_coeff_var": number,
    "rounds_played": number,
    "total_kills": number,
    "total_deaths": number,
    "perf_last_season": number
}
type Team = {
    name: string, 
    geeks: Geek[],
    total_kdr?: number,
    avg_kdr?: number,
    captain?: number,
}

// todo: 
// Set user permissions/state (captain, admin, player, team) based on login + current team
// Admin mode should be a cookie, and should be able to be toggled on and off
// get players from Discord, and put them in the correct teams
// Send teams to server + discord after picks are made

export default function TeamPicker() {
    
    const [teams, setTeams] = useState<Team[]>([{name: "Unpicked", geeks: []},{name: "", geeks: []},{name: "", geeks: []}]);
    const [selected, setSelected] = useState<[Geek, number] | null>(null); 
    const picksPerTurn = 1;
    const [picks, setPicks] = useState(picksPerTurn);
    const [currUserTeam, setCurrUserTeam] = useState(1); //switch to 0 default after testing
    const [activeTeam, setActiveTeam] = useState(1);
    const [pickError, setPickError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const calculateTeamKDR = (teamId: number, staticTeams?: Team[]) =>{
        let teamsCopy = staticTeams ?? teams;
        const sum = teamsCopy[teamId].geeks.reduce(function(a, b){
            return a + b.alltime_kdr;
        }, 0);
        const avg = sum/teamsCopy[teamId].geeks.length
        teamsCopy[teamId] = {...teamsCopy[teamId], avg_kdr: parseFloat(avg.toFixed(2)), total_kdr: parseFloat(sum.toFixed(2))}
        setTeams(teamsCopy);
    }

    const getTeamBorder = (teamId: number, userTeam: number) => {
        if (teamId === activeTeam){
            
            if (teamId === userTeam){
                return "border-4 border-red-800 border-solid"
            }else{
                return "border-4 border-neutral-500 border-solid"
            }
        }else{
            return "border-4 border-transparent border-solid"
        }
    }; 

    const getTeamNameStyle = (teamId: number, userTeam: number) => {
        if (teamId === activeTeam){
            
            if (teamId === userTeam){
                return "bg-red-800 rounded-full text-white"
            }else{
                return "bg-neutral-500 rounded-full text-white"
            }
        }else{
            return ""
        }
    }; 

    async function retrieveTeams(){
        const teamData = await getTeams("2024-11-06");
        const formattedTeams = [teams[0]].concat([{name: teamData[0].team_name, geeks: teamData[0].team}, {name: teamData[1].team_name, geeks: teamData[1].team}]);
        setTeams(formattedTeams);
        calculateTeamKDR(1, formattedTeams);
        calculateTeamKDR(2, formattedTeams);
        console.log(teams);
    }

    async function selectGeek(geek: Geek, teamId: number){
        selected === null || geek !== selected[0] ? setSelected([geek, teamId]) : setSelected(null);
        setPickError("");
    }

    const handleSubmit = () => {
        // skip if no players selected, or not users's turn
        if (!selected || activeTeam != currUserTeam) {
            return;
        }
        if (!isAdmin && (selected[1] != 0 && (selected[1] != currUserTeam || selected[0].geek_id === teams[1].geeks[0].geek_id || selected[0].geek_id === teams[2].geeks[0].geek_id))){
            setPickError("Cannot move selected player");
            console.log("Cannot move selected player"); 
            return;
        }
        setPickError("");
        // if selected player is unassigned, pick them
        if (selected[1] === 0){
            let teamsCopy = teams;
            teamsCopy[0].geeks = teamsCopy[0].geeks.filter(geek => geek.geek_id !== selected[0].geek_id);
            teamsCopy[activeTeam].geeks.push(selected[0]);
            setTeams(teamsCopy);
            if (picks-1 === 0){
                setActiveTeam(activeTeam === 1 ? 2 : 1);
                // also send updated teams back to server
            }
            setPicks(picks-1);
        }
        // If selected player is on the user's team
        if (selected[1] === activeTeam){
            // Remove player from previously assigned team
            let teamsCopy = teams;
            teamsCopy[activeTeam].geeks = teamsCopy[activeTeam].geeks.filter(geek => geek.geek_id !== selected[0].geek_id);
            teamsCopy[0].geeks.push(selected[0]);
            setTeams(teamsCopy);
            setPicks(picks+1);
        }
        setSelected(null);
        calculateTeamKDR(activeTeam);
    }

    useEffect(()=>{
        retrieveTeams();
    }, []);

    return (
        <div className="w-full h-full pt-2">
            <div className="bg-white drop-shadow px-5 pb-5 pt-2.5 rounded-lg m-2">
                <p>This week&apos;s maps</p>
                <div className="flex justify-evenly gap-2.5">
                    <WeeklyMap/>
                    <WeeklyMap/>
                    <WeeklyMap/>
                    <WeeklyMap/>
                    <WeeklyMap/>
                </div>
            </div>
            
            <div className="flex w-full">
                <div className="flex flex-col w-full h-full p-1 gap-1 content-centerr">
                    <h1 className={`font-xl font-bold text-center w-fit px-3 m-auto ${getTeamNameStyle(1, currUserTeam)}`}>{teams[1].name ?? "Team 1"}</h1>
                    <div className={` ${getTeamBorder(1, currUserTeam)} bg-white drop-shadow rounded-md`}>
                    <div className="flex justify-between">
                            <div>Total KDR:</div>
                            <div className="flex">{teams[1].total_kdr}({teams[1].total_kdr && teams[2].total_kdr && getKdrChange(teams[1].total_kdr, teams[2].total_kdr)})</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Avg KDR:</div>
                            <div className="flex">{teams[1].avg_kdr}({teams[1].avg_kdr && teams[2].avg_kdr && getKdrChange(teams[1].avg_kdr, teams[2].avg_kdr)})</div>
                        </div>
                    </div>
                    <div className={` ${getTeamBorder(1, currUserTeam)} bg-white drop-shadow rounded-md flex flex-col content-center gap-2 p-2`}>
                        {teams[1]?.geeks?.map((geek: Geek) => {
                            return <TeamPlayerCard playerData={geek} selected={selected} select={selectGeek} teamId={1} key={geek.geek_id}/>
                        })}
                    </div>
                </div>
                
                <div className="flex flex-col w-full h-full p-1 gap-1 content-centerr">
                    <h1 className={`font-xl font-bold text-center w-fit px-3 m-auto ${getTeamNameStyle(0, currUserTeam)}`}>Unpicked</h1>
                    <div className={` ${getTeamBorder(0, currUserTeam)} bg-white drop-shadow rounded-md flex flex-col content-center gap-2 p-2`}>
                        {teams[0]?.geeks?.map((geek: Geek) => {
                            return <TeamPlayerCard playerData={geek} selected={selected} select={selectGeek} teamId={0} key={geek.geek_id}/>
                        })}
                    </div>
                </div>
                
                <div className="flex flex-col w-full h-full p-1 gap-1">
                    <h1 className={`font-xl font-bold text-center w-fit px-3  m-auto ${getTeamNameStyle(2, currUserTeam)}`}>{teams[2].name ?? "Team 2"}</h1>
                    <div className={` ${getTeamBorder(2, currUserTeam)} bg-white drop-shadow rounded-md`}>
                        <div className="flex justify-between">
                            <div>Total KDR:</div>
                            <div className="flex">{teams[2].total_kdr}({teams[1].total_kdr && teams[2].total_kdr && getKdrChange(teams[2].total_kdr, teams[1].total_kdr)})</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Avg KDR:</div>
                            <div className="flex">{teams[2].avg_kdr}({teams[1].avg_kdr && teams[2].avg_kdr && getKdrChange(teams[2].avg_kdr, teams[1].avg_kdr)})</div>
                        </div>
                    </div>
                    <div className={` ${getTeamBorder(2, currUserTeam)} bg-white drop-shadow rounded-md flex flex-col content-center gap-2 p-2`}>
                        {teams[2]?.geeks?.map((geek: Geek) => {
                            return <TeamPlayerCard playerData={geek} selected={selected} select={selectGeek} teamId={2} key={geek.geek_id}/>
                        })}
                    </div>
                </div>
            </div>
            {activeTeam === currUserTeam &&
                <div className="fixed bottom-10 inset-x-0 text-center w-full sm:w-8/12 m-auto bg-white rounded-3xl px-8 pb-4 pt-2 gap-2.5 flex flex-row sm:flex-col">
                    <div className="font-bold">{(selected && selected[1] === currUserTeam ? "Remove": "Pick") + " " + ((selected && selected[0]?.handle) ?? "Team Member")}</div>
                    <p className="text-red-500">{pickError}</p>
                    {selected && <button className="bg-red-800 font-bold text-white rounded-full w-full py-1.5" onClick={()=>handleSubmit()}>Submit</button>}
                </div>
            }
        </div>
    )
}