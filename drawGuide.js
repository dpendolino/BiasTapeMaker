import {params,topCutout,pathCmdList,path,
  setSvgAttributes,bottomCutout,guides,
  LEFT,RIGHT,FOLD,FOLDINNER,STRIP,STRIPINNER,
  GUIDE,X,Y,group,FOLDOUT} from './index.js';
export default function drawGuide(parent) {
  var guideEnd=params.guideEnd;
  var slideEnd=params.slideEnd;
  var slideStart=params.slideStart;
  var firstTab=params.firstTab;
  var secondTab=params.secondTab;
  var finishedWidth=params.finishedWidth;
  var inner=params.inner;
  var hGuideSep=params.hGuideSep;
  var stripWidth=params.stripWidth;

  var reinforce = group("reinforce");
  parent.appendChild(reinforce);
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:FOLDOUT},y:.5*hGuideSep.u},
    {cmd:"V",y:5*hGuideSep.u},
    {cmd:"H",x:{side:RIGHT,ref:FOLDOUT}},
    {cmd:"V",y:.5*hGuideSep.u},
    {cmd:"z"},
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:guideEnd}},
    {cmd:"V",y:(guideEnd+2.5)*hGuideSep.u},
    {cmd:"H",x:{side:RIGHT,ref:STRIP}},
    {cmd:"V",y:{index:guideEnd}},
    {cmd:"z"},
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:firstTab+1}},
    {cmd:"V",y:(firstTab+3.5)*hGuideSep.u},
    {cmd:"H",x:{side:RIGHT,ref:STRIP}},
    {cmd:"V",y:{index:firstTab+1}},
    {cmd:"z"},
    {cmd:"M",x:{side:LEFT,ref:STRIP},y:{index:42}},
    {cmd:"V",y:{index:44}},
    {cmd:"H",x:{side:RIGHT,ref:STRIP}},
    {cmd:"V",y:{index:42}},
    {cmd:"z"}
  ]);
  var reinf1 = path(d,"reinforce-here");
  setSvgAttributes(reinf1,"reinforce");
  reinforce.appendChild(reinf1);
  topCutout(parent,1);
  topCutout(parent,2.5);
  topCutout(parent,4);

  var d;
  d = pathCmdList([
    {cmd:"M",x:{side:LEFT,ref:FOLD},y:{index:guideEnd}},
    {cmd:"V",y:{index:slideEnd}},
    {cmd:"H",x:guides.ax(X).side(LEFT).ref(STRIP).u-2*inner.u},
    {cmd:"V",y:{index:slideStart}},
    {cmd:"H",x:{side:LEFT,ref:STRIPINNER}},
    {cmd:"L",x:{side:LEFT,ref:FOLDINNER},y:{index:slideStart+2}},
    {cmd:"V",y:{index:guideEnd}},
    {cmd:"H",x:{side:RIGHT,ref:FOLDINNER}},
    {cmd:"V",y:{index:slideStart+2}},
    {cmd:"L",x:{side:RIGHT,ref:STRIPINNER},y:{index:slideStart}},
    {cmd:"H",x:guides.ax(X).side(RIGHT).ref(STRIP).u+2*inner.u},
    {cmd:"V",y:{index:slideEnd}},
    {cmd:"H",x:{side:RIGHT,ref:FOLD}},
    {cmd:"V",y:{index:guideEnd}}, 
    {cmd:"z"}
  ]);
  
  var cPath = path(d,GUIDE+"-cutout-3");
  setSvgAttributes(cPath,"cutout")
  parent.appendChild(cPath);
  
  parent.appendChild(miniGuides());
  parent.appendChild(wallTabSlots());
  
  bottomCutout(parent,42.5,.7) 
}

function miniGuides() {
  var stripWidth=params.stripWidth;
  var finishedWidth=params.finishedWidth;
  var inner=params.inner;
  var firstTab=params.firstTab;
  var notchDepth=(stripWidth.u-2*finishedWidth.u)/2;
  var miniGuide1=params.miniGuide1;
  var miniGuide2=params.miniGuide2;
  var d;
  function minix() {
      var minix={outer:{left:{side:LEFT,ref:FOLD},
              right:{side:RIGHT,ref:FOLD}},
          inner:{left:{side:LEFT,ref:FOLDINNER,inset:2*inner.u},
              right:{side:RIGHT,ref:FOLDINNER,inset:2*inner.u}}};
      return minix;
  }
  const MINIX=minix();
  function miniy() {
      var miniy={1:{top:{index:miniGuide1},
              bot:{index:miniGuide2-1}},
          2:{top:{index:miniGuide2},
               bot:{index:41}}};
      miniy["1"]["2ndNotch"]={index:miniy["1"]["top"].index+1};
      miniy["2"]["2ndNotch"]={index:miniy["2"]["top"].index+1};
      return miniy;
  }
  const MINIY= miniy();


  d = pathCmdList([
    // First Mini Guide
    {cmd:"M",x:MINIX["outer"]["left"],
        y:MINIY["1"]["top"]},
    {cmd:"V",y:MINIY["1"]["bot"]},
    {cmd:"H",x:MINIX["outer"]["right"]},
    {cmd:"V",y:MINIY["1"]["top"]},
    {cmd:"H",x:MINIX["inner"]["right"]},
    {cmd:"h",dx:-notchDepth},
    {cmd:"v",dy:2*inner.u},
    {cmd:"H",x:MINIX["inner"]["right"]},
    {cmd:"V",y:MINIY["1"]["bot"]},
    {cmd:"H",x:MINIX["inner"]["left"]},
    {cmd:"V",y:MINIY["1"]["2ndNotch"]},
    {cmd:"h",dx:notchDepth},
    {cmd:"v",dy:-2*inner.u},
    {cmd:"H",x:MINIX["inner"]["left"]},
    {cmd:"V",y:MINIY["1"]["top"]},
    {cmd:"z"},
    //
    {cmd:"M",x:MINIX["outer"]["left"],
        y:MINIY["2"]["top"]},
    {cmd:"V",y:MINIY[2]["bot"]},
    {cmd:"H",x:MINIX["outer"]["right"]},
    {cmd:"V",y:MINIY["2"]["top"]},
    {cmd:"H",x:MINIX["inner"]["right"]},
    {cmd:"h",dx:-notchDepth},
    {cmd:"v",dy:2*inner.u},
    {cmd:"H",x:{side:RIGHT,ref:FOLDINNER,inset:2*inner.u}},
    {cmd:"V",y:MINIY[2]["bot"]},
    {cmd:"H",x:MINIX["inner"]["left"]},
    {cmd:"V",y:MINIY[2]["2ndNotch"]},
    {cmd:"h",dx:notchDepth},
    {cmd:"v",dy:-2*inner.u},
    {cmd:"H",x:MINIX["inner"]["left"]},
    {cmd:"V",y:MINIY[2]["top"]},
    {cmd:"z"}
  ]);
  var dPath = path(d,GUIDE+"-cutout-4");
  setSvgAttributes(dPath,"cutout");
  return dPath;
}
function wallTabSlots() {
  var firstTab=params.firstTab;
  var hGuideSep=params.hGuideSep;
  var miniGuide1=params.miniGuide1;
  var miniGuide2=params.miniGuide2;
  var inner=params.inner;
  var d;
  function wallx() {
      var wallx={slot:{
        left:{side:LEFT,ref:STRIP},
        right:{side:RIGHT,ref:STRIP}}};
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
  const SLOT1={cmd:"v",dy:1.4*hGuideSep.u};
  const SLOT2={cmd:"h",dx:2*inner.u};
  const SLOT3={cmd:"v",dy:-1.4*hGuideSep.u};
  const SLOT4={cmd:"z"};

  d = pathCmdList([
    // First wall tab
    {cmd:"M",x:WALLX["slot"]["left"],y:WALLY[1]["topleft"]},
    SLOT1,SLOT2,SLOT3,SLOT4,
    {cmd:"M",x:WALLX["slot"]["right"],y:WALLY[1]["topright"]},
    SLOT1,SLOT2,SLOT3,SLOT4,
    {cmd:"M",x:WALLX["slot"]["left"],y:WALLY[2]["topleft"]},
    SLOT1,SLOT2,SLOT3,SLOT4,
    {cmd:"M",x:WALLX["slot"]["right"],y:WALLY[2]["topright"]},
    SLOT1,SLOT2,SLOT3,SLOT4
  ]);
  var dPath = path(d,GUIDE+"-wall-tab-slots");
  setSvgAttributes(dPath,"cutout");
  return dPath;
}
