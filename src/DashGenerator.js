const ytdl = require('ytdl-core')
const xml = require('xml-js')
const XmlGenerator = require('./XmlGenerator')
class DashGenerator {
  // if you already have the getInfo data from ytdl-core as a string, use this function
  static generateDashFileFromJsonData(jsonStringData, videoLength) {
    const jsonObject = JSON.parse(jsonStringData)
    const videoFormats = jsonObject.player_response.streamingData.adaptiveFormats
    const generatedJSON = XmlGenerator.generateXmljsJsonFromData(videoFormats, videoLength)
    return xml.json2xml(generatedJSON)
  }

  // use this if you already have aformats array
  static generateDashFileFromFormats(videoFormats, videoLength) {
    const generatedJSON = XmlGenerator.generateXmljsJsonFromData(videoFormats, videoLength)
    return xml.json2xml(generatedJSON)
  }

  // if you do not have the data from ytdl-core already, use this function
  static async generateDashFileFromJsonDataFromId(videoId, videoLength) {
    return await ytdl.getInfo(videoId).then(videoInfo => {
      const jsonString = JSON.stringify(videoInfo, null, 2)
      // eslint-disable-next-line max-len
        .replace(/(ip(?:=|%3D|\/))((?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|[0-9a-f]{1,4}(?:(?::|%3A)[0-9a-f]{1,4}){7})/ig, '$10.0.0.0')
      return this.generateDashFileFromJsonData(jsonString, videoLength)
    })
  }
}
module.exports = DashGenerator
