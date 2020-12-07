
const moment_1  = require("moment");


let tmpWaktuServer      = Math.floor(Date.now() /1000);
let tmpWaktuBeneran     = new Date(tmpWaktuServer * 1000);
    

console.log(`1- Waktu server sekarang [${tmpWaktuServer}]`);
console.log(`2- Waktu server sekarang [${tmpWaktuBeneran.toLocaleDateString("id-ID")}][${tmpWaktuBeneran.toLocaleTimeString("id-ID")}]`);