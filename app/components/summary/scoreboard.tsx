import { useState, useEffect } from "react";
import TierWinner from "./tierWinner";
import { getTeams, getTiers } from "../../actions";
import React from "react";


export default function Scoreboard(params: {isNight: boolean, tableData: any}) {
    const tiers: {master:number[],  gold: number[], silver: number[], bronze: number[],} = { master: [],  gold: [], silver: [], bronze: [],};
    let tierView: number[] = [];
    let teamView: number[] = [];
    const [view, setView] = useState('default'); 
    const [teams, setTeams] = useState<Record<string, number[]>>({}); 
    const [filter, setFilter] = useState('default'); 
    const [tierRestrictions, setTierRestrictions] = useState<{tier_id: number, tier_name: string, tier_description: string, tier_restrict_max: number, tier_weapon_restrict: string[], tier_armor_restrict:boolean[]}[] >([]); 
    
    function findTierWinners(){
        if (params.tableData){
            for (let i = 0; i < params.tableData?.length; i++){
                if (params.tableData[i].tier_id == 4){
                    tiers.bronze.push(i);
                }else if (params.tableData[i].tier_id == 3){
                    tiers.silver.push(i);
                }else if (params.tableData[i].tier_id == 2){
                    tiers.gold.push(i);
                }else if (params.tableData[i].tier_id == 1){
                    tiers.master.push(i);
                }
            }
            tierView = [...tiers.master, ...tiers.gold, ...tiers.silver, ...tiers.bronze]; 
        }
    }

    // This is so inefficient, should revise at some point
    async function findTeams(){
      const teamData = await getTeams();
      let teamRecord: Record<string, number[]> = {}
      if (params.tableData){
        for (let i = 0; i < params.tableData?.length; i++){
          for (let t = 0; t < teamData.length; t++){ // team has a lot more values, but I am too lazy to define them rn
            for (let geek = 0; geek < teamData[t].team.length; geek++){ 
              if (params.tableData[i].geek_id === teamData[t].team[geek].geek_id){
                if (teamRecord.hasOwnProperty(teamData[t].team_name)){
                  teamRecord[teamData[t].team_name].push(i);
                }else{
                  teamRecord[teamData[t].team_name] = [i];
                }
              }
            }
          }
        }
      }
      setTeams(teamRecord);

    }

    async function getTierRestrictions(){
      const tierRestrictionsFromAPI = await getTiers();
      setTierRestrictions(tierRestrictionsFromAPI);
    }

    function getTierColor(tierName: string){
        if (tierName === "Bronze"){
            return "bg-bronze"
        }else if (tierName === "Silver"){
            return "bg-silver"
        }else if (tierName === "Gold"){
            return "bg-gold"
        }else if (tierName === "West1: Master"){
            return "bg-master"
        }else{
            return "bg-white"
        }
    }

    function createRow(row: any, index: number){
      return <tr key={index} className={getTierColor(row.tier_name)}>
        <td className=" sm:px-2">{row.rank}</td>
        <td className=" sm:px-2 underline"><a href={"http://stats.geekfestclan.com/PlayerDetails?pid=" + row.geek_id}>{row.handle}</a></td>
        {view === 'default' && (
            <>
            <td className=" sm:px-2">{row.total_kills}</td>
            <td className=" sm:px-2">{row.total_deaths}</td>
            <td className=" sm:px-2">{row.total_assists}</td>
            <td className=" sm:px-2">{row.kdr}</td>
            {/* <td className=" sm:px-2">{row.akdr}</td> */}
            <td className=" sm:px-2">{row.avg_total_damage}</td>
            </>
        )}
        {view === 'extended' && (
            <>
            <td className={" sm:px-2 " + (row.kdr - row.year_kdr < 0 ? "text-red-500" : "text-green-600")}>{row.kdr - row.year_kdr > 0 && "+"}{(row.kdr - row.year_kdr).toFixed(2)}</td>
            <td className="sm:px-2">
            <span title={ row.top_weapon.total_kills + " kills with " +  row.top_weapon.weapon_name}>
              {(process.env.NEXT_PUBLIC_IMAGE_URL && row.top_weapon.weapon_name) && <img className="m-auto max-h-6" src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/Weapons/" + row.top_weapon.weapon_name + ".png"} alt={row.top_weapon.weapon_name}/> }
            </span>
            </td>
            <td className=" sm:px-2">{row.alltime_kdr}</td>
            <td className=" sm:px-2">{row.tier_name == "West1: Master" ? "Master": row.tier_name}</td>
            </>
        )}
        
        <td></td>
        </tr>
    }

    findTierWinners(); // this is ineffecient when switching between seasons and night views, since it has to rerun every time
    // should import season data, night data, and isNight from page, and process them on first run, then swap between as needed

    const toggleView = () => {
        setView(view === 'default' ? 'extended' : 'default');
      };

      useEffect(()=>{
        getTierRestrictions()
      }, []);

      useEffect(()=>{
        findTeams();
      }, [params.isNight, params.tableData]);
    
      return (
        <div className=" mx-auto p-3 rounded-2xl bg-white drop-shadow-xl w-full text-xs sm:text-base">
          <div className="text:xs sm:text-2xl font-bold text-center pb-1">Leaderboard {params.isNight ? "for the Night" : "for the Season"}</div>
            <div className="flex justify-evenly w-full pb-2 flex-wrap flex-col sm:flex-row content-center">
                {tiers && Object.values(tiers).map((tier)=>{
                    if (tier.length > 0){
                        const player = params.tableData[tier[0]];
                        return <TierWinner key={player.geek_id} player={player} getTierColor={getTierColor}/>
                    }
                })}
            </div>
            <div className="flex">
                <div className=" m-1">Filter: </div>
                <button className="px-2.5  m-1 bg-silver rounded w-20 text-center" onClick={()=> setFilter("default")}>Default </button>
                <button className="px-2.5  m-1 bg-silver rounded w-20 text-center" onClick={()=> setFilter("tier")}>Tier</button>
                <button className="px-2.5  m-1 bg-silver rounded w-20 text-center" onClick={()=> setFilter("team")}>Team</button>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center">
              <thead>
                <tr className="bg-black text-white">
                  <th className=" sm:px-2">Rank</th>
                  <th className=" sm:px-2">Player</th>
                  {view === 'default' && (
                    <>
                        <th className=" sm:px-2">Kills</th>
                        <th className=" sm:px-2">Deaths</th>
                        <th className=" sm:px-2">Assists</th>
                        <th className=" sm:px-2">KDR</th>
                        {/* <th className=" sm:px-2">aKDR</th> */}
                        <th className=" sm:px-2">ADR</th>
                    </>
                  )}
                  {view === 'extended' && (
                    <>
                      <th className=" sm:px-2">vs 1yr AVG</th>
                      <th className=" sm:px-2">Top Weapon</th>
                      <th className=" sm:px-2">All Time KDR</th>
                      <th className=" sm:px-2">Tier</th>
                    </>
                  )}
                  <th className=" sm:px-2" onClick={toggleView}><button>&#8596;</button></th>
                </tr>
              </thead>
              <tbody>
            {filter == "default" && params.tableData && params.tableData?.map((row: any, index:number) => (
              createRow(row, index)
            ))}
            {filter == "tier" && tierView && tierView.map((row: any, index:number) => (
              createRow(params.tableData[row], index)
            ))}
            {filter == "team" && teams && Object.entries(teams).map(([name, geeks]) => {
              return (<React.Fragment key={`team-${name}`}>
                <tr className="bg-red-800 text-white w-full" key={name}>
                  <td colSpan={100} className="font-bold sm:px-2">{name}</td>
                </tr>
                {
                  geeks.map((row: number, index: number) => {
                    return createRow(params.tableData[row], index);
                  })
                }
              </React.Fragment>)
            }
              
            )}
          </tbody>
        </table>
      </div>
      <div className="flex uppercase justify-center py-5 font-bold flex-col sm:flex-row items-center"> 
        <p className="pr-1">TIER RESTRICTIONS: </p> 
        {tierRestrictions && tierRestrictions.map((tier)=>{
          const description = tier.tier_weapon_restrict.length < 1 ? "No restrictions" : tier.tier_weapon_restrict && "Cannot use " + tier.tier_weapon_restrict.map((weapon, index) => {return (index !=0 ? " " : "") + weapon}) + (tier.tier_armor_restrict ? " or armor" : "");
          return <span title={description} key={tier.tier_id}><div className={"px-2 w-20 text-center " + getTierColor(tier.tier_name)}> {tier.tier_name == "West1: Master" ? "Master": tier.tier_name} </div></span>
        })}
      </div>
      <a className="flex justify-center underline" href="https://sites.google.com/view/gfxxv/rules#h.b735l0b8asys">View All Tier Restrictions and Rules</a>
    </div>
  );
};
