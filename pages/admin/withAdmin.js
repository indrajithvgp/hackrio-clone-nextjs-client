import axios from 'axios';
// import { API } from '../index';
import { getCookie } from '../../helpers/auth';
 
// const withAdminReq = (com)=>{
//     return async(context)=>{
//         const { req } = context;
//         const token = getCookie("token", context.req);
//         let user = null;

//         if (token) {
//           try {
//             const response = await axios.get(`${process.env.API}/admin`, {
//               headers: {
//                 authorization: `Bearer ${token}`,
//                 contentType: "application/json",
//               },
//             });
//             user = response.data;
//           } catch (error) {
//             if (error.response.status === 401) {
//               user = null;
//             }
//           }
//         }
//         if (user === null) {
//             // redirect
//             context.res.writeHead(302, {
//                 Location: '/'
//             });
//             context.res.end();

//             return {}
//         }else{
//             user, token;
//         }

//         return com(context)


//     }

    
// }

const withAdmin = Page => {
    const API = "https://hackrio-server.herokuapp.com/api";
    const WithAdminUser = props => <Page {...props} />;
    WithAdminUser.getInitialProps = async context => {
        const token = getCookie('token', context.req);
        let user = null;

        if (token) {
            try {
                const response = await axios.get(
                  `https://hackrio-server.herokuapp.com/api/admin`,
                  {
                    headers: {
                      authorization: `Bearer ${token}`,
                      contentType: "application/json",
                    },
                  }
                );
                user = response.data;
            } catch (error) {
                if (error.response.status === 401) {
                    user = null;
                }
            }
        }

        if (user === null) {
            // redirect
            context.res.writeHead(302, {
                Location: '/'
            });
            context.res.end();

            return {}
        } else {
            return {
                ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                user,
                token
            };
        }
    };

    return WithAdminUser;
};

export default withAdmin;

// export default withAdminReq;
