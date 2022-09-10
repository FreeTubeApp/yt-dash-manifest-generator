class XmlGenerator {
  static generateRepresentationAudio(format) {
    const representation =
            {
              type: 'element',
              name: 'Representation',
              attributes: {
                id: format.itag,
                codecs: format.mimeType.split(' ')[1].match(/"[^"]*/)[0].substr(1),
                bandwidth: format.bitrate
              },
              elements: [
                {
                  type: 'element',
                  name: 'AudioChannelConfiguration',
                  attributes: {
                    schemeIdUri: 'urn:mpeg:dash:23003:3:audio_channel_configuration:2011',
                    value: '2'
                  },
                },
                {
                  type: 'element',
                  name: 'BaseURL',
                  elements: [
                    {
                      type: 'text',
                      text: format.url
                    }
                  ]
                },
                {
                  type: 'element',
                  name: 'SegmentBase',
                  attributes: {
                    indexRange: `${format.indexRange.start}-${format.indexRange.end}`
                  },
                  elements: [
                    {
                      type: 'element',
                      name: 'Initialization',
                      attributes: {
                        range: `${format.initRange.start}-${format.initRange.end}`
                      }
                    }
                  ]
                }
              ]
            }
    return representation
  }

  static generateRepresentationVideo(format) {
    const representation =
            {
              type: 'element',
              name: 'Representation',
              attributes: {
                id: format.itag,
                codecs: format.mimeType.split(' ')[1].match(/"[^"]*/)[0].substr(1),
                bandwidth: format.bitrate,
                width: format.width,
                height: format.height,
                maxPlayoutRate: '1',
                frameRate: format.fps
              },
              elements: [
                {
                  type: 'element',
                  name: 'BaseURL',
                  elements: [
                    {
                      type: 'text',
                      text: format.url
                    }
                  ]
                },
                {
                  type: 'element',
                  name: 'SegmentBase',
                  attributes: {
                    indexRange: `${format.indexRange.start}-${format.indexRange.end}`
                  },
                  elements: [
                    {
                      type: 'element',
                      name: 'Initialization',
                      attributes: {
                        range: `${format.initRange.start}-${format.initRange.end}`
                      }
                    }
                  ]
                }
              ]
            }
    return representation
  }

  static generateAdaptationSet(videoFormatArray) {
    const adaptationSets = []
    const mimeTypes = []
    const mimeObjects = [[]]
    // sort the formats by mime types
    videoFormatArray.forEach((videoFormat) => {
      // the dual formats should not be used
      if (videoFormat.hasVideo && videoFormat.hasAudio) {
        return
      }
      // if these properties are not available, then we skip it because we cannot set these properties
      if (!('initRange' in videoFormat && 'indexRange' in videoFormat)) {
        return
      }
      const mimeType = videoFormat.mimeType.split(';')[0]
      const mimeTypeIndex = mimeTypes.indexOf(mimeType)
      if (mimeTypeIndex > -1) {
        mimeObjects[mimeTypeIndex].push(videoFormat)
      } else {
        mimeTypes.push(mimeType)
        mimeObjects.push([])
        mimeObjects[mimeTypes.length - 1].push(videoFormat)
      }
    })
    // for each MimeType generate a new Adaptation set with Representations as sub elements
    for (let i = 0; i < mimeTypes.length; i++) {
      let isVideoFormat = false
      const adapSet = {
        type: 'element',
        name: 'AdaptationSet',
        attributes: {
          id: i,
          mimeType: mimeTypes[i],
          startWithSAP: '1',
          subsegmentAlignment: 'true'
        },
        elements: []
      }
      if (mimeTypes[i].includes('video')) {
        adapSet.attributes.scanType = 'progressive'
        isVideoFormat = true
      }
      mimeObjects[i].forEach((format) => {
        if (isVideoFormat) {
          adapSet.elements.push(this.generateRepresentationVideo(format))
        } else {
          adapSet.elements.push(this.generateRepresentationAudio(format))
        }
      })
      adaptationSets.push(adapSet)
    }
    return adaptationSets
  }

  static generateXmljsJsonFromData(videoFormatArray, videoLength) {
    const convertJSON = {
      declaration: {
        attributes: {
          version: '1.0',
          encoding: 'utf-8'
        }
      },
      elements: [
        {
          type: 'element',
          name: 'MPD',
          attributes: {
            xmlns: 'urn:mpeg:dash:schema:mpd:2011',
            profiles: 'urn:mpeg:dash:profile:full:2011',
            minBufferTime: 'PT1.5S',
            type: 'static',
            mediaPresentationDuration: `PT${videoLength}S`
          },
          elements: [
            {
              type: 'element',
              name: 'Period',
              elements: this.generateAdaptationSet(videoFormatArray)
            }
          ]
        }
      ]
    }
    return convertJSON
  }
}
module.exports = XmlGenerator
