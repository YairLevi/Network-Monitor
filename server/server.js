const express = require('express')
const cors = require('cors')

app = express()

app.use(express.json())
app.use(cors({ origin: "*" }))

const data = {}
const update = {}

setInterval(() => {
    for (const key of Object.keys(update)) {
        if (Date.now() - update[key] > 10000) {
            delete update[key]
            delete data[key]
        }
    }
}, 10000)

app.post('/ping', (req, res) => {
    let megaBytesPerSecond = 0
    if (req.body.data) {
        megaBytesPerSecond = parseFloat(req.body.data)
    }
    const sourceName = req.body.name
    if (!data[sourceName]) {
        data[sourceName] = []
    }
    data[sourceName].push(megaBytesPerSecond)
    if (data[sourceName].length > 40) {
        data[sourceName].shift()
    }
    update[sourceName] = Date.now()
    res.end()
})

app.get('/data', (req, res) => {
    res.json(data)
    res.end()
})

app.get('/test', (req, res) => {
    res.sendStatus(200)
})

app.get('/disconnect', (req, res) => {
    const name = req.query.name
    if (!name) {
        res.sendStatus(400)
        return
    }
    delete data[name]
    delete update[name]
    res.end()
})

app.listen(8000, '10.0.0.33', () => console.log('server started'))
