export {
  //pathCmd,
  svg,
  line,
  vLine,
  hLine,
  group,
  path,
  pathCmdList,
  text,
  setSvgAttributes,
  svgRect};

import { params, guides,style,
  LEFT,RIGHT,CENTER,SIDES,
  FOLD,FOLDINNER,FOLDOUT,STRIP,STRIPINNER,EDGE,REFS,
  SLIDE,GUIDE,BASE,SECTIONS,
  FILL,STYLE,TEXTANCHOR,
  SIDE,INDEX,X,Y,SVGATTRS 
  } from './index.js';

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
function logError(s) {
  console.log(s);
  console.trace();
}
function svgRect(p) {
  const req = {x1:true,y1:true,id:true,oneof:[["x2","width"],["y2","height"]]}
  checkRequired(p,req)
  var SVGObj= document.createElementNS(NS,svgElem.RECT);
  var computed={}
  for (const attr in p) {
    if (attr=="x1"||attr=="x2") computed[attr]=processUnits(p[attr],X)
    else if (attr=="y1"||attr=="y2") computed[attr]=processUnits(p[attr],Y)
    else if (attr=="width"||attr=="height") computed[attr]=processUnits(p[attr])
  }
  if (computed.x2!==undefined) {
    computed.x = Math.min(computed.x1,computed.x2);
    computed.width = Math.abs(computed.x1-computed.x2)
  }
  else computed.x = computed.x1; 
  delete computed.x1;
  delete computed.x2;
  if (computed.y2!==undefined) {
    computed.y = Math.min(computed.y1,computed.y2);
    computed.height = Math.abs(computed.y1-computed.y2)
  }
  else computed.y = computed.y1; 
  delete computed.y1;
  delete computed.y2;
  const posSize=["x","y","width","height"];
  for (const i in posSize) SVGObj.setAttribute(posSize[i],computed[posSize[i]])
  if (p.styletype!==undefined) setSvgAttributes(SVGObj,p.styletype);
  for (const i in SVGATTRS) {
    const attr=SVGATTRS[i];
    if (p[attr]!==undefined) {
      SVGObj.setAttribute(attr,p[attr])
    }
  }
  return SVGObj;
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
  else if (type=="frame") styles=style.frame;
  for (let attr in styles) svgObj.setAttribute(attr,styles[attr]);
}

function processUnits(measurement,axis) {
  var computed;
  if (typeof measurement=="number") computed=measurement;
  else if (measurement.u!==undefined) computed=measurement.u;
  else if (axis==X 
    && measurement.SIDE!==undefined 
    && measurement.REF!==undefined) computed=guides.ax(X).side(measurement.SIDE).ref(measurement.REF).u;
  else if (axis==Y && measurement.INDEX!==undefined) computed=guides.ax(Y).index(measurement.INDEX).u;
  else {
    console.log(measurement)
    logError("this doesn't look like a number, a unit object, or a guide id - don't know what to do with it.")
    return false;
  }
  return computed;
}

function checkRequired(p,req) {
  for (const item in req) if (req[item]===true && p[item]===undefined) logError(item+" is required.")
  for (let i in req.oneof) {
    let oneof=req.oneof[i];
    let found=0;
    for (let j in oneof) {
      if (p[oneof[j]]!==undefined) found++;
    }
    if (found!=1) logError("exactly one of "+oneof+" is required.")
  }
}