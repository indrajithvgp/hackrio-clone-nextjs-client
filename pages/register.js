import {useState, useEffect} from 'react'
import Router from 'next/router'
import axios from 'axios'
import Layout from '../components/Layout'
// import {API} from './index'

import { showErrorMessage, showSuccessMessage } from '../helpers/alerts'
import {isAuth} from '../helpers/auth'


const API = "http://hackrio-server.herokuapp.com/api";
const Register = () => {
    const API = "http://hackrio-server.herokuapp.com/api";

    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error:'', 
        buttonText:'Register',
        success:'',
        loadedCategories: [],
        categories:[]
    })

    const {name, email, password, error, loadedCategories, categories, buttonText, success} = state
    useEffect(() =>{    
        loadCategories()
    }, [success])

    useEffect(() =>{
        isAuth() && Router.push('/')

    },[])

    const loadCategories = async() => {
        const response = await axios.get(`${API}/categories`)
        setState({...state, loadedCategories: response.data})
    }

    const handleToggle = (id) => (e) => {
        const clickedCategory = categories.indexOf(id) 

        const all = [...categories]

        if(clickedCategory === -1){
            all.push(id)
        }else{
            all.splice(clickedCategory, 1)
        }
        setState({...state, categories: all, success: '', error:''})
    }

    const showCategories = () => (
        loadedCategories.map((c, i) => (
                <li className="list-unstyled" key={c._id}>
                    <input type="checkbox" className="mr-2" onChange={handleToggle(c._id)}/>
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
    )

    
    

    const handleChage = (name) => (e)=>{
        setState({...state, [name]: e.target.value, error:'', success:'', buttonText:'Register'})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(state)

        try{
            const res = await axios.post(`${API}/register`, {
                name, email, password, categories
            })
            setState({
                ...state, 
                name:'', 
                email:'', 
                password:'', 
                error:'', 
                success:'', 
                buttonText:'Registering', 
                success: res.data.message
            })

        }catch(err){
            setState({
                ...state, 
                buttonText:'Register', 
                error: err.response.data.error
            })
        }

    }

    const registerForm = ()=>(
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input type="text" value={name} required onChange={handleChage('name')} className="form-control" placeholder="Type your name"/>
            </div>
            <div className="form-group">
                <input type="email" value={email} required onChange={handleChage('email')} className="form-control" placeholder="Type your email"/>
            </div>
            <div className="form-group">
                <input type="password" value={password} required onChange={handleChage('password')} className="form-control" placeholder="Type your password"/>
            </div>

            <div className="form-group">
                <label className="text-muted ml-4">
                    Category
                </label>
                <ul style={{maxHeight: '100px', overflowY: 'scroll'}}>
                    {loadedCategories && showCategories()}
                </ul>
            </div>

            <div className="form-group">
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    )
  return(
    <Layout>
        <div className="col-md-6 offset-md-3">
            <h1>Register</h1>
            <br/>
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {registerForm()}
            <hr/>
        </div>
    </Layout>
  )
}

export default Register