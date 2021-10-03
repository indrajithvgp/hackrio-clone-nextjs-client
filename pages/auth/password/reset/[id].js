
import {useState, useEffect} from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import {showErrorMessage, showSuccessMessage} from '../../../../helpers/alerts'
// import {API} from '../../../index'
import Router, {withRouter} from 'next/router'
import Layout from '../../../../components/Layout'


const API = "https://hackrio-server.herokuapp.com/api";
const ResetPassword = ({router}) =>{
    const API = "https://hackrio-server.herokuapp.com/api";
    const [state, setState] = useState({
        name: '',
        buttonText:'Reset Password',
        token:'',
        newPassword:'',
        success:'', 
        error:''
    })
    const {name, token,newPassword, buttonText, success, error} = state

    useEffect(() =>{
        const decoded = jwt.decode(router.query.id)
        if(decoded){
            setState({...state, name:decoded.name, token: router.query.id})
        }
    },[router])

    const handleChange = (e) =>{
        setState({
            ...state, newPassword: e.target.value
        })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setState({
            ...state, buttonText:'Sending'
        })
        try{
            const response = await axios.put(`${API}/reset-password`, {resetPasswordLink: token, newPassword})
            setState({
                ...state, buttonText:'Done', newPassword:'', success: response.data.message
            })
        }catch(err){
            setState({
                ...state, error: err.response.data.error, buttonText:' Reset Password'
            })
        }
    }

    const passwordResetForm =()=>{
        return(
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="password" 
                        className="form-control" 
                        onChange={handleChange} 
                        value={newPassword} 
                        placeholder="Type your New Password" 
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
                    <h1>Hi {name}, Ready to Reset Password</h1>
                    <br/>
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {passwordResetForm()}
                </div>
            </div>
        
        </Layout>
        )
}


export default withRouter(ResetPassword)