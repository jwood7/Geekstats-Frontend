import { Map } from "./teamPicker";
import PercentBar from "./percentBar";
import MapBadges from "./mapBadges";

export default function WeeklyMap({match}: {match: Map}) {
    return (
        <div className="flex drop-shadow bg-neutral-200 w-full h-fit px-2 rounded content-center">
            <div className="bg-neutral-500 my-auto mr-1.5">
                {(process.env.NEXT_PUBLIC_MEDIA_URL && match.thumbnail) ? 
                <img className="h-10" src={process.env.NEXT_PUBLIC_MEDIA_URL + match.thumbnail} alt={match.map_name}/> 
            :
                <img className="h-10" src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/map_not_found.jpg"} alt={match.map_name}/>
            }
                </div>
            <div className="w-full flex justify-between">
                <div>
                    <p className="font-bold text-4">{match.map_name}</p>
                    <MapBadges match={match}/>
                </div>
                <div className="flex flex-end flex-col items-end">
                    <span title={`Metascore of ${match.metascore}`}>
                        <div
                            style={{
                                WebkitMaskImage: "linear-gradient(#000, #000)",
                                maskImage: "linear-gradient(#000, #000)",
                                maskSize: `${match.metascore ?? 0}%`,
                                height: "21px",
                                maskRepeat: "no-repeat",
                                width: "109px",
                                position: "fixed"
                            }}
                        >
                            <img src="/FiveStars.svg"></img>
                        </div>
                        <img src="/FiveStarsGrey.svg"></img>
                    </span>
                    <div className="flex items-center gap-1 w-32 justify-between">
                        <img className="w-5" src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/CT.png"} alt={"CT"}/>
                        <PercentBar 
                            colorFore="#58738A" 
                            colorBack="#CBB97D" 
                            percent={100*match.ct_wins / (match.ct_wins + match.t_wins)} 
                            hoverText={`${(100*match.ct_wins / (match.ct_wins + match.t_wins)).toFixed(2)}% CT Win Percentage`} 
                        />
                        <img className="w-5" src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/T.png"} alt={"T"}/>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}