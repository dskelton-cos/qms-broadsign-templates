/*global BroadSignObject*/
/*eslint no-undef: ["error", { "typeof": true }] */
import "./style/main.scss";

import { debug, showDebugOuput } from "../src/assets/js/helpers";

let mustache = require("mustache");

let occurance =
  typeof BroadSignObject !== "undefined" &&
  BroadSignObject.hasOwnProperty("whatsonOccurance")
    ? BroadSignObject["whatsonOccurance"]
    : "today";

let localJson = `file:///C:/ProgramData/BroadSign/bsp/share/bsp/sync/whatson_${occurance}.json`;
let remoteJson = `https://cos-express-api.web.app/whatson/events/comms_pylon?qrcode=true&base64=true&eventlimit=8&eventoccuring=${occurance}`;
let env = process.env.NODE_ENV;
let apiSource = env === "development" ? remoteJson : localJson;

function renderHTML(item) {
  let template = document.getElementById("mustacheTemplate").innerHTML;
  let occText = document.getElementById("occuranceText");
  let rendered = mustache.render(template, item);
  document.getElementById("target").innerHTML = rendered;

  switch (occurance) {
    case "thisweek":
      occText.innerHTML = "this week";
      break;
    case "weekend":
      occText.innerHTML = "this weekend";
      break;
    default:
      break;
  }

  if (debug === true) {
    showDebugOuput(apiSource, env);
  }
}

function populate(data, callbackRenderHTML) {
  let played = localStorage.getItem(`${occurance}_played`);
  let totalevents = data.length;
  let pickedItem = played ? played : 0;

  callbackRenderHTML(data[pickedItem]);

  if (totalevents - 1 <= pickedItem) {
    localStorage.setItem(`${occurance}_played`, 0);
  } else {
    played++;
    localStorage.setItem(`${occurance}_played`, played);
  }
}

function readTextFile(apiSource, callbackPopulate) {
  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", apiSource, false);
  rawFile.setRequestHeader("Content-Type", "application/json");
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        let data = JSON.parse(rawFile.responseText);
        callbackPopulate(data.data, renderHTML);
      } else {
        callbackPopulate(localFallback);
      }
    }
  };
  rawFile.send(null);
}

readTextFile(apiSource, populate);
