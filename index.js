import express from 'express';
import http from 'http';
import localtunnel from 'localtunnel';

const app = express();
const port = 3000;
const rokuHostname = "192.168.1.42";
const rokuPort = 8060;
const localtunnelOpts = {
    subdomain: 'berrykerryisthebest'
}

function createPost(path) {
    return {
        hostname: rokuHostname,
        port: rokuPort,
        path: path,
        method: 'POST'
    }
}

function pokeRoku(res, path, userResponseText) {
    let retryCount = 0;
    const rokuReq = http.request(createPost(path), (rokuRes) => {
        console.log('RokuStatusCode:', rokuRes.statusCode);
        console.log(userResponseText);

        res.send(userResponseText);
    });

    rokuReq.setTimeout(5000);
    rokuReq.write('');
    rokuReq.on('error', () => {
        retryCount++;
        if(retryCount < 5) {
            rokuReq.write('');
        }
    });
    rokuReq.end();
}

app.get('/poweron', (req, res) => pokeRoku(res, '/keypress/PowerOn', 'Hopefully TV turned on.'));
app.get('/poweroff', (req, res) => pokeRoku(res, '/keypress/PowerOff', 'Hopefully TV turned off.'));

const tunnel = localtunnel(port, localtunnelOpts, (err, tunnel) => {
    if(err) {
        console.log(err);
    }
    console.log("localtunnel URL:", tunnel.url);

    app.listen(port, () => console.log(`Listening on port ${port}`));
});
