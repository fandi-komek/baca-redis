/*
const icmp = require('icmp');
const readline = require('readline');

const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
});

rl.question('Host : ', host => {
    setInterval(async () => {
        try {
            console.log('Pinging...');

            const obj = await icmp.ping(host);

            console.log(obj.open, obj.elapsed);
        } catch (e) {
            console.log(host, 'Error');
        }
    }, 1000);
});
*/
/*
const icmp = require('icmp');

icmp.ping('192.168.99.21')
.then((message) => {
    console.log('Hasil:', message.open, message.elapsed);
}).catch((error) => {
    console.error(error);
});
*/
const ICMP = require('../src/module-ping');
ICMP.ping('192.168.99.21')
.then((message) => {
    console.log('Hasil:', message.open, message.elapsed);
}).catch((error) => {
    console.error(error);
});
