import {params,guideRect,
  LEFT,STRIP,FOLD,FOLDOUT,RIGHT,X,
  path,setSvgAttributes,pathCmdList,guides} from './index.js';
export {topCutout,bottomCutout,splitterTabs,addCircleTabs};

function topCutout(parent,yInd) {
  var aRect = guideRect({
    x1:{SIDE:LEFT,REF:STRIP},
    y1:yInd*params.hGuideSep.u,
    w:params.stripWidth.u,
    h:.7*params.hGuideSep.u
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
function splitterTabs(parent,yInd,isSlideEnd) {
  var finishedWidth=params.finishedWidth;
  var hGuideSep=params.hGuideSep;
  var inner=params.inner;
  var d, cutPath, foldPath;
  var leftOffset,topRef;
  if (isSlideEnd==true) {
    leftOffset=-finishedWidth.u-2*inner.u-guides.ax(X).side(LEFT).ref(STRIP).u+guides.ax(X).side(LEFT).ref(FOLD).u;
    topRef=STRIP;
  }
  else {
    leftOffset=-finishedWidth.u-2*inner.u;
    topRef=FOLD;
  }
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:FOLD},y:{index:yInd+3}},
    {cmd:"H",x:{side:LEFT,ref: FOLDOUT}},
    {cmd:"V",y:{index:yInd+1}},
    {cmd:"H",x:{side:LEFT,ref:topRef}},
    {cmd:"m",dx:leftOffset,dy:0},
    {cmd:"v",dy:.6*hGuideSep.u},
    {cmd:"M",x:{side:RIGHT,ref:topRef},y:{index:yInd}},
    {cmd:"H",x:{side: RIGHT, ref: FOLDOUT}},
    {cmd:"V",y:{index:yInd+2}},
    {cmd:"H",x:{side:RIGHT, ref: FOLD}},
    {cmd:"m",dx:finishedWidth.u+2*inner.u,dy:0},
    {cmd:"v",dy:-.6*hGuideSep.u}
  ]);
  cutPath = path(d,parent.name+"cut-tabs-"+yInd);
  setSvgAttributes(cutPath,"cut");
  parent.appendChild(cutPath);
}

function addCircleTabs(parent,side) {
  var baseWidth=params.baseWidth;
  var panelWidth=params.panelWidth;
  var distToFold=baseWidth.u-panelWidth.u;
  var sweep = (side==RIGHT) ? 0:1;
  var xLoc = (side==RIGHT) ? baseWidth.u-distToFold:distToFold;
  var d, tabHeights={1:2,2:14,3:27,4:39};
  for (let tab in tabHeights) {
    d=pathCmdList([
      {cmd:"M",x:xLoc,y:{index:tabHeights[tab]}},
      {cmd:"a",rx:40,ry:40,dx:0,dy:80,sweep:sweep}
    ]);
    var circTab=path(d)
    circTab.setAttribute("id",parent.getAttribute("id")+"-tab-"+tab);
    //setCutAttributes(circTab);
    setSvgAttributes(circTab,"cut");
    //circTab.setAttribute(FILL,"none");
    parent.appendChild(circTab);
  }
}
