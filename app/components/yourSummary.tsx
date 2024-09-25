import { useState, useEffect } from "react";
import { getCookie } from 'cookies-next';

export default function YourSummary(params: {isNight: boolean, stats: any}) {
    // need to store season/night data
    const [yourStats, setYourStats] = useState({
        KDR: "0",
        Kills: "0",
        Deaths: "0",
        Assists: "0",
        ADR: "0",
        vs_1yr: <p>+0.00</p>
    });
    const [ranks, setRanks] = useState({
        Rank: "0 of 0",
        // Team_Rank: "0 of 0",
        Tier_Rank: "0 of 0",
        Tier: <div className="bg-red-800 rounded-2xl px-5">None</div>,
    });

    const [playerInfo, setPlayerInfo] = useState({
        id: -1,
        name: '',
    })

    const [topWeapon, setTopWeapon] = useState({weapon_name: "", total_kills: 0});

    async function handleLoginChange(){
        const id =  getCookie("userId")?.toString() ?? "-1";
        const name = getCookie("username")?.toString() ?? '';
        setPlayerInfo({id: parseInt(id), name: name})
    }

    useEffect(()=> {
        handleLoginChange();
    }, [getCookie("userId")]);

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
        if (playerInfo.id < 0) return;
        const playerStats = params.stats.find((geek: { geek_id: number; }) => geek.geek_id === playerInfo.id);
        const kdrChange = parseFloat(playerStats.kdr) - parseFloat(playerStats.year_kdr);
        const vs1yr=  kdrChange < 0 ? <p className="text-red-600">{"" + kdrChange.toFixed(2)}</p> : <p className="text-green-600">{"+" + kdrChange.toFixed(2)}</p>;
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

    }

    useEffect(()=>{
        if (params.stats && params.stats.length > 0) getStats();
    }, [params.stats]);

    if (playerInfo.id < 0){
        return <div></div>
    }

    return <div className="dashboard-component rounded-xl overflow-hidden gap-2.5 drop-shadow-lg bg-white">
        <div className="your-summary-top bg-neutral-900 text-white flex flex-row px-4 gap-2.5 pt-2 justify-center sm:justify-start">
            <div className="h-0 w-0 sm:h-24 sm:w-24 bg-neutral-500 rounded-lg">{process.env.NEXT_PUBLIC_IMAGE_URL && <img src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/geeks/" + playerInfo.name?.toLowerCase() + ".png"}/> }</div>
            <div >
                <h1 className="font-bold text-2xl sm:px-3 text-center sm:text-left">{(playerInfo.name?.length ?? -1 )> 0 ? playerInfo.name + "'s ": "Your"} Summary</h1>
                <div className="flex flex-row gap-2.5 text-xs sm:text-lg flex-wrap ">
                    {Object.entries(yourStats).map(([stat, value]) => {
                        return (
                        <div key={stat} className="py-2.5 sm:p-2.5 text-center">
                            <div className="font-bold"> {stat.replaceAll("_", " ")} </div>
                            <div> {value} </div>
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
        <div className="your-summary-bottom flex flex-row px-4 gap-2.5 justify-center sm:justify-start">
            <div className="flex flex-row gap-2.5 text-xs sm:text-lg flex-wrap">
                <div  className="py-2.5">
                    <div className="font-bold">Top Weapon</div>
                    <span title={topWeapon.total_kills + " kills with " + topWeapon.weapon_name}>
                        <div className="h-9 w-24">{(process.env.NEXT_PUBLIC_IMAGE_URL && topWeapon.weapon_name) && <img className="m-auto" src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/Weapons/" + topWeapon.weapon_name + ".png"}/> }</div>
                    </span>
                </div>
            
                {Object.entries(ranks).map(([rank, value]) => {
                    return (
                    <div key={rank} className="py-2.5 sm:p-2.5 text-center">
                        <div className="font-bold">{rank.replaceAll("_", " ")}</div>
                        <div>{value}</div>
                    </div>
                    )
                })}

            </div>
        </div>
    </div>
}