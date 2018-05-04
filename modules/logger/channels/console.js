const MAP_COLORS = require('./../types').MAP_COLORS;

/**
 * Log in channel is console
 */
class Console{
    /**
     * Run is log in output console
     * @param type
     * @param func
     * @param message
     */
    log(type, func, message){
        let color = MAP_COLORS[type];
        console.log(`${type} ${func}: ${message}`[color]);
    }
};

module.exports = () => { return new Console(); };
