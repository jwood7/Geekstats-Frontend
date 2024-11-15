export default function DataToggle(params: {isNight: boolean, setIsNight: (arg: boolean)=>void, setSummary: (arg: any)=>void, night: any, season: any}) {
    function handleClick(){
        if(params.isNight){
            params.setSummary(params.season);
        }else{
            params.setSummary(params.night); 
        }
        params.setIsNight(!params.isNight);
    }
    return <div onClick={handleClick} className="rounded-xl flex bg-white overflow-hidden h-fit">
        {params.isNight 
        ? 
            <>
                <div className="w-24 text-center font-bold py-1 content-center">Night</div>
                <div className="w-24 text-center font-normal bg-silver text-white py-1 content-center">Season</div>
            </>
        :
            <>
                <div className="w-24 text-center font-normal bg-silver text-white py-1 content-center">Night</div>
                <div className="w-24 text-center font-bold py-1 content-center">Season</div>
            </>
        }
        {/* {params.isNight ? "Night" : "Season"} */}
        </div>
}