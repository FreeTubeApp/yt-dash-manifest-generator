# YouTube Dash Manifest Generator NodeJS Documentation
This NodeJS library generates a DASH Manifest file for a YouTube video in order to allow a playback with 1080p+ resolutions. It is developed for and tailored towards easy usage in [FreeTube](https://github.com/FreeTubeApp/FreeTube) but can be used with any other project as well.
It takes the adaptive formats of the response string as input.
If this library should not work at some point, please create an issue and let me know so that I can take a look into it. Pull requests are also welcomed in this case.

## Installation
`npm install @freetube/yt-dash-manifest-generator`
`yarn add @freetube/yt-dash-manifest-generator`

##Usage
`const ytdashgen = require("@freetube/yt-dash-manifest-generator")`

## API
**generateDashFileFromJsonData(jsonStringData, videoLengthInSeconds)**

Takes a JSON file as string and the length of the video in seconds. Usable when the data from ytdl.getInfo() is already available 
```javascript
const xml_string = generateDashFileFromJsonData(jsonString, videoLengthInSeconds)
```

**async generateDashFileFromJsonDataFromId(videoId, videoLength)**

Takes the length of the video in seconds as well as the ID of the video as input and gets the json data itself with yt-dl-core
```javascript
generateDashFileFromJsonDataFromId(videoId, videoLength).then((xmlData) => {
    doSomethingWithXML();
}).catch((error) =>{
    console.error(error)
})
```

**generateDashFileFromFormats(videoFormats, videoLength)**

Takes an array of formats in the way which yt-dl-core provides it as well as the video length in seconds and generates the xml file 
```javascript
const xml_string = generateDashFileFromFormats(videoFormats, videoLength)
```
