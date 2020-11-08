// Description:
//   StatusPage notifications for Hubot
//
// Configuration:
//   HUBOT_STATUSPAGE_NOTIFY_PAGES - StatusCloud page slugs (eg 'catalystcloud' or 'linode') to monitor.
//   HUBOT_STATUSPAGE_NOTIFY_INTERVAL - Seconds between checks
//   HUBOT_STATUSPAGE_NOTIFY_CHANNELS - Rooms to announce status events in.
//

module.exports = (robot) {
  const required = [
    'HUBOT_STATUSPAGE_NOTIFY_PAGES',
    'HUBOT_STATUSPAGE_NOTIFY_CHANNELS'
  ]

  const pluginName = 'statuscloud-notify'
  let monitorPages = process.env.HUBOT_STATUSPAGE_NOTIFY_PAGES || ''
  let notifyChannels = process.env.HUBOT_STATUSPAGE_NOTIFY_CHANNELS || ''
  let checkInterval = process.env.HUBOT_STATUSPAGE_NOTIFY_INTERVAL || 3

  // Seconds to ms.
  checkInterval = checkInterval * 1000

  const init = () => {
    let validConfiguration = true

    required.forEach((varName) => {
      if (typeof process.env[varName] === 'undefined') {
        robot.logger.warning(`hubot-statuspage-notify requires configuring ${varName}`)
        validConfiguration = false
      }
    })

    if (validConfiguration) {
      robot.logger.debug('Setting up timers')
      monitorPages = monitorPages.split(' ')
      notifyChannels = notifyChannels.split(' ')

      robot.logger.debug(`Monitoring statuscloud for ${monitorPages.join(', ')} and will notify rooms ${notifyChannels.join(', ')}`)
      robot.brain.set(`${pluginName}.monitorPages`, monitorPages)
      robot.brain.set(`${pluginName}.notifyChannels`, notifyChannels)
      setInterval(checkStatusPage, checkInterval)
    }
  }

  const checkStatusPage = () => {
    const pages = robot.brain.get(`${pluginName}.monitorPages`)
    pages.forEach((page) => {
      // robot.logger.debug(`StatusCloud check: ${page}.`)
      const pageUrl = `https://${page}.statuspage.io/api/v2/status.json`
      const incidentsUrl = `https://${page}.statuspage.io/api/v2/incidents/unresolved.json`
      const key = `${pluginName}.results.${page}`
      let title = page

      // Check and report status.
      robot.http(pageUrl).get()((err, res, body) => {
        if (err) throw new Error(`HTTP exception at ${pageUrl}`)
        if (res.statusCode !== 200) {
          robot.logger.warning(`HTTP ${res.statusCode} response from ${pageUrl}`)
          throw new Error(`HTTP ${res.statusCode} at ${pageUrl}`)
        }

        const prevResult = robot.brain.get(`${key}.status`) || { page: { updated_at: '' } }
        const curResult = JSON.parse(body)
        // console.log(curResult, 'curResult status')

        if (typeof curResult.page.name !== 'undefined') title = curResult.page.name
        if (curResult.page.updated_at > prevResult.page.updated_at) {
          const message = `${title} status is ${curResult.status.description} at ${curResult.page.updated_at}`
          notifyChannels.forEach((channel) => {
            robot.messageRoom(channel, message)
          })
        }
        robot.brain.set(`${key}.status`, curResult)
      })

      // Check and report incidents.
      robot.http(incidentsUrl).get()((err, res, body) => {
        if (err) throw new Error(`HTTP exception at ${incidentsUrl}`)
        if (res.statusCode !== 200) {
          robot.logger.warning(`HTTP ${res.statusCode} response from ${incidentsUrl}`)
          throw new Error(`HTTP ${res.statusCode} at ${incidentsUrl}`)
        }

        const prevResult = robot.brain.get(`${key}.incident`) || { updated_at: '' }
        const curResult = JSON.parse(body)

        curResult.incidents.forEach((incident) => {
          if (incident.updated_at > prevResult.updated_at) {
            const affectedComponents = incident.components.reduce((incidents, component) => {
              incidents.push(`- ${component.name} (${component.status})`)
              return incidents
            }, []).join('\n')

            const message = [
              `${title} ${incident.impact} incident: ${incident.name}`,
              `${affectedComponents}`,
              `- ${incident.shortlink}`,
              `${incident.incident_updates[0].body}`
            ].join('\n')

            notifyChannels.forEach((channel) => {
              robot.messageRoom(channel, message)
            })
            robot.brain.set(`${key}.incident`, incident)
          }
        })
      })
    })
  }

  init()
}
