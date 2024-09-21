export default function Scoreboard(params: {isNight: boolean, tableData: any}) {
    let winners = [];
    let tableViews = [[],[]];
    
    function formatData(){
        params.tableData.forEach(()=>{
            // create an object for eachview
            // add tier and name info to both views
            // add stats or components for respective views to table views
        })
    }
    console.log(params.tableData);

    return <div>
        <div>
            {/* winners */}
            hi
        </div>
        <table>
            <thead>
                {/* headers */}
                {/* button to switch between table pages */}
            </thead>
            <tbody>
                {/* body */}
            </tbody>
        </table>
    </div>
}