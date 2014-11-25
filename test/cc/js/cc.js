$(document).ready(function () {
  'use strict';
  var form = $("#cc-form"),
    cardNumber = form.find("#cardNumber"),
    cardExpirationMonth = form.find("#cardExpirationMonth"),
    cardExpirationYear = form.find("#cardExpirationYear"),
    cardName = form.find("#cardName"),
    cvv2 = form.find("#cvv2"),
    errorMsg = form.find(".error"),

    // form validation functions.
    form_validate = {
      email: function (email) {
        return this.required(email) && (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email.trim()));
      },
      number: function (number) {
        // Must be a number 1 to 3 digits long.
        return (/^[0-9]{1,3}$/.test(number.trim()));
      },
      required: function (value) {
        return value.trim().length ? true : false;
      }
    },

    // zero pad a number.
    pad = function(number, len) {
      len = len || 2;
      return ("000000000" + number).slice(-Math.abs(len));
    };

  // When the card number changes, set the background card image.
  cardNumber.on("change blur keyup keypress keydown", function () {
    // Get the card type based on the card prefix.
    var ccType = creditCard.getType(cardNumber.val());

    // Remove the last card class.
    if (cardNumber.data("cc-type")) {
      cardNumber.removeClass(cardNumber.data("cc-type"));
    }

    // If there is a valid card type, set the background image class of the input field.
    if (ccType) {
      ccType = ccType.toLowerCase();
      cardNumber.addClass(ccType).data("cc-type", ccType);
    }
  });

  // Validate form data.
  form.on("submit", function (event) {
    var d = new Date(),
      expiresLow = (d.getYear() - 100)  + pad(d.getMonth() + 1),
      expires;

    event.preventDefault();
    errorMsg.addClass("hidden");
    form.find("input, button").blur();

    // Even though we are using html5, we are not using html5 error handling because we
    // want to display errors in our own format.
    if (!form_validate.required(cardNumber.val()) || !creditCard.isValid(cardNumber.val())) {
      errorMsg.removeClass("hidden").text("Please enter a valid credit card number.");
      cardNumber.focus();
      return;
    }

    if (!form_validate.number(cardExpirationMonth.val()) || parseInt(cardExpirationMonth.val(), 10) > 12) {
      errorMsg.removeClass("hidden").text("Please enter a valid expires month.");
      cardExpirationMonth.focus();
      return;
    }

    if (!form_validate.number(cardExpirationYear.val())) {
      errorMsg.removeClass("hidden").text("Please enter a valid expires year.");
      cardExpirationYear.focus();
      return;
    }

    // Check to make sure the expires month and year is greater than the current month and year.
    // Use YYMM format to check values.
    expires = pad(cardExpirationYear.val().trim()) + pad(cardExpirationMonth.val().trim())
    if (expires < expiresLow) {
      errorMsg.removeClass("hidden").text("Please enter a valid expires month and year.");
      cardExpirationMonth.focus();
      return;
    }

    if (!form_validate.required(cardName.val())) {
      errorMsg.removeClass("hidden").text("Please enter a name.");
      cardName.focus();
      return;
    }

    if (!form_validate.number(cvv2.val()) || cvv2.val().length < 3) {
      errorMsg.removeClass("hidden").text("Please enter a valid CVV.");
      cvv2.focus();
      return;
    }
  });
});
