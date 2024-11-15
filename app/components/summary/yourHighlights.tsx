import { useEffect, useState } from "react";
import { getAwardsForGeek } from "../../actions";
import { getCookie } from "cookies-next";
import Award, { AwardType }from "./award";

export default function YourHighlights(params: {isNight: boolean, seasonStart: string, seasonEnd: string}) {
    // const placements = ["First", "Second", "Third", "Fourth", "Fifth"];
    const [awardData, setAwardData] = useState<AwardType[]>([]);
    const [playerId, setPlayerId] = useState("");
    
    const [allAwardData, setAllAwardData] = useState<AwardType[]>([]);
    const [showMore, setShowMore] = useState(false);
    
    async function handleGetAward(){
        const geek_id = getCookie("userId")?.toString() ?? "";
        setPlayerId(geek_id);
        if (geek_id){
            const queryParams = params.isNight ? {geek_id: parseInt(geek_id)} :  { geek_id: parseInt(geek_id), start_date: params.seasonStart, end_date: params.seasonEnd}
            let awards = await getAwardsForGeek(queryParams); // add dates here when season too
            awards = awards.slice(0,5);
            const awardsData = awards.map((award: any) => {
                return {
                    // award.award_description goes unused for now
                    awardName: award.award_title, 
                    color: award.award_category_color, 
                    rank: award.rank, 
                    description: award.award_name, 
                    value: parseInt(award.aggregation_value), 
                    imagePath: award.award_image_path,
                    geeks: award.geeks.slice(0,5),
                }
            });
            setAwardData(awardsData);
            setAllAwardData(awardsData);
        }
    }
    useEffect(()=>{
        handleGetAward();
    }, [params.isNight, getCookie("userId")]);

    function handleShowMore(){
        if (showMore){
            setAwardData(awardData.slice(0,5));
        }else{
            setAwardData(allAwardData);
        }
        setShowMore(!showMore);
    }

    if (!playerId) return <div></div>
    return <div className="dashboard-component rounded-xl overflow-hidden gap-2.5 drop-shadow-lg bg-white p-2.5 min-w-full">
        <h1 className="m-auto text-2xl text-center font-bold">Your Highlights</h1>
        {/* <button onClick={()=>handleGetAward()}>Click to test</button> */}
        <div className="flex flex-col gap-2.5 py-2.5">
            {awardData.map((award)  => {return <Award key={award.awardName} awardData={award}/>}) }
            <button className="bg-silver rounded-full drop-shadow"onClick={()=>handleShowMore()}>{showMore ? "▲ Show Less" : "▼ Show More"}</button>
        </div>
    </div>

}