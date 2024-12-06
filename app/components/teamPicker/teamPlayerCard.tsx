import { Geek } from "./teamPicker"


// this function is reused in teamPicker, should move to a new file and import.
export function getKdrChange(alltime_kdr: number, kdr: number){
    
    const kdrDiff = parseFloat((alltime_kdr-kdr).toFixed(2));
    if (kdrDiff > 0) return  <div className="text-green-500" >+{kdrDiff}</div>;
    if (kdrDiff < 0) return <div className="text-red-500" >{kdrDiff}</div>;
    return <div>{kdrDiff}</div>
}

export default function TeamPlayerCard({playerData, selected, select, teamId} : {playerData: Geek, selected: [Geek, number] | null, select: (geek: Geek, teamId: number)=>void, teamId: number}) {

    // this function is reused in scoreboard. Should probably move to a new file and import, although that version has bg-.
    function getTierColor(tierName: string | number){
        if (tierName === "Bronze" || tierName === 4){
            return "bronze"
        }else if (tierName === "Silver" || tierName === 3){
            return "silver"
        }else if (tierName === "Gold" || tierName ===2){
            return "gold"
        }else if (tierName === "West1: Master" || tierName === 1){
            return "master"
        }else{
            return "white"
        }
    }
    
    function getTierChange(tier: number, lastTier: number){
        const tierDiff = tier-lastTier;
        // Should import svgs for arrows later
        if (tierDiff > 0) return <div className={`text-${getTierColor(tier)} font-bold`}>^</div>;
        if (tierDiff < 0) return <div className={`text-${getTierColor(tier)} font-bold`}>v</div>;
        return <div className={`text-${getTierColor(tier)} font-bold`}>-</div>;
    }

    

    return (
        <div className={`flex drop-shadow bg-neutral-800 w-full h-fit rounded-xl text-white overflow-clip gap-2.5 ${selected && selected[0]?.geek_id === playerData.geek_id && "border-red-800 border-4"}`} onClick={()=>select(playerData, teamId)}>
            <div className={`bg-${getTierColor(playerData?.tier)} p-2.5`}>
                <div className="w-20 h-20 bg-neutral-500 my-auto rounded overflow-clip">{process.env.NEXT_PUBLIC_IMAGE_URL && <img src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/geeks/" + playerData?.handle?.toLowerCase() + ".png"} alt={playerData?.handle}/> }</div>
            </div>
            <div className="w-full flex flex-col pt-2.5">
                <div className="text-xl font-bold">{playerData?.handle}</div>
                <div className="flex flex-row text-xs py-0.5 gap-1">
                    <div className="flex flex-col gap-2.5">
                        <div>KDR</div>
                        <div>{playerData?.alltime_kdr}</div>
                    </div>
                    <div className="flex flex-col gap-2.5 items-center">
                        <div>Attend.</div>
                        <div>{playerData?.attendance_pct ?? 0}%</div>
                    </div>
                    <div className="flex flex-col gap-2.5 items-center">
                        <div>Last Seas.</div>
                        {getKdrChange(playerData?.perf_last_season ?? 0, 0)}
                    </div>
                    <div className="flex flex-col gap-2.5 items-center">
                        <div>Last 90</div>
                        {getKdrChange(playerData?.alltime_kdr, playerData?.last90_kdr ?? 0)}
                    </div>
                    {/* Add this back after map page completed */}
                    {/* <div className="flex flex-col gap-2.5 items-center">
                        <div>On Maps</div>
                        {getKdrChange(playerData?.alltime_kdr, playerData?.last90_kdr ?? 0)}
                    </div> */}
                    <div className="flex flex-col gap-2.5 items-center">
                        <div>Tier Chg.</div>
                        {getTierChange(playerData.tier, playerData.tier_last_season)}
                    </div>
                    
                    <div className="flex flex-col gap-2.5 items-center">
                        <div>Var.</div>
                        <div>{playerData?.attendance_pct ?? 0}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}