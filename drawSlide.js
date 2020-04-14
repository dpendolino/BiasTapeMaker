import {
  params, guides, setSvgAttributes,splitterTabs,
  topCutout,bottomCutout, group,rect,guideRect,
  path, pathCmdList, unitObj, meas,style,text,
  LEFT,RIGHT,STRIP,FOLDOUT,FOLD,EDGE,FILL,FILLOPACITY,
  SLIDE,X,Y} from './index.js';

export default function drawSlide(parent) {
  var slideStart=params.slideStart;
  var slideEnd=params.slideEnd;
  var finishedWidth=params.finishedWidth;
  var inner=params.inner;
  var hGuideSep=params.hGuideSep;
  var firstTab=params.firstTab;
  var secondTab=params.secondTab;

  var reinforce = group("reinforce");
  parent.appendChild(reinforce);
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:slideStart}},
    {cmd:"V",y:{index:slideEnd-3}},
    {cmd:"H",x:{side:LEFT,ref:FOLDOUT}},
    {cmd:"V",y:{index:slideEnd}},
    {cmd:"H",x:{side:RIGHT,ref:FOLDOUT}},
    {cmd:"V",y:{index:slideEnd-3}},
    {cmd:"H",x:{side:RIGHT,ref:STRIP}},
    {cmd:"V",y:{index:slideStart}},
    {cmd:"z"},
    {cmd:"M",x:{side:LEFT,ref:FOLDOUT},y:{index:firstTab}},
    {cmd:"V",y:{index:firstTab+3}},
    {cmd:"H",x:{side:RIGHT,ref:FOLDOUT}},
    {cmd:"V",y:{index:firstTab}},
    {cmd:"z"},
    {cmd:"M",x:{side:LEFT,ref:FOLDOUT},y:.5*hGuideSep.u},
    {cmd:"V",y:3.5*hGuideSep.u},
    {cmd:"H",x:{side:RIGHT,ref:FOLDOUT}},
    {cmd:"V",y:.5*hGuideSep.u},
    {cmd:"z"},
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:41}},
    {cmd:"V",y:{index:44}},
    {cmd:"H",x:{side:RIGHT,ref:STRIP}},
    {cmd:"V",y:{index:41}},
    {cmd:"z"}
  ]);
  var reinf1 = path(d,"reinforce-here");
  setSvgAttributes(reinf1,"reinforce");
  reinforce.appendChild(reinf1);

  topCutout(parent,1);
  topCutout(parent,2.5);

  var d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:slideStart+1}},
    {cmd:"V",y:{index:slideEnd-2}},
    //{cmd:"H",x:{side:LEFT,ref:FOLDOUT}},
    //{cmd:"V",y:{index:slideEnd}},
    //{cmd:"H",x:{side:LEFT,ref:FOLD}},
    //{cmd:"m",dx:-finishedWidth.u-inner.u,dy:0},
    //{cmd:"v",dy:-2.1*hGuideSep.u},
    {cmd:"M",x:{side:RIGHT,ref:STRIP},y:{index:slideStart+1}},
    {cmd:"V",y:{index:slideEnd-3}}//,
    //{cmd:"H",x:{side:RIGHT,ref:FOLDOUT}},
    //{cmd:"V",y:{index:slideEnd}},
    //{cmd:"H",x:{side:RIGHT,ref:FOLD}},
    //{cmd:"m",dx:finishedWidth.u+inner.u,dy:-4*hGuideSep.u},
    //{cmd:"v",dy:2.1*hGuideSep.u}
  ]);
  var bPath = path(d,SLIDE+"-cut-2");
  setSvgAttributes(bPath,"cut");
  parent.appendChild(bPath);
  splitterTabs(parent,slideEnd-3,true);
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:FOLD},y:{index:slideEnd-2}},
    {cmd:"H",x:{side:LEFT,ref:STRIP}},
    {cmd:"M",x:{side:RIGHT,ref:FOLD},y:{index:slideEnd-3}},
    {cmd:"H",x:{side:RIGHT,ref:STRIP}}
  ]);
  /*var whiteOut = path(d,SLIDE+"-nocut");
  setSvgAttributes(whiteOut,"cut");
  whiteOut.setAttribute("stroke","#fff");
  whiteOut.setAttribute("stroke-width","3");
  parent.appendChild(whiteOut);*/

  d = pathCmdList([
      {cmd:"M",
          x:{side:LEFT,ref:FOLD},
          y:{index:slideStart}},
      {cmd:"V",y:{index:43}},
      {cmd:"M",
          x:{side:RIGHT,ref:FOLD },
          y:{index:slideStart}},
      {cmd:"V",y:{index:43}},
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
  var hGuideSep=params.hGuideSep;
	var inches={};
	for (let i=0;i<=2;i+=1/16) inches[i]=new unitObj(i);
	var cms={};
	for (let i=0;i<=5;i+=.1) cms[Math.round(i*10)/10]=new meas(i/2.54,Math.floor(10*units.x*i/2.54)/10);
  var scale = group("scale");
  scale.setAttribute("transform","translate(60,10) rotate(90)");
  var inchScale=rect(inches[0].u,0,inches[2].u-inches[0].u,hGuideSep.u,"#fff");
  var cmScale=rect(cms[0].u,hGuideSep.u,cms[5].u-cms[0].u,hGuideSep.u,"#fff");
  inchScale.setAttribute("stroke",style.black);
  cmScale.setAttribute("stroke",style.black);
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
        d+=pathCmdList([
          {cmd:"M",x:cms[j].u,y:2*hGuideSep.u},
          {cmd:"v",dy:-cmMarkings[k]*hGuideSep.u}
        ]);
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
  var firstTab=params.firstTab;
  var hGuideSep=params.hGuideSep;
  var miniGuide1=params.miniGuide1;
  var miniGuide2=params.miniGuide2;
  var d;
  function wallx() {
      var wallx={outer:{left:{side:LEFT,ref:FOLDOUT},
              right:{side:RIGHT,ref:FOLDOUT}},
          inner:{left:{side:LEFT,ref:FOLD},
              right:{side:RIGHT,ref:FOLD}},
          mid:{left:{side:LEFT,ref:STRIP},
              right:{side:RIGHT,ref:STRIP}},
       };
      return wallx;
  }
  const WALLX=wallx();
  function wally() {
      var wally={1:{topright:{index:miniGuide1}},2:{topright:{index:miniGuide2}}};
      wally["1"]["topleft"]={index:wally["1"]["topright"].index+1};
      wally["2"]["topleft"]={index:wally["2"]["topright"].index+1};
      return wally;
  }
  const WALLY= wally();

  d = pathCmdList([
    // First wall tab
    {cmd:"M",x:WALLX["inner"]["left"],y:WALLY[1]["topleft"]},
    {cmd:"H",x:WALLX["mid"]["left"]},
    {cmd:"v",dy:.2*hGuideSep.u},
    {cmd:"H",x:WALLX["outer"]["left"]},
    {cmd:"v",dy:1*hGuideSep.u},
    {cmd:"H",x:WALLX["mid"]["left"]},
    {cmd:"v",dy:.2*hGuideSep.u},
    {cmd:"H",x:WALLX["inner"]["left"]},
    {cmd:"M",x:WALLX["inner"]["right"],y:WALLY[1]["topright"]},
    {cmd:"H",x:WALLX["mid"]["right"]},
    {cmd:"v",dy:.2*hGuideSep.u},
    {cmd:"H",x:WALLX["outer"]["right"]},
    {cmd:"v",dy:1*hGuideSep.u},
    {cmd:"H",x:WALLX["mid"]["right"]},
    {cmd:"v",dy:.2*hGuideSep.u},
    {cmd:"H",x:WALLX["inner"]["right"]},
    //
    {cmd:"M",x:WALLX["inner"]["left"],y:WALLY[2]["topleft"]},
    {cmd:"H",x:WALLX["mid"]["left"]},
    {cmd:"v",dy:.2*hGuideSep.u},
    {cmd:"H",x:WALLX["outer"]["left"]},
    {cmd:"v",dy:1*hGuideSep.u},
    {cmd:"H",x:WALLX["mid"]["left"]},
    {cmd:"v",dy:.2*hGuideSep.u},
    {cmd:"H",x:WALLX["inner"]["left"]},
    {cmd:"M",x:WALLX["inner"]["right"],y:WALLY[2]["topright"]},
    {cmd:"H",x:WALLX["mid"]["right"]},
    {cmd:"v",dy:.2*hGuideSep.u},
    {cmd:"H",x:WALLX["outer"]["right"]},
    {cmd:"v",dy:hGuideSep.u},
    {cmd:"H",x:WALLX["mid"]["right"]},
    {cmd:"v",dy:.2*hGuideSep.u},
    {cmd:"H",x:WALLX["inner"]["right"]}
  ]);
  var dPath = path(d,SLIDE+"-wall-tabs");
  setSvgAttributes(dPath,"cut");
  return dPath;
}

