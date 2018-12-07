const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
      ws.on('message', function (message) {
        message = JSON.parse(message);
        if (message.type === "name") {
            ws.personName = message.data;
            return;
        }

        console.log("recived: " + message);
        wss.clients.forEach(function e(client) {
            if (client !== ws) {
                var d = new Date()
                client.send(JSON.stringify({
                    name: ws.personName,
                    data: message.data,
                    time: appendZero(d.getHours()) + ":" + appendZero(d.getMinutes())

                }));
            }
        })
        // ws.send("From Server"+message);
    });
  ws.on('close', () => console.log('Client disconnected'));
});
function appendZero(val) {
    if (val < 10) {
      val = '0' + val;
    }
    return val;
  }
