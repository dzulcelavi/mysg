/* MYSG app: Master Guide pages and interactive tools */
(function(){
const M = window.MTM;
const $ = (s, el=document) => el.querySelector(s);
const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RM = (n, d=0) => 'RM ' + Number(n).toLocaleString('en-MY',{minimumFractionDigits:d,maximumFractionDigits:d});
const SGD = n => 'S$ ' + Math.round(n).toLocaleString('en-SG');
const faqList = items => items.map(([q,a]) => `<details class="acc"><summary>${esc(q)}</summary><div class="acc-b">${esc(a)}</div></details>`).join('');
const card = (inner, cls='') => `<div class="card ${cls}">${inner}</div>`;
const table = (cols, rows, hiRow) => `<div class="tscroll"><table class="tbl"><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r,i)=>`<tr class="${hiRow===i?'hi':''}">${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

/* generic guide shell with tabs */
function shell(g){
  return `<section class="mg-hero"><div class="wrap"><span class="badge" style="margin-bottom:14px">Master Guide</span><h1>${g.title}</h1><p>${g.intro}</p></div></section>
  <section class="sec" style="padding-top:32px"><div class="wrap"><div class="tabs" role="tablist">${g.tabs.map(([id,l])=>`<button role="tab" data-tab-btn="${id}" class="${g.state.tab===id?'on':''}" aria-selected="${g.state.tab===id}">${l}</button>`).join('')}</div>
  <div id="mgpanel" class="panel">${g.panels[g.state.tab]()}</div>${g.after?g.after():''}</div></section>`;
}
function guide(def){
  def.html = () => shell(def);
  def.bind = root => {
    root.querySelectorAll('[data-tab-btn]').forEach(b => b.onclick = () => { def.state.tab = b.dataset.tabBtn; root.querySelectorAll('[data-tab-btn]').forEach(x=>{x.classList.toggle('on', x===b); x.setAttribute('aria-selected', x===b);}); def.redraw(root); });
    def.redraw(root);
  };
  def.redraw = root => { const p=$('#mgpanel', root); p.innerHTML = def.panels[def.state.tab](); (def.wire[def.state.tab]||(()=>{}))(p, root); };
  def.wire = def.wire || {};
  return def;
}
/* step-through questionnaire helper */
function quizView(qs, st, labelOf, resultFn){
  if(st.done) return resultFn();
  const q = qs[st.i], opts = q.o || q[1];
  const sel = st.a[st.i];
  return card(`<p class="small muted" style="margin:0">Question ${st.i+1} of ${qs.length}</p><div class="progress"><i style="width:${(st.i+1)/qs.length*100}%"></i></div>
   <h3>${esc(q.q || q[0])}</h3>${opts.map((o,k)=>`<label class="opt ${sel===k?'on':''}"><input type="radio" name="qz" value="${k}" ${sel===k?'checked':''}> <span>${esc(labelOf(o))}</span></label>`).join('')}
   <div class="btns" style="justify-content:space-between;margin-top:14px"><button class="btn outline" data-qback ${st.i===0?'disabled':''}>Back</button><button class="btn" data-qnext ${sel==null?'disabled':''}>${st.i===qs.length-1?'See Results':'Next'}</button></div>`);
}
function wireQuiz(p, qs, st, redraw){
  p.querySelectorAll('input[name=qz]').forEach(r => r.onchange = () => { st.a[st.i] = +r.value; redraw(); });
  const n = $('[data-qnext]', p), b = $('[data-qback]', p), rs = $('[data-qreset]', p);
  if(n) n.onclick = () => { if(st.i < qs.length-1) st.i++; else st.done = true; redraw(); };
  if(b) b.onclick = () => { if(st.i>0) st.i--; redraw(); };
  if(rs) rs.onclick = () => { st.i=0; st.a={}; st.done=false; redraw(); };
}

M.guides = {};

/* =================== VISA =================== */
const visaById = id => M.visas.find(v=>v.id===id);
const visa = guide({
  title:'Visa & Immigration Guide',
  intro:"Navigate Malaysia's visa options with our interactive tools. Find the right visa for your situation, compare options side-by-side, and understand the application timeline.",
  tabs:[['eligibility','Eligibility'],['compare','Compare'],['mm2h','MM2H'],['timeline','Timeline'],['faq','FAQ']],
  state:{tab:'eligibility', quiz:{i:0,a:{},done:false}, tl:'mm2h', start:''},
  panels:{
    eligibility(){ const st=visa.state.quiz;
      return `<h2>Visa Fit Questionnaire</h2><p class="muted">Answer ${M.visaQuiz.length} questions to find your best visa option</p>` + quizView(M.visaQuiz, st, o=>o[0], () => {
        const score = {}; M.visas.forEach(v=>score[v.id]=0);
        Object.entries(st.a).forEach(([qi,oi]) => M.visaQuiz[qi].o[oi][1].forEach(id => score[id]=(score[id]||0)+1));
        const ranked = M.visas.map(v=>({...v,score:score[v.id]})).sort((a,b)=>b.score-a.score);
        const top = ranked.slice(0,3), rest = ranked.slice(3).filter(v=>v.score>0);
        return `<div class="btns" style="justify-content:space-between;align-items:center;margin-bottom:16px"><h3 style="margin:0">Your best matches</h3><button class="btn outline sm" data-qreset>Start Over</button></div>
        <div class="grid g3">${top.map((v,i)=>card(`${i===0?'<span class="badge red">Best Match</span>':`<span class="badge">#${i+1}</span>`}<h3 style="margin-top:10px">${v.name}</h3><p class="small muted">${v.fullName}</p>
          <div class="bar" style="margin:8px 0 4px"><i style="width:${Math.round(v.score/M.visaQuiz.length*100)}%;background:var(--accent)"></i></div><p class="small"><strong>${Math.round(v.score/M.visaQuiz.length*100)}% match</strong> (${v.score} of ${M.visaQuiz.length} answers)</p>
          <p>${v.description}</p><p class="small"><strong>Duration:</strong> ${v.duration}<br><strong>Processing:</strong> ${v.processingTime}<br><strong>Est. cost:</strong> ${v.estCost}</p>
          <p class="small" style="margin-bottom:4px"><strong>Requirements</strong></p><ul class="ticks small">${v.requirements.map(x=>`<li>${x}</li>`).join('')}</ul>
          <p class="small" style="margin-bottom:4px"><strong>Benefits</strong></p><ul class="ticks small">${v.benefits.map(x=>`<li>${x}</li>`).join('')}</ul><p class="small muted"><strong>Ideal for:</strong> ${v.ideal}</p>`)).join('')}</div>
        ${rest.length?`<h3 style="margin-top:28px">Other options to consider</h3><div class="btns">${rest.map(v=>`<span class="badge">${v.name} · ${v.score}/${M.visaQuiz.length}</span>`).join('')}</div>`:''}
        <div class="note blue" style="margin-top:24px">Want a second opinion on your visa route? <a href="https://movetomalaysia.com/" target="_blank" rel="noopener"><strong>Johor Move Concierge</strong></a> includes a visa and pass strategy for your nationality and situation.</div>`;
      });
    },
    compare(){ return `<h2>Visa Comparison</h2><p class="muted">Compare Malaysia's main long-stay visa options side by side.</p>${table(['', ...M.visaCompare.cols], M.visaCompare.rows.map(r=>r.map(esc)))}
      <h3 style="margin-top:32px">All visa types</h3><div class="grid g3">${M.visas.map(v=>card(`<h3>${v.name}</h3><p class="small muted">${v.fullName}</p><p>${v.description}</p><p class="small"><strong>Duration:</strong> ${v.duration} · <strong>Processing:</strong> ${v.processingTime} · <strong>Est. cost:</strong> ${v.estCost}</p>`)).join('')}</div>`; },
    mm2h(){ return `<h2>MM2H Tier Comparison</h2><p class="muted">Federal Platinum, Gold and Silver tiers, the Johor JS-SEZ variant, and the state-run Sabah and Sarawak programmes. Amounts in RM.</p>${table(['', ...M.visaMM2H.cols], M.visaMM2H.rows.map(r=>r.map(esc)))}<p class="small muted" style="margin-top:10px">* JS-SEZ figures are indicative and subject to official confirmation.</p>`; },
    timeline(){ const st=visa.state, t=M.visaTimelines.find(x=>x.visa===st.tl);
      let d = st.start ? new Date(st.start+'T00:00:00') : null, total = t.steps.reduce((s,x)=>s+x[2],0);
      const fmt = dt => dt.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
      return `<h2>Application Timeline</h2><p class="muted">Pick a visa and an optional start date to see each step and when it should land.</p>
      <div class="row" style="margin-bottom:20px"><div><label class="f" for="tlv">Visa</label><select id="tlv">${M.visaTimelines.map(x=>`<option value="${x.visa}" ${x.visa===st.tl?'selected':''}>${x.label}</option>`).join('')}</select></div><div><label class="f" for="tld">Start date (optional)</label><input id="tld" type="date" value="${st.start}"></div></div>
      ${card(`<p style="margin:0">Estimated total: <span class="kpi">${total} days</span> <span class="muted">(about ${Math.round(total/30)} months)</span>${d?` · finishing around <strong>${fmt(new Date(d.getTime()+total*864e5))}</strong>`:''}</p>`)}
      <ol class="steps" style="margin-top:24px">${t.steps.map(([h,lbl,days,desc])=>{ let when=''; if(d){ const s=new Date(d); d=new Date(d.getTime()+days*864e5); when=`<span class="badge" style="margin-left:6px">${fmt(s)} → ${fmt(d)}</span>`; } return `<li><h3>${esc(h)} <span class="badge">${esc(lbl)}</span>${when}</h3><p>${esc(desc)}</p></li>`; }).join('')}</ol>`; },
    faq(){ return `<h2>Frequently Asked Questions</h2>${M.visaFaq.map(([g,items])=>`<h3 style="margin-top:22px">${esc(g)}</h3>${faqList(items)}`).join('')}`; }
  },
  wire:{
    eligibility(p, root){ wireQuiz(p, M.visaQuiz, visa.state.quiz, () => visa.redraw(root)); },
    timeline(p, root){ $('#tlv',p).onchange = e => { visa.state.tl=e.target.value; visa.redraw(root); }; $('#tld',p).onchange = e => { visa.state.start=e.target.value; visa.redraw(root); }; }
  },
  after(){ return `<div class="note" style="margin-top:36px"><h3>Important Disclaimer</h3><p>Visa requirements, fees, and policies are subject to change. The information provided here is for general guidance only and may not reflect the latest regulations. Always refer to official sources for the most current information:</p><ul>${M.visaSources.map(([n,u,d])=>`<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a>: ${esc(d)}</li>`).join('')}</ul><p style="margin:0">We recommend consulting a licensed immigration advisor before making any decisions.</p></div>`; }
});
M.guides['mg-visa'] = visa;

/* =================== SCHOOLS =================== */
const schools = guide({
  title:'International Schools in Johor',
  intro:"Your comprehensive guide to choosing the right international school. Compare curricula, explore options by location and budget, and find the perfect fit for your family.",
  tabs:[['curricula','Curricula'],['comparison','Compare'],['map','Map'],['faq','FAQ']],
  state:{tab:'curricula', quiz:{i:0,a:{},done:false}, price:'all', loc:'all', cur:'all', sort:null, dir:'asc'},
  panels:{
    curricula(){ const st=schools.state.quiz;
      return `<h2>Understanding the Curricula</h2><p class="muted">The four curricula offered by Johor's international schools, and who each one suits.</p>
      <div class="grid g2">${M.curricula.map(c=>card(`<span class="badge">${c.flag}</span><h3 style="margin-top:10px">${c.name} <span class="muted small">(${c.short})</span></h3><p>${c.description}</p><ul class="ticks">${c.features.map(f=>`<li>${f}</li>`).join('')}</ul><p class="small"><strong>Best for:</strong> ${c.bestFor}</p>`)).join('')}</div>
      <h2 style="margin-top:40px">Which curriculum fits your child?</h2><p class="muted">Five quick questions. Each answer scores the curricula, and the highest score wins.</p>` +
      quizView(M.schoolQuiz, st, o=>o[0], () => {
        const sc = {}; Object.entries(st.a).forEach(([qi,oi]) => Object.entries(M.schoolQuiz[qi].o[oi][1]).forEach(([k,v]) => sc[k]=(sc[k]||0)+v));
        const ranked = Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([id,s])=>({...M.curricula.find(c=>c.id===id), score:s})).filter(c=>c.id);
        const max = ranked[0] ? ranked[0].score : 1;
        return card(`<div class="btns" style="justify-content:space-between;align-items:center"><h3 style="margin:0">Your recommended curriculum: ${ranked[0]?ranked[0].name:'—'}</h3><button class="btn outline sm" data-qreset>Retake</button></div>
          ${ranked.map(c=>`<div style="margin-top:14px"><div style="display:flex;justify-content:space-between"><strong>${c.name}</strong><span>${c.score} pts</span></div><div class="bar"><i style="width:${c.score/max*100}%;background:${c===ranked[0]?'var(--accent)':'var(--primary)'}"></i></div></div>`).join('')}
          ${ranked[0]?`<p style="margin-top:16px">${ranked[0].bestFor}</p><button class="btn sm" data-showcur="${ranked[0].name}">See ${ranked[0].name} schools</button>`:''}`);
      });
    },
    comparison(){ const st=schools.state;
      const locs=[...new Set(M.schools.map(s=>s[3]))].sort(), curs=[...new Set(M.schools.flatMap(s=>s[1]))].sort();
      let list = M.schools.filter(s => (st.price==='all'||s[2]===st.price) && (st.loc==='all'||s[3]===st.loc) && (st.cur==='all'||s[1].includes(st.cur)));
      if(st.sort!=null){ const k=st.sort; list=[...list].sort((a,b)=>{ const x=k===1?a[1].join(', '):a[k], y=k===1?b[1].join(', '):b[k]; const r=typeof x==='number'?x-y:String(x).localeCompare(String(y)); return st.dir==='asc'?r:-r; }); }
      const th = (k,l) => `<th><button data-sort="${k}" style="all:unset;cursor:pointer">${l}${st.sort===k?(st.dir==='asc'?' ▲':' ▼'):''}</button></th>`;
      return `<h2>Compare Schools</h2><p class="muted">Filter by fee band, area or curriculum. Tap a column heading to sort.</p>
      <div class="row" style="margin-bottom:18px"><div><label class="f" for="fp">Fee band</label><select id="fp"><option value="all">All fee bands</option>${['$','$$','$$$'].map(p=>`<option ${st.price===p?'selected':''}>${p}</option>`).join('')}</select></div>
      <div><label class="f" for="fl">Location</label><select id="fl"><option value="all">All locations</option>${locs.map(l=>`<option ${st.loc===l?'selected':''}>${l}</option>`).join('')}</select></div>
      <div><label class="f" for="fc">Curriculum</label><select id="fc"><option value="all">All curricula</option>${curs.map(c=>`<option ${st.cur===c?'selected':''}>${c}</option>`).join('')}</select></div></div>
      <p class="small muted">${list.length} of ${M.schools.length} schools · Fee bands: $ RM13,000–30,000/yr, $$ RM30,000–60,000/yr, $$$ RM60,000+/yr</p>
      <div class="tscroll"><table class="tbl"><thead><tr>${th(0,'School')}${th(1,'Curriculum')}${th(2,'Fees')}${th(3,'Location')}${th(4,'Key feature')}${th(5,'Boarding')}</tr></thead><tbody>${list.map(s=>`<tr><td>${esc(s[0])}</td><td>${s[1].map(c=>`<span class="badge" style="margin:0 4px 4px 0">${c}</span>`).join('')}</td><td><strong style="color:var(--accent)">${s[2]}</strong></td><td>${esc(s[3])}</td><td>${esc(s[4])}</td><td>${s[5]?'✔ Yes':'—'}</td></tr>`).join('')}</tbody></table></div>`; },
    map(){ return card(`<div style="font-size:44px">🗺️</div><h2>School Map</h2><span class="badge red">Coming Soon</span><p class="muted" style="margin-top:12px">An interactive map of every international school in Johor is on its way. In the meantime, the Compare tab lists each school by area.</p>`,'center'); },
    faq(){ return `<h2>Frequently Asked Questions</h2>${faqList(M.schoolFaq)}`; }
  },
  wire:{
    curricula(p, root){ wireQuiz(p, M.schoolQuiz, schools.state.quiz, () => schools.redraw(root)); const b=$('[data-showcur]',p); if(b) b.onclick=()=>{ schools.state.cur=b.dataset.showcur; schools.state.tab='comparison'; M.render(); }; },
    comparison(p, root){ [['#fp','price'],['#fl','loc'],['#fc','cur']].forEach(([s,k])=>$(s,p).onchange=e=>{schools.state[k]=e.target.value; schools.redraw(root);}); p.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{ const k=+b.dataset.sort; if(schools.state.sort===k) schools.state.dir = schools.state.dir==='asc'?'desc':'asc'; else { schools.state.sort=k; schools.state.dir='asc'; } schools.redraw(root); }); }
  },
  after(){ return `<section class="cta" style="border-radius:12px;padding:40px 20px;margin-top:40px;text-align:center"><h2>See the schools in person</h2><p>Move to Malaysia runs guided school tours in Johor.</p><a class="btn white" href="https://movetomalaysia.com/" target="_blank" rel="noopener">Book a School Tour</a></section>`; }
});
M.guides['mg-schools'] = schools;

/* =================== PROPERTY =================== */
const prop = guide({
  title:'Property & Housing Guide',
  intro:'Everything you need to know about finding, renting, or buying property in Johor Bahru. From township selection to legal requirements.',
  tabs:[['townships','Areas'],['matchmaker','Match'],['rent-vs-buy','Compare'],['details','Info'],['faq','FAQ']],
  state:{tab:'townships', prefs:[], min:1000, max:10000, commute:60, quiz:{i:0,a:{},done:false}},
  panels:{
    townships(){ return `<h2>Johor Bahru Townships Guide</h2><p class="muted">Understanding JB's key residential clusters will help you find the perfect neighbourhood. Each area has its own character, amenities, and lifestyle.</p>
      ${M.clusters.map(c=>card(`<span class="badge">Cluster ${c.id}</span><h2 style="margin-top:10px">${c.name}</h2><p class="muted" style="margin-top:-6px"><strong>${c.sub}</strong></p><p>${c.desc}</p>
        <div class="grid g2" style="margin-top:18px">${c.t.map(([n,type,d,hl,rc,rl,bc,bl,best])=>`<div style="border:1px solid var(--border);border-radius:8px;padding:16px"><h3 style="margin-bottom:4px">${n}</h3><span class="badge">${type}</span><p style="margin-top:10px">${d}</p><p>${hl.map(h=>`<span class="badge" style="margin:0 4px 4px 0;background:#fff">${h}</span>`).join('')}</p><p class="small"><strong>Best for:</strong> ${best}</p>
          <table class="tbl small"><thead><tr><th></th><th>Rental</th><th>Purchase</th></tr></thead><tbody><tr><td>Condo</td><td>${rc}</td><td>${bc}</td></tr><tr><td>Landed</td><td>${rl}</td><td>${bl}</td></tr></tbody></table></div>`).join('')}</div>`,'')).join('<div style="height:20px"></div>')}`; },
    matchmaker(){ const st=prop.state;
      return `<h2>Neighbourhood Matchmaker</h2><p class="muted">Choose what matters to you, set a monthly rental budget and the longest commute to Singapore you would accept.</p>
      ${card(`<label class="f">What matters to you?</label><div>${M.prefs.map(([id,l,d])=>`<button class="pill ${st.prefs.includes(id)?'on':''}" data-pref="${id}" title="${esc(d)}" aria-pressed="${st.prefs.includes(id)}">${l}</button>`).join('')}</div>
        <div class="row" style="margin-top:12px"><div><label class="f" for="pmin">Budget from (RM/month)</label><input id="pmin" type="number" step="100" min="0" value="${st.min}"></div><div><label class="f" for="pmax">Budget to (RM/month)</label><input id="pmax" type="number" step="100" min="0" value="${st.max}"></div>
        <div><label class="f" for="pcm">Max commute to Singapore: <span id="pcmv">${st.commute}</span> min</label><input id="pcm" type="range" min="10" max="90" step="5" value="${st.commute}" style="width:100%;accent-color:var(--accent)"></div></div>
        <button class="btn outline sm" data-preset>Reset</button>`)}
      <div id="pres" style="margin-top:20px">${prop.results()}</div>`; },
    'rent-vs-buy'(){ const st=prop.state.quiz;
      return `<h2>Renting vs. Buying: Pros & Cons</h2>${table(['Aspect','Renting','Buying'], M.rentVsBuy.map(([a,r,rg,b,bg])=>[`<strong>${a}</strong>`,`${rg?'✅':'⚠️'} ${r}`,`${bg?'✅':'⚠️'} ${b}`]))}
      <h2 style="margin-top:36px">Should You Rent or Buy?</h2><p class="muted">Seven questions about your plans and finances.</p>` +
      quizView(M.rentBuyQuiz, st, o=>o, () => {
        let r=0,b=0; Object.values(st.a).forEach(k=>{ r+=3-k; b+=k; });
        const t=r+b, rp=t?Math.round(r/t*100):50, bp=t?Math.round(b/t*100):50;
        const [rec,msg] = rp>=65 ? ['Renting Recommended','Based on your responses, renting appears to be the better choice for your current situation. This gives you flexibility and lower upfront costs while you settle into life in Johor.'] : bp>=65 ? ['Buying Recommended','Based on your responses, buying property could be a smart move for you. Your stability and long-term plans align well with property ownership in Johor.'] : ['Either Could Work','Your situation suggests both options could work well. Consider your specific financial circumstances and consult with a property advisor to make the final decision.'];
        return card(`<h3>Your Result</h3><div class="grid g2"><div class="center">🔑<p style="margin:0">Renting</p><div class="kpi">${rp}%</div></div><div class="center">🏠<p style="margin:0">Buying</p><div class="kpi red">${bp}%</div></div></div>
          <div class="center" style="margin:14px 0"><span class="badge red">${rec}</span></div><p>${msg}</p><h4>Your Key Factors</h4><ul>${Object.entries(st.a).slice(0,4).map(([qi,k])=>`<li><strong>${esc(M.rentBuyQuiz[qi][0])}</strong> ${esc(M.rentBuyQuiz[qi][1][k])}</li>`).join('')}</ul><button class="btn outline sm" data-qreset>Retake Quiz</button>`);
      }); },
    details(){ return `<div class="prose">${M.htmlPropInfo}</div>`; },
    faq(){ return `<h2>Frequently Asked Questions</h2>${faqList(M.propertyFaq)}`; }
  },
  results(){ const st=prop.state;
    const score = a => st.prefs.length ? Math.round(st.prefs.reduce((s,id)=>s+a[7][M.prefs.findIndex(p=>p[0]===id)],0)/st.prefs.length) : 100;
    const list = M.matchAreas.filter(a => a[3]<=st.max && a[4]>=st.min && a[5]<=st.commute).map(a=>({a, s:score(a)})).sort((x,y)=>y.s-x.s);
    const tag = s => s>=90?['Perfect Match','ok']:s>=80?['Great Match','ok']:s>=60?['Good Match','warn']:['Fair Match','bad'];
    const col = s => s>=80?'g':s>=60?'y':'o';
    if(!list.length) return `<div class="note">No areas fit that budget and commute. Try widening the budget or allowing a longer commute.</div>`;
    return `<p class="small muted">${list.length} area${list.length>1?'s':''} found${st.prefs.length?'':' · pick some priorities to rank them'}</p><div class="grid g2">${list.map(({a,s})=>{const [l,c]=tag(s); return card(`<div style="display:flex;justify-content:space-between;gap:10px"><div><h3 style="margin:0">${a[0]}</h3><p class="small muted" style="margin:0">${a[1]}</p></div><div class="center"><div class="match ${col(s)}">${s}%</div><span class="badge ${c}">${l}</span></div></div><p style="margin-top:10px">${a[2]}</p><p class="small"><strong>Rent:</strong> ${RM(a[3])} – ${RM(a[4])}/month · <strong>To Singapore:</strong> ~${a[5]} min</p><p style="margin:0">${a[6].map(h=>`<span class="badge" style="margin:0 4px 4px 0">${h}</span>`).join('')}</p>`);}).join('')}</div>`; },
  wire:{
    matchmaker(p){ const st=prop.state, upd=()=>{$('#pres',p).innerHTML=prop.results();};
      p.querySelectorAll('[data-pref]').forEach(b=>b.onclick=()=>{ const id=b.dataset.pref; st.prefs = st.prefs.includes(id)?st.prefs.filter(x=>x!==id):[...st.prefs,id]; b.classList.toggle('on'); b.setAttribute('aria-pressed', st.prefs.includes(id)); upd(); });
      $('#pmin',p).oninput=e=>{st.min=+e.target.value||0; upd();}; $('#pmax',p).oninput=e=>{st.max=+e.target.value||0; upd();};
      $('#pcm',p).oninput=e=>{st.commute=+e.target.value; $('#pcmv',p).textContent=st.commute; upd();};
      $('[data-preset]',p).onclick=()=>{ Object.assign(st,{prefs:[],min:1000,max:10000,commute:60}); prop.redraw(p.closest('main')); }; },
    'rent-vs-buy'(p, root){ wireQuiz(p, M.rentBuyQuiz, prop.state.quiz, () => prop.redraw(root)); }
  }
});
M.guides['mg-property'] = prop;

/* =================== COMMUTING =================== */
function sgNow(){ const s=new Date().toLocaleString('en-US',{timeZone:'Asia/Singapore',hour12:false,weekday:'short',hour:'numeric'}); const [wd,h]=s.split(', '); return {h:+h%24, d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(wd)}; }
function traffic(h,d){ const wk=d>=1&&d<=5; if(wk&&h>=7&&h<=9) return ['heavy','Usually heavy','bad']; if(wk&&h>=17&&h<=20) return ['moderate','Usually moderate','warn']; if((d===5&&h>=15)||(d===0&&h>=17)) return ['heavy','Usually heavy','bad']; if(h>=10&&h<=16) return ['light','Usually light','ok']; return ['moderate','Usually moderate','warn']; }
const WAIT = {secondLink:{heavy:'30-45 min',moderate:'15-25 min',light:'5-15 min'},woodlands:{heavy:'60-90 min',moderate:'30-45 min',light:'15-25 min'}};
const mins = a => { const h=Math.floor(a/60), m=a%60; return h===0?`${m} min`:`${h}h ${m}m`; };
const commute = guide({
  title:'Commuting to Singapore',
  intro:'Plan your daily commute with our interactive cost and time calculator. Compare routes via Second Link (Tuas) or Woodlands Causeway from anywhere in Johor.',
  tabs:[['live','Live'],['calculator','Calculator'],['immigration','QR & MACS'],['routes','Routes'],['faq','FAQ']],
  state:{tab:'live', from:0, to:1, mode:'car', when:'peak'},
  panels:{
    live(){ const {h,d}=sgNow(), t=traffic(h,d);
      return `<h2>Live Traffic Cameras</h2><p class="muted">Check conditions before you travel. Times below use Singapore time (${String(h).padStart(2,'0')}:00 now).</p>
      ${card(`<div class="grid g2">${[['secondLink','Second Link (Tuas)'],['woodlands','Woodlands Causeway']].map(([k,l])=>`<div style="border:1px solid var(--border);border-radius:8px;padding:16px"><p style="margin:0;font-weight:800;color:var(--primary)">${l}</p><div class="kpi">${WAIT[k][t[0]]}</div><span class="badge ${t[2]}">${t[1]}</span></div>`).join('')}</div><p class="small muted" style="margin:14px 0 0">Wait times are what a normal week looks like at this hour, not a live measurement. Neither authority publishes queue times, so use the cameras for the real picture.</p>`)}
      <div class="grid g2" style="margin-top:20px">${[['Woodlands','Woodlands Causeway (Towards Johor) · Woodlands Checkpoint (Towards BKE)'],['Second Link','Second Link at Tuas · Tuas Checkpoint']].map(([n,c])=>card(`<div style="font-size:30px">📷</div><h3>${n} cameras</h3><p class="small muted">${c}</p><a class="btn sm" href="https://onemotoring.lta.gov.sg/content/onemotoring/home/driving/traffic_information/traffic-cameras.html" target="_blank" rel="noopener">View live on LTA OneMotoring</a>`)).join('')}</div>
      <p class="center" style="margin-top:18px"><a href="https://onemotoring.lta.gov.sg/content/onemotoring/home/driving/traffic_information/traffic-cameras.html" target="_blank" rel="noopener">View official LTA OneMotoring traffic cameras ↗</a></p>`; },
    calculator(){ const st=commute.state;
      const radio = (name, opts, cur) => opts.map(([v,l])=>`<label class="opt ${cur===v?'on':''}" style="margin-bottom:8px"><input type="radio" name="${name}" value="${v}" ${cur===v?'checked':''}> <span>${l}</span></label>`).join('');
      return `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));align-items:start">
      ${card(`<h3>📍 Plan Your Route</h3><p class="small muted">Select your starting point, destination, and travel time</p>
        <div class="field"><label class="f" for="cmf">Starting Location (Johor)</label><select id="cmf">${M.cmFrom.map((x,i)=>`<option value="${i}" ${st.from===i?'selected':''}>${x[0]}</option>`).join('')}</select></div>
        <div class="field"><label class="f" for="cmt">Destination (Singapore)</label><select id="cmt">${M.cmTo.map((x,i)=>`<option value="${i}" ${st.to===i?'selected':''}>${x[0]}</option>`).join('')}</select></div>
        <label class="f">Transport Mode</label>${radio('cmm',[['car','🚗 Car'],['motorbike','🏍️ Motorbike'],['bus','🚌 Public Bus']],st.mode)}
        <label class="f" style="margin-top:10px">Time of Travel</label>${radio('cmw',[['peak','Peak Hours (7-9am, 5-8pm)'],['offPeak','Off-Peak (10am-4pm)'],['weekend','Weekend / Public Holiday']],st.when)}`)}
      <div id="cmres">${commute.results()}</div></div>`; },
    immigration(){ return `<div class="prose">${M.htmlQR}</div>`; },
    routes(){ return `<div class="prose">${M.htmlRoutes}</div>`; },
    faq(){ return `<h2>Frequently Asked Questions</h2>${faqList(M.commuteFaq)}`; }
  },
  results(){ const st=commute.state, g=M.cmFrom[st.from], v=M.cmTo[st.to], wi={peak:0,offPeak:1,weekend:2}[st.when];
    if(st.mode==='bus'){ const T=M.cmTime.bus, N=T.woodlands[wi], Q=T.wait+g[2]*1.2+N+v[2]*1.5;
      return `<div class="grid g2">${M.cmCost.bus.map(([n,one,mon,off],i)=>card(`${i===0?'<span class="badge red">Most Popular</span>':''}<h3 style="margin-top:8px">🚌 ${n}</h3><p class="small muted" style="margin:0">Est. Time</p><div class="kpi">${mins(Math.round(Q+off))}</div>
        <p class="small" style="margin:10px 0 0">One-way fare <strong style="float:right">${RM(one,2)}</strong><br>Monthly pass <strong style="float:right">${RM(mon,2)}</strong><br>Crossing wait <strong style="float:right">~${N} min</strong></p>`)).join('')}</div>
        ${card(`<h3>💲 Monthly Cost Comparison</h3><p class="small muted">Compare monthly pass vs pay-per-ride (22 working days, round trip)</p><div class="grid g3">${M.cmCost.bus.map(([n,one,mon])=>`<div><p style="margin:0;font-weight:700">${n}</p><div class="kpi" style="font-size:1.3rem">${RM(mon,2)}</div><p class="small muted">Pay-per-ride: ${RM(one*2*22,2)}</p></div>`).join('')}</div>`)}
        <p class="small muted">* Bus fares and times are estimates. Check operators for current fares.</p>`; }
    const c=M.cmCost[st.mode], t=M.cmTime[st.mode];
    const calc = (k, jd, sd) => { const cross=t[k][wi], time=Math.round(jd/t.jb*60+sd/t.sg*60+cross), fuel=jd*c.fuel+sd*c.sgFuel, toll=c[k].toll+c[k].vep[wi]; return {dist:jd+sd, jd, sd, time, cross, fuel, toll, total:fuel+toll}; };
    const r = {secondLink:calc('secondLink',g[1],v[1]), woodlands:calc('woodlands',g[2],v[2])};
    const best = r.secondLink.time*.6+r.secondLink.total*.4 < r.woodlands.time*.6+r.woodlands.total*.4 ? 'secondLink' : 'woodlands';
    return `<div class="grid g2">${[['secondLink','Second Link (Tuas)'],['woodlands','Woodlands Causeway']].map(([k,l])=>{const x=r[k]; return card(`${best===k?'<span class="badge red">Recommended</span>':''}<h3 style="margin-top:8px">${l}</h3>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><div><p class="small muted" style="margin:0">⏱ Est. Time</p><div class="kpi" style="font-size:1.4rem">${mins(x.time)}</div></div><div><p class="small muted" style="margin:0">💲 One-way Cost</p><div class="kpi red" style="font-size:1.4rem">${RM(x.total,2)}</div></div></div>
      <p class="small" style="margin:12px 0 0">Distance <strong style="float:right">${x.dist} km (JB ${x.jd} + SG ${x.sd})</strong><br>Border crossing <strong style="float:right">~${x.cross} min</strong><br>Fuel <strong style="float:right">${RM(x.fuel,2)}</strong><br>Toll + VEP <strong style="float:right">${RM(x.toll,2)}</strong></p>`, best===k?'':'');}).join('')}</div>
      ${card(`<h3>📅 Monthly estimate (22 working days, round trip)</h3><div class="grid g2"><div><p style="margin:0">Second Link</p><div class="kpi" style="font-size:1.3rem">${RM(r.secondLink.total*2*22,0)}</div></div><div><p style="margin:0">Woodlands</p><div class="kpi" style="font-size:1.3rem">${RM(r.woodlands.total*2*22,0)}</div></div></div>`)}
      <div class="note small">Estimates only. VEP charges apply to foreign-registered vehicles entering Singapore, and crossing times vary day to day. Check the Live tab before you leave.</div>`; },
  wire:{
    calculator(p){ const st=commute.state, upd=()=>{ $('#cmres',p).innerHTML=commute.results(); };
      $('#cmf',p).onchange=e=>{st.from=+e.target.value; upd();}; $('#cmt',p).onchange=e=>{st.to=+e.target.value; upd();};
      p.querySelectorAll('input[name=cmm],input[name=cmw]').forEach(r=>r.onchange=()=>{ if(r.name==='cmm') st.mode=r.value; else st.when=r.value; p.querySelectorAll(`input[name=${r.name}]`).forEach(x=>x.closest('.opt').classList.toggle('on',x.checked)); upd(); }); }
  }
});
M.guides['mg-commuting'] = commute;

/* =================== COST OF LIVING =================== */
const CUR = {SGD:['Singapore Dollar','S$'],USD:['US Dollar','$'],EUR:['Euro','€'],CNY:['Chinese Yuan','¥'],JPY:['Japanese Yen','¥'],KRW:['Korean Won','₩']};
const CITY_KEYS = Object.keys(M.cities);
const cityIdx = k => CITY_KEYS.indexOf(k);
const TIERS = {saver:['💚','Saver'],average:['⚖️','Average'],premium:['💎','Premium']};
const TIER_I = {saver:0,average:1,premium:2};
const inCity = (rm, k) => { const [sym,rate]=M.cityCur[k]; return `${sym} ${Math.round(rm*rate).toLocaleString()}`; };
const colInit = () => ({on:Object.fromEntries(M.basket.map(b=>[b[0],b[2]>0])), qty:Object.fromEntries(M.basket.map(b=>[b[0],b[2]])), tier:Object.fromEntries(M.basket.map(b=>[b[0],'average'])), preset:'average'});
const col = guide({
  title:'Cost of Living',
  intro:'Compare everyday expenses across cities and build your own weekly spending basket to see exactly how far your money goes in Johor.',
  tabs:[['compare','Compare'],['basket','Basket'],['currency','Currency'],['faq','FAQ']],
  state:{tab:'compare', a:'johor', b:'singapore', ba:'johor', bb:'singapore', basket:colInit(), cur:'SGD', rates:{...M.fxDefaults}, amt:'1000', myr:''},
  panels:{
    compare(){ const st=col.state, sel=(id,v)=>`<select id="${id}">${CITY_KEYS.map(k=>`<option value="${k}" ${v===k?'selected':''}>${M.cities[k]}</option>`).join('')}</select>`;
      return `<h2>City Price Comparison</h2><p class="muted">Typical prices for everyday items. The difference column compares like-for-like values converted to ringgit.</p>
      <div class="row" style="margin-bottom:16px;align-items:end"><div><label class="f" for="ca">City</label>${sel('ca',st.a)}</div><div style="flex:0 0 auto;padding-bottom:12px;text-align:center">⇄</div><div><label class="f" for="cb">Compare with</label>${sel('cb',st.b)}</div></div>
      ${table(['Item',M.cities[st.a],M.cities[st.b],'Difference'], M.colCompare.map(([item,vals,myr])=>{ const x=myr[st.a], y=myr[st.b], d=x>0?(y-x)/x*100:0; return [`<strong>${esc(item)}</strong>`, vals[st.a], vals[st.b], `<span class="badge ${d>5?'bad':d<-5?'ok':''}">${d>0?'+':''}${d.toFixed(0)}%</span>`]; }))}
      <p class="small muted" style="margin-top:10px">Positive means ${M.cities[st.b]} costs more than ${M.cities[st.a]}.</p>`; },
    basket(){ const st=col.state, B=st.basket, cats=[...new Set(M.basket.map(b=>b[1]))], sel=(id,v)=>`<select id="${id}">${CITY_KEYS.map(k=>`<option value="${k}" ${v===k?'selected':''}>${M.cities[k]}</option>`).join('')}</select>`;
      return `<h2>Build Your Weekly Basket</h2><p class="muted">Tick what you buy in a typical week, set quantities and the quality tier, and compare two cities.</p>
      ${card(`<label class="f">Lifestyle preset</label><div>${Object.entries(TIERS).map(([k,[i,l]])=>`<button class="pill ${B.preset===k?'on':''}" data-preset="${k}">${i} ${l}</button>`).join('')}</div>
        <div class="row" style="margin-top:10px;align-items:end"><div><label class="f" for="bka">Your city</label>${sel('bka',st.ba)}</div><div><label class="f" for="bkb">Compare with</label>${sel('bkb',st.bb)}</div><div style="flex:0 0 auto"><button class="btn outline sm" data-breset>Reset</button></div></div>`)}
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));align-items:start;margin-top:20px">
       <div>${cats.map(c=>{ const items=M.basket.filter(b=>b[1]===c), all=items.every(b=>B.on[b[0]]); return card(`<div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">${c}</h3><button class="btn outline sm" data-cat="${c}">${all?'Deselect all':'Select all'}</button></div>
         ${items.map(([id,,,labels,prices])=>`<div class="item-row"><input type="checkbox" data-on="${id}" ${B.on[id]?'checked':''} aria-label="Include ${esc(labels[TIER_I[B.tier[id]]])}" style="width:20px;height:20px;accent-color:var(--accent)"><div><div style="font-weight:600">${esc(labels[TIER_I[B.tier[id]]])}</div><select data-tier="${id}" aria-label="Tier">${Object.entries(TIERS).map(([k,[,l]])=>`<option value="${k}" ${B.tier[id]===k?'selected':''}>${l}</option>`).join('')}</select> <span class="small muted">${inCity(prices[TIER_I[B.tier[id]]][cityIdx(st.ba)],st.ba)} each</span></div><div class="qty"><button data-q="${id}" data-d="-1" aria-label="Less">−</button><strong>${B.qty[id]}</strong><button data-q="${id}" data-d="1" aria-label="More">+</button></div></div>`).join('')}`,'') + '<div style="height:14px"></div>'; }).join('')}</div>
       <div style="position:sticky;top:84px">${col.totals()}</div></div>`; },
    currency(){ const st=col.state, r=st.rates[st.cur], sym=CUR[st.cur][1];
      return `<h2>Currency Converter</h2><p class="muted">Convert into ringgit (MYR). Live rates are not available inside the app, so enter today's rate from your bank or a rate site. The default is an indicative figure.</p>
      ${card(`<div>${Object.keys(CUR).map(k=>`<button class="pill ${st.cur===k?'on':''}" data-cur="${k}">${k}</button>`).join('')}</div>
        <div class="row" style="margin-top:10px"><div><label class="f" for="fxr">1 ${st.cur} = ? MYR</label><input id="fxr" type="number" step="0.0001" min="0" value="${r}"></div><div style="flex:0 0 auto;align-self:end;padding-bottom:12px"><a class="small" href="https://www.google.com/search?q=${st.cur}+to+MYR" target="_blank" rel="noopener">Check today's rate ↗</a></div></div>
        <div class="row" style="margin-top:6px;align-items:end"><div><label class="f" for="fxa">${st.cur} (${CUR[st.cur][0]})</label><input id="fxa" type="number" min="0" value="${esc(st.amt)}"></div><div style="flex:0 0 auto;padding-bottom:12px;text-align:center">⇄</div><div><label class="f" for="fxm">MYR (Malaysian Ringgit)</label><input id="fxm" type="number" min="0" value="${st.amt&&r?(parseFloat(st.amt)*r).toFixed(2):''}"></div></div>`)}
      <div id="fxres" style="margin-top:20px">${col.fx()}</div>`; },
    faq(){ return `<h2>Frequently Asked Questions</h2>${faqList(M.colFaq)}`; }
  },
  totals(){ const st=col.state, B=st.basket, ia=cityIdx(st.ba), ib=cityIdx(st.bb);
    const items = M.basket.filter(b=>B.on[b[0]] && B.qty[b[0]]>0);
    const A = items.reduce((s,b)=>s+b[4][TIER_I[B.tier[b[0]]]][ia]*B.qty[b[0]],0), Bt = items.reduce((s,b)=>s+b[4][TIER_I[B.tier[b[0]]]][ib]*B.qty[b[0]],0);
    const pct = A>0 ? (Bt-A)/A*100 : 0;
    return card(`<h3>Weekly Total · ${TIERS[B.preset][0]} ${TIERS[B.preset][1]}</h3><div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><div><p class="small muted" style="margin:0">${M.cities[st.ba]}</p><div class="kpi">${inCity(A,st.ba)}</div></div><div><p class="small muted" style="margin:0">${M.cities[st.bb]}</p><div class="kpi red">${inCity(Bt,st.bb)}</div></div></div>
      <div class="note blue" style="margin:14px 0">${M.cities[st.bb]} is <strong>${Math.abs(pct).toFixed(0)}% ${pct>0?'more expensive':'cheaper'}</strong> for this basket.</div>
      <h4>Monthly estimate (× 4.33 weeks)</h4><p style="margin:0">${M.cities[st.ba]}: <strong>${inCity(A*4.33,st.ba)}</strong><br>${M.cities[st.bb]}: <strong>${inCity(Bt*4.33,st.bb)}</strong></p><p class="small muted" style="margin:10px 0 0">${items.length} items selected. Prices are indicative and converted from ringgit.</p>`); },
  fx(){ const st=col.state, r=st.rates[st.cur], sym=CUR[st.cur][1]; if(!r) return '';
    return `<div class="grid g2">${card(`<h3>Quick reference</h3>${table([st.cur,'MYR'],[100,500,1000,5000,10000].map(k=>[`${sym} ${k.toLocaleString()}`,`RM ${(k*r).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`]))}`)}
      ${card(`<h3>Provider comparison</h3><p class="small muted">What ${sym} 1,000 gets you after typical fees and markups.</p>${table(['Provider','Rate','Per 1,000','Note'],M.fxProviders.map(([n,sp,note,url])=>[url?`<a href="${url}" target="_blank" rel="noopener">${n} ↗</a>`:n,(r*(1-sp)).toFixed(4),`RM ${(1000*r*(1-sp)).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`,note]),0)}`)}</div>`; },
  wire:{
    compare(p, root){ $('#ca',p).onchange=e=>{col.state.a=e.target.value; col.redraw(root);}; $('#cb',p).onchange=e=>{col.state.b=e.target.value; col.redraw(root);}; },
    basket(p, root){ const st=col.state, B=st.basket, re=()=>col.redraw(root);
      $('#bka',p).onchange=e=>{st.ba=e.target.value; re();}; $('#bkb',p).onchange=e=>{st.bb=e.target.value; re();};
      $('[data-breset]',p).onclick=()=>{ st.basket=colInit(); re(); };
      p.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{ B.preset=b.dataset.preset; M.basket.forEach(x=>B.tier[x[0]]=B.preset); re(); });
      p.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{ const items=M.basket.filter(x=>x[1]===b.dataset.cat), all=items.every(x=>B.on[x[0]]); items.forEach(x=>{ B.on[x[0]]=!all; if(!all && B.qty[x[0]]===0) B.qty[x[0]]=1; }); re(); });
      p.querySelectorAll('[data-on]').forEach(c=>c.onchange=()=>{ B.on[c.dataset.on]=c.checked; if(c.checked && B.qty[c.dataset.on]===0) B.qty[c.dataset.on]=1; re(); });
      p.querySelectorAll('[data-tier]').forEach(s=>s.onchange=()=>{ B.tier[s.dataset.tier]=s.value; re(); });
      p.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{ const id=b.dataset.q; B.qty[id]=Math.max(0,B.qty[id]+(+b.dataset.d)); if(B.qty[id]>0) B.on[id]=true; re(); }); },
    currency(p, root){ const st=col.state, upd=()=>{ $('#fxres',p).innerHTML=col.fx(); };
      p.querySelectorAll('[data-cur]').forEach(b=>b.onclick=()=>{ st.cur=b.dataset.cur; col.redraw(root); });
      $('#fxr',p).oninput=e=>{ st.rates[st.cur]=parseFloat(e.target.value)||0; $('#fxm',p).value = st.amt&&st.rates[st.cur] ? (parseFloat(st.amt)*st.rates[st.cur]).toFixed(2) : ''; upd(); };
      $('#fxa',p).oninput=e=>{ st.amt=e.target.value; const r=st.rates[st.cur]; $('#fxm',p).value = r&&st.amt ? (parseFloat(st.amt)*r).toFixed(2) : ''; };
      $('#fxm',p).oninput=e=>{ const r=st.rates[st.cur], v=e.target.value; st.amt = r&&v ? (parseFloat(v)/r).toFixed(2) : ''; $('#fxa',p).value=st.amt; }; }
  }
});
M.guides['mg-cost-of-living'] = col;

/* =================== PRIVATE TRANSPORT =================== */
const FX = 3.5;
const iceTax = cc => { for(const [max,base] of M.roadTaxBands) if(cc<=max) return base; return 5320; };
const evTax = kw => kw<=100 ? 70 : kw<=210 ? 80+Math.ceil((kw-100)/10)*20 : 80+11*20+Math.ceil((kw-210)/10)*40;
const car = guide({
  title:'Private Transport',
  intro:'Compare car prices, calculate hire purchase, look up road tax, and estimate your monthly running costs, all in one place.',
  tabs:[['compare','Compare'],['calculator','Finance'],['roadtax','Road Tax'],['faq','FAQ']],
  state:{tab:'compare', model:'myvi', cond:'new', route:0, rides:10, price:280000, down:30, rate:2.8, years:7, income:15000, kind:'ice', cc:2000, kw:150},
  panels:{
    compare(){ const st=car.state, m=M.cars[st.model];
      return `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));align-items:start">
      ${card(`<h3>🚗 SG vs MY Price Comparison</h3><p class="small muted">See how much you save buying a car in Malaysia vs Singapore</p>
        <div class="row"><div><label class="f" for="cmo">Model</label><select id="cmo">${Object.entries(M.cars).map(([k,v])=>`<option value="${k}" ${st.model===k?'selected':''}>${v[0]}</option>`).join('')}</select></div>
        <div><label class="f" for="cco">Condition</label><select id="cco">${m[1]?`<option value="new" ${st.cond==='new'?'selected':''}>Brand New</option>`:''}${m[2]?`<option value="used" ${st.cond==='used'?'selected':''}>Second Hand</option>`:''}</select></div></div>
        <div id="carcmp">${car.cmp()}</div>`)}
      ${card(`<h3>🚕 Grab vs Car Ownership: Monthly Cost</h3><p class="small muted">Uses the model & condition selected. Adjust your estimated monthly Grab spend to compare.</p>
        <div class="row"><div><label class="f" for="cgr">Typical route</label><select id="cgr">${M.grabRoutes.map((r,i)=>`<option value="${i}" ${st.route===i?'selected':''}>${r[0]} (~RM ${r[2]})</option>`).join('')}</select></div>
        <div><label class="f" for="crd">Rides per week</label><select id="crd">${[2,4,6,8,10,14,18,21].map(n=>`<option value="${n}" ${st.rides===n?'selected':''}>${n} rides/week${n>=14?' (2–3/day)':''}</option>`).join('')}</select></div></div>
        <div id="cargrab">${car.grab()}</div>`)}
      </div>
      ${card(`<h3>Grab Ride Estimates in Johor</h3><p class="small muted">Rough cost of common routes using Grab / e-hailing within Johor Bahru.</p>${table(['Route','Distance','Est. Fare (RM)'],M.grabRoutes.map(r=>[r[0],r[1]+' km',RM(r[2])]))}<p class="small muted" style="margin-top:8px">Estimates based on standard GrabCar fares. Surge pricing may apply during peak hours.</p>`)}`; },
    calculator(){ const st=car.state; return card(`<h3>🧮 Expat Hire Purchase Calculator</h3><p class="small muted">Estimate your monthly installment, shown in MYR and SGD (at RM ${FX} to S$ 1)</p>
      <div class="row"><div><label class="f" for="hp">Vehicle Price (MYR)</label><input id="hp" type="number" value="${st.price}"></div><div><label class="f" for="hd">Down Payment %</label><input id="hd" type="number" value="${st.down}"></div><div><label class="f" for="hr">Interest Rate %</label><input id="hr" type="number" step="0.1" value="${st.rate}"></div><div><label class="f" for="hy">Tenure (years)</label><input id="hy" type="number" min="1" max="9" value="${st.years}"></div></div>
      <div id="hpres">${car.hp()}</div><p class="small muted" style="margin:10px 0 0">DSR turns green when installment is &lt;30% of monthly income. Typical expat requirement: 30% down payment.</p>`); },
    roadtax(){ const st=car.state, ice=st.kind==='ice';
      return card(`<h3>⚡ 2026 Road Tax Lookup</h3><p class="small muted">Look up annual road tax for ICE or EV vehicles</p>
      <div style="margin-bottom:12px"><button class="pill ${ice?'on':''}" data-kind="ice">⛽ ICE / Petrol</button><button class="pill ${!ice?'on':''}" data-kind="ev">⚡ EV / Electric</button></div>
      <div class="row" style="align-items:end"><div><label class="f" for="rtv">${ice?'Engine CC':'Motor Power (kW)'}</label><input id="rtv" type="number" value="${ice?st.cc:st.kw}"></div><div id="rtres">${car.rt()}</div></div>
      <div style="margin-top:16px">${table([ice?'Engine':'Motor','Annual Tax'], (ice?[1000,1600,2000,2500,3000]:[80,100,150,210,300]).map(v=>[ice?v.toLocaleString()+' cc':v+' kW', RM(ice?iceTax(v):evTax(v))]), (ice?[1000,1600,2000,2500,3000]:[80,100,150,210,300]).indexOf(ice?st.cc:st.kw))}</div>
      <p class="small muted" style="margin-top:12px"><strong>Sources:</strong> ICE road tax rates from <a href="https://www.jpj.gov.my/en/web/portal/kadar-cukai-jalan" target="_blank" rel="noopener">JPJ: Kadar Cukai Jalan (Road Tax Rates)</a> per Road Transport Act 1987, First Schedule. 2026 EV road tax bands from <a href="https://www.mot.gov.my/en/land/operators/road-taxes" target="_blank" rel="noopener">MOT: Road Taxes</a>. Rates are for Peninsular Malaysia private vehicles.</p>`); },
    faq(){ return `<h2>Frequently Asked Questions</h2><p class="muted">Common questions about buying and owning a car in Malaysia.</p>${faqList(M.carFaq)}`; }
  },
  cond(){ const st=car.state, m=M.cars[st.model]; return m[st.cond==='new'?1:2] ? st.cond : (m[1]?'new':'used'); },
  cmp(){ const st=car.state, m=M.cars[st.model], d=m[car.cond()==='new'?1:2];
    return `<div class="grid g2" style="margin-top:6px"><div style="background:var(--muted-bg);border-radius:8px;padding:14px"><p class="small muted" style="margin:0">Singapore (High Tax)</p><div class="kpi" style="font-size:1.4rem">${SGD(d.sg)}</div><p class="small muted" style="margin:0">Includes COE ≈ ${SGD(110000)}</p></div>
      <div style="background:#eef3fb;border-radius:8px;padding:14px"><p class="small muted" style="margin:0">Malaysia (Lifestyle Upgrade)</p><div class="kpi red" style="font-size:1.4rem">${RM(d.my)}</div><p class="small muted" style="margin:0">No COE required</p></div></div>
      <div class="center" style="margin-top:14px"><p style="margin:0">You save approximately</p><div class="kpi red" style="font-size:2.2rem">${Math.round((1-d.my/FX/d.sg)*100)}%</div><p class="small muted">(${SGD(d.sg-d.my/FX)} saved vs Singapore)</p></div>`; },
  grab(){ const st=car.state, r=M.grabRoutes[st.route], spend=Math.round(r[2]*st.rides*4.33), name=`${M.cars[st.model][0]} (${car.cond()==='new'?'New':'2nd Hand'})`, own=M.ownCost[name];
    let out = `<p>Estimated monthly Grab spend: <strong>${RM(spend)}</strong> <span class="small muted">(${st.rides} rides × RM ${r[2]} × 4.33 weeks)</span></p>`;
    if(own==null) return out + `<p class="note small">No ownership cost data available for ${name}. Try another model/condition.</p>`;
    const diff = own-spend;
    return out + `<p style="font-weight:700;margin-bottom:6px">${name}</p><div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><div><p class="small muted" style="margin:0">Own</p><div class="kpi" style="font-size:1.3rem">${RM(own)}<span class="small muted">/mo</span></div></div><div><p class="small muted" style="margin:0">Grab-only</p><div class="kpi" style="font-size:1.3rem">${RM(spend)}<span class="small muted">/mo</span></div></div></div>
      <p class="center" style="margin:12px 0 4px"><span class="badge ${diff<0?'ok':'red'}">${diff<0?`Own & save ${RM(-diff)}/mo`:diff===0?'Break even':`Grab saves ${RM(diff)}/mo`}</span></p><p class="small muted" style="margin:0">Car ownership includes hire purchase installment, insurance, fuel, and parking.</p>`; },
  hp(){ const st=car.state, P=st.price*(1-st.down/100), i=st.rate/100/12, n=st.years*12, Y = i>0 ? P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1) : P/n, dsr = st.income>0 ? Y/st.income*100 : 0, ok = dsr<30;
    return `<div class="grid g3" style="margin-top:14px"><div style="background:var(--muted-bg);border-radius:8px;padding:14px"><p class="small muted" style="margin:0">Monthly (MYR)</p><div class="kpi">${RM(isFinite(Y)?Y:0)}</div></div><div style="background:var(--muted-bg);border-radius:8px;padding:14px"><p class="small muted" style="margin:0">Monthly (SGD)</p><div class="kpi">${SGD(isFinite(Y)?Y/FX:0)}</div></div>
      <div style="background:var(--muted-bg);border-radius:8px;padding:14px"><p class="small muted" style="margin:0">DSR Health</p><div class="row" style="gap:8px;align-items:center"><input id="hi" type="number" placeholder="Monthly income" value="${st.income}" aria-label="Monthly income (MYR)" style="flex:1 1 100px"><span class="badge ${ok?'ok':'bad'}" style="flex:0 0 auto">${ok?'✔':'⚠'} ${dsr.toFixed(1)}%</span></div></div></div>`; },
  rt(){ const st=car.state, tax = st.kind==='ice' ? iceTax(st.cc) : evTax(st.kw), save = st.kind==='ev' ? iceTax(3000)-tax : 0;
    return `<p class="small muted" style="margin:0">Annual Road Tax</p><div class="kpi red">${RM(tax)}</div>${save>0?`<span class="badge ok">⚡ Save ${RM(save)}/yr vs 3.0L petrol</span>`:''}`; },
  wire:{
    compare(p, root){ const st=car.state;
      $('#cmo',p).onchange=e=>{ st.model=e.target.value; st.cond=car.cond(); car.redraw(root); };
      $('#cco',p).onchange=e=>{ st.cond=e.target.value; $('#carcmp',p).innerHTML=car.cmp(); $('#cargrab',p).innerHTML=car.grab(); };
      $('#cgr',p).onchange=e=>{ st.route=+e.target.value; $('#cargrab',p).innerHTML=car.grab(); };
      $('#crd',p).onchange=e=>{ st.rides=+e.target.value; $('#cargrab',p).innerHTML=car.grab(); }; },
    calculator(p){ const st=car.state, up=()=>{ $('#hpres',p).innerHTML=car.hp(); wireIncome(); };
      const wireIncome=()=>{ const hi=$('#hi',p); hi.onchange=e=>{ st.income=+e.target.value||0; up(); }; };
      [['#hp','price'],['#hd','down'],['#hr','rate'],['#hy','years']].forEach(([s,k])=>$(s,p).oninput=e=>{ st[k]=+e.target.value||0; up(); }); wireIncome(); },
    roadtax(p, root){ const st=car.state;
      p.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{ st.kind=b.dataset.kind; car.redraw(root); });
      $('#rtv',p).oninput=e=>{ if(st.kind==='ice') st.cc=+e.target.value||0; else st.kw=+e.target.value||0; $('#rtres',p).innerHTML=car.rt(); };
      $('#rtv',p).onchange=()=>car.redraw(root); }
  },
  after(){ return `<p class="small muted center" style="margin-top:28px">All figures are estimates for illustration purposes only. COE premiums, road tax bands, and exchange rates fluctuate. Always refer to JPJ, LTA, and your bank for official figures.</p>`; }
});
M.guides['mg-car'] = car;

/* =================== JS-SEZ =================== */
const sez = guide({
  title:'JS-SEZ: Johor-Singapore Special Economic Zone',
  intro:'A comprehensive guide to the bilateral economic zone transforming Johor into a regional business powerhouse, covering geography, incentives, target sectors, family offices, and upcoming policies.',
  tabs:[['overview','Overview'],['zones','Zones'],['incentives','Incentives'],['family-offices','Family'],['news','News'],['faq','FAQ']],
  state:{tab:'overview'},
  panels:Object.fromEntries(['overview','zones','incentives','family-offices','news','faq'].map(t=>[t,()=>`<div class="prose">${M.htmlSez[t]}</div>`])),
  after(){ return `<section class="cta" style="border-radius:12px;padding:40px 20px;margin-top:40px;text-align:center"><h2>Setting up in the JS-SEZ?</h2><p>Market entry, staff housing and corporate relocation support for businesses moving into Johor.</p><div class="btns"><a class="btn white" href="https://movetomalaysia.com/" target="_blank" rel="noopener">Talk to Us</a><a class="btn ghost-white" href="#blog-tax-incentives">Read: Tax incentives</a></div></section>`; }
});
M.guides['mg-js-sez'] = sez;
})();
