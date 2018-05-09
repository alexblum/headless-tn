const LOG_NAME = 'playerInfo';

const Manager_state = require('./base/state').Manager_state;
const STATE = require('./base/state').STATE;
const STATE_EVENTS = require('./base/state').EVENTS;

// log
const Log = require('./logger/Log');

/**
 * Read player Info
 * =====================
 *
 *
 */
class PlayerInfo extends Manager_state {

    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.log = new Log(LOG_NAME);
    }

    async start() {
        const energy = await this.readEnergy();
        const money = await this.readMoney();
        const nerve = await this.readNerve();

        this.log.info('Energy: ' + energy);
        this.log.info('Nerve: ' + nerve);
        this.log.info('Money: ' + money);
    }

    async readEnergy() {
        return await this.bot.evaluate((sel) => {
            return parseInt(document.getElementById(sel).innerText.match(/\d+/)[0]);
        }, 'barEnergy');
    }

    async readNerve() {
        return await this.bot.evaluate((sel) => {
            return parseInt(document.getElementById(sel).innerText.match(/\d+/)[0]);
        }, 'barNerve');
    }

    async readMoney() {
        return await this.bot.evaluate((sel) => {
            return parseInt(document.getElementById(sel).innerText.replace(/[^0-9]+/g, ''));
        }, 'user-money');
    }
}

module.exports = (bot, config, utils) => { return new PlayerInfo(bot, config, utils); };
