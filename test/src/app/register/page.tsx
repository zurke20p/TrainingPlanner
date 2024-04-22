"use client";

import ServerRequestService  from "../server-request";
import { User } from "@/interfaces/user";

export default function Home() {
    async function submitForm(event : React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);

        const user: User = {
            username: formData.get("username") as string,
            mail: formData.get("mail") as string,
            password: formData.get("password") as string
        }
        
        const response = await ServerRequestService().register(user);
        console.log(response);
      }
    return (
        <form onSubmit={submitForm}>
            <div>
                <label>Username</label>
                <input type="text" name="username"/>
            </div>
            <div>
                <label>E-mail</label>
                <input type="mail" name="mail"/>
            </div>
            <div>
                <label>password</label>
                <input type="password" name="password"/>
            </div>
            <button type="submit">SUBMIT</button>
        </form>
    );
};
