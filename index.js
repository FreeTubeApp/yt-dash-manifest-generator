const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core')
const id = 'Ycz6TXrP-W8';

const filepath = path.resolve(__dirname, 'info.json');



ytdl.getInfo(id).then(info => {
    console.log('title:', info.videoDetails.title);
    console.log('rating:', info.player_response.videoDetails.averageRating);
    console.log('uploaded by:', info.videoDetails.author.name);
    const json = JSON.stringify(info, null, 2)
        // eslint-disable-next-line max-len
        .replace(/(ip(?:=|%3D|\/))((?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|[0-9a-f]{1,4}(?:(?::|%3A)[0-9a-f]{1,4}){7})/ig, '$10.0.0.0');
    console.log(json)
    const b = JSON.parse(json)
    const a = b.formats[0].mimeType
    const f = a.match(/"[^\\]*/)
    console.log("FFF:", f[0])
    console.log("MIME", b.formats[0].mimeType["codecs"])
    fs.writeFile(filepath, JSON.stringify(b.formats), err2 => {
        if (err2) throw err2;
    });
    console.log(b.formats.length)
});
