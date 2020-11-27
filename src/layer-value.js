/**
 * Coba ngakalin ini :
 * https://bitbucket.org/dnnit/obelisk-admin/src/master/app/Http/Controllers/CampaignController.php
 * kalau campaign udah ON ada  key "nama campaign"
 * isinya "started: 1", "screen_pop_url: http://..."
 */
const pg_1      = require("pg");
const redis_1   = require("redis");
const util_1    = require("util");
const moment_1  = require("moment");

const db = new pg_1.Pool({
    user: 'obelisk',
    host: '192.168.99.24',
    port: 5432,
    database: 'obelisk',
    password: '0b3l15k'
});
const redisBroadcaster  = redis_1.createClient('6379','192.168.99.24');
const campaignList      = ['TEST1'];


function getCekCampaign(campaign){
    return new Promise((resolve, reject) => {
        if (typeof campaign !== 'string' || campaign === ''){
            reject('Campaign tidak boleh kosong !');
        } else {
            // CEK ada campaign apa kagak
            redisBroadcaster.keys(`${campaign}`, (error, channels) => {
                if (channels.length === 1){
                    reject({
                        success: false,
                        message: `Campaign sudah berjalan`
                    });
                } else {
                    db.query("SELECT name, begin_time, finish_time, screen_pop_url FROM campaign WHERE (SELECT LOCALTIMESTAMP(0))::time BETWEEN begin_time AND finish_time AND name=$1",[campaign])
                    .then((campaignList) => {
                        if (campaignList.rowCount !== 1){
                            reject(
                                {
                                    success: false,
                                    message: `Campaign ${campaign} tidak tersedia...`,
                                    users: 0
                                }
                            );

                            
                        } else {
                            db.query("SELECT DISTINCT(username) AS namauser FROM contact WHERE campaign=$1 GROUP BY username ORDER BY username",[campaign])
                            .then((userList) => {
                                let retrievedDataCampaign = [];
                                const hashMultipleData = util_1.promisify(db.query);
                                for(let rowUser of userList.rows){
                                    retrievedDataCampaign.push(
                                        new Promise((resolve, reject) =>{
                                            hashMultipleData.bind(db)("SELECT customer_id, home_number, office_number, mobile_number, campaign, username, disposition FROM contact WHERE campaign=$1 AND username=$2 AND disposition is null ORDER BY username",[campaign, `${rowUser.namauser}`])
                                            .then((values) => {
                                                //console.log(`Data ${rowUser.namauser} ada ${values.rowCount}`);
                                                if (values.rowCount > 0){
                                                    let tmpDataQueue = [];
                                                    for (let rowsData of values.rows){
                                                        //console.log(`DATA-> ${rowsData.username}|${rowsData.customer_id}|${rowsData.home_number}|${rowsData.office_number}|${rowsData.mobile_number}`);
                                                        tmpDataQueue.push(`${rowsData.customer_id}|${rowsData.home_number}|${rowsData.office_number}|${rowsData.mobile_number}`);
                                                    }
                                                    resolve({
                                                        username: `${rowUser.namauser}`,
                                                        campaign: `${campaign}`,
                                                        finishTime: `${campaignList.rows[0].finish_time}`,
                                                        data: tmpDataQueue
                                                    });
                                                } else {
                                                    reject(`Data kosong`);
                                                }
                                            })
                                        })
                                    )
                                }
                                Promise.all(retrievedDataCampaign)
                                .then((dataCampaign) => {
                                    // EKSEKUSINYA DISINI BRO
                                    //console.log(`Data: `, dataCampaign);
                                    //let tmpTimeEnd = Date.parse(`${campaignList.rows[0].finish_time}`);
                                    //let tmpTimeEnd = new Date().toLocaleString("id-ID",{ timeZone: 'Asia/Jakarta'}).toTimeString();
                                    //let tmpTimeEnd = parseInt((new Date(`${campaignList.rows[0].finish_time}`).getTime() / 1000).toFixed(0))
                                    let tmpDateNow = moment_1().format('YYYY-MM-DD');
                                    let tmpTimeEnd = moment_1(`${tmpDateNow} ${campaignList.rows[0].finish_time}`,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
                                    //let tmpTimeEnd = moment_1(`${tmpDateNow} ${campaignList.rows[0].finish_time}`,'YYYY-MM-DD HH:mm:ss');
                                    //let tmpTimeEnd = moment_1(`${campaignList.rows[0].finish_time}`,'HH:mm:ss').format('HH:mm:ss');
                                    let nooo        = moment_1(`${tmpTimeEnd}`).unix();

                                    let tmpTimestamp        = new Date(nooo).toISOString();
                                    //let tmpTimestamp        = new Date(nooo).toLocaleString("id-ID",{ timeZone: 'Asia/Jakarta'});
                                    let redirectTimestamp   =  moment_1(`${tmpTimestamp}`,"YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');
                                    
    
                                    console.log(`Time: [${tmpDateNow}][${campaignList.rows[0].finish_time}]:[${tmpTimeEnd}][${nooo}][${tmpTimestamp}][${redirectTimestamp}]`);
                                    //console.log(`Time: [${tmpDateNow}][${campaignList.rows[0].finish_time}]:[${tmpTimeEnd}][${nooo}]`);
                                    console.log(`1-> Campaign hset(${campaign}, 'screen_pop_url', ${campaignList.rows[0].screen_pop_url})`);
                                    //console.log(`2-> Campaign Data[${dataCampaign.length}] lengkap dengan expired nya`, dataCampaign);
                                    console.log(`3-> Publish Data User START_CAMPAIGN|nama user`);
                                    console.log(`4-> Campaign hset(${campaign}, 'started', TRUE)`);
                                    console.log(`5-> Campaign expireat(${campaign}, ${campaignList.rows[0].finish_time}`);
                                    resolve({
                                        success: true,
                                        message: `Campaign ${campaign} sukses di jalankan`,
                                        users: dataCampaign.length,
                                    });

                                    
                                }).catch((error) => {
                                    console.error(`Data: `, error);
                                });
                            }).catch((error) => console.error(error));
                        }
                    }).catch((error) => console.error(error));
                }
            });
        }
    });
}


let tmpNamaCampaign = 'TEST3';
/*
let tmpExecuteCampaign = Promise.resolve(getCekCampaign(tmpNamaCampaign));
tmpExecuteCampaign.then((value) => {

    console.log(`Hasil eksekusi fungsi [${tmpNamaCampaign}]: ${value}, ${value.length}`);
});
*/
getCekCampaign(tmpNamaCampaign)
.then((message) => {
    console.log(`Hasil eksekusi resolve [${tmpNamaCampaign}][${message.users}]:`, message);
}).catch((message) => {
    console.log(`Hasil eksekusi reject  [${tmpNamaCampaign}][${message.users}]:`,message);
});
