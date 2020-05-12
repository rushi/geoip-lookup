#!/usr/bin/env node -r esm

import { argv } from 'yargs';
import geoip from 'geoip-lite';
import Table from 'cli-tableau';

if (!argv._[0]) {
    console.error('Need atleast one IP address');
    process.exit(1);
}

var table = new Table({
    head: ['IP', 'City', 'Region', 'Country', 'Timezone'],
    borders: false
});

argv._.forEach(ip => {
    const geo = geoip.lookup(ip);
    if (geo) {
        argv.v && console.log(geoip.pretty(ip), JSON.stringify(geo, null, 2))
        table.push([geoip.pretty(ip), geo.city, geo.region, geo.country, geo.timezone]);
    } else {
        table.push([ip, 'Invalid IP']);
    }
});

console.log(table.toString());
