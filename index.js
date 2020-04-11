//import {Guides,Sections} from './biasTapeMaker/structure.js';
import {Sections} from './biasTapeMaker/structure.js';
import {unitObj} from './biasTapeMaker/utils.js';
import {svg,group,rect,hLine,vLine,path,guideRect, pathCmdList} from './biasTapeMaker/svg.js';
import {
  LEFT,RIGHT,CENTER,SIDES,
  FOLD,FOLDINNER,FOLDOUT,STRIP,STRIPINNER,EDGE,REFS,
  SLIDE,GUIDE,BASE,SECTIONS,
  SIDE,INDEX,X,Y} from './biasTapeMaker/const.js';
import {Guides,printUsage} from './biasTapeMaker/guides.js';

// PARAMETERS
var page, stripWidth, finishedWidth, 
    foldWidth, inner, tapeType, slideLength,
    panelWidth, baseWidth;
export var units={
    x:100,
    label:"inch",
    to:function(meas) {
        return(meas*this.x); 
    },
    from:function(meas) {
      return(meas/this.x);
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
    offset:offset,
    units:units};
var slideStart = 5;
var slideEnd = 19;
var guideEnd = 30;

var p = document.createElement("p")
p.innerHTML = "This is a test.";
document.body.appendChild(p);

export var guides = new Guides();
guides.calculate();

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
  groupObj.appendChild(frame);

  for (const i in SIDES) {
    let SIDE=SIDES[i];
    for (const j in REFS) {
      let REF=REFS[j];
      if (guides.ax(X).side(SIDE).ref(REF)) {
        var guide = vLine({x:{side:SIDE,guide:REF}});
        guide.setAttribute("id",(SIDE+"-"+REF));
        guide.setAttribute("stroke",(guideStroke));
        groupObj.append(guide);
      }
    }
  }
}

/* --usage examples)
  var aRect = guideRect({
    x1:{side:LEFT,guide:STRIP},
    y1:{index:1},
    x2:{side:RIGHT,guide:STRIP},
    y2:{index:2}});
  var aRect = guideRect({
    x1:{side:LEFT,guide:STRIP},
    y1:{index:1},
    w:stripWidth,
    h:hGuideSep});
*/

function drawGuide(parent) {
  //var aRect = rect(guides.v.left.strip.u,guides.h[1].u,stripWidth.u,hGuideSep.u,cutoutFill);
  var aRect = guideRect({
    x1:{side:LEFT,guide:STRIP},
    y1:{index:1},
    w:stripWidth,
    h:hGuideSep
    });
  setCutAttributes(aRect);
  aRect.setAttribute("id","guide-cutout-1");
  parent.appendChild(aRect);

  var bRect = guideRect({
    x1:{side:LEFT,guide:STRIP},
    y1:{index:3},
    w:stripWidth,
    h:hGuideSep
  });
  setCutAttributes(bRect);
  bRect.setAttribute("id","guide-cutout-2");
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
  setCutAttributes(cPath);
  parent.appendChild(cPath);
  
  var dRect = guideRect({
    x1:{side:LEFT,guide:FOLD},
    y1:{index:guides.maxIndex-1},
    w:finishedWidth,
    h:hGuideSep
  });
  /*var dRect = rect(guides.v[LEFT][FOLD].u,
    guides.h[guides.h.length-2].u,
    2*foldWidth.u,
    hGuideSep.u,
    cutoutFill);*/
  setCutAttributes(dRect);
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
  for (var side in cutSlideEnd) {
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
  svgObj.setAttribute("strokeWidth",cutStrokeWidth);
}

 
