const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path')
const ytdl = require('ytdl-core');
const { promisify } = require('util')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index',{
        'titulo': 'Download de videos'
    })
})

const getInfoVideo = promisify(ytdl.getInfo)
app.post('/download', async (request, response) => {
    try {
        var info = await getInfoVideo(request.body.url.replace('https://www.youtube.com/watch?v=', ''))
        
        ytdl(request.body.url)
            .pipe(fs.createWriteStream(`public/videos/${info.title}.mp4`))
            .on('finish', () => response.status(200).json({ video: `${info.title}.mp4`}))
            
        //    await response.download(`${path.join(__dirname, 'public')}/videos/${info.title}.mp4`, `${info.title}.mp4`)
    } catch (err) {
        response.status(500).json(err)
    }
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log('caminho: '+__dirname)
})