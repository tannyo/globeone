(function () {
  'use strict';
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  Chart.defaults.global.responsive = true;

  function draw_chart(req) {
    var ctx = document.getElementById("combined-chart").getContext("2d"),
      data = {
        labels: req.labels,
        datasets: [
          {
            label: "Members",
            fillColor: "rgba(120,191,224,1)",
            data: req.members
          },
          {
            label: "Employers",
            fillColor: "rgba(2,108,194,1)",
            data: req.employers
          }
        ]
      },
      combined;

    ctx.canvas.setAttribute("width", ctx.canvas.offsetWidth)
    combined = new Chart(ctx).Bar(data, {responsive: true});
    $("#combined-chart").after(combined.generateLegend());
    $(".bar-legend")
      .find("li:first").append(" (" + req.member_total + ")").end()
      .find("li:last").append(" (" + req.employer_total + ")");
  }

  function done(data) {
    // Massage data to a format that is ready for charting.
    var count_months = [],
      member_counts = [],
      employer_counts = [],
      list = data.list,
      start_date = new Date(list[0].createDate.replace(/\-/g, "/")),
      start_month = start_date.getMonth() + 1,
      now = new Date(),
      end_month = ((now.getFullYear() - start_date.getFullYear()) * 12) + (now.getMonth() + 1),
      i,
      m = start_date.getMonth(),
      y = start_date.getFullYear(),
      iEnd = (end_month - start_month) + 1,
      member_total = 0,
      employer_total = 0,
      item,
      item_date,
      index;

    // Initialize labels and counts.
    for (i =  0; i < iEnd; i++, m++) {
      member_counts[i] = 0;
      employer_counts[i] = 0;
      if (i > 11 && i % 12 === 0) {
        y++;
      }

      if (m > 11) {
        m = 0;
      }

      count_months[i] = months[m] + " " + y;
    }

    // Combine counts by month.
    iEnd = list.length;
    for (i = 0; i < iEnd; i++) {
      // Get list item.
      item = list[i];
      // Get item date.
      item_date = new Date(list[i].createDate.replace(/\-/g, "/"));
      // Calculate index based on the number of months difference between the start date and item date.
      index = ((item_date.getFullYear() - start_date.getFullYear()) * 12) + (item_date.getMonth() - start_date.getMonth());
      if (item.contactType === "M") {
        member_counts[index] += item.count;
        member_total += item.count;
      } else {
        employer_counts[index] += item.count;
        employer_total += item.count;
      }
    }

    draw_chart({
      labels: count_months,
      members: member_counts,
      member_total: member_total,
      employers: employer_counts,
      employer_total: employer_total
    });
  }

  function error(xhr, status) {
    console.log("Error getting dialog", name, "error:", status);
    // $.dialog.alert(lang.joinUs.errorMsg).autoClose(7000);
  }

  function get_data() {
    if (/local/.test(location.hostname.toLowerCase())) {
      $.ajax({
        type: "GET",
        url: "joinus.json",
      }).done(done).error(error);

      return;
    }

    $.ajax({
      type: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      url: "/onboarding/email/getStatistics",
      dataType: "json"
    }).done(done).error(error);
  }

  get_data();
  $("#refresh-btn").on("click", function (event) {
    event.preventDefault();
    $(".bar-legend").remove();
    get_data();
  });

  // Reload every hour.
  setInterval(function () {
    location.reload();
  }, 1000 * 60 * 60);

  $("#last-refresh").append((new Date()).toLocaleString());
}());
