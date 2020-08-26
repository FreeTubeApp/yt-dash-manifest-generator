const ytdl = require('ytdl-core');
const xml = require('xml-js')
class DashGenerator {
    // if you already have the getInfo data from ytdl-core use this function
    static generate_dash_file_from_json_data(JsonStringData, VideoLength) {
        const jsonObject = JSON.parse(JsonStringData)
        const videoFormats = jsonObject.formats
        const generatedJSON = this.generate_xmljs_json_from_data(videoFormats, VideoLength)
        return xml.json2xml(generatedJSON)
    }

    // if you do not have the data from ytdl-core already, use this function
    static async get_yt_json_data(VideoId, VideoLength) {
        const data = await ytdl.getInfo(VideoId).then(videoInfo => {
            const jsonString = JSON.stringify(videoInfo, null, 2)
                // eslint-disable-next-line max-len
                .replace(/(ip(?:=|%3D|\/))((?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|[0-9a-f]{1,4}(?:(?::|%3A)[0-9a-f]{1,4}){7})/ig, '$10.0.0.0');
            return this.generate_dash_file_from_json_data(JSON.parse(jsonString), VideoLength)
        });
        console.log(data)
        return data
    }

    static generate_representation_audio(Format) {
        const representation ={
            "elements": [
                {
                    "type": "element",
                    "name": "Representation",
                    "attributes": {
                        "id": Format.itag,
                        "codecs": Format.audioCodec,
                        "bandwidth": Format.bitrate
                    },
                    "elements": [
                        {
                            "type": "element",
                            "name": "AudioChannelConfiguration",
                            "attributes": {
                                "schemeIdUri": "urn:mpeg:dash:23003:3:audio_channel_configuration:2011",
                                "value": "2"
                            },
                        },
                        {
                            "type": "element",
                            "name": "BaseURL",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": Format.url
                                }
                            ]
                        },
                        {
                            "type": "element",
                            "name": "SegmentBase",
                            "attributes": {
                                "indexRange": `${Format.indexRange.start}-${Format.indexRange.end}`
                            },
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "Initialization",
                                    "attributes": {
                                        "range": `${Format.initRange.start}-${Format.initRange.end}`
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        console.log("Rep", representation)
        return representation
    }

    static generate_representation_video(Format) {
        const representation ={
            "elements": [
                {
                    "type": "element",
                    "name": "Representation",
                    "attributes": {
                        "id": Format.itag,
                        "codecs": Format.videoCodec,
                        "bandwidth": Format.bitrate,
                        "width": Format.width,
                        "height": Format.height,
                        "maxPlayoutRate": "1",
                        "frameRate": Format.fps
                    },
                    "elements": [
                        {
                            "type": "element",
                            "name": "BaseURL",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": Format.url
                                }
                            ]
                        },
                        {
                            "type": "element",
                            "name": "SegmentBase",
                            "attributes": {
                                "indexRange": `${Format.indexRange.start}-${Format.indexRange.end}`
                            },
                            "elements": [
                                {
                                    "type": "element",
                                    "name": "Initialization",
                                    "attributes": {
                                        "range": `${Format.initRange.start}-${Format.initRange.end}`
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        console.log("Rep", representation)
        return representation
    }

    static generate_adaptation_set(VideoFormatArray) {
        const adaptationSets = []
        const mimeTypes = []
        const mimeObjects = [[]]
        // sort the formats by mime types
        VideoFormatArray.forEach((videoFormat) =>{
            const mimeType = videoFormat.mimeType.split(';')[0]
            const mimeTypeIndex = mimeTypes.indexOf(mimeType)
            if (mimeTypeIndex > -1) {
                mimeObjects[mimeTypeIndex].push(videoFormat)
            } else {
                mimeTypes.push(mimeType)
                mimeObjects.push([])
                mimeObjects[mimeTypes.length-1].push(videoFormat)
            }
        })
        // for each MimeType generate a new Adaptation set with Representations as sub elements
        for (let i = 0; i < mimeObjects.length; i++) {
            const adapSet = {
                "type": "element",
                "name": "AdaptationSet",
                "attributes": {
                    "id": i,
                    "mimeType": mimeTypes[i],
                    "startWithSAP": "1",
                    "subsegmentAlignment": "true"
                },
                "elements": []
            }
            if (mimeTypes[i].includes("video")) {
                adapSet.attributes.scanType = "progressive"
            }
            mimeObjects[i].forEach((format) => {
                adapSet.elements.push(this.generate_representation(format))
            })
            adaptationSets.push(adapSet)
        }
        return adaptationSets
    }

    static generate_xmljs_json_from_data(VideoFormatArray, VideoLength) {
        const convertJSON = {
            "declaration": {
                "attributes": {
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "elements": [
                {
                    "type": "element",
                    "name": "MPD",
                    "attributes": {
                        "xmlns": "urn:mpeg:dash:schema:mpd:2011",
                        "profiles": "urn:mpeg:dash:profile:full:2011",
                        "minBufferTime": "PT1.5S",
                        "type": "static",
                        "mediaPresentationDuration": `PT${VideoLength}S`
                    },
                    "elements": [
                        {
                            "type": "element",
                            "name": "Period",
                            "elements": this.generate_adaptation_set(VideoFormatArray)
                        }
                    ]
                }
            ]
        }
        return convertJSON
    }
}
module.exports = DashGenerator
