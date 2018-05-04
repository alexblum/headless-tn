const TYPES_LOG = {
    INFO:'[INFO]',
    WARNING:'[WARNING]',
    ERROR:'[ERROR]',
    DEBUG:'[DEBUG]'
};

const routes_log = require('./../../routes/log');
const config = require('./../../config');

module.exports = class Log{
    constructor(func){
        this.func = func;
        this.channels = [];

        config.log.drivers.forEach((driver) => {
            let Channel = routes_log[driver];
            if (Channel !== undefined) {
                this.setChannel(Channel());
            } else {
                console.error('channel log not found');
            }
        });
    }

    /**
     *
     * @param interfaceChannel
     */
    setChannel(interfaceChannel){
        this.channels.push(interfaceChannel);
    }

    /**
     * Helper function
     *
     * @param type
     * @param message
     */
    channelsLog(type,message){
        this.channels.forEach((channel) => {
            channel.log(type, this.func, message);
        });
    }
    info(message){
        this.channelsLog(TYPES_LOG.INFO, message);
    }
    warning(message){
        this.channelsLog(TYPES_LOG.WARNING, message);
    }
    error(message){
        this.channelsLog(TYPES_LOG.ERROR, message);
    }
    debug(message){
        this.channelsLog(TYPES_LOG.DEBUG, message);
    }
};
