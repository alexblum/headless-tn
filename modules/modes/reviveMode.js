const LOG_NAME = 'revive';

const Manager_state = require('../base/state').Manager_state;
const STATE = require('../base/state').STATE;
const STATE_EVENTS = require('../base/state').EVENTS;

// log
const Log = require('../logger/Log');

class ReviveMode extends Manager_state {

    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.log = new Log(LOG_NAME);
        this.playerInfo = require('../playerInfo')(bot, config, utils);
    }

    async doRevive(amount) {
        const linkSelector = await this.bot.$('#nav-hospital > div > a');
        if (linkSelector === null) {
            await this.bot.goto(this.config.url, {waitUntil: 'networkidle2'});
        }

        await this.bot.click('#nav-hospital > div > a');
        this.utils.sleep(this.utils.randomInterval(1, 2));

        for (let i = 1; i <= amount; i++) {
            this.log.info('try to revive...');
            await this.bot.click('#mainContainer > div.content-wrapper.m-left20.left.spring > div.userlist-wrapper > ul > li:nth-child(' + i + ') > a.revive');
            const reviveSelector = '#mainContainer > div.content-wrapper.m-left20.left.spring > div.userlist-wrapper > ul > li:nth-child(' + i + ') > div.confirm-revive > div > a.action-yes.t-blue.bold.m-left10';
            await this.bot.waitForSelector(reviveSelector);
            await this.bot.waitFor(500);
            await this.bot.click(reviveSelector);
            this.utils.sleep(this.utils.randomInterval(2, 5));

            const resultSelector = '#mainContainer > div.content-wrapper.m-left20.left.spring > div.userlist-wrapper > ul > li:nth-child(' + i + ') > div.confirm-revive > div';
            const result = await this.bot.evaluate((sel) => {
                return document.querySelector(sel).innerText;
            }, resultSelector);
            this.log.info(result);
        }
    }

    async start() {
        this.log.info('revive');

        const today = new Date();

        this.log.info("loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));

        const energy = await this.playerInfo.readEnergy();
        this.log.info('Energy: ' + energy);

        const reviveCount = Math.floor(energy / 25);
        this.log.info('Revive amount: ' + reviveCount);

        this.utils.sleep(this.utils.randomInterval(1, 5));

        if (reviveCount > 0) {
            await this.doRevive(reviveCount);
        }

        this.utils.sleep(this.utils.randomInterval(1, 5));

        this.log.info('revive done');
    }

}

module.exports = (bot, config, utils) => { return new ReviveMode(bot, config, utils); };
