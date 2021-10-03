import {useState, useEffect} from 'react'
import axios from 'axios'
import Link from 'next/link'
import Router from 'next/router'
import Layout from '../components/Layout'
import { showErrorMessage, showSuccessMessage } from "../helpers/alerts";

import {authenticate, isAuth} from '../helpers/auth'

const API = "http://hackrio-server.herokuapp.com/api";

const Login = () => {
    const API = "http://hackrio-server.herokuapp.com/api";

    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error:'',
        buttonText:'Login',
        success:''
    })

    useEffect(() =>{
        isAuth() && Router.push('/')
    },[])
    
    const {name, email, password, error, buttonText, success} = state

    const handleChage = (name) => (e)=>{
        setState({...state, [name]: e.target.value, error:'', success:'', buttonText:'Login'})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setState({...state, buttonText:'Logging in'})
        try{
            const res = await axios.post(`${API}/login`, {
                email, password
            })

            authenticate(res, ()=>{
                
                return isAuth() && isAuth() === 'admin' ? Router.push('/admin') : Router.push('/user')
            })
            
        }catch(err){
            console.log(err.response.data)
            setState({
              ...state,
              buttonText: "Login",
              error: err.response.data.error,
            });
        }

    }

    const loginForm = ()=>(
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input type="email" value={email} required onChange={handleChage('email')} className="form-control" placeholder="Type your Email"/>
            </div>
            <div className="form-group">
                <input type="password" value={password} required onChange={handleChage('password')} className="form-control" placeholder="Type your Password"/>
            </div>
            <div className="form-group">
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    )
  return(
    <Layout>
        <div className="col-md-6 offset-md-3">
            <h1>Log In</h1>
            <br/>
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {loginForm()}
            <Link href="/auth/password/forgot">
                <a className="text-danger float-right">Forgot Password</a>
            </Link>
            <hr/>
        </div>
    </Layout>
  )
}

export default Login