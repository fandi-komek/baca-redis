const moment_1  = require("moment");

const timeToEnd = '22:00:00';

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


