/* MYSG app: router, layout and pages */
(function(){
const M = window.MTM;
const $ = (s, el=document) => el.querySelector(s);
const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
M.esc = esc;
const MTM_URL = 'https://movetomalaysia.com/';
const EXT = `href="${MTM_URL}" target="_blank" rel="noopener"`;
M.toast = msg => { const t=$('#toast'); t.textContent=msg; t.style.display='block'; clearTimeout(t._h); t._h=setTimeout(()=>t.style.display='none',2600); };

/* ---------- icons (inline, simple) ---------- */
const I = {
  video:'🎥', pin:'📍', users:'👥', star:'★', cal:'📅', ticket:'🎟️', mic:'🎤', heart:'❤️', expert:'🏅', home:'🏠', school:'🎓', car:'🚗', shield:'🛡️', coffee:'☕', wallet:'👛', map:'🗺️', chat:'💬', mail:'✉️', clock:'⏱️', check:'✔️'
};

/* ---------- navigation ---------- */
const GUIDES = [
  ['mg-visa','Visa & Immigration'],['mg-schools','International Schools'],['mg-property','Property and Housing'],
  ['mg-commuting','Commuting into Singapore'],['mg-cost-of-living','Cost of Living'],['mg-car','Private Transport'],['mg-js-sez','JS-SEZ']];
function buildNav(){}
const TITLES = {blog:'Blog',more:'More',guides:'Guides & tools'};
const TOP = ['home','guides','blog','more'];
function appbar(r){
  const bar=$('#appbar');
  if(r==='home'){ bar.className='appbar'; bar.innerHTML=`<a class="logo" href="#home" aria-label="MYSG home">MY<b>SG</b></a><div class="seg" role="tablist">${[['all','All'],['families','Family'],['retirees','Retire'],['business','Business']].map(([k,l])=>`<button data-aud="${k}" class="${aud===k?'on':''}">${l}</button>`).join('')}</div>`;
    bar.querySelectorAll('[data-aud]').forEach(x=>x.onclick=()=>{ aud=x.dataset.aud; render(); }); return; }
  const g = M.guides && M.guides[r], title = g ? g.title.split(':')[0].replace(' Guide','') : r.startsWith('blog-') ? 'Article' : (TITLES[r]||'MYSG');
  const top = TOP.includes(r);
  bar.className='appbar inner';
  bar.innerHTML = `${top?'':`<button class="back" id="backbtn" aria-label="Back"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg></button>`}<div class="ttl">${title}</div><a class="logo" href="#home" style="font-size:1.1rem" aria-label="MYSG home">MY<b>SG</b></a>`;
  const bb=$('#backbtn'); if(bb) bb.onclick=()=>{ if(history.length>1) history.back(); else location.hash='home'; };
}
function buildFooter(){
  $('#footer').innerHTML = `<div class="wrap"><div class="fgrid">
    <div><div class="flogo">MY<b>SG</b></div><p style="margin-top:10px">Free guides and tools for moving from Singapore to Johor.</p></div>
    <div><h4>Guides</h4><ul>${GUIDES.map(([r,l])=>`<li><a href="#${r}">${l}</a></li>`).join('')}<li><a href="#blog">Articles</a></li></ul></div>
    <div><h4>Relocation help</h4><ul><li><a ${EXT}>Visit movetomalaysia.com</a></li></ul></div>
  </div>
  <div class="fbot"><p style="margin:0">Guide content is general information only. For personalised relocation support, visit <a ${EXT}><u>movetomalaysia.com</u></a>.</p></div></div>`;
}

/* ---------- shared blocks ---------- */
const sec = (inner, cls='') => `<section class="sec ${cls}"><div class="wrap">${inner}</div></section>`;
const phero = (title, sub, extra='') => `<section class="phero"><div class="wrap"><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}${extra}</div></section>`;
const cta = (h, p, btns) => `<section class="sec cta"><div class="wrap center"><h2>${h}</h2><p class="lead" style="color:#fff">${p}</p><div class="btns">${btns}</div></div></section>`;
const card = (inner, cls='') => `<div class="card ${cls}">${inner}</div>`;
const initials = n => n.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
M.ui = {sec, phero, cta, card};

/* ---------- PAGES ---------- */
const P = {};

let aud='all';
const SEARCH = () => [
  ...(M.guides?Object.entries(M.guides).map(([r,g])=>[r,'📘',g.title,'Guide']):[]),
  ...M.articles.filter(a=>!a.soon&&a.slug).map(a=>['blog-'+a.id,'📝',a.title,'Article'])];
const POP = {
  all:[['mg-visa','🛂','#E6E8F7','Visa & passes','12 visa types'],['mg-property','🏠','#FDE7E9','Property & areas','15 areas'],['mg-schools','🎓','#E6E8F7','International schools','22 schools'],['mg-commuting','🚗','#FDE7E9','Commute to SG','Cost & time']],
  families:[['mg-schools','🎓','#E6E8F7','International schools','22 schools'],['mg-property','🏠','#FDE7E9','Family areas','15 areas'],['blog-family-activities','🎡','#FDE7E9','Weekend activities','Family guide'],['blog-childcare-options','🧸','#E6E8F7','Childcare','Nurseries & kindy']],
  retirees:[['blog-mm2h-program','🛂','#E6E8F7','MM2H guide','Long-stay visa'],['blog-healthcare-retirees','🏥','#E6E8F7','Healthcare','Hospitals & insurance'],['mg-cost-of-living','💰','#FDE7E9','Cost of living','Build a basket'],['blog-retirement-communities','🌴','#FDE7E9','Retirement living','Communities']],
  business:[['mg-js-sez','🏢','#E6E8F7','JS-SEZ','Zones & incentives'],['blog-business-setup','📄','#FDE7E9','Company setup','Step by step'],['blog-tax-incentives','💼','#E6E8F7','Tax incentives','As low as 0–5%'],['blog-corporate-relocation','👔','#FDE7E9','Move your team','Corporate relocation']]};
P.home = () => `
<div class="hhead"><h1>Moving to Johor, <span>made simple.</span></h1>
 <label class="search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="q" type="search" placeholder="Search guides and articles…" aria-label="Search" autocomplete="off"></label>
 <div class="sres" id="sres" hidden></div></div>
<div class="shd"><h2>Popular</h2><div><a href="#guides">All guides</a></div></div>
<div class="big">${POP[aud].map(([r,i,bg,t,s])=>`<a class="bigt" href="#${r}"><span class="ic" style="background:${bg}">${i}</span><span><b>${t}</b><small>${s}</small></span></a>`).join('')}</div>
<div class="icons">${[['mg-cost-of-living','💰','Cost of living'],['mg-car','🚙','Cars & road tax'],['mg-js-sez','🏢','JS-SEZ'],['blog','📝','Articles']].map(([r,i,l])=>`<a href="#${r}"><span>${i}</span>${l}</a>`).join('')}</div>
<div class="promos" id="promos">
 <a class="promo dark" ${EXT}><span class="tag">↗</span><div class="k">Need help with your move?</div><h3>Visit Move to Malaysia</h3><span class="chipw">🌏 movetomalaysia.com</span></a>
</div>`;
function bindHome(root){
  const q=$('#q',root), box=$('#sres',root), idx=SEARCH();
  q.oninput=()=>{ const v=q.value.trim().toLowerCase(); if(!v){ box.hidden=true; return; }
    const hits=idx.filter(x=>(x[2]+' '+x[3]).toLowerCase().includes(v)).slice(0,8);
    box.hidden=false; box.innerHTML = hits.length ? hits.map(([r,i,t,s])=>`<a href="#${r}"><span>${i}</span><span>${esc(t)}<small>${esc(s)}</small></span></a>`).join('') : `<a ${EXT}><span>🌏</span><span>No match. Ask Move to Malaysia<small>movetomalaysia.com</small></span></a>`; };
}
P.more = () => `<div class="hhead"><h1 style="margin-bottom:12px">More</h1></div>
<div class="promos"><a class="promo dark" ${EXT}><span class="tag">↗</span><div class="k">Relocation support</div><h3>Visit movetomalaysia.com</h3><span class="chipw">🌏 Webinars, tours and concierge</span></a></div>
<div class="list">${[['guides','📘','All guides & tools'],['blog','📝','Articles']].map(([r,i,l])=>`<a href="#${r}"><span class="i">${i}</span>${l}</a>`).join('')}</div>
<p class="legal">Guide content is general information only and may change. Check official sources before you decide.</p>`;

/* Blog */
const catIcon = {families:'👨‍👩‍👧‍👦',retirees:'🏖️',business:'💼'};
const catLabel = {families:'For Families',retirees:'For Retirees',business:'For Business Owners'};
let blogFilter = 'all';
const postCard = a => {
  const soon = a.soon || !a.slug;
  const inner = `<div class="art" aria-hidden="true">${catIcon[a.cat]}${soon?'<span class="badge red">Coming Soon</span>':''}</div><div class="bd"><h3>${a.title}</h3><p class="small muted">${a.date}</p><p>${a.excerpt}</p>${soon?'':'<span class="link-arrow">Read Article →</span>'}</div>`;
  return soon ? `<div class="card post-card soon">${inner}</div>` : `<a class="card post-card" href="#blog-${a.id}">${inner}</a>`;
};
P.blog = () => {
  const cats = M.blogCats.filter(c => blogFilter==='all' || c.id===blogFilter);
  return `${phero('Blog','Insights, guides, and stories about relocating to Johor, Malaysia')}
  ${sec(`<div class="btns" style="justify-content:center;margin-bottom:36px">${[['all','All Articles'],['families','👨‍👩‍👧‍👦 For Families'],['retirees','🏖️ For Retirees'],['business','💼 For Business Owners']].map(([id,l])=>`<button class="btn ${blogFilter===id?'':'outline'}" data-bf="${id}">${l}</button>`).join('')}</div>
  ${cats.map(c=>`<div style="margin-bottom:44px"><div style="display:flex;gap:14px;align-items:center;margin-bottom:18px"><div style="font-size:36px">${c.icon}</div><div><h2 style="margin:0">${c.title}</h2><p class="muted" style="margin:0">${c.desc}</p></div></div><div class="hscroll">${M.articles.filter(a=>a.cat===c.id).map(postCard).join('')}</div></div>`).join('')}`)}
  ${sec(`<div class="center"><h2>Stay Updated</h2><p class="lead">More articles are on the way. For relocation support, visit Move to Malaysia.</p><a class="btn" ${EXT}>Visit movetomalaysia.com</a></div>`,'alt')}`;
};
function blogPost(id){
  const html = M.posts[id]; if(!html) return null;
  const me = M.articles.find(a=>a.id===id);
  const rel = M.articles.filter(a=>a.cat===me.cat && a.id!==id && !a.soon && a.slug).slice(0,3);
  const related = `<div class="related"><h2>Related Articles</h2><div class="grid g3">${rel.map(postCard).join('')}</div></div>`;
  return `<div class="prose">${html.replace('<!--RELATED-->', related)}</div>`;
}

/* App home for guides */
P.guides = () => `<div class="hhead"><h1 style="margin-bottom:6px">Guides <span>& tools</span></h1><p class="muted small" style="margin:0 0 10px">Calculators and quizzes for planning your move.</p></div>
<div class="big fitgrid">${[['mg-visa','🛂','Visa & passes','Find your visa'],['mg-schools','🎓','Schools','Compare 22'],['mg-property','🏠','Property','Match an area'],['mg-commuting','🚗','Commute to SG','Cost & time'],['mg-cost-of-living','💰','Cost of living','Build a basket'],['mg-car','🚙','Cars','Price & road tax'],['mg-js-sez','🏢','JS-SEZ','Business zone'],['blog','📝','Articles','13 guides']].map(([r,i,t,s],k)=>`<a class="bigt" href="#${r}"><span class="ic" style="background:${k%2?'#FDE7E9':'#E6E8F7'}">${i}</span><span><b>${t}</b><small>${s}</small></span></a>`).join('')}</div>`;

/* ---------- router ---------- */
M.P = P;
function render(){
  let r = (location.hash || '#home').slice(1) || 'home';
  const app = $('#app');
  let html;
  if(r.startsWith('blog-')) html = blogPost(r.slice(5));
  else if(P[r]) html = P[r]();
  else if(M.guides && M.guides[r]) html = M.guides[r].html();
  if(html == null){ r='home'; html = P.home(); }
  app.innerHTML = html;
  app.dataset.route = r;
  app.classList.toggle('fit', ['home','guides','more'].includes(r));
  appbar(r);
  const tk = r.startsWith('mg-')||r==='guides' ? 'guides' : r.startsWith('blog') ? 'blog' : r==='home' ? 'home' : 'more';
  document.querySelectorAll('#tabbar [data-t]').forEach(x => x.classList.toggle('on', x.dataset.t===tk));
  const t = {blog:'Blog',guides:'Guides',more:'More'}[r];
  document.title = (t && r!=='home' ? t+' | ' : '') + 'MYSG';
  if(r==='blog') app.querySelectorAll('[data-bf]').forEach(b => b.onclick = () => { blogFilter=b.dataset.bf; render(); });
  if(r==='home') bindHome(app);
  if(M.guides && M.guides[r]) M.guides[r].bind(app);
}
M.render = render;
window.addEventListener('hashchange', () => { render(); $('#app').scrollTop=0; });
buildNav(); buildFooter(); render();
/* install prompt */
(function(){
  const box=$('#install'), standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  let seen=false; try{ seen = localStorage.getItem('mtm-install-x')==='1'; }catch(e){}
  if(standalone || seen) return;
  let deferred=null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred=e; box.classList.add('show'); });
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if(ios){ $('#installtxt').innerHTML='<strong>Install MYSG</strong><br>Tap the Share button, then <b>Add to Home Screen</b>.'; $('#installbtn').style.display='none'; setTimeout(()=>box.classList.add('show'),1500); }
  $('#installbtn').onclick = async () => { if(!deferred) return; deferred.prompt(); await deferred.userChoice; deferred=null; box.classList.remove('show'); };
  $('#installx').onclick = () => { box.classList.remove('show'); try{ localStorage.setItem('mtm-install-x','1'); }catch(e){} };
  window.addEventListener('appinstalled', () => box.classList.remove('show'));
})();
})();
