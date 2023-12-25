const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    const token = req.get('Authorization');

    if (token) {
        return res.json({
            token: token,
            logout: 'http://localhost:3000/logout',
        });
    }

    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/logout', (req, res) => {
    res.redirect('/');
});

app.post('/api/login', async (req, res) => {
    const {login, password} = req.body;

    const getUserTokenData = {
        method: 'post',
        url: `https://dev-tvfcmdxn6j7sl5k0.us.auth0.com/oauth/token`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
            grant_type: 'password',
            username: login,
            password: password,
            audience: 'https://dev-tvfcmdxn6j7sl5k0.us.auth0.com/api/v2/',
            scope: 'offline_access',
            client_id: 'KTLXy6HNZuVdotdT4CA6TBvICQa6TTcT',
            client_secret: '69eUyZmTDZSPiJbjZltKOC_a2psTXjMAWhNYNWwsQyHy-zuvvEDrKqCOnU-ImNVA',
        },
    };

    await axios
        .request(getUserTokenData)
        .then((response) => {
            console.log('login', response.data);

            res.status(200).json({token: response.data.access_token});
        })
        .catch((error) => {
            console.error(`Error loging in: ${error}`);
        });

    res.status(401).send();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});