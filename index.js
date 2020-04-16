#!/usr/bin/env node
var {saveAccount, switchAccount, showAccountList} = require('./bin');

let argv = require('yargs')
  .option('m', {
    alias: 'mode',
    describe: '要切换的模式',
    type: 'string'
  })
  .option('l', {
    alias: 'list',
    describe: '显示所有模式'
  })
  .option('s', {
    alias: 'save',
    describe: '保存当前账户',
    type: 'array'
  })
  .argv;
  
if (argv.s && argv.s.length === 3) {
  saveAccount(argv.s)
  return
}
if (argv.m) {
  switchAccount(argv.m)
  return
}
if (argv.l) {
  showAccountList()
  return
}

