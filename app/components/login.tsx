import { useState } from "react"
import { login, logout, getCookie } from "../actions";
export default function LoginButton() {
    const [loginState, setLoginState] = useState("logged out");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    async function handleLogin(){
        if (loginState == "logged out"){
            setLoginState("logging in");
        }else if (loginState == "logging in"){
            const user = await login(username, password);
            if (user.username){
                setLoginState("logged in");
                setLoginError("");
            }else{
                setLoginError(user.detail);
            }
        }else if (loginState == "logged in"){
            await logout();
            const userId = await getCookie("userId");
            if (!userId) setLoginState("logged out");
        }
    }

    // async function checkCookie(cookieName: string){
    //     const cookie = await getCookie(cookieName);
    //     console.log(cookie);
    // }
    return <div className="rounded-xl flex bg-white overflow-hidden">
        {/* <div onClick={()=> checkCookie("userId")}> check cookie</div> */}
        {
            loginState === "logging in" ? 
            // later make this into a modal that pops up
            <div>
                <label htmlFor="username" >Username</label>
                <input name="username" type="text" onChange={(event)=> setUsername(event.target.value)}/>
                <label htmlFor="password">Password</label>
                <input name="password" type="password" onChange={(event)=> setPassword(event.target.value)}/>
                <button onClick={()=> handleLogin()}>Submit</button>
                <button onClick={() => setLoginState("logged out")}>Cancel</button>
                
            </div>
        :
            <div onClick={() => handleLogin()}>
                {loginState == "logged in" ? "log out" : "login"}
            </div>
        }
        <p className="text-red-500">{loginError}</p>
        </div>

    // this should have three states:
    // logged out (show login, no cookies)
    // logging in (show form, after click, no cookies)
    // logged in  (show user name, has cookies)
}