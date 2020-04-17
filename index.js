const versionNo="0.4";

import {unitObj,meas} from './utils.js';
export {unitObj,meas};
import {svg,group,
  hLine,vLine,path,
  pathCmdList,text,setSvgAttributes,svgRect} from './svg.js';
export{path,pathCmdList,setSvgAttributes,group,text,svgRect};
import {
  LEFT,RIGHT,CENTER,SIDES,
  FOLD,FOLDINNER,FOLDOUT,STRIP,STRIPINNER,EDGE,REFS,
  SLIDE,GUIDE,BASE,SECTIONS,
  FILL,STYLE,TEXTANCHOR,FILLOPACITY,SVGATTRS,
  STYLETYPES,CUTOUT,CUT,REINFORCE,FRAME,
  SIDE,INDEX,REF,X,Y} from './const.js';
export {
  LEFT,RIGHT,CENTER,SIDES,
  FOLD,FOLDINNER,FOLDOUT,STRIP,STRIPINNER,EDGE,REFS,
  SLIDE,GUIDE,BASE,SECTIONS,
  FILL,STYLE,TEXTANCHOR,FILLOPACITY,SVGATTRS,
  STYLETYPES,CUTOUT,CUT,REINFORCE,FRAME,
  SIDE,INDEX,REF,X,Y};
import {Guides} from './guides.js';
export {guides}
import {topCutout,bottomCutout,splitterTabs,addCircleTabs} from './basicCuts.js';
export {topCutout,bottomCutout,splitterTabs,addCircleTabs};
import drawSlide from './drawSlide.js';
import drawGuide from './drawGuide.js';
import {printUsage,sectionConfig,style,params} from './config.js';
export {printUsage,params,style};

var guides = new Guides();
guides.calculate();

var svgDrawing = svg(params.page.width.u,params.page.height.u);
document.body.appendChild(svgDrawing);

for (let sectI in SECTIONS) {
  var sect=SECTIONS[sectI];
  var groupObj = group(sect);
  var sectConfig=sectionConfig.get(sect);
  groupObj.setAttribute("transform","translate("+sectConfig.offset.u+" "+0+")");
  svgDrawing.appendChild(groupObj);

  var frame = svgRect({x1:0,y1:0,width:params.baseWidth.u,height:params.page.height.u,id:sect+"-frame",styletype:FRAME});
  if (sect==BASE) setSvgAttributes(frame,"fold");
  groupObj.appendChild(frame);

  for (const i in SIDES) {
    let side=SIDES [i];
    for (const j in REFS) {
      let ref=REFS[j];
      if (guides.ax(X).side(side).ref(ref)) {
        var guide = vLine({x:{SIDE: side,REF:ref}});
        guide.setAttribute("id",(side+"-"+ref));
        guide.setAttribute("stroke",(style.guide.stroke));
        groupObj.append(guide);
      }
    }
  }
  if (sect==BASE) addCircleTabs(groupObj,RIGHT);
  if (sect==SLIDE) addCircleTabs(groupObj,RIGHT);
}

drawGuide(svgDrawing.getElementById(GUIDE));
drawSlide(svgDrawing.getElementById(SLIDE));
 
var hGuideSep=params.hGuideSep;
svgDrawing.appendChild(text("BiasTapeMaker v"+versionNo,"version-tag",{x:"50%",y:5*hGuideSep.u,fill:"#000","text-anchor":"middle"}));
svgDrawing.appendChild(text("Designed by Kendra Pendolino","credits-kpendolino",{x:"50%",y:6*hGuideSep.u,fill:"#000","text-anchor":"middle"}));
svgDrawing.appendChild(text("For "+params.stripWidth.raw+" inch wide strips","strip-width",{x:"50%",y:7*hGuideSep.u,fill:"#000","text-anchor":"middle"}));
svgDrawing.appendChild(text("Makes "+params.finishedWidth.raw+" inch double-fold","finished-width",{x:"50%",y:8*hGuideSep.u,fill:"#000","text-anchor":"middle"}));

svgRect({x1:{SIDE:LEFT,REF:FOLD},y1:100,x2:10,y2:40,id:"test-svg-rect",styletype:CUTOUT});
