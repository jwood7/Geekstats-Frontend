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
    let url = process.env.API_URL + "/geeks/summary-by-geek";

    if (startDate){
        url = url + "?start_date=" + startDate;
    }
    if (endDate){
        url = url + "&end_date=" + endDate;
    }
    console.log(url);
    try{
        const response = await fetch(url);
        console.log(response);
        const summaries = await response.json();
        if (summaries.error) throw summaries.error;
        return summaries;
    }catch(e){
        console.error(e);
        return [];
    }
}

export async function getDateInfo(startDate?: string, endDate?:string){
    if (!process.env.API_URL) return;
    let url = process.env.API_URL + "/admin/date-round";
    if (startDate){
        url = url + "?" + startDate;
    }
    if (endDate){
        url = url + "&" + endDate;
    }
    try{
        const response = await fetch(url);
        const dateInfo = await response.json();
        if (dateInfo.error) throw dateInfo.error;
        return dateInfo;
    }catch(e){
        console.error(e);
        return {
            "start_event_date": "",
            "end_event_date": "",
            "start_round": 0,
            "end_round": 0,
            "match_ids": [],
            "season_info": {
                "season_name": "No season data",
                "season_start_event": "",
                "season_end_event": ""
            }
        }
    }
}

export async function login(user:string, password: string) {
    if (!process.env.API_URL) return;
    const url = process.env.API_URL + "/admin/login/?username=" + user + "&password=" + password;
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
        // Not a super secure way to handle this
        cookies().set('isAdmin', userInfo.is_superuser);
        cookies().set('isStaff', userInfo.is_staff);
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
        const response = await fetch(url + "/admin/logout/", {method: "POST", headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Cookie': 'csrftoken='+ csrf+'; sessionid='+session } , credentials:"include"});
        const logoutResponse = await response.json();
        if (logoutResponse.message != "Logged out successfully"){
           throw logoutResponse;
        }
        cookies().delete('userId');
        cookies().delete('username');
        cookies().delete('isAdmin');
        cookies().delete('isStaff');
        return "Logged out";

    }catch(e){
        console.error(e);
        // Always delete cookies on client side to get stuck logged out after cookie expires
        cookies().delete('userId');
        cookies().delete('username');
        cookies().delete('isAdmin');
        cookies().delete('isStaff');
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
    let url = process.env.API_URL + "/geeks/tier";
    if (tier_id) url += "?tier_id=" + tier_id;
    try {
        const response = await fetch(url);
        const tiers = await response.json();
        return tiers;
    }catch(e){
        console.error(e);
    }

}

export async function getTeams (event_date?:string){
    let url = process.env.API_URL + "/teams/team-geek";
    if (event_date) url += "?event_date=" + event_date;
    try {
        const response = await fetch(url);
        const teams = await response.json();
        // console.log(teams);
        return teams;
    }catch(e){
        console.error(e);
        return [];
    }

}

export async function getMatches (event_date?:string){
    let url = process.env.API_URL + "/matches/matches";
    if (event_date) url += "?event_date=" + event_date;
    try {
        const response = await fetch(url);
        const matches = await response.json();
        // console.log(matches);
        // console.log(matches.matches);
        return matches.matches;
    }catch(e){
        console.error(e);
        return [];
    }

}

export async function getDiscordAttendees(){
    const url = process.env.API_URL + "/teams/discord-geek";
    try {
        const response = await fetch(url);
        const geeks = await response.json();
        // console.log(geeks);
        // console.log(geeks.discord_geeks);
        return geeks.discord_geeks;
    }catch(e){
        console.error(e);
        return [];
    }

}

export async function sendPick(picked_geek_id: number, team_id: number, action: string){
    const url = process.env.API_URL + `/teams/pick/?picked_geek_id=${picked_geek_id}&team_id=${team_id}&action=${action}`;
    try {
        console.log(picked_geek_id, team_id, action);
        const csrf = cookies().get('csrftoken')?.value ?? '';
        const session = cookies().get('sessionid')?.value ?? '';
        const response = await fetch(url, {method: "POST", headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Cookie': 'csrftoken='+ csrf+'; sessionid='+session } , credentials:"include"});
        const res = await response.json();
        console.log(res);
        console.log(res.message);
        if (res.error) throw(res.error);
        return true;
    }catch(e){
        console.error(e);
        return false;
    }

}

export async function getPickFlag(){
    const url = process.env.API_URL + `/teams/get-pick-flag/`;
    try {
        const csrf = cookies().get('csrftoken')?.value ?? '';
        const session = cookies().get('sessionid')?.value ?? '';
        const response = await fetch(url, {method: "GET", headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Cookie': 'csrftoken='+ csrf+'; sessionid='+session } , credentials:"include"});
        const res = await response.json();
        if (res.error) throw(res.error);
        return res;
    }catch(e){
        console.error(e);
    }

}

export async function checkPickFlag(){
    const url = process.env.API_URL + `/teams/check-pick-flag/`;
    try {
        const csrf = cookies().get('csrftoken')?.value ?? '';
        const session = cookies().get('sessionid')?.value ?? '';
        const response = await fetch(url, {method: "GET", headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Cookie': 'csrftoken='+ csrf+'; sessionid='+session } , credentials:"include"});
        const res = await response.json();
        if (res.error) throw(res.error);
        return res;
    }catch(e){
        console.error(e);
    }

}

export async function endPickTurn(){
    const url = process.env.API_URL + `/teams/next-pick/`;
    try {
        const csrf = cookies().get('csrftoken')?.value ?? '';
        const session = cookies().get('sessionid')?.value ?? '';
        const response = await fetch(url, {method: "POST", headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Cookie': 'csrftoken='+ csrf+'; sessionid='+session } , credentials:"include"});
        const res = await response.json();
        if (res.error) throw(res.error);
        return res;
    }catch(e){
        console.error(e);
    }

}