# YouTube Dash Manifest Generator NodeJS Documentation
This NodeJS library generates a DASH Manifest file for a YouTube video in order to allow a playback with 1080p+ resolutions. It is developed for and tailored towards easy usage in the [FreeTube](https://github.com/FreeTubeApp/FreeTube-Vue) rewrite but can be used with any other project as well.

If this library should not work at some point, please create an issue and let me know so that I can take a look into it. Pull requests are also welcomed in this case.

## Installation
`yt-dash-manifest-generator`

##Usage
`const ytdashgen = require("yt-dash-manifest-generator")`

## API
**scrape_subscriber_count_from_channel('channelURL')**

Takes a complete channel URL and returns the subscriber count as number.
```javascript
ytsubcounter.scrape_subscriber_count_from_channel("https://www.youtube.com/user/YouTube").then((data) =>{
    console.log(data);
}).catch((error)=>{
    console.log(error);
});
```
