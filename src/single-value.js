const redis_1 = require("redis");

const redisBroadcaster  = redis_1.createClient('6379','192.168.99.24');
const campaignList      = ['COBAIN','TEST1','TEST2','TEST3', 'TEST4'];
function getCampaignIsActive(campaign){
    return new Promise((resolve, reject) => {
       if (campaign !== ""){
            let retreivedCampaignData;
            retreivedCampaignData = new Promise((resolve, reject) => {
                /*
                redisBroadcaster.keys(`*|${campaign}`, (error, channels) => {
                    resolve(channels.length);
                });
                */
               redisBroadcaster.keys(`${campaign}`, (error, channels) => {
                resolve(channels.length);
            });
            });
            Promise.resolve(retreivedCampaignData)
            .then((values) => {
                resolve(values);
            });
       } else {
           reject(`Empty campaign !`);
       }
    })
}
/** CARA PERTAMA  */

for ( var x = 0; x < campaignList.length; x++){
    let tmpNamaCampaign = campaignList[x];
    let tmpHasilCampaign = 9999;
    getCampaignIsActive(tmpNamaCampaign)
    .then((values) => {
        tmpHasilCampaign = values;
        console.log(`[CARA 1][${x}] Hasil campaign [${tmpNamaCampaign}] = [${tmpHasilCampaign}]`);
    }).catch((err) => console.error(err));
}
/** CARA KEDUA  */
for ( var y = 0; y < campaignList.length; y++){
    let tmpNamaCampaign = campaignList[y];
    let tmpHasilCampaign02  = Promise.resolve(getCampaignIsActive(tmpNamaCampaign));
    tmpHasilCampaign02.then((value) => {
        console.log(`[CARA 2][${y}] Hasil campaign [${tmpNamaCampaign}] = [${value}]`);
    });
}
