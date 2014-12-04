/*
 * Track in Google Analytics when a user downloads a file or requests a meeting.
 */
$("#sec-download-files").find("a").on("click", function(event) {
  var file_type;

  if (this.id === "request-more-info" || this.id === "play-video") {
    return;
  } else if (/^mailto/.test(this.href)) {
    file_type = "mailto";
  } else {
    file_type = this.href.substr(this.href.lastIndexOf(".") + 1).toLowerCase();
  }
  track_event("downloads", this.text, file_type);
});
