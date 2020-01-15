import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import "./offences.css";

import { JWT } from "./form";

const ageParamData = [
  { id: "All Ages", value: "" },
  { id: "Adult", value: "age=Adult" },
  { id: "Juvenile", value: "age=Juvenile" }
];

const genderParamData = [
  { id: "All Genders", value: "" },
  { id: "Male", value: "gender=Male" },
  { id: "Female", value: "gender=Female" },
  { id: "Gender NS", value: "gender=Not Stated" }
];

const yearParamData = [
  { id: "01-19", value: "" },
  { id: "01", value: "year=2001" },
  { id: "02", value: "year=2002" },
  { id: "03", value: "year=2003" },
  { id: "04", value: "year=2004" },
  { id: "05", value: "year=2005" },
  { id: "06", value: "year=2006" },
  { id: "07", value: "year=2007" },
  { id: "08", value: "year=2008" },
  { id: "09", value: "year=2009" },
  { id: "10", value: "year=2010" },
  { id: "11", value: "year=2011" },
  { id: "12", value: "year=2012" },
  { id: "13", value: "year=2013" },
  { id: "14", value: "year=2014" },
  { id: "15", value: "year=2015" },
  { id: "16", value: "year=2016" },
  { id: "17", value: "year=2017" },
  { id: "18", value: "year=2018" },
  { id: "19", value: "year=2019" }
];

class Offences extends Component {
  constructor() {
    super();
    this.state = {
      offences: [],
      search: [],
      id: "",
      searchString: "",
      param1: "",
      param2: "",
      param3: "",
      showGrid: true,
      showGraph: false,
      showMap: false
    };
  }

  handleOffences = event => {
    event.preventDefault();

    fetch("https://cab230.hackhouse.sh/offences")
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(result => {
        this.setState({
          offences: result.offences
        });
        var appDiv = document.getElementById("offencesName");
        appDiv.innerHTML = "...";
      })
      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      });
  };
  searchChange = event => {
    this.setState({ searchString: event.target.value });
  };
  handleSearch = event => {
    event.preventDefault();

    if (JWT == null) {
      let appDiv = document.getElementById("offencesName");
      appDiv.innerHTML = "You must log in before accessing this data";
    }

    const old_id = event.target.value;
    //cant seem to get offences with '&' to be read. Problem with req.query
    const id = old_id.replace(/[&]/g, "");
    this.setState({ id: id });
    // console.log(str);

    let getParam = { method: "GET" };
    let head = { Authorization: `Bearer ${JWT}` };
    getParam.headers = head;

    //The URL
    const baseUrl = "https://cab230.hackhouse.sh/search?";
    const query = `offence=${id}`; //replace with str when testing backend
    const url = baseUrl + query;
    console.log(url);

    fetch(encodeURI(url), getParam)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(result => {
        this.setState({
          search: result.result
        });

        var appDiv = document.getElementById("offencesName");
        appDiv.innerHTML = `${id}`;
      })
      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      });
  };
  param1Change = event => {
    this.setState({ param1: event.target.value });
  };
  param2Change = event => {
    this.setState({ param2: event.target.value });
  };
  param3Change = event => {
    this.setState({ param3: event.target.value });
  };
  handleFilter = event => {
    event.preventDefault();
    const { param1, param2, param3, id } = this.state;

    // let filterExpanded = "";
    console.log(param1);
    console.log(param2);
    console.log(param3);
    console.log(id);
    //Example filter strings
    // if (filter === "area") {
    //   filterExpanded = "area=Moreton Bay Regional Council";
    // } else if (filter === "age") {
    //   filterExpanded = "age=Juvenile";
    // } else if (filter === "year") {
    //   filterExpanded = "year=2006,2007,2008";
    // } else {
    //   filterExpanded = "help";
    // }

    // console.log(filterExpanded);
    //The parameters of the call
    let getParam = { method: "GET" };
    let head = { Authorization: `Bearer ${JWT}` };
    getParam.headers = head;

    //The URL
    const baseUrl = "https://cab230.hackhouse.sh/search?";
    const query = `offence=${id}`;
    const url = baseUrl + query + "&" + param1 + "&" + param2 + "&" + param3;

    console.log(url);

    fetch(encodeURI(url), getParam)
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(result => {
        this.setState({
          search: result.result
        });
      })
      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      });
  };

  toggleGrid = () => {
    this.setState({
      showGrid: true,
      showGraph: false,
      showMap: false
    });
  };
  toggleGraph = () => {
    this.setState({
      showGrid: false,
      showGraph: true,
      showMap: false
    });
  };
  toggleMap = () => {
    this.setState({
      showGrid: false,
      showGraph: false,
      showMap: true
    });
  };

  render() {
    let newSearch = this.state.search;
    let searching = this.state.searchString.trim().toLowerCase();
    // updating the search filter
    if (searching.length > 0) {
      newSearch = newSearch.filter(function(data) {
        return data.LGA.toLowerCase().match(searching);
      });
    }
    // showing the graph
    const graphData = {
      labels: newSearch.map(data => [data.LGA]),
      datasets: [
        {
          label: `${this.state.id}`,
          backgroundColor: "#4ab584",
          data: newSearch.map(data => [data.total])
        }
      ]
    };

    return (
      <div>
        <div className="mainColumn">
          <h1>LGA Reported Offender Numbers</h1>
          <p id="offencesName">
            <button className="offencesBtn" onClick={this.handleOffences}>
              Click here to load offences...
            </button>
          </p>
          <button className="toggleBtn" onClick={this.toggleGrid}>
            Grid
          </button>
          <button className="toggleBtn" onClick={this.toggleGraph}>
            Graph
          </button>
          <button className="toggleBtn" onClick={this.toggleMap}>
            Map
          </button>
          <div className="filterArea">
            <select
              value={this.state.value}
              onChange={this.param1Change}
              className="param"
            >
              {ageParamData.map(data => {
                return (
                  <option key={data.id} value={data.value}>
                    {data.id}
                  </option>
                );
              })}
            </select>
            <select
              value={this.state.value}
              onChange={this.param2Change}
              className="param"
            >
              {genderParamData.map(data => {
                return (
                  <option key={data.id} value={data.value}>
                    {data.id}
                  </option>
                );
              })}
            </select>
            <select
              value={this.state.value}
              onChange={this.param3Change}
              className="param"
            >
              {yearParamData.map(data => {
                return (
                  <option key={data.id} value={data.value}>
                    {data.id}
                  </option>
                );
              })}
            </select>
            <button className="filterBtn" onClick={this.handleFilter}>
              GO
            </button>
            <input
              className="searchBar"
              type="text"
              value={this.state.searchString}
              onChange={this.searchChange}
              placeholder="Search areas..."
            />
          </div>

          {this.state.showGrid ? (
            <div>
              <table className="searchTable">
                <tbody>
                  <th id="LGA">LGA</th>
                  <th id="total">TOTAL</th>
                  {newSearch.map((data, i) => {
                    return (
                      <tr key={i}>
                        <td id="LGA">{data.LGA}</td>
                        <td id="total">{data.total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
          {this.state.showGraph ? (
            <div className="graphArea">
              <Bar ref="chart" data={graphData} />
            </div>
          ) : null}
          {this.state.showMap ? (
            <div className="mapArea">
              <Map center={[-27.47, 153.03]} zoom={7}>
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {newSearch.map(data => {
                  if (data.total === 0) return;
                  return (
                    <Marker position={[data.lat, data.lng]}>
                      <Popup>
                        {data.LGA} <br /> Total offences: {data.total}
                      </Popup>
                    </Marker>
                  );
                })}
              </Map>
            </div>
          ) : null}
        </div>
        <div className="sideColumn">
          <table className="offencesTable">
            <tbody>
              {this.state.offences.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <button
                        className="tableBtn"
                        value={data}
                        onClick={this.handleSearch}
                      >
                        {data}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// const offButton = document.getElementById("offBtn");

export default Offences;
