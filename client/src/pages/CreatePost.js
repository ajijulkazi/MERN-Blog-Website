import { useState } from "react";
//import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router-dom";
import Editor from "../Editor";



export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('')
    async function createNewPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        ev.preventDefault();
        const response = await fetch('http://localhost:4001/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if(response.ok){
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }
    return (
        <form onSubmit={createNewPost}>
            <input type="title" 
                   placeholder={"Post Title"} 
                   value={title}
                   onChange={ev =>setTitle(ev.target.value)}
                   />
            <input type="summary" 
                   placeholder={"Summary"} 
                   value={summary}
                   onChange={ev =>setSummary(ev.target.value)}
                   />
            <input type="file" 
                   
                   onChange={ev =>setFiles(ev.target.files)}
                   />
            <Editor value={content} onChange={setContent}  />
            <button style={{marginTop:'5px'}}>Create Post</button>
        </form>
    );
}