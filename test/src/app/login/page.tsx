"use client";

import { User } from "@/interfaces/user";
import ServerRequestService  from "../server-request";
export default function Home(){

    async function submitForm(event : React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const user: User = {
            username: formData.get("username") as string,
            mail: "",
            password: formData.get("password") as string
        }
        const response = await ServerRequestService().login(user);
        console.log(response);
    };

    return <form onSubmit={submitForm}>
        <a href="/">HOME PAGE</a> <br/>
        <div>
            <label>Username</label>
            <input type="text" name="username"/>
        </div>
        <div>
            <label>password</label>
            <input type="password" name="password"/>
        </div>
        <button type="submit">SUBMIT</button>
    </form>
}