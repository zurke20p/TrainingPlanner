"use client";

import ServerRequestService  from "../app/server-request";

export default function Logout() {
    async function sendLogout(){
        const response = await ServerRequestService().logout();
        console.log(response);
    }
    return <button onClick={sendLogout}>Logout</button>
}