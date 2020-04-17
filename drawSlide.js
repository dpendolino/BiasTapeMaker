import {params, unitObj, meas, style,
  splitterTabs, topCutout, bottomCutout,
  group, path, pathCmdList, text, setSvgAttributes,svgRect, 
  LEFT, RIGHT, STRIP, FOLDOUT, FOLD, SLIDE} from './index.js';

var hGuideSep=params.hGuideSep;

export default function drawSlide(parent) {
  var slideStart=params.slideStart;
  var slideEnd=params.slideEnd;
  var firstTab=params.firstTab;
  const CMD={
    Z:{cmd:"z"},
    H:{
      ABS:{
        RIGHT:{
          FOLDOUT:{cmd:"H",x:{side:RIGHT,ref:FOLDOUT}},
          STRIP:{cmd:"H",x:{side:RIGHT,ref:STRIP}}},
        LEFT:{
          FOLDOUT:{cmd:"H",x:{side:LEFT,ref:FOLDOUT}},
          STRIP:{cmd:"H",x:{side:LEFT,ref:STRIP}
    }}}},
    V:{
      ABS:{
        SLIDETABS:{cmd:"V",y:{index:slideEnd-3}},
        SLIDEEND:{cmd:"V",y:{index:slideEnd}},
        SLIDESTART:{cmd:"V",y:{index:slideStart}},
        TABSTART:{cmd:"V",y:{index:firstTab}},
        TABEND:{cmd:"V",y:{index:firstTab+3}},
        HG(hg) {return {cmd:"V",y:hg*hGuideSep.u}}
      }}}

  var reinforce = group("reinforce");
  parent.appendChild(reinforce);
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:slideStart}},
    CMD.V.ABS.SLIDETABS,
    CMD.H.ABS.LEFT.FOLDOUT,
    CMD.V.ABS.SLIDEEND,
    CMD.H.ABS.RIGHT.FOLDOUT,
    CMD.V.ABS.SLIDETABS,
    CMD.H.ABS.RIGHT.STRIP,
    CMD.V.ABS.SLIDESTART,
    CMD.Z,
    {cmd:"M",x:{side:LEFT,ref:FOLDOUT},y:{index:firstTab}},
    CMD.V.ABS.TABEND,
    CMD.H.ABS.RIGHT.FOLDOUT,
    CMD.V.ABS.TABSTART,
    CMD.Z,
    {cmd:"M",x:{side:LEFT,ref:FOLDOUT},y:.5*hGuideSep.u},
    CMD.V.ABS.HG(3.5),
    CMD.H.ABS.RIGHT.FOLDOUT,
    CMD.V.ABS.HG(.5),
    CMD.Z,
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:41}},
    CMD.V.ABS.HG(44),
    CMD.H.ABS.RIGHT.STRIP,
    CMD.V.ABS.HG(41),
    CMD.Z
  ]);
  var reinf1 = path(d,"reinforce-here");
  setSvgAttributes(reinf1,"reinforce");
  reinforce.appendChild(reinf1);

  topCutout(parent,1);
  topCutout(parent,2.5);

  var d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:slideStart+1}},
    {cmd:"V",y:{index:slideEnd-2}},
    {cmd:"M",x:{side:RIGHT,ref:STRIP},y:{index:slideStart+1}},
    {cmd:"V",y:{index:slideEnd-3}}
  ]);
  var bPath = path(d,SLIDE+"-cut-2");
  setSvgAttributes(bPath,"cut");
  parent.appendChild(bPath);
  splitterTabs(parent,slideEnd-3,true);

  d = pathCmdList([
      {cmd:"M",
          x:{side:LEFT,ref:FOLD},
          y:{index:slideStart}},
      {cmd:"V",y:{index:40}},
      {cmd:"M",
          x:{side:RIGHT,ref:FOLD },
          y:{index:slideStart}},
      {cmd:"V",y:{index:40}},
  ]);
  var cPath = path(d,SLIDE+"-fold");
  setSvgAttributes(cPath,"fold");
  parent.appendChild(cPath);
  
  splitterTabs(parent,firstTab);
  parent.appendChild(wallTabs());
  bottomCutout(parent,41,.7) 
  bottomCutout(parent,42.5,.7)
  addScale(parent); 
}

function addScale(parent) {
  var units=params.units;
	var inches={};
	for (let i=0;i<=2;i+=1/16) inches[i]=new unitObj(i);
	var cms={};
	for (let i=0;i<=5;i+=.1) cms[Math.round(i*10)/10]=new meas(i/2.54,Math.floor(10*units.x*i/2.54)/10);
  var scale = group("scale");
  scale.setAttribute("transform","translate(70,10) rotate(90)");
  var inchScale = svgRect({
    x1:inches[0],y1:0,x2:inches[2],height:hGuideSep,
    id:"inch-scale",fill:"#fff",stroke:"#000"});
  var cmScale = svgRect({
    x1:cms[0],y1:hGuideSep,x2:cms[5],height:hGuideSep,
    id:"cm-scale",fill:"#fff",stroke:"#000"});
  scale.appendChild(inchScale);
  scale.appendChild(cmScale);
  var d="";
  const inchMarkings={1:.5,2:.4,4:.3,8:.2,16:.15};
  for (let j in inches) {
    if (j==Math.floor(j)) {
      scale.appendChild(text(j,j+"-in",{x:inches[j].u,y:.8*hGuideSep.u,fill:"#000",style:"font-size:80%"}));
    }
    for (let k in inchMarkings) {
      if (j*k==Math.floor(j*k)) {//integer
        d+=pathCmdList([
          {cmd:"M",x:inches[j].u,y:0},
          {cmd:"v",dy:inchMarkings[k]*hGuideSep.u}
        ]);
        break;
      }
    }
  }
  const cmMarkings={1:.5,2:.3,10:.2};
  for (let j in cms) {
    if (j==Math.floor(j)) {
      scale.appendChild(text(j,j+"-cm",{x:cms[j].u,y:1.5*hGuideSep.u,fill:"#000",style:"font-size:80%"}));
    }
    for (let k in cmMarkings) {
      if (j*k==Math.floor(j*k)) {//integer
        d+=pathCmdList([{cmd:"M",x:cms[j].u,y:2*hGuideSep.u},{cmd:"v",dy:-cmMarkings[k]*hGuideSep.u}]);
        break;
      }
    }
  }
  var scalePath = path(d,"scale-markings");
  scalePath.setAttribute("stroke","#000");
  parent.appendChild(scale);
  scale.appendChild(scalePath);
}
function wallTabs() {
  function wallx() {
      var wallx={left:{side:LEFT,ref:FOLD},
              right:{side:RIGHT,ref:FOLD}};
      return wallx;}
  const WALLX=wallx();
  function wally() {
      var wally={1:{topright:{index:params.miniGuide1}},2:{topright:{index:params.miniGuide2}}};
      wally["1"]["topleft"]={index:wally["1"]["topright"].index+1};
      wally["2"]["topleft"]={index:wally["2"]["topright"].index+1};
      return wally;}
  const WALLY= wally();
  const ANGLELEFT={cmd:"l",dx:-3*hGuideSep.u,
      dy:.2*hGuideSep.u};
  const ANGLERIGHT={cmd:"l",dx:3*hGuideSep.u,
      dy:.2*hGuideSep.u};
  const TABEND={cmd:"v",dy:hGuideSep.u}

  var d = pathCmdList([
    {cmd:"M",x:WALLX["left"],y:WALLY[1]["topleft"]},
    ANGLELEFT,TABEND,ANGLERIGHT,
    {cmd:"M",x:WALLX["right"],y:WALLY[1]["topright"]},
    ANGLERIGHT,TABEND,ANGLELEFT,
    {cmd:"M",x:WALLX["left"],y:WALLY[2]["topleft"]},
    ANGLELEFT,TABEND,ANGLERIGHT,
    {cmd:"M",x:WALLX["right"],y:WALLY[2]["topright"]},
    ANGLERIGHT,TABEND,ANGLELEFT,
  ]);
  var dPath = path(d,SLIDE+"-wall-tabs");
  setSvgAttributes(dPath,"cut");
  return dPath;
}

