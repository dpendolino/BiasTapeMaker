export { Guides };
import {unitObj} from './utils.js';
import {GUIDE,LEFT,RIGHT,CENTER,STRIP,STRIPINNER,FOLD,FOLDINNER,SLIDE,FOLDOUT,BASE,EDGE} from './const.js';

function Guides() {
  this.calculate = function(params) {
      if (
          params.hGuideSep===undefined ||
          params.page===undefined ||
          params.page.height===undefined ||
          params.panelWidth===undefined
      ) {
         console.log("Missing one or more required parameters: hGuideSep, page, page.height, panelWidth");
       }
      else {
        var hGuideSep = params.hGuideSep;
        var page = params.page;
        var panelWidth = params.panelWidth;

      }
      this.h = [new unitObj(0)];
      this.h[0].name=0;
      for (let i=1;i*hGuideSep.raw<=page.height.raw;i++) {
          var guide = new unitObj(i*hGuideSep.raw);
          guide.name=i;
          this.h.push(guide);
      }
      this.v = new vGuides(params);
  }
};
function vGuides(params) {
  if (
    params.panelWidth===undefined ||
    params.stripWidth===undefined ||
    params.inner===undefined ||
    params.finishedWidth===undefined ||
    params.offset===undefined
  ) {
    console.log()
    console.log("Missing one or more required parameters: panelWidth, stripWidth, inner, finishedWidth, offset");
    console.log(params.panelWidth);
    console.log(params.stripWidth);
    console.log(params.inner);
    console.log(params.finishedWidth);
    console.log(params.offset);
    console.log()
  }
  var panelWidth = params.panelWidth;
  var stripWidth = params.stripWidth;
  var inner = params.inner;
  var finishedWidth = params.finishedWidth;
  var offset = params.offset;
  this[RIGHT]={name:RIGHT};
  this[RIGHT][EDGE]=new unitObj(offset.raw+panelWidth.raw/2);
  this[RIGHT][STRIP]=new unitObj(offset.raw+stripWidth.raw/2);
  this[RIGHT][STRIPINNER]=new unitObj(this[RIGHT][STRIP].raw-inner.raw);
  this[RIGHT][FOLD]=new unitObj(offset.raw+finishedWidth.raw/2);
  this[RIGHT][FOLDINNER]=new unitObj(this[RIGHT][FOLD].raw-inner.raw);

  this[RIGHT][FOLDOUT]=new unitObj(this[RIGHT][STRIP].raw+finishedWidth.raw/2-inner.raw);

  this[RIGHT].array=[this[RIGHT].edge,this[RIGHT][STRIP],this[RIGHT][STRIPINNER],this[RIGHT][FOLD],this[RIGHT][FOLDINNER],this[RIGHT][FOLDOUT]];
  this[RIGHT].count=this[RIGHT].array.length;
  this[RIGHT][EDGE].name=EDGE;
  this[RIGHT][STRIP].name=STRIP
  this[RIGHT][STRIPINNER].name=STRIPINNER;
  this[RIGHT][FOLD].name=FOLD;
  this[RIGHT][FOLDINNER].name=FOLDINNER;
  this[RIGHT][FOLDOUT].name=FOLDOUT;
  this[LEFT]={name:LEFT};
  this[LEFT].edge=new unitObj(offset.raw-panelWidth.raw/2);
  this[LEFT][STRIP]=new unitObj(offset.raw-stripWidth.raw/2);

  this[LEFT][FOLDOUT]=new unitObj(this[LEFT][STRIP].raw-finishedWidth.raw/2+inner.raw);

  this[LEFT][STRIPINNER]=new unitObj(this[LEFT][STRIP].raw+inner.raw);
  this[LEFT][FOLD]=new unitObj(offset.raw-finishedWidth.raw/2);
  this[LEFT][FOLDINNER]=new unitObj(this[LEFT][FOLD].raw+inner.raw);
  this[LEFT].array=[this[LEFT].edge,this[LEFT][STRIP],this[LEFT][STRIPINNER],this[LEFT][FOLD],this[LEFT][FOLDINNER],this[LEFT][FOLDOUT]];
  this[LEFT].count=this[LEFT].array.length;
  this[LEFT].edge.name=EDGE;
  this[LEFT][STRIP].name=STRIP
  this[LEFT][STRIPINNER].name=STRIPINNER;
  this[LEFT][FOLD].name=FOLD;
  this[LEFT][FOLDINNER].name=FOLDINNER;
  this[LEFT][FOLDOUT].name=FOLDOUT;
  this[CENTER]={name:CENTER,center: new unitObj(offset.raw)};
  this[CENTER].array=[this[CENTER][CENTER]];
  this[CENTER].count=this[CENTER].array.length;
  this[CENTER][CENTER].name=CENTER;
  this.array=[this[LEFT],this[RIGHT],this[CENTER]];
  this.count=this.array.length;
};

export function Sections(params) { //section.array -> SLIDE, BASE, GUIDE
    if (
      params.panelWidth===undefined ||
      params.baseWidth===undefined
    ) {
      console.log("One or more required parameters is not found: panelWidth, baseWidth")
    }
    var panelWidth = params.panelWidth;
    var baseWidth = params.baseWidth;
    this.SLIDE={
      name:"slide",
      offset:new unitObj(panelWidth.raw-baseWidth.raw),
      fill:"#F1948A"
      };
    this.BASE={
      name:"base",
      offset:panelWidth,
      fill:"#D4E6F1"
      };
    this.GUIDE={
      name:"guide",
      offset:new unitObj(panelWidth.raw+baseWidth.raw),
      fill:"#A2D9CE"
      };
    this.array=[this.SLIDE,this.BASE,this.GUIDE];
    this.count=this.array.length;
};

export function showHGuides() {
  for (let j=0; j<guides.h.length; j++) {
    //console.log(guides.h[j]);
    var hG = guides.h[j];
    var guide = hLine(hG.u,black);
    svgDrawing.appendChild(guide);
  }
}


/*
export {sections, sides, Guides } ;


function side(p_side) { // side.guides -> EDGE, STRIP, STRIP_INNER, FOLD, FOLD_INNER
    this.value=p_side;
    this.EDGE=EDGE;
    this[STRIP]=STRIP;
    this[STRIP]_INNER=STRIPINNER;
    this[FOLD]=FOLD;
    this[FOLD]_INNER=FOLDINNER;
    this.labels=[this.EDGE,this[STRIP],this[STRIP]_INNER,this[FOLD],this[FOLD]_INNER];
    this.count=this.labels.length;
}
var ctr = function() { // ctr.guides -> CENTER
    this.value=CENTER;
    this[CENTER]=CENTER;
    this.guides=[this[CENTER]];
    this.count=1;
}
// sides[LEFT], sides[RIGHT], sides[CENTER]
// sides.guides -> [LEFT,RIGHT,CENTER]
// sides.guides[i].labels -> [EDGE, STRIP, CENTER, etc.]
function Sides() {
    this[LEFT]=new side("left");
    this[RIGHT]=new side("right");
    this[CENTER]=new ctr();
    this.guides=[this[LEFT],this[RIGHT],this[CENTER]];
    this.count=this.guides.length;
}
export const sides = new Sides();

var hGuideSep = new unitObj(.25);


function vGuides(params) {
  if (params.offset===undefined) console.error("struct.Guides.calculate requires offset.");
  offset=params.offset;
  inner=params.inner;
  this[RIGHT]={};
  this[RIGHT].edge = new unitObj(offset+panelWidth.raw/2);
  this[RIGHT][STRIP] = new unitObj(offset+stripWidth.raw/2);
  this[RIGHT][STRIP].inner = new unitObj(this[RIGHT][STRIP].raw-inner.raw);
  this[RIGHT][FOLD]=new unitObj(offset+foldWidth.raw/2);
  this[RIGHT][FOLD].inner=new unitObj(
    offset+this[RIGHT][FOLD].raw-inner.raw);
  this[LEFT]={};
  this[LEFT].edge=new unitObj(offset-panelWidth.raw/2);
  this[LEFT][STRIP]=new unitObj(offset-stripWidth.raw/2);
  this[LEFT][STRIP].inner=new unitObj(this[LEFT][STRIP].raw+inner.raw);
  this[LEFT][FOLD]=new unitObj(offset-foldWidth.raw/2);
  this[LEFT][FOLD].inner=new unitObj(this[LEFT][FOLD].raw+inner.raw);
  this[CENTER]= new unitObj(offset);
  }
};

*/