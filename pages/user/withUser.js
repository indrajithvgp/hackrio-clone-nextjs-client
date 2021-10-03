import axios from 'axios';
// import { API } from '../index';
import { getCookie } from '../../helpers/auth';

const API = "https://hackrio-server.herokuapp.com/api";

const withUser = Page => {
    const API = "https://hackrio-server.herokuapp.com/api";
    const WithAuthUser = props => <Page {...props} />;
    WithAuthUser.getInitialProps = async context => {
        const API = "https://hackrio-server.herokuapp.com/api";
        const token = getCookie('token', context.req);
        let user = null;
        let userLinks = [];
        
        if (token) {
            try {
                const response = await axios.get(`${API}/user`, {
                  headers: {
                    authorization: `Bearer ${token}`,
                    contentType: "application/json",
                  },
                });
                console.log('response in withUser', response);
                user = response.data.user;
                userLinks = response.data.links;
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
        } else {
            return {
                ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                user,
                token,
                userLinks
            };
        }
    };

    return WithAuthUser;
};

export default withUser;
