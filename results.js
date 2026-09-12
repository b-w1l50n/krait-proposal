import { proposalPages } from './proposal.js?v=executive-summaries';
// Selected study results for the presentation. Snapshot: 8 September 2026.
// Source paths are attribution, not URLs to private files. No circuit data loaded.
const source = (file, note) => `<details class="source-note"><summary>Study source & scope</summary><p>${note}</p><code>${file}</code><p>Phase 8 evidence snapshot · 8 September 2026. Source files remain in the private handoff; only selected results and figures are included here.</p></details>`;
const heading = (tag,title,desc) => `<div class="results-heading"><p class="eyebrow">${tag}</p><h1>${title}<span>.</span></h1><p>${desc}</p></div>`;
const executiveSummary = (copy) => `<aside class="executive-summary"><span>Executive Summary</span><p>${copy}</p></aside>`;
const metric = (value,title,note,warning=false) => `<article class="metric ${warning?'caution':''}"><strong>${value}</strong><h3>${title}</h3><p>${note}</p></article>`;
const pages = [
{key:'routes',title:'Coordination',content:
heading('02 / MATLAB · RATE & SCHEDULING STUDY','Coordination is a timing problem','What the scheduling study means for the proposed network.')+
executiveSummary('Route-based frequency assignment is the strongest starting point identified by the scheduling study. In the baseline 30-vehicle simulation, the longest update gap was 5.30 seconds. Prediction errors and missed handovers produced interruptions, indicating that the scheduling software will require tuning with in-water test data before swarm reliability can be verified.')+
`<div class="metric-row">${metric('99.88%','Fresh model-accepted records','Baseline route scenario. Scheduling acceptance, not measured packet reliability.')}${metric('5.30 s','Longest update gap · baseline','Even the favorable fixture does not maintain a universal 3-second spacing.')}${metric('185.16 s','Longest update gap · with errors','The scenario with prediction errors and added disturbances fails a general 3–5-second service claim.',true)}</div>
<div class="study-context"><b>Scenario</b> 30 vehicles · 900-second synthetic route · 3-second offered updates · assumed total source level 190 dB re 1 µPa at 1 m. These are model inputs, not demonstrated hardware capability.</div>
<figure class="study-figure"><a href="route-comparison.png" target="_blank" rel="noopener"><img src="route-comparison.png" alt="Original MATLAB figure comparing low-band shared, expanded static and route-aware policies, across nominal and uncertain fixtures at assumed source levels 180 and 190 dB."></a><figcaption>Original simulator figure, unchanged. “Mixed route fixture” means the baseline scenario; “uncertain route fixture” adds prediction errors and disturbances. “Expanded route” means route-based scheduling. Percentages are model acceptance, not measured packet success. Open the figure for full size.</figcaption></figure>
<div class="table-scroll"><table><caption>Baseline 190 dB scenario · fresh model-accepted records and update spacing</caption><thead><tr><th>Scheduling approach</th><th>Accepted</th><th>P95 spacing</th><th>Worst spacing</th></tr></thead><tbody><tr><td>Shared low-frequency band</td><td>57.94%</td><td>5.01 s</td><td>10.19 s</td></tr><tr><td>Fixed frequency-group assignment</td><td>82.10%</td><td>6.45 s</td><td>31.12 s</td></tr><tr><td>Route-based scheduling</td><td>99.88%</td><td>3.17 s</td><td>5.30 s</td></tr></tbody></table></div>
<div class="result-note"><h2>The average is not the service guarantee.</h2><p>The stress test keeps the same 3.17-second P95 spacing while hiding a much longer worst gap. It adds range-estimation errors, clock offsets, extra noise, reduced acoustic response and missed frequency-switching events. The study uses a rate/link-budget proxy; it does not execute a Doppler/multipath waveform receiver.</p><p>When all 30 vehicles stay in the far zone, the tested framing/rate assumptions require at least <b>5.175 seconds</b> of one-group transmission. More spectrum elsewhere does not solve that fixture's service bottleneck.</p></div>`+
source('krait/docs/05b_expanded_band_results.md; krait/matlab/route_allocation/results/route_comparison.png','Latest expanded-band report. The 5.175-second case assumes an 8 kbit/s ceiling and 50 ms per-record overhead. Short overhead is a hypothesis; source level is not selected-transducer evidence.')},
{key:'waveform',title:'Waveform',content:
heading('03 / MATLAB · SAMPLED RECEIVER TRIALS','Power assumptions change the result','What the receiver trials mean for the mothership power system.')+
executiveSummary('The receiver performed well when each simulated channel retained its full transmit-power allocation. Performance degraded when a fixed total-power budget was divided across many simultaneous channels. In practice, the mothership must either provide sufficient transmit power for every active carrier or schedule fewer carriers at once. This is manageable, but the electrical power, thermal headroom and resulting link reliability must be verified on the prototype.')+
`<div class="metric-row">${metric('0 / 40','Packet errors: fixed per-channel power','Sampled center carrier with differential echo motion. A finite simulation result.')}${metric('39 / 40','Packet errors: fixed total power','The same comparison becomes unfavorable when total composite power is held fixed.',true)}${metric('6.717 s','Earlier coded-frame duration','64-byte payload at 350 symbols/s. This is not the short-overhead route-model frame.')}</div>
<figure class="study-figure"><a href="waveform-trials.png" target="_blank" rel="noopener"><img src="waveform-trials.png" alt="Original 20-channel MATLAB trial figure: fixed-total-power condition has 97.5 percent packet errors, while the sampled center moving-echo condition at fixed per-channel power has zero errors in 40 trials."></a><figcaption>Original earlier waveform figure. Forty trials per condition; power is fixed per channel except the explicitly labeled fixed-total-power case. Sampled receiver trials do not qualify 20 separately located vehicles simultaneously.</figcaption></figure>
<div class="two-notes"><article><span class="eyebrow">WHAT WAS LEARNED</span><h2>Power accounting matters.</h2><p>Holding power per channel and holding total composite power are different experiments. The two outcomes must remain side by side in the proposal.</p></article><article><span class="eyebrow">WHAT REMAINS UNKNOWN</span><h2>Zero errors is not zero risk.</h2><p>Zero errors in 40 trials still has an <b>8.76% two-sided 95% Wilson upper PER bound</b>. No hardware range, full-duplex isolation or fleet-level reliability is established.</p></article></div>`+
source('krait/docs/02c_phase2b_results.md; krait/matlab/plots_phase2b/twenty_channels.png','Historical waveform evidence interpreted within the current Phase 8 report. Its frame duration and sampled receiver conditions must not be substituted for the later scheduling model.')},
{key:'electronics',title:'Electronics',content:
heading('04 / SPICE & IMPLEMENTATION SCREENING','Evidence for the next prototype','What the circuit screening supports building next.')+
executiveSummary('LTspice screening supports building the proposed analog chain and continuing the full-duplex design. Once the Rev A PCBs are manufactured and assembled, bench testing will verify TX/RX isolation, converter behavior, filtering, thermal limits and power-stage headroom with the selected transducers.')+
`<div class="result-note caution"><h2>Full-duplex simulation checks passed. Bench validation is required.</h2><p>The tested tone scenarios avoided receiver overload under the assumed transmit-to-receive isolation. The prototype must demonstrate that isolation and successful simultaneous transmission and reception in hardware.</p></div>
<div class="metric-row">${metric('64','Circuit simulation cases','64 electrical scenarios screened in LTspice using generic circuit models. Hardware testing comes next.')}${metric('0.469 dB','Signal-band consistency','Largest filter-response variation found in 12 simulated component-tolerance samples. Smaller variation means a more even response across the intended signal band.')}${metric('62.42 dB','Unwanted-frequency suppression','Weakest suppression at 432 kHz across those 12 samples. Larger values mean stronger filtering at that frequency; hardware performance remains to be measured.')}</div>
`+
source('krait/docs/05b_expanded_band_results.md; krait/docs/03_fpga_resource_estimate.md; krait/docs/03b_external_memory_feasibility.md','Refined fifth-order generic filter at a 512 ksps candidate rate; 12 seeded tolerance cases. Selected component values and internal architecture are deliberately omitted from this presentation. Simulation results are not measurements.')},
{key:'development',title:'Development',content:
heading('05 / DEVELOPMENT PROPOSAL','A staged path to real hardware','How the preliminary study translates into a Rev A prototype.')+
executiveSummary('The study supports moving into a Rev A prototype using two FPGA capability tiers and purpose-selected acoustic hardware. The modem electronics are expected to remain below $300 per assembled PCB, excluding acoustic hardware. Complete modem hardware currently targets approximately $750 per unit on average, with some configurations potentially reaching $1,500 depending on transducer selection. The 2–3 km range and 20–30-vehicle network remain validation goals, but preliminary simulations indicate they are technically realistic targets.')+
`<div class="metric-row">${metric('About $750','Average complete-modem target','Includes the transmit transducer and receive hydrophone. Some configurations may reach $1,500.')}${metric('2–3 km','Desired operating range','A requirement for validation, not experimentally proven range.')}${metric('20–30','Commercial fleet target','Operating vehicles, not guaranteed simultaneous independent links. Forty remains an aspiration.')}</div>
<ol class="milestones"><li><span>A</span><div><h3>Confirm the system requirements</h3><p>Define swarm configuration, communications functions, interfaces and required outputs.</p></div></li><li><span>B</span><div><h3>Prove the combined digital prototype</h3><p>Exercise waveform behavior, scheduling, handovers and uncertainty together.</p></div></li><li><span>C</span><div><h3>Measure the electronics</h3><p>Validate converter settling, output limits, leakage, memory throughput and FPGA timing.</p></div></li><li><span>D</span><div><h3>Build an integrated Rev A</h3><p>Review schematics, the real PCB layout, manufacturing files and a revised quoted BOM.</p></div></li><li><span>E</span><div><h3>Test in water, then revise</h3><p>Progress from controlled-water tests to field trials against the contractor-defined validation plan.</p></div></li></ol>
`+
source('krait/deliverables/KRAIT_modem_feasibility_report.md; krait/bom/proposal_revision/cost_detail.csv; krait/deliverables/KRAIT_contractor_response.md','The current planning direction distinguishes the sub-$300 assembled-PCB electronics target from the approximately $750 average complete-modem target including acoustic hardware. Custom-transducer quotes are pending; some configurations may reach $1,500. Detailed parts and implementation files remain private.')}
];
pages.push(...proposalPages);
const root=document.querySelector('#study-pages');
root.innerHTML=pages.map((p,i)=>`<section class="result-page" data-page="${p.key}" hidden aria-label="${p.title} study results">${p.content}<nav class="page-turn" aria-label="Continue presentation"><a href="#${i?pages[i-1].key:'hardware'}">← ${i?pages[i-1].title:'Hardware'}</a><span>${i+2} / ${pages.length+1}</span><a href="#${i<pages.length-1?pages[i+1].key:'hardware'}">${i<pages.length-1?pages[i+1].title:'Back to hardware'} →</a></nav></section>`).join('');
function route(){const key=location.hash.slice(1)||'hardware';const valid=['hardware',...pages.map(p=>p.key)].includes(key)?key:'hardware';document.querySelectorAll('[data-page]').forEach(p=>p.hidden=p.dataset.page!==valid);document.querySelectorAll('.chapter-nav a').forEach(a=>{if(a.hash===`#${valid}`)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});document.title=`KRAIT — ${valid==='hardware'?'Coordination beneath the surface':pages.find(p=>p.key===valid).title}`;window.scrollTo(0,0);window.dispatchEvent(new Event('resize'));}
window.addEventListener('hashchange',route);route();


// Illustrative signal display: independent of the engineering result figures.
{
 const send=document.querySelector('#send-signal'), slider=document.querySelector('#signal-distance');
 const status=document.querySelector('#signal-status'), output=document.querySelector('#distance-value');
 const timeCanvas=document.querySelector('#time-signal'), spectrumCanvas=document.querySelector('#frequency-signal');
 let start=null, elapsed=0, delay=Number(slider.value)/1500, active=false, received=false, frame=0;
 const copper='#ae7158',green='#47765c';

 // Synthetic receiver samples, not study data. Fixed gain/noise assumptions.
 const fs=128000, fftSize=2048, rxPower=new Float64Array(fftSize/2);
 let lastSpectrum=-Infinity, lastUpdate=0;
 function spectrum(samples){
  const re=Float64Array.from(samples),im=new Float64Array(fftSize);
  let sumWindow=0;
  for(let i=0;i<fftSize;i++){const win=.5-.5*Math.cos(2*Math.PI*i/(fftSize-1));re[i]*=win;sumWindow+=win;}
  for(let i=1,j=0;i<fftSize;i++){let bit=fftSize>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j)[re[i],re[j]]=[re[j],re[i]];}
  for(let size=2;size<=fftSize;size*=2){const half=size/2;
   for(let a=0;a<fftSize;a+=size)for(let j=0;j<half;j++){
    const phase=-2*Math.PI*j/size,wr=Math.cos(phase),wi=Math.sin(phase),b=a+j+half,k=a+j;
    const tr=wr*re[b]-wi*im[b],ti=wr*im[b]+wi*re[b];
    re[b]=re[k]-tr;im[b]=im[k]-ti;re[k]+=tr;im[k]+=ti;
   }
  }
  return Float64Array.from({length:fftSize/2},(_,i)=>4*(re[i]*re[i]+im[i]*im[i])/(sumWindow*sumWindow));
 }
 function burst(t){return t>=0&&t<=.12?Math.sin(Math.PI*t/.12)**2*Math.sin(2*Math.PI*32000*t):0;}
 function gaussian(){return Math.sqrt(-2*Math.log(Math.max(1e-12,Math.random())))*Math.cos(2*Math.PI*Math.random());}
 const txPower=spectrum(Float64Array.from({length:fftSize},(_,i)=>burst(.052+i/fs)));
 function updateSpectrum(now){
  if(now-lastSpectrum<1/30)return;
  const dt=Number.isFinite(lastSpectrum)?now-lastSpectrum:1/30;lastSpectrum=now;
  // Trailing sample window ensures no received energy before propagation delay.
  const samples=Float64Array.from({length:fftSize},(_,i)=>.42*burst(elapsed-delay-(fftSize-1-i)/fs)+.035*gaussian());
  const power=spectrum(samples),weight=1-Math.exp(-dt/.10);
  for(let i=0;i<rxPower.length;i++)rxPower[i]+=weight*(power[i]-rxPower[i]);
 }
 function spectrumY(power,u){const bin=Math.round((24000+u*16000)*fftSize/fs);const db=10*Math.log10(Math.max(1e-8,power[bin]));return 135-Math.max(0,Math.min(70,db+70))/70*120;}
 function chart(canvas,xLabel){
  const w=canvas.clientWidth||300,h=170,dpr=Math.min(devicePixelRatio,2);
  canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext('2d');c.scale(dpr,dpr);
  c.font='10px Arial';c.strokeStyle='#d7d9d1';c.fillStyle='#707770';
  for(let i=0;i<5;i++){let x=32+(w-46)*i/4;c.beginPath();c.moveTo(x,10);c.lineTo(x,140);c.stroke();}
  c.fillText(xLabel,32,166);return {c,w,h};
 }
 function line(c,fn,w,color){c.strokeStyle=color;c.lineWidth=1.6;c.beginPath();for(let i=0;i<=w-46;i++){const y=fn(i/(w-46));if(i===0)c.moveTo(32+i,y);else c.lineTo(32+i,y);}c.stroke();}
 function envelope(t){return t>=0&&t<=.12?Math.sin(Math.PI*t/.12)**2*Math.sin(t/.12*Math.PI*16):0;}
 function draw(){
  const span=delay+.4;let {c,w}=chart(timeCanvas,'Time (s)');
  c.fillText('TX',5,45);c.fillText('RX',5,110);
  for(let i=0;i<5;i++)c.fillText((span*i/4).toFixed(2),26+(w-46)*i/4,151);
  line(c,u=>45-(start!==null&&u*span<=elapsed?envelope(u*span)*23:0),w,copper);
  line(c,u=>110-(received&&u*span<=elapsed?envelope(u*span-delay)*13:0),w,green);
  if(start!==null){const x=32+(w-46)*Math.min(elapsed/span,1);c.strokeStyle='#9aa398';c.beginPath();c.moveTo(x,10);c.lineTo(x,135);c.stroke();}
  ({c,w}=chart(spectrumCanvas,'Frequency (kHz) · dB re. unit sine'));
  for(let i=0;i<5;i++)c.fillText(String(24+i*4),26+(w-46)*i/4,151);
  for(const db of [-60,-30,0])c.fillText(String(db),2,138-(db+70)/70*120);
  if(start!==null)line(c,u=>spectrumY(txPower,u),w,copper);
  if(start!==null)line(c,u=>spectrumY(rxPower,u),w,green);
 }
 function highlights(){document.querySelectorAll('.model-label').forEach(el=>{
  el.classList.toggle('signal-tx',active&&el.dataset.role==='mothership'&&elapsed<.12&&el.textContent.startsWith('TX TRANSDUCER'));
  el.classList.toggle('signal-rx',active&&el.dataset.role==='follower'&&received&&elapsed<delay+.12&&el.textContent.startsWith('RX HYDROPHONE'));
 });}
 function tick(now){elapsed=(now-start)/1000;received=elapsed>=delay;
  if(active&&received)status.textContent=`Follower RX · ${delay.toFixed(2)} s propagation delay`;
  if(active&&elapsed>=delay+.4){active=false;send.disabled=false;slider.disabled=false;status.textContent=`Received · ${Number(slider.value).toLocaleString()} m / 1,500 m/s = ${delay.toFixed(2)} s`;}
  if(now-lastUpdate>=1000/30){updateSpectrum(now/1000);draw();highlights();lastUpdate=now;}if(active||received)frame=requestAnimationFrame(tick);
 }
 send.addEventListener('click',()=>{cancelAnimationFrame(frame);delay=Number(slider.value)/1500;start=performance.now();rxPower.fill(0);lastSpectrum=-Infinity;lastUpdate=0;elapsed=0;received=false;active=true;send.disabled=true;slider.disabled=true;status.textContent=`Mothership TX → follower · waiting ${delay.toFixed(2)} s`;frame=requestAnimationFrame(tick);});
 slider.addEventListener('input',()=>{cancelAnimationFrame(frame);delay=Number(slider.value)/1500;start=null;received=false;elapsed=0;output.textContent=`${Number(slider.value).toLocaleString()} m`;status.textContent=`Ready · propagation delay ${delay.toFixed(2)} s`;draw();});
 new ResizeObserver(draw).observe(timeCanvas);draw();
}
