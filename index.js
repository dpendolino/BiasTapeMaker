//import {Guides,Sections} from './biasTapeMaker/structure.js';
import {Sections} from './structure.js';
import {unitObj} from './utils.js';
import {svg,group,rect,hLine,vLine,path,guideRect, pathCmdList} from './svg.js';
import {
  LEFT,RIGHT,CENTER,SIDES,
  FOLD,FOLDINNER,FOLDOUT,STRIP,STRIPINNER,EDGE,REFS,
  SLIDE,GUIDE,BASE,SECTIONS,
  SIDE,INDEX,REF,X,Y} from './const.js';
import {Guides,printUsage} from './guides.js';

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
const guideStroke="#eee";
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
    panelWidth:panelWidth,
    baseWidth:baseWidth,
    hGuideSep:hGuideSep,
    offset:offset,
    units:units};
var slideStart = 5;
var slideEnd = 19;
var guideEnd = 21;
var firstTab = 28;
var secondTab = 35;

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
  if (sect.name==BASE) setFoldAttributes(frame);
  groupObj.appendChild(frame);

  for (const i in SIDES) {
    let side=SIDES [i];
    for (const j in REFS) {
      let ref=REFS[j];
      if (guides.ax(X).side(side).ref(ref)) {
        var guide = vLine({x:{SIDE: side,REF:ref}});
        guide.setAttribute("id",(side+"-"+ref));
        guide.setAttribute("stroke",(guideStroke));
        groupObj.append(guide);
      }
    }
  }
}

function drawGuide(parent) {
  topCutout(parent,1);
  topCutout(parent,2);
  topCutout(parent,3);

  var d;
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:FOLDINNER},y:{index:guideEnd}},
    {cmd:"V",y:{index:slideEnd}},
    {cmd:"H",x:{side:LEFT,ref:STRIP}},
    {cmd:"V",y:{index:slideStart}},
    {cmd:"H",x:{side:LEFT,ref:STRIPINNER}},
    {cmd:"L",x:{side:LEFT,ref:FOLDINNER},y:{index:slideEnd-6}},
    {cmd:"V",y:{index:guideEnd}},
    {cmd:"H",x:{side:RIGHT,ref:FOLDINNER}},
    {cmd:"V",y:{index:slideEnd-6}},
    {cmd:"L",x:{side:RIGHT,ref:STRIPINNER},y:{index:slideStart}},
    {cmd:"H",x:{side:RIGHT,ref:STRIP}},
    {cmd:"V",y:{index:slideEnd}},
    {cmd:"H",x:{side:RIGHT,ref:FOLDINNER}},
    {cmd:"V",y:{index:guideEnd}}, 
    {cmd:"z"}
  ]);
  
  var cPath = path(d,GUIDE+"-cutout-3");
  setCutAttributes(cPath);
  parent.appendChild(cPath);
  
  bottomCutout(parent,guideEnd+1,firstTab-guideEnd);
  bottomCutout(parent,firstTab+2,secondTab-firstTab-1);
  
  bottomCutout(parent,secondTab+2,40.5-secondTab) 
  bottomCutout(parent,43,.5) 
}
drawGuide(svgDrawing.getElementById(GUIDE));
 
function drawSlide(parent) {
  topCutout(parent,1);
  topCutout(parent,2);

  var d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:slideStart+1}},
    {cmd:"V",y:{index:slideEnd-4}},
    {cmd:"H",x:{side:LEFT,ref:FOLDOUT}},
    {cmd:"V",y:{index:slideEnd}},
    {cmd:"H",x:{side:LEFT,ref:FOLD}},
    {cmd:"m",dx:-finishedWidth.u,dy:0},
    {cmd:"v",dy:-2.1*hGuideSep.u},
    {cmd:"M",x:{side:RIGHT,ref:STRIP},y:{index:slideStart+1}},
    {cmd:"V",y:{index:slideEnd-4}},
    {cmd:"H",x:{side:RIGHT,ref:FOLDOUT}},
    {cmd:"V",y:{index:slideEnd}},
    {cmd:"H",x:{side:RIGHT,ref:FOLD}},
    {cmd:"m",dx:finishedWidth.u,dy:-4*hGuideSep.u},
    {cmd:"v",dy:2.1*hGuideSep.u}
  ]);
  
  var bPath = path(d,SLIDE+"-cut-2");
  setCutAttributes(bPath);
  bPath.setAttribute("fill","none");
  parent.appendChild(bPath);
  d = pathCmdList([
      {cmd:"M",
          x:{side:LEFT,ref:FOLD},
          y:{index:slideStart}},
      {cmd:"V",y:{index:slideEnd}},
      {cmd:"M",
          x:{side:RIGHT,ref:FOLD },
          y:{index:slideStart}},
      {cmd:"V",y:{index:slideEnd}},
  ]);
  var cPath = path(d,SLIDE+"-fold");
  setFoldAttributes(cPath);
  parent.appendChild(cPath);
  
  splitterTabs(parent,firstTab);
  splitterTabs(parent,secondTab);
  bottomCutout(parent,42,.5) 
  bottomCutout(parent,43,.5) 
}
drawSlide(svgDrawing.getElementById(SLIDE));
 
function setCutAttributes(svgObj) {
  svgObj.setAttribute("stroke",cutStroke);
  svgObj.setAttribute("strokeWidth",cutStrokeWidth);
  svgObj.setAttribute("fill",cutoutFill);
}
function setFoldAttributes(svgObj) {
    svgObj.setAttribute("stroke",foldStroke);
    svgObj.setAttribute("stroke-width",foldStrokeWidth);
    svgObj.setAttribute("stroke-dasharray",foldStrokeDash);
}
function topCutout(parent,yInd) {
  var aRect = guideRect({
    x1:{SIDE:LEFT,REF:STRIP},
    y1:{INDEX:yInd},
    w:stripWidth.u,
    h:.5*hGuideSep.u
    });
  setCutAttributes(aRect);
  aRect.setAttribute("id",parent.name+"-cutout-"+yInd);
  parent.appendChild(aRect);
}

function bottomCutout(parent,yInd,hSepCt) {
  var aRect = guideRect({
    x1:{SIDE:LEFT,REF:FOLD},
    y1:{INDEX:yInd},
    w:2*finishedWidth.u,
    h:hSepCt*hGuideSep.u
    });
  setCutAttributes(aRect);
  aRect.setAttribute("id",parent.name+"-cutout-"+yInd);
  parent.appendChild(aRect);
}

function splitterTabs(parent,yInd) {
  var d, cutPath, foldPath;
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT, ref:FOLD},y:{index: yInd+3}},
    {cmd:"H",x:{side:LEFT, ref: FOLDOUT}},
    {cmd:"V",y:{index:yInd+1}},
    {cmd:"H",x:{side:LEFT, ref:FOLD}},
    {cmd:"m",dx:-finishedWidth.u,dy:0},
    {cmd:"v",dy:hGuideSep.u},
    {cmd:"M",x:{side:RIGHT, ref:FOLD},y:{index:yInd}},
    {cmd:"H",x:{side: RIGHT, ref: FOLDOUT}},
    {cmd:"V",y:{index:yInd+2}},
    {cmd:"H",x:{side:RIGHT, ref: FOLD}},
    {cmd:"m",dx:finishedWidth.u,dy:0},
    {cmd:"v",dy:-hGuideSep.u}
  ]);
  cutPath = path(d,parent.name+"cut-tabs-"+yInd);
  setCutAttributes(cutPath);
  cutPath.setAttribute("fill","none");
  parent.appendChild(cutPath);
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT, ref:FOLD },y:{index:yInd+1}},
    {cmd:"V",y:{index: yInd+3}},
    {cmd:"M",x:{side:RIGHT, ref:FOLD},y:{index:yInd}},
    {cmd:"V",y:{index:yInd+2}}
  ]);
  foldPath = path(d,parent.name+"fold-tabs-"+yInd);
  setFoldAttributes(foldPath);
  parent.appendChild(foldPath);
}

function addScale(parent) {
	var inches={};
	for (let i=0;i<=2;i+=1/16) inches[i]=new xGuideObj({raw:i});
	var cms={};
	for (let i=0;i<=5;i+=.1) cms[i]=new xGuideObj({raw:i/2.54});
  
  var scale = group("scale");
  var inchScale=rect({x1:inches[0],x2:inches[2],y1:0,y2:hGuideSep});
  var cmScale=rect({x1:cms[0],x2:cms[5],y1:0,y2:-hGuideSep});
  //var d = pathCmdList([
  //  {cmd:"",x:{side:,ref:},y:{index}}
  //]};
  scale.appendChild(inchScale);
  scale.appendChild(inchScale);
  parent.appendChild(scale);
}
