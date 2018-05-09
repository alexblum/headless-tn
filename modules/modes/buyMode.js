const LOG_NAME = 'buying';

const Manager_state = require('../base/state').Manager_state;
const STATE = require('../base/state').STATE;
const STATE_EVENTS = require('../base/state').EVENTS;
const items = require('../Items');

// log
const Log = require('../logger/Log');

class BuyMode extends Manager_state {

    constructor(bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;

        this.log = new Log(LOG_NAME);
    }

    async readMoney() {
        return await this.bot.evaluate((sel) => {
            return parseInt(document.getElementById(sel).innerText.replace(/[^0-9]+/g, ''));
        }, 'user-money')
    }

    async buyItem(item) {
        const linkSelector = await this.bot.$('#nav-city > div > a');
        if (linkSelector === null) {
            await this.bot.goto(this.config.url, {waitUntil: 'networkidle2'});
        }

        // go to city
        this.log.info('go to city');
        await this.bot.click('#nav-city > div > a');
        this.utils.sleep(this.utils.randomInterval(3, 5));

        // go to market
        this.log.info('go to market');
        await this.bot.click('#quick_links > ul > li:nth-child(1) > ul > li.highlightItemMarket > a');
        this.utils.sleep(this.utils.randomInterval(3, 5));

        // do search
        this.log.info('search market for ' + item.name);
        await this.bot.type('#item-market-main-wrap > div.main-market-page > div > div.market-search.top-round.white-grad > div.cont.right > form > input.search-items.ui-autocomplete-input', item.name, {delay: 100});
        await this.bot.click('#item-market-main-wrap > div.main-market-page > div > div.market-search.top-round.white-grad > div.cont.right > form > span.btn-wrap.silver > span > input[type="submit"]');
        this.utils.sleep(this.utils.randomInterval(3, 6));

        // go to first bazaar
        this.log.info('go to first bazaar');
        await this.bot.hover('#item-market-main-wrap > div.shop-market-page > div > ul > li:nth-child(1) > span > span.item > a');
        await this.bot.click('#item-market-main-wrap > div.shop-market-page > div > ul > li:nth-child(1) > span > span.item > a');
        this.utils.sleep(this.utils.randomInterval(1, 3));

        // buy it
        this.log.info('try to buy ' + item.name);
        await this.bot.click('#item-' + item.itemId + ' + span.buy');
        await this.bot.waitForSelector('a.yes');
        this.utils.sleep(this.utils.randomInterval(1, 2));
        const inputElement = await this.bot.$('a[data-item="'+item.itemId+'"]');
        await inputElement.click();

        this.utils.sleep(this.utils.randomInterval(5, 10));

        // TODO
        let resultElement = await this.bot.evaluate(() => {
            let element = Array.from(document.querySelectorAll('.success')).filter(e => e.innerText.trim().length > 0);
            if (element.length === 0) {
                element = Array.from(document.querySelectorAll('.error')).filter(e => e.innerText.trim().length > 0);
            }
            return element.length === 0 ? null : element[0];
        });

        if (resultElement !== null) {
            this.log.info(resultElement.innerText);
        } else {
            this.log.warning('can not read result');
        }

    }

    async start() {
        this.log.info('buying');

        const today = new Date();

        this.log.info("loading... " + new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));

        const money = await this.readMoney();
        this.log.info('Money: ' + money);

        const item = items[this.config.buyItem];
        if (item === null) {
            this.log.error('Can not find item: ' + this.config.buyItem);
            this.log.info('buying failed');
            return;
        }
        this.log.info('Buying item: ' + item.name);

        if (item.price > money) {
            this.log.info('not enougth money');
        } else {
            await this.buyItem(item);
        }

        this.log.info('buying done');
    }

}

module.exports = (bot, config, utils) => { return new BuyMode(bot, config, utils); };
