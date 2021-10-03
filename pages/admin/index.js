import Layout from '../../components/Layout'
import withAdmin from './withAdmin'
import Link from 'next/link'

const Admin = ({user, token}) => <Layout>
<h1>Admin Dashboard</h1>
<br/>
<div className="row">
    <div className="col-md-4">
        <div className="nav flex-column">
            <li className="nav-item">
                <Link href="/admin/category/create">
                    <a className="nav-link">Create Category</a>
                </Link>
            </li>
            <li className="nav-item">
                <a href="/admin/category/read" className="nav-link">
                    All Categories
                </a>
            </li>
            <li className="nav-item">
                <a href="/admin/link/read" className="nav-link">
                    All Links
                </a>
            </li>
            <li className="nav-item">
                <a href="/user/profile/update" className="nav-link">
                    Profile Update
                </a>
            </li>
        </div>
    </div>
    <div className="col-md-8">
    
    </div>
</div>

</Layout>

// Admin.getInitialProps = async()=>{

// }

// export const getServerSideProps = withAdminReq(async (context) => {
//   return {
//     props: {},
//   };
// });
// export default Admin;
export default withAdmin(Admin)