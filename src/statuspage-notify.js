// Description:
//   StatusPage notifications for Hubot
//
// Configuration:
//   HUBOT_STATUSPAGE_NOTIFY_PAGES - StatusCloud pages to monitor.
//   HUBOT_STATUSPAGE_NOTIFY_INTERVAL - Seconds between checks
//   HUBOT_STATUSPAGE_NOTIFY_CHANNELS - Rooms to announce status events in.
//   HUBOT_STATUSPAGE_NOTIFY_IGNORE - @TODO Regex of keys / values to ignore
//
// Commands:
//   hubot cloud status

module.exports = function(robot) {
    let request = require('http')

    let required = [
        'HUBOT_STATUSPAGE_NOTIFY_PAGES',
        'HUBOT_STATUSPAGE_NOTIFY_PAGES'
    ]
    required.forEach((var) => {
        if (typeof process.env[var] === 'undefined') {
            robot.logger.warn(`hubot-statuspage-notify requires ${var}`)
            return
        }
    })

    let pages = process.env.HUBOT_STATUSPAGE_NOTIFY_PAGES || ''
    let notifyRooms = process.env.HUBOT_STATUSPAGE_NOTIFY_CHANNELS || ''

    if (pages === '' || channels === '') {
        robot.logger.warn('hubot-statuspage-notify configuration requires: , HUBOT_STATUSPAGE_NOTIFY_PAGES')
    }
    robot.logger.debug(`HUBOT_STATUSPAGE_NOTIFY_PAGES = ${HUBOT_STATUSPAGE_NOTIFY_PAGES}`)
    robot.logger.debug(`HUBOT_STATUSPAGE_NOTIFY_CHANNELS = ${HUBOT_STATUSPAGE_NOTIFY_CHANNELS}`)
  
  }  