// Dependencies: node-hid, mac-vhid
var hid = require ('node-hid');
//var devices = hid.devices ();
var EE = require ('events').EventEmitter;
var app = new EE ();

var cur = [ 128, 128, 0, 128, 128, 15, 0, 0 ];

var areaNames = [
  'analogLeftX',
  'analogLeftY',
  'analogRightX',
  'analogRightY',
  'dpad',
  'buttons'
];

function translate (i, val) {
  var res = {name: areaNames[i], value: val}
  switch (i) {
    case 0:
    case 1:
    case 2:
    case 3:
      if (res.value < 128) {
        res.value = (-128 + res.value) /8;
      } else if (res.value > 128) {
        res.value = (res.value - 128 +1) /8;
      } else {
        res.value = 0;
      }
      res.value = parseInt (res.value);
//      console.log (res.value);
      break;
    case 5:
      res.name = 'dpad';
      switch (val) {
        case 15: res.value = 0; break;
        case 0: res.value = 'up'; break;
        case 2: res.value = 'right'; break;
        case 4: res.value = 'down'; break;
        case 6: res.value = 'left'; break;
        case 31: res.value = '1'; break;
        case 47: res.value = '2'; break;
        case 79: res.value = '3'; break;
        case 143: res.value = '4'; break;
        case 63: res.value = '12'; break;
        case 95: res.value = '13'; break;
        case 159: res.value = '14'; break;
        case 111: res.value = '23'; break;
        case 175: res.value = '24'; break;
        case 207: res.value = '34'; break;
        case 127: res.value = '123'; break;
        case 239: res.value = '234'; break;
        case 223: res.value = '134'; break;
        case 191: res.value = '124'; break;
        case 255: res.value = '1234'; break;
      }
      break;
    case 6:
      res.name = 'buttons';
      switch (val) {
        case 1: res.value = 'L1'; break;
        case 4: res.value = 'L2'; break;
        case 2: res.value = 'R1'; break;
        case 8: res.value = 'R2'; break;
        case 5: res.value = 'L12'; break;
        case 10: res.value = 'R12'; break;
        case 3: res.value = 'L1R1'; break;
        case 12: res.value = 'L2R2'; break;
        case 9: res.value = 'L1R2'; break;
        case 6: res.value = 'L2R1'; break;
        case 7: res.value = 'L12R1'; break;
        case 13: res.value = 'L12R2'; break;
        case 11: res.value = 'L1R12'; break;
        case 14: res.value = 'L2R12'; break;
        case 15: res.value = 'L12R12'; break;
        case 16: res.value = 'select'; break;
        case 32: res.value = 'start'; break;
        case 17: res.value = 'selectL1'; break;
        case 20: res.value = 'selectL2'; break;
        case 18: res.value = 'selectR1'; break;
        case 24: res.value = 'selectR2'; break;
        case 21: res.value = 'selectL12'; break;
        case 26: res.value = 'selectR12'; break;
        case 23: res.value = 'selectL12R1'; break;
        case 29: res.value = 'selectL12R2'; break;
        case 19: res.value = 'selectL1R1'; break;
        case 28: res.value = 'selectL2R2'; break;
        case 27: res.value = 'selectL1R12'; break;
        case 30: res.value = 'selectL2R12'; break;
        case 31: res.value = 'selectL12R12'; break;
        case 33: res.value = 'startL1'; break;
        case 36: res.value = 'startL2'; break;
        case 34: res.value = 'startR1'; break;
        case 40: res.value = 'startR2'; break;
        case 37: res.value = 'startL12'; break;
        case 42: res.value = 'startR12'; break;
        case 39: res.value = 'startL12R1'; break;
        case 45: res.value = 'startL12R2'; break;
        case 35: res.value = 'startL1R1'; break;
        case 44: res.value = 'startL2R2'; break;
        case 43: res.value = 'startL1R12'; break;
        case 46: res.value = 'startL2R12'; break;
        case 47: res.value = 'startL12R12'; break;
        case 48: res.value = 'selectstart'; break;
        case 64: res.value = 'analogLeft'; break;
        case 128: res.value = 'analogRight'; break;
        case 80: res.value = 'selectAnalogLeft'; break;
        case 144: res.value = 'selectAnalogRight'; break;
        case 192: res.value = 'analogLeftRight'; break;
        case 255: res.value = 'all'; break;
      }
  }
  return res;
}

function loadHID (path) {
  var device = new hid.HID (path);
  device.on ('error', function (err) {
    app.emit ('error', err);
  });
  device.on ('data', function (data) {
    data = data.toString ('hex').match (/../g) || [];
    data = data.map (function (el, i) {
      el = parseInt ('0x'+ el);
//      if (cur[i] != el) {
        var key = translate (i, el);
        app.emit (key.name, key.value);
        app.emit ('action', key);
//      }
      cur[i] = el;
      return el;
    });
    app.emit ('data', data);
  });
  return app;
}

var ok = loadHID ('USB_0079_0006_14100000');
var hid = require ('mac-vhid');

ok.on ('analogLeftX', function (val) {
  hid.mouseMoveDelta (val, 0);
});

ok.on ('analogLeftY', function (val) {
  hid.mouseMoveDelta (0, val);
});
