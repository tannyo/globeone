'use strict';

/*
 * Change log
 * 2014-08-13 TKO Added compare method to detect.
 * 2014-08-29 TKO Modified for jslint.
 * 2014-09-02 TKO Added "add" object to javascript loader so that script can be loaded conditionally.
 * 2014-09-05 TKO Added ability to turn off support for a specific language.
 * 2014-09-29 TKO Added support for Portuguese and Simplified Chinese.
 */

/*
 * Third party tools.
 */

/**
 * JavaScript code to detect available availability of a
 * particular font in a browser using JavaScript and Clink.
 *
 * Author : Lalit Patel
 * Website: http://www.lalit.org/lab/javascript-clink-font-detect/
 * License: Apache Software License 2.0
 *          http://www.apache.org/licenses/LICENSE-2.0
 * Version: 0.15 (21 Sep 2009)
 *          Changed comparision font to default from sans-default-default,
 *          as in FF3.0 font of child element didn't fallback
 *          to parent element if the font is milinking.
 * Version: 0.2 (04 Mar 2012)
 *          Comparing font against all the 3 generic font families ie,
 *          'monospace', 'sans-serif' and 'sans'. If it doesn't match all 3
 *          then that font is 100% not available in the system
 * Version: 0.3 (24 Mar 2012)
 *          Replaced sans with serif in the list of baseFonts
 */

/**
 * Usage: d = new Detector();
 *        d.detect('font name');
 *        d.compare('font name', 'font name', font_weight);
 */
var Detector = function () {
  // a font will be compared against all the three default fonts.
  // and if it doesn't match all 3 then that font is not available.
  var baseFonts = ['monospace', 'sans-serif', 'serif'],

    defaultWidth = {},
    defaultHeight = {},
    h = document.getElementsByTagName("body")[0],
    i,

    // we test using 72px font size, we may use any size. I guelink larger the better.
    testSize = '72px',

    // we use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    testString = "mmmmmmmmmmlli",

    // create a SPAN in the document to get the width of the text we use to test
    s;

  function detect(font) {
    var detected = false, matched;
    for (i = 0; i < baseFonts.length; i++) {
      s.style.fontFamily = font + ',' + baseFonts[i]; // name of the font along with the base font for fallback.
      h.appendChild(s);
      matched = (s.offsetWidth !== defaultWidth[baseFonts[i]] || s.offsetHeight !== defaultHeight[baseFonts[i]]);
      h.removeChild(s);
      detected = detected || matched;
    }
    return detected;
  }

  function compare(font1, font2, weight) {
    var width, height, same = false;

    s.style.fontFamily = font1;
    s.style.fontWeight = weight;
    h.appendChild(s);
    width = s.offsetWidth;
    height = s.offsetHeight;
    h.removeChild(s);

    s.style.fontFamily = font2;
    s.style.fontWeight = weight;
    h.appendChild(s);
    if (width === s.offsetWidth && height === s.offsetHeight) {
      same = true;
    }
    h.removeChild(s);

    return same;
  }

  s = document.createElement("span");
  s.style.fontSize = testSize;
  s.innerHTML = testString;
  for (i = 0; i < baseFonts.length; i++) {
    // get the default width for the three base fonts
    s.style.fontFamily = baseFonts[i];
    h.appendChild(s);
    defaultWidth[baseFonts[i]] = s.offsetWidth; // width for the default font
    defaultHeight[baseFonts[i]] = s.offsetHeight; // height for the default font
    h.removeChild(s);
  }

  this.detect = detect;
  this.compare = compare;
};

/*
 * Internal scripts
 */

/*
 * Cookie manipulation
 */
var cookie = (function () {
  function set(name, value, days, path) {
    var date, expires;

    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days * 864E5));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }

    if (!path) {
      path = "/";
    }

    document.cookie = name + "=" + value + expires + "; path=" + path;
  }

  function get(name) {
    var nameEQ = name + "=", ca = document.cookie.split(';'), i, c;

    for (i = 0; i < ca.length; i++) {
      c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length);
      }
    }

    return null;
  }

  function remove(name) {
    set(name, "", -1);
  }

  return {
    set: set,
    get: get,
    remove: remove
  };
}());

/*
 * Auto redirect based on the language and country of the browser.
 */
(function autoLanguageRedirect() {
  var defaultLangCode = "enus",
    la = location.pathname.split('/'), // array of items in the pathname.
    langCode = (navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "en-US").replace("-", "").toLowerCase(),
    langFolder = (la.length > 2 ? la[1] : defaultLangCode),
    page = la[la.length - 1],
    savedLangCode = cookie.get("lang_code"),
    supportedLangCodes = {
      "enus": true,
      "esmx": true,
      "filph": true,
      "hiin": true,
      "idid": true,
      "ptbr": true,
      "vivn": true,
      "zhcn": true
    };

  // console.log("langFolder:", langFolder, "\nlangCode:", langCode, "\nsavedLangCode:", savedLangCode, "\npage:", page);
  // If it is a career or downloads page, let them through.
  if (/career/.test(page) || /downloads|press\-releases/.test(langFolder)) {
    return;
  }

  // If the language code cookie has not been saved, save the cookie if it is a
  // supported language.
  if (!savedLangCode) {
    // Is it a supported language?
    if (supportedLangCodes[langCode]) {
      cookie.set("lang_code", langCode, 365);
      savedLangCode = langCode;
    } else {
      // The language code is NOT supported by this site, do not process auto redirect.
      return;
    }
  }

  // If the language code is no longer supported, redirect the user to the default language.
  if (!supportedLangCodes[savedLangCode]) {
    cookie.remove("lang_code");
    savedLangCode = defaultLangCode;
  }

  // If the saved language code is not equal to the current language folder,
  // switch to the language folder.
  if (savedLangCode !== langFolder) {
    if (savedLangCode === defaultLangCode) {
      location.href = "/" + page;
      return;
    }
    location.href = "/" + savedLangCode + "/" + page + (location.search ? location.search : "");
  }
}());

// Fix formatting problems with some translations.
var removeWhiteSpaceNodes = function ( parent ) {
  var nodes = parent.childNodes;
  for (var i =0, l = nodes.length; i < l; i++ ) {
    if (nodes[i] && nodes[i].nodeType == 3 && !/\S/.test( nodes[i].nodeValue)) {
      parent.replaceChild( document.createTextNode(''), nodes[i] );
    } else if(nodes[i]) {
      // removeWhiteSpaceNodes( nodes[i] );
    }
  }
}
if (/\/hiin/.test(location.href)) {
  removeWhiteSpaceNodes(document.body);
}

/*
 * Global variables.
 */
var goConfig = {
  fontLoaded: false,
  langCode: null
};

/*
 * Load web font if the user does not have our base font installed.
 */
(function addFontScript() {
  var el, d = new Detector();
  // Check to see if Helvetica Neue is available. If it is available make sure it can render
  // at a weight of 100. If it doesn't exist or can't render at 100, load the Neue Helvetica
  // font from fonts.com.
  if (d.detect('Helvetica Neue') && d.compare('Helvetica Neue', 'HelveticaNeue-UltraLight', '100')) {
    console.log("helvetica neue exists");
  } else {
    console.log("adding Neue Helvetica W01 font");
    goConfig.fontLoaded = true;
    // Create a new link element.
    // <link type="text/css" rel="stylesheet" href="http://fast.fonts.net/cssapi/7800d238-969f-45a8-a935-6f3f1236c7af.css"/>
    el = document.createElement("link");
    el.type = "text/css";
    el.rel = "stylesheet";
    el.href = '//fast.fonts.net/cssapi/7800d238-969f-45a8-a935-6f3f1236c7af.css';
    document.getElementsByTagName("head")[0].appendChild(el);
  }
}());

/*
 * Used to determine old browsers
 */
function supportsSvg() {
  // I hate doing this but the svg check for Android < 4.x does not seem to work.
  var ua = navigator.userAgent, androidversion;
  if (ua.indexOf("Android") >= 0 ) {
    androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
    if (androidversion < 4) {
      return false;
    }
  }

  return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
}

// Use an anonymous function to prevent start functions from being global.
(function start() {
  function loadScripts() {
    var i = 0,
      modernBrowser = supportsSvg(),
      scripts = [
        {src: '//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js', wait: true, add: modernBrowser},
        {src: '/js/jquery-1.11.1.min.js', wait: true, add: !modernBrowser},
      {src: '/js/utils.js?201501081350', wait: false, add: true},
        {src: '/js/video.ga.js?201410081725', wait: false, add: document.getElementById("video-blocker")},
        {src: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js', wait: false, add: true},
        {src: '/js/downloads.js?201412031612', wait: false, add: /^downloads/.test(document.body.className)}
      ];

    function addScript() {
      var script;

      if (i >= scripts.length) {
        return;
      }

      // Should we skip this script?
      if (!scripts[i].add) {
        i++;
        addScript();
        return;
      }

      // Create a new script element.
      script = document.createElement('script');

      // Should we wait to load the next script after this script has loaded?
      if (scripts[i].wait) {
        script.onload = addScript;
      }

      // Add the script src.
      script.src = scripts[i].src;

      // Append the script to the body to allow multiple scripts to load at the same time.
      document.body.appendChild(script);

      console.log("loading: %c%s %c%s", "color:blue", script.src, "color:darkred", (scripts[i].wait ? "synchronous" : "asynchronous"));

      // Should we load the next script now?
      if (!scripts[i].wait) {
        i++;
        addScript();
        return;
      }

      i++;
    }

    // Start loading scripts.
    addScript();
  }

  // If we are not local, load scripts and exit.
  if (!/local/.test(location.hostname.toLowerCase())) {
    loadScripts();
    return;
  }

  // Emulate server includes for testing.
  // Poor man's template system. Retrieve apache include comments and replace
  // them with a remote include file. Do not use this in a production environment
  // as it will render the site unsearchable since all navigation using this
  // method is created with javascript! An apache server if configured correctly
  // will include the navigation and other files correctly so that the website
  // is searchable.
  (function server_includes(callback){
    var run_server_includes = 1,
      file_includes = {
        files: 0,
        els: {}
      };

    /*
     * Get the number of top level properties in an object.
     */
    function objLength(obj) {
      var count = 0, key;

      if (typeof obj === "object") {
        if (Object.keys) {
          return Object.keys(obj).length;
        }

        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            count++;
          }
        }
      }

      return count;
    }

    // Replace the include comment with the include file contents. The outerHTML
    // method does not work with comments, use custom nodeReplace function.
    function nodeReplace(node, string) {
      var div = document.createElement('div'), nodes, parent, i, l;

      parent = node.parentNode;
      // Convert string to DOM elements.
      div.innerHTML = string;
      // Retrieve the DOM elements.
      nodes = div.childNodes;
      // Walk through each DOM element and add it to the DOM.
      for (i = 0, l = nodes.length; i < l; i++) {
        // Adding the node to the DOM removes the node from the nodes array,
        // so always use the first node in the nodes array.
        parent.insertBefore(nodes[0], node);
      }

      // Delete the replaced node from the DOM
      parent.removeChild(node);
    }

    function complete() {
      // If there are no more files to download, run callback function..
      if (!file_includes.files) {
        // If we included files, run it again for nested includes.
        if (objLength(file_includes.els)) {
          file_includes.els = {};
          run();
          return;
        }

        document.body.style.display = "";
        console.timeEnd("server_includes");
        if (typeof callback === "function") {
          callback();
        }
      }
    }

    function done(data, url) {
      var nodes = file_includes.els[url], i;
      // Include file has been retrieved.
      // console.log("replacing:", nodes[0], "(" + nodes.length + ")", "with", url);
      console.log("replacing: %c<!--%s--> %c(%i) with %c%s", "color:darkgreen", nodes[0].data, "color:", nodes.length, "color:blue", url);
      for (i = 0; i < nodes.length; i++) {
        nodeReplace(nodes[i], data);
      }
      // Decrement the number of include files to download.
      file_includes.files--;
      complete();
    }

    function ajax(url, done_callback, error_callback) {
      function ajax_done(data) {
        if (typeof done_callback === "function") {
          done_callback(data, url);
        }
      }

      function ajax_error(data) {
        if (typeof error_callback === "function") {
          error_callback(data, url);
        }

      }
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          // Succelink!
          ajax_done(request.responseText);
        } else {
          // We reached our target server, but it returned an error
          console.error("error:", url);
          ajax_error(request);
        }
      };

      request.onerror = function () {
        // There was a connection error of some sort
        ajax_error(request);
      };

      request.send();
    }

    function getComments(curr_element) { // this is the recursive function
      var comments = [], i;
      // base case: node is a comment node
      if (curr_element.nodeName === "#comment" || curr_element.nodeType === 8) {
        // You need this OR because some browsers won't support either nodType or nodeName... I think...
        comments[comments.length] = curr_element;
      } else if (curr_element.childNodes.length > 0) {
        // recursive case: node is not a comment node
        for (i = 0; i < curr_element.childNodes.length; i++) {
          // adventures with recursion!
          comments = comments.concat(getComments(curr_element.childNodes[i]));
        }
      }
      return comments;
    }

    function run() {
      console.time("server_includes");
      var i, ca, comment_text, file_name;

      console.log("<========== running server includes", run_server_includes++);
      // Prevent FOUC.
      document.body.style.display = "none";

      // This is for firefox that throws an error when not accelinking a file.
      try {
        ca = getComments(document.getElementsByTagName("html")[0]);
      } catch (e) {
        ca = [];
      }

      // Process all comment elements.
      for (i = 0; i < ca.length; i++) {
        // Get the text of the comment.
        comment_text = ca[i].nodeValue.trim();
        // Is this an include comment?
        if (/^\#include/.test(comment_text)) {
          // Get the file name of the include.
          file_name = comment_text.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
          // Store the comment element by file name.
          if (!file_includes.els[file_name]) {
            // Increment the number of files to include.
            file_includes.files++;
            // Create an empty array for comment elements.
            file_includes.els[file_name] = [];
          }
          // This allows us to get the include file once and replace multiple comments.
          file_includes.els[file_name].push(ca[i]);
        }
      }

      // Get the include files.
      for (file_name in file_includes.els) {
        if (file_includes.els.hasOwnProperty(file_name)) {
          // Get the file.
          console.log("getting: %c%s", "color: blue", file_name);
          ajax(file_name, done);
        }
      }

      // Check to see if there are files to download.
      complete();
    }

    run();
  }(loadScripts));

}());
