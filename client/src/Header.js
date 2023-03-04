import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header(){
  const {userInfo,setUserInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4001/profile',{
        credentials: 'include',
    }).then(response =>{
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
    
  },[])

function logout(ev){
  ev.preventDefault();
  fetch('http://localhost:4001/logout',{
    credentials: 'include',
    method: 'POST',
  })
  setUserInfo(null);

}

const username = userInfo?.username;
    return(
        <header>
        <Link to="/" className="logo">MyBlog</Link>
        <nav>
          {username && (
            <>
            <Link to="/create">Create new post</Link>
            <a onClick = {logout}>Logout</a>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          
        </nav>
      </header>
    );

}