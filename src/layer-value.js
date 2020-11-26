/**
 * Coba ngakalin ini :
 * https://bitbucket.org/dnnit/obelisk-admin/src/master/app/Http/Controllers/CampaignController.php
 * kalau campaign udah ON ada  key "nama campaign"
 * isinya "started: 1", "screen_pop_url: http://..."
 */
const pg_1      = require("pg");
const redis_1   = require("redis");

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
            db.query("SELECT name, begin_time, finish_time, screen_pop_url FROM campaign WHERE (SELECT LOCALTIMESTAMP(0))::time BETWEEN begin_time AND finish_time AND name=$1",[campaign])
            .then((cekCampaign) => {
                if (cekCampaign.rowCount === 0){
                    reject('Tidak ada campaign yang tersedia !');
                } else {
                    db.query("SELECT DISTINCT(username) as namauser FROM contact WHERE campaign=$1",[campaign])
                    .then((cekRedisCampaign) => {
                        if (cekRedisCampaign.rowCount > 0){
                            for (let rowCekRedis of cekRedisCampaign.rows){
                                let tmpCekKeyRedis = `${rowCekRedis.namauser}|${campaign}`;
                                let tmpHasilCekRedis;
                                tmpHasilCekRedis = new Promise((resolve, reject) => {
                                    redisBroadcaster.keys(`${tmpCekKeyRedis}`,(error, channels) => {                                        
                                        resolve(channels.length);
                                    });
                                });
                                Promise.resolve(tmpHasilCekRedis)
                                .then((values) => {
                                    if (values === 0){
                                        console.info(`User ${rowCekRedis.namauser} BELOM jalan Redis Campaign nya`);
                                        // -----------
                                        // EKSEKUSI HAPUS LLIST
                                        // -----------
                                        redisBroadcaster.del(`${tmpCekKeyRedis}`);
                                        redisBroadcaster.publish(`${rowCekRedis.namauser}`,`STOP_CAMPAIGN|${campaign}`);
                                        // -----------
                                        // JIKA USER BLOM DI CONFIRM CAMPAIGN UDAH JALAN APA BLOM
                                        db.query("SELECT customer_id, home_number, office_number, mobile_number, campaign, username, disposition FROM contact WHERE campaign=$1 AND username=$2 AND disposition is null",[campaign, rowCekRedis.namauser])
                                        .then((cekDataCampaign) => {
                                            if (cekDataCampaign.rowCount > 0){
                                                // CEK CAMPAIGN UDAH DI JALANIN APA BELOM:
                                                for (let row of cekDataCampaign.rows){
                                                    console.log(`[Campaign ${campaign}]: 
                                                        username      : ${row.username},
                                                        campaign      : ${row.campaign},
                                                        disposition   : ${row.disposition},
                                                        customer_id   : ${row.customer_id},
                                                        home_number   : ${row.home_number},
                                                        office_number : ${row.office_number},
                                                        mobile_number : ${row.mobile_number}`);
                                                    }
                                                // -----------
                                                // EKSEKUSI LPUSH
                                                // -----------
                                                
                                                // -----------
                                                resolve(`Data campaign sebanyak ${cekDataCampaign.rowCount}`);
                                            } else {
                                                console.info(`Gak ada data di campaign ${campaign} Cuk !`);
                                                console.info(`"SELECT customer_id, home_number, office_number, mobile_number, campaign, username, disposition FROM contact WHERE campaign='${campaign}' AND username='${rowCekRedis.namauser}' AND disposition=null"`)
                                            }
                                        })
                                        .catch((err) => console.error(err));
                                        // -----------
                                        // EKSEKUSI REDIS EXPIREAT(KEY, FINISHTIME)
                                        // -----------

                                        // -----------
                                        // EKSEKUSI REDIS PUBLISH(USERNAME, 'START_CAMPAIGN|NAMA USER')
                                        // -----------

                                    } else{
                                        console.info(`User ${rowCekRedis.namauser} SUDAH jalan Redis Campaign nya`);
                                    }
                                }).catch((err) => {
                                    console.error(err)
                                });
                                
                            }
                        }else{
                            reject(`Tidak ada user di campaign ${campaign} !`);
                        }
                    }).catch((err) => console.error(err));
                }
            })
            .catch((err) => console.error(err));
        }
    });
}


let tmpNamaCampaign = 'TEST1';
let tmpExecuteCampaign = Promise.resolve(getCekCampaign(tmpNamaCampaign));
tmpExecuteCampaign.then((value) => {
    console.log(`Hasil eksekusi fungsi: ${value}`);
});
