'use server'

import { cookies } from "next/headers";

function addQueryParams(url: string, queryParams: any){
    let separator = "?";
    Object.entries(queryParams).map(([key, value]) => {
        url = url + separator + key + "=" + value;
        separator = "&"
    });
    return url;
}

export async function getSummaries(startDate?: string, endDate?:string){
    if (!process.env.API_URL) return;
    let url = process.env.API_URL + "/frags/summary-by-geek";

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
    let url = process.env.API_URL + "/date-round";
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

export async function login(user:string, password: string) {
    if (!process.env.API_URL) return;
    const url = process.env.API_URL + "/login/?username=" + user + "&password=" + password;
    try{
        const response = await fetch(url, {method:"POST"});
        const userInfo = await response.json();
        if (!userInfo.username){
            console.log("login failed");
            throw userInfo.detail;
        }
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
            // Extract the csrf token from the Set-Cookie header
            const cookieArray = setCookieHeader.split(',');
            cookieArray.forEach(cookie => {
            if (cookie.trim().startsWith('csrftoken=')) {
                const token = cookie.split(';')[0].split('=')[1];
                cookies().set('csrftoken', token); // Store the CSRF token in state
            }if (cookie.trim().startsWith('sessionid=')) {
                const token = cookie.split(';')[0].split('=')[1];
                cookies().set('sessionid', token); // Store the CSRF token in state
            }
            });
         }
        cookies().set('userId', userInfo.geek_id);
        cookies().set('username', userInfo.username);
        return userInfo;

    }catch(e){
        console.error(e);
        return e;
    }
}

export async function logout() {
    if (!process.env.API_URL) return;
    const url = process.env.API_URL;
    try{
        const csrf = cookies().get('csrftoken')?.value ?? '';
        const session = cookies().get('sessionid')?.value ?? '';
        const response = await fetch(url + "/logout/", {method: "POST", headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Cookie': 'csrftoken='+ csrf+'; sessionid='+session } , credentials:"include"});
        const logoutResponse = await response.json();
        if (logoutResponse.message != "Logged out successfully"){
           throw logoutResponse;
        }
        cookies().delete('userId');
        cookies().delete('username');
        return "Logged out";

    }catch(e){
        console.error(e);
        return e;
    }
}

export async function getCookie(cookieName: string){
    return cookies().get(cookieName);
}

export async function getAwardsForGeek(queryParams : {geek_id: number, start_date?: string, end_date?: string, start?: string, end?: string}){
    let url = process.env.API_URL + "/awards/top3-awards";
    url = addQueryParams(url, queryParams);
    try {
        const response = await fetch(url);
        const awardsForGeek = await response.json();
        return awardsForGeek;
    }catch(e){
        console.error(e);
    }
}

export async function getAwards(queryParams : {start_date?: string, end_date?: string, start?: string, end?: string}){
    let url = process.env.API_URL + "/awards/date";
    url = addQueryParams(url, queryParams);
    try {
        const response = await fetch(url);
        const awards = await response.json();
        return awards.awards;
    }catch(e){
        console.error(e);
    }
}

export async function getTiers (tier_id?:string){
    let url = process.env.API_URL + "/tier";
    if (tier_id) url += "?tier_id=" + tier_id;
    try {
        const response = await fetch(url);
        const tiers = await response.json();
        return tiers;
    }catch(e){
        console.error(e);
    }

}