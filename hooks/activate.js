#!/usr/bin/env node

const { getInstructions } = require('./instructions');
const { writeContext } = require('./runtime');

writeContext('SessionStart', getInstructions());
