#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'partials', 'theme-updated.hbs');
const stamp = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Europe/Moscow',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
}).format(new Date());

fs.writeFileSync(file, `${stamp} МСК`, 'utf8');
