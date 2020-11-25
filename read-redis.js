const redis_1 = require("redis");

const redisBroadcaster  = redis_1.createClient('6379','192.168.99.24');
const campaignList      = ['COBAIN','TEST1','TEST2','TEST3', 'TEST4'];
function getCampaignIsActive(campaign){
    return new Promise((resolve, reject) => {
       if (campaign !== ""){
            let retreivedCampaignData;
            retreivedCampaignData = new Promise((resolve, reject) => {
                redisBroadcaster.keys(`*|${campaign}`, (error, channels) => {
                    resolve(channels.length);
                })
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

for ( var x = 0; x < campaignList.length; x++){
    let tmpNamaCampaign = campaignList[x];
    let tmpHasilCampaign = 9999;
    getCampaignIsActive(tmpNamaCampaign)
    .then((values) => {
        //console.info('didalem:', values);
        tmpHasilCampaign = values;
        console.log(`Hasil campaign [${tmpNamaCampaign}] = [${tmpHasilCampaign}]`);
    }).catch((err) => console.error(err));
}