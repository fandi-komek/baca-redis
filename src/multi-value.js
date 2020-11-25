"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asterisk_manager_interface_1 = require("asterisk-manager-interface");
const redis_1 = require("redis");

const util_1 = require("util");

const asterisk = new asterisk_manager_interface_1.AsteriskManagerInterface();

const asteriskChannel   = redis_1.createClient('6379','192.168.99.24');
const redisBroadcaster  = redis_1.createClient('6379','192.168.99.24');
asterisk.connect(5038, '192.168.99.24', () => {
    asterisk.login({ Username: 'obelisk', Secret: '0b3l15k'}, (response, headers) => {
        asterisk.sendAction("Events", { EventMask: "call,system,agent,cdr" }, (response, headers) => console.log(headers));
        asteriskChannel.subscribe("asterisk");
        console.log(response);
        console.log(headers);
    });
});

function getBridgedChannel(sipChannel){
    return new Promise((resolve, reject) => {
        if (!sipChannel){
            reject("Empty SIP Channels");
            return;
        }
        redisBroadcaster.keys(`${sipChannel}`, (error, channels) => {
            if (error){
                return console.log(error);
            }
            console.log(`hasil keys ${sipChannel}`,channels);

            if (channels !== undefined && channels.length > 0){
                const hashMultipleGet = util_1.promisify(redisBroadcaster.hmget);
                let retrievedChannelValues = [];
                channels.forEach((channel) => {
                    retrievedChannelValues.push(new Promise((resolve, reject) => {
                        hashMultipleGet
                        .bind(redisBroadcaster)(channel, ["uniqueId", "state","bridgedChannel", "calldate", "destination"])
                        .then((values) => {
                            if (values.length > 0){
                                resolve({
                                    channel: channel,
                                    uniqueId: values[0],
                                    state: values[1],
                                    bridgedChannel: values[2],
                                    callDate: values[3],
                                    destination: values[4]
                                });
                            } else {
                                reject(`Empty channel values of: ${channel}`);
                            }
                        })
                        .catch((error) => console.error(error));
                    }));
                });
                Promise.all(retrievedChannelValues)
                .then((channelValues) => {
                    resolve(channelValues);
                })
                .catch((error) => console.error(error));
            } else {
                reject(`No available channels for SIP channels: '${channels}'`)
            }
        })
    })
}

asterisk.on("close", () => {
    asteriskChannel.quit();
    redisBroadcaster.quit();
});
asterisk.on("Bridge", (headers) => {
    if (headers.Bridgestate == "Link") {
        console.log('Bridge',headers);
        
        /*
        asteriskChannel.hmget(`${headers.Channel1}`,'bridgedChannel')
        .then((data) => {
            console.log(`Hasil redis ${headers.Channel1}`, data);
        })
        */
        getBridgedChannel(`${headers.Channel1}`)
        .then((channelValues) => {
            channelValues.forEach((values) => {
                console.log('Hasil redis', values);
            });
        })
        .catch((error) => console.error(error));
        
        /*
        let tmpGetChannel = function(done){
            asteriskChannel.hget(headers.Channel1, "bridgedChannel", (err, reply) => {
                return done(reply);
            });
        }
        */
        
        


    }
});


