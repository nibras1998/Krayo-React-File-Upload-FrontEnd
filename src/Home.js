import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home({ profile, user }) {
    const userData = profile && profile
    const tokenData = user && user
    console.log(userData)

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [empty, setEmpty] = useState(null)

    const loadFiles = async () => {
        console.log(tokenData)
        try {
            const res = await axios.get(`http://localhost:5000/api/files/${userData.id}`, {
                headers: {
                    authorization: `Bearer ${tokenData.access_token}`
                }
            });
            setFiles(res.data.files);
            console.log(res.data)
        } catch (err) {
            console.log(err.response.data.cause);
            setEmpty(err.response.data.cause)
        }
    };

    const onChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(file)
        if (file === null) {
            return alert("No file to upload")
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post(`http://localhost:5000/api/upload/${userData.id}`, formData, {
                headers: {
                    authorization: `Bearer ${tokenData.access_token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(res.data.message);
            console.log(res.data.message)
            setFile(null);
            setEmpty(null)
            alert(message)
            loadFiles();
        } catch (err) {
            setMessage(err.response.data.message);
        }
    };

    const downloadFile = async (filename) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/files/${userData.id}/${filename}`, {
                headers:{
                    authorization: `Bearer ${tokenData.access_token}`
                },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const loadImage=()=>{
        
    }

    return (
        <div>
            <h2>You are successfully logged in {userData && userData.name}</h2>
            <form onSubmit={onSubmit}>
                <input type="file" onChange={onChange} />
                <button type="submit" id="subBtn">Upload</button>
            </form>
            <ul>
                <div className='fileCon'>
                    {empty && <h4>No files to show</h4>}
                    {files && files.map((file) => (<>
                        <div className='imgCon'>
                            {file.type.includes("image") ?
                                <img src={`http://localhost:5000/api/files/display/${userData.id}/${file.name}/${tokenData.access_token}`} alt="My Image" 
                                onClick={() => downloadFile(file.name)}></img> :
                                <li style={{ marginTop: "80px" }} key={file.name} onClick={() => downloadFile(file.name)}>{file.name}</li>
                            }
                        </div>
                    </>
                    ))}
                </div>
            </ul>
        </div>
    );
}

export default Home;