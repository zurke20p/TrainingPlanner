"use client";

import ServerRequestService  from "../server-request";
import React, {useState} from "react";

export default function AddFriends() {
    const [potentialFriendList, setPotenialFriendList] = useState([]);
    async function submitForm(event : React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const res = await ServerRequestService().searchFriends(formData.get("nickname") as string);
        console.log(res);

        if(res.status == "err")
            setPotenialFriendList([])
        else
            setPotenialFriendList(res.msg)
    }

    async function sendFriendRequest(nickName : string): Promise<void> {
        const response = await ServerRequestService().sendFriendRequest(nickName as string);
        console.log(response);

        const formData = new FormData(document.querySelector("#findfriends") as HTMLFormElement);

        const res = await ServerRequestService().searchFriends(formData.get("nickname") as string);
        console.log(res);

        if(res.status == "err")
            setPotenialFriendList([])
        else
            setPotenialFriendList(res.msg)
    }

    return (<div>
        <form onSubmit={submitForm} id="findfriends">
            <h3>Find new friends</h3>
            <div>
                <label>Search by nickname</label>
                <input type="text" name="nickname"/>
            </div>
            <button type="submit">SEARCH</button>
        </form>
        {
        potentialFriendList.length != 0 
        ? 
            <ul>
                {
                    potentialFriendList.map((nickname: string) => 
                            <li>
                                {nickname}
                                <button onClick={() => sendFriendRequest(nickname as string)}>Add Friend</button>
                            </li>
                    )
                }
            </ul>
        :
            <p>No matches found</p>
        }
    </div>)
    
}