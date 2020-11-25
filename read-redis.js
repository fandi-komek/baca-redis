const { rejects } = require("assert");
const { resolve } = require("path");
const redis_1 = require("redis");
const util_1 = require("util");

const redisBroadcaster  = redis_1.createClient('6379','192.168.99.24');
const campaignList      = ['COBAIN','TEST1','TEST2','TEST3', 'TEST4'];
function getCampaignIsActive(campaign){
    return new Promise((resolve, reject) => {
        if (!campaign){
            reject("Empty campaign");
            return;
        }
        /*
        let tmpValues = new Promise((resolve, reject) => {
            redisBroadcaster.keys(`*|${campaign}`,(error, channels) => {
                console.log('asli:', channels.length);
                resolve(channels.length);
            });
        });
        resolve(tmpValues); 
        */
        redisBroadcaster.keys(`*|${campaign}`,(error, channels) => {
            console.log('asli:', channels.length);
            resolve(channels.length);
        });
    })
}

for ( var x = 0; x < campaignList.length; x++){
    let tmpNamaCampaign = campaignList[x];
    let tmpHasilCampaign = 9999;
    getCampaignIsActive(tmpNamaCampaign)
    .then((values) => {
        console.info('didalem:', values);
        tmpHasilCampaign = values;
    }).catch((err) => console.error(err));
    
    console.log(`Hasil campaign [${tmpNamaCampaign}] = [${tmpHasilCampaign}]`);
}