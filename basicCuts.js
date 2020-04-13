import {params,guideRect,
  LEFT,STRIP,FOLD,FOLDOUT,RIGHT,
  path,setSvgAttributes,pathCmdList} from './index.js';
export {topCutout,bottomCutout,splitterTabs,addCircleTabs};

function topCutout(parent,yInd) {
  var aRect = guideRect({
    x1:{SIDE:LEFT,REF:STRIP},
    y1:yInd*params.hGuideSep.u,
    w:params.stripWidth.u,
    h:.5*params.hGuideSep.u
    });
  //setCutAttributes(aRect);
  setSvgAttributes(aRect,"cutout");
  aRect.setAttribute("id",parent.name+"-cutout-"+yInd);
  parent.appendChild(aRect);
}
function bottomCutout(parent,yInd,hSepCt) {
  var finishedWidth=params.finishedWidth;
  var aRect = guideRect({
    x1:{SIDE:LEFT,REF:FOLD},
    y1:yInd*params.hGuideSep.u,
    w:2*finishedWidth.u,
    h:hSepCt*params.hGuideSep.u
    });
  setSvgAttributes(aRect,"cutout");
  aRect.setAttribute("id",parent.getAttribute("id")+"-cutout-"+yInd);
  parent.appendChild(aRect);
}
function splitterTabs(parent,yInd) {
  var finishedWidth=params.finishedWidth;
  var hGuideSep=params.hGuideSep;
  var inner=params.inner;
  var d, cutPath, foldPath;
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT, ref:FOLD},y:{index: yInd+3}},
    {cmd:"H",x:{side:LEFT, ref: FOLDOUT}},
    {cmd:"V",y:{index:yInd+1}},
    {cmd:"H",x:{side:LEFT, ref:FOLD}},
    {cmd:"m",dx:-finishedWidth.u-inner.u,dy:0},
    {cmd:"v",dy:hGuideSep.u},
    {cmd:"M",x:{side:RIGHT, ref:FOLD},y:{index:yInd}},
    {cmd:"H",x:{side: RIGHT, ref: FOLDOUT}},
    {cmd:"V",y:{index:yInd+2}},
    {cmd:"H",x:{side:RIGHT, ref: FOLD}},
    {cmd:"m",dx:finishedWidth.u+inner.u,dy:0},
    {cmd:"v",dy:-hGuideSep.u}
  ]);
  cutPath = path(d,parent.name+"cut-tabs-"+yInd);
  setSvgAttributes(cutPath,"cut");
  parent.appendChild(cutPath);
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT, ref:FOLD },y:{index:yInd+1}},
    {cmd:"V",y:{index: yInd+3}},
    {cmd:"M",x:{side:RIGHT, ref:FOLD},y:{index:yInd}},
    {cmd:"V",y:{index:yInd+2}}
  ]);
  foldPath = path(d,parent.name+"fold-tabs-"+yInd);
  setSvgAttributes(foldPath,"fold");
  parent.appendChild(foldPath);
}

function addCircleTabs(parent,side) {
  var sweep = (side==RIGHT) ? 0:1;
  var xLoc = (side==RIGHT) ? baseWidth.u-10:10;
  var d, tabHeights={1:2,2:12,3:22,4:32,5:42};
  for (let tab in tabHeights) {
    d=pathCmdList([
      {cmd:"M",x:xLoc,y:{index:tabHeights[tab]}},
      {cmd:"a",rx:20,ry:20,dx:0,dy:40,sweep:sweep}
    ]);
    var circTab=path(d)
    circTab.setAttribute("id",parent.getAttribute("id")+"-tab-"+tab);
    setCutAttributes(circTab);
    circTab.setAttribute(FILL,"none");
    parent.appendChild(circTab);
  }
}
