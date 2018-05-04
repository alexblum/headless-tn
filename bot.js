let bot = null;
const puppeteer = require('puppeteer');
const config = require('./config');
const LOG = require('./modules/logger/types');

async function start(bot, puppeteer, config, LOG) {
    let browser = null;

    /**
     * Init
     * =====================
     *
     */
    if (config.executablePath === "" || config.executablePath === false) {
        browser = await puppeteer.launch({
            headless: config.chromeHeadless,
            sloMo: config.chromeSloMo,
            args: config.chromeOptions
        });
    } else {
        browser = await puppeteer.launch({
            headless: config.chromeHeadless,
            sloMo: config.chromeSloMo,
            args: config.chromeOptions,
            executablePath: config.executablePath
        });
    }
    bot = await browser.newPage();

    /**
     * Import libs
     * =====================
     * Modules of bot from folder ./modules
     *
     */
    let routes = require('./routes/strategies');
    let utils = require('./modules/utils')(bot, config);
    let login = require('./modules/login.js')(bot, config, utils);
    let playerInfo = require('./modules/playerInfo')(bot, config, utils);

    /**
     * Switch Mode
     * =====================
     * Switch social algorithms, change algorithm from config.js
     *
     */
    async function switchMode() {
        let strategy = routes[config.botMode];
        if (strategy !== undefined) {
            await strategy(bot, config, utils).start();
        } else {
            utils.logger(LOG.ERROR, "switch_mode", `mode ${strategy} not exist!`);
        }
    }

    const ua = await browser.userAgent();
    utils.logger(LOG.INFO, "user agent", ua);
    // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3391.0 Safari/537.36

    await login.start();

    if (login.isOk()) {
        await playerInfo.start();
        // while (true) {
        //     let revive = routes['reviveMode'];
        //     let buy = routes['buyMode'];
        //     await revive(bot, config, utils).start();
        //     utils.sleep(utils.randomInterval(180, 240));
        //     await buy(bot, config, utils).start();
        //     utils.sleep(utils.randomInterval(60 * 15, 60 * 25));
        // }
        await switchMode();
    }

    // stop(bot);
}

async function stop(bot) {
    await bot.close();
}

start(bot, puppeteer, config, LOG);
