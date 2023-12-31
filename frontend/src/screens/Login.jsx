import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [credential, setCredential] = useState({ email: '', password: '' })
    let navigate = useNavigate()
    const onChangeData = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: credential.email, password: credential.password
            })
        });
        const json = await response.json()
        console.log(json);
        if (!json.success) {
            toast.error('Enter Valid Credentials!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if (json.success) {
            localStorage.setItem("userEmail", credential.email)
            localStorage.setItem("authToken", json.authToken)
            navigate('/')
        }
    }
    return (

        <div>
            <Navbar />
            <div className="mt-3 container">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={credential.email} onChange={onChangeData} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" name='password' value={credential.password} onChange={onChangeData} />
                    </div>
                    <button type="submit" className="btn btn-success"  >Log In</button>
                    <Link to={'/signup'} className='m-3 btn btn-danger' >Sign Up</Link>
                </form>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    )
}

export default Login