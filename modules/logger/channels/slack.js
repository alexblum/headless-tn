const TYPE = require('./../types');
const config = require('./../../../config');
const request = require('request');

/**
 * Log in channel is console
 */
class Slack {
    constructor() {
        this.webhook = config.log.channels.slack.webhook;
    }
    /**
     * Run is log in output console
     * @param type
     * @param func
     * @param message
     */
    log(type, func, message) {
        let body = '';
        switch (type) {
            case TYPE.INFO:
                body = this.info(type, func, message);
                break;
            case TYPE.WARNING:
                body = this.warning(type, func, message);
                break;
            case TYPE.ERROR:
                body = this.error(type, func, message);
                break;
            case TYPE.DEBUG:
                body = this.debug(type, func, message);
                break;
            default:
                console.error('[SLACK LOG] Type log not found!');
        }
        // push log
        this.postLog(body);
    }
    postLog(body) {
        request.post(
            this.webhook,
            body,
            function(error, response, body) {
                if (error) {
                    console.error(error)
                }
            }
        );
    }
    info(type, func, message) {
        return {
            json: {
                "attachments": [{
                    text: `${type} ${func}: ${message}`,
                    color: 'good'
                }]
            },
        };
    }
    warning(type, func, message) {
        return {
            json: {
                "attachments": [{
                    text: `${type} ${func}: ${message}`,
                    color: 'warning'
                }]
            },
        };
    }
    error(type, func, message) {
        return {
            json: {
                "attachments": [{
                    text: `${type} ${func}: ${message}`,
                    color: 'danger'
                }]
            },
        };
    }
    debug(type, func, message) {
        return {
            json: {
                "attachments": [{
                    text: `${type} ${func}: ${message}`,
                    color: '#005dff'
                }]
            },
        };
    }
}

module.exports = () => { return new Slack(); };
