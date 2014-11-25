/*

This routine checks the credit card number. The following checks are made:

1. A number has been provided
2. The number has an appropriate prefix for the card
3. The number is a right length for the card
4. The number has a valid modulus 10 number check digit if required

If the validation fails an error is reported.

The structure of credit card formats was gleaned from a variety of sources on the web, although the
best is probably on Wikepedia ("Credit card number"):

  http://en.wikipedia.org/wiki/Credit_card_number

Syntax:
  creditCard.getType(cardNo, [includeCards])
    Returns the name of the card based on a partial or complete credit card number.
    If the card is not found, undefined is returned. This can be used to display
    a credit card image next to the input field as the user types.

  creditCard.isValid(cardNo, [includeCards])
    Validates the supplied credit card number. Returns false if invalid or not supported.
    Uses the card number prefix to determine the kind of card.

  creditCard.errMsg()
    Returns the text of the last error or an empty string if no error.

  creditCard.errNo()
    Returns the last error number.

  creditCard.set(options)
    Can be a string or an object. If a string it sets an internal list of supported
    credit cards. If an object, it can optionally set the supported credit cards or
    error message strings. The object can be in the following format.

    {
      supportedCards: "visa, mastercard, amex, discover",
      ccErrors: ["", "language or program specific errors", ...]
    }

Parameters:
  cardNo: Credit card number.

  includeCards: Optional list of credit cards to check in a comma delimited string.
    This is used if you only want to validate certain cards. ie. This string will
    cause all cards that are not in the list to return an error.
      creditcard.set("visa, mastercard, amex, discover");
    or
      creditcard.isValid("6011 0000 0000 0004", "visa, mastercard, amex, discover")
        returns true because the card number is a Discover card.

      creditcard.isValid("3000 0000 0000 04", "visa, mastercard, amex, discover")
        returns false because the card number is a Diners Club Carte Blanche card.

Parameters: (No longer used, from original program.)
            cardnumber           number on the card
            cardName             name of card as defined in the card list below

Author:     John Gardner
Date:       1st November 2003
Updated:    26th Feb. 2005      Additional cards added by request
Updated:    27th Nov. 2006      Additional cards added from Wikipedia
Updated:    18th Jan. 2008      Additional cards added from Wikipedia
Updated:    26th Nov. 2008      Maestro cards extended
Updated:    19th Jun. 2009      Laser cards extended from Wikipedia
Updated:    11th Sep. 2010      Typos removed from Diners and Solo definitions (thanks to Noe Leon)
Updated:    10th April 2012     New matches for Maestro, Diners Enroute and Switch
Updated:    17th October 2012   Diners Club prefix 38 not encoded

Modified:   Tanny O'Haley
20 Nov 2014 TKO Recoded as an object.
21 Nov 2014 TKO Modified cards array to store regular expressions and numbers for length.
                Updated MasterCard and DinersClub prefixes from Wikipedia. Updated documentation.
                Cleaned up code.

*/

var creditCard = (function () {
  'use strict';
  var supportedCards = "",
    ccErrorNo = 0,
    ccErrors = [
      "",
      "Unknown card type",
      "No card number provided",
      "Credit card number is in invalid format",
      "Credit card number is invalid",
      "Credit card number has an inappropriate number of digits"
    ],
    // Define the cards we support. You may add addtional card types as follows.
    //  Name:         As in the selection box of the form - must be same as user's
    //  Length:       List of possible valid lengths of the card number for the card
    //  prefixes:     Regular expression of possible prefixes for the card
    //  checkdigit:   Boolean to say whether there is a check digit

    // Array to hold the permitted card characteristics
    cards = [
      // Do not change the order of the first three cards. Since Visa only requires
      // a 4 at the begining, putting it ahead of the other cards would mean that the
      // other cards would never be returned.
      {
        name: "Switch",
        length: [16, 18, 19],
        prefixes: /^4(903|905|911|936)|^564182|^6(33110|333|759)/, // "4903,4905,4911,4936,564182,633110,6333,6759",
        checkdigit: true
      },
      {
        name: "VisaElectron",
        length: 16,
        prefixes: /^4(026|17500|508|844|913|917)/, // "4026,417500,4508,4844,4913,4917",
        checkdigit: true
      },
      {
        name: "Visa",
        length: [13, 16],
        prefixes: /^4/, // "4",
        checkdigit: true
      },
      {
        name: "MasterCard",
        length: 16,
        prefixes: /^5[1-5]|^2(2(2[1-9][0-9]{2}|[3-9][0-9]{3})|[3-6][0-9]{4}|7([01][0-9]{3}|20[0-9]{2}))/, // "51,52,53,54,55, 222100–272099",
        checkdigit: true
      },
      {
        name: "AmEx",
        length: 15,
        prefixes: /^3(4|7)/, // "34,37",
        checkdigit: true
      },
      {
        name: "Discover",
        length: 16,
        prefixes: /^6(011|22|4|5)/, // "6011,622,64,65",
        checkdigit: true
      },
      {
        name: "DinersClub",
        length: [14, 16],
        prefixes: /^3(6|8|9)|^5(4|5)/, // "36,38,39,54,55",
        checkdigit: true
      },
      {
        name: "CarteBlanche",
        length: 14,
        prefixes: /^30[1-5]/, // "300,301,302,303,304,305",
        checkdigit: true
      },
      {
        name: "JCB",
        length: 16,
        prefixes: /^35/, // "35",
        checkdigit: true
      },
      {
        name: "enRoute",
        length: 15,
        prefixes: /^2(014|149)/, // "2014,2149",
        checkdigit: true
      },
      {
        name: "Solo",
        length: [16, 18, 19],
        prefixes: /^6(334|767)/, // "6334,6767",
        checkdigit: true
      },
      {
        name: "Maestro",
        length: [12, 13, 14, 15, 16, 18, 19],
        prefixes: /^5(018|020|038)|^6(304|759|761|762|763)/, // "5018,5020,5038,6304,6759,6761,6762,6763",
        checkdigit: true
      },
      {
        name: "LaserCard",
        length: [16, 17, 18, 19],
        prefixes: /^6(304|706|771|709)/, // "6304,6706,6771,6709",
        checkdigit: true
      }
    ];

  /*
   * Return the card object for the prefix of the credit card number.
   */
  function getCard(cardNo, includeCards) {
    var card, i;

    includeCards = includeCards || supportedCards;

    if (includeCards) {
      includeCards = includeCards.replace(" ", "").toLowerCase();
      if (!/,$/.test(includeCards)) {
        includeCards += ",";
      }
    }

    for (i = 0; i < cards.length; i++) {
      card = cards[i];
      if (!includeCards || (includeCards && includeCards.indexOf(card.name.toLowerCase() + ",") !== -1)) {
        if (card.prefixes.test(cardNo)) {
          return card;
        }
      }
    }
  }

  /*
   * Return the name of a card based on the prefix of a partial or complete card number.
   */
  function getType(cardNo, includeCards) {
    var card = getCard(cardNo, includeCards);

    if (card) {
      return card.name;
    }
  }

  /*
   * Calculate the checksum of a card number.
   */
  function getChecksum(cardNo) {
    var calc,
      checksum = 0, // running checksum total
      j = 1,        // takes value of 1 or 2
      i;

    // Process each digit one by one starting at the right
    for (i = cardNo.length - 1; i >= 0; i--) {
      // Extract the previous digit and multiply by 1 or 2 on alternative digits.
      calc = Number(cardNo.charAt(i)) * j;

      // If the result is in two digits add 1 to the checksum total
      if (calc > 9) {
        checksum += 1;
        calc -= 10;
      }

      // Add the units element to the checksum total
      checksum += calc;

      // Switch the value of j
      j = (j === 1 ? 2 : 1);
    }

    return checksum;
  }

  /*
   * Return the last error message.
   */
  function getErrorMsg() {
    return ccErrors[ccErrorNo];
  }

  /*
   * Return the last error number.
   */
  function getErrorNo() {
    return ccErrorNo;
  }

  /*
   * Validate that a credit card number is in a valid format for a supported credit card.
   */
  function isValid(cardnumber, includeCards) {
    var card,
      cardNo,
      checksum,
      i,
      lengths,
      validLength;

    // Initialize the error number.
    ccErrorNo = 0;

    // Remove spaces from the credit card number
    cardNo = cardnumber.replace(/\s/g, "").trim();

    // Ensure that the user has provided a credit card number
    if (cardNo.length === 0) {
      ccErrorNo = 2;
      return false;
    }

    // Check that the number is numeric and at least 13 characters long and no
    // more than 19 characters long.
    if (!/^[0-9]{13,19}$/.test(cardNo)) {
      ccErrorNo = 3;
      return false;
    }

    // Get the credit card object.
    card = getCard(cardNo, includeCards);

    // If card not found, report an error.
    if (!card) {
      ccErrorNo = 1;
      return false;
    }

    // See if the length is valid for this card
    lengths = card.length;
    // Is card.length a number or an array?
    if (typeof lengths === "number") {
      if (cardNo.length === lengths) {
        validLength = true;
      }
    } else {
      for (i = 0; i < lengths.length; i++) {
        if (cardNo.length === lengths[i]) {
          validLength = true;
          break;
        }
      }
    }

    // See if all is OK by seeing if the length was valid. We only check the length if all else was
    // hunky dory.
    if (!validLength) {
      ccErrorNo = 5;
      return false;
    }

    // Now check the modulus 10 check digit - if required
    if (card.checkdigit) {
      checksum = getChecksum(cardNo);
      // All done - if checksum is divisible by 10, it is a valid modulus 10.
      // If not, report an error.
      if (checksum % 10 !== 0) {
        ccErrorNo = 4;
        return false;
      }
    }

    // The credit card is in the required format.
    return true;
  }

  /*
   * Set options.
   */
  function set(options) {
    if (typeof options === "string") {
      supportedCards = options;
    } else {
      // 2 options, don't need extend.
      supportedCards = options.supportedCards || supportedCards;
      ccErrors = options.ccErrors || ccErrors;
    }
  }

  /*
   * Public methods.
   */
  return {
    errMsg: getErrorMsg,
    errNo: getErrorNo,
    getType: getType,
    isValid: isValid,
    set: set
  };
}());
