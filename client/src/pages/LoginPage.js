import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    async function loginConfirm(ev) {
        ev.preventDefault();
       const responses = await fetch('http://localhost:4001/login', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'},
            credentials: 'include',
        }).then(response => {
            return response.json(); 
          }).then(data => {
            if(data){
                setRedirect(true);
            }else {
                alert('wrong credentials');
            }
             console.log(data);
            console.log(username,password);
          }).catch(console.error);

    }
    

    if(redirect){
        return <Navigate to={'/'}/>
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