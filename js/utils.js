'use strict';

/*global $, jQuery, videoTrack, goConfig, cookie */

var lang = {
  "lang": "English",

  "joinUs": {
    "emailReq": "Please enter your email address.",
    "successMsg": "Thank you for your request to Join the GlobeOne\ncommunity. We will get back to you soon.",
    "errorMsg": "We're sorry, we were not able to process\nyour request. Please try again later.",
    "duplicateMsg": "The email address has already been used,\ndo you want us to resend the Join Us email?",
    "duplicateOK": "Yes",
    "duplicateCancel": "No"
  },
  "contactUs": {
    "emailReq": "Please enter your email address.",
    "topicReq": "Please select an topic.",
    "bodyReq": "Please enter a description.",
    "successMsg": "Thank you for contacting us.\nWe will get back to you soon.",
    "errorMsg": "We're sorry, we were not able to process\nyour request. Please try again later."
  },
  "login": {
    "useridReq": "Please enter an email address.",
    "passwordReq": "Please enter a password.",
    "invalidLogin": "Invalid email or password."
  }
};

// Get language file for dialogs if in a subfolder.
if (location.pathname.split('/').length > 2 && location.pathname.toLowerCase() !== '/downloads/' && !(/press\-releases/i.test(location.href))) {
  console.log("get lang file");
  $.ajax("lang/lang.json").done(function (data) {
    console.log(JSON.stringify(data));
    lang = data;
  }).error(function (xhr, status) {
    console.log("Error getting language file", name, "error:", status);
  });
}

var track_event = function(category, action, label) {
  ga('send', 'event', category, action, label);
};

/*
 * jQuery modal dialog plugin.
 */
(function ($) {
  // Globals
  var dialogs = {}, settings = {
    path: "",
    extension: ".html",
    replace: true,
    blocker: '<div class="blocker fade"></div>',
    confirm: {
      option_btn_start: '<button class="btn btn-default option" type="button">',
      option_btn_end: '</button>',
      option_btn_class: 'option'
    }
  };

  // jQuery not defined.
  if (!$) {
    return;
  }

  $.dialog = (function () {
    /*
     * Close the dialog.
     */
    function close(name) {
      var dialogEl, dialog = dialogs[name].dialog;

      // If close has already been called, return.
      if (!dialog) {
        return;
      }

      // If there is a timeout, clear the timeout to stop it.
      if (dialog.timeout) {
        clearTimeout(dialog.timeout);
        dialog.timeout = null;
      }

      // Get the blocker element of the dialog.
      dialogEl = $('#' + name);

      // Hide the dialog.
      dialogEl.hide().removeClass("in");

      // Remove click handlers.
      dialogEl.find(".cancel, .ok, ." + settings.confirm.option_btn_class).off("click.dialog");

      // Remove html and all handlers if replace setting.
      dialogEl.empty();

      // Remove key handlers.
      $(document).off("keyup.dialog");
      $(document).off("keydown.dialog");

      // Run the close function.
      dialog.onClose(dialogEl);

      // Delete the open dialog object for this dialog.
      dialog = {};
    }

    /*
     * Check for the Esc key pressed. If pressed, close the dialog.
     */
    function checkEsc(name) {
      // Capture the Esc key to close the dialog.
      $(document).on("keyup.dialog", function (event) {
        if (event.keyCode === 27) {
          event.stopPropagation();
          close(name);
        }
      });
    }

    /*
     * Check for the Enter/Return key pressed. If pressed call callback function.
     */
    function checkEnter(name, callback) {
      // Capture the Enter key to close the dialog.
      $(document).on("keydown.dialog", function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          event.stopPropagation();
          if (typeof callback === "function") {
            callback();
          }
          close(name);
        }
      });
    }

    /*
     * Show the dialog, add close behavior, and call any passed onOpen function.
     */
    function show(name) {
      var dialogEl = $('#' + name),
        dialog = dialogs[name].dialog;

      // Show the dialog.
      dialogEl.show().addClass("in");

      // Run onOpen function
      dialog.onOpen(dialogEl);

      // Check for auto close of dialog.
      dialog.autoClose();

      // Close on Esc key.
      checkEsc(name);

      // Close on Cancel button.
      dialogEl.find(".cancel, .ok, ." + settings.confirm.option_btn_class).on("click.dialog", function () {
        close(name);
      });
    }

    /*
     * Get dialog html from the server and add it to the DOM.
     */
    function get(name) {
      // Create background blocker and add id.
      var blocker = $(settings.blocker).attr("id", name);
      $.ajax(settings.path + name + settings.extension).done(function (data) {
        // Store dialog html.
        dialogs[name].html = data;
        // Add dialog html to blocker.
        blocker.append(data);
        // Add blocker to end of body.
        $("body").append(blocker);
        show(name);
      }).error(function (xhr, status) {
        console.log("Error getting dialog", name, "error:", status, xhr);
      });
    }

    /*
     * Open the dialog.
     */
    function open() {
      // If the dialog html has been added to the DOM, show the dialog, otherwise
      // get the dialog html from the server and add it to the DOM and show the
      // dialog.

      var i, a, name, dialog, onOpen, onClose, autoClose;

      // Process variable number of arguments.
      for (i = 0; i < arguments.length; i++) {
        a = arguments[i];
        if (typeof a === "string") {
          name = a;
        } else if (typeof a === "function") {
          if (!onOpen) {
            onOpen = a;
          } else {
            onClose = a;
          }
        } else if (typeof a === "number") {
          autoClose = a;
        }
      }

      // Create dialog object for dialog.
      if (!dialogs[name]) {
        dialogs[name] = {dialog: {}};
      } else if (settings.replace) {
        // Replace the html of the dialog each time it is displayed.
        $('#' + name).html(dialogs[name].html);
      }

      dialog = dialogs[name].dialog;

      // Allow the dialog object to be auto closed.
      dialog.autoClose = function (msecs) {
        msecs = msecs || autoClose;
        if (typeof msecs === "number" && !dialog.timeout) {
          this.timeout = setTimeout(function () {
            dialogs[name].dialog.timeout = null;
            close(name);
          }, msecs);
        }
        return dialog;
      };

      dialog.onOpen = function (fn) {
        var dialogEl, origFn;
        if (typeof fn === "function") {
          dialogEl = $('#' + name);
          if (dialogEl.length) {
            fn(dialogEl);
          } else if (onOpen) {
            origFn = onOpen;
            this.onOpen = function (el) {
              origFn(el);
              fn(el);
            };
          } else {
            onOpen = fn;
          }
        } else if (fn && fn.jquery && typeof onOpen === "function") {
          // Was passed a jQuery object, call the onOpen function.
          onOpen(fn);
        }
        return dialog;
      };

      dialog.onClose = function (fn) {
        var origFn;
        if (typeof fn === "function") {
          if (this.onClose) {
            origFn = this.onClose;
            this.onClose = function (el) {
              origFn(el);
              fn(el);
            };
          } else {
            this.onClose = fn;
          }
        } else if (fn && fn.jquery && typeof onClose === "function") {
          onClose(fn);
        }
        return dialog;
      };

      // Is the dialog already in the DOM?
      if ($('#' + name).length) {
        show(name);
      } else {
        get(name);
      }

      return dialog;
    }

    /*
     * Display an alert message with an OK button.
     */
    function alert() {
      var a, msg, onClose, autoClose, i;

      // Process variable number of arguments.
      for (i = 0; i < arguments.length; i++) {
        a = arguments[i];
        if (typeof a === "string") {
          msg = a;
        } else if (typeof a === "function") {
          onClose = a;
        } else if (typeof a === "number") {
          autoClose = a;
        }
      }

      function onOpen(dialogEl) {
        // Add the alert message to the alert dialog. If wider than 320 pixels change new lines to <br>.
        dialogEl.focus().find(".msg").html(msg.replace(/\n/g, (document.body.offsetWidth > 320 ? "<br>" : " ")));
        checkEnter("alert");
      }

      return open("alert", onOpen, onClose, autoClose);
    }

    /*
     * Display a dialog with a message and cancel and ok buttons.
     * If the user clicks the OK button, pass true to the callback
     * function. Otherwise pass false to the callback function.
     */
    function confirm() {
      var bReturn = false, a, msg, i, options = {
        ok: undefined,
        cancel: undefined,
        option: undefined,
        onOpen: undefined,
        onClose: undefined
      };

      // Process variable number of arguments.
      for (i = 0; i < arguments.length; i++) {
        a = arguments[i];
        if (typeof a === "string") {
          if (!msg) {
            msg = a;
          } else if (!options.ok) {
            options.ok = a;
          } else {
            options.cancel = a;
          }
        } else if (typeof a === "function") {
          options.onClose = a;
        } else {
          options = $.extend(options, a);
        }
      }

      function onOpen(dialogEl) {
        var dialog_ok_btn = dialogEl.find(".ok"), dialog_cancel_btn = dialogEl.find(".cancel"), dialog_option_btn;

        // Set OK button text.
        if (options.ok) {
          dialog_ok_btn.text(options.ok);
        } else {
          dialog_ok_btn.text(dialog_ok_btn.attr("data-default"));
        }

        // Set Cancel button text.
        if (options.cancel) {
          dialog_cancel_btn.text(options.cancel);
        } else {
          dialog_cancel_btn.text(dialog_cancel_btn.attr("data-default"));
        }

        // Change the message. If wider than 320 pixels change new lines to <br>.
        dialogEl.focus().find(".msg").html(msg.replace(/\n/g, (document.body.offsetWidth > 320 ? "<br>" : " ")));

        // If the user clicks ok, set the return value.
        dialogEl.find(".ok").on("click.confirm", function () {
          bReturn = true;
        });

        // Add option button if requested.
        if (options.option) {
          // Create option button.
          dialog_option_btn = $(settings.confirm.option_btn_start + options.option + settings.confirm.option_btn_end);
          // Add it to the form.
          dialog_cancel_btn.before(dialog_option_btn);
          // If the user clicks ok, set the return value to the option button text.
          dialog_option_btn.on("click.confirm", function (event) {
            event.stopPropagation();
            // Return the text of the button.
            bReturn = options.option;
          });
        }

        // If the user presses the Enter key, set the return value as if they
        // clicked the OK button.
        checkEnter("confirm", function () {
          bReturn = true;
        });

        if (typeof options.onOpen === "function") {
          options.onOpen(dialogEl);
        }

        return dialogs.confirm.dialog;
      }

      function onClose(dialogEl) {
        if (typeof dialogEl === "function") {
          options.onClose = dialogEl;
          return dialogs.confirm.dialog;
        }

        // remove click handlers and option button.
        dialogEl.find(".ok, ." + settings.confirm.option_btn_class).off("click.confirm");
        if (options.option && !settings.replace) {
          dialogEl.find(settings.confirm.option_btn_class).remove();
        }

        // Call the callback function with a return value.
        if (typeof options.onClose === "function") {
          options.onClose(bReturn);
        }
        return dialogs.confirm.dialog;
      }

      // Overwrite onClose method with confirm onClose method.
      open("confirm", onOpen).onClose = onClose;
      return dialogs.confirm.dialog;
    }

    /*
     * Change path and extension settings.
     */
    function set(obj) {
      settings = $.extend(true, settings, obj);
    }

    /*
     * Helper functions to determine the type of value passed by confirm.onClose.
     */
    function isOk(val) {
      return typeof val === "boolean" && val;
    }

    function isCancel(val) {
      return typeof val === "boolean" && !val;
    }

    function isOption(val) {
      return typeof val === "string" && val ? true : false;
    }

    // Return public methods.
    return {
      open: open,
      close: close,
      alert: alert,
      confirm: confirm,
      set: set,
      isOk: isOk,
      isCancel: isCancel,
      isOption: isOption
    };
  }());
}(jQuery));

var form_validate = {
  email: function (email) {
    return this.required(email) && (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email.trim()));
  },
  required: function (value) {
    return value.trim().length ? true : false;
  }
};

var contact_us = (function () {
  var form;

  function send(email) {
    var req = {
      "data": {
        "email": email.email,
        "subject": email.subject,
        "body": email.body
      }
    };

    if (goConfig.langCode) {
      req.data.lang = goConfig.langCode;
    }

    function done(data) {
      if (data.status === "OK") {
        $.dialog.alert(lang.contactUs.successMsg).autoClose(7000);
        track_event("Contact Us", "sent", email.subject);
      } else {
        $.dialog.alert(lang.contactUs.errorMsg).autoClose(7000);
      }
    }

    function error(xhr, status) {
      console.log("Error getting dialog", name, "error:", status);
      $.dialog.alert(lang.contactUs.errorMsg).autoClose(7000);
    }

    if (/local/.test(location.hostname.toLowerCase())) {
      $.ajax({
        type: "GET",
        url: "/app/addMemberReq.json",
        data: req
      }).done(done).error(error);
      return;
    }

    $.ajax({
      type: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      url: "/onboarding/email/contactus",
      data: JSON.stringify(req),
      dataType: "json"
    }).done(done).error(error);
  }

  function onSubmit(event) {
    event.preventDefault();

    form = $(this);

    var email = form.find("#contact-email").val(),
      subject = form.find("#contact-topic").val(),
      body = form.find("#contact-body").val();

    form.find("input, button").blur();
    if (!form_validate.email(email)) {
      $("#contact-form .error").removeClass("hidden").text(lang.contactUs.emailReq);
      form.find("input").focus();
      return;
    }

    if (!form_validate.required(subject)) {
      $("#contact-form .error").removeClass("hidden").text(lang.contactUs.topicReq);
      form.find("select").focus();
      return;
    }

    if (!form_validate.required(body)) {
      $("#contact-form .error").removeClass("hidden").text(lang.contactUs.bodyReq);
      form.find("textarea").focus();
      return;
    }

    $.dialog.close("contact-form");
    send({ "email": email, "subject": subject, "body": body});
  }

  function onOpen(dialog) {
    dialog.find("form").on("submit", onSubmit);
    dialog.find("#contact-email").focus();
  }

  function open(event) {
    event.preventDefault();
    $.dialog.open("contact-form").onOpen(onOpen);
  }

  function init() {
    $("#contact-us-link,#request-more-info").on("click", open);
  }

  return {init: init};
}());

var login = (function () {
  function onSubmit(event) {
    event.preventDefault();
    var userid = $("#userid"), password = $("#password");

    // Email user ID is required
    if (!form_validate.email(userid.val())) {
      $("#login-form .error").removeClass("hidden").text(lang.login.useridReq);
      userid.focus();
      return;
    }

    // Password is required.
    if (!form_validate.required(password.val())) {
      $("#login-form .error").removeClass("hidden").text(lang.login.passwordReq);
      password.focus();
      return;
    }

    // Not ready for logins yet.
    $("#login-form .error").removeClass("hidden").text(lang.login.invalidLogin);
    $("#login-form #userid").focus();
  }

  function onOpen(dialog) {
    dialog.find("form").on("submit", onSubmit);
    dialog.find("#userid").focus();
  }

  function open(event) {
    event.preventDefault();
    $.dialog.open("login-form").onOpen(onOpen);
  }

  function init() {
    // Login form functions.
    $(".navbar-header .login, .nav .login").click(open);
  }

  return {init: init};
}());

var video = (function () {
  /* Video functions */
  function open() {
    // Find the video wrapper.
    var blocker = $("#video-blocker"),
      wrapper = blocker.find(".video"),
      url = wrapper.attr("data-src");

    // Display the video dialog.
    blocker.show().addClass("in");

    // Add the video to the video wrapper.
    wrapper.prepend($('<iframe id="video-player" src="' + url + '" frameborder="0" allowfullscreen webkitAllowFullScreen enablejsapi="1"></iframe>'));
    if (videoTrack) {
      videoTrack.start(blocker.find("iframe"), {seek: true});
    }

    // Check for the Esc key pressed to close the video dialog.
    $(document).on("keyup.video", function (event) {
      if (event.keyCode === 27) {
        blocker.click();
      }
    });
  }

  function close() {
    // Find the video iframe.
    var blocker = $("#video-blocker"), video = blocker.find("iframe");

    // Turn off Esc key checking.
    $(document).off("keyup.video");

    // Hide the video dialog.
    blocker.hide().removeClass("in");

    if (videoTrack) {
      videoTrack.stop();
    }

    // Remove the video iframe to stop the video.
    video.remove();
  }

  function init() {
    // Open video on play video button click.
    $("#play-video").click(function (event) {
      // Don't let the click go to other elements.
      event.stopPropagation();
      event.preventDefault();
      event.currentTarget.blur();
      open();
    });

    // If the user clicks the close button or anywhere outside the video, close the video dialog.
    $("#video-blocker").click(function (event) {
      // Don't let the click go to other elements.
      event.stopPropagation();
      close();
    });
  }

  return {init: init};
}());

var join_us = (function () {
  var form;

  function send(email, type, resend) {
    resend = resend || false;
    var req = {
      "data": {
        "email": email,
        "type": type,
        "resend": resend
      }
    };

    if (goConfig.langCode) {
      req.data.lang = goConfig.langCode;
    }

    function done(data) {
      if (data.status === "OK") {
        $.dialog.alert(lang.joinUs.successMsg).autoClose(7000);
        if (!resend) {
          track_event("Join Us", "join");
        }
      } else if (data.data.status_code === "0001") {
        $.dialog.confirm(lang.joinUs.duplicateMsg, {ok: lang.joinUs.duplicateOK, cancel: lang.joinUs.duplicateCancel}).onClose(function (response) {
          if (response) {
            send(email, type, true);
          } else {
            form.find("input").focus();
          }
        });
      } else {
        $.dialog.alert(lang.joinUs.errorMsg).autoClose(7000);
      }
    }

    function error(xhr, status) {
      console.log("Error getting dialog", name, "error:", status);
      $.dialog.alert(lang.joinUs.errorMsg).autoClose(7000);
    }

    if (/local/.test(location.hostname.toLowerCase())) {
      $.ajax({
        type: "GET",
        url: "/app/addMemberReq.json",
        data: req
      }).done(done).error(error);

      return;
    }

    $.ajax({
      type: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      url: "/onboarding/email/sendHtmlEmail",
      data: JSON.stringify(req),
      dataType: "json"
    }).done(done).error(error);
  }

  function submit(event) {
    event.preventDefault();

    form = $(this);

    var email = form.find("input").val(), type = /\/employers/.test(location.href) ? "E" : "M";

    form.find("input, button").blur();
    if (!form_validate.email(email)) {
      $.dialog.alert(lang.joinUs.emailReq).onClose(function () {
        form.find("input").focus();
      });
      return;
    }

    send(email, type);
  }

  function init() {
    $(".join-us-form").on("submit", submit);

    $(".join-us-form").on("click", function (event) {
      event.stopPropagation();
    });
  }

  return {init: init};
}());

var country_menu = (function () {
  function init() {
    $(".country-menu").find("a").click(function (event) {
      // Put the path parts in an array.
      // Get rid of the first path and return the file path.
      // with the href in front.
      // "/how.html" going to the /esmx/ directory would return
      // "/esmx/how.html".
      var la = location.pathname.split('/'),
        url = this.href + la.slice(la.length - 1).join('/'),
        langCode = $(this).attr("href").replace(/\//g, "");

      event.preventDefault();
      langCode = langCode || "enus";
      cookie.set("lang_code", langCode, 365);
      location.href = url;
    });
    $("nav").find(".container").click(function (event) {
      if (/country/.test(event.target.className) || /country/.test(event.target.parentElement.className)) {
        if ($(this).find(".open").length) {
          $(this).removeClass("scroll-indicator");
        } else {
          $(this).addClass("scroll-indicator");
        }
      }
    });
  }

  return {init: init};
}());

$(document).ready(function () {
  function faqs() {
    var el, toggle = true;
    if ($('.faq h2').length) {
      $('.faq h2').prepend('<span class="glyphicon-plus"></span>');
      $('.faq h2:odd').addClass("odd");
      $('.faq h2').click(function () {
        $(this).next('.faq-answer').slideToggle(200);
        el = $(this).find("span");
        if (el.hasClass("glyphicon-plus")) {
          el.removeClass("glyphicon-plus").addClass("glyphicon-minus");
        } else {
          el.removeClass("glyphicon-minus").addClass("glyphicon-plus");
        }
      });
      $(".faq").find("h1").click(function(event) {
        event.stopPropagation();
        $(".faq").find(".faq-answer").toggle(toggle);
        toggle = !toggle;
      });
    }
  }

  function startup() {
    console.log("startup()");
    if (goConfig.fontLoaded && navigator.platform && navigator.platform.indexOf("Win") !== -1) {
      // windows shows fonts a little too light, this will allow us to bump up the font a little.
      // Make sure you only add the class if the font has been loaded.
      $("body").addClass("win");
    }

    function set_lang_code() {
      // The lang_code (language code) will be the folder name. If root, the folder
      // name will be blank.
      // www.globeone.com               lang_code = ""
      // www.globeone.com/how.html      lang_code = ""
      // www.globeone.com/esmx/         lang_code = "esmx"
      // www.globeone.com/esmx/how.html lang_code = "esmx"
      var la = location.pathname.split('/');
      goConfig.langCode = (la.length > 2 ? la[1] : null);
    }

    function check_sub_menus() {
      var menu = $(".navbar-collapse");
      if (menu.hasClass("in")) {
        return;
      }
      menu.find(".open").removeClass("open");
      $(".scroll-indicator").removeClass("scroll-indicator");
    }

    // Track social link clicks.
    function track_social_links() {
      $("#social-menu, footer .list-unstyled:last").find("a").on("click", function () {
        track_event("social", this.text.trim(), this.href);
      });
    }

    // Add floating social media menu to page.
    function add_social_menu() {
      // Fix intermittent problem with some older Chrome browsers where it loads fonts,
      // but uses the fallback font instead of the downloaded font.
      // http://blog.typekit.com/2014/02/04/chrome-bug-affecting-web-fonts/#comment-19886
      // Changed slightly to target social icons.
      function fix_social_icons_for_chrome() {
        if (!(/chrome/i.test(navigator.userAgent))) {
          return;
        }

        var els = $("#social-menu").find("span"),
          fontFamily = els.css("font-family");
        els.css("font-family", fontFamily);
        setTimeout(function () {
          els.css("font-family", fontFamily);
        }, 5000);
      }

      // Add social menu from footer to page.
      $("body").append('<div id="social-menu"/>').find("#social-menu").append($("footer").find(".list-unstyled:last").clone());
      fix_social_icons_for_chrome();
    }

    // Don't know why the mobile toggle button isn't working, here is a hack.
    $(".navbar-toggle").click(function (event) {
      event.stopPropagation();
      // show or hide the menu.
      $(".navbar-collapse").toggleClass("in");
      check_sub_menus();
    });
    // Hide menu when clicked outside of toggle button.
    $(document).click(function () {
      $(".navbar-collapse").removeClass("in");
      check_sub_menus();
    });

    set_lang_code();
    // login.init();
    video.init();
    join_us.init();
    contact_us.init();
    add_social_menu();
    track_social_links();

    faqs();

    // If the browser doesn't support svg, change to png.
    if (!supportsSvg()) {
      $("body").addClass("no-svg");
      $("img").attr("src", function (idx, attr) {
        return attr.replace(/\.svg$/, ".png");
      });
    }

    // Add class for extra CSS for simplified chinese.
    if (/\/zhcn/.test(location.href)) {
      $("body").addClass("zhcn");
    } else if (/\/hiin/.test(location.href)) {
      $("body").addClass("hiin");
    }

    // Disable language link for career or events pages.
    if (/\/career|downloads|press\-releases|pressroom/.test(location.pathname)) {
      $("#change-lang").addClass("disabled").click(function (event) {
        event.preventDefault();
      });
      $.dialog.set({path: "/"});
    } else {
      country_menu.init();
    }

    // Add map iframe.
    var map_el = $(".map");
    if (map_el.css("display") === "block") {
      map_el.append('<iframe src="/map/html/map.html" scrolling="no"></iframe>');
    }
  }

  startup();

  // Google analytics.
  console.log("Adding Google Analytics.");
  (function (b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
  function (){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
  e=o.createElement(i);r=o.getElementsByTagName(i)[0];
  e.src='//www.google-analytics.com/analytics.js';
  r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
  ga('create','UA-50626172-1');ga('send','pageview');
});
