import axios from 'axios';

const baseURL = 'https://math-game-react-backend.herokuapp.com/';

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        if (
            error.response.status === 401 &&
            originalRequest.url === baseURL + 'token/refresh/'
        ) {
            // 401 == unauthorized (key expired or you're not logged in).
            localStorage.clear();
            window.location.href = '/login/';
            return Promise.reject(error);
        }

        if (
            error.response.data.code === 'token_not_valid' &&
            error.response.status === 401 &&
            error.response.statusText === 'Unauthorized'
        ) {
            // You are unauthorized, your token likely expired.
            const refresh_token = localStorage.getItem('refresh_token'); // Grab refresh token.

            if (refresh_token) {
                const tokenParts = JSON.parse(
                    atob(refresh_token.split('.')[1])
                );

                const now = Math.ceil(Date.now() / 1000);

                if (tokenParts.exp > now) {
                    return axiosInstance
                        .post('/token/refresh/', { refresh: refresh_token })
                        .then((response) => {
                            localStorage.setItem(
                                'access_token',
                                response.data.access
                            );
                            localStorage.setItem(
                                'refresh_token',
                                response.data.refresh
                            );

                            axiosInstance.defaults.headers['Authorization'] =
                                'Bearer ' + response.data.access;
                            originalRequest.headers['Authorization'] =
                                'Bearer ' + response.data.access;

                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    localStorage.clear();
                    window.location.href = '/login/';
                }
            } else {
                localStorage.clear();
                window.location.href = '/login/';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
