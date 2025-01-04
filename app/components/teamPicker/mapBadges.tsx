import { Map } from "./teamPicker"
export default function MapBadges({match}:{match: Map}){
    const ninjaPercent = 100 * match.ninja_kills / match.total_kills;
    const lmgPercent = 100 * match.lmg_kills / match.total_kills;
    const sniperPercent = 100 * match.sniper_kills / match.total_kills;
    const bombPercent = 100 * match.bomb_plant_rounds / (match.bomb_plant_rounds + match.no_obj_rounds);
    return (
        <div className="flex gap-1">
            <span title={(100*match.top_weapon_kills/match.total_kills).toFixed(2) + "% of kills with " + match.top_weapon_name}>
                {(process.env.NEXT_PUBLIC_IMAGE_URL && match.top_weapon_name) && <img className="m-auto max-h-5" src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/Weapons/" + match.top_weapon_name + ".png"} alt={match.top_weapon_name}/> }
            </span>
            {ninjaPercent > 2 && 
                <span title={`${(ninjaPercent).toFixed(2)}% of kills were with tasers, knives, flames or grenades`}>
                    <img className="w-5" src="/map_badges/ninja_icon1.png" alt="ninja"/>
                </span>
            }
            {lmgPercent > 10 && 
                <span title={`${(lmgPercent).toFixed(2)}% of kills were lmg mow downs`}>
                    <img className="w-5" src="/map_badges/hmg3.png" alt="lmg"/>
                </span>}
            {sniperPercent > 10 && 
                <span title={`${(sniperPercent).toFixed(2)}% of kills were from snipers`}>
                    <img className="w-5" src="/map_badges/sniper.png" alt="sniper"/>
                </span>}
            {bombPercent > 30 && 
                <span title={`${(bombPercent).toFixed(2)}% of rounds had a bomb plant`}>
                    <img className="w-5" src="/map_badges/bomb.png" alt="bomb"/>
                </span>}
        </div>
    )
}