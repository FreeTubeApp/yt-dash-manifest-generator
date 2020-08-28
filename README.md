# YouTube Dash Manifest Generator NodeJS Documentation
This NodeJS library generates a DASH Manifest file for a YouTube video in order to allow a playback with 1080p+ resolutions. It is developed for and tailored towards easy usage in the [FreeTube](https://github.com/FreeTubeApp/FreeTube-Vue) rewrite but can be used with any other project as well.

If this library should not work at some point, please create an issue and let me know so that I can take a look into it. Pull requests are also welcomed in this case.

## Installation
`yt-dash-manifest-generator`

##Usage
`const ytdashgen = require("yt-dash-manifest-generator")`

## API
**generate_dash_file_from_json_data(JsonStringData, VideoLengthInSeconds)**

Takes a JSON file as string and the length of the video in seconds. Usable when the data from ytdl.getInfo() is already available 
```javascript
const xml_string = generate_dash_file_from_json_data(JsonString, VideoLengthInSeconds)
```

**async generate_dash_file_from_json_data_from_id(VideoId, VideoLength)**

Takes the length of the video in seconds as well as the ID of the video as input and gets the json data itself with yt-dl-core
```javascript
generate_dash_file_from_json_data_from_id(VideoId, VideoLength).then((xmlData) => {
    doSomethingWithXML();
}).catch((error) =>{
    console.error(error)
})
```
