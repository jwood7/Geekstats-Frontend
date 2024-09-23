import { useState, useEffect } from "react";
// import { getCookie } from "../actions";
import { getCookie } from 'cookies-next';

export default function YourSummary(params: {isNight: boolean, stats: any}) {
    // need to store season/night data
    const [yourStats, setYourStats] = useState({
        KDR: "0",
        Kills: "0",
        Deaths: "0",
        Assists: "0",
        ADR: "0",
        vs_1yr: <p>"+0.00"</p>
    });
    const [ranks, setRanks] = useState({
        Rank: "0 of 0",
        Team_Rank: "0 of 0",
        Tier_Rank: "0 of 0",
        Tier: <div className="bg-red-800 rounded-2xl px-5">None</div>,
    });

    const [playerInfo, setPlayerInfo] = useState({
        id: getCookie("userId")?.toString(),
        name: getCookie("username")?.toString(),
    })

    const [topWeapon, setTopWeapon] = useState({weapon_name: "", total_kills: 0});

    async function handleLoginChange(){
        const id =  getCookie("userId")?.toString() ?? '';
        const name = getCookie("username")?.toString() ?? '';
        setPlayerInfo({id: id, name: name})
    }

    useEffect(()=> {
        handleLoginChange();
    }, [getCookie("userId")]);

    const yourName = "Yakobay"; // pull this from login cookies eventually
    const yourId = 18;

    function getTier(tierName: string){
        if (tierName === "Bronze"){
            return <div className="bg-bronze rounded-2xl px-5">Bronze</div>
        }else if (tierName === "Silver"){
            return <div className="bg-silver rounded-2xl px-5">Silver</div>
        }else if (tierName === "Gold"){
            return <div className="bg-gold rounded-2xl px-5">Gold</div>
        }else if (tierName === "West1: Master"){
            return <div className="bg-master rounded-2xl px-5">Master</div>
        }else{
            return <div className="bg-red-800 rounded-2xl px-5">None</div>
        }
    }

    async function getStats() {
        // with rank changes, we do not need to pass in every geek's stats to this component.
        // should do this on the page page.
        const playerStats = params.stats.find((geek: { geek_id: number; }) => geek.geek_id === yourId);
        const kdrChange = parseFloat(playerStats.kdr) - parseFloat(playerStats.year_kdr);
        let vs1yr=  kdrChange < 0 ? <p className="text-red-600">{"" + kdrChange.toFixed(2)}</p> : <p className="text-green-600">{"+" + kdrChange.toFixed(2)}</p>;
        setYourStats({
            ...yourStats,
            KDR: playerStats.kdr,
            Kills: playerStats.total_kills,
            Deaths: playerStats.total_deaths,
            Assists: playerStats.total_assists,
            ADR: playerStats.avg_total_damage,
            vs_1yr: vs1yr
        });
        setRanks({
            ...ranks,
            Rank: playerStats.rank + " of " + playerStats.total_people_all,
            // Team_Rank: playerStats.team_rank +" of " + playerStats.total_people_in_team,
            Tier_Rank: playerStats.rank_in_tier + " of " + playerStats.total_people_in_tier,
            Tier: getTier(playerStats.tier_name),
        });
        setTopWeapon(playerStats.top_weapon);
        console.log(playerStats.top_weapon);
        // TBD set mouseover/tooltip that says how many kills for top weapon and explains ranks

    }

    useEffect(()=>{
        if (params.stats && params.stats.length > 0) getStats();
    }, [params.stats]);

    // getStats();

    if ((playerInfo.id?.length ?? -1) <= 0){
        return
    }

    return <div className="dashboard-component rounded-xl overflow-hidden gap-2.5 drop-shadow-lg bg-white">
        <div className="your-summary-top bg-neutral-900 text-white flex flex-row px-4 gap-2.5 pt-5 pb-2.5">
            <div className="h-32 w-32 bg-neutral-500 rounded-lg">
                {process.env.NEXT_PUBLIC_IMAGE_URL && <img src={process.env.NEXT_PUBLIC_IMAGE_URL + "geeks/" + yourName + ".png"}/> }
            </div>
            <div >
                <h1 className="font-bold text-2xl px-3">{(playerInfo.name?.length ?? -1 )> 0 ? yourName + "'s ": "Your"} Summary</h1>
                <div className="flex flex-row p-2.5 gap-2.5 text-xl">
                
                    {Object.entries(yourStats).map(([stat, value]) => {
                        return (
                        <div className="p-2.5 text-center">
                            <div className="font-bold"> {stat.replaceAll("_", " ")} </div>
                            <div> {value} </div>
                        </div>
                        )
                    })}

                </div>
            </div>
        </div>
        <div className="your-summary-bottom flex flex-row px-4 gap-2.5">
            <div className="flex flex-row gap-2.5 text-xl py-2.5">
                <div  className="py-2.5">
                    <div className="font-bold">Top Weapon</div>
                    <div className="h-9 w-32">
                    {(process.env.NEXT_PUBLIC_IMAGE_URL && topWeapon.weapon_name) && <img className="m-auto" src={process.env.NEXT_PUBLIC_IMAGE_URL + "weapons/" + topWeapon.weapon_name + ".png"}/> }
                    </div>
                </div>
            
                {Object.entries(ranks).map(([rank, value]) => {
                    return (
                    <div className="p-2.5 text-center">
                        <div className="font-bold"> {rank.replaceAll("_", " ")} </div>
                        <div> {value} </div>
                    </div>
                    )
                })}

            </div>
        </div>
    </div>
}