'use server'

export async function getSummaries(startDate?: string, endDate?:string){
    if (!process.env.API_URL) return;
    let url = process.env.API_URL + "frags/summary-by-geek";

    if (startDate){
        url = url + "?start_date=" + startDate;
    }
    if (endDate){
        url = url + "&end_date=" + endDate;
    }
    console.log(url);
    try{
        const response = await fetch(url);
        const summaries = await response.json();
        // console.log(summaries);
        return summaries;
    }catch(e){
        console.error(e);
    }
}

export async function getDateInfo(startDate?: string, endDate?:string){
    if (!process.env.API_URL) return;
    let url = process.env.API_URL + "date-round";
    if (startDate){
        url = url + "?" + startDate;
    }
    if (endDate){
        url = url + "&" + endDate;
    }
    try{
        const response = await fetch(url);
        const dateInfo = await response.json();
        return dateInfo;
    }catch(e){
        console.error(e);
    }
}