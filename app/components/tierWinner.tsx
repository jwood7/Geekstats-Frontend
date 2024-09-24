export default function TierWinner(params: {player: any, getTierColor: (color: string) => string}) {
    const flavorText = ["master and commander", "all that glitters", "more than a silver lining", "harder than hard"]
    return <div className="rounded-xl bg-black text-white overflow-hidden w-48 m-1">
        
        <div className="flex">
            <div className="flex ">
                <div className="h-20 w-20 overflow-hidden">
                    {process.env.NEXT_PUBLIC_IMAGE_URL && <img alt={params.player.handle} src={process.env.NEXT_PUBLIC_IMAGE_URL + "/images/geeks/" + params.player.handle.toLowerCase() + ".png"}/> }
                </div>
                
            </div>
            <div className="w-full">
                <div className={params.getTierColor(params.player.tier_name) + " uppercase text-black font-bold text-xs p-1 w-full"}>
                    {params.player.tier_name == "West1: Master" ? "Master" : params.player.tier_name}    
                </div>
                <div className="text-base italic pl-1">
                    {params.player.handle}
                </div>
                {/* <div className="align-text-middle justify-center h-fit uppercase text-xs pl-1">{flavorText[params.player.tier_id-1]}</div> */}
                <div className="align-text-middle justify-center h-fit text-xs pl-1">{params.player.kdr} K/D</div>
            </div>
        </div>
        
        
    </div>
}