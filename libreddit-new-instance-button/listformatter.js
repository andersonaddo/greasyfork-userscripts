#!/usr/bin/env node

//Basic CLI tool to help make the metadata block for the userscript

//Fill this list up with entries from here:
//https://github.com/benbusby/farside/blob/main/services-full.json
const list = [

]

list.forEach(host => {
    console.log(`// @match ${host}/*`)
});