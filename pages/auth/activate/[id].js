
import {useEffect, useState} from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import {showErrorMessage, showSuccessMessage} from '../../../helpers/alerts'
// import {API} from '../../index'
import {withRouter} from 'next/router'
import Layout from '../../../components/Layout'


const API = "https://hackrio-server.herokuapp.com/api";
const ActivateAccount = ({router}) => {
    const API = "https://hackrio-server.herokuapp.com/api";
    const [state, setState] = useState({
        name: '',
        token:'',
        buttonText:'Activate Account',
        success:'', 
        error:''
    })
    const {name, token, buttonText, success, error} = state

    useEffect(() =>{
        let token = router.query.id
        if(token){
            const {name} = jwt.decode(token)
            // console.log(name)
            setState({...state, name, token})
        }
    },[router])

    const clickSubmit = async e => {
        e.preventDefault()
        setState({...state, buttonText: 'Activating'})
        try{
            const res = await axios.post(`${API}/register/activate`, {token})
            setState({...state, name:'', token:'', buttonText:'Activated', success: res.data.message})
        }catch(err){
            setState({...state, name:'', buttonText:'Activate Account', error: err.data.error})
        }
    }

    return  <Layout>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <h1>G'day {name} Ready to activate your account</h1>
                        <br/>
                        {success && showSuccessMessage(success)}
                        {error && showErrorMessage(error)}
                        <button onClick={clickSubmit} className="btn btn-outline-warning btn-block">{buttonText}</button>
                    </div>
                </div>
            </Layout>
}

export default withRouter(ActivateAccount)