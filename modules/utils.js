const LOG = require('../modules/logger/types');
const colors = require('colors');
const MAP_COLORS = require('./logger/types').MAP_COLORS;

/**
 * Utils
 * =====================
 * Logger and other functions...
 *
 */
class Utils {
    constructor(bot, config) {
        this.bot = bot;
        this.config = config;
    }

    /**
     * Logger
     * =====================
     * Better than console.log()
     */
    logger(type, func, text) {
        let color = MAP_COLORS[type];
        console.log(`${type} ${func}: ${text}` [color]);
    }

    /**
     * Screenshot
     * =====================
     * Save screenshot from chrome
     *
     */
    async screenshot(func, name) {
        try {
            await this.bot.screenshot({ path: './logs/screenshot/' + this.config.tornLogin + '_' + func + '_' + name + '.jpg' });
        } catch (err) {
            this.logger(LOG.WARNING, "screenshot", "error " + err);
        }
    }

    randomBoolean() {
        return Math.random() >= 0.5;
    }

    /**
     * Random
     * =====================
     * Random number between two numbers
     *
     */
    randomInterval(min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
    }

    /**
     * Mix array element
     * @param arr
     * @return array
     */
    mixArray(arr) {
        return arr.sort(function() { return 0.5 - Math.random() });
    }
    /**
     * Sleep
     * =====================
     * Zzz
     *
     */
    sleep(sec) {
        let sleep = require('system-sleep');
        this.logger(LOG.INFO, "sleep", "sleep " + sec/1000 + "s");
        sleep(sec);
    }

    /**
     * Check is debug
     * @return {boolean}
     */
    isDebug() {
        return this.config.debug === true;
    }

}

module.exports = (bot, config, utils) => { return new Utils(bot, config, utils); };
