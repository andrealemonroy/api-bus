// import nats from 'node-nats-streaming'

// const stan = nats.connect('route', 'abc',{
//     url:'http://localhost:4222'
// })

// stan.on('connect', () =>{
//     console.log('publisher connected')
// })

// const loopback = require('loopback')

// const app = (module.exports = loopback())
const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const axios = require('axios')
const cors = require('cors')
const app = express()
const PathFinder = require('geojson-path-finder');
const geojson = require('./shared/routes.json');
point = require('turf-point');
const pathFinder = new PathFinder(geojson);
app.use(bodyParser.json())
app.use(cors())
const routes = {}
app.get('/routes', (req, res) => {
    console.log(req)

    res.send(routes.path.path)
});

app.post('/routes', async (req, res) => {
    const id = randomBytes(4).toString('hex')
    const { start } = req.body
    const { finish } = req.body
    const path = pathFinder.findPath(point(start), point(finish));
    routes[id] = {
        id, path
    }
    console.log(routes[id])

    res.status(201).send(routes[id])
});

app.post('/events', (req, res) => {
    console.log('Received event', req.body.type)
    res.send({})
})

app.listen(4000, () => {
    console.log('listening')
})