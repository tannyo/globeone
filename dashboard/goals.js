(function () {
  'use strict';
  var data = {},
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    goals = {
      facebook: {title: "Facebook Friends", counts: [1350, 2500, 3500, 10000]},
      twitter: {title: "Twitter Followers", counts: [85, 250, 500, 10000]},
      signups: {title: "Invite Requests", counts: [200,500,2000,50000]},
      visits: {title: "Site Visits", counts: [900, 2500, 5000, 50000]},
      countries: {title: "Countries", counts: [45, 65, 100, 110]}
    },
    actuals = {
      facebook: [0,0,0,0],
      twitter: [0,0,0,0],
      signups: [0,0,0,0],
      visits: [888,0,0,0],
      countries: [92,0,0,0]
    },
    // first month offset.
    offset = {
      signups: 176,
      visits: 8942,
      countries: 0
    };

  Chart.defaults.global.responsive = true;

  function sum(a) {
    var s = 0, i;
    for(i = 0; i < a.length; i++) {
      s += a[i];
    }
    return s;
  }

  function zero_future(obj, end_month) {
    var i;

    for (i = end_month; i < obj.counts.length; i++) {
      obj.counts[i] = 0;
    }
  }

  function setTable(end_month) {
    var tbody = $("#conversion-points").find("tbody"), key, i, el, goal, goal_count, actual, actual_count, diff, diff_class;

    for (key in goals) {
      if (goals.hasOwnProperty(key)) {
        goal = goals[key];
        actual = actuals[key];
        el = $("<tr><td>" + goal.title + "</td></tr>");
        for (i = 0; i < goal.counts.length; i++) {
          goal_count = goal.counts[i];
          if (i < end_month) {
            actual_count = actual[i];
            diff = actual_count / goal_count;
            diff_class = diff >= 1 ? "green" : diff >= 0.8 ? "yellow" : "red";
            el.append("<td><span>" + intlfmts.get(actual_count, 0) + "</span><span>" + intlfmts.get(goal_count,0) + '</span><span></span></td>'); // '</span><span class="' + diff_class + '"></span></td>');
          } else {
            el.append("<td><span></span><span>" + intlfmts.get(goal_count, 0) + "</span><span></span>");
          }
        }
        tbody.append(el);
      }
    }
    return;
  }

  function chart_cur_month(req) {
    var ctx = document.getElementById(req.id + "-chart").getContext("2d"),
      data = {
        labels: req.labels,
        datasets: [
          {
            label: "Actual",
            fillColor: "rgba(120,191,224,1)",
            data: req.actuals
          },
          {
            label: "Goal",
            fillColor: "rgba(2,108,194,1)",
            data: req.goal
          }
        ]
      },
      combined;

    ctx.canvas.setAttribute("width", ctx.canvas.offsetWidth)
    combined = new Chart(ctx).Bar(data, {responsive: true});
    if (req.show_legend) {
      $("#" + req.id + "-chart").after(combined.generateLegend());
    }
  }

  function chart_item(id, labels, end_month, show_legend) {
    var i = end_month - 1;
    chart_cur_month({
      id: id,
      labels: [labels[i]],
      actuals: [actuals[id][i]],
      goal: [goals[id].counts[i]],
      show_legend: show_legend
    });
    return;

    zero_future(goals[id], end_month);
    var ctx = document.getElementById(id + "-chart").getContext("2d"),
      data = {
        labels: labels,
        datasets: [
          {
            label: "Actual",
            fillColor: "rgba(120,191,224,1)",
            data: actuals[id]
          },
          {
            label: "Goal",
            fillColor: "rgba(2,108,194,1)",
            data: goals[id].counts
          }
        ]
      },
      combined;

    ctx.canvas.setAttribute("width", ctx.canvas.offsetWidth)
    combined = new Chart(ctx).Bar(data, {responsive: true});
    if (show_legend) {
      $("#" + id + "-chart").after(combined.generateLegend());
    }
    // $("#" + id + " .bar-legend")
    //   .find("li:first").append(" (" + intlfmts.get(sum(actuals[id]), 0) + ")").end()
    //   .find("li:last").append(" (" + intlfmts.get(sum(goals[id].counts), 0) + ")");
  }

  function chart_signups(req) {
    var ctx = document.getElementById("signups-chart").getContext("2d"),
      data = {
        labels: req.labels,
        datasets: [
          {
            label: "Actual",
            fillColor: "rgba(120,191,224,1)",
            data: req.counts
          },
          {
            label: "Goal",
            fillColor: "rgba(2,108,194,1)",
            data: req.goals
          }
        ]
      },
      combined;

    ctx.canvas.setAttribute("width", ctx.canvas.offsetWidth)
    combined = new Chart(ctx).Bar(data, {responsive: true});
    $("#signups-chart").after(combined.generateLegend());
    $("#signups-chart .bar-legend")
      .find("li:first").append(" (" + req.counts_total + ")").end()
      .find("li:last").append(" (" + sum(req.goals) + ")");

    $("#last-refresh").find("span").text((new Date()).toLocaleString());
  }

  function set_data() {
    if (!(data.signups && data.twitter && data.facebook)) {
      return;
    }

    // Sort data by date ascending.
    data.signups.list.sort(function (a, b) {
      return new Date(a.createDate.replace(/\-/g, "/")) - new Date(b.createDate.replace(/\-/g, "/"));
    });

    // Massage data to a format that is ready for charting.
    var count_months = [],
      counts = [],
      list = data.signups.list,
      now = new Date(),
      start_year = now.getFullYear(),
      start_date = new Date("1/1/" + start_year),
      start_month = start_date.getMonth() + 1,
      end_date = new Date("5/1/" + start_year),
      end_month = ((end_date.getFullYear() - start_date.getFullYear()) * 12) + (end_date.getMonth()),
      i,
      m = start_date.getMonth(),
      y = start_date.getFullYear(),
      iEnd = (end_month - start_month) + 1,
      counts_total = 0,
      employer_total = 0,
      item,
      item_date,
      index;

    list = list.filter(function (item) {
      item_date = new Date(item.createDate.replace(/\-/g, "/"));
      return item_date >= start_date && item_date < end_date;
    });

    // Initialize labels and counts.
    for (i =  0; i < iEnd; i++, m++) {
      counts[i] = 0;
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
      counts[index] += item.count;
      counts_total += item.count;
    }

    counts[0] += offset.signups;
    counts_total += offset.signups;
    actuals.signups = counts;
    actuals.visits[0] += offset.visits;
    actuals.countries[0] += offset.countries;

    end_month = ((now.getFullYear() - start_date.getFullYear()) * 12) + (now.getMonth() + 1);
    setTable(end_month);

    // zero out future months for chart.
    for (i = end_month; i < goals.signups.counts.length; i++) {
      goals.signups.counts[i] = 0;
    }

    chart_item("facebook", count_months, end_month, true);
    chart_item("twitter", count_months, end_month);
    chart_item("signups", count_months, end_month);
    // chart_signups({
    //   labels: count_months,
    //   counts: counts,
    //   counts_total: counts_total,
    //   goals: goals.signups.counts
    // });
    chart_item("visits", count_months, end_month);
    chart_item("countries", count_months, end_month);
    $("#last-refresh").find("span").text((new Date()).toLocaleString());
  }

  function error(xhr, status) {
    console.log("Error getting dialog", name, "error:", status);
    // $.dialog.alert(lang.joinUs.errorMsg).autoClose(7000);
  }

  function get_data() {
    function done(req) {
      data.signups = req;
      set_data();
    }

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

  function get_facebook_data() {
    function done(req) {
      var m = new Date().getMonth();

      if (m >= 0 && m < 4) {
        actuals.facebook[m] = req.likes;
      }

      data.facebook = true;
      set_data();
    }

    // https://graph.facebook.com/GlobeOneCom
    jsonp("//graph.facebook.com/GlobeOneCom").done(done);
  }

  function get_twitter_data() {
    function done(req) {
      var last_month = -1, dates = req.followersperdate, key, month;

      // Get the last day of the month's followers count.
      // key is in dateYYYY-MM-DD format. key contains the cumalative number of
      // followers as of that day.
      // keys are in descending order.
      for (key in dates) {
        if (dates.hasOwnProperty(key)) {
          month = parseInt(key.substr(9, 2), 10);
          if (month !== last_month && month > 0 && month < 5) {
            last_month = month;
            actuals.twitter[month - 1] = dates[key];
          }
        }
      }

      data.twitter = true;
      set_data();
    }

    // http://api.twittercounter.com/?apikey=41f01c02e41893ebfa51d8ff3aa5e54e&twitter_id=2399318976
    jsonp("//api.twittercounter.com/?apikey=41f01c02e41893ebfa51d8ff3aa5e54e&twitter_id=2399318976&output=JSONP").done(done);
  }

  get_data();
  get_facebook_data();
  get_twitter_data();
  $("#refresh-btn").on("click", function (event) {
    event.preventDefault();
    location.reload();
  });

  // Reload every hour.
  setInterval(function () {
    location.reload();
  }, 1000 * 60 * 60);
}());
