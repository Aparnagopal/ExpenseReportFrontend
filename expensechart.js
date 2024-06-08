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
      //console.log("length of array:" + len);
      //datavis.addRows(len);
      const d = new Date();
      let day = d.getDay();
      if (day === 0) day = 6;
      else day = day - 1;
      //console.log("day" + d);
      for (var i = 0; i < len; i++) {
        if (i === day)
          datavis.addRow([
            data[i].day,
            data[i].amount,
            "$" + data[i].amount,
            "color:#76B5BC",
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
      var width = 0.3 * window.innerWidth;
      var height = 0.4 * window.innerHeight;
      var chartColor = "#ec775f";
      var options = {
        title: "Spending - Last 7 days",
        backgroundColor: "#FFFAF5",
        width: width,
        height: height,
        chartArea: { left: "5%", right: "5%", top: "25%", bottom: "10%" },
        bar: { groupWidth: "68%" },
        titleTextStyle: {
          color: "#382314",
          fontName: "DM Sans",
          fontSize: 24,
        },
        tooltip: { isHtml: true },
        allowHtml: true,
        vAxis: {
          textPosition: "none",
          baselineColor: "none",
          gridlines: { count: 0 },
        },
        hAxis: {
          textStyle: { color: "#93867B", fontName: "DM Sans" },
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
      chart.clearChart();
      chart.draw(datavis, options);

      //window.addEventListener("resize", fetchJSONData, false);

      function changeBorderRadius() {
        chartColumns = container.getElementsByTagName("rect");
        //console.log("chart column" + chartColumns);
        Array.prototype.forEach.call(chartColumns, function (column) {
          column.setAttribute("rx", 6);
          column.setAttribute("ry", 6);
          column.setAttribute("stroke", "none");
          column.setAttribute("stroke-width", 0);
        });
      }

      function setBarOpacity(index, opacity) {
        var chart1 = new google.visualization.ColumnChart(
          document.getElementById("columnchart_material")
        );
        // filter bars by fill color
        var chartBars = chart1
          .getContainer()
          .querySelectorAll(
            'rect[fill="' + "#ec775f" + '"],rect[fill="' + "#76b5bc" + '"]'
          );

        // console.log("chartBars" + chartBars[index]);
        // chartBars[index].setAttribute("stroke", "none");
        //chartBars[index].setAttribute("stroke-width", 0);
        // set opacity on index provided
        chartBars[index].setAttribute("opacity", opacity);
      }

      function chartMouseOver(sender) {
        changeBorderRadius();
        // set opacity to 0.5

        setBarOpacity(sender.row, 0.8);

        // ensure point is hovered
        if (sender.row !== null) {
          var padding = 16;
          var chartLayout = chart.getChartLayoutInterface();
          var pointBounds = chartLayout.getBoundingBox(
            "point#" + (sender.column - 1) + "#" + sender.row
          );
          var tooltip = chart
            .getContainer()
            .getElementsByClassName("google-visualization-tooltip");
          if (tooltip.length > 0) {
            var tooltipBounds = tooltip[0].getBoundingClientRect();
            tooltip[0].style.top =
              pointBounds.top - tooltipBounds.height - padding + "px";
            tooltip[0].style.left =
              pointBounds.left +
              pointBounds.width / 2 -
              tooltipBounds.width / 2 +
              "px";
          }
        }
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
