const asterisk_manager_interface_1 = require("asterisk-manager-interface");
const redis_1   = require("redis");

const asterisk = new asterisk_manager_interface_1.AsteriskManagerInterface();
const redis     = redis_1.createClient('6379','192.168.99.24');
const WebSocket = require("ws");


asterisk.connect(5038, '192.168.99.24', () => {
    asterisk.login({ Username: 'obelisk', Secret: '0b3l15k' }, (response, headers) => {
        asterisk.sendAction("Events", { EventMask: "call,system,agent,cdr" }, (response, headers) => console.log(headers));
  
        console.log(response);
        console.log(headers);
      }
    );
  });

  asterisk.on("close", () => {
      redis.quit();
  })

  asterisk.on(asterisk_manager_interface_1.Events.FullyBooted, (headers) => {
    if (headers.Status == "Fully Booted") {
      asterisk.sendAction("SIPpeers", {});
    }
  });

  asterisk.on("ExtensionStatus", (headers) => {
      console.info('ExtensionStatus', headers);
  })

  asterisk.on("PeerEntry", (headers) => {
    if (headers.Dynamic == "no") return;
  
    let extension = `${headers.Channeltype}/${headers.ObjectName}`;
  
    if (headers.IPaddress != "-none-") {
        //insertSipPeer(extension, headers.IPaddress);
        console.log(`AddNew Extension: ${extension}|${headers.IPaddress}`, headers);
    } else {
        //removeSipPeer(extension);
        console.log(`Remove Extension: ${extension}`, headers);
    }
  });