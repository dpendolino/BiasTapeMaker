import {
  params, setSvgAttributes,splitterTabs,
  topCutout,bottomCutout, group,rect,
  path, pathCmdList, unitObj, meas,style,text,
  LEFT,RIGHT,STRIP,FOLDOUT,FOLD,
  SLIDE} from './index.js';

export default function drawSlide(parent) {
  var slideStart=params.slideStart;
  var slideEnd=params.slideEnd;
  var finishedWidth=params.finishedWidth;
  var inner=params.inner;
  var hGuideSep=params.hGuideSep;
  var firstTab=params.firstTab;
  var secondTab=params.secondTab;
  topCutout(parent,1);
  topCutout(parent,2.5);

  var d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:slideStart+1}},
    {cmd:"V",y:{index:slideEnd-4}},
    {cmd:"H",x:{side:LEFT,ref:FOLDOUT}},
    {cmd:"V",y:{index:slideEnd}},
    {cmd:"H",x:{side:LEFT,ref:FOLD}},
    {cmd:"m",dx:-finishedWidth.u-inner.u,dy:0},
    {cmd:"v",dy:-2.1*hGuideSep.u},
    {cmd:"M",x:{side:RIGHT,ref:STRIP},y:{index:slideStart+1}},
    {cmd:"V",y:{index:slideEnd-4}},
    {cmd:"H",x:{side:RIGHT,ref:FOLDOUT}},
    {cmd:"V",y:{index:slideEnd}},
    {cmd:"H",x:{side:RIGHT,ref:FOLD}},
    {cmd:"m",dx:finishedWidth.u+inner.u,dy:-4*hGuideSep.u},
    {cmd:"v",dy:2.1*hGuideSep.u}
  ]);
  
  var bPath = path(d,SLIDE+"-cut-2");
  setSvgAttributes(bPath,"cut");
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
  setSvgAttributes(cPath,"fold");
  parent.appendChild(cPath);
  
  splitterTabs(parent,firstTab);
  splitterTabs(parent,secondTab);
  bottomCutout(parent,41.5,.5) 
  bottomCutout(parent,43,.5)
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
