/* ExamMark-PTC — nút "Về đầu trang" + tab "tai thỏ" mở mục lục. Tắt JS thì trang vẫn đọc bình thường. */
(function(){
'use strict';
var d=document;
var h2s=[].slice.call(d.querySelectorAll('main h2'));
if(!h2s.length)return;

function slug(t){return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40)||'muc';}
function label(h){
  var c=h.cloneNode(true);
  [].forEach.call(c.querySelectorAll('.pill'),function(p){p.remove();});
  var n=c.querySelector('.n'),num='';
  if(n){num=n.textContent.trim()+'. ';n.remove();}
  return num+c.textContent.replace(/\s+/g,' ').trim();
}
var used={};
h2s.forEach(function(h){
  if(!h.id){var s=slug(h.textContent),k=s,i=2;while(d.getElementById(k)||used[k])k=s+'-'+(i++);h.id=k;}
  used[h.id]=1;
});

var pages=[['index.html','Trang chủ & tải về'],['gioi-thieu.html','Giới thiệu'],['huong-dan.html','Hướng dẫn sử dụng'],['tac-gia.html','Tác giả & Ủng hộ ☕'],['privacy.html','Quyền riêng tư']];
var here=(location.pathname.split('/').pop()||'index.html');

function el(tag,attrs,html){var e=d.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(html!=null)e.innerHTML=html;return e;}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* --- Nút về đầu trang --- */
var top=el('button',{type:'button','class':'to-top','aria-label':'Về đầu trang',title:'Về đầu trang'},'↑');
top.addEventListener('click',function(){
  var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({top:0,behavior:rm?'auto':'smooth'});
});
d.body.appendChild(top);

/* --- Tab tai thỏ + ngăn kéo mục lục --- */
var ear=el('button',{type:'button','class':'ear','aria-label':'Mở mục lục','aria-expanded':'false','aria-controls':'ear-panel'},'<span class="ear-ic">☰</span><span class="ear-tx">Mục lục</span>');
var back=el('div',{'class':'ear-back',hidden:''});
var html='<div class="ear-head"><b>Mục lục trang này</b><button type="button" class="ear-x" aria-label="Đóng">✕</button></div><nav class="ear-list" aria-label="Mục lục trang">';
h2s.forEach(function(h){html+='<a href="#'+h.id+'">'+esc(label(h))+'</a>';});
html+='</nav><div class="ear-sub">Các trang khác</div><nav class="ear-pages" aria-label="Các trang của website">';
pages.forEach(function(p){html+='<a href="'+p[0]+'"'+(p[0]===here?' aria-current="page"':'')+'>'+esc(p[1])+'</a>';});
html+='</nav>';
var panel=el('aside',{id:'ear-panel','class':'ear-panel','aria-hidden':'true',role:'dialog','aria-label':'Mục lục'},html);
d.body.appendChild(back);d.body.appendChild(panel);d.body.appendChild(ear);

var openState=false;
function setOpen(o){
  openState=o;
  d.documentElement.classList.toggle('ear-open',o);
  panel.setAttribute('aria-hidden',o?'false':'true');
  ear.setAttribute('aria-expanded',o?'true':'false');
  back.hidden=!o;
  if(o){var cur=panel.querySelector('.ear-list a.on')||panel.querySelector('.ear-list a');if(cur){try{cur.scrollIntoView({block:'center'});}catch(e){}}panel.querySelector('.ear-x').focus();}
  else if(d.activeElement&&panel.contains(d.activeElement)){ear.focus();}
}
ear.addEventListener('click',function(){setOpen(!openState);});
back.addEventListener('click',function(){setOpen(false);});
panel.querySelector('.ear-x').addEventListener('click',function(){setOpen(false);});
panel.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(a)setOpen(false);});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&openState)setOpen(false);});

/* --- Hiện nút lên đầu & đánh dấu mục đang đọc --- */
var links=[].slice.call(panel.querySelectorAll('.ear-list a'));
var ticking=false;
function update(){
  ticking=false;
  var y=window.pageYOffset||d.documentElement.scrollTop;
  top.classList.toggle('show',y>600);
  var cur=-1,line=y+110;
  for(var i=0;i<h2s.length;i++){if(h2s[i].getBoundingClientRect().top+y<=line)cur=i;else break;}
  links.forEach(function(a,i){a.classList.toggle('on',i===cur);});
}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
window.addEventListener('resize',update);
update();
})();
