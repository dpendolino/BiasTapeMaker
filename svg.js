export {
  //pathCmd,
  svg,
  rect,
  line,
  vLine,
  hLine,
  group,
  path,
  guideRect,
  pathCmdList,
  text,
  setSvgAttributes};

import { params, guides,LEFT,RIGHT,CENTER,SIDES,
  FOLD,FOLDINNER,FOLDOUT,STRIP,STRIPINNER,EDGE,REFS,
  SLIDE,GUIDE,BASE,SECTIONS,
  FILL,STYLE,TEXTANCHOR,
  SIDE,INDEX,X,Y,style } from './index.js';

var NS="http://www.w3.org/2000/svg";
const svgElem = {
  RECT:"rect",
  PATH:"path",
  LINE:"line",
  GROUP:"g",
  TEXT:"text"
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
    cmdReplace:{}},
  A:{
  	cmdType:cmdType.ABS,
      cmdString:"A {} {} {} {} {} {} {}",
      cmdReplace:{rx:rt,ry:rt,angle:rt,
        largeArc:rt, sweep:rt,x:rt,y:rt},
      cmdDefaults:{angle:0,largeArc:0, sweep:0}},
  a:{
  	cmdType:cmdType.REL,
      cmdString:"a {} {} {} {} {} {} {}",
      cmdReplace:{rx:rt,ry:rt,angle:rt,
        largeArc:rt, sweep:rt,dx:rt,dy:rt},
      cmdDefaults:{angle:0,largeArc:0, sweep:0}}
};
function svg(w,h){
 var svg=document.createElementNS(NS,"svg");
 svg.setAttribute("width",Math.round(w));
 svg.setAttribute("height",h);
 return svg;
}
function rect(x,y,w,h,fill){
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
      console.trace();
      console.error(err);
    }
}
function line(x1,y1,x2,y2,stroke) {
 var SVGObj= document.createElementNS(NS,svgElem.LINE);
 SVGObj.setAttribute("x1",x1);
 SVGObj.setAttribute("y1",y1);
 SVGObj.setAttribute("x2",x2);
 SVGObj.setAttribute("y2",y2);
 SVGObj.setAttribute("stroke",stroke);
 return SVGObj;
}
function vLine(p) {
  var xC, y1c, y2c;
  if (p.x===undefined) console.log("Missing required parameter: x");
  if (p.x.u) x=p.x.u;
  else xC=guides.ax(X).side(p.x.SIDE).ref(p.x.REF).u;
  if (p.y1===undefined) y1c=0;
  else y1c=guides.ax(Y).index(p.y1.INDEX).u;
  if (p.y2===undefined) y2c=params.page.height.u;
  else y2c=guides.ax(Y).index(p.y2.INDEX).u;
	return line(xC,y1c,xC,y2c);
}
function hLine(p) {
  var yC, x1c, x2c;
  if (p.y===undefined) console.log("Missing required parameter: y");
  if (p.y.u) x=p.y.u;
  else yC=guides.ax(Y).index(p.y.INDEX).u;
  if (p.x1===undefined) x1c=0;
  else x1c=guides.ax(X).side(p.x1.SIDE).ref(p.x1.REF).u;
  if (p.x2===undefined) x2c=params.page.width.u;
  else x2c=guides.ax(X).side(p.x2.SIDE).ref(p.x2.REF).u;
	return line(x1c,yC,x2c,yC);
}
function group(name){
 var SVGObj= document.createElementNS(NS,svgElem.GROUP);
 SVGObj.setAttribute("id",name);
 return SVGObj;
}
function path(d,name) {
  var SVGObj = document.createElementNS(NS,svgElem.PATH);
  SVGObj.setAttribute("d",d);
  SVGObj.addToPath = function(pathCommands) {
    this.d+=pathCommands;
  }
  return SVGObj;
}
function guideRect(p){
  var x1, y1, x2, y2, w, h, fill;
  var x1computed, y1computed, wComputed, hComputed;
  if (p.x1===undefined || p.y1===undefined) console.log("Missing one or more required parameters: x1, y1")
  x1=p.x1;
  y1=p.y1;
  if (typeof x1==="number") x1computed=x1;
  else x1computed=guides.ax(X).side(x1.SIDE).ref(x1.REF).u;
  if (typeof y1==="number") y1computed=y1;
  else y1computed=guides.ax(Y).index(y1.INDEX).u;
  if (p.x2 && p.y2) {
    x2=p.x2;
    y2=p.y2;
    wComputed = guides.ax(X).side(x2.SIDE).ref(x2.REF).u-x1computed;
    hComputed = guides.ax(Y).index(y2.INDEX).u-y1computed;
  } else if (p.w && p.h) {
    if (typeof p.w=="number") wComputed=p.w;
    else wComputed=p.w.u;
    if (typeof p.h=="number") hComputed=p.h;
    else hComputed=p.h.u;
  } else console.log("Missing one or more conditionally required parameters. Must supply either (x2, y2) or (w, h).");
  return rect(x1computed,y1computed,wComputed,hComputed,fill);
}
function pathCmdList(cmds) {
  var d="";
  for (let i=0;i<cmds.length;i++) d+=pathCmd(cmds[i]);
  return d;
}
function pathCmd(p) {
  if (p.cmd===undefined) console.log("Missing required parameter: cmd");
  if (pathCmds[p.cmd]===undefined) console.log("Unrecognized path command supplied: "+p.cmd);
  const cmd=pathCmds[p.cmd];
  var rStr=cmd["cmdString"];
  const req = cmd["cmdReplace"];
  const type=cmd["cmdType"];
  var replComputed;
    for (const repl in req) {
    if (p[repl]===undefined) {
        if (cmd["cmdDefaults"]===undefined
            ||  cmd["cmdDefaults"][repl]===undefined) {
                console.log("Missing conditionally required parameter. Path command ",
                p.cmd," requires parameter ",repl,".");
                }
    	else {
    	    replComputed=cmd["cmdDefaults"][repl];
    	}
    }
    else if (typeof p[repl]==="number"||typeof p[repl]==="string") replComputed=p[repl];
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
        var gId=p[repl];
        if (repl=="x" || repl=="dx") replComputed=guides.ax(X).side(gId.side).ref(gId.ref).u;
        else if (repl=="y" || repl=="dy") replComputed=guides.ax(Y).index(gId.index).u;
        else console.log("Not sure what to do with this. Param not in x, y, dx, dy.")
      }
    } 
    else console.log("pathCmd doesn't know how to handle values of type ",typeof p[repl],"...object received: ",p[repl]);

    rStr=rStr.replace(req[repl],replComputed);
  }
  return rStr;
}
function text(text,id,p) { 
  var SVGObj= document.createElementNS(NS, svgElem.TEXT);
  SVGObj.setAttribute("id",id);
  SVGObj.innerHTML=text;
  for (let attr in p) {
    if (attr==FILL||attr==X||attr==Y||attr==STYLE||attr==TEXTANCHOR) {
      SVGObj.setAttribute(attr,p[attr]);
    }
  }
  return SVGObj;
}
function setSvgAttributes(svgObj,type) {
  var styles;
  if (type=="cut") styles=style.cut;
  else if (type=="cutout") styles=style.cutout;
  else if (type=="fold") styles=style.fold;
  else if (type=="reinforce") styles=style.reinforce;
  for (let attr in styles) svgObj.setAttribute(attr,styles[attr]);
}
