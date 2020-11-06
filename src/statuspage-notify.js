// Description:
//   StatusPage notifications for Hubot
//
// Configuration:
//   HUBOT_STATUSPAGE_NOTIFY_PAGES - StatusCloud pages to monitor.
//   HUBOT_STATUSPAGE_NOTIFY_INTERVAL - Seconds between checks
//   HUBOT_STATUSPAGE_NOTIFY_CHANNELS - Rooms to announce status events in.
//   HUBOT_STATUSPAGE_NOTIFY_IGNORE - @TODO Regex of keys / values to ignore
//

module.exports = function(robot) {
    let required = [
        'HUBOT_STATUSPAGE_NOTIFY_PAGES',
        'HUBOT_STATUSPAGE_NOTIFY_CHANNELS'
    ]

    let pluginName = 'statuscloud-notify'
    let monitorPages = process.env.HUBOT_STATUSPAGE_NOTIFY_PAGES || ''
    let notifyChannels = process.env.HUBOT_STATUSPAGE_NOTIFY_CHANNELS || ''
    let checkInterval = process.env.HUBOT_STATUSPAGE_NOTIFY_INTERVAL || 3
    let timer

    // Seconds to ms.
    checkInterval = checkInterval * 1000

    /**
     * Validate configuration and set up timers.
     */
    setupTimers = () => {
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
            timer = setInterval(checkStatusPage, checkInterval)
        }

    }

    checkStatusPage = () => {
        pages = robot.brain.get(`${pluginName}.monitorPages`)
        pages.forEach((page) => {
            // robot.logger.debug(`StatusCloud check: ${page}.`)
            let pageUrl = `https://${page}.statuspage.io/api/v2/status.json`
            let key = `${pluginName}.results.${page}`
            let title = page
            robot.http(pageUrl).get()((err, res, body) => {
                if (err) throw `HTTP exception at ${pageUrl}`
                if (res.statusCode !== 200) {
                    robot.logger.warning(`HTTP ${res.statusCode} response from ${url}`)
                    throw `HTTP exception at ${pageUrl}`
                }

                let prevResult = robot.brain.get(`${key}.status`) || { status: { description: 'No result yet' } }
                let curResult = JSON.parse(body)

                if (typeof curResult.page.name !== 'undefined') title = curResult.page.name
                if (curResult.status.description !== prevResult.status.description) {
                    robot.messageRoom('shell', `StatusPage for ${title} has changed to ${curResult.status.description}`)
                }
                robot.brain.set(`${key}.status`, curResult)
            })
        })
    }

    setupTimers()
}