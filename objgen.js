//! objgen.js
//! version : 4.0
//! authors : Jim Winfield, objgen.js contributors
//! license : AGPL-3.0
//! objgen.com

var ObjGen = function() {};

(function() {
  'use strict';

  // string stuff
  if(typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function(s) {
      return this.substring(0, s.length) === s;
    };
  }

  if(typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(s) {
      return this.substring(this.length - s.length, this.length) === s;
    };
  }

  /**
   * Check if the specified variable is defined
   */
  function isDefined(variable) {
    return typeof(variable) !== 'undefined' && variable !== null;
  }

  /**
   * Check if the specified variable is defined and has a value
   */
  function hasContent(variable) {
    return isDefined(variable) && variable.length > 0;
  }

  /**
   * Creates a cookie
   *
   * @param name The cookie name
   * @param value The value to set for the cookie
   * @param days The number of days to expire the cookie in
   */
  ObjGen.createCookie = function createCookie(name, value, days) {
    var expires = '';
    if(days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toGMTString();
    }

    document.cookie = name + '=' + value + expires + '; path=/';
  };

  /**
  * Reads a cookie value given the cookie name
  *
  * @param name The name of the cookie to read
  * @param defaultVal The default value to return if the cookie is not found
  *
  * @returns The cookie value is returned
  */
  ObjGen.readCookie = function (name, defaultVal) {
    var val = null;
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if(c.indexOf(nameEQ) === 0) {
        val = c.substring(nameEQ.length, c.length);
      }
    }
    return val !== null ? val : defaultVal;
  };

  /**
   * Deletes a cookie
   *
   * @param name The name of the cookie to delete
   */
  ObjGen.eraseCookie = function(name) {
    createCookie(name, '', -1);
  };

  ObjGen.rawLineRegx = new RegExp('^.*$|\n|$', 'g');
  ObjGen.newLineRegx = new RegExp('\n');
  ObjGen.spacesRegx = new RegExp('\\s');
  ObjGen.arrayRegx = new RegExp('\\[\\s*\\]|\\[\\s*([0-9]{1,100})\\s*\\]');
  ObjGen.typesRegx = new RegExp('^(\\w+)(\\s+)(\\w+).*?$');

  ObjGen.parseLines = function(val, options, callback) {
    if(callback === null) {
      return;
    }

    var curOffset = 0;
    var lastOffset = 0;
    var currentLevel = 1;
    var lines = 0;

    // parse the raw inbound lines, to find individual input lines
    val.replace(ObjGen.rawLineRegx, function(p1, curOffset) {
      if(curOffset > lastOffset) {
        // get the current "raw" line
        var raw = val.substring(lastOffset, curOffset).replace(ObjGen.newLineRegx, '');

        if(lines > 0) {
          // glean current level from leading whitespace (tabs or spaces)
          var spaces = 0;
          var level = 1;

          for(var i = 0; i < raw.length; i++) {
            var c = raw.charAt(i);
            if(c === '\t') {
              level++;
              spaces = 0;
            } else if (c === ' ') {
              spaces++;
            } else {
              break;
            }

            if(spaces === options.numSpaces) {
              level++;
              spaces = 0;
            }
          }
          currentLevel = level;
        } else {
          currentLevel = 1;
        }

        // count and process lines with real values
        var lineText = raw.replace(ObjGen.spacesRegx, '');
        lineText = lineText.replace(/\[|]/g, '');
        if(lineText.length > 0) {
          lines++;
        }

        if(lineText.length > 0) {
          callback(raw.trim(), currentLevel);
        }

        // update progress parsing the inbound value
        lastOffset = curOffset;
      }
    });
  };

  ObjGen.newValueOfType = function(dataType, initialVal) {
    if(initialVal === null) {
      initialVal = {};
    }

    var val = initialVal;
    var t = dataType.charAt(0);

    if(t === 's') {
      if(typeof val !== 'string') {
        val = '';
      }
    } else if(t === 'b') {
      val = initialVal === 'true' ? true : false;
    } else if(t === 'd') {
      var dt = new Date();
      if(initialVal.length > 0) {
        dt.setTime(Date.parse(initialVal));
      }
      val = dt;
    } else if(t === 'n') {
      var num;
      if(initialVal.length > 0) {
        num = parseFloat(initialVal);
        if(isNaN(num)) {
          num = parseInt(initialVal);
          if(!isNaN(num)) {
             num = 0;
          }
        }
      } else {
        num = 0;
      }
      val = num;
    } else {
      val = {};
    }

    return val;
  };

  ObjGen.newArrayOfType = function(dataType, initialVal) {
    var a = [];
    if(typeof initialVal === 'string') {
      var vals = initialVal.split(',');
      for(var i in vals) {
        var val = vals[i].trim();
        a[i] = ObjGen.newValueOfType(dataType, val);
      }
    }

    return a;
  };

  ObjGen.isHtmlElement = function(tag) {
    return false;
  };

  ObjGen.Attribute = function(name, value) {
    this.name = name;
    this.value = value;
  };

  ObjGen.DomElement = function(e) {
    this.kind = 'div';
    this.id = '';
    this.clazz = [];
    this.content = '';
    this.elements = [];
    this.attrbutes = [];

    if(e !== null) {
      this.kind = e.kind;
      this.id = e.id;
      this.clazz = e.clazz;
      this.content = e.content;
      this.elements = e.elements;
      this.attrbutes = e.attributes;
    }

    this.toString = function() {
      var s = '';
      if(hasContent(this.kind)) {
        s = this.kind;
      }
      if(hasContent(this.id)) {
        s += '#' + this.id;
      }
      for(var i in this.clazz) {
        s += '.' + this.clazz[i];
      }

      return s;
    };
  };

  ObjGen.xJson = function(val, options) {
    var numSpaces = 2;
    var propStack = [];
    var model = {};
    var genRoot = {};

    if(!isDefined(options) && !isDefined(options.numSpaces)) {
      numSpaces = options.numSpaces;
    }

    // parse the raw inbound lines, to find individual input lines
    ObjGen.parseLines(val, options, function(line, depth) {
      if(line.match('^\s+$/|^\/$|^\/\/|^\s.*\/$|^\s.*\/\/') !== null) {
        return '';
      }

      while(depth != propStack.length) {
        if(depth > propStack.length) {
          propStack.push('');
        } else {
          propStack.pop();
        }
      }

      // Determine the data type being defined at this line level
      var level = depth - 1;
      var typeSearch = ObjGen.typesRegx.exec(line.replace(ObjGen.arrayRegx, ''));
      var type = null;

      if(typeSearch !== null && typeSearch.length >= 4) {
        type = typeSearch[3].toLowerCase();
      }

      var arrayInfo = ObjGen.arrayRegx.exec(line);
      var isArray = arrayInfo !== null ? arrayInfo.length > 0 : false;
      var arrayIndex = -1;

      if(isArray) {
        if(arrayInfo.length > 1) {
          arrayIndex = parseInt(arrayInfo[1]);
        }
        if(isNaN(arrayIndex)) {
          arrayIndex = 0;
        }
      }

      // Determine if there is a value to assign
      var initialVal = null;

      var eqs = line.indexOf('=');
      if(eqs !== -1) {
        initialVal = line.substr(eqs + 1);
        if(initialVal.length > 0) {
          initialVal = initialVal.trim();
          if(type === null) {
            type = 's';
          }
        }
        line = line.substr(0, eqs);
      } else {
        // Create a default initial value
        if(isArray) {
          if(arrayIndex > 0) {
            initialVal = {};
          } else {
            initialVal = [];
          }
        } else {
          initialVal = {};
        }
      }

      // Find the JSON property the line is defining
      var prop = line;

      if(type !== null) {
        if(isArray) {
          initialVal = ObjGen.newArrayOfType(type, initialVal);
        } else {
          initialVal = ObjGen.newValueOfType(type, initialVal);
        }

        // remove type info from model line
        var propNameRegx = new RegExp('(^[^\\s]+)');
        var rx = propNameRegx.exec(prop);
        if(rx !== null) {
          prop = propNameRegx.exec(prop)[0];
        }
      }

      // clean up prop name
      prop = prop.replace(ObjGen.spacesRegx, '');
      prop = prop.replace(ObjGen.arrayRegx, '');
      prop = prop.replace(/\[.*|]/g, '');
      propStack[level] = prop;

      // derive prop type key
      var propKey = '';
      for(var k = 0; k < propStack.length; k++) {
        if(k > 0) {
          propKey += '.';
        }
        propKey += propStack[k];
      }

      if(arrayIndex > -1) {
        var idx = ':' + arrayIndex;
        propKey += idx;
        propStack[level] += idx;
      }

      // represent model information
      if(!isDefined(model[propKey])) {
        var parentKey = propKey.substring(0, propKey.lastIndexOf('.'));
        model[propKey] = {
            name: prop,
            type: type,
            array: isArray,
            index: arrayIndex > -1 ? arrayIndex : null,
            modelParent: parentKey.length > 0 ? model[parentKey] : null,
            genParent: genRoot,
            val: initialVal
        };
      }

      // Add the current value into the generated object
      var curProp = model[propKey];
      var modelParent = curProp.modelParent;
      if(modelParent !== null) {
        if(modelParent.array) {
          curProp.genParent = modelParent.genParent[modelParent.name];
          if(!isDefined(curProp.genParent)) {
            curProp.genParent = [];
          }
          if(curProp.genParent.length < modelParent.index + 1) {
            curProp.genParent[modelParent.index] = {};
          }
          curProp.genParent = curProp.genParent[modelParent.index];
        } else {
          curProp.genParent = modelParent.genParent[modelParent.name];
        }
      }

      if(curProp.array && arrayIndex > 0) {
        if(!isDefined(curProp.genParent[prop])) {
          curProp.genParent[prop] = [];
          curProp.genParent[prop][0] = curProp.val;
        } else {
          curProp.genParent[prop][arrayIndex] = curProp.val;
        }
      } else {
        curProp.genParent[prop] = curProp.val;
      }

    });

    return JSON.stringify(genRoot, undefined, numSpaces);
  };

  if(typeof module !== 'undefined' && module.exports) {
    module.exports.ObjGen = ObjGen;
  }

})();
