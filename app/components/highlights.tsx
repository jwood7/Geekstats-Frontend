import { useEffect, useState } from "react";
import { getAwards} from "../actions";
import { getCookie } from "cookies-next";
import Award, { AwardType }from "./award";

export default function Highlights(params: {isNight: boolean, seasonStart: string, seasonEnd: string}) {
    const placements = ["First", "Second", "Third", "Fourth", "Fifth"];
    const [awardData, setAwardData] = useState<AwardType[]>([]);
    
    async function handleGetAward(){
        const queryParams = params.isNight ? {} :  {start_date: params.seasonStart, end_date: params.seasonEnd}
        const awards = await getAwards(queryParams); // add dates here when season too
        console.log("all geeks awards data", awards);
        const awardsData = awards.map((award: any) => {
            return {
                // award.award_description goes unused for now
                awardName: award.award_title, 
                color: award.award_category_color, 
                rank: award.rank, 
                description: award.award_name, 
                value: award.geeks[0].aggregation_value, 
                imagePath: award.award_image_path,
                player: award.geeks[0].geek_handle,
            }
        });
        setAwardData(awardsData);
        console.log("awards data:", awardsData);
    }
    useEffect(()=>{
        handleGetAward();
    }, [params.isNight]);

    return <div className="dashboard-component rounded-xl overflow-hidden gap-2.5 drop-shadow-lg bg-white p-2.5">
        <h1 className="m-auto text-2xl text-center font-bold">Top Awards</h1>
        {/* <button onClick={()=>handleGetAward()}>Click to test</button> */}
        <div className="flex flex-col gap-2.5 py-2.5">
            {awardData.map((award)  => {return <Award awardData={award}/>}) }
        </div>
    </div>
}