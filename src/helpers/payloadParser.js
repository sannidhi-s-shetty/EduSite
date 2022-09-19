import moment from 'moment';

function payloadParser() {
    // Grab the newly stored token
    const accessToken = localStorage.getItem('access_token');

    // Decode it by splitting.
    let tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));

    // Get the last login date and time from the current user.
    tokenPayload.last_login = moment(tokenPayload.last_login).format(
        'dddd, MMMM Do YYYY, h:mm:ss a'
    );

    return tokenPayload;
}

export default payloadParser;
