/*global BroadSignObject*/

export let debug =
  typeof BroadSignObject !== "undefined" &&
  BroadSignObject.hasOwnProperty("debug")
    ? BroadSignObject["debug"]
    : false;

export function showDebugOuput(apiSource, env) {
  let ele = document.getElementById("debug");
  let played = localStorage.getItem(`news_played`);
  ele.innerHTML = `<div class="debug-inner">Source: ${apiSource} <br> env: ${env} <br> localstorage: ${played}</div>`;
}
