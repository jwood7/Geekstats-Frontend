import { table } from "console";
import { useState } from "react";
import TierWinner from "./tierWinner";


export default function Scoreboard(params: {isNight: boolean, tableData: any}) {
    // console.log(params.tableData);
    let tiers: {master:number[],  gold: number[], silver: number[], bronze: number[],} = { master: [],  gold: [], silver: [], bronze: [],};
    let tierView: number[] = [];
    const [view, setView] = useState('default'); 
    const [filter, setFilter] = useState('default'); 
    
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
            // console.log(tierView);
        }
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
        <td className=" px-2">{row.rank}</td>
        <td className=" px-2"><a href={"http://stats.geekfestclan.com/PlayerDetails?pid=" + row.geek_id}>{row.handle}</a></td>
        {view === 'default' && (
            <>
            <td className=" px-2">{row.total_kills}</td>
            <td className=" px-2">{row.total_deaths}</td>
            <td className=" px-2">{row.total_assists}</td>
            <td className=" px-2">{row.kdr}</td>
            {/* <td className=" px-2">{row.akdr}</td> */}
            <td className=" px-2">{row.avg_total_damage}</td>
            </>
        )}
        {view === 'extended' && (
            <>
            <td className={" px-2 " + (row.kdr - row.year_kdr < 0 ? "text-red-500" : "text-green-600")}>{row.kdr - row.year_kdr > 0 && "+"}{(row.kdr - row.year_kdr).toFixed(2)}</td>
            <td className="px-2">
            {(process.env.NEXT_PUBLIC_IMAGE_URL && row.top_weapon.weapon_name) && <img className="m-auto" src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/Weapons/" + row.top_weapon.weapon_name + ".png"}/> }
            
                {/* <img src={row.top_weapon_img_url} alt="Top Weapon" className="h-6 w-auto mx-auto"/> */}
            </td>
            <td className=" px-2">{row.alltime_kdr}</td>
            <td className=" px-2">{row.tier_name == "West1: Master" ? "Master": row.tier_name}</td>
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
    
      return (
        <div className=" mx-auto p-4 rounded-2xl bg-white drop-shadow-xl w-full">
            <div className="flex justify-evenly w-full pb-2 flex-wrap">
                {Object.values(tiers).map((tier)=>{
                    // console.log("tier", tier);
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
                  <th className=" px-2">Rank</th>
                  <th className=" px-2">Player</th>
                  {view === 'default' && (
                    <>
                        <th className=" px-2">Kills</th>
                        <th className=" px-2">Deaths</th>
                        <th className=" px-2">Assists</th>
                        <th className=" px-2">KDR</th>
                        {/* <th className=" px-2">aKDR</th> */}
                        <th className=" px-2">ADR</th>
                    </>
                  )}
                  {view === 'extended' && (
                    <>
                      <th className=" px-2">vs 1yr AVG</th>
                      <th className=" px-2">Top Weapon</th>
                      <th className=" px-2">All Time KDR</th>
                      <th className=" px-2">Tier</th>
                    </>
                  )}
                  <th className=" px-2" onClick={toggleView}><button>&#8596;</button></th>
                </tr>
              </thead>
              <tbody>
            {filter == "default" && params.tableData?.map((row: any, index:number) => (
              createRow(row, index)
            ))}
            {filter == "tier" && tierView.map((row: any, index:number) => (
              createRow(params.tableData[row], index)
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex uppercase justify-center py-5 font-bold"> TIER RESTRICTIONS: 
        <div className="px-2 bg-master">Master</div>
        <div className="px-2 bg-gold">Gold</div>
        <div className="px-2 bg-silver">Silver</div>
        <div className="px-2 bg-bronze">Bronze</div>
      </div>
      <a className="flex justify-center underline" href="https://sites.google.com/view/gfxxv/rules#h.b735l0b8asys">View All Tier Restrictions and Rules</a>
    </div>
  );
};
