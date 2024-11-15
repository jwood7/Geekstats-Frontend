import { useState } from "react";

export type AwardType = {
    awardName: string, color: string, player?: string, rank: string, description: string, value: string | number, imagePath: string, geeks?: {geek_id: number, geek_handle: string, aggregation_value: string}[]
}

export default function Award(params: {awardData: AwardType}) {
    const [showRankings, setShowRankings] = useState(false);
    function getPlace(rank: string){
        if (rank == "1"){
            return "First Place";
        }else if (rank == "2"){
            return "Second Place";
        }else if (rank == "3"){
            return "Third Place";
        }else {
            return rank+"th Place";
        }
    }

    return <div className="rounded-xl overflow-hidden w-80 m-1 drop-shadow-lg m-auto bg-[#EAEAEA] ">
        <div className="rounded-xl overflow-hidden w-80 m-1 m-auto bg-[#EAEAEA] " onClick={()=>setShowRankings(!showRankings)}>
        
            <div className="flex">
                <div className="flex ">
                    <div className="h-16 w-16 py-0.5 px-1 overflow-hidden flex content-center" style={{backgroundColor: params.awardData.color}}>
                        {process.env.NEXT_PUBLIC_IMAGE_URL && <img className="m-auto" alt={params.awardData.awardName} src={process.env.NEXT_PUBLIC_IMAGE_URL + params.awardData.imagePath}/> }
                    </div>
                    
                </div>
                <div className="w-full">
                    <div className= {"uppercase text-black font-bold text-xs p-1 w-full flex justify-between"} style={{backgroundColor: params.awardData.color}}>
                        {params.awardData.awardName}    
                        <span title={getPlace(params.awardData.rank)}><button className="bg-white h-5 w-5 rounded-full text-center flex items-center justify-center"> {params.awardData.rank} </button></span>
                    </div>
                    {params.awardData.player ? 
                        <>
                        <div className="font-bold pl-1 italic text-xs">
                            {params.awardData.player}
                        </div>
                        <div className="align-text-middle justify-center h-fit text-xs pl-1">{params.awardData.value} {params.awardData.description}</div>
                        </>

                        :
                        <>
                            <div className="align-text-middle justify-center h-fit text-xs pl-1">{params.awardData.description}</div>
                            <div className="align-text-middle justify-center h-fit text-xs pl-1">{params.awardData.value}</div>
                        </>
                    }
                    
                </div>
            </div>
            
            
        </div>

        <div>
            {
                showRankings && params.awardData.geeks && params.awardData.geeks.map((geek) => {
                    return (
                        <div className="flex justify-between px-2">
                            <div>{geek.geek_handle}</div>
                            <div>{geek.aggregation_value}</div>
                        </div>
                    )
                })
            }

        </div>
    </div>
}