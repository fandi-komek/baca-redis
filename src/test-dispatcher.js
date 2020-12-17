
class CampaignWaktu {
    constructor() {
        this.campaignList   = [];
    }

    AddNew(namaCampaign, waktu){
        let data            = { namaCampaign, waktu};
        this.campaignList.push(data);
        return data;
    }
    RemoveData(namaCampaign) {
        this.campaignList   = this.campaignList.filter((data) => data.namaCampaign !== namaCampaign)
    }
    getDataByWaktu(waktu) {
        return this.campaignList.filter((data) => data.waktu === waktu);
    }
}

var currCampaignList = [
                        {
                            nama: 'TEST1',
                            waktu: "17:17"
                        },
                        {
                            nama: 'TEST2',
                            waktu: "17:20"
                        },
                        {
                            nama: 'TEST3',
                            waktu: "17:25"
                        },
                        {
                            nama: 'TEST4',
                            waktu: "17:30"
                        },
                        {
                            nama: 'TEST5',
                            waktu: "17:35"
                        },
                        {
                            nama: 'TEST6',
                            waktu: "17:40"
                        },
                        {
                            nama: 'TEST7',
                            waktu: "17:45"
                        },
                        {
                            nama: 'TEST8',
                            waktu: "17:50"
                        },
                        {
                            nama: 'TEST9',
                            waktu: "17:55"
                        }
                    ];


 

function getCheckCampaign (waktu) {
    return new Promise((resolve, reject) => {
        if (waktu.toString().trim() === '' || waktu === null){
            reject('Waktu tidak boleh kosong')
        } 
        let tmpCurrWaktu    = waktu.toString().trim();
        resolve(tmpCurrWaktu);
    });
}

let thisCampaignList    = new CampaignWaktu();

for (let xList = 0; xList < currCampaignList.length; xList++){
    thisCampaignList.AddNew(currCampaignList[xList].nama, currCampaignList[xList].waktu);
}

setInterval(()=>{
    let tmpNewDate      = new Date();
    let tmpCurrHour     = tmpNewDate.getHours();
    if (tmpCurrHour < 10){
        tmpCurrHour     = '0' + tmpNewDate.getHours();
    }
    let tmpCurrMinutes  = tmpNewDate.getMinutes();

    console.log('Type Menit = ', typeof tmpCurrMinutes);
    if (tmpCurrMinutes < 10){
        tmpCurrMinutes  = '0' + tmpNewDate.getMinutes();
    }
    let tmpCurrSeconds  = tmpNewDate.getSeconds();
    if (tmpCurrSeconds < 10){
        tmpCurrSeconds  = '0' + tmpNewDate.getSeconds();
    }
    getCheckCampaign(`${tmpCurrHour}:${tmpCurrMinutes}:${tmpCurrSeconds}`)
    .then((response) => {
        let responseWaktu       = response.toString().substring(0,5);
        let responseCampaign    = thisCampaignList.getDataByWaktu(responseWaktu); 
        let namaCampaignProses  = "";
        if (responseCampaign.length > 0){
            namaCampaignProses  = responseCampaign[0].namaCampaign;
        }
        console.log(`Waktu sekarang [${responseWaktu}][${namaCampaignProses}]: ${response}`,responseCampaign);
    }).catch((error) => {
        console.error(`Error: ${error}`)
    })
},1000);




