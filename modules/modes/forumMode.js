const LOG_NAME = 'forum';

const Manager_state = require('../base/state').Manager_state;
const STATE = require('../base/state').STATE;
const STATE_EVENTS = require('../base/state').EVENTS;
const telegraf = require('telegraf');

// log
const Log = require('../logger/Log');

class ForumMode extends Manager_state {

    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.log = new Log(LOG_NAME);
    }

    async readForum() {
        const startTime = new Date().getTime();

        while(startTime + this.config.forumReadingTime * 60 * 1000 > new Date().getTime()) {

            await this.bot.click('#nav-forums > div > a');
            this.utils.sleep(this.utils.randomInterval(3, 10));

            const forumLinks = await this.bot.$$('.forum-link');

            const randomForumLink = this.utils.mixArray(forumLinks)[0];
            await randomForumLink.click();
            this.utils.sleep(this.utils.randomInterval(3, 10));

            const threadLinks = await this.bot.$$('.thread-name');
            while(this.utils.randomBoolean()) {
                const randomThreadLink = this.utils.mixArray(threadLinks)[0];
                await randomThreadLink.click();
                this.utils.sleep(this.utils.randomInterval(3, 10));

                const pageLinks = await this.bot.$$('.page-number');

                if (pageLinks.length > 0) {
                    const a = pageLinks[0].getProperty('style');
                    console.log(a);
                }
                await this.bot.goBack();
                this.utils.sleep(this.utils.randomInterval(3, 10));
            }

        }

        this.utils.sleep(this.utils.randomInterval(3, 10));

    }

    // TODO
    // "#nav-forums > div > a

    // jQuery(document.querySelectorAll('.forum-link')[5]).click()

    // jQuery(document.querySelectorAll('.thread-name')[5]).click()

    // document.querySelectorAll('.page-number') only visible

    async start() {
        this.log.info('forum');

        const today = new Date();

        this.log.info("loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));

        this.utils.sleep(this.utils.randomInterval(1, 5));

        await this.readForum();

        this.utils.sleep(this.utils.randomInterval(1, 5));
    }
}

module.exports = (bot, config, utils) => { return new ForumMode(bot, config, utils); };
