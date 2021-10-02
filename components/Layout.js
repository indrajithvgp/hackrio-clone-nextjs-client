import Head from 'next/head'
import Link from 'next/link'
import {isAuth, logOut} from '../helpers/auth'
import Router from 'next/router'
import './layout.module.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.done()


const Layout = ({children}) => {

    const head = () => (
        <>
            <link rel="stylesheet" href='/static/styles.css'></link>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"></link>
        </>
        )

    const nav = () => (
        <ul className="nav nav-tabs bg-warning">
 
            <li className="nav-item">
                <Link href="/">
                    <a className="nav-link text-dark bt" >Home</a>
                </Link>
            </li>
            

            {!isAuth() && (
                <>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link text-dark bt" >Login</a>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link href="/register">
                            <a className="nav-link text-dark bt" >Register</a>
                        </Link>
                    </li>
                </>
            )}
            
            {isAuth() && isAuth().role === "admin" && (
                <>
                <li className="nav-item">
                <Link href="/user/link/create">
                    <a className="nav-link text-dark btn btn-success bt" style={{borderRadius: '0px'}} >Submit</a>
                </Link>
            </li>
                <li className="nav-item ml-auto">
                    <Link href="/admin">
                        <a className="nav-link btn text-dark bt" >{isAuth().name}</a>
                    </Link>
                </li>
                </>
            )}

            

            {isAuth() && isAuth().role === "subscriber" && (
                <>
                <li className="nav-item">
                <Link href="/user/link/create">
                    <a className="nav-link text-dark btn btn-success bt" style={{borderRadius: '0px'}} >Submit</a>
                </Link>
            </li>
                <li className="nav-item ml-auto">
                    <Link href="/user">
                        <a className="nav-link text-dark bt" >{isAuth().name}</a>
                    </Link>
                </li>
                </>
            )}
            {isAuth() && (
                <li className="nav-item">
                    <a onClick={logOut} className="nav-link text-dark btn btn-outline-warning bt" >Log Out</a>
                </li>
            )}
            
        </ul>
    )

    return (
        <>
            {head()}
            {nav()}
            <div className="container pt-5 pb-5">
                {children}
            </div>
            
        </>
        )
}

export default Layout

// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />