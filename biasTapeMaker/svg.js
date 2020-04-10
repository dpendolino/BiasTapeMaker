export {};
import { params, guides } from '../index.js';
import {GUIDE,LEFT,RIGHT,CENTER,STRIP,STRIPINNER,FOLD,FOLDINNER,SLIDE,FOLDOUT,BASE,SIDE,INDEX} from './const.js';

var NS="http://www.w3.org/2000/svg";
const svgElem = {
  RECT:"rect",
  PATH:"path",
  LINE:"line",
  GROUP:"g"
}


export function svg(w,h){
 var svg=document.createElementNS(NS,"svg");
 svg.setAttribute("width",Math.round(w));
 svg.setAttribute("height",h);
 return svg;
}

export function rect(x,y,w,h,fill){
   try {
       var SVGObj= document.createElementNS(NS,svgElem.RECT);
       SVGObj.width.baseVal.value=Math.round(w);
       SVGObj.height.baseVal.value=h;
       SVGObj.setAttribute("x",x);
       SVGObj.setAttribute("y",y);
       SVGObj.style.fill=fill;
       return SVGObj;
    } catch (err) {
    	console.log("rect("+x+", "+y+","+w+","+h+")");
    console.error(err);
    }
}
export function line(x1,y1,x2,y2,stroke){
 var SVGObj= document.createElementNS(NS,svgElem.LINE);
 SVGObj.setAttribute("x1",x1);
 SVGObj.setAttribute("x2",x2);
 SVGObj.setAttribute("y1",y1);
 SVGObj.setAttribute("y2",y2);
 SVGObj.setAttribute("stroke",stroke);
 return SVGObj;
}
//export function vLine(x,stroke,yFrom,yTo) {
export function vLine(p) {
  var xC, y1c, y2c;
  if (p.x===undefined) console.log("Missing required parameter: x");
  console.log(p);
  if (p.x.u) x=p.x.u;
  else xC=guides.v[p.x.side][p.x.guide].u;
  if (p.y1===undefined) y1c=0;
  else y1c=guides.h[p.y1.index].u;
  if (p.y2===undefined) y2c=params.page.height.u;
  else y2c=guides.h[p.y2.index].u;
	return line(xC,y1c,xC,y2c);
}

//export function hLine(y,stroke,xFrom,xTo) {
export function hLine(p) {
  var yC, x1c, x2c;
  if (p.y===undefined) console.log("Missing required parameter: y");
  //console.log(p);
  if (p.y.u) x=p.y.u;
  else yC=guides.h[p.y.index].u;
  if (p.x1===undefined) x1c=0;
  else {
    let SIDE=p.x1.SIDE;
    if (p.x1.SIDE==LEFT) SIDE=LEFT;
    else if (p.x1.SIDE==RIGHT) SIDE=RIGHT;
    console.log("p.x1:  ",p.x1)
    //console.log("p.x1.SIDE:  ",p.x1.SIDE)
    //console.log("p.x1.GUIDE:  ",p.x1.GUIDE)
    console.log("guides.v[SIDE]: ",guides.v[SIDE]);
    console.log("guides.v[SIDE][p.x1.GUIDE]: ",guides.v[SIDE][p.x1.GUIDE]);
    //console.log("guides.v[LEFT]: ",guides.v[LEFT][p.x1.GUIDE]);
    x1c=guides.v[SIDE][p.x1.GUIDE].u;
  }
  if (p.x2===undefined) x2c=params.page.width.u;
  else x2c=guides.v[p.x2.SIDE][p.x2.GUIDE].u;
	return line(x1c,yC,x2c,yC);
}



export function group(name){
 var SVGObj= document.createElementNS(NS,svgElem.GROUP);
 SVGObj.setAttribute("id",name);
 return SVGObj;
}

export function path(d,name) {
  var SVGObj = document.createElementNS(NS,svgElem.PATH);
  SVGObj.setAttribute("d",d);

  SVGObj.addToPath = function(pathCommands) {
    this.d+=pathCommands;
  }
  return SVGObj;
}

export function guideRect(p){
  var x1, y1, x2, y2, w, h, fill;
  var x1computed, y1computed, wComputed, hComputed;
  if (
    p.x1===undefined||
    p.y1===undefined
  ) {
    console.log("Missing one or more required parameters: x1, y1")
  }
  x1=p.x1;
  y1=p.y1
  x1computed=guides.v[x1.side][x1.guide].u;
  y1computed=guides.h[y1.index].u;
  //console.log("x1c: ("+x1computed+"); y1c: ("+y1computed+")");

  if (p.x2 && p.y2) {
    x2=p.x2;
    y2=p.y2;
    wComputed = guides.v[x2.side][x2.guide].u-x1computed;
    hComputed = guides.h[y2.index].u-y1computed;
  } else if (p.w && p.h) {
    wComputed=p.w.u;
    hComputed=p.h.u;
  } else {
    console.log("Missing one or more conditionally required parameters. Must supply either (x2, y2) or (w, h).");
  }
  //console.log("wc: ("+wComputed+"); hc: ("+hComputed+")");
  return rect(x1computed,y1computed,wComputed,hComputed,fill);
}



const cmdType={
  ABS:"absolute",
  REL:"relative"
};
const rt=/{}/;
const pathCmds={
  M:{
    cmdType:cmdType.ABS,
    cmdString:"M{},{} ",
    cmdReplace:{x:rt,y:rt}},
  H:{
    cmdType:cmdType.ABS,
    cmdString:"H{} ",
    cmdReplace:{x:rt}},
  V:{
    cmdType:cmdType.ABS,
    cmdString:"V{} ",
    cmdReplace:{y:rt}},
  L:{
    cmdType:cmdType.ABS,
    cmdString:"L{},{} ",
    cmdReplace:{x:rt,y:rt}},
  m:{
    cmdType:cmdType.REL,
    cmdString:"m{},{} ",
    cmdReplace:{dx:rt,dy:rt}},
  h:{
    cmdType:cmdType.REL,
    cmdString:"h{} ",
    cmdReplace:{dx:rt}},
  v:{
    cmdType:cmdType.REL,
    cmdString:"v{} ",
    cmdReplace:{dy:rt}},
  l:{
    cmdType:cmdType.REL,
    cmdString:"l{},{} ",
    cmdReplace:{dx:rt,dy:rt}},
  z:{
    cmdType:cmdType.REL,
    cmdString:"z ",
    cmdReplace:{}}
};

export function pathCmdList(cmds) {
  var d="";
  for (let i=0;i<cmds.length;i++) d+=pathCmd(cmds[i]);
  return d;
}

export function pathCmd(p) {
  if (p.cmd===undefined) console.log("Missing required parameter: cmd");
  if (pathCmds[p.cmd]===undefined) console.log("Unrecognized path command supplied: "+p.cmd);
  const cmd=pathCmds[p.cmd];
  var rStr=cmd["cmdString"];
  const req = cmd["cmdReplace"];
  const type=cmd["cmdType"];
  for (const repl in req) {
    if (p[repl]===undefined) console.log("Missing conditionally required parameter. Path command ",p.cmd," requires parameter ",repl,".");
    var replComputed;
    //console.log(repl,":  ",p[repl]);
    if (typeof p[repl]==="number") replComputed=p[repl];
    else if (typeof p[repl]==="object") {
      if (p[repl].u && type==cmdType.REL) {
        //console.log("Provided unit object ",p[repl]," to relative path.");
        replComputed=p[repl].u;
      }
      else if (p[repl].u && type==cmdType.ABS) {
        console.log("Provided unit object ",p[repl]," to absolute path.");
        replComputed=p[repl].u;
      }
      else {
        //console.log("Provided object",p[repl]," to ",type," path.");
        //console.log("Here's your input:", p[repl])
        var gId=p[repl];
        if (repl=="x" || repl=="dx") replComputed=guides.v[gId.side][gId.guide].u;
        else if (repl=="y" || repl=="dy") replComputed=guides.h[gId.index].u;
        else console.log("Not sure what to do with this. Param not in x, y, dx, dy.")
      }
    } 
    else console.log("pathCmd doesn't know how to handle values of type ",typeof p[repl],"...object received: ",p[repl]);

    rStr=rStr.replace(req[repl],replComputed);
  }
  return rStr;
}
