import {LEFT,RIGHT,CENTER} from './const.js';
import {FOLD,FOLDINNER,FOLDOUT,STRIP,STRIPINNER} from './const.js';
//import {LEFT,RIGHT,CENTER} from './const.js';
import { params } from '../index.js';

const X="x";
const Y="y";

function Guides() {
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
        this[FOLDOUT]=new xGuideObj({u:cOff-3*finWidth/2,side:this.side});
        this[STRIP]=new xGuideObj({u:cOff-stripWidth/2,side:this.side});
        this[STRIPINNER]=new xGuideObj({u:cOff-stripWidth/2-inner,side:this.side});
        this[FOLD]=new xGuideObj({u:cOff-finWidth/2,side:this.side});
        this[FOLDINNER]=new xGuideObj({u:cOff-finWidth/2-inner,side:this.side});
      }
      else if (this.side==RIGHT) {
        this[FOLDOUT]=new xGuideObj({u:cOff-+3*finWidth/2,side:this.side});
        this[STRIP]=new xGuideObj({u:cOff+stripWidth/2,side:this.side});
        this[STRIPINNER]=new xGuideObj({u:cOff+stripWidth/2+inner,side:this.side});
        this[FOLD]=new xGuideObj({u:cOff+finWidth/2,side:this.side});
        this[FOLDINNER]=new xGuideObj({u:cOff+finWidth/2+inner,side:this.side});
      }
      else if (this.side==CENTER) {
        o[CENTER]=new xGuideObj({u:cOff,side:this.side});
      }
      else console.log("Cannot calculate x guides for side ",this.side);
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

/*
usage examples

Guides.calculate()
  -> xGuides.calculate()
    -> xGuidesSide.calculate()
      -> set each guide
  -> yGuides.calculate()
    -> set each guide

Guides.x.side(SIDE).ref(REF) -> GuideObj
Guides.x -> xGuides
  xGuides.side(SIDE) -> xGuideSide
    xGuideSide.ref(REF) -> xGuideObj
    
Guides.y.ind(INDEX) -> GuideObj
Guides.y -> yGuides
  yGuides.ind(INDEX) -> yGuideObj
  
GuideObj.u -> meas in px
GuideObj.raw -> meas in decimal units
GuideObj.below(unitObj) -> new GuideObj relative
        .above(unitObj)
        .left(unitObj)
        .right(unitObj)
        .inset()
        .outset()

*/

function GuideObj(p) {
    var o = {
        name: null,
        raw: null,
        u: null,
        axis: null,
        side: null,
        index: null,
        setName(iName) {
            this.name=iName;
        },
        setRaw(iRaw) {
            this.raw=Math.round(iRaw);
            this.u=Math.round(params.units.to(iRaw));
        },
        setU(iU) {
            this.u=Math.round(iU);
            this.raw=Math.round(params.units.from(iU));
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
    if (p.u) {
      o.setU(p.u);
      delete p.u;
      delete p.raw;
    }
    else if (p.raw) {
      o.setRaw(p.raw);
      delete p.raw;
    }
    if (p.index) {
      if (this.axis==Y) this.index=p.index;
      else delete p.index;
    }
    for (var arg in p) console.log("Unhandled parameter: ",arg);
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
    return o;
}

var obj=new Guides();
//console.log("obj: ",obj);
//console.log("obj.ax(X): ",obj.ax(X));
//console.log("obj.ax(X).side(LEFT): ",obj.ax(X).side(LEFT));
//console.log("obj.ax(X).side(LEFT).ref(FOLD): ",obj.ax(X).side(LEFT).ref(FOLD));
//console.log("obj.ax(Y)",obj.ax(Y));
//console.log("obj.ax(Y).index(32)",obj.ax(Y).index(32));
console.log("obj.ax(Y).index(obj.maxIndex))",obj.ax(Y).index(obj.maxIndex));
//console.log(obj.ax(Y).maxIndex)
//console.log("obj.ax(Y).index(44)",obj.ax(Y).index(44));
