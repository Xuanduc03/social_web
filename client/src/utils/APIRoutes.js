const backendDomain = process.env.REACT_APP_BACKEND_DOMAIN || `${process.env.REACT_APP_SOCKET_URL}`;

const SummaryApi = {
    //auth api
    Register : {
        url : `${backendDomain}/api/register`,
        method: "post"
    },
    Login : {
        url : `${backendDomain}/api/login`,
        method : "post"
    },
    Logout: {
        url : `${backendDomain}/api/logout`,
        method : "get"
    },
    AllUsers : {
        url : `${backendDomain}/api/allusers`,
        method:  "get"
    },
    SetAvatar : {
        url : `${backendDomain}/api/setavatar/:id`,
        method: 'post'
    }
}

export default SummaryApi;