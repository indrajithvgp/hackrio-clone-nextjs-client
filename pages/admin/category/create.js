import {useState, useEffect} from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})
// import ReactQuill from 'react-quill'
import Resizer from "react-image-file-resizer";
// import {API} from '../../index'
import Layout from '../../../components/Layout'
import withAdmin from '../withAdmin'
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts'
import "react-quill/dist/quill.bubble.css"

const API = process.env.API;

const Create = ({token, user})=>{

    // const {token, user} = props
    const [state, setState] = useState({
        name: '',
        error:'', 
        success:'', 
        buttonText:'Create',
        image: '',
    })
    const [content, setContent] = useState('')
    const [imageUploadButtonName, setImageUploadButtonName] = useState('Upload image')

    const {name, error, success, buttonText, image} = state

    const handleChange = (name) => (e)=>{
        setState({...state, [name]: e.target.value, error:'', success:''})
    }

    const handleContent = e => {
        setContent(e)
        setState({...state, success: "", error: ""})
    }

    const handleImage = e => {
        let fileInput = false
        if(e.target.files[0]){
            fileInput = true
        }
        setImageUploadButtonName(e.target.files[0].name)
        if(fileInput){
            Resizer.imageFileResizer(
                e.target.files[0],
                300, 
                300, 
                'JPEG',
                100, 
                0, 
                uri => {
                    setState({...state, image: uri, success:'', error: ''});
                },
                'base64'
            )
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setState({...state, buttonText: 'Creating'})

        try{
            const response = await axios.post(`${API}/category`, {
                name, image: image, content
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
            setImageUploadButtonName('Upload Image')
            setContent('')
            setState({...state, name: '', formData: '', buttonText: 'Created', success: `${response.data.name} is created`})
        }catch(err){

            setState({...state, name: '', content:'',buttonText: 'Create', error:err.response.data.error})
        }
        // console.log(...formData)
    }

    const createCategoryForm = ()=>{
        return(
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type="text" className="form-control" value={name} required onChange={handleChange('name')} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Content</label>
                    
                    <ReactQuill value={content}
                    onChange={handleContent}
                    placeholder="Write Something..."
                    className="pb-5 mb-3"
                    theme="bubble"
                    style={{border: '1px solid #666'}}
                    />
                
                    </div>
                <div className="form-group">
                    <label className="btn btn-outlined-secondary">
                    {imageUploadButtonName}
                    <input type="file" 
                    accept="image/*"
                    className="form-control" 
                    hidden 
                    onChange={handleImage} />
                    </label>
                </div>
                <div>
                    <button className="button btn btn-outline-warning">
                    {buttonText}
                    </button>
                    
                </div>
            
            </form>
        )
    }
    return(

        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Create Category</h1>
                    <br/>
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {createCategoryForm()}
                </div>
            </div>
        </Layout>
    )
}



export default withAdmin(Create)