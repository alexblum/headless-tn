const LOG_NAME = 'crime';

const Manager_state = require('../base/state').Manager_state;
const STATE = require('../base/state').STATE;
const STATE_EVENTS = require('../base/state').EVENTS;
const telegraf = require('telegraf');
const crimes = require('../crimes');

// log
const Log = require('../logger/Log');

class CrimeMode extends Manager_state {

    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.log = new Log(LOG_NAME);
        this.playerInfo = require('../playerInfo')(bot, config, utils);
    }

    // TODO

    // #nav-crimes > div > a

    // document.querySelector('.captcha-image img') src
    async doCrime(crime, crimeCount) {
        const linkSelector = await this.bot.$('#nav-crimes > div > a');
        if (linkSelector === null) {
            await this.bot.goto(this.config.url, {waitUntil: 'networkidle2'});
        }

        // go to crimi
        this.log.info('go to crimi');
        await this.bot.click('#nav-crimes > div > a');
        this.utils.sleep(this.utils.randomInterval(3, 5));

        // check for captcha
        await this.handleCaptcha();

        for (let i = 0; i < crime.selectors.length; i++) {
            let crimeText = crime.selectors[i];
            await this.bot.evaluate((crimeText) => {
                Array.from(document.querySelectorAll('.bonus.left')).filter(el => el.innerText === crimeText)[0].click();
            }, crimeText);
            this.utils.sleep(this.utils.randomInterval(1, 3));
        }

        let tryAgain = await this.bot.$('#try_again');
        if (tryAgain !== null) {
            this.log.info('crime succeed');
        } else {
            this.log.warning('crime failed');
        }

        await this.repeatCrime(crimeCount - 1);
    }

    async handleCaptcha() {
        this.log.info('check for captcha');

        const captcha = await this.bot.$('.captcha-image img');
        if (captcha === null) {
            this.log.info('no captcha found');
            return;
        }

        const captchaUrl = await this.bot.$eval('.captcha-image img', el => el.src);
        this.log.info('captcha src: ' + captchaUrl);

        // TODO handle captcha
        this.utils.sleep(this.utils.randomInterval(5, 10));
    }

    async repeatCrime(count) {
        let tryAgain = await this.bot.$('#try_again');
        while (count > 0 && tryAgain !== null) {
            await this.bot.click('#try_again');
            this.utils.sleep(this.utils.randomInterval(3, 7));
            tryAgain = await this.bot.$('#try_again');
            count--;

            if (tryAgain !== null) {
                this.log.info('crime succeed');
            } else {
                this.log.warning('crime failed');
            }
        }
    }

    async start() {
        this.log.info('do crime');

        const today = new Date();

        this.log.info("loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));

        const nerve = await this.playerInfo.readNerve();
        this.log.info('Nerve: ' + nerve);

        const crime = crimes[this.config.crime];
        if (crime === null) {
            this.log.error('Crime not found: ' + this.config.crime);
            this.log.info('Doing failed');
            return;
        }
        this.log.info('Doing crime: ' + crime.name);

        const crimeCount = Math.floor(nerve / crime.nerve);
        this.log.info('Crime amount: ' + crimeCount);

        this.utils.sleep(this.utils.randomInterval(1, 5));

        if (crimeCount > 0) {
            await this.doCrime(crime, crimeCount);
        } else {
            this.log.info('not enougth nerve');
        }

        this.log.info('crime done');
    }
}

module.exports = (bot, config, utils) => { return new CrimeMode(bot, config, utils); };
