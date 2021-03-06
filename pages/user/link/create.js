import axios from 'axios'
import {useState, useEffect} from 'react'
import Layout from '../../../components/Layout'
import {showErrorMessage, showSuccessMessage} from '../../../helpers/alerts'
// import {API} from '../../index'
import withUser from '../withUser'
import { getCookie, isAuth} from '../../../helpers/auth'


const API = "https://hackrio-server.herokuapp.com/api";
const Create = ({token})=>{
    const API = "https://hackrio-server.herokuapp.com/api";
    const [state, setState] = useState({
        title: '',
        url: '',
        categories: [],
        loadedCategories: [],
        success: '', 
        error: '', 
        type: '',
        medium: ''
    })

    const {title, url, categories, loadedCategories, success, error, type, medium} = state


    useEffect(() =>{    
        loadCategories()
    }, [success])

    const loadCategories = async() => {
        const response = await axios.get(`${API}/categories`)
        setState({...state, loadedCategories: response.data})
    }

    const handleSubmit = async (e) => {
        console.log(state)
        e.preventDefault()
        try{
            const response = await axios.post(`${API}/link`, {
                title, categories, url, type, medium
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setState({...state, title: '', url:"", success: 'Link is Created', error: '',
        loadedCategories:[], categories:[], type: '', medium:""})

        console.log(response)
        }catch(err){
            setState({...state, error: err.response.data.error, success:''})
        }
    }

    const handleTypeClick = (e)=>{
        setState({...state, type: e.target.value, error: '', success: ''})
    }

    const handleMediumClick = (e)=>{
        setState({...state, medium: e.target.value, error: '', success: ''})
    }

    const showTypes = () => (
        <>
            <div className="form-check pl-5">
                <label className="form-check-label">
                <input type="radio" 
                className="form-check-input"
                name="type"
                onClick={handleTypeClick} value="free" />
                Free</label>
            </div>
            <div className="form-check pl-5">
                <label className="form-check-label">
                <input type="radio" 
                className="form-check-input"
                name="type"
                onClick={handleTypeClick} value="paid" />
                Paid</label>
            </div>
        </>
    )

    const showMedium = () => (
        <>
            <div className="form-check pl-5">
                <label className="form-check-label">
                <input type="radio" 
                className="form-check-input"
                name="medium"
                onClick={handleMediumClick} value="video" />
                Video</label>
            </div>
            <div className="form-check pl-5">
                <label className="form-check-label">
                <input type="radio" 
                className="form-check-input"
                name="medium"
                onClick={handleMediumClick} value="book" />
                Book</label>
            </div>
        </>
    )


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


    const handleTitleChange = async (e) => {
        setState({...state, title: e.target.value, error: '', success: ''})
    }

    const handleURLChange = async (e) => {
        setState({...state, url: e.target.value, error: '', success: ''})
    }

    const submitLinkForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">
                    Title                
                </label>
                <input type="text" className="form-control" value={title} onChange={handleTitleChange}/>
            </div>
            <div className="form-group">
                <label className="text-muted">
                    URL                
                </label>
                <input type="text" className="form-control" value={url} onChange={handleURLChange}/>
            </div>
            <div>
             <button disabled={!token} className="btn btn-outline-warning" type="submit">{
                 isAuth() || token ? 'Post' : 'Login to Post'
             }</button>
            </div>
        </form>
    )

    return(
        <Layout>
            <div className="row">
                <div className="col-md-12"> 
                    <h1>Submit Link/URL</h1>
                    <br/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="text-muted ml-4">
                        Category
                        </label>
                        <ul style={{maxHeight: '100px', overflowY: 'scroll'}}>
                        {loadedCategories && showCategories()}
                        </ul>
                    </div>
                    <div className="form-group">
                        <label className="text-muted ml-4">Type</label>
                        {showTypes()}
                    </div>
                    <div className="form-group">
                        <label className="text-muted ml-4">Type</label>
                        {showMedium()}
                    </div>
                </div>
                <div className="col-md-8">
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                    {submitLinkForm()}
                </div>
            </div>
        </Layout>
    )
}

Create.getInitialProps = (context)=>{
    const token = getCookie('token', context.req)
    return {token}
}

export default withUser(Create)