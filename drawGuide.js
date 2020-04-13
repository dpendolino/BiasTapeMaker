import {params,topCutout,pathCmdList,path,
  setSvgAttributes,bottomCutout,
  LEFT,RIGHT,FOLD,FOLDINNER,STRIP,STRIPINNER,
  GUIDE} from './index.js';
export default function drawGuide(parent) {
  var guideEnd=params.guideEnd;
  var slideEnd=params.slideEnd;
  var slideStart=params.slideStart;
  var firstTab=params.firstTab;
  var secondTab=params.secondTab;
  var finishedWidth=params.finishedWidth;
  topCutout(parent,1);
  topCutout(parent,2.5);
  topCutout(parent,4);

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
  setSvgAttributes(cPath,"cutout")
  parent.appendChild(cPath);
  
  bottomCutout(parent,guideEnd+1,firstTab-guideEnd);
  bottomCutout(parent,firstTab+2,secondTab-firstTab-1);
  
  bottomCutout(parent,secondTab+2,40-secondTab) 
  bottomCutout(parent,43,.5) 
}