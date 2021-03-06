
import { useState} from 'react'
import axios from 'axios'
import {showErrorMessage, showSuccessMessage} from '../../../helpers/alerts'
// import {API} from '../../index'
import Layout from '../../../components/Layout'

const API = "https://hackrio-server.herokuapp.com/api";
const ForgotPassword = () =>{
    const API = "https://hackrio-server.herokuapp.com/api";
    const [state, setState] = useState({
        email: '',
        buttonText:'Forgot Password',
        success:'', 
        error:''
    })
    const {email, buttonText, success, error} = state

    const handleChange = (e) =>{
        setState({
            ...state, email: e.target.value
        })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()

        try{
            const response = await axios.put(`${API}/forgot-password`, {email})
            setState({
                ...state, email: '', buttonText:'Done', success: response.data.message
            })
        }catch(err){
            setState({
                ...state, error: err.response.data.error, buttonText:'Forgot Password'
            })
        }
    }

    const passwordForgotForm =()=>{
        return(
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" 
                        className="form-control" 
                        onChange={handleChange} 
                        value={email} 
                        placeholder="Type your Email" 
                        required/>
                </div>
                <div>
                    <button className="btn btn-outline-warning">{buttonText}</button>
                </div>
            </form>
        )
    }

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Forgot Password</h1>
                    <br/>
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {passwordForgotForm()}
                </div>
            </div>
        
        </Layout>
        )
}


export default ForgotPassword