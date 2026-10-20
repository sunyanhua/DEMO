/**
 * 结缘海报 DOM 渲染模块（从 baoxi.html renderReport 原样抽取，报喜页与报喜详情页共用，样式完全一致）
 * BaoxiReport.posterHtml(data) -> 海报 HTML
 *   data: { cn, mn, portraits:[{name,gender,photo} x2], events:[], couplePhoto, blessing, giftSectionHtml? }
 */
function reportPosterPortrait(u){
  var gs=u.gender==='male'
    ?'<span class="font-bold" style="color:#5B8DEF;">♂</span>'
    :'<span class="font-bold" style="color:#E85D3A;">♀</span>';
  return '<div class="flex flex-col items-center">'+
    '<div class="w-28 h-28 rounded-full overflow-hidden" style="background:#fff;box-shadow:0 0 0 3px #fff,0 0 0 5px rgba(224,77,44,0.35),0 6px 16px rgba(200,80,60,0.18);">'+
      '<img src="'+u.photo+'" class="w-full h-full object-cover"/>'+
    '</div>'+
    '<div class="mt-2 flex items-center gap-1"><span class="text-sm font-bold" style="color:#3D1F1A;">'+u.name+'</span>'+gs+'</div>'+
  '</div>';
}

var BLESSING='缘分，是茫茫人海里的一次回眸，也是两颗心跨越时间与距离的坚定奔赴。从相遇、相知到相守，你们把平凡的每一天都过成了值得纪念的诗。感谢你们把这份喜悦分享给《他俩能成》，愿你们今后的每一个清晨都有彼此的笑意，每一段旅程都有彼此的温度；愿岁月可回首，深情共白头。';

(function () {
    if (!document.getElementById('baoxi-report-css')) {
        var s = document.createElement('style');
        s.id = 'baoxi-report-css';
        s.textContent = '.tl-item{position:relative;padding-left:30px;padding-bottom:24px;border-left:1.5px dashed #F0D5CD;margin-left:12px;}.tl-item:last-child{border-left-color:transparent;padding-bottom:0;}.tl-dot{position:absolute;left:-11px;top:3px;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#FFF0EC;color:#E85D3A;}.tl-time{font-size:11px;color:#B8A09A;margin-bottom:4px;}.tl-text{font-size:13px;color:#5C4640;line-height:1.7;}.tl-text b{color:#E85D3A;margin:0 2px;}@keyframes reportBounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);}}';
        document.head.appendChild(s);
    }
})();

function reportPosterHtml(data){
  var icons=['user-plus','clock','sparkles','heart','heart-handshake','users','zap'];
  var tl=data.events.map(function(e,i){
    return '<div class="tl-item fade-in">'+
      '<div class="tl-dot"><i data-lucide="'+(icons[i]||'heart')+'" class="w-3 h-3"></i></div>'+
      (e.time?'<div class="tl-time">'+e.time+'</div>':'')+
      '<div class="tl-text">'+e.html+'</div>'+
    '</div>';
  }).join('');

  return '<div class="px-4 pt-4 pb-8">'+
      // ====== 整体结缘海报 ======
      '<div id="poster" class="relative overflow-hidden mb-4" style="border-radius:24px;background:linear-gradient(180deg,#FFE9E0 0%,#FFF5F0 55%,#FFF9F6 100%);border:3px solid rgba(224,77,44,0.55);box-shadow:0 12px 40px rgba(200,80,60,0.18);">'+
        '<div style="position:absolute;inset:10px;border:1.5px solid rgba(224,77,44,0.22);border-radius:16px;pointer-events:none;z-index:2;"></div>'+
        '<div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:rgba(247,195,172,0.5);filter:blur(12px);"></div>'+
        '<div style="position:absolute;top:140px;left:-50px;width:160px;height:160px;border-radius:50%;background:rgba(249,217,201,0.45);filter:blur(12px);"></div>'+
        '<div style="position:absolute;bottom:140px;right:-30px;width:150px;height:150px;border-radius:50%;background:rgba(247,195,172,0.4);filter:blur(12px);"></div>'+
        '<span style="position:absolute;top:110px;left:26px;font-size:12px;color:rgba(224,77,44,0.28);">♥</span>'+
        '<span style="position:absolute;top:190px;right:30px;font-size:11px;color:rgba(224,77,44,0.22);">♥</span>'+
        '<span style="position:absolute;bottom:220px;left:20px;font-size:11px;color:rgba(224,77,44,0.22);">♥</span>'+
        '<span style="position:absolute;bottom:120px;right:24px;font-size:12px;color:rgba(224,77,44,0.28);">♥</span>'+
        '<span style="position:absolute;top:16px;left:16px;font-size:14px;color:rgba(224,77,44,0.45);">♥</span>'+
        '<span style="position:absolute;top:16px;right:16px;font-size:14px;color:rgba(224,77,44,0.45);">♥</span>'+
        '<span style="position:absolute;bottom:16px;left:16px;font-size:14px;color:rgba(224,77,44,0.45);">♥</span>'+
        '<span style="position:absolute;bottom:16px;right:16px;font-size:14px;color:rgba(224,77,44,0.45);">♥</span>'+
        '<div class="relative z-[1] px-5 pt-5 pb-6 text-center">'+
          // 顶部认证与主标题
          '<p class="text-xs" style="color:#B86A52;letter-spacing:2px;">《他俩能成》 · 缘分认证</p>'+
          '<h2 class="mt-2" style="font-size:30px;font-weight:900;letter-spacing:6px;background:linear-gradient(135deg,#E85D3A,#C44569);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">喜 结 良 缘</h2>'+
          '<p class="mt-1.5 text-sm font-bold" style="color:#C44569;">'+data.cn+' ❤ '+data.mn+'</p>'+
          // 双人图片
          '<div class="flex items-start justify-center mt-4 fade-in">'+
            reportPosterPortrait(data.portraits[0])+
            '<span class="mx-4 mt-10 text-2xl heartbeat" style="color:#E85D3A;">❤</span>'+
            reportPosterPortrait(data.portraits[1])+
          '</div>'+
          '<p class="mt-2.5 text-xs" style="color:#8C6E67;letter-spacing:3px;">相遇 · 相知 · 相守</p>'+
          '<div style="height:1px;margin:16px 0 14px;background:linear-gradient(90deg,transparent,rgba(224,77,44,0.35),transparent);"></div>'+
          // 结缘历程（右上角吉祥物）
          '<div class="text-left fade-in">'+
            '<p class="text-sm font-black mb-3 flex items-center gap-1.5" style="color:#3D1F1A;"><span>💌</span>结缘历程</p>'+
            '<div class="relative">'+
              '<img src="images/cheng.png" class="w-14 absolute" style="top:-36px;right:6px;animation:reportBounce 1.8s ease-in-out infinite;filter:drop-shadow(0 4px 10px rgba(200,80,60,0.22));"/>'+
              '<div class="pl-1">'+tl+'</div>'+
            '</div>'+
          '</div>'+
          // 幸福时刻
          '<div class="text-left mt-4 fade-in">'+
            '<p class="text-sm font-black mb-3 flex items-center gap-1.5" style="color:#3D1F1A;"><span>📷</span>幸福时刻</p>'+
            '<div class="rounded-2xl p-2 bg-white" style="box-shadow:0 8px 24px rgba(200,80,60,0.16);">'+
              '<img src="'+data.couplePhoto+'" class="w-full rounded-xl object-cover" style="max-height:300px;"/>'+
            '</div>'+
          '</div>'+
          // 能成祝福（全宽卡片 + 右下角喜字印章）
          '<div class="text-left mt-4 fade-in">'+
            '<p class="text-sm font-black mb-3 flex items-center gap-1.5" style="color:#3D1F1A;"><span>💕</span>能成祝福</p>'+
            '<div class="relative rounded-2xl px-4 pt-4 pb-3" style="background:rgba(255,255,255,0.62);border:1px solid rgba(224,77,44,0.12);">'+
              '<p class="text-xs leading-relaxed" style="color:#8C6E67;">'+data.blessing+'</p>'+
              '<span class="absolute -bottom-2 right-3 w-10 h-10 rounded-full text-white text-base font-black flex items-center justify-center" style="background:#E85D3A;box-shadow:0 4px 12px rgba(224,77,44,0.35);">喜</span>'+
            '</div>'+
          '</div>'+
          // 底部
          '<p class="mt-6 text-xs font-bold" style="color:#B86A52;">能成世界，因你们而更精彩</p>'+
          (data.giftSectionHtml||'')+
        '</div>'+
      '</div>';
}

window.BaoxiReport = { posterHtml: reportPosterHtml, blessing: BLESSING };
