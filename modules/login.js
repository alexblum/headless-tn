const LOG_NAME = 'login';

const Manager_state = require('./base/state').Manager_state;
const STATE = require('./base/state').STATE;
const STATE_EVENTS = require('./base/state').EVENTS;

// log
const Log = require('./logger/Log');

/**
 * Login Flow
 * =====================
 * Open browser, set user/pass and try login
 *
 *
 */
class Login extends Manager_state {

    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.log = new Log(LOG_NAME);
    }

    /**
     * Open login page
     * =====================
     * Browser start
     *
     */
    async openLoginpage() {
        this.log.info('open login page');
        await this.bot.goto(this.config.url);
    }

    /**
     * Compile input
     * =====================
     * Set username
     *
     */
    async setUsername() {
        this.log.info('set username');
        await this.bot.waitForSelector('#player');
        await this.bot.type('#player', this.config.login);
    }

    /**
     * Compile input
     * =====================
     * Set password
     *
     */
    async setPassword() {
        this.log.info('set password');
        await this.bot.waitForSelector('#password');
        await this.bot.type('#password', this.config.password, { delay: 100 });
    }

    /**
     * Login
     * =====================
     * Press submit button
     *
     */
    async submitform() {
        this.log.info('submit form');
        await this.bot.waitForSelector('#frmLogin > span > input.login');
        let button = await this.bot.$('#frmLogin > span > input.login');
        const naviPromise = this.bot.waitForNavigation();
        await button.click();
        await naviPromise;

    }

    /**
     * Login check errors
     * =====================
     * Bad password or similar
     *
     */
    async submitverify() {
        this.log.info('check errors');

        try {
            const result = await this.bot.evaluate((userName) => {
                let greeting = document.querySelector('#skip-to-content').innerText;
                return greeting === 'You have logged on ' + userName + '!';
            }, this.config.username);

            if (result)
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.OK);
            else
                this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        } catch (err) {
            console.error(err);
            this.emit(STATE_EVENTS.CHANGE_STATUS, STATE.ERROR);
        }

        if (this.isError()) {
            this.log.error("Error: restart bot and retry...");
            await this.utils.screenshot(LOG_NAME, "checkerrors_error");
        } else {
            this.log.info('login is correct');
        }

    }

    /**
     * Login Flow
     * =====================
     *
     */
    async start() {
        this.log.info('loading...');

        await this.openLoginpage();

        this.utils.sleep(this.utils.randomInterval(2, 5));

        await this.setUsername();

        await this.setPassword();

        await this.submitform();

        this.utils.sleep(this.utils.randomInterval(4, 8));

        await this.submitverify();

        this.utils.sleep(this.utils.randomInterval(4, 8));

        this.log.info("login done");
    }
}

module.exports = (bot, config, utils) => { return new Login(bot, config, utils); };
