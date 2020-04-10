import {Guides,Sections} from './biasTapeMaker/structure.js';
import {unitObj} from './biasTapeMaker/utils.js';
import {svg,group,rect,hLine,vLine,path,guideRect, pathCmdList} from './biasTapeMaker/svg.js';
import {GUIDE,LEFT,RIGHT,CENTER,STRIP,STRIPINNER,FOLD,FOLDINNER,SLIDE,FOLDOUT,BASE,SIDE,INDEX} from './biasTapeMaker/const.js';

/*
export const LEFT="left";
export const RIGHT="right";
export const CENTER="center";
export const FOLD="fold";
export const FOLDINNER="foldInner";
export const FOLDOUT="foldOut";
export const STRIP="strip";
export const STRIPINNER="stripInner";
export const EDGE="edge";
export const SLIDE="slide";
export const GUIDE="guide";
export const BASE="base";
*/

// PARAMETERS
var page, stripWidth, finishedWidth, 
    foldWidth, inner, tapeType, slideLength,
    panelWidth, baseWidth;
export var units={
    x:100,
    label:"inch",
    to:function(meas) {
        return(meas*this.x); 
    }
};
const cutoutFill="#ddd";
const black="#000";
const guideStroke="#888";
const foldStrokeDash="10,5,3,5";
const foldStroke="#000";
const foldStrokeWidth="2";
const cutStroke="#000";
const cutStrokeWidth="2";

page = {width: new unitObj(8.5),height: new unitObj(11)};    
stripWidth = new unitObj(1.25);
finishedWidth = new unitObj(stripWidth.raw/4+.1);
foldWidth = new unitObj((stripWidth.raw - 2*finishedWidth.raw)/2);
inner = new unitObj(.02);
slideLength= new unitObj(4);
panelWidth= new unitObj(page.width.raw/3-inner.raw);
baseWidth= new unitObj(page.width.raw-2*panelWidth.raw);
var hGuideSep = new unitObj(.25);
var offset = new unitObj(baseWidth.raw*.5);
export var params = {
    page:page,
    stripWidth:stripWidth,
    finishedWidth:finishedWidth,
    foldWidth:foldWidth,
    inner:inner,
    slideLength:slideLength,
    panelWidth:panelWidth,
    baseWidth:baseWidth,
    hGuideSep:hGuideSep,
    offset:offset};

var p = document.createElement("p")
p.innerHTML = "This is a test.";
document.body.appendChild(p);

export var guides = new Guides();
guides.calculate(params);

var svgDrawing = svg(page.width.u,page.height.u);
document.body.appendChild(svgDrawing);

var sections = new Sections(params);

//draw the main SVG
for (let i=0; i<sections.count; i++) {
  var sect = sections.array[i];
  var groupObj = group(sect.name);
  groupObj.setAttribute("transform","translate("+sect.offset.u+" "+0+")");
  svgDrawing.appendChild(groupObj);

  var frame = rect(0,0,baseWidth.u,page.height.u,sect.fill);
  frame.setAttribute("id",sect.name+"-frame")
  //console.log(frame);
  groupObj.appendChild(frame);

  for (let j=0; j<guides.v.count; j++) {
    var thisSide=guides.v.array[j].name;
    for (let k=0; k<guides.v.array[j].count; k++) {
      var thisGuide=guides.v.array[j].array[k].name;
      var guide = vLine({x:{side:thisSide,guide:thisGuide}});
      guide.setAttribute("id",(thisSide+"-"+thisGuide));
      guide.setAttribute("stroke",(guideStroke));
      groupObj.append(guide);
    }
  }
}
var slideStart = 5;
  var slideEnd = 19;
  var guideEnd = 30;
  
function drawGuide(parent) {
  var aRect = rect(guides.v.left.strip.u,guides.h[1].u,stripWidth.u,hGuideSep.u,cutoutFill);
  aRect.setAttribute("id","guide-cutout-1");
  aRect.setAttribute("stroke",black);
  parent.appendChild(aRect);

  var bRect = rect(guides.v.left.strip.u,guides.h[3].u,stripWidth.u,hGuideSep.u,cutoutFill);
  bRect.setAttribute("id","guide-cutout-2");
  bRect.setAttribute("stroke",black);
  parent.appendChild(bRect);

  var d;
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT,guide:STRIP},y:{index:guideEnd}},
    {cmd:"V",y:{index:slideEnd-1}},
    {cmd:"L",x:{side:LEFT,guide:STRIP},y:{index:slideStart}},
    {cmd:"H",x:{side:LEFT,guide:STRIPINNER}},
    {cmd:"V",y:{index:slideStart+1}},
    {cmd:"L",x:{side:LEFT,guide:FOLDINNER},y:{index:slideEnd}},
    {cmd:"V",y:{index:guideEnd}},
    {cmd:"H",x:{side:RIGHT,guide:FOLDINNER}},
    {cmd:"V",y:{index:slideEnd-1}},
    {cmd:"L",x:{side:RIGHT,guide:STRIPINNER},y:{index:slideStart+1}},
    {cmd:"V",y:{index:slideStart}},
    {cmd:"H",x:{side:RIGHT,guide:STRIP}},
    {cmd:"V",y:{index:guideEnd}},
    {cmd:"z"}
  ]);
  var cPath = path(d,GUIDE+"-cutout-3");
  cPath.setAttribute("fill",cutoutFill);
  cPath.setAttribute("stroke",black);
  parent.appendChild(cPath);
  
  //console.log(guides.h.length);
  //console.log(guides.h[44])
  var dRect = rect(guides.v[LEFT][FOLD].u,
    guides.h[guides.h.length-2].u,
    2*foldWidth.u,
    hGuideSep.u,
    cutoutFill);
  dRect.setAttribute("stroke",cutStroke);
  dRect.setAttribute("id",GUIDE+"-cutout-4")
  parent.appendChild(dRect);

  var eRect = guideRect({x1:{side:LEFT,guide:FOLD},y1:{index:32},x2:{side:RIGHT,guide:FOLD},y2:{index:40}});
  eRect.setAttribute("id",GUIDE+"-cutout-5");
  eRect.setAttribute("fill",cutoutFill);
  dRect.setAttribute("stroke",cutStroke);
  parent.appendChild(eRect);
}
drawGuide(svgDrawing.getElementById(GUIDE));
 
function drawSlide(parent) {
  var aRect = rect(guides.v.left.strip.u,guides.h[1].u,stripWidth.u,hGuideSep.u,cutoutFill);
  aRect.setAttribute("id",SLIDE+"-cutout-1");
  aRect.setAttribute("stroke",black);
  parent.appendChild(aRect);

  var foldLines={}
  foldLines[LEFT]={};
  foldLines[RIGHT]={}
  for (var SIDE in foldLines) {
    //console.log(SIDE);
    //console.log(guides.v[SIDE])
    foldLines[SIDE]=vLine({x:{side:SIDE,guide:FOLD},y1:{index:slideStart},y2:{index:slideEnd}});
    foldLines[SIDE].setAttribute("id", SLIDE+"-"+SIDE+"-"+FOLD);
    foldLines[SIDE].setAttribute("stroke-dasharray",foldStrokeDash);
    foldLines[SIDE].setAttribute("stroke",foldStroke);
    foldLines[SIDE].setAttribute("stroke-width",foldStrokeWidth);
    parent.appendChild(foldLines[SIDE]);
  }

  var cutLines={}
  cutLines[LEFT]={};
  cutLines[RIGHT]={}
  for (var SIDE in cutLines) {
    //console.log(SIDE);
    //console.log(guides.v[SIDE])
    cutLines[SIDE]=vLine({x:{side:SIDE,guide:FOLDOUT},y1:{index:slideStart},y2:{index:slideEnd}});
    cutLines[SIDE].setAttribute("id", SLIDE+"-"+SIDE+"-"+FOLDOUT);
    cutLines[SIDE].setAttribute("stroke",cutStroke);
    cutLines[SIDE].setAttribute("stroke-width",cutStrokeWidth);
    parent.appendChild(cutLines[SIDE]);
  }


  var dRect = rect(guides.v.left.fold.u,guides.h[guides.h.length-3].u,2*foldWidth.u,hGuideSep.u,cutoutFill);
  dRect.setAttribute("stroke",black);
  dRect.setAttribute("id", SLIDE+"-cutout-4")
  parent.appendChild(dRect);

  var eRect = guideRect({x1:{side:LEFT,guide:FOLD},y1:{index:35},x2:{side:RIGHT,guide:FOLD},y2:{index:guides.h.length-4}});
  eRect.setAttribute("id",SLIDE+"-cutout-5");
  eRect.setAttribute("fill",cutoutFill);
  parent.appendChild(eRect);

  var cutSlideEnd = {LEFT:{},RIGHT:{}};
  for (side in cutSlideEnd) {
    cutSlideEnd[SIDE]=hLine(
      {x1:{SIDE:SIDE,GUIDE:FOLD},
      x2:{SIDE:SIDE,GUIDE:FOLD},
      y:{index:slideEnd}}
    );
    setCutAttributes(cutSlideEnd[SIDE]);
    parent.appendChild(cutSlideEnd[SIDE]);
  }
}
drawSlide(svgDrawing.getElementById(SLIDE));
 
function setCutAttributes(svgObj) {
  svgObj.setAttribute("stroke",cutStroke);
  svgObj.setAttribute("strokeWidth",strokeWidth);
}

 
