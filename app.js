/* Move to Malaysia app: router, layout and site pages */
(function(){
const M = window.MTM;
const $ = (s, el=document) => el.querySelector(s);
const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
M.esc = esc;
const EMAIL = 'info@movetomalaysia.com';
const WA_SG = '6597883460';
const GOOGLE = 'https://www.google.com/maps/place/Move+to+Malaysia/@1.435437,103.7820173,17z';
const LINKS = {jme:'https://jme.movetomalaysia.com', jmx:'https://jmx.movetomalaysia.com'};
M.toast = msg => { const t=$('#toast'); t.textContent=msg; t.style.display='block'; clearTimeout(t._h); t._h=setTimeout(()=>t.style.display='none',2600); };

/* ---------- icons (inline, simple) ---------- */
const I = {
  video:'🎥', pin:'📍', users:'👥', star:'★', cal:'📅', ticket:'🎟️', mic:'🎤', heart:'❤️', expert:'🏅', home:'🏠', school:'🎓', car:'🚗', shield:'🛡️', coffee:'☕', wallet:'👛', map:'🗺️', chat:'💬', mail:'✉️', clock:'⏱️', check:'✔️'
};

/* ---------- navigation ---------- */
const GUIDES = [
  ['mg-visa','Visa & Immigration'],['mg-schools','International Schools'],['mg-property','Property and Housing'],
  ['mg-commuting','Commuting into Singapore'],['mg-cost-of-living','Cost of Living'],['mg-car','Private Transport'],['mg-js-sez','JS-SEZ']];
const NAV = [['home','Home'],['about','About'],['services','Services'],['MG','Master Guide'],['testimonials','Testimonials'],['blog','Blog'],['media','Media'],['contact','Contact']];
function buildNav(){}
const TITLES = {about:'About us',services:'Services','svc-essentials':'Webinar (JME)','svc-experience':'Tours (JMX)','svc-concierge':'Concierge (JMC)',testimonials:'Testimonials',blog:'Blog',media:'In the media',contact:'Contact',more:'More',guides:'Guides & tools','summit-2026':'Summit 2026','summit-2027':'Summit 2027'};
const TOP = ['home','guides','services','blog','more'];
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
  const svg = {
    fb:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z"/></svg>',
    ig:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    li:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 9h4v12H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm4 6h4v2c.6-1.1 2-2.2 4-2.2 4 0 4.5 2.6 4.5 6V21h-4v-5.5c0-1.4 0-3.2-2-3.2s-2.4 1.5-2.4 3.1V21H10z"/></svg>'};
  $('#footer').innerHTML = `<div class="wrap"><div class="fgrid">
    <div><div class="flogo">MoveTo<b>Malaysia</b>.com</div><p style="margin-top:10px">Your trusted partner for seamless relocation to Malaysia.</p>
      <div class="socials"><a href="https://www.facebook.com/movetomalaysia" target="_blank" rel="noopener" aria-label="Facebook">${svg.fb}</a><a href="https://www.instagram.com/moveto.malaysia" target="_blank" rel="noopener" aria-label="Instagram">${svg.ig}</a><a href="https://www.linkedin.com/company/movetomalaysia" target="_blank" rel="noopener" aria-label="LinkedIn">${svg.li}</a></div></div>
    <div><h4>Quick Links</h4><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li><li><a href="#services">Services</a></li><li><a href="#testimonials">Testimonials</a></li><li><a href="#blog">Blog</a></li><li><a href="#media">Media</a></li></ul></div>
    <div><h4>Services</h4><ul><li><a href="#svc-essentials">Johor Move Essentials (JME)</a></li><li><a href="#svc-experience">Johor Move eXperience (JMX)</a></li><li><a href="#svc-concierge">Johor Move Concierge (JMC)</a></li><li><a href="#summit-2026">Johor Move Summit 2026</a></li><li><a href="#summit-2027">Johor Move Summit 2027</a></li></ul></div>
    <div><h4>Contact</h4><ul><li><a href="mailto:${EMAIL}">${EMAIL}</a></li><li><a href="https://wa.me/${WA_SG}" target="_blank" rel="noopener">+65 97883460 (SG)</a></li><li><a href="https://wa.me/60149853460" target="_blank" rel="noopener">+60 149853460 (MY)</a></li></ul></div>
  </div>
  <div class="fbot"><p>By using this site, you agree to our <a href="https://movetomalaysia.com/terms" target="_blank" rel="noopener"><u>Terms of Service</u></a>, <a href="https://movetomalaysia.com/disclaimer" target="_blank" rel="noopener"><u>Disclaimer</u></a> and <a href="https://movetomalaysia.com/privacy" target="_blank" rel="noopener"><u>Privacy Policy</u></a>.</p>
  <p style="margin:0">MoveToMalaysia.com; Copyright © 2026 8M Advisory Pte Ltd. All Rights Reserved 2026.</p></div></div>`;
}

/* ---------- shared blocks ---------- */
const sec = (inner, cls='') => `<section class="sec ${cls}"><div class="wrap">${inner}</div></section>`;
const phero = (title, sub, extra='') => `<section class="phero"><div class="wrap"><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}${extra}</div></section>`;
const cta = (h, p, btns) => `<section class="sec cta"><div class="wrap center"><h2>${h}</h2><p class="lead" style="color:#fff">${p}</p><div class="btns">${btns}</div></div></section>`;
const card = (inner, cls='') => `<div class="card ${cls}">${inner}</div>`;
const initials = n => n.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
M.ui = {sec, phero, cta, card};

/* ---------- message composer (contact + summit forms) ---------- */
function composer(text, subject){
  const wa = `https://wa.me/${WA_SG}?text=${encodeURIComponent(text)}`;
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  return `<div class="note blue" style="margin-top:16px"><p style="margin-bottom:10px"><strong>Your message is ready.</strong> Choose how to send it. Nothing has been sent yet.</p>
    <div class="btns"><a class="btn" href="${wa}" target="_blank" rel="noopener">Send on WhatsApp</a><a class="btn outline" href="${mail}" target="_blank" rel="noopener">Send by email</a><button class="btn outline" type="button" data-copy>Copy message</button></div>
    <p class="small muted" style="margin:10px 0 0">Or write to ${EMAIL} directly.</p></div>`;
}
function bindCopy(root, text){
  const b = root.querySelector('[data-copy]'); if(!b) return;
  b.onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(()=>M.toast('Message copied')).catch(()=>M.toast('Select and copy the text above')); };
}

/* ---------- PAGES ---------- */
const P = {};

let aud='all';
const SEARCH = () => [
  ...(M.guides?Object.entries(M.guides).map(([r,g])=>[r,'📘',g.title,'Guide']):[]),
  ['services','🧭','Our services','JME, JMX, JMC'],['svc-essentials','🎥','Johor Move Essentials (JME)','Free webinar'],['svc-experience','📍','Johor Move eXperience (JMX)','Tours from SGD 299'],['svc-concierge','👥','Johor Move Concierge (JMC)','From SGD 2,000'],
  ['summit-2027','🎤','Johor Move Summit 2027','Register interest'],['about','ℹ️','About us','Team and story'],['testimonials','⭐','Testimonials','Client reviews'],['media','📰','In the media','Press coverage'],['contact','✉️','Contact','WhatsApp or email'],
  ...M.articles.filter(a=>!a.soon&&a.slug).map(a=>['blog-'+a.id,'📝',a.title,'Article'])];
const POP = {
  all:[['mg-visa','🛂','#E6E8F7','Visa & passes','12 visa types'],['mg-property','🏠','#FDE7E9','Property & areas','15 areas'],['mg-schools','🎓','#E6E8F7','International schools','22 schools'],['mg-commuting','🚗','#FDE7E9','Commute to SG','Cost & time']],
  families:[['mg-schools','🎓','#E6E8F7','International schools','22 schools'],['mg-property','🏠','#FDE7E9','Family areas','15 areas'],['blog-family-activities','🎡','#FDE7E9','Weekend activities','Family guide'],['blog-childcare-options','🧸','#E6E8F7','Childcare','Nurseries & kindy']],
  retirees:[['blog-mm2h-program','🛂','#E6E8F7','MM2H guide','Long-stay visa'],['blog-healthcare-retirees','🏥','#E6E8F7','Healthcare','Hospitals & insurance'],['mg-cost-of-living','💰','#FDE7E9','Cost of living','Build a basket'],['blog-retirement-communities','🌴','#FDE7E9','Retirement living','Communities']],
  business:[['mg-js-sez','🏢','#E6E8F7','JS-SEZ','Zones & incentives'],['blog-business-setup','📄','#FDE7E9','Company setup','Step by step'],['blog-tax-incentives','💼','#E6E8F7','Tax incentives','As low as 0–5%'],['blog-corporate-relocation','👔','#FDE7E9','Move your team','Corporate relocation']]};
P.home = () => `
<div class="hhead"><h1>Moving to Johor, <span>made simple.</span></h1>
 <label class="search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="q" type="search" placeholder="Search guides, services, articles…" aria-label="Search" autocomplete="off"></label>
 <div class="sres" id="sres" hidden></div></div>
<div class="shd"><h2>Popular</h2><div><a href="#guides">All guides</a></div></div>
<div class="big">${POP[aud].map(([r,i,bg,t,s])=>`<a class="bigt" href="#${r}"><span class="ic" style="background:${bg}">${i}</span><span><b>${t}</b><small>${s}</small></span></a>`).join('')}</div>
<div class="icons">${[['mg-cost-of-living','💰','Cost of living'],['mg-car','🚙','Cars & road tax'],['mg-js-sez','🏢','JS-SEZ'],['svc-essentials','🎥','Free webinar'],['svc-experience','📍','Book a tour'],['svc-concierge','👥','Concierge'],['summit-2027','🎤','Summit'],['more','▦','More']].map(([r,i,l])=>`<a href="#${r}"><span>${i}</span>${l}</a>`).join('')}</div>
<div class="promos" id="promos">
 <a class="promo red" href="#svc-essentials"><span class="tag">Free</span><div class="k">Johor Move Essentials</div><h3>60-minute webinar on planning your move</h3><span class="chipw">🎥 Live online · Q&amp;A</span></a>
 <a class="promo" href="#svc-experience"><span class="tag">From SGD 299</span><div class="k">Johor Move eXperience</div><h3>See homes, schools and daily life in person</h3><span class="chipw">📍 Johor Bahru</span></a>
 <a class="promo dark" href="#summit-2027"><span class="tag">2027</span><div class="k">Johor Move Summit</div><h3>Register your interest for next year</h3><span class="chipw">🎤 Dates to be announced</span></a>
</div><div class="dots" id="dots"><i class="on"></i><i></i><i></i></div>`;
function bindHome(root){
  const q=$('#q',root), box=$('#sres',root), idx=SEARCH();
  q.oninput=()=>{ const v=q.value.trim().toLowerCase(); if(!v){ box.hidden=true; return; }
    const hits=idx.filter(x=>(x[2]+' '+x[3]).toLowerCase().includes(v)).slice(0,8);
    box.hidden=false; box.innerHTML = hits.length ? hits.map(([r,i,t,s])=>`<a href="#${r}"><span>${i}</span><span>${esc(t)}<small>${esc(s)}</small></span></a>`).join('') : '<a href="#contact"><span>💬</span><span>No match. Ask us instead<small>WhatsApp or email</small></span></a>'; };
  const pr=$('#promos',root), dots=root.querySelectorAll('#dots i');
  pr.onscroll=()=>{ const i=Math.round(pr.scrollLeft/pr.clientWidth); dots.forEach((d,k)=>d.classList.toggle('on',k===i)); };
}
P.more = () => `<div class="hhead"><h1 style="margin-bottom:12px">More</h1></div>
<div class="list">${[['about','ℹ️','About us'],['testimonials','⭐','Testimonials'],['media','📰','In the media'],['contact','✉️','Contact us'],['summit-2027','🎤','Johor Move Summit 2027']].map(([r,i,l])=>`<a href="#${r}"><span class="i">${i}</span>${l}</a>`).join('')}</div>
<div class="icons" style="grid-template-columns:repeat(5,1fr)">${[['https://wa.me/'+WA_SG,'💬','WhatsApp SG'],['https://wa.me/60149853460','💬','WhatsApp MY'],['mailto:'+EMAIL,'✉️','Email'],['https://www.instagram.com/moveto.malaysia','📸','Instagram'],['https://www.facebook.com/movetomalaysia','👍','Facebook']].map(([u,i,l])=>`<a href="${u}" target="_blank" rel="noopener"><span>${i}</span>${l}</a>`).join('')}</div>
<p class="legal">By using this app, you agree to the <a href="https://movetomalaysia.com/terms" target="_blank" rel="noopener">Terms</a>, <a href="https://movetomalaysia.com/disclaimer" target="_blank" rel="noopener">Disclaimer</a> and <a href="https://movetomalaysia.com/privacy" target="_blank" rel="noopener">Privacy Policy</a>.<br>MoveToMalaysia.com · © 2026 8M Advisory Pte Ltd</p>`;

const TEAM = [
 ['Syafiqah Rahman',['Syafiqah Rahman is a passionate advocate for families seeking a fresh start across the Causeway. A mum to a lively primary school-going child, she knows the joys and challenges of relocating with children. In 2023, she and her family made the bold decision to sell their BTO flat in Singapore and begin a new chapter in Johor. That experience gave her invaluable, practical insights into everything from securing the right home to choosing the right school.','Balancing her role as a licensed real estate agent with a corporate career in the fast-moving quick commerce industry, Syafiqah combines professional expertise with lived experience. Her deep knowledge of Johor\'s property landscape, paired with her perspective as a working mum navigating a major move, enables her to guide families with both clarity and empathy.']],
 ['Shamir',['Shamir is a seasoned realtor with deep expertise across Singapore and Malaysian real estate, including corporate-level property development and dealmaking. Having successfully relocated with his own family in 2024, he understands the realities of cross-border moves which strongly complements his work with businesses planning strategic expansions.','With Johor\'s growing role under the JS-SEZ (Johor–Singapore Special Economic Zone), Shamir partners with companies looking to relocate high-profile staff or establish a stronger presence in Johor. He blends professional real estate expertise, corporate dealmaking experience, and cultural intelligence to deliver seamless relocations, from securing executive housing to advising on community integration. His mission is to help businesses move talent with confidence, while ensuring teams are set up to thrive in Malaysia\'s evolving economic landscape.']],
 ['Dainial Lim',['Dainial Lim is an award-winning immigration specialist with over a decade of experience helping individuals and families navigate the complexities of relocation. From Fortune 500 executives to local entrepreneurs, from handling visa applications to setting up companies from scratch, Dainial has guided countless clients to achieve their relocation dreams.','A recognised thought leader, Dainial has been featured in Berita Harian and Temasek Polytechnic\'s Alumni Spotlight. He has co-authored the best-selling book The Next Entrepreneur and served as an advisor on prominent boards, including the PSB Academy and the Singapore Malay Chamber of Commerce & Industry.']],
 ['Haikal Yeo',['Haikal Yeo, a former Ministry of Education officer, brings invaluable insights into Singapore\'s and Malaysia\'s education systems. With extensive experience in shaping educational policies, Haikal has done a detailed comparison of the two systems, highlighting key differences in curriculums, teaching approaches, and assessment methods.','He can address the critical question of which system might better suit your child\'s needs and aspirations, offering practical advice on selecting the right international school in Johor. Additionally, he is also able to share strategies to ensure a smooth transition for children adapting to a new learning environment, empowering families to make informed decisions about their children\'s education as part of their relocation journey.']]];

P.about = () => `${phero('About MoveToMalaysia.com',"We're passionate about helping people discover the opportunities and lifestyle that Johor, Malaysia has to offer.")}
${sec(`<div class="narrow" style="margin:0 auto"><h2 class="center">Our Story</h2>
<p>MoveToMalaysia.com was founded by a team of expatriates who experienced first-hand the challenges and rewards of relocating to Johor. After successfully making our own transitions, we realised there was a need for comprehensive, personalised support for others considering this life-changing move.</p>
<p>What started as informal guidance to friends and family has grown into a full-service relocation consultancy. We combine local expertise with international perspective to provide the most relevant and practical advice for your move.</p>
<p>Today, we aim to help families, retirees, and business owners successfully transition to life in Johor, and we're proud to be part of this vibrant, growing community.</p></div>`)}
${sec(`<h2 class="center">Our Values</h2><div class="grid g3" style="margin-top:28px">
 ${card(`<div class="chip red">${I.heart}</div><h3>Personalised Care</h3><p>Every client's journey is unique, and we tailor our services to your specific needs and circumstances.</p>`)}
 ${card(`<div class="chip red">${I.expert}</div><h3>Expert Guidance</h3><p>Our team has years of experience and local knowledge to guide you through every step of your relocation.</p>`)}
 ${card(`<div class="chip red">${I.users}</div><h3>Community Focus</h3><p>We don't just help you move. We help you integrate into the vibrant expat and local community.</p>`)}
</div>`,'alt')}
${sec(`<div class="grid g2">${card(`<h2>Our Mission</h2><p>To empower individuals and families to make informed decisions about relocating to Johor by providing comprehensive, personalised guidance and support throughout their journey.</p>`)}${card(`<h2>Our Vision</h2><p>To be the most trusted relocation partner for anyone considering a move to Malaysia, known for our expertise, personalised service, and commitment to client success.</p>`)}</div>`)}
${sec(`<h2 class="center">Who We Serve</h2><div class="grid g3" style="margin-top:28px">
 ${card(`<div style="font-size:40px">👨‍👩‍👧‍👦</div><h3>Families</h3><p>Seeking quality education, safe neighbourhoods, and a balanced lifestyle for their children.</p>`,'center')}
 ${card(`<div style="font-size:40px">🏖️</div><h3>Retirees</h3><p>Looking for an affordable, comfortable retirement destination with excellent healthcare.</p>`,'center')}
 ${card(`<div style="font-size:40px">💼</div><h3>Business Owners</h3><p>Exploring regional expansion opportunities in Southeast Asia's growing economy.</p>`,'center')}
</div>`,'alt')}
${sec(`<h2 class="center">Meet Our Team</h2><div class="team" style="margin-top:28px">${TEAM.map(([n,b])=>card(`<div class="av lg" aria-hidden="true">${initials(n)}</div><div><h3>${n}</h3>${b.map(p=>`<p>${p}</p>`).join('')}</div>`)).join('')}</div>`)}
${cta('Ready to Learn More?',"Let's discuss how we can help make your move to Johor a success.",`<a class="btn white" href="#svc-essentials">Join Free Webinar</a><a class="btn ghost-white" href="#contact">Contact Us</a>`)}`;

const SERVICES = [
 {t:'Johor Move Essentials (JME)',price:'FREE',tag:'Perfect for getting started',d:'Join our comprehensive 60-minute webinar covering everything you need to know before making your move to Johor.',icon:I.video,to:'svc-essentials',f:['60-minute comprehensive webinar','Overview of living in Johor','Cost of living breakdown','Visa and immigration basics','Get the Relocation Checklist for just SGD 17']},
 {t:'Johor Move eXperience (JMX)',price:'From SGD 299',tag:'Personalised tours',d:'Experience Johor first-hand with a personalised tour of the various neighbourhoods, international schools and lifestyle amenities.',icon:I.pin,to:'svc-experience',f:['Full-day personalised tour','Neighbourhood exploration','School visits (if applicable)','Shopping and amenities tour','Relocation Checklist (SGD 17 value included)']},
 {t:'Johor Move Concierge (JMC)',price:'From SGD 2,000',tag:'Planned and supported',d:'Your whole move decided and sequenced, then a dedicated WhatsApp line to your specialist while you carry it out.',icon:I.users,to:'svc-concierge',blue:1,f:['Visa and pass strategy','Neighbourhood and school shortlists','Real cost-of-living numbers','Dedicated WhatsApp support','Relocation Checklist (SGD 17 value included)']},
 {t:'Johor Move Summit (JMS)',price:'FREE',tag:'Our annual summit',d:'A day with the people who actually do this work: advisers, international schools, developers, bankers, healthcare groups and the government agencies behind the corridor, all in one room.',icon:I.mic,red:1,f:['Keynotes on the corridor and the JS-SEZ','Two talk tracks: family and business','One-to-one clinics with advisers','Exhibitor hall and child-minding','2027 dates to be announced'],links:[['JMS 2026','summit-2026',1],['JMS 2027','summit-2027']]}];
P.services = () => `${phero('Our Services','Comprehensive support for every stage of your relocation journey to Johor, Malaysia.')}
${sec(`<div class="grid g4">${SERVICES.map(s=>card(`<div class="chip ${s.blue?'blue':s.red?'red':''}">${s.icon}</div><h3>${s.t}</h3><div class="price">${s.price}</div><p class="muted small">${s.tag}</p><p>${s.d}</p><ul class="ticks">${s.f.map(x=>`<li>${x}</li>`).join('')}</ul>
 ${s.links?`<div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">${s.links.map(([l,r,o])=>`<a class="btn ${o?'outline':''}" href="#${r}">${l}</a>`).join('')}</div>`:`<a class="btn" style="width:100%" href="#${s.to}">Learn More →</a>`}`,'')).join('')}</div>`)}
${sec(`<h2 class="center">What We Cover</h2><div class="grid g2" style="margin-top:28px">
 ${[['Real Estate','Property search, viewings, negotiations, purchase and rental assistance across both sides of the Causeway.'],['Immigration','Visa advice and applications, permits, including Malaysia My Second Home (MM2H) programme application.'],['Education','International school selection, enrolment assistance, and curriculum guidance.'],['For Businesses','Market entry, corporate relocation, staff housing, corporate secretary services and business expansion support under JS-SEZ.']].map(([h,p])=>`<div class="why-item"><div class="chip red">✔</div><div><h3>${h}</h3><p>${p}</p></div></div>`).join('')}
</div>`,'alt')}`;

const regBtn = (href,label) => `<a class="btn" href="${href}" target="_blank" rel="noopener">${label}</a>`;
P['svc-essentials'] = () => `${phero('Johor Move Essentials <span>(JME)</span>','A free 60-minute webinar on planning your move, without the guesswork',`<div class="price-tag">Free</div><div>${regBtn(LINKS.jme,'Register for the Webinar')}</div>`)}
${sec(`<div class="center"><h2>Have these thoughts crossed your mind?</h2><p class="lead">Most people considering Johor arrive with the same three. None of them is unreasonable.</p></div><div class="grid g3" style="margin-top:28px">
 ${[['Is Johor safe enough for my family?','It is a settled choice for a lot of Singaporeans and other foreigners, and plenty of neighbourhoods are secure and family-oriented. The session covers which ones, and why.'],['Can the schools and infrastructure match Singapore?','Johor has a growing network of international schools, modern malls, and the RTS Link arriving in February 2027. We go through what exists today and what is still a plan.'],['Will I have to give up the conveniences I am used to?','Living costs are meaningfully lower, which is the point. The session covers where your Singapore dollar stretches and where it does not.']].map(([q,a])=>card(`<h3>${q}</h3><p>${a}</p>`)).join('')}</div>`)}
${sec(`<div class="center"><h2>What you'll learn</h2><p class="lead">The session is for anyone considering the move: families, retirees and business owners alike. It is the groundwork, not a sales pitch.</p></div><div class="grid g3" style="margin-top:28px">
 ${[['The must-know basics','Housing, schools and visa options, and how they fit together, so the decisions come in the right order.'],["Johor's most popular neighbourhoods",'An overview of where people actually settle, and which areas suit which lifestyles.'],['Choosing the right international school','The factors that decide a school: curriculum, where the campus sits, and what a year genuinely costs.'],['Expert guidance on visa options','The routes available, what each requires, and the questions we get asked most often.'],['The cost advantage, honestly','Where living in Johor is cheaper (food, transport, lifestyle) and where the saving is smaller than people expect.'],['Real stories from people who moved','Families and professionals who have done it, including what they would do differently.']].map(([h,p])=>card(`<div style="color:var(--accent);font-size:22px">✔</div><h3>${h}</h3><p>${p}</p>`)).join('')}</div>`,'alt')}
${sec(`<div class="center"><h2>A look inside the session</h2><p class="lead">Four slides from the deck, so you can see what an hour covers before you give up an evening for it.</p></div><div class="grid g4" style="margin-top:28px">
 ${['Why people move: cost of living, space, and the pace of life','What makes Johor attractive: the places you would actually use','The special zones, and what the JS-SEZ agreement changes','Whether JB property holds its value'].map((c,i)=>`<figure style="margin:0"><div class="figph">Slide ${i+1}</div><figcaption class="small muted" style="margin-top:8px">${c}</figcaption></figure>`).join('')}</div>`)}
${sec(`<div class="center"><h2>The people behind it</h2><p class="lead">Four of us, each having made the move or worked on it professionally. Between us we cover the ground the session goes over.</p></div><div class="grid g4" style="margin-top:28px">
 ${['Syafiqah Rahman, Singapore realtor living in Johor','Shamir Wahid, Singapore realtor living in Johor','Dainial Lim, immigration specialist','Haikal Yeo, education specialist'].map(n=>card(`<div class="av lg" style="margin:0 auto 12px">${initials(n.split(',')[0])}</div><p style="margin:0">${n}</p>`,'center')).join('')}</div><div class="center" style="margin-top:20px"><a class="link-arrow" href="#about">Read the full profiles →</a></div>`,'alt')}
${sec(`<h2 class="center">Webinar details</h2><div class="grid g3" style="margin-top:28px">
 ${[[I.video,'Format','Live online webinar with Q&A'],[I.clock,'Duration','60 minutes'],[I.users,'Who should attend','Anyone considering a move to Malaysia']].map(([i,h,p])=>card(`<div class="chip">${i}</div><h3>${h}</h3><p>${p}</p>`,'center')).join('')}</div><div class="center" style="margin-top:28px">${regBtn(LINKS.jme,'Register for the Webinar')}</div>`)}
${cta('Save your place','Takes under a minute. We will send the joining details by email.',regBtn(LINKS.jme,'Register for the Webinar').replace('class="btn"','class="btn white"'))}`;

P['svc-experience'] = () => `${phero('Johor Move eXperience <span>(JMX)</span>','See it for yourself. Housing, schools and daily life, over one day or two, planned around you',`<div class="price-tag">From SGD 299</div><div>${regBtn(LINKS.jmx,'Reserve Your Spot')}</div>`)}
${sec(`<div class="center"><h2>There is no substitute for standing there</h2><p class="lead">Photographs and floor plans tell you what a place contains, not what it is like. The tour takes you through the neighbourhoods, schools and everyday places you would actually use, with someone who can answer questions as they come up. We plan it with you, one day or two.</p></div><div class="grid g3" style="margin-top:28px">
 ${[[I.home,'See homes up close','Visit neighbourhoods that match your lifestyle, and stay in one, so you know what living there actually feels like.'],[I.school,'Tour the schools','Meet staff and walk the facilities at leading international schools, if that is part of your decision.'],[I.car,'Transport and planning','We handle the logistics and the route, so the days are spent looking rather than organising.'],[I.shield,'Visa guidance on the ground','Time with immigration specialists to go through the routes open to you and your family.'],[I.pin,'Neighbourhoods, not brochures','Horizon Hills, Iskandar Puteri and the rest, seen in person with someone who knows what has changed recently.'],[I.coffee,'The ordinary things','Cafes, malls, clinics and the weekend places: the parts of a week that decide whether somewhere suits you.']].map(([i,h,p])=>card(`<div class="chip">${i}</div><h3>${h}</h3><p>${p}</p>`)).join('')}</div>`)}
${sec(`<div class="center"><h2>What a tour actually looks like</h2><p class="lead">Photographs from recent groups: the crossing, a school, the developments people ask to see, and a visa briefing in between.</p></div><div class="grid g3" style="margin-top:28px">
 ${['The crossing, from the bus inspection bay at the checkpoint','Marlborough College Malaysia, with the admissions team','The Forest City gallery','R&F Marina Place','Round the scale model at Country Garden Danga Bay','A visa briefing on the ground, run by immigration specialist Dainial Lim'].map(c=>`<figure style="margin:0"><div class="figph">${I.pin} JMX tour</div><figcaption class="small muted" style="margin-top:8px">${c}</figcaption></figure>`).join('')}</div>`,'alt')}
${sec(`<div class="center"><h2>Feeling overwhelmed about relocating?</h2><p class="lead">The tour is built around the five things people tell us they cannot settle from a distance.</p></div><div class="grid g3" style="margin-top:28px">
 ${[['Safety','Unsure which neighbourhoods are genuinely safe and family-friendly.'],['Housing','Overwhelmed by how much is on the market, and worried about committing to the wrong place.'],['Schools','Unclear which international school is the right fit for your children.'],['Adjusting','Wondering whether daily life in Johor can match the conveniences you are used to.'],['Missing the window','Concerned about missing favourable pricing and the infrastructure going in now.']].map(([h,p])=>card(`<h3>${h}</h3><p>${p}</p>`)).join('')}</div><div class="center" style="margin-top:28px">${regBtn(LINKS.jmx,'Reserve Your Spot')}</div>`)}
${sec(`<div class="narrow center" style="margin:0 auto"><h2>Where the eXperience ends</h2><p>The tour is a tour. You leave having seen the places and met the people, with a much clearer sense of where you would live and which school you would choose, but the planning afterwards is yours to do. If you would rather it was not, that is what Johor Move Concierge (JMC) is for: the whole move decided and sequenced, with a dedicated WhatsApp line while you carry it out.</p><a class="btn outline" href="#svc-concierge">See Johor Move Concierge</a></div>`,'alt')}
${cta('Reserve your tour','Tell us when you are free and we will plan the days with you.',regBtn(LINKS.jmx,'Reserve Your Spot').replace('class="btn"','class="btn white"'))}`;

P['svc-concierge'] = () => `${phero('Johor Move Concierge <span>(JMC)</span>','Your relocation planned end to end, with someone on the other end of WhatsApp while you do it','<div class="price-tag">From SGD 2,000</div>')}
${sec(`<div class="center"><h2>Not advice. A plan, and someone to ask.</h2><p class="lead">Most people moving to Johor do not lack information. They have too much of it, and no way to tell which of it applies to them. Concierge starts with your situation and ends with a decision on every part of the move: which visa, which neighbourhood, which school, what it costs and in what order to do it. Then we stay reachable while you carry it out.</p></div><div class="grid g3" style="margin-top:28px">
 ${[[I.shield,'Visa and pass strategy','The exact visa or pass for your nationality and situation, with the application requirements and a realistic timeline.'],[I.pin,'Location matching','Specific Johor neighbourhoods that fit your lifestyle, budget and priorities, with commute times if you are working in Singapore.'],[I.school,'School analysis','A side-by-side comparison of international schools matching your curriculum preference, budget and location, if you have children.'],[I.wallet,'Cost of living breakdown','Real numbers for housing, utilities, groceries, transport, healthcare and lifestyle, based on how you actually live.'],[I.map,'Your action roadmap','A personalised timeline setting out what to do this month, next month and the month after.'],[I.chat,'Dedicated WhatsApp support','A direct line to your relocation specialist as the move happens, for the questions that come up between the planning and the keys.']].map(([i,h,p])=>card(`<div class="chip blue">${i}</div><h3>${h}</h3><p>${p}</p>`)).join('')}</div><p class="center muted" style="margin-top:24px">The SGD 17 Johor relocation checklist is included as well, covering housing, banking, utilities, insurance and documentation.</p>`)}
${sec(`<div class="narrow" style="margin:0 auto"><h2 class="center">Who this is for</h2><ul class="ticks">${['Families relocating for international schools','Retirees seeking a lifestyle upgrade and lower costs','Business owners expanding operations into Johor','Remote professionals earning foreign income while living in Johor','Anyone, of any nationality, seriously considering the move'].map(x=>`<li>${x}</li>`).join('')}</ul></div>`,'alt')}
${sec(`<div class="center"><h2>What getting it wrong costs</h2><p class="lead">None of these are hypothetical. They are the four we are asked to unpick most often, usually after the money has been spent.</p></div><div class="grid g4" style="margin-top:28px">
 ${[['Scouting unprepared','Flights, repeated road trips, hotels and transport, and the time off work to do it, all before you have narrowed anything down.'],['The wrong neighbourhood',"A one or two-year lease and two months' deposit, committed before you knew what the commute actually feels like."],['The wrong visa route','Months of delay, and in some cases a rejection you then have to explain on the next application.'],['The wrong school','Re-enrolment fees, a curriculum mismatch, and a child who changes schools twice in a year.']].map(([h,p])=>card(`<h3>${h}</h3><p>${p}</p>`)).join('')}</div>`)}
${sec(`<h2 class="center">How it works</h2><ol class="steps narrow" style="margin:28px auto 0">${[['Tell us your situation','A short intake covering who is moving, when, on what budget, and what has to be true for it to work.'],['Your roadmap session','We go through visa, location, schools and costs together, and you leave with the decisions made and the order to make them in.'],['We stay reachable','Dedicated WhatsApp access to your specialist through the move, for the questions a plan cannot anticipate.']].map(([h,p])=>`<li><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>`,'alt')}
${sec(`<div class="center"><h2>What the WhatsApp line looks like</h2><p class="lead">Four exchanges with clients who had already moved. Names, phone numbers and one development are blacked out. Nothing has been added or reworded.</p><p><strong>The longest anyone waited for an answer was nine minutes.</strong></p></div><div class="grid g2" style="margin-top:20px">
 ${[['A client sends a video of their upstairs neighbour\'s wall and asks whether the landlord has installed a camera. Syafiqah Rahman replies seven minutes later that it is a kitchen hood, an extractor vent, not a camera.','Is that a camera the landlord put up? Answered in seven minutes'],['A client asks whether to open one Malaysian CIMB account or one each, and whether the team opened a Malaysia-linked account. Haikal Yeo replies in the same minute that a joint account works for both Singapore and Malaysia.','One account or one each? Answered the same minute'],['A client asks which Malaysian mobile network to sign up with and what a home internet plan costs. Haikal Yeo replies nine minutes later comparing two networks on coverage and quotes about RM 270 for a 1Gbps line.','Which network, and what does home internet cost? Answered in nine minutes'],['A client asks whether to fit an outdoor water purifier and a drinking water dispenser. Haikal Yeo replies nine minutes later that they fitted a purifier before the tap and still boil the water.','Purifier, or just boil? Answered in nine minutes']].map(([d,c])=>card(`<div style="font-size:26px">${I.chat}</div><h3>${c}</h3><p class="muted small" style="margin:0">${d}</p>`)).join('')}</div>`)}
${cta('Interested in Concierge?','Packages start at SGD 2,000 and are scoped to your move, so we quote after we understand it. Get in touch and we will set up a call.','<a class="btn white" href="#contact">Get in Touch</a>')}`;

const TESTI = [
 ['Aniq Ahsan','Thank you so much for organising all this! It was truly helpful. It definitely clarified a lot of things. It also helped change things from hypothetical numbers to tangible possibilities.'],
 ['Muhammad Shahid','I love the tour. Haikal, Syafiqah and Shamir hosted us very well. Nothing beats an easy trip to JB (with my wife and baby) while getting useful insights about buying or renting properties there. Highly recommended for anyone.'],
 ['Chuck Lee','I cannot recommend Shamir highly enough. As someone relocating from overseas, the process of understanding living in JB and obtaining the relevant permits seemed highly daunting. Shamir was incredible, he explained the benefits of living in each location including deep local knowledge tailored to my needs. What I thought would take weeks was completed in a day. His services were not only effective but transparent and reassuring. Should you be considering Malaysia, especially if from abroad, look no further. Shamir, thank you for a smooth and stress free experience.'],
 ['Han Weiguang','A friendly and knowledgeable group of people. Shares their own experience of relocation and the challenges.'],
 ['Norain','I met up with Haikal and Syafiqah to find out more about the options of me retiring in JB. They shared me options that I had never actually thought of. I would definitely recommend those who have intentions of migrating to JB to meet up with them so that you will get to know viable options that are available.'],
 ['Nazreen Daud','I joined the JMX (Johor Move Experience) with little to no expectations, just curious to see if moving there could actually be an option. The school tour at Marlborough was a highlight; the campus is massive, and their hospitality was top-notch. The Move to Malaysia team ran the whole thing smoothly and professionally. We also checked out Forest City, Eco Botanic, and R&F. Really cool to see how these developments open up opportunities for Singaporeans like us. Overall, the tour was insightful and pretty eye-opening. If you’re seriously considering the move to Johor, I’d say a personalised tour would be perfect. Big thanks to the Move to Malaysia team for putting this together! 🙌'],
 ['Ruzaini Rashid','Engaged them to assist with my relocation to Johor. Despite the uncertainties and delays that prolonged the move, both Syafiqah and Haikal were patient, responsive and helpful throughout the entire process. They made what could have been a stressful experience much easier to manage! Kudos and thank you!']];
P.testimonials = () => `${phero('Testimonials',"Hear from families and individuals who've experienced our services")}
${sec(`<div class="center" style="margin-bottom:24px"><a class="btn outline sm" href="${GOOGLE}" target="_blank" rel="noopener"><span class="stars">★★★★★</span> See our Google reviews</a></div>
<div class="grid g3">${TESTI.map(([n,q])=>card(`<div class="stars">★★★★★</div><p class="quote">"${q}"</p><div style="display:flex;gap:12px;align-items:center"><div class="av" aria-hidden="true">${n[0]}</div><strong>${n}</strong></div>`)).join('')}</div>
<p class="center" style="margin-top:28px">Enjoyed our services? <a href="${GOOGLE}" target="_blank" rel="noopener">Leave us a review on Google</a>.</p>`)}
${cta('Ready to Start Your Journey?','Join the growing community of successful relocations to Malaysia. Let us help you make it happen.','<a class="btn white" href="#contact">Contact Us</a><a class="btn ghost-white" href="#services">View Services</a>')}`;

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
  ${sec(`<div class="center"><h2>Stay Updated</h2><p class="lead">New articles coming soon! Subscribe to our newsletter or join our free webinar to stay informed about relocating to Johor.</p><a class="btn" href="#svc-essentials">Join Free Webinar</a></div>`,'alt')}`;
};
function blogPost(id){
  const html = M.posts[id]; if(!html) return null;
  const me = M.articles.find(a=>a.id===id);
  const rel = M.articles.filter(a=>a.cat===me.cat && a.id!==id && !a.soon && a.slug).slice(0,3);
  const related = `<div class="related"><h2>Related Articles</h2><div class="grid g3">${rel.map(postCard).join('')}</div></div>`;
  return `<div class="prose">${html.replace('<!--RELATED-->', related)}</div>`;
}

/* Media */
const MEDIA = [
 {t:'Talk of the Town: Why are Singaporeans packing up for JB?',type:'podcast',ex:'Dainial Lim and entertainer Hossan Leong, both of whom have made the move, join Let’s Talk, Singapore on what prompted their decisions, the realities of living in Johor Bahru, and whether they would ever move back.',cov:[['MONEY FM 89.3','25 November 2026','https://audio.sph.com.sg/podcast-ep/01m883mse3dfet2hbz2mcn6gf8']]},
 {t:'At the first Johor Move Summit, is the grass greener across the Causeway?',type:'video',ex:'RICE Media on the first Johor Move Summit: a relocation consultancy run by Singaporeans who have made the move to Johor, whose summit drew hundreds of sign-ups from couples, families, retirees and business owners wondering if their future is across the Causeway.',cov:[['RICE Media','13 November 2026','https://www.instagram.com/p/DfrX1e3gYjI/'],['RICE Media','13 November 2026','https://www.facebook.com/RiceMedia.co/posts/at-the-first-johor-move-summit-by-move-to-malaysia-singaporean-retirees-young-pa/1942640887868075/','Facebook']]},
 {t:'Moving to Malaysia? Renting vs Buying a House | Mistakes to Avoid!',type:'video',ex:'Syafiqah Rahman joins Sarah Zul on Life Unbubbled to weigh renting against buying in Johor, and the mistakes Singaporean families make on either path.',cov:[['Life Unbubbled','16 October 2026','https://www.youtube.com/watch?v=IrtSeMpaYdw']]},
 {t:'S’pore family spends 10% to 20% more after moving to JB, but says better lifestyle makes it worthwhile',type:'print',ex:'The slower pace and business prospects drawing Singaporeans across the Causeway, and the costs that come with it. Syafiqah on enquiries going from two or three a month to ten, and Shamir on what Johor offers a business that Singapore does not.',cov:[['Berita Harian','11 October 2026','https://www.beritaharian.sg/singapura/gaya-hidup-santai-prospek-niaga-tarik-warga-spura-pindah-jb'],['Stomp','12 October 2026','https://www.stomp.sg/trending-now/spore-family-spends-10-20-more-after-moving-jb-says-better-lifestyle-makes-it-worthwhile'],['AsiaOne','13 October 2026','https://www.asiaone.com/singapore/singapore-family-spends-10-20-more-after-moving-jb-says-better-lifestyle-makes-it'],['Malay Mail','13 October 2026','https://www.malaymail.com/news/singapore/2026/10/13/from-dreading-jb-to-calling-it-home-why-more-singaporeans-are-looking-to-johor/238933']]},
 {t:'S’porean families moving to Johor for ‘kampung’ lifestyle, space & flexibility, but say it’s not always cheaper',type:'print',ex:'Singaporean families moving to Johor for schooling, space and the kampung spirit, and why the move is not always cheaper. Haikal on the neighbourly spirit, Shamir on the balik kampung atmosphere at festive periods.',cov:[['Berita Harian','20 April 2026','https://www.beritaharian.sg/malaysia/semangat-jiwa-kampung-tarikan-keluarga-spura-pindah-johor'],['Stomp','30 April 2026','https://www.stomp.sg/trending-now/more-sporean-families-choosing-live-johor-its-not-just-about-cheaper-living-it-makes-us-feel-ease'],['AsiaOne','2 May 2026','https://www.asiaone.com/lifestyle/more-singaporean-families-choosing-live-johor-its-not-just-about-cheaper-living'],['Mothership','3 May 2026','https://mothership.sg/2026/05/singaporean-families-move-johor/']]},
 {t:'DETIK Semasa | Peluang Darul Takzim',type:'video',ex:'Syafiqah Rahman was featured on DETIK Semasa to discuss the opportunities in Darul Takzim and the growing Singapore-Johor corridor.',cov:[['BERITA Mediacorp / DETIK','12 November 2025','https://youtu.be/HPyHvvQndxc']]},
 {t:'Why Singaporeans Are Moving to Johor',type:'podcast',ex:'Shamir Wahid joins The Financial Coconut to unpack why more Singaporeans are relocating to Johor, from property value to lifestyle and cross-border considerations.',cov:[['The Financial Coconut','29 August 2024','https://www.youtube.com/watch?v=wYPVy4UuPoc']]}];
const TYPE = {video:['🎬','Broadcast / Video','Watch on'],print:['📰','Print','Read on'],podcast:['🎧','Podcast','Listen on']};
const shortDate = d => { const [a,b]=d.split(' '); return a+' '+b.slice(0,3); };
P.media = () => `${phero('In the Media','Print, online, broadcast and speaking engagements on the Singapore to Johor relocation story')}
${sec(`<h2>Featured coverage</h2><div class="grid g3" style="margin-top:20px">${MEDIA.map(m=>{const [ic,lbl,verb]=TYPE[m.type],o=m.cov[0],outlets=[...new Set(m.cov.map(c=>c[0]))].join(' · ');
 return `<div class="card" style="padding:0;overflow:hidden"><a class="media-thumb" href="${o[2]}" target="_blank" rel="noopener" aria-label="${esc(o[0])}: ${esc(m.t)}">${ic}<span class="outlet">${esc(o[0])}</span></a><div style="padding:18px"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span class="badge">${lbl}</span><span class="small muted">${o[1]}</span></div><p class="small" style="color:var(--accent);font-weight:700;margin-bottom:6px">${outlets}</p><h3>${m.t}</h3><p class="small">${m.ex}</p><a class="btn sm" href="${o[2]}" target="_blank" rel="noopener">${verb} ${o[0]}</a>${m.cov.length>1?`<p class="small muted" style="margin:12px 0 6px">${m.cov.every(c=>c[0]===o[0])?'Also on':'Also ran in'}</p><div class="btns" style="gap:6px">${m.cov.slice(1).map(c=>`<a class="btn outline sm" href="${c[2]}" target="_blank" rel="noopener">${c[3]||c[0]} <span class="muted">${shortDate(c[1])}</span></a>`).join('')}</div>`:''}</div></div>`;}).join('')}</div>`)}
${sec(`<h2 class="center">What we can speak on</h2><div class="grid g3" style="margin-top:24px">${[['Cross-border relocation','Practical realities of moving from Singapore to Johor: housing, schooling, commuting and cost of living.'],['JS-SEZ and business','How the Johor-Singapore Special Economic Zone is changing the calculus for entrepreneurs and employers.'],['Data and trends','Ground level observations from advisory sessions, relocation tours and the Johor Move Summit 2026.']].map(([h,p])=>card(`<h3>${h}</h3><p>${p}</p>`)).join('')}</div>`,'alt')}
${sec(`<div class="center"><h2>Press enquiries</h2><p class="lead">For interviews, commentary, data requests or event accreditation, contact our team and we will respond within two working days.</p><a class="btn" href="mailto:${EMAIL}?subject=Media%20enquiry">✉️ ${EMAIL}</a></div>`)}`;

/* Contact */
P.contact = () => `${phero('Contact Us',"Let's discuss your relocation plans and how we can help")}
${sec(`<div class="grid g2" style="gap:40px">
 <div><h2>Send Us a Message</h2><form id="cform" novalidate>
  <div class="field"><label class="f" for="cn">Name *</label><input id="cn" type="text" required placeholder="Your full name" autocomplete="name"></div>
  <div class="field"><label class="f" for="ce">Email *</label><input id="ce" type="email" required placeholder="your.email@example.com" autocomplete="email"></div>
  <div class="field"><label class="f" for="cp">Phone</label><input id="cp" type="tel" placeholder="+65 1234 5678" autocomplete="tel"></div>
  <div class="field"><label class="f" for="cm">Message *</label><textarea id="cm" rows="6" required placeholder="Tell us about your relocation plans..."></textarea></div>
  <p class="small muted" id="cerr" style="color:var(--bad);display:none">Please fill in your name, email and message.</p>
  <button class="btn" type="submit">Send Message</button><div id="cout"></div></form></div>
 <div><h2>Get In Touch</h2><p>Have questions about relocating to Malaysia? Our team is here to help. Reach out through any of the channels below, or fill out the contact form and we'll get back to you within 24 hours.</p>
  ${card(`<div style="display:flex;gap:14px"><div class="chip red" style="margin:0">${I.mail}</div><div><h3>Email</h3><p style="margin:0"><a href="mailto:${EMAIL}">${EMAIL}</a></p></div></div>`)}<div style="height:14px"></div>
  ${card(`<div style="display:flex;gap:14px"><div class="chip red" style="margin:0">${I.chat}</div><div><h3>WhatsApp</h3><p style="margin:0"><a href="https://wa.me/${WA_SG}" target="_blank" rel="noopener">+65 97883460 (SG)</a></p><p style="margin:0"><a href="https://wa.me/60149853460" target="_blank" rel="noopener">+60 149853460 (MY)</a></p></div></div>`)}<div style="height:14px"></div>
  ${card(`<div style="display:flex;gap:14px"><div class="chip red" style="margin:0">${I.pin}</div><div><h3>Location</h3><p style="margin:0">Serving Singapore, Johor Bahru and Kuala Lumpur</p></div></div>`)}
 </div></div>`)}`;
function bindContact(root){
  const f = $('#cform', root); if(!f) return;
  f.onsubmit = e => { e.preventDefault();
    const n=$('#cn').value.trim(), em=$('#ce').value.trim(), ph=$('#cp').value.trim(), m=$('#cm').value.trim();
    if(!n || !em || !m || !/^\S+@\S+\.\S+$/.test(em)){ $('#cerr').style.display='block'; return; }
    $('#cerr').style.display='none';
    const text = `Hi Move to Malaysia, I'm ${n}.\n\n${m}\n\nEmail: ${em}${ph?`\nPhone: ${ph}`:''}`;
    $('#cout').innerHTML = composer(text, 'Relocation enquiry from '+n); bindCopy($('#cout'), text);
  };
}

/* Summits */
P['summit-2026'] = () => `<section class="sec summit-band" style="padding-top:72px;padding-bottom:72px"><div class="wrap">
 <p class="eyebrow">Live Event · Singapore</p><h1 style="color:#fff">Johor Move Summit 2026</h1>
 <p class="lead" style="color:#dbe4f3">One focused day of expert guidance on property, schools, banking, immigration and lifestyle, three months before the RTS Link changes everything.</p>
 <div class="facts"><div>${I.cal} 31 October 2026</div><div>${I.pin} Aurelia @ Perennial Business City, Singapore</div><div>${I.ticket} Free general admission</div></div>
 <div class="btns" style="justify-content:center"><a class="btn" href="#summit-2027">Register interest for 2027</a><a class="btn ghost-white" href="#media">See the coverage</a></div>
</div></section>
${sec(`<div class="narrow center" style="margin:0 auto"><h2>The first Johor Move Summit</h2><p>The 2026 summit took place on 31 October 2026 at Aurelia @ Perennial Business City in Singapore, with free general admission. RICE Media covered the day, which drew hundreds of sign-ups from couples, families, retirees and business owners.</p><p>The 2027 dates are still to be set. Register your interest and the dates, venue and programme come to you first.</p><a class="btn" href="#summit-2027">Johor Move Summit 2027</a></div>`)}`;

const SQ = [
 {name:'audience',label:'What brings you?',options:['Family relocation','Business setup','Both']},
 {name:'format',label:'Would you attend a second day?',options:['One day is enough','Yes, I would come to both','Not sure']},
 {name:'timing',label:'Which day suits you?',options:['Friday','Saturday','Both']},
 {name:'timeline',label:'How soon are you thinking of moving?',options:['Within 6 months','Within a year','Just exploring']}];
const REGIONS = ['Johor','Kuala Lumpur','Penang','Somewhere else','Not sure yet'];
const sState = {}; let sRegions = [];
P['summit-2027'] = () => `<section class="sec summit-band" style="padding-top:72px;padding-bottom:72px"><div class="wrap">
 <p class="eyebrow">📅 Dates to be announced</p><h1 style="color:#fff">Johor Move Summit 2027</h1>
 <p class="lead" style="color:#dbe4f3">Every question about moving to Johor: schools, housing, visas, cost of living, and setting up a business across the Causeway.</p>
 <a class="btn" href="#summit-2027" data-jump="interest">Register your interest</a><p class="small" style="margin-top:14px;opacity:.85">No ticket and no payment yet. The date goes to this list first.</p>
</div></section>
${sec(`<div class="center"><h2>What to expect</h2><p class="lead">How the summit runs. The 2027 programme will be published once the dates are set.</p></div><div class="grid g3" style="margin-top:28px">
 ${[['Keynotes','Where the corridor genuinely stands: what is built and funded, and what is still an announcement.'],['Expert talks','Two tracks — family relocation, and business setup, incentives and tax.'],['Panels','Choosing a school, renting versus buying, residence routes, cross-border tax and banking, and what a year actually costs.'],['Clinics','One-to-one time with relocation and corporate advisers, rather than a queue after a talk.'],['Exhibitor hall','Schools, developers, corporate service providers, banks, healthcare groups and movers in one room.'],['Government agencies','The bodies behind the corridor, answering on incentives, zones and eligibility.']].map(([h,p])=>card(`<h3>${h}</h3><p>${p}</p>`)).join('')}</div>`)}
${sec(`<h2 class="center">Who it is for</h2><div class="grid g3" style="margin-top:28px">${[['Families','Weighing schools, housing and the commute, and what a year genuinely costs once you are there.'],['Professionals and remote workers','Planning around the RTS Link, and what a cross-border working week actually looks like.'],['Business owners and founders','Looking at Johor for operations, talent or expansion, and at what the JS-SEZ does and does not cover.']].map(([h,p])=>card(`<h3>${h}</h3><p>${p}</p>`)).join('')}</div>`,'alt')}
${sec(`<div class="narrow center" style="margin:0 auto"><div style="font-size:34px">🇲🇾</div><h2>Not only Johor</h2><p>MM2H, PVIP and DE Rantau apply nationwide, cross-border tax and estate planning do not change by state, and several of the advisers in the room work out of Kuala Lumpur and Penang. If you are still comparing Johor against somewhere else in Malaysia, that conversation belongs here too.</p></div>`)}
<section class="sec alt" id="interest"><div class="wrap narrow" style="margin:0 auto">
 <h2 class="center">Register your interest</h2><p class="center muted">Dates, venue and the programme go to this list first. The four questions below decide what the event turns out to be, so answer them if you can.</p>
 <div class="card"><form id="sform" novalidate>
  <div class="row"><div class="field"><label class="f" for="sn">Name</label><input id="sn" type="text" required autocomplete="name"></div><div class="field"><label class="f" for="se">Email</label><input id="se" type="email" required autocomplete="email"></div></div>
  <div class="field"><label class="f" for="sp">Phone</label><input id="sp" type="tel" required autocomplete="tel"></div>
  ${SQ.map(q=>`<fieldset style="border:0;padding:0;margin:0 0 16px"><legend class="f" style="font-weight:700;color:var(--primary);margin-bottom:8px">${q.label}</legend>${q.options.map(o=>`<button type="button" class="pill ${sState[q.name]===o?'on':''}" data-sq="${q.name}" data-v="${esc(o)}" aria-pressed="${sState[q.name]===o}">${o}</button>`).join('')}</fieldset>`).join('')}
  <fieldset style="border:0;padding:0;margin:0 0 16px"><legend class="f" style="font-weight:700;color:var(--primary);margin-bottom:8px">Which parts of Malaysia are you considering?</legend>${REGIONS.map(o=>`<button type="button" class="pill ${sRegions.includes(o)?'on':''}" data-sr="${esc(o)}" aria-pressed="${sRegions.includes(o)}">${o}</button>`).join('')}</fieldset>
  <p class="small" id="serr" style="color:var(--bad);display:none"></p>
  <button class="btn" type="submit">Register your interest</button><p class="small muted" style="margin-top:10px">We will only write to you about this event.</p><div id="sout"></div>
 </form></div></div></section>`;
function bindSummit(root){
  const f = $('#sform', root); if(!f) return;
  root.querySelectorAll('[data-sq]').forEach(b => b.onclick = () => { const q=b.dataset.sq; sState[q] = sState[q]===b.dataset.v ? '' : b.dataset.v; root.querySelectorAll(`[data-sq="${q}"]`).forEach(x=>{x.classList.toggle('on', x.dataset.v===sState[q]); x.setAttribute('aria-pressed', x.dataset.v===sState[q]);}); });
  root.querySelectorAll('[data-sr]').forEach(b => b.onclick = () => { const v=b.dataset.sr; sRegions = sRegions.includes(v) ? sRegions.filter(x=>x!==v) : [...sRegions, v]; b.classList.toggle('on'); b.setAttribute('aria-pressed', sRegions.includes(v)); });
  f.onsubmit = e => { e.preventDefault();
    const n=$('#sn').value.trim(), em=$('#se').value.trim(), ph=$('#sp').value.trim();
    const miss = SQ.filter(q=>!sState[q.name]).map(q=>q.label);
    let err = '';
    if(!n||!em||!ph||!/^\S+@\S+\.\S+$/.test(em)) err='Please fill in your name, a valid email and your phone.';
    else if(miss.length) err='Please pick one for: '+miss.join(' · ');
    else if(!sRegions.length) err='Please pick at least one region, or “Not sure yet”.';
    const ee=$('#serr'); ee.textContent=err; ee.style.display=err?'block':'none'; if(err) return;
    const text = `Hi Move to Malaysia, please add me to the Johor Move Summit 2027 interest list.\n\nName: ${n}\nEmail: ${em}\nPhone: ${ph}\n${SQ.map(q=>`${q.label} ${sState[q.name]}`).join('\n')}\nRegions considered: ${sRegions.join(', ')}`;
    $('#sout').innerHTML = composer(text, 'Johor Move Summit 2027 interest: '+n); bindCopy($('#sout'), text);
  };
  root.querySelectorAll('[data-jump]').forEach(a => a.onclick = e => { e.preventDefault(); $('#'+a.dataset.jump).scrollIntoView({behavior:'smooth'}); });
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
  const tk = r.startsWith('mg-')||r==='guides' ? 'guides' : r.startsWith('svc')||r==='services' ? 'services' : r.startsWith('blog') ? 'blog' : r==='home' ? 'home' : 'more';
  document.querySelectorAll('#tabbar [data-t]').forEach(x => x.classList.toggle('on', x.dataset.t===tk));
  const t = {home:'MYSG',about:'About',services:'Services',testimonials:'Testimonials',blog:'Blog',media:'Media',contact:'Contact'}[r];
  document.title = (t && r!=='home' ? t+' | ' : '') + 'MYSG';
  if(r==='blog') app.querySelectorAll('[data-bf]').forEach(b => b.onclick = () => { blogFilter=b.dataset.bf; render(); });
  if(r==='home') bindHome(app);
  if(r==='contact') bindContact(app);
  if(r==='summit-2027') bindSummit(app);
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
