#!/usr/bin/env node

//! objgen.js
//! version : 4.0.0
//! authors : Jim Winfield, objgen.js contributors
//! license : AGPL-3.0
//! objgen.com

'use strict';

global.jQuery = require('jquery');

var ObjGen = require('./objgen.js').ObjGen;
var cli = require('commander');
var fs = require('fs');

cli
  .version('4.0.0')
  .option('-d, --demo', 'Run the demo')
  .option('-f, --file <path>', 'Input model filename to generate')
  .parse(process.argv);

var jsonOpts = {
  numSpaces: 2
};

var genFile = function(filename, showModel) {
  fs.readFile(filename, function(err, data) {
    if(err) {
      console.error(err);
      return;
    }

    genModel(data.toString(), showModel);
  });
};

var genModel = function(model, showModel) {
  if(showModel === true) {
    console.log('Input model:\n\n' + model + '\n');
    console.log('Generated JSON:\n');
  }

  console.log(ObjGen.xJson(model, jsonOpts));
};

var demoModel = "// Model & generate Live JSON data values\n" +
  "// interactively using a simple syntax.\n" +
  "// String is the default value type\n" +
  "product = ObjGen Live JSON generator\n" +
  "\n" +
  "// Number, Date & Boolean are also supported\n" +
  "// Specify types after property names\n" +
  "version n = 4.0\n" +
  "releaseDate d = 2017-02-10\n" +
  "demo b = true\n" +
  "\n" +
  "// Tabs or spaces define complex values\n" +
  "person\n" +
  "  id number = 12345\n" +
  "  name = John Doe\n" +
  "  phones\n" +
  "    home = 800-123-4567\n" +
  "    mobile = 877-123-1234\n" +
  "\n" +
  "  // Use [] to define simple type arrays\n" +
  "  email[] s = jd@example.com, jd@example.org\n" +
  "  dateOfBirth d = 1990-01-02\n" +
  "  registered b = true\n" +
  "\n" +
  "  // Use [n] to define object arrays\n" +
  "  emergencyContacts[0]\n" +
  "    name s = Jane Doe\n" +
  "    phone s = 888-555-1212\n" +
  "    relationship = spouse\n" +
  "  emergencyContacts[1]\n" +
  "    name s = Justin Doe\n" +
  "    phone s = 877-123-1212\n" +
  "    relationship = parent\n" +
  "\n" +
  "// See http://objgen.com for additional info\n" +
  "// We hope you enjoy the tool!\n";

if(cli.file) {
  genFile(cli.file);
} else if(cli.demo) {
  genModel(demoModel, true);
}
