/*
const { exec }  = require("child_process");

exec("ls -lha", (error, stderr, stdout) => {
    if (error){
        console.error(error);
    }
    if(stderr){
        console.error(stderr)
    }
    console.log(stdout);
});
*/

const { spawn } = require("child_process");
const ls = spawn("ls", ["-lha"]);

ls.stderr.on("error", (error) => {
    console.error(error);
});

ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
});