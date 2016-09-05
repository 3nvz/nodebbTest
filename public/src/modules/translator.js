/* global define, jQuery, config, RELATIVE_PATH, utils, window */

(function (factory) {
  'use strict';
  function loadClient(language, filename) {;
    return Promise.resolve(jQuery.getJSON(config.relative_path + '/language/' + language + '/' + (filename + '.json?v=' + config['cache-buster'])));
  };
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as a named module
    define('translator', ['string'], function (string) {
      return factory(string, loadClient);
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node
    (function () {
      var fs = require('fs');
      var path = require('path');
      var winston = require('winston');
      var plugins = require('../../../src/plugins');
      var meta = require('../../../src/meta');

      function exists(filePath) {
        return new Promise(function (resolve, reject) {
          fs.stat(filePath, function (err, stats) {
            if (err) {
              if (err.code === 'ENOENT') {
                return resolve(false);
              }
              return reject(err);
            }
            return resolve(stats.isFile());
          });
        });
      };

      function readFile(filePath) {
        return new Promise(function (resolve, reject) {
          fs.readFile(filePath, {
            encoding: 'utf-8'
          }, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      };

      function loadServer(language, filename) {
        var filePath = path.join(__dirname, '../../language', language, filename + '.json');
        return exists(filePath).then(function (fileExists) {
          if (!fileExists) {
            if (plugins.customLanguageFallbacks[filename]) {
              return readFile(plugins.customLanguageFallbacks[filename]).catch(function () {
                winston.error('[translator] Could not load fallback language file for "' + filename + '"');
              });
            }
            winston.warn('[translator] Language "' + language + '" ' + 'not found. Defaulting to "en_GB"');
            language = 'en_GB';
          }
          return readFile(filePath);
        }).then(function (data) {
          try {
            var parsed = JSON.parse(data.toString());
            return parsed;
          } catch (e) {
            winston.error('Could not parse "' + filename + '.json", syntax error? Skipping...');
            return {};
          }
        }).catch(function (err) {
          winston.error('[translator] Could not load "' + filename + '": ' + err.message + '. Skipping...');
          return {};
        });
      };

      module.exports = factory(require('string'), loadServer);
    })();
  } else {
    window.translator = factory(window.string, loadClient);
  }
})(function (string, load) {
  'use strict';
  var assign = Object.assign || jQuery.extend;
  function classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Translator = function () {
    function Translator(language) {
      classCallCheck(this, Translator);

      if (!language) {
        throw new TypeError('Parameter `language` must be a language string. Received ' + language + (language === '' ? '(empty string)' : ''));
      }

      this.lang = language;
      this.translations = {};
      this.load = load;
    }

    Translator.prototype.translate = function translate(str) {
      var cursor = 0;
      var lastBreak = 0;
      var len = str.length;
      var toTranslate = [];

      var split = function split(text) {
        var len = text.length;
        var arr = [];
        var i = 0;
        var brk = 0;
        var level = 0;

        while (i + 2 <= len) {
          if (text.slice(i, i + 2) === '[[') {
            level += 1;
            i += 1;
          } else if (text.slice(i, i + 2) === ']]') {
            level -= 1;
            i += 1;
          } else if (level === 0 && text[i] === ',') {
            arr.push(text.slice(brk, i).trim());
            i += 1;
            brk = i;
          }
          i += 1;
        }
        arr.push(text.slice(brk, i + 1).trim());
        return arr;
      };

      while (cursor + 2 <= len) {
        if (str.slice(cursor, cursor + 2) === '[[') {
          toTranslate.push(str.slice(lastBreak, cursor));
          cursor += 2;
          lastBreak = cursor;

          var level = 0;

          while (cursor + 2 <= len) {
            if (str.slice(cursor, cursor + 2) === '[[') {
              level += 1;
              cursor += 1;
            } else if (str.slice(cursor, cursor + 2) === ']]') {
              if (level === 0) {
                var result = split(str.slice(lastBreak, cursor));
                var key = result[0];
                var args = result.slice(1);

                toTranslate.push(this.translateKey(key, args));
                cursor += 2;
                lastBreak = cursor;
                break;
              }
              level -= 1;
              cursor += 1;
            }
            cursor += 1;
          }
        }
        cursor += 1;
      }
      toTranslate.push(str.slice(lastBreak, cursor + 2));

      return Promise.all(toTranslate).then(function (translated) {
        return translated.join('');
      });
    };

    Translator.prototype.translateKey = function translateKey(name, args) {
      var self = this;

      var result = name.split(':', 2);
      var namespace = result[0];
      var key = result[1];

      var translation = this.getTranslation(namespace, key);
      var argsToTranslate = args.map(function (arg) {
        return string(arg).collapseWhitespace().decodeHTMLEntities().escapeHTML().s;
      }).map(function (arg) {
        return self.translate(arg);
      });

      return Promise.all([translation].concat(argsToTranslate)).then(function (result) {
        var translated = result[0];
        var translatedArgs = result.slice(1);

        if (!translated) {
          return key;
        }
        var out = translated;
        translatedArgs.forEach(function (arg, i) {
          out = out.replace(new RegExp('%' + (i + 1), 'g'), arg);
        });
        return out;
      });
    };

    Translator.prototype.getTranslation = function getTranslation(namespace, key) {
      var translation;
      if (!namespace) {
        winston.warn('[translator] Parameter `namespace` is ' + namespace + (namespace === '' ? '(empty string)' : ''));
        translation = Promise.resolve({});
      } else if (this.translations[namespace]) {
        translation = this.translations[namespace];
      } else {
        translation = this.load(this.lang, namespace);
        this.translations[namespace] = translation;
      }

      if (key) {
        return translation.then(function (x) {
          return x[key];
        });
      }
      return translation;
    };

    return Translator;
  }();

  var cache = {};
  var adaptor = {
    Translator: Translator,

    translate: function translate(text, language, callback) {
      // console.warn('[translator] `translator.translate(text, [lang, ]callback)` is deprecated. ' + 
      //   'Use the `translator.Translator` class instead.');

      var cb = callback;
      var lang = language;
      if (typeof language === 'function') {
        cb = language;
        lang = adaptor.getLanguage();
      } else if (!lang) {
        lang = adaptor.getLanguage();
      }

      cache[lang] = cache[lang] || new Translator(lang);
      var translator = cache[lang];
      translator.translate(text).then(function (output) {
        return cb(output);
      }).catch(function (err) {
        console.error('Translation failed: ' + err.message);
      });
    },
    compile: function compile() {
      var args = Array.prototype.slice.call(arguments, 0);

      return '[[' + args.join(', ') + ']]';
    },
    toggleTimeagoShorthand: function toggleTimeagoShorthand() {
      var tmp = assign({}, jQuery.timeago.settings.strings);
      jQuery.timeago.settings.strings = assign({}, adaptor.timeagoShort);
      adaptor.timeagoShort = assign({}, tmp);
    },
    escape: function escape(text) {
      return typeof text === 'string' ? text.replace(/\[\[([\S]*?)\]\]/g, '\\[\\[$1\\]\\]') : text;
    },
    unescape: function unescape(text) {
      return typeof text === 'string' ? text.replace(/\\\[\\\[([\S]*?)\\\]\\\]/g, '[[$1]]') : text;
    },
    addTranslation: function addTranslation(language, filename, translations) {
      cache[language] = cache[language] || new Translator(language);

      cache[language].translations[filename].then(function (x) {
        assign(x, translations);
      });
    },
    getTranslations: function getTranslations(language, filename, callback) {
      callback = callback || function () {};
      cache[language] = cache[language] || new Translator(language);

      cache[language].getTranslation(filename).then(function (translation) {
        callback(translation);
      });
    },
    load: function load(language, filename, callback) {
      adaptor.getTranslations(language, filename, callback);
    },
    getLanguage: function getLanguage() {
      var lang;

      if (typeof window === 'object' && window.config && window.utils) {
        lang = utils.params().lang || config.userLang || config.defaultLang || 'en_GB';
      } else {
        var meta = require('../../../src/meta');
        lang = meta.config.defaultLang || 'en_GB';
      }

      return lang;
    },
    prepareDOM: function prepareDOM() {
      // Load the appropriate timeago locale file,
      // and correct NodeBB language codes to timeago codes, if necessary
      var languageCode = void 0;
      switch (config.userLang) {
        case 'en_GB':
        case 'en_US':
          languageCode = 'en';
          break;

        case 'fa_IR':
          languageCode = 'fa';
          break;

        case 'pt_BR':
          languageCode = 'pt-br';
          break;

        case 'nb':
          languageCode = 'no';
          break;

        case 'zh_TW':
          languageCode = 'zh-TW';
          break;

        case 'zh_CN':
          languageCode = 'zh-CN';
          break;

        default:
          languageCode = config.userLang;
          break;
      }

      jQuery.getScript(RELATIVE_PATH + '/vendor/jquery/timeago/locales/jquery.timeago.' + languageCode + '.js').done(function () {
        jQuery('.timeago').timeago();
        adaptor.timeagoShort = assign({}, jQuery.timeago.settings.strings);

        // Retrieve the shorthand timeago values as well
        jQuery.getScript(RELATIVE_PATH + '/vendor/jquery/timeago/locales/jquery.timeago.' + languageCode + '-short.js').done(function () {
          // Switch back to long-form
          adaptor.toggleTimeagoShorthand();
        });
      });

      // Add directional code if necessary
      adaptor.translate('[[language:dir]]', function (value) {
        if (value) {
          jQuery('html').css('direction', value).attr('data-dir', value);
        }
      });
    }
  };

  return adaptor;
});
