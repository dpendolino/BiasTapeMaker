import {SLIDE, GUIDE, BASE, unitObj} from './index.js';
export {units, params, printUsage, sectionConfig, style};

var params, page, stripWidth, finishedWidth, 
    foldWidth, inner, tapeType, slideLength,
    panelWidth, baseWidth, units,
    hGuideSep, offset, slideStart, slideEnd,
    guideEnd, firstTab, secondTab;
units={
  x:100,
  label:"inch",
  to:function(meas) {
    return(meas*this.x); 
  },
  from:function(meas) {
    return(meas/this.x);
  }
};

page = {width: new unitObj(8.5),height: new unitObj(11)};   
stripWidth = new unitObj(1.25);
finishedWidth = new unitObj(stripWidth.raw/4+.1);
foldWidth = new unitObj((stripWidth.raw - 2*finishedWidth.raw)/2);
inner = new unitObj(.02);
panelWidth= new unitObj(page.width.raw/3-2*inner.raw);
baseWidth= new unitObj(page.width.raw-2*panelWidth.raw);
hGuideSep = new unitObj(.25);
offset = new unitObj(baseWidth.raw*.5);
slideStart = 6;
slideEnd = 19;
guideEnd = 21;
firstTab = 28;
secondTab = 35;
params = {
  page:page,
  stripWidth:stripWidth,
  finishedWidth:finishedWidth,
  foldWidth:foldWidth,
  inner:inner,
  panelWidth:panelWidth,
  baseWidth:baseWidth,
  hGuideSep:hGuideSep,
  offset:offset,
  units:units,
  slideStart:slideStart,
  slideEnd:slideEnd,
  guideEnd:guideEnd,
  firstTab:firstTab,
  secondTab:secondTab};

var printUsage={on:false};
var sectionConfig={
  SLIDE:{
    name:"slide",
    offset:new unitObj(params.panelWidth.raw-params.baseWidth.raw),
    //fill:"#F1948A"
    fill: "none"
  },
  GUIDE:{
    name:"guide",
    offset:new unitObj(params.panelWidth.raw+params.baseWidth.raw),
    //fill:"#A2D9CE"
    fill: "none"
  },
  BASE:{
    name:"base",
    offset:params.panelWidth,
    //fill:"#D4E6F1"
    fill: "none"
  },
  get(sect) {
    if (sect==SLIDE) return this.SLIDE;
    if (sect==GUIDE) return this.GUIDE;
    if (sect==BASE) return this.BASE;
    return false;
  }
}
var style={
  black:"#000",
  cut:{
    "fill":"none",
    "stroke":"#000",
    "stroke-width":"2"
  },
  cutout:{
    "fill":"#ddd",
    "stroke":"#000",
    "stroke-width":"2"
  },
  fold:{
    "fill":"none",
    "stroke":"#000",
    "stroke-width":"2",
    "stroke-dasharray":"10,5,3,5"
  },
  guide:{
    stroke:"#eee"
  }
};