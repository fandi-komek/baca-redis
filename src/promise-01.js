"use strict";
const { resolve } = require("path");
/*
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
*/

const redis_1 = require("redis");
const util_1 = require("util");

const redisBroadcaster  = redis_1.createClient('6379','192.168.99.24');

let namaCampaign        = 'TEST1';
var testValue           = 0;
var getCampaignTTL = function(campaignName) {
    return new Promise((resolve, reject) => {
        if (campaignName == ''){
            reject(`Campaign gak boleh kosong !`);
        }
        redisBroadcaster.ttl(`${campaignName}`, (error, reply) => {
            console.info(`Didalem ${reply}`);
            testValue = reply;
            resolve(reply);
        });
    });
}

getCampaignTTL(`${namaCampaign}`)
.then((values) => {
    console.log(`Ending ${values} | ${testValue}`);
})