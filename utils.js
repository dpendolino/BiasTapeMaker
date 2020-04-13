export { unitObj, rawMeas, uMeas, debug, meas};
import {units} from './config.js';

//var units=params.units;
function debug(msg){
    document.body.appendChild(document.createElement("p")).innerHTML+=msg;
};
function meas(raw,u) {
  this.raw=raw;
  this.u=u;
}
function rawMeas(raw) {
  return new meas(raw,Math.round(units.to(raw)));
}
function uMeas(u) {
  return new meas(
    units.from(u),
    u);
}
function unitObj(raw) {
  this.raw=raw;
  this.u=Math.round(units.to(raw));
  };