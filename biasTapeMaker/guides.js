export const LEFT="left";
export const RIGHT="right";
export const CENTER="center";
export const FOLD="fold";
export const FOLDINNER="foldInner";
export const FOLDOUT="foldOut";
export const STRIP="strip";
export const STRIPINNER="stripInner";
export const EDGE="edge";
export const SLIDE="slide";
export const GUIDE="guide";
export const BASE="base";
export const SIDE="side";
export const INDEX="index";

const X="x";
const Y="y";

function Guides() {
    
}

function yGuides() {
    
}

function xGuides() {
    
}

function xGuideSide() {
    
    
}

/*
usage examples

Guides.x.side(SIDE).ref(REF) -> GuideObj
Guides.x -> xGuides
  xGuides.side(SIDE) -> xGuideSide
    xGuideSide.ref(REF) -> GuideObj
    
Guides.y.ind(INDEX) -> GuideObj
Guides.y -> yGuides
  yGuides.ind(INDEX) -> GuideObj
  
GuideObj.u -> meas in px
GuideObj.raw -> meas in decimal units
GuideObj.below(unitObj) -> new GuideObj relative
        .above(unitObj)
        .left(unitObj)
        .right(unitObj)
        .inset()
        .outset()

*/

function GuideObj(def) {
    var o = {
        name: null,
        raw: null,
        u: null,
        axis: null,
        setName(iName) {
            this.name=iName;
        },
        setRaw(iRaw) {
            this.raw=iRaw;
            this.u=toUnits(iRaw);
        },
        setU(iU) {
            this.u=iU;
            this.raw=toRaw(iU);
        },
        setAxis(iAxis) {
            this.axis=iAxis;
        },
        below: false,
        above: false,
        left: false,
        right: false,
        inset: false,
        outset: false
    }
    if (def) console.log("todo: write arg handling for GuideObj constructor");
    return o;
}

function xGuideObj(def) {
    console.log("todo: write arg handling for",
        "xGuideObj and have it remove args that",
        "shouldn't be passed to super");
    var o = new GuideObj(def);
    o.axis=X;
    delete o.below;
    delete o.above;
    return o;
}

function yGuideObj(def) {
    console.log("todo: write arg handling for",
        "yGuideObj and have it remove args that",
        "shouldn't be passed to super");
    var o = new GuideObj(def);
    o.axis=Y;
    delete o.left;
    delete o.right;
    delete o.inset;
    delete o.outset;
    return o;
}

var obj=new GuideObj("a");
console.log("obj: ",obj);
console.log("obj.name: ",obj.name);
obj.setName("poodles");
console.log("obj.setName(\"poodles\")");
console.log("obj.name: ",obj.name);

var xObj=new xGuideObj("b");
console.log(xObj);

var yObj=new yGuideObj("c");
console.log(yObj);