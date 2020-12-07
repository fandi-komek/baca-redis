//const moment_1  = require("moment");
//const timeToEnd = '22:00:00';
const { resolve } = require("path");
const redis_1   = require("redis");
const util_1    = require("util");
/*
let tmpTime_001 = moment_1(`${moment_1().format('YYYY-MM-DD')} ${timeToEnd}`,'YYYY-MM-DD HH:mm:ss');

let tmpTime_0002= new Date(tmpTime_001).toLocaleString("id-ID",{ timeZone: 'Asia/Jakarta'});
let tmpTime_0003= moment_1(`${tmpTime_0002}`,"MM/DD/YYYY hh:mm:ss a").format('YYYY-MM-DD HH:mm:ss');
let tmpTime_0004= parseInt((new Date(`${tmpTime_001}`).getTime() / 1000).toFixed(0));
let tmpTime_0005=moment_1(`${timeToEnd}`,'HH:mm:ss').unix();
let tmpTime_0006= parseInt((new Date(`${timeToEnd}`).getTime() / 1000).toFixed(0));

console.info(`Time to end  :[${timeToEnd}]`);
console.info(`Time to end 1:[${tmpTime_001}]`);
console.info(`Time to end 2:[${tmpTime_0002}]`);
console.info(`Time to end 3:[${tmpTime_0003}]`);
console.info(`Time to end 4:[${tmpTime_0004}][${tmpTime_0005}][${tmpTime_0006}]`);
*/
/*
let tmpTime_001 = moment_1().format('YYYY-MM-DD HH:mm:ss');

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return (datum/1000).toFixed(0);
   }
function numberToTimestamp(number) {
    //let tmpTimestamp = 
    //let tmpTimestamp = new Date(number).toLocaleString("id-ID", { timeZone: 'Asia/Jakarta' });
    //return moment_1(`${tmpTimestamp}`, "MM/DD/YYYY hh:mm:ss a").format('YYYY-MM-DD HH:mm:ss');
    let tmpTimestamp = new Date(number * 1000);
    //return moment_1(`${tmpTimestamp}`, "MM/DD/YYYY hh:mm:ss a").format('YYYY-MM-DD HH:mm:ss');
    //console.log(`TEST`,moment_1(`${tmpTimestamp}`, "llll").format('YYYY-MM-DD HH:mm:ss'));
    //return tmpTimestamp;
    return moment_1(`${tmpTimestamp}`, "lllll").format('YYYY-MM-DD HH:mm:ss');
}
let tmpTime_002 = moment_1(`${moment_1().format('YYYY-MM-DD')} ${timeToEnd}`).format('YYYY-MM-DD HH:mm:ss');

function numberSecondToInterval(secondNumber){
    var hours   = Math.floor(secondNumber / 3600),
            minutes = Math.floor((secondNumber - hours * 3600) / 60),
            seconds = secondNumber - hours * 3600 - minutes * 60;
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
}


console.info(`Current Time:[${tmpTime_001}][${(Date.now()/1000).toFixed(0)}]`);
console.info(`Current Time:[${tmpTime_001}][${toTimestamp(tmpTime_001)}][${numberToTimestamp(toTimestamp(tmpTime_001))}]`);
console.info(`End Time    :[${tmpTime_002}][${toTimestamp(tmpTime_002)}]`);

console.info('');
console.info(`TEST        :[${numberSecondToInterval(2974)}]`);
*/

const redisBroadcaster  = redis_1.createClient('6379','192.168.99.24');
/*
var testLuarValue       = 0;
let tmpNamaCampaign     = 'TEST2';

console.log(`Hasil sebelom diluar [${testLuarValue}]`);

let tmpFungsi           = (campaign) => {
    return new Promise((resolve, reject) => {
        if (campaign === '' || campaign === null){
            reject('Campaign gak boleh kosong')
        } else {
            let retreivedData;
            retreivedData = new Promise((resolve, reject) => {
                redisBroadcaster.ttl(`${campaign}`, (error, reply) => {
                    if(error){
                        reject(error)
                    } 
                    resolve(reply);
                })
            });
            Promise.resolve(retreivedData)
            .then((values) => {
                resolve(values);
            })
        }
    });
}
*/
/*
let tmpCekTTL           = Promise.resolve(
    redisBroadcaster.ttl(`${tmpNamaCampaign}`,(err,reply) =>{
        return(reply);
    })
)
*/
/*
tmpFungsi(`${tmpNamaCampaign}`)
.then((values) => {
    console.log(`CARA 1 [${values}]`);
});
let tmpCaraKedua = Promise.resolve(tmpFungsi(`${tmpNamaCampaign}`));
    tmpCaraKedua.then((nilai2) => {
        testLuarValue = nilai2;
        console.log(`CARA 1 [${nilai2}]`);
    });
*/
let testValue = ['TEST1-1','TEST2-1', 'TEST3-1'];
let tmpTestName = 'KPM0003';

let testMulti = [
    {
        name: 'KPM0001-1',
        data: testValue,
    },
    {
        name: 'KPM0002-1',
        data: testValue,
    },
    {
        name: 'KPM0003-1',
        data: testValue,
    }
]


/*
for (let i of testValue){
        redisBroadcaster.publish(tmpTestName, i, (err, reply) => {
            if (err){
                console.error(`Error bang ${err}`);
            }
            console.info(`Reply : ${i}|${reply}`);
        });
}
*/
/*
let tmpTestMulti = (name, data) =>{
    return new Promise((resolve, reject) => {
        if (data.length > 0){
            redisBroadcaster.lpush(name, data, (reply) => {
                resolve(`OK BANG ${name} ${reply}`) 
            }); 
        } else {
            reject('Sempak');
        }
    })
} 
for (let i of testMulti){
    
    tmpTestMulti(i.name, i.data)
    .then((values) => {
        console.log('Hasil:', values);
    }).catch((message) => {
        console.error('Error:',message);
    })
}
*/
var redisMulti =  redisBroadcaster.multi();
testMulti.forEach((dataClient) => {
    var testKey = dataClient.name;
    redisMulti.lpush(testKey, dataClient.data);
});
redisMulti.exec((err, result) => {
    if (err){
        console.error(err);
    }
    console.log(result);
})
//redisBroadcaster.publish(`${tmpTestName}`,'INI expire');
//redisBroadcaster.publish(`${tmpTestName}`, 'INI start campaign');
//console.log(`Hasil setelah diluar [${testLuarValue}]`);


