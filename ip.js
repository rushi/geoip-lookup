#!/usr/bin/env node

const argv = require('yargs').argv;
const geoip = require('geoip-lite');
const Table = require('cli-tableau');

if (!argv._[0]) {
    return console.error('Need one more IP address on the CLI');
}

var table = new Table({
    head: ['IP', 'City', 'Region', 'Country', 'Timezone'],
    borders: false
});

argv._.forEach(ip => {
    const geo = geoip.lookup(ip);
    if (geo) {
        argv.v && console.log(geoip.pretty(ip), JSON.stringify(geo));
        table.push([geoip.pretty(ip), geo.city, geo.region, geo.country, geo.timezone]);
    } else {
        table.push([ip, 'Invalid IP']);
    }
});

console.log(table.toString());
