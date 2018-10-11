import express from 'express';
import http from 'http';

const app = express()
const port = 3000
const rokuHostname = "192.168.1.42"
const rokuPort = 8060

function createPost(path) {
    return {
        hostname: rokuHostname,
        port: rokuPort,
        path: path,
        method: 'POST'
    }
}

function pokeRoku(res, path, userResponseText) {
    const rokuReq = http.request(createPost(path), (rokuRes) => {
        console.log('RokuStatusCode:', rokuRes.statusCode);
        console.log(userResponseText);

        res.send(userResponseText);
    });

    rokuReq.write('');
    rokuReq.end();
}

app.get('/poweron', (req, res) => pokeRoku(res, '/keypress/PowerOn', 'Hopefully TV turned on.'));
app.get('/poweroff', (req, res) => pokeRoku(res, '/keypress/PowerOff', 'Hopefully TV turned off.'));

app.listen(port, () => console.log(`Listening on port ${port}`));