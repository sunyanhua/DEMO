/**
 * 结缘海报绘制模块（从 baoxi.html 原样抽取，报喜页与报喜列表页共用，保证海报样式完全一致）
 * drawPoster(im, data, targetCanvas?) -> canvas（750x1400）
 *   im: [我的照片, 对方照片, 双人合照, 吉祥物]
 *   data: { cn, mn, gender1, gender2, dateLabel, posterLines[] }
 */
function roundRectPath(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function coverDraw(ctx,im,x,y,w,h){
  var s=Math.max(w/im.width,h/im.height);
  var dw=im.width*s,dh=im.height*s;
  ctx.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}
function containDraw(ctx,im,x,y,w,h){
  var s=Math.min(w/im.width,h/im.height);
  var dw=im.width*s,dh=im.height*s;
  ctx.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}
function wrapText(ctx,text,cx,y,maxW,lineH){
  var chars=text.split(''),line='',yy=y;
  chars.forEach(function(c){
    if(ctx.measureText(line+c).width>maxW&&line){ctx.fillText(line,cx,yy);yy+=lineH;line=c;}
    else{line+=c;}
  });
  if(line)ctx.fillText(line,cx,yy);
}

function drawPoster(im,data,targetCanvas){
  var W=750,H=1400;
  var canvas=targetCanvas||document.createElement('canvas');canvas.width=W;canvas.height=H;
  var ctx=canvas.getContext('2d');
  var cn=data.cn,mn=data.mn;

  // 暖色渐变背景
  var g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#FFE9E0');g.addColorStop(0.5,'#FFF5F0');g.addColorStop(1,'#FFF9F6');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // 装饰光斑
  ctx.globalAlpha=0.5;ctx.fillStyle='#F7C3AC';
  ctx.beginPath();ctx.arc(690,100,140,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(-40,430,150,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=0.4;ctx.fillStyle='#F9D9C9';
  ctx.beginPath();ctx.arc(80,70,100,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(680,1300,110,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
  // 散落爱心
  ctx.globalAlpha=0.12;ctx.fillStyle='#E85D3A';ctx.font='18px sans-serif';
  [[95,260],[655,220],[130,1000],[640,940],[70,700],[680,560],[150,480],[620,780],[300,1160],[520,230]].forEach(function(p){ctx.fillText('♥',p[0],p[1]);});
  ctx.globalAlpha=1;
  // 双层边框
  ctx.strokeStyle='rgba(224,77,44,0.55)';ctx.lineWidth=3;
  roundRectPath(ctx,24,24,702,1352,28);ctx.stroke();
  ctx.strokeStyle='rgba(224,77,44,0.22)';ctx.lineWidth=1.5;
  roundRectPath(ctx,38,38,674,1324,22);ctx.stroke();
  // 四角爱心点缀
  ctx.fillStyle='rgba(224,77,44,0.45)';ctx.font='16px sans-serif';
  ctx.fillText('♥',58,60);ctx.fillText('♥',692,60);ctx.fillText('♥',58,1358);ctx.fillText('♥',692,1358);
  // 顶部认证标签
  ctx.textAlign='center';
  ctx.fillStyle='#B86A52';ctx.font='24px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('《他俩能成》 · 缘分认证',W/2,80);
  // 主标题
  var tg=ctx.createLinearGradient(W/2-170,0,W/2+170,0);
  tg.addColorStop(0,'#E85D3A');tg.addColorStop(1,'#C44569');
  ctx.fillStyle=tg;ctx.font='900 64px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('喜 结 良 缘',W/2,148);
  // 双人姓名
  ctx.fillStyle='#C44569';ctx.font='bold 26px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText(cn+' ❤ '+mn,W/2,196);
  // 双人圆形照片（白色相圈 + 姓名 + 性别符号）
  function drawPortrait(x,u,img){
    ctx.save();
    ctx.beginPath();ctx.arc(x,302,93,0,Math.PI*2);
    ctx.fillStyle='#FFFFFF';ctx.fill();
    ctx.strokeStyle='rgba(224,77,44,0.45)';ctx.lineWidth=2.5;ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.beginPath();ctx.arc(x,302,86,0,Math.PI*2);ctx.clip();
    coverDraw(ctx,img,x-86,216,172,172);
    ctx.restore();
    ctx.fillStyle='#3D1F1A';ctx.font='bold 30px "PingFang SC","Microsoft YaHei",sans-serif';
    var nw=ctx.measureText(u.name).width;
    ctx.fillText(u.name,x-nw/2-12,426);
    ctx.fillStyle=u.gender==='male'?'#5B8DEF':'#E85D3A';ctx.font='28px sans-serif';
    ctx.fillText(u.gender==='male'?'♂':'♀',x+nw/2+10,426);
  }
  drawPortrait(225,{name:data.cn,gender:data.gender1},im[0]);
  drawPortrait(525,{name:data.mn,gender:data.gender2},im[1]);
  // 中间爱心
  ctx.fillStyle='#E85D3A';ctx.font='46px sans-serif';
  ctx.fillText('❤',W/2,318);
  ctx.fillStyle='#8C6E67';ctx.font='22px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('相遇 · 相知 · 相守',W/2,464);
  // 分隔线
  ctx.strokeStyle='rgba(224,77,44,0.3)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(120,488);ctx.lineTo(630,488);ctx.stroke();
  // 结缘历程
  ctx.strokeStyle='rgba(224,77,44,0.4)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(215,520);ctx.lineTo(265,520);ctx.stroke();
  ctx.beginPath();ctx.moveTo(485,520);ctx.lineTo(535,520);ctx.stroke();
  ctx.fillStyle='#E85D3A';ctx.font='bold 26px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('结缘历程',W/2,528);
  // 时间线卡片
  ctx.fillStyle='rgba(255,255,255,0.62)';
  roundRectPath(ctx,70,540,610,160,20);ctx.fill();
  ctx.strokeStyle='rgba(224,77,44,0.15)';ctx.lineWidth=1.5;ctx.stroke();
  // 吉祥物（坐在时间线卡片右上角）
  containDraw(ctx,im[3],605,462,85,90);
  ctx.fillStyle='#E85D3A';ctx.font='bold 26px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('结缘于 '+data.dateLabel,W/2,584);
  ctx.fillStyle='#6B534C';ctx.font='23px "PingFang SC","Microsoft YaHei",sans-serif';
  var ly=622;
  data.posterLines.forEach(function(l){ctx.fillText(l,W/2,ly);ly+=38;});
  // 幸福时刻
  ctx.strokeStyle='rgba(224,77,44,0.4)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(215,730);ctx.lineTo(265,730);ctx.stroke();
  ctx.beginPath();ctx.moveTo(485,730);ctx.lineTo(535,730);ctx.stroke();
  ctx.fillStyle='#E85D3A';ctx.font='bold 26px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('幸福时刻',W/2,738);
  // 照片白底相框
  ctx.save();
  ctx.shadowColor='rgba(200,80,60,0.25)';ctx.shadowBlur=18;ctx.shadowOffsetY=6;
  ctx.fillStyle='#FFFFFF';
  roundRectPath(ctx,110,752,530,336,24);ctx.fill();
  ctx.restore();
  ctx.strokeStyle='rgba(224,77,44,0.25)';ctx.lineWidth=1.5;
  roundRectPath(ctx,110,752,530,336,24);ctx.stroke();
  ctx.save();
  roundRectPath(ctx,125,767,500,306,14);ctx.clip();
  coverDraw(ctx,im[2],125,767,500,306);
  ctx.restore();
  // 能成祝福
  ctx.strokeStyle='rgba(224,77,44,0.4)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(215,1118);ctx.lineTo(265,1118);ctx.stroke();
  ctx.beginPath();ctx.moveTo(485,1118);ctx.lineTo(535,1118);ctx.stroke();
  ctx.fillStyle='#E85D3A';ctx.font='bold 26px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('能成祝福',W/2,1126);
  // 祝福语卡片（全宽）
  ctx.fillStyle='rgba(255,255,255,0.62)';
  roundRectPath(ctx,70,1136,610,104,18);ctx.fill();
  ctx.strokeStyle='rgba(224,77,44,0.12)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#8C6E67';ctx.font='20px "PingFang SC","Microsoft YaHei",sans-serif';
  wrapText(ctx,'缘分，是茫茫人海里的一次回眸，也是两颗心跨越时间的坚定奔赴。感谢你们把这份喜悦分享给《他俩能成》，愿岁月可回首，深情共白头。',375,1176,550,30);
  // 喜字印章（右下角）
  ctx.save();
  ctx.beginPath();ctx.arc(646,1214,26,0,Math.PI*2);
  ctx.fillStyle='#E85D3A';ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=3;ctx.stroke();
  ctx.restore();
  ctx.fillStyle='#FFFFFF';ctx.font='bold 28px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('喜',646,1224);
  // 底部
  ctx.fillStyle='#B86A52';ctx.font='bold 22px "PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillText('能成世界，因你们而更精彩',W/2,1290);

  return canvas;
}

function loadImages(srcs, cb) {
    var els = [], loaded = 0, failed = false;
    srcs.forEach(function (src, i) {
        var im = new Image();
        im.onload = function () {
            els[i] = im;
            loaded++;
            if (loaded === srcs.length && !failed) cb(els);
        };
        im.onerror = function () { failed = true; };
        im.src = (window.IMG_DATA && window.IMG_DATA[src]) || src;
    });
}

window.BaoxiPoster = { draw: drawPoster, loadImages: loadImages };


// ====== 海报快照与下载（从 baoxi.html 原样抽取，报喜页与报喜详情页共用） ======
// 下载海报：先尝试 #poster DOM 快照导出，失败回退 canvas 绘制
// 只内联布局与视觉关键属性（全量 300+ 属性中的简写/怪异值会破坏 SVG 图片内渲染）
var COPY_PROPS=[
'display','position','top','right','bottom','left','width','height','min-width','min-height','max-width','max-height',
'margin-top','margin-right','margin-bottom','margin-left',
'padding-top','padding-right','padding-bottom','padding-left',
'border-top-width','border-right-width','border-bottom-width','border-left-width',
'border-top-style','border-right-style','border-bottom-style','border-left-style',
'border-top-color','border-right-color','border-bottom-color','border-left-color',
'border-radius','background-color','background-image','background-size','background-position','background-repeat','background-clip',
'box-shadow','color','opacity','font-family','font-size','font-weight','font-style','line-height','letter-spacing',
'text-align','text-decoration','text-transform','text-indent','text-overflow','white-space','word-break','vertical-align',
'align-items','align-content','justify-content','flex-direction','flex-wrap','flex-grow','flex-shrink','flex-basis',
'gap','row-gap','column-gap','order','object-fit','object-position','overflow','overflow-x','overflow-y',
'z-index','transform','filter','visibility','aspect-ratio','box-sizing','clear','float'
];
function inlineStyles(el){
  var cs=getComputedStyle(el);
  COPY_PROPS.forEach(function(name){
    el.style.setProperty(name,cs.getPropertyValue(name),cs.getPropertyPriority(name));
  });
}

// 按页面实际几何冻结布局：把每个盒子的坐标与尺寸固化为绝对定位，保证快照与页面逐像素一致
function freezeGeometry(root,clone){
  var pr=root.getBoundingClientRect();
  var srcs=[root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
  var dsts=[clone].concat(Array.prototype.slice.call(clone.querySelectorAll('*')));
  for(var i=0;i<srcs.length;i++){
    var s=srcs[i],d=dsts[i];
    if(!d)continue;
    var disp=getComputedStyle(s).display;
    var pp=s.parentElement;
    var pdisp=pp?getComputedStyle(pp).display:'block';
    var isFlexGridParent=pdisp==='flex'||pdisp==='inline-flex'||pdisp==='grid'||pdisp==='inline-grid';
    // 行内元素、img（preflight 下 display:block，但必须留在父级流内）与 flex/grid 容器的直接子项不冻结
    if(disp.indexOf('inline')===0||isFlexGridParent||s.tagName==='IMG')continue;
    var r=s.getBoundingClientRect();
    var prr=(i===0)?pr:pp.getBoundingClientRect();
    // 绝对定位相对父级内容盒原点（去掉边框/滚动条偏移，避免边框被重复计算）
    var contentX=prr.left+(pp?pp.clientLeft:0);
    var contentY=prr.top+(pp?pp.clientTop:0);
    var st=d.style;
    st.position='absolute';
    st.left=(r.left-contentX)+'px';
    st.top=(r.top-contentY)+'px';
    st.width=r.width+'px';
    st.height=r.height+'px';
    st.margin='0';
    st.transform='none';
  }
}

// 页面海报 DOM 快照 → SVG foreignObject → data URL → 图片（与页面版式完全一致）
function snapshotPoster(){
  var poster=document.getElementById('poster');
  if(!poster)return null;
  var w=poster.offsetWidth,h=poster.offsetHeight;
  if(!w||!h)return null;
  // 临时冻结页面动画（fade-in 未播完会拿到中间态位移），测量完恢复
  var animateEls=[poster].concat(Array.prototype.slice.call(poster.querySelectorAll('*')));
  animateEls.forEach(function(el){el.style.setProperty('animation','none','important');});
  var clone=poster.cloneNode(true);
  // 图片替换为内嵌 data URL，保证快照自包含、canvas 不被污染
  Array.prototype.forEach.call(clone.querySelectorAll('img'),function(img){
    var src=img.getAttribute('src');
    if(window.IMG_DATA&&window.IMG_DATA[src])img.setAttribute('src',window.IMG_DATA[src]);
  });
  // 挂到与海报等宽的离屏容器中，先内联视觉样式，再按页面几何冻结布局
  var holder=document.createElement('div');
  holder.style.cssText='position:absolute;left:-9999px;top:0;width:'+w+'px;';
  document.body.appendChild(holder);
  holder.appendChild(clone);
  inlineStyles(clone);
  Array.prototype.forEach.call(clone.querySelectorAll('*'),inlineStyles);
  clone.style.marginBottom='0';
  freezeGeometry(poster,clone);
  holder.removeChild(clone);
  document.body.removeChild(holder);
  animateEls.forEach(function(el){el.style.removeProperty('animation');});
  var pad=16;
  // 海报整体偏移留白，四周对称（绝对定位不受 wrapper padding 影响，需显式偏移）
  clone.style.left=pad+'px';
  clone.style.top=pad+'px';
  var bodyFont=getComputedStyle(document.body).fontFamily.replace(/"/g,"'");
  // 用 XMLSerializer 序列化：void 元素（img 等）自动自闭合，符合 XML 语法
  var html=new XMLSerializer().serializeToString(clone);
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+(w+pad*2)+'" height="'+(h+pad*2)+'">'+
    '<foreignObject width="100%" height="100%">'+
    '<div xmlns="http://www.w3.org/1999/xhtml" style="width:'+w+'px;height:'+(h+pad*2)+'px;padding:'+pad+'px;box-sizing:content-box;font-family:'+bodyFont+';">'+
    html+
    '</div></foreignObject></svg>';
  return {uri:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),w:w+pad*2,h:h+pad*2};
}

function fallbackPoster(drawData){
  loadImages(drawData.srcs,function(els){saveCanvas(draw(drawData.draw,els),drawData.draw.cn,drawData.draw.mn);});
}

function downloadPoster(drawData){
  try{
    var snap=snapshotPoster();
    if(snap){
      var img=new Image();
      img.onload=function(){
        try{
          var scale=2;
          var canvas=document.createElement('canvas');
          canvas.width=snap.w*scale;canvas.height=snap.h*scale;
          var ctx=canvas.getContext('2d');
          ctx.drawImage(img,0,0,canvas.width,canvas.height);
          // 空白检测：不支持 SVG 图片内 foreignObject 时渲染为空，转手绘兜底
          var data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
          var nonEmpty=false;
          for(var i=3;i<data.length;i+=4000){if(data[i]>0){nonEmpty=true;break;}}
          if(!nonEmpty){fallbackPoster(drawData);return;}
          saveCanvas(canvas);
        }catch(e){
          fallbackPoster(drawData);
        }
      };
      img.onerror=function(){fallbackPoster(drawData);};
      img.src=snap.uri;
      return;
    }
  }catch(e){}
  fallbackPoster(drawData);
}

function saveCanvas(canvas,cn,mn){
  try{
    canvas.toBlob(function(blob){
      if(!blob){window.Common.showToast('海报生成失败，请长按截图保存');return;}
      var a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download='结缘海报-'+(cn||'TA们')+'-'+(mn||'')+'.png';
      document.body.appendChild(a);a.click();
      setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1000);
      window.Common.showToast('海报已生成，开始下载');
    },'image/png');
  }catch(e){
    window.Common.showToast('海报导出失败，请长按截图保存');
  }
}


window.BaoxiPoster.download = downloadPoster;
window.BaoxiPoster.snapshot = snapshotPoster;
