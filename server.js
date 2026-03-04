const express = require('express');
const fs = require('fs');
const app = express();
const session = require('express-session');
const axios = require('axios');
const qs = require("qs");
const { XMLParser } = require("fast-xml-parser");
const cheerio = require('cheerio');
const cors = require('cors');
const nodemailer = require('nodemailer')
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    proxy: false,
}));
app.use(express.urlencoded({ extended: true }));

app.get('/memories/:id', (req, res) => {
    const id = req.params.id;
    const filePath = `./public/assets/memories/${id}.json`;

    if (fs.existsSync(filePath)) {
        const memoryData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        res.send({ status: 200, data: memoryData });
    } else {
        res.status(404).send({ status: 404, message: 'Memory not found' });
    }
});

app.listen(5001, () => {
    console.log('http://localhost:5001');
});