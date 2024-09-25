import { useState, useEffect } from "react"
import { login, logout } from "../actions";
import { getCookie } from "cookies-next";
export default function LoginModal(params: {setShowLogin: (show: boolean)=>void}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    async function handleLogin(showErrorMsg?: boolean){
        let userId = getCookie("userId")?.toString() ?? "-1";
        setLoggedIn(!(parseInt(userId) < 0));
        if (userId == "-1"){
            if (username.length > 0  && password.length > 0){
                const user = await login(username, password);
                if (user.username){
                    setLoginError("");
                    userId = getCookie("userId")?.toString() ?? "-1";
                    setLoggedIn(!(parseInt(userId) < 0));
                    params.setShowLogin(false);
                }else{
                    setLoginError(user);
                }
            }else{
                if (showErrorMsg) setLoginError("Username and Password are required");
            }   
        }
    }

    async function handleLogout(){
        await logout();
        const userId = getCookie("userId")?.toString() ?? "-1";
        setLoggedIn(!(parseInt(userId) < 0));
        params.setShowLogin(false);
    }

    useEffect(()=>{
        handleLogin(false);
    }, [])

    return <div className="sm:rounded-2xl flex bg-white overflow-hidden h-full sm:h-4/5 sm:my-20 sm:mx-40 flex-col items-center justify-between">
        <div className="flex flex-row justify-end w-full py-2 px-4">
            <button onClick={()=>params.setShowLogin(false)}>X</button>
        </div>
        {
            
            !loggedIn ? <>
            
            <h1 className="text-2xl"> Login </h1>
            <div className="flex flex-col w-1/2 gap-2">
                <label htmlFor="username" >Username</label>
                <input className="bg-[#EAEAEA] px-1" name="username" type="text" onChange={(event)=> setUsername(event.target.value)}/>
                <label htmlFor="password">Password</label>
                <input className="bg-[#EAEAEA] px-1" name="password" type="password" onChange={(event)=> setPassword(event.target.value)}/>
                <p className="text-red-500">{loginError}</p>
            </div>
            
            <button className="bg-silver px-5 py-1 rounded mb-32" onClick={()=> handleLogin(true)}>Submit</button>
            
            </>
        :
            <>
            <h1 className="text-2xl"> Log out </h1>
            <p> Are you sure you want to log out? </p>
            <div className="bg-silver px-5 py-1 rounded" onClick={() => handleLogout()}>
                Log out
            </div>
            <div></div>
            </>
        }
        </div>
        
}