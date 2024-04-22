import Logout from "./logout";

export default function Home() {
  return (
    <main>
      <a href="/">HOME PAGE</a> <br/>
      <a href="/login">LOGIN</a> <br/>
      <a href="/register">REGISTER</a> <br/>
      <Logout></Logout>
      <br/>
      <a href="/friends">FRIENDS</a> <br/>
      <a href="/excersises">EXCERSISES</a>
    </main>
  );
}
