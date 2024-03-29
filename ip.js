#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import Table from 'cli-tableau';
import axios from 'axios';
import dotenv from 'dotenv';

const envPath = path.dirname(fs.realpathSync(process.argv[1])) + '/.env';
dotenv.config({ path: envPath });

var table = new Table({
    head: ['IP', 'City', 'Region', 'Country', 'Timezone', 'Hostname', 'Org'],
    borders: false,
});

async function getIpInfo(ip) {
    // TODO: Use batch ip https://ipinfo.io/developers/batch
    try {
        const response = await axios.get(`https://ipinfo.io/${ip}?token=${process.env.TOKEN}`);
        return response.data;
    } catch (err) {
        return { ip, message: err.message };
    }
}

async function run(args) {
    const results = await Promise.all(args.map(ip => getIpInfo(ip)));
    results.forEach(res => {
        if (res && res.city) {
            // console.log(res.ip, JSON.stringify(res, null, 2));
            table.push([res.ip, res.city, res.region, res.country, res.timezone, res.hostname, res.org]);
        } else {
            table.push([res.ip, res.message]);
        }
    });

    if (table.length > 0) {
        console.log(table.toString());
    }
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Please specify one or IP address as arguments');
    process.exit(1);
}

if (!process.env.TOKEN) {
    console.log('No token specified. API calls will fail so quitting now');
    process.exit(1);
}

run(args);
