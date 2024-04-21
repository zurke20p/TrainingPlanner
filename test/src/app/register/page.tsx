export default function Home() {
    return (
        <form>
            <div>
                <label>Username</label>
                <input type="text"/>
            </div>
            <div>
                <label>E-mail</label>
                <input type="mail"/>
            </div>
            <div>
                <label>password</label>
                <input type="password"/>
            </div>
            <button type="submit">SUBMIT</button>
        </form>
    );
};
