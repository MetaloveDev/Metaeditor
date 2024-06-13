const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mime = require('./utilities/mime');

const { staticFile, readDirPromise, readFilePromise } = require('./utilities/filesHandle');
const Infobase = require('./utilities/project-infobase');

const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let infobases = new Map();

const urlencodedParser = express.urlencoded({ extended: false });

const app = express();

app.use(express.json());
app.use(cors());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (_, res) => {
    staticFile(res, '/html/main.html', '.html');
});

app.get('/editor', (_, res) => {
    staticFile(res, '/html/editor.html', '.html');
});

app.get('/login', (_, res) => {
    staticFile(res, '/html/login.html', '.html');
});

app.get('/failed-login', (_, res) => {
    staticFile(res, '/html/failed-login.html', '.html');
});

app.post('/login-data', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const { username, password } = req.body;

    try {
        await mongoClient.connect();
        const db = mongoClient.db("metaeditor");
        const collection = db.collection("Users");
        const users = await collection.find().toArray();

        let loginSuccess = false;
        let id;
        for (let i = 0; i < users.length; i++) {
            // console.log(users[i]);
            if (users[i].login === username && users[i].password === password) {
                loginSuccess = true;
                id = users[i]._id;
                break;
            }
        }

        await collection.updateOne({ _id: id }, { $set: { entered: true } });

        res.end(JSON.stringify({
            success: loginSuccess,
            href: loginSuccess ? '/' : '/failed-login',
            uid: id === undefined ? "0" : id.toString()
        }));
    } catch (err) {
        console.log(err);
    } finally {
        await mongoClient.close();
    }
});

app.get('/load-data', async (_, res) => {
    const pathToSaves = './saves';
    const info = [];
    readDirPromise(pathToSaves)
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                const name = path.parse(data[i]).name;
                info.push(name);
            }
            res.end(JSON.stringify(info));
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/load-project/:saveName', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const saveName = req.params["saveName"]

    let infobase = infobases.has(saveName) ? infobases.get(saveName) : new Infobase()
    infobase.addUser(req.body.id);
    infobases.set(saveName, infobase);

    readFilePromise('./saves/' + saveName + '.json')
        .then(data => {
            res.end(JSON.stringify(data));
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/create-project/:projectName', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const projectName = req.params["projectName"]

    const text = '{"blocks":[],"arrows":[],"checkList":[{"state":"ERROR","message":""}],"bookmarks":[]}';
    fs.writeFileSync('./saves/' + projectName + '.json', text, { encoding: 'utf8', flag: 'w' })
    res.end();
});

app.post('/editor-exit/:saveName/:uid', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const saveName = req.params["saveName"];
    const uid = req.params["uid"];

    let infobase = infobases.get(saveName);

    if (infobase !== undefined && infobase !== null && uid !== undefined && uid !== null) {
        infobase.removeUser(uid);
        infobases.set(saveName, infobase);

        if (infobase.isEmpty()) {
            infobases.delete(saveName);
        }
    }


    res.end();

    // try {
    //     await mongoClient.connect();
    //     const db = mongoClient.db("metaeditor");
    //     const collection = db.collection("Users");

    //     await collection.updateOne({ _id: new ObjectId(req.body) }, { $set: { entered: false } });
    // } catch (err) {
    //     console.log(err);
    // } finally {
    //     await mongoClient.close();

    //     res.end();
    // }
});

app.post('/logout', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    try {
        await mongoClient.connect();
        const db = mongoClient.db("metaeditor");
        const collection = db.collection("Users");

        await collection.updateOne({ _id: new ObjectId(req.body.id) }, { $set: { entered: false } });
    } catch (err) {
        console.log(err);
    } finally {
        await mongoClient.close();
        res.end();
    }
});

app.post('/save-project/:saveName', urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    fs.writeFileSync('./saves/' + req.params["saveName"] + '.json', JSON.stringify(req.body), { encoding: 'utf8', flag: 'w' });

    res.end();
});

app.post('/cursor-positions-update/:saveName', urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const { uid, x, y } = req.body;

    let infobase = infobases.get(req.params["saveName"]);

    if (infobase === undefined) {
        res.end(JSON.stringify({
            id: uid,
            position: {
                x: 0,
                y: 0,
            }
        }));
    } else {
        infobase.setUserPosition(uid, x, y);
        infobases.set(uid, infobase);

        res.end(JSON.stringify(infobase.getUserPositions()));
    }

});

app.get('/favicon.ico', (_, res) => {
    staticFile(res, '/images/favicon.ico', '.ico');
})

app.all('*', (req, res) => {
    const extname = String(path.extname(req.url)).toLowerCase();
    if (extname in mime) {
        staticFile(res, req.url, extname);
    } else {
        staticFile(res, '/html/not-found.html', '.html');
    }
});

io.on('connection', (socket) => {
    socket.on('joinRoom', (roomName) => {
        socket.leaveAll();
        socket.join(roomName);
    });

    socket.on('message', (message) => {
        const room = socket.rooms.values().next().value;
        io.to(room).emit('changesMessage', message);
    }
    );

    socket.on('disconnect', () => {
        socket.leaveAll();
    });
});

http.listen(process.env.PORT, '0.0.0.0', () => console.log('Server is active'));