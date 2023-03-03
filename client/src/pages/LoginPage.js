import { useState } from "react";

export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function loginConfirm(ev) {
        ev.preventDefault();
        await fetch('http://localhost:4001/login', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'},
            credentials: 'include'
        }).then(response => {
            return response.json();
          }).then(data => {
            console.log(data);
          }).catch(console.error);;
    }
    return(
        <form className="login" onSubmit={loginConfirm}>
            <h1>Login</h1>
            <input type="text" 
                   placeholder="username" 
                   value={username}
                   onChange={ev =>setUsername(ev.target.value)}
                   />
            <input type="password" 
                   placeholder="password" 
                   value={password}
                   onChange={ev =>setPassword(ev.target.value)}
                   />
            <button>Login</button>
        </form>
    );
}