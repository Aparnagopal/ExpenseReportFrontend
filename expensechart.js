google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(fetchJSONData);

// Set Data
function fetchJSONData() {
  fetch("./data.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data[0].amount);
      var datavis = new google.visualization.DataTable();
      datavis.addColumn("string", "Day");
      datavis.addColumn("number", "Amount");
      datavis.addColumn({
        role: "tooltip",
        p: { html: true },
      });
      datavis.addColumn({ type: "string", role: "style" });
      var len = data.length;
      console.log("length of array:" + len);
      //datavis.addRows(len);
      const d = new Date();
      let day = d.getDay();
      console.log("day" + d);
      for (var i = 0; i < len; i++) {
        if (i === day)
          datavis.addRow([
            data[i].day,
            data[i].amount,
            "$" + data[i].amount,
            "color:#e5e4e2",
          ]);
        else
          datavis.addRow([
            data[i].day,
            data[i].amount,
            "$" + data[i].amount,
            "",
          ]);
        // datavis.setValue(i, 0, data[i].day);
        // datavis.setValue(i, 1, data[i].amount);
      }
      //var datavis = google.visualization.arrayToDataTable([
      // ["Country", "Mhl", { role: "tooltip", p: { html: true } }],
      // ["Italy", 54.8, "54.8T"],
      // ["France", 48.6, "54.8T"],
      // ["Spain", 44.4, "54.8T"],
      // ["USA", 23.9, "54.8T"],
      // ["Argentina", 14.5, "54.8T"],
      //]);

      // Set Options
      var chartColor = "#ec775f";
      var options = {
        title: "Spending - Last 7 days",
        tooltip: { isHtml: true },
        allowHtml: true,
        vAxis: {
          textPosition: "none",
          baselineColor: "none",
          gridlines: { count: 0 },
        },
        legend: { position: "none" },
        colors: [chartColor],
      };

      // Draw

      var container = document.getElementById("columnchart_material");
      var chart = new google.visualization.ColumnChart(container);

      google.visualization.events.addListener(
        chart,
        "ready",
        changeBorderRadius
      );

      google.visualization.events.addListener(
        chart,
        "select",
        changeBorderRadius
      );
      google.visualization.events.addListener(
        chart,
        "onmouseover",
        chartMouseOver
      );
      google.visualization.events.addListener(
        chart,
        "onmouseout",
        chartMouseOut
      );
      chart.draw(datavis, options);

      function changeBorderRadius() {
        chartColumns = container.getElementsByTagName("rect");
        console.log("chart column" + chartColumns);
        Array.prototype.forEach.call(chartColumns, function (column) {
          column.setAttribute("rx", 5);
          column.setAttribute("ry", 5);
        });
      }

      function setBarOpacity(index, opacity) {
        var chart1 = new google.visualization.ColumnChart(
          document.getElementById("columnchart_material")
        );
        // filter bars by fill color
        var chartBars = chart1
          .getContainer()
          .querySelectorAll('rect[fill="' + chartColor + '"]');

        // console.log("chartBars" + chartBars[index]);

        // set opacity on index provided
        chartBars[index].setAttribute("opacity", opacity);
      }

      function chartMouseOver(sender) {
        changeBorderRadius();
        // set opacity to 0.5

        setBarOpacity(sender.row, 0.5);
      }

      // chart mouseout event
      function chartMouseOut(sender) {
        // set opacity to 1
        changeBorderRadius();
        setBarOpacity(sender.row, 1);
      }
    })
    .catch((error) => console.error("Unable to fetch data:", error));
}

//console.log("expdata:" + data[0].amount);
