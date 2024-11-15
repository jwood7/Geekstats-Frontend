import WeeklyMap from "./weeklyMap";
import TeamPlayerCard from "./teamPlayerCard";

const activeTeam = 1;
const currUserTeam = 1;

const getTeamBorder = (teamId: number, userTeam: number) => {
    if (teamId === activeTeam){
        
        if (teamId === userTeam){
            return "border-4 border-red-800 border-solid"
        }else{
            return "border-4 border-neutral-500 border-solid"
        }
    }else{
        return "border-4 border-transparent border-solid"
    }
}; 

const getTeamNameStyle = (teamId: number, userTeam: number) => {
    if (teamId === activeTeam){
        
        if (teamId === userTeam){
            return "bg-red-800 rounded-full text-white"
        }else{
            return "bg-neutral-500 rounded-full text-white"
        }
    }else{
        return ""
    }
}; 

export default function TeamPicker() {
    return (
        <div className="w-full h-full pt-2">
            <div className="bg-white drop-shadow px-5 pb-5 pt-2.5 rounded-lg m-2">
                <p>This week&apos;s maps</p>
                <div className="flex justify-evenly gap-2.5">
                    <WeeklyMap/>
                    <WeeklyMap/>
                    <WeeklyMap/>
                    <WeeklyMap/>
                    <WeeklyMap/>
                </div>
            </div>
            
            <div className="flex w-full">
                <div className="flex flex-col w-full h-full p-1 gap-1 content-centerr">
                    <h1 className={`font-xl font-bold text-center w-fit px-3 m-auto ${getTeamNameStyle(1, currUserTeam)}`}>Team 1</h1>
                    <div className={` ${getTeamBorder(1, currUserTeam)} bg-white drop-shadow rounded-md`}>Team 1 Stats</div>
                    <div className={` ${getTeamBorder(1, currUserTeam)} bg-white drop-shadow rounded-md flex flex-col content-center gap-2 p-2`}>
                        <TeamPlayerCard/>
                        <TeamPlayerCard/>
                        <TeamPlayerCard/>
                    </div>
                </div>
                
                <div className="flex flex-col w-full h-full p-1 gap-1 content-centerr">
                    <h1 className={`font-xl font-bold text-center w-fit px-3 m-auto ${getTeamNameStyle(0, currUserTeam)}`}>Unpicked</h1>
                    <div className={` ${getTeamBorder(0, currUserTeam)} bg-white drop-shadow rounded-md flex flex-col content-center gap-2 p-2`}>
                        <TeamPlayerCard/>
                        <TeamPlayerCard/>
                        <TeamPlayerCard/>
                    </div>
                </div>
                
                <div className="flex flex-col w-full h-full p-1 gap-1">
                    <h1 className={`font-xl font-bold text-center w-fit px-3  m-auto ${getTeamNameStyle(2, currUserTeam)}`}>Team 2</h1>
                    <div className={` ${getTeamBorder(2, currUserTeam)} bg-white drop-shadow rounded-md`}>Team 2 Stats</div>
                    <div className={` ${getTeamBorder(2, currUserTeam)} bg-white drop-shadow rounded-md flex flex-col content-center gap-2 p-2`}>
                        <TeamPlayerCard/>
                        <TeamPlayerCard/>
                        <TeamPlayerCard/>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-10 inset-x-0 text-center w-full sm:w-8/12 m-auto bg-white rounded-3xl px-8 pb-4 pt-2 gap-2.5 flex flex-row sm:flex-col">
                <div className="font-bold">Pick Team Member</div>
                <button className="bg-red-800 font-bold text-white rounded-full w-full py-1.5">Submit</button>
            </div>
        </div>
    )
}