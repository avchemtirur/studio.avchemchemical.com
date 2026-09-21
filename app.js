/* ===================== AV CHEM — SITE LOGIC (non-hero) ===================== */
'use strict';

/* ---------------------------------------------------------------------------
   GOOGLE APPS SCRIPT ENDPOINT
   Paste your deployed Google Apps Script Web App URL below before going live.
   This is NOT a secret credential (Apps Script web apps are meant to be
   called from the browser) — but it must be a real, working endpoint that
   returns JSON, or lead submission will honestly report "not sent" instead
   of pretending to have saved the enquiry. See apps-script-template.gs
   for a ready-to-deploy backend that matches this contract.
--------------------------------------------------------------------------- */
const GAS_ENDPOINT = ""; // e.g. "https://script.google.com/macros/s/XXXX/exec"

const formLoadedAt = Date.now(); // basic spam-timing guard

/* ---------- Translations ---------- */
const TR = {
  en: {
    home:"Home",products:"Products",about:"About",reviews:"Reviews",contact:"Contact",dealer:"Dealer Enquiry",applications:"Applications",
    mhome:"Home",mproducts:"Products",mabout:"About",mreviews:"Reviews",mcontact:"Contact",mdealer:"Dealer Enquiry",mapplications:"Applications",
    chemMfg:"Chemical &amp; Manufacturing",
    hp1:"Tile Adhesive",hp2:"Waterproofing",hp3:"H4 ShieldX Epoxy",madeIn:"Made in Kerala",
    scroll:"Scroll",dealerBtn:"Dealer Enquiry",
    sp1:"Product Lines",sp2:"Brand",sp3:"Manufactured In",sp4:"Dealer",sp5:"Enquiries Welcome",
    ourProdLbl:"Our Products",builtFor:"Built for Kerala's Climate",
    builtSub:"H4 construction solutions from AV CHEM, developed for practical use in Kerala.",
    bestSeller:"Featured",monsoon:"Waterproofing",
    tileDesc:"Polymer modified tile adhesive for floor &amp; wall installation. Contact us for application and curing guidance.",
    tf1:"Polymer modified formula",tf2:"Formulated for tile installation, including larger tiles",
    tf3:"Suitable for a range of tile types — contact us for guidance",tf4:"Developed for long-term construction use",
    waterDesc:"Brush-applied waterproofing solution for roof, terrace, walls and bathroom areas. Contact us for application guidance.",
    wf1:"Brush application",wf2:"Formulated for waterproofing applications",
    wf3:"Application guidance available from our team",wf4:"Developed for long-term construction use",
    epoxyDesc:"Epoxy coating solution for roof, floor, wall and tank applications. Contact us for product details and application guidance.",
    ef1:"Epoxy-based coating for waterproofing applications",ef2:"Suitable for selected coating applications — contact us for guidance",
    ef3:"Glossy finish",ef4:"Mixing and application guidance available from our team",
    enqNow:"Enquire Now",
    whyLbl:"Why Choose Us",whyTitle:"Kerala's Trusted Partner",
    w1h:"Local Manufacturing",w1p:"Made in Tirur, Malappuram — formulas developed for Kerala's climate.",
    w2h:"Product Formulation",w2p:"Product formulation developed for construction applications.",
    w3h:"Dealer Network",w3p:"Serving customers across Kerala, with dealer support available.",
    w4h:"Direct Support",w4p:"Technical support directly from our manufacturing team.",
    ourStory:"Our Story",
    storyP1:"AV CHEM Chemical &amp; Manufacturing provides construction chemical solutions for Kerala's builders, manufactured locally in Tirur, Malappuram.",
    storyP2:"Our H4 brand — ടൈൽ അഡ്ഹസീവ്, വാട്ടർപ്രൂഫിംഗ് &amp; H4 ShieldX — is developed with Kerala's construction conditions in mind.",
    mission:"Mission",missionP:"Deliver practical, reliable construction chemical solutions for customers and construction professionals.",
    vision:"Vision",visionP:"Build H4 into a trusted construction chemical brand from Kerala.",
    revLbl:"Reviews",revTitle:"Google Reviews",
    revSub:"Tirur, Malappuram, Kerala — Find us on Google Maps",
    revSub2:"See our latest customer reviews on Google.",
    leaveReview:"Leave a Google Review",
    dealerLbl:"Dealer Portal",dealerTitle:"Become an AV CHEM Dealer",
    dealerSub:"Fill the form — our team contacts you within 24 hours.",
    fName:"Name",fArea:"Area / City",fPhone:"Phone",fWa:"WhatsApp",fDist:"District",fPin:"Pincode",fProd:"Product",
    fUnit:"Unit",fQty:"Quantity",fReq:"Requirement",
    monthly:"Monthly",onetime:"One-time",quarterly:"Quarterly",
    pdfBtn:"PDF &amp; Submit",waBtn:"Send Enquiry on WhatsApp",
    dataNote:"Your enquiry is sent to our team for follow-up.",
    submit:"Submit",respond:"We respond within 2 hours.",
    contactLbl:"Get in Touch",contactTitle:"Contact AV CHEM",
    call:"Call",addr:"Address",hours:"Hours",hoursVal:"Contact us for current business hours.",
    faqTitle:"Common Questions",
    faq1q:"Where is AV CHEM and do you supply across Kerala?",
    faq1a:"We are based in Mukkilapeedika, Kannam Kulam P.O., BP Angadi, Tirur, Malappuram, Kerala. We serve customers across Kerala through our dealer network.",
    faq2q:"What is H4 ShieldX suitable for?",
    faq2a:"H4 ShieldX is an epoxy coating solution suitable for roof, floor, bathroom, water tank and tile applications. Contact us for product details and application guidance.",
    faq3q:"How to become an AV CHEM dealer?",
    faq3a:"Fill the Dealer Enquiry form or call +91 79073 44030 / WhatsApp +91 97458 38382. We respond within 24 hours.",
    faq4q:"Is H4 Tile Adhesive suitable for wet areas?",
    faq4a:"H4 Tile Adhesive is a polymer-modified formulation intended for tile installation, including bathrooms and kitchens. Contact us for application guidance for other areas.",
    faq5q:"Minimum order for dealers?",
    faq5a:"MOQ is flexible for new dealers. Contact us for pricing and payment terms for your territory.",
    fprod:"Products",fcontact:"Contact",footerMfg:"Manufacturing Unit — Malappuram, Kerala",
    footerP:"H4 Tile Adhesive, H4 Waterproofing &amp; H4 ShieldX Epoxy Flooring — from AV CHEM, Kerala.",
    viewMaps:"View Google Business Profile",
    appLbl:"Applications",appTitle:"Where H4 Is Used",appSub:"H4 construction solutions from AV CHEM, for practical construction applications.",
    appDisclaimer:"Suitable applications may vary by product and system. Contact AV CHEM for application guidance.",
    apFloor:"Floor",apFloorP:"Tile Adhesive, ShieldX",apWall:"Wall",apWallP:"Tile Adhesive, Waterproofing",
    apBath:"Bathroom",apBathP:"Waterproofing, Tile Adhesive",apKitch:"Kitchen",apKitchP:"Tile Adhesive",
    apTerr:"Terrace / Roof",apTerrP:"Waterproofing",apTank:"Water Tank",apTankP:"Waterproofing",
    apComm:"Commercial",apCommP:"ShieldX Epoxy",apInd:"Industrial",apIndP:"ShieldX Epoxy",
    mabCall:"Call",mabEnq:"Enquire",
    successMsg:"Your enquiry has been submitted successfully.",
    errorMsg:"Unable to submit right now. Please try WhatsApp or call us.",
    notConfiguredMsg:"Your PDF is ready. Please also send your enquiry on WhatsApp so our team can respond quickly.",
  },
  ml: {
    home:"ഹോം",products:"ഉൽപ്പന്നങ്ങൾ",about:"ഞങ്ങളെ കുറിച്ച്",reviews:"അവലോകനങ്ങൾ",contact:"ബന്ധപ്പെടുക",dealer:"ഡീലർ അന്വേഷണം",applications:"പ്രയോഗങ്ങൾ",
    mhome:"ഹോം",mproducts:"ഉൽപ്പന്നങ്ങൾ",mabout:"ഞങ്ങളെ കുറിച്ച്",mreviews:"അവലോകനങ്ങൾ",mcontact:"ബന്ധപ്പെടുക",mdealer:"ഡീലർ അന്വേഷണം",mapplications:"പ്രയോഗങ്ങൾ",
    chemMfg:"കെമിക്കൽ &amp; മാനുഫാക്ചറിംഗ്",
    hp1:"ടൈൽ അഡ്ഹസീവ്",hp2:"വാട്ടർപ്രൂഫിംഗ്",hp3:"H4 ShieldX എപ്പോക്സി",madeIn:"കേരളത്തിൽ നിർമ്മിച്ചത്",
    scroll:"സ്ക്രോൾ",dealerBtn:"ഡീലർ അന്വേഷണം",
    sp1:"പ്രോഡക്ട് ലൈനുകൾ",sp2:"ബ്രാൻഡ്",sp3:"നിർമ്മിക്കുന്നത്",sp4:"ഡീലർ",sp5:"അന്വേഷണങ്ങൾ സ്വാഗതം",
    ourProdLbl:"ഞങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ",builtFor:"കേരളത്തിന്റെ കാലാവസ്ഥയ്ക്കായി",
    builtSub:"AV CHEM-ന്റെ H4 കൺസ്ട്രക്ഷൻ സൊല്യൂഷനുകൾ, കേരളത്തിലെ പ്രായോഗിക ഉപയോഗത്തിനായി.",
    bestSeller:"ഫീച്ചേർഡ്",monsoon:"വാട്ടർപ്രൂഫിംഗ്",
    tileDesc:"ഫ്ലോർ &amp; വാൾ ടൈൽ ഇൻസ്റ്റലേഷനുള്ള പോളിമർ മോഡിഫൈഡ് ടൈൽ അഡ്ഹസീവ്. Application, curing guidance-ന് ഞങ്ങളെ ബന്ധപ്പെടുക.",
    tf1:"പോളിമർ മോഡിഫൈഡ് ഫോർമുല",tf2:"വലിയ ടൈലുകൾ ഉൾപ്പെടെ ഇൻസ്റ്റലേഷനായി തയ്യാറാക്കിയത്",
    tf3:"വിവിധ ടൈൽ തരങ്ങൾക്ക് അനുയോജ്യം — guidance-ന് ബന്ധപ്പെടുക",tf4:"ദീർഘകാല നിർമ്മാണ ഉപയോഗത്തിനായി വികസിപ്പിച്ചത്",
    waterDesc:"മേൽക്കൂര, ടെറസ്, ബാഥ്‌റൂം എന്നിവയ്ക്കുള്ള ബ്രഷ്-ആപ്ലൈഡ് വാട്ടർപ്രൂഫിംഗ്. Application guidance-ന് ഞങ്ങളെ ബന്ധപ്പെടുക.",
    wf1:"ബ്രഷ് ആപ്ലിക്കേഷൻ",wf2:"വാട്ടർപ്രൂഫിംഗ് ആപ്ലിക്കേഷനുകൾക്കായി ഫോർമുലേറ്റ് ചെയ്തത്",
    wf3:"ഞങ്ങളുടെ ടീമിൽ നിന്ന് application guidance ലഭ്യമാണ്",wf4:"ദീർഘകാല നിർമ്മാണ ഉപയോഗത്തിനായി വികസിപ്പിച്ചത്",
    epoxyDesc:"മേൽക്കൂര, ഫ്ലോർ, വാൾ, ടാങ്ക് എന്നിവയ്ക്കുള്ള എപ്പോക്സി കോട്ടിംഗ്. വിശദാംശങ്ങൾക്ക് ഞങ്ങളെ ബന്ധപ്പെടുക.",
    ef1:"വാട്ടർപ്രൂഫിംഗ് ആപ്ലിക്കേഷനുകൾക്കുള്ള എപ്പോക്സി അധിഷ്ഠിത കോട്ടിംഗ്",ef2:"തിരഞ്ഞെടുത്ത കോട്ടിംഗ് ആപ്ലിക്കേഷനുകൾക്ക് അനുയോജ്യം — ബന്ധപ്പെടുക",
    ef3:"ഗ്ലോസി ഫിനിഷ്",ef4:"മിക്സിംഗ്, ആപ്ലിക്കേഷൻ guidance ഞങ്ങളുടെ ടീമിൽ നിന്ന് ലഭ്യമാണ്",
    enqNow:"ഇപ്പോൾ അന്വേഷിക്കുക",
    whyLbl:"ഞങ്ങളെ തിരഞ്ഞെടുക്കേണ്ടത് എന്തുകൊണ്ട്",whyTitle:"കേരളത്തിന്റെ വിശ്വസ്ത പങ്കാളി",
    w1h:"ലോക്കൽ മാനുഫാക്ചറിംഗ്",w1p:"തിരൂർ, മലപ്പുറം — Kerala-ക്കനുസൃതം ഫോർമുലകൾ.",
    w2h:"പ്രോഡക്ട് ഫോർമുലേഷൻ",w2p:"നിർമ്മാണ ആവശ്യങ്ങൾക്കായി വികസിപ്പിച്ച ഫോർമുലേഷൻ.",
    w3h:"ഡീലർ നെറ്റ്‌വർക്ക്",w3p:"കേരളത്തിലുടനീളം ഉപഭോക്താക്കൾക്ക് സേവനം, ഡീലർ സപ്പോർട്ട് ലഭ്യമാണ്.",
    w4h:"നേരിട്ടുള്ള സഹായം",w4p:"ഉൽപ്പാദന ടീമിൽ നിന്ന് നേരിട്ട് technical സഹായം.",
    ourStory:"ഞങ്ങളുടെ കഥ",
    storyP1:"AV CHEM Chemical & Manufacturing — തിരൂർ, മലപ്പുറത്ത് നിർമ്മിക്കുന്ന, കേരളത്തിലെ ബിൽഡർമാർക്കായുള്ള കൺസ്ട്രക്ഷൻ കെമിക്കൽ സൊല്യൂഷനുകൾ.",
    storyP2:"H4 ബ്രാൻഡ് — ടൈൽ അഡ്ഹസീവ്, വാട്ടർപ്രൂഫിംഗ്, H4 ShieldX — കേരളത്തിലെ നിർമ്മാണ സാഹചര്യങ്ങൾ കണക്കിലെടുത്ത് വികസിപ്പിച്ചത്.",
    mission:"ദൗത്യം",missionP:"ഉപഭോക്താക്കൾക്കും നിർമ്മാണ പ്രൊഫഷണലുകൾക്കും പ്രായോഗികവും വിശ്വസനീയവുമായ കൺസ്ട്രക്ഷൻ കെമിക്കൽ സൊല്യൂഷനുകൾ നൽകുക.",
    vision:"ദർശനം",visionP:"H4-നെ കേരളത്തിൽ നിന്നുള്ള ഒരു വിശ്വസ്ത കൺസ്ട്രക്ഷൻ കെമിക്കൽ ബ്രാൻഡ് ആക്കി മാറ്റുക.",
    revLbl:"അവലോകനങ്ങൾ",revTitle:"Google അവലോകനങ്ങൾ",
    revSub:"തിരൂർ, മലപ്പുറം — Google Maps-ൽ ഞങ്ങളെ കണ്ടെത്തുക",
    revSub2:"ഞങ്ങളുടെ ഏറ്റവും പുതിയ ഉപഭോക്തൃ അവലോകനങ്ങൾ Google-ൽ കാണുക.",
    leaveReview:"Google Review നൽകുക",
    dealerLbl:"ഡീലർ പോർട്ടൽ",dealerTitle:"AV CHEM ഡീലർ ആകുക",
    dealerSub:"ഫോം പൂരിപ്പിക്കുക — 24 മണിക്കൂറിൽ ഞങ്ങൾ ബന്ധപ്പെടും.",
    fName:"പേര്",fArea:"ഏരിയ / നഗരം",fPhone:"ഫോൺ",fWa:"WhatsApp",fDist:"ജില്ല",fPin:"പിൻകോഡ്",fProd:"ഉൽപ്പന്നം",
    fUnit:"യൂണിറ്റ്",fQty:"അളവ്",fReq:"ആവൃത്തി",
    monthly:"പ്രതിമാസം",onetime:"ഒറ്റ തവണ",quarterly:"ത്രൈമാസ",
    pdfBtn:"PDF &amp; സബ്മിറ്റ്",waBtn:"WhatsApp-ൽ അന്വേഷണം അയയ്ക്കുക",
    dataNote:"നിങ്ങളുടെ അന്വേഷണം ഞങ്ങളുടെ ടീമിന് ഫോളോ-അപ്പിനായി അയയ്ക്കും.",
    submit:"സബ്മിറ്റ്",respond:"2 മണിക്കൂറിൽ മറുപടി.",
    contactLbl:"ബന്ധപ്പെടുക",contactTitle:"AV CHEM-മായി ബന്ധപ്പെടുക",
    call:"വിളിക്കുക",addr:"വിലാസം",hours:"സമയം",hoursVal:"നിലവിലെ പ്രവർത്തന സമയത്തിന് ഞങ്ങളെ ബന്ധപ്പെടുക.",
    faqTitle:"പൊതുവായ ചോദ്യങ്ങൾ",
    faq1q:"AV CHEM എവിടെ? Kerala മുഴുവൻ supply ഉണ്ടോ?",
    faq1a:"മുക്കിലപ്പീടിക, കണ്ണം കുളം പി.ഒ., ബി.പി അങ്ങാടി, തിരൂർ, മലപ്പുറം, Kerala. ഡീലർ നെറ്റ്‌വർക്ക് വഴി കേരളത്തിലുടനീളം സേവനം നൽകുന്നു.",
    faq2q:"H4 ShieldX Epoxy എവിടെ ഉപയോഗിക്കാം?",
    faq2a:"H4 ShieldX — മേൽക്കൂര, ഫ്ലോർ, ബാഥ്‌റൂം, ടാങ്ക്, ടൈൽ എന്നിവയ്ക്കുള്ള എപ്പോക്സി കോട്ടിംഗ്. വിശദാംശങ്ങൾക്ക് ഞങ്ങളെ ബന്ധപ്പെടുക.",
    faq3q:"ഡീലർ ആകുന്നത് എങ്ങനെ?",
    faq3a:"Dealer Enquiry form പൂരിപ്പിക്കുക അല്ലെങ്കിൽ +91 79073 44030 / WA +91 97458 38382 വിളിക്കുക.",
    faq4q:"ടൈൽ അഡ്ഹസീവ് wet areas-ൽ ഉപയോഗിക്കാമോ?",
    faq4a:"H4 ടൈൽ അഡ്ഹസീവ് polymer-modified ഫോർമുലേഷൻ ആണ്, ബാഥ്‌റൂം, അടുക്കള ഉൾപ്പെടെ ടൈൽ ഇൻസ്റ്റലേഷനായി. മറ്റ് ഇടങ്ങൾക്ക് ഞങ്ങളെ ബന്ധപ്പെടുക.",
    faq5q:"ഡീലർ minimum order?",
    faq5a:"New dealers-ക്ക് MOQ flexible. Pricing, payment terms-നായി നേരിട്ട് ബന്ധപ്പെടുക.",
    fprod:"ഉൽപ്പന്നങ്ങൾ",fcontact:"ബന്ധപ്പെടുക",footerMfg:"നിർമ്മാണ യൂണിറ്റ് — മലപ്പുറം, Kerala",
    footerP:"H4 ടൈൽ അഡ്ഹസീവ്, H4 വാട്ടർപ്രൂഫിംഗ്, H4 ShieldX — AV CHEM, Kerala-യിൽ നിന്ന്.",
    viewMaps:"Google Business Profile കാണുക",
    appLbl:"പ്രയോഗങ്ങൾ",appTitle:"H4 എവിടെ ഉപയോഗിക്കുന്നു",appSub:"AV CHEM-ന്റെ H4 കൺസ്ട്രക്ഷൻ സൊല്യൂഷനുകൾ, പ്രായോഗിക ആവശ്യങ്ങൾക്കായി.",
    appDisclaimer:"അനുയോജ്യമായ പ്രയോഗങ്ങൾ ഉൽപ്പന്നവും സിസ്റ്റവും അനുസരിച്ച് വ്യത്യാസപ്പെടാം. Application guidance-ന് AV CHEM-നെ ബന്ധപ്പെടുക.",
    apFloor:"ഫ്ലോർ",apFloorP:"ടൈൽ അഡ്ഹസീവ്, ShieldX",apWall:"വാൾ",apWallP:"ടൈൽ അഡ്ഹസീവ്, വാട്ടർപ്രൂഫിംഗ്",
    apBath:"ബാഥ്‌റൂം",apBathP:"വാട്ടർപ്രൂഫിംഗ്, ടൈൽ അഡ്ഹസീവ്",apKitch:"അടുക്കള",apKitchP:"ടൈൽ അഡ്ഹസീവ്",
    apTerr:"ടെറസ് / മേൽക്കൂര",apTerrP:"വാട്ടർപ്രൂഫിംഗ്",apTank:"വാട്ടർ ടാങ്ക്",apTankP:"വാട്ടർപ്രൂഫിംഗ്",
    apComm:"കൊമേഴ്‌സ്യൽ",apCommP:"ShieldX എപ്പോക്സി",apInd:"ഇൻഡസ്ട്രിയൽ",apIndP:"ShieldX എപ്പോക്സി",
    mabCall:"വിളിക്കുക",mabEnq:"അന്വേഷണം",
    successMsg:"നിങ്ങളുടെ അന്വേഷണം വിജയകരമായി സമർപ്പിച്ചു.",
    errorMsg:"ഇപ്പോൾ സമർപ്പിക്കാൻ കഴിയുന്നില്ല. ദയവായി WhatsApp അല്ലെങ്കിൽ വിളിക്കുക.",
    notConfiguredMsg:"നിങ്ങളുടെ PDF തയ്യാറാണ്. ദയവായി WhatsApp-ൽ കൂടി അന്വേഷണം അയയ്ക്കുക.",
  }
};
let lang = localStorage.getItem('avL') || 'en';

function toggleLang(){ lang = lang==='en'?'ml':'en'; localStorage.setItem('avL',lang); applyLang(); }
function applyLang(){
  const t=TR[lang], isML=lang==='ml';
  const hr=document.getElementById('hr'); if(hr) hr.setAttribute('lang', isML?'ml':'en');
  const lf=document.getElementById('lf'); if(lf) lf.textContent=isML?'🇬🇧':'🇮🇳';
  const lt=document.getElementById('lt'); if(lt) lt.textContent=isML?'English':'മലയാളം';
  document.querySelectorAll('[data-k]').forEach(el=>{
    const k=el.getAttribute('data-k'); if(!t[k]) return;
    if(el.tagName==='INPUT'||el.tagName==='SELECT') return;
    el.innerHTML=t[k];
  });
  document.querySelectorAll('[data-kq]').forEach(el=>{
    const k=el.getAttribute('data-kq'); if(!t[k]) return;
    if(el.classList.contains('fqq')){ const ic=el.querySelector('.ic'); el.textContent=t[k]; if(ic) el.appendChild(ic); }
    else el.textContent=t[k];
  });
}
document.addEventListener('DOMContentLoaded', applyLang);

/* ---------- Navbar / mobile menu ---------- */
window.addEventListener('scroll', ()=>{ const n=document.getElementById('nav'); if(n) n.classList.toggle('sc', scrollY>40); }, {passive:true});
function tmob(){
  const m=document.getElementById('mm'); const btn=document.querySelector('.ham');
  const open = m.classList.toggle('open');
  if(btn) btn.setAttribute('aria-expanded', open?'true':'false');
}
function cmob(){
  document.getElementById('mm').classList.remove('open');
  const btn=document.querySelector('.ham'); if(btn) btn.setAttribute('aria-expanded','false');
}
document.addEventListener('click', e=>{
  const m=document.getElementById('mm');
  if(m && m.classList.contains('open') && !m.contains(e.target) && !e.target.closest('.ham')) cmob();
});

/* ---------- Scroll reveal (single wipe per section) + counters ---------- */
const revealIO = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('wiped'); revealIO.unobserve(e.target); } });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>revealIO.observe(el));

const statsIO = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.querySelectorAll('[data-cnt]').forEach(animCount); statsIO.unobserve(e.target); } });
},{threshold:0.5});
const statsEl = document.getElementById('stats'); if(statsEl) statsIO.observe(statsEl);
function animCount(el){
  const target=parseInt(el.dataset.cnt,10), suf=el.dataset.sf||'';
  let v=0; const step=target/(1200/16);
  const t=setInterval(()=>{ v+=step; if(v>=target){ el.textContent=target+suf; clearInterval(t);} else el.textContent=Math.floor(v)+suf; },16);
}

/* ---------- Smooth scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const tgt=document.querySelector(a.getAttribute('href'));
    if(tgt){ e.preventDefault(); window.scrollTo({top:tgt.getBoundingClientRect().top+scrollY-66,behavior:'smooth'}); }
  });
});

/* ---------- FAQ ---------- */
function tfaq(btn){
  const item=btn.parentElement, was=item.classList.contains('open');
  document.querySelectorAll('.fqi').forEach(i=>i.classList.remove('open'));
  if(!was) item.classList.add('open');
  const t=TR[lang], kq=btn.getAttribute('data-kq');
  if(kq && t[kq]){ const ic=btn.querySelector('.ic'); btn.textContent=t[kq]; if(ic) btn.appendChild(ic); }
}

/* ---------- Enquiry modal (also a lead — goes to Google Sheets like the dealer form) ---------- */
let curProd='';
function openEnq(p){
  curProd=p;
  document.getElementById('mt').textContent=(lang==='ml'?'അന്വേഷണം':'Enquiry')+' — '+p;
  document.getElementById('em').classList.add('open'); document.body.style.overflow='hidden';
  document.getElementById('mN').focus();
}
function cm(){ document.getElementById('em').classList.remove('open'); document.body.style.overflow=''; }
document.addEventListener('DOMContentLoaded', ()=>{
  const em=document.getElementById('em');
  if(em) em.addEventListener('click', e=>{ if(e.target===em) cm(); });
});
document.addEventListener('keydown', e=>{
  if(e.key!=='Escape') return;
  const em=document.getElementById('em');
  if(em && em.classList.contains('open')) cm();
});
async function subMod(){
  const n=document.getElementById('mN').value.trim(), p=document.getElementById('mPh').value.trim(), a=document.getElementById('mAr').value.trim();
  if(!n||!p||!a){ toast('⚠️ '+(lang==='ml'?'എല്ലാ ഫീൽഡുകളും':'Fill all fields')); return; }
  const lead = buildLead({
    name:n, area:a, phone:p, wa:'', district:'', pin:'',
    product:curProd, unit:'', qty:'', req:''
  }, 'product_enquiry_modal');
  await saveSheet(lead); // best-effort; UI honesty is handled inside saveSheet/toast below
  modWA();
}
function modWA(){
  const n=document.getElementById('mN').value.trim()||'Customer', a=document.getElementById('mAr').value.trim()||'Kerala';
  const msg=`Hello AV CHEM!\n\nProduct: ${curProd}\nName: ${n}\nArea: ${a}\n\nPlease share product details.`;
  window.open(`https://wa.me/919745838382?text=${encodeURIComponent(msg)}`,'_blank');
  cm();
}

/* ---------- Dealer form ---------- */
const vPh = v => /^(\+91|91)?[6-9]\d{9}$/.test(v.replace(/\s/g,''));
const vPi = v => /^\d{6}$/.test(v.trim());
function getF(){
  return {
    name:document.getElementById('fN').value.trim(),
    area:document.getElementById('fA').value.trim(),
    phone:document.getElementById('fP').value.trim(),
    wa:document.getElementById('fW').value.trim(),
    district:document.getElementById('fD').value,
    pin:document.getElementById('fPi').value.trim(),
    product:document.getElementById('fPr').value,
    unit:document.getElementById('fU').value,
    qty:document.getElementById('fQ').value.trim()||'—',
    req:document.getElementById('fR').value,
  };
}
function valF(d){
  const m=lang==='ml';
  if(!d.name){ toast('⚠️ '+(m?'പേര് നൽകുക':'Enter name')); return false; }
  if(!vPh(d.phone)){ toast('⚠️ '+(m?'ഫോൺ നമ്പർ ശരിയല്ല':'Invalid phone')); return false; }
  if(!vPh(d.wa)){ toast('⚠️ '+(m?'WhatsApp നമ്പർ ശരിയല്ല':'Invalid WhatsApp')); return false; }
  if(!d.area){ toast('⚠️ '+(m?'ഏരിയ നൽകുക':'Enter area')); return false; }
  if(!d.district){ toast('⚠️ '+(m?'ജില്ല തിരഞ്ഞെടുക്കുക':'Select district')); return false; }
  if(!vPi(d.pin)){ toast('⚠️ '+(m?'Pincode ശരിയല്ല':'Invalid pincode')); return false; }
  if(!d.product){ toast('⚠️ '+(m?'ഉൽപ്പന്നം':'Select product')); return false; }
  return true;
}

/* Build the full lead payload (internal fields the customer never sees) */
function buildLead(d, source){
  return {
    ...d,
    lead_id: 'H4-' + Date.now().toString(36).toUpperCase(),
    created_at: new Date().toISOString(),
    language: lang,
    source: source,
    page: location.pathname || '/',
    status: 'New',
    follow_up_date: '',
    notes: '',
    // honeypot + timing, read by the backend to flag/ignore spam — never shown to the user
    hp_field: (document.getElementById('hp_field')||{}).value || '',
    elapsed_ms: Date.now() - formLoadedAt
  };
}

/* Reliable Google Sheets submission:
   - Skips silently (no false "saved" claim) if GAS_ENDPOINT is not configured.
   - Uses text/plain to avoid a CORS preflight that Apps Script doesn't handle,
     then Apps Script parses JSON.parse(e.postData.contents) on its side.
   - Reads and trusts ONLY a real JSON {success:true/false,...} response. */
async function saveSheet(lead){
  if(!GAS_ENDPOINT) return {success:false, reason:'not_configured'};
  // obvious bot: honeypot filled, or submitted implausibly fast
  if(lead.hp_field || lead.elapsed_ms < 1500) return {success:false, reason:'spam_guard'};
  try{
    const res = await fetch(GAS_ENDPOINT, {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(lead)
    });
    if(!res.ok) return {success:false, reason:'http_'+res.status};
    const json = await res.json();
    return json && typeof json.success === 'boolean' ? json : {success:false, reason:'bad_response'};
  }catch(e){
    console.error('Google Sheets submission failed:', e);
    return {success:false, reason:'network'};
  }
}

function genPDF(d){
  if(!window.jspdf) throw new Error('jsPDF not loaded');
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({format:'a5',unit:'mm',orientation:'portrait'});
  const W=148,H=210,now=new Date();
  const ds=now.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  const ts=now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  doc.setFillColor(20,24,27); doc.rect(0,0,W,33,'F');
  doc.setFillColor(217,84,10); doc.rect(0,33,W,2,'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(16);
  doc.text('AV CHEM', W/2, 12, {align:'center'});
  doc.setFontSize(7.5); doc.setTextColor(240,169,59); doc.setFont('helvetica','normal');
  doc.text('CHEMICAL & MANUFACTURING', W/2, 18.5, {align:'center'});
  doc.setTextColor(200,205,210); doc.setFontSize(6.5);
  doc.text('Mukkilapeedika, Kannam Kulam P.O., BP Angadi, Tirur, Malappuram, Kerala', W/2, 24, {align:'center'});
  doc.text('+91 79073 44030  |  WA: +91 97458 38382  |  avchemtirur@gmail.com', W/2, 29.5, {align:'center'});
  doc.setTextColor(20,24,27); doc.setFont('helvetica','bold'); doc.setFontSize(11);
  doc.text('AV CHEM — DEALER ENQUIRY', W/2, 43, {align:'center'});
  doc.setTextColor(91,102,109); doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
  doc.text(`Date: ${ds}   Time: ${ts}`, W/2, 50, {align:'center'});
  doc.setDrawColor(217,84,10); doc.setLineWidth(.5); doc.line(12,54,W-12,54);
  const rows=[['Name',d.name],['Phone',d.phone],['WhatsApp',d.wa],['Area',d.area],['District',d.district],['Pincode',d.pin]];
  let y=62;
  rows.forEach(([l,v])=>{
    doc.setFillColor(240,241,238); doc.rect(10,y-4,52,7,'F');
    doc.setFont('helvetica','bold'); doc.setTextColor(20,24,27); doc.setFontSize(8.5); doc.text(l,13,y);
    doc.setFont('helvetica','normal'); doc.setTextColor(30,37,41); doc.text(v||'—',65,y); y+=11;
  });
  doc.setDrawColor(217,84,10); doc.line(12,y,W-12,y); y+=7;
  doc.setFont('helvetica','bold'); doc.setTextColor(20,24,27); doc.setFontSize(9); doc.text('PRODUCT DETAILS',12,y); y+=8;
  [['Product',d.product],['Unit',d.unit],['Quantity',d.qty],['Requirement',d.req]].forEach(([l,v])=>{
    doc.setFillColor(255,246,232); doc.rect(10,y-4,52,7,'F');
    doc.setFont('helvetica','bold'); doc.setTextColor(180,110,10); doc.setFontSize(8.5); doc.text(l,13,y);
    doc.setFont('helvetica','normal'); doc.setTextColor(30,37,41); doc.text(v||'—',65,y); y+=11;
  });
  doc.setFillColor(20,24,27); doc.rect(0,H-19,W,19,'F');
  doc.setFillColor(217,84,10); doc.rect(0,H-21,W,2,'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(8);
  doc.text('This is your enquiry copy. Our team will follow up after reviewing it.',W/2,H-12,{align:'center'});
  doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(240,169,59);
  doc.text('avchemtirur@gmail.com  |  wa.me/919745838382',W/2,H-7,{align:'center'});
  doc.save(`AVCHEM_Enquiry_${d.name.replace(/\s+/g,'_')}_${now.toLocaleDateString('en-IN').replace(/\//g,'-')}.pdf`);
}
async function waitForJsPDF(maxWaitMs){
  const start=Date.now();
  while(!window.jspdf){ if(Date.now()-start>maxWaitMs) return false; await new Promise(r=>setTimeout(r,150)); }
  return true;
}
async function subForm(){
  const d=getF(); if(!valF(d)) return;
  const lead = buildLead(d, 'dealer_form');
  const btn=document.querySelector('#dealer .bsb');
  const orig=btn.innerHTML; btn.textContent='...'; btn.disabled=true;

  const result = await saveSheet(lead);
  const ss=document.getElementById('ss');
  if(!GAS_ENDPOINT){
    ss.className='sst ok';
    ss.textContent = TR[lang].notConfiguredMsg;
  } else if(result.success){
    ss.className='sst ok';
    ss.textContent = TR[lang].successMsg;
  } else {
    ss.className='sst er';
    ss.textContent = TR[lang].errorMsg;
  }
  btn.innerHTML=orig; btn.disabled=false;

  const pdfReady=await waitForJsPDF(6000);
  if(pdfReady){
    try{ genPDF(d); toast(lang==='ml'?'✅ PDF ഡൗൺലോഡ് ആയി!':'✅ PDF downloaded!'); }
    catch(e){ console.error('PDF error:',e); toast(lang==='ml'?'⚠️ PDF പിശക്. വീണ്ടും ശ്രമിക്കുക.':'⚠️ PDF error. Please try again.'); }
  } else {
    toast(lang==='ml'?'⚠️ PDF ലോഡ് ആയില്ല.':'⚠️ PDF library failed to load. Check connection.');
  }
}
async function sendWA(){
  const d=getF(); if(!valF(d)) return;
  // treat this as a lead too, best-effort save (doesn't block opening WhatsApp)
  saveSheet(buildLead(d, 'dealer_form_whatsapp'));
  const msg=`AV CHEM Dealer Enquiry\n\nName: ${d.name}\nPhone: ${d.phone}\nWA: ${d.wa}\nArea: ${d.area}\nDistrict: ${d.district}\nPin: ${d.pin}\n\nProduct: ${d.product}\nUnit: ${d.unit}\nQty: ${d.qty}\nReq: ${d.req}\n\n_AV CHEM Website_`;
  window.open(`https://wa.me/919745838382?text=${encodeURIComponent(msg)}`,'_blank');
}
function toast(msg){ const t=document.getElementById('toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3000); }
