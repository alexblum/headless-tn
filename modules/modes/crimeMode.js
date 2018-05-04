const LOG_NAME = 'crime';

const Manager_state = require('../base/state').Manager_state;
const STATE = require('../base/state').STATE;
const STATE_EVENTS = require('../base/state').EVENTS;
const telegraf = require('telegraf');

// log
const Log = require('../logger/Log');

class CrimeMode extends Manager_state {

    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.log = new Log(LOG_NAME);
    }

    // TODO

    // #nav-crimes > div > a
}

module.exports = (bot, config, utils) => { return new CrimeMode(bot, config, utils); };
