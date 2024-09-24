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
        console.log(url);
        const response = await fetch(url, {method:"POST"});
        console.log(response);
        const userInfo = await response.json();
        console.log("login response", userInfo);
        if (!userInfo.username){
            console.log("login failed");
            return userInfo.detail;
        }
        console.log(userInfo);
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
            // Extract the csrf token from the Set-Cookie header
            const cookieArray = setCookieHeader.split(',');
            cookieArray.forEach(cookie => {
            if (cookie.trim().startsWith('csrftoken=')) {
                const token = cookie.split(';')[0].split('=')[1];
                cookies().set('csrftoken', token); // Store the CSRF token in state
            }
            });
         }
        cookies().set('userId', userInfo.geek_id);
        cookies().set('username', userInfo.username);
        return userInfo;

    }catch(e){
        console.error(e);
    }
}

export async function logout() {
    if (!process.env.API_URL) return;
    const url = process.env.API_URL;
    try{
        // const csrfResponse = await fetch(url + "csrf-token/");
        // const csrf = await csrfResponse.json();
        console.log("csrf", cookies().get('csrftoken')?.value);
        const csrf = cookies().get('csrftoken')?.value ?? '';
        console.log(cookies());
        const response = await fetch(url + "logout/", {method: "POST", headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'ACCEPT': '*/*'} , credentials:"include"});
        console.log(response);
        const logoutResponse = await response.json();
        console.log(logoutResponse);
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
    let url = process.env.API_URL + "/awards/geek";
    url = addQueryParams(url, queryParams);
    try {
        const response = await fetch(url);
        console.log(url, response);
        const awardsForGeek = await response.json();
        console.log(awardsForGeek);
        return awardsForGeek.awards;
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