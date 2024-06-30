import { Box } from "@mui/material";
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { formatLabel } from "src/helpers";

interface PlotData {
  x: number[];
  y: number[];
  percentBasePeak: number[];
  color: string[];
  label: string[];
  labelCharge: number[];
  neutralLosses: string[];
  barwidth: number[];
  massError: (string | number)[];
  theoMz: number[];

  TIC: number;
}

interface PlotDatum {
  mz: number;
  intensity: number;
  percentBasePeak: number;
  color: string;
  label: string;
  width: number;
  massError: string | number;
  theoMz: number;
  x: number; // These should be the updated coordinates from dragging
  y: number;
}

interface Peptide {
  scanNumber: number;
  precursorMz: number;
  sequence: string;
  precursorCharge: number;
  mods: { site: number; deltaElement: string | null; deltaMass: number }[];
}

interface Settings {
  toleranceType: string;
  toleranceThreshold: number;
  ionizationMode: string;
}

interface AnnotatedSpectrumProps {
  plotdata?: PlotData;
  peptide?: Peptide;
  settings?: Settings;
}

const AnnotatedSpectrum: React.FC<AnnotatedSpectrumProps> = ({
  plotdata,
  peptide,
  settings,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const superscript = [
    "\u2070",
    "\u00B9",
    "\u00B2",
    "\u00B3",
    "\u2074",
    "\u2075",
    "\u2076",
    "\u2077",
    "\u2078",
    "\u2079",
  ];
  const subscript = [
    "\u2080",
    "\u2081",
    "\u2082",
    "\u2083",
    "\u2084",
    "\u2085",
    "\u2086",
    "\u2087",
    "\u2088",
    "\u2089",
  ];

  const containsLabelTick = (obj: any, list: any[]): boolean => {
    for (const item of list) {
      if (item.text === obj.text && item.location === obj.location) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (!plotdata || !peptide || !settings) return;

    // Clear existing SVG to prevent duplication
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 595;
    const margin = { top: 10, right: 15, bottom: 35, left: 60 };

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xMin = d3.min(plotdata.x) ?? 0;
    const xMax = d3.max(plotdata.x) ?? 1;
    const yMax = 100; // Since y axis is scaled to % relative abundance, yMax will always be 100%

    x.domain([xMin - (xMax - xMin) * 0.05, xMax + (xMax - xMin) * 0.05]);
    y.domain([0, yMax + yMax * 0.05]);

    const xAxis = d3.axisBottom(x).ticks(10);
    const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d3.format("0.2r"));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-5.1em")
      .attr("dx", "-20em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Relative Abundance (%)");

    const plotData = plotdata.x.map((mz, i) => ({
      mz,
      intensity: plotdata.y[i],
      percentBasePeak: plotdata.percentBasePeak[i],
      color: plotdata.color[i],
      label: formatLabel(
        plotdata.label[i],
        plotdata.neutralLosses[i],
        plotdata.labelCharge[i],
        settings.ionizationMode
      ),
      width: plotdata.barwidth[i] * width * 0.001,
      massError: plotdata.massError[i],
      theoMz: plotdata.theoMz[i],
      x: x(mz), // Add x position for label
      y: y(plotdata.percentBasePeak[i]) - 20, // Adjust y position for label (above the peak)
    }));

    svg
      .selectAll(".bar")
      .data(plotData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.mz) - d.width / 2)
      .attr("y", (d) => y(d.percentBasePeak))
      .attr("width", (d) => d.width)
      .attr("height", (d) => height - y(d.percentBasePeak))
      .attr("fill", (d) => d.color);

    // Ensure the drag behavior is correctly typed for the elements it's applied to
    const drag = d3
      .drag<SVGTextElement, PlotDatum>()
      .on("start", function (event, d) {
        // Optional: Implement logic to handle the start of a drag
      })
      .on("drag", function (event, d) {
        const newX = event.x;
        const newY = event.y;

        d3.select(this).attr("x", newX).attr("y", newY);

        d.x = newX; // Update the data bound to the label
        d.y = newY; // Update the data bound to the label
      });

    // Apply the drag behavior and draw initial lines
    svg
      .selectAll<SVGTextElement, PlotDatum>(".label")
      .data(plotData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.mz))
      .attr("y", (d) => y(d.percentBasePeak) - 25)
      .text((d) => d.label)
      .call(drag);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "10px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 2px 10px rgba(0,0,0,0.1)");

    svg
      .selectAll(".bar")
      .on("mouseenter", function (event, d: any) {
        tooltip.style("visibility", "visible").html(`
            <strong>Fragment:</strong> ${d.label} <br>
            <strong>m/z:</strong> ${d3.format(",.4f")(d.mz)} <br>
            <strong>Relative Abundance:</strong> ${d3.format("0.2f")(
              d.percentBasePeak
            )}% <br>
            <strong>% TIC:</strong> ${d3.format("0.2%")(
              d.intensity / d3.sum(plotData.map((p) => p.intensity))
            )} <br>
            <strong>Associated Glycan:</strong> ${d3.format("0.2%")(
              d.intensity / d3.sum(plotData.map((p) => p.intensity))
            )}
          `);
        d3.select(this).attr("stroke", "black");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("stroke", "none");
      });

    return () => {
      tooltip.remove();
    };
  }, [plotdata, peptide, settings]);

  return (
    <Box className="content">
      <svg ref={svgRef} />
    </Box>
  );
};

export default AnnotatedSpectrum;
