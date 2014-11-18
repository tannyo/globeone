
  // Toggle classes on image sections to show different images.
  // This is so that the owners can look at different images
  // for each section to help them select the best images for
  // the site. The key is the id of the section element. The
  // index variable holds the index of the current class used
  // on the section element. The classes variable holds an arroy
  // of classes to apply to the section element. The images are
  // in the style.css file with the appropriate class for each
  // section by id.
  // var bg_class = {
  //   "sec-fincom": {
  //     index: 0,
  //     classes: ["", "lights"]
  //   },
  //   "sec-how-intro": {
  //     index: 0,
  //     classes: ["", "tools"]
  //   },
  //   "sec-careers": {
  //     index: 0,
  //     classes: ["", "mil"]
  //   },
  //   "sec-how-mobile": {
  //     index: 0,
  //     classes: ["", "girl"]
  //   },
  //   "sec-how-gcom": {
  //     index: 0,
  //     classes: ["", "yellow"]
  //   },
  //   "sec-who-principles": {
  //     index: 0,
  //     classes: ["white", "", "blue"]
  //   },
  //   "sec-who-live": {
  //     index: 0,
  //     classes: ["", "child"]
  //   }
  // };

  // $(".sec-img").click(function () {
  //   var key = this.id, item = bg_class[key], el = $(this), class_name;
  //   if (item) {
  //     class_name = item.classes[item.index];
  //     if (class_name) {
  //       el.removeClass(class_name);
  //     }
  //
  //     item.index++;
  //     if (item.index >= item.classes.length) {
  //       item.index = 0;
  //     }
  //
  //     el.addClass(item.classes[item.index]);
  //   }
  // });

/*
 * support Date.now() function in browsers that don't support it.
 */
if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

function zeroPad(n, l) {
  return ("000000000" + n).slice(-(l || 2));
}

function dispTime(d) {
  return zeroPad(d.getHours()) + ":" + zeroPad(d.getMinutes()) + ":" + zeroPad(d.getSeconds()) + "." + zeroPad(d.getMilliseconds(), 3);
}

// Change the social media styles.
var bg_social = {
  index: 0,
  classes: ["", "opt1","opt2","opt3","opt4","opt5"]
};
$("#social-menu").find("li:nth-child(3) a").click(function (event) {
  var key = this.id, item = bg_social, el = $("#social-menu"), class_name;
  event.preventDefault();
  class_name = item.classes[item.index];
  if (class_name) {
    el.removeClass(class_name);
  }

  item.index++;
  if (item.index >= item.classes.length) {
    item.index = 0;
  }

  el.addClass(item.classes[item.index]);
});
