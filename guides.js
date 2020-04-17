import {LEFT,RIGHT,CENTER,
    FOLD,FOLDINNER,FOLDOUT,STRIP,STRIPINNER,
    X,Y, params, printUsage} from './index.js';

export function Guides() {
  if (printUsage.on && !printUsage.Guides) {
    console.log("--USAGE: Guides()--",
      "\n  Guides.ax(X) -> xGuides",
      "\n  Guides.ax(Y)->yGuides()",
      "\n  Guides.maxIndex->max y index");
    printUsage.Guides=true;
  }
    var o = {
      ax(axis) {
        if (axis==X) return this[X];
        if (axis==Y) return this[Y];
        return false;
      },
      calculate() {
        this[X].calculate();
        this[Y].calculate();
        this.maxIndex=this[Y].maxIndex;
      }
    }
    o[X]= new xGuides();
    o[Y]= new yGuides();
    o.calculate();
    return o;
}
function yGuides() {
  if (printUsage.on && !printUsage.yGuides) {
    console.log("--USAGE: yGuides()--",
      "\n  yGuides.index(i) -> yGuideObj at index i",
      "\n    (0=top; max=bottom)",
      "\n  yGuides.maxIndex->max y index");
    printUsage.yGuides=true;
  }
  var o = {
    axis:Y,
    index(i) {
      return this[i];
    },
    calculate() {
      var sep=params.hGuideSep.u;
      var page=params.page.height.u;
      var i
      for (i in this) {
        if (typeof i=="number") delete this[i];
      }
      for (i=0; i*sep<=page;i++) {
          this[i]=new yGuideObj({u:i*sep});
          this[i].index=i;
      }
      this.maxIndex=i-1;
    },
    maxIndex:null
  }
  return o;
}
function xGuides() {
  if (printUsage.on && !printUsage.xGuides) {
    console.log("--USAGE: xGuides()--",
      "\n  xGuides.side(SIDE) -> xGuideSide object for SIDE",
      "\n    (LEFT, RIGHT, CENTER)");
    printUsage.xGuides=true;
  }
  var o = {
    axis:X,
    side(s) {
      if (s==LEFT) return this[LEFT];
      if (s==RIGHT) return this[RIGHT];
      if (s==CENTER) return this[CENTER];
      return false;
    },
    calculate() {
      this.side(LEFT).calculate();
      this.side(RIGHT).calculate();
      this.side(CENTER).calculate();
    }
  }
  o[LEFT]=new xGuideSide(LEFT);
  o[RIGHT]=new xGuideSide(RIGHT);
  o[CENTER]=new xGuideSide(CENTER);
  return o;
}
function xGuideSide(side) {
  if (printUsage.on && !printUsage.xGuideSide) {
    console.log("--USAGE: xGuideSide()--",
      "\n  xGuideSide.ref(REF) -> xGuideObj for REF",
      "\n    (FOLD, FOLDINNER, STRIP, CENTER, etc.)");
    printUsage.xGuideSide=true;
  }
  var s;
  if (side==LEFT) s=LEFT;
  else if (side==RIGHT) s=RIGHT;
  else if (side==CENTER) s=CENTER;
  else console.log("Need a side. Given: ",side);
  var o = {
    side: s,
    refs: null,
    ref(ref) {
      return this[ref];
    },
    calculate() {
      var cOff=params.baseWidth.u/2;
      var finWidth=params.finishedWidth.u;
      var inner=params.inner.u;
      var stripWidth=params.stripWidth.u;
      if (this.side==LEFT) {
        this[FOLDOUT]=new xGuideObj({u:cOff-3*finWidth+inner,side:this.side});
        this[STRIP]=new xGuideObj({u:cOff-stripWidth/2,side:this.side});
        this[STRIPINNER]=new xGuideObj({u:cOff-stripWidth/2+inner,side:this.side});
        this[FOLD]=new xGuideObj({u:cOff-finWidth,side:this.side});
        this[FOLDINNER]=new xGuideObj({u:cOff-finWidth+inner,side:this.side});
      }
      else if (this.side==RIGHT) {
        this[FOLDOUT]=new xGuideObj({u:cOff+3*finWidth-inner,side:this.side});
        this[STRIP]=new xGuideObj({u:cOff+stripWidth/2,side:this.side});
        this[STRIPINNER]=new xGuideObj({u:cOff+stripWidth/2-inner,side:this.side});
        this[FOLD]=new xGuideObj({u:cOff+finWidth,side:this.side});
        this[FOLDINNER]=new xGuideObj({u:cOff+finWidth-inner,side:this.side});
      }
      else if (this.side==CENTER) {
        o[CENTER]=new xGuideObj({u:cOff,side:this.side});
      }
      else console.log("Cannot calculate x guides for side ",this.side);
      //console.log(this)
      return false;
    }
  };
  if (o.side==LEFT || o.side==RIGHT) {
    o[FOLDOUT]=null;
    o[STRIP]=null;
    o[STRIPINNER]=null;
    o[FOLD]=null;
    o[FOLDINNER]=null;
    o.refs=[FOLDOUT,STRIP,STRIPINNER,FOLD,FOLDINNER];
  }
  else if (o.side==CENTER) {
    o[CENTER]=null;
    o.refs=[CENTER];
  }
  else return false;
  return o;
}
function GuideObj(p) {
  if (printUsage.on && !printUsage.GuideObj) {
    console.log("--USAGE: GuideObj()--",
      "\n  GuideObj.raw -> measurement in raw units (e.g. inches)",
      "\n  GuideObj.u -> measurement in svg coords (e.g. px)",
      "\n  GuideObj.axis, .side, .index -> name attributes",
      "\n  GuideObj.name(prefix,suffix) -> a string that can be used for ids");
    printUsage.GuideObj=true;
  }
    var o = {
        name(prefix,suffix) {
          var str="";
          if (prefix) str+=prefix;
          if (this.axis==X) str+=this.side+"-"+this.ref;
          else str+=this.axis+"-"+this.index;
          if (suffix) str+=suffix;
          return str;
        },
        raw: null,
        u: null,
        axis: null,
        side: null,
        index: null,
        ref: null,
        setRaw(iRaw) {
            this.raw=iRaw;
            this.u=Math.round(params.units.to(iRaw));
        },
        setU(iU) {
            this.u=Math.round(iU);
            this.raw=params.units.from(iU);
        },
        setAxis(iAxis) {
            this.axis=iAxis;
        },
        down(unitObj) {
            var newY = this.u+unitObj.u;
            return new yGuideObj({u:newY});
        },
        up(unitObj) {
            var newY = this.u-unitObj.u;
            return new yGuideObj({u:newY});
        },
        left(unitObj) {
            var newX = this.u-unitObj.u;
            return new xGuideObj({u:newX});
        },
        right(unitObj) {
            var newX = this.u+unitObj.u;
            return new xGuideObj({u:newX});
        },
        inset(unitObj) {
            var newX;
            if (this.side==LEFT) newX = this.u+unitObj.u;
            else if (this.side==RIGHT) newX = this.u-unitObj.u;
            else return false;
            return new xGuideObj({u:newX});
        },
        outset(unitObj) {
            var newX;
            if (this.side==LEFT) newX = this.u-unitObj.u;
            else if (this.side==RIGHT) newX = this.u+unitObj.u;
            else return false;
            return new xGuideObj({u:newX});
        }
    }
    //if (def) console.log("todo: write arg handling for GuideObj constructor");
    var handled={};
    if (p.u!==undefined) {
      o.setU(p.u);
      delete p.u;
      delete p.raw;
      handled["u"]=true;
      handled["raw"]=true;
    }
    else if (p.raw!==undefined) {
      o.setRaw(p.raw);
      delete p.raw;
      handled["raw"]=true;
    }
    if (p.index!==undefined) {
      if (this.axis==Y) this.index=p.index;
      else delete p.index;
      handled["index"]=true;
    }
    for (var arg in p) {
      if (handled[arg]) continue;
      if (p[arg]===undefined) continue;
      console.log("handled",handled);
      console.log("arg in p:",p,p[arg]);
      try {
      console.error("Unhandled parameter at GuideObj: ",p,arg,p[arg]);
      throw "Unhandled parameter";
      } catch (err) {
        console.trace();
      }}
    return o;
}
function xGuideObj(p) {
    //if (def) console.log("todo: write arg handling for xGuideObj and have it remove args that shouldn't be passed to super");
    if (p.side) {
      var side=p.side;
      delete p.side;
    }
    var o = new GuideObj(p);
    o.axis=X;
    if (side) {
      o.side=side;
    }
    delete o.down;
    delete o.up;
    delete o.index;
    return o;
}
function yGuideObj(p) {
    //if (def) console.log("todo: write arg handling for yGuideObj and have it remove args that shouldn't be passed to super");
    var o = new GuideObj(p);
    o.axis=Y;
    delete o.left;
    delete o.right;
    delete o.inset;
    delete o.outset;
    delete o.side;
    delete o.ref;
    return o;
}