'use client'
import WeeklyMap from "./weeklyMap";
import TeamPlayerCard from "./teamPlayerCard";
import { useState, useEffect } from "react";
import { getTeams, getMatches, getDiscordAttendees, sendPick, checkPickFlag, getPickFlag, endPickTurn } from "../../actions";
import { getKdrChange } from "./teamPlayerCard"; // should move this eventually
import { getCookie } from "cookies-next";



export type Geek = {
    "geek_id": number,
    "handle": string,
    "tier": number,
    "tier_last_season": number,
    "alltime_kdr": number,
    "year_kdr": number,
    "last90_kdr": number,
    "attendance_pct": number,
    "kdr_coeff_var": number,
    "rounds_played": number,
    "total_kills": number,
    "total_deaths": number,
    "perf_last_season": number,
    discord: string,
    attending?: boolean,
}
type Team = {
    team_id: number,
    name: string, 
    geeks: Geek[],
    total_kdr?: number,
    avg_kdr?: number,
    online_total_kdr?: number,
    online_avg_kdr?: number,
    captain_id?: number,
    co_captain_id?: number,
}

export type Map = {
    idmap: number,
    map_name: string,
    type: string,
    theme: string,
    thumbnail: string | null,
    ct_wins: number,
    t_wins: number,
    plays: number,
    metascore: number | null,
    s_plays: number,
    last_play: number,
    no_obj_rounds: number,
    bomb_plant_rounds: number,
    bomb_explode_rounds: number,
    defuse_rounds: number,
    gf_certified: boolean | null,
    lmg_kills: number,
    ninja_kills: number,
    sniper_kills: number,
    total_kills: number,
    top_geek: number,
    top_geek_handle: string,
    top_geek_kills: number,
    top_weapon: number,
    top_weapon_kills: number,
    top_weapon_name: string
}

// todo: 
// Admin mode should be from the cookie, and should be able to be toggled on and off
// Get better map icons (transparent backgrounds), reformat map image
// Add marking for captain/co-captain

export default function TeamPicker() {
    
    const [teams, setTeams] = useState<Team[]>([{ team_id: -1, name: "Unpicked", geeks: []},{team_id: -1, name: "", geeks: []},{team_id: -1, name: "", geeks: []}]);
    const [selected, setSelected] = useState<[Geek, number] | null>(null); 
    const [currUserTeam, setCurrUserTeam] = useState(0);
    const [canUserPick, setCanUserPick] = useState(false);
    const [activeTeam, setActiveTeam] = useState(-2);
    const [pickError, setPickError] = useState("");
    const [maps, setMaps] = useState<Map[]>([]);
    const [isPolling, setIsPolling] = useState(false);
    const calculateTeamKDR = (teamId: number, staticTeams?: Team[]) =>{
        const teamsCopy = staticTeams ?? teams;
        if (!teamsCopy || teamsCopy.length <= 0 || !teamsCopy[teamId].geeks || teamsCopy[teamId].geeks?.length <= 0){
            return teamsCopy[teamId];
        }
        let onlineCount = 0;
        const sum = teamsCopy[teamId].geeks.reduce(function(a, b){
            return a + b.alltime_kdr;
        }, 0);
        const onlineSum = teamsCopy[teamId].geeks.reduce(function(a, b){
            if (b.attending) onlineCount += 1;
            return a + (b.attending ? b.alltime_kdr : 0);
        }, 0);
        const avg = sum/teamsCopy[teamId].geeks?.length;
        const onlineAvg = onlineSum/onlineCount;
        teamsCopy[teamId] = {...teamsCopy[teamId], avg_kdr: parseFloat(avg.toFixed(2)), total_kdr: parseFloat(sum.toFixed(2)), online_avg_kdr: parseFloat(onlineAvg.toFixed(2)), online_total_kdr: parseFloat(onlineSum.toFixed(2))}
        // setTeams(teamsCopy);
        return teamsCopy[teamId];
    }

    const getTeamBorder = (teamIndex: number, userTeam: number) => {
        if (teams[teamIndex].team_id === activeTeam){
            
            if (teams[teamIndex].team_id === userTeam){
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
        const teamData = await getTeams();
        const formattedTeams = [teams[0]].concat([
            {team_id: teamData[0]?.team_id, name: teamData[0]?.team_name, geeks: teamData[0]?.team, captain_id: teamData[0]?.captain_id, co_captain_id: teamData[0]?.co_captain_id }, 
            {team_id: teamData[1]?.team_id, name: teamData[1]?.team_name, geeks: teamData[1]?.team, captain_id: teamData[1]?.captain_id, co_captain_id: teamData[1]?.co_captain_id }, 
        ]);
        const discordData: Geek[] = await getDiscordAttendees();
        // loop through teams, if player in discordData, remove them from DiscordData, else mark them as not attending
        // Get remaining players stats, sort by kdr, and add them to unpicked
        const userId = getCookie("userId") ?? -1;
        formattedTeams.slice(1).forEach(team => {
            if (team.geeks && team.geeks?.length > 0){
                team.geeks.forEach(geek => {
                    if (userId == geek.geek_id){
                        setCurrUserTeam(team.team_id);
                    }
                    const discordGeekIndex = discordData.findIndex(dg => dg.discord === geek.discord);
                    if (discordGeekIndex !== -1) {
                        // Geek is attending, remove them from discordData
                        discordData.splice(discordGeekIndex, 1);
                        geek.attending = true;
                    } else {
                        // Geek is not attending, mark as not attending
                        geek.attending = false;
                    }
                });
            }
        });
        // Now, gather remaining geeks in discordData and sort by KDR
        const unpicked = discordData.map(dg => {
            return {
                ...dg, 
                attending: true
            };
        });
        // Sort unpicked geeks by KDR (you can change the KDR field depending on your needs)
        unpicked.sort((a: Geek, b: Geek) => b.alltime_kdr - a.alltime_kdr);
    
        // Now unpicked contains geeks sorted by KDR
        formattedTeams[0] = { team_id: -1, name: teamData[0]?.team_name, geeks: unpicked };
        formattedTeams[1] = calculateTeamKDR(1, formattedTeams);
        formattedTeams[2] = calculateTeamKDR(2, formattedTeams);
        setTeams(formattedTeams);
    }

    async function selectGeek(geek: Geek, teamId: number){
         if ((selected === null || geek !== selected[0]) && activeTeam === currUserTeam && (teamId === currUserTeam || teamId === -1)){
            setSelected([geek, teamId])
         }else{
            setSelected(null);
         }
        setPickError("");
    }

    const handleSubmit = async () => {
        const activeTeamIndex = activeTeam === teams[1].team_id ? 1 : 2;
        // skip if no players selected, or not users's turn
        if (!selected || activeTeam != currUserTeam) {
            return;
        }
        if ((selected[1] != -1 && (selected[1] != currUserTeam || selected[0].geek_id === teams[1].captain_id || selected[0].geek_id === teams[2].captain_id || selected[0].geek_id === teams[1].co_captain_id || selected[0].geek_id === teams[2].co_captain_id || !selected[0].attending))){
            setPickError("Cannot move selected player");
            setSelected(null);
            return;
        }
        setPickError("");
        const action = selected[1] === activeTeam ? "remove" : "add";
        await sendPick(selected[0].geek_id, teams[activeTeamIndex].team_id, action);
        setSelected(null);
        const endTurn = await endPickTurn();
        if (!endTurn){
            setPickError("Failed to end turn");
        }else{
            setActiveTeam(activeTeam === teams[1].team_id ? teams[2].team_id : teams[1].team_id);
        }
        setCanUserPick(false);
        await retrieveTeams();
    }

    async function retrieveMaps(){
        const mapData = await getMatches();
        setMaps(mapData);
    }

    async function endTurn(){
        const endTurn = await endPickTurn();
        if (!endTurn){
            setPickError("Failed to end turn");
        }else{
            setActiveTeam(activeTeam === teams[1].team_id ? teams[2].team_id : teams[1].team_id);
        }
        setCanUserPick(false);
        await retrieveTeams();
    }

    async function pollPickFlag(longPoll:boolean = true){
        if (!canUserPick){
            let pickFlag;
            setIsPolling(true);
            if (longPoll){
                pickFlag = await checkPickFlag();
            }else{
                pickFlag = await getPickFlag();
            }
            setIsPolling(false);
            if (!pickFlag) return;
            if (pickFlag.pick_flag){
                // User is the captain, set their team to the current team
                setActiveTeam(pickFlag.current_team);
                await retrieveTeams();
                setSelected(null);
                setCanUserPick(true);
            }else if (pickFlag.message == "No updates within timeout"){
                setCanUserPick(false);
                pollPickFlag();
            }else{
                setActiveTeam(pickFlag.current_team);
                await retrieveTeams();
                setCanUserPick(false);
            }
        }
    }

    async function initializePage(){
        await retrieveTeams();
        await retrieveMaps();
    }

    useEffect(()=>{
        initializePage();
    }, []);

//     const teamsRef = useRef(teams); // Create a ref for teams

  useEffect(() => {
    if (teams[2].team_id === -1){
        pollPickFlag(false);
    }else{
        
        pollPickFlag();
    }
  }, [teams]);


    return (
        <div className="w-full h-full pt-2">
            <div className="bg-white drop-shadow px-5 pb-5 pt-2.5 rounded-lg m-2">
                <p>This week&apos;s maps</p>
                <div className="flex flex-col sm:flex-row justify-evenly gap-2.5">
                    {maps.map((match: Map) => <WeeklyMap match={match} key={match.map_name}/>)}
                </div>
            </div>
            
            <div className="flex w-full justify-between p-1 items-stretch">
                <div className="flex flex-col sm:p-1 gap-1 content-center w-[120px] sm:w-full items-center">
                    <h1 className={`text-xs text-center sm:text-xl font-bold text-center w-full overflow-clip sm:w-fit sm:px-3 text-nowrap ${getTeamNameStyle(1, currUserTeam)}`}>{teams[1].name ?? "Team 1"}</h1>
                    <div className={` ${getTeamBorder(1, currUserTeam)} bg-white drop-shadow rounded-md w-full text-xs sm:text-base sm:px-4`}>
                    <div className="flex justify-between">
                            <div className="sm:font-semibold">Total KDR:</div>
                            <div className="flex gap-0.5">
                                
                                <span className="flex sm:font-semibold" title="KDR for attending team members">
                                    {teams[1]?.online_total_kdr}
                                    <div className="flex sm:visible max-sm:hidden">
                                        ({teams[1].online_total_kdr && teams[2].online_total_kdr && getKdrChange(teams[1].online_total_kdr, teams[2].online_total_kdr)})
                                    </div>
                                </span>
                                <div className="sm:visible max-sm:hidden">/</div>
                                <span className="flex opacity-50 sm:visible max-sm:hidden" title="KDR for all team members">
                                    {teams[1]?.total_kdr}
                                    <div className="flex sm:visible max-sm:hidden">
                                        ({teams[1].total_kdr && teams[2].total_kdr && getKdrChange(teams[1].total_kdr, teams[2].total_kdr)})
                                    </div>
                                </span>
                                
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="sm:font-semibold">Avg KDR:</div>
                            <div className="flex gap-0.5">
                                
                                <span className="flex sm:font-semibold" title="KDR for attending team members">
                                    {teams[1]?.online_avg_kdr}
                                    <div className="flex sm:visible max-sm:hidden">
                                        ({teams[1].online_avg_kdr && teams[2].online_avg_kdr && getKdrChange(teams[1].online_avg_kdr, teams[2].online_avg_kdr)})
                                    </div>
                                </span>
                                <div className="sm:visible max-sm:hidden">/</div>
                                <span className="flex opacity-50 sm:visible max-sm:hidden" title="KDR for all team members">
                                    {teams[1]?.avg_kdr}
                                    <div className="flex sm:visible max-sm:hidden">
                                        ({teams[1].avg_kdr && teams[2].avg_kdr && getKdrChange(teams[1].avg_kdr, teams[2].avg_kdr)})
                                    </div>
                                </span>
                                
                            </div>
                        </div>
                    </div>
                    <div key={"team1_"+ teams[1].geeks?.length+activeTeam} className={` ${getTeamBorder(1, currUserTeam)} bg-white drop-shadow rounded-md flex flex-col content-center gap-1 sm:p-2 h-full w-full`}>
                        {teams[1]?.geeks?.map((geek: Geek) => {
                            return <TeamPlayerCard playerData={geek} selected={selected} select={selectGeek} teamId={teams[1].team_id} key={teams[1].team_id  + "_" + geek.geek_id} isCaptain={teams[1].captain_id === geek.geek_id} isCoCaptain={teams[1].co_captain_id === geek.geek_id}/>
                        })}
                    </div>
                </div>
                
                <div className="flex flex-col w-full sm:p-1 gap-1 content-center w-[120px] sm:w-full items-center">
                    <h1 className={`text-xs text-center sm:text-xl font-bold text-center w-full overflow-clip sm:w-fit sm:px-3 text-nowrap ${getTeamNameStyle(0, currUserTeam)}`}>Unpicked</h1>
                    <div key={"team0_"+ teams[0].geeks?.length+activeTeam} className={` ${getTeamBorder(0, currUserTeam)} bg-white drop-shadow rounded-md flex flex-col content-center gap-2 sm:p-2 h-full w-full`}>
                        {teams[0]?.geeks?.map((geek: Geek) => {
                            return <TeamPlayerCard playerData={geek} selected={selected} select={selectGeek} teamId={teams[0].team_id} key={teams[0].team_id  + "_" + geek.geek_id}/>
                        })}
                    </div>
                </div>
                
                <div className="flex flex-col sm:p-1 gap-1 content-center w-[120px] sm:w-full items-center">
                    <h1 className={`text-xs text-center sm:text-xl font-bold text-center w-full overflow-clip sm:w-fit sm:px-3 text-nowrap ${getTeamNameStyle(2, currUserTeam)}`}>{teams[2].name ?? "Team 2"}</h1>
                    <div className={` ${getTeamBorder(2, currUserTeam)} bg-white drop-shadow rounded-md w-full text-xs sm:text-base sm:px-4`}>
                        <div className="flex justify-between">
                            <div className="sm:font-semibold">Total KDR:</div>
                            <div className="flex gap-0.5">
                                
                                <span className="flex sm:font-semibold" title="KDR for attending team members">
                                    {teams[2]?.online_total_kdr}
                                    <div className="flex sm:visible max-sm:hidden">
                                        ({teams[1].online_total_kdr && teams[2].online_total_kdr && getKdrChange(teams[2].online_total_kdr, teams[1].online_total_kdr)})
                                    </div>
                                </span>
                                <div className="sm:visible max-sm:hidden">/</div>
                                <span className="flex opacity-50 sm:visible max-sm:hidden" title="KDR for all team members">
                                    {teams[2]?.total_kdr}
                                    <div className="flex sm:visible max-sm:hidden">
                                        ({teams[1].total_kdr && teams[2].total_kdr && getKdrChange(teams[2].total_kdr, teams[1].total_kdr)})
                                    </div>
                                </span>
                                
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="sm:font-semibold">Avg KDR:</div>
                            <div className="flex gap-0.5">
                                
                                <span className="flex sm:font-semibold" title="KDR for attending team members">
                                    {teams[2]?.online_avg_kdr}
                                    <div className="flex sm:visible max-sm:hidden">
                                        ({teams[1].online_avg_kdr && teams[2].online_avg_kdr && getKdrChange(teams[2].online_avg_kdr, teams[1].online_avg_kdr)})
                                    </div>
                                </span>
                                <div className="sm:visible max-sm:hidden">/</div>
                                <span className="flex opacity-50 sm:visible max-sm:hidden" title="KDR for all team members">
                                    {teams[2]?.avg_kdr}
                                    <div className="flex sm:visible max-sm:hidden">
                                        ({teams[1].avg_kdr && teams[2].avg_kdr && getKdrChange(teams[2].avg_kdr, teams[1].avg_kdr)})
                                    </div>
                                </span>
                                
                            </div>
                        </div>
                    </div>
                    <div key={"team2_"+ teams[2]?.geeks?.length+activeTeam} className={` ${getTeamBorder(2, currUserTeam)} bg-white drop-shadow rounded-md flex flex-col content-center gap-2 sm:p-2 h-full w-full`}>
                        {teams[2]?.geeks?.map((geek: Geek) => {
                            return <TeamPlayerCard playerData={geek} selected={selected} select={selectGeek} teamId={teams[2].team_id} key={teams[2].team_id  + "_" + geek.geek_id } isCaptain={teams[2].captain_id === geek.geek_id} isCoCaptain={teams[2].co_captain_id === geek.geek_id}/>
                        })}
                    </div>
                </div>
            </div>
            {(getCookie("userId") ?? "-1") === "18" && (
            <div className="fixed z-20 bottom-10 left-10 text-center m-auto bg-red-800 text-white rounded-3xl text-sm drop-shadow-xl">
                <h2 className="font-bold mb-2">Debug Info:</h2>
                <div className="grid grid-cols-2 gap-2">
                    <div>Active Team: {activeTeam}</div>
                    <div>User Team: {currUserTeam}</div>
                    <div>Can User Pick: {canUserPick ? "Yes" : "No"}</div>
                    <div>Selected Player: {selected ? `${selected[0]?.handle} (Team ${selected[1]})` : "None"}</div>
                    <div>Pick Error: {pickError || "None"}</div>
                    <div>Is Polling: {isPolling ? "Yes" : "No"}</div>
                </div>
            </div>
            )
            }
            {canUserPick ?
                <div className="fixed bottom-10 inset-x-0 text-center w-full sm:w-8/12 m-auto bg-white rounded-3xl px-2 sm:px-8 py-2 gap-2.5 flex flex-row sm:flex-col items-center drop-shadow-xl">
                    <div className="font-bold whitespace-nowrap w-full">{(selected && selected[1] === currUserTeam ? "Remove": "Pick") + " " + ((selected && selected[0]?.handle) ?? "Team Member")}</div>
                    <p className="text-red-500">{pickError}{canUserPick ?? "bruh"} </p>
                    <div className="flex w-full gap-10">
                    {<button className="bg-neutral-500 font-bold text-white rounded-full sm:w-full px-2.5 py-1.5 w-40" onClick={()=>endTurn()}>Skip Turn</button>}
                        {selected && <button className="bg-red-800 font-bold text-white rounded-full sm:w-full px-2.5 py-1.5 w-40" onClick={()=>handleSubmit()}>Submit</button>}
                    </div>
                </div>
                :
                <div className="fixed bottom-10 inset-x-0 text-center w-full sm:w-8/12 m-auto bg-white rounded-3xl px-2 sm:px-8 py-2 gap-2.5 flex flex-row sm:flex-col items-center drop-shadow-xl">
                    <div className="font-bold whitespace-nowrap w-full">Waiting for {currUserTeam !== activeTeam && "other "}captain to pick...</div>
                </div>
            }
        </div>
    )
}