/* --- Universal Lifecycle & Root ID Shim --- */
(function(){
  var _origById = document.getElementById.bind(document);
  document.getElementById = function(id){
    var el = _origById(id);
    if(!el && (id === "root" || id === "app" || id === "blogger-app-widget-root")) return _origById("widget-matchmaking-kundali");
    return el;
  };
  var _origDocAdd = document.addEventListener.bind(document);
  document.addEventListener = function(type, fn, opts){
    if(type === "DOMContentLoaded" && document.readyState !== "loading"){ setTimeout(fn, 15); return; }
    return _origDocAdd(type, fn, opts);
  };
  var _origWinAdd = window.addEventListener.bind(window);
  window.addEventListener = function(type, fn, opts){
    if(type === "load" && document.readyState === "complete"){ setTimeout(fn, 20); return; }
    return _origWinAdd(type, fn, opts);
  };
})();

/* --- Engine Script 1 --- */
(function(){

const langUrlMap = {
    'english': 'en', 'hindi': 'hi', 'odia': 'or', 'bengali': 'bn',
    'marathi': 'mr', 'gujarati': 'gu', 'punjabi': 'pa', 'tamil': 'ta',
    'telugu': 'te', 'kannada': 'kn', 'malayalam': 'ml', 'assamese': 'as'
};
const urlLangMap = Object.fromEntries(Object.entries(langUrlMap).map(([k, v]) => [v, k]));

const _urlParams = new URLSearchParams(window.location.search);
let _urlLangParam = _urlParams.get('lang');
let _urlLang = _urlLangParam ? langUrlMap[_urlLangParam.toLowerCase()] : null;

let currentLang = _urlLang || localStorage.getItem('vaidik_lang') || localStorage.getItem('appLang') || 'en';
if (_urlLang) localStorage.setItem('appLang', currentLang);

const PARAGRAPH_BASE_URL = "https://raw.githubusercontent.com/santosh276/panchang-data/main/";
let localizedParagraphs = {}; // Cache for downloaded JSON files

async function fetchLocalizedParagraphs(langCode) {
    // Now fetching for ALL languages, including English ('en') from the CDN.

    try {
        // Cache-busting ଲଗାଯାଇଛି ଯାହାଦ୍ୱାରା ସବୁବେଳେ ନୂଆ JSON ଲୋଡ୍ ହେବ
        const response = await fetch(`${PARAGRAPH_BASE_URL}${langCode}.json?v=${new Date().getTime()}`);
        if (response.ok) {
            localizedParagraphs[langCode] = await response.json();
            console.log(`Successfully fetched paragraphs for ${langCode}`);
        } else {
            console.warn(`No paragraph data found for ${langCode} on CDN.`);
        }
    } catch (error) {
        console.error(`Failed to fetch paragraphs for ${langCode}:`, error);
    }
}


const langData = {
    en: {
        nums: ["0","1","2","3","4","5","6","7","8","9"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        planets: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"],
                rashis: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        tithis: ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Amavasya"],
        paksha: ["Shukla", "Krishna"],
        lunarMonths: ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shraavan", "Bhadrapada", "Ashwin", "Kartik", "Margashirsha", "Pausha", "Magha", "Phalguna"],
        varna: ["Brahmin", "Kshatriya", "Vaishya", "Shudra"],
        vashya: ["Chatuspad", "Manav", "Jalchar", "Vanchar", "Keetak"],
        yoni: ["Ashwa", "Gaja", "Aja", "Sarpa", "Shwan", "Marjar", "Mesh", "Mushak", "Gau", "Mahish", "Vyaghra", "Mrig", "Vanar", "Nakul", "Simha"],
        gana: ["Dev", "Deva", "Manushya", "Rakshasa"],
        nadi: ["Aadi", "Madhya", "Antya"],
        paya: ["Gold", "Silver", "Copper", "Iron"],
        tatva: ["Fire", "Earth", "Air", "Water"],
        metals: ["Copper/Gold", "Silver", "Bronze/Gold", "Gold/Copper", "Gold/Silver", "Iron/Silver", "Iron", "Gold"],
        stones: ["Red Coral", "Diamond/Opal", "Emerald", "Pearl", "Ruby", "Diamond", "Yellow Sapphire", "Blue Sapphire", "Cat's Eye"],
        samvatsaras: ["Prabhava", "Vibhava", "Shukla", "Pramoda", "Prajapati", "Angira", "Shrimukha", "Bhava", "Yuva", "Dhatri", "Ishvara", "Bahudhanya", "Pramathi", "Vikrama", "Vrushapraja", "Chitrabhanu", "Subhanu", "Tarana", "Parthiva", "Vyaya", "Sarvajit", "Sarvadhari", "Virodhi", "Vikruti", "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukha", "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakrit", "Shobhan", "Krodhi", "Vishvavasu", "Parabhava", "Plavanga", "Kilaka", "Saumya", "Sadharana", "Virodhakrit", "Paridhavi", "Pramadi", "Ananda", "Rakshasa", "Nala", "Pingala", "Kalayukta", "Siddharthi", "Raudra", "Durmati", "Dundubhi", "Rudhirodgari", "Raktaksha", "Krodhana", "Kshaya"],
        nakshatras: ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
        yogas: ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"],
        karanas: ["Bava", "Balava", "Kaulava", "Taitil", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kintughna"],
        yunja: ["Purva", "Madhya", "Antya"],
        status: ["Exalted", "Debilitated", "Own Sign", "Neutral"],
        ui: { "btn_generate": "Generate Kundali", "btn_check_compat": "Check Compatibility", "btn_north_indian": "North", "btn_south_indian": "South", "btn_east_indian": "East", "btn_west_indian": "West", "tab_birth": "Birth Details", "tab_astro": "Basic Astro", "tab_charts": "Charts", "tab_planetary": "Planetary Positions", "tab_yogas": "Yogas & Doshas", "tab_numbers": "Numerology", "btn_single": "Single Kundali", "btn_match": "Matchmaking (Milan)", "person1_head": "Person Details", "person2_head": "Female Details", "detailed_reading": "Detailed Reading", "daily_vibe": "Daily Vibe", "lbl_name": "Native's Name", "lbl_gender": "Gender", "lbl_male": "Male", "lbl_female": "Female", "lbl_dob": "Date of Birth", "lbl_tob": "Time of Birth", "lbl_city": "Birth City", "lbl_state": "Birth State", "lbl_country": "Birth Country", "lbl_advanced": "Advanced options / Custom Location ⬇", "lbl_ascendant": "Ascendant", "lbl_moon_sign": "Moon Sign", "lbl_sun_sign": "Vedic Sun Sign", "lbl_nakshatra": "Nakshatra", "tbl_planet": "Planet", "tbl_sign": "Sign (Rashi)", "tbl_degree": "Degree", "tbl_nak": "Nakshatra", "tbl_pada": "Pada", "tbl_house": "House", "tbl_status": "Status", "pan_paksha": "Paksha", "pan_tithi": "Tithi", "pan_day": "Day", "pan_karan": "Karan", "pan_yog": "Yog", "pan_sunrise": "Sunrise", "pan_sunset": "Sunset", "dash_panchang": "Panchang At Birth", "dash_avakhada": "Avakhada Chakra", "dash_ghatak": "Ghatak Chakra", "dash_lucky": "Favourable Points", "app_title": "Vedic Kundali", "lbl_print": "Print", "tab_dasha": "Dasha Periods", "tab_bhava": "Bhava Chalit", "lbl_varna": "Varna", "lbl_vashya": "Vashya", "lbl_yoni": "Yoni", "lbl_gan": "Gana", "lbl_nadi": "Nadi", "tab_num_dash": "Numerology Dashboard", "lbl_radical": "Radical Num", "lbl_destiny": "Destiny Num", "lbl_name_num": "Name Num", "lbl_zodiac": "Zodiac", "form_title": "Enter Birth Details", "form_subtitle": "Provide accurate birth information for precise Kundali calculation", "btn_hide": "Click to hide details", "btn_show": "Click to add details", "lbl_load_preset": "Load Celebrity Preset", "lbl_load_preset_opt": "⭐ Load Celebrity Preset...", "lbl_calendar": "Calendar", "opt_gregorian": "Gregorian", "opt_julian": "Julian", "lbl_advanced_down": "Advanced options / Custom Location ⬇", "lbl_advanced_up": "Advanced options / Custom Location ⬆", "sum_name": "Native Name", "sum_dob": "Date of Birth", "sum_tob": "Time of Birth", "sum_pob": "Place of Birth", "sum_lagna": "Lagna (Ascendant)", "sum_rashi": "Rashi (Moon Sign)", "lbl_ascendant": "Ascendant", "lbl_nakshatra": "Nakshatra", "lbl_sun_sign": "Vedic Sun Sign", "lbl_moon_sign": "Moon Sign", "tab_ashtakoota": "Ashtakoota Milan", "tab_dashakoota": "Dashakoota", "tab_bhakoot": "Bhakoot Insight", "tab_manglik": "Match Manglik", "tab_summary": "Matching Summary", "astro_details_title": "Basic Astrological Details", "astro_details_desc": "This section provides your basic astrological details along with panchang descriptions at the time of your birth.", "lbl_sign": "Sign", "lbl_sign_lord": "Sign Lord", "lbl_nak_lord": "Nak Lord", "lbl_charan": "Charan", "lbl_yunja": "Yunja", "lbl_paya_nak": "Paya (Nak Based)", "lbl_amanta": "Amanta", "lbl_purnimanta": "Purnimanta", "lbl_vikram": "Vikram", "lbl_shak": "Shak", "lbl_bad_day": "Day", "lbl_bad_nakshatra": "Nakshatra", "lbl_bad_yoga": "Yoga", "lbl_bad_tithi": "Tithi", "lbl_lucky_metal": "Lucky Metal", "lbl_lucky_stone": "Lucky Stone", "lbl_lucky_numbers": "Lucky Numbers", "lbl_lucky_days": "Lucky Days", "dash_panchang_reveals": "What Your Birth Panchang Reveals", "lbl_paya": "Paya", "lbl_tatva": "Tatva", "lbl_name_letter": "Name Letter" }
    },
    hi: {
        nums: ["०","१","२","३","४","५","६","७","८","९"],
        months: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
        planets: ["सूर्य", "चन्द्र", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "राहु", "केतु"],
        rashis: ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
        nakshatras: ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"],
        yogas: ["विष्कुम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगण्ड", "सुकर्मा", "धृति", "शूल", "गण्ड", "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र", "सिद्धि", "व्यतीपात", "वरीयान्", "परिघ", "शिव", "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म", "इन्द्र", "वैधृति"],
        karanas: ["बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि", "शकुनि", "चतुष्पद", "नाग", "किंस्तुघ्न"],
        status: ["उच्च", "नीच", "स्वगृही", "तटस्थ"],
        ui: { "btn_generate": "कुण्डली बनाएं", "tab_birth": "जन्म विवरण", "tab_astro": "मूल ज्योतिष", "tab_charts": "चार्ट्स", "tab_planetary": "ग्रह स्थिति", "tab_yogas": "योग और दोष", "tab_numbers": "अंक", "btn_single": "एकल कुण्डली", "btn_match": "कुण्डली मिलान", "person1_head": "व्यक्ति 1 विवरण", "person2_head": "व्यक्ति 2 विवरण", "detailed_reading": "विस्तृत फलादेश", "daily_vibe": "दैनिक राशिफल", "lbl_name": "नाम", "lbl_gender": "लिंग", "lbl_male": "पुरुष", "lbl_female": "महिला", "lbl_dob": "जन्म तिथि", "lbl_tob": "जन्म समय", "lbl_city": "जन्म स्थान", "lbl_state": "राज्य", "lbl_country": "देश", "lbl_advanced": "उन्नत विकल्प / स्थान बदलें ⬇", "lbl_ascendant": "लग्न", "lbl_moon_sign": "चंद्र राशि", "lbl_sun_sign": "सूर्य राशि", "lbl_nakshatra": "नक्षत्र", "tbl_planet": "ग्रह", "tbl_sign": "राशि", "tbl_degree": "अंश", "tbl_nak": "नक्षत्र", "tbl_pada": "पद", "tbl_house": "भाव", "tbl_status": "स्थिति", "pan_paksha": "पक्ष", "pan_tithi": "तिथि", "pan_day": "वार", "pan_karan": "करण", "pan_yog": "योग", "pan_sunrise": "सूर्योदय", "pan_sunset": "सूर्यास्त", "dash_panchang": "जन्म पंचांग", "dash_avakhada": "अवखडा चक्र", "dash_ghatak": "घातक चक्र", "dash_lucky": "शुभ बिन्दु", "app_title": "वैदिक कुण्डली", "lbl_print": "प्रिंट", "tab_dasha": "दशा काल", "tab_bhava": "भाव चलित", "lbl_varna": "वर्ण", "lbl_vashya": "वश्य", "lbl_yoni": "योनि", "lbl_gan": "गण", "lbl_nadi": "नाड़ी", "tab_num_dash": "अंक ज्योतिष डैशबोर्ड", "lbl_radical": "मूलांक", "lbl_destiny": "भाग्यांक", "lbl_name_num": "नामांक", "lbl_zodiac": "राशि", "form_title": "जन्म विवरण दर्ज करें", "form_subtitle": "सटीक कुंडली गणना के लिए सही जन्म जानकारी प्रदान करें", "btn_hide": "विवरण छिपाने के लिए क्लिक करें", "btn_show": "विवरण जोड़ने के लिए क्लिक करें", "lbl_load_preset": "सेलिब्रिटी प्रीसेट लोड करें", "lbl_load_preset_opt": "⭐ सेलिब्रिटी प्रीसेट लोड करें...", "lbl_calendar": "कैलेंडर", "opt_gregorian": "ग्रेगोरियन", "opt_julian": "जूलियन", "lbl_advanced_down": "उन्नत विकल्प / कस्टम स्थान ⬇", "lbl_advanced_up": "उन्नत विकल्प / कस्टम स्थान ⬆", "sum_name": "जातक का नाम", "sum_dob": "जन्म तिथि", "sum_tob": "जन्म समय", "sum_pob": "जन्म स्थान", "sum_lagna": "लग्न", "sum_rashi": "चंद्र राशि", "lbl_ascendant": "लग्न", "lbl_nakshatra": "नक्षत्र", "lbl_sun_sign": "सूर्य राशि", "lbl_moon_sign": "चंद्र राशि", "tab_ashtakoota": "अष्टकूट मिलान", "tab_dashakoota": "दशकूट", "tab_bhakoot": "भकूट विचार", "tab_manglik": "मांगलिक मिलान", "tab_summary": "मिलान सारांश" }
    },
    or: {
        nums: ["୦","୧","୨","୩","୪","୫","୬","୭","୮","୯"],
        months: ["ଜାନୁଆରୀ", "ଫେବୃଆରୀ", "ମାର୍ଚ୍ଚ", "ଏପ୍ରିଲ୍", "ମଇ", "ଜୁନ୍", "ଜୁଲାଇ", "ଅଗଷ୍ଟ", "ସେପ୍ଟେମ୍ବର", "ଅକ୍ଟୋବର", "ନଭେମ୍ବର", "ଡିସେମ୍ବର"],
        planets: ["ସୂର୍ଯ୍ୟ", "ଚନ୍ଦ୍ର", "ମଙ୍ଗଳ", "ବୁଧ", "ଗୁରୁ", "ଶୁକ୍ର", "ଶନି", "ରାହୁ", "କେତୁ"],
                rashis: ["ମେଷ", "ବୃଷ", "ମିଥୁନ", "କର୍କଟ", "ସିଂହ", "କନ୍ୟା", "ତୁଳା", "ବିଛା", "ଧନୁ", "ମକର", "କୁମ୍ଭ", "ମୀନ"],
        days: ["ରବିବାର", "ସୋମବାର", "ମଙ୍ଗଳବାର", "ବୁଧବାର", "ଗୁରୁବାର", "ଶୁକ୍ରବାର", "ଶନିବାର"],
        tithis: ["ପ୍ରତିପଦା", "ଦ୍ୱିତୀୟା", "ତୃତୀୟା", "ଚତୁର୍ଥୀ", "ପଞ୍ଚମୀ", "ଷଷ୍ଠୀ", "ସପ୍ତମୀ", "ଅଷ୍ଟମୀ", "ନବମୀ", "ଦଶମୀ", "ଏକାଦଶୀ", "ଦ୍ୱାଦଶୀ", "ତ୍ରୟୋଦଶୀ", "ଚତୁର୍ଦ୍ଦଶୀ", "ପୂର୍ଣ୍ଣିମା", "ଅମାବାସ୍ୟା"],
        paksha: ["ଶୁକ୍ଳ", "କୃଷ୍ଣ"],
        lunarMonths: ["ଚୈତ୍ର", "ବୈଶାଖ", "ଜ୍ୟେଷ୍ଠ", "ଆଷାଢ଼", "ଶ୍ରାବଣ", "ଭାଦ୍ରବ", "ଆଶ୍ୱିନ", "କାର୍ତ୍ତିକ", "ମାର୍ଗଶିର", "ପୌଷ", "ମାଘ", "ଫାଲ୍ଗୁନ"],
        varna: ["ବ୍ରାହ୍ମଣ", "କ୍ଷତ୍ରିୟ", "ବୈଶ୍ୟ", "ଶୂଦ୍ର"],
        vashya: ["ଚତୁଷ୍ପଦ", "ମାନବ", "ଜଳଚର", "ବନଚର", "କୀଟକ"],
        yoni: ["ଅଶ୍ୱ", "ଗଜ", "ଅଜ", "ସର୍ପ", "ଶ୍ୱାନ", "ମାର୍ଜାର", "ମେଷ", "ମୂଷକ", "ଗୋ", "ମହିଷ", "ବ୍ୟାଘ୍ର", "ମୃଗ", "ବାନର", "ନକୁଳ", "ସିଂହ"],
        gana: ["ଦେବ", "ଦେବ", "ମନୁଷ୍ୟ", "ରାକ୍ଷସ"],
        nadi: ["ଆଦି", "ମଧ୍ୟ", "ଅନ୍ତ୍ୟ"],
        paya: ["ସୁବର୍ଣ୍ଣ (ସୁନା)", "ରୌପ୍ୟ (ରୁପା)", "ତାମ୍ର (ତମ୍ବା)", "ଲୌହ (ଲୁହା)"],
        tatva: ["ଅଗ୍ନି", "ପୃଥିବୀ", "ବାୟୁ", "ଜଳ"],
        metals: ["ତାମ୍ର/ସୁବର୍ଣ୍ଣ", "ରୌପ୍ୟ", "କାଂସ୍ୟ/ସୁବର୍ଣ୍ଣ", "ସୁବର୍ଣ୍ଣ/ତାମ୍ର", "ସୁବର୍ଣ୍ଣ/ରୌପ୍ୟ", "ଲୌହ/ରୌପ୍ୟ", "ଲୌହ", "ସୁବର୍ଣ୍ଣ"],
        stones: ["ପ୍ରବାଳ (Red Coral)", "ହୀରା/ଓପାଲ୍", "ପାନ୍ନା (Emerald)", "ମୁକ୍ତା (Pearl)", "ମାଣିକ୍ୟ (Ruby)", "ହୀରା (Diamond)", "ପୁଖରାଜ (Yellow Sapphire)", "ନୀଳା (Blue Sapphire)", "ଲହସୁନିଆ (Cat's Eye)"],
        samvatsaras: ["ପ୍ରଭବ", "ବିଭବ", "ଶୁକ୍ଳ", "ପ୍ରମୋଦ", "ପ୍ରଜାପତି", "ଅଙ୍ଗିରା", "ଶ୍ରୀମୁଖ", "ଭାବ", "ଯୁବା", "ଧାତା", "ଈଶ୍ୱର", "ବହୁଧାନ୍ୟ", "ପ୍ରମାଥୀ", "ବିକ୍ରମ", "ବୃଷପ୍ରଜା", "ଚିତ୍ରଭାନୁ", "ସୁଭାନୁ", "ତାରଣ", "ପାର୍ଥିବ", "ବ୍ୟୟ", "ସର୍ବଜିତ୍", "ସର୍ବଧାରୀ", "ବିରୋଧୀ", "ବିକୃତି", "ଖର", "ନନ୍ଦନ", "ବିଜୟ", "ଜୟ", "ମନ୍ମଥ", "ଦୁର୍ମୁଖ", "ହେବିଲମ୍ବୀ", "ବିଳମ୍ବୀ", "ବିକାରୀ", "ଶାର୍ବରୀ", "ପ୍ଳବ", "ଶୁଭକୃତ୍", "ଶୋଭନ", "କ୍ରୋଧୀ", "ବିଶ୍ୱାବସୁ", "ପରାଭବ", "ପ୍ଲବଙ୍ଗ", "କୀଳକ", "ସୌମ୍ୟ", "ସାଧାରଣ", "ବିରୋଧକୃତ୍", "ପରିଧାବୀ", "ପ୍ରମାଦୀ", "ଆନନ୍ଦ", "ରାକ୍ଷସ", "ନଳ", "ପିଙ୍ଗଳ", "କାଳଯୁକ୍ତ", "ସିଦ୍ଧାର୍ଥୀ", "ରୌଦ୍ର", "ଦୁର୍ମତି", "ଦୁନ୍ଦୁଭି", "ରୁଧିରୋଦ୍ଗାରୀ", "ରକ୍ତାକ୍ଷ", "କ୍ରୋଧନ", "କ୍ଷୟ"],
        nakshatras: ["ଅଶ୍ୱିନୀ", "ଭରଣୀ", "କୃତ୍ତିକା", "ରୋହିଣୀ", "ମୃଗଶିରା", "ଆର୍ଦ୍ରା", "ପୁନର୍ବସୁ", "ପୁଷ୍ୟା", "ଅଶ୍ଳେଷା", "ମଘା", "ପୂର୍ବା ଫାଲ୍ଗୁନୀ", "ଉତ୍ତରା ଫାଲ୍ଗୁନୀ", "ହସ୍ତା", "ଚିତ୍ରା", "ସ୍ୱାତୀ", "ବିଶାଖା", "ଅନୁରାଧା", "ଜ୍ୟେଷ୍ଠା", "ମୂଳା", "ପୂର୍ବାଷାଢ଼ା", "ଉତ୍ତରାଷାଢ଼ା", "ଶ୍ରବଣା", "ଧନିଷ୍ଠା", "ଶତଭିଷା", "ପୂର୍ବ ଭାଦ୍ରପଦ", "ଉତ୍ତର ଭାଦ୍ରପଦ", "ରେବତୀ"],
        yogas: ["ବିଷ୍କୁମ୍ଭ", "ପ୍ରୀତି", "ଆୟୁଷ୍ମାନ", "ସୌଭାଗ୍ୟ", "ଶୋଭନ", "ଅତିଗଣ୍ଡ", "ସୁକର୍ମା", "ଧୃତି", "ଶୂଳ", "ଗଣ୍ଡ", "ବୃଦ୍ଧି", "ଧ୍ରୁବ", "ବ୍ୟାଘାତ", "ହର୍ଷଣ", "ବଜ୍ର", "ସିଦ୍ଧି", "ବ୍ୟତୀପାତ", "ବରୀୟାନ", "ପରିଘ", "ଶିବ", "ସିଦ୍ଧ", "ସାଧ୍ୟ", "ଶୁଭ", "ଶୁକ୍ଳ", "ବ୍ରହ୍ମ", "ଇନ୍ଦ୍ର", "ବୈଧୃତି"],
        karanas: ["ବବ", "ବାଳବ", "କୌଳବ", "ତୈତିଳ", "ଗର", "ବଣିଜ", "ବିଷ୍ଟି", "ଶକୁନି", "ଚତୁଷ୍ପଦ", "ନାଗ", "କିଂସ୍ତୁଘ୍ନ"],
        status: ["ଉଚ୍ଚ", "ନୀଚ", "ସ୍ୱଗୃହୀ", "ତଟସ୍ଥ"],
        ui: { "btn_generate": "କୁଣ୍ଡଳୀ ପ୍ରସ୍ତୁତ କରନ୍ତୁ", "tab_birth": "ଜନ୍ମ ବିବରଣୀ", "tab_astro": "ମୂଳ ଜ୍ୟୋତିଷ", "tab_charts": "ଚାର୍ଟସ୍", "tab_planetary": "ଗ୍ରହ ସ୍ଥିତି", "tab_yogas": "ଯୋଗ ଏବଂ ଦୋଷ", "tab_numbers": "ସଂଖ୍ୟା ଗଣନା", "btn_single": "ସିଙ୍ଗଲ୍ କୁଣ୍ଡଳୀ", "btn_match": "କୁଣ୍ଡଳୀ ମିଳନ", "person1_head": "ପ୍ରଥମ ବ୍ୟକ୍ତି ବିବରଣୀ", "person2_head": "ଦ୍ୱିତୀୟ ବ୍ୟକ୍ତି ବିବରଣୀ", "detailed_reading": "ବିସ୍ତୃତ ଫଳାଦେଶ", "daily_vibe": "ଦୈନିକ ରାଶିଫଳ", "lbl_name": "ନାମ", "lbl_gender": "ଲିଙ୍ଗ", "lbl_male": "ପୁରୁଷ", "lbl_female": "ମହିଳା", "lbl_dob": "ଜନ୍ମ ତାରିଖ", "lbl_tob": "ଜନ୍ମ ସମୟ", "lbl_city": "ଜନ୍ମ ସ୍ଥାନ", "lbl_state": "ରାଜ୍ୟ", "lbl_country": "ଦେଶ", "lbl_advanced": "ଉନ୍ନତ ବିକଳ୍ପ / ସ୍ଥାନ ପରିବର୍ତ୍ତନ ⬇", "lbl_ascendant": "ଲଗ୍ନ", "lbl_moon_sign": "ଚନ୍ଦ୍ର ରାଶି", "lbl_sun_sign": "ସୂର୍ଯ୍ୟ ରାଶି", "lbl_nakshatra": "ନକ୍ଷତ୍ର", "tbl_planet": "ଗ୍ରହ", "tbl_sign": "ରାଶି", "tbl_degree": "ଅଂଶ", "tbl_nak": "ନକ୍ଷତ୍ର", "tbl_pada": "ପାଦ", "tbl_house": "ଭାବ", "tbl_status": "ସ୍ଥିତି", "pan_paksha": "ପକ୍ଷ", "pan_tithi": "ତିଥି", "pan_day": "ବାର", "pan_karan": "କରଣ", "pan_yog": "ଯୋଗ", "pan_sunrise": "ସୂର୍ଯ୍ୟୋଦୟ", "pan_sunset": "ସୂର୍ଯ୍ୟାସ୍ତ", "dash_panchang": "ଜନ୍ମ ପାଞ୍ଜି", "dash_avakhada": "ଅବଖଡା ଚକ୍ର", "dash_ghatak": "ଘାତକ ଚକ୍ର", "dash_lucky": "ଶୁଭ ବିବରଣୀ", "app_title": "ବୈଦିକ କୁଣ୍ଡଳୀ", "lbl_print": "ପ୍ରିଣ୍ଟ", "tab_dasha": "ଦଶା ସମୟ", "tab_bhava": "ଭାବ ଚଳିତ", "lbl_varna": "ବର୍ଣ୍ଣ", "lbl_vashya": "ବଶ୍ୟ", "lbl_yoni": "ଯୋନି", "lbl_gan": "ଗଣ", "lbl_nadi": "ନାଡ଼ି", "tab_num_dash": "ଅଙ୍କ ଜ୍ୟୋତିଷ", "lbl_radical": "ମୂଳାଙ୍କ", "lbl_destiny": "ଭାଗ୍ୟାଙ୍କ", "lbl_name_num": "ନାମାଙ୍କ", "lbl_zodiac": "ରାଶି", "form_title": "ଜନ୍ମ ବିବରଣୀ ପ୍ରଦାନ କରନ୍ତୁ", "form_subtitle": "ସଠିକ୍ କୁଣ୍ଡଳୀ ଗଣନା ପାଇଁ ସଠିକ୍ ଜନ୍ମ ତଥ୍ୟ ପ୍ରଦାନ କରନ୍ତୁ", "btn_hide": "ବିବରଣୀ ଲୁଚାଇବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ", "btn_show": "ବିବରଣୀ ଯୋଡିବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ", "lbl_load_preset": "ସେଲିବ୍ରିଟି ପ୍ରିସେଟ୍ ଲୋଡ୍ କରନ୍ତୁ", "lbl_load_preset_opt": "⭐ ସେଲିବ୍ରିଟି ପ୍ରିସେଟ୍ ଲୋଡ୍ କରନ୍ତୁ...", "lbl_calendar": "କ୍ୟାଲେଣ୍ଡର", "opt_gregorian": "ଗ୍ରେଗୋରିଆନ୍", "opt_julian": "ଜୁଲିଆନ୍", "lbl_advanced_down": "ଉନ୍ନତ ବିକଳ୍ପ / ସ୍ଥାନ ପରିବର୍ତ୍ତନ ⬇", "lbl_advanced_up": "ଉନ୍ନତ ବିକଳ୍ପ / ସ୍ଥାନ ପରିବର୍ତ୍ତନ ⬆", "sum_name": "ଜାତକଙ୍କ ନାମ", "sum_dob": "ଜନ୍ମ ତାରିଖ", "sum_tob": "ଜନ୍ମ ସମୟ", "sum_pob": "ଜନ୍ମ ସ୍ଥାନ", "sum_lagna": "ଲଗ୍ନ", "sum_rashi": "ଚନ୍ଦ୍ର ରାଶି", "lbl_ascendant": "ଲଗ୍ନ", "lbl_nakshatra": "ନକ୍ଷତ୍ର", "lbl_sun_sign": "ସୂର୍ଯ୍ୟ ରାଶି", "lbl_moon_sign": "ଚନ୍ଦ୍ର ରାଶି", "tab_ashtakoota": "ଅଷ୍ଟକୂଟ ମିଳନ", "tab_dashakoota": "ଦଶକୂଟ", "tab_bhakoot": "ଭକୂଟ ବିଚାର", "tab_manglik": "ମାଙ୍ଗଳିକ ମିଳନ", "tab_summary": "ମିଳନ ସାରାଂଶ" }
    },
    bn: {
        nums: ["০","১","২","৩","৪","৫","৬","৭","৮","৯"],
        months: ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"],
        planets: ["সূর্য", "চন্দ্র", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি", "রাহু", "কেতু"],
        rashis: ["মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"],
        nakshatras: ["অশ্বিনী", "ভরণী", "কৃত্তিকা", "রোহিণী", "মৃগশিরা", "আর্দ্রা", "পুনর্বসু", "পুষ্যা", "অশ্লেষা", "মঘা", "পূর্বফল্গুনী", "উত্তরফল্গুনী", "হস্তা", "চিত্রা", "স্বাতী", "বিশাখা", "অনুরাধা", "জ্যেষ্ঠা", "মূলা", "পূর্বাষাঢ়া", "উত্তরাষাঢ়া", "শ্রবণা", "ধনিষ্ঠা", "শতভিষা", "পূর্বভাদ্রপদ", "উত্তরভাদ্রপদ", "রেবতী"],
        yogas: ["বিষ্কুম্ভ", "প্রীতি", "আয়ুষ্মান", "সৌভাগ্য", "শোভন", "অতিগণ্ড", "সুকর্মা", "ধৃতি", "শূল", "গণ্ড", "বৃদ্ধি", "ধ্রুব", "ব্যাঘাত", "হর্ষণ", "বজ্র", "সিদ্ধি", "ব্যতীপাত", "বরীয়ান", "পরিঘ", "শিব", "সিদ্ধ", "সাধ্য", "শুভ", "শুক্ল", "ব্রহ্ম", "ইন্দ্র", "বৈধৃতি"],
        karanas: ["বব", "বালব", "কৌলব", "তৈতিল", "গর", "বণিজ", "বিষ্টি", "শকুনি", "চতুষ্পদ", "নাগ", "কিংস্ঘ্ন"],
        status: ["উচ্চ", "নীচ", "স্বগৃহী", "নিরপেক্ষ"],
        ui: { "btn_generate": "কুণ্ডলী তৈরি করুন", "tab_birth": "জন্ম বিবরণ", "tab_astro": "মূল জ্যোতিষ", "tab_charts": "চার্টস", "tab_planetary": "গ্রহ অবস্থান", "tab_yogas": "যোগ ও দোষ", "tab_numbers": "সংখ্যা", "btn_single": "একক কুণ্ডলী", "btn_match": "কুণ্ডলী মিলন", "person1_head": "ব্যক্তি ১ বিবরণ", "person2_head": "ব্যক্তি ২ বিবরণ", "detailed_reading": "বিস্তারিত ফালাদেশ", "daily_vibe": "দৈনিক রাশিফল", "lbl_name": "নাম", "lbl_gender": "লিঙ্গ", "lbl_male": "পুরুষ", "lbl_female": "মহিলা", "lbl_dob": "জন্ম তারিখ", "lbl_tob": "জন্ম সময়", "lbl_city": "জন্ম স্থান", "lbl_state": "রাজ্য", "lbl_country": "দেশ", "lbl_advanced": "উন্নত বিকল্প ⬇", "lbl_ascendant": "লগ্ন", "lbl_moon_sign": "চন্দ্র রাশি", "lbl_sun_sign": "সূর্য রাশি", "lbl_nakshatra": "নক্ষত্র", "tbl_planet": "গ্রহ", "tbl_sign": "রাশি", "tbl_degree": "অংশ", "tbl_nak": "নক্ষত্র", "tbl_pada": "পদ", "tbl_house": "ভাব", "tbl_status": "অবস্থা", "pan_paksha": "পক্ষ", "pan_tithi": "তিথি", "pan_day": "বার", "pan_karan": "করণ", "pan_yog": "যোগ", "pan_sunrise": "সূর্যোদয়", "pan_sunset": "সূর্যাস্ত", "dash_panchang": "জন্ম পঞ্জিকা", "dash_avakhada": "অবখাড়া চক্র", "dash_ghatak": "ঘাতক চক্র", "dash_lucky": "শুভ বিন্দু", "app_title": "বৈদিক কুণ্ডলী", "lbl_print": "প্রিন্ট", "tab_dasha": "দশা কাল", "tab_bhava": "ভাব চলিত", "lbl_varna": "বর্ণ", "lbl_vashya": "বশ্য", "lbl_yoni": "যোনি", "lbl_gan": "গণ", "lbl_nadi": "নাড়ী", "tab_num_dash": "সংখ্যাতত্ত্ব ড্যাশবোর্ড", "lbl_radical": "মূলাঙ্ক", "lbl_destiny": "ভাগ্যাঙ্ক", "lbl_name_num": "নামাঙ্ক", "lbl_zodiac": "রাশি", "form_title": "জন্ম বিবরণ লিখুন", "form_subtitle": "সঠিক কুণ্ডলী গণনার জন্য সঠিক জন্ম তথ্য প্রদান করুন", "btn_hide": "বিবরণ লুকাতে ক্লিক করুন", "btn_show": "বিবরণ যোগ করতে ক্লিক করুন", "lbl_load_preset": "সেলিব্রিটি প্রিসেট লোড করুন", "lbl_load_preset_opt": "⭐ সেলিব্রিটি প্রিসেট লোড করুন...", "lbl_calendar": "ক্যালেন্ডার", "opt_gregorian": "গ্রেগরিয়ান", "opt_julian": "জুলিয়ান", "lbl_advanced_down": "উন্নত বিকল্প / কাস্টম অবস্থান ⬇", "lbl_advanced_up": "উন্নত বিকল্প / কাস্টম অবস্থান ⬆", "sum_name": "জাতকের নাম", "sum_dob": "জন্ম তারিখ", "sum_tob": "জন্ম সময়", "sum_pob": "জন্ম স্থান", "sum_lagna": "লগ্ন", "sum_rashi": "চন্দ্র রাশি", "lbl_ascendant": "লগ্ন", "lbl_nakshatra": "নক্ষত্র", "lbl_sun_sign": "সূর্য রাশি", "lbl_moon_sign": "চন্দ্র রাশি", "tab_ashtakoota": "অষ্টকূট মিলন", "tab_dashakoota": "দশকূট", "tab_bhakoot": "ভকূট বিচার", "tab_manglik": "মাঙ্গলিক মিলন", "tab_summary": "মিলন সারাংশ" }
    },
    mr: {
        nums: ["०","१","२","३","४","५","६","७","८","९"],
        months: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
        planets: ["सूर्य", "चंद्र", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि", "राहू", "केतू"],
        rashis: ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तूळ", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
        nakshatras: ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशीर्ष", "आर्द्रा", "पुनर्वसू", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूळ", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शततारका", "पूर्वा भाद्रपदा", "उत्तरा भाद्रपदा", "रेवती"],
        yogas: ["विष्कंभ", "प्रीती", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगंड", "सुकर्मा", "धृती", "शूळ", "गंड", "वृद्धी", "ध्रुव", "व्याघात", "हर्षण", "वज्र", "सिद्धी", "व्यतीपात", "वरीयान", "परिघ", "शिव", "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म", "इंद्र", "वैधृती"],
        karanas: ["बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टी", "शकुनी", "चतुष्पाद", "नाग", "किंस्तुघ्न"],
        status: ["उच्च", "नीच", "स्वगृही", "तटस्थ"],
        ui: { "btn_generate": "कुंडली बनवा", "tab_birth": "जन्म तपशील", "tab_astro": "मूल ज्योतिष", "tab_charts": "चार्ट्स", "tab_planetary": "ग्रह स्थिती", "tab_yogas": "योग आणि दोष", "tab_numbers": "अंक", "btn_single": "एकल कुंडली", "btn_match": "कुंडली मिलान", "person1_head": "व्यक्ती १ तपशील", "person2_head": "व्यक्ती २ तपशील", "detailed_reading": "सविस्तर फलादेश", "daily_vibe": "दैनिक राशिभविष्य", "lbl_name": "नाव", "lbl_gender": "लिंग", "lbl_male": "पुरुष", "lbl_female": "महिला", "lbl_dob": "जन्म तारीख", "lbl_tob": "जन्म वेळ", "lbl_city": "जन्म शहर", "lbl_state": "राज्य", "lbl_country": "देश", "lbl_advanced": "प्रगत पर्याय ⬇", "lbl_ascendant": "लग्न", "lbl_moon_sign": "चंद्र राशी", "lbl_sun_sign": "सूर्य राशी", "lbl_nakshatra": "नक्षत्र", "tbl_planet": "ग्रह", "tbl_sign": "राशी", "tbl_degree": "अंश", "tbl_nak": "नक्षत्र", "tbl_pada": "पद", "tbl_house": "भाव", "tbl_status": "स्थिती", "pan_paksha": "पक्ष", "pan_tithi": "तिथी", "pan_day": "वार", "pan_karan": "करण", "pan_yog": "योग", "pan_sunrise": "सूर्योदय", "pan_sunset": "सूर्यास्त", "dash_panchang": "जन्म पंचांग", "dash_avakhada": "अवखडा चक्र", "dash_ghatak": "घातक चक्र", "dash_lucky": "शुभ बिंदू", "app_title": "वैदिक कुंडली", "lbl_print": "प्रिंट", "tab_dasha": "दशा काळ", "tab_bhava": "भाव चलित", "lbl_varna": "वर्ण", "lbl_vashya": "वश्य", "lbl_yoni": "योनी", "lbl_gan": "गण", "lbl_nadi": "नाडी", "tab_num_dash": "अंकशास्त्र डॅशबोर्ड", "lbl_radical": "मूलांक", "lbl_destiny": "भाग्यांक", "lbl_name_num": "नामांक", "lbl_zodiac": "राशी", "form_title": "जन्म तपशील प्रविष्ट करा", "form_subtitle": "अचूक कुंडली गणनेसाठी योग्य जन्म माहिती द्या", "btn_hide": "तपशील लपवण्यासाठी क्लिक करा", "btn_show": "तपशील जोडण्यासाठी क्लिक करा", "lbl_load_preset": "सेलिब्रिटी प्रीसेट लोड करा", "lbl_load_preset_opt": "⭐ सेलिब्रिटी प्रीसेट लोड करा...", "lbl_calendar": "कॅलेंडर", "opt_gregorian": "ग्रेगोरियन", "opt_julian": "ज्युलियन", "lbl_advanced_down": "प्रगत पर्याय / कस्टम स्थान ⬇", "lbl_advanced_up": "प्रगत पर्याय / कस्टम स्थान ⬆", "sum_name": "जातकाचे नाव", "sum_dob": "जन्म तारीख", "sum_tob": "जन्म वेळ", "sum_pob": "जन्म स्थान", "sum_lagna": "लग्न", "sum_rashi": "चंद्र राशी", "lbl_ascendant": "लग्न", "lbl_nakshatra": "नक्षत्र", "lbl_sun_sign": "सूर्य राशी", "lbl_moon_sign": "चंद्र राशी", "tab_ashtakoota": "अष्टकूट मिलान", "tab_dashakoota": "दशकूट", "tab_bhakoot": "भकूट विचार", "tab_manglik": "मांगलिक मिलान", "tab_summary": "मिलान सारांश" }
    },
    gu: {
        nums: ["૦","૧","૨","૩","૪","૫","૬","૭","૮","૯"],
        months: ["જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઓગસ્ટ", "સપ્ટેમ્બર", "ઓક્ટોબર", "નવેમ્બર", "ડિસેમ્બર"],
        planets: ["સૂર્ય", "ચંદ્ર", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ", "રાહુ", "કેતુ"],
        rashis: ["મેષ", "વૃષભ", "મિથુન", "કર્ક", "સિંહ", "કન્યા", "તુલા", "વૃશ્ચિક", "ધન", "મકર", "કુંભ", "મીન"],
        nakshatras: ["અશ્વિની", "ભરણી", "કૃત્તિકા", "રોહિણી", "મૃગશીર્ષ", "આર્દ્રા", "પુનર્વસુ", "પુષ્ય", "આશ્લેષા", "મઘા", "પૂર્વા ફાલ્ગુની", "ઉત્તરા ફાલ્ગુની", "હસ્ત", "ચિત્રા", "સ્વાતિ", "વિશાખા", "અનુરાધા", "જ્યેષ્ઠા", "મૂળ", "પૂર્વાષાઢા", "ઉત્તરાષાઢા", "શ્રવણ", "ધનિષ્ઠા", "શતભિષા", "પૂર્વા ભાદ્રપદ", "ઉત્તરા ભાદ્રપદ", "રેવતી"],
        yogas: ["વિષ્કુંભ", "પ્રીતિ", "આયુષ્માન", "સૌભાગ્ય", "શોભન", "અતિગંડ", "સુકર્મા", "ધૃતિ", "શૂળ", "ગંડ", "વૃદ્ધિ", "ધ્રુવ", "વ્યાઘાત", "હર્ષણ", "વજ્ર", "સિદ્ધિ", "વ્યતીપાત", "વરિયાન", "પરિઘ", "શિવ", "સિદ્ધ", "સાધ્ય", "શુભ", "શુક્લ", "બ્રહ્મ", "ઇન્દ્ર", "વૈધૃતિ"],
        karanas: ["બવ", "બાલવ", "કૌલવ", "તૈતિલ", "ગર", "વણિજ", "વિષ્ટિ", "શકુનિ", "ચતુષ્પદ", "નાગ", "કિંસ્તુઘ્ન"],
        status: ["ઉચ્ચ", "નીચ", "સ્વગૃહી", "તટસ્થ"],
        ui: { "btn_generate": "કુંડળી બનાવો", "tab_birth": "જન્મ વિગતો", "tab_astro": "મૂળ જ્યોતિષ", "tab_charts": "ચાર્ટ્સ", "tab_planetary": "ગ્રહ સ્થિતિ", "tab_yogas": "યોગ અને દોષ", "tab_numbers": "અંક", "btn_single": "એકલ કુંડળી", "btn_match": "કુંડળી મિલાન", "person1_head": "વ્યક્તિ 1 વિગતો", "person2_head": "વ્યક્તિ 2 વિગતો", "detailed_reading": "વિસ્તૃત ફલાદેશ", "daily_vibe": "દૈનિક રાશિફળ", "lbl_name": "નામ", "lbl_gender": "લિંગ", "lbl_male": "પુરુષ", "lbl_female": "મહિલા", "lbl_dob": "જન્મ તારીખ", "lbl_tob": "જન્મ સમય", "lbl_city": "જન્મ શહેર", "lbl_state": "રાજ્ય", "lbl_country": "દેશ", "lbl_advanced": "અદ્યતન વિકલ્પો ⬇", "lbl_ascendant": "લગ્ન", "lbl_moon_sign": "ચંદ્ર રાશિ", "lbl_sun_sign": "સૂર્ય રાશિ", "lbl_nakshatra": "નક્ષત્ર", "tbl_planet": "ગ્રહ", "tbl_sign": "રાશિ", "tbl_degree": "અંશ", "tbl_nak": "નક્ષત્ર", "tbl_pada": "પદ", "tbl_house": "ભાવ", "tbl_status": "સ્થિતિ", "pan_paksha": "પક્ષ", "pan_tithi": "તિથિ", "pan_day": "વાર", "pan_karan": "કરણ", "pan_yog": "યોગ", "pan_sunrise": "સૂર્યોદય", "pan_sunset": "સૂર્યાસ્ત", "dash_panchang": "જન્મ પંચાંગ", "dash_avakhada": "અવખડા ચક્ર", "dash_ghatak": "ઘાતક ચક્ર", "dash_lucky": "શુભ બિંદુ", "app_title": "વૈદિક કુંડળી", "lbl_print": "પ્રિન્ટ", "tab_dasha": "દશા કાળ", "tab_bhava": "ભાવ ચલિત", "lbl_varna": "વર્ણ", "lbl_vashya": "વશ્ય", "lbl_yoni": "યોનિ", "lbl_gan": "ગણ", "lbl_nadi": "નાડી", "tab_num_dash": "અંક જ્યોતિષ ડેશબોર્ડ", "lbl_radical": "મૂળાંક", "lbl_destiny": "ભાગ્યાંક", "lbl_name_num": "નામાંક", "lbl_zodiac": "રાશિ", "form_title": "જન્મ વિગતો દાખલ કરો", "form_subtitle": "ચોક્કસ કુંડળી ગણતરી માટે સાચી જન્મ માહિતી પ્રદાન કરો", "btn_hide": "વિગતો છુપાવવા માટે ક્લિક કરો", "btn_show": "વિગતો ઉમેરવા માટે ક્લિક કરો", "lbl_load_preset": "સેલિબ્રિટી પ્રિસેટ લોડ કરો", "lbl_load_preset_opt": "⭐ સેલિબ્રિટી પ્રિસેટ લોડ કરો...", "lbl_calendar": "કૅલેન્ડર", "opt_gregorian": "ગ્રેગોરિયન", "opt_julian": "જુલિયન", "lbl_advanced_down": "અદ્યતન વિકલ્પો / કસ્ટમ સ્થાન ⬇", "lbl_advanced_up": "અદ્યતન વિકલ્પો / કસ્ટમ સ્થાન ⬆", "sum_name": "જાતકનું નામ", "sum_dob": "જન્મ તારીખ", "sum_tob": "જન્મ સમય", "sum_pob": "જન્મ સ્થાન", "sum_lagna": "લગ્ન", "sum_rashi": "ચંદ્ર રાશિ", "lbl_ascendant": "લગ્ન", "lbl_nakshatra": "નક્ષત્ર", "lbl_sun_sign": "સૂર્ય રાશિ", "lbl_moon_sign": "ચંદ્ર રાશિ", "tab_ashtakoota": "અષ્ટકૂટ મિલાન", "tab_dashakoota": "દશકૂટ", "tab_bhakoot": "ભકૂટ વિચાર", "tab_manglik": "માંગલિક મિલાન", "tab_summary": "મિલાન સારાંશ" }
    },
    pa: {
        nums: ["੦","੧","੨","੩","੪","੫","੬","੭","੮","੯"],
        months: ["ਜਨਵਰੀ", "ਫਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ"],
        planets: ["ਸੂਰਜ", "ਚੰਦਰਮਾ", "ਮੰਗਲ", "ਬੁੱਧ", "ਗੁਰੂ", "ਸ਼ੁੱਕਰ", "ਸ਼ਨੀ", "ਰਾਹੂ", "ਕੇਤੂ"],
        rashis: ["ਮੇਖ", "ਵ੍ਰਿਸ਼ਭ", "ਮਿਥੁਨ", "ਕਰਕ", "ਸਿੰਘ", "ਕੰਨਿਆ", "ਤੁਲਾ", "ਵ੍ਰਿਸ਼ਚਿਕ", "ਧਨੂ", "ਮਕਰ", "ਕੁੰਭ", "ਮੀਨ"],
        nakshatras: ["ਅਸ਼ਵਨੀ", "ਭਰਣੀ", "ਕ੍ਰਿਤਿਕਾ", "ਰੋਹਿਣੀ", "ਮ੍ਰਿਗਸ਼ਿਰਾ", "ਆਰਦਰਾ", "ਪੁਨਰਵਸੁ", "ਪੁੱਖ", "ਅਸ਼ਲੇਸ਼ਾ", "ਮਘਾ", "ਪੂਰਵਾ ਫਾਲਗੁਨੀ", "ਉੱਤਰਾ ਫਾਲਗੁਨੀ", "ਹਸਤ", "ਚਿਤਰਾ", "ਸਵਾਤੀ", "ਵਿਸ਼ਾਖਾ", "ਅਨੁਰਾਧಾ", "ਜੇਸ਼ਠਾ", "ਮੂਲ", "ਪੂਰਵਾਸ਼ਾੜਾ", "ਉੱਤਰਾਸ਼ਾੜਾ", "ਸ਼ਰਵਣ", "ਧਨਿਸ਼ਠਾ", "ਸ਼ਤਭਿਸ਼ਾ", "ਪੂਰਵਾ ਭਾਦਰਪਦ", "ਉੱਤਰਾ ਭਾਦਰਪਦ", "ਰੇਵਤੀ"],
        yogas: ["ਵਿਸ਼ਕੁੰਭ", "ਪ੍ਰੀਤੀ", "ਆਯੁਸ਼ਮਾਨ", "ਸੌਭਾਗਯ", "ਸ਼ੋਭਨ", "ਅਤਿਗੰਡ", "ਸੁਕਰਮਾ", "ਧ੍ਰਿਤੀ", "ਸ਼ੂਲ", "ਗੰਡ", "ਵ੍ਰਿਧੀ", "ਧਰੁਵ", "ਵਿਆਘਾਤ", "ਹਰਸ਼ਣ", "ਵਜਰ", "ਸਿੱਧੀ", "ਵਿਅਤੀਪਾਤ", "ਵਰੀਯਾਨ", "ਪਰਿਘ", "ਸ਼ਿਵ", "ਸਿੱਧ", "ਸਾਧਯ", "ਸ਼ੁਭ", "ਸ਼ੁਕਲ", "ਬ੍ਰਹਮ", "ਇੰਦਰ", "ਵੈਧ੍ਰਿਤੀ"],
        karanas: ["ਬਵ", "ਬਾਲਵ", "ਕੌਲਵ", "ਤੈਤਿਲ", "ਗਰ", "ਵਣਿਜ", "ਵਿਸ਼ਟੀ", "ਸ਼ਕੁਨਿ", "ਚਤੁਸ਼ਪਦ", "ਨਾਗ", "ਕਿੰਸਤੁਘਨ"],
        status: ["ਉੱਚ", "ਨੀਚ", "ਸਵਗ੍ਰਹੀ", "ਨਿਰਪੱਖ"],
        ui: { "btn_generate": "ਕੁੰਡਲੀ ਬਣਾਓ", "tab_birth": "ਜਨਮ ਵੇਰਵੇ", "tab_astro": "ਮੂਲ ਜੋਤਿਸ਼", "tab_charts": "ਚਾਰਟਸ", "tab_planetary": "ਗ੍ਰਹਿ ਸਥਿਤੀ", "tab_yogas": "ਯੋਗ ਅਤੇ ਦੋਸ਼", "tab_numbers": "ਅੰਕ", "btn_single": "ਸਿੰਗਲ ਕੁੰਡਲੀ", "btn_match": "ਕੁੰਡਲੀ ਮਿਲਾਨ", "person1_head": "ਵਿਅਕਤੀ 1 ਵੇਰਵੇ", "person2_head": "ਵਿਅਕਤੀ 2 ਵੇਰਵੇ", "detailed_reading": "ਵਿਸਤ੍ਰਿਤ ਫਲਾਦੇਸ਼", "daily_vibe": "ਰੋਜ਼ਾਨਾ ਰਾਸ਼ੀਫਲ", "lbl_name": "ਨਾਮ", "lbl_gender": "ਲਿੰਗ", "lbl_male": "ਪੁਰਸ਼", "lbl_female": "ਮਹਿਲਾ", "lbl_dob": "ਜਨਮ ਮਿਤੀ", "lbl_tob": "ਜਨਮ ਦਾ ਸਮਾਂ", "lbl_city": "ਜਨਮ ਸ਼ਹਿਰ", "lbl_state": "ਰਾਜ", "lbl_country": "ਦੇਸ਼", "lbl_advanced": "ਉੱਨਤ ਵਿਕਲਪ ⬇", "lbl_ascendant": "ਲਗਨ", "lbl_moon_sign": "ਚੰਦਰ ਰਾਸ਼ੀ", "lbl_sun_sign": "ਸੂਰਜ ਰਾਸ਼ੀ", "lbl_nakshatra": "ਨਕਸ਼ਤਰ", "tbl_planet": "ਗ੍ਰਹਿ", "tbl_sign": "ਰਾਸ਼ੀ", "tbl_degree": "ਅੰਸ਼", "tbl_nak": "ਨਕਸ਼ਤਰ", "tbl_pada": "ਪਦ", "tbl_house": "ਭਾਵ", "tbl_status": "ਸਥਿਤੀ", "pan_paksha": "ਪੱਖ", "pan_tithi": "ਤਿਥੀ", "pan_day": "ਵਾਰ", "pan_karan": "ਕਰਣ", "pan_yog": "ਯੋਗ", "pan_sunrise": "ਸੂਰਜ ਉਦੈ", "pan_sunset": "ਸੂਰਜ ਅਸਤ", "dash_panchang": "ਜਨਮ ਪੰਚਾਂਗ", "dash_avakhada": "ਅਵਖੜਾ ਚੱਕਰ", "dash_ghatak": "ਘਾਤਕ ਚੱਕਰ", "dash_lucky": "ਸ਼ੁਭ ਬਿੰਦੂ", "app_title": "ਵੈਦਿਕ ਕੁੰਡਲੀ", "lbl_print": "ਪ੍ਰਿੰਟ", "tab_dasha": "ਦਸ਼ਾ ਕਾਲ", "tab_bhava": "ਭਾਵ ਚਲਿਤ", "lbl_varna": "ਵਰਣ", "lbl_vashya": "ਵਸ਼ਯ", "lbl_yoni": "ਯੋਨੀ", "lbl_gan": "ਗਣ", "lbl_nadi": "ਨਾੜੀ", "tab_num_dash": "ਅੰਕ ਜੋਤਿਸ਼", "lbl_radical": "ਮੂਲਾਂਕ", "lbl_destiny": "ਭਾਗਯਾਂਕ", "lbl_name_num": "ਨਾਮਾਂਕ", "lbl_zodiac": "ਰਾਸ਼ੀ", "form_title": "ਜਨਮ ਵੇਰਵੇ ਦਰਜ ਕਰੋ", "form_subtitle": "ਸਹੀ ਕੁੰਡਲੀ ਗਣਨਾ ਲਈ ਸਹੀ ਜਨਮ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰੋ", "btn_hide": "ਵੇਰਵੇ ਲੁਕਾਉਣ ਲਈ ਕਲਿੱਕ ਕਰੋ", "btn_show": "ਵੇਰਵੇ ਜੋੜਨ ਲਈ ਕਲਿੱਕ ਕਰੋ", "lbl_load_preset": "ਸੇਲਿਬ੍ਰਿਟੀ ਪ੍ਰੀਸੈਟ ਲੋਡ ਕਰੋ", "lbl_load_preset_opt": "⭐ ਸੇਲਿਬ੍ਰਿਟੀ ਪ੍ਰੀਸੈਟ ਲੋਡ ਕਰੋ...", "lbl_calendar": "ਕੈਲੰਡਰ", "opt_gregorian": "ਗ੍ਰੈਗੋਰੀਅਨ", "opt_julian": "ਜੂਲੀਅਨ", "lbl_advanced_down": "ਉੱਨਤ ਵਿਕਲਪ / ਕਸਟਮ ਸਥਾਨ ⬇", "lbl_advanced_up": "ਉੱਨਤ ਵਿਕਲਪ / ਕਸਟਮ ਸਥਾਨ ⬆", "sum_name": "ਜਾਤਕ ਦਾ ਨਾਮ", "sum_dob": "ਜਨਮ ਮਿਤੀ", "sum_tob": "ਜਨਮ ਦਾ ਸਮਾਂ", "sum_pob": "ਜਨਮ ਸਥਾਨ", "sum_lagna": "ਲਗਨ", "sum_rashi": "ਚੰਦਰ ਰਾਸ਼ੀ", "lbl_ascendant": "ਲਗਨ", "lbl_nakshatra": "ਨਕਸ਼ਤਰ", "lbl_sun_sign": "ਸੂਰਜ ਰਾਸ਼ੀ", "lbl_moon_sign": "ਚੰਦਰ ਰਾਸ਼ੀ", "tab_ashtakoota": "ਅਸ਼ਟਕੂਟ ਮਿਲਾਨ", "tab_dashakoota": "ਦਸ਼ਕੂਟ", "tab_bhakoot": "ਭਕੂਟ ਵਿਚਾਰ", "tab_manglik": "ਮਾਂਗਲਿਕ ਮਿਲਾਨ", "tab_summary": "ਮਿਲਾਨ ਸਾਰਾਂਸ਼" }
    },
    ta: {
        nums: ["௦","௧","௨","௩","௪","௫","௬","௭","௮","௯"],
        months: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"],
        planets: ["சூரியன்", "சந்திரன்", "செவ்வாய்", "புதன்", "குரு", "சுக்கிரன்", "சனி", "ராகு", "கேது"],
        rashis: ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"],
        nakshatras: ["அஸ்வினி", "பரணி", "கிருத்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை", "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்", "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை", "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்", "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"],
        yogas: ["விஷ்கம்பம்", "பிரீதி", "ஆயுஷ்மான்", "சௌபாக்கியம்", "சோபனம்", "அதிகண்டம்", "சுகர்மம்", "திருதி", "சூலம்", "கண்டம்", "விருத்தி", "துருவம்", "வியாகாதம்", "ஹர்ஷணம்", "வஜ்ரம்", "சித்தி", "வியதிபாதம்", "வரியான்", "பரிகம்", "சிவம்", "சித்தம்", "சாத்தியம்", "சுபம்", "சுக்கிலம்", "பிரம்மா", "இந்திரம்", "வைதிருதி"],
        karanas: ["பவம்", "பாலவம்", "கௌலவம்", "தைதிலம்", "கரம்", "வணிஜம்", "விஷ்டி", "சகுனி", "சதுஷ்பாதம்", "நாகம்", "கிம்ஸ்துக்னம்"],
        status: ["உச்சம்", "நீசம்", "ஆட்சி", "சமம்"],
        ui: { "btn_generate": "ஜாதகம் உருவாக்கு", "tab_birth": "பிறப்பு விவரங்கள்", "tab_astro": "அடிப்படை ஜோதிடம்", "tab_charts": "கட்டங்கள்", "tab_planetary": "கிரக நிலைகள்", "tab_yogas": "யோகங்கள் & தோஷங்கள்", "tab_numbers": "எண்கள்", "btn_single": "தனி ஜாதகம்", "btn_match": "ஜாதக பொருத்தம்", "person1_head": "நபர் 1 விவரங்கள்", "person2_head": "நபர் 2 விவரங்கள்", "detailed_reading": "விரிவான பலன்கள்", "daily_vibe": "இன்றைய ராசிபலன்", "lbl_name": "பெயர்", "lbl_gender": "பாலினம்", "lbl_male": "ஆண்", "lbl_female": "பெண்", "lbl_dob": "பிறந்த தேதி", "lbl_tob": "பிறந்த நேரம்", "lbl_city": "பிறந்த ஊர்", "lbl_state": "மாநிலம்", "lbl_country": "நாடு", "lbl_advanced": "மேம்பட்ட விருப்பங்கள் ⬇", "lbl_ascendant": "லக்னம்", "lbl_moon_sign": "சந்திர ராசி", "lbl_sun_sign": "சூரிய ராசி", "lbl_nakshatra": "நட்சத்திரம்", "tbl_planet": "கிரகம்", "tbl_sign": "ராசி", "tbl_degree": "பாகை", "tbl_nak": "நட்சத்திரம்", "tbl_pada": "பாதம்", "tbl_house": "பாவம்", "tbl_status": "நிலை", "pan_paksha": "பட்சம்", "pan_tithi": "திதி", "pan_day": "கிழமை", "pan_karan": "கரணம்", "pan_yog": "யோகம்", "pan_sunrise": "சூரியோதயம்", "pan_sunset": "சூரிய அஸ்தமனம்", "dash_panchang": "பிறப்பு பஞ்சாங்கம்", "dash_avakhada": "அவகடா சக்கரம்", "dash_ghatak": "காதக சக்கரம்", "dash_lucky": "அதிர்ஷ்ட குறிப்புகள்", "app_title": "வேத ஜாதகம்", "lbl_print": "அச்சிடு", "tab_dasha": "தசா காலம்", "tab_bhava": "பாவ சலித்", "lbl_varna": "வர்ணம்", "lbl_vashya": "வஷ்யம்", "lbl_yoni": "யோனி", "lbl_gan": "கணம்", "lbl_nadi": "நாடி", "tab_num_dash": "எண் கணிதம்", "lbl_radical": "மூல எண்", "lbl_destiny": "விதி எண்", "lbl_name_num": "பெயர் எண்", "lbl_zodiac": "ராசி", "form_title": "பிறப்பு விவரங்களை உள்ளிடவும்", "form_subtitle": "துல்லியமான ஜாதக கணிப்பிற்கு சரியான பிறப்பு தகவலை வழங்கவும்", "btn_hide": "விவரங்களை மறைக்க கிளிக் செய்யவும்", "btn_show": "விவரங்களை சேர்க்க கிளிக் செய்யவும்", "lbl_load_preset": "பிரபலங்களின் முன்னமைவை ஏற்றவும்", "lbl_load_preset_opt": "⭐ பிரபலங்களின் முன்னமைவை ஏற்றவும்...", "lbl_calendar": "நாள்காட்டி", "opt_gregorian": "கிரிகோரியன்", "opt_julian": "ஜூலியன்", "lbl_advanced_down": "மேம்பட்ட விருப்பங்கள் / தனிப்பயன் இடம் ⬇", "lbl_advanced_up": "மேம்பட்ட விருப்பங்கள் / தனிப்பயன் இடம் ⬆", "sum_name": "ஜாதகர் பெயர்", "sum_dob": "பிறந்த தேதி", "sum_tob": "பிறந்த நேரம்", "sum_pob": "பிறந்த இடம்", "sum_lagna": "லக்னம்", "sum_rashi": "சந்திர ராசி", "lbl_ascendant": "லக்னம்", "lbl_nakshatra": "நட்சத்திரம்", "lbl_sun_sign": "சூரிய ராசி", "lbl_moon_sign": "சந்திர ராசி", "tab_ashtakoota": "அஷ்டகூட பொருத்தம்", "tab_dashakoota": "தசகூட பொருத்தம்", "tab_bhakoot": "பகூட பொருத்தம்", "tab_manglik": "மாங்கல்ய பொருத்தம்", "tab_summary": "பொருத்தம் சுருக்கம்" }
    },
    te: {
        nums: ["౦","౧","౨","౩","౪","౫","౬","౭","౮","౯"],
        months: ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"],
        planets: ["సూర్యుడు", "చంద్రుడు", "కుజుడు", "బుధుడు", "గురువు", "శుక్రుడు", "శని", "రాహువు", "కేతువు"],
        rashis: ["మేషం", "వృషభం", "మిథునం", "కర్కాటకం", "సింహం", "కన్య", "తుల", "వృశ్చికం", "ధనుస్సు", "మకరం", "కుంభం", "మీనం"],
        nakshatras: ["అశ్విని", "భరణి", "కృత్తిక", "రోహిణి", "మృగశిర", "ఆరుద్ర", "పునర్వసు", "పుష్యమి", "ఆశ్లేష", "మఖ", "పూర్వ ఫల్గుణి", "ఉత్తర ఫల్గుణి", "హస్త", "చిత్త", "స్వాతి", "విశాఖ", "అనూరాధ", "జ్యేష్ఠ", "మూల", "పూర్వాషాఢ", "ఉత్తరాషాఢ", "శ్రవణం", "ధనిష్ఠ", "శతభిషం", "పూర్వాభాద్ర", "ఉత్తరాభాద్ర", "రేవతి"],
        yogas: ["విష్కుంభ", "ప్రీతి", "ఆయుష్మాన్", "సౌభాగ్య", "శోభన", "అతిగండ", "సుకర్మ", "ధృతి", "శూల", "గండ", "వృద్ధి", "ధ్రువ", "వ్యాఘాత", "హర్షణ", "వజ్ర", "సిద్ధి", "వ్యతీపాత", "వరీయాన్", "పరిఘ", "శివ", "సిద్ధ", "సాధ్య", "శుభ", "శుక్ల", "బ్రహ్మ", "ఇంద్ర", "వైధృతి"],
        karanas: ["బవ", "బాలవ", "కౌలవ", "తైతిల", "గర", "వణిజ", "విష్టి", "శకుని", "చతుష్పాద", "నాగ", "కింస్తుఘ్న"],
        status: ["ఉచ్చ", "నీచ", "స్వక్షేత్రం", "సమం"],
        ui: { "btn_generate": "జాతకం సృష్టించండి", "tab_birth": "పుట్టిన వివరాలు", "tab_astro": "ప్రాథమిక జ్యోతిష్యం", "tab_charts": "చార్టులు", "tab_planetary": "గ్రహ స్థితులు", "tab_yogas": "యోగాలు & దోషాలు", "tab_numbers": "సంఖ్యలు", "btn_single": "ఒకే జాతకం", "btn_match": "జాతక పొంతన", "person1_head": "వ్యక్తి 1 వివరాలు", "person2_head": "వ్యక్తి 2 వివరాలు", "detailed_reading": "వివరణాత్మక ఫలితాలు", "daily_vibe": "నేటి రాశిఫలాలు", "lbl_name": "పేరు", "lbl_gender": "లింగం", "lbl_male": "పురుషుడు", "lbl_female": "స్త్రీ", "lbl_dob": "పుట్టిన తేదీ", "lbl_tob": "పుట్టిన సమయం", "lbl_city": "పుట్టిన నగరం", "lbl_state": "రాష్ట్రం", "lbl_country": "దేశం", "lbl_advanced": "అధునాతన ఎంపికలు ⬇", "lbl_ascendant": "లగ్నం", "lbl_moon_sign": "చంద్ర రాశి", "lbl_sun_sign": "సూర్య రాశి", "lbl_nakshatra": "నక్షత్రం", "tbl_planet": "గ్రహం", "tbl_sign": "రాశి", "tbl_degree": "డిగ్రీ", "tbl_nak": "నక్షత్రం", "tbl_pada": "పాదం", "tbl_house": "భావం", "tbl_status": "స్థితి", "pan_paksha": "పక్షం", "pan_tithi": "తిథి", "pan_day": "వారం", "pan_karan": "కరణం", "pan_yog": "యోగం", "pan_sunrise": "సూర్యోదయం", "pan_sunset": "సూర్యాస్తమయం", "dash_panchang": "జనన పంచాంగం", "dash_avakhada": "అవఖడ చక్రం", "dash_ghatak": "ఘాతక చక్రం", "dash_lucky": "శుభ అంశాలు", "app_title": "వేద జాతకం", "lbl_print": "ప్రింట్", "tab_dasha": "దశా కాలం", "tab_bhava": "భావ చలిత్", "lbl_varna": "వర్ణం", "lbl_vashya": "వశ్య", "lbl_yoni": "యోని", "lbl_gan": "గణ", "lbl_nadi": "నాడి", "tab_num_dash": "సంఖ్యాశాస్త్రం", "lbl_radical": "మూలాంకం", "lbl_destiny": "భాగ్యాంకం", "lbl_name_num": "నామాంకం", "lbl_zodiac": "రాశి", "form_title": "పుట్టిన వివరాలను నమోదు చేయండి", "form_subtitle": "ఖచ్చితమైన జాతక గణన కోసం సరైన పుట్టిన సమాచారాన్ని అందించండి", "btn_hide": "వివరాలను దాచడానికి క్లిక్ చేయండి", "btn_show": "వివరాలను జోడించడానికి క్లిక్ చేయండి", "lbl_load_preset": "సెలబ్రిటీల ప్రీసెట్ను లోడ్ చేయండి", "lbl_load_preset_opt": "⭐ సెలబ్రిటీల ప్రీసెట్ను లోడ్ చేయండి...", "lbl_calendar": "క్యాలెండర్", "opt_gregorian": "గ్రెగోరియన్", "opt_julian": "జూలియన్", "lbl_advanced_down": "అధునాతన ఎంపికలు / కస్టమ్ స్థానం ⬇", "lbl_advanced_up": "అధునాతన ఎంపికలు / కస్టమ్ స్థానం ⬆", "sum_name": "జాతకుడి పేరు", "sum_dob": "పుట్టిన తేదీ", "sum_tob": "పుట్టిన సమయం", "sum_pob": "పుట్టిన ప్రదేశం", "sum_lagna": "లగ్నం", "sum_rashi": "చంద్ర రాశి", "lbl_ascendant": "లగ్నం", "lbl_nakshatra": "నక్షత్రం", "lbl_sun_sign": "సూర్య రాశి", "lbl_moon_sign": "చంద్ర రాశి", "tab_ashtakoota": "అష్టకూట మిలన్", "tab_dashakoota": "దశకూట", "tab_bhakoot": "భకూట విచారణ", "tab_manglik": "మాంగలిక మిలన్", "tab_summary": "మిలన్ సారాంశం" }
    },
    kn: {
        nums: ["೦","೧","೨","೩","೪","೫","೬","೭","೮","೯"],
        months: ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"],
        planets: ["ಸೂರ್ಯ", "ಚಂದ್ರ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ", "ರಾಹು", "ಕೇತು"],
        rashis: ["ಮೇಷ", "ವೃಷಭ", "ಮಿಥುನ", "ಕರ್ಕಟಕ", "ಸಿಂಹ", "ಕನ್ಯಾ", "ತುಲಾ", "ವೃಶ್ಚಿಕ", "ಧನುಸ್ಸು", "ಮಕರ", "ಕುಂಭ", "ಮೀನ"],
        nakshatras: ["ಅಶ್ವಿನಿ", "ಭರಣಿ", "ಕೃತ್ತಿಕಾ", "ರೋಹಿಣಿ", "ಮೃಗಶಿರ", "ಆರ್ದ್ರಾ", "ಪುನರ್ವಸು", "ಪುಷ್ಯ", "ಆಶ್ಲೇಷಾ", "ಮಘಾ", "ಪೂರ್ವ ಫಲ್ಗುಣಿ", "ಉತ್ತರ ಫಲ್ಗುಣಿ", "ಹಸ್ತ", "ಚಿತ್ತಾ", "ಸ್ವಾತಿ", "ವಿಶಾಖಾ", "ಅನೂರಾಧ", "ಜ್ಯೇಷ್ಠಾ", "ಮೂಲ", "ಪೂರ್ವಾಷಾಢ", "ಉತ್ತರಾಷಾಢ", "ಶ್ರವಣ", "ಧನಿಷ್ಠಾ", "ಶತಭಿಷಾ", "ಪೂರ್ವಾಭಾದ್ರ", "ಉತ್ತರಾಭಾದ್ರ", "ರೇವತಿ"],
        yogas: ["ವಿಷ್ಕುಂಭ", "ಪ್ರೀತಿ", "ಆಯುಷ್ಮಾನ್", "ಸೌಭಾಗ್ಯ", "ಶೋಭನ", "ಅತಿಗಂಡ", "ಸುಕರ್ಮ", "ಧೃತಿ", "ಶೂಲ", "ಗಂಡ", "ವೃದ್ಧಿ", "ಧ್ರುವ", "ವ್ಯಾಘಾತ", "ಹರ್ಷಣ", "ವಜ್ರ", "ಸಿದ್ಧಿ", "ವ್ಯತೀಪಾತ", "ವರೀಯಾನ್", "ಪರಿಘ", "ಶಿವ", "ಸಿದ್ಧ", "ಸಾಧ್ಯ", "ಶುಭ", "ಶುಕ್ಲ", "ಬ್ರಹ್ಮ", "ಇಂದ್ರ", "ವೈಧೃತಿ"],
        karanas: ["ಬವ", "ಬಾಲವ", "ಕೌಲವ", "ತೈತಿಲ", "ಗರ", "ವಣಿಜ", "ವಿಷ್ಟಿ", "ಶಕುನಿ", "ಚತುಷ್ಪಾದ", "ನಾಗ", "ಕಿಂಸ್ತುಘ್ನ"],
        status: ["ಉಚ್ಚ", "ನೀಚ", "ಸ್ವಕ್ಷೇತ್ರ", "ಸಮ"],
        ui: { "btn_generate": "ಜಾತಕ ರಚಿಸಿ", "tab_birth": "ಜನನ ವಿವರಗಳು", "tab_astro": "ಮೂಲ ಜ್ಯೋತಿಷ್ಯ", "tab_charts": "ಚಾರ್ಟ್ಗಳು", "tab_planetary": "ಗ್ರಹಗಳ ಸ್ಥಿತಿ", "tab_yogas": "ಯೋಗಗಳು & ದೋಷಗಳು", "tab_numbers": "ಸಂಖ್ಯೆಗಳು", "btn_single": "ಏಕ ಜಾತಕ", "btn_match": "ಜಾತಕ ಹೊಂದಾಣಿಕೆ", "person1_head": "ವ್ಯಕ್ತಿ 1 ವಿವರಗಳು", "person2_head": "ವ್ಯಕ್ತಿ 2 ವಿವರಗಳು", "detailed_reading": "ವಿವರವಾದ ಫಲಗಳು", "daily_vibe": "ದೈನಂದಿನ ಭವಿಷ್ಯ", "lbl_name": "ಹೆಸರು", "lbl_gender": "ಲಿಂಗ", "lbl_male": "ಪುರುಷ", "lbl_female": "ಮಹಿಳೆ", "lbl_dob": "ಜನನ ದಿನಾಂಕ", "lbl_tob": "ಜನನ ಸಮಯ", "lbl_city": "ಹುಟ್ಟಿದ ಊರು", "lbl_state": "ರಾಜ್ಯ", "lbl_country": "ದೇಶ", "lbl_advanced": "ಸುಧಾರಿತ ಆಯ್ಕೆಗಳು ⬇", "lbl_ascendant": "ಲಗ್ನ", "lbl_moon_sign": "ಚಂದ್ರ ರಾಶಿ", "lbl_sun_sign": "ಸೂರ್ಯ ರಾಶಿ", "lbl_nakshatra": "ನಕ್ಷತ್ರ", "tbl_planet": "ಗ್ರಹ", "tbl_sign": "ರಾಶಿ", "tbl_degree": "ಡಿಗ್ರಿ", "tbl_nak": "ನಕ್ಷತ್ರ", "tbl_pada": "ಪಾದ", "tbl_house": "ಭಾವ", "tbl_status": "ಸ್ಥಿತಿ", "pan_paksha": "ಪಕ್ಷ", "pan_tithi": "ತಿಥಿ", "pan_day": "ವಾರ", "pan_karan": "ಕರಣ", "pan_yog": "ಯೋಗ", "pan_sunrise": "ಸೂರ್ಯೋದಯ", "pan_sunset": "ಸೂರ್ಯಾಸ್ತ", "dash_panchang": "ಜನನ ಪಂಚಾಂಗ", "dash_avakhada": "ಅವಖಡ ಚಕ್ರ", "dash_ghatak": "ಘಾತಕ ಚಕ್ರ", "dash_lucky": "ಶುಭ ಅಂಶಗಳು", "app_title": "ವೇದ ಜಾತಕ", "lbl_print": "ಪ್ರಿಂಟ್", "tab_dasha": "ದಶಾ ಕಾಲ", "tab_bhava": "ಭಾವ ಚಲಿತ", "lbl_varna": "ವರ್ಣ", "lbl_vashya": "ವಶ್ಯ", "lbl_yoni": "ಯೋನಿ", "lbl_gan": "ಗಣ", "lbl_nadi": "ನಾಡಿ", "tab_num_dash": "ಸಂಖ್ಯಾಶಾಸ್ತ್ರ", "lbl_radical": "ಮೂಲಾಂಕ", "lbl_destiny": "ಭಾಗ್ಯಾಂಕ", "lbl_name_num": "ನಾಮಾಂಕ", "lbl_zodiac": "ರಾಶಿ", "form_title": "ಜನನ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ", "form_subtitle": "ನಿಖರವಾದ ಜಾತಕ ಲೆಕ್ಕಾಚಾರಕ್ಕಾಗಿ ಸರಿಯಾದ ಜನನ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಿ", "btn_hide": "ವಿವರಗಳನ್ನು ಮರೆಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ", "btn_show": "ವಿವರಗಳನ್ನು ಸೇರಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ", "lbl_load_preset": "ಸೆಲೆಬ್ರಿಟಿ ಪ್ರಿಸೆಟ್ ಲೋಡ್ ಮಾಡಿ", "lbl_load_preset_opt": "⭐ ಸೆಲೆಬ್ರಿಟಿ ಪ್ರಿಸೆಟ್ ಲೋಡ್ ಮಾಡಿ...", "lbl_calendar": "ಕ್ಯಾಲೆಂಡರ್", "opt_gregorian": "ಗ್ರೆಗೋರಿಯನ್", "opt_julian": "ಜೂಲಿಯನ್", "lbl_advanced_down": "ಸುಧಾರಿತ ಆಯ್ಕೆಗಳು / ಕಸ್ಟಮ್ ಸ್ಥಳ ⬇", "lbl_advanced_up": "ಸುಧಾರಿತ ಆಯ್ಕೆಗಳು / ಕಸ್ಟಮ್ ಸ್ಥಳ ⬆", "sum_name": "ಜಾತಕನ ಹೆಸರು", "sum_dob": "ಜನನ ದಿನಾಂಕ", "sum_tob": "ಜನನ ಸಮಯ", "sum_pob": "ಜನನ ಸ್ಥಳ", "sum_lagna": "ಲಗ್ನ", "sum_rashi": "ಚಂದ್ರ ರಾಶಿ", "lbl_ascendant": "ಲಗ್ನ", "lbl_nakshatra": "ನಕ್ಷತ್ರ", "lbl_sun_sign": "ಸೂರ್ಯ ರಾಶಿ", "lbl_moon_sign": "ಚಂದ್ರ ರಾಶಿ", "tab_ashtakoota": "ಅಷ್ಟಕೂಟ ಮಿಲನ", "tab_dashakoota": "ದಶಕೂಟ", "tab_bhakoot": "ಭಕೂಟ ವಿಚಾರ", "tab_manglik": "ಮಾಂಗಲಿಕ ಮಿಲನ", "tab_summary": "ಮಿಲನ ಸಾರಾಂಶ" }
    },
    ml: {
        nums: ["൦","൧","൨","൩","൪","൫","൬","൭","൮","൯"],
        months: ["ജനുവരി", "ഫെബ്രുവരി", "മാർച്ച്", "ഏപ്രിൽ", "മേയ്", "ജൂൺ", "ജൂലൈ", "ഓഗസ്റ്റ്", "സെപ്റ്റംബർ", "ഒക്ടോബർ", "നവംബർ", "ഡിസംബർ"],
        planets: ["സൂര്യൻ", "ചന്ദ്രൻ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "ശുക്രൻ", "ശനി", "രാഹു", "കേതു"],
        rashis: ["മേടം", "ഇടവം", "മിഥുനം", "കർക്കടകം", "ചിങ്ങം", "കന്നി", "തുലാം", "വൃശ്ചികം", "ധനു", "മകരം", "കുംഭം", "മീനം"],
        nakshatras: ["അശ്വതി", "ഭരണി", "കാർത്തിക", "രോഹിണി", "മകയിരം", "തിരുവാതിര", "പുണർതം", "പൂയം", "ആയില്യം", "മകം", "പൂരം", "ഉത്രം", "അത്തം", "ചിത്തിര", "ചോതി", "വിശാഖം", "അനിഴം", "തൃക്കേട്ട", "മൂലം", "പൂരാടം", "ഉത്രാടം", "തിരുവോണം", "അവിട്ടം", "ചതയം", "പൂരൂരുട്ടാതി", "ഉത്രട്ടാതി", "രേവതി"],
        yogas: ["വിഷ്കുംഭം", "പ്രീതി", "ആയുഷ്മാൻ", "സൗഭാഗ്യം", "ശോഭനം", "അതിഗണ്ഡം", "സുകർമ്മം", "ധൃതി", "ശൂലം", "ഗണ്ഡം", "വൃദ്ധി", "ധ്രുവം", "വ്യാഘാതം", "ഹർഷണം", "വജ്രം", "സിദ്ധി", "വ്യതീപാതം", "വരീയാൻ", "പരിഘം", "ശിവം", "സിദ്ധം", "സാദ്ധ്യം", "ശുഭം", "ശുക്ലം", "ബ്രഹ്മം", "ഇന്ദ്രം", "വൈധൃതി"],
        karanas: ["ബവ", "ബാലവ", "കൗലവ", "തൈതില", "ഗര", "വണിജ", "വിഷ്ടി", "ശകുനി", "ചതുഷ്പാദ", "നാഗ", "കിംസ്തുഘ്ന"],
        status: ["ഉച്ചം", "നീചം", "സ്വക്ഷേത്രം", "സമം"],
        ui: { "btn_generate": "ജാതകം തയ്യാറാക്കുക", "tab_birth": "ജനന വിവരങ്ങൾ", "tab_astro": "അടിസ്ഥാന ജ്യോതിഷം", "tab_charts": "ചാർട്ടുകൾ", "tab_planetary": "ഗ്രഹ നിലകൾ", "tab_yogas": "യോഗങ്ങളും ദോഷങ്ങളും", "tab_numbers": "സംഖ്യകൾ", "btn_single": "ഒറ്റ ജാതകം", "btn_match": "ജാതക പൊരുത്തം", "person1_head": "വ്യക്തി 1 വിവരങ്ങൾ", "person2_head": "വ്യക്തി 2 വിവരങ്ങൾ", "detailed_reading": "വിശദമായ ഫലം", "daily_vibe": "പ്രതിദിന ഫലം", "lbl_name": "പേര്", "lbl_gender": "ലിംഗം", "lbl_male": "പുരുഷൻ", "lbl_female": "സ്ത്രീ", "lbl_dob": "ജനന തീയതി", "lbl_tob": "ജനന സമയം", "lbl_city": "ജനിച്ച സ്ഥലം", "lbl_state": "സംസ്ഥാനം", "lbl_country": "രാജ്യം", "lbl_advanced": "കൂടുതൽ ഓപ്ഷനുകൾ ⬇", "lbl_ascendant": "ലഗ്നം", "lbl_moon_sign": "ചന്ദ്ര രാശി", "lbl_sun_sign": "സൂര്യ രാശി", "lbl_nakshatra": "നക്ഷത്രം", "tbl_planet": "ഗ്രഹം", "tbl_sign": "രാശി", "tbl_degree": "ഡിഗ്രി", "tbl_nak": "നക്ഷത്രം", "tbl_pada": "പാദം", "tbl_house": "ഭാവം", "tbl_status": "സ്ഥിതി", "pan_paksha": "പക്ഷം", "pan_tithi": "തിഥി", "pan_day": "ദിവസം", "pan_karan": "കരണം", "pan_yog": "യോഗം", "pan_sunrise": "സൂര്യോദയം", "pan_sunset": "സൂര്യാസ്തമയം", "dash_panchang": "ജനന പഞ്ചാംഗം", "dash_avakhada": "അവഖഡ ചക്രം", "dash_ghatak": "ഘാതക ചക്രം", "dash_lucky": "ശുഭ കാര്യങ്ങൾ", "app_title": "വേദ ജാതകം", "lbl_print": "പ്രിൻ്റ്", "tab_dasha": "ദശാ കാലം", "tab_bhava": "ഭാവ ചലിത", "lbl_varna": "വർണ്ണം", "lbl_vashya": "വശ്യം", "lbl_yoni": "യോനി", "lbl_gan": "ഗണം", "lbl_nadi": "നാഡി", "tab_num_dash": "സംഖ്യാശാസ്ത്രം", "lbl_radical": "മൂലാങ്കം", "lbl_destiny": "ഭാഗ്യാങ്കം", "lbl_name_num": "നാമാങ്കം", "lbl_zodiac": "രാശി", "form_title": "ജനന വിശദാംശങ്ങൾ നൽകുക", "form_subtitle": "കൃത്യമായ ജാതക കണക്കുകൂട്ടലിനായി ശരിയായ ജനന വിവരങ്ങൾ നൽകുക", "btn_hide": "വിശദാംശങ്ങൾ മറയ്ക്കാൻ ക്ലിക്ക് ചെയ്യുക", "btn_show": "വിശദാംശങ്ങൾ ചേർക്കാൻ ക്ലിക്ക് ചെയ്യുക", "lbl_load_preset": "സെലിബ്രിറ്റി പ്രീസെറ്റ് ലോഡ് ചെയ്യുക", "lbl_load_preset_opt": "⭐ സെലിബ്രിറ്റി പ്രീസെറ്റ് ലോഡ് ചെയ്യുക...", "lbl_calendar": "കലണ്ടർ", "opt_gregorian": "ഗ്രിഗോറിയൻ", "opt_julian": "ജൂലിയൻ", "lbl_advanced_down": "കൂടുതൽ ഓപ്ഷനുകൾ / ഇഷ്ടാനുസൃത സ്ഥലം ⬇", "lbl_advanced_up": "കൂടുതൽ ഓപ്ഷനുകൾ / ഇഷ്ടാനുസൃത സ്ഥലം ⬆", "sum_name": "ജാതകന്റെ പേര്", "sum_dob": "ജനന തീയതി", "sum_tob": "ജനന സമയം", "sum_pob": "ജനന സ്ഥലം", "sum_lagna": "ലഗ്നം", "sum_rashi": "ചന്ദ്ര രാശി", "lbl_ascendant": "ലഗ്നം", "lbl_nakshatra": "നക്ഷത്രം", "lbl_sun_sign": "സൂര്യ രാശി", "lbl_moon_sign": "ചന്ദ്ര രാശി", "tab_ashtakoota": "അഷ്ടകൂട പൊരുത്തം", "tab_dashakoota": "ദശകൂട പൊരുത്തം", "tab_bhakoot": "ഭകൂട ചിന്ത", "tab_manglik": "മാംഗല്യ പൊരുത്തം", "tab_summary": "പൊരുത്തം ചുരുക്കം" }
    },
    as: {
        nums: ["০","১","২","৩","৪","৫","৬","৭","৮","৯"],
        months: ["জানুৱাৰী", "ফেব্ৰুৱাৰী", "মাৰ্চ", "এপ্ৰিল", "মে'", "জুন", "জুলাই", "আগষ্ট", "ছেপ্টেম্বৰ", "অক্টোবৰ", "নৱেম্বৰ", "ডিচেম্বৰ"],
        planets: ["সূৰ্য", "চন্দ্ৰ", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্ৰ", "শনি", "ৰাহু", "কেতু"],
        rashis: ["মেষ", "বৃষ", "মিথুন", "কৰ্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকৰ", "কুম্ভ", "মীন"],
        nakshatras: ["অশ্বিনী", "ভৰণী", "কৃত্তিকা", "ৰোহিণী", "মৃগশিৰা", "আৰ্দ্ৰা", "পুনৰ্বসু", "পুষ্যা", "অশ্লেষা", "মঘা", "পূৰ্বফাল্গুনী", "উত্তৰফাল্গুনী", "হস্তা", "চিত্ৰা", "স্বাতী", "বিশাখা", "অনুৰাধা", "জ্যেষ্ঠা", "মূলা", "পূৰ্বাষাঢ়া", "উত্তৰাষাঢ়া", "শ্ৰৱণা", "ধনিষ্ঠা", "শতভিষা", "পূৰ্বভাদ্ৰপদ", "উত্তৰভাদ্ৰপদ", "ৰেৱতী"],
        yogas: ["বিষ্কুম্ভ", "প্ৰীতি", "আয়ুষ্মান", "সৌভাগ্য", "শোভন", "অতিগণ্ড", "সুকৰ্মা", "ধৃতি", "শূল", "গণ্ড", "বৃদ্ধি", "ধ্ৰুৱ", "ব্যাঘাত", "হৰ্ষণ", "বজ্ৰ", "সিদ্ধি", "ব্যতীপাত", "বৰীয়ান", "পৰিঘ", "শিৱ", "সিদ্ধ", "সাধ্য", "শুভ", "শুক্ল", "ব্ৰহ্ম", "ইন্দ্ৰ", "বৈধৃতি"],
        karanas: ["বৱ", "বালৱ", "কৌলৱ", "তৈথিল", "গৰ", "ৱণিজ", "বিষ্টি", "শকুনি", "চতুষ্পদ", "নাগ", "কিংস্তুঘ্ন"],
        status: ["উচ্চ", "নীচ", "স্বগৃহী", "নিৰপেক্ষ"],
        ui: { "btn_generate": "কুণ্ডলী প্ৰস্তুত কৰক", "tab_birth": "জন্ম বিৱৰণ", "tab_astro": "মূল জ্যোতিষ", "tab_charts": "চাৰ্টসমূহ", "tab_planetary": "গ্ৰহৰ অৱস্থান", "tab_yogas": "যোগ আৰু দোষ", "tab_numbers": "সংখ্যা", "btn_single": "একক কুণ্ডলী", "btn_match": "কুণ্ডলী মিলন", "person1_head": "ব্যক্তি ১ বিৱৰণ", "person2_head": "ব্যক্তি ২ বিৱৰণ", "detailed_reading": "বিস্তাৰিত ফলাফল", "daily_vibe": "দৈনিক ৰাশিফল", "lbl_name": "নাম", "lbl_gender": "লিংগ", "lbl_male": "পুৰুষ", "lbl_female": "মহিলা", "lbl_dob": "জন্মৰ তাৰিখ", "lbl_tob": "জন্মৰ সময়", "lbl_city": "জন্মস্থান", "lbl_state": "ৰাজ্য", "lbl_country": "দেশ", "lbl_advanced": "উন্নত বিকল্প ⬇", "lbl_ascendant": "লগ্ন", "lbl_moon_sign": "চন্দ্ৰ ৰাশি", "lbl_sun_sign": "সূৰ্য ৰাশি", "lbl_nakshatra": "নক্ষত্ৰ", "tbl_planet": "গ্ৰহ", "tbl_sign": "ৰাশি", "tbl_degree": "অংশ", "tbl_nak": "নক্ষত্ৰ", "tbl_pada": "পদ", "tbl_house": "ভাৱ", "tbl_status": "অৱস্থান", "pan_paksha": "পক্ষ", "pan_tithi": "তিথি", "pan_day": "বাৰ", "pan_karan": "কৰণ", "pan_yog": "যোগ", "pan_sunrise": "সূৰ্যোদয়", "pan_sunset": "সূৰ্যাস্ত", "dash_panchang": "জন্ম পঞ্জিকা", "dash_avakhada": "অৱখড়া চক্ৰ", "dash_ghatak": "ঘাটক চক্ৰ", "dash_lucky": "শুভ বিন্দু", "app_title": "বৈদিক কুণ্ডলী", "lbl_print": "প্ৰিণ্ট", "tab_dasha": "দশা কাল", "tab_bhava": "ভাৱ চলিত", "lbl_varna": "বৰ্ণ", "lbl_vashya": "বশ্য", "lbl_yoni": "যোনি", "lbl_gan": "গণ", "lbl_nadi": "নাড়ী", "tab_num_dash": "সংখ্যাতত্ত্ব", "lbl_radical": "মূলাংক", "lbl_destiny": "ভাগ্যাংক", "lbl_name_num": "নামাংক", "lbl_zodiac": "ৰাশি", "form_title": "জন্ম বিৱৰণ প্ৰৱেশ কৰক", "form_subtitle": "সঠিক কুণ্ডলী গণনাৰ বাবে সঠিক জন্ম তথ্য প্ৰদান কৰক", "btn_hide": "বিৱৰণ লুকুৱাবলৈ ক্লিক কৰক", "btn_show": "বিৱৰণ যোগ কৰিবলৈ ক্লিক কৰক", "lbl_load_preset": "চেলিব্ৰিটি প্ৰীছেট ল'ড কৰক", "lbl_load_preset_opt": "⭐ চেলিব্ৰিটি প্ৰীছেট ল'ড কৰক...", "lbl_calendar": "কেলেণ্ডাৰ", "opt_gregorian": "গ্ৰেগৰিয়ান", "opt_julian": "জুলিয়ান", "lbl_advanced_down": "উন্নত বিকল্প / কাষ্টম অৱস্থান ⬇", "lbl_advanced_up": "উন্নত বিকল্প / কাষ্টম অৱস্থান ⬆", "sum_name": "জাতকৰ নাম", "sum_dob": "জন্ম তাৰিখ", "sum_tob": "জন্ম সময়", "sum_pob": "জন্ম স্থান", "sum_lagna": "লগ্ন", "sum_rashi": "চন্দ্ৰ ৰাশি", "lbl_ascendant": "লগ্ন", "lbl_nakshatra": "নক্ষত্ৰ", "lbl_sun_sign": "সূৰ্য ৰাশি", "lbl_moon_sign": "চন্দ্ৰ ৰাশি", "tab_ashtakoota": "অষ্টকূট মিলন", "tab_dashakoota": "দশকূট", "tab_bhakoot": "ভকূট বিচাৰ", "tab_manglik": "মাঙ্গলিক মিলন", "tab_summary": "মিলন সাৰাংশ" }
    }
};

// Function to translate Numbers (DMS, Degrees, House numbers)
function toNativeNum(strOrNum, langCode) {
    if (!strOrNum && strOrNum !== 0) return strOrNum;
    if (langCode === 'en' || !langData[langCode]) return String(strOrNum);
    
    return String(strOrNum).split('').map(char => {
        if (/[0-9]/.test(char)) {
            return langData[langCode].nums[parseInt(char)];
        }
        return char;
    }).join('');
}

// Function to safely map Planet abbreviations to local names
// Function to translate standard arrays
function getLocalizedArrayItem(arrayName, index, fallbackArray) {
    if (localizedParagraphs[currentLang]) {
        let targetArr = localizedParagraphs[currentLang][arrayName + "_" + currentLang] || localizedParagraphs[currentLang][arrayName];
        if (targetArr && targetArr[index]) return targetArr[index];
    }
    if (langData[currentLang] && langData[currentLang][arrayName] && langData[currentLang][arrayName][index]) {
        return langData[currentLang][arrayName][index];
    }
    if (langData['en'] && langData['en'][arrayName] && langData['en'][arrayName][index]) {
        return langData['en'][arrayName][index];
    }
    if (fallbackArray && fallbackArray[index]) return fallbackArray[index];
    return index;
}

function getLocalPlanet(abbr) {
    const mapping = { "Su":0, "Sun":0, "Mo":1, "Moon":1, "Ch":1, "Ma":2, "Mar":2, "Mars":2, "Me":3, "Mer":3, "Mercury":3, "Ju":4, "Jup":4, "Jupiter":4, "Ve":5, "Ven":5, "Venus":5, "Sa":6, "Sat":6, "Saturn":6, "Ra":7, "Rah":7, "Rahu":7, "Ke":8, "Ket":8, "Ketu":8 };
    const idx = mapping[abbr];
    if (idx !== undefined) {
        if (localizedParagraphs[currentLang]) {
            let targetArr = localizedParagraphs[currentLang]["planets_" + currentLang] || localizedParagraphs[currentLang].planets;
            if (targetArr && targetArr[idx]) return targetArr[idx];
        }
        if (langData[currentLang] && langData[currentLang].planets) return langData[currentLang].planets[idx];
    }
    return abbr;
}

// Function to safely map Zodiac index (1-12) to local names
function getLocalRashi(signIndex) {
    if (signIndex < 1 || signIndex > 12) return "";
    if (localizedParagraphs[currentLang]) {
        let targetArr = localizedParagraphs[currentLang]["rashis_" + currentLang] || localizedParagraphs[currentLang].rashis;
        if (targetArr && targetArr[signIndex - 1]) return targetArr[signIndex - 1];
    }
    if (langData[currentLang] && langData[currentLang].rashis) {
        return langData[currentLang].rashis[signIndex - 1];
    }
    if (langData['en'] && langData['en'].rashis) return langData['en'].rashis[signIndex - 1];
    return "";
}

function getLocalNakshatra(nakNameOrIndex) {
    let idx = -1;
    if (typeof nakNameOrIndex === 'number') {
        idx = nakNameOrIndex;
    } else {
        const engNaks = langData['en'].nakshatras;
        idx = engNaks.findIndex(n => n.toLowerCase() === String(nakNameOrIndex).toLowerCase());
    }
    
    if (idx >= 0 && idx < 27) {
        if (localizedParagraphs[currentLang]) {
            let targetArr = localizedParagraphs[currentLang]["nakshatras_" + currentLang] || localizedParagraphs[currentLang].nakshatras;
            if (targetArr && targetArr[idx]) return targetArr[idx];
        }
        if (langData[currentLang] && langData[currentLang].nakshatras) return langData[currentLang].nakshatras[idx];
    }
    return nakNameOrIndex;
}

function getLocalYoga(yogaNameOrIndex) {
    let idx = -1;
    if (typeof yogaNameOrIndex === 'number') {
        idx = yogaNameOrIndex;
    } else {
        const engYogas = langData['en'].yogas;
        idx = engYogas.findIndex(y => y.toLowerCase() === String(yogaNameOrIndex).toLowerCase());
    }
    
    if (idx >= 0 && idx < 27) {
        if (localizedParagraphs[currentLang]) {
            let targetArr = localizedParagraphs[currentLang]["yogas_" + currentLang] || localizedParagraphs[currentLang].yogas;
            if (targetArr && targetArr[idx]) return targetArr[idx];
        }
        if (langData[currentLang] && langData[currentLang].yogas) return langData[currentLang].yogas[idx];
    }
    return yogaNameOrIndex;
}

function getLocalKarana(karanaNameOrIndex) {
    let idx = -1;
    if (typeof karanaNameOrIndex === 'number') {
        idx = karanaNameOrIndex;
    } else {
        const engKaranas = langData['en'].karanas;
        idx = engKaranas.findIndex(k => k.toLowerCase() === String(karanaNameOrIndex).toLowerCase());
    }
    
    if (idx >= 0 && idx < 11) {
        if (localizedParagraphs[currentLang]) {
            let targetArr = localizedParagraphs[currentLang]["karanas_" + currentLang] || localizedParagraphs[currentLang].karanas;
            if (targetArr && targetArr[idx]) return targetArr[idx];
        }
        if (langData[currentLang] && langData[currentLang].karanas) return langData[currentLang].karanas[idx];
    }
    return karanaNameOrIndex;
}

function getLocalStatus(statusEng) {
    const map = {"Exalted": 0, "Debilitated": 1, "Own Sign": 2, "Neutral": 3};
    const idx = map[statusEng];
    if (idx !== undefined) {
        if (localizedParagraphs[currentLang]) {
            let targetArr = localizedParagraphs[currentLang]["status_" + currentLang] || localizedParagraphs[currentLang].status;
            if (targetArr && targetArr[idx]) return targetArr[idx];
        }
        if (langData[currentLang] && langData[currentLang].status) return langData[currentLang].status[idx];
    }
    return statusEng;
}

const AstroAutoTranslator = {
    translateElement: function(element, langCode) {
        if (!element) return; // English is now also processed to allow CDN overrides

        // 1. Build the translation dictionary dynamically
        const dict = {};
        const categories = ['planets', 'rashis', 'nakshatras', 'yogas', 'karanas', 'yunja', 'status', 'days', 'tithis', 'paksha', 'lunarMonths', 'varna', 'vashya', 'yoni', 'gana', 'nadi', 'paya', 'tatva', 'metals', 'stones', 'samvatsaras', 'months'];
        
        categories.forEach(cat => {
            if (langData['en'][cat]) {
                let targetArr = null;
                // Prioritize CDN JSON data first
                if (localizedParagraphs[langCode]) {
                    targetArr = localizedParagraphs[langCode][cat + "_" + langCode] || localizedParagraphs[langCode][cat];
                }
                // Fallback to hardcoded HTML data
                if (!targetArr && langData[langCode]) {
                    targetArr = langData[langCode][cat];
                }
                if (targetArr) {
                    langData['en'][cat].forEach((engTerm, index) => {
                        const translatedTerm = targetArr[index];
                        if (engTerm && translatedTerm) {
                            dict[engTerm.toLowerCase()] = translatedTerm;
                        }
                    });
                }
            }
        });

        // 2. Sort keys by length descending to prevent partial match overwrites (e.g., "Purva Phalguni" before "Purva")
        const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
        
        // 3. Create a strict word-boundary Regex
        // We use \b to ensure we match "Sun" but not "Sunday"
        const regexPattern = new RegExp('\\b(' + sortedKeys.join('|') + ')\\b', 'gi');

        // 4. Number translation helper mapping
        const enNums = langData['en'].nums;
        const targetNums = langData[langCode].nums;

        // 5. Traverse DOM using TreeWalker to ONLY touch text nodes (preserves HTML structure/attributes)
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const nodesToUpdate = [];
        
        let node;
        while ((node = walker.nextNode())) {
            // Skip empty text, script/style contents, or already JSON-localized panels
            if (node.nodeValue.trim() === '') continue;
            if (node.parentElement && ['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) continue;
            
            nodesToUpdate.push(node);
        }

        // 6. Apply replacements
        nodesToUpdate.forEach(txtNode => {
            let text = txtNode.nodeValue;
            
            // Translate Astrological words
            // Remove the test() to avoid advancing lastIndex, just call replace directly
            text = text.replace(regexPattern, (match) => {
                const lowerMatch = match.toLowerCase();
                return dict[lowerMatch] || match;
            });

            // Translate Numbers
            text = text.replace(/[0-9]/g, (digit) => {
                return targetNums[parseInt(digit)] || digit;
            });

            txtNode.nodeValue = text;
        });
    }
};

// Main Translation Execution Function
function applyTranslations() {
    // 1. Update UI Elements via data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        let translatedText = null;
        
        // Prioritize the external fetched JSON's ui_extra object FIRST (Allows CDN to override everything)
        if (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra && localizedParagraphs[currentLang].ui_extra[key]) {
            translatedText = localizedParagraphs[currentLang].ui_extra[key];
        }
        // Fallback to local JS dictionary if not found in CDN
        else if (langData[currentLang] && langData[currentLang].ui && langData[currentLang].ui[key]) {
            translatedText = langData[currentLang].ui[key];
        } 
        
        if (translatedText) {
            el.innerHTML = translatedText; // Use innerHTML to preserve span styling in titles
        }
    });

    // 2. Re-render dynamic content if Matchmaking is calculated
    if (typeof window.renderMatchChart === 'function') {
        window.renderMatchChart();
    }
    
    // 3. Auto-Translate text nodes in dynamic panels
    const matchmakingDashboard = document.getElementById('matchmakingDashboard');
    if (matchmakingDashboard) AstroAutoTranslator.translateElement(matchmakingDashboard, currentLang);
}

async function changeAppLanguage(langCode) {
    currentLang = langCode;
    localStorage.setItem('appLang', langCode);
    localStorage.setItem('vaidik_lang', langCode);
    
    try {
        const newUrl = new URL(window.location.href);
        const fullLangName = urlLangMap[langCode] || 'english';
        newUrl.searchParams.set('lang', fullLangName);
        window.history.replaceState({}, '', newUrl);
    } catch (e) {}
    
    // Fetch external paragraphs before updating UI
    await fetchLocalizedParagraphs(langCode);
    
    applyTranslations();
}

window.changeAppLanguage = changeAppLanguage;
window.addEventListener('vaidik-lang-change', function(ev) {
    if (ev && ev.detail && ev.detail.lang && ev.detail.lang !== currentLang) {
        changeAppLanguage(ev.detail.lang);
    }
});
      /*
 MIT


    Astronomy library for JavaScript (browser and Node.js).
    https://github.com/cosinekitty/astronomy

    MIT License

    Copyright (c) 2019-2023 Don Cross <cosinekitty@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/
      var $jscomp = $jscomp || {};
      $jscomp.scope = {};
      $jscomp.createTemplateTagFirstArg = function (r) {
        return (r.raw = r);
      };
      $jscomp.createTemplateTagFirstArgWithRaw = function (r, u) {
        r.raw = u;
        return r;
      };
      $jscomp.arrayIteratorImpl = function (r) {
        var u = 0;
        return function () {
          return u < r.length ? { done: !1, value: r[u++] } : { done: !0 };
        };
      };
      $jscomp.arrayIterator = function (r) {
        return { next: $jscomp.arrayIteratorImpl(r) };
      };
      $jscomp.makeIterator = function (r) {
        var u =
          "undefined" != typeof Symbol && Symbol.iterator && r[Symbol.iterator];
        return u ? u.call(r) : $jscomp.arrayIterator(r);
      };
      $jscomp.getGlobal = function (r) {
        r = [
          "object" == typeof globalThis && globalThis,
          r,
          "object" == typeof window && window,
          "object" == typeof self && self,
          "object" == typeof global && global,
        ];
        for (var u = 0; u < r.length; ++u) {
          var e = r[u];
          if (e && e.Math == Math) return e;
        }
        throw Error("Cannot find global object");
      };
      $jscomp.global = $jscomp.getGlobal(this);
      $jscomp.ASSUME_ES5 = !1;
      $jscomp.ASSUME_NO_NATIVE_MAP = !1;
      $jscomp.ASSUME_NO_NATIVE_SET = !1;
      $jscomp.SIMPLE_FROUND_POLYFILL = !1;
      $jscomp.ISOLATE_POLYFILLS = !1;
      $jscomp.FORCE_POLYFILL_PROMISE = !1;
      $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
      $jscomp.defineProperty =
        $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
          ? Object.defineProperty
          : function (r, u, e) {
              if (r == Array.prototype || r == Object.prototype) return r;
              r[u] = e.value;
              return r;
            };
      $jscomp.IS_SYMBOL_NATIVE =
        "function" === typeof Symbol && "symbol" === typeof Symbol("x");
      $jscomp.TRUST_ES6_POLYFILLS =
        !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
      $jscomp.polyfills = {};
      $jscomp.propertyToPolyfillSymbol = {};
      $jscomp.POLYFILL_PREFIX = "$jscp$";
      var $jscomp$lookupPolyfilledValue = function (r, u) {
        var e = $jscomp.propertyToPolyfillSymbol[u];
        if (null == e) return r[u];
        e = r[e];
        return void 0 !== e ? e : r[u];
      };
      $jscomp.polyfill = function (r, u, e, C) {
        u &&
          ($jscomp.ISOLATE_POLYFILLS
            ? $jscomp.polyfillIsolated(r, u, e, C)
            : $jscomp.polyfillUnisolated(r, u, e, C));
      };
      $jscomp.polyfillUnisolated = function (r, u, e, C) {
        e = $jscomp.global;
        r = r.split(".");
        for (C = 0; C < r.length - 1; C++) {
          var A = r[C];
          if (!(A in e)) return;
          e = e[A];
        }
        r = r[r.length - 1];
        C = e[r];
        u = u(C);
        u != C &&
          null != u &&
          $jscomp.defineProperty(e, r, {
            configurable: !0,
            writable: !0,
            value: u,
          });
      };
      $jscomp.polyfillIsolated = function (r, u, e, C) {
        var A = r.split(".");
        r = 1 === A.length;
        C = A[0];
        C = !r && C in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
        for (var w = 0; w < A.length - 1; w++) {
          var Q = A[w];
          if (!(Q in C)) return;
          C = C[Q];
        }
        A = A[A.length - 1];
        e = $jscomp.IS_SYMBOL_NATIVE && "es6" === e ? C[A] : null;
        u = u(e);
        null != u &&
          (r
            ? $jscomp.defineProperty($jscomp.polyfills, A, {
                configurable: !0,
                writable: !0,
                value: u,
              })
            : u !== e &&
              (void 0 === $jscomp.propertyToPolyfillSymbol[A] &&
                ($jscomp.propertyToPolyfillSymbol[A] = $jscomp.IS_SYMBOL_NATIVE
                  ? $jscomp.global.Symbol(A)
                  : $jscomp.POLYFILL_PREFIX + A),
              $jscomp.defineProperty(C, $jscomp.propertyToPolyfillSymbol[A], {
                configurable: !0,
                writable: !0,
                value: u,
              })));
      };
      $jscomp.polyfill(
        "Math.log10",
        function (r) {
          return r
            ? r
            : function (u) {
                return Math.log(u) / Math.LN10;
              };
        },
        "es6",
        "es3",
      );
      $jscomp.polyfill(
        "Number.isFinite",
        function (r) {
          return r
            ? r
            : function (u) {
                return "number" !== typeof u
                  ? !1
                  : !isNaN(u) && Infinity !== u && -Infinity !== u;
              };
        },
        "es6",
        "es3",
      );
      $jscomp.polyfill(
        "Math.hypot",
        function (r) {
          return r
            ? r
            : function (u) {
                if (2 > arguments.length)
                  return arguments.length ? Math.abs(arguments[0]) : 0;
                var e, C, A;
                for (e = A = 0; e < arguments.length; e++)
                  A = Math.max(A, Math.abs(arguments[e]));
                if (1e100 < A || 1e-100 > A) {
                  if (!A) return A;
                  for (e = C = 0; e < arguments.length; e++) {
                    var w = Number(arguments[e]) / A;
                    C += w * w;
                  }
                  return Math.sqrt(C) * A;
                }
                for (e = C = 0; e < arguments.length; e++)
                  ((w = Number(arguments[e])), (C += w * w));
                return Math.sqrt(C);
              };
        },
        "es6",
        "es3",
      );
      $jscomp.polyfill(
        "Number.MAX_SAFE_INTEGER",
        function () {
          return 9007199254740991;
        },
        "es6",
        "es3",
      );
      $jscomp.polyfill(
        "Number.isInteger",
        function (r) {
          return r
            ? r
            : function (u) {
                return Number.isFinite(u) ? u === Math.floor(u) : !1;
              };
        },
        "es6",
        "es3",
      );
      $jscomp.polyfill(
        "Number.isSafeInteger",
        function (r) {
          return r
            ? r
            : function (u) {
                return (
                  Number.isInteger(u) && Math.abs(u) <= Number.MAX_SAFE_INTEGER
                );
              };
        },
        "es6",
        "es3",
      );
      $jscomp.polyfill(
        "Math.cbrt",
        function (r) {
          return r
            ? r
            : function (u) {
                if (0 === u) return u;
                u = Number(u);
                var e = Math.pow(Math.abs(u), 1 / 3);
                return 0 > u ? -e : e;
              };
        },
        "es6",
        "es3",
      );
      (function (r) {
        "object" === typeof exports && "undefined" !== typeof module
          ? (module.exports = r())
          : "function" === typeof define && define.amd
            ? define([], r)
            : (("undefined" !== typeof window
                ? window
                : "undefined" !== typeof global
                  ? global
                  : "undefined" !== typeof self
                    ? self
                    : this
              ).Astronomy = r());
      })(function () {
        return (function () {
          function r(u, e, C) {
            function A(N, T) {
              if (!e[N]) {
                if (!u[N]) {
                  var ka = "function" == typeof require && require;
                  if (!T && ka) return ka(N, !0);
                  if (w) return w(N, !0);
                  T = Error("Cannot find module '" + N + "'");
                  throw ((T.code = "MODULE_NOT_FOUND"), T);
                }
                T = e[N] = { exports: {} };
                u[N][0].call(
                  T.exports,
                  function (sa) {
                    return A(u[N][1][sa] || sa);
                  },
                  T,
                  T.exports,
                  r,
                  u,
                  e,
                  C,
                );
              }
              return e[N].exports;
            }
            for (
              var w = "function" == typeof require && require, Q = 0;
              Q < C.length;
              Q++
            )
              A(C[Q]);
            return A;
          }
          return r;
        })()(
          {
            1: [
              function (r, u, e) {
                function C(a) {
                  switch (a) {
                    case m.Sun:
                      return 2.959122082855911e-4;
                    case m.Mercury:
                      return 4.912547451450812e-11;
                    case m.Venus:
                      return 7.243452486162703e-10;
                    case m.Earth:
                      return 8.887692390113509e-10;
                    case m.Moon:
                      return 1.093189565989891e-11;
                    case m.EMB:
                      return 8.997011346712498e-10;
                    case m.Mars:
                      return 9.549535105779258e-11;
                    case m.Jupiter:
                      return 2.825345909524226e-7;
                    case m.Saturn:
                      return 8.459715185680659e-8;
                    case m.Uranus:
                      return 1.292024916781969e-8;
                    case m.Neptune:
                      return 1.524358900784276e-8;
                    case m.Pluto:
                      return 2.18869976542597e-12;
                    default:
                      throw "Do not know mass product for body: " + a;
                  }
                }
                function A(a) {
                  if (!0 !== a && !1 !== a)
                    throw (console.trace(), "Value is not boolean: " + a);
                  return a;
                }
                function w(a) {
                  if (!Number.isFinite(a))
                    throw (
                      console.trace(),
                      "Value is not a finite number: " + a
                    );
                  return a;
                }
                function Q(a) {
                  return a - Math.floor(a);
                }
                function N(a, b) {
                  var c = a.x * a.x + a.y * a.y + a.z * a.z;
                  if (1e-8 > Math.abs(c))
                    throw "AngleBetween: first vector is too short.";
                  var d = b.x * b.x + b.y * b.y + b.z * b.z;
                  if (1e-8 > Math.abs(d))
                    throw "AngleBetween: second vector is too short.";
                  a = (a.x * b.x + a.y * b.y + a.z * b.z) / Math.sqrt(c * d);
                  return -1 >= a ? 180 : 1 <= a ? 0 : e.RAD2DEG * Math.acos(a);
                }
                function T(a) {
                  a = ld.indexOf(a);
                  return 0 <= a ? md[a] : null;
                }
                function ka(a) {
                  return (a = T(a)) && 0 < a.dist ? a : null;
                }
                function sa(a) {
                  var b = 2e3 + (a - 14) / 365.24217;
                  if (-500 > b)
                    return ((a = (b - 1820) / 100), -20 + 32 * a * a);
                  if (500 > b) {
                    a = b / 100;
                    b = a * a;
                    var c = a * b;
                    return (
                      10583.6 -
                      1014.41 * a +
                      33.78311 * b -
                      5.952053 * c -
                      0.1798452 * b * b +
                      0.022174192 * b * c +
                      0.0090316521 * c * c
                    );
                  }
                  if (1600 > b)
                    return (
                      (a = (b - 1e3) / 100),
                      (b = a * a),
                      (c = a * b),
                      1574.2 -
                        556.01 * a +
                        71.23472 * b +
                        0.319781 * c -
                        0.8503463 * b * b -
                        0.005050998 * b * c +
                        0.0083572073 * c * c
                    );
                  if (1700 > b)
                    return (
                      (a = b - 1600),
                      (b = a * a),
                      120 - 0.9808 * a - 0.01532 * b + (a * b) / 7129
                    );
                  if (1800 > b)
                    return (
                      (a = b - 1700),
                      (b = a * a),
                      8.83 +
                        0.1603 * a -
                        0.0059285 * b +
                        1.3336e-4 * a * b -
                        (b * b) / 1174e3
                    );
                  if (1860 > b) {
                    a = b - 1800;
                    b = a * a;
                    c = a * b;
                    var d = b * b;
                    return (
                      13.72 -
                      0.332447 * a +
                      0.0068612 * b +
                      0.0041116 * c -
                      3.7436e-4 * d +
                      1.21272e-5 * b * c -
                      1.699e-7 * c * c +
                      8.75e-10 * c * d
                    );
                  }
                  if (1900 > b)
                    return (
                      (a = b - 1860),
                      (b = a * a),
                      (c = a * b),
                      7.62 +
                        0.5737 * a -
                        0.251754 * b +
                        0.01680668 * c -
                        4.473624e-4 * b * b +
                        (b * c) / 233174
                    );
                  if (1920 > b)
                    return (
                      (a = b - 1900),
                      (b = a * a),
                      -2.79 +
                        1.494119 * a -
                        0.0598939 * b +
                        0.0061966 * a * b -
                        1.97e-4 * b * b
                    );
                  if (1941 > b)
                    return (
                      (a = b - 1920),
                      (b = a * a),
                      21.2 + 0.84493 * a - 0.0761 * b + 0.0020936 * a * b
                    );
                  if (1961 > b)
                    return (
                      (a = b - 1950),
                      (b = a * a),
                      29.07 + 0.407 * a - b / 233 + (a * b) / 2547
                    );
                  if (1986 > b)
                    return (
                      (a = b - 1975),
                      (b = a * a),
                      45.45 + 1.067 * a - b / 260 - (a * b) / 718
                    );
                  if (2005 > b)
                    return (
                      (a = b - 2e3),
                      (b = a * a),
                      (c = a * b),
                      63.86 +
                        0.3345 * a -
                        0.060374 * b +
                        0.0017275 * c +
                        6.51814e-4 * b * b +
                        2.373599e-5 * b * c
                    );
                  if (2050 > b)
                    return (
                      (a = b - 2e3),
                      62.92 + 0.32217 * a + 0.005589 * a * a
                    );
                  if (2150 > b)
                    return (
                      (a = (b - 1820) / 100),
                      -20 + 32 * a * a - 0.5628 * (2150 - b)
                    );
                  a = (b - 1820) / 100;
                  return -20 + 32 * a * a;
                }
                function Vb(a) {
                  return a + Wb(a) / 86400;
                }
                function v(a) {
                  return a instanceof O ? a : new O(a);
                }
                function Xb(a) {
                  a = a.tt / 36525;
                  return (
                    (((((-4.34e-8 * a - 5.76e-7) * a + 0.0020034) * a -
                      1.831e-4) *
                      a -
                      46.836769) *
                      a +
                      84381.406) /
                    3600
                  );
                }
                function da(a) {
                  if (!$a || 1e-6 < Math.abs($a.tt - a.tt)) {
                    var b = a.tt / 36525;
                    var c =
                      ((1287104.79305 + 1.295965810481e8 * b) % 1296e3) *
                      4.84813681109536e-6;
                    var d =
                        ((335779.526232 + 1.7395272628478e9 * b) % 1296e3) *
                        4.84813681109536e-6,
                      f =
                        ((450160.398036 - 6962890.5431 * b) % 1296e3) *
                        4.84813681109536e-6,
                      g = Math.sin(f),
                      h = Math.cos(f),
                      l = (-172064161 - 174666 * b) * g + 33386 * h,
                      k = (92052331 + 9086 * b) * h + 15377 * g;
                    h =
                      2 *
                      (d -
                        ((1072260.70369 + 1.602961601209e9 * b) % 1296e3) *
                          4.84813681109536e-6 +
                        f);
                    g = Math.sin(h);
                    h = Math.cos(h);
                    l += (-13170906 - 1675 * b) * g - 13696 * h;
                    k += (5730336 - 3015 * b) * h - 4587 * g;
                    h = 2 * (d + f);
                    g = Math.sin(h);
                    h = Math.cos(h);
                    l += (-2276413 - 234 * b) * g + 2796 * h;
                    k += (978459 - 485 * b) * h + 1374 * g;
                    h = 2 * f;
                    g = Math.sin(h);
                    h = Math.cos(h);
                    l += (2074554 + 207 * b) * g - 698 * h;
                    k += (-897492 + 470 * b) * h - 291 * g;
                    g = Math.sin(c);
                    h = Math.cos(c);
                    c =
                      -1.35e-4 +
                      1e-7 * (l + ((1475877 - 3633 * b) * g + 11817 * h));
                    b =
                      3.88e-4 + 1e-7 * (k + ((73871 - 184 * b) * h - 1924 * g));
                    g = Xb(a);
                    $a = {
                      tt: a.tt,
                      dpsi: c,
                      deps: b,
                      ee: (c * Math.cos(g * e.DEG2RAD)) / 15,
                      mobl: g,
                      tobl: g + b / 3600,
                    };
                  }
                  return $a;
                }
                function Yb(a, b) {
                  var c = a * e.DEG2RAD;
                  a = Math.cos(c);
                  c = Math.sin(c);
                  return [b[0], b[1] * a - b[2] * c, b[1] * c + b[2] * a];
                }
                function ea(a) {
                  function b(D, G, P, fa) {
                    for (var L = [], ta = 0; ta <= G - D; ++ta) {
                      var ua = L,
                        ub = ua.push,
                        vb,
                        Zb = P,
                        nd = fa,
                        $b = [];
                      for (vb = 0; vb <= nd - Zb; ++vb) $b.push(0);
                      ub.call(ua, { min: Zb, array: $b });
                    }
                    return { min: D, array: L };
                  }
                  function c(D, G, P) {
                    D = D.array[G - D.min];
                    return D.array[P - D.min];
                  }
                  function d(D, G, P) {
                    D = y.array[D - y.min];
                    D.array[G - D.min] = P;
                  }
                  function f(D, G, P) {
                    D = x.array[D - x.min];
                    D.array[G - D.min] = P;
                  }
                  function g(D, G, P, fa, L) {
                    L(D * P - G * fa, G * P + D * fa);
                  }
                  function h(D) {
                    return Math.sin(U * D);
                  }
                  function l(D, G, P, fa) {
                    var L = { x: 1, y: 0 };
                    D = [0, D, G, P, fa];
                    for (G = 1; 4 >= G; ++G)
                      0 !== D[G] &&
                        g(
                          L.x,
                          L.y,
                          c(y, D[G], G),
                          c(x, D[G], G),
                          function (ta, ua) {
                            return ((L.x = ta), (L.y = ua));
                          },
                        );
                    return L;
                  }
                  function k(D, G, P, fa, L, ta, ua, ub) {
                    L = l(L, ta, ua, ub);
                    q += D * L.y;
                    t += G * L.y;
                    ab += P * L.x;
                    va += fa * L.x;
                  }
                  ++e.CalcMoonCount;
                  a = a.tt / 36525;
                  var n,
                    p,
                    q,
                    t,
                    y = b(-6, 6, 1, 4),
                    x = b(-6, 6, 1, 4);
                  var z = a * a;
                  var ab = (t = q = 0);
                  var va = 3422.7;
                  var la = h(0.19833 + 0.05611 * a);
                  var ha = h(0.27869 + 0.04508 * a);
                  var V = h(0.16827 - 0.36903 * a);
                  var ba = h(0.34734 - 5.37261 * a);
                  var La = h(0.10498 - 5.37899 * a);
                  var bb = h(0.42681 - 0.41855 * a),
                    od = h(0.14943 - 5.37511 * a);
                  var cb =
                    0.84 * la +
                    0.31 * ha +
                    14.27 * V +
                    7.26 * ba +
                    0.28 * La +
                    0.24 * bb;
                  var wb =
                    2.94 * la +
                    0.31 * ha +
                    14.27 * V +
                    9.34 * ba +
                    1.12 * La +
                    0.83 * bb;
                  var db = -6.4 * la - 1.89 * bb;
                  ha =
                    0.21 * la +
                    0.31 * ha +
                    14.27 * V -
                    88.7 * ba -
                    15.3 * La +
                    0.24 * bb -
                    1.86 * od;
                  V = cb - db;
                  la =
                    -3.332e-6 * h(0.59734 - 5.37261 * a) -
                    5.39e-7 * h(0.35498 - 5.37899 * a) -
                    6.4e-8 * h(0.39943 - 5.37511 * a);
                  cb =
                    U * Q(0.60643382 + 1336.85522467 * a - 3.13e-6 * z) +
                    cb / ia;
                  wb =
                    U * Q(0.37489701 + 1325.55240982 * a + 2.565e-5 * z) +
                    wb / ia;
                  db =
                    U * Q(0.99312619 + 99.99735956 * a - 4.4e-7 * z) + db / ia;
                  ha =
                    U * Q(0.25909118 + 1342.2278298 * a - 8.92e-6 * z) +
                    ha / ia;
                  La =
                    U * Q(0.82736186 + 1236.85308708 * a - 3.97e-6 * z) +
                    V / ia;
                  for (n = 1; 4 >= n; ++n) {
                    switch (n) {
                      case 1:
                        V = wb;
                        z = 4;
                        ba = 1.000002208;
                        break;
                      case 2:
                        V = db;
                        z = 3;
                        ba = 0.997504612 - 0.002495388 * a;
                        break;
                      case 3:
                        V = ha;
                        z = 4;
                        ba = 1.000002708 + 139.978 * la;
                        break;
                      case 4:
                        V = La;
                        z = 6;
                        ba = 1;
                        break;
                      default:
                        throw "Internal error: I = " + n;
                    }
                    d(0, n, 1);
                    d(1, n, Math.cos(V) * ba);
                    f(0, n, 0);
                    f(1, n, Math.sin(V) * ba);
                    for (p = 2; p <= z; ++p)
                      g(
                        c(y, p - 1, n),
                        c(x, p - 1, n),
                        c(y, 1, n),
                        c(x, 1, n),
                        function (D, G) {
                          return (d(p, n, D), f(p, n, G));
                        },
                      );
                    for (p = 1; p <= z; ++p)
                      (d(-p, n, c(y, p, n)), f(-p, n, -c(x, p, n)));
                  }
                  k(13.902, 14.06, -0.001, 0.2607, 0, 0, 0, 4);
                  k(0.403, -4.01, 0.394, 0.0023, 0, 0, 0, 3);
                  k(2369.912, 2373.36, 0.601, 28.2333, 0, 0, 0, 2);
                  k(-125.154, -112.79, -0.725, -0.9781, 0, 0, 0, 1);
                  k(1.979, 6.98, -0.445, 0.0433, 1, 0, 0, 4);
                  k(191.953, 192.72, 0.029, 3.0861, 1, 0, 0, 2);
                  k(-8.466, -13.51, 0.455, -0.1093, 1, 0, 0, 1);
                  k(22639.5, 22609.07, 0.079, 186.5398, 1, 0, 0, 0);
                  k(18.609, 3.59, -0.094, 0.0118, 1, 0, 0, -1);
                  k(-4586.465, -4578.13, -0.077, 34.3117, 1, 0, 0, -2);
                  k(3.215, 5.44, 0.192, -0.0386, 1, 0, 0, -3);
                  k(-38.428, -38.64, 0.001, 0.6008, 1, 0, 0, -4);
                  k(-0.393, -1.43, -0.092, 0.0086, 1, 0, 0, -6);
                  k(-0.289, -1.59, 0.123, -0.0053, 0, 1, 0, 4);
                  k(-24.42, -25.1, 0.04, -0.3, 0, 1, 0, 2);
                  k(18.023, 17.93, 0.007, 0.1494, 0, 1, 0, 1);
                  k(-668.146, -126.98, -1.302, -0.3997, 0, 1, 0, 0);
                  k(0.56, 0.32, -0.001, -0.0037, 0, 1, 0, -1);
                  k(-165.145, -165.06, 0.054, 1.9178, 0, 1, 0, -2);
                  k(-1.877, -6.46, -0.416, 0.0339, 0, 1, 0, -4);
                  k(0.213, 1.02, -0.074, 0.0054, 2, 0, 0, 4);
                  k(14.387, 14.78, -0.017, 0.2833, 2, 0, 0, 2);
                  k(-0.586, -1.2, 0.054, -0.01, 2, 0, 0, 1);
                  k(769.016, 767.96, 0.107, 10.1657, 2, 0, 0, 0);
                  k(1.75, 2.01, -0.018, 0.0155, 2, 0, 0, -1);
                  k(-211.656, -152.53, 5.679, -0.3039, 2, 0, 0, -2);
                  k(1.225, 0.91, -0.03, -0.0088, 2, 0, 0, -3);
                  k(-30.773, -34.07, -0.308, 0.3722, 2, 0, 0, -4);
                  k(-0.57, -1.4, -0.074, 0.0109, 2, 0, 0, -6);
                  k(-2.921, -11.75, 0.787, -0.0484, 1, 1, 0, 2);
                  k(1.267, 1.52, -0.022, 0.0164, 1, 1, 0, 1);
                  k(-109.673, -115.18, 0.461, -0.949, 1, 1, 0, 0);
                  k(-205.962, -182.36, 2.056, 1.4437, 1, 1, 0, -2);
                  k(0.233, 0.36, 0.012, -0.0025, 1, 1, 0, -3);
                  k(-4.391, -9.66, -0.471, 0.0673, 1, 1, 0, -4);
                  k(0.283, 1.53, -0.111, 0.006, 1, -1, 0, 4);
                  k(14.577, 31.7, -1.54, 0.2302, 1, -1, 0, 2);
                  k(147.687, 138.76, 0.679, 1.1528, 1, -1, 0, 0);
                  k(-1.089, 0.55, 0.021, 0, 1, -1, 0, -1);
                  k(28.475, 23.59, -0.443, -0.2257, 1, -1, 0, -2);
                  k(-0.276, -0.38, -0.006, -0.0036, 1, -1, 0, -3);
                  k(0.636, 2.27, 0.146, -0.0102, 1, -1, 0, -4);
                  k(-0.189, -1.68, 0.131, -0.0028, 0, 2, 0, 2);
                  k(-7.486, -0.66, -0.037, -0.0086, 0, 2, 0, 0);
                  k(-8.096, -16.35, -0.74, 0.0918, 0, 2, 0, -2);
                  k(-5.741, -0.04, 0, -9e-4, 0, 0, 2, 2);
                  k(0.255, 0, 0, 0, 0, 0, 2, 1);
                  k(-411.608, -0.2, 0, -0.0124, 0, 0, 2, 0);
                  k(0.584, 0.84, 0, 0.0071, 0, 0, 2, -1);
                  k(-55.173, -52.14, 0, -0.1052, 0, 0, 2, -2);
                  k(0.254, 0.25, 0, -0.0017, 0, 0, 2, -3);
                  k(0.025, -1.67, 0, 0.0031, 0, 0, 2, -4);
                  k(1.06, 2.96, -0.166, 0.0243, 3, 0, 0, 2);
                  k(36.124, 50.64, -1.3, 0.6215, 3, 0, 0, 0);
                  k(-13.193, -16.4, 0.258, -0.1187, 3, 0, 0, -2);
                  k(-1.187, -0.74, 0.042, 0.0074, 3, 0, 0, -4);
                  k(-0.293, -0.31, -0.002, 0.0046, 3, 0, 0, -6);
                  k(-0.29, -1.45, 0.116, -0.0051, 2, 1, 0, 2);
                  k(-7.649, -10.56, 0.259, -0.1038, 2, 1, 0, 0);
                  k(-8.627, -7.59, 0.078, -0.0192, 2, 1, 0, -2);
                  k(-2.74, -2.54, 0.022, 0.0324, 2, 1, 0, -4);
                  k(1.181, 3.32, -0.212, 0.0213, 2, -1, 0, 2);
                  k(9.703, 11.67, -0.151, 0.1268, 2, -1, 0, 0);
                  k(-0.352, -0.37, 0.001, -0.0028, 2, -1, 0, -1);
                  k(-2.494, -1.17, -0.003, -0.0017, 2, -1, 0, -2);
                  k(0.36, 0.2, -0.012, -0.0043, 2, -1, 0, -4);
                  k(-1.167, -1.25, 0.008, -0.0106, 1, 2, 0, 0);
                  k(-7.412, -6.12, 0.117, 0.0484, 1, 2, 0, -2);
                  k(-0.311, -0.65, -0.032, 0.0044, 1, 2, 0, -4);
                  k(0.757, 1.82, -0.105, 0.0112, 1, -2, 0, 2);
                  k(2.58, 2.32, 0.027, 0.0196, 1, -2, 0, 0);
                  k(2.533, 2.4, -0.014, -0.0212, 1, -2, 0, -2);
                  k(-0.344, -0.57, -0.025, 0.0036, 0, 3, 0, -2);
                  k(-0.992, -0.02, 0, 0, 1, 0, 2, 2);
                  k(-45.099, -0.02, 0, -0.001, 1, 0, 2, 0);
                  k(-0.179, -9.52, 0, -0.0833, 1, 0, 2, -2);
                  k(-0.301, -0.33, 0, 0.0014, 1, 0, 2, -4);
                  k(-6.382, -3.37, 0, -0.0481, 1, 0, -2, 2);
                  k(39.528, 85.13, 0, -0.7136, 1, 0, -2, 0);
                  k(9.366, 0.71, 0, -0.0112, 1, 0, -2, -2);
                  k(0.202, 0.02, 0, 0, 1, 0, -2, -4);
                  k(0.415, 0.1, 0, 0.0013, 0, 1, 2, 0);
                  k(-2.152, -2.26, 0, -0.0066, 0, 1, 2, -2);
                  k(-1.44, -1.3, 0, 0.0014, 0, 1, -2, 2);
                  k(0.384, -0.04, 0, 0, 0, 1, -2, -2);
                  k(1.938, 3.6, -0.145, 0.0401, 4, 0, 0, 0);
                  k(-0.952, -1.58, 0.052, -0.013, 4, 0, 0, -2);
                  k(-0.551, -0.94, 0.032, -0.0097, 3, 1, 0, 0);
                  k(-0.482, -0.57, 0.005, -0.0045, 3, 1, 0, -2);
                  k(0.681, 0.96, -0.026, 0.0115, 3, -1, 0, 0);
                  k(-0.297, -0.27, 0.002, -9e-4, 2, 2, 0, -2);
                  k(0.254, 0.21, -0.003, 0, 2, -2, 0, -2);
                  k(-0.25, -0.22, 0.004, 0.0014, 1, 3, 0, -2);
                  k(-3.996, 0, 0, 4e-4, 2, 0, 2, 0);
                  k(0.557, -0.75, 0, -0.009, 2, 0, 2, -2);
                  k(-0.459, -0.38, 0, -0.0053, 2, 0, -2, 2);
                  k(-1.298, 0.74, 0, 4e-4, 2, 0, -2, 0);
                  k(0.538, 1.14, 0, -0.0141, 2, 0, -2, -2);
                  k(0.263, 0.02, 0, 0, 1, 1, 2, 0);
                  k(0.426, 0.07, 0, -6e-4, 1, 1, -2, -2);
                  k(-0.304, 0.03, 0, 3e-4, 1, -1, 2, 0);
                  k(-0.372, -0.19, 0, -0.0027, 1, -1, -2, 2);
                  k(0.418, 0, 0, 0, 0, 0, 4, 0);
                  k(-0.33, -0.04, 0, 0, 3, 0, 2, 0);
                  z = -526.069 * l(0, 0, 1, -2).y;
                  z += -3.352 * l(0, 0, 1, -4).y;
                  z += 44.297 * l(1, 0, 1, -2).y;
                  z += -6 * l(1, 0, 1, -4).y;
                  z += 20.599 * l(-1, 0, 1, 0).y;
                  z += -30.598 * l(-1, 0, 1, -2).y;
                  z += -24.649 * l(-2, 0, 1, 0).y;
                  z += -2 * l(-2, 0, 1, -2).y;
                  z += -22.571 * l(0, 1, 1, -2).y;
                  z += 10.985 * l(0, -1, 1, -2).y;
                  q +=
                    0.82 * h(0.7736 - 62.5512 * a) +
                    0.31 * h(0.0466 - 125.1025 * a) +
                    0.35 * h(0.5785 - 25.1042 * a) +
                    0.66 * h(0.4591 + 1335.8075 * a) +
                    0.64 * h(0.313 - 91.568 * a) +
                    1.14 * h(0.148 + 1331.2898 * a) +
                    0.21 * h(0.5918 + 1056.5859 * a) +
                    0.44 * h(0.5784 + 1322.8595 * a) +
                    0.24 * h(0.2275 - 5.7374 * a) +
                    0.28 * h(0.2965 + 2.6929 * a) +
                    0.33 * h(0.3132 + 6.3368 * a);
                  a = ha + t / ia;
                  a =
                    (1.000002708 + 139.978 * la) *
                      (18518.511 + 1.189 + ab) *
                      Math.sin(a) -
                    6.24 * Math.sin(3 * a) +
                    z;
                  return {
                    geo_eclip_lon: U * Q((cb + q / ia) / U),
                    geo_eclip_lat: (Math.PI / 648e3) * a,
                    distance_au: (ia * pd) / (0.999953253 * va),
                  };
                }
                function ac(a, b) {
                  return [
                    a.rot[0][0] * b[0] +
                      a.rot[1][0] * b[1] +
                      a.rot[2][0] * b[2],
                    a.rot[0][1] * b[0] +
                      a.rot[1][1] * b[1] +
                      a.rot[2][1] * b[2],
                    a.rot[0][2] * b[0] +
                      a.rot[1][2] * b[1] +
                      a.rot[2][2] * b[2],
                  ];
                }
                function wa(a, b, c) {
                  b = Ma(b, c);
                  return ac(b, a);
                }
                function Ma(a, b) {
                  a = a.tt / 36525;
                  var c = 84381.406,
                    d =
                      ((((3.337e-7 * a - 4.67e-7) * a - 0.00772503) * a +
                        0.0512623) *
                        a -
                        0.025754) *
                        a +
                      c;
                  c *= 4.84813681109536e-6;
                  var f =
                    ((((-9.51e-8 * a + 1.32851e-4) * a - 0.00114045) * a -
                      1.0790069) *
                      a +
                      5038.481507) *
                    a *
                    4.84813681109536e-6;
                  d *= 4.84813681109536e-6;
                  var g =
                    ((((-5.6e-8 * a + 1.70663e-4) * a - 0.00121197) * a -
                      2.3814292) *
                      a +
                      10.556403) *
                    a *
                    4.84813681109536e-6;
                  a = Math.sin(c);
                  c = Math.cos(c);
                  var h = Math.sin(-f);
                  f = Math.cos(-f);
                  var l = Math.sin(-d);
                  d = Math.cos(-d);
                  var k = Math.sin(g),
                    n = Math.cos(g);
                  g = n * f - h * k * d;
                  var p = n * h * c + k * d * f * c - a * k * l,
                    q = n * h * a + k * d * f * a + c * k * l,
                    t = -k * f - h * n * d,
                    y = -k * h * c + n * d * f * c - a * n * l;
                  k = -k * h * a + n * d * f * a + c * n * l;
                  h *= l;
                  n = -l * f * c - a * d;
                  a = -l * f * a + d * c;
                  if (b === F.Into2000)
                    return new J([
                      [g, p, q],
                      [t, y, k],
                      [h, n, a],
                    ]);
                  if (b === F.From2000)
                    return new J([
                      [g, t, h],
                      [p, y, n],
                      [q, k, a],
                    ]);
                  throw "Invalid precess direction";
                }
                function ca(a) {
                  if (!eb || eb.tt !== a.tt) {
                    var b = a.tt / 36525,
                      c = 15 * da(a).ee,
                      d =
                        ((0.779057273264 +
                          0.00273781191135448 * a.ut +
                          (a.ut % 1)) %
                          1) *
                        360;
                    0 > d && (d += 360);
                    b =
                      (((c +
                        0.014506 +
                        ((((-3.68e-8 * b - 2.9956e-5) * b - 4.4e-7) * b +
                          1.3915817) *
                          b +
                          4612.156534) *
                          b) /
                        3600 +
                        d) %
                        360) /
                      15;
                    0 > b && (b += 24);
                    eb = { tt: a.tt, st: b };
                  }
                  return eb.st;
                }
                function bc(a) {
                  a = v(a);
                  return ca(a);
                }
                function xb(a, b) {
                  var c = a.latitude * e.DEG2RAD,
                    d = Math.sin(c);
                  c = Math.cos(c);
                  var f = 1 / Math.hypot(c, 0.996647180302104 * d),
                    g = a.height / 1e3,
                    h = 6378.1366 * f + g;
                  b = (15 * b + a.longitude) * e.DEG2RAD;
                  a = Math.sin(b);
                  b = Math.cos(b);
                  return {
                    pos: [
                      (h * c * b) / e.KM_PER_AU,
                      (h * c * a) / e.KM_PER_AU,
                      ((6335.438815127603 * f + g) * d) / e.KM_PER_AU,
                    ],
                    vel: [
                      (-7.292115e-5 * h * c * a * 86400) / e.KM_PER_AU,
                      (7.292115e-5 * h * c * b * 86400) / e.KM_PER_AU,
                      0,
                    ],
                  };
                }
                function xa(a, b, c) {
                  b = Na(b, c);
                  return ac(b, a);
                }
                function Na(a, b) {
                  a = da(a);
                  var c = a.mobl * e.DEG2RAD,
                    d = a.tobl * e.DEG2RAD,
                    f = 4.84813681109536e-6 * a.dpsi;
                  a = Math.cos(c);
                  c = Math.sin(c);
                  var g = Math.cos(d),
                    h = Math.sin(d);
                  d = Math.cos(f);
                  var l = Math.sin(f);
                  f = -l * a;
                  var k = -l * c,
                    n = l * g,
                    p = d * a * g + c * h,
                    q = d * c * g - a * h;
                  l *= h;
                  var t = d * a * h - c * g;
                  a = d * c * h + a * g;
                  if (b === F.From2000)
                    return new J([
                      [d, n, l],
                      [f, p, t],
                      [k, q, a],
                    ]);
                  if (b === F.Into2000)
                    return new J([
                      [d, f, k],
                      [n, p, q],
                      [l, t, a],
                    ]);
                  throw "Invalid precess direction";
                }
                function fb(a, b, c) {
                  return c === F.Into2000
                    ? wa(xa(a, b, c), b, c)
                    : xa(wa(a, b, c), b, c);
                }
                function cc(a, b) {
                  var c = ca(a);
                  b = xb(b, c).pos;
                  return fb(b, a, F.Into2000);
                }
                function qd(a) {
                  if (!(a instanceof Array) || 3 !== a.length) return !1;
                  for (var b = 0; 3 > b; ++b) {
                    if (!(a[b] instanceof Array) || 3 !== a[b].length)
                      return !1;
                    for (var c = 0; 3 > c; ++c)
                      if (!Number.isFinite(a[b][c])) return !1;
                  }
                  return !0;
                }
                function yb(a, b) {
                  return new E(a[0], a[1], a[2], b);
                }
                function dc(a, b) {
                  b = yb(a, b);
                  var c = b.x * b.x + b.y * b.y,
                    d = Math.sqrt(c + b.z * b.z);
                  if (0 === c) {
                    if (0 === b.z) throw "Indeterminate sky coordinates";
                    return new gb(0, 0 > b.z ? -90 : 90, d, b);
                  }
                  var f = e.RAD2HOUR * Math.atan2(b.y, b.x);
                  0 > f && (f += 24);
                  return new gb(
                    f,
                    e.RAD2DEG * Math.atan2(a[2], Math.sqrt(c)),
                    d,
                    b,
                  );
                }
                function ya(a, b) {
                  var c = a * e.DEG2RAD;
                  a = Math.cos(c);
                  c = Math.sin(c);
                  return [a * b[0] + c * b[1], a * b[1] - c * b[0], b[2]];
                }
                function hb(a, b, c, d, f) {
                  a = v(a);
                  za(b);
                  w(c);
                  w(d);
                  var g = Math.sin(b.latitude * e.DEG2RAD),
                    h = Math.cos(b.latitude * e.DEG2RAD),
                    l = Math.sin(b.longitude * e.DEG2RAD),
                    k = Math.cos(b.longitude * e.DEG2RAD);
                  b = Math.sin(d * e.DEG2RAD);
                  var n = Math.cos(d * e.DEG2RAD),
                    p = Math.sin(c * e.HOUR2RAD),
                    q = Math.cos(c * e.HOUR2RAD),
                    t = [h * k, h * l, g];
                  g = [-g * k, -g * l, h];
                  l = [l, -k, 0];
                  h = -15 * ca(a);
                  a = ya(h, t);
                  t = ya(h, g);
                  l = ya(h, l);
                  b = [n * q, n * p, b];
                  p = b[0] * a[0] + b[1] * a[1] + b[2] * a[2];
                  n = b[0] * t[0] + b[1] * t[1] + b[2] * t[2];
                  t = b[0] * l[0] + b[1] * l[1] + b[2] * l[2];
                  q = Math.hypot(n, t);
                  0 < q
                    ? ((n = -e.RAD2DEG * Math.atan2(t, n)), 0 > n && (n += 360))
                    : (n = 0);
                  p = e.RAD2DEG * Math.atan2(q, p);
                  q = d;
                  if (
                    f &&
                    ((d = p), (f = Oa(f, 90 - p)), (p -= f), 0 < f && 3e-4 < p)
                  ) {
                    c = Math.sin(p * e.DEG2RAD);
                    q = Math.cos(p * e.DEG2RAD);
                    t = Math.sin(d * e.DEG2RAD);
                    d = Math.cos(d * e.DEG2RAD);
                    f = [];
                    for (l = 0; 3 > l; ++l)
                      f.push(((b[l] - d * a[l]) / t) * c + a[l] * q);
                    q = Math.hypot(f[0], f[1]);
                    0 < q
                      ? ((c = e.RAD2HOUR * Math.atan2(f[1], f[0])),
                        0 > c && (c += 24))
                      : (c = 0);
                    q = e.RAD2DEG * Math.atan2(f[2], q);
                  }
                  return new ec(n, 90 - p, c, q);
                }
                function za(a) {
                  if (!(a instanceof zb))
                    throw "Not an instance of the Observer class: " + a;
                  w(a.latitude);
                  w(a.longitude);
                  w(a.height);
                  if (-90 > a.latitude || 90 < a.latitude)
                    throw (
                      "Latitude " +
                      a.latitude +
                      " is out of range. Must be -90..+90."
                    );
                  return a;
                }
                function fc(a) {
                  a = v(a).AddDays(-1 / e.C_AUDAY);
                  var b = Aa(M.Earth, a),
                    c = $jscomp.makeIterator(
                      fb([-b.x, -b.y, -b.z], a, F.From2000),
                    );
                  b = c.next().value;
                  var d = c.next().value,
                    f = c.next().value,
                    g = e.DEG2RAD * da(a).tobl;
                  c = Math.cos(g);
                  g = Math.sin(g);
                  a = new E(b, d, f, a);
                  return Ab(a, c, g);
                }
                function Pa(a, b, c, d, f) {
                  za(c);
                  A(d);
                  A(f);
                  b = v(b);
                  c = cc(b, c);
                  a = W(a, b, f);
                  a = [a.x - c[0], a.y - c[1], a.z - c[2]];
                  if (!d) return dc(a, b);
                  d = fb(a, b, F.From2000);
                  return dc(d, b);
                }
                function Ab(a, b, c) {
                  var d = a.x,
                    f = a.y * b + a.z * c;
                  c = -a.y * c + a.z * b;
                  var g = Math.hypot(d, f);
                  b = 0;
                  0 < g &&
                    ((b = e.RAD2DEG * Math.atan2(f, d)), 0 > b && (b += 360));
                  g = e.RAD2DEG * Math.atan2(c, g);
                  a = new E(d, f, c, a.t);
                  return new gc(a, g, b);
                }
                function Qa(a) {
                  var b = da(a.t),
                    c = wa([a.x, a.y, a.z], a.t, F.From2000),
                    d = $jscomp.makeIterator(xa(c, a.t, F.From2000));
                  c = d.next().value;
                  var f = d.next().value;
                  d = d.next().value;
                  a = new E(c, f, d, a.t);
                  b = b.tobl * e.DEG2RAD;
                  return Ab(a, Math.cos(b), Math.sin(b));
                }
                function Y(a) {
                  a = v(a);
                  var b = ea(a),
                    c = b.distance_au * Math.cos(b.geo_eclip_lat);
                  b = [
                    c * Math.cos(b.geo_eclip_lon),
                    c * Math.sin(b.geo_eclip_lon),
                    b.distance_au * Math.sin(b.geo_eclip_lat),
                  ];
                  b = Yb(Xb(a), b);
                  b = wa(b, a, F.Into2000);
                  return new E(b[0], b[1], b[2], a);
                }
                function ib(a) {
                  var b = v(a);
                  a = ea(b);
                  var c = a.distance_au * Math.cos(a.geo_eclip_lat),
                    d = [
                      c * Math.cos(a.geo_eclip_lon),
                      c * Math.sin(a.geo_eclip_lon),
                      a.distance_au * Math.sin(a.geo_eclip_lat),
                    ];
                  c = da(b);
                  d = Yb(c.mobl, d);
                  d = xa(d, b, F.From2000);
                  b = yb(d, b);
                  c = c.tobl * e.DEG2RAD;
                  b = Ab(b, Math.cos(c), Math.sin(c));
                  return new Ba(b.elat, b.elon, a.distance_au);
                }
                function Ra(a) {
                  a = v(a);
                  var b = a.AddDays(-1e-5),
                    c = a.AddDays(1e-5);
                  b = Y(b);
                  c = Y(c);
                  return new I(
                    (b.x + c.x) / 2,
                    (b.y + c.y) / 2,
                    (b.z + c.z) / 2,
                    (c.x - b.x) / 2e-5,
                    (c.y - b.y) / 2e-5,
                    (c.z - b.z) / 2e-5,
                    a,
                  );
                }
                function Bb(a) {
                  a = v(a);
                  var b = Ra(a);
                  return new I(
                    b.x / 82.30056,
                    b.y / 82.30056,
                    b.z / 82.30056,
                    b.vx / 82.30056,
                    b.vy / 82.30056,
                    b.vz / 82.30056,
                    a,
                  );
                }
                function ma(a, b, c) {
                  var d = 1,
                    f = 0;
                  a = $jscomp.makeIterator(a);
                  for (var g = a.next(); !g.done; g = a.next()) {
                    var h = 0;
                    g = $jscomp.makeIterator(g.value);
                    for (var l = g.next(); !l.done; l = g.next()) {
                      var k = $jscomp.makeIterator(l.value);
                      l = k.next().value;
                      var n = k.next().value;
                      k = k.next().value;
                      h += l * Math.cos(n + b * k);
                    }
                    h *= d;
                    c && (h %= U);
                    f += h;
                    d *= b;
                  }
                  return f;
                }
                function Cb(a, b) {
                  var c = 1,
                    d = 0,
                    f = 0,
                    g = 0;
                  a = $jscomp.makeIterator(a);
                  for (var h = a.next(); !h.done; h = a.next()) {
                    var l = 0,
                      k = 0;
                    h = $jscomp.makeIterator(h.value);
                    for (var n = h.next(); !n.done; n = h.next()) {
                      var p = $jscomp.makeIterator(n.value);
                      n = p.next().value;
                      var q = p.next().value;
                      p = p.next().value;
                      q += b * p;
                      l += n * p * Math.sin(q);
                      0 < g && (k += n * Math.cos(q));
                    }
                    f += g * d * k - c * l;
                    d = c;
                    c *= b;
                    ++g;
                  }
                  return f;
                }
                function Db(a) {
                  return new B(
                    a[0] + 4.4036e-7 * a[1] - 1.90919e-7 * a[2],
                    -4.79966e-7 * a[0] +
                      0.917482137087 * a[1] -
                      0.397776982902 * a[2],
                    0.397776982902 * a[1] + 0.917482137087 * a[2],
                  );
                }
                function hc(a, b, c) {
                  var d = c * Math.cos(b);
                  return [d * Math.cos(a), d * Math.sin(a), c * Math.sin(b)];
                }
                function Aa(a, b) {
                  var c = b.tt / 365250,
                    d = ma(a[0], c, !0),
                    f = ma(a[1], c, !1);
                  a = ma(a[2], c, !1);
                  d = hc(d, f, a);
                  return Db(d).ToAstroVector(b);
                }
                function Sa(a, b) {
                  var c = b / 365250,
                    d = ma(a[0], c, !0),
                    f = ma(a[1], c, !1),
                    g = ma(a[2], c, !1),
                    h = Cb(a[0], c),
                    l = Cb(a[1], c);
                  c = Cb(a[2], c);
                  var k = Math.cos(d),
                    n = Math.sin(d),
                    p = Math.cos(f),
                    q = Math.sin(f);
                  a = +(c * p * k) - g * q * k * l - g * p * n * h;
                  h = +(c * p * n) - g * q * n * l + g * p * k * h;
                  l = +(c * q) + g * p * l;
                  d = hc(d, f, g);
                  f = [a / 365250, h / 365250, l / 365250];
                  d = Db(d);
                  f = Db(f);
                  return new X(b, d, f);
                }
                function jb(a, b, c, d) {
                  d /= d + 2.959122082855911e-4;
                  b = Aa(M[c], b);
                  a.x += d * b.x;
                  a.y += d * b.y;
                  a.z += d * b.z;
                }
                function R(a, b, c, d) {
                  d /= d + 2.959122082855911e-4;
                  b = Sa(M[c], b);
                  a.r.incr(b.r.mul(d));
                  a.v.incr(b.v.mul(d));
                  return b;
                }
                function Ta(a, b, c) {
                  a = c.sub(a);
                  c = a.quadrature();
                  return a.mul(b / (c * Math.sqrt(c)));
                }
                function Ca(a, b, c, d) {
                  return new B(
                    b.x + a * (c.x + (a * d.x) / 2),
                    b.y + a * (c.y + (a * d.y) / 2),
                    b.z + a * (c.z + (a * d.z) / 2),
                  );
                }
                function Eb(a, b, c) {
                  return new B(b.x + a * c.x, b.y + a * c.y, b.z + a * c.z);
                }
                function Fb(a, b) {
                  var c = a - b.tt,
                    d = new Da(a),
                    f = Ca(c, b.r, b.v, b.a),
                    g = d.Acceleration(f).mean(b.a);
                  f = Ca(c, b.r, b.v, g);
                  b = b.v.add(g.mul(c));
                  c = d.Acceleration(f);
                  a = new Ua(a, f, b, c);
                  return new ic(d, a);
                }
                function jc(a, b) {
                  a = Math.floor(a);
                  return 0 > a ? 0 : a >= b ? b - 1 : a;
                }
                function Gb(a) {
                  var b = $jscomp.makeIterator(a);
                  a = b.next().value;
                  var c = $jscomp.makeIterator(b.next().value);
                  var d = c.next().value;
                  var f = c.next().value;
                  c = c.next().value;
                  var g = $jscomp.makeIterator(b.next().value);
                  b = g.next().value;
                  var h = g.next().value;
                  g = g.next().value;
                  d = new X(a, new B(d, f, c), new B(b, h, g));
                  a = new Da(d.tt);
                  f = d.r.add(a.Sun.r);
                  c = d.v.add(a.Sun.v);
                  b = a.Acceleration(f);
                  d = new Ua(d.tt, f, c, b);
                  return new ic(a, d);
                }
                function kc(a, b, c) {
                  a = Gb(a);
                  for (
                    var d = Math.ceil((b - a.grav.tt) / c), f = 0;
                    f < d;
                    ++f
                  )
                    a = Fb(f + 1 === d ? b : a.grav.tt + c, a.grav);
                  return a;
                }
                function Hb(a, b) {
                  var c = a.tt;
                  var d = na[0][0];
                  if (c < d || c > na[50][0]) c = null;
                  else {
                    c = jc((c - d) / 29200, 50);
                    if (!Ib[c]) {
                      d = Ib[c] = [];
                      d[0] = Gb(na[c]).grav;
                      d[200] = Gb(na[c + 1]).grav;
                      var f,
                        g = d[0].tt;
                      for (f = 1; 200 > f; ++f)
                        d[f] = Fb((g += 146), d[f - 1]).grav;
                      g = d[200].tt;
                      var h = [];
                      h[200] = d[200];
                      for (f = 199; 0 < f; --f)
                        h[f] = Fb((g -= 146), h[f + 1]).grav;
                      for (f = 199; 0 < f; --f)
                        ((g = f / 200),
                          (d[f].r = d[f].r.mul(1 - g).add(h[f].r.mul(g))),
                          (d[f].v = d[f].v.mul(1 - g).add(h[f].v.mul(g))),
                          (d[f].a = d[f].a.mul(1 - g).add(h[f].a.mul(g))));
                    }
                    c = Ib[c];
                  }
                  if ((d = c)) {
                    f = jc((a.tt - d[0].tt) / 146, 200);
                    c = d[f];
                    g = d[f + 1];
                    var l = c.a.mean(g.a);
                    f = Ca(a.tt - c.tt, c.r, c.v, l);
                    d = Eb(a.tt - c.tt, c.v, l);
                    h = Ca(a.tt - g.tt, g.r, g.v, l);
                    g = Eb(a.tt - g.tt, g.v, l);
                    l = (a.tt - c.tt) / 146;
                    c = f.mul(1 - l).add(h.mul(l));
                    d = d.mul(1 - l).add(g.mul(l));
                  } else {
                    var k =
                      a.tt < na[0][0]
                        ? kc(na[0], a.tt, -146)
                        : kc(na[50], a.tt, 146);
                    c = k.grav.r;
                    d = k.grav.v;
                    k = k.bary;
                  }
                  b &&
                    (k || (k = new Da(a.tt)),
                    (c = c.sub(k.Sun.r)),
                    (d = d.sub(k.Sun.v)));
                  return new I(c.x, c.y, c.z, d.x, d.y, d.z, a);
                }
                function kb(a, b) {
                  for (
                    var c = a.tt + 18262.5,
                      d = [0, b.al[0] + c * b.al[1], 0, 0, 0, 0],
                      f = $jscomp.makeIterator(b.a),
                      g = f.next();
                    !g.done;
                    g = f.next()
                  ) {
                    var h = $jscomp.makeIterator(g.value);
                    g = h.next().value;
                    var l = h.next().value;
                    h = h.next().value;
                    d[0] += g * Math.cos(l + c * h);
                  }
                  f = $jscomp.makeIterator(b.l);
                  for (g = f.next(); !g.done; g = f.next())
                    ((h = $jscomp.makeIterator(g.value)),
                      (g = h.next().value),
                      (l = h.next().value),
                      (h = h.next().value),
                      (d[1] += g * Math.sin(l + c * h)));
                  d[1] %= U;
                  0 > d[1] && (d[1] += U);
                  f = $jscomp.makeIterator(b.z);
                  for (g = f.next(); !g.done; g = f.next())
                    ((h = $jscomp.makeIterator(g.value)),
                      (g = h.next().value),
                      (l = h.next().value),
                      (h = h.next().value),
                      (l += c * h),
                      (d[2] += g * Math.cos(l)),
                      (d[3] += g * Math.sin(l)));
                  f = $jscomp.makeIterator(b.zeta);
                  for (g = f.next(); !g.done; g = f.next())
                    ((h = $jscomp.makeIterator(g.value)),
                      (g = h.next().value),
                      (l = h.next().value),
                      (h = h.next().value),
                      (l += c * h),
                      (d[4] += g * Math.cos(l)),
                      (d[5] += g * Math.sin(l)));
                  f = d[0];
                  h = d[1];
                  g = d[2];
                  l = d[3];
                  c = d[4];
                  d = d[5];
                  var k = Math.sqrt(b.mu / (f * f * f));
                  b = h + g * Math.sin(h) - l * Math.cos(h);
                  do {
                    var n = Math.cos(b);
                    var p = Math.sin(b);
                    n = (h - b + g * p - l * n) / (1 - g * n - l * p);
                    b += n;
                  } while (1e-12 <= Math.abs(n));
                  n = Math.cos(b);
                  p = Math.sin(b);
                  h = l * n - g * p;
                  var q = -g * n - l * p,
                    t = 1 / (1 + q),
                    y = 1 / (1 + Math.sqrt(1 - g * g - l * l));
                  b = f * (n - g - y * l * h);
                  h = f * (p - l + y * g * h);
                  l = k * t * f * (-p - y * l * q);
                  f = k * t * f * (+n + y * g * q);
                  g = 2 * Math.sqrt(1 - c * c - d * d);
                  k = 1 - 2 * d * d;
                  n = 1 - 2 * c * c;
                  p = 2 * d * c;
                  a = new I(
                    b * k + h * p,
                    b * p + h * n,
                    (c * h - b * d) * g,
                    l * k + f * p,
                    l * p + f * n,
                    (c * f - l * d) * g,
                    a,
                  );
                  return Ea(rd, a);
                }
                function Z(a, b) {
                  b = v(b);
                  if (a in M) return Aa(M[a], b);
                  if (a === m.Pluto)
                    return ((a = Hb(b, !0)), new E(a.x, a.y, a.z, b));
                  if (a === m.Sun) return new E(0, 0, 0, b);
                  if (a === m.Moon) {
                    a = Aa(M.Earth, b);
                    var c = Y(b);
                    return new E(a.x + c.x, a.y + c.y, a.z + c.z, b);
                  }
                  if (a === m.EMB)
                    return (
                      (a = Aa(M.Earth, b)),
                      (c = Y(b)),
                      new E(
                        a.x + c.x / 82.30056,
                        a.y + c.y / 82.30056,
                        a.z + c.z / 82.30056,
                        b,
                      )
                    );
                  if (a === m.SSB)
                    return (
                      (a = new E(0, 0, 0, b)),
                      jb(a, b, m.Jupiter, 2.825345909524226e-7),
                      jb(a, b, m.Saturn, 8.459715185680659e-8),
                      jb(a, b, m.Uranus, 1.292024916781969e-8),
                      jb(a, b, m.Neptune, 1.524358900784276e-8),
                      a
                    );
                  if ((c = ka(a)))
                    return ((a = new Ba(c.dec, 15 * c.ra, c.dist)), lb(a, b));
                  throw 'HelioVector: Unknown body "' + a + '"';
                }
                function oa(a, b) {
                  var c = ka(a);
                  if (c) return c.dist;
                  b = v(b);
                  return a in M
                    ? ma(M[a][2], b.tt / 365250, !1)
                    : Z(a, b).Length();
                }
                function lc(a, b) {
                  for (var c = b, d = 0, f = 0; 10 > f; ++f) {
                    var g = a(c);
                    d = g.Length() / e.C_AUDAY;
                    if (1 < d)
                      throw "Object is too distant for light-travel solver.";
                    var h = b.AddDays(-d);
                    d = Math.abs(h.tt - c.tt);
                    if (1e-9 > d) return g;
                    c = h;
                  }
                  throw "Light-travel time solver did not converge: dt = " + d;
                }
                function mc(a, b, c, d) {
                  A(d);
                  a = v(a);
                  if (ka(c)) {
                    c = Z(c, a);
                    if (d)
                      return (
                        (b = mb(b, a)),
                        (d = new E(c.x - b.x, c.y - b.y, c.z - b.z, a)),
                        (c = e.C_AUDAY / d.Length()),
                        new E(d.x + b.vx / c, d.y + b.vy / c, d.z + b.vz / c, a)
                      );
                    b = Z(b, a);
                    return new E(c.x - b.x, c.y - b.y, c.z - b.z, a);
                  }
                  var f = d ? new E(0, 0, 0, a) : Z(b, a);
                  var g = new nc(b, c, d, f);
                  return lc(function (h) {
                    return g.Position(h);
                  }, a);
                }
                function W(a, b, c) {
                  A(c);
                  b = v(b);
                  switch (a) {
                    case m.Earth:
                      return new E(0, 0, 0, b);
                    case m.Moon:
                      return Y(b);
                    default:
                      return ((a = mc(b, m.Earth, a, c)), (a.t = b), a);
                  }
                }
                function pa(a, b) {
                  return new I(a.r.x, a.r.y, a.r.z, a.v.x, a.v.y, a.v.z, b);
                }
                function mb(a, b) {
                  b = v(b);
                  switch (a) {
                    case m.Sun:
                      return new I(0, 0, 0, 0, 0, 0, b);
                    case m.SSB:
                      return (
                        (a = new Da(b.tt)),
                        new I(
                          -a.Sun.r.x,
                          -a.Sun.r.y,
                          -a.Sun.r.z,
                          -a.Sun.v.x,
                          -a.Sun.v.y,
                          -a.Sun.v.z,
                          b,
                        )
                      );
                    case m.Mercury:
                    case m.Venus:
                    case m.Earth:
                    case m.Mars:
                    case m.Jupiter:
                    case m.Saturn:
                    case m.Uranus:
                    case m.Neptune:
                      return ((a = Sa(M[a], b.tt)), pa(a, b));
                    case m.Pluto:
                      return Hb(b, !0);
                    case m.Moon:
                    case m.EMB:
                      var c = Sa(M.Earth, b.tt);
                      a = a == m.Moon ? Ra(b) : Bb(b);
                      return new I(
                        a.x + c.r.x,
                        a.y + c.r.y,
                        a.z + c.r.z,
                        a.vx + c.v.x,
                        a.vy + c.v.y,
                        a.vz + c.v.z,
                        b,
                      );
                    default:
                      if (ka(a))
                        return (
                          (a = Z(a, b)),
                          new I(a.x, a.y, a.z, 0, 0, 0, b)
                        );
                      throw 'HelioState: Unsupported body "' + a + '"';
                  }
                }
                function sd(a, b, c, d, f) {
                  var g = (f + c) / 2 - d;
                  c = (f - c) / 2;
                  if (0 == g) {
                    if (0 == c) return null;
                    d = -d / c;
                    if (-1 > d || 1 < d) return null;
                  } else {
                    d = c * c - 4 * g * d;
                    if (0 >= d) return null;
                    f = Math.sqrt(d);
                    d = (-c + f) / (2 * g);
                    f = (-c - f) / (2 * g);
                    if (-1 <= d && 1 >= d) {
                      if (-1 <= f && 1 >= f) return null;
                    } else if (-1 <= f && 1 >= f) d = f;
                    else return null;
                  }
                  return { t: a + d * b, df_dt: (2 * g * d + c) / b };
                }
                function K(a, b, c, d) {
                  var f = w((d && d.dt_tolerance_seconds) || 1);
                  f = Math.abs(f / 86400);
                  var g = (d && d.init_f1) || a(b),
                    h = (d && d.init_f2) || a(c),
                    l = NaN,
                    k = 0;
                  d = (d && d.iter_limit) || 20;
                  for (var n = !0; ; ) {
                    if (++k > d) throw "Excessive iteration in Search()";
                    var p = new O(b.ut + 0.5 * (c.ut - b.ut)),
                      q = p.ut - b.ut;
                    if (Math.abs(q) < f) return p;
                    n ? (l = a(p)) : (n = !0);
                    var t = sd(p.ut, c.ut - p.ut, g, l, h);
                    if (t) {
                      var y = v(t.t),
                        x = a(y);
                      if (0 !== t.df_dt) {
                        if (Math.abs(x / t.df_dt) < f) return y;
                        t = 1.2 * Math.abs(x / t.df_dt);
                        if (
                          t < q / 10 &&
                          ((q = y.AddDays(-t)),
                          (y = y.AddDays(+t)),
                          0 > (q.ut - b.ut) * (q.ut - c.ut) &&
                            0 > (y.ut - b.ut) * (y.ut - c.ut))
                        ) {
                          t = a(q);
                          var z = a(y);
                          if (0 > t && 0 <= z) {
                            g = t;
                            h = z;
                            b = q;
                            c = y;
                            l = x;
                            n = !1;
                            continue;
                          }
                        }
                      }
                    }
                    if (0 > g && 0 <= l) ((c = p), (h = l));
                    else if (0 > l && 0 <= h) ((b = p), (g = l));
                    else return null;
                  }
                }
                function Fa(a) {
                  for (; -180 >= a; ) a += 360;
                  for (; 180 < a; ) a -= 360;
                  return a;
                }
                function Ga(a) {
                  for (; 0 > a; ) a += 360;
                  for (; 360 <= a; ) a -= 360;
                  return a;
                }
                function oc(a, b, c) {
                  w(a);
                  w(c);
                  b = v(b);
                  c = b.AddDays(c);
                  return K(
                    function (d) {
                      d = fc(d);
                      return Fa(d.elon - a);
                    },
                    b,
                    c,
                    { dt_tolerance_seconds: 0.01 },
                  );
                }
                function Jb(a, b, c) {
                  if (a === m.Earth || b === m.Earth)
                    throw "The Earth does not have a longitude as seen from itself.";
                  c = v(c);
                  a = W(a, c, !1);
                  a = Qa(a);
                  b = W(b, c, !1);
                  b = Qa(b);
                  return Ga(a.elon - b.elon);
                }
                function Ha(a, b) {
                  if (a == m.Earth)
                    throw "The Earth does not have an angle as seen from itself.";
                  var c = v(b);
                  b = W(m.Sun, c, !0);
                  a = W(a, c, !0);
                  return N(b, a);
                }
                function qa(a, b) {
                  if (a === m.Sun)
                    throw "Cannot calculate heliocentric longitude of the Sun.";
                  a = Z(a, b);
                  return Qa(a).elon;
                }
                function nb(a, b) {
                  if (a === m.Earth)
                    throw "The illumination of the Earth is not defined.";
                  var c = v(b),
                    d = Aa(M.Earth, c);
                  if (a === m.Sun) {
                    var f = new E(-d.x, -d.y, -d.z, c);
                    b = new E(0, 0, 0, c);
                    d = 0;
                  } else
                    (a === m.Moon
                      ? ((f = Y(c)),
                        (b = new E(d.x + f.x, d.y + f.y, d.z + f.z, c)))
                      : ((b = Z(a, b)),
                        (f = new E(b.x - d.x, b.y - d.y, b.z - d.z, c))),
                      (d = N(f, b)));
                  var g = f.Length(),
                    h = b.Length();
                  if (a === m.Sun) var l = td + 5 * Math.log10(g);
                  else if (a === m.Moon)
                    ((a = d * e.DEG2RAD),
                      (l = a * a),
                      (a = -12.717 + 1.49 * Math.abs(a) + 0.0431 * l * l),
                      (l = a +=
                        5 * Math.log10((g / (385000.6 / e.KM_PER_AU)) * h)));
                  else if (a === m.Saturn) {
                    var k = d;
                    a = Qa(f);
                    l = 28.06 * e.DEG2RAD;
                    var n = e.DEG2RAD * a.elat;
                    a = Math.asin(
                      Math.sin(n) * Math.cos(l) -
                        Math.cos(n) *
                          Math.sin(l) *
                          Math.sin(
                            e.DEG2RAD * a.elon -
                              e.DEG2RAD * (169.51 + 3.82e-5 * c.tt),
                          ),
                    );
                    l = Math.sin(Math.abs(a));
                    k =
                      -9 +
                      0.044 * k +
                      l * (-2.6 + 1.2 * l) +
                      5 * Math.log10(h * g);
                    a *= e.RAD2DEG;
                    l = k;
                    k = a;
                  } else {
                    var p = (n = l = 0);
                    switch (a) {
                      case m.Mercury:
                        a = -0.6;
                        l = 4.98;
                        n = -4.88;
                        p = 3.02;
                        break;
                      case m.Venus:
                        163.6 > d
                          ? ((a = -4.47), (l = 1.03), (n = 0.57), (p = 0.13))
                          : ((a = 0.98), (l = -1.02));
                        break;
                      case m.Mars:
                        a = -1.52;
                        l = 1.6;
                        break;
                      case m.Jupiter:
                        a = -9.4;
                        l = 0.5;
                        break;
                      case m.Uranus:
                        a = -7.19;
                        l = 0.25;
                        break;
                      case m.Neptune:
                        a = -6.87;
                        break;
                      case m.Pluto:
                        a = -1;
                        l = 4;
                        break;
                      default:
                        throw "VisualMagnitude: unsupported body " + a;
                    }
                    var q = d / 100;
                    l = a + q * (l + q * (n + q * p)) + 5 * Math.log10(h * g);
                  }
                  return new pc(c, l, d, h, g, f, b, k);
                }
                function Va(a) {
                  if (a === m.Earth)
                    throw "The Earth does not have a synodic period as seen from itself.";
                  if (a === m.Moon) return 29.530588;
                  var b = aa[a];
                  if (!b) throw "Not a valid planet name: " + a;
                  a = aa.Earth.OrbitalPeriod;
                  return Math.abs(a / (a / b.OrbitalPeriod - 1));
                }
                function Ia(a, b, c) {
                  function d(n) {
                    var p = qa(a, n);
                    n = qa(m.Earth, n);
                    return Fa(g * (n - p) - b);
                  }
                  w(b);
                  var f = aa[a];
                  if (!f)
                    throw (
                      "Cannot search relative longitude because body is not a planet: " +
                      a
                    );
                  if (a === m.Earth)
                    throw "Cannot search relative longitude for the Earth (it is always 0)";
                  var g = f.OrbitalPeriod > aa.Earth.OrbitalPeriod ? 1 : -1;
                  f = Va(a);
                  c = v(c);
                  var h = d(c);
                  0 < h && (h -= 360);
                  for (var l = 0; 100 > l; ++l) {
                    var k = (-h / 360) * f;
                    c = c.AddDays(k);
                    if (1 > 86400 * Math.abs(k)) return c;
                    k = h;
                    h = d(c);
                    30 > Math.abs(k) &&
                      k !== h &&
                      ((k /= k - h), 0.5 < k && 2 > k && (f *= k));
                  }
                  throw (
                    "Relative longitude search failed to converge for " +
                    a +
                    " near " +
                    c.toString() +
                    " (error_angle = " +
                    h +
                    ")."
                  );
                }
                function Kb(a) {
                  return Jb(m.Moon, m.Sun, a);
                }
                function Wa(a, b, c) {
                  function d(l) {
                    l = Kb(l);
                    return Fa(l - a);
                  }
                  w(a);
                  w(c);
                  b = v(b);
                  var f = d(b);
                  if (0 > c) {
                    0 > f && (f += 360);
                    var g = -(29.530588 * f) / 360;
                    f = g + 1.5;
                    if (f < c) return null;
                    var h = Math.max(c, g - 1.5);
                  } else {
                    0 < f && (f -= 360);
                    g = -(29.530588 * f) / 360;
                    h = g - 1.5;
                    if (h > c) return null;
                    f = Math.min(c, g + 1.5);
                  }
                  c = b.AddDays(h);
                  b = b.AddDays(f);
                  return K(d, c, b, { dt_tolerance_seconds: 0.1 });
                }
                function qc(a) {
                  var b = Kb(a);
                  b = (Math.floor(b / 90) + 1) % 4;
                  a = Wa(90 * b, a, 10);
                  if (!a) throw "Cannot find moon quarter";
                  return new rc(b, a);
                }
                function sc(a) {
                  if (!Number.isFinite(a) || -500 > a || 1e5 < a)
                    throw "Invalid elevation: " + a;
                  if (11e3 >= a) {
                    var b = 288.15 - 0.0065 * a;
                    a = 101325 * Math.pow(288.15 / b, -5.25577);
                  } else
                    2e4 >= a
                      ? ((b = 216.65),
                        (a = 22632 * Math.exp(-1.5768832e-4 * (a - 11e3))))
                      : ((b = 216.65 + 0.001 * (a - 2e4)),
                        (a = 5474.87 * Math.pow(216.65 / b, 34.16319)));
                  return new tc(a, b, a / b / (101325 / 288.15));
                }
                function Lb(a, b, c, d, f, g, h) {
                  if (0 > g && 0 <= h) return new ud(d, f, g, h);
                  if (0 <= g && 0 > h) return null;
                  if (17 < a)
                    throw "Excessive recursion in rise/set ascent search.";
                  var l = f.ut - d.ut;
                  if (
                    1 > 86400 * l ||
                    Math.min(Math.abs(g), Math.abs(h)) > (l / 2) * c
                  )
                    return null;
                  l = new O((d.ut + f.ut) / 2);
                  var k = b(l);
                  return (
                    Lb(1 + a, b, c, d, l, g, k) || Lb(1 + a, b, c, l, f, k, h)
                  );
                }
                function vd(a, b) {
                  if (-90 > b || 90 < b)
                    throw "Invalid geographic latitude: " + b;
                  switch (a) {
                    case m.Moon:
                      a = 4.5;
                      var c = 8.2;
                      break;
                    case m.Sun:
                      a = 0.8;
                      c = 0.5;
                      break;
                    case m.Mercury:
                      a = -1.6;
                      c = 1;
                      break;
                    case m.Venus:
                      a = -0.8;
                      c = 0.6;
                      break;
                    case m.Mars:
                      a = -0.5;
                      c = 0.4;
                      break;
                    case m.Jupiter:
                    case m.Saturn:
                    case m.Uranus:
                    case m.Neptune:
                    case m.Pluto:
                      a = -0.2;
                      c = 0.2;
                      break;
                    case m.Star1:
                    case m.Star2:
                    case m.Star3:
                    case m.Star4:
                    case m.Star5:
                    case m.Star6:
                    case m.Star7:
                    case m.Star8:
                      a = -0.008;
                      c = 0.008;
                      break;
                    default:
                      throw "Body not allowed for altitude search: " + a;
                  }
                  b *= e.DEG2RAD;
                  return (
                    Math.abs((360.98564540070413 - a) * Math.cos(b)) +
                    Math.abs(c * Math.sin(b))
                  );
                }
                function uc(a, b, c, d, f, g, h) {
                  function l(x) {
                    var z = Pa(a, x, b, !0, !0);
                    x =
                      hb(x, b, z.ra, z.dec).altitude +
                      e.RAD2DEG * Math.asin(g / z.dist);
                    return c * (x - h);
                  }
                  za(b);
                  w(f);
                  w(g);
                  w(h);
                  if (-90 > h || 90 < h)
                    throw "Invalid target altitude angle: " + h;
                  for (
                    var k = vd(a, b.latitude),
                      n = (d = v(d)),
                      p = d,
                      q = l(n),
                      t = q;
                    ;
                  ) {
                    0 > f
                      ? ((n = p.AddDays(-0.42)), (q = l(n)))
                      : ((p = n.AddDays(0.42)), (t = l(p)));
                    var y = Lb(0, l, k, n, p, q, t);
                    if (y) {
                      if (
                        (k = K(l, y.tx, y.ty, {
                          dt_tolerance_seconds: 0.1,
                          init_f1: y.ax,
                          init_f2: y.ay,
                        }))
                      ) {
                        if (0 > f) {
                          if (k.ut < d.ut + f) return null;
                        } else if (k.ut > d.ut + f) return null;
                        return k;
                      }
                      throw (
                        "Rise/set search failed after finding ascent: t1=" +
                        n +
                        ", t2=" +
                        p +
                        ", a1=" +
                        q +
                        ", a2=" +
                        t
                      );
                    }
                    if (0 > f) {
                      if (n.ut < d.ut + f) return null;
                      p = n;
                      t = q;
                    } else {
                      if (p.ut > d.ut + f) return null;
                      n = p;
                      q = t;
                    }
                  }
                }
                function vc(a, b) {
                  b = v(b);
                  var c = Jb(a, m.Sun, b);
                  if (180 < c) {
                    var d = "morning";
                    c = 360 - c;
                  } else d = "evening";
                  a = Ha(a, b);
                  return new wc(b, d, a, c);
                }
                function xc(a) {
                  function b(l) {
                    var k = l.AddDays(-5e-4);
                    l = l.AddDays(5e-4);
                    k = ea(k).distance_au;
                    return (ea(l).distance_au - k) / 0.001;
                  }
                  function c(l) {
                    return -b(l);
                  }
                  a = v(a);
                  for (var d = b(a), f = 0; 59.061176 > 5 * f; ++f) {
                    var g = a.AddDays(5),
                      h = b(g);
                    if (0 >= d * h) {
                      if (0 > d || 0 < h) {
                        a = K(b, a, g, { init_f1: d, init_f2: h });
                        if (!a)
                          throw "SearchLunarApsis INTERNAL ERROR: perigee search failed!";
                        d = ea(a).distance_au;
                        return new Xa(a, 0, d);
                      }
                      if (0 < d || 0 > h) {
                        a = K(c, a, g, { init_f1: -d, init_f2: -h });
                        if (!a)
                          throw "SearchLunarApsis INTERNAL ERROR: apogee search failed!";
                        d = ea(a).distance_au;
                        return new Xa(a, 1, d);
                      }
                      throw "SearchLunarApsis INTERNAL ERROR: cannot classify apsis event!";
                    }
                    a = g;
                    d = h;
                  }
                  throw "SearchLunarApsis INTERNAL ERROR: could not find apsis within 2 synodic months of start date.";
                }
                function yc(a, b, c, d) {
                  for (var f = b === Ja.Apocenter ? 1 : -1; ; ) {
                    d /= 9;
                    if (d < 1 / 1440)
                      return (
                        (c = c.AddDays(d / 2)),
                        (a = oa(a, c)),
                        new Xa(c, b, a)
                      );
                    for (var g = -1, h = 0, l = 0; 10 > l; ++l) {
                      var k = c.AddDays(l * d);
                      k = f * oa(a, k);
                      if (0 == l || k > h) ((g = l), (h = k));
                    }
                    c = c.AddDays((g - 1) * d);
                    d *= 2;
                  }
                }
                function wd(a, b) {
                  var c = b.AddDays((-30 / 360) * aa[a].OrbitalPeriod),
                    d = b.AddDays(0.75 * aa[a].OrbitalPeriod),
                    f = c,
                    g = c,
                    h = -1,
                    l = -1;
                  d = (d.ut - c.ut) / 99;
                  for (var k = 0; 100 > k; ++k) {
                    var n = c.AddDays(k * d),
                      p = oa(a, n);
                    0 === k
                      ? (l = h = p)
                      : (p > l && ((l = p), (g = n)),
                        p < h && ((h = p), (f = n)));
                  }
                  c = yc(a, 0, f.AddDays(-2 * d), 4 * d);
                  a = yc(a, 1, g.AddDays(-2 * d), 4 * d);
                  if (c.time.tt >= b.tt)
                    return a.time.tt >= b.tt && a.time.tt < c.time.tt ? a : c;
                  if (a.time.tt >= b.tt) return a;
                  throw "Internal error: failed to find Neptune apsis.";
                }
                function zc(a, b) {
                  function c(p) {
                    var q = p.AddDays(-5e-4);
                    p = p.AddDays(5e-4);
                    q = oa(a, q);
                    return (oa(a, p) - q) / 0.001;
                  }
                  function d(p) {
                    return -c(p);
                  }
                  b = v(b);
                  if (a === m.Neptune || a === m.Pluto) return wd(a, b);
                  for (
                    var f = aa[a].OrbitalPeriod, g = f / 6, h = c(b), l = 0;
                    l * g < 2 * f;
                    ++l
                  ) {
                    var k = b.AddDays(g),
                      n = c(k);
                    if (0 >= h * n) {
                      f = g = void 0;
                      if (0 > h || 0 < n) ((g = c), (f = Ja.Pericenter));
                      else if (0 < h || 0 > n) ((g = d), (f = Ja.Apocenter));
                      else
                        throw "Internal error with slopes in SearchPlanetApsis";
                      b = K(g, b, k);
                      if (!b)
                        throw "Failed to find slope transition in planetary apsis search.";
                      h = oa(a, b);
                      return new Xa(b, f, h);
                    }
                    b = k;
                    h = n;
                  }
                  throw "Internal error: should have found planetary apsis within 2 orbital periods.";
                }
                function Ka(a) {
                  return new J([
                    [a.rot[0][0], a.rot[1][0], a.rot[2][0]],
                    [a.rot[0][1], a.rot[1][1], a.rot[2][1]],
                    [a.rot[0][2], a.rot[1][2], a.rot[2][2]],
                  ]);
                }
                function ja(a, b) {
                  return new J([
                    [
                      b.rot[0][0] * a.rot[0][0] +
                        b.rot[1][0] * a.rot[0][1] +
                        b.rot[2][0] * a.rot[0][2],
                      b.rot[0][1] * a.rot[0][0] +
                        b.rot[1][1] * a.rot[0][1] +
                        b.rot[2][1] * a.rot[0][2],
                      b.rot[0][2] * a.rot[0][0] +
                        b.rot[1][2] * a.rot[0][1] +
                        b.rot[2][2] * a.rot[0][2],
                    ],
                    [
                      b.rot[0][0] * a.rot[1][0] +
                        b.rot[1][0] * a.rot[1][1] +
                        b.rot[2][0] * a.rot[1][2],
                      b.rot[0][1] * a.rot[1][0] +
                        b.rot[1][1] * a.rot[1][1] +
                        b.rot[2][1] * a.rot[1][2],
                      b.rot[0][2] * a.rot[1][0] +
                        b.rot[1][2] * a.rot[1][1] +
                        b.rot[2][2] * a.rot[1][2],
                    ],
                    [
                      b.rot[0][0] * a.rot[2][0] +
                        b.rot[1][0] * a.rot[2][1] +
                        b.rot[2][0] * a.rot[2][2],
                      b.rot[0][1] * a.rot[2][0] +
                        b.rot[1][1] * a.rot[2][1] +
                        b.rot[2][1] * a.rot[2][2],
                      b.rot[0][2] * a.rot[2][0] +
                        b.rot[1][2] * a.rot[2][1] +
                        b.rot[2][2] * a.rot[2][2],
                    ],
                  ]);
                }
                function lb(a, b) {
                  b = v(b);
                  var c = a.lat * e.DEG2RAD,
                    d = a.lon * e.DEG2RAD,
                    f = a.dist * Math.cos(c);
                  return new E(
                    f * Math.cos(d),
                    f * Math.sin(d),
                    a.dist * Math.sin(c),
                    b,
                  );
                }
                function Mb(a) {
                  var b = Nb(a);
                  return new gb(b.lon / 15, b.lat, b.dist, a);
                }
                function Nb(a) {
                  var b = a.x * a.x + a.y * a.y,
                    c = Math.sqrt(b + a.z * a.z);
                  if (0 === b) {
                    if (0 === a.z) throw "Zero-length vector not allowed.";
                    var d = 0;
                    a = 0 > a.z ? -90 : 90;
                  } else
                    ((d = e.RAD2DEG * Math.atan2(a.y, a.x)),
                      0 > d && (d += 360),
                      (a = e.RAD2DEG * Math.atan2(a.z, Math.sqrt(b))));
                  return new Ba(a, d, c);
                }
                function Ac(a) {
                  a = 360 - a;
                  360 <= a ? (a -= 360) : 0 > a && (a += 360);
                  return a;
                }
                function Oa(a, b) {
                  w(b);
                  if (-90 > b || 90 < b) return 0;
                  if ("normal" === a || "jplhor" === a) {
                    var c = b;
                    -1 > c && (c = -1);
                    c =
                      1.02 / Math.tan((c + 10.3 / (c + 5.11)) * e.DEG2RAD) / 60;
                    "normal" === a && -1 > b && (c *= (b + 90) / 89);
                  } else {
                    if (a) throw "Invalid refraction option: " + a;
                    c = 0;
                  }
                  return c;
                }
                function Bc(a, b) {
                  if (-90 > b || 90 < b) return 0;
                  for (var c = b - Oa(a, b); ; ) {
                    var d = c + Oa(a, c) - b;
                    if (1e-14 > Math.abs(d)) return c - b;
                    c -= d;
                  }
                }
                function Ya(a, b) {
                  return new E(
                    a.rot[0][0] * b.x + a.rot[1][0] * b.y + a.rot[2][0] * b.z,
                    a.rot[0][1] * b.x + a.rot[1][1] * b.y + a.rot[2][1] * b.z,
                    a.rot[0][2] * b.x + a.rot[1][2] * b.y + a.rot[2][2] * b.z,
                    b.t,
                  );
                }
                function Ea(a, b) {
                  return new I(
                    a.rot[0][0] * b.x + a.rot[1][0] * b.y + a.rot[2][0] * b.z,
                    a.rot[0][1] * b.x + a.rot[1][1] * b.y + a.rot[2][1] * b.z,
                    a.rot[0][2] * b.x + a.rot[1][2] * b.y + a.rot[2][2] * b.z,
                    a.rot[0][0] * b.vx +
                      a.rot[1][0] * b.vy +
                      a.rot[2][0] * b.vz,
                    a.rot[0][1] * b.vx +
                      a.rot[1][1] * b.vy +
                      a.rot[2][1] * b.vz,
                    a.rot[0][2] * b.vx +
                      a.rot[1][2] * b.vy +
                      a.rot[2][2] * b.vz,
                    b.t,
                  );
                }
                function Cc() {
                  return new J([
                    [1, 0, 0],
                    [0, 0.9174821430670688, -0.3977769691083922],
                    [0, 0.3977769691083922, 0.9174821430670688],
                  ]);
                }
                function ob(a) {
                  a = v(a);
                  var b = Ma(a, F.From2000);
                  a = Na(a, F.From2000);
                  return ja(b, a);
                }
                function pb(a) {
                  a = v(a);
                  var b = Na(a, F.Into2000);
                  a = Ma(a, F.Into2000);
                  return ja(b, a);
                }
                function Ob(a, b) {
                  a = v(a);
                  var c = Math.sin(b.latitude * e.DEG2RAD),
                    d = Math.cos(b.latitude * e.DEG2RAD),
                    f = Math.sin(b.longitude * e.DEG2RAD),
                    g = Math.cos(b.longitude * e.DEG2RAD);
                  b = [d * g, d * f, c];
                  c = [-c * g, -c * f, d];
                  f = [f, -g, 0];
                  a = -15 * ca(a);
                  b = ya(a, b);
                  c = ya(a, c);
                  a = ya(a, f);
                  return new J([
                    [c[0], a[0], b[0]],
                    [c[1], a[1], b[1]],
                    [c[2], a[2], b[2]],
                  ]);
                }
                function Dc(a, b) {
                  a = Ob(a, b);
                  return Ka(a);
                }
                function Ec(a, b) {
                  a = v(a);
                  b = Dc(a, b);
                  a = pb(a);
                  return ja(b, a);
                }
                function Fc(a) {
                  a = pb(a);
                  var b = Cc();
                  return ja(a, b);
                }
                function Gc(a) {
                  a = Fc(a);
                  return Ka(a);
                }
                function Hc(a, b) {
                  a = v(a);
                  var c = Gc(a);
                  a = Ob(a, b);
                  return ja(c, a);
                }
                function Ic(a) {
                  var b = da(v(a)).tobl * e.DEG2RAD;
                  a = Math.cos(b);
                  b = Math.sin(b);
                  return new J([
                    [1, 0, 0],
                    [0, +a, +b],
                    [0, -b, +a],
                  ]);
                }
                function Jc(a) {
                  var b = da(v(a)).tobl * e.DEG2RAD;
                  a = Math.cos(b);
                  b = Math.sin(b);
                  return new J([
                    [1, 0, 0],
                    [0, +a, -b],
                    [0, +b, +a],
                  ]);
                }
                function Za(a, b, c, d) {
                  var f =
                    (d.x * c.x + d.y * c.y + d.z * c.z) /
                    (d.x * d.x + d.y * d.y + d.z * d.z);
                  return new xd(
                    b,
                    f,
                    e.KM_PER_AU *
                      Math.hypot(f * d.x - c.x, f * d.y - c.y, f * d.z - c.z),
                    695700 - (1 + f) * (695700 - a),
                    -695700 + (1 + f) * (695700 + a),
                    c,
                    d,
                  );
                }
                function qb(a) {
                  var b = W(m.Sun, a, !0);
                  b = new E(-b.x, -b.y, -b.z, b.t);
                  var c = Y(a);
                  return Za(6459, a, c, b);
                }
                function Kc(a) {
                  var b = W(m.Sun, a, !0),
                    c = Y(a),
                    d = new E(-c.x, -c.y, -c.z, c.t);
                  c.x -= b.x;
                  c.y -= b.y;
                  c.z -= b.z;
                  return Za(1737.4, a, d, c);
                }
                function Pb(a, b) {
                  var c = cc(a, b);
                  b = W(m.Sun, a, !0);
                  var d = Y(a);
                  c = new E(c[0] - d.x, c[1] - d.y, c[2] - d.z, a);
                  d.x -= b.x;
                  d.y -= b.y;
                  d.z -= b.z;
                  return Za(1737.4, a, c, d);
                }
                function rb(a, b, c) {
                  a = W(a, c, !0);
                  var d = W(m.Sun, c, !0),
                    f = new E(a.x - d.x, a.y - d.y, a.z - d.z, c);
                  d.x = -a.x;
                  d.y = -a.y;
                  d.z = -a.z;
                  return Za(b, c, d, f);
                }
                function Qb(a, b) {
                  var c = 1 / 86400,
                    d = b.AddDays(-c);
                  b = b.AddDays(+c);
                  d = a(d);
                  return (a(b).r - d.r) / c;
                }
                function yd(a) {
                  var b = a.AddDays(-0.03);
                  a = a.AddDays(0.03);
                  b = K(
                    function (c) {
                      return Qb(qb, c);
                    },
                    b,
                    a,
                  );
                  if (!b) throw "Failed to find peak Earth shadow time.";
                  return qb(b);
                }
                function zd(a) {
                  var b = a.AddDays(-0.03);
                  a = a.AddDays(0.03);
                  b = K(
                    function (c) {
                      return Qb(Kc, c);
                    },
                    b,
                    a,
                  );
                  if (!b) throw "Failed to find peak Moon shadow time.";
                  return Kc(b);
                }
                function Ad(a, b, c) {
                  var d = c.AddDays(-1);
                  c = c.AddDays(1);
                  d = K(
                    function (f) {
                      var g = 1 / 86400,
                        h = rb(a, b, f.AddDays(-g));
                      return (rb(a, b, f.AddDays(+g)).r - h.r) / g;
                    },
                    d,
                    c,
                  );
                  if (!d) throw "Failed to find peak planet shadow time.";
                  return rb(a, b, d);
                }
                function Bd(a, b) {
                  function c(g) {
                    return Pb(g, b);
                  }
                  var d = a.AddDays(-0.2),
                    f = a.AddDays(0.2);
                  d = K(
                    function (g) {
                      return Qb(c, g);
                    },
                    d,
                    f,
                  );
                  if (!d)
                    throw (
                      "PeakLocalMoonShadow: search failure for search_center_time = " +
                      a
                    );
                  return Pb(d, b);
                }
                function Rb(a, b, c) {
                  var d = c / 1440;
                  c = a.AddDays(-d);
                  d = a.AddDays(+d);
                  c = K(
                    function (f) {
                      return -(qb(f).r - b);
                    },
                    c,
                    a,
                  );
                  a = K(
                    function (f) {
                      return +(qb(f).r - b);
                    },
                    a,
                    d,
                  );
                  if (!c || !a) throw "Failed to find shadow semiduration";
                  return 720 * (a.ut - c.ut);
                }
                function Sb(a) {
                  a = ea(a);
                  return e.RAD2DEG * a.geo_eclip_lat;
                }
                function Lc(a, b, c) {
                  if (0 >= a) throw "Radius of first disc must be positive.";
                  if (0 >= b) throw "Radius of second disc must be positive.";
                  if (0 > c)
                    throw "Distance between discs is not allowed to be negative.";
                  if (c >= a + b) return 0;
                  if (0 == c) return a <= b ? 1 : (b * b) / (a * a);
                  var d = (a * a - b * b + c * c) / (2 * c),
                    f = a * a - d * d;
                  if (0 >= f) return a <= b ? 1 : (b * b) / (a * a);
                  f = Math.sqrt(f);
                  return (
                    (a * a * Math.acos(d / a) -
                      d * f +
                      (b * b * Math.acos((c - d) / b) - (c - d) * f)) /
                    (Math.PI * a * a)
                  );
                }
                function Mc(a, b) {
                  var c = new E(a.x + b.x, a.y + b.y, a.z + b.z, a.t);
                  a = Math.asin(Nc / c.Length());
                  var d = Math.asin(Cd / b.Length());
                  b = N(b, c);
                  b = Lc(a, d, b * e.DEG2RAD);
                  return Math.min(0.9999, b);
                }
                function Oc(a) {
                  a = v(a);
                  for (var b = 0; 12 > b; ++b) {
                    var c = Wa(180, a, 40);
                    if (!c) throw "Cannot find full moon.";
                    a = Sb(c);
                    if (
                      1.8 > Math.abs(a) &&
                      ((a = yd(c)), a.r < a.p + 1737.4)
                    ) {
                      b = S.Penumbral;
                      var d = (c = 0),
                        f = 0,
                        g = Rb(a.time, a.p + 1737.4, 200);
                      a.r < a.k + 1737.4 &&
                        ((b = S.Partial),
                        (f = Rb(a.time, a.k + 1737.4, g)),
                        a.r + 1737.4 < a.k
                          ? ((b = S.Total),
                            (c = 1),
                            (d = Rb(a.time, a.k - 1737.4, f)))
                          : (c = Lc(1737.4, a.k, a.r)));
                      return new Pc(b, c, a.time, g, f, d);
                    }
                    a = c.AddDays(10);
                  }
                  throw "Failed to find lunar eclipse within 12 full moons.";
                }
                function Qc(a) {
                  a = v(a);
                  var b;
                  for (b = 0; 12 > b; ++b) {
                    var c = Wa(0, a, 40);
                    if (!c) throw "Cannot find new moon";
                    a = Sb(c);
                    if (1.8 > Math.abs(a) && ((a = zd(c)), a.r < a.p + 6371)) {
                      var d = void 0,
                        f = void 0,
                        g = S.Partial;
                      b = a.time;
                      c = a.r;
                      var h = ob(a.time),
                        l = Ya(h, a.dir),
                        k = Ya(h, a.target);
                      l.x *= e.KM_PER_AU;
                      l.y *= e.KM_PER_AU;
                      l.z *= e.KM_PER_AU / 0.996647180302104;
                      k.x *= e.KM_PER_AU;
                      k.y *= e.KM_PER_AU;
                      k.z *= e.KM_PER_AU / 0.996647180302104;
                      var n = l.x * l.x + l.y * l.y + l.z * l.z,
                        p = -2 * (l.x * k.x + l.y * k.y + l.z * k.z),
                        q =
                          p * p -
                          4 *
                            n *
                            (k.x * k.x +
                              k.y * k.y +
                              k.z * k.z -
                              4.068062648825956e7);
                      if (0 < q) {
                        f = (-p - Math.sqrt(q)) / (2 * n);
                        g = f * l.x - k.x;
                        n = f * l.y - k.y;
                        l = 0.996647180302104 * (f * l.z - k.z);
                        f = 0.9933056020041345 * Math.hypot(g, n);
                        f =
                          0 == f
                            ? 0 < l
                              ? 90
                              : -90
                            : e.RAD2DEG * Math.atan(l / f);
                        d = ca(b);
                        d = (e.RAD2DEG * Math.atan2(n, g) - 15 * d) % 360;
                        -180 >= d ? (d += 360) : 180 < d && (d -= 360);
                        h = Ka(h);
                        l = new E(
                          g / e.KM_PER_AU,
                          n / e.KM_PER_AU,
                          l / e.KM_PER_AU,
                          a.time,
                        );
                        l = Ya(h, l);
                        l.x += a.target.x;
                        l.y += a.target.y;
                        l.z += a.target.z;
                        h = Za(1736, a.time, l, a.dir);
                        if (1e-9 < h.r || 0 > h.r)
                          throw (
                            "Unexpected shadow distance from geoid intersection = " +
                            h.r
                          );
                        g = 0.014 < h.k ? S.Total : S.Annular;
                        a = g === S.Total ? 1 : Mc(a.dir, l);
                      } else a = void 0;
                      return new Rc(g, a, b, c, f, d);
                    }
                    a = c.AddDays(10);
                  }
                  throw "Failed to find solar eclipse within 12 full moons.";
                }
                function Sc(a) {
                  return a.p - a.r;
                }
                function Tc(a) {
                  return Math.abs(a.k) - a.r;
                }
                function sb(a, b, c, d, f) {
                  d = K(
                    function (g) {
                      g = Pb(g, a);
                      return b * c(g);
                    },
                    d,
                    f,
                  );
                  if (!d) throw "Local eclipse transition search failed.";
                  return Uc(a, d);
                }
                function Uc(a, b) {
                  var c = Pa(m.Sun, b, a, !0, !0);
                  a = hb(b, a, c.ra, c.dec, "normal").altitude;
                  return new Vc(b, a);
                }
                function Wc(a, b) {
                  a = v(a);
                  for (za(b); ; ) {
                    a = Wa(0, a, 40);
                    if (!a) throw "Cannot find next new moon";
                    var c = Sb(a);
                    if (1.8 > Math.abs(c)) {
                      var d = Bd(a, b);
                      if (d.r < d.p) {
                        var f = (c = void 0);
                        var g = b;
                        var h = Uc(g, d.time),
                          l = d.time.AddDays(-0.2),
                          k = d.time.AddDays(0.2),
                          n = sb(g, 1, Sc, l, d.time),
                          p = sb(g, -1, Sc, d.time, k);
                        d.r < Math.abs(d.k)
                          ? ((l = d.time.AddDays(-0.01)),
                            (k = d.time.AddDays(0.01)),
                            (f = sb(g, 1, Tc, l, d.time)),
                            (c = sb(g, -1, Tc, d.time, k)),
                            (g = 0.014 < d.k ? S.Total : S.Annular))
                          : (g = S.Partial);
                        d = g === S.Total ? 1 : Mc(d.dir, d.target);
                        c = new Xc(g, d, n, f, h, c, p);
                        if (
                          0 < c.partial_begin.altitude ||
                          0 < c.partial_end.altitude
                        )
                          return c;
                      }
                    }
                    a = a.AddDays(10);
                  }
                }
                function Yc(a, b, c, d, f) {
                  c = K(
                    function (g) {
                      g = rb(a, b, g);
                      return f * (g.r - g.p);
                    },
                    c,
                    d,
                  );
                  if (!c) throw "Planet transit boundary search failed";
                  return c;
                }
                function Zc(a, b) {
                  b = v(b);
                  switch (a) {
                    case m.Mercury:
                      var c = 2439.7;
                      break;
                    case m.Venus:
                      c = 6051.8;
                      break;
                    default:
                      throw "Invalid body: " + a;
                  }
                  for (;;) {
                    var d = Ia(a, 0, b);
                    if (0.4 > Ha(a, d) && ((b = Ad(a, c, d)), b.r < b.p)) {
                      d = b.time.AddDays(-1);
                      d = Yc(a, c, d, b.time, -1);
                      var f = b.time.AddDays(1);
                      c = Yc(a, c, b.time, f, 1);
                      a = 60 * Ha(a, b.time);
                      return new $c(d, b.time, c, a);
                    }
                    b = d.AddDays(10);
                  }
                }
                function ad(a) {
                  var b = v(a),
                    c = ib(b);
                  for (
                    a = {};
                    ;
                    a = {
                      $jscomp$loop$prop$kind$33: a.$jscomp$loop$prop$kind$33,
                    }
                  ) {
                    var d = b.AddDays(10),
                      f = ib(d);
                    if (0 >= c.lat * f.lat) {
                      a.$jscomp$loop$prop$kind$33 =
                        f.lat > c.lat ? ra.Ascending : ra.Descending;
                      b = K(
                        (function (g) {
                          return function (h) {
                            return g.$jscomp$loop$prop$kind$33 * ib(h).lat;
                          };
                        })(a),
                        b,
                        d,
                      );
                      if (!b) throw "Could not find moon node.";
                      return new bd(a.$jscomp$loop$prop$kind$33, b);
                    }
                    b = d;
                    c = f;
                  }
                }
                function cd(a, b, c, d, f) {
                  if (1 > a || 5 < a) throw "Invalid lagrange point " + a;
                  if (!Number.isFinite(c) || 0 >= c)
                    throw "Major mass must be a positive number.";
                  if (!Number.isFinite(f) || 0 >= f)
                    throw "Minor mass must be a negative number.";
                  var g = d.x - b.x,
                    h = d.y - b.y,
                    l = d.z - b.z,
                    k = g * g + h * h + l * l,
                    n = Math.sqrt(k),
                    p = d.vx - b.vx,
                    q = d.vy - b.vy;
                  d = d.vz - b.vz;
                  if (4 === a || 5 === a) {
                    k = h * d - l * q;
                    c = l * p - g * d;
                    var t = g * q - h * p,
                      y = c * l - t * h;
                    t = t * g - k * l;
                    k = k * h - c * g;
                    c = Math.sqrt(y * y + t * t + k * k);
                    y /= c;
                    t /= c;
                    k /= c;
                    g /= n;
                    h /= n;
                    l /= n;
                    a = 4 == a ? 0.8660254037844386 : -0.8660254037844386;
                    c = 0.5 * g + a * y;
                    f = 0.5 * h + a * t;
                    var x = 0.5 * l + a * k,
                      z = p * g + q * h + d * l;
                    p = p * y + q * t + d * k;
                    b = new I(
                      n * c,
                      n * f,
                      n * x,
                      z * c + p * (0.5 * y - a * g),
                      z * f + p * (0.5 * t - a * h),
                      z * x + p * (0.5 * k - a * l),
                      b.t,
                    );
                  } else {
                    y = (f / (c + f)) * -n;
                    t = (c / (c + f)) * +n;
                    k = (c + f) / (k * n);
                    if (1 === a || 2 === a)
                      ((x = (c / (c + f)) * Math.cbrt(f / (3 * c))),
                        (c = -c),
                        1 == a
                          ? ((x = 1 - x), (a = +f))
                          : ((x = 1 + x), (a = -f)));
                    else if (3 === a)
                      ((x = ((7 / 12) * f - c) / (f + c)), (c = +c), (a = +f));
                    else
                      throw (
                        "Invalid Langrage point " +
                        a +
                        ". Must be an integer 1..5."
                      );
                    f = n * x - y;
                    do
                      ((x = f - y),
                        (z = f - t),
                        (x =
                          (k * f + c / (x * x) + a / (z * z)) /
                          (k - (2 * c) / (x * x * x) - (2 * a) / (z * z * z))),
                        (f -= x));
                    while (1e-14 < Math.abs(x / n));
                    x = (f - y) / n;
                    b = new I(x * g, x * h, x * l, x * p, x * q, x * d, b.t);
                  }
                  return b;
                }
                Object.defineProperty(e, "__esModule", { value: !0 });
                e.GeoEmbState =
                  e.GeoMoonState =
                  e.EclipticGeoMoon =
                  e.GeoMoon =
                  e.Ecliptic =
                  e.ObserverGravity =
                  e.VectorObserver =
                  e.ObserverState =
                  e.ObserverVector =
                  e.Equator =
                  e.SunPosition =
                  e.Observer =
                  e.Horizon =
                  e.EclipticCoordinates =
                  e.HorizontalCoordinates =
                  e.MakeRotation =
                  e.RotationMatrix =
                  e.EquatorialCoordinates =
                  e.Spherical =
                  e.StateVector =
                  e.Vector =
                  e.SiderealTime =
                  e.Libration =
                  e.LibrationInfo =
                  e.CalcMoonCount =
                  e.e_tilt =
                  e.MakeTime =
                  e.AstroTime =
                  e.SetDeltaTFunction =
                  e.DeltaT_JplHorizons =
                  e.DeltaT_EspenakMeeus =
                  e.PlanetOrbitalPeriod =
                  e.DefineStar =
                  e.Body =
                  e.AngleBetween =
                  e.MassProduct =
                  e.CALLISTO_RADIUS_KM =
                  e.GANYMEDE_RADIUS_KM =
                  e.EUROPA_RADIUS_KM =
                  e.IO_RADIUS_KM =
                  e.JUPITER_MEAN_RADIUS_KM =
                  e.JUPITER_POLAR_RADIUS_KM =
                  e.JUPITER_EQUATORIAL_RADIUS_KM =
                  e.RAD2HOUR =
                  e.RAD2DEG =
                  e.HOUR2RAD =
                  e.DEG2RAD =
                  e.AU_PER_LY =
                  e.KM_PER_AU =
                  e.C_AUDAY =
                    void 0;
                e.VectorFromHorizon =
                  e.HorizonFromVector =
                  e.SphereFromVector =
                  e.EquatorFromVector =
                  e.VectorFromSphere =
                  e.Pivot =
                  e.IdentityMatrix =
                  e.CombineRotation =
                  e.InverseRotation =
                  e.NextPlanetApsis =
                  e.SearchPlanetApsis =
                  e.NextLunarApsis =
                  e.SearchLunarApsis =
                  e.Apsis =
                  e.ApsisKind =
                  e.SearchPeakMagnitude =
                  e.SearchMaxElongation =
                  e.Elongation =
                  e.ElongationEvent =
                  e.Seasons =
                  e.SeasonInfo =
                  e.HourAngle =
                  e.SearchHourAngle =
                  e.HourAngleEvent =
                  e.SearchAltitude =
                  e.SearchRiseSet =
                  e.Atmosphere =
                  e.AtmosphereInfo =
                  e.NextMoonQuarter =
                  e.SearchMoonQuarter =
                  e.MoonQuarter =
                  e.SearchMoonPhase =
                  e.MoonPhase =
                  e.SearchRelativeLongitude =
                  e.Illumination =
                  e.IlluminationInfo =
                  e.EclipticLongitude =
                  e.AngleFromSun =
                  e.PairLongitude =
                  e.SearchSunLongitude =
                  e.Search =
                  e.HelioState =
                  e.BaryState =
                  e.GeoVector =
                  e.BackdatePosition =
                  e.CorrectLightTravel =
                  e.HelioDistance =
                  e.HelioVector =
                  e.JupiterMoons =
                  e.JupiterMoonsInfo =
                    void 0;
                e.GravitySimulator =
                  e.LagrangePointFast =
                  e.LagrangePoint =
                  e.RotationAxis =
                  e.AxisInfo =
                  e.NextMoonNode =
                  e.SearchMoonNode =
                  e.NodeEventInfo =
                  e.NodeEventKind =
                  e.NextTransit =
                  e.SearchTransit =
                  e.TransitInfo =
                  e.NextLocalSolarEclipse =
                  e.SearchLocalSolarEclipse =
                  e.LocalSolarEclipseInfo =
                  e.EclipseEvent =
                  e.NextGlobalSolarEclipse =
                  e.SearchGlobalSolarEclipse =
                  e.NextLunarEclipse =
                  e.GlobalSolarEclipseInfo =
                  e.SearchLunarEclipse =
                  e.LunarEclipseInfo =
                  e.EclipseKind =
                  e.Constellation =
                  e.ConstellationInfo =
                  e.Rotation_EQD_ECT =
                  e.Rotation_ECT_EQD =
                  e.Rotation_GAL_EQJ =
                  e.Rotation_EQJ_GAL =
                  e.Rotation_HOR_ECL =
                  e.Rotation_ECL_HOR =
                  e.Rotation_ECL_EQD =
                  e.Rotation_EQD_ECL =
                  e.Rotation_EQJ_HOR =
                  e.Rotation_HOR_EQJ =
                  e.Rotation_HOR_EQD =
                  e.Rotation_EQD_HOR =
                  e.Rotation_EQD_EQJ =
                  e.Rotation_ECT_EQJ =
                  e.Rotation_EQJ_ECT =
                  e.Rotation_EQJ_EQD =
                  e.Rotation_ECL_EQJ =
                  e.Rotation_EQJ_ECL =
                  e.RotateState =
                  e.RotateVector =
                  e.InverseRefraction =
                  e.Refraction =
                    void 0;
                e.C_AUDAY = 173.1446326846693;
                e.KM_PER_AU = 1.4959787069098932e8;
                e.AU_PER_LY = 63241.07708807546;
                e.DEG2RAD = 0.017453292519943295;
                e.HOUR2RAD = 0.26179938779914946;
                e.RAD2DEG = 57.29577951308232;
                e.RAD2HOUR = 3.819718634205488;
                e.JUPITER_EQUATORIAL_RADIUS_KM = 71492;
                e.JUPITER_POLAR_RADIUS_KM = 66854;
                e.JUPITER_MEAN_RADIUS_KM = 69911;
                e.IO_RADIUS_KM = 1821.6;
                e.EUROPA_RADIUS_KM = 1560.8;
                e.GANYMEDE_RADIUS_KM = 2631.2;
                e.CALLISTO_RADIUS_KM = 2410.3;
                var dd = new Date("2000-01-01T12:00:00Z"),
                  U = 2 * Math.PI,
                  ia = (180 / Math.PI) * 3600,
                  td = -0.17 - 5 * Math.log10(648e3 / Math.PI),
                  Nc = 695700 / e.KM_PER_AU,
                  pd = 6378.1366 / e.KM_PER_AU,
                  Dd = 1738.1 / e.KM_PER_AU,
                  Cd = 1736 / e.KM_PER_AU,
                  Ed = 34 / 60;
                e.MassProduct = C;
                e.AngleBetween = N;
                var m;
                (function (a) {
                  a.Sun = "Sun";
                  a.Moon = "Moon";
                  a.Mercury = "Mercury";
                  a.Venus = "Venus";
                  a.Earth = "Earth";
                  a.Mars = "Mars";
                  a.Jupiter = "Jupiter";
                  a.Saturn = "Saturn";
                  a.Uranus = "Uranus";
                  a.Neptune = "Neptune";
                  a.Pluto = "Pluto";
                  a.SSB = "SSB";
                  a.EMB = "EMB";
                  a.Star1 = "Star1";
                  a.Star2 = "Star2";
                  a.Star3 = "Star3";
                  a.Star4 = "Star4";
                  a.Star5 = "Star5";
                  a.Star6 = "Star6";
                  a.Star7 = "Star7";
                  a.Star8 = "Star8";
                })((m = e.Body || (e.Body = {})));
                var ld = [
                    m.Star1,
                    m.Star2,
                    m.Star3,
                    m.Star4,
                    m.Star5,
                    m.Star6,
                    m.Star7,
                    m.Star8,
                  ],
                  md = [
                    { ra: 0, dec: 0, dist: 0 },
                    { ra: 0, dec: 0, dist: 0 },
                    { ra: 0, dec: 0, dist: 0 },
                    { ra: 0, dec: 0, dist: 0 },
                    { ra: 0, dec: 0, dist: 0 },
                    { ra: 0, dec: 0, dist: 0 },
                    { ra: 0, dec: 0, dist: 0 },
                    { ra: 0, dec: 0, dist: 0 },
                  ];
                e.DefineStar = function (a, b, c, d) {
                  var f = T(a);
                  if (!f) throw "Invalid star body: " + a;
                  w(b);
                  w(c);
                  w(d);
                  if (0 > b || 24 <= b)
                    throw "Invalid right ascension for star: " + b;
                  if (-90 > c || 90 < c)
                    throw "Invalid declination for star: " + c;
                  if (1 > d) throw "Invalid star distance: " + d;
                  f.ra = b;
                  f.dec = c;
                  f.dist = d * e.AU_PER_LY;
                };
                var F;
                (function (a) {
                  a[(a.From2000 = 0)] = "From2000";
                  a[(a.Into2000 = 1)] = "Into2000";
                })(F || (F = {}));
                var aa = {
                  Mercury: { OrbitalPeriod: 87.969 },
                  Venus: { OrbitalPeriod: 224.701 },
                  Earth: { OrbitalPeriod: 365.256 },
                  Mars: { OrbitalPeriod: 686.98 },
                  Jupiter: { OrbitalPeriod: 4332.589 },
                  Saturn: { OrbitalPeriod: 10759.22 },
                  Uranus: { OrbitalPeriod: 30685.4 },
                  Neptune: { OrbitalPeriod: 60189 },
                  Pluto: { OrbitalPeriod: 90560 },
                };
                e.PlanetOrbitalPeriod = function (a) {
                  if (a in aa) return aa[a].OrbitalPeriod;
                  throw "Unknown orbital period for: " + a;
                };
                var M = {
                  Mercury: [
                    [
                      [
                        [4.40250710144, 0, 0],
                        [0.40989414977, 1.48302034195, 26087.9031415742],
                        [0.050462942, 4.47785489551, 52175.8062831484],
                        [0.00855346844, 1.16520322459, 78263.70942472259],
                        [0.00165590362, 4.11969163423, 104351.61256629678],
                        [3.4561897e-4, 0.77930768443, 130439.51570787099],
                        [7.583476e-5, 3.71348404924, 156527.41884944518],
                      ],
                      [
                        [26087.90313685529, 0, 0],
                        [0.01131199811, 6.21874197797, 26087.9031415742],
                        [0.00292242298, 3.04449355541, 52175.8062831484],
                        [7.5775081e-4, 6.08568821653, 78263.70942472259],
                        [1.9676525e-4, 2.80965111777, 104351.61256629678],
                      ],
                    ],
                    [
                      [
                        [0.11737528961, 1.98357498767, 26087.9031415742],
                        [0.02388076996, 5.03738959686, 52175.8062831484],
                        [0.01222839532, 3.14159265359, 0],
                        [0.0054325181, 1.79644363964, 78263.70942472259],
                        [0.0012977877, 4.83232503958, 104351.61256629678],
                        [3.1866927e-4, 1.58088495658, 130439.51570787099],
                        [7.963301e-5, 4.60972126127, 156527.41884944518],
                      ],
                      [
                        [0.00274646065, 3.95008450011, 26087.9031415742],
                        [9.9737713e-4, 3.14159265359, 0],
                      ],
                    ],
                    [
                      [
                        [0.39528271651, 0, 0],
                        [0.07834131818, 6.19233722598, 26087.9031415742],
                        [0.00795525558, 2.95989690104, 52175.8062831484],
                        [0.00121281764, 6.01064153797, 78263.70942472259],
                        [2.1921969e-4, 2.77820093972, 104351.61256629678],
                        [4.354065e-5, 5.82894543774, 130439.51570787099],
                      ],
                      [
                        [0.0021734774, 4.65617158665, 26087.9031415742],
                        [4.4141826e-4, 1.42385544001, 52175.8062831484],
                      ],
                    ],
                  ],
                  Venus: [
                    [
                      [
                        [3.17614666774, 0, 0],
                        [0.01353968419, 5.59313319619, 10213.285546211],
                        [8.9891645e-4, 5.30650047764, 20426.571092422],
                        [5.477194e-5, 4.41630661466, 7860.4193924392],
                        [3.455741e-5, 2.6996444782, 11790.6290886588],
                        [2.372061e-5, 2.99377542079, 3930.2096962196],
                        [1.317168e-5, 5.18668228402, 26.2983197998],
                        [1.664146e-5, 4.25018630147, 1577.3435424478],
                        [1.438387e-5, 4.15745084182, 9683.5945811164],
                        [1.200521e-5, 6.15357116043, 30639.856638633],
                      ],
                      [
                        [10213.28554621638, 0, 0],
                        [9.5617813e-4, 2.4640651111, 10213.285546211],
                        [7.787201e-5, 0.6247848222, 20426.571092422],
                      ],
                    ],
                    [
                      [
                        [0.05923638472, 0.26702775812, 10213.285546211],
                        [4.0107978e-4, 1.14737178112, 20426.571092422],
                        [3.2814918e-4, 3.14159265359, 0],
                      ],
                      [[0.00287821243, 1.88964962838, 10213.285546211]],
                    ],
                    [
                      [
                        [0.72334820891, 0, 0],
                        [0.00489824182, 4.02151831717, 10213.285546211],
                        [1.658058e-5, 4.90206728031, 20426.571092422],
                        [1.378043e-5, 1.12846591367, 11790.6290886588],
                        [1.632096e-5, 2.84548795207, 7860.4193924392],
                        [4.98395e-6, 2.58682193892, 9683.5945811164],
                        [2.21985e-6, 2.01346696541, 19367.1891622328],
                        [2.37454e-6, 2.55136053886, 15720.8387848784],
                      ],
                      [[3.4551041e-4, 0.89198706276, 10213.285546211]],
                    ],
                  ],
                  Earth: [
                    [
                      [
                        [1.75347045673, 0, 0],
                        [0.03341656453, 4.66925680415, 6283.0758499914],
                        [3.4894275e-4, 4.62610242189, 12566.1516999828],
                        [3.417572e-5, 2.82886579754, 3.523118349],
                        [3.497056e-5, 2.74411783405, 5753.3848848968],
                        [3.135899e-5, 3.62767041756, 77713.7714681205],
                        [2.676218e-5, 4.41808345438, 7860.4193924392],
                        [2.342691e-5, 6.13516214446, 3930.2096962196],
                        [1.273165e-5, 2.03709657878, 529.6909650946],
                        [1.324294e-5, 0.74246341673, 11506.7697697936],
                        [9.01854e-6, 2.04505446477, 26.2983197998],
                        [1.199167e-5, 1.10962946234, 1577.3435424478],
                        [8.57223e-6, 3.50849152283, 398.1490034082],
                        [7.79786e-6, 1.17882681962, 5223.6939198022],
                        [9.9025e-6, 5.23268072088, 5884.9268465832],
                        [7.53141e-6, 2.53339052847, 5507.5532386674],
                        [5.05267e-6, 4.58292599973, 18849.2275499742],
                        [4.92392e-6, 4.20505711826, 775.522611324],
                        [3.56672e-6, 2.91954114478, 0.0673103028],
                        [2.84125e-6, 1.89869240932, 796.2980068164],
                        [2.42879e-6, 0.34481445893, 5486.777843175],
                        [3.17087e-6, 5.84901948512, 11790.6290886588],
                        [2.71112e-6, 0.31486255375, 10977.078804699],
                        [2.06217e-6, 4.80646631478, 2544.3144198834],
                        [2.05478e-6, 1.86953770281, 5573.1428014331],
                        [2.02318e-6, 2.45767790232, 6069.7767545534],
                        [1.26225e-6, 1.08295459501, 20.7753954924],
                        [1.55516e-6, 0.83306084617, 213.299095438],
                      ],
                      [
                        [6283.0758499914, 0, 0],
                        [0.00206058863, 2.67823455808, 6283.0758499914],
                        [4.303419e-5, 2.63512233481, 12566.1516999828],
                      ],
                      [[8.721859e-5, 1.07253635559, 6283.0758499914]],
                    ],
                    [
                      [],
                      [
                        [0.00227777722, 3.4137662053, 6283.0758499914],
                        [3.805678e-5, 3.37063423795, 12566.1516999828],
                      ],
                    ],
                    [
                      [
                        [1.00013988784, 0, 0],
                        [0.01670699632, 3.09846350258, 6283.0758499914],
                        [1.3956024e-4, 3.05524609456, 12566.1516999828],
                        [3.08372e-5, 5.19846674381, 77713.7714681205],
                        [1.628463e-5, 1.17387558054, 5753.3848848968],
                        [1.575572e-5, 2.84685214877, 7860.4193924392],
                        [9.24799e-6, 5.45292236722, 11506.7697697936],
                        [5.42439e-6, 4.56409151453, 3930.2096962196],
                        [4.7211e-6, 3.66100022149, 5884.9268465832],
                        [8.5831e-7, 1.27079125277, 161000.6857376741],
                        [5.7056e-7, 2.01374292245, 83996.84731811189],
                        [5.5736e-7, 5.2415979917, 71430.69561812909],
                        [1.74844e-6, 3.01193636733, 18849.2275499742],
                        [2.43181e-6, 4.2734953079, 11790.6290886588],
                      ],
                      [
                        [0.00103018607, 1.10748968172, 6283.0758499914],
                        [1.721238e-5, 1.06442300386, 12566.1516999828],
                      ],
                      [[4.359385e-5, 5.78455133808, 6283.0758499914]],
                    ],
                  ],
                  Mars: [
                    [
                      [
                        [6.20347711581, 0, 0],
                        [0.18656368093, 5.0503710027, 3340.6124266998],
                        [0.01108216816, 5.40099836344, 6681.2248533996],
                        [9.1798406e-4, 5.75478744667, 10021.8372800994],
                        [2.7744987e-4, 5.97049513147, 3.523118349],
                        [1.0610235e-4, 2.93958560338, 2281.2304965106],
                        [1.2315897e-4, 0.84956094002, 2810.9214616052],
                        [8.926784e-5, 4.15697846427, 0.0172536522],
                        [8.715691e-5, 6.11005153139, 13362.4497067992],
                        [6.797556e-5, 0.36462229657, 398.1490034082],
                        [7.774872e-5, 3.33968761376, 5621.8429232104],
                        [3.575078e-5, 1.6618650571, 2544.3144198834],
                        [4.161108e-5, 0.22814971327, 2942.4634232916],
                        [3.075252e-5, 0.85696614132, 191.4482661116],
                        [2.628117e-5, 0.64806124465, 3337.0893083508],
                        [2.937546e-5, 6.07893711402, 0.0673103028],
                        [2.389414e-5, 5.03896442664, 796.2980068164],
                        [2.579844e-5, 0.02996736156, 3344.1355450488],
                        [1.528141e-5, 1.14979301996, 6151.533888305],
                        [1.798806e-5, 0.65634057445, 529.6909650946],
                        [1.264357e-5, 3.62275122593, 5092.1519581158],
                        [1.286228e-5, 3.06796065034, 2146.1654164752],
                        [1.546404e-5, 2.91579701718, 1751.539531416],
                        [1.024902e-5, 3.69334099279, 8962.4553499102],
                        [8.91566e-6, 0.18293837498, 16703.062133499],
                        [8.58759e-6, 2.4009381194, 2914.0142358238],
                        [8.32715e-6, 2.46418619474, 3340.5951730476],
                        [8.3272e-6, 4.49495782139, 3340.629680352],
                        [7.12902e-6, 3.66335473479, 1059.3819301892],
                        [7.48723e-6, 3.82248614017, 155.4203994342],
                        [7.23861e-6, 0.67497311481, 3738.761430108],
                        [6.35548e-6, 2.92182225127, 8432.7643848156],
                        [6.55162e-6, 0.48864064125, 3127.3133312618],
                        [5.50474e-6, 3.81001042328, 0.9803210682],
                        [5.5275e-6, 4.47479317037, 1748.016413067],
                        [4.25966e-6, 0.55364317304, 6283.0758499914],
                        [4.15131e-6, 0.49662285038, 213.299095438],
                        [4.72167e-6, 3.62547124025, 1194.4470102246],
                        [3.06551e-6, 0.38052848348, 6684.7479717486],
                        [3.12141e-6, 0.99853944405, 6677.7017350506],
                        [2.93198e-6, 4.22131299634, 20.7753954924],
                        [3.02375e-6, 4.48618007156, 3532.0606928114],
                        [2.74027e-6, 0.54222167059, 3340.545116397],
                        [2.81079e-6, 5.88163521788, 1349.8674096588],
                        [2.31183e-6, 1.28242156993, 3870.3033917944],
                        [2.83602e-6, 5.7688543494, 3149.1641605882],
                        [2.36117e-6, 5.75503217933, 3333.498879699],
                        [2.74033e-6, 0.13372524985, 3340.6797370026],
                        [2.99395e-6, 2.78323740866, 6254.6266625236],
                      ],
                      [
                        [3340.61242700512, 0, 0],
                        [0.01457554523, 3.60433733236, 3340.6124266998],
                        [0.00168414711, 3.92318567804, 6681.2248533996],
                        [2.0622975e-4, 4.26108844583, 10021.8372800994],
                        [3.452392e-5, 4.7321039319, 3.523118349],
                        [2.586332e-5, 4.60670058555, 13362.4497067992],
                        [8.41535e-6, 4.45864030426, 2281.2304965106],
                      ],
                      [
                        [5.8152577e-4, 2.04961712429, 3340.6124266998],
                        [1.3459579e-4, 2.45738706163, 6681.2248533996],
                      ],
                    ],
                    [
                      [
                        [0.03197134986, 3.76832042431, 3340.6124266998],
                        [0.00298033234, 4.10616996305, 6681.2248533996],
                        [0.00289104742, 0, 0],
                        [3.1365539e-4, 4.4465105309, 10021.8372800994],
                        [3.4841e-5, 4.7881254926, 13362.4497067992],
                      ],
                      [
                        [0.00217310991, 6.04472194776, 3340.6124266998],
                        [2.0976948e-4, 3.14159265359, 0],
                        [1.2834709e-4, 1.60810667915, 6681.2248533996],
                      ],
                    ],
                    [
                      [
                        [1.53033488271, 0, 0],
                        [0.1418495316, 3.47971283528, 3340.6124266998],
                        [0.00660776362, 3.81783443019, 6681.2248533996],
                        [4.6179117e-4, 4.15595316782, 10021.8372800994],
                        [8.109733e-5, 5.55958416318, 2810.9214616052],
                        [7.485318e-5, 1.77239078402, 5621.8429232104],
                        [5.523191e-5, 1.3643630377, 2281.2304965106],
                        [3.82516e-5, 4.49407183687, 13362.4497067992],
                        [2.306537e-5, 0.09081579001, 2544.3144198834],
                        [1.999396e-5, 5.36059617709, 3337.0893083508],
                        [2.484394e-5, 4.9254563992, 2942.4634232916],
                        [1.960195e-5, 4.74249437639, 3344.1355450488],
                        [1.167119e-5, 2.11260868341, 5092.1519581158],
                        [1.102816e-5, 5.00908403998, 398.1490034082],
                        [8.99066e-6, 4.40791133207, 529.6909650946],
                        [9.92252e-6, 5.83861961952, 6151.533888305],
                        [8.07354e-6, 2.10217065501, 1059.3819301892],
                        [7.97915e-6, 3.44839203899, 796.2980068164],
                        [7.40975e-6, 1.49906336885, 2146.1654164752],
                      ],
                      [
                        [0.01107433345, 2.03250524857, 3340.6124266998],
                        [0.00103175887, 2.37071847807, 6681.2248533996],
                        [1.28772e-4, 0, 0],
                        [1.081588e-4, 2.70888095665, 10021.8372800994],
                      ],
                      [
                        [4.4242249e-4, 0.47930604954, 3340.6124266998],
                        [8.138042e-5, 0.86998389204, 6681.2248533996],
                      ],
                    ],
                  ],
                  Jupiter: [
                    [
                      [
                        [0.59954691494, 0, 0],
                        [0.09695898719, 5.06191793158, 529.6909650946],
                        [0.00573610142, 1.44406205629, 7.1135470008],
                        [0.00306389205, 5.41734730184, 1059.3819301892],
                        [9.7178296e-4, 4.14264726552, 632.7837393132],
                        [7.2903078e-4, 3.64042916389, 522.5774180938],
                        [6.4263975e-4, 3.41145165351, 103.0927742186],
                        [3.9806064e-4, 2.29376740788, 419.4846438752],
                        [3.8857767e-4, 1.27231755835, 316.3918696566],
                        [2.7964629e-4, 1.7845459182, 536.8045120954],
                        [1.358973e-4, 5.7748104079, 1589.0728952838],
                        [8.246349e-5, 3.5822792584, 206.1855484372],
                        [8.768704e-5, 3.63000308199, 949.1756089698],
                        [7.368042e-5, 5.0810119427, 735.8765135318],
                        [6.26315e-5, 0.02497628807, 213.299095438],
                        [6.114062e-5, 4.51319998626, 1162.4747044078],
                        [4.905396e-5, 1.32084470588, 110.2063212194],
                        [5.305285e-5, 1.30671216791, 14.2270940016],
                        [5.305441e-5, 4.18625634012, 1052.2683831884],
                        [4.647248e-5, 4.69958103684, 3.9321532631],
                        [3.045023e-5, 4.31676431084, 426.598190876],
                        [2.609999e-5, 1.56667394063, 846.0828347512],
                        [2.028191e-5, 1.06376530715, 3.1813937377],
                        [1.764763e-5, 2.14148655117, 1066.49547719],
                        [1.722972e-5, 3.88036268267, 1265.5674786264],
                        [1.920945e-5, 0.97168196472, 639.897286314],
                        [1.633223e-5, 3.58201833555, 515.463871093],
                        [1.431999e-5, 4.29685556046, 625.6701923124],
                        [9.73272e-6, 4.09764549134, 95.9792272178],
                      ],
                      [
                        [529.69096508814, 0, 0],
                        [0.00489503243, 4.2208293947, 529.6909650946],
                        [0.00228917222, 6.02646855621, 7.1135470008],
                        [3.0099479e-4, 4.54540782858, 1059.3819301892],
                        [2.072092e-4, 5.45943156902, 522.5774180938],
                        [1.2103653e-4, 0.16994816098, 536.8045120954],
                        [6.067987e-5, 4.42422292017, 103.0927742186],
                        [5.433968e-5, 3.98480737746, 419.4846438752],
                        [4.237744e-5, 5.89008707199, 14.2270940016],
                      ],
                      [
                        [4.7233601e-4, 4.32148536482, 7.1135470008],
                        [3.0649436e-4, 2.929777887, 529.6909650946],
                        [1.4837605e-4, 3.14159265359, 0],
                      ],
                    ],
                    [
                      [
                        [0.02268615702, 3.55852606721, 529.6909650946],
                        [0.00109971634, 3.90809347197, 1059.3819301892],
                        [0.00110090358, 0, 0],
                        [8.101428e-5, 3.60509572885, 522.5774180938],
                        [6.043996e-5, 4.25883108339, 1589.0728952838],
                        [6.437782e-5, 0.30627119215, 536.8045120954],
                      ],
                      [[7.8203446e-4, 1.52377859742, 529.6909650946]],
                    ],
                    [
                      [
                        [5.20887429326, 0, 0],
                        [0.25209327119, 3.49108639871, 529.6909650946],
                        [0.00610599976, 3.84115365948, 1059.3819301892],
                        [0.00282029458, 2.57419881293, 632.7837393132],
                        [0.00187647346, 2.07590383214, 522.5774180938],
                        [8.6792905e-4, 0.71001145545, 419.4846438752],
                        [7.2062974e-4, 0.21465724607, 536.8045120954],
                        [6.5517248e-4, 5.9799588479, 316.3918696566],
                        [2.9134542e-4, 1.67759379655, 103.0927742186],
                        [3.0135335e-4, 2.16132003734, 949.1756089698],
                        [2.3453271e-4, 3.54023522184, 735.8765135318],
                        [2.2283743e-4, 4.19362594399, 1589.0728952838],
                        [2.3947298e-4, 0.2745803748, 7.1135470008],
                        [1.3032614e-4, 2.96042965363, 1162.4747044078],
                        [9.70336e-5, 1.90669633585, 206.1855484372],
                        [1.2749023e-4, 2.71550286592, 1052.2683831884],
                        [7.057931e-5, 2.18184839926, 1265.5674786264],
                        [6.137703e-5, 6.26418240033, 846.0828347512],
                        [2.616976e-5, 2.00994012876, 1581.959348283],
                      ],
                      [
                        [0.0127180152, 2.64937512894, 529.6909650946],
                        [6.1661816e-4, 3.00076460387, 1059.3819301892],
                        [5.3443713e-4, 3.89717383175, 522.5774180938],
                        [3.1185171e-4, 4.88276958012, 536.8045120954],
                        [4.1390269e-4, 0, 0],
                      ],
                    ],
                  ],
                  Saturn: [
                    [
                      [
                        [0.87401354025, 0, 0],
                        [0.11107659762, 3.96205090159, 213.299095438],
                        [0.01414150957, 4.58581516874, 7.1135470008],
                        [0.00398379389, 0.52112032699, 206.1855484372],
                        [0.00350769243, 3.30329907896, 426.598190876],
                        [0.00206816305, 0.24658372002, 103.0927742186],
                        [7.92713e-4, 3.84007056878, 220.4126424388],
                        [2.3990355e-4, 4.66976924553, 110.2063212194],
                        [1.6573588e-4, 0.43719228296, 419.4846438752],
                        [1.4906995e-4, 5.76903183869, 316.3918696566],
                        [1.582029e-4, 0.93809155235, 632.7837393132],
                        [1.4609559e-4, 1.56518472, 3.9321532631],
                        [1.3160301e-4, 4.44891291899, 14.2270940016],
                        [1.5053543e-4, 2.71669915667, 639.897286314],
                        [1.3005299e-4, 5.98119023644, 11.0457002639],
                        [1.0725067e-4, 3.12939523827, 202.2533951741],
                        [5.863206e-5, 0.23656938524, 529.6909650946],
                        [5.227757e-5, 4.20783365759, 3.1813937377],
                        [6.126317e-5, 1.76328667907, 277.0349937414],
                        [5.019687e-5, 3.17787728405, 433.7117378768],
                        [4.59255e-5, 0.61977744975, 199.0720014364],
                        [4.005867e-5, 2.24479718502, 63.7358983034],
                        [2.953796e-5, 0.98280366998, 95.9792272178],
                        [3.87367e-5, 3.22283226966, 138.5174968707],
                        [2.461186e-5, 2.03163875071, 735.8765135318],
                        [3.269484e-5, 0.77492638211, 949.1756089698],
                        [1.758145e-5, 3.2658010994, 522.5774180938],
                        [1.640172e-5, 5.5050445305, 846.0828347512],
                        [1.391327e-5, 4.02333150505, 323.5054166574],
                        [1.580648e-5, 4.37265307169, 309.2783226558],
                        [1.123498e-5, 2.83726798446, 415.5524906121],
                        [1.017275e-5, 3.71700135395, 227.5261894396],
                        [8.48642e-6, 3.1915017083, 209.3669421749],
                      ],
                      [
                        [213.2990952169, 0, 0],
                        [0.01297370862, 1.82834923978, 213.299095438],
                        [0.00564345393, 2.88499717272, 7.1135470008],
                        [9.3734369e-4, 1.06311793502, 426.598190876],
                        [0.00107674962, 2.27769131009, 206.1855484372],
                        [4.0244455e-4, 2.04108104671, 220.4126424388],
                        [1.9941774e-4, 1.2795439047, 103.0927742186],
                        [1.0511678e-4, 2.7488034213, 14.2270940016],
                        [6.416106e-5, 0.38238295041, 639.897286314],
                        [4.848994e-5, 2.43037610229, 419.4846438752],
                        [4.056892e-5, 2.92133209468, 110.2063212194],
                        [3.768635e-5, 3.6496533078, 3.9321532631],
                      ],
                      [
                        [0.0011644133, 1.17988132879, 7.1135470008],
                        [9.1841837e-4, 0.0732519584, 213.299095438],
                        [3.6661728e-4, 0, 0],
                        [1.5274496e-4, 4.06493179167, 206.1855484372],
                      ],
                    ],
                    [
                      [
                        [0.04330678039, 3.60284428399, 213.299095438],
                        [0.00240348302, 2.85238489373, 426.598190876],
                        [8.4745939e-4, 0, 0],
                        [3.0863357e-4, 3.48441504555, 220.4126424388],
                        [3.4116062e-4, 0.57297307557, 206.1855484372],
                        [1.473407e-4, 2.11846596715, 639.897286314],
                        [9.916667e-5, 5.79003188904, 419.4846438752],
                        [6.993564e-5, 4.7360468972, 7.1135470008],
                        [4.807588e-5, 5.43305312061, 316.3918696566],
                      ],
                      [
                        [0.00198927992, 4.93901017903, 213.299095438],
                        [3.6947916e-4, 3.14159265359, 0],
                        [1.7966989e-4, 0.5197943111, 426.598190876],
                      ],
                    ],
                    [
                      [
                        [9.55758135486, 0, 0],
                        [0.52921382865, 2.39226219573, 213.299095438],
                        [0.01873679867, 5.2354960466, 206.1855484372],
                        [0.01464663929, 1.64763042902, 426.598190876],
                        [0.00821891141, 5.93520042303, 316.3918696566],
                        [0.00547506923, 5.0153261898, 103.0927742186],
                        [0.0037168465, 2.27114821115, 220.4126424388],
                        [0.00361778765, 3.13904301847, 7.1135470008],
                        [0.00140617506, 5.70406606781, 632.7837393132],
                        [0.00108974848, 3.29313390175, 110.2063212194],
                        [6.9006962e-4, 5.94099540992, 419.4846438752],
                        [6.1053367e-4, 0.94037691801, 639.897286314],
                        [4.8913294e-4, 1.55733638681, 202.2533951741],
                        [3.4143772e-4, 0.19519102597, 277.0349937414],
                        [3.2401773e-4, 5.47084567016, 949.1756089698],
                        [2.0936596e-4, 0.46349251129, 735.8765135318],
                        [9.796004e-5, 5.20477537945, 1265.5674786264],
                        [1.1993338e-4, 5.98050967385, 846.0828347512],
                        [2.08393e-4, 1.52102476129, 433.7117378768],
                                                [1.5298404e-4, 3.0594381494, 529.6909650946],
                        [6.465823e-5, 0.17732249942, 1052.2683831884],
                        [1.1380257e-4, 1.7310542704, 522.5774180938],
                        [3.419618e-5, 4.94550542171, 1581.959348283],
                      ],
                      [
                        [0.0618298134, 0.2584351148, 213.299095438],
                        [0.00506577242, 0.71114625261, 206.1855484372],
                        [0.00341394029, 5.79635741658, 426.598190876],
                        [0.00188491195, 0.47215589652, 220.4126424388],
                        [0.00186261486, 3.14159265359, 0],
                        [0.00143891146, 1.40744822888, 7.1135470008],
                      ],
                      [[0.00436902572, 4.78671677509, 213.299095438]],
                    ],
                  ],
                  Uranus: [
                    [
                      [
                        [5.48129294297, 0, 0],
                        [0.09260408234, 0.89106421507, 74.7815985673],
                        [0.01504247898, 3.6271926092, 1.4844727083],
                        [0.00365981674, 1.89962179044, 73.297125859],
                        [0.00272328168, 3.35823706307, 149.5631971346],
                        [7.0328461e-4, 5.39254450063, 63.7358983034],
                        [6.8892678e-4, 6.09292483287, 76.2660712756],
                        [6.1998615e-4, 2.26952066061, 2.9689454166],
                        [6.1950719e-4, 2.85098872691, 11.0457002639],
                        [2.646877e-4, 3.14152083966, 71.8126531507],
                        [2.5710476e-4, 6.11379840493, 454.9093665273],
                        [2.107885e-4, 4.36059339067, 148.0787244263],
                        [1.7818647e-4, 1.74436930289, 36.6485629295],
                        [1.4613507e-4, 4.73732166022, 3.9321532631],
                        [1.1162509e-4, 5.8268179635, 224.3447957019],
                        [1.099791e-4, 0.48865004018, 138.5174968707],
                        [9.527478e-5, 2.95516862826, 35.1640902212],
                                                [7.545601e-5, 5.236265824, 109.9456887885],
                                                [4.220241e-5, 3.23328220918, 70.8494453042],
                        [4.0519e-5, 2.277550173, 151.0476698429],
                        [3.354596e-5, 1.0654900738, 4.4534181249],
                        [2.926718e-5, 4.62903718891, 9.5612275556],
                        [3.49034e-5, 5.48306144511, 146.594251718],
                        [3.144069e-5, 4.75199570434, 77.7505439839],
                        [2.922333e-5, 5.35235361027, 85.8272988312],
                        [2.272788e-5, 4.36600400036, 70.3281804424],
                        [2.051219e-5, 1.51773566586, 0.1118745846],
                        [2.148602e-5, 0.60745949945, 38.1330356378],
                        [1.991643e-5, 4.92437588682, 277.0349937414],
                        [1.376226e-5, 2.04283539351, 65.2203710117],
                        [1.666902e-5, 3.62744066769, 380.12776796],
                        [1.284107e-5, 3.11347961505, 202.2533951741],
                        [1.150429e-5, 0.93343589092, 3.1813937377],
                        [1.533221e-5, 2.58594681212, 52.6901980395],
                        [1.281604e-5, 0.54271272721, 222.8603229936],
                        [1.372139e-5, 4.19641530878, 111.4301614968],
                        [1.221029e-5, 0.1990065003, 108.4612160802],
                        [9.46181e-6, 1.19253165736, 127.4717966068],
                        [1.150989e-5, 4.17898916639, 33.6796175129],
                      ],
                      [
                        [74.7815986091, 0, 0],
                        [0.00154332863, 5.24158770553, 74.7815985673],
                        [2.4456474e-4, 1.71260334156, 1.4844727083],
                        [9.258442e-5, 0.4282973235, 11.0457002639],
                        [8.265977e-5, 1.50218091379, 63.7358983034],
                        [9.15016e-5, 1.41213765216, 149.5631971346],
                      ],
                    ],
                    [
                      [
                        [0.01346277648, 2.61877810547, 74.7815985673],
                        [6.23414e-4, 5.08111189648, 149.5631971346],
                        [6.1601196e-4, 3.14159265359, 0],
                        [9.963722e-5, 1.61603805646, 76.2660712756],
                        [9.92616e-5, 0.57630380333, 73.297125859],
                      ],
                      [[3.4101978e-4, 0.01321929936, 74.7815985673]],
                    ],
                    [
                      [
                        [19.21264847206, 0, 0],
                        [0.88784984413, 5.60377527014, 74.7815985673],
                        [0.03440836062, 0.32836099706, 73.297125859],
                                                [0.0205565386, 1.7829515933, 149.5631971346],
                        [0.0064932241, 4.52247285911, 76.2660712756],
                        [0.00602247865, 3.86003823674, 63.7358983034],
                                                [0.00496404167, 1.40139935333, 454.9093665273],
                        [0.00338525369, 1.58002770318, 138.5174968707],
                        [0.00243509114, 1.57086606044, 71.8126531507],
                        [0.00190522303, 1.99809394714, 1.4844727083],
                        [0.00161858838, 2.79137786799, 148.0787244263],
                        [0.00143706183, 1.38368544947, 11.0457002639],
                        [9.3192405e-4, 0.17437220467, 36.6485629295],
                                                [7.1424548e-4, 4.24509236074, 224.3447957019],
                        [8.9806014e-4, 3.66105364565, 109.9456887885],
                        [3.9009723e-4, 1.66971401684, 70.8494453042],
                        [4.6677296e-4, 1.39976401694, 35.1640902212],
                        [3.9025624e-4, 3.36234773834, 277.0349937414],
                        [3.6755274e-4, 3.88649278513, 146.594251718],
                        [3.0348723e-4, 0.70100838798, 151.0476698429],
                        [2.9156413e-4, 3.180563367, 77.7505439839],
                        [2.2637073e-4, 0.72518687029, 529.6909650946],
                        [1.1959076e-4, 1.7504339214, 984.6003316219],
                        [2.5620756e-4, 5.25656086672, 380.12776796],
                      ],
                      [[0.01479896629, 3.67205697578, 74.7815985673]],
                    ],
                  ],
                  Neptune: [
                    [
                      [
                        [5.31188633046, 0, 0],
                        [0.0179847553, 2.9010127389, 38.1330356378],
                        [0.01019727652, 0.48580922867, 1.4844727083],
                        [0.00124531845, 4.83008090676, 36.6485629295],
                        [4.2064466e-4, 5.41054993053, 2.9689454166],
                        [3.7714584e-4, 6.09221808686, 35.1640902212],
                        [3.3784738e-4, 1.24488874087, 76.2660712756],
                        [1.6482741e-4, 7.727998e-5, 491.5579294568],
                        [9.198584e-5, 4.93747051954, 39.6175083461],
                        [8.99425e-5, 0.27462171806, 175.1660598002],
                      ],
                      [
                        [38.13303563957, 0, 0],
                        [1.6604172e-4, 4.86323329249, 1.4844727083],
                        [1.5744045e-4, 2.27887427527, 38.1330356378],
                      ],
                    ],
                    [
                      [
                                                [0.03088622933, 1.44104372644, 38.1330356378],
                        [2.7780087e-4, 5.91271884599, 76.2660712756],
                        [2.7623609e-4, 0, 0],
                        [1.5355489e-4, 2.52123799551, 36.6485629295],
                        [1.5448133e-4, 3.50877079215, 39.6175083461],
                      ],
                    ],
                    [
                      [
                        [30.07013205828, 0, 0],
                        [0.27062259632, 1.32999459377, 38.1330356378],
                        [0.01691764014, 3.25186135653, 36.6485629295],
                        [0.00807830553, 5.18592878704, 1.4844727083],
                        [0.0053776051, 4.52113935896, 35.1640902212],
                        [0.00495725141, 1.5710564165, 491.5579294568],
                        [0.00274571975, 1.84552258866, 175.1660598002],
                        [1.201232e-4, 1.92059384991, 1021.2488945514],
                        [0.00121801746, 5.79754470298, 76.2660712756],
                        [0.00100896068, 0.3770272493, 73.297125859],
                        [0.00135134092, 3.37220609835, 39.6175083461],
                        [7.571796e-5, 1.07149207335, 388.4651552382],
                      ],
                    ],
                  ],
                };
                e.DeltaT_EspenakMeeus = sa;
                e.DeltaT_JplHorizons = function (a) {
                  return sa(Math.min(a, 17 * 365.24217));
                };
                var Wb = sa;
                e.SetDeltaTFunction = function (a) {
                  Wb = a;
                };
                var O = function (a) {
                  if (a instanceof O)
                    ((this.date = a.date), (this.ut = a.ut), (this.tt = a.tt));
                  else if (a instanceof Date && Number.isFinite(a.getTime()))
                    ((this.date = a),
                      (this.ut = (a.getTime() - dd.getTime()) / 864e5),
                      (this.tt = Vb(this.ut)));
                  else if (Number.isFinite(a))
                    ((this.date = new Date(dd.getTime() + 864e5 * a)),
                      (this.ut = a),
                      (this.tt = Vb(this.ut)));
                  else
                    throw "Argument must be a Date object, an AstroTime object, or a numeric UTC Julian date.";
                };
                O.FromTerrestrialTime = function (a) {
                  for (var b = new O(a); ; ) {
                    var c = a - b.tt;
                    if (1e-12 > Math.abs(c)) return b;
                    b = b.AddDays(c);
                  }
                };
                O.prototype.toString = function () {
                  return this.date.toISOString();
                };
                O.prototype.AddDays = function (a) {
                  return new O(this.ut + a);
                };
                e.AstroTime = O;
                e.MakeTime = v;
                var $a;
                e.e_tilt = da;
                e.CalcMoonCount = 0;
                var ed = function (a, b, c, d, f, g) {
                  this.elat = a;
                  this.elon = b;
                  this.mlat = c;
                  this.mlon = d;
                  this.dist_km = f;
                  this.diam_deg = g;
                };
                e.LibrationInfo = ed;
                e.Libration = function (a) {
                  var b = v(a);
                  a = b.tt / 36525;
                  var c = a * a,
                    d = c * a,
                    f = c * c,
                    g = ea(b);
                  b = g.geo_eclip_lon;
                  var h = g.geo_eclip_lat;
                  g = g.distance_au * e.KM_PER_AU;
                  var l = 1.543 * e.DEG2RAD,
                    k =
                      e.DEG2RAD *
                      Ga(
                        93.272095 +
                          483202.0175233 * a -
                          0.0036539 * c -
                          d / 3526e3 +
                          f / 86331e4,
                      ),
                    n =
                      e.DEG2RAD *
                      Ga(
                        125.0445479 -
                          1934.1362891 * a +
                          0.0020754 * c +
                          d / 467441 -
                          f / 60616e3,
                      ),
                    p =
                      e.DEG2RAD *
                      Ga(
                        357.5291092 +
                          35999.0502909 * a -
                          1.536e-4 * c +
                          d / 2449e4,
                      ),
                    q =
                      e.DEG2RAD *
                      Ga(
                        134.9633964 +
                          477198.8675055 * a +
                          0.0087414 * c +
                          d / 69699 -
                          f / 14712e3,
                      );
                  d =
                    e.DEG2RAD *
                    Ga(
                      297.8501921 +
                        445267.1114034 * a -
                        0.0018819 * c +
                                              d / 545868 -
                        f / 113065e3,
                    );
                  c = 1 - 0.002516 * a - 7.4e-6 * c;
                  var t = b - n;
                  f = Math.atan2(
                    Math.sin(t) * Math.cos(h) * Math.cos(l) -
                      Math.sin(h) * Math.sin(l),
                    Math.cos(t) * Math.cos(h),
                  );
                  var y = Fa(e.RAD2DEG * (f - k));
                  l = Math.asin(
                    -Math.sin(t) * Math.cos(h) * Math.sin(l) -
                      Math.sin(h) * Math.cos(l),
                  );
                  t =
                    -0.02752 * Math.cos(q) +
                    -0.02245 * Math.sin(k) +
                    0.00684 * Math.cos(q - 2 * k) +
                                        -0.00293 * Math.cos(2 * k) +
                    -8.5e-4 * Math.cos(2 * k - 2 * d) +
                    -5.4e-4 * Math.cos(q - 2 * d) +
                                        -2e-4 * Math.sin(q + k) +
                    -2e-4 * Math.cos(q + 2 * k) +
                    -2e-4 * Math.cos(q - k) +
                    1.4e-4 * Math.cos(q + 2 * k - 2 * d);
                  var x =
                    -0.02816 * Math.sin(q) +
                    0.02244 * Math.cos(k) +
                    -0.00682 * Math.sin(q - 2 * k) +
                    -0.00279 * Math.sin(2 * k) +
                    -8.3e-4 * Math.sin(2 * k - 2 * d) +
                    6.9e-4 * Math.sin(q - 2 * d) +
                    4e-4 * Math.cos(q + k) +
                    -2.5e-4 * Math.sin(2 * q) +
                    -2.3e-4 * Math.sin(q + 2 * k) +
                    2e-4 * Math.cos(q - k) +
                    1.9e-4 * Math.sin(q - k) +
                    1.3e-4 * Math.sin(q + 2 * k - 2 * d) +
                    -1e-4 * Math.cos(q - 3 * k);
                  return new ed(
                    e.RAD2DEG * l + (x * Math.cos(f) - t * Math.sin(f)),
                    y +
                      (-(
                        0.0252 * c * Math.sin(p) +
                        0.00473 * Math.sin(2 * q - 2 * k) +
                        -0.00467 * Math.sin(q) +
                        0.00396 * Math.sin(e.DEG2RAD * (119.75 + 131.849 * a)) +
                        0.00276 * Math.sin(2 * q - 2 * d) +
                        0.00196 * Math.sin(n) +
                        -0.00183 * Math.cos(q - k) +
                        0.00115 * Math.sin(q - 2 * d) +
                        -9.6e-4 * Math.sin(q - d) +
                        4.6e-4 * Math.sin(2 * k - 2 * d) +
                        -3.9e-4 * Math.sin(q - k) +
                        -3.2e-4 * Math.sin(q - p - d) +
                        2.7e-4 * Math.sin(2 * q - p - 2 * d) +
                        2.3e-4 * Math.sin(e.DEG2RAD * (72.56 + 20.186 * a)) +
                        -1.4e-4 * Math.sin(2 * d) +
                        1.4e-4 * Math.cos(2 * q - 2 * k) +
                        -1.2e-4 * Math.sin(q - 2 * k) +
                        -1.2e-4 * Math.sin(2 * q) +
                        1.1e-4 * Math.sin(2 * q - 2 * p - 2 * d)
                      ) +
                        (t * Math.cos(f) + x * Math.sin(f)) * Math.tan(l)),
                    e.RAD2DEG * h,
                    e.RAD2DEG * b,
                    g,
                    2 *
                      e.RAD2DEG *
                      Math.atan(1737.4 / Math.sqrt(g * g - 1737.4 * 1737.4)),
                  );
                };
                var eb;
                e.SiderealTime = bc;
                var E = function (a, b, c, d) {
                  this.x = a;
                  this.y = b;
                  this.z = c;
                  this.t = d;
                };
                E.prototype.Length = function () {
                  return Math.hypot(this.x, this.y, this.z);
                };
                e.Vector = E;
                var I = function (a, b, c, d, f, g, h) {
                  this.x = a;
                  this.y = b;
                  this.z = c;
                  this.vx = d;
                  this.vy = f;
                  this.vz = g;
                  this.t = h;
                };
                e.StateVector = I;
                var Ba = function (a, b, c) {
                  this.lat = w(a);
                  this.lon = w(b);
                  this.dist = w(c);
                };
                e.Spherical = Ba;
                var gb = function (a, b, c, d) {
                  this.ra = w(a);
                  this.dec = w(b);
                  this.dist = w(c);
                  this.vec = d;
                };
                e.EquatorialCoordinates = gb;
                var J = function (a) {
                  this.rot = a;
                };
                e.RotationMatrix = J;
                e.MakeRotation = function (a) {
                  if (!qd(a))
                    throw "Argument must be a [3][3] array of numbers";
                  return new J(a);
                };
                var ec = function (a, b, c, d) {
                  this.azimuth = w(a);
                  this.altitude = w(b);
                  this.ra = w(c);
                  this.dec = w(d);
                };
                e.HorizontalCoordinates = ec;
                var gc = function (a, b, c) {
                  this.vec = a;
                  this.elat = w(b);
                  this.elon = w(c);
                };
                e.EclipticCoordinates = gc;
                e.Horizon = hb;
                var zb = function (a, b, c) {
                  this.latitude = a;
                  this.longitude = b;
                  this.height = c;
                  za(this);
                };
                e.Observer = zb;
                e.SunPosition = fc;
                e.Equator = Pa;
                e.ObserverVector = function (a, b, c) {
                  a = v(a);
                  var d = ca(a);
                  b = xb(b, d).pos;
                  c || (b = fb(b, a, F.Into2000));
                  return yb(b, a);
                };
                e.ObserverState = function (a, b, c) {
                  a = v(a);
                  var d = ca(a);
                  b = xb(b, d);
                  b = new I(
                    b.pos[0],
                    b.pos[1],
                    b.pos[2],
                    b.vel[0],
                    b.vel[1],
                    b.vel[2],
                    a,
                  );
                  return c
                    ? b
                    : ((c = F.Into2000),
                      c === F.Into2000
                        ? ((d = Na(a, c)),
                          (b = Ea(d, b)),
                          (a = Ma(a, c)),
                          (a = Ea(a, b)))
                        : ((d = Ma(a, c)),
                          (b = Ea(d, b)),
                          (a = Na(a, c)),
                          (a = Ea(a, b))),
                      a);
                };
                e.VectorObserver = function (a, b) {
                  var c = ca(a.t),
                    d = [a.x, a.y, a.z];
                  b ||
                    ((d = wa(d, a.t, F.From2000)),
                    (d = xa(d, a.t, F.From2000)));
                  b = d[0] * e.KM_PER_AU;
                  var f = d[1] * e.KM_PER_AU;
                  d = d[2] * e.KM_PER_AU;
                  a = Math.hypot(b, f);
                  if (1e-6 > a) {
                                                            c = 0;
                    var g = 0 < d ? 90 : -90;
                    d = Math.abs(d) - 6356.751857971648;
                  } else {
                    for (c = e.RAD2DEG * Math.atan2(f, b) - 15 * c; -180 >= c; )
                      c += 360;
                    for (; 180 < c; ) c -= 360;
                    g = Math.atan2(d, a);
                    for (var h, l = 0; ; ) {
                                            if (10 < ++l) throw "inverse_terra failed to converge.";
                      b = Math.cos(g);
                      f = Math.sin(g);
                      var k = b * b,
                        n = f * f,
                        p = k + 0.9933056020041345 * n;
                                            h = Math.sqrt(p);
                      var q = (-42.69778487239616 * f * b) / h - d * b + a * f;
                      if (1e-8 > Math.abs(q)) break;
                      g -=
                        q /
                        (-42.69778487239616 *
                          ((k - n) / h -
                            (n * k * -0.006694397995865464) /
                              (-42.69778487239616 * p)) +
                          d * f +
                          a * b);
                    }
                    g *= e.RAD2DEG;
                    h = 6378.1366 / h;
                    d =
                      Math.abs(f) > Math.abs(b)
                        ? d / f - 0.9933056020041345 * h
                        : a / b - h;
                  }
                  return new zb(g, c, 1e3 * d);
                };
                e.ObserverGravity = function (a, b) {
                  a = Math.sin(a * e.DEG2RAD);
                  a *= a;
                  return (
                    ((9.7803253359 * (1 + 0.00193185265241 * a)) /
                      Math.sqrt(1 - 0.00669437999013 * a)) *
                    (1 -
                      (3.15704e-7 - 2.10269e-9 * a) * b +
                      7.37452e-14 * b * b)
                  );
                };
                e.Ecliptic = Qa;
                e.GeoMoon = Y;
                e.EclipticGeoMoon = ib;
                e.GeoMoonState = Ra;
                e.GeoEmbState = Bb;
                var na = [
                    [
                      -73e4,
                      [-26.118207232108, -14.376168177825, 3.384402515299],
                      [
                        0.0016339372163656, -0.0027861699588508,
                        -0.0013585880229445,
                      ],
                    ],
                    [
                      -700800,
                      [41.974905202127, -0.448502952929, -12.770351505989],
                      [
                        7.3458569351457e-4, 0.0022785014891658,
                        4.8619778602049e-4,
                      ],
                    ],
                    [
                      -671600,
                      [14.706930780744, 44.269110540027, 9.353698474772],
                      [
                        -0.00210001479998, 2.2295915939915e-4,
                        7.0143443551414e-4,
                      ],
                    ],
                    [
                      -642400,
                      [-29.441003929957, -6.43016153057, 6.858481011305],
                      [
                        8.4495803960544e-4, -0.0030783914758711,
                        -0.0012106305981192,
                      ],
                    ],
                    [
                      -613200,
                      [39.444396946234, -6.557989760571, -13.913760296463],
                      [
                        0.0011480029005873, 0.0022400006880665,
                        3.5168075922288e-4,
                      ],
                    ],
                    [
                      -584e3,
                      [20.2303809507, 43.266966657189, 7.382966091923],
                      [
                        -0.0019754081700585, 5.3457141292226e-4,
                        7.5929169129793e-4,
                      ],
                    ],
                    [
                      -554800,
                      [-30.65832536462, 2.093818874552, 9.880531138071],
                      [
                        6.1010603013347e-5, -0.0031326500935382,
                        -9.9346125151067e-4,
                      ],
                    ],
                    [
                      -525600,
                      [35.737703251673, -12.587706024764, -14.677847247563],
                      [
                        0.0015802939375649, 0.0021347678412429,
                        1.9074436384343e-4,
                      ],
                    ],
                    [
                      -496400,
                      [25.466295188546, 41.367478338417, 5.216476873382],
                      [
                        -0.0018054401046468, 8.328308359951e-4,
                        8.0260156912107e-4,
                      ],
                    ],
                    [
                      -467200,
                      [-29.847174904071, 10.636426313081, 12.297904180106],
                      [
                        -6.3257063052907e-4, -0.0029969577578221,
                        -7.4476074151596e-4,
                      ],
                    ],
                    [
                      -438e3,
                      [30.774692107687, -18.236637015304, -14.945535879896],
                      [
                        0.0020113162005465, 0.0019353827024189,
                        -2.0937793168297e-6,
                      ],
                    ],
                    [
                      -408800,
                      [30.243153324028, 38.656267888503, 2.938501750218],
                      [
                        -0.0016052508674468, 0.0011183495337525,
                        8.3333973416824e-4,
                      ],
                    ],
                    [
                      -379600,
                      [-27.288984772533, 18.643162147874, 14.023633623329],
                      [
                        -0.0011856388898191, -0.0027170609282181,
                        -4.9015526126399e-4,
                      ],
                    ],
                    [
                      -350400,
                      [24.519605196774, -23.245756064727, -14.626862367368],
                      [
                        0.0024322321483154, 0.0016062008146048,
                        -2.3369181613312e-4,
                      ],
                    ],
                    [
                                            -321200,
                      [34.505274805875, 35.125338586954, 0.557361475637],
                      [
                        -0.0013824391637782, 0.0013833397561817,
                        8.4823598806262e-4,
                                              ],
                    ],
                    [
                      -292e3,
                      [-23.275363915119, 25.818514298769, 15.055381588598],
                      [
                        -0.0016062295460975, -0.0023395961498533,
                        -2.4377362639479e-4,
                      ],
                    ],
                    [
                      -262800,
                      [17.050384798092, -27.180376290126, -13.608963321694],
                      [
                        0.0028175521080578, 0.0011358749093955,
                        -4.9548725258825e-4,
                      ],
                    ],
                    [
                      -233600,
                      [38.093671910285, 30.880588383337, -1.843688067413],
                      [
                                                -0.0011317697153459, 0.0016128814698472,
                        8.4177586176055e-4,
                      ],
                                          ],
                    [
                      -204400,
                      [-18.197852930878, 31.932869934309, 15.438294826279],
                      [
                        -0.0019117272501813, -0.0019146495909842,
                        -1.9657304369835e-5,
                      ],
                    ],
                    [
                                            -175200,
                      [8.528924039997, -29.618422200048, -11.805400994258],
                      [
                        0.0031034370787005, 5.139363329243e-4,
                        -7.7293066202546e-4,
                                              ],
                    ],
                    [
                      -146e3,
                      [40.94685725864, 25.904973592021, -4.256336240499],
                      [
                        -8.3652705194051e-4, 0.0018129497136404,
                        8.156422827306e-4,
                      ],
                                          ],
                    [
                      -116800,
                      [-12.326958895325, 36.881883446292, 15.217158258711],
                      [
                        -0.0021166103705038, -0.001481442003599,
                        1.7401209844705e-4,
                      ],
                    ],
                    [
                      -87600,
                                            [-0.633258375909, -30.018759794709, -9.17193287495],
                      [
                        0.0032016994581737, -2.5279858672148e-4,
                        -0.0010411088271861,
                      ],
                    ],
                    [
                      -58400,
                      [42.936048423883, 20.344685584452, -6.588027007912],
                      [
                        -5.0525450073192e-4, 0.0019910074335507,
                        7.7440196540269e-4,
                      ],
                    ],
                    [
                      -29200,
                      [-5.975910552974, 40.61180995846, 14.470131723673],
                      [
                        -0.0022184202156107, -0.0010562361130164,
                        3.3652250216211e-4,
                      ],
                    ],
                    [
                      0,
                      [-9.875369580774, -27.978926224737, -5.753711824704],
                      [
                        0.0030287533248818, -0.0011276087003636,
                        -0.0012651326732361,
                      ],
                    ],
                    [
                      29200,
                      [43.958831986165, 14.214147973292, -8.808306227163],
                      [
                                                -1.4717608981871e-4, 0.0021404187242141,
                        7.1486567806614e-4,
                      ],
                    ],
                    [
                      58400,
                      [0.67813676352, 43.094461639362, 13.243238780721],
                      [
                        -0.0022358226110718, -6.3233636090933e-4,
                        4.7664798895648e-4,
                      ],
                    ],
                    [
                      87600,
                      [-18.282602096834, -23.30503958666, -1.766620508028],
                      [
                        0.0025567245263557, -0.0019902940754171,
                                                -0.0013943491701082,
                      ],
                    ],
                    [
                      116800,
                      [43.873338744526, 7.700705617215, -10.814273666425],
                      [
                        2.3174803055677e-4, 0.0022402163127924,
                        6.2988756452032e-4,
                                              ],
                    ],
                    [
                      146e3,
                      [7.392949027906, 44.382678951534, 11.629500214854],
                      [
                        -0.002193281545383, -2.1751799585364e-4,
                        5.9556516201114e-4,
                      ],
                    ],
                    [
                      175200,
                      [-24.981690229261, -16.204012851426, 2.466457544298],
                      [
                        0.001819398914958, -0.0026765419531201,
                        -0.0013848283502247,
                      ],
                    ],
                    [
                                            204400,
                      [42.530187039511, 0.845935508021, -12.554907527683],
                      [
                        6.5059779150669e-4, 0.0022725657282262,
                        5.1133743202822e-4,
                      ],
                    ],
                    [
                      233600,
                      [13.999526486822, 44.462363044894, 9.669418486465],
                      [
                                                -0.0021079296569252, 1.7533423831993e-4,
                        6.9128485798076e-4,
                      ],
                    ],
                    [
                      262800,
                      [-29.184024803031, -7.371243995762, 6.493275957928],
                      [
                        9.3581363109681e-4, -0.0030610357109184,
                        -0.0012364201089345,
                                             ],
                    ],
                    [
                      292e3,
                      [39.831980671753, -6.078405766765, -13.909815358656],
                      [
                        0.0011117769689167, 0.0022362097830152,
                        3.6230548231153e-4,
                      ],
                    ],
                    [
                      321200,
                      [20.294955108476, 43.417190420251, 7.450091985932],
                      [
                        -0.0019742157451535, 5.3102050468554e-4,
                        7.5938408813008e-4,
                      ],
                    ],
                    [
                      350400,
                      [-30.66999230216, 2.318743558955, 9.973480913858],
                      [
                        4.5605107450676e-5, -0.0031308219926928,
                        -9.9066533301924e-4,
                      ],
                    ],
                    [
                      379600,
                      [35.626122155983, -12.897647509224, -14.777586508444],
                      [
                        0.0016015684949743, 0.0021171931182284,
                        1.8002516202204e-4,
                      ],
                    ],
                    [
                      408800,
                      [26.133186148561, 41.232139187599, 5.00640132622],
                      [
                        -0.0017857704419579, 8.6046232702817e-4,
                        8.0614690298954e-4,
                      ],
                    ],
                    [
                      438e3,
                      [-29.57674022923, 11.863535943587, 12.631323039872],
                      [
                        -7.2292830060955e-4, -0.0029587820140709,
                        -7.08242964503e-4,
                      ],
                    ],
                    [
                      467200,
                      [29.910805787391, -19.159019294, -15.013363865194],
                      [
                        0.0020871080437997, 0.0018848372554514,
                        -3.8528655083926e-5,
                      ],
                    ],
                    [
                      496400,
                      [31.375957451819, 38.050372720763, 2.433138343754],
                      [
                        -0.0015546055556611, 0.0011699815465629,
                        8.3565439266001e-4,
                      ],
                    ],
                                      [
                      525600,
                      [-26.360071336928, 20.662505904952, 14.414696258958],
                      [
                        -0.0013142373118349, -0.0026236647854842,
                        -4.2542017598193e-4,
                      ],
                    ],
                    [
                      554800,
                      [22.599441488648, -24.508879898306, -14.484045731468],
                      [
                        0.0025454108304806, 0.0014917058755191,
                        -3.0243665086079e-4,
                      ],
                    ],
                    [
                      584e3,
                      [35.877864013014, 33.894226366071, -0.224524636277],
                      [
                        -0.0012941245730845, 0.0014560427668319,
                        8.4762160640137e-4,
                      ],
                    ],
                    [
                      613200,
                      [-21.538149762417, 28.204068269761, 15.321973799534],
                      [
                        -0.001731211740901, -0.0021939631314577,
                        -1.631691327518e-4,
                      ],
                    ],
                    [
                      642400,
                      [13.971521374415, -28.339941764789, -13.083792871886],
                      [
                        0.0029334630526035, 9.1860931752944e-4,
                        -5.9939422488627e-4,
                      ],
                    ],
                    [
                      671600,
                      [39.526942044143, 28.93989736011, -2.872799527539],
                      [
                        -0.0010068481658095, 0.001702113288809,
                        8.3578230511981e-4,
                      ],
                    ],
                    [
                      700800,
                      [-15.576200701394, 34.399412961275, 15.466033737854],
                      [
                        -0.0020098814612884, -0.0017191109825989,
                        7.0414782780416e-5,
                      ],
                    ],
                    [
                      73e4,
                      [4.24325283709, -30.118201690825, -10.707441231349],
                      [
                        0.0031725847067411, 1.609846120227e-4,
                        -9.0672150593868e-4,
                      ],
                    ],
                  ],
                  B = function (a, b, c) {
                    this.x = a;
                    this.y = b;
                    this.z = c;
                  };
                B.prototype.clone = function () {
                  return new B(this.x, this.y, this.z);
                };
                B.prototype.ToAstroVector = function (a) {
                  return new E(this.x, this.y, this.z, a);
                };
                B.zero = function () {
                  return new B(0, 0, 0);
                };
                B.prototype.quadrature = function () {
                  return this.x * this.x + this.y * this.y + this.z * this.z;
                };
                B.prototype.add = function (a) {
                  return new B(this.x + a.x, this.y + a.y, this.z + a.z);
                };
                B.prototype.sub = function (a) {
                  return new B(this.x - a.x, this.y - a.y, this.z - a.z);
                };
                B.prototype.incr = function (a) {
                  this.x += a.x;
                  this.y += a.y;
                  this.z += a.z;
                };
                B.prototype.decr = function (a) {
                  this.x -= a.x;
                  this.y -= a.y;
                  this.z -= a.z;
                };
                B.prototype.mul = function (a) {
                  return new B(a * this.x, a * this.y, a * this.z);
                };
                B.prototype.div = function (a) {
                  return new B(this.x / a, this.y / a, this.z / a);
                };
                B.prototype.mean = function (a) {
                  return new B(
                    (this.x + a.x) / 2,
                    (this.y + a.y) / 2,
                    (this.z + a.z) / 2,
                  );
                };
                B.prototype.neg = function () {
                  return new B(-this.x, -this.y, -this.z);
                };
                var X = function (a, b, c) {
                  this.tt = a;
                  this.r = b;
                  this.v = c;
                };
                X.prototype.clone = function () {
                  return new X(this.tt, this.r, this.v);
                };
                X.prototype.sub = function (a) {
                  return new X(this.tt, this.r.sub(a.r), this.v.sub(a.v));
                };
                var Da = function (a) {
                  var b = new X(a, new B(0, 0, 0), new B(0, 0, 0));
                  this.Jupiter = R(b, a, m.Jupiter, 2.825345909524226e-7);
                  this.Saturn = R(b, a, m.Saturn, 8.459715185680659e-8);
                  this.Uranus = R(b, a, m.Uranus, 1.292024916781969e-8);
                  this.Neptune = R(b, a, m.Neptune, 1.524358900784276e-8);
                  this.Jupiter.r.decr(b.r);
                  this.Jupiter.v.decr(b.v);
                  this.Saturn.r.decr(b.r);
                  this.Saturn.v.decr(b.v);
                  this.Uranus.r.decr(b.r);
                  this.Uranus.v.decr(b.v);
                  this.Neptune.r.decr(b.r);
                  this.Neptune.v.decr(b.v);
                  this.Sun = new X(a, b.r.mul(-1), b.v.mul(-1));
                };
                Da.prototype.Acceleration = function (a) {
                  var b = Ta(a, 2.959122082855911e-4, this.Sun.r);
                  b.incr(Ta(a, 2.825345909524226e-7, this.Jupiter.r));
                  b.incr(Ta(a, 8.459715185680659e-8, this.Saturn.r));
                  b.incr(Ta(a, 1.292024916781969e-8, this.Uranus.r));
                  b.incr(Ta(a, 1.524358900784276e-8, this.Neptune.r));
                  return b;
                };
                var Ua = function (a, b, c, d) {
                  this.tt = a;
                  this.r = b;
                  this.v = c;
                  this.a = d;
                };
                Ua.prototype.clone = function () {
                  return new Ua(
                    this.tt,
                    this.r.clone(),
                    this.v.clone(),
                    this.a.clone(),
                  );
                };
                var ic = function (a, b) {
                    this.bary = a;
                    this.grav = b;
                  },
                  Ib = [],
                  rd = new J([
                    [0.999432765338654, -0.0336771074697641, 0],
                    [0.0303959428906285, 0.902057912352809, 0.430543388542295],
                    [
                      -0.0144994559663353, -0.430299169409101,
                      0.902569881273754,
                    ],
                  ]),
                  tb = [
                    {
                                            mu: 2.82489428433814e-7,
                      al: [1.446213296021224, 3.5515522861824],
                      a: [[0.0028210960212903, 0, 0]],
                      l: [
                        [-1.925258348666e-4, 4.9369589722645, 0.01358483658305],
                        [-9.70803596076e-5, 4.3188796477322, 0.01303413843243],
                        [-8.988174165e-5, 1.9080016428617, 0.00305064867158],
                        [-5.53101050262e-5, 1.4936156681569, 0.01293892891155],
                      ],
                      z: [
                        [0.0041510849668155, 4.089939635545, -0.01290686414666],
                        [6.260521444113e-4, 1.446188898627, 3.5515522949802],
                        [3.52747346169e-5, 2.1256287034578, 1.2727416567e-4],
                      ],
                      zeta: [
                        [3.142172466014e-4, 2.7964219722923, -0.002315096098],
                        [9.04169207946e-5, 1.0477061879627, -5.6920638196e-4],
                      ],
                    },
                    {
                      mu: 2.82483274392893e-7,
                      al: [-0.3735263437471362, 1.76932271112347],
                      a: [
                        [0.0044871037804314, 0, 0],
                        [4.324367498e-7, 1.819645606291, 1.7822295777568],
                      ],
                      l: [
                        [8.576433172936e-4, 4.3188693178264, 0.01303413830805],
                        [4.549582875086e-4, 1.4936531751079, 0.01293892881962],
                        [3.248939825174e-4, 1.8196494533458, 1.7822295777568],
                                                [-3.074250079334e-4, 4.9377037005911, 0.01358483286724],
                        [1.982386144784e-4, 1.907986905476, 0.00305101212869],
                        [1.834063551804e-4, 2.1402853388529, 0.00145009789338],
                        [-1.434383188452e-4, 5.622214036663, 0.89111478887838],
                        [-7.71939140944e-5, 4.300272437235, 2.6733443704266],
                      ],
                      z: [
                        [
                          -0.0093589104136341, 4.0899396509039,
                          -0.01290686414666,
                        ],
                        [2.988994545555e-4, 5.9097265185595, 1.7693227079462],
                        [2.13903639035e-4, 2.1256289300016, 1.2727418407e-4],
                        [1.980963564781e-4, 2.743516829265, 6.7797343009e-4],
                        [1.210388158965e-4, 5.5839943711203, 3.20566149e-5],
                        [8.37042048393e-5, 1.6094538368039, -0.90402165808846],
                        [8.23525166369e-5, 1.4461887708689, 3.5515522949802],
                      ],
                      zeta: [
                        [0.0040404917832303, 1.0477063169425, -5.692064054e-4],
                        [2.200421034564e-4, 3.3368857864364, -1.2491307307e-4],
                        [1.662544744719e-4, 2.4134862374711, 0],
                        [5.90282470983e-5, 5.9719930968366, -3.056160225e-5],
                      ],
                    },
                    {
                      mu: 2.82498184184723e-7,
                      al: [0.2874089391143348, 0.878207923589328],
                      a: [
                        [0.0071566594572575, 0, 0],
                        [1.393029911e-6, 1.1586745884981, 2.6733443704266],
                      ],
                      l: [
                        [2.310797886226e-4, 2.1402987195942, 0.00145009784384],
                        [-1.828635964118e-4, 4.3188672736968, 0.01303413828263],
                        [1.512378778204e-4, 4.9373102372298, 0.01358483481252],
                        [-1.163720969778e-4, 4.300265986149, 2.6733443704266],
                        [-9.55478069846e-5, 1.4936612842567, 0.01293892879857],
                        [8.15246854464e-5, 5.6222137132535, 0.89111478887838],
                        [-8.01219679602e-5, 1.2995922951532, 1.0034433456729],
                        [-6.07017260182e-5, 0.64978769669238, 0.50172167043264],
                      ],
                      z: [
                        [0.0014289811307319, 2.1256295942739, 1.2727413029e-4],
                        [7.71093122676e-4, 5.5836330003496, 3.20643411e-5],
                        [5.925911780766e-4, 4.0899396636448, -0.01290686414666],
                        [2.045597496146e-4, 5.2713683670372, -0.12523544076106],
                        [1.785118648258e-4, 0.28743156721063, 0.8782079244252],
                        [1.131999784893e-4, 1.4462127277818, 3.5515522949802],
                        [-6.5877816921e-5, 2.2702423990985, -1.7951364394537],
                        [4.97058888328e-5, 5.9096792204858, 1.7693227129285],
                      ],
                      zeta: [
                        [0.0015932721570848, 3.3368862796665, -1.2491307058e-4],
                        [8.533093128905e-4, 2.4133881688166, 0],
                        [3.513347911037e-4, 5.9720789850127, -3.056101771e-5],
                        [-1.441929255483e-4, 1.0477061764435, -5.6920632124e-4],
                      ],
                    },
                    {
                      mu: 2.82492144889909e-7,
                      al: [-0.3620341291375704, 0.376486233433828],
                      a: [
                        [0.0125879701715314, 0, 0],
                        [3.595204947e-6, 0.64965776007116, 0.50172168165034],
                        [2.7580210652e-6, 1.808423578151, 3.1750660413359],
                      ],
                      l: [
                        [5.586040123824e-4, 2.1404207189815, 0.00145009793231],
                        [-3.805813868176e-4, 2.7358844897853, 2.972965062e-5],
                        [2.205152863262e-4, 0.649796525964, 0.5017216724358],
                        [1.877895151158e-4, 1.8084787604005, 3.1750660413359],
                        [7.66916975242e-5, 6.2720114319755, 1.3928364636651],
                        [7.47056855106e-5, 1.2995916202344, 1.0034433456729],
                      ],
                      z: [
                        [0.0073755808467977, 5.5836071576084, 3.206509914e-5],
                        [2.065924169942e-4, 5.9209831565786, 0.37648624194703],
                        [1.589869764021e-4, 0.28744006242623, 0.8782079244252],
                        [-1.561131605348e-4, 2.1257397865089, 1.2727441285e-4],
                        [1.486043380971e-4, 1.4462134301023, 3.5515522949802],
                        [6.35073108731e-5, 5.9096803285954, 1.7693227129285],
                        [5.99351698525e-5, 4.1125517584798, -2.7985797954589],
                        [5.40660842731e-5, 5.5390350845569, 0.00286834082283],
                        [-4.89596900866e-5, 4.6218149483338, -0.62695712529519],
                      ],
                      zeta: [
                        [0.0038422977898495, 2.4133922085557, 0],
                        [0.0022453891791894, 5.9721736773277, -3.056125525e-5],
                        [-2.604479450559e-4, 3.3368746306409, -1.2491309972e-4],
                        [3.3211214323e-5, 5.5604137742337, 0.00290037688507],
                      ],
                    },
                  ],
                  fd = function (a, b, c, d) {
                    this.io = a;
                    this.europa = b;
                    this.ganymede = c;
                    this.callisto = d;
                  };
                e.JupiterMoonsInfo = fd;
                e.JupiterMoons = function (a) {
                  a = new O(a);
                  return new fd(
                    kb(a, tb[0]),
                    kb(a, tb[1]),
                    kb(a, tb[2]),
                    kb(a, tb[3]),
                  );
                };
                e.HelioVector = Z;
                e.HelioDistance = oa;
                e.CorrectLightTravel = lc;
                var nc = function (a, b, c, d) {
                  this.observerBody = a;
                  this.targetBody = b;
                  this.aberration = c;
                  this.observerPos = d;
                };
                nc.prototype.Position = function (a) {
                  this.aberration &&
                    (this.observerPos = Z(this.observerBody, a));
                  var b = Z(this.targetBody, a);
                  return new E(
                    b.x - this.observerPos.x,
                    b.y - this.observerPos.y,
                    b.z - this.observerPos.z,
                    a,
                  );
                };
                e.BackdatePosition = mc;
                e.GeoVector = W;
                e.BaryState = function (a, b) {
                  b = v(b);
                  if (a === m.SSB) return new I(0, 0, 0, 0, 0, 0, b);
                  if (a === m.Pluto) return Hb(b, !1);
                  var c = new Da(b.tt);
                  switch (a) {
                    case m.Sun:
                      return pa(c.Sun, b);
                    case m.Jupiter:
                      return pa(c.Jupiter, b);
                    case m.Saturn:
                      return pa(c.Saturn, b);
                    case m.Uranus:
                      return pa(c.Uranus, b);
                    case m.Neptune:
                      return pa(c.Neptune, b);
                    case m.Moon:
                    case m.EMB:
                      var d = Sa(M[m.Earth], b.tt);
                      a = a === m.Moon ? Ra(b) : Bb(b);
                      return new I(
                        a.x + c.Sun.r.x + d.r.x,
                        a.y + c.Sun.r.y + d.r.y,
                        a.z + c.Sun.r.z + d.r.z,
                        a.vx + c.Sun.v.x + d.v.x,
                        a.vy + c.Sun.v.y + d.v.y,
                        a.vz + c.Sun.v.z + d.v.z,
                        b,
                      );
                  }
                  if (a in M)
                    return (
                      (a = Sa(M[a], b.tt)),
                      new I(
                        c.Sun.r.x + a.r.x,
                        c.Sun.r.y + a.r.y,
                        c.Sun.r.z + a.r.z,
                        c.Sun.v.x + a.v.x,
                        c.Sun.v.y + a.v.y,
                        c.Sun.v.z + a.v.z,
                        b,
                      )
                    );
                  throw 'BaryState: Unsupported body "' + a + '"';
                };
                e.HelioState = mb;
                e.Search = K;
                e.SearchSunLongitude = oc;
                e.PairLongitude = Jb;
                e.AngleFromSun = Ha;
                e.EclipticLongitude = qa;
                var pc = function (a, b, c, d, f, g, h, l) {
                  this.time = a;
                  this.mag = b;
                  this.phase_angle = c;
                  this.helio_dist = d;
                  this.geo_dist = f;
                  this.gc = g;
                  this.hc = h;
                  this.ring_tilt = l;
                  this.phase_fraction = (1 + Math.cos(e.DEG2RAD * c)) / 2;
                };
                e.IlluminationInfo = pc;
                e.Illumination = nb;
                e.SearchRelativeLongitude = Ia;
                e.MoonPhase = Kb;
                e.SearchMoonPhase = Wa;
                var rc = function (a, b) {
                  this.quarter = a;
                  this.time = b;
                };
                e.MoonQuarter = rc;
                e.SearchMoonQuarter = qc;
                e.NextMoonQuarter = function (a) {
                  a = new Date(a.time.date.getTime() + 5184e5);
                  return qc(a);
                };
                var tc = function (a, b, c) {
                  this.pressure = a;
                  this.temperature = b;
                  this.density = c;
                };
                e.AtmosphereInfo = tc;
                e.Atmosphere = sc;
                e.SearchRiseSet = function (a, b, c, d, f, g) {
                  g = void 0 === g ? 0 : g;
                  if (!Number.isFinite(g) || 0 > g)
                    throw "Invalid value for metersAboveGround: " + g;
                  a: switch (a) {
                    case m.Sun:
                      var h = Nc;
                      break a;
                    case m.Moon:
                      h = Dd;
                      break a;
                    default:
                      h = 0;
                  }
                  var l = sc(b.height - g),
                    k = b.latitude * e.DEG2RAD,
                    n = Math.sin(k);
                  k = Math.cos(k);
                  var p = 1 / Math.hypot(k, 0.996647180302104 * n),
                    q = (b.height - g) / 1e3,
                    t =
                      0.175 *
                      Math.pow(
                        1 - (0.0065 / 283.15) * (b.height - (2 / 3) * g),
                        3.256,
                      );
                  return uc(
                    a,
                    b,
                    c,
                    d,
                    f,
                    h,
                    e.RAD2DEG *
                      -(
                        Math.sqrt(
                          (2 * (1 - t) * g) /
                            (1e3 *
                              Math.hypot(
                                (6378.1366 * p + q) * k,
                                (6335.438815127603 * p + q) * n,
                              )),
                        ) /
                        (1 - t)
                      ) -
                      Ed * l.density,
                  );
                };
                e.SearchAltitude = function (a, b, c, d, f, g) {
                  if (!Number.isFinite(g) || -90 > g || 90 < g)
                    throw "Invalid altitude angle: " + g;
                  return uc(a, b, c, d, f, 0, g);
                };
                var ud = function (a, b, c, d) {
                    this.tx = a;
                    this.ty = b;
                    this.ax = c;
                    this.ay = d;
                  },
                  gd = function (a, b) {
                    this.time = a;
                    this.hor = b;
                  };
                e.HourAngleEvent = gd;
                e.SearchHourAngle = function (a, b, c, d, f) {
                  f = void 0 === f ? 1 : f;
                  za(b);
                  d = v(d);
                  var g = 0;
                  if (a === m.Earth)
                    throw "Cannot search for hour angle of the Earth.";
                  w(c);
                  if (0 > c || 24 <= c) throw "Invalid hour angle " + c;
                  w(f);
                  if (0 === f) throw "Direction must be positive or negative.";
                  for (;;) {
                    ++g;
                    var h = ca(d),
                      l = Pa(a, d, b, !0, !0);
                    h = (c + l.ra - b.longitude / 15 - h) % 24;
                    1 === g
                      ? 0 < f
                        ? 0 > h && (h += 24)
                        : 0 < h && (h -= 24)
                      : -12 > h
                        ? (h += 24)
                        : 12 < h && (h -= 24);
                    if (0.1 > 3600 * Math.abs(h))
                      return (
                        (a = hb(d, b, l.ra, l.dec, "normal")),
                        new gd(d, a)
                      );
                    d = d.AddDays((h / 24) * 0.9972695717592592);
                  }
                };
                e.HourAngle = function (a, b, c) {
                  var d = v(b);
                  b = bc(d);
                  a = Pa(a, d, c, !0, !0);
                  c = (c.longitude / 15 + b - a.ra) % 24;
                  0 > c && (c += 24);
                  return c;
                };
                var hd = function (a, b, c, d) {
                  this.mar_equinox = a;
                  this.jun_solstice = b;
                  this.sep_equinox = c;
                  this.dec_solstice = d;
                };
                e.SeasonInfo = hd;
                e.Seasons = function (a) {
                  function b(h, l, k) {
                    l = new Date(Date.UTC(a, l - 1, k));
                    h = oc(h, l, 20);
                    if (!h)
                      throw "Cannot find season change near " + l.toISOString();
                    return h;
                  }
                  a instanceof Date &&
                    Number.isFinite(a.getTime()) &&
                    (a = a.getUTCFullYear());
                  if (!Number.isSafeInteger(a))
                    throw (
                      "Cannot calculate seasons because year argument " +
                      a +
                      " is neither a Date nor a safe integer."
                    );
                  var c = b(0, 3, 10),
                    d = b(90, 6, 10),
                    f = b(180, 9, 10),
                    g = b(270, 12, 10);
                  return new hd(c, d, f, g);
                };
                var wc = function (a, b, c, d) {
                  this.time = a;
                  this.visibility = b;
                  this.elongation = c;
                  this.ecliptic_separation = d;
                };
                e.ElongationEvent = wc;
                e.Elongation = vc;
                e.SearchMaxElongation = function (a, b) {
                  function c(n) {
                    var p = n.AddDays(-0.005);
                    n = n.AddDays(0.005);
                    p = Ha(a, p);
                    n = Ha(a, n);
                    return (p - n) / 0.01;
                  }
                  b = v(b);
                  var d = {
                    Mercury: { s1: 50, s2: 85 },
                    Venus: { s1: 40, s2: 50 },
                  }[a];
                  if (!d)
                    throw "SearchMaxElongation works for Mercury and Venus only.";
                  for (var f = 0; 2 >= ++f; ) {
                    var g = qa(a, b),
                      h = qa(m.Earth, b),
                      l = Fa(g - h),
                      k = (g = h = void 0);
                    l >= -d.s1 && l < +d.s1
                      ? ((k = 0), (h = +d.s1), (g = +d.s2))
                      : l >= +d.s2 || l < -d.s2
                        ? ((k = 0), (h = -d.s2), (g = -d.s1))
                        : 0 <= l
                          ? ((k = -Va(a) / 4), (h = +d.s1), (g = +d.s2))
                          : ((k = -Va(a) / 4), (h = -d.s2), (g = -d.s1));
                    l = b.AddDays(k);
                    h = Ia(a, h, l);
                    g = Ia(a, g, h);
                    l = c(h);
                    if (0 <= l)
                      throw "SearchMaxElongation: internal error: m1 = " + l;
                    k = c(g);
                    if (0 >= k)
                      throw "SearchMaxElongation: internal error: m2 = " + k;
                    l = K(c, h, g, {
                      init_f1: l,
                      init_f2: k,
                      dt_tolerance_seconds: 10,
                    });
                    if (!l)
                      throw (
                        "SearchMaxElongation: failed search iter " +
                        f +
                        " (t1=" +
                        h.toString() +
                        ", t2=" +
                        g.toString() +
                        ")"
                      );
                    if (l.tt >= b.tt) return vc(a, l);
                    b = g.AddDays(1);
                  }
                  throw "SearchMaxElongation: failed to find event after 2 tries.";
                };
                e.SearchPeakMagnitude = function (a, b) {
                  function c(k) {
                    var n = k.AddDays(-0.005);
                    k = k.AddDays(0.005);
                    n = nb(a, n).mag;
                    return (nb(a, k).mag - n) / 0.01;
                  }
                  if (a !== m.Venus)
                    throw "SearchPeakMagnitude currently works for Venus only.";
                  b = v(b);
                  for (var d = 0; 2 >= ++d; ) {
                    var f = qa(a, b),
                      g = qa(m.Earth, b),
                      h = Fa(f - g),
                      l = (f = g = void 0);
                    -10 <= h && 10 > h
                      ? ((l = 0), (g = 10), (f = 30))
                      : 30 <= h || -30 > h
                        ? ((l = 0), (g = -30), (f = -10))
                        : 0 <= h
                          ? ((l = -Va(a) / 4), (g = 10), (f = 30))
                          : ((l = -Va(a) / 4), (g = -30), (f = -10));
                    h = b.AddDays(l);
                    g = Ia(a, g, h);
                                        f = Ia(a, f, g);
                    h = c(g);
                    if (0 <= h)
                      throw "SearchPeakMagnitude: internal error: m1 = " + h;
                    l = c(f);
                    if (0 >= l)
                      throw "SearchPeakMagnitude: internal error: m2 = " + l;
                    h = K(c, g, f, {
                      init_f1: h,
                      init_f2: l,
                      dt_tolerance_seconds: 10,
                    });
                    if (!h)
                      throw (
                        "SearchPeakMagnitude: failed search iter " +
                        d +
                        " (t1=" +
                        g.toString() +
                        ", t2=" +
                        f.toString() +
                        ")"
                      );
                    if (h.tt >= b.tt) return nb(a, h);
                    b = f.AddDays(1);
                  }
                  throw "SearchPeakMagnitude: failed to find event after 2 tries.";
                };
                var Ja;
                (function (a) {
                  a[(a.Pericenter = 0)] = "Pericenter";
                  a[(a.Apocenter = 1)] = "Apocenter";
                })((Ja = e.ApsisKind || (e.ApsisKind = {})));
                var Xa = function (a, b, c) {
                  this.time = a;
                  this.kind = b;
                  this.dist_au = c;
                  this.dist_km = c * e.KM_PER_AU;
                };
                e.Apsis = Xa;
                e.SearchLunarApsis = xc;
                e.NextLunarApsis = function (a) {
                  var b = xc(a.time.AddDays(11));
                  if (1 !== b.kind + a.kind)
                    throw (
                      "NextLunarApsis INTERNAL ERROR: did not find alternating apogee/perigee: prev=" +
                      a.kind +
                      " @ " +
                      a.time.toString() +
                      ", next=" +
                      b.kind +
                      " @ " +
                      b.time.toString()
                    );
                  return b;
                };
                e.SearchPlanetApsis = zc;
                e.NextPlanetApsis = function (a, b) {
                  if (b.kind !== Ja.Pericenter && b.kind !== Ja.Apocenter)
                    throw "Invalid apsis kind: " + b.kind;
                  var c = b.time.AddDays(0.25 * aa[a].OrbitalPeriod);
                  a = zc(a, c);
                  if (1 !== a.kind + b.kind)
                    throw (
                      "Internal error: previous apsis was " +
                      b.kind +
                      ", but found " +
                      a.kind +
                      " for next apsis."
                    );
                  return a;
                };
                e.InverseRotation = Ka;
                e.CombineRotation = ja;
                e.IdentityMatrix = function () {
                  return new J([
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1],
                  ]);
                };
                e.Pivot = function (a, b, c) {
                  if (0 !== b && 1 !== b && 2 !== b)
                    throw "Invalid axis " + b + ". Must be [0, 1, 2].";
                  var d = w(c) * e.DEG2RAD;
                  c = Math.cos(d);
                  d = Math.sin(d);
                  var f = (b + 1) % 3,
                    g = (b + 2) % 3,
                    h = [
                      [0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0],
                    ];
                  h[f][f] = c * a.rot[f][f] - d * a.rot[f][g];
                  h[f][g] = d * a.rot[f][f] + c * a.rot[f][g];
                  h[f][b] = a.rot[f][b];
                  h[g][f] = c * a.rot[g][f] - d * a.rot[g][g];
                  h[g][g] = d * a.rot[g][f] + c * a.rot[g][g];
                  h[g][b] = a.rot[g][b];
                  h[b][f] = c * a.rot[b][f] - d * a.rot[b][g];
                  h[b][g] = d * a.rot[b][f] + c * a.rot[b][g];
                  h[b][b] = a.rot[b][b];
                                    return new J(h);
                };
                e.VectorFromSphere = lb;
                e.EquatorFromVector = Mb;
                e.SphereFromVector = Nb;
                e.HorizonFromVector = function (a, b) {
                  a = Nb(a);
                  a.lon = Ac(a.lon);
                  a.lat += Oa(b, a.lat);
                  return a;
                };
                e.VectorFromHorizon = function (a, b, c) {
                  b = v(b);
                  var d = Ac(a.lon);
                  c = a.lat + Bc(c, a.lat);
                  a = new Ba(c, d, a.dist);
                  return lb(a, b);
                };
                e.Refraction = Oa;
                e.InverseRefraction = Bc;
                e.RotateVector = Ya;
                e.RotateState = Ea;
                e.Rotation_EQJ_ECL = Cc;
                e.Rotation_ECL_EQJ = function () {
                  return new J([
                    [1, 0, 0],
                    [0, 0.9174821430670688, 0.3977769691083922],
                    [0, -0.3977769691083922, 0.9174821430670688],
                  ]);
                };
                e.Rotation_EQJ_EQD = ob;
                e.Rotation_EQJ_ECT = function (a) {
                  var b = v(a);
                  a = ob(b);
                  b = Jc(b);
                  return ja(a, b);
                };
                e.Rotation_ECT_EQJ = function (a) {
                  var b = v(a);
                  a = Ic(b);
                  b = pb(b);
                  return ja(a, b);
                };
                e.Rotation_EQD_EQJ = pb;
                e.Rotation_EQD_HOR = Ob;
                e.Rotation_HOR_EQD = Dc;
                e.Rotation_HOR_EQJ = Ec;
                e.Rotation_EQJ_HOR = function (a, b) {
                  a = Ec(a, b);
                  return Ka(a);
                                  };
                e.Rotation_EQD_ECL = Fc;
                e.Rotation_ECL_EQD = Gc;
                e.Rotation_ECL_HOR = Hc;
                e.Rotation_HOR_ECL = function (a, b) {
                  a = Hc(a, b);
                  return Ka(a);
                };
                e.Rotation_EQJ_GAL = function () {
                  return new J([
                    [
                      -0.0548624779711344, 0.4941095946388765,
                      -0.8676668813529025,
                    ],
                    [
                      -0.8734572784246782, -0.4447938112296831,
                      -0.1980677870294097,
                    ],
                    [
                      -0.483800052994852, 0.7470034631630423,
                      0.4559861124470794,
                    ],
                  ]);
                };
                e.Rotation_GAL_EQJ = function () {
                  return new J([
                    [
                      -0.0548624779711344, -0.8734572784246782,
                      -0.483800052994852,
                    ],
                    [
                      0.4941095946388765, -0.4447938112296831,
                      0.7470034631630423,
                    ],
                    [
                      -0.8676668813529025, -0.1980677870294097,
                      0.4559861124470794,
                    ],
                  ]);
                };
                e.Rotation_ECT_EQD = Ic;
                e.Rotation_EQD_ECT = Jc;
                var Fd = [
                    ["And", "Andromeda"],
                    ["Ant", "Antila"],
                    ["Aps", "Apus"],
                    ["Aql", "Aquila"],
                    ["Aqr", "Aquarius"],
                    ["Ara", "Ara"],
                    ["Ari", "Aries"],
                    ["Aur", "Auriga"],
                    ["Boo", "Bootes"],
                    ["Cae", "Caelum"],
                    ["Cam", "Camelopardis"],
                    ["Cap", "Capricornus"],
                    ["Car", "Carina"],
                    ["Cas", "Cassiopeia"],
                    ["Cen", "Centaurus"],
                    ["Cep", "Cepheus"],
                    ["Cet", "Cetus"],
                    ["Cha", "Chamaeleon"],
                    ["Cir", "Circinus"],
                    ["CMa", "Canis Major"],
                    ["CMi", "Canis Minor"],
                    ["Cnc", "Cancer"],
                    ["Col", "Columba"],
                    ["Com", "Coma Berenices"],
                    ["CrA", "Corona Australis"],
                    ["CrB", "Corona Borealis"],
                    ["Crt", "Crater"],
                    ["Cru", "Crux"],
                    ["Crv", "Corvus"],
                    ["CVn", "Canes Venatici"],
                    ["Cyg", "Cygnus"],
                    ["Del", "Delphinus"],
                    ["Dor", "Dorado"],
                    ["Dra", "Draco"],
                    ["Equ", "Equuleus"],
                    ["Eri", "Eridanus"],
                    ["For", "Fornax"],
                    ["Gem", "Gemini"],
                    ["Gru", "Grus"],
                    ["Her", "Hercules"],
                    ["Hor", "Horologium"],
                    ["Hya", "Hydra"],
                    ["Hyi", "Hydrus"],
                    ["Ind", "Indus"],
                    ["Lac", "Lacerta"],
                    ["Leo", "Leo"],
                    ["Lep", "Lepus"],
                    ["Lib", "Libra"],
                    ["LMi", "Leo Minor"],
                    ["Lup", "Lupus"],
                    ["Lyn", "Lynx"],
                    ["Lyr", "Lyra"],
                    ["Men", "Mensa"],
                    ["Mic", "Microscopium"],
                    ["Mon", "Monoceros"],
                    ["Mus", "Musca"],
                    ["Nor", "Norma"],
                    ["Oct", "Octans"],
                    ["Oph", "Ophiuchus"],
                    ["Ori", "Orion"],
                    ["Pav", "Pavo"],
                    ["Peg", "Pegasus"],
                    ["Per", "Perseus"],
                    ["Phe", "Phoenix"],
                    ["Pic", "Pictor"],
                    ["PsA", "Pisces Austrinus"],
                    ["Psc", "Pisces"],
                    ["Pup", "Puppis"],
                    ["Pyx", "Pyxis"],
                    ["Ret", "Reticulum"],
                    ["Scl", "Sculptor"],
                    ["Sco", "Scorpius"],
                    ["Sct", "Scutum"],
                    ["Ser", "Serpens"],
                    ["Sex", "Sextans"],
                    ["Sge", "Sagitta"],
                    ["Sgr", "Sagittarius"],
                    ["Tau", "Taurus"],
                    ["Tel", "Telescopium"],
                    ["TrA", "Triangulum Australe"],
                    ["Tri", "Triangulum"],
                    ["Tuc", "Tucana"],
                    ["UMa", "Ursa Major"],
                    ["UMi", "Ursa Minor"],
                    ["Vel", "Vela"],
                    ["Vir", "Virgo"],
                    ["Vol", "Volans"],
                    ["Vul", "Vulpecula"],
                  ],
                  Gd = [
                    [83, 0, 8640, 2112],
                    [83, 2880, 5220, 2076],
                    [83, 7560, 8280, 2068],
                    [83, 6480, 7560, 2064],
                    [15, 0, 2880, 2040],
                    [10, 3300, 3840, 1968],
                    [15, 0, 1800, 1920],
                    [10, 3840, 5220, 1920],
                    [83, 6300, 6480, 1920],
                    [33, 7260, 7560, 1920],
                    [15, 0, 1263, 1848],
                    [10, 4140, 4890, 1848],
                    [83, 5952, 6300, 1800],
                    [15, 7260, 7440, 1800],
                    [10, 2868, 3300, 1764],
                    [33, 3300, 4080, 1764],
                    [83, 4680, 5952, 1680],
                    [13, 1116, 1230, 1632],
                    [33, 7350, 7440, 1608],
                    [33, 4080, 4320, 1596],
                    [15, 0, 120, 1584],
                    [83, 5040, 5640, 1584],
                    [15, 8490, 8640, 1584],
                    [33, 4320, 4860, 1536],
                    [33, 4860, 5190, 1512],
                    [15, 8340, 8490, 1512],
                    [10, 2196, 2520, 1488],
                    [33, 7200, 7350, 1476],
                    [15, 7393.2, 7416, 1462],
                    [10, 2520, 2868, 1440],
                    [82, 2868, 3030, 1440],
                    [33, 7116, 7200, 1428],
                    [15, 7200, 7393.2, 1428],
                    [15, 8232, 8340, 1418],
                    [13, 0, 876, 1404],
                    [33, 6990, 7116, 1392],
                    [13, 612, 687, 1380],
                    [13, 876, 1116, 1368],
                    [10, 1116, 1140, 1368],
                    [15, 8034, 8232, 1350],
                    [10, 1800, 2196, 1344],
                    [82, 5052, 5190, 1332],
                    [33, 5190, 6990, 1332],
                    [10, 1140, 1200, 1320],
                    [15, 7968, 8034, 1320],
                    [15, 7416, 7908, 1316],
                    [13, 0, 612, 1296],
                    [50, 2196, 2340, 1296],
                    [82, 4350, 4860, 1272],
                    [33, 5490, 5670, 1272],
                    [15, 7908, 7968, 1266],
                    [10, 1200, 1800, 1260],
                    [13, 8232, 8400, 1260],
                    [33, 5670, 6120, 1236],
                    [62, 735, 906, 1212],
                    [33, 6120, 6564, 1212],
                    [13, 0, 492, 1200],
                    [62, 492, 600, 1200],
                    [50, 2340, 2448, 1200],
                    [13, 8400, 8640, 1200],
                    [82, 4860, 5052, 1164],
                    [13, 0, 402, 1152],
                    [13, 8490, 8640, 1152],
                    [39, 6543, 6564, 1140],
                    [33, 6564, 6870, 1140],
                    [30, 6870, 6900, 1140],
                    [62, 600, 735, 1128],
                    [82, 3030, 3300, 1128],
                    [13, 60, 312, 1104],
                    [82, 4320, 4350, 1080],
                    [50, 2448, 2652, 1068],
                    [30, 7887, 7908, 1056],
                    [30, 7875, 7887, 1050],
                    [30, 6900, 6984, 1044],
                    [82, 3300, 3660, 1008],
                    [82, 3660, 3882, 960],
                    [8, 5556, 5670, 960],
                    [39, 5670, 5880, 960],
                    [50, 3330, 3450, 954],
                    [0, 0, 906, 882],
                    [62, 906, 924, 882],
                    [51, 6969, 6984, 876],
                    [62, 1620, 1689, 864],
                    [30, 7824, 7875, 864],
                    [44, 7875, 7920, 864],
                    [7, 2352, 2652, 852],
                    [50, 2652, 2790, 852],
                    [0, 0, 720, 840],
                    [44, 7920, 8214, 840],
                    [44, 8214, 8232, 828],
                    [0, 8232, 8460, 828],
                    [62, 924, 978, 816],
                    [82, 3882, 3960, 816],
                    [29, 4320, 4440, 816],
                    [50, 2790, 3330, 804],
                    [48, 3330, 3558, 804],
                    [0, 258, 507, 792],
                    [8, 5466, 5556, 792],
                    [0, 8460, 8550, 770],
                    [29, 4440, 4770, 768],
                    [0, 8550, 8640, 752],
                    [29, 5025, 5052, 738],
                    [80, 870, 978, 736],
                    [62, 978, 1620, 736],
                    [7, 1620, 1710, 720],
                    [51, 6543, 6969, 720],
                    [82, 3960, 4320, 696],
                    [30, 7080, 7530, 696],
                    [7, 1710, 2118, 684],
                    [48, 3558, 3780, 684],
                                        [29, 4770, 5025, 684],
                    [0, 0, 24, 672],
                    [80, 507, 600, 672],
                    [7, 2118, 2352, 672],
                    [37, 2838, 2880, 672],
                    [30, 7530, 7824, 672],
                    [30, 6933, 7080, 660],
                    [80, 690, 870, 654],
                    [25, 5820, 5880, 648],
                    [8, 5430, 5466, 624],
                    [25, 5466, 5820, 624],
                    [51, 6612, 6792, 624],
                    [48, 3870, 3960, 612],
                    [51, 6792, 6933, 612],
                    [80, 600, 690, 600],
                    [66, 258, 306, 570],
                    [48, 3780, 3870, 564],
                    [87, 7650, 7710, 564],
                    [77, 2052, 2118, 548],
                    [0, 24, 51, 528],
                    [73, 5730, 5772, 528],
                    [37, 2118, 2238, 516],
                    [87, 7140, 7290, 510],
                    [87, 6792, 6930, 506],
                    [0, 51, 306, 504],
                    [87, 7290, 7404, 492],
                    [37, 2811, 2838, 480],
                    [87, 7404, 7650, 468],
                    [87, 6930, 7140, 460],
                    [6, 1182, 1212, 456],
                    [75, 6792, 6840, 444],
                    [59, 2052, 2076, 432],
                    [37, 2238, 2271, 420],
                    [75, 6840, 7140, 388],
                    [77, 1788, 1920, 384],
                    [39, 5730, 5790, 384],
                    [75, 7140, 7290, 378],
                    [77, 1662, 1788, 372],
                    [77, 1920, 2016, 372],
                    [23, 4620, 4860, 360],
                    [39, 6210, 6570, 344],
                    [23, 4272, 4620, 336],
                    [37, 2700, 2811, 324],
                    [39, 6030, 6210, 308],
                    [61, 0, 51, 300],
                    [77, 2016, 2076, 300],
                    [37, 2520, 2700, 300],
                    [61, 7602, 7680, 300],
                    [37, 2271, 2496, 288],
                    [39, 6570, 6792, 288],
                    [31, 7515, 7578, 284],
                    [61, 7578, 7602, 284],
                    [45, 4146, 4272, 264],
                    [59, 2247, 2271, 240],
                    [37, 2496, 2520, 240],
                    [21, 2811, 2853, 240],
                    [61, 8580, 8640, 240],
                    [6, 600, 1182, 238],
                    [31, 7251, 7308, 204],
                    [8, 4860, 5430, 192],
                    [61, 8190, 8580, 180],
                    [21, 2853, 3330, 168],
                    [45, 3330, 3870, 168],
                    [58, 6570, 6718.4, 150],
                    [3, 6718.4, 6792, 150],
                    [31, 7500, 7515, 144],
                    [20, 2520, 2526, 132],
                    [73, 6570, 6633, 108],
                    [39, 5790, 6030, 96],
                    [58, 6570, 6633, 72],
                    [61, 7728, 7800, 66],
                    [66, 0, 720, 48],
                    [73, 6690, 6792, 48],
                    [31, 7308, 7500, 48],
                    [34, 7500, 7680, 48],
                    [61, 7680, 7728, 48],
                    [61, 7920, 8190, 48],
                    [61, 7800, 7920, 42],
                                        [20, 2526, 2592, 36],
                    [77, 1290, 1662, 0],
                    [59, 1662, 1680, 0],
                    [20, 2592, 2910, 0],
                    [85, 5280, 5430, 0],
                    [58, 6420, 6570, 0],
                    [16, 954, 1182, -42],
                    [77, 1182, 1290, -42],
                    [73, 5430, 5856, -78],
                    [59, 1680, 1830, -96],
                    [59, 2100, 2247, -96],
                    [73, 6420, 6468, -96],
                    [73, 6570, 6690, -96],
                    [3, 6690, 6792, -96],
                    [66, 8190, 8580, -96],
                    [45, 3870, 4146, -144],
                    [85, 4146, 4260, -144],
                    [66, 0, 120, -168],
                    [66, 8580, 8640, -168],
                    [85, 5130, 5280, -192],
                    [58, 5730, 5856, -192],
                    [3, 7200, 7392, -216],
                    [4, 7680, 7872, -216],
                    [58, 6180, 6468, -240],
                    [54, 2100, 2910, -264],
                    [35, 1770, 1830, -264],
                    [59, 1830, 2100, -264],
                    [41, 2910, 3012, -264],
                    [74, 3450, 3870, -264],
                    [85, 4260, 4620, -264],
                    [58, 6330, 6360, -280],
                    [3, 6792, 7200, -288.8],
                    [35, 1740, 1770, -348],
                    [4, 7392, 7680, -360],
                    [73, 6180, 6570, -384],
                                        [72, 6570, 6792, -384],
                    [41, 3012, 3090, -408],
                    [58, 5856, 5895, -438],
                    [41, 3090, 3270, -456],
                    [26, 3870, 3900, -456],
                    [71, 5856, 5895, -462],
                    [47, 5640, 5730, -480],
                    [28, 4530, 4620, -528],
                    [85, 4620, 5130, -528],
                                        [41, 3270, 3510, -576],
                    [16, 600, 954, -585.2],
                    [35, 954, 1350, -585.2],
                    [26, 3900, 4260, -588],
                    [28, 4260, 4530, -588],
                    [47, 5130, 5370, -588],
                    [58, 5856, 6030, -590],
                    [16, 0, 600, -612],
                    [11, 7680, 7872, -612],
                    [4, 7872, 8580, -612],
                    [16, 8580, 8640, -612],
                    [41, 3510, 3690, -636],
                    [35, 1692, 1740, -654],
                    [46, 1740, 2202, -654],
                    [11, 7200, 7680, -672],
                    [41, 3690, 3810, -700],
                    [41, 4530, 5370, -708],
                    [47, 5370, 5640, -708],
                    [71, 5640, 5760, -708],
                    [35, 1650, 1692, -720],
                    [58, 6030, 6336, -720],
                    [76, 6336, 6420, -720],
                                        [41, 3810, 3900, -748],
                    [19, 2202, 2652, -792],
                    [41, 4410, 4530, -792],
                    [41, 3900, 4410, -840],
                    [36, 1260, 1350, -864],
                    [68, 3012, 3372, -882],
                    [35, 1536, 1650, -888],
                    [76, 6420, 6900, -888],
                    [65, 7680, 8280, -888],
                    [70, 8280, 8400, -888],
                    [36, 1080, 1260, -950],
                    [1, 3372, 3960, -954],
                    [70, 0, 600, -960],
                    [36, 600, 1080, -960],
                    [35, 1392, 1536, -960],
                    [70, 8400, 8640, -960],
                    [14, 5100, 5370, -1008],
                    [49, 5640, 5760, -1008],
                    [71, 5760, 5911.5, -1008],
                    [9, 1740, 1800, -1032],
                    [22, 1800, 2370, -1032],
                    [67, 2880, 3012, -1032],
                    [35, 1230, 1392, -1056],
                    [71, 5911.5, 6420, -1092],
                                        [24, 6420, 6900, -1092],
                    [76, 6900, 7320, -1092],
                    [53, 7320, 7680, -1092],
                    [35, 1080, 1230, -1104],
                    [9, 1620, 1740, -1116],
                    [49, 5520, 5640, -1152],
                    [63, 0, 840, -1156],
                    [35, 960, 1080, -1176],
                    [40, 1470, 1536, -1176],
                                        [9, 1536, 1620, -1176],
                    [38, 7680, 7920, -1200],
                                        [67, 2160, 2880, -1218],
                                                            [84, 2880, 2940, -1218],
                                        [35, 870, 960, -1224],
                                        [40, 1380, 1470, -1224],
                                        [63, 0, 660, -1236],
                    [12, 2160, 2220, -1260],
                    [84, 2940, 3042, -1272],
                    [40, 1260, 1380, -1276],
                    [32, 1380, 1440, -1276],
                    [63, 0, 570, -1284],
                    [35, 780, 870, -1296],
                    [64, 1620, 1800, -1296],
                    [49, 5418, 5520, -1296],
                    [84, 3042, 3180, -1308],
                    [12, 2220, 2340, -1320],
                    [14, 4260, 4620, -1320],
                    [49, 5100, 5418, -1320],
                    [56, 5418, 5520, -1320],
                    [32, 1440, 1560, -1356],
                    [84, 3180, 3960, -1356],
                    [14, 3960, 4050, -1356],
                    [5, 6300, 6480, -1368],
                    [78, 6480, 7320, -1368],
                    [38, 7920, 8400, -1368],
                    [40, 1152, 1260, -1380],
                    [64, 1800, 1980, -1380],
                    [12, 2340, 2460, -1392],
                    [63, 0, 480, -1404],
                    [35, 480, 780, -1404],
                    [63, 8400, 8640, -1404],
                    [32, 1560, 1650, -1416],
                    [56, 5520, 5911.5, -1440],
                    [43, 7320, 7680, -1440],
                    [64, 1980, 2160, -1464],
                    [18, 5460, 5520, -1464],
                    [5, 5911.5, 5970, -1464],
                    [18, 5370, 5460, -1526],
                    [5, 5970, 6030, -1526],
                    [64, 2160, 2460, -1536],
                    [12, 2460, 3252, -1536],
                    [14, 4050, 4260, -1536],
                    [27, 4260, 4620, -1536],
                    [14, 4620, 5232, -1536],
                    [18, 4860, 4920, -1560],
                    [5, 6030, 6060, -1560],
                    [40, 780, 1152, -1620],
                    [69, 1152, 1650, -1620],
                    [18, 5310, 5370, -1620],
                    [5, 6060, 6300, -1620],
                    [60, 6300, 6480, -1620],
                    [81, 7920, 8400, -1620],
                    [32, 1650, 2370, -1680],
                    [18, 4920, 5310, -1680],
                    [79, 5310, 6120, -1680],
                    [81, 0, 480, -1800],
                    [42, 1260, 1650, -1800],
                    [86, 2370, 3252, -1800],
                    [12, 3252, 4050, -1800],
                    [55, 4050, 4920, -1800],
                    [60, 6480, 7680, -1800],
                    [43, 7680, 8400, -1800],
                    [81, 8400, 8640, -1800],
                    [81, 270, 480, -1824],
                    [42, 0, 1260, -1980],
                    [17, 2760, 4920, -1980],
                    [2, 4920, 6480, -1980],
                    [52, 1260, 2760, -2040],
                    [57, 0, 8640, -2160],
                  ],
                  Tb,
                  id,
                  jd = function (a, b, c, d) {
                    this.symbol = a;
                    this.name = b;
                    this.ra1875 = c;
                    this.dec1875 = d;
                  };
                e.ConstellationInfo = jd;
                e.Constellation = function (a, b) {
                  w(a);
                  w(b);
                  if (-90 > b || 90 < b)
                    throw "Invalid declination angle. Must be -90..+90.";
                  a %= 24;
                  0 > a && (a += 24);
                  Tb || ((Tb = ob(new O(-45655.74141261017))), (id = new O(0)));
                  a = new Ba(b, 15 * a, 1);
                  a = lb(a, id);
                  a = Ya(Tb, a);
                  a = Mb(a);
                  b = 10 / 240;
                  for (
                    var c = b / 15, d = $jscomp.makeIterator(Gd), f = d.next();
                    !f.done;
                    f = d.next()
                  ) {
                    f = f.value;
                    var g = f[1] * c,
                      h = f[2] * c;
                    if (f[3] * b <= a.dec && g <= a.ra && a.ra < h)
                      return ((b = Fd[f[0]]), new jd(b[0], b[1], a.ra, a.dec));
                  }
                  throw "Unable to find constellation for given coordinates.";
                };
                var S;
                (function (a) {
                  a.Penumbral = "penumbral";
                  a.Partial = "partial";
                  a.Annular = "annular";
                  a.Total = "total";
                })((S = e.EclipseKind || (e.EclipseKind = {})));
                var Pc = function (a, b, c, d, f, g) {
                  this.kind = a;
                  this.obscuration = b;
                  this.peak = c;
                  this.sd_penum = d;
                  this.sd_partial = f;
                  this.sd_total = g;
                };
                e.LunarEclipseInfo = Pc;
                var xd = function (a, b, c, d, f, g, h) {
                  this.time = a;
                  this.u = b;
                                    this.r = c;
                                                      this.k = d;
                  this.p = f;
                  this.target = g;
                  this.dir = h;
                };
                e.SearchLunarEclipse = Oc;
                var Rc = function (a, b, c, d, f, g) {
                  this.kind = a;
                  this.obscuration = b;
                  this.peak = c;
                  this.distance = d;
                  this.latitude = f;
                                                      this.longitude = g;
                };
                e.GlobalSolarEclipseInfo = Rc;
                e.NextLunarEclipse = function (a) {
                  a = v(a);
                  a = a.AddDays(10);
                  return Oc(a);
                };
                e.SearchGlobalSolarEclipse = Qc;
                e.NextGlobalSolarEclipse = function (a) {
                  a = v(a);
                                    a = a.AddDays(10);
                  return Qc(a);
                };
                var Vc = function (a, b) {
                  this.time = a;
                  this.altitude = b;
                };
                e.EclipseEvent = Vc;
                                var Xc = function (a, b, c, d, f, g, h) {
                  this.kind = a;
                  this.obscuration = b;
                  this.partial_begin = c;
                  this.total_begin = d;
                                                      this.peak = f;
                                    this.total_end = g;
                  this.partial_end = h;
                };
                e.LocalSolarEclipseInfo = Xc;
                e.SearchLocalSolarEclipse = Wc;
                e.NextLocalSolarEclipse = function (a, b) {
                  a = v(a);
                  a = a.AddDays(10);
                  return Wc(a, b);
                };
                var $c = function (a, b, c, d) {
                  this.start = a;
                  this.peak = b;
                  this.finish = c;
                  this.separation = d;
                };
                e.TransitInfo = $c;
                e.SearchTransit = Zc;
                e.NextTransit = function (a, b) {
                  b = v(b);
                  b = b.AddDays(100);
                  return Zc(a, b);
                };
                var ra;
                (function (a) {
                  a[(a.Invalid = 0)] = "Invalid";
                  a[(a.Ascending = 1)] = "Ascending";
                  a[(a.Descending = -1)] = "Descending";
                })((ra = e.NodeEventKind || (e.NodeEventKind = {})));
                var bd = function (a, b) {
                  this.kind = a;
                  this.time = b;
                };
                                e.NodeEventInfo = bd;
                                e.SearchMoonNode = ad;
                e.NextMoonNode = function (a) {
                                    var b = a.time.AddDays(10);
                  b = ad(b);
                  switch (a.kind) {
                    case ra.Ascending:
                      if (b.kind !== ra.Descending)
                        throw (
                          "Internal error: previous node was ascending, but this node was: " +
                          b.kind
                        );
                      break;
                    case ra.Descending:
                      if (b.kind !== ra.Ascending)
                        throw (
                          "Internal error: previous node was descending, but this node was: " +
                          b.kind
                        );
                      break;
                    default:
                      throw "Previous node has an invalid node kind: " + a.kind;
                  }
                  return b;
                };
                var Ub = function (a, b, c, d) {
                  this.ra = a;
                  this.dec = b;
                  this.spin = c;
                  this.north = d;
                };
                e.AxisInfo = Ub;
                e.RotationAxis = function (a, b) {
                  b = v(b);
                  var c = b.tt,
                    d = c / 36525;
                  switch (a) {
                    case m.Sun:
                      a = 286.13;
                      var f = 63.87;
                      c = 84.176 + 14.1844 * c;
                      break;
                    case m.Mercury:
                      a = 281.0103 - 0.0328 * d;
                      f = 61.4155 - 0.0049 * d;
                      c =
                        329.5988 +
                        6.1385108 * c +
                        0.01067257 *
                          Math.sin(e.DEG2RAD * (174.7910857 + 4.092335 * c)) -
                        0.00112309 *
                          Math.sin(e.DEG2RAD * (349.5821714 + 8.18467 * c)) -
                        1.104e-4 *
                          Math.sin(e.DEG2RAD * (164.3732571 + 12.277005 * c)) -
                        2.539e-5 *
                          Math.sin(e.DEG2RAD * (339.1643429 + 16.36934 * c)) -
                        5.71e-6 *
                          Math.sin(e.DEG2RAD * (153.9554286 + 20.461675 * c));
                      break;
                    case m.Venus:
                      a = 272.76;
                      f = 67.16;
                      c = 160.2 - 1.4813688 * c;
                      break;
                    case m.Earth:
                      return (
                                                (a = xa([0, 0, 1], b, F.Into2000)),
                        (a = wa(a, b, F.Into2000)),
                        (a = new E(a[0], a[1], a[2], b)),
                        (c = Mb(a)),
                        new Ub(
                                                    c.ra,
                          c.dec,
                          190.41375788700253 + 360.9856122880876 * b.ut,
                          a,
                        )
                      );
                    case m.Moon:
                      var g = e.DEG2RAD * (125.045 - 0.0529921 * c),
                        h = e.DEG2RAD * (250.089 - 0.1059842 * c),
                        l = e.DEG2RAD * (260.008 + 13.0120009 * c),
                        k = e.DEG2RAD * (176.625 + 13.3407154 * c),
                        n = e.DEG2RAD * (357.529 + 0.9856003 * c),
                        p = e.DEG2RAD * (311.589 + 26.4057084 * c),
                        q = e.DEG2RAD * (134.963 + 13.064993 * c),
                        t = e.DEG2RAD * (276.617 + 0.3287146 * c),
                        y = e.DEG2RAD * (34.226 + 1.7484877 * c),
                        x = e.DEG2RAD * (15.134 - 0.1589763 * c),
                        z = e.DEG2RAD * (119.743 + 0.0036096 * c),
                        ab = e.DEG2RAD * (239.961 + 0.1643573 * c),
                        va = e.DEG2RAD * (25.053 + 12.9590088 * c);
                      a =
                        269.9949 +
                        0.0031 * d -
                        3.8787 * Math.sin(g) -
                        0.1204 * Math.sin(h) +
                        0.07 * Math.sin(l) -
                        0.0172 * Math.sin(k) +
                        0.0072 * Math.sin(p) -
                        0.0052 * Math.sin(x) +
                        0.0043 * Math.sin(va);
                      f =
                        66.5392 +
                        0.013 * d +
                        1.5419 * Math.cos(g) +
                        0.0239 * Math.cos(h) -
                        0.0278 * Math.cos(l) +
                        0.0068 * Math.cos(k) -
                        0.0029 * Math.cos(p) +
                        9e-4 * Math.cos(q) +
                        8e-4 * Math.cos(x) -
                        9e-4 * Math.cos(va);
                      c =
                        38.3213 +
                        (13.17635815 - 1.4e-12 * c) * c +
                        3.561 * Math.sin(g) +
                        0.1208 * Math.sin(h) -
                        0.0642 * Math.sin(l) +
                        0.0158 * Math.sin(k) +
                        0.0252 * Math.sin(n) -
                        0.0066 * Math.sin(p) -
                        0.0047 * Math.sin(q) -
                        0.0046 * Math.sin(t) +
                        0.0028 * Math.sin(y) +
                        0.0052 * Math.sin(x) +
                        0.004 * Math.sin(z) +
                        0.0019 * Math.sin(ab) -
                        0.0044 * Math.sin(va);
                      break;
                    case m.Mars:
                      a =
                        317.269202 -
                        0.10927547 * d +
                        6.8e-5 *
                          Math.sin(
                            e.DEG2RAD * (198.991226 + 19139.4819985 * d),
                          ) +
                        2.38e-4 *
                          Math.sin(
                            e.DEG2RAD * (226.292679 + 38280.8511281 * d),
                          ) +
                        5.2e-5 *
                          Math.sin(
                            e.DEG2RAD * (249.663391 + 57420.7251593 * d),
                          ) +
                        9e-6 *
                          Math.sin(e.DEG2RAD * (266.18351 + 76560.636795 * d)) +
                                                0.419057 *
                          Math.sin(e.DEG2RAD * (79.398797 + 0.5042615 * d));
                      f =
                        54.432516 -
                        0.05827105 * d +
                        5.1e-5 *
                          Math.cos(
                            e.DEG2RAD * (122.433576 + 19139.9407476 * d),
                          ) +
                        1.41e-4 *
                          Math.cos(
                            e.DEG2RAD * (43.058401 + 38280.8753272 * d),
                          ) +
                        3.1e-5 *
                          Math.cos(
                            e.DEG2RAD * (57.663379 + 57420.7517205 * d),
                          ) +
                        5e-6 *
                          Math.cos(
                            e.DEG2RAD * (79.476401 + 76560.6495004 * d),
                          ) +
                        1.591274 *
                          Math.cos(e.DEG2RAD * (166.325722 + 0.5042615 * d));
                      c =
                        176.049863 +
                        350.891982443297 * c +
                        1.45e-4 *
                          Math.sin(
                            e.DEG2RAD * (129.071773 + 19140.0328244 * d),
                          ) +
                        1.57e-4 *
                          Math.sin(
                            e.DEG2RAD * (36.352167 + 38281.0473591 * d),
                          ) +
                        4e-5 *
                          Math.sin(e.DEG2RAD * (56.668646 + 57420.929536 * d)) +
                        1e-6 *
                          Math.sin(
                            e.DEG2RAD * (67.364003 + 76560.2552215 * d),
                          ) +
                        1e-6 *
                          Math.sin(
                            e.DEG2RAD * (104.79268 + 95700.4387578 * d),
                          ) +
                        0.584542 *
                          Math.sin(e.DEG2RAD * (95.391654 + 0.5042615 * d));
                      break;
                    case m.Jupiter:
                      f = e.DEG2RAD * (99.360714 + 4850.4046 * d);
                      g = e.DEG2RAD * (175.895369 + 1191.9605 * d);
                      h = e.DEG2RAD * (300.323162 + 262.5475 * d);
                      l = e.DEG2RAD * (114.012305 + 6070.2476 * d);
                      k = e.DEG2RAD * (49.511251 + 64.3 * d);
                      a =
                        268.056595 -
                        0.006499 * d +
                        1.17e-4 * Math.sin(f) +
                        9.38e-4 * Math.sin(g) +
                        0.001432 * Math.sin(h) +
                        3e-5 * Math.sin(l) +
                        0.00215 * Math.sin(k);
                      f =
                        64.495303 +
                        0.002413 * d +
                        5e-5 * Math.cos(f) +
                        4.04e-4 * Math.cos(g) +
                        6.17e-4 * Math.cos(h) -
                        1.3e-5 * Math.cos(l) +
                        9.26e-4 * Math.cos(k);
                      c = 284.95 + 870.536 * c;
                      break;
                    case m.Saturn:
                      a = 40.589 - 0.036 * d;
                      f = 83.537 - 0.004 * d;
                      c = 38.9 + 810.7939024 * c;
                      break;
                    case m.Uranus:
                      a = 257.311;
                      f = -15.175;
                      c = 203.81 - 501.1600928 * c;
                      break;
                    case m.Neptune:
                      d = e.DEG2RAD * (357.85 + 52.316 * d);
                      a = 299.36 + 0.7 * Math.sin(d);
                      f = 43.46 - 0.51 * Math.cos(d);
                      c = 249.978 + 541.1397757 * c - 0.48 * Math.sin(d);
                      break;
                    case m.Pluto:
                      a = 132.993;
                      f = -6.163;
                      c = 302.695 + 56.3625225 * c;
                      break;
                    default:
                      throw "Invalid body: " + a;
                  }
                  d = f * e.DEG2RAD;
                  g = a * e.DEG2RAD;
                  h = Math.cos(d);
                  b = new E(h * Math.cos(g), h * Math.sin(g), Math.sin(d), b);
                  return new Ub(a / 15, f, c, b);
                };
                e.LagrangePoint = function (a, b, c, d) {
                  var f = v(b);
                  b = C(c);
                  var g = C(d);
                  c === m.Earth && d === m.Moon
                    ? ((c = new I(0, 0, 0, 0, 0, 0, f)), (d = Ra(f)))
                    : ((c = mb(c, f)), (d = mb(d, f)));
                  return cd(a, c, b, d, g);
                };
                e.LagrangePointFast = cd;
                var H = function (a, b, c) {
                  b = v(b);
                  this.originBody = a;
                  for (
                    var d = $jscomp.makeIterator(c), f = d.next();
                    !f.done;
                    f = d.next()
                  )
                    if (f.value.t.tt !== b.tt)
                      throw "Inconsistent times in bodyStates";
                  d = [];
                  f = H.CalcSolarSystem(b);
                  this.curr = new kd(b, f, d);
                  a = this.InternalBodyState(a);
                  c = $jscomp.makeIterator(c);
                  for (f = c.next(); !f.done; f = c.next()) {
                    var g = f.value;
                    f = new B(g.x + a.r.x, g.y + a.r.y, g.z + a.r.z);
                    g = new B(g.vx + a.v.x, g.vy + a.v.y, g.vz + a.v.z);
                    var h = B.zero();
                    d.push(new Ua(b.tt, f, g, h));
                  }
                  this.CalcBodyAccelerations();
                  this.prev = this.Duplicate();
                };
                H.prototype.Update = function (a) {
                  a = v(a);
                  var b = a.tt - this.curr.time.tt;
                  if (0 === b) this.prev = this.Duplicate();
                  else {
                    this.Swap();
                    this.curr.time = a;
                    this.curr.gravitators = H.CalcSolarSystem(a);
                    for (var c = 0; c < this.curr.bodies.length; ++c) {
                      var d = this.prev.bodies[c];
                      this.curr.bodies[c].r = Ca(b, d.r, d.v, d.a);
                    }
                    this.CalcBodyAccelerations();
                    for (c = 0; c < this.curr.bodies.length; ++c) {
                      d = this.prev.bodies[c];
                      var f = this.curr.bodies[c],
                        g = d.a.mean(f.a);
                      f.tt = a.tt;
                      f.r = Ca(b, d.r, d.v, g);
                      f.v = Eb(b, d.v, g);
                    }
                    this.CalcBodyAccelerations();
                  }
                  b = [];
                  c = this.InternalBodyState(this.originBody);
                  d = $jscomp.makeIterator(this.curr.bodies);
                  for (f = d.next(); !f.done; f = d.next())
                    ((f = f.value),
                      b.push(
                        new I(
                          f.r.x - c.r.x,
                          f.r.y - c.r.y,
                          f.r.z - c.r.z,
                          f.v.x - c.v.x,
                          f.v.y - c.v.y,
                          f.v.z - c.v.z,
                          a,
                        ),
                      ));
                  return b;
                };
                H.prototype.Swap = function () {
                  var a = this.curr;
                  this.curr = this.prev;
                  this.prev = a;
                };
                H.prototype.SolarSystemBodyState = function (a) {
                  a = this.InternalBodyState(a);
                  var b = this.InternalBodyState(this.originBody);
                  return pa(a.sub(b), this.curr.time);
                };
                H.prototype.InternalBodyState = function (a) {
                  if (a === m.SSB)
                    return new X(this.curr.time.tt, B.zero(), B.zero());
                  var b = this.curr.gravitators[a];
                  if (b) return b;
                  throw "Invalid body: " + a;
                };
                H.CalcSolarSystem = function (a) {
                  var b = {},
                    c = new X(a.tt, B.zero(), B.zero());
                  b[m.Mercury] = R(c, a.tt, m.Mercury, 4.912547451450812e-11);
                  b[m.Venus] = R(c, a.tt, m.Venus, 7.243452486162703e-10);
                  b[m.Earth] = R(c, a.tt, m.Earth, 8.997011346712498e-10);
                  b[m.Mars] = R(c, a.tt, m.Mars, 9.549535105779258e-11);
                  b[m.Jupiter] = R(c, a.tt, m.Jupiter, 2.825345909524226e-7);
                  b[m.Saturn] = R(c, a.tt, m.Saturn, 8.459715185680659e-8);
                  b[m.Uranus] = R(c, a.tt, m.Uranus, 1.292024916781969e-8);
                  b[m.Neptune] = R(c, a.tt, m.Neptune, 1.524358900784276e-8);
                  for (var d in b) (b[d].r.decr(c.r), b[d].v.decr(c.v));
                  b[m.Sun] = new X(a.tt, c.r.neg(), c.v.neg());
                  return b;
                };
                H.prototype.CalcBodyAccelerations = function () {
                  for (
                    var a = $jscomp.makeIterator(this.curr.bodies),
                      b = a.next();
                    !b.done;
                    b = a.next()
                  )
                    ((b = b.value),
                      (b.a = B.zero()),
                      H.AddAcceleration(
                        b.a,
                        b.r,
                        this.curr.gravitators[m.Sun].r,
                        2.959122082855911e-4,
                      ),
                      H.AddAcceleration(
                        b.a,
                        b.r,
                        this.curr.gravitators[m.Mercury].r,
                        4.912547451450812e-11,
                      ),
                      H.AddAcceleration(
                        b.a,
                        b.r,
                        this.curr.gravitators[m.Venus].r,
                        7.243452486162703e-10,
                      ),
                      H.AddAcceleration(
                        b.a,
                        b.r,
                        this.curr.gravitators[m.Earth].r,
                        8.997011346712498e-10,
                      ),
                      H.AddAcceleration(
                        b.a,
                        b.r,
                        this.curr.gravitators[m.Mars].r,
                        9.549535105779258e-11,
                      ),
                      H.AddAcceleration(
                        b.a,
                        b.r,
                        this.curr.gravitators[m.Jupiter].r,
                        2.825345909524226e-7,
                      ),
                      H.AddAcceleration(
                        b.a,
                        b.r,
                        this.curr.gravitators[m.Saturn].r,
                        8.459715185680659e-8,
                      ),
                      H.AddAcceleration(
                        b.a,
                        b.r,
                        this.curr.gravitators[m.Uranus].r,
                        1.292024916781969e-8,
                      ),
                      H.AddAcceleration(
                        b.a,
                        b.r,
                        this.curr.gravitators[m.Neptune].r,
                        1.524358900784276e-8,
                      ));
                };
                H.AddAcceleration = function (a, b, c, d) {
                  var f = c.x - b.x,
                    g = c.y - b.y;
                  b = c.z - b.z;
                  c = f * f + g * g + b * b;
                  d /= c * Math.sqrt(c);
                  a.x += f * d;
                  a.y += g * d;
                  a.z += b * d;
                };
                H.prototype.Duplicate = function () {
                  var a = {};
                  for (b in this.curr.gravitators)
                    a[b] = this.curr.gravitators[b].clone();
                  var b = [];
                  for (
                    var c = $jscomp.makeIterator(this.curr.bodies),
                      d = c.next();
                    !d.done;
                    d = c.next()
                  )
                    b.push(d.value.clone());
                  return new kd(this.curr.time, a, b);
                };
                $jscomp.global.Object.defineProperties(H.prototype, {
                  OriginBody: {
                    configurable: !0,
                    enumerable: !0,
                    get: function () {
                      return this.originBody;
                    },
                  },
                  Time: {
                    configurable: !0,
                    enumerable: !0,
                    get: function () {
                      return this.curr.time;
                    },
                  },
                });
                e.GravitySimulator = H;
                var kd = function (a, b, c) {
                  this.time = a;
                  this.gravitators = b;
                  this.bodies = c;
                };
              },
              {},
            ],
          },
          {},
          [1],
        )(1);
      });

      const celebrityPresets = [
        { name: "Mukesh Ambani", gender: "male", date: "1957-04-19", time: "19:53:00", city: "Aden", state: "Aden", country: "Yemen", lat: 12.46, lng: 45.00, tz: 3.0, olson: "Asia/Aden" },
        { name: "Shah Rukh Khan", gender: "male", date: "1965-11-02", time: "02:30:00", city: "New Delhi", state: "Delhi", country: "India", lat: 28.61, lng: 77.20, tz: 5.5, olson: "Asia/Kolkata" },
        { name: "Rajinikanth", gender: "male", date: "1950-12-12", time: "23:49:00", city: "Bangalore", state: "Karnataka", country: "India", lat: 12.97, lng: 77.59, tz: 5.5, olson: "Asia/Kolkata" },
        { name: "Barack Obama", gender: "male", date: "1961-08-04", time: "19:24:00", city: "Honolulu", state: "Hawaii", country: "USA", lat: 21.30, lng: -157.85, tz: -10.0, olson: "Pacific/Honolulu" },
        { name: "Akshay Kumar", gender: "male", date: "1967-09-09", time: "12:05:00", city: "Amritsar", state: "Punjab", country: "India", lat: 31.63, lng: 74.87, tz: 5.5, olson: "Asia/Kolkata" },

        {
          name: "Sachin Tendulkar",
          gender: "male",
          date: "1973-04-24",
          time: "13:00:00",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          lat: 18.975,
          lng: 72.8258,
          tz: 5.5, 
          olson: "Asia/Kolkata",
        },
        {
          name: "Virat Kohli",
          gender: "male",
          date: "1988-11-05",
          time: "10:28:00",
          city: "New Delhi",
          state: "Delhi",
          country: "India",
          lat: 28.6139,
          lng: 77.209,
          tz: 5.5, 
          olson: "Asia/Kolkata",
        },
        {
          name: "Amitabh Bachchan",
          gender: "male",
          date: "1942-10-11",
          time: "16:00:00",
          city: "Allahabad",
          state: "Uttar Pradesh",
          country: "India",
          lat: 25.4358,
          lng: 81.8463,
          tz: 5.5, 
          olson: "Asia/Kolkata",
        },
        {
          name: "Narendra Modi",
          gender: "male",
          date: "1950-09-17",
          time: "09:35:00",
          city: "Vadnagar",
          state: "Gujarat",
          country: "India",
          lat: 23.7833,
          lng: 72.6333,
          tz: 5.5, 
          olson: "Asia/Kolkata",
        },
        {
          name: "MS Dhoni",
          gender: "male",
          date: "1981-07-07",
          time: "11:15:00",
          city: "Ranchi",
          state: "Jharkhand",
          country: "India",
          lat: 23.3441,
          lng: 85.3096,
          tz: 5.5, 
          olson: "Asia/Kolkata",
        },
        {
          name: "Priyanka Chopra",
          gender: "female",
          date: "1982-07-18",
          time: "00:30:00",
          city: "Jamshedpur",
          state: "Jharkhand",
          country: "India",
          lat: 22.8046,
          lng: 86.2029,
          tz: 5.5, 
          olson: "Asia/Kolkata",
        },
        {
          name: "Alia Bhatt",
          gender: "female",
          date: "1993-03-15",
          time: "04:10:00",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          lat: 18.975,
          lng: 72.8258,
          tz: 5.5,
        },
        {
          name: "Katrina Kaif",
          gender: "female",
          date: "1984-07-16",
          time: "18:19:30",
          city: "Hong Kong",
          state: "Hong Kong",
          country: "Hong Kong",
          lat: 22.3193,
          lng: 114.1694,
          tz: 8.0, 
          olson: "Asia/Hong_Kong",
        },
        {
          name: "Salman Khan",
          gender: "male",
          date: "1965-12-27",
          time: "14:30:00",
          city: "Indore",
          state: "Madhya Pradesh",
          country: "India",
          lat: 22.7196,
          lng: 75.8577,
          tz: 5.5, 
          olson: "Asia/Kolkata",
        },
        {
          name: "Swami Vivekananda",
          gender: "male",
          date: "1863-01-12",
          time: "06:33:00",
          city: "Calcutta",
          state: "Bengal Presidency",
          country: "India",
          lat: 22.5726,
          lng: 88.3639,
          tz: 5.5, 
          olson: "Asia/Kolkata",
        },
        {
          name: "APJ Abdul Kalam",
          gender: "male",
          date: "1931-10-15",
          time: "01:15:00",
          city: "Rameswaram",
          state: "Tamil Nadu",
          country: "India",
          lat: 9.2876,
          lng: 79.3129,
          tz: 5.5, 
          olson: "Asia/Kolkata",
        },
        {
          name: "Albert Einstein",
          gender: "male",
          date: "1879-03-14",
          time: "11:30:00",
          city: "Ulm",
          state: "Baden-Württemberg",
          country: "Germany",
          lat: 48.4011,
          lng: 9.9876,
          tz: 1.0, 
          olson: "Europe/Berlin",
        },
      ];

      function triggerNativePicker(id) {
          const el = document.getElementById(id);
          if (el) {
              try {
                  if (el.showPicker) {
                      el.showPicker();
                  } else {
                      el.focus();
                      el.click();
                  }
              } catch(e) {
                  el.focus();
                  el.click();
              }
          }
      }

      function handleNativeDateChange(picker, displayId) {
          const display = document.getElementById(displayId);
          if (picker.value) {
              const parts = picker.value.split('-');
              if (parts.length === 3 && display) {
                  const newFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
                  if (display.value !== newFormatted) display.value = newFormatted;
                  handleDateDisplayInput(display, picker.id);
              }
          } else {
              if (display && document.activeElement !== display) display.value = '';
          }
      }

      function handleNativeTimeChange(picker, displayId) {
          const display = document.getElementById(displayId);
          if (picker.value) {
              const parts = picker.value.split(':');
              let h24 = parseInt(parts[0] || '0');
              const m = parts[1] || '00';
              
              // Extract existing seconds from display to prevent native picker from resetting them to 00
              let existingS = '00';
              if (display && display.value) {
                  let v = display.value.replace(/\D/g, '');
                  if (v.length >= 5) {
                      existingS = v.substring(4, 6).padEnd(2, '0');
                  }
              }
              const s = parts[2] || existingS;
              
              let ampm = h24 >= 12 ? 'PM' : 'AM';
              let h12 = h24 % 12;
              h12 = h12 ? h12 : 12;
              
              const hStr = String(h12).padStart(2, '0');
              const newFormatted = `${hStr}:${m}:${s}`;
              
              if (display && display.value !== newFormatted) {
                  display.value = newFormatted;
                  const ampmSelect = document.getElementById(picker.id + 'AMPM');
                  if(ampmSelect) ampmSelect.value = ampm;
                  handleTimeDisplayInput(display, picker.id);
              }
          } else {
              if (display && document.activeElement !== display) display.value = '';
          }
      }
      function handleDateDisplayInput(display, hiddenId) {
          let v = display.value.replace(/\D/g, '');
          if (v.length > 8) v = v.substring(0, 8);
          
          let formatted = '';
          if (v.length > 0) formatted += v.substring(0, 2);
          if (v.length >= 3) formatted += '/' + v.substring(2, 4);
          if (v.length >= 5) formatted += '/' + v.substring(4, 8);
          display.value = formatted;

          const hidden = document.getElementById(hiddenId);
          const errDiv = document.getElementById(display.id.replace('Display', 'Error'));
          
          if (hidden) {
              const prevVal = hidden.value;
              if (v.length === 8) {
                  const d = parseInt(v.substring(0, 2));
                  const m = parseInt(v.substring(2, 4));
                  const y = parseInt(v.substring(4, 8));
                  
                  let isValid = true;
                  if (m < 1 || m > 12) isValid = false;
                  else {
                      const daysInMonth = new Date(y, m, 0).getDate();
                      if (d < 1 || d > daysInMonth) isValid = false;
                  }
                  if (y < 1000 || y > 2100) isValid = false;

                  if (isValid) {
                      hidden.value = `${y.toString().padStart(4,'0')}-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
                      if (errDiv) errDiv.style.display = 'none';
                  } else {
                      hidden.value = '';
                        if (errDiv) {
                          errDiv.style.display = 'block';
                          errDiv.innerText = "Invalid Date";
                      }
                  }
              } else {
                  hidden.value = '';
                  if (errDiv) errDiv.style.display = (v.length > 0 && v.length < 8) ? 'block' : 'none';
                  if (errDiv && v.length > 0 && v.length < 8) errDiv.innerText = "Incomplete Date";
              }
              if (hidden.value !== prevVal && hidden.value !== '') {
                  hidden.dispatchEvent(new Event('change', { bubbles: true }));
              }
          }
      }

      function handleTimeDisplayInput(display, hiddenId) {
          let v = display.value.replace(/\D/g, '');
          if (v.length > 6) v = v.substring(0, 6);

          let formatted = '';
          if (v.length > 0) formatted += v.substring(0, 2);
          if (v.length >= 3) formatted += ':' + v.substring(2, 4);
          if (v.length >= 5) formatted += ':' + v.substring(4, 6);
          display.value = formatted;

          const hidden = document.getElementById(hiddenId);
          const errDiv = document.getElementById(display.id.replace('Display', 'Error'));
          const ampmSelect = document.getElementById(hiddenId + 'AMPM');

          if (hidden) {
              const prevVal = hidden.value;
              if (v.length >= 4) {
                  let h = parseInt(v.substring(0, 2));
                  let m = parseInt(v.substring(2, 4));
                  let sStr = v.length >= 5 ? v.substring(4, 6).padEnd(2, '0') : '00';
                  let s = parseInt(sStr);
                  
                  let isValid = true;
                  if (h < 1 || h > 12) isValid = false;
                  if (m < 0 || m > 59) isValid = false;
                  if (s < 0 || s > 59) isValid = false;

                  if (isValid) {
                      if (errDiv) errDiv.style.display = 'none';
                      let ampm = ampmSelect ? ampmSelect.value : 'AM';
                      let h24 = h;
                      if (ampm === 'PM' && h < 12) h24 += 12;
                      if (ampm === 'AM' && h === 12) h24 = 0;
                      
                      hidden.value = `${h24.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sStr}`;
                  } else {
                      hidden.value = '';
                      if (errDiv) {
                          errDiv.style.display = 'block';
                          errDiv.innerText = "Invalid Time (01:00 to 12:59, MM/SS up to 59)";
                      }
                  }
              } else {
                  hidden.value = '';
                  if (errDiv) errDiv.style.display = (v.length > 0 && v.length < 4) ? 'block' : 'none';
                  if (errDiv && v.length > 0 && v.length < 4) errDiv.innerText = "Incomplete Time";
              }
              
              if (hidden.value !== prevVal && hidden.value !== '') {
                  hidden.dispatchEvent(new Event('change', { bubbles: true }));
              }
          }
      }

      function updatePresetDropdowns() {
          const customPresets = JSON.parse(localStorage.getItem('customKundliPresets') || '[]');
          
          let optText = "⭐ Load Profile...";
          if (langData[currentLang] && langData[currentLang].ui && langData[currentLang].ui.lbl_load_preset_opt) {
              optText = langData[currentLang].ui.lbl_load_preset_opt;
          }

          const buildOptions = (preferredGender) => {
              let html = `<option value="" data-i18n="lbl_load_preset_opt" style="font-size: 12px;">${optText}</option>`;
              if (customPresets.length > 0) {
                  let sortedCustom = [...customPresets].sort((a, b) => {
                      let aMatch = (a.gender === preferredGender) ? 1 : 0;
                      let bMatch = (b.gender === preferredGender) ? 1 : 0;
                      return bMatch - aMatch;
                  });
                  html += `<optgroup label="My Saved Profiles" style="font-size: 12px; font-weight: 700;">`;
                  sortedCustom.forEach(p => {
                      html += `<option value="${p.id}" style="font-size: 12px;">👤 ${p.name}</option>`;
                  });
                  html += `</optgroup>`;
              }
              let sortedCeleb = [...celebrityPresets].map((p, index) => ({...p, originalIndex: index})).sort((a, b) => {
                  let aMatch = (a.gender === preferredGender) ? 1 : 0;
                  let bMatch = (b.gender === preferredGender) ? 1 : 0;
                  return bMatch - aMatch;
              });
              html += `<optgroup label="Celebrities" style="font-size: 12px; font-weight: 700;">`;
              sortedCeleb.forEach(p => {
                  html += `<option value="${p.originalIndex}" style="font-size: 12px;">⭐ ${p.name}</option>`;
              });
              html += `</optgroup>`;
              return html;
          };
          
          const sel1 = document.getElementById("celebrity-preset-selector");
          if (sel1) sel1.innerHTML = buildOptions("male");
          
          const sel2 = document.getElementById("partner-celebrity-preset-selector");
          if (sel2) sel2.innerHTML = buildOptions("female");
      }

      function saveCustomPreset(personIdx) {
          const pNameId = personIdx === 2 ? "partnerName" : "nativeName";
          const pGenderId = personIdx === 2 ? "partnerGender" : "gender";
          const pDateId = personIdx === 2 ? "partnerBirthDate" : "birthDate";
          const pTimeId = personIdx === 2 ? "partnerBirthTime" : "birthTime";
          const pCityId = personIdx === 2 ? "partnerBirthCity" : "birthCity";
          const pStateId = personIdx === 2 ? "partnerBirthState" : "birthState";
          const pCountryId = personIdx === 2 ? "partnerBirthCountry" : "birthCountry";
          const pLatId = personIdx === 2 ? "partnerLatitude" : "latitude";
          const pLngId = personIdx === 2 ? "partnerLongitude" : "longitude";
          const pTzId = personIdx === 2 ? "partnerTimezone" : "timezone";
          const pOlsId = personIdx === 2 ? "partnerOlsonTimezone" : "olsonTimezone";
          const pElevId = personIdx === 2 ? "partnerElevation" : "elevation";
          const pAyanId = personIdx === 2 ? "partnerAyanamsa" : "ayanamsa";

          const name = document.getElementById(pNameId).value;
          if (!name || name.trim() === "") {
              alert("Please enter a name before saving.");
              return false;
          }

          const preset = {
              id: 'custom_' + Date.now(),
              name: name.trim(),
              gender: document.getElementById(pGenderId) ? document.getElementById(pGenderId).value : (personIdx === 2 ? "female" : "male"),
              date: document.getElementById(pDateId).value,
              time: document.getElementById(pTimeId).value,
              city: document.getElementById(pCityId).value,
              state: document.getElementById(pStateId).value,
              country: document.getElementById(pCountryId).value,
              lat: parseFloat(document.getElementById(pLatId).value) || 0,
              lng: parseFloat(document.getElementById(pLngId).value) || 0,
              tz: 5.5,
              olson: document.getElementById(pOlsId) ? document.getElementById(pOlsId).value : "Asia/Kolkata",
              elevation: document.getElementById(pElevId) ? parseFloat(document.getElementById(pElevId).value) || 0 : 0,
              ayanamsa: document.getElementById(pAyanId) ? document.getElementById(pAyanId).value : "lahiri"
          };
          
          let tzStrDisplay = document.getElementById(pTzId).value || "+05:30";
          let tzSign = tzStrDisplay.startsWith("-") ? -1 : 1;
          let tzParts = tzStrDisplay.replace(/[-+]/, "").split(":");
          preset.tz = tzSign * (parseFloat(tzParts[0] || 0) + parseFloat(tzParts[1] || 0) / 60.0);

          let customPresets = JSON.parse(localStorage.getItem('customKundliPresets') || '[]');
          
          const isDuplicate = customPresets.some(p => 
              p.name.toLowerCase() === preset.name.toLowerCase() &&
              p.date === preset.date &&
              p.time === preset.time &&
              p.lat === preset.lat &&
              p.lng === preset.lng
          );

          if (isDuplicate) {
              alert("This profile already exists in your saved profiles!");
              return true; // Return true to allow button to toggle
          }

          customPresets.unshift(preset);
          localStorage.setItem('customKundliPresets', JSON.stringify(customPresets));
          
          updatePresetDropdowns();
          alert("Saved successfully! It is now available in the 'Load Profile' dropdown.");
          return true;
      }

      function resetProfileToggleButton(personIdx) {
          const btnId = personIdx === 1 ? 'btnProfileToggle1' : 'btnProfileToggle2';
          const btn = document.getElementById(btnId);
          if (btn && btn.getAttribute('data-i18n') === 'btn_clear_profile') {
              btn.setAttribute('data-i18n', 'btn_save_profile');
              btn.innerText = "+ Save to Profile";
              if (typeof applyTranslations === 'function') applyTranslations();
              btn.style.background = "rgba(217, 45, 32, 0.1)";
              btn.style.color = "#B91C1C";
              btn.style.border = "1px solid rgba(217, 45, 32, 0.2)";
          }
      }

      function handleProfileToggle(personIdx) {
          const btnId = personIdx === 1 ? 'btnProfileToggle1' : 'btnProfileToggle2';
          const btn = document.getElementById(btnId);
          if (!btn) return;

          if (btn.getAttribute('data-i18n') !== 'btn_clear_profile') {
              if (saveCustomPreset(personIdx)) {
                  btn.setAttribute('data-i18n', 'btn_clear_profile');
                  btn.innerText = "Delete this Profile";
                  if (typeof applyTranslations === 'function') applyTranslations();
                  btn.style.background = "rgba(217, 45, 32, 0.1)";
                  btn.style.color = "#B91C1C";
                  btn.style.border = "1px solid rgba(217, 45, 32, 0.2)";
              }
          } else {
              deleteCustomPreset(personIdx);
              clearProfile(personIdx);
              btn.setAttribute('data-i18n', 'btn_save_profile');
              btn.innerText = "+ Save to Profile";
              if (typeof applyTranslations === 'function') applyTranslations();
              btn.style.background = "rgba(217, 45, 32, 0.1)";
              btn.style.color = "#B91C1C";
              btn.style.border = "1px solid rgba(217, 45, 32, 0.2)";
          }
      }

      function deleteCustomPreset(personIdx) {
          const pNameId = personIdx === 2 ? "partnerName" : "nativeName";
          const pDateId = personIdx === 2 ? "partnerBirthDate" : "birthDate";
          const pTimeId = personIdx === 2 ? "partnerBirthTime" : "birthTime";
          const pLatId = personIdx === 2 ? "partnerLatitude" : "latitude";
          const pLngId = personIdx === 2 ? "partnerLongitude" : "longitude";

          const nameEl = document.getElementById(pNameId);
          if (!nameEl) return;
          
          const name = nameEl.value.trim();
          const date = document.getElementById(pDateId).value;
          const time = document.getElementById(pTimeId).value;
          const lat = parseFloat(document.getElementById(pLatId).value) || 0;
          const lng = parseFloat(document.getElementById(pLngId).value) || 0;

          let customPresets = JSON.parse(localStorage.getItem('customKundliPresets') || '[]');
          const initialLength = customPresets.length;

          customPresets = customPresets.filter(p => 
              !(p.name.toLowerCase() === name.toLowerCase() &&
                p.date === date &&
                p.time === time &&
                p.lat === lat &&
                p.lng === lng)
          );

          if (customPresets.length < initialLength) {
              localStorage.setItem('customKundliPresets', JSON.stringify(customPresets));
              updatePresetDropdowns();
              alert("Profile deleted from your saved list.");
          }
      }

      function clearProfile(personIdx) {
          const pNameId = personIdx === 2 ? "partnerName" : "nativeName";
          const pGenderId = personIdx === 2 ? "partnerGender" : "gender";
          const pDateId = personIdx === 2 ? "partnerBirthDate" : "birthDate";
          const pTimeId = personIdx === 2 ? "partnerBirthTime" : "birthTime";
          const pCityId = personIdx === 2 ? "partnerBirthCity" : "birthCity";
          const pStateId = personIdx === 2 ? "partnerBirthState" : "birthState";
          const pCountryId = personIdx === 2 ? "partnerBirthCountry" : "birthCountry";
          const pLatId = personIdx === 2 ? "partnerLatitude" : "latitude";
          const pLngId = personIdx === 2 ? "partnerLongitude" : "longitude";
          const pSelectorId = personIdx === 2 ? "partner-celebrity-preset-selector" : "celebrity-preset-selector";
          const pTzId = personIdx === 2 ? "partnerTimezone" : "timezone";
          const pOlsId = personIdx === 2 ? "partnerOlsonTimezone" : "olsonTimezone";
          const pElevId = personIdx === 2 ? "partnerElevation" : "elevation";
          const pAyanId = personIdx === 2 ? "partnerAyanamsa" : "ayanamsa";

          // DMS IDs
          const pLatDeg = personIdx === 2 ? "partnerlatDeg" : "latDeg";
          const pLatMin = personIdx === 2 ? "partnerlatMin" : "latMin";
          const pLatSec = personIdx === 2 ? "partnerlatSec" : "latSec";
          const pLatDir = personIdx === 2 ? "partnerlatDir" : "latDir";
          const pLngDeg = personIdx === 2 ? "partnerlngDeg" : "lngDeg";
          const pLngMin = personIdx === 2 ? "partnerlngMin" : "lngMin";
          const pLngSec = personIdx === 2 ? "partnerlngSec" : "lngSec";
          const pLngDir = personIdx === 2 ? "partnerlngDir" : "lngDir";

          const safeSetValue = (id, val) => {
              const el = document.getElementById(id);
              if (el) {
                  el.value = val;
                  if (el.tagName.toLowerCase() === 'select' || el.type === 'hidden' || el.type === 'text' || el.type === 'number') {
                      const event = new Event('change');
                      event.isProgrammatic = true;
                      el.dispatchEvent(event);
                  }
              }
          };

          safeSetValue(pNameId, "");
          safeSetValue(pGenderId, personIdx === 2 ? "female" : "male");
          safeSetValue(pDateId, "");
          safeSetValue(pTimeId, "");
          safeSetValue(pCityId, "");
          safeSetValue(pStateId, "");
          safeSetValue(pCountryId, "");
          safeSetValue(pLatId, "");
          safeSetValue(pLngId, "");
          safeSetValue(pSelectorId, "");

          // Clear Advanced Options & Custom Location
          safeSetValue(pTzId, "+05:30");
          safeSetValue(pOlsId, "");
          safeSetValue(pElevId, "0");
          safeSetValue(pAyanId, "lahiri");
          
          safeSetValue(pLatDeg, "");
          safeSetValue(pLatMin, "");
          safeSetValue(pLatSec, "");
          safeSetValue(pLatDir, "N");
          
          safeSetValue(pLngDeg, "");
          safeSetValue(pLngMin, "");
          safeSetValue(pLngSec, "");
          safeSetValue(pLngDir, "E");
      }

      function loadPreset(index) {
        window.__timezoneManuallyEdited = false;
        if (index === "") return;
        
        let preset;
        if (index.startsWith('custom_')) {
            const customPresets = JSON.parse(localStorage.getItem('customKundliPresets') || '[]');
            preset = customPresets.find(p => p.id === index);
        } else {
            preset = celebrityPresets[index];
        }
        if (!preset) return;
        
        const safeSetValue = (id, value) => {
          const el = document.getElementById(id);
          if (el) {
            el.value = value;
            const event = new Event('change');
            event.isProgrammatic = true;
            el.dispatchEvent(event);
          }
        };

        safeSetValue("nativeName", preset.name);
        if (preset.gender) safeSetValue("gender", preset.gender);
        safeSetValue("birthDate", preset.date);
        safeSetValue("birthTime", preset.time);
        safeSetValue("birthCity", preset.city);
        safeSetValue("birthState", preset.state);
        safeSetValue("birthCountry", preset.country);
        safeSetValue("latitude", preset.lat);
        safeSetValue("longitude", preset.lng);
        let tzSign = preset.tz >= 0 ? "+" : "-";
        let tzAbs = Math.abs(preset.tz);
        let tzH = Math.floor(tzAbs);
        let tzM = Math.round((tzAbs - tzH) * 60);
        let tzStr = tzSign + String(tzH).padStart(2, '0') + ":" + String(tzM).padStart(2, '0');
        safeSetValue("timezone", tzStr);
        safeSetValue("olsonTimezone", preset.olson || "Asia/Kolkata");
        if (preset.elevation !== undefined) safeSetValue("elevation", preset.elevation);
        if (preset.ayanamsa !== undefined) safeSetValue("ayanamsa", preset.ayanamsa);

        const btnToggle = document.getElementById('btnProfileToggle1');
        if (btnToggle) {
            btnToggle.setAttribute('data-i18n', 'btn_clear_profile');
            btnToggle.innerText = "Delete this Profile";
            if (typeof applyTranslations === 'function') applyTranslations();
            btnToggle.style.background = "rgba(217, 45, 32, 0.1)";
            btnToggle.style.color = "#B91C1C";
            btnToggle.style.border = "1px solid rgba(217, 45, 32, 0.2)";
        }

        // Highlight the calculation button to encourage user to click
        const btn = document.getElementById("calculateBtn");
        if (btn) {
          btn.style.boxShadow = "0 0 15px var(--accent-glow)";
          setTimeout(() => {
            btn.style.boxShadow = "";
          }, 1000);
        }

        // Update URL immediately so refresh keeps the loaded data
        if (window.getAppShareUrl) {
            const shareUrl = window.getAppShareUrl();
            if (shareUrl) window.history.replaceState({}, '', shareUrl);
        }

        // Automatically calculate when both dates are present
        const p2Date = document.getElementById("partnerBirthDate") ? document.getElementById("partnerBirthDate").value : "";
        if (p2Date) {
          calculateKundli();
        }
      }

      function loadPartnerPreset(index) {
          window.__timezoneManuallyEdited = false;
          if (index === "") return;
          
          let preset;
          if (index.startsWith('custom_')) {
              const customPresets = JSON.parse(localStorage.getItem('customKundliPresets') || '[]');
              preset = customPresets.find(p => p.id === index);
          } else {
              preset = celebrityPresets[index];
          }
          if (!preset) return;
          
          const safeSetValue = (id, value) => {
            const el = document.getElementById(id);
            if (el) {
              el.value = value;
              const event = new Event('change');
              event.isProgrammatic = true;
              el.dispatchEvent(event);
            }
          };

          safeSetValue("partnerName", preset.name);
          if (preset.gender) safeSetValue("partnerGender", preset.gender);
          safeSetValue("partnerBirthDate", preset.date);
          safeSetValue("partnerBirthTime", preset.time);
          safeSetValue("partnerBirthCity", preset.city);
          safeSetValue("partnerBirthState", preset.state);
          safeSetValue("partnerBirthCountry", preset.country);
          safeSetValue("partnerLatitude", preset.lat);
          safeSetValue("partnerLongitude", preset.lng);
          
          let tzSign = preset.tz >= 0 ? "+" : "-";
          let tzAbs = Math.abs(preset.tz);
          let tzH = Math.floor(tzAbs);
          let tzM = Math.round((tzAbs - tzH) * 60);
          let tzStr = tzSign + String(tzH).padStart(2, '0') + ":" + String(tzM).padStart(2, '0');
          safeSetValue("partnerTimezone", tzStr);
          safeSetValue("partnerOlsonTimezone", preset.olson || "Asia/Kolkata");
          if (preset.elevation !== undefined) safeSetValue("partnerElevation", preset.elevation);
          if (preset.ayanamsa !== undefined) safeSetValue("partnerAyanamsa", preset.ayanamsa);

          const btnToggle = document.getElementById('btnProfileToggle2');
          if (btnToggle) {
              btnToggle.setAttribute('data-i18n', 'btn_clear_profile');
              btnToggle.innerText = "Delete this Profile";
              if (typeof applyTranslations === 'function') applyTranslations();
              btnToggle.style.background = "rgba(217, 45, 32, 0.1)";
              btnToggle.style.color = "#B91C1C";
              btnToggle.style.border = "1px solid rgba(217, 45, 32, 0.2)";
          }

          const btn = document.getElementById("calculateBtn");
          if (btn) {
            btn.style.boxShadow = "0 0 15px var(--accent-glow)";
            setTimeout(() => {
              btn.style.boxShadow = "";
            }, 1000);
          }

          // Update URL immediately so refresh keeps the loaded data
          if (window.getAppShareUrl) {
              const shareUrl = window.getAppShareUrl();
              if (shareUrl) window.history.replaceState({}, '', shareUrl);
          }

          // Automatically calculate when both profiles are loaded
          const p1Date = document.getElementById("birthDate") ? document.getElementById("birthDate").value : "";
          if (p1Date) {
            calculateKundli();
          }
      }


      // ===== DATA DEFINITIONS =====
      const zodiacSigns = [
{
          name: "Aries",
          sanskrit: "Mesha",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradAries)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M16,2C14.95,2 13.91,2.27 13,2.81C12.64,3 12.3,3.26 12,3.54C11.7,3.26 11.36,3 11,2.81C10.09,2.27 9.05,2 8,2A6,6 0 0,0 2,8A6,6 0 0,0 8,14V12A4,4 0 0,1 4,8A4,4 0 0,1 8,4C9,4 10,4.39 10.75,5.1C10.84,5.18 10.92,5.27 11,5.36V22H13V5.36C13.08,5.27 13.16,5.18 13.25,5.1C14.85,3.58 17.38,3.64 18.91,5.25C20.43,6.85 20.36,9.38 18.76,10.9C18,11.61 17.03,12 16,12V14A6,6 0 0,0 22,8A6,6 0 0,0 16,2Z"></path> </g> </svg>`,
          element: "Fire",
          ruler: "Mars",
        },
        {
          name: "Taurus",
          sanskrit: "Vrishabha",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradTaurus)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M15.59,9C17.7,7.74 19,5.46 19,3H17A5,5 0 0,1 12,8A5,5 0 0,1 7,3H5C5,5.46 6.3,7.74 8.41,9C5.09,11 4,15.28 6,18.6C7.97,21.92 12.27,23 15.59,21C18.91,19.04 20,14.74 18,11.42C17.42,10.43 16.58,9.59 15.59,9M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20Z"></path> </g> </svg>`,
          element: "Earth",
          ruler: "Venus",
        },
        {
          name: "Gemini",
          sanskrit: "Mithuna",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradGemini)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M18,5.3C19.35,4.97 20.66,4.54 21.94,4L21.18,2.14C18.27,3.36 15.15,4 12,4C8.85,4 5.73,3.38 2.82,2.17L2.06,4C3.34,4.54 4.65,4.97 6,5.3V18.7C4.65,19.03 3.34,19.46 2.06,20L2.82,21.86C8.7,19.42 15.3,19.42 21.18,21.86L21.94,20C20.66,19.46 19.35,19.03 18,18.7V5.3M8,18.3V5.69C9.32,5.89 10.66,6 12,6C13.34,6 14.68,5.89 16,5.69V18.31C13.35,17.9 10.65,17.9 8,18.31V18.3Z"></path> </g> </svg>`,
          element: "Air",
          ruler: "Mercury",
        },
        {
          name: "Cancer",
          sanskrit: "Karka",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradCancer)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M12,4C6.5,4 2,7.58 2,12C2,14.12 3.65,15.87 5.76,16H6A4,4 0 0,0 10,12A4,4 0 0,0 6,8H5.76C7.44,6.41 9.69,5.55 12,5.6C13.77,5.58 15.5,6.07 17,7L18.25,5.75C16.38,4.58 14.21,3.97 12,4M6,10A2,2 0 0,1 8,12C8,13.11 7.08,14 6,14C4.96,14 4.1,13.22 4,12.2C4,12.07 4,11.93 4,11.8C4.1,10.77 4.97,10 6,10M18.24,8H18A4,4 0 0,0 14,12A4,4 0 0,0 18,16H18.24C16.56,17.59 14.31,18.45 12,18.4C10.23,18.42 8.5,17.93 7,17L5.76,18.24C7.63,19.41 9.79,20 12,20C17.5,20 22,16.42 22,12C22,9.88 20.35,8.13 18.24,8M18,14A2,2 0 0,1 16,12C16,10.89 16.92,10 18,10C19.04,10 19.9,10.78 20,11.8C20,11.93 20,12.07 20,12.2C19.9,13.23 19.03,14 18,14Z"></path> </g> </svg>`,
          element: "Water",
          ruler: "Moon",
        },
        {
          name: "Leo",
          sanskrit: "Simha",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradLeo)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M20,17A3,3 0 0,1 17,20C15.38,19.92 14.08,18.62 14,17C14.16,15.39 14.5,13.8 15,12.26C15.54,10.55 15.87,8.79 16,7C15.93,4.27 13.73,2.07 11,2C8.27,2.07 6.07,4.27 6,7C6.15,8.53 6.5,10.03 7,11.5L7.21,12.2C5.1,11.53 2.86,12.7 2.19,14.8C1.5,16.91 2.68,19.16 4.79,19.83C6.9,20.5 9.14,19.33 9.81,17.22C9.94,16.83 10,16.41 10,16C9.84,14.27 9.5,12.56 8.91,10.92C8.47,9.65 8.16,8.34 8,7C8.08,5.38 9.38,4.08 11,4C12.62,4.08 13.92,5.38 14,7C13.84,8.61 13.5,10.2 13,11.74C12.46,13.45 12.13,15.21 12,17C12.07,19.73 14.27,21.93 17,22A5,5 0 0,0 22,17H20M6,18A2,2 0 0,1 4,16A2,2 0 0,1 6,14A2,2 0 0,1 8,16A2,2 0 0,1 6,18Z"></path> </g> </svg>`,
          element: "Fire",
          ruler: "Sun",
        },
        {
          name: "Virgo",
          sanskrit: "Kanya",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradVirgo)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M18.5,19.13C20,17.77 20,15.18 20,14A4,4 0 0,0 16,10C15.3,10 14.6,10.2 14,10.56V6A3,3 0 0,0 11,3C10.25,3 9.55,3.29 9,3.78C7.86,2.76 6.14,2.76 5,3.78C4.45,3.28 3.74,3 3,3V5A1,1 0 0,1 4,6V16H6V6A1,1 0 0,1 7,5A1,1 0 0,1 8,6V16H10V6A1,1 0 0,1 11,5A1,1 0 0,1 12,6V14C12,15.18 12,17.77 13.5,19.13C12.72,19.54 11.88,19.84 11,20V22C12.29,22 14.84,20.74 16,20.13C17.16,20.74 19.71,22 21,22V20C20.12,19.84 19.28,19.54 18.5,19.13M16,12A2,2 0 0,1 18,14C18,16.92 17.46,18 16,18C14.54,18 14,16.92 14,14A2,2 0 0,1 16,12Z"></path> </g> </svg>`,
          element: "Earth",
          ruler: "Mercury",
        },
        {
          name: "Libra",
          sanskrit: "Tula",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradLibra)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M20,16V18H13V15.91C16,15.36 17.96,12.5 17.41,9.5C16.86,6.5 14,4.54 11,5.09C8,5.65 6.04,8.5 6.59,11.5C7,13.74 8.76,15.5 11,15.91V18H4V16H6.92C5.37,14.59 4.5,12.59 4.5,10.5A7.5,7.5 0 0,1 12,3A7.5,7.5 0 0,1 19.5,10.5C19.5,12.59 18.63,14.59 17.08,16H20M20,19H4V21H20V19Z"></path> </g> </svg>`,
          element: "Air",
          ruler: "Venus",
        },
        {
          name: "Scorpio",
          sanskrit: "Vrishchika",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradScorpio)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M17.71,15.29L16.29,16.71L17.59,18H16A2,2 0 0,1 14,16V6A3,3 0 0,0 11,3C10.25,3 9.55,3.29 9,3.78C7.86,2.76 6.14,2.76 5,3.78C4.45,3.28 3.74,3 3,3V5A1,1 0 0,1 4,6V16H6V6A1,1 0 0,1 7,5A1,1 0 0,1 8,6V16H10V6A1,1 0 0,1 11,5A1,1 0 0,1 12,6V16A4,4 0 0,0 16,20H17.59L16.29,21.29L17.71,22.71L21.41,19L17.71,15.29Z"></path> </g> </svg>`,
          element: "Water",
          ruler: "Mars",
        },
        {
          name: "Sagittarius",
          sanskrit: "Dhanu",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradSagittarius)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M22,2V12H20V5.41L10.41,15L12.71,17.29L11.29,18.71L9,16.41L3.71,21.71L2.29,20.29L7.59,15L5.29,12.71L6.71,11.29L9,13.59L18.59,4H12V2H22Z"></path> </g> </svg>`,
          element: "Fire",
          ruler: "Jupiter",
        },
        {
          name: "Capricorn",
          sanskrit: "Makara",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradCapricorn)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M15,13C14.3,13 13.61,13.19 13,13.55V6A3,3 0 0,0 10,3C9.25,3 8.55,3.29 8,3.78C7.45,3.28 6.74,3 6,3V5A1,1 0 0,1 7,6V16H9V6A1,1 0 0,1 10,5A1,1 0 0,1 11,6V17A2,2 0 0,1 9,19V21C10.15,21 11.25,20.5 12,19.62C13.45,21.29 15.97,21.47 17.64,20C19.31,18.58 19.5,16.05 18.04,14.38C17.28,13.5 16.17,13 15,13M15,19A2,2 0 0,1 13,17A2,2 0 0,1 15,15A2,2 0 0,1 17,17A2,2 0 0,1 15,19Z"></path> </g> </svg>`,
          element: "Earth",
          ruler: "Saturn",
        },
        {
          name: "Aquarius",
          sanskrit: "Kumbha",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradAquarius)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M15,12.41L12,9.41L9,12.41L6,9.41L3.71,11.71L2.29,10.29L6,6.59L9,9.59L12,6.59L15,9.59L18,6.59L21.71,10.29L20.29,11.71L18,9.41L15,12.41M18,15.41L20.29,17.71L21.71,16.29L18,12.59L15,15.59L12,12.59L9,15.59L6,12.59L2.29,16.29L3.71,17.71L6,15.41L9,18.41L12,15.41L15,18.41L18,15.41Z"></path> </g> </svg>`,
          element: "Air",
          ruler: "Saturn",
        },
        {
          name: "Pisces",
          sanskrit: "Meena",
          symbol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">  <circle cx="50" cy="50" r="45" fill="url(#gradPisces)" /> <circle class="ring" cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/> <g transform="translate(22, 22) scale(2.33)" fill="#ffffff"> <path d="M20,11H18C18.11,8.19 18.73,5.42 19.81,2.82L18,2.06C16.81,4.9 16.13,7.92 16,11H8C7.87,7.92 7.19,4.9 6,2.06L4.14,2.82C5.24,5.41 5.87,8.18 6,11H4V13H6C5.89,15.81 5.27,18.58 4.19,21.18L6,21.94C7.19,19.1 7.87,16.08 8,13H16C16.13,16.08 16.81,19.1 18,21.94L19.86,21.18C18.76,18.59 18.13,15.82 18,13H20V11Z"></path> </g> </svg>`,
          element: "Water",
          ruler: "Jupiter",
        },

];

      const nakshatras = [
        { name: "Ashwini", ruler: "Ketu", startDeg: 0 },
        { name: "Bharani", ruler: "Venus", startDeg: 13.333333 },
        { name: "Krittika", ruler: "Sun", startDeg: 26.666667 },
        { name: "Rohini", ruler: "Moon", startDeg: 40 },
        { name: "Mrigashira", ruler: "Mars", startDeg: 53.333333 },
        { name: "Ardra", ruler: "Rahu", startDeg: 66.666667 },
        { name: "Punarvasu", ruler: "Jupiter", startDeg: 80 },
        { name: "Pushya", ruler: "Saturn", startDeg: 93.333333 },
        { name: "Ashlesha", ruler: "Mercury", startDeg: 106.666667 },
        { name: "Magha", ruler: "Ketu", startDeg: 120 },
        { name: "Purva Phalguni", ruler: "Venus", startDeg: 133.333333 },
        { name: "Uttara Phalguni", ruler: "Sun", startDeg: 146.666667 },
        { name: "Hasta", ruler: "Moon", startDeg: 160 },
        { name: "Chitra", ruler: "Mars", startDeg: 173.333333 },
        { name: "Swati", ruler: "Rahu", startDeg: 186.666667 },
        { name: "Vishakha", ruler: "Jupiter", startDeg: 200 },
        { name: "Anuradha", ruler: "Saturn", startDeg: 213.333333 },
        { name: "Jyeshtha", ruler: "Mercury", startDeg: 226.666667 },
        { name: "Mula", ruler: "Ketu", startDeg: 240 },
        { name: "Purva Ashadha", ruler: "Venus", startDeg: 253.333333 },
        { name: "Uttara Ashadha", ruler: "Sun", startDeg: 266.666667 },
        { name: "Shravana", ruler: "Moon", startDeg: 280 },
        { name: "Dhanishta", ruler: "Mars", startDeg: 293.333333 },
        { name: "Shatabhisha", ruler: "Rahu", startDeg: 306.666667 },
        { name: "Purva Bhadrapada", ruler: "Jupiter", startDeg: 320 },
        { name: "Uttara Bhadrapada", ruler: "Saturn", startDeg: 333.333333 },
        { name: "Revati", ruler: "Mercury", startDeg: 346.666667 },
      ];

      // Vimshottari Dasha periods in years
      // Planet definitions
      const planetDefs = {
        Sun: {
          name: "Sun",
          sanskrit: "Surya",
          color: "#FF6B00",
          exaltation: 1,
          debilitation: 7,
          ownSigns: [5],
        },
        Moon: {
          name: "Moon",
          sanskrit: "Chandra",
          color: "#808080",
          exaltation: 2,
          debilitation: 8,
          ownSigns: [4],
        },
        Mar: {
          name: "Mars",
          sanskrit: "Mangal",
          color: "#DC143C",
          exaltation: 10,
          debilitation: 4,
          ownSigns: [1, 8],
        },
        Mer: {
          name: "Mercury",
          sanskrit: "Budh",
          color: "#228B22",
          exaltation: 6,
          debilitation: 12,
          ownSigns: [3, 6],
        },
        Jup: {
          name: "Jupiter",
          sanskrit: "Guru",
          color: "#DAA520",
          exaltation: 4,
          debilitation: 10,
          ownSigns: [9, 12],
        },
        Ven: {
          name: "Venus",
          sanskrit: "Shukra",
          color: "#FF1493",
          exaltation: 12,
          debilitation: 6,
          ownSigns: [2, 7],
        },
        Sat: {
          name: "Saturn",
          sanskrit: "Shani",
          color: "#4169E1",
          exaltation: 7,
          debilitation: 1,
          ownSigns: [10, 11],
        },
        Rah: {
          name: "Rahu",
          sanskrit: "Rahu",
          color: "#708090",
          exaltation: 3,
          debilitation: 9,
          ownSigns: [],
        },
        Ket: {
          name: "Ketu",
          sanskrit: "Ketu",
          color: "#8B4513",
          exaltation: 9,
          debilitation: 3,
          ownSigns: [],
        },
      };

      // City database for lookup
      const cityDatabase = [
        { name: "New Delhi, India", lat: 28.6139, lng: 77.209, tz: 5.5 },
        { name: "Mumbai, India", lat: 19.076, lng: 72.8777, tz: 5.5 },
        { name: "Chennai, India", lat: 13.0827, lng: 80.2707, tz: 5.5 },
        { name: "Kolkata, India", lat: 22.5726, lng: 88.3639, tz: 5.5 },
        { name: "Bangalore, India", lat: 12.9716, lng: 77.5946, tz: 5.5 },
        { name: "Hyderabad, India", lat: 17.385, lng: 78.4867, tz: 5.5 },
        { name: "Ahmedabad, India", lat: 23.0225, lng: 72.5714, tz: 5.5 },
        { name: "Pune, India", lat: 18.5204, lng: 73.8567, tz: 5.5 },
        { name: "Jaipur, India", lat: 26.9124, lng: 75.7873, tz: 5.5 },
        { name: "Lucknow, India", lat: 26.8467, lng: 80.9462, tz: 5.5 },
        { name: "Varanasi, India", lat: 25.3176, lng: 82.9739, tz: 5.5 },
        { name: "Patna, India", lat: 25.5941, lng: 85.1376, tz: 5.5 },
        { name: "Bhopal, India", lat: 23.2599, lng: 77.4126, tz: 5.5 },
        { name: "Chandigarh, India", lat: 30.7333, lng: 76.7794, tz: 5.5 },
        { name: "London, UK", lat: 51.5074, lng: -0.1278, tz: 0 },
        { name: "New York, USA", lat: 40.7128, lng: -74.006, tz: -5 },
        { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437, tz: -8 },
        { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708, tz: 4 },
        { name: "Singapore", lat: 1.3521, lng: 103.8198, tz: 8 },
        { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093, tz: 10 },
        { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, tz: 9 },
        { name: "Toronto, Canada", lat: 43.6532, lng: -79.3832, tz: -5 },
        { name: "Chicago, USA", lat: 41.8781, lng: -87.6298, tz: -6 },
        { name: "San Francisco, USA", lat: 37.7749, lng: -122.4194, tz: -8 },
      ];

      // Global state
      let currentChartStyle = "north";
      let lagnaSign = 1;
      let d1Planets = [];

      // ===== ASTRONOMICAL CALCULATIONS =====

      function resolveTimezoneOffset(dateStr, timeStr, olsonTz) {
        try {
          if (!dateStr || !timeStr || !olsonTz) return null;
          const localAsUtcMs = Date.parse(`${dateStr}T${timeStr}Z`);
          if (isNaN(localAsUtcMs)) return null;

          const offsetAt = (utcMs) => {
            const parts = new Intl.DateTimeFormat("en-US", {
              timeZone: olsonTz,
              timeZoneName: "shortOffset",
            }).formatToParts(new Date(utcMs));
            const tzPart = parts.find((p) => p.type === "timeZoneName");
            if (!tzPart) return null;
            const v = tzPart.value; 
            if (v === "GMT") return 0;
            const m = v.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?/);
            if (!m) return null;
            const sign = m[1] === "-" ? -1 : 1;
            return sign * ((+m[2] || 0) + (+m[3] || 0) / 60 + (+m[4] || 0) / 3600);
          };

          // Fixed-point iteration: find UTC instant U where localTime = U + offset(U).
          let offset = offsetAt(localAsUtcMs);
          if (offset === null) return null;
          for (let i = 0; i < 3; i++) {
            const next = offsetAt(localAsUtcMs - offset * 3600000);
            if (next === null || next === offset) break;
            offset = next;
          }

          const abs = Math.abs(offset);
          const h = Math.floor(abs);
          const mnt = Math.round((abs - h) * 60);
          return {
            val: offset,
            str: (offset < 0 ? "-" : "+") + String(h).padStart(2, "0") + ":" + String(mnt).padStart(2, "0"),
          };
        } catch (e) {
          console.error("TZ resolution error:", e);
          return null;
        }
      }

      function getWeekdayFromDateStr(dateStr) {
        const [y, m, d] = String(dateStr).split("-").map(Number);
        return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
      }


      // Constants
      const DEG_TO_RAD = Math.PI / 180;
      const RAD_TO_DEG = 180 / Math.PI;
      const J2000 = 2451545.0;

      // Calculate Julian Day Number
      function calculateJulianDay(
        year,
        month,
        day,
        hour,
        minute,
        second,
        timezone,
        calendar = "gregorian",
      ) {
        // Use dynamic timezone offset
        const ut = hour + minute / 60 + second / 3600 - timezone;
        let d = day + ut / 24;
        let m = month;
        let y = year;

        if (m <= 2) {
          y -= 1;
          m += 12;
        }

        const A = Math.floor(y / 100);
        const B = calendar === "julian" ? 0 : 2 - A + Math.floor(A / 4);

        const JD =
          Math.floor(365.25 * (y + 4716)) +
          Math.floor(30.6001 * (m + 1)) +
          d +
          B -
          1524.5;

        return JD;
      }

      // Normalize angle to 0-360 range
      function normalizeAngle(angle) {
        angle = angle % 360;
        return angle < 0 ? angle + 360 : angle;
      }

      // Get Ayanamsa value based on selected system
      function getAyanamsa(jd, system) {
        // Universal Dynamic True Lahiri (Chitra Paksha) using accurate Ephemeris logic
        const T = (jd - 2451545.0) / 36525.0;
        // Traditional Lahiri (Newcomb's constant) used by AstroSage and popular tools
        let mean_ayan = 23.8594 + (1.3960416666) * T + (0.0003083333) * T * T;
        let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + Math.pow(T, 3) / 450000;
        let L0 = 280.4665 + 36000.7698 * T;
        let L1 = 218.3165 + 481267.8813 * T;
        
        let dPsi = -17.20 * Math.sin(omega * Math.PI / 180) 
                   - 1.32 * Math.sin(2 * L0 * Math.PI / 180) 
                   - 0.23 * Math.sin(2 * L1 * Math.PI / 180) 
                   + 0.21 * Math.sin(2 * omega * Math.PI / 180);
                   
        let true_lahiri = mean_ayan + (dPsi / 3600.0);

        switch (system) {
          case "lahiri":
            return true_lahiri;
          case "raman":
            return true_lahiri - 1.48; // roughly
          case "krishnamurti":
            return true_lahiri - 0.10;
          case "thirukanitam":
            return true_lahiri - 1.72;
          default:
            return true_lahiri;
        }
      }

      // Calculate Sun's position

      function jdToDate(jd) {
        return new Date(
          Date.UTC(2000, 0, 1, 12, 0, 0) + (jd - 2451545.0) * 86400000,
        );
      }

      function jdToDateStr(jd) {
        const d = jdToDate(jd);
        return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      }

      
      function getGeoLon(body, date) {
        const time = Astronomy.MakeTime(date);
        // Strict Geocentric calculation using Astro engine's built-in vector methods
        const vec = Astronomy.GeoVector(body, time, true); // true for aberration
        const ecl = Astronomy.Ecliptic(vec);
        return ecl.elon;
      }

      function calculateSunPosition(jd, lat=0, lng=0) {
        return getGeoLon(Astronomy.Body.Sun, jdToDate(jd), lat, lng);
      }

      function calculateMoonPosition(jd, lat=0, lng=0) {
        return getGeoLon(Astronomy.Body.Moon, jdToDate(jd), lat, lng);
      }

      function calculatePlanetPosition(jd, planet, lat=0, lng=0) {
        const bodyMap = {
          mercury: Astronomy.Body.Mercury,
          venus: Astronomy.Body.Venus,
          mars: Astronomy.Body.Mars,
          jupiter: Astronomy.Body.Jupiter,
          saturn: Astronomy.Body.Saturn,
          uranus: Astronomy.Body.Uranus,
          neptune: Astronomy.Body.Neptune,
          pluto: Astronomy.Body.Pluto,
        };
        if (!bodyMap[planet]) return 0;
        return getGeoLon(bodyMap[planet], jdToDate(jd), lat, lng);
      }

      function calculateRahuPosition(jd) {
        const T = (jd - J2000) / 36525;
        let rahu = 125.0445 - 1934.1363 * T + 0.0021 * T * T;
        return normalizeAngle(rahu);
      }

      // Calculate Ascendant
      function calculateAscendant(jd, latitude, longitude, timezone) {
        const T = (jd - 2451545.0) / 36525.0;
        let GMST =
          280.46061837 +
          360.98564736629 * (jd - 2451545.0) +
          0.000387933 * T * T -
          (T * T * T) / 38710000.0;
        GMST = normalizeAngle(GMST);

        let LST = GMST + longitude;
        LST = normalizeAngle(LST);

        const obl =
          23.439291 -
          0.0130042 * T -
          0.00000016 * T * T +
          0.000000504 * T * T * T;
        const LSTRad = (LST * Math.PI) / 180.0;
        const oblRad = (obl * Math.PI) / 180.0;
        const latRad = (latitude * Math.PI) / 180.0;

        let y = Math.cos(LSTRad);
        let x = -(
          Math.sin(LSTRad) * Math.cos(oblRad) +
          Math.tan(latRad) * Math.sin(oblRad)
        );
        let ascendant = (Math.atan2(y, x) * 180.0) / Math.PI;

        return normalizeAngle(ascendant);
      }

      // Get sign number from longitude
      function getSignFromLongitude(longitude) {
        return Math.floor((((longitude % 360) + 360) % 360) / 30) + 1;
      }

      // Get degree within sign
      function getDegreeInSign(longitude) {
        return (((longitude % 360) + 360) % 360) % 30;
      }

      // Get Nakshatra from longitude
      function getNakshatraFromLongitude(longitude) {
        const normalizedLon = ((longitude % 360) + 360) % 360;
        const nakshatraIndex = Math.floor(normalizedLon / (360 / 27));
        const nakshatra = nakshatras[nakshatraIndex];
        const degreeInNakshatra = normalizedLon % (360 / 27);
        const pada = Math.floor(degreeInNakshatra / (360 / 108)) + 1;

        return { nakshatra, pada: Math.min(pada, 4) };
      }

      // Get planet status
      function getPlanetStatus(abbr, sign) {
        const def = planetDefs[abbr];
        if (!def) return "Neutral";

        if (def.exaltation === sign) return "Exalted";
        if (def.debilitation === sign) return "Debilitated";
        if (def.ownSigns && def.ownSigns.includes(sign)) return "Own Sign";

        return "Neutral";
      }

      // ===== VARGA (DIVISIONAL) CHART CALCULATIONS =====
      function getVargaSign(longitude, divisions) {
        const signIndex = Math.floor(longitude / 30);
        const degreeInSign = longitude % 30;
        const sizeOfDivision = 30 / divisions;
        const divisionInSign = Math.floor(degreeInSign / sizeOfDivision);

        let startSign;
        const element = signIndex % 4;

        switch (divisions) {
          case 2: // Hora
            if (signIndex % 2 === 0) {
              // Odd Sign (Aries, Gemini...)
              return divisionInSign === 0 ? 5 : 4; // Leo first half, Cancer second
            } else {
              // Even Sign
              return divisionInSign === 0 ? 4 : 5; // Cancer first half, Leo second
            }
          case 3: // Dreshkan
            startSign = signIndex + 1;
            if (divisionInSign === 1) startSign = ((signIndex + 4) % 12) + 1;
            if (divisionInSign === 2) startSign = ((signIndex + 8) % 12) + 1;
            return startSign;
          case 4: // Chaturthamasha
            startSign = signIndex + 1;
            if (divisionInSign === 1) startSign = ((signIndex + 3) % 12) + 1;
            if (divisionInSign === 2) startSign = ((signIndex + 6) % 12) + 1;
            if (divisionInSign === 3) startSign = ((signIndex + 9) % 12) + 1;
            return startSign;
          case 5: // Panchmansha (D5) - Standard AstroSage / JHora / BPHS Cyclic Rule
            const modalityD5 = signIndex % 3; // 0=Movable, 1=Fixed, 2=Dual
            if (modalityD5 === 0) {
              startSign = signIndex + 1; // Movable: from self
            } else if (modalityD5 === 1) {
              startSign = ((signIndex + 4) % 12) + 1; // Fixed: from 5th
            } else {
              startSign = ((signIndex + 8) % 12) + 1; // Dual: from 9th
            }
            return ((startSign - 1 + divisionInSign) % 12) + 1;
          case 6: // Shasthamsha
            return (
              ((signIndex % 2 === 0 ? divisionInSign : 6 + divisionInSign) %
                12) +
              1
            );
          case 7: // Saptamansha
            if (signIndex % 2 === 0) {
              return ((signIndex + divisionInSign) % 12) + 1;
            } else {
              return ((signIndex + 6 + divisionInSign) % 12) + 1;
            }
          case 8: // Ashtamansha
            const quality = signIndex % 3; // 0=Movable, 1=Fixed, 2=Dual
            if (quality === 0)
              startSign = 1; // Aries
            else if (quality === 1)
              startSign = 9; // Sagittarius
            else startSign = 5; // Leo
            return ((startSign - 1 + divisionInSign) % 12) + 1;
          case 9: // Navamansha
            switch (element) {
              case 0:
                startSign = 1;
                break;
              case 1:
                startSign = 10;
                break;
              case 2:
                startSign = 7;
                break;
              case 3:
                startSign = 4;
                break;
            }
            return ((startSign - 1 + divisionInSign) % 12) + 1;
          case 10: // Dashamansha
            if (signIndex % 2 === 0) {
              return ((signIndex + divisionInSign) % 12) + 1;
            } else {
              return ((signIndex + 8 + divisionInSign) % 12) + 1;
            }
          case 11: // Ekadashamsha
            startSign = ((12 - signIndex) % 12) + 1;
            return ((startSign - 1 + divisionInSign) % 12) + 1;
          case 12: // Dwadashamsha
            return ((signIndex + divisionInSign) % 12) + 1;
          case 16: // Shodashamsha
            if (signIndex % 3 === 0) {
              startSign = 1; // Movable starts from Aries
            } else if (signIndex % 3 === 1) {
              startSign = 5; // Fixed starts from Leo
            } else {
              startSign = 9; // Dual starts from Sagittarius
            }
            return ((startSign - 1 + divisionInSign) % 12) + 1;
          case 20: // Vishamansha
            if (signIndex % 3 === 0) {
              startSign = 1; // Movable starts from Aries
            } else if (signIndex % 3 === 1) {
              startSign = 9; // Fixed starts from Sagittarius
            } else {
              startSign = 5; // Dual starts from Leo
            }
            return ((startSign - 1 + divisionInSign) % 12) + 1;
          case 24: // Chaturvimshamsha
            if (signIndex % 2 === 0) {
              return ((5 - 1 + divisionInSign) % 12) + 1;
            } else {
              return ((4 - 1 + divisionInSign) % 12) + 1;
            }
          case 27: // Bhamsha
            switch (element) {
              case 0:
                startSign = 1;
                break;
              case 1:
                startSign = 4;
                break;
              case 2:
                startSign = 7;
                break;
              case 3:
                startSign = 10;
                break;
            }
            return ((startSign - 1 + divisionInSign) % 12) + 1;
          case 30: // Trishmansha
            // Simplified Trishmansha calculation (Mars, Saturn, Jupiter, Mercury, Venus based on odd/even)
            if (signIndex % 2 === 0) {
              if (degreeInSign <= 5) return 1;
              if (degreeInSign <= 10) return 11;
              if (degreeInSign <= 18) return 9;
              if (degreeInSign <= 25) return 3;
              return 7;
            } else {
              if (degreeInSign <= 5) return 2;
              if (degreeInSign <= 12) return 6;
              if (degreeInSign <= 20) return 12;
              if (degreeInSign <= 25) return 10;
              return 8;
            }
          case 40: // Khavedamsha
            if (signIndex % 2 === 0) {
              return ((1 - 1 + divisionInSign) % 12) + 1;
            } else {
              return ((7 - 1 + divisionInSign) % 12) + 1;
            }
          case 45: // Akshvedansha
            switch (signIndex % 3) {
              case 0:
                return ((1 - 1 + divisionInSign) % 12) + 1;
              case 1:
                return ((5 - 1 + divisionInSign) % 12) + 1;
              case 2:
                return ((9 - 1 + divisionInSign) % 12) + 1;
            }
            return 1;
          case 60: // Shashtymsha
            return ((signIndex + divisionInSign) % 12) + 1;
          default:
            return signIndex + 1;
        }
      }

      // Global object to hold all pre-calculated charts
      let allCharts = {};
      let globalSiderealPositions = null;

      // Calculate 10th House Cusp (Midheaven / MC)
      function calculateMC(jd, longitude) {
        const T = (jd - 2451545.0) / 36525.0;
        let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
        let LST = normalizeAngle(GMST + longitude);
        const obl = 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
        const ramcRad = (LST * Math.PI) / 180.0;
        const oblRad = (obl * Math.PI) / 180.0;
        let mc = (Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(oblRad)) * 180.0) / Math.PI;
        return normalizeAngle(mc);
      }

      // Sripati Bhava Chalit Calculation (Bhava Arambha / Madhya / Sandhi)
      function calculateSripatiChalit(siderealLagnaLon, jd, latitude, longitude, ayanamsa, d1Planets, lagnaSign) {
        const tropicalMC = calculateMC(jd, longitude);
        const siderealMC = normalizeAngle(tropicalMC - ayanamsa);

        const C = {};
        C[1] = siderealLagnaLon;
        C[10] = siderealMC;
        C[7] = normalizeAngle(C[1] + 180);
        C[4] = normalizeAngle(C[10] + 180);

        const arc10_1 = normalizeAngle(C[1] - C[10]);
        const d1 = arc10_1 / 3.0;
        C[11] = normalizeAngle(C[10] + d1);
        C[12] = normalizeAngle(C[11] + d1);

        const arc1_4 = normalizeAngle(C[4] - C[1]);
        const d2 = arc1_4 / 3.0;
        C[2] = normalizeAngle(C[1] + d2);
        C[3] = normalizeAngle(C[2] + d2);

        C[5] = normalizeAngle(C[11] + 180);
        C[6] = normalizeAngle(C[12] + 180);
        C[8] = normalizeAngle(C[2] + 180);
        C[9] = normalizeAngle(C[3] + 180);

        const S = {};
        for (let k = 1; k <= 12; k++) {
          const nextK = (k % 12) + 1;
          const span = normalizeAngle(C[nextK] - C[k]);
          S[k] = normalizeAngle(C[k] + span / 2.0);
        }

        const getChalitHouse = (pLon) => {
          for (let k = 1; k <= 12; k++) {
            const prevSandhi = k === 1 ? S[12] : S[k - 1];
            const nextSandhi = S[k];
            const houseSpan = normalizeAngle(nextSandhi - prevSandhi);
            const planetOffset = normalizeAngle(pLon - prevSandhi);
            if (planetOffset < houseSpan) {
              return k;
            }
          }
          return 1;
        };

        const chalitPlanets = d1Planets.map((p) => {
          const cHouse = getChalitHouse(p.longitude);
          const chalitSign = ((lagnaSign - 1 + (cHouse - 1)) % 12) + 1;
          return {
            ...p,
            chalitHouse: cHouse,
            sign: chalitSign,
            degree: p.degree,
            signLord: zodiacSigns[chalitSign - 1] ? zodiacSigns[chalitSign - 1].ruler : p.signLord,
            house: cHouse,
          };
        });

        return {
          planets: chalitPlanets,
          lagna: lagnaSign,
          bhavaMadhyas: C,
          bhavaSandhis: S,
        };
      }

      function generateAllCharts(siderealPositions, d1Planets, lagnaSign, jd, latitude, longitude, ayanamsa) {
        let chalitData;
        if (jd !== undefined && latitude !== undefined && longitude !== undefined && ayanamsa !== undefined) {
          chalitData = calculateSripatiChalit(siderealPositions.ascendant, jd, latitude, longitude, ayanamsa, d1Planets, lagnaSign);
        } else {
          chalitData = { planets: [...d1Planets], lagna: lagnaSign };
        }

        allCharts = {
          D1: { planets: d1Planets, lagna: lagnaSign },
          Chalit: chalitData,
          Gochar: calculateGochar(), // Uses current date, takes no args
        };

        const dDivisions = [
          2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 24, 27, 30, 40, 45, 60,
        ];

        dDivisions.forEach((div) => {
          const chartName = `D${div}`;
          allCharts[chartName] = {
            planets: d1Planets.map((planet) => {
              const vargaSign = getVargaSign(planet.longitude, div);
              const degInSign = planet.degree !== undefined ? planet.degree : (planet.longitude % 30);
              return {
                ...planet,
                sign: vargaSign,
                degree: degInSign,
                signLord: zodiacSigns[vargaSign - 1] ? zodiacSigns[vargaSign - 1].ruler : planet.signLord,
              };
            }),
            lagna: getVargaSign(siderealPositions.ascendant, div),
          };
        });
      }

      function calculateGochar() {
        try {
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;
          const day = now.getDate();
          const hour = now.getHours();
          const minute = now.getMinutes();
          const second = now.getSeconds();

          // Dynamically fetch coordinates from the user's input instead of hardcoding Delhi
          let _lat = parseFloat(document.getElementById("latitude").value);
          let _lng = parseFloat(document.getElementById("longitude").value);
          
          if (isNaN(_lat)) _lat = 0;
          if (isNaN(_lng)) _lng = 0;

          let tzStrDisplay = document.getElementById("timezone").value || "+05:30";
          let tzSign = tzStrDisplay.startsWith("-") ? -1 : 1;
          let tzParts = tzStrDisplay.replace(/[-+]/, "").split(":");
          let tzDec = parseFloat(tzParts[0] || 0) + parseFloat(tzParts[1] || 0) / 60.0;
          const tz = tzSign * tzDec;

          const jd = calculateJulianDay(
            year,
            month,
            day,
            hour,
            minute,
            second,
            tz,
            "gregorian",
          );
          const ayanamsa = getAyanamsa(jd, "lahiri"); // default

          const tropicalPositions = {
            sun: calculateSunPosition(jd, (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
            moon: calculateMoonPosition(jd, (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
            mars: calculatePlanetPosition(jd, "mars", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
            mercury: calculatePlanetPosition(jd, "mercury", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
            jupiter: calculatePlanetPosition(jd, "jupiter", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
            venus: calculatePlanetPosition(jd, "venus", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
            saturn: calculatePlanetPosition(jd, "saturn", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
            rahu: calculateRahuPosition(jd),
            ascendant: calculateAscendant(jd, _lat, _lng, tz),
          };

          const siderealPositions = {};
          for (const [key, value] of Object.entries(tropicalPositions)) {
            siderealPositions[key] = normalizeAngle(value - ayanamsa);
          }
          siderealPositions.ketu = normalizeAngle(siderealPositions.rahu + 180);

          const gocharPlanets = [];
          const planetMapping = [
            { abbr: "Sun", key: "sun", name: "Sun", color: "#FF6B00" },
            { abbr: "Moon", key: "moon", name: "Moon", color: "#808080" },
            { abbr: "Mar", key: "mars", name: "Mars", color: "#DC143C" },
            { abbr: "Mer", key: "mercury", name: "Mercury", color: "#228B22" },
            { abbr: "Jup", key: "jupiter", name: "Jupiter", color: "#DAA520" },
            { abbr: "Ven", key: "venus", name: "Venus", color: "#FF1493" },
            { abbr: "Sat", key: "saturn", name: "Saturn", color: "#4169E1" },
            { abbr: "Rahu", key: "rahu", name: "Rahu", color: "#708090" },
            { abbr: "Ketu", key: "ketu", name: "Ketu", color: "#8B4513" },
          ];

          planetMapping.forEach(({ abbr, key, name, color }) => {
            const lon = siderealPositions[key];
            gocharPlanets.push({
              abbr,
              name,
              color,
              longitude: lon,
              sign: getSignFromLongitude(lon),
            });
          });

          return {
            planets: gocharPlanets,
            lagna: getSignFromLongitude(siderealPositions.ascendant),
          };
        } catch (e) {
          console.error("Gochar error:", e);
          return { planets: [], lagna: 1 };
        }
      }

      // Calculate Panchang Elements

      // Calculate Panchang Elements
      function calculateSunriseSunset(jd, latitude, longitude, timezone) {
        try {
          const J2000_EPOCH = 2451545.0;
          
          // Astronomy engine expects a Date.
          // In the current architecture, jd is the exact birth time (or at least close to it).
          // For sunrise/sunset of the birth day, we should use a base date of 00:00 UTC 
          // of the local birth date to ensure we scan forward properly for that day's events.
          // Let's create a date from jd.
          const unixTimeMs = (jd - J2000_EPOCH) * 86400000 + 946728000000;
          let birthDateExact = new Date(unixTimeMs);

          // Get the local day, then set time to 00:00 local, then convert to UTC for searching.
          // Wait, simple approach: just use the local Date string or timezone offset.
          // Let's set it to 00:00 local time = (00:00 - timezone offset) UTC
          let localMidnightUTC = new Date(birthDateExact.getTime());
          let tzh = Math.trunc(timezone);
          let tzm = Math.round((timezone - tzh) * 60);
          localMidnightUTC.setUTCHours(0 - tzh, 0 - tzm, 0, 0);

          let observer = new Astronomy.Observer(latitude, longitude, 0);

          // Use standard atmospheric refraction + semi-diameter (-0.8333 degrees)
          // No hardcoded coordinate-specific asymmetrical offsets permitted
          const standardRefraction = -0.8333;

          let riseObj = Astronomy.SearchAltitude(Astronomy.Body.Sun, observer, 1, localMidnightUTC, 1, standardRefraction);
          let setObj = Astronomy.SearchAltitude(Astronomy.Body.Sun, observer, -1, localMidnightUTC, 1, standardRefraction);
          
          function formatTime(dateObj, tzOffset) {
            const localTimeMs = dateObj.getTime() + tzOffset * 3600000;
            const localTime = new Date(localTimeMs);
            const h = localTime.getUTCHours();
            const m = localTime.getUTCMinutes();
            const s = Math.round(localTime.getUTCSeconds() + localTime.getUTCMilliseconds() / 1000);
            
            let finalS = s;
            let finalM = m;
            let finalH = h;
            if (finalS >= 60) {
               finalS -= 60;
               finalM += 1;
            }
            if (finalM >= 60) {
               finalM -= 60;
               finalH += 1;
            }
            if (finalH >= 24) {
               finalH -= 24;
            }
            
            const ampm = finalH >= 12 ? 'PM' : 'AM';
            const h12 = finalH % 12 || 12;
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[localTime.getUTCMonth()];
            const day = localTime.getUTCDate().toString().padStart(2, "0");
            
            const timeString = `${h12.toString().padStart(2, "0")}:${finalM.toString().padStart(2, "0")}:${finalS.toString().padStart(2, "0")} ${ampm}`;
            const dateString = `${month} ${day}`;
            
            return {
              formatted: `${timeString}, ${dateString}`,
              timeStrOriginal: `${finalH.toString().padStart(2, "0")}:${finalM.toString().padStart(2, "0")}:${finalS.toString().padStart(2, "0")}`
            };
          }
          
          function getDecimalHours(dateObj, tzOffset) {
             const localTimeMs = dateObj.getTime() + tzOffset * 3600000;
             const localTime = new Date(localTimeMs);
             return localTime.getUTCHours() + (localTime.getUTCMinutes() / 60) + (localTime.getUTCSeconds() / 3600);
          }

          
          let riseFormatted = riseObj ? formatTime(riseObj.date, timezone).formatted : "06:00:00 AM, Jan 01";
          let setFormatted = setObj ? formatTime(setObj.date, timezone).formatted : "06:00:00 PM, Jan 01";
          
          let sunriseHours = riseObj ? getDecimalHours(riseObj.date, timezone) : 6.0;

          return {
            sunrise: riseFormatted,
            sunset: setFormatted,
            sunriseHours: sunriseHours,
            sunriseMs: riseObj ? riseObj.date.getTime() : null,
            jd: jd,
            latitude: latitude,
            longitude: longitude,
            timezone: timezone
          };

        } catch (e) {
          console.error("Sunrise/Sunset calculation failed", e);
          return {
            sunrise: "06:00:00",
            sunset: "18:00:00",
            sunriseHours: 6.0
          };
        }
      }

      function calculatePanchang(
        jd,
        moonLon,
        sunLon,
        dateStr,
        lat,
        lng,
        tz,
        timeStr,
      ) {
        // 1. Tithi
        let diff = normalizeAngle(moonLon - sunLon);
        let tithiVal = diff / 12;
        let tithiIndex = Math.floor(tithiVal) + 1;

        let paksha = tithiIndex <= 15 ? "Shukla" : "Krishna";
        let tithiNum = tithiIndex > 15 ? tithiIndex - 15 : tithiIndex;

        const tithiNames = [
          "Pratipada",
          "Dwitiya",
          "Tritiya",
          "Chaturthi",
          "Panchami",
          "Shashthi",
          "Saptami",
          "Ashtami",
          "Navami",
          "Dashami",
          "Ekadashi",
          "Dwadashi",
          "Trayodashi",
          "Chaturdashi",
          "Purnima",
          "Amavasya",
        ];

        let tithiName =
          tithiNum === 15
            ? paksha === "Shukla"
              ? "Purnima"
              : "Amavasya"
            : tithiNames[tithiNum - 1];
        let fullTithi =
          paksha === "Shukla"
            ? `Shukla ${tithiName}`
            : tithiName === "Amavasya"
              ? "Amavasya"
              : `Krishna ${tithiName}`;
        if (fullTithi === "Shukla Purnima") fullTithi = "Purnima";

        // 2. Karana
        let karanaVal = diff / 6;
        let karanaIndex = Math.floor(karanaVal) + 1;

        const movableKaranas = [
          "Bava",
          "Balava",
          "Kaulava",
          "Taitil",
          "Gara",
          "Vanija",
          "Vishti",
        ];
        const fixedKaranas = ["Shakuni", "Chatushpada", "Naga", "Kintughna"];

        let karanaName = "";
        if (karanaIndex === 1) karanaName = fixedKaranas[3];
        else if (karanaIndex >= 58) karanaName = fixedKaranas[karanaIndex - 58];
        else karanaName = movableKaranas[(karanaIndex - 2) % 7];

        // 3. Yoga
        let sumLon = normalizeAngle(moonLon + sunLon);
        let yogaIndex = Math.floor(sumLon / (13 + 1 / 3));

        const yogaNames = [
          "Vishkumbha",
          "Priti",
          "Ayushman",
          "Saubhagya",
          "Shobhan",
          "Atiganda",
          "Sukarma",
          "Dhriti",
          "Shula",
          "Ganda",
          "Vriddhi",
          "Dhruva",
          "Vyaghata",
          "Harshana",
          "Vajra",
          "Siddhi",
          "Vyatipata",
          "Variyan",
          "Parigh",
          "Shiva",
          "Siddha",
          "Sadhya",
          "Shubha",
          "Shukla",
          "Brahma",
          "Indra",
          "Vaidhriti",
        ];
        let yogaName = yogaNames[yogaIndex];

        // 4. Nakshatra
        const { nakshatra } = getNakshatraFromLongitude(moonLon);
        let nakshatraName = nakshatra.name;

        // 5. Sunrise / Sunset
        // To get accurate sunrise for the day, we need JD at 00:00 UTC of that local date.
        const birthDate = new Date(`${dateStr}T12:00:00Z`); // use noon roughly
        const year = birthDate.getUTCFullYear();
        const month = birthDate.getUTCMonth() + 1;
        const day = birthDate.getUTCDate();

        const jd0 = calculateJulianDay(
          year,
          month,
          day,
          0,
          0,
          0,
          0,
          "gregorian",
        );
        const sunData = calculateSunriseSunset(jd0, lat, lng, tz);

        // 6. Day (Vaar)
        const timeParts = timeStr.split(":").map(Number);
        const birthHourDecimal =
          timeParts[0] + timeParts[1] / 60 + (timeParts[2] || 0) / 3600;

        let weekday = getWeekdayFromDateStr(dateStr);

        // Vedic day changes at sunrise
        if (birthHourDecimal < sunData.sunriseHours) {
          weekday = (weekday + 6) % 7; // Previous day
        }

        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        let vaar = days[weekday];

        // 7. Amanta & Purnimanta Lunar Months
        // Astronomical rule: The Amanta lunar month is named according to the zodiac sign
        // in which the NEXT Amavasya (new moon) occurs.
        // Amavasya happens when Moon catches up to the Sun.
        let degreesToNextAmavasya = (360 - diff) % 360;
        if (degreesToNextAmavasya === 0) degreesToNextAmavasya = 360; // if it's exactly amavasya

        let daysToNextAmavasya = degreesToNextAmavasya / 12.1907; // Moon moves ~12.19 deg/day faster than Sun
        let sunLonAtNextAmavasya = normalizeAngle(
          sunLon + daysToNextAmavasya * 0.9856,
        ); // Sun moves ~0.98 deg/day
        let nextAmavasyaSunSign = Math.floor(sunLonAtNextAmavasya / 30);

        const lunarMonths = [
          "Chaitra",
          "Vaishakha",
          "Jyeshtha",
          "Ashadha",
          "Shraavan",
          "Bhadrapada",
          "Ashwin",
          "Kartik",
          "Margashirsha",
          "Pausha",
          "Magha",
          "Phalguna",
        ];

        let amantaIndex = nextAmavasyaSunSign;
        let amantaMonth = lunarMonths[amantaIndex];

        // Purnimanta month starts 15 days earlier, so during Krishna Paksha it is one month ahead.
        let purnimantaIndex =
          paksha === "Krishna" ? (amantaIndex + 1) % 12 : amantaIndex;
        let purnimantaMonth = lunarMonths[purnimantaIndex];

        // Standard sidereal mapping:
        // Pisces (11) = Chaitra (0)
        // Aries (0) = Vaishakha (1)

        // 8. Samvatsara (Vikram and Shak)
        const birthYear = parseInt(dateStr.split("-")[0]);

        const samvatsaras = [
          "Prabhava",
          "Vibhava",
          "Shukla",
          "Pramoda",
          "Prajapati",
          "Angira",
          "Shrimukha",
          "Bhava",
          "Yuva",
          "Dhatri",
          "Ishvara",
          "Bahudhanya",
          "Pramathi",
          "Vikrama",
          "Vrushapraja",
          "Chitrabhanu",
          "Subhanu",
          "Tarana",
          "Parthiva",
          "Vyaya",
          "Sarvajit",
          "Sarvadhari",
          "Virodhi",
          "Vikruti",
          "Khara",
          "Nandana",
          "Vijaya",
          "Jaya",
          "Manmatha",
          "Durmukha",
          "Hevilambi",
          "Vilambi",
          "Vikari",
          "Sharvari",
          "Plava",
          "Shubhakrit",
          "Shobhan",
          "Krodhi",
          "Vishvavasu",
          "Parabhava",
          "Plavanga",
          "Kilaka",
          "Saumya",
          "Sadharana",
          "Virodhakrit",
          "Paridhavi",
          "Pramadi",
          "Ananda",
          "Rakshasa",
          "Nala",
          "Pingala",
          "Kalayukta",
          "Siddharthi",
          "Raudra",
          "Durmati",
          "Dundubhi",
          "Rudhirodgari",
          "Raktaksha",
          "Krodhana",
          "Kshaya",
        ];

        // Approximate Shaka and Vikram years
        // Amanta year changes around Chaitra Shukla Pratipada (roughly March/April)
        let shakaYear = birthYear - 78;
        let vikramYear = birthYear + 57;

        // Simple adjustment: if before April, assume previous year for simplicity in this utility
        const birthMonth = parseInt(dateStr.split("-")[1]);
        if (birthMonth < 4) {
          shakaYear -= 1;
          vikramYear -= 1;
        }

        // Jovian cycle indices
        const shakaIndex = (shakaYear + 11) % 60;
        const vikramIndex = (vikramYear + 9) % 60;

        let shakSamvat = samvatsaras[shakaIndex] || samvatsaras[0];
        let vikramSamvat = samvatsaras[vikramIndex] || samvatsaras[0];

        return {
          paksha: paksha,
          tithi: fullTithi,
          karan: karanaName,
          yog: yogaName,
          nakshatra: nakshatraName,
          sunrise: sunData.sunrise,
          sunset: sunData.sunset,
          sunriseHours: sunData.sunriseHours,
          sunriseMs: sunData.sunriseMs,
          latitude: sunData.latitude,
          longitude: sunData.longitude,
          timezone: sunData.timezone,
          jd: sunData.jd,
          day: vaar,
          amanta: amantaMonth,
          purnimanta: purnimantaMonth,
          vikram: vikramSamvat,
          shak: shakSamvat,
        };
      }

      function getVarna(signIndex) {
    const varnaMap = {
        0: "Kshatriya", 1: "Vaishya", 2: "Shudra", 3: "Brahmin",
        4: "Kshatriya", 5: "Vaishya", 6: "Shudra", 7: "Brahmin",
        8: "Kshatriya", 9: "Vaishya", 10: "Shudra", 11: "Brahmin"
    };
    return varnaMap[signIndex] || "-";
}

function getVashya(signIndex) {
    if (signIndex === 7) return "Keetak"; 
    const vashyas = ["Chatuspad", "Chatuspad", "Manav", "Jalchar", "Vanchar", "Manav", "Manav", "Keetak", "Chatuspad", "Chatuspad", "Manav", "Jalchar"]; 
    return vashyas[signIndex];
}


function getYunja(nakshatraIndex) {
    const n = nakshatraIndex + 1; // 1-based index (1-27)
    if (n >= 1 && n <= 5) return "Purva";
    if (n >= 6 && n <= 17) return "Madhya";
    if (n >= 18 && n <= 26) return "Antya";
    if (n === 27) return "Purva";
    return "Unknown";
}

function getPayaNakBased(nakshatraIndex) {
    const n = nakshatraIndex + 1; // 1-based index (1-27)
    if (n === 27 || n === 1 || n === 2) return "Gold";
    if (n >= 3 && n <= 5) return "Iron";
    if (n >= 6 && n <= 17) return "Silver";
    if (n >= 18 && n <= 26) return "Copper";
    return "Unknown";
}



const yonis = ["Ashwa", "Gaja", "Aja", "Sarpa", "Sarpa", "Shwan", "Marjar", "Mesh", "Marjar", "Mushak", "Mushak", "Gau", "Mahish", "Vyaghra", "Mahish", "Vyaghra", "Mrig", "Mrig", "Shwan", "Vanar", "Nakul", "Vanar", "Simha", "Ashwa", "Simha", "Gau", "Gaja"];
const ganas = ["Dev", "Manushya", "Rakshasa", "Manushya", "Dev", "Manushya", "Dev", "Dev", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Dev", "Rakshasa", "Dev", "Rakshasa", "Dev", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Dev", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Dev"];
const nadis = ["Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi", "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi", "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi", "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi", "Aadi", "Madhya", "Antya"];
const tatvas = ["Fire", "Earth", "Air", "Water", "Fire", "Earth", "Air", "Water", "Fire", "Earth", "Air", "Water"];
const nakshatraSyllables = [
    ["Chu", "Che", "Cho", "La"], ["Li", "Lu", "Le", "Lo"], ["A", "I", "U", "E"], ["O", "Va", "Vi", "Vu"], ["Ve", "Vo", "Ka", "Ki"], ["Ku", "Gha", "Ng", "Chha"], ["Ke", "Ko", "Ha", "Hi"], ["Hu", "He", "Ho", "Da"], ["Di", "Du", "De", "Do"], ["Ma", "Mi", "Mu", "Me"], ["Mo", "Ta", "Ti", "Tu"], ["Te", "To", "Pa", "Pi"], ["Pu", "Sha", "Na", "Tha"], ["Pe", "Po", "Ra", "Ri"], ["Ru", "Re", "Ro", "Ta"], ["Ti", "Tu", "Te", "To"], ["Na", "Ni", "Nu", "Ne"], ["No", "Ya", "Yi", "Yu"], ["Ye", "Yo", "Bha", "Bhi"], ["Bhu", "Dha", "Bha", "Dha"], ["Bhe", "Bho", "Ja", "Ji"], ["Ju", "Je", "Jo", "Gha"], ["Ga", "Gi", "Gu", "Ge"], ["Go", "Sa", "Si", "Su"], ["Se", "So", "Da", "Di"], ["Du", "Tha", "Jha", "Da"], ["De", "Do", "Cha", "Chi"]
];



      // DOM Elements for DMS (Native)
      const latDeg = document.getElementById('latDeg');
      const latMin = document.getElementById('latMin');
      const latSec = document.getElementById('latSec');
      const latDir = document.getElementById('latDir');
      const latInput = document.getElementById('latitude');

      const lngDeg = document.getElementById('lngDeg');
      const lngMin = document.getElementById('lngMin');
      const lngSec = document.getElementById('lngSec');
      const lngDir = document.getElementById('lngDir');
      const lngInput = document.getElementById('longitude');

      // DOM Elements for DMS (Partner)
      const platDeg = document.getElementById('partnerlatDeg');
      const platMin = document.getElementById('partnerlatMin');
      const platSec = document.getElementById('partnerlatSec');
      const platDir = document.getElementById('partnerlatDir');
      const platInput = document.getElementById('partnerLatitude');

      const plngDeg = document.getElementById('partnerlngDeg');
      const plngMin = document.getElementById('partnerlngMin');
      const plngSec = document.getElementById('partnerlngSec');
      const plngDir = document.getElementById('partnerlngDir');
      const plngInput = document.getElementById('partnerLongitude');

      // Populate selects
      function populateSelect(selectEl, max, isDatalist = false) {
          if (!selectEl) return;
          selectEl.innerHTML = '';
          for (let i = 0; i <= max; i++) {
              const option = document.createElement('option');
              option.value = i;
              if (!isDatalist) {
                 option.textContent = i;
              }
              selectEl.appendChild(option);
          }
      }

      // Native
      populateSelect(document.getElementById('latDegList'), 90, true);
      populateSelect(document.getElementById('latMinList'), 59, true);
      populateSelect(document.getElementById('latSecList'), 59, true);
      populateSelect(document.getElementById('lngDegList'), 180, true);
      populateSelect(document.getElementById('lngMinList'), 59, true);
      populateSelect(document.getElementById('lngSecList'), 59, true);

      // Partner
      populateSelect(document.getElementById('partnerlatDegList'), 90, true);
      populateSelect(document.getElementById('partnerlatMinList'), 59, true);
      populateSelect(document.getElementById('partnerlatSecList'), 59, true);
      populateSelect(document.getElementById('partnerlngDegList'), 180, true);
      populateSelect(document.getElementById('partnerlngMinList'), 59, true);
      populateSelect(document.getElementById('partnerlngSecList'), 59, true);

      // Decimal to DMS
      function decimalToDMS(decimal, isLat) {
          let dir = isLat ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W');
          let abs = Math.abs(decimal);
          let deg = Math.floor(abs);
          let minFloat = (abs - deg) * 60;
          let min = Math.floor(minFloat);
          let sec = Math.round((minFloat - min) * 60);

          if (sec === 60) {
              sec = 0;
              min += 1;
          }
          if (min === 60) {
              min = 0;
              deg += 1;
          }

          return { deg, min, sec, dir };
      }

      // DMS to Decimal
      function dmsToDecimal(deg, min, sec, dir) {
          let decimal = parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600;
          if (dir === 'S' || dir === 'W') {
              decimal = -decimal;
          }
          return decimal;
      }

      // Sync Decimal to UI
      function syncDecimalToUI() {
          // Native Sync
          if (latInput && latInput.value) {
              const dms = decimalToDMS(parseFloat(latInput.value), true);
              if (latDeg) latDeg.value = dms.deg;
              if (latMin) latMin.value = dms.min;
              if (latSec) latSec.value = dms.sec;
              if (latDir) latDir.value = dms.dir;
          }
          if (lngInput && lngInput.value) {
              const dms = decimalToDMS(parseFloat(lngInput.value), false);
              if (lngDeg) lngDeg.value = dms.deg;
              if (lngMin) lngMin.value = dms.min;
              if (lngSec) lngSec.value = dms.sec;
              if (lngDir) lngDir.value = dms.dir;
          }
          
          // Partner Sync
          if (platInput && platInput.value) {
              const dms = decimalToDMS(parseFloat(platInput.value), true);
              if (platDeg) platDeg.value = dms.deg;
              if (platMin) platMin.value = dms.min;
              if (platSec) platSec.value = dms.sec;
              if (platDir) platDir.value = dms.dir;
          }
          if (plngInput && plngInput.value) {
              const dms = decimalToDMS(parseFloat(plngInput.value), false);
              if (plngDeg) plngDeg.value = dms.deg;
              if (plngMin) plngMin.value = dms.min;
              if (plngSec) plngSec.value = dms.sec;
              if (plngDir) plngDir.value = dms.dir;
          }
      }

      // Sync UI to Decimal
      function syncUIToDecimal() {
          // Native Sync
          if (latInput && latDeg && latMin && latSec && latDir) {
              latInput.value = dmsToDecimal(latDeg.value, latMin.value, latSec.value, latDir.value);
          }
          if (lngInput && lngDeg && lngMin && lngSec && lngDir) {
              lngInput.value = dmsToDecimal(lngDeg.value, lngMin.value, lngSec.value, lngDir.value);
          }
          
          // Partner Sync
          if (platInput && platDeg && platMin && platSec && platDir) {
              platInput.value = dmsToDecimal(platDeg.value, platMin.value, platSec.value, platDir.value);
          }
          if (plngInput && plngDeg && plngMin && plngSec && plngDir) {
              plngInput.value = dmsToDecimal(plngDeg.value, plngMin.value, plngSec.value, plngDir.value);
          }
      }

      // Event Listeners for DMS selects
      [latDeg, latMin, latSec, latDir, lngDeg, lngMin, lngSec, lngDir, platDeg, platMin, platSec, platDir, plngDeg, plngMin, plngSec, plngDir].forEach(el => {
          if (el) {
              el.addEventListener('change', syncUIToDecimal);
          }
      });

      // Listen for changes on hidden inputs (e.g. from safeSetValue or city suggestions)
      if (latInput) latInput.addEventListener('change', syncDecimalToUI);
      if (lngInput) lngInput.addEventListener('change', syncDecimalToUI);
      if (platInput) platInput.addEventListener('change', syncDecimalToUI);
      if (plngInput) plngInput.addEventListener('change', syncDecimalToUI);

      // Initial Sync
      syncDecimalToUI();

      
        
        const dateInput = document.getElementById("birthDate");
        if (dateInput && !dateInput.dataset.listenerAdded) {
            dateInput.dataset.listenerAdded = "true";
            dateInput.addEventListener("change", () => { window.__timezoneManuallyEdited = false; });
        }
        const cityInput = document.getElementById("birthCity");
        if (cityInput && !cityInput.dataset.listenerAdded) {
            cityInput.dataset.listenerAdded = "true";
            cityInput.addEventListener("change", () => { window.__timezoneManuallyEdited = false; });
        }

        const tzInput = document.getElementById("timezone");
        if (tzInput && !tzInput.dataset.listenerAdded) {
            tzInput.dataset.listenerAdded = "true";
            tzInput.addEventListener("input", (e) => { if(!e.isProgrammatic) window.__timezoneManuallyEdited = true; });
            tzInput.addEventListener("change", (e) => { if(!e.isProgrammatic) window.__timezoneManuallyEdited = true; });
        }

      
      
      const astroDictionary = {
  planetInHouse: {
    Mar: {
                  1: "Mars in the First house infuses your core identity with intense, pioneering energy. You require a partner who respects your autonomy, as you naturally project a dominant aura to guard your inner emotional vulnerability.",
                  2: "Mars in the Second house channels your fierce energy into self-worth and material security. You require a partner who understands that your blunt, unfiltered communication is often an unconscious defense mechanism to establish firm boundaries.",
                  3: "Mars in the Third house supercharges your intellect with a relentless, competitive drive. You process emotions through dynamic debate, requiring a partner who is intellectually robust and unafraid to challenge your perspectives.",
                  4: "Mars in the Fourth house embeds a fiery, restless energy deep within your psychological roots. You fiercely protect your inner circle, requiring a partner who offers immense patience and a safe space to process your profound inner intensity.",
                  5: "Mars in the Fifth house brings a highly dramatic, charged passion to your romantic pursuits. Underneath your theatrical confidence lies a deep need for validation; you require a partner who celebrates your intense spirit rather than trying to tame it.",
                  6: "Mars in the Sixth house turns you into a relentless problem-solver with iron-clad resilience. You often channel anxiety into extreme productivity, requiring a partner who understands your drive and gently reminds you to surrender and rest.",
                  7: "Mars in the Seventh house creates a magnetic, highly charged approach to partnerships. You unconsciously seek a dynamic equal to match your high-octane intensity, requiring a partner who can hold their ground without escalating the friction.",
                  8: "Mars in the Eighth house grants you unparalleled survival instincts and an aura of profound, mysterious power. You demand raw, absolute intimacy, as your intensity is a protective response to a deep-rooted fear of emotional betrayal.",
                  9: "Mars in the Ninth house fuels your belief systems with the absolute zeal of a crusader. Your aggressive pursuit of meaning defines your identity; you require a partner who respects your intellectual independence and joins your quest for truth.",
                  10: "Mars in the Tenth house channels your raw energy into a commanding, executive legacy. Your intense ambition is deeply tied to your self-worth, requiring a supportive partner who champions your public success and understands your drive to conquer.",
                  11: "Mars in the Eleventh house directs your passionate energy toward progressive, collective aspirations. You are a fearless leader for your community, requiring a partner who supports your visionary goals and matches your energetic loyalty.",
                  12: "Mars in the Twelfth house operates as a hidden warrior, burying raw passions deep within the subconscious. You may struggle to express anger directly, requiring a profoundly empathetic partner who can help you safely unpack your repressed desires."
              },
    Mar_Male: {
                  1: "Mars in the First house gives him a fiercely independent, warrior-like core. He projects a dominant, protective aura to mask his inner vulnerabilities, requiring a partner who respects his autonomy while offering a soft, grounding sanctuary.",
                  2: "With Mars in the Second house, his raw energy is channeled into accumulating resources and defending his self-worth. His communication can be blunt, acting as a subconscious shield; he needs a partner who understands his protective nature.",
                  3: "Mars in the Third house supercharges his intellect with a restless, competitive drive. He processes emotions through debate and action, needing a partner who is intellectually robust and unafraid of his dynamic mental pacing.",
                  4: "Mars in the Fourth house embeds a fiery energy deep within his emotional roots. He is fiercely protective of his home and inner circle, requiring a partner who offers immense patience to soothe his profound inner intensity.",
                  5: "Mars in the Fifth house brings a highly theatrical, passionate energy to his romantic pursuits. Underneath his confident charm lies a deep need for validation; he needs a partner who celebrates his fierce spirit without competing for the spotlight.",
                  6: "Mars in the Sixth house turns him into a relentless problem-solver with an iron-clad work ethic. He often channels his internal anxieties into extreme productivity, needing a partner who gently reminds him to surrender and rest.",
                  7: "Mars in the Seventh house creates a magnetic, highly charged approach to partnerships. He unconsciously seeks a dynamic equal to match his high-octane intensity, requiring a partner who can hold their ground gracefully.",
                  8: "Mars in the Eighth house grants him unparalleled survival instincts and an aura of intense, mysterious power. He demands raw, absolute intimacy, as his intensity is a protective response to a deep-rooted fear of betrayal.",
                  9: "Mars in the Ninth house fuels his belief systems with the absolute zeal of a crusader. His aggressive pursuit of truth defines his identity; he requires a partner who respects his intellectual independence and shares his vision.",
                  10: "Mars in the Tenth house channels his raw energy into a commanding, executive legacy. His ambition is deeply tied to his self-worth, needing a supportive partner who champions his public success and understands his drive to conquer.",
                  11: "Mars in the Eleventh house directs his passionate energy toward progressive, collective aspirations. He is a fearless leader for his community, requiring a partner who supports his visionary goals and matches his fierce loyalty.",
                  12: "Mars in the Twelfth house operates as a hidden warrior, burying raw passions deep within his subconscious. He may struggle to express anger directly, requiring a profoundly empathetic partner to help him safely unpack his repressed desires."
              },
    Mar_Female: {
                  1: "Mars in the First house infuses her identity with an unapologetic, pioneering fire. She possesses a natural, commanding magnetism and requires a partner who is unthreatened by her strength and celebrates her fierce independence.",
                  2: "With Mars in the Second house, she fiercely guards her values and material security. Her direct, unfiltered communication is a boundary-setting tool; she needs a secure partner who appreciates her raw honesty and protective nature.",
                  3: "Mars in the Third house gives her a brilliantly sharp, competitive mind. She thrives on mental stimulation and dynamic exchanges, requiring a partner who can match her quick wit and engage her in passionate, intellectual intimacy.",
                  4: "Mars in the Fourth house creates a fiercely protective, matriarchal energy within her inner sanctuary. She guards her emotional vulnerability closely, needing a partner who provides unshakeable emotional stability and profound trust.",
                  5: "Mars in the Fifth house makes her approach to love highly passionate, creative, and dramatically vibrant. She refuses to settle for mundane romance, requiring a partner who matches her intense devotion and honors her creative fire.",
                  6: "Mars in the Sixth house turns her into a resilient, unstoppable force in overcoming life's obstacles. She often shoulders burdens silently, needing a supportive partner who actively shares the load and encourages her to relax.",
                  7: "Mars in the Seventh house makes her a magnetic, intense force in relationships. She naturally attracts (or requires) a strong, dynamic partner who can stand as her true equal without turning passion into unnecessary friction.",
                  8: "Mars in the Eighth house gives her a profound, almost mystical psychological depth and resilience. She seeks soul-level, transformative intimacy, requiring a partner who is completely transparent and unafraid of her emotional intensity.",
                  9: "Mars in the Ninth house fuels her with the fierce spirit of an explorer and truth-seeker. She is fiercely protective of her beliefs, needing a partner who honors her expansive vision and walks beside her on her life's adventures.",
                  10: "Mars in the Tenth house makes her an absolute powerhouse in her professional life. She demands respect and builds her legacy with intense drive; she needs a partner who is her biggest cheerleader, completely unthreatened by her success.",
                  11: "Mars in the Eleventh house channels her fierce energy into championing causes and protecting her tribe. She is a visionary force, requiring a partner who shares her progressive ideals and respects her unwavering loyalty to her community.",
                  12: "Mars in the Twelfth house gives her the aura of a deeply intuitive, spiritual warrior. Her passions run deep beneath the surface, requiring a profoundly emotionally intelligent partner to help her channel her hidden, intense energies."
              }
  }
};

      function toggleInputForm(forceState) {
          const body = document.getElementById("inputFormBody");
          const textBtn = document.getElementById("formToggleText");
          const vLine = document.getElementById("toggleIconVLine");
          const header = document.querySelector(".form-header");
          if (!body) return;
          
          const isCurrentlyOpen = body.style.display !== "none";
          
          if (forceState === 'collapse' || (isCurrentlyOpen && forceState !== 'expand')) {
              body.style.display = "none";
              if (textBtn) {
                  textBtn.setAttribute('data-i18n', 'btn_show');
                  const uiText = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra && localizedParagraphs[currentLang].ui_extra.btn_show) ||
                                 (langData[currentLang] && langData[currentLang].ui && langData[currentLang].ui.btn_show) || 
                                 "Click to add details";
                  textBtn.innerText = uiText;
              }
              if (vLine) vLine.style.display = "inline"; // Show Plus sign (+)
              if (header) header.style.marginBottom = "14px"; 
          } else {
              body.style.display = "block";
              if (textBtn) {
                  textBtn.setAttribute('data-i18n', 'btn_hide');
                  const uiText = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra && localizedParagraphs[currentLang].ui_extra.btn_hide) ||
                                 (langData[currentLang] && langData[currentLang].ui && langData[currentLang].ui.btn_hide) || 
                                 "Click to hide details";
                  textBtn.innerText = uiText;
              }
              if (vLine) vLine.style.display = "none"; // Hide vertical line to show Minus sign (-)
              if (header) header.style.marginBottom = "20px"; 
          }
      }

      
const ashtakootaCalculator = (boySign, boyNak, girlSign, girlNak, bName, gName) => {
       bName = (bName || "Boy").split(" ")[0]; gName = (gName || "Girl").split(" ")[0];
       const uiEx = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra) ? localizedParagraphs[currentLang].ui_extra : {};

       // Names Helpers
       const varnaNames = { 1: uiEx.varna_shudra||"Shudra", 2: uiEx.varna_vaishya||"Vaishya", 3: uiEx.varna_kshatriya||"Kshatriya", 4: uiEx.varna_brahmin||"Brahmin" };
       const vashyaNames = [uiEx.vashya_chat||"Chatushpad", uiEx.vashya_manav||"Manav", uiEx.vashya_jal||"Jalchar", uiEx.vashya_van||"Vanchar", uiEx.vashya_keet||"Keetak"];
       const yoniNames = [uiEx.yoni_horse||"Horse", uiEx.yoni_elephant||"Elephant", uiEx.yoni_sheep||"Sheep", uiEx.yoni_serpent||"Serpent", uiEx.yoni_dog||"Dog", uiEx.yoni_cat||"Cat", uiEx.yoni_rat||"Rat", uiEx.yoni_cow||"Cow", uiEx.yoni_buffalo||"Buffalo", uiEx.yoni_tiger||"Tiger", uiEx.yoni_deer||"Deer", uiEx.yoni_monkey||"Monkey", uiEx.yoni_mongoose||"Mongoose", uiEx.yoni_lion||"Lion"];
       const taraNames = ["", uiEx.tara_janma||"Janma", uiEx.tara_sampat||"Sampat", uiEx.tara_vipat||"Vipat", uiEx.tara_kshema||"Kshema", uiEx.tara_pratyari||"Pratyari", uiEx.tara_sadhaka||"Sadhaka", uiEx.tara_vadha||"Vadha", uiEx.tara_mitra||"Mitra", uiEx.tara_atimitra||"Ati-Mitra"];
       const ganaNames = [uiEx.gana_deva||"Deva", uiEx.gana_manushya||"Manushya", uiEx.gana_rakshasa||"Rakshasa"];
       const nadiNames = [uiEx.nadi_aadi||"Aadi", uiEx.nadi_madhya||"Madhya", uiEx.nadi_antya||"Antya"];
       const rajjuNames = [uiEx.rajju_pada||"Pada", uiEx.rajju_kati||"Kati", uiEx.rajju_nabhi||"Nabhi", uiEx.rajju_kantha||"Kantha", uiEx.rajju_shiro||"Shiro"];

       // 1. Varna (Max 1)
       const varnaMap = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4];
       let bVarna = varnaMap[boySign - 1]; let gVarna = varnaMap[girlSign - 1];
       let varnaScore = (bVarna >= gVarna) ? 1 : 0;
       let vStat = varnaScore === 1 ? (uiEx.m_stat_comp || 'Compatible') : (uiEx.m_stat_lower || `${bName}'s varna is lower`);
       let varnaShort = (uiEx.m_varna_desc || `{bName}: {bVarna}, {gName}: {gVarna} — {status}`).replace('{bName}', bName).replace('{bVarna}', varnaNames[bVarna]).replace('{gName}', gName).replace('{gVarna}', varnaNames[gVarna]).replace('{status}', vStat);
       let varnaDetail = "";
       if (bVarna === gVarna) varnaDetail = uiEx.varna_det_eq ? uiEx.varna_det_eq.replace('{bVarna}', varnaNames[bVarna]) : `Both of you operate on the exact same intrinsic spiritual frequency (${varnaNames[bVarna]}). While you may outwardly appear as two distinct individuals, internally there is a profound, silent emotional understanding between you. Your energies flow naturally from one to the other, bringing out a harmonious life force that is rare to find.`;
       else if (bVarna > gVarna) varnaDetail = uiEx.varna_det_b_gt_g ? uiEx.varna_det_b_gt_g.replace('{bName}', bName).replace('{bVarna}', varnaNames[bVarna]).replace('{gName}', gName).replace('{gVarna}', varnaNames[gVarna]) : `${bName} brings a guiding, protective ${varnaNames[bVarna]} energy, while ${gName} grounds the relationship with a deeply pragmatic ${varnaNames[gVarna]} aura. This creates a beautifully complementary flow where mutual respect thrives. You rarely clash over ego because your subconscious roles align perfectly.`;
       else varnaDetail = uiEx.varna_det_g_gt_b ? uiEx.varna_det_g_gt_b.replace('{bName}', bName).replace('{bVarna}', varnaNames[bVarna]).replace('{gName}', gName).replace('{gVarna}', varnaNames[gVarna]) : `This combination introduces a unique polarity. ${gName}'s ${varnaNames[gVarna]} frequency brings a profound emotional maturity that subtly guides ${bName}'s ${varnaNames[bVarna]} nature. While unconventional, this friction acts as a mirror, challenging both of you to grow beyond traditional roles and fostering deep mutual evolution.`;
       let varnaDesc = `<strong style="color:var(--text-primary);">${varnaShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${varnaDetail}</span>`;

       // 2. Vashya (Max 2)
       const vashyaMap = [0, 0, 1, 2, 3, 1, 1, 4, 0, 2, 1, 2];
       const vashyaTable = [[2,1,1,0.5,1],[1,2,0.5,0,1],[1,0.5,2,1,1],[0.5,0,1,2,0],[1,1,1,0,2]];
       let bVashya = vashyaMap[boySign - 1]; let gVashya = vashyaMap[girlSign - 1];
       let vashyaScore = vashyaTable[bVashya][gVashya];
       let vashStat = vashyaScore === 2 ? (uiEx.m_stat_exc || 'Excellent') : vashyaScore > 0 ? (uiEx.m_stat_acc || 'Acceptable') : (uiEx.m_stat_incomp || 'Incompatible');
       let vashyaShort = (uiEx.m_vashya_desc || `{bName}: {bVashya}, {gName}: {gVashya} — {status}`).replace('{bName}', bName).replace('{bVashya}', vashyaNames[bVashya]).replace('{gName}', gName).replace('{gVashya}', vashyaNames[gVashya]).replace('{status}', vashStat);
       let vashyaDetail = "";
       if (vashyaScore === 2) vashyaDetail = uiEx.vashya_det_exc || `Belonging to highly compatible magnetic groups, you naturally stimulate each other's self-expression and creativity. You possess a fine attuning of each other's subconscious mind. Even in silence, there is a powerful magnetic attraction that naturally pulls you back together, making your loyalty feel effortless.`;
       else if (vashyaScore > 0) vashyaDetail = uiEx.vashya_det_acc || `With this alignment, there is a balanced, steady magnetic pull. You both fiercely guard your independence, yet there is an underlying current of empathy that binds you during challenging moments. Your mutual responsibility makes you incredibly attractive to one another.`;
       else vashyaDetail = uiEx.vashya_det_inc || `This combination brings an intense, undeniable polarity. You may outwardly appear to clash in how you assert control or express dominance, but this friction actually serves as a powerful mirror. It forces profound self-reflection, turning your relationship into an intense catalyst for personal growth.`;
       let vashyaDesc = `<strong style="color:var(--text-primary);">${vashyaShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${vashyaDetail}</span>`;

       // 3. Tara (Max 3)
       let b2g = (girlNak - boyNak + 27) % 27 + 1;
       let g2b = (boyNak - girlNak + 27) % 27 + 1;
       let b2gRem = b2g % 9 || 9; let g2bRem = g2b % 9 || 9;
       let t1 = [3, 5, 7].includes(b2gRem) ? 0 : 1.5;
       let t2 = [3, 5, 7].includes(g2bRem) ? 0 : 1.5;
       let taraScore = t1 + t2;
       let tStat = taraScore >= 2 ? (uiEx.m_stat_comp || 'Compatible') : (uiEx.m_stat_incomp || 'Incompatible');
       let taraShort = (uiEx.m_tara_desc || `{bName}'s Tara: {bTara}, {gName}'s Tara: {gTara} — {status}`).replace('{bName}', bName).replace('{bTara}', taraNames[g2bRem]).replace('{gName}', gName).replace('{gTara}', taraNames[b2gRem]).replace('{status}', tStat);
       let taraDetail = taraScore >= 2 
           ? (uiEx.tara_det_comp || `This highly favorable alignment indicates that your destinies are naturally woven together. You subtly uplift each other’s fortune and well-being. You will often find that simply being in each other's presence brings a deep, unspoken sense of comfort, healing, and luck.`)
           : (uiEx.tara_det_incomp || `This alignment asks you to consciously nurture each other's emotional and physical well-being. While you may sometimes struggle to fully understand your partner's unspoken stress, learning to hold space without judgment will transform this challenge into your relationship's greatest emotional strength.`);
       let taraDesc = `<strong style="color:var(--text-primary);">${taraShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${taraDetail}</span>`;

       // 4. Yoni (Max 4)
       const yoniNakMap = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];
       const yoniTable = [
           [ 4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1 ], [ 2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0 ],
           [ 2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1 ], [ 3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2 ],
           [ 2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1 ], [ 2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1 ],
           [ 2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2 ], [ 1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1 ],
           [ 0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1 ], [ 1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1 ],
           [ 3, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1 ], [ 3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2 ],
           [ 2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2 ], [ 1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4 ]
       ];
       let bYoni = yoniNakMap[boyNak]; let gYoni = yoniNakMap[girlNak];
       let yoniScore = yoniTable[bYoni][gYoni];
       let yStat = yoniScore === 4 ? (uiEx.m_stat_exc || 'Excellent') : yoniScore >= 2 ? (uiEx.m_stat_neut || 'Neutral/Good') : (uiEx.m_stat_incomp || 'Incompatible');
       let yoniShort = (uiEx.m_yoni_desc || `{bName}: {bYoni}, {gName}: {gYoni} — {status}`).replace('{bName}', bName).replace('{bYoni}', yoniNames[bYoni]).replace('{gName}', gName).replace('{gYoni}', yoniNames[gYoni]).replace('{status}', yStat);
       let yoniDetail = yoniScore >= 3 
           ? (uiEx.yoni_det_exc || `Your physical and psychological intimacy operates on a beautifully synchronized frequency. There is an unspoken, instinctive magnetism here that allows you to feel deeply secure, truly seen, and passionately connected on a primal soul level.`)
           : (yoniScore >= 2 ? (uiEx.yoni_det_acc || `You have a grounded and highly adaptable physical connection. While passion may naturally ebb and flow with life's external stresses, your underlying affection and willingness to respect each other's boundaries keeps your bond steady and secure.`)
           : (uiEx.yoni_det_inc || `Your primal instincts operate on fundamentally different wavelengths. Outwardly you may try hard to align, but internally there can be moments of profound emotional or physical disconnect. Bridging this gap requires deep vulnerability, intense patience, and completely letting go of rigid expectations.`));
       let yoniDesc = `<strong style="color:var(--text-primary);">${yoniShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${yoniDetail}</span>`;

       // 5. Graha Maitri (Max 5)
       const signLords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
       const feelings = {
           "Sun": { "Moon":2, "Mars":2, "Jupiter":2, "Mercury":1, "Venus":0, "Saturn":0 },
           "Moon": { "Sun":2, "Mercury":2, "Mars":1, "Jupiter":1, "Venus":1, "Saturn":1 },
           "Mars": { "Sun":2, "Moon":2, "Jupiter":2, "Venus":1, "Saturn":1, "Mercury":0 },
           "Mercury": { "Sun":2, "Venus":2, "Mars":1, "Jupiter":1, "Saturn":1, "Moon":0 },
           "Jupiter": { "Sun":2, "Moon":2, "Mars":2, "Saturn":1, "Mercury":0, "Venus":0 },
           "Venus": { "Mercury":2, "Saturn":2, "Mars":1, "Jupiter":1, "Sun":0, "Moon":0 },
           "Saturn": { "Mercury":2, "Venus":2, "Jupiter":1, "Sun":0, "Moon":0, "Mars":0 }
       };
       let bLord = signLords[boySign - 1]; let gLord = signLords[girlSign - 1];
       let maitriScore = 5; 
       if (bLord !== gLord) {
           let f1 = feelings[bLord][gLord]; let f2 = feelings[gLord][bLord];
           let fSum = f1 + f2;
           if (fSum === 4) maitriScore = 5;
           else if (fSum === 3) maitriScore = 4;
           else if (fSum === 2) maitriScore = (f1 === 1 && f2 === 1) ? 3 : 1;
           else if (fSum === 1) maitriScore = 0.5;
           else if (fSum === 0) maitriScore = 0;
       }
       let mStat = maitriScore >= 4 ? (uiEx.m_stat_comp || 'Compatible') : maitriScore >= 3 ? (uiEx.m_stat_neut || 'Neutral') : (uiEx.m_stat_inim || 'Inimical');
       const getLocalPlanetNames = (abbr) => { return getLocalPlanet(abbr.substring(0,3)); };
       let maitriShort = (uiEx.m_maitri_desc || `{bName}'s lord: {bLord}, {gName}'s lord: {gLord} — {status}`).replace('{bName}', bName).replace('{bLord}', getLocalPlanetNames(bLord)).replace('{gName}', gName).replace('{gLord}', getLocalPlanetNames(gLord)).replace('{status}', mStat);
       let maitriDetail = maitriScore >= 4 
           ? (uiEx.maitri_det_exc || `Your ruling planets are celestial friends. This translates into a beautiful, effortless intellectual friendship. You naturally understand each other's worldviews, making your communication a safe haven where you can completely unmask and be your authentic selves.`)
           : (maitriScore >= 3 ? (uiEx.maitri_det_acc || `With neutral planetary rulers, your intellectual dynamic is highly balanced. You don't always agree, but you both possess the rare maturity to respect your differences, offering a healthy space for individual thoughts to coexist peacefully.`)
           : (uiEx.maitri_det_inc || `Your core planetary frequencies often clash, meaning you perceive the world through fundamentally different lenses. While this can cause misunderstandings, it also offers a profound opportunity to learn a completely new way of thinking if you practice radical, non-judgmental empathy.`));
       let maitriDesc = `<strong style="color:var(--text-primary);">${maitriShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${maitriDetail}</span>`;

       // 6. Gana (Max 6)
       const ganaMap = [0,1,2,1,0,1,0,0,2,2,1,1,0,2,0,2,0,2,2,1,1,0,2,2,1,1,0];
       const ganaTable = [[6, 6, 0],[5, 6, 0],[0, 0, 6]];
       let bGana = ganaMap[boyNak]; let gGana = ganaMap[girlNak];
       let ganaScore = ganaTable[bGana][gGana];
       let gStat = ganaScore > 0 ? (uiEx.m_stat_harm || 'Harmonious') : (uiEx.m_stat_inharm || 'Inharmonious');
       let ganaShort = (uiEx.m_gana_desc || `{bName}: {bGana}, {gName}: {gGana} — {status}`).replace('{bName}', bName).replace('{bGana}', ganaNames[bGana]).replace('{gName}', gName).replace('{gGana}', ganaNames[gGana]).replace('{status}', gStat);
       let ganaDetail = ganaScore >= 5 
           ? (uiEx.gana_det_exc || `Sharing highly compatible archetypes, you approach life's challenges with the same core temperament. This shared energetic rhythm allows you to naturally sync your life goals and handle external stress without taking it out on each other.`)
           : (ganaScore > 0 ? (uiEx.gana_det_acc || `Your temperaments have differing base frequencies. One of you may be more grounded while the other is fiercely independent. Acknowledging this difference without trying to change or fix each other is the key to your relationship's harmony.`)
           : (uiEx.gana_det_inc || `There is a stark contrast between your core archetypes. Internally, you may often feel that your partner overreacts or underreacts to specific situations. Embracing this tension as a tool to expand your own perspective, rather than viewing it as a flaw, will bring immense maturity to the bond.`));
       let ganaDesc = `<strong style="color:var(--text-primary);">${ganaShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${ganaDetail}</span>`;

       // 7. Bhakoot (Max 7)
       let bhakootDist = (girlSign - boySign + 12) % 12 + 1;
       let bhakootScore = [2, 12, 5, 9, 6, 8].includes(bhakootDist) ? 0 : 7;
       let bhStat = bhakootScore === 7 ? (uiEx.m_bh_no_dosha || "No Bhakoot Dosha — emotionally compatible.") : (uiEx.m_bh_dosha || `Bhakoot Dosha detected (Signs are {dist} positions apart)`).replace('{dist}', toNativeNum(bhakootDist, currentLang));
       let bhakootDetail = bhakootScore === 7 
           ? (uiEx.bhakoot_det_exc || `Your Moon signs are placed in a highly supportive cosmic axis. This grants your relationship a profound emotional elasticity—meaning you can navigate life's darkest storms together because you subconsciously act as each other's emotional anchor and truest safe space.`)
           : (uiEx.bhakoot_det_inc || `Your Moon signs fall into a challenging angle. While you may project absolute stability to the outside world, internally there might be moments of profound emotional friction or a silent feeling of being unheard. This placement demands supreme transparency and choosing love over ego every single day.`);
       let bhakootDesc = `<strong style="color:var(--text-primary);">${bhStat}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${bhakootDetail}</span>`;

       // 8. Nadi (Max 8)
       const nadiMap = [0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2];
       let bNadi = nadiMap[boyNak]; let gNadi = nadiMap[girlNak];
       let nadiScore = (bNadi === gNadi) ? 0 : 8;
       let nStat = nadiScore === 8 ? (uiEx.m_nd_no_dosha || "Different Nadis — excellent for health and progeny.") : (uiEx.m_nd_dosha || `Both have {nadi} Nadi — Nadi Dosha detected`).replace('{nadi}', nadiNames[bNadi]);
       let nadiDetail = nadiScore === 8 
           ? (uiEx.nadi_det_exc || `Having different Nadis is considered a beautiful blessing in Vedic compatibility. It indicates that your biological and energetic life forces flow in a highly complementary manner, fostering robust physical health, genetic vitality, and a deep, sustaining energy between you two.`)
           : (uiEx.nadi_det_inc || `Sharing the exact same Nadi creates an energetic overload. While you may feel eerily similar to each other, this mirror effect can sometimes amplify each other's deep-seated anxieties and physiological stresses. Cultivating extreme patience and independent healing practices is necessary.`);
       let nadiDesc = `<strong style="color:var(--text-primary);">${nStat}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${nadiDetail}</span>`;

       let totalScore = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;
       
       return {
           varna: { max: 1, obt: varnaScore }, vashya: { max: 2, obt: vashyaScore },
           tara: { max: 3, obt: taraScore }, yoni: { max: 4, obt: yoniScore },
           maitri: { max: 5, obt: maitriScore }, gana: { max: 6, obt: ganaScore },
           bhakoot: { max: 7, obt: bhakootScore }, nadi: { max: 8, obt: nadiScore },
           total: totalScore,
           kootas: [
               { title: "1. Varna", sub: uiEx.k_sub_varna || "Spiritual compatibility & ego", max: 1, obt: varnaScore, desc: `${varnaDesc}` },
               { title: "2. Vashya", sub: uiEx.k_sub_vashya || "Mutual attraction & power", max: 2, obt: vashyaScore, desc: `${vashyaDesc}` },
               { title: "3. Tara", sub: uiEx.k_sub_tara || "Birth-star harmony & health", max: 3, obt: taraScore, desc: `${taraDesc}` },
               { title: "4. Yoni", sub: uiEx.k_sub_yoni || "Physical & sexual compatibility", max: 4, obt: yoniScore, desc: `${yoniDesc}` },
               { title: "5. Graha Maitri", sub: uiEx.k_sub_graha_maitri || "Mental & intellectual rapport", max: 5, obt: maitriScore, desc: `${maitriDesc}` },
               { title: "6. Gana", sub: uiEx.k_sub_gana || "Temperament archetype", max: 6, obt: ganaScore, desc: `${ganaDesc}` },
               { title: "7. Bhakoot", sub: uiEx.k_sub_bhakoot || "Emotional harmony & prosperity", max: 7, obt: bhakootScore, desc: `${bhakootDesc}` },
               { title: "8. Nadi", sub: uiEx.k_sub_nadi || "Health, genetics & progeny", max: 8, obt: nadiScore, desc: `${nadiDesc}` }
           ]
       };
    };

    const dashakootaCalculator = (boySign, boyNak, girlSign, girlNak, bName, gName) => {
       bName = (bName || "Boy").split(" ")[0]; gName = (gName || "Girl").split(" ")[0];
       const uiEx = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra) ? localizedParagraphs[currentLang].ui_extra : {};

       const yoniNames = [uiEx.yoni_horse||"Horse", uiEx.yoni_elephant||"Elephant", uiEx.yoni_sheep||"Sheep", uiEx.yoni_serpent||"Serpent", uiEx.yoni_dog||"Dog", uiEx.yoni_cat||"Cat", uiEx.yoni_rat||"Rat", uiEx.yoni_cow||"Cow", uiEx.yoni_buffalo||"Buffalo", uiEx.yoni_tiger||"Tiger", uiEx.yoni_deer||"Deer", uiEx.yoni_monkey||"Monkey", uiEx.yoni_mongoose||"Mongoose", uiEx.yoni_lion||"Lion"];
       const ganaNames = [uiEx.gana_deva||"Deva", uiEx.gana_manushya||"Manushya", uiEx.gana_rakshasa||"Rakshasa"];
       const rajjuNames = [uiEx.rajju_pada||"Pada", uiEx.rajju_kati||"Kati", uiEx.rajju_nabhi||"Nabhi", uiEx.rajju_kantha||"Kantha", uiEx.rajju_shiro||"Shiro"];

       // 1. Dina (Max 3)
       let distGtoB = (boyNak - girlNak + 27) % 27 + 1;
       let dinaScore = 0;
       if (distGtoB === 27 || distGtoB === 22) {
           dinaScore = 0; 
       } else if ([2, 4, 6, 8, 0].includes(distGtoB % 9)) {
           dinaScore = 3;
       }
       let dinStat = dinaScore === 3 ? (uiEx.d_stat_dina_good || "Auspicious Dina Koota.") : (uiEx.d_stat_dina_bad || "Inauspicious Dina Koota.");
       let dinaShort = (uiEx.d_dina_desc || `{status}`).replace('{status}', dinStat);
       let dinaDetail = dinaScore === 3 
           ? (uiEx.dina_det_exc || `A highly auspicious Dina Koota means your daily life rhythms effortlessly sync. You intuitively understand when your partner needs space and when they need support, making the mundane, day-to-day aspects of life feel deeply comforting rather than a chore.`)
           : (uiEx.dina_det_inc || `An inauspicious Dina Koota suggests that your daily routines and energy peaks may often clash. You might internally feel drained by each other's pacing at times. Consciously creating structured, independent 'me-time' will save the relationship from daily friction.`);
       let dinaDesc = `<strong style="color:var(--text-primary);">${dinaShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${dinaDetail}</span>`;

       // 2. Gana (Max 4)
       const ganaMap = [0,1,2,1,0,1,0,0,2,2,1,1,0,2,0,2,0,2,2,1,1,0,2,2,1,1,0];
       const dashakootaGanaTable = [[4, 0, 0], [4, 4, 2], [0, 0, 4]];
       let bGana = ganaMap[boyNak]; let gGana = ganaMap[girlNak];
       let ganaScore = dashakootaGanaTable[bGana][gGana];
       let gStat = ganaScore > 0 ? (uiEx.m_stat_harm || 'Harmonious temperament.') : (uiEx.m_stat_inharm || 'Incompatible temperament.');
       let ganaShort = (uiEx.m_gana_desc || `{bName}: {bGana}, {gName}: {gGana} — {status}`).replace('{bName}', bName).replace('{bGana}', ganaNames[bGana]).replace('{gName}', gName).replace('{gGana}', ganaNames[gGana]).replace('{status}', gStat);
       let ganaDetail = ganaScore === 4 
           ? (uiEx.gana_d_det_exc || `Sharing highly compatible archetypes, you approach life's challenges with the exact same core temperament. This shared energetic rhythm allows you to naturally sync your life goals and handle external stress beautifully without taking it out on each other.`)
           : (ganaScore > 0 ? (uiEx.gana_d_det_acc || `Your temperaments have differing base frequencies. One of you may be more grounded while the other is fiercely independent. Acknowledging this difference without trying to change or fix each other is the key to maintaining your relationship's harmony.`)
           : (uiEx.gana_d_det_inc || `There is a stark contrast between your core archetypes. Internally, you may often feel that your partner overreacts or underreacts to specific situations. Embracing this tension as a tool to expand your own perspective, rather than viewing it as a flaw, will bring immense maturity to the bond.`));
       let ganaDesc = `<strong style="color:var(--text-primary);">${ganaShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${ganaDetail}</span>`;

       // 3. Yoni (Max 4)
       const yoniNakMap = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];
       const yoniTable = [
           [ 4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1 ], [ 2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0 ],
           [ 2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1 ], [ 3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2 ],
           [ 2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1 ], [ 2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1 ],
           [ 2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2 ], [ 1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1 ],
           [ 0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1 ], [ 1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1 ],
           [ 3, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1 ], [ 3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2 ],
           [ 2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2 ], [ 1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4 ]
       ];
       let yoniScore = yoniTable[yoniNakMap[boyNak]][yoniNakMap[girlNak]];
       let yoniShort = (uiEx.d_yoni_desc || `{bName}: {bYoni}, {gName}: {gYoni}`).replace('{bName}', bName).replace('{bYoni}', yoniNames[yoniNakMap[boyNak]]).replace('{gName}', gName).replace('{gYoni}', yoniNames[yoniNakMap[girlNak]]);
       let yoniDetail = yoniScore >= 3 
           ? (uiEx.yoni_det_exc || `Your physical and psychological intimacy operates on a beautifully synchronized frequency. There is an unspoken, instinctive magnetism here that allows you to feel deeply secure, truly seen, and passionately connected on a primal level.`)
           : (yoniScore >= 2 ? (uiEx.yoni_d_det_acc || `You have a grounded and highly adaptable physical connection. While passion may naturally ebb and flow with life's external stresses, your underlying affection and willingness to respect each other's boundaries keeps your bond steady.`)
           : (uiEx.yoni_d_det_inc || `Your primal instincts operate on fundamentally different wavelengths. Outwardly you may try hard to align, but internally there can be moments of profound emotional or physical disconnect. Bridging this gap requires deep vulnerability and intense patience.`));
       let yoniDesc = `<strong style="color:var(--text-primary);">${yoniShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${yoniDetail}</span>`;

       // 4. Rashi (Max 7)
       let rashiDist = (girlSign - boySign + 12) % 12 + 1;
       let rashiScore = [2, 12, 5, 9, 6, 8].includes(rashiDist) ? 0 : 7;
       let rStat = rashiScore === 7 ? (uiEx.d_stat_rashi_good || "Compatible Rashi placement.") : (uiEx.d_stat_rashi_bad || "Incompatible Rashi alignment (Bhakoot Dosha).");
       let rashiShort = (uiEx.d_rashi_desc || `{status}`).replace('{status}', rStat);
       let rashiDetail = rashiScore === 7 
           ? (uiEx.bhakoot_det_exc || `Your Moon signs are placed in a highly supportive cosmic axis. This grants your relationship a profound emotional elasticity—meaning you can navigate life's darkest storms together because you subconsciously act as each other's emotional anchor and truest safe space.`)
           : (uiEx.bhakoot_det_inc || `Your Moon signs fall into a challenging angle. While you may project absolute stability to the outside world, internally there might be moments of profound emotional friction or a silent feeling of being unheard. This placement demands supreme transparency and choosing love over ego every single day.`);
       let rashiDesc = `<strong style="color:var(--text-primary);">${rashiShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${rashiDetail}</span>`;

       // 5. Rasyadhipati (Max 5)
       const signLords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
       const feelings = {
           "Sun": { "Moon":2, "Mars":2, "Jupiter":2, "Mercury":1, "Venus":0, "Saturn":0 },
           "Moon": { "Sun":2, "Mercury":2, "Mars":1, "Jupiter":1, "Venus":1, "Saturn":1 },
           "Mars": { "Sun":2, "Moon":2, "Jupiter":2, "Venus":1, "Saturn":1, "Mercury":0 },
           "Mercury": { "Sun":2, "Venus":2, "Mars":1, "Jupiter":1, "Saturn":1, "Moon":0 },
           "Jupiter": { "Sun":2, "Moon":2, "Mars":2, "Saturn":1, "Mercury":0, "Venus":0 },
           "Venus": { "Mercury":2, "Saturn":2, "Mars":1, "Jupiter":1, "Sun":0, "Moon":0 },
           "Saturn": { "Mercury":2, "Venus":2, "Jupiter":1, "Sun":0, "Moon":0, "Mars":0 }
       };
       let bLord = signLords[boySign - 1]; let gLord = signLords[girlSign - 1];
       let rasyadhipatiScore = 5;
       if (bLord !== gLord) {
           let f1 = feelings[bLord][gLord]; let f2 = feelings[gLord][bLord];
           let fSum = f1 + f2;
           if (fSum === 4) rasyadhipatiScore = 5; else if (fSum === 3) rasyadhipatiScore = 4;
           else if (fSum === 2) rasyadhipatiScore = (feelings[bLord][gLord] === 1 && feelings[gLord][bLord] === 1) ? 3 : 1;
           else if (fSum === 1) rasyadhipatiScore = 0.5; else rasyadhipatiScore = 0;
       }
       let raStat = rasyadhipatiScore >= 4 ? (uiEx.m_stat_comp || 'Compatible') : rasyadhipatiScore >= 3 ? (uiEx.m_stat_neut || 'Neutral') : (uiEx.m_stat_inim || 'Inimical');
       const getLocalPlanetNames = (abbr) => { return getLocalPlanet(abbr.substring(0,3)); };
       let rasyadhipatiShort = (uiEx.d_rasyadhipati_desc || `{bName}'s Lord: {bLord}, {gName}'s Lord: {gLord}. {status}`).replace('{bName}', bName).replace('{bLord}', getLocalPlanetNames(bLord)).replace('{gName}', gName).replace('{gLord}', getLocalPlanetNames(gLord)).replace('{status}', raStat);
       let rasyadhipatiDetail = rasyadhipatiScore >= 4 
           ? (uiEx.maitri_det_exc || `Your ruling planets are celestial friends. This translates into a beautiful, effortless intellectual friendship. You naturally understand each other's worldviews, making your communication a safe haven where you can completely unmask and be your authentic selves.`)
           : (rasyadhipatiScore >= 3 ? (uiEx.maitri_det_acc || `With neutral planetary rulers, your intellectual dynamic is highly balanced. You don't always agree, but you both possess the rare maturity to respect your differences, offering a healthy space for individual thoughts to coexist peacefully.`)
           : (uiEx.maitri_det_inc || `Your core planetary frequencies often clash, meaning you perceive the world through fundamentally different lenses. While this can cause misunderstandings, it also offers a profound opportunity to learn a completely new way of thinking if you practice radical, non-judgmental empathy.`));
       let rasyadhipatiDesc = `<strong style="color:var(--text-primary);">${rasyadhipatiShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${rasyadhipatiDetail}</span>`;

       // 6. Rajju (Max 5)
       const rajjuMap = [0,1,2,3,4, 3,2,1,0, 0,1,2,3,4, 3,2,1,0, 0,1,2,3,4, 3,2,1,0];
       let bRajju = rajjuMap[boyNak]; let gRajju = rajjuMap[girlNak];
       let rajjuScore = (bRajju === gRajju) ? 0 : 5;
       let rjStat = rajjuScore === 5 ? (uiEx.d_stat_rajju_good || 'Different Rajju, highly favorable.') : (uiEx.d_stat_rajju_bad || 'Same Rajju implies Dosha.');
       let rajjuShort = (uiEx.d_rajju_desc || `{bName}: {bRajju}, {gName}: {gRajju}. {status}`).replace('{bName}', bName).replace('{bRajju}', rajjuNames[bRajju]).replace('{gName}', gName).replace('{gRajju}', rajjuNames[gRajju]).replace('{status}', rjStat);
       let rajjuDetail = rajjuScore === 5 
           ? (uiEx.rajju_det_exc || `Falling in different Rajju categories is a profound astrological blessing. It structurally weaves a protective shield around your bond, indicating long-lasting companionship, mutual protection, and an enduring sense of physical and emotional safety throughout your lives.`)
           : (uiEx.rajju_det_inc || `Sharing the exact same Rajju points to a cosmic vulnerability. While you may feel intensely bound to each other, this placement asks you to be fiercely protective of your mutual well-being and health, consciously avoiding reckless life choices together.`);
       let rajjuDesc = `<strong style="color:var(--text-primary);">${rajjuShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${rajjuDetail}</span>`;

       // 7. Vedha (Max 2)
       const isVedha = (b, g) => {
           const pairs = [[0,17], [1,16], [2,15], [3,14], [5,21], [6,20], [7,19], [8,18], [9,26], [10,25], [11,24], [12,23]];
           for (let p of pairs) { if ((p[0]===b && p[1]===g) || (p[0]===g && p[1]===b)) return true; }
           if ([4,13,22].includes(b) && [4,13,22].includes(g) && b !== g) return true;
           return false;
       };
       let vedhaScore = isVedha(boyNak, girlNak) ? 0 : 2;
       let vdStat = vedhaScore === 2 ? (uiEx.d_stat_vedha_good || "No Vedha Dosha detected.") : (uiEx.d_stat_vedha_bad || "Vedha Dosha detected. Stars afflict each other.");
       let vedhaShort = (uiEx.d_vedha_desc || `{status}`).replace('{status}', vdStat);
       let vedhaDetail = vedhaScore === 2 
           ? (uiEx.vedha_det_exc || `The absence of Vedha Dosha means your birth stars do not project obstructing energies towards each other. This clears the path for a relationship free from inexplicable, deep-rooted psychological blockages, allowing your love to flow without unseen barriers.`)
           : (uiEx.vedha_det_inc || `Vedha Dosha acts as a hidden energetic wall. Outwardly you may try hard, but internally you might frequently encounter sudden, frustrating blockages or a feeling of being 'stuck'. Overcoming this requires immense spiritual maturity and refusing to let external stress infiltrate your bond.`);
       let vedhaDesc = `<strong style="color:var(--text-primary);">${vedhaShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${vedhaDetail}</span>`;

       // 8. Vashya (Max 2)
       const vashyaMapDash = [0, 0, 1, 2, 3, 1, 1, 4, 0, 2, 1, 2];
       const vashyaTableDash = [ [2,1,1,0.5,1], [1,2,0.5,0,1], [1,0.5,2,1,1], [0.5,0,1,2,0], [1,1,1,0,2] ];
       let bVashyaD = vashyaMapDash[boySign - 1]; let gVashyaD = vashyaMapDash[girlSign - 1];
       let vashyaScore = vashyaTableDash[bVashyaD][gVashyaD];
       let vashyaShort = uiEx.d_vashya_desc || `Mutual attraction and magnetic control between signs.`;
       let vashyaDetail = vashyaScore === 2 
           ? (uiEx.vashya_d_det_exc || `You possess a fine attuning of each other's subconscious mind. Even in silence, there is a powerful magnetic attraction that naturally pulls you back together, making your loyalty feel entirely effortless.`)
           : (vashyaScore > 0 ? (uiEx.vashya_d_det_acc || `With this alignment, there is a balanced, steady magnetic pull. You both fiercely guard your independence, yet there is an underlying current of empathy that binds you during challenging moments.`)
           : (uiEx.vashya_d_det_inc || `This combination brings an intense, undeniable polarity. You may outwardly appear to clash in how you assert control, but this friction actually serves as a powerful mirror, turning your relationship into an intense catalyst for personal growth.`));
       let vashyaDesc = `<strong style="color:var(--text-primary);">${vashyaShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${vashyaDetail}</span>`;

       // 9. Mahendra (Max 2)
       let mahendraScore = [4, 7, 10, 13, 16, 19, 22, 25].includes(distGtoB) ? 2 : 0;
       let mhStat = mahendraScore === 2 ? (uiEx.d_stat_mah_good || "Excellent for well-being and longevity.") : (uiEx.d_stat_mah_bad || "Mahendra Koota is not present.");
       let mahendraShort = (uiEx.d_mahendra_desc || `{status}`).replace('{status}', mhStat);
       let mahendraDetail = mahendraScore === 2 
           ? (uiEx.mahendra_det_exc || `The presence of Mahendra Koota is a beautiful indicator of mutual growth. It subtly infuses the relationship with a shared, almost relentless drive for prosperity, well-being, and family expansion, creating a deeply fulfilling sense of progressing through life as an unstoppable team.`)
           : (uiEx.mahendra_det_inc || `The absence of Mahendra Koota implies that material and family growth will require deliberate, conscious effort rather than relying on sheer luck. You will need to actively nurture your shared goals and intentionally choose not to take your combined successes for granted.`);
       let mahendraDesc = `<strong style="color:var(--text-primary);">${mahendraShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${mahendraDetail}</span>`;

       // 10. Stree-Deergha (Max 2)
       let streeScore = distGtoB >= 14 ? 2 : 0;
       let stStat = streeScore === 2 ? (uiEx.d_stat_stree_good || "Highly favorable distance.") : (uiEx.d_stat_stree_bad || "Close distance, less favorable.");
       let streeShort = (uiEx.d_stree_desc || `{bName}'s star is {dist} positions away from {gName}'s. {status}`).replace('{bName}', bName).replace('{dist}', toNativeNum(distGtoB, currentLang)).replace('{gName}', gName).replace('{status}', stStat);
       let streeDetail = streeScore === 2 
           ? (uiEx.stree_det_exc || `A highly favorable distance between your stars suggests a relationship built on profound, unshakeable mutual respect. It naturally cultivates an environment where both partners feel truly valued, paving the way for long-term emotional and material prosperity.`)
           : (uiEx.stree_det_inc || `The close proximity of your birth stars can sometimes create a claustrophobic energy. You might occasionally feel that your individual identities blur too much into each other. Maintaining healthy boundaries and independent passions is crucial for your long-term happiness.`);
       let streeDesc = `<strong style="color:var(--text-primary);">${streeShort}</strong><br><span style="font-size:0.88rem; color:#4B5563; font-weight:500; display:block; margin-top:6px; line-height:1.6;">${streeDetail}</span>`;

       let totalScore = dinaScore + ganaScore + yoniScore + rashiScore + rasyadhipatiScore + rajjuScore + vedhaScore + vashyaScore + mahendraScore + streeScore;

       return {
           total: totalScore,
           kootas: [
               { title: "1. Dina", sub: uiEx.k_sub_dina || "Health and longevity", max: 3, obt: dinaScore, desc: `${dinaDesc}` },
               { title: "2. Gana", sub: uiEx.k_sub_gana || "Temperament & nature", max: 4, obt: ganaScore, desc: `${ganaDesc}` },
               { title: "3. Yoni", sub: uiEx.k_sub_yoni || "Physical compatibility", max: 4, obt: yoniScore, desc: `${yoniDesc}` },
               { title: "4. Rashi", sub: uiEx.k_sub_rashi || "Emotional harmony", max: 7, obt: rashiScore, desc: `${rashiDesc}` },
               { title: "5. Rasyadhipati", sub: uiEx.k_sub_rasyadhipati || "Mental rapport", max: 5, obt: rasyadhipatiScore, desc: `${rasyadhipatiDesc}` },
               { title: "6. Rajju", sub: uiEx.k_sub_rajju || "Duration of married life", max: 5, obt: rajjuScore, desc: `${rajjuDesc}` },
               { title: "7. Vedha", sub: uiEx.k_sub_vedha || "Mutual afflictions", max: 2, obt: vedhaScore, desc: `${vedhaDesc}` },
               { title: "8. Vashya", sub: uiEx.k_sub_vashya || "Mutual attraction", max: 2, obt: vashyaScore, desc: `${vashyaDesc}` },
               { title: "9. Mahendra", sub: uiEx.k_sub_mahendra || "Well-being & wealth", max: 2, obt: mahendraScore, desc: `${mahendraDesc}` },
               { title: "10. Stree-Deergha", sub: uiEx.k_sub_stree_deergha || "Overall prosperity", max: 2, obt: streeScore, desc: `${streeDesc}` }
           ]
       };
   };



   window.currentMatchPerson = 'native';

   window.setMatchChartPerson = function(person) {
       window.currentMatchPerson = person;
       const btnNative = document.getElementById("btnMatchNative");
       const btnPartner = document.getElementById("btnMatchPartner");
       
       const activeBg = "linear-gradient(135deg, #FF6B00 0%, #F43F5E 100%)";
       const inactiveBg = "transparent";
       
       if (person === 'native') {
           btnNative.style.background = activeBg; btnNative.style.color = "#FFFFFF"; btnNative.style.boxShadow = "0 3px 8px rgba(244, 63, 94, 0.3)"; btnNative.style.fontWeight = "800";
           btnPartner.style.background = inactiveBg; btnPartner.style.color = "#6B7280"; btnPartner.style.boxShadow = "none"; btnPartner.style.fontWeight = "700";
       } else {
           btnPartner.style.background = activeBg; btnPartner.style.color = "#FFFFFF"; btnPartner.style.boxShadow = "0 3px 8px rgba(244, 63, 94, 0.3)"; btnPartner.style.fontWeight = "800";
           btnNative.style.background = inactiveBg; btnNative.style.color = "#6B7280"; btnNative.style.boxShadow = "none"; btnNative.style.fontWeight = "700";
       }
       window.renderMatchChart();
   };

   window.renderMatchChart = function() {
       const containerId = "matchDynamicChartContainer";
       const container = document.getElementById(containerId);
       if (!container) return; // CRITICAL: Prevent crash if Matchmaking mode is not yet initialized

       const chartType = document.getElementById("matchChartSelector") ? document.getElementById("matchChartSelector").value : "D1";
       const dataObj = window.currentMatchPerson === 'native' ? window.nativeChartsData : window.partnerChartsData;
       if (!dataObj || !dataObj[chartType]) return;

       const lagna = dataObj[chartType].lagna;
       const planets = dataObj[chartType].planets;

       window.currentRenderedPlanets = dataObj[chartType].planets;
       window.currentRenderedLagna = dataObj[chartType].lagna;

       container.innerHTML = '';
       if (currentChartStyle === "north") renderNorthChart(containerId, planets, lagna);
       else if (currentChartStyle === "south") renderSouthChart(containerId, planets, lagna);
       else if (currentChartStyle === "east") renderEastChart(containerId, planets, lagna);
       else if (currentChartStyle === "west") renderWestChart(containerId, planets, lagna);
   };


// XSS ସୁରକ୍ଷା କବଚ (Security Helper function to clean bad inputs)
      function escapeHtml(str) {
        return String(str ?? "").replace(/[&<>"']/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
      }

      // URL Data Sharing disabled during development stage to avoid localhost/file origin errors
      window.getAppShareUrl = function() {
          return null;
      };

      window.shareKundliLink = function() {
          return;
      };

      function calculateKundli() {
        const btn = document.getElementById("calculateBtn");
        btn.classList.add("loading");
        btn.disabled = true;

        const status = document.getElementById("calcStatus");
        status.textContent = "⏳ Calculating planetary positions...";
        status.classList.add("visible");

        setTimeout(() => {
          try {
            // Input ଗୁଡ଼ିକୁ escapeHtml ଦ୍ୱାରା ସୁରକ୍ଷିତ କରାଗଲା
            const name = escapeHtml(document.getElementById("nativeName").value || "Native");
            const gender = document.getElementById("gender").value;
            const calendar = document.getElementById("calendar").value;
            const dateStr = document.getElementById("birthDate").value;
            const timeStr = document.getElementById("birthTime").value;
            const city = escapeHtml(document.getElementById("birthCity").value);
            const state = escapeHtml(document.getElementById("birthState").value);
            const country = escapeHtml(document.getElementById("birthCountry").value);
            const place =
              [city, state, country].filter(Boolean).join(", ") || "Unknown";
            const latitude =
              parseFloat(document.getElementById("latitude").value) || 0;
            const longitude =
              parseFloat(document.getElementById("longitude").value) || 0;
            let olsonTz = document.getElementById("olsonTimezone").value || "Asia/Kolkata";
            // Ultimate IANA Timezone Engine Directive: Always use resolveTimezoneOffset
            // completely ignoring any manually edited floats or UI overrides
            let resolvedTz = resolveTimezoneOffset(dateStr, timeStr, olsonTz);
            let timezone = 5.5;
            let tzStrDisplay = "+05:30";
            
            if (resolvedTz) {
                timezone = resolvedTz.val;
                tzStrDisplay = resolvedTz.str;
                document.getElementById("timezone").value = tzStrDisplay; // Reflect resolved timezone accurately in UI
            } else {
                // Fallback only if Intl fails completely
                tzStrDisplay = document.getElementById("timezone").value || "+05:30";
                let tzSign = tzStrDisplay.startsWith("-") ? -1 : 1;
                let tzParts = tzStrDisplay.replace(/[-+]/, "").split(":");
                let tzDec = parseFloat(tzParts[0] || 0) + parseFloat(tzParts[1] || 0) / 60.0;
                timezone = tzSign * tzDec;
            }
            const ayanamsaSystem = document.getElementById("ayanamsa").value;

            const [year, month, day] = dateStr.split("-").map(Number);
            const timeParts = timeStr.split(":").map(Number);
            const hour = timeParts[0] || 0;
            const minute = timeParts[1] || 0;
            const second = timeParts[2] || 0;
            
const jd = calculateJulianDay(
              year,
              month,
              day,
              hour,
              minute,
              second,
              timezone,
              calendar,
            );
            const ayanamsa = getAyanamsa(jd, ayanamsaSystem);

            status.textContent = `📅 Julian Day: ${jd.toFixed(4)}, Ayanamsa: ${ayanamsa.toFixed(4)}°`;

            const tropicalPositions = {
              sun: calculateSunPosition(jd, (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              moon: calculateMoonPosition(jd, (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              mars: calculatePlanetPosition(jd, "mars", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              mercury: calculatePlanetPosition(jd, "mercury", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              jupiter: calculatePlanetPosition(jd, "jupiter", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              venus: calculatePlanetPosition(jd, "venus", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              saturn: calculatePlanetPosition(jd, "saturn", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              uranus: calculatePlanetPosition(jd, "uranus", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              neptune: calculatePlanetPosition(jd, "neptune", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              pluto: calculatePlanetPosition(jd, "pluto", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              rahu: calculateRahuPosition(jd),
              ascendant: calculateAscendant(jd, latitude, longitude, timezone),
            };

            const siderealPositions = {};
            for (const [key, value] of Object.entries(tropicalPositions)) {
              siderealPositions[key] = normalizeAngle(value - ayanamsa);
            }

            siderealPositions.ketu = normalizeAngle(
              siderealPositions.rahu + 180,
            );
            globalSiderealPositions = siderealPositions;

            // Calculate speeds for retrograde logic (Using +0.005 days / ~7 mins to detect exact minute stationary turning points)
            const tropicalPositionsNext = {
              sun: calculateSunPosition(jd + 0.005, (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              moon: calculateMoonPosition(jd + 0.005, (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              mars: calculatePlanetPosition(jd + 0.005, "mars", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              mercury: calculatePlanetPosition(jd + 0.005, "mercury", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              jupiter: calculatePlanetPosition(jd + 0.005, "jupiter", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              venus: calculatePlanetPosition(jd + 0.005, "venus", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              saturn: calculatePlanetPosition(jd + 0.005, "saturn", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              uranus: calculatePlanetPosition(jd + 0.005, "uranus", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              neptune: calculatePlanetPosition(jd + 0.005, "neptune", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
              pluto: calculatePlanetPosition(jd + 0.005, "pluto", (typeof latitude === "number" ? latitude : (typeof _lat !== "undefined" ? _lat : 0)), (typeof longitude === "number" ? longitude : (typeof _lng !== "undefined" ? _lng : 0))),
            };

            const isRetrogradeMap = {
              Sun: false,
              Moon: false,
              Rah: true,
              Ket: true
            };
            
            const sunLon = siderealPositions.sun;

            // Define Combust thresholds
            const combustThresholds = {
              Moon: 12,
              Mar: 17,
              Mer: 14, // 12 if retrograde
              Jup: 11,
              Ven: 10, // 8 if retrograde
              Sat: 15
            };

            const getAngularDistance = (lon1, lon2) => {
              let dist = Math.abs(lon1 - lon2);
              if (dist > 180) dist = 360 - dist;
              return dist;
            };

            lagnaSign = getSignFromLongitude(siderealPositions.ascendant);

            d1Planets = [];

            const planetMapping = [
              { abbr: "Sun", key: "sun" },
              { abbr: "Moon", key: "moon" },
              { abbr: "Mar", key: "mars" },
              { abbr: "Mer", key: "mercury" },
              { abbr: "Jup", key: "jupiter" },
              { abbr: "Ven", key: "venus" },
              { abbr: "Sat", key: "saturn" },
              { abbr: "Rah", key: "rahu" },
              { abbr: "Ket", key: "ketu" },
            ];

            planetMapping.forEach(({ abbr, key }) => {
              const lon = siderealPositions[key];
              const sign = getSignFromLongitude(lon);
              const degree = getDegreeInSign(lon);
              const { nakshatra, pada } = getNakshatraFromLongitude(lon);
              const status = getPlanetStatus(abbr, sign);
              const def = planetDefs[abbr];
              
              let isRetrograde = false;
              if (isRetrogradeMap[abbr] !== undefined) {
                  isRetrograde = isRetrogradeMap[abbr];
              } else if (tropicalPositionsNext[key] !== undefined) {
                  let diff = tropicalPositionsNext[key] - tropicalPositions[key];
                  if (diff < -180) diff += 360;
                  if (diff > 180) diff -= 360;
                  isRetrograde = diff < 0;
              }

              let isCombust = false;
              if (combustThresholds[abbr] !== undefined) {
                  let threshold = combustThresholds[abbr];
                  if (isRetrograde) {
                      if (abbr === "Mer") threshold = 12;
                      if (abbr === "Ven") threshold = 8;
                  }
                  if (getAngularDistance(lon, sunLon) <= threshold) {
                      isCombust = true;
                  }
              }

              // Awastha logic
              let awastha = "-";
              const noAwasthaPlanets = []; // Universally apply awastha to all bodies including outer planets
              if (!noAwasthaPlanets.includes(abbr)) {
                  const isOddSign = (sign % 2 !== 0);
                  const degInt = Math.floor(degree);
                  if (isOddSign) {
                      if (degInt < 6) awastha = "Bala";
                      else if (degInt < 12) awastha = "Kumara";
                      else if (degInt < 18) awastha = "Yuva";
                      else if (degInt < 24) awastha = "Vriddha";
                      else awastha = "Mrit";
                  } else {
                      if (degInt < 6) awastha = "Mrit";
                      else if (degInt < 12) awastha = "Vriddha";
                      else if (degInt < 18) awastha = "Yuva";
                      else if (degInt < 24) awastha = "Kumara";
                      else awastha = "Bala";
                  }
              }

              const signLord = zodiacSigns[sign - 1].ruler;
              const nakLord = nakshatra.ruler;
              const house = getHouseFromSign(sign, lagnaSign);

              d1Planets.push({
                abbr,
                name: def.name,
                sanskrit: def.sanskrit,
                sign,
                longitude: lon,
                degree,
                nakshatra: nakshatra.name,
                pada,
                status,
                color: def.color,
                isRetrograde,
                isCombust,
                awastha,
                signLord,
                nakLord,
                house
              });
            });

            // Matchmaking Calculation starts here
            // Partner Calculation
            const pCalendar = document.getElementById("partnerCalendar") ? document.getElementById("partnerCalendar").value : "gregorian";
            const pDateStr = document.getElementById("partnerBirthDate").value;
            const pTimeStr = document.getElementById("partnerBirthTime").value;
                const pGender = document.getElementById("partnerGender").value;
                const pLat = parseFloat(document.getElementById("partnerLatitude").value) || 0;
                const pLng = parseFloat(document.getElementById("partnerLongitude").value) || 0;
                let pOlsonTz = document.getElementById("partnerOlsonTimezone").value || "Asia/Kolkata";
                let pResolvedTz = resolveTimezoneOffset(pDateStr, pTimeStr, pOlsonTz);
                let pTimezone = 5.5;
                if (pResolvedTz) pTimezone = pResolvedTz.val;
                
                const [py, pm, pd] = pDateStr.split("-").map(Number);
                const [ph, pmin, ps] = pTimeStr.split(":").map(Number);
                const pJd = calculateJulianDay(py, pm, pd, ph || 0, pmin || 0, ps || 0, pTimezone, pCalendar);
                const pAyanamsa = getAyanamsa(pJd, ayanamsaSystem);
                const pMoonTrop = calculateMoonPosition(pJd, pLat, pLng);
                const pMoonSidereal = normalizeAngle(pMoonTrop - pAyanamsa);
                const pMoonSign = getSignFromLongitude(pMoonSidereal);
                const pMoonNakIndex = Math.floor(pMoonSidereal / (360 / 27));

                // Native values are in outer scope: siderealPositions.moon, etc.
                const nMoonSign = getSignFromLongitude(siderealPositions.moon);
                const nMoonNakIndex = Math.floor(siderealPositions.moon / (360 / 27));
                const nGender = gender;
                const pNameLocal = document.getElementById("partnerName").value || "Partner";

                // FEATURE: Dynamic Gender Name Mapping
                let boySign, boyNakIndex, girlSign, girlNakIndex, boyName, girlName;
                if (nGender === "male" && pGender === "female") {
                    boySign = nMoonSign; boyNakIndex = nMoonNakIndex; boyName = name;
                    girlSign = pMoonSign; girlNakIndex = pMoonNakIndex; girlName = pNameLocal;
                } else if (nGender === "female" && pGender === "male") {
                    girlSign = nMoonSign; girlNakIndex = nMoonNakIndex; girlName = name;
                    boySign = pMoonSign; boyNakIndex = pMoonNakIndex; boyName = pNameLocal;
                } else {
                    // Default fallback
                    boySign = nMoonSign; boyNakIndex = nMoonNakIndex; boyName = name;
                    girlSign = pMoonSign; girlNakIndex = pMoonNakIndex; girlName = pNameLocal;
                }

                // Calculate Partner's Sun and Ascendant
                const pSunTrop = calculateSunPosition(pJd, pLat, pLng);
                const pSunSidereal = normalizeAngle(pSunTrop - pAyanamsa);
                const pSunSign = getSignFromLongitude(pSunSidereal);
                
                const pAscendantTrop = calculateAscendant(pJd, pLat, pLng, pTimezone);
                const pAscendantSidereal = normalizeAngle(pAscendantTrop - pAyanamsa);
                const pAscendantSign = getSignFromLongitude(pAscendantSidereal);
                
                // Calculate Partner's Panchang
                const pPanchang = calculatePanchang(pJd, pMoonSidereal, pSunSidereal, pDateStr, pLat, pLng, pTimezone, pTimeStr);
                
                // Calculate Native's Panchang
                const nMoonSidereal = siderealPositions.moon;
                const nSunSidereal = siderealPositions.sun;
                const panchang = calculatePanchang(jd, nMoonSidereal, nSunSidereal, dateStr, latitude, longitude, timezone, timeStr);

                // Get native's Sun sign (from existing siderealPositions)
                const nSunSign = getSignFromLongitude(siderealPositions.sun);

                // Calculate Partner's full planets
                const pTropicalPositions = {
                    sun: pSunTrop,
                    moon: pMoonTrop,
                    mars: calculatePlanetPosition(pJd, "mars", pLat, pLng),
                    mercury: calculatePlanetPosition(pJd, "mercury", pLat, pLng),
                    jupiter: calculatePlanetPosition(pJd, "jupiter", pLat, pLng),
                    venus: calculatePlanetPosition(pJd, "venus", pLat, pLng),
                    saturn: calculatePlanetPosition(pJd, "saturn", pLat, pLng),
                    rahu: calculateRahuPosition(pJd),
                    ascendant: pAscendantTrop
                };
                const pSiderealPositions = {};
                for (const [key, value] of Object.entries(pTropicalPositions)) {
                    pSiderealPositions[key] = normalizeAngle(value - pAyanamsa);
                }
                pSiderealPositions.ketu = normalizeAngle(pSiderealPositions.rahu + 180);

                // Complete Partner Calculation for Retrogrades and Outer Planets
                const pTropicalPositionsNext = {
                    sun: calculateSunPosition(pJd + 0.005, pLat, pLng),
                    moon: calculateMoonPosition(pJd + 0.005, pLat, pLng),
                    mars: calculatePlanetPosition(pJd + 0.005, "mars", pLat, pLng),
                    mercury: calculatePlanetPosition(pJd + 0.005, "mercury", pLat, pLng),
                    jupiter: calculatePlanetPosition(pJd + 0.005, "jupiter", pLat, pLng),
                    venus: calculatePlanetPosition(pJd + 0.005, "venus", pLat, pLng),
                    saturn: calculatePlanetPosition(pJd + 0.005, "saturn", pLat, pLng),
                    uranus: calculatePlanetPosition(pJd + 0.005, "uranus", pLat, pLng),
                    neptune: calculatePlanetPosition(pJd + 0.005, "neptune", pLat, pLng),
                    pluto: calculatePlanetPosition(pJd + 0.005, "pluto", pLat, pLng)
                };
                
                // Add outer planets to partner's sidereal positions if not present
                pSiderealPositions.uranus = normalizeAngle(pTropicalPositionsNext.uranus - pAyanamsa);
                pSiderealPositions.neptune = normalizeAngle(pTropicalPositionsNext.neptune - pAyanamsa);
                pSiderealPositions.pluto = normalizeAngle(pTropicalPositionsNext.pluto - pAyanamsa);

                let pD1Planets = [];
                const pPlanetMappingAll = [
                    { abbr: "Sun", key: "sun" }, { abbr: "Moon", key: "moon" }, { abbr: "Mar", key: "mars" },
                    { abbr: "Mer", key: "mercury" }, { abbr: "Jup", key: "jupiter" }, { abbr: "Ven", key: "venus" },
                    { abbr: "Sat", key: "saturn" }, { abbr: "Rah", key: "rahu" }, { abbr: "Ket", key: "ketu" },
                    { abbr: "Ura", key: "uranus" }, { abbr: "Nep", key: "neptune" }, { abbr: "Plu", key: "pluto" }
                ];

                pPlanetMappingAll.forEach(({ abbr, key }) => {
                    if (pSiderealPositions[key] === undefined) return;
                    const lon = pSiderealPositions[key];
                    const sign = getSignFromLongitude(lon);
                    const degree = getDegreeInSign(lon);
                    const { nakshatra, pada } = getNakshatraFromLongitude(lon);
                    
                    const def = planetDefs[abbr] || { name: key.charAt(0).toUpperCase() + key.slice(1), color: "#333" };
                    const status = getPlanetStatus(abbr, sign);
                    const house = getHouseFromSign(sign, pAscendantSign);

                    let isRetrograde = false;
                    if (isRetrogradeMap[abbr] !== undefined) {
                        isRetrograde = isRetrogradeMap[abbr];
                    } else if (pTropicalPositionsNext[key] !== undefined && pTropicalPositions[key] !== undefined) {
                        let diff = pTropicalPositionsNext[key] - pTropicalPositions[key];
                        if (diff < -180) diff += 360;
                        if (diff > 180) diff -= 360;
                        isRetrograde = diff < 0;
                    }

                    let isCombust = false;
                    if (combustThresholds[abbr] !== undefined) {
                        let threshold = combustThresholds[abbr];
                        if (isRetrograde) {
                            if (abbr === "Mer") threshold = 12;
                            if (abbr === "Ven") threshold = 8;
                        }
                        if (getAngularDistance(lon, pSiderealPositions.sun) <= threshold) {
                            isCombust = true;
                        }
                    }

                    let awastha = "-";
                    const isOddSign = (sign % 2 !== 0);
                    const degInt = Math.floor(degree);
                    if (["Sun","Moon","Mar","Mer","Jup","Ven","Sat","Rah","Ket"].includes(abbr)) {
                        if (isOddSign) {
                            if (degInt < 6) awastha = "Bala"; else if (degInt < 12) awastha = "Kumara"; else if (degInt < 18) awastha = "Yuva"; else if (degInt < 24) awastha = "Vriddha"; else awastha = "Mrit";
                        } else {
                            if (degInt < 6) awastha = "Mrit"; else if (degInt < 12) awastha = "Vriddha"; else if (degInt < 18) awastha = "Yuva"; else if (degInt < 24) awastha = "Kumara"; else awastha = "Bala";
                        }
                    }

                    pD1Planets.push({
                        abbr, name: def.name, sign, longitude: lon, degree, nakshatra: nakshatra.name, pada,
                        status, color: def.color, isRetrograde, isCombust, awastha,
                        signLord: zodiacSigns[sign - 1].ruler, nakLord: nakshatra.ruler, house
                    });
                });
                
                generateAllCharts(pSiderealPositions, pD1Planets, pAscendantSign);
                window.partnerChartsData = JSON.parse(JSON.stringify(allCharts));
                
                generateAllCharts(siderealPositions, d1Planets, lagnaSign); // Restore native
                window.nativeChartsData = JSON.parse(JSON.stringify(allCharts));

                
                // Get Zodiac Names helper
                const getZodiacName = (signIndex) => getLocalRashi(signIndex);

                const pName = escapeHtml(document.getElementById("partnerName").value || "Partner");
                const pCity = escapeHtml(document.getElementById("partnerBirthCity").value || "-");
                
                const fallbackUi = (langData[currentLang] && langData[currentLang].ui) ? langData[currentLang].ui : {};
                const cdnUi = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra) ? localizedParagraphs[currentLang].ui_extra : {};
                const locUiEx = Object.assign({}, fallbackUi, cdnUi);
                
                const locGenN = locUiEx["lbl_" + gender] || gender;
                const locGenP = locUiEx["lbl_" + pGender] || pGender;
                
                const getLocTithi = (tStr) => {
                    if(!tStr) return tStr;
                    const parts = tStr.split(" ");
                    if (parts.length > 1) {
                        const pakshaLocal = getLocalizedArrayItem('paksha', parts[0] === 'Shukla' ? 0 : (parts[0] === 'Krishna' ? 1 : -1), langData['en'].paksha) || parts[0];
                        const tIndex = langData['en'].tithis.indexOf(parts[1]);
                        const tLocal = getLocalizedArrayItem('tithis', tIndex, langData['en'].tithis) || parts[1];
                        return `${pakshaLocal} ${tLocal}`;
                    } else {
                        const tIndex = langData['en'].tithis.indexOf(tStr);
                        return tIndex !== -1 ? getLocalizedArrayItem('tithis', tIndex, langData['en'].tithis) : tStr;
                    }
                };

                const compareHtml = `
                    <div class="milan-compare-wrapper">
                        <table class="milan-compare-table">
                            <thead>
                                <tr>
                                    <th class="col-p1" style="text-transform: capitalize;">${locGenN}</th>
                                    <th class="col-label">${locUiEx.tab_birth || "Birth Details"}</th>
                                    <th class="col-p2" style="text-transform: capitalize;">${locGenP}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="col-p1">${name}</td>
                                    <td class="col-label">${locUiEx.lbl_name || "Name"}</td>
                                    <td class="col-p2">${pName}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${toNativeNum(dateStr, currentLang)}</td>
                                    <td class="col-label">${locUiEx.lbl_dob || "Birth Date"}</td>
                                    <td class="col-p2">${toNativeNum(pDateStr, currentLang)}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${toNativeNum(timeStr, currentLang)}</td>
                                    <td class="col-label">${locUiEx.lbl_tob || "Birth Time"}</td>
                                    <td class="col-p2">${toNativeNum(pTimeStr, currentLang)}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${city}</td>
                                    <td class="col-label">${locUiEx.lbl_pob || "Birth Place"}</td>
                                    <td class="col-p2">${pCity}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${getZodiacName(lagnaSign)}</td>
                                    <td class="col-label">${locUiEx.lbl_ascendant || "Ascendant (Lagna)"}</td>
                                    <td class="col-p2">${getZodiacName(pAscendantSign)}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${getZodiacName(nMoonSign)}</td>
                                    <td class="col-label">${locUiEx.lbl_moon_sign || "Moon Sign (Rashi)"}</td>
                                    <td class="col-p2">${getZodiacName(pMoonSign)}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${getLocalNakshatra(panchang.nakshatra)}</td>
                                    <td class="col-label">${locUiEx.lbl_nakshatra || "Nakshatra"}</td>
                                    <td class="col-p2">${getLocalNakshatra(pPanchang.nakshatra)}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${getZodiacName(nSunSign)}</td>
                                    <td class="col-label">${locUiEx.lbl_sun_sign || "Vedic Sun Sign"}</td>
                                    <td class="col-p2">${getZodiacName(pSunSign)}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${getLocTithi(panchang.tithi)}</td>
                                    <td class="col-label">${locUiEx.pan_tithi || "Tithi"}</td>
                                    <td class="col-p2">${getLocTithi(pPanchang.tithi)}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${getLocalKarana(panchang.karan)}</td>
                                    <td class="col-label">${locUiEx.pan_karan || "Karan"}</td>
                                    <td class="col-p2">${getLocalKarana(pPanchang.karan)}</td>
                                </tr>
                                <tr>
                                    <td class="col-p1">${getLocalYoga(panchang.yog)}</td>
                                    <td class="col-label">${locUiEx.pan_yog || "Yog"}</td>
                                    <td class="col-p2">${getLocalYoga(pPanchang.yog)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;

                // Calculate Native (Person 1) Extra Details
                const nMoonSignIdx = nMoonSign - 1;
                const nCharan = Math.floor((siderealPositions.moon % (13 + 1/3)) / (3 + 1/3)) + 1;
                const nVarna = getVarna(nMoonSignIdx);
                const nVashya = getVashya(nMoonSignIdx);
                const nYoni = yonis[nMoonNakIndex];
                const nGan = ganas[nMoonNakIndex];
                const nNadi = nadis[nMoonNakIndex];
                const nSignLord = zodiacSigns[nMoonSignIdx].ruler;
                const nNakLord = nakshatras[nMoonNakIndex].ruler;
                const nYunja = getYunja(nMoonNakIndex);
                const nTatva = tatvas[nMoonSignIdx];
                const nNameAlphabet = nakshatraSyllables[nMoonNakIndex][nCharan - 1];
                const nPaya = getPayaNakBased(nMoonNakIndex);

                // Calculate Partner (Person 2) Extra Details
                const pMoonSignIdx = pMoonSign - 1;
                const pCharan = Math.floor((pMoonSidereal % (13 + 1/3)) / (3 + 1/3)) + 1;
                const pVarna = getVarna(pMoonSignIdx);
                const pVashya = getVashya(pMoonSignIdx);
                const pYoni = yonis[pMoonNakIndex];
                const pGan = ganas[pMoonNakIndex];
                const pNadi = nadis[pMoonNakIndex];
                const pSignLord = zodiacSigns[pMoonSignIdx].ruler;
                const pNakLord = nakshatras[pMoonNakIndex].ruler;
                const pYunja = getYunja(pMoonNakIndex);
                const pTatva = tatvas[pMoonSignIdx];
                const pNameAlphabet = nakshatraSyllables[pMoonNakIndex][pCharan - 1];
                const pPaya = getPayaNakBased(pMoonNakIndex);

                const getLocItem = (type, val) => {
                    if(!val) return val;
                    const enArr = langData['en'][type];
                    if(!enArr) return val;
                    return getLocalizedArrayItem(type, enArr.indexOf(val), enArr) || val;
                };
                
                const loc_nVarna = getLocItem('varna', nVarna); const loc_pVarna = getLocItem('varna', pVarna);
                const loc_nVashya = getLocItem('vashya', nVashya); const loc_pVashya = getLocItem('vashya', pVashya);
                const loc_nYoni = getLocItem('yoni', nYoni); const loc_pYoni = getLocItem('yoni', pYoni);
                const loc_nGan = getLocItem('gana', nGan); const loc_pGan = getLocItem('gana', pGan);
                const loc_nNadi = getLocItem('nadi', nNadi); const loc_pNadi = getLocItem('nadi', pNadi);
                const loc_nYunja = getLocItem('yunja', nYunja); const loc_pYunja = getLocItem('yunja', pYunja);
                const loc_nTatva = getLocItem('tatva', nTatva); const loc_pTatva = getLocItem('tatva', pTatva);
                const loc_nPaya = getLocItem('paya', nPaya); const loc_pPaya = getLocItem('paya', pPaya);
                
                const loc_nNameAlphabet = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].syllables && localizedParagraphs[currentLang].syllables[nNameAlphabet]) ? localizedParagraphs[currentLang].syllables[nNameAlphabet] : nNameAlphabet;
                const loc_pNameAlphabet = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].syllables && localizedParagraphs[currentLang].syllables[pNameAlphabet]) ? localizedParagraphs[currentLang].syllables[pNameAlphabet] : pNameAlphabet;

                const basicAstroHtml = `
                    <div class="milan-compare-wrapper">
                        <table class="milan-compare-table">
                            <thead>
                                <tr>
                                    <th class="col-p1" style="text-transform: capitalize;">${locGenN}</th>
                                    <th class="col-label">${locUiEx.tab_astro || "Astro Details"}</th>
                                    <th class="col-p2" style="text-transform: capitalize;">${locGenP}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td class="col-p1">${loc_nVarna}</td><td class="col-label">${locUiEx.lbl_varna || "Varna"}</td><td class="col-p2">${loc_pVarna}</td></tr>
                                <tr><td class="col-p1">${loc_nVashya}</td><td class="col-label">${locUiEx.lbl_vashya || "Vashya"}</td><td class="col-p2">${loc_pVashya}</td></tr>
                                <tr><td class="col-p1">${loc_nYoni}</td><td class="col-label">${locUiEx.lbl_yoni || "Yoni"}</td><td class="col-p2">${loc_pYoni}</td></tr>
                                <tr><td class="col-p1">${loc_nGan}</td><td class="col-label">${locUiEx.lbl_gan || "Gan"}</td><td class="col-p2">${loc_pGan}</td></tr>
                                <tr><td class="col-p1">${loc_nNadi}</td><td class="col-label">${locUiEx.lbl_nadi || "Nadi"}</td><td class="col-p2">${loc_pNadi}</td></tr>
                                <tr><td class="col-p1">${getLocalPlanet(nSignLord.substring(0,3))}</td><td class="col-label">${locUiEx.lbl_sign_lord || "Sign Lord"}</td><td class="col-p2">${getLocalPlanet(pSignLord.substring(0,3))}</td></tr>
                                <tr><td class="col-p1">${getLocalNakshatra(panchang.nakshatra)}</td><td class="col-label">${locUiEx.lbl_nakshatra || "Nakshatra"}</td><td class="col-p2">${getLocalNakshatra(pPanchang.nakshatra)}</td></tr>
                                <tr><td class="col-p1">${getLocalPlanet(nNakLord.substring(0,3))}</td><td class="col-label">${locUiEx.lbl_nak_lord || "Nak Lord"}</td><td class="col-p2">${getLocalPlanet(pNakLord.substring(0,3))}</td></tr>
                                <tr><td class="col-p1">${toNativeNum(nCharan, currentLang)}</td><td class="col-label">${locUiEx.lbl_charan || "Charan"}</td><td class="col-p2">${toNativeNum(pCharan, currentLang)}</td></tr>
                                <tr><td class="col-p1">${getLocalYoga(panchang.yog)}</td><td class="col-label">${locUiEx.pan_yog || "Yog"}</td><td class="col-p2">${getLocalYoga(pPanchang.yog)}</td></tr>
                                <tr><td class="col-p1">${getLocalKarana(panchang.karan)}</td><td class="col-label">${locUiEx.pan_karan || "Karan"}</td><td class="col-p2">${getLocalKarana(pPanchang.karan)}</td></tr>
                                <tr><td class="col-p1">${getLocTithi(panchang.tithi)}</td><td class="col-label">${locUiEx.pan_tithi || "Tithi"}</td><td class="col-p2">${getLocTithi(pPanchang.tithi)}</td></tr>
                                <tr><td class="col-p1">${loc_nYunja}</td><td class="col-label">${locUiEx.lbl_yunja || "Yunja"}</td><td class="col-p2">${loc_pYunja}</td></tr>
                                <tr><td class="col-p1">${loc_nTatva}</td><td class="col-label">${locUiEx.lbl_tatva || "Tatva (Element)"}</td><td class="col-p2">${loc_pTatva}</td></tr>
                                <tr><td class="col-p1">${loc_nNameAlphabet}</td><td class="col-label">${locUiEx.lbl_name_letter || "Name Alphabet"}</td><td class="col-p2">${loc_pNameAlphabet}</td></tr>
                                <tr><td class="col-p1">${loc_nPaya}</td><td class="col-label">${locUiEx.lbl_paya_nak || "Paya (Metal)"}</td><td class="col-p2">${loc_pPaya}</td></tr>
                            </tbody>
                        </table>
                    </div>
                `;

                // --- PLANETARY POSITIONS COMPARISON GENERATION (PIXEL-PERFECT FROM SCREENSHOT) ---
                const planetAccentColors = {
                    Asc: "#0284C7",
                    Sun: "#EA580C",
                    Moon: "#0284C7",
                    Mar: "#DC2626",
                    Mer: "#059669",
                    Jup: "#D97706",
                    Ven: "#DB2777",
                    Sat: "#4F46E5",
                    Rah: "#7C3AED",
                    Ket: "#C2410C"
                };

                const getKarakaBadgesMap = (planetsArr) => {
                    const valid = planetsArr.filter(p => ["Sun", "Moon", "Mar", "Mer", "Jup", "Ven", "Sat"].includes(p.abbr));
                    const sorted = [...valid].sort((a, b) => b.degree - a.degree);
                    const kLabels = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];
                    const map = {};
                    sorted.forEach((p, i) => { map[p.abbr] = kLabels[i] || "K"; });
                    return map;
                };

                const nKarakas = getKarakaBadgesMap(d1Planets);
                const pKarakas = getKarakaBadgesMap(pD1Planets);

                const renderPlanetaryDetailCards = (planetsArr, ascLon, ascSign, karakasMap) => {
                    const ascDeg = getDegreeInSign(ascLon);
                    const ascNakInfo = getNakshatraFromLongitude(ascLon);
                    const ascSignName = getLocalRashi(ascSign);
                    const ascSignLord = getLocalPlanet(zodiacSigns[ascSign - 1].ruler.substring(0,3));
                    const ascNakName = getLocalNakshatra(ascNakInfo.nakshatra.name);
                    const ascNakLord = getLocalPlanet(ascNakInfo.nakshatra.ruler.substring(0,3));
                    const ascHouse = "01";
                    const ascPada = toNativeNum(String(ascNakInfo.pada).padStart(2, '0'), currentLang);

                    const lblAscendant = locUiEx.lbl_ascendant || "Ascendant";
                    const lblSignLord = locUiEx.lbl_sign_lord || "Sign Lord";
                    const lblNakshatra = locUiEx.lbl_nakshatra || "Nakshatra";
                    const lblNakLord = locUiEx.lbl_nak_lord || "Nak Lord";
                    const lblHouse = locUiEx.lbl_house || "House";
                    const lblNakPad = locUiEx.lbl_charan || "Nak Pad";
                    const lblRetrograde = locUiEx.retrograde || "Retrograde";
                    const lblCombust = locUiEx.combust || "Combust";
                    const lblState = locUiEx.lbl_state || "State";
                    const lblSign = locUiEx.lbl_sign || "Sign";

                    // 1. Ascendant Card (Closed by default with '-' badge and downward chevron)
                    let cardsHtml = `
                    <div class="planet-detail-card planet-accent-Asc">
                        <div class="planet-card-header" onclick="const g = this.nextElementSibling; const c = this.querySelector('.planet-chevron-btn'); if(g.style.display==='grid'){g.style.display='none'; c.style.transform='rotate(0deg)';}else{g.style.display='grid'; c.style.transform='rotate(180deg)';}">
                            <div>
                                <div class="planet-card-title-row">
                                    <span class="planet-card-name planet-name-Asc">${lblAscendant}</span>
                                    <span class="planet-deg-pill">${toNativeNum(formatDMS(ascDeg), currentLang)}</span>
                                </div>
                                <div class="planet-card-sub">${ascSignName} <span class="sub-sep">•</span> ${ascNakName}</div>
                            </div>
                            <div class="planet-card-actions">
                                <div class="planet-badge-circle badge-state">-</div>
                                <svg class="planet-chevron-btn" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                        <div class="planet-detail-grid" style="display: none;">
                            <div class="planet-grid-cell"><span class="planet-grid-label">${lblSignLord}</span><span class="planet-grid-value">${ascSignLord}</span></div>
                            <div class="planet-grid-cell"><span class="planet-grid-label">${lblNakshatra}</span><span class="planet-grid-value">${ascNakName}</span></div>
                            <div class="planet-grid-cell"><span class="planet-grid-label">${lblNakLord}</span><span class="planet-grid-value">${ascNakLord}</span></div>
                            <div class="planet-grid-cell"><span class="planet-grid-label">${lblHouse}</span><span class="planet-grid-value">${toNativeNum(ascHouse, currentLang)}</span></div>
                            <div class="planet-grid-cell"><span class="planet-grid-label">${lblNakPad}</span><span class="planet-grid-value">${ascPada}</span></div>
                            <div class="planet-grid-cell"><span class="planet-grid-label">${lblRetrograde}</span><span class="planet-grid-value">-</span></div>
                            <div class="planet-grid-cell"><span class="planet-grid-label">${lblCombust}</span><span class="planet-grid-value">-</span></div>
                            <div class="planet-grid-cell"><span class="planet-grid-label">${lblState}</span><span class="planet-grid-value">-</span></div>
                            <div class="planet-grid-cell"><span class="planet-grid-label">${lblSign}</span><span class="planet-grid-value">${ascSignName}</span></div>
                        </div>
                    </div>`;

                    // 2. Planets Cards (Sun through Ketu - Closed by default with C, R, and State badges)
                    planetsArr.forEach(p => {
                        const pName = getLocalPlanet(p.abbr);
                        const pSignName = getLocalRashi(p.sign);
                        const pNakName = getLocalNakshatra(p.nakshatra);
                        const pSignLord = getLocalPlanet(p.signLord.substring(0,3));
                        const pNakLord = getLocalPlanet(p.nakLord.substring(0,3));
                        const pHouse = toNativeNum(String(p.house).padStart(2, '0'), currentLang);
                        const pPada = toNativeNum(String(p.pada).padStart(2, '0'), currentLang);
                        const pDegStr = toNativeNum(formatDMS(p.degree), currentLang);

                        const retroVal = ["Sun", "Moon"].includes(p.abbr) ? "-" : (p.isRetrograde ? `<span style="color:#EF4444; font-weight:800;">${locUiEx.lbl_yes || "Yes"}</span>` : (locUiEx.lbl_no || "No"));
                        const combustVal = ["Sun", "Moon", "Rah", "Ket"].includes(p.abbr) ? "-" : (p.isCombust ? `<span style="color:#F59E0B; font-weight:800;">${locUiEx.lbl_yes || "Yes"}</span>` : "-");
                        const awasthaVal = p.awastha && p.awastha !== "-" ? p.awastha : "-";
                        
                        // Extract State initial (B, K, Y, V, M) exactly as shown in screenshot
                        const awasthaInitial = (p.awastha && p.awastha !== "-") ? p.awastha.charAt(0).toUpperCase() : "-";

                        // Combust 'C' badge (Grey circle)
                        const combustBadge = (!["Sun", "Moon", "Rah", "Ket"].includes(p.abbr) && p.isCombust)
                            ? `<div class="planet-badge-circle badge-combust" title="Combust (Asta)">C</div>`
                            : ``;

                        // Retrograde 'R' badge (Blue circle)
                        const retroBadge = (!["Sun", "Moon"].includes(p.abbr) && p.isRetrograde)
                            ? `<div class="planet-badge-circle badge-retro" title="Retrograde (Vakri)">R</div>`
                            : ``;

                        // State 'M / B / V / Y / K' badge (Cyan circle)
                        const stateBadge = `<div class="planet-badge-circle badge-state" title="State (Awastha): ${awasthaVal}">${awasthaInitial}</div>`;

                        cardsHtml += `
                        <div class="planet-detail-card planet-accent-${p.abbr}">
                            <div class="planet-card-header" onclick="const g = this.nextElementSibling; const c = this.querySelector('.planet-chevron-btn'); if(g.style.display==='grid'){g.style.display='none'; c.style.transform='rotate(0deg)';}else{g.style.display='grid'; c.style.transform='rotate(180deg)';}">
                                <div>
                                    <div class="planet-card-title-row">
                                        <span class="planet-card-name planet-name-${p.abbr}">${pName}</span>
                                        <span class="planet-deg-pill">${pDegStr}</span>
                                    </div>
                                    <div class="planet-card-sub">${pSignName} <span class="sub-sep">•</span> ${pNakName}</div>
                                </div>
                                <div class="planet-card-actions">
                                    ${combustBadge}
                                    ${retroBadge}
                                    ${stateBadge}
                                    <svg class="planet-chevron-btn" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                            <div class="planet-detail-grid" style="display: none;">
                                <div class="planet-grid-cell"><span class="planet-grid-label">${lblSignLord}</span><span class="planet-grid-value">${pSignLord}</span></div>
                                <div class="planet-grid-cell"><span class="planet-grid-label">${lblNakshatra}</span><span class="planet-grid-value">${pNakName}</span></div>
                                <div class="planet-grid-cell"><span class="planet-grid-label">${lblNakLord}</span><span class="planet-grid-value">${pNakLord}</span></div>
                                <div class="planet-grid-cell"><span class="planet-grid-label">${lblHouse}</span><span class="planet-grid-value">${pHouse}</span></div>
                                <div class="planet-grid-cell"><span class="planet-grid-label">${lblNakPad}</span><span class="planet-grid-value">${pPada}</span></div>
                                <div class="planet-grid-cell"><span class="planet-grid-label">${lblRetrograde}</span><span class="planet-grid-value">${retroVal}</span></div>
                                <div class="planet-grid-cell"><span class="planet-grid-label">${lblCombust}</span><span class="planet-grid-value">${combustVal}</span></div>
                                <div class="planet-grid-cell"><span class="planet-grid-label">${lblState}</span><span class="planet-grid-value">${awasthaVal}</span></div>
                                <div class="planet-grid-cell"><span class="planet-grid-label">${lblSign}</span><span class="planet-grid-value">${pSignName}</span></div>
                            </div>
                        </div>`;
                    });

                    return cardsHtml;
                };

                // 3. Comparison Table View (With Sign, Degrees, Sign Lord, Nakshatra, Nakshatra Lord, House)
                const renderPlanetaryComparisonTable = () => {
                    const aspectNames = {
                        1: "Conjunction (1-1)",
                        2: "Dwirdwadash (2-12)",
                        3: "Sextile (3-11)",
                        4: "Square (4-10)",
                        5: "Trine (5-9)",
                        6: "Shadashtak (6-8)",
                        7: "Opposition (7-7)",
                        8: "Shadashtak (8-6)",
                        9: "Trine (9-5)",
                        10: "Square (10-4)",
                        11: "Sextile (11-3)",
                        12: "Dwirdwadash (12-2)"
                    };

                    const lblSignLord = locUiEx.lbl_sign_lord || "Sign Lord";
                    const lblNakshatra = locUiEx.lbl_nakshatra || "Nakshatra";
                    const lblNakLord = locUiEx.lbl_nak_lord || "Nak Lord";
                    const lblHouse = locUiEx.lbl_house || "House";
                    const lblAscendant = locUiEx.lbl_ascendant || "Ascendant";

                    // Native Ascendant Data
                    const ascDeg = getDegreeInSign(siderealPositions.ascendant);
                    const ascNakInfo = getNakshatraFromLongitude(siderealPositions.ascendant);
                    const ascSignName = getLocalRashi(lagnaSign);
                    const ascSignLord = getLocalPlanet(zodiacSigns[lagnaSign - 1].ruler.substring(0,3));
                    const ascNakName = getLocalNakshatra(ascNakInfo.nakshatra.name);
                    const ascNakLord = getLocalPlanet(ascNakInfo.nakshatra.ruler.substring(0,3));
                    const ascHouse = "01";

                    // Partner Ascendant Data
                    const pAscDeg = getDegreeInSign(pAscendantSidereal);
                    const pAscNakInfo = getNakshatraFromLongitude(pAscendantSidereal);
                    const pAscSignName = getLocalRashi(pAscendantSign);
                    const pAscSignLord = getLocalPlanet(zodiacSigns[pAscendantSign - 1].ruler.substring(0,3));
                    const pAscNakName = getLocalNakshatra(pAscNakInfo.nakshatra.name);
                    const pAscNakLord = getLocalPlanet(pAscNakInfo.nakshatra.ruler.substring(0,3));
                    const pAscHouse = "01";

                    // Prepare unified list: Ascendant first, then Sun through Ketu
                    const compItems = [
                        {
                            abbr: "Asc",
                            name: lblAscendant,
                            color: planetAccentColors.Asc,
                            nSign: ascSignName,
                            nDeg: toNativeNum(formatDMS(ascDeg), currentLang),
                            nSignLord: ascSignLord,
                            nNak: ascNakName,
                            nNakLord: ascNakLord,
                            nHouse: toNativeNum(ascHouse, currentLang),
                            pSign: pAscSignName,
                            pDeg: toNativeNum(formatDMS(pAscDeg), currentLang),
                            pSignLord: pAscSignLord,
                            pNak: pAscNakName,
                            pNakLord: pAscNakLord,
                            pHouse: toNativeNum(pAscHouse, currentLang),
                            dist: (pAscendantSign - lagnaSign + 12) % 12 + 1
                        },
                        ...d1Planets.map(np => {
                            const pp = pD1Planets.find(x => x.abbr === np.abbr);
                            if (!pp) return null;
                            return {
                                abbr: np.abbr,
                                name: getLocalPlanet(np.abbr),
                                color: planetAccentColors[np.abbr] || "#FF6B00",
                                nSign: getLocalRashi(np.sign),
                                nDeg: toNativeNum(formatDMS(np.degree), currentLang),
                                nSignLord: getLocalPlanet(np.signLord.substring(0,3)),
                                nNak: getLocalNakshatra(np.nakshatra),
                                nNakLord: getLocalPlanet(np.nakLord.substring(0,3)),
                                nHouse: toNativeNum(String(np.house).padStart(2, '0'), currentLang),
                                pSign: getLocalRashi(pp.sign),
                                pDeg: toNativeNum(formatDMS(pp.degree), currentLang),
                                pSignLord: getLocalPlanet(pp.signLord.substring(0,3)),
                                pNak: getLocalNakshatra(pp.nakshatra),
                                pNakLord: getLocalPlanet(pp.nakLord.substring(0,3)),
                                pHouse: toNativeNum(String(pp.house).padStart(2, '0'), currentLang),
                                dist: (pp.sign - np.sign + 12) % 12 + 1
                            };
                        }).filter(Boolean)
                    ];

                    let rows = compItems.map(item => {
                        const asp = aspectNames[item.dist] || "-";
                        const aspColor = [1, 5, 9, 3, 11].includes(item.dist) ? "#059669" : ([6, 8, 2, 12].includes(item.dist) ? "#E11D48" : "#2563EB");

                        return `
                        <tr>
                            <td class="col-p1" style="text-align: left; vertical-align: top; font-weight: 800; color: ${item.color}; padding: 12px 10px;">
                                <div style="font-size: 0.95rem; font-family: var(--font-display);">${item.name}</div>
                            </td>
                            <td class="col-p1" style="text-align: left; vertical-align: top; padding: 10px 12px;">
                                <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
                                    <span style="font-weight: 800; font-size: 0.92rem; color: #111827;" class="cmp-val-txt">${item.nSign}</span>
                                    <span class="cmp-deg-pill" style="font-size: 0.72rem; font-weight: 700; color: #4B5563; background: #F3F4F6; padding: 1px 6px; border-radius: 4px; font-family: monospace;">${item.nDeg}</span>
                                </div>
                                <div class="cmp-sub-row"><span class="cmp-lbl-tag">${lblSignLord}:</span> <span class="cmp-val-txt">${item.nSignLord}</span></div>
                                <div class="cmp-sub-row"><span class="cmp-lbl-tag">${lblNakshatra}:</span> <span class="cmp-val-txt">${item.nNak}</span></div>
                                <div class="cmp-sub-row"><span class="cmp-lbl-tag">${lblNakLord}:</span> <span class="cmp-val-txt">${item.nNakLord}</span></div>
                                <div class="cmp-sub-row"><span class="cmp-lbl-tag">${lblHouse}:</span> <span class="cmp-val-txt" style="color: #B91C1C;">H${item.nHouse}</span></div>
                            </td>
                            <td class="col-p2" style="text-align: left; vertical-align: top; padding: 10px 12px;">
                                <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
                                    <span style="font-weight: 800; font-size: 0.92rem; color: #111827;" class="cmp-val-txt">${item.pSign}</span>
                                    <span class="cmp-deg-pill" style="font-size: 0.72rem; font-weight: 700; color: #4B5563; background: #F3F4F6; padding: 1px 6px; border-radius: 4px; font-family: monospace;">${item.pDeg}</span>
                                </div>
                                <div class="cmp-sub-row"><span class="cmp-lbl-tag">${lblSignLord}:</span> <span class="cmp-val-txt">${item.pSignLord}</span></div>
                                <div class="cmp-sub-row"><span class="cmp-lbl-tag">${lblNakshatra}:</span> <span class="cmp-val-txt">${item.pNak}</span></div>
                                <div class="cmp-sub-row"><span class="cmp-lbl-tag">${lblNakLord}:</span> <span class="cmp-val-txt">${item.pNakLord}</span></div>
                                <div class="cmp-sub-row"><span class="cmp-lbl-tag">${lblHouse}:</span> <span class="cmp-val-txt" style="color: #B91C1C;">H${item.pHouse}</span></div>
                            </td>
                            <td class="col-label" style="text-align: center; vertical-align: middle; padding: 8px 6px; color: ${aspColor}; font-weight: 800; font-size: 0.76rem; line-height: 1.35;">
                                ${asp}
                            </td>
                        </tr>`;
                    }).join('');

                    return `
                    <div class="milan-compare-wrapper">
                        <table class="milan-compare-table">
                            <thead>
                                <tr>
                                    <th class="col-p1" style="width: 14%; text-align: left; padding-left: 12px;">${locUiEx.tbl_planet || "Planet"}</th>
                                    <th class="col-p1" style="width: 36%; text-align: center;">${name}</th>
                                    <th class="col-p2" style="width: 36%; text-align: center;">${pName}</th>
                                    <th class="col-label" style="width: 14%; text-align: center;">Relationship</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>`;
                };

                const nativeCardsHtml = renderPlanetaryDetailCards(d1Planets, siderealPositions.ascendant, lagnaSign, nKarakas);
                const partnerCardsHtml = renderPlanetaryDetailCards(pD1Planets, pAscendantSidereal, pAscendantSign, pKarakas);
                const compareTableHtml = renderPlanetaryComparisonTable();

                const planetaryComparisonHtml = `
                    <div style="max-width: 850px; margin: 0 auto; font-family: var(--font-body); padding: 8px 0;">
                        <!-- Top Header Section (Pixel-Perfect from Screenshot) -->
                        <div style="margin-bottom: 14px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
                                <div style="width: 4px; height: 18px; background: #FF6B00; border-radius: 2px;"></div>
                                <h2 style="font-size: 1.22rem; font-weight: 800; font-family: var(--font-display); margin: 0; color: #111827; letter-spacing: -0.3px;">
                                    ${locUiEx.tab_planetary || "Planetary Positions"} <span style="color: #F43F5E;">and Details</span>
                                </h2>
                            </div>
                            <p style="font-size: 0.82rem; color: #6B7280; margin: 0 0 0 12px; font-weight: 500; line-height: 1.45;">
                                Planetary degrees, speed, nakshatra, sign and houses along with awastha are listed at the time of your birth.
                            </p>
                        </div>

                        <!-- 3-Way Switcher (Person 1 / Person 2 / Comparison Table) -->
                        <div class="chart-toggles" style="margin-bottom: 14px; background: rgba(243, 244, 246, 0.85); padding: 4px; border-radius: 99px;">
                            <button id="btnPlanetNative" onclick="setPlanetViewPerson('native')" class="btn-toggle active" style="flex: 1; padding: 7px 10px; border-radius: 99px; font-weight: 800; font-size: 0.8rem;">${name}</button>
                            <button id="btnPlanetPartner" onclick="setPlanetViewPerson('partner')" class="btn-toggle" style="flex: 1; padding: 7px 10px; border-radius: 99px; font-weight: 800; font-size: 0.8rem;">${pName}</button>
                            <button id="btnPlanetCompare" onclick="setPlanetViewPerson('compare')" class="btn-toggle" style="flex: 1; padding: 7px 10px; border-radius: 99px; font-weight: 800; font-size: 0.8rem;">⇄ Comparison</button>
                        </div>

                        <!-- Views -->
                        <div id="planetCardsNative" style="display: block;">
                            ${nativeCardsHtml}
                        </div>
                        <div id="planetCardsPartner" style="display: none;">
                            ${partnerCardsHtml}
                        </div>
                        <div id="planetComparisonTable" style="display: none;">
                            ${compareTableHtml}
                        </div>
                    </div>
                `;

                window.setPlanetViewPerson = function(mode) {
                    const btnN = document.getElementById("btnPlanetNative");
                    const btnP = document.getElementById("btnPlanetPartner");
                    const btnC = document.getElementById("btnPlanetCompare");
                    const viewN = document.getElementById("planetCardsNative");
                    const viewP = document.getElementById("planetCardsPartner");
                    const viewC = document.getElementById("planetComparisonTable");
                    if (!btnN || !btnP || !btnC) return;

                    btnN.classList.remove("active");
                    btnP.classList.remove("active");
                    btnC.classList.remove("active");

                    if (viewN) viewN.style.display = "none";
                    if (viewP) viewP.style.display = "none";
                    if (viewC) viewC.style.display = "none";

                    if (mode === "native") {
                        btnN.classList.add("active");
                        if (viewN) viewN.style.display = "block";
                    } else if (mode === "partner") {
                        btnP.classList.add("active");
                        if (viewP) viewP.style.display = "block";
                    } else {
                        btnC.classList.add("active");
                        if (viewC) viewC.style.display = "block";
                    }
                };



                const milanScore = ashtakootaCalculator(boySign, boyNakIndex, girlSign, girlNakIndex, boyName, girlName);
                
                // Hide normal UI and wipe Single Kundli memory to guarantee lag-free refresh
                document.getElementById("welcomeMessage").classList.add("hidden");


                // Build Matchmaking Dashboard
                let dashboard = document.getElementById("matchmakingDashboard");
                if (dashboard) {
                    dashboard.style.display = "block";
                dashboard.classList.add("visible");
                }

                let qualityBadge = ""; let qualityDesc = "";  // Default Red
                
                let lbl_exc_match = locUiEx.lbl_exc_match || "EXCELLENT MATCH";
                let desc_exc_match = locUiEx.desc_exc_match || "Score is highly favorable. This match indicates strong compatibility and mutual harmony.";
                let lbl_avg_match = locUiEx.lbl_avg_match || "ACCEPTABLE MATCH";
                let desc_avg_match = locUiEx.desc_avg_match || "Score is average. The match is acceptable, but requires effort and understanding in specific areas.";
                let lbl_poor_match = locUiEx.lbl_poor_match || "CHALLENGING MATCH";
                let desc_poor_match = locUiEx.desc_poor_match || "Score is below threshold. Requires deeper chart review.";
                let lbl_needs_attn = locUiEx.lbl_needs_attn || "Needs Attention";
                let lbl_excellent = locUiEx.lbl_excellent || "Excellent";
                let lbl_average = locUiEx.lbl_average || "Average";
                let lbl_gun_milan = locUiEx.lbl_gun_milan || "Gun Milan Score";
                let lbl_dashakoota = locUiEx.lbl_dashakoota || "Dashakoota Score";

   if (milanScore.total > 25) { 
       qualityBadge = `<div class='milan-badge milan-badge-good'>${lbl_exc_match}</div>`; 
       qualityDesc = desc_exc_match; 
       circleColor = "#10B981"; // Green
   } else if (milanScore.total >= 18) { 
       qualityBadge = `<div class='milan-badge milan-badge-avg'>${lbl_avg_match}</div>`; 
       qualityDesc = desc_avg_match; 
       circleColor = "#F59E0B"; // Yellow/Orange
   } else { 
       qualityBadge = `<div class='milan-badge milan-badge-poor'>${lbl_poor_match}</div>`; 
       qualityDesc = desc_poor_match; 
       circleColor = "#EF4444"; // Red
   }

   let kootasHtml = milanScore.kootas.map(k => {
       let ratio = k.obt / k.max;
       let themeClass = "koota-theme-zero";
       let badgeText = lbl_needs_attn;
       
       if (ratio === 1) {
           themeClass = "koota-theme-full";
           badgeText = lbl_excellent;
       } else if (ratio > 0) {
           themeClass = "koota-theme-partial";
           badgeText = lbl_average;
       }
       
       let rawTitle = k.title.replace(/^\d+\.\s*/, '');
       let locTitle = locUiEx["k_" + rawTitle.toLowerCase()] || rawTitle;
       let locSub = locUiEx["k_sub_" + rawTitle.toLowerCase()] || k.sub;

       return `
       <div class="koota-accordion ${themeClass}">
           <div class="koota-header" onclick="const body = this.nextElementSibling; const svg = this.querySelector('.koota-chevron'); if(body.classList.contains('active')){ body.classList.remove('active'); svg.style.transform='rotate(0deg)'; } else { body.classList.add('active'); svg.style.transform='rotate(180deg)'; }">
               <div class="koota-left">
                   <span class="koota-title">${locTitle}</span>
                   <span class="koota-badge">${badgeText}</span>
               </div>
               <div class="koota-points">
                   <span class="koota-score-text">${toNativeNum(k.obt, currentLang)}<span style="font-size:0.8rem; color:#9CA3AF;">/${toNativeNum(k.max, currentLang)}</span></span>
                   <div class="koota-mini-bar"><div class="koota-mini-bar-fill" style="width: ${(k.obt/k.max)*100}%;"></div></div>
                   <svg class="koota-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; transition: transform 0.2s ease;"><polyline points="6 9 12 15 18 9"></polyline></svg>
               </div>
           </div>
           <div class="koota-body">
               <div class="koota-body-inner">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px; color: #6B7280;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                   <div style="display:flex; flex-direction:column; gap:4px;">
                       <span style="font-size:0.75rem; color:#6B7280; font-weight:700; text-transform:uppercase;">${locSub}</span>
                       <span>${k.desc.replace('✦ ', '')}</span>
                   </div>
               </div>
           </div>
       </div>
       `;
   }).join('');

   let badgeClass = "average";
   let ratingText = lbl_avg_match;
   if (milanScore.total > 25) { badgeClass = "excellent"; ratingText = lbl_exc_match; }
   else if (milanScore.total < 18) { badgeClass = "poor"; ratingText = lbl_poor_match; }

   let html = `
       <div class="milan-score-container">
           <div class="milan-score-title">${lbl_gun_milan}</div>
           <div class="milan-score-value-wrap">
               <span class="milan-score-value ${badgeClass}">${toNativeNum(milanScore.total, currentLang)}</span><span class="milan-score-max">/${toNativeNum(36, currentLang)}</span>
           </div>
           <div class="milan-rating-badge ${badgeClass}">${ratingText}</div>
           <p class="milan-score-desc">${qualityDesc}</p>
       </div>
       <div style="margin-top: 6px;">
           ${kootasHtml}
       </div>
   `;

      // --- DASHAKOOTA UI GENERATION ---
   const dashaScore = dashakootaCalculator(boySign, boyNakIndex, girlSign, girlNakIndex, boyName, girlName);
   
   let dQualityBadge = ""; let dQualityDesc = ""; let dDashoffset = 283 - (dashaScore.total / 36) * 283;
   let dCircleColor = "#EF4444"; 
   if (dashaScore.total > 25) { 
       dQualityBadge = `<div class='milan-badge milan-badge-good'>${lbl_exc_match}</div>`; 
       dQualityDesc = desc_exc_match; 
       dCircleColor = "#10B981"; 
   } else if (dashaScore.total >= 18) { 
       dQualityBadge = `<div class='milan-badge milan-badge-avg'>${lbl_avg_match}</div>`; 
       dQualityDesc = desc_avg_match; 
       dCircleColor = "#F59E0B"; 
   } else { 
       dQualityBadge = `<div class='milan-badge milan-badge-poor'>${lbl_poor_match}</div>`; 
       dQualityDesc = desc_poor_match; 
       dCircleColor = "#EF4444"; 
   }

   let dKootasHtml = dashaScore.kootas.map(k => {
       let ratio = k.obt / k.max;
       let themeClass = "koota-theme-zero";
       let badgeText = lbl_needs_attn;
       
       if (ratio === 1) {
           themeClass = "koota-theme-full";
           badgeText = lbl_excellent;
       } else if (ratio > 0) {
           themeClass = "koota-theme-partial";
           badgeText = lbl_average;
       }
       
       let rawTitle = k.title.replace(/^\d+\.\s*/, '');
       let locTitle = locUiEx["k_" + rawTitle.toLowerCase()] || rawTitle;
       let locSub = locUiEx["k_sub_" + rawTitle.toLowerCase()] || k.sub;
       
       return `
       <div class="koota-accordion ${themeClass}">
           <div class="koota-header" onclick="const body = this.nextElementSibling; const svg = this.querySelector('.koota-chevron'); if(body.classList.contains('active')){ body.classList.remove('active'); svg.style.transform='rotate(0deg)'; } else { body.classList.add('active'); svg.style.transform='rotate(180deg)'; }">
               <div class="koota-left">
                   <span class="koota-title">${locTitle}</span>
                   <span class="koota-badge">${badgeText}</span>
               </div>
               <div class="koota-points">
                   <span class="koota-score-text">${toNativeNum(k.obt, currentLang)}<span style="font-size:0.8rem; color:#9CA3AF;">/${toNativeNum(k.max, currentLang)}</span></span>
                   <div class="koota-mini-bar"><div class="koota-mini-bar-fill" style="width: ${(k.obt/k.max)*100}%;"></div></div>
                   <svg class="koota-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; transition: transform 0.2s ease;"><polyline points="6 9 12 15 18 9"></polyline></svg>
               </div>
           </div>
           <div class="koota-body">
               <div class="koota-body-inner">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px; color: #6B7280;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                   <div style="display:flex; flex-direction:column; gap:4px;">
                       <span style="font-size:0.75rem; color:#6B7280; font-weight:700; text-transform:uppercase;">${locSub}</span>
                       <span>${k.desc.replace('✦ ', '')}</span>
                   </div>
               </div>
           </div>
       </div>`;
   }).join('');

   let dBadgeClass = "average";
   let dRatingText = lbl_avg_match;
   if (dashaScore.total > 25) { dBadgeClass = "excellent"; dRatingText = lbl_exc_match; }
   else if (dashaScore.total < 18) { dBadgeClass = "poor"; dRatingText = lbl_poor_match; }

   let dashakootaHtml = `
       <div class="milan-score-container">
           <div class="milan-score-title">${lbl_dashakoota}</div>
           <div class="milan-score-value-wrap">
               <span class="milan-score-value ${dBadgeClass}">${toNativeNum(dashaScore.total, currentLang)}</span><span class="milan-score-max">/${toNativeNum(36, currentLang)}</span>
           </div>
           <div class="milan-rating-badge ${dBadgeClass}">${dRatingText}</div>
           <p class="milan-score-desc">${dQualityDesc}</p>
       </div>
       <div style="margin-top: 6px;">
           ${dKootasHtml}
       </div>
   `;

                

                const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
                const getActiveStyle = (style) => currentChartStyle === style ? 'active' : '';

                const d_txt = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].dosha_text) ? localizedParagraphs[currentLang].dosha_text : {};
                
                const elementsArr = ["Fire", "Earth", "Air", "Water"];
                const traitsDict = {
                    "Fire": d_txt.tr_fire || "a naturally dynamic and pioneering spirit, often masking a deep internal pressure to always be the strong one",
                    "Earth": d_txt.tr_earth || "a deeply grounded and methodical presence, harboring a quiet vulnerability that only truly feels safe in absolute loyalty",
                    "Air": d_txt.tr_air || "a brilliantly restless and adaptable mind, seeking intellectual freedom while occasionally battling the exhaustion of overthinking",
                    "Water": d_txt.tr_water || "a profoundly empathetic and protective aura, absorbing the energies around you and fiercely guarding your own tender heart"
                };
                
                const nNameShort = (name || "Person 1").split(" ")[0].toUpperCase();
                const pNameShort = (pName || "Person 2").split(" ")[0].toUpperCase();
                let element1 = elementsArr[(lagnaSign - 1) % 4];
                let element2 = elementsArr[(pAscendantSign - 1) % 4];
                let trait1 = traitsDict[element1];
                let trait2 = traitsDict[element2];
                
                let bts_title1 = locUiEx.bts_title1 || "Beyond the";
                let bts_title2 = locUiEx.bts_title2 || "Score";
                let bts_p1 = d_txt.bts_p1 || "While the Ashtakoot score measures your mental and physical compatibility based on the Moon, the true longevity and structural resilience of your marriage are governed by your core natal charts. Beyond the numerical points, analyzing the foundational alignments reveals the true psychological dynamic of this relationship.";
                
                let bts_p2 = "";
                if (element1 === element2) {
                    bts_p2 = d_txt.bts_p2_same || "Astrologically, both <strong style=\"color: #D92D20;\">{nName}</strong> and <strong style=\"color: #D92D20;\">{pName}</strong> operate with the exact same foundational energy: {trait1}. Because you share this identical elemental core, you instinctively understand each other's deepest drives. However, sharing the same element means you might amplify each other's extremes. This relationship requires both of you to consciously cultivate balance so you don't burn out or stagnate together.";
                    bts_p2 = bts_p2.replace(/{nName}/g, nNameShort).replace(/{pName}/g, pNameShort).replace('{trait1}', trait1);
                } else {
                    bts_p2 = d_txt.bts_p2_diff || "Astrologically, <strong style=\"color: #D92D20;\">{nName}</strong> operates with {trait1}. In contrast, <strong style=\"color: #D92D20;\">{pName}</strong> brings {trait2} to the dynamic. When these two distinct foundational energies merge, it creates a unique cosmic blueprint. This relationship requires {nName} to understand {pName}'s unspoken emotional needs, while {pName} must provide the space for {nName}'s authentic self to emerge.";
                    bts_p2 = bts_p2.replace(/{nName}/g, nNameShort).replace(/{pName}/g, pNameShort).replace('{trait1}', trait1).replace('{trait2}', trait2);
                }
                
                const beyondScoreHtml = `
                    <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 12px 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); margin-top: 12px;">
                        <h3 style="color: #111827; margin-top: 0; margin-bottom: 8px; font-size: 1.05rem; font-family: var(--font-display); font-weight: 800; border-left: 4px solid #D92D20; padding-left: 8px; letter-spacing: -0.2px;">${bts_title1} <span style="color: #D92D20;">${bts_title2}</span></h3>
                        <p style="color: #374151; font-size: 0.86rem; line-height: 1.45; margin-bottom: 8px; font-weight: 500;">
                            ${bts_p1}
                        </p>
                        <div style="background: rgba(0,0,0,0.02); padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.03);">
                            <p style="color: #1F2937; font-size: 0.86rem; line-height: 1.45; margin-bottom: 0; font-weight: 600;">
                                ${bts_p2}
                            </p>
                        </div>
                    </div>
                `;


                // Helper for formatting planet dignity UI
                const getDignityUI = (status) => {
                    if (status === 'Exalted') return { label: locUiEx.dig_ex_lbl || '✦ Exalted (very strong)', desc: locUiEx.dig_ex_desc || 'A wonderful blessing — this planet shines at its brightest here.', color: '#059669', bg: '#ECFDF5' };
                    if (status === 'Own Sign') return { label: locUiEx.dig_own_lbl || '⌂ Own Sign (strong)', desc: locUiEx.dig_own_desc || 'Placed in its own home — a stable, confident, and protective energy.', color: '#2563EB', bg: '#EFF6FF' };
                    if (status === 'Debilitated') return { label: locUiEx.dig_deb_lbl || '▽ Debilitated (needs nurturing)', desc: locUiEx.dig_deb_desc || 'This placement asks for extra care and patience — love and awareness make all the difference.', color: '#B45309', bg: '#FFFBEB' };
                    return { label: locUiEx.dig_fr_lbl || '○ Friendly Sign (comfortable)', desc: locUiEx.dig_fr_desc || 'Placed in a supportive environment — a positive, steady influence.', color: '#0891B2', bg: '#F0FDFA' };
                };

                // 7th House Calculations
                const get7thHouseInfo = (ascSign, planetsArray) => {
                    const h7Sign = (ascSign + 5) % 12 + 1;
                    const h7SignName = getLocalRashi(h7Sign);
                    
                    // Ruler map based on traditional astrology
                    const rulers = {1:"Mars", 2:"Venus", 3:"Mercury", 4:"Moon", 5:"Sun", 6:"Mercury", 7:"Venus", 8:"Mars", 9:"Jupiter", 10:"Saturn", 11:"Saturn", 12:"Jupiter"};
                    const h7LordNameRaw = rulers[h7Sign];
                    const h7LordName = getLocalPlanet(h7LordNameRaw.substring(0,3));
                    
                    const h7Lord = planetsArray.find(p => p.name === h7LordNameRaw);
                    const dignity = h7Lord ? getDignityUI(h7Lord.status) : getDignityUI('Neutral');
                    
                    // Malefic aspects on 7th house
                    let maleficsOn7th = [];
                    const getAsp = (abbr, h) => {
                        let asp = [];
                        if (abbr === "Mar") asp = [4, 7, 8];
                        else if (abbr === "Jup" || abbr === "Rah" || abbr === "Ket") asp = [5, 7, 9];
                        else if (abbr === "Sat") asp = [3, 7, 10];
                        else asp = [7];
                        return asp.map(a => (h + a - 1) > 12 ? (h + a - 1) % 12 || 12 : (h + a - 1));
                    };
                    planetsArray.forEach(p => {
                        if (['Mar', 'Sat', 'Rah', 'Ket'].includes(p.abbr) && getAsp(p.abbr, p.house).includes(7)) {
                            maleficsOn7th.push(getLocalPlanet(p.abbr));
                        }
                    });

                    return { signName: h7SignName, lordName: h7LordName, dignity, maleficsOn7th, lordPlanet: h7Lord };
                };

                const n7th = get7thHouseInfo(lagnaSign, d1Planets);
                const p7th = get7thHouseInfo(pAscendantSign, pD1Planets);

                // Venus & Jupiter Info
                const nVen = d1Planets.find(p => p.abbr === 'Ven');
                const pVen = pD1Planets.find(p => p.abbr === 'Ven');
                const nVenUI = nVen ? getDignityUI(nVen.status) : getDignityUI('Neutral');
                const pVenUI = pVen ? getDignityUI(pVen.status) : getDignityUI('Neutral');

                const nJup = d1Planets.find(p => p.abbr === 'Jup');
                const pJup = pD1Planets.find(p => p.abbr === 'Jup');
                const nJupUI = nJup ? getDignityUI(nJup.status) : getDignityUI('Neutral');
                const pJupUI = pJup ? getDignityUI(pJup.status) : getDignityUI('Neutral');

                // Darakaraka (Planet with lowest degree)
                const getDarakaraka = (planetsArr) => {
                    const valid = planetsArr.filter(p => ["Sun", "Moon", "Mar", "Mer", "Jup", "Ven", "Sat"].includes(p.abbr));
                    valid.sort((a, b) => a.degree - b.degree);
                    return valid.length > 0 ? getLocalPlanet(valid[0].abbr) : "-";
                };
                const nDK = getDarakaraka(d1Planets);
                const pDK = getDarakaraka(pD1Planets);

                // Formulate Footer Notes
                let h7Note = [];
                if (n7th.lordPlanet?.status === 'Debilitated') h7Note.push((d_txt.h7_weak || "{name}'s 7th lord is weak").replace('{name}', nNameShort));
                if (p7th.lordPlanet?.status === 'Debilitated') h7Note.push((d_txt.h7_weak || "{name}'s 7th lord is weak").replace('{name}', pNameShort));
                if (n7th.maleficsOn7th.length > 0) h7Note.push((d_txt.h7_aspect || "{name}'s 7th house is aspected by {planets}").replace('{name}', nNameShort).replace('{planets}', n7th.maleficsOn7th.join(', ')));
                if (p7th.maleficsOn7th.length > 0) h7Note.push((d_txt.h7_aspect || "{name}'s 7th house is aspected by {planets}").replace('{name}', pNameShort).replace('{planets}', p7th.maleficsOn7th.join(', ')));
                
                let h7NoteStr = h7Note.length > 0 ? (d_txt.h7_attention || "Areas of attention: {notes}. These are tendencies, not certainties.").replace('{notes}', h7Note.join("; ")) : (d_txt.h7_free || "Both 7th houses are free from major malefic aspects.");

                let vjNoteStr = "";
                let vBalStr = d_txt.vj_bal || "Points of attention: {n1}'s Venus is debilitated. Balanced by: {n2}'s Venus is exalted.";
                if (nVen?.status === 'Debilitated' && pVen?.status === 'Exalted') vjNoteStr = vBalStr.replace('{n1}', nNameShort).replace('{n2}', pNameShort);
                else if (pVen?.status === 'Debilitated' && nVen?.status === 'Exalted') vjNoteStr = vBalStr.replace('{n1}', pNameShort).replace('{n2}', nNameShort);

                let yogaStr = d_txt.dk_std || "Both charts show standard partnership alignments.";
                let myoga_str = d_txt.dk_yoga || "{name} has marriage yogas (7th lord well placed) — supportive for partnership.";
                if (n7th.lordPlanet && [1,4,7,10,5,9].includes(n7th.lordPlanet.house)) yogaStr = myoga_str.replace('{name}', nNameShort);
                else if (p7th.lordPlanet && [1,4,7,10,5,9].includes(p7th.lordPlanet.house)) yogaStr = myoga_str.replace('{name}', pNameShort);

                let lbl_7th_str = locUiEx.lbl_7th_str || "7th House Strength (Marriage)";
                let lbl_7th_desc = locUiEx.lbl_7th_desc || "While Ashtakoot scores mental compatibility, the 7th house and its lord dictate the actual strength, blessings, and hurdles.";
                let lbl_7th_sign = locUiEx.lbl_7th_sign || "7th House Sign";
                let lbl_7th_lord = locUiEx.lbl_7th_lord || "7th Lord";
                let lbl_lord_str = locUiEx.lbl_lord_str || "Lord Strength";
                let lbl_ven_title = locUiEx.lbl_ven_title || "Venus (Shukra)";
                let lbl_ven_desc = locUiEx.lbl_ven_desc || "Significator of love, romance & marital bliss";
                let lbl_jup_title = locUiEx.lbl_jup_title || "Jupiter (Brihaspati)";
                let lbl_jup_desc = locUiEx.lbl_jup_desc || "Significator of wisdom, expansion & divine blessings";
                let lbl_dk_title = locUiEx.lbl_dk_title || "Darakaraka & Marriage Yogas";
                
                let loc_dk_desc = "";
                if (nDK !== "-" && nDK === pDK) {
                    let dk_desc_same = d_txt.dk_desc_same || "<strong style=\"color:#111827;\">Both {nName} and {pName}</strong> share the exact same Darakaraka (soul significator of spouse): <strong style=\"color:#4F46E5;\">{nDK}</strong>. This is a powerful karmic link indicating you are naturally looking for very similar qualities in love!";
                    loc_dk_desc = dk_desc_same.replace(/{nName}/g, nNameShort).replace(/{pName}/g, pNameShort).replace('{nDK}', nDK);
                } else {
                    let dk_desc_diff = d_txt.dk_desc_diff || "<strong style=\"color:#111827;\">{nName}'s</strong> Darakaraka (soul significator of spouse) is <strong style=\"color:#4F46E5;\">{nDK}</strong>, while <strong style=\"color:#111827;\">{pName}'s</strong> is <strong style=\"color:#4F46E5;\">{pDK}</strong>.";
                    loc_dk_desc = dk_desc_diff.replace('{nName}', nNameShort).replace('{nDK}', nDK).replace('{pName}', pNameShort).replace('{pDK}', pDK);
                }

                const loc_btn_north = locUiEx.btn_north_indian || "North";
                const loc_btn_south = locUiEx.btn_south_indian || "South";
                const loc_btn_east = locUiEx.btn_east_indian || "East";
                const loc_btn_west = locUiEx.btn_west_indian || "West";
                
                const locCharts = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].chart_details) ? localizedParagraphs[currentLang].chart_details : {};
                const getOptTxt = (key, def) => locUiEx[key] || (locCharts[key+"_title"] ? locCharts[key+"_title"] : def);

                let matchChartsHtml = `
                    <style>
.match-chart-container {
  margin-bottom: 10px;
  padding: 14px 16px;
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.04);
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

/* ମୋବାଇଲ୍ ସ୍କ୍ରିନ୍ ରେ କାର୍ଡକୁ ଓସାରିଆ କରିବା ପାଇଁ */

@media (max-width: 600px) {
  .match-chart-container {
    padding: 12px 8px;
    margin-left: -2px;
    margin-right: -2px;
    border-radius: 12px;
    margin-bottom: 10px;
  }
}
</style>
                    <div class="match-chart-container">
                        <div class="chart-toggles" style="margin-bottom: 10px;">
                            <button class="btn-toggle ${getActiveStyle('north')}" data-chart="north" onclick="setChartStyle('north')">${loc_btn_north}</button>
                            <button class="btn-toggle ${getActiveStyle('south')}" data-chart="south" onclick="setChartStyle('south')">${loc_btn_south}</button>
                            <button class="btn-toggle ${getActiveStyle('east')}" data-chart="east" onclick="setChartStyle('east')">${loc_btn_east}</button>
                            <button class="btn-toggle ${getActiveStyle('west')}" data-chart="west" onclick="setChartStyle('west')">${loc_btn_west}</button>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <select id="matchChartSelector" onchange="renderMatchChart()" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #E5E7EB; background: #F9FAFB; font-family: var(--font-body); font-size: 0.85rem; font-weight: 700; color: #1F2937; outline: none; cursor: pointer; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%234B5563%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 xmlns=%22http://www.w3.org/2000/svg%22><polyline points=%226 9 12 15 18 9%22></polyline></svg>'); background-repeat: no-repeat; background-position: right 12px center; box-shadow: inset 0 1px 3px rgba(0,0,0,0.01); transition: border-color 0.2s ease;">
                                 <option value="D1">${getOptTxt('opt_c_d1', 'Birth Chart (D1)')}</option>
                                 <option value="Gochar">${getOptTxt('opt_c_gochar', 'Gochar Chart (Current Transit)')}</option>
                                 <option value="Chalit">${getOptTxt('opt_c_chalit', 'Chalit Chart')}</option>
                                 <option value="Moon">${getOptTxt('opt_c_moon', 'Moon Chart')}</option>
                                 <option value="Sun">${getOptTxt('opt_c_sun', 'Sun Chart')}</option>
                                 <option value="D9">${getOptTxt('opt_c_d9', 'Navamansha Chart (D9)')}</option>
                                 <option value="D10">${getOptTxt('opt_c_d10', 'Dashamansha Chart (D10)')}</option>
                                 <option value="D2">${getOptTxt('opt_c_d2', 'Hora Chart (D2)')}</option>
                                 <option value="D3">${getOptTxt('opt_c_d3', 'Dreshkan Chart (D3)')}</option>
                                 <option value="D4">${getOptTxt('opt_c_d4', 'Chathurthamasha Chart (D4)')}</option>
                                 <option value="D7">${getOptTxt('opt_c_d7', 'Saptamansha Chart (D7)')}</option>
                                 <option value="D12">${getOptTxt('opt_c_d12', 'Dwadashamsha Chart (D12)')}</option>
                                 <option value="D16">${getOptTxt('opt_c_d16', 'Shodashamsha Chart (D16)')}</option>
                                 <option value="D20">${getOptTxt('opt_c_d20', 'Vishamansha Chart (D20)')}</option>
                                 <option value="D24">${getOptTxt('opt_c_d24', 'Chaturvimshamsha Chart (D24)')}</option>
                                 <option value="D27">${getOptTxt('opt_c_d27', 'Bhamsha Chart (D27)')}</option>
                                 <option value="D30">${getOptTxt('opt_c_d30', 'Trishamansha Chart (D30)')}</option>
                                 <option value="D60">${getOptTxt('opt_c_d60', 'Shashtymsha Chart (D60)')}</option>
                            </select>
                        </div>
                        <div style="display: flex; background: rgba(243, 244, 246, 0.8); padding: 3px; border-radius: 99px; width: 100%; margin-bottom: 16px; border: 1px solid rgba(0,0,0,0.03);">
                            <button id="btnMatchNative" onclick="setMatchChartPerson('native')" style="flex: 1; padding: 6px 10px; border-radius: 99px; border: none; font-weight: 800; font-size: 0.8rem; background: linear-gradient(135deg, #FF6B00 0%, #F43F5E 100%); color: #FFFFFF; box-shadow: 0 2px 6px rgba(244, 63, 94, 0.25); cursor: pointer; transition: all 0.2s ease;">${locGenN}</button>
                            <button id="btnMatchPartner" onclick="setMatchChartPerson('partner')" style="flex: 1; padding: 6px 10px; border-radius: 99px; border: none; font-weight: 700; font-size: 0.8rem; background: transparent; color: #6B7280; cursor: pointer; transition: all 0.2s ease;">${locGenP}</button>
                        </div>
                        <div class="chart-container" id="matchDynamicChartContainer" style="min-height: 300px;"></div>
                        ${beyondScoreHtml}
                    </div>
                `;

                const deepAstroHtml = `
                    <div style="margin-top: 0; display: flex; flex-direction: column; gap: 10px;">
                        
                        <!-- 7th House Card -->
                        <div style="border: 1px solid rgba(0,0,0,0.05); border-radius: 14px; overflow: hidden; background: #FFFFFF; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);">
                            <div style="background: linear-gradient(145deg, #F8FAFC 0%, #F1F5F9 100%); padding: 12px 16px; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.04);">
                                <h3 style="color: #1E3A8A; font-family: var(--font-display); font-size: 1rem; font-weight: 800; margin: 0 0 4px 0; letter-spacing: -0.2px;">${lbl_7th_str}</h3>
                                <p style="color: #4B5563; font-size: 0.82rem; margin: 0; line-height: 1.45; font-weight: 600;">${lbl_7th_desc}</p>
                            </div>
                            
                            <div style="padding: 12px 16px;">
                                <div style="font-size: 0.68rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.8px; text-align: center; margin-bottom: 8px; font-weight: 800;">${nNameShort}</div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.88rem;"><span style="color: #4B5563; font-weight: 600;">${lbl_7th_sign}</span><span style="font-weight: 800; color: #1F2937;">${n7th.signName}</span></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.88rem;"><span style="color: #4B5563; font-weight: 600;">${lbl_7th_lord}</span><span style="font-weight: 800; color: #1F2937;">${n7th.lordName}</span></div>
                                
                                <div style="text-align: center; margin-bottom: 12px; background: rgba(0,0,0,0.02); padding: 8px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.03);">
                                    <div style="font-size: 0.65rem; color: #6B7280; margin-bottom: 2px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px;">${lbl_lord_str}</div>
                                    <div style="color: ${n7th.dignity.color}; font-weight: 800; font-size: 0.88rem; margin-bottom: 2px;">${n7th.dignity.label}</div>
                                    <div style="font-size: 0.8rem; color: #374151; line-height: 1.35; font-weight: 600;">${n7th.dignity.desc}</div>
                                </div>

                                <div style="height: 1px; background: rgba(0,0,0,0.04); margin-bottom: 12px;"></div>

                                <div style="font-size: 0.68rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.8px; text-align: center; margin-bottom: 8px; font-weight: 800;">${pNameShort}</div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.88rem;"><span style="color: #4B5563; font-weight: 600;">${lbl_7th_sign}</span><span style="font-weight: 800; color: #1F2937;">${p7th.signName}</span></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.88rem;"><span style="color: #4B5563; font-weight: 600;">${lbl_7th_lord}</span><span style="font-weight: 800; color: #1F2937;">${p7th.lordName}</span></div>
                                
                                <div style="text-align: center; background: rgba(0,0,0,0.02); padding: 8px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.03);">
                                    <div style="font-size: 0.65rem; color: #6B7280; margin-bottom: 2px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px;">${lbl_lord_str}</div>
                                    <div style="color: ${p7th.dignity.color}; font-weight: 800; font-size: 0.88rem; margin-bottom: 2px;">${p7th.dignity.label}</div>
                                    <div style="font-size: 0.8rem; color: #374151; line-height: 1.35; font-weight: 600;">${p7th.dignity.desc}</div>
                                </div>
                            </div>
                            
                            <div style="background: #F9FAFB; padding: 10px 14px; text-align: center; border-top: 1px solid rgba(0,0,0,0.04); color: #374151; font-size: 0.8rem; line-height: 1.45; font-weight: 600;">
                                ${h7NoteStr}
                            </div>
                        </div>

                        <!-- Venus Card -->
                        <div style="border: 1px solid #FECDD3; border-radius: 16px; overflow: hidden; background: #FFFFFF; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.04);">
                            <div style="background: linear-gradient(145deg, #FFF5F5 0%, #FFE4E6 100%); padding: 16px 20px; border-bottom: 1px solid #FECDD3;">
                                <h3 style="color: #BE123C; font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; margin: 0 0 4px 0; letter-spacing: -0.2px;">${lbl_ven_title}</h3>
                                <p style="color: #9F1239; font-size: 0.88rem; font-weight: 600; margin: 0;">${lbl_ven_desc}</p>
                            </div>
                            <div style="padding: 16px 20px; display: flex; flex-direction: column; gap: 12px;">
                                <div style="background: ${nVenUI.bg}; padding: 12px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.03);">
                                    <div style="font-size: 0.68rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: 800;">${nNameShort}</div>
                                    <div style="color: ${nVenUI.color}; font-weight: 800; font-size: 0.95rem; margin-bottom: 2px;">${nVenUI.label}</div>
                                    <div style="font-size: 0.85rem; color: #374151; font-weight: 600; line-height: 1.5;">${nVenUI.desc}</div>
                                </div>
                                <div style="background: ${pVenUI.bg}; padding: 12px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.03);">
                                    <div style="font-size: 0.68rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: 800;">${pNameShort}</div>
                                    <div style="color: ${pVenUI.color}; font-weight: 800; font-size: 0.95rem; margin-bottom: 2px;">${pVenUI.label}</div>
                                    <div style="font-size: 0.85rem; color: #374151; font-weight: 600; line-height: 1.5;">${pVenUI.desc}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Jupiter Card -->
                        <div style="border: 1px solid #FDE68A; border-radius: 16px; overflow: hidden; background: #FFFFFF; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.04);">
                            <div style="background: linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 100%); padding: 16px 20px; border-bottom: 1px solid #FDE68A;">
                                <h3 style="color: #92400E; font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; margin: 0 0 4px 0; letter-spacing: -0.2px;">${lbl_jup_title}</h3>
                                <p style="color: #B45309; font-size: 0.88rem; font-weight: 600; margin: 0;">${lbl_jup_desc}</p>
                            </div>
                            <div style="padding: 16px 20px; display: flex; flex-direction: column; gap: 12px;">
                                <div style="background: ${nJupUI.bg}; padding: 12px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.03);">
                                    <div style="font-size: 0.68rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: 800;">${nNameShort}</div>
                                    <div style="color: ${nJupUI.color}; font-weight: 800; font-size: 0.95rem; margin-bottom: 2px;">${nJupUI.label}</div>
                                    <div style="font-size: 0.85rem; color: #374151; font-weight: 600; line-height: 1.5;">${nJupUI.desc}</div>
                                </div>
                                <div style="background: ${pJupUI.bg}; padding: 12px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.03);">
                                    <div style="font-size: 0.68rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: 800;">${pNameShort}</div>
                                    <div style="color: ${pJupUI.color}; font-weight: 800; font-size: 0.95rem; margin-bottom: 2px;">${pJupUI.label}</div>
                                    <div style="font-size: 0.85rem; color: #374151; font-weight: 600; line-height: 1.5;">${pJupUI.desc}</div>
                                </div>
                            </div>
                            ${vjNoteStr ? `<div style="background: #FFFBEB; padding: 12px 20px; text-align: left; border-top: 1px solid #FDE68A; color: #92400E; font-size: 0.85rem; line-height: 1.5; font-weight: 600;">${vjNoteStr}</div>` : ''}
                        </div>

                        <!-- Darakaraka Card -->
                        <div style="border: 1px solid rgba(0,0,0,0.05); border-radius: 16px; background: #FFFFFF; padding: 16px 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);">
                            <div style="font-size: 0.8rem; color: #1F2937; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 10px; border-left: 4px solid #6366F1; padding-left: 10px;">${lbl_dk_title}</div>
                            <p style="font-size: 0.95rem; color: #374151; font-weight: 600; line-height: 1.5; margin-bottom: 12px;">
                                ${loc_dk_desc}
                            </p>
                            <div style="background: rgba(0,0,0,0.02); padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.03);">
                                <p style="font-size: 0.88rem; color: #1F2937; font-weight: 600; line-height: 1.5; margin: 0;">
                                    ${yogaStr}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
                matchChartsHtml += deepAstroHtml;


                // --- BHAKOOT INSIGHT UI GENERATION (IMPROVED & COMPACT) ---
                const bZodName = getZodiacName(nMoonSign);
                const gZodName = getZodiacName(pMoonSign);
                
                let bhDistRaw = (pMoonSign - nMoonSign + 12) % 12 + 1;
                let isBhakootDosha = [2, 12, 5, 9, 6, 8].includes(bhDistRaw);
                
                let doshaType = locUiEx.bhakoot_auspicious || "Auspicious (No Dosha)";
                let doshaEffects = locUiEx.bhakoot_auspicious_desc || "Your Moon signs are supportive of each other, enhancing emotional intimacy, shared prosperity, and mutual understanding. This grants the full 7 points in Ashtakoota Milan.";

                if (bhDistRaw === 2 || bhDistRaw === 12) {
                    doshaType = locUiEx.bhakoot_2_12 || "Dwirdwadash Dosha (2-12)";
                    doshaEffects = locUiEx.bhakoot_2_12_desc || "The Moon signs are two and twelve signs apart. This combination may bring financial instability, massive expenditures, and a lack of deep emotional support.";
                } else if (bhDistRaw === 5 || bhDistRaw === 9) {
                    doshaType = locUiEx.bhakoot_5_9 || "Nav Pancham Dosha (5-9)";
                    doshaEffects = locUiEx.bhakoot_5_9_desc || "The Moon signs are five and nine signs apart. This alignment can lead to emotional disconnect, misaligned life goals, or challenges related to family expansion.";
                } else if (bhDistRaw === 6 || bhDistRaw === 8) {
                    doshaType = locUiEx.bhakoot_6_8 || "Shadashtak Dosha (6-8)";
                    doshaEffects = locUiEx.bhakoot_6_8_desc || "The Moon signs are six and eight signs apart. This pairing often results in health-related issues, frequent arguments, and underlying psychological friction.";
                }

                let statusColor = isBhakootDosha ? "#BE123C" : "#166534"; 
                let statusDescColor = isBhakootDosha ? "#881337" : "#14532D"; 
                let statusBg = isBhakootDosha ? "linear-gradient(145deg, #FFF5F5 0%, #FFE4E6 100%)" : "linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%)"; 
                let statusBorder = isBhakootDosha ? "#FECDD3" : "#BBF7D0";
                let statusIcon = isBhakootDosha ? "⚠️" : "✅";

                const bhakootInsightHtml = `
                    <div style="max-width: 850px; margin: 0 auto; font-family: var(--font-body); padding: 8px 0;">
                        
                        <!-- Header Section (Left Aligned Premium) -->
                        <div style="margin-bottom: 12px;">
                            <h2 style="font-family: var(--font-display); color: #111827; font-size: clamp(1.15rem, 4vw, 1.3rem); font-weight: 800; margin: 0 0 3px 0; border-left: 4px solid #EA580C; padding-left: 10px; letter-spacing: -0.3px;">${locUiEx.bh_insight_title || "Bhakoot <span style=\"color: #EA580C;\">(Rashi)</span> Analysis"}</h2>
                            <p style="color: #6B7280; font-size: 0.82rem; font-weight: 600; margin: 0 0 0 14px;">${locUiEx.bh_insight_subtitle || "Evaluating emotional, financial, and psychological harmony (7 Points)"}</p>
                        </div>

                        <!-- Moon Signs Comparison -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                            <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 10px; padding: 10px 8px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                                <div style="font-size: 0.62rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-weight: 800; font-family: var(--font-ui);">${(locUiEx.bh_n_moon || "{name}'s Moon").replace('{name}', nNameShort)}</div>
                                <div style="font-size: 1.1rem; font-weight: 800; color: #1F2937; letter-spacing: -0.2px; font-family: var(--font-display);">${bZodName}</div>
                            </div>
                            <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 10px; padding: 10px 8px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                                <div style="font-size: 0.62rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-weight: 800; font-family: var(--font-ui);">${(locUiEx.bh_p_moon || "{name}'s Moon").replace('{name}', pNameShort)}</div>
                                <div style="font-size: 1.1rem; font-weight: 800; color: #1F2937; letter-spacing: -0.2px; font-family: var(--font-display);">${gZodName}</div>
                            </div>
                        </div>

                        <!-- Main Status Card -->
                        <div style="background: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <div style="font-size: 1.4rem; margin-bottom: 4px;">${statusIcon}</div>
                            <div style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-display); color: ${statusColor}; margin-bottom: 4px; letter-spacing: -0.2px;">${doshaType}</div>
                            <p style="font-size: 0.85rem; color: ${statusDescColor}; font-weight: 600; line-height: 1.45; margin: 0; max-width: 580px; margin-left: auto; margin-right: auto;">${doshaEffects}</p>
                        </div>

                        <!-- Educational Section (White Card) -->
                        <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <h3 style="color: #111827; margin-top: 0; margin-bottom: 6px; font-size: 0.95rem; font-weight: 800; font-family: var(--font-display); letter-spacing: -0.2px;">${locUiEx.bh_what_title || "What is Bhakoot in Kundali Matching?"}</h3>
                            <p style="line-height: 1.45; margin-bottom: 10px; font-size: 0.84rem; font-weight: 500; color: #4B5563;">${locUiEx.bh_what_desc || "In Vedic astrology, the Moon governs a person's mind, core emotions, and psychological disposition. Bhakoot (Rashi Koota) evaluates the distance between the couple's Moon signs. A high score (7/7) brings emotional intimacy and shared prosperity. A low score (0/7) indicates Bhakoot Dosha, acting as a cosmic red flag for potential mental fatigue and misaligned goals."}</p>
                            
                            ${isBhakootDosha ? `
                            <div style="height: 1px; background: rgba(0,0,0,0.04); margin-bottom: 10px;"></div>
                            <h3 style="color: #111827; margin-top: 0; margin-bottom: 6px; font-size: 0.95rem; font-weight: 800; font-family: var(--font-display); letter-spacing: -0.2px;">${locUiEx.bh_canc_title || "Can Bhakoot Dosha Be Canceled?"}</h3>
                            <p style="line-height: 1.45; margin-bottom: 6px; font-size: 0.84rem; font-weight: 500; color: #4B5563;">${locUiEx.bh_canc_desc || "Yes! A dosha does not guarantee an unsuccessful marriage. It can be naturally nullified (Bhanga) if:"}</p>
                            <ul style="line-height: 1.45; color: #4B5563; font-weight: 500; font-size: 0.82rem; padding-left: 18px; margin-bottom: 12px;">
                                <li style="margin-bottom: 4px;">${locUiEx.bh_canc_li1 || "The ruling planets (lords) of both Moon signs are the same or friendly to each other."}</li>
                                <li style="margin-bottom: 4px;">${locUiEx.bh_canc_li2 || "There is a strong mutual aspect or conjunction of benefic planets (like Jupiter or Venus) in both charts."}</li>
                                <li>${locUiEx.bh_canc_li3 || "The individual horoscopes (D1 and Navamsha D9) show strong, positive yogas."}</li>
                            </ul>

                            <h3 style="color: #111827; margin-top: 0; margin-bottom: 8px; font-size: 0.95rem; font-weight: 800; font-family: var(--font-display); letter-spacing: -0.2px;">${locUiEx.bh_rem_title || "Vedic Remedies to Mitigate Effects"}</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px;">
                                <div style="background: #F9FAFB; padding: 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.03);">
                                    <h4 style="margin: 0 0 3px 0; color: #1F2937; font-size: 0.82rem; font-weight: 800;">${locUiEx.bh_rem_puja_t || "🕉️ Pujas & Rituals"}</h4>
                                    <p style="margin: 0; font-size: 0.78rem; color: #4B5563; font-weight: 500; line-height: 1.35;">${locUiEx.bh_rem_puja_d || "Perform Navagraha Shanti Puja to pacify planetary friction, or Maha Mrityunjaya Jaap for health and longevity."}</p>
                                </div>
                                <div style="background: #F9FAFB; padding: 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.03);">
                                    <h4 style="margin: 0 0 3px 0; color: #1F2937; font-size: 0.82rem; font-weight: 800;">${locUiEx.bh_rem_gem_t || "💎 Gemstones"}</h4>
                                    <p style="margin: 0; font-size: 0.78rem; color: #4B5563; font-weight: 500; line-height: 1.35;">${locUiEx.bh_rem_gem_d || "Wearing supportive stones like Yellow Sapphire (for wisdom) or Emerald (for communication) after expert consultation."}</p>
                                </div>
                                <div style="background: #F9FAFB; padding: 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.03);">
                                    <h4 style="margin: 0 0 3px 0; color: #1F2937; font-size: 0.82rem; font-weight: 800;">${locUiEx.bh_rem_charity_t || "🤲 Charity & Fasting"}</h4>
                                    <p style="margin: 0; font-size: 0.78rem; color: #4B5563; font-weight: 500; line-height: 1.35;">${locUiEx.bh_rem_charity_d || "Observe fasts on Mondays (Moon) or Thursdays (Jupiter) and donate to causes aligned with the afflicted planets."}</p>
                                </div>
                                <div style="background: #F9FAFB; padding: 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.03);">
                                    <h4 style="margin: 0 0 3px 0; color: #1F2937; font-size: 0.82rem; font-weight: 800;">${locUiEx.bh_rem_med_t || "📿 Meditation"}</h4>
                                    <p style="margin: 0; font-size: 0.78rem; color: #4B5563; font-weight: 500; line-height: 1.35;">${locUiEx.bh_rem_med_d || "Recite planetary mantras daily and practice meditation to build extreme patience and mutual emotional understanding."}</p>
                                </div>
                            </div>
                            ` : `
                            <div style="background: linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%); border: 1px solid #BBF7D0; padding: 12px; border-radius: 10px; margin-top: 10px;">
                                <h4 style="margin: 0 0 3px 0; color: #166534; font-size: 0.88rem; font-weight: 800;">${locUiEx.bh_exc_harm_t || "🌟 Excellent Emotional Harmony"}</h4>
                                <p style="margin: 0; color: #14532D; font-size: 0.82rem; font-weight: 600; line-height: 1.4;">${locUiEx.bh_exc_harm_d || "Because your Moon signs are in a highly compatible distance, your relationship naturally possesses strong emotional bonding, financial stability, and long-term understanding. You do not need specific Bhakoot remedies!"}</p>
                            </div>
                            `}
                        </div>
                        
                        <p style="text-align: center; font-size: 0.72rem; color: #9CA3AF; font-style: italic; font-weight: 500; margin: 0;">
                            ${locUiEx.bh_disclaimer || "Disclaimer: These astrological insights are based on traditional Vedic principles. For personalized analysis regarding dosha cancellations and deep compatibility, please consult an expert astrologer."}
                        </p>
                    </div>
                `;

                // --- MATCH MANGLIK UI GENERATION (DETAILED & PREMIUM) ---
                const getAgeFromDate = (dobStr) => {
                    const bd = new Date(dobStr);
                    if(isNaN(bd.getTime())) return 30;
                    const diff = Date.now() - bd.getTime();
                    return Math.floor(diff / 31557600000);
                };
                
                const nAge = getAgeFromDate(dateStr);
                const pAge = getAgeFromDate(pDateStr);

                const evaluateMatchManglik = (planets, lagnaSign, moonSign, age, personName) => {
                    const ma = planets.find(p => p.abbr === "Mar");
                    const ju = planets.find(p => p.abbr === "Jup");
                    const ve = planets.find(p => p.abbr === "Ven");

                    let status = "No";
                    let intensity = "None";
                    let triggers = [];
                    let cancellations = [];
                    let occupancies = [];
                    let aspects = [];
                    let desc = '';
                    let badgeLabel = 'SAFE';

                    if (!ma) return { status, intensity, triggers, cancellations, occupancies, aspects, desc, badgeLabel, marsHouse: null };

                    const houseDist = (fromSign, toSign) => (toSign - fromSign + 12) % 12 + 1;
                    const targetHouses = [1, 2, 4, 7, 8, 12];

                    const getAspectedHouses = (abbr, h) => {
                        let asp = [];
                        if (abbr === "Mar") asp = [4, 7, 8];
                        else if (abbr === "Jup" || abbr === "Rah" || abbr === "Ket") asp = [5, 7, 9];
                        else if (abbr === "Sat") asp = [3, 7, 10];
                        else asp = [7];
                        return asp.map(a => (h + a - 1) > 12 ? (h + a - 1) % 12 || 12 : (h + a - 1));
                    };

                    planets.forEach(p => {
                        if (targetHouses.includes(p.house)) {
                            let occTemplate = locUiEx.mm_occ_text || "House {house} is occupied by planet {planet} in your birth chart.";
                            occupancies.push(occTemplate.replace('{house}', toNativeNum(p.house, currentLang)).replace('{planet}', getLocalPlanet(p.abbr)));
                        }
                        let aspList = getAspectedHouses(p.abbr, p.house);
                        aspList.forEach(a => {
                            if (targetHouses.includes(a)) {
                                let asptTemplate = locUiEx.mm_asp_text || "House {house} of your birth chart is aspected by {planet}.";
                                aspects.push(asptTemplate.replace('{house}', toNativeNum(a, currentLang)).replace('{planet}', getLocalPlanet(p.abbr)));
                            }
                        });
                    });

                    let fromLagna = houseDist(lagnaSign, ma.sign);
                    let fromMoon = houseDist(moonSign, ma.sign);
                    let fromVenus = ve ? houseDist(ve.sign, ma.sign) : null;

                    let lagna_triggered = targetHouses.includes(fromLagna);
                    let moon_triggered = targetHouses.includes(fromMoon);
                    let venus_triggered = targetHouses.includes(fromVenus);

                    if (lagna_triggered) {
                        let tLagna = locUiEx.mm_trig_lagna || "Lagna (House {house})";
                        triggers.push(tLagna.replace('{house}', toNativeNum(fromLagna, currentLang)));
                    }
                    if (moon_triggered) {
                        let tMoon = locUiEx.mm_trig_moon || "Moon (House {house})";
                        triggers.push(tMoon.replace('{house}', toNativeNum(fromMoon, currentLang)));
                    }
                    if (venus_triggered) {
                        let tVenus = locUiEx.mm_trig_venus || "Venus (House {house})";
                        triggers.push(tVenus.replace('{house}', toNativeNum(fromVenus, currentLang)));
                    }

                    let isOwnSign = [1, 8].includes(ma.sign);
                    let isKendra = [1, 4, 7, 10].includes(ma.house);
                    
                    let isConjunctMer = planets.some(p => p.abbr.startsWith('Mer') && p.sign === ma.sign);
                    let isConjunctSun = planets.some(p => p.abbr.startsWith('Su') && p.sign === ma.sign);
                    let isJupiterAspectOrConjunct = ju && ([1, 5, 7, 9].includes(houseDist(ju.sign, ma.sign)));

                    if (triggers.length > 0) {
                        if (isOwnSign && isKendra) {
                            cancellations.push(locUiEx.mm_canc_ruchaka || "Mars forms Ruchaka Mahapurusha Yoga (Own sign in Kendra), massively dissolving the dosha.");
                        } else if (isJupiterAspectOrConjunct) {
                            cancellations.push(locUiEx.mm_canc_jupiter || "Jupiter's divine aspect/conjunction purifies the Martian energy.");
                        } else if ([9, 12].includes(ma.sign)) {
                            cancellations.push(locUiEx.mm_canc_jup_sign || "Mars is placed in a friendly Jupiter sign, calming its fiery nature.");
                        } else if (isConjunctMer || isConjunctSun) {
                            cancellations.push(locUiEx.mm_canc_mer_sun || "Mars is conjunct a neutralizing planet (Mercury or Sun), logically calming its aggressive energy.");
                        } else if (isOwnSign && !isKendra) { 
                            cancellations.push(locUiEx.mm_canc_own || "Mars is in its own sign, significantly reducing the dosha."); 
                        } else if (ma.sign === 10) { 
                            cancellations.push(locUiEx.mm_canc_exalted || "Mars is exalted in Capricorn, channeling its energy positively."); 
                        }
                    }

                    if (triggers.length === 0) {
                        status = locUiEx.lbl_no || 'No';
                        intensity = locUiEx.mm_lbl_none || 'None';
                        badgeLabel = locUiEx.badge_SAFE || 'SAFE';
                        let template = locUiEx.mm_safe_desc || "Great news, {personName}! Your chart is completely free from Manglik Dosha. You naturally bring a calmer, more grounded and peaceful energy to your relationships.";
                        desc = template.replace('{personName}', personName);
                    } else if (triggers.length > 0 && cancellations.length > 0) {
                        status = locUiEx.lbl_no || 'No';
                        intensity = locUiEx.mm_intensity_low_canc || 'Low / Cancelled';
                        badgeLabel = locUiEx.badge_SAFE || 'SAFE';
                        let template = locUiEx.mm_cancelled_desc || "Hey {personName}, you do have Mars in a sensitive spot, but thanks to some beautiful planetary alignments, the negative effects are totally cancelled out! You're officially safe from the dosha.";
                        desc = template.replace('{personName}', personName);
                    } else if (triggers.length > 0 && cancellations.length === 0) {
                        status = locUiEx.lbl_yes || 'Yes';
                        intensity = locUiEx.lbl_high || 'High';
                        badgeLabel = locUiEx.badge_MANGLIK || 'MANGLIK';
                        let template = locUiEx.mm_manglik_desc || "{personName}, your chart shows a strong Manglik Dosha. Don't worry—this just means you possess a tremendous amount of fiery, protective, and passionate energy when it comes to love. You simply need a partner who can match your high-octane intensity!";
                        desc = template.replace('{personName}', personName);
                    }

                    return { status, intensity, triggers, cancellations, occupancies, aspects, desc, badgeLabel, marsHouse: ma ? ma.house : null, isManglikRaw: (triggers.length > 0 && cancellations.length === 0) };
                };
                const nManglik = evaluateMatchManglik(d1Planets, lagnaSign, nMoonSign, nAge, name);
                const pManglik = evaluateMatchManglik(pD1Planets, pAscendantSign, pMoonSign, pAge, pNameLocal);

                // --- COMBINED MANGLIK UI GENERATION (PREVIOUS + NEW PREMIUM) ---
                let manglikMatchTitle = "";
                let manglikMatchDesc = "";
                let matchAlertColor = "";
                let matchAlertBg = "";
                
                let conclusionTitle = locUiEx.conclusion_title || "Conclusion";
                let conclusionText = "";
                let conclusionColor = "#F97316";

                const nHas = nManglik.isManglikRaw;
                const pHas = pManglik.isManglikRaw;

                if (!nHas && !pHas) {
                    manglikMatchTitle = locUiEx.mm_alert_non_title || "Perfectly Balanced (Non-Manglik Match) 🌱";
                    let template = locUiEx.mm_alert_non_desc || "Awesome! Neither {name} nor {partnerName} has an active Manglik Dosha. Because neither of you brings that aggressive, overwhelming Martian fire into the relationship, your dynamic naturally leans toward peace, mutual understanding, and emotional stability.";
                    manglikMatchDesc = template.replace('{name}', name).replace('{partnerName}', pNameLocal);
                    matchAlertColor = "#15803D"; matchAlertBg = "#F0FDF4";
                    
                    let cTemplate = locUiEx.mm_concl_non || "Both {name} and {partnerName} are beautifully aligned as Non-Mangliks. This cosmic parity creates a very stable and relaxed emotional environment for a long-term commitment. This match is highly recommended from a Manglik perspective!";
                    conclusionText = cTemplate.replace('{name}', name).replace('{partnerName}', pNameLocal);
                    conclusionColor = "#10B981";
                } else if (nHas && pHas) {
                    manglikMatchTitle = locUiEx.mm_alert_double_title || "A Power Couple (Double Manglik) 🔥";
                    let template = locUiEx.mm_alert_double_desc || "Here's the magical part about astrology: Both {name} and {partnerName} are Manglik! Normally, people fear this, but since you both have it, your intense, passionate energies perfectly cancel each other out. You two operate on the exact same high-octane frequency.";
                    manglikMatchDesc = template.replace('{name}', name).replace('{partnerName}', pNameLocal);
                    matchAlertColor = "#15803D"; matchAlertBg = "#F0FDF4";
                    
                    let cTemplate = locUiEx.mm_concl_double || "Since both {name} and {partnerName} carry the Manglik signature, the dosha is mathematically and energetically neutralized. You will match each other's drive and passion perfectly. This is a highly recommended and powerful match!";
                    conclusionText = cTemplate.replace('{name}', name).replace('{partnerName}', pNameLocal);
                    conclusionColor = "#10B981";
                } else {
                    manglikMatchTitle = locUiEx.mm_alert_mismatch_title || "⚠️ Fiery Energy Mismatch Detected";
                    manglikMatchDesc = locUiEx.mm_alert_mismatch_desc || "Let's look at this objectively: One of you brings intense Martian energy to the table, while the other doesn't. This means one partner might process anger, ambition, or passion much faster and more intensely than the other. It's not a dealbreaker, but it requires deep understanding and patience.";
                    if (nManglik.cancellations.length > 0 || pManglik.cancellations.length > 0) {
                         manglikMatchDesc += locUiEx.mm_alert_canc_soft || " The good news? There are strong planetary cancellations in the charts that significantly soften this friction.";
                         matchAlertColor = "#B45309"; matchAlertBg = "#FFFBEB";
                    } else {
                         matchAlertColor = "#B91C1C"; matchAlertBg = "#FEF2F2";
                    }
                    
                    let nonManglikPerson = !nHas ? name : pNameLocal;
                    let manglikPerson = nHas ? name : pNameLocal;
                    let cTemplate = locUiEx.mm_concl_mismatch || "{nonManglikPerson} has a calmer relationship profile, whereas {manglikPerson} is a strong Manglik. This fundamental difference in energetic temperaments can lead to squabbling, dominance issues, or misunderstandings if not managed maturely. Traditionally, this match requires caution and is generally not recommended without astrological remedies.";
                    conclusionText = cTemplate.replace('{nonManglikPerson}', nonManglikPerson).replace('{manglikPerson}', manglikPerson);
                    conclusionColor = "#F97316";
                }

                const renderManglikCard = (name, mData, isMale) => {
                    let isSafe = mData.status === (locUiEx.lbl_no || "No");
                    let badgeBg = isSafe ? "#ECFDF5" : "#FEF2F2"; 
                    let badgeText = isSafe ? "#065F46" : "#B91C1C";
                    let badgeBorder = isSafe ? "#A7F3D0" : "#FECACA";
                    let badgeLabel = mData.badgeLabel;

                    let lblTriggerPts = locUiEx.mm_lbl_triggers || "Trigger Points";
                    let lblNone = locUiEx.mm_lbl_none || "None";
                    let lblCancApplied = locUiEx.mm_lbl_canc_applied || "Cancellations Applied";
                    let lblAreYou = locUiEx.mm_lbl_are_you || "Are you Manglik?";
                    let lblIntensity = locUiEx.mm_lbl_intensity || "Intensity";

                    let triggersHtml = mData.triggers.length > 0 
                        ? `<div style="margin-top: 8px;">
                             <div style="font-size: 0.65rem; font-weight: 800; color: #6B7280; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px;">${lblTriggerPts}</div>
                             ${mData.triggers.map(t => `<div style="color: #374151; font-weight: 600; font-size: 0.8rem; margin-bottom: 3px; display: flex; align-items: center; gap: 6px;"><div style="width:4px; height:4px; border-radius:50%; background:#F43F5E; flex-shrink: 0;"></div> ${t}</div>`).join('')}
                           </div>`
                        : `<div style="margin-top: 8px;">
                             <div style="font-size: 0.65rem; font-weight: 800; color: #6B7280; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px;">${lblTriggerPts}</div>
                             <div style="color: #047857; font-weight: 600; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;"><div style="width:4px; height:4px; border-radius:50%; background:#10B981; flex-shrink: 0;"></div> ${lblNone}</div>
                           </div>`;
                    
                    let cancelsHtml = mData.cancellations.length > 0
                        ? `<div style="margin-top: 8px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 8px 10px;">
                            <div style="font-size: 0.65rem; color: #1E3A8A; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px;">${lblCancApplied}</div>
                            ${mData.cancellations.map(c => `<div style="color: #1E40AF; font-weight: 600; font-size: 0.78rem; margin-bottom: 3px; display: flex; align-items: flex-start; gap: 6px;"><div style="width:4px; height:4px; border-radius:50%; background:#3B82F6; margin-top:5px; flex-shrink:0;"></div> <span style="line-height: 1.35;">${c}</span></div>`).join('')}
                           </div>`
                        : ``;

                    let profileHtml = "";
                    if (mData.marsHouse) {
                        let fullPlanetName = isMale ? "Mars_Male" : "Mars_Female";
                        let dictKey = isMale ? "Mar_Male" : "Mar_Female";
                        let profileText = "";
                        
                        if (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].planetInHouse && localizedParagraphs[currentLang].planetInHouse[fullPlanetName] && localizedParagraphs[currentLang].planetInHouse[fullPlanetName][mData.marsHouse]) {
                            profileText = localizedParagraphs[currentLang].planetInHouse[fullPlanetName][mData.marsHouse];
                        } else if (astroDictionary.planetInHouse[dictKey] && astroDictionary.planetInHouse[dictKey][mData.marsHouse]) {
                            profileText = astroDictionary.planetInHouse[dictKey][mData.marsHouse];
                        } else if (astroDictionary.planetInHouse.Mar && astroDictionary.planetInHouse.Mar[mData.marsHouse]) {
                            profileText = astroDictionary.planetInHouse.Mar[mData.marsHouse];
                        }

                        if (profileText) {
                            let locProfileTitle = (locUiEx && locUiEx.lbl_psych_profile) ? locUiEx.lbl_psych_profile : "Psychological Profile";
                            let houseNum = toNativeNum(mData.marsHouse, currentLang);
                            let ordinalSuffix = currentLang === 'en' ? (mData.marsHouse === 1 ? 'st' : mData.marsHouse === 2 ? 'nd' : mData.marsHouse === 3 ? 'rd' : 'th') : '';
                            let locMars = getLocalPlanet("Mar");
                            let locHouse = (locUiEx && locUiEx.lbl_house) ? locUiEx.lbl_house : "house";
                            let locIn = (locUiEx && locUiEx.lbl_in) ? locUiEx.lbl_in : "in";
                            
                            let prefix = currentLang === 'en' ? `<strong>${locMars} in the ${houseNum}${ordinalSuffix} ${locHouse}:</strong> ` : `<strong>${locMars} ${houseNum} ${locHouse} ${locIn}:</strong> `;

                            profileHtml = `
                                <div style="margin-top: 8px; background: #FAFAF9; border: 1px dashed rgba(0,0,0,0.1); border-radius: 8px; padding: 10px 12px;">
                                    <h4 style="margin: 0 0 4px 0; color: #374151; font-size: 0.86rem; font-weight: 800; font-family: var(--font-display);">${locProfileTitle}</h4>
                                    <p style="margin: 0; font-size: 0.8rem; color: #4B5563; line-height: 1.45; font-weight: 500;">
                                        ${prefix}${profileText}
                                    </p>
                                </div>
                            `;
                        }
                    }

                    let btnViewAspects = locUiEx.mm_btn_aspects || "View Detailed Aspects";
                    let hdrAspects = locUiEx.mm_hdr_aspects || "Based On Planet Aspects";
                    let hdrOccupancy = locUiEx.mm_hdr_occupancy || "Based On House Occupancy";
                    let noAspects = locUiEx.mm_no_aspects || "No major aspects impacting dosha.";
                    let noOccupancy = locUiEx.mm_no_occupancy || "No major occupancies impacting dosha.";

                    return `
        <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 12px; padding: 12px 14px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; width: 100%; flex-wrap: nowrap;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.65rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1px; font-weight: 800;">${name}</div>
                    <div style="font-size: 0.82rem; color: #4B5563; font-weight: 600; margin-bottom: 2px;">${lblAreYou}</div>
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <div style="font-size: 1.45rem; font-weight: 800; font-family: var(--font-display); color: #111827; letter-spacing: -0.3px; line-height: 1;">${mData.status}</div>
                        <div style="background: ${badgeBg}; color: ${badgeText}; border: 1px solid ${badgeBorder}; padding: 2px 6px; border-radius: 5px; font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px; display: inline-block; white-space: nowrap;">${badgeLabel}</div>
                    </div>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                    <div style="font-size: 0.65rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-weight: 800;">${lblIntensity}</div>
                    <div style="font-size: 0.88rem; font-family: var(--font-display); font-weight: 800; color: ${isSafe ? '#047857' : '#BE123C'}; white-space: nowrap; line-height: 1.25;">
                        ${mData.intensity.replace(' / ', '<br>')}
                    </div>
                </div>
            </div>
            
            <p style="font-size: 0.82rem; color: #374151; font-weight: 500; line-height: 1.45; margin-top: 8px; margin-bottom: 0;">
                ${mData.desc}
            </p>
            
            ${triggersHtml}
            ${cancelsHtml}
            ${profileHtml}

            <div style="margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.04); padding-top: 8px;">
                <button onclick="const report = this.nextElementSibling; const icon = this.querySelector('.arrow-icon'); if(report.style.display==='none'){report.style.display='block'; icon.style.transform='rotate(180deg)';}else{report.style.display='none'; icon.style.transform='rotate(0deg)';}" style="background: transparent; color: #3B82F6; border: none; padding: 0; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: color 0.2s;">
                    ${btnViewAspects}
                    <svg class="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div style="display: none; margin-top: 8px; font-size: 0.78rem; color: #4B5563; font-weight: 500; background: #F9FAFB; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.03);">
                    <div style="font-weight: 800; color: #1F2937; margin-bottom: 4px;">${hdrAspects}</div>
                    ${mData.aspects.length > 0 ? mData.aspects.map(a => `<div style="margin-bottom: 2px; line-height: 1.35;">• ${a}</div>`).join('') : `<div>${noAspects}</div>`}
                    <div style="font-weight: 800; color: #1F2937; margin-top: 8px; margin-bottom: 4px;">${hdrOccupancy}</div>
                    ${mData.occupancies.length > 0 ? mData.occupancies.map(o => `<div style="margin-bottom: 2px; line-height: 1.35;">• ${o}</div>`).join('') : `<div>${noOccupancy}</div>`}
                </div>
            </div>
        </div>`;
                };

                let whatIsManglikTitle = locUiEx.mm_what_title || "What is Manglik Dosha?";
                let whatIsManglikDesc = locUiEx.mm_what_desc || "Manglik Dosha is simply an excess of Martian energy—passion, aggression, and intense protectiveness. When two Mangliks marry, their energies balance out beautifully. Problems only arise when a high-energy Manglik pairs with a low-energy Non-Manglik, leading to potential dominance or exhaustion. Luckily, many classical rules naturally cancel this dosha!";

                // =========================================================
                // NEW: NADI DOSHA UI GENERATION (COMPACT)
                // =========================================================
                const nNadiLocal = loc_nNadi;
                const pNadiLocal = loc_pNadi;
                const isNadiDosha = nNadi === pNadi;
                
                const nadiTitle = isNadiDosha ? (locUiEx.nd_alert_dosha_title || "⚠️ Nadi Dosha Detected (Same Nadi)") : (locUiEx.nd_alert_safe_title || "Excellent Genetic Harmony (Different Nadis) 🌱");
                const nadiDesc = isNadiDosha ? (locUiEx.nd_alert_dosha_desc || "Both partners share the identical Nadi. In Vedic science, this creates an energetic and biological overload, potentially leading to lower vitality and emotional fatigue.") : (locUiEx.nd_alert_safe_desc || "You both possess different Nadis. This creates a beautiful, complementary biological flow, ensuring high vitality, magnetic attraction, and excellent genetic compatibility.");
                const nadiBg = isNadiDosha ? "linear-gradient(145deg, #FFF5F5 0%, #FFE4E6 100%)" : "linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%)";
                const nadiBorder = isNadiDosha ? "#FECDD3" : "#BBF7D0";
                const nadiColor = isNadiDosha ? "#BE123C" : "#166534";
                const nadiIcon = isNadiDosha ? "⚠️" : "✅";
                const nadiVerdict = isNadiDosha ? (locUiEx.lbl_present || "Present") : (locUiEx.lbl_not_present || "Not Present");

                const matchNadiHtml = `
                    <div style="max-width: 850px; margin: 0 auto; font-family: var(--font-body); padding: 8px 0;">
                        
                        <!-- Header Section -->
                        <div style="margin-bottom: 12px;">
                            <h2 style="font-family: var(--font-display); color: #111827; font-size: clamp(1.15rem, 4vw, 1.3rem); font-weight: 800; margin: 0 0 3px 0; border-left: 4px solid #059669; padding-left: 10px; letter-spacing: -0.3px;">${locUiEx.nd_insight_title || "Nadi Dosha <span style=\"color: #059669;\">(Health & Genetics)</span>"}</h2>
                            <p style="color: #6B7280; font-size: 0.82rem; font-weight: 600; margin: 0 0 0 14px;">${locUiEx.nd_insight_subtitle || "Evaluating physiological resonance and energetic magnetism (8 Points)"}</p>
                        </div>

                        <!-- Status Alert -->
                        <div style="background: ${nadiBg}; border: 1px solid ${nadiBorder}; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <div style="font-size: 1.4rem; margin-bottom: 4px;">${nadiIcon}</div>
                            <div style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-display); color: ${nadiColor}; margin-bottom: 4px; letter-spacing: -0.2px;">${nadiVerdict}</div>
                            <p style="font-size: 0.85rem; color: ${nadiColor}; font-weight: 600; line-height: 1.45; margin: 0; max-width: 580px; margin-left: auto; margin-right: auto;">${nadiDesc}</p>
                        </div>

                        <!-- 2-Column Data Grid -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                            <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 10px; padding: 10px 8px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                                <div style="font-size: 0.62rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-weight: 800;">${nNameShort}</div>
                                <div style="font-size: 1.1rem; font-weight: 800; color: #1F2937; font-family: var(--font-display);">${nNadiLocal}</div>
                            </div>
                            <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 10px; padding: 10px 8px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                                <div style="font-size: 0.62rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-weight: 800;">${pNameShort}</div>
                                <div style="font-size: 1.1rem; font-weight: 800; color: #1F2937; font-family: var(--font-display);">${pNadiLocal}</div>
                            </div>
                        </div>

                        <!-- Educational Section -->
                        <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 14px 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <h3 style="color: #111827; margin-top: 0; margin-bottom: 6px; font-size: 0.95rem; font-weight: 800; font-family: var(--font-display);">${locUiEx.nd_what_title || "What is Nadi in Psychological & Ayurvedic Terms?"}</h3>
                            <p style="line-height: 1.45; margin-bottom: 10px; font-size: 0.84rem; font-weight: 500; color: #4B5563;">${locUiEx.nd_what_desc || "Nadi represents the physiological resonance and baseline life-force (Prana) of an individual. In Ayurveda, this dictates your biological temperament (Vata, Pitta, Kapha). When two partners have different Nadis, they biologically complete each other, leading to high magnetic attraction and healthy progeny."}</p>
                            
                            <div style="height: 1px; background: rgba(0,0,0,0.04); margin-bottom: 10px;"></div>
                            
                            <h3 style="color: #111827; margin-top: 0; margin-bottom: 6px; font-size: 0.95rem; font-weight: 800; font-family: var(--font-display);">${locUiEx.nd_impact_title || "The Psychological Impact of Nadi Dosha"}</h3>
                            <p style="line-height: 1.45; margin-bottom: 0; font-size: 0.84rem; font-weight: 500; color: #4B5563;">${locUiEx.nd_impact_desc || "Sharing the identical Nadi means your energetic wavelengths clash like two identical magnetic poles repelling each other. Over time, this can lead to unexplainable physical exhaustion, a decline in natural affection, and deep-seated psychological fatigue between partners."}</p>
                        </div>
                    </div>
                `;

                // =========================================================
                // NEW: VEDHA DOSHA UI GENERATION (COMPACT)
                // =========================================================
                const nNakNameLoc = getLocalNakshatra(panchang.nakshatra).split(' ')[0];
                const pNakNameLoc = getLocalNakshatra(pPanchang.nakshatra).split(' ')[0];
                
                const isVedhaCheck = (b, g) => {
                    const pairs = [[0,17], [1,16], [2,15], [3,14], [5,21], [6,20], [7,19], [8,18], [9,26], [10,25], [11,24], [12,23]];
                    for (let p of pairs) { if ((p[0]===b && p[1]===g) || (p[0]===g && p[1]===b)) return true; }
                    if ([4,13,22].includes(b) && [4,13,22].includes(g) && b !== g) return true;
                    return false;
                };
                const isVedhaDosha = isVedhaCheck(nMoonNakIndex, pMoonNakIndex);

                const vedhaTitle = isVedhaDosha ? (locUiEx.vd_alert_dosha_title || "⚠️ Vedha Dosha Detected (Obstruction)") : (locUiEx.vd_alert_safe_title || "Unobstructed Flow (No Vedha) ✨");
                const vedhaDesc = isVedhaDosha ? (locUiEx.vd_alert_dosha_desc || "Your birth stars are in a mutually obstructive alignment. This acts as a cosmic blindspot, potentially bringing sudden hurdles and unexplainable friction into your shared life path.") : (locUiEx.vd_alert_safe_desc || "Your birth stars (Nakshatras) do not obstruct each other. This clears the path for a relationship free from deep-rooted psychological blockages, allowing love to flow seamlessly.");
                const vedhaBg = isVedhaDosha ? "linear-gradient(145deg, #FFF5F5 0%, #FFE4E6 100%)" : "linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%)";
                const vedhaBorder = isVedhaDosha ? "#FECDD3" : "#BBF7D0";
                const vedhaColor = isVedhaDosha ? "#BE123C" : "#166534";
                const vedhaIcon = isVedhaDosha ? "⚠️" : "✅";
                const vedhaVerdict = isVedhaDosha ? (locUiEx.lbl_present || "Present") : (locUiEx.lbl_not_present || "Not Present");

                const matchVedhaHtml = `
                    <div style="max-width: 850px; margin: 0 auto; font-family: var(--font-body); padding: 8px 0;">
                        
                        <!-- Header Section -->
                        <div style="margin-bottom: 12px;">
                            <h2 style="font-family: var(--font-display); color: #111827; font-size: clamp(1.15rem, 4vw, 1.3rem); font-weight: 800; margin: 0 0 3px 0; border-left: 4px solid #6366F1; padding-left: 10px; letter-spacing: -0.3px;">${locUiEx.vd_insight_title || "Vedha Dosha <span style=\"color: #6366F1;\">(Cosmic Obstruction)</span>"}</h2>
                            <p style="color: #6B7280; font-size: 0.82rem; font-weight: 600; margin: 0 0 0 14px;">${locUiEx.vd_insight_subtitle || "Evaluating psychological blindspots and life-path friction"}</p>
                        </div>

                        <!-- Status Alert -->
                        <div style="background: ${vedhaBg}; border: 1px solid ${vedhaBorder}; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <div style="font-size: 1.4rem; margin-bottom: 4px;">${vedhaIcon}</div>
                            <div style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-display); color: ${vedhaColor}; margin-bottom: 4px; letter-spacing: -0.2px;">${vedhaVerdict}</div>
                            <p style="font-size: 0.85rem; color: ${vedhaColor}; font-weight: 600; line-height: 1.45; margin: 0; max-width: 580px; margin-left: auto; margin-right: auto;">${vedhaDesc}</p>
                        </div>

                        <!-- 2-Column Data Grid -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                            <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 10px; padding: 10px 8px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                                <div style="font-size: 0.62rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-weight: 800;">${nNameShort}'s Star</div>
                                <div style="font-size: 1.1rem; font-weight: 800; color: #1F2937; font-family: var(--font-display);">${nNakNameLoc}</div>
                            </div>
                            <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 10px; padding: 10px 8px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                                <div style="font-size: 0.62rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; font-weight: 800;">${pNameShort}'s Star</div>
                                <div style="font-size: 1.1rem; font-weight: 800; color: #1F2937; font-family: var(--font-display);">${pNakNameLoc}</div>
                            </div>
                        </div>

                        <!-- Educational Section -->
                        <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 14px 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <h3 style="color: #111827; margin-top: 0; margin-bottom: 6px; font-size: 0.95rem; font-weight: 800; font-family: var(--font-display);">${locUiEx.vd_what_title || "The Psychology of Vedha Dosha"}</h3>
                            <p style="line-height: 1.45; margin-bottom: 10px; font-size: 0.84rem; font-weight: 500; color: #4B5563;">${locUiEx.vd_what_desc || "The term 'Vedha' translates to 'obstruction' or 'piercing'. In the cosmic blueprint, certain star constellations (Nakshatras) emit frequencies that naturally block or disrupt each other. When a couple's moons fall into these specific opposing stars, it creates an invisible energetic wall between them."}</p>
                            
                            <div style="height: 1px; background: rgba(0,0,0,0.04); margin-bottom: 10px;"></div>
                            
                            <h3 style="color: #111827; margin-top: 0; margin-bottom: 6px; font-size: 0.95rem; font-weight: 800; font-family: var(--font-display);">${locUiEx.vd_impact_title || "How it Manifests in Reality"}</h3>
                            <p style="line-height: 1.45; margin-bottom: 0; font-size: 0.84rem; font-weight: 500; color: #4B5563;">${locUiEx.vd_impact_desc || "Vedha acts as a psychological blindspot. Even with pure intentions, partners with Vedha may find their lifepaths constantly hitting structural roadblocks. It feels as if unseen forces test the relationship through sudden external hurdles or profound miscommunications. Overcoming this requires immense spiritual maturity."}</p>
                        </div>
                    </div>
                `;

                const matchManglikHtml = `
                    <div style="max-width: 850px; margin: 0 auto; font-family: var(--font-body); padding: 8px 0;">
                        
                        <!-- Top Summary Alert -->
                        <div style="background: ${matchAlertBg}; border: 1px solid ${matchAlertColor}40; border-left: 4px solid ${matchAlertColor}; border-radius: 10px; padding: 10px 12px; margin-bottom: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                            <div style="font-size: 0.98rem; font-weight: 800; font-family: var(--font-display); color: ${matchAlertColor}; margin-bottom: 4px; letter-spacing: -0.2px;">${manglikMatchTitle}</div>
                            <p style="font-size: 0.82rem; font-weight: 500; color: #374151; line-height: 1.45; margin: 0;">${manglikMatchDesc}</p>
                        </div>

                        <!-- Individual Cards -->
                        ${renderManglikCard(nNameShort, nManglik, gender === 'male')}
                        ${renderManglikCard(pNameShort, pManglik, pGender === 'male')}

                        <!-- Conclusion Box -->
                        <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; margin-top: 10px; margin-bottom: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <div style="background: ${conclusionColor}; color: white; padding: 8px 12px; font-size: 0.88rem; font-weight: 800; font-family: var(--font-display); letter-spacing: 0.4px; text-transform: uppercase;">
                                ${conclusionTitle}
                            </div>
                            <div style="padding: 10px 12px; font-size: 0.84rem; font-weight: 600; color: #1F2937; line-height: 1.45;">
                                ${conclusionText}
                            </div>
                        </div>
                        
                        <!-- Educational Insight -->
                        <div style="background: linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 100%); border-radius: 10px; padding: 10px 12px; border: 1px solid #FDE68A; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                            <div style="font-size: 0.68rem; color: #92400E; font-weight: 800; letter-spacing: 0.4px; margin-bottom: 3px; text-transform: uppercase;">${whatIsManglikTitle}</div>
                            <p style="font-size: 0.82rem; font-weight: 500; color: #78350F; line-height: 1.45; margin: 0;">
                                ${whatIsManglikDesc}
                            </p>
                        </div>
                    </div>
                `;

                
                // --- MATCHING SUMMARY TAB CALCULATION & UI GENERATION ---
                const isAshtakootaPass = milanScore.total >= 18;
                const isManglikMatch = nHas === pHas;
                
                const rajjuKoota = dashaScore.kootas.find(k => k.title.includes("Rajju"));
                const vedhaKoota = dashaScore.kootas.find(k => k.title.includes("Vedha"));
                const hasRajjuDosha = rajjuKoota ? rajjuKoota.obt === 0 : false;
                const hasVedhaDosha = vedhaKoota ? vedhaKoota.obt === 0 : false;
                
                // 5-Pillar Practical Compatibility Calculations
                const p1_emotional = Math.round(((milanScore.maitri.obt + milanScore.bhakoot.obt + milanScore.gana.obt) / 18) * 100);
                const p2_physical = Math.round(((milanScore.yoni.obt + milanScore.nadi.obt) / 12) * 100);
                const p3_wealth = Math.round(((milanScore.vashya.obt + milanScore.tara.obt + (dashaScore.kootas.find(k=>k.title.includes('Mahendra'))?.obt || 0)) / 7) * 100);
                const p4_longevity = Math.round((((rajjuKoota?.obt || 0) + (vedhaKoota?.obt || 0) + (dashaScore.kootas.find(k=>k.title.includes('Dina'))?.obt || 0)) / 10) * 100);
                const p5_spiritual = Math.round(((milanScore.varna.obt + (dashaScore.kootas.find(k=>k.title.includes('Stree'))?.obt || 0)) / 3) * 100);

                // Strengths & Growth Areas Generation
                let matchStrengths = [];
                let matchGrowthAreas = [];

                if (p1_emotional >= 70) matchStrengths.push(locUiEx.str_emotional || "Deep emotional harmony & mental wavelength alignment");
                if (p2_physical >= 70) matchStrengths.push(locUiEx.str_physical || "Excellent physical vitality, genetic compatibility & health flow");
                if (p3_wealth >= 70) matchStrengths.push(locUiEx.str_wealth || "Mutual prosperity catalyst, shared fortune & financial growth");
                if (p4_longevity >= 70) matchStrengths.push(locUiEx.str_longevity || "Strong cosmic shield protecting relationship longevity & stability");
                if (isManglikMatch) matchStrengths.push(locUiEx.str_manglik || "Balanced Martian energy parity (No dominant aggression friction)");

                if (matchStrengths.length === 0) {
                    matchStrengths.push(locUiEx.str_fallback || "Shared potential for building resilience and mutual understanding through effort");
                }

                if (p1_emotional < 60) matchGrowthAreas.push(locUiEx.gro_emotional || "Patience required during mood swings and differing communication styles");
                if (p2_physical < 60) matchGrowthAreas.push(locUiEx.gro_physical || "Prioritize shared wellness, stress management & emotional space");
                if (p3_wealth < 60) matchGrowthAreas.push(locUiEx.gro_wealth || "Maintain clear mutual financial boundaries & long-term joint planning");
                if (!isManglikMatch) matchGrowthAreas.push(locUiEx.gro_manglik || "Manage temperamental and energy pacing differences with conscious calm");
                if (hasRajjuDosha) matchGrowthAreas.push(locUiEx.gro_rajju || "Rajju vulnerability detected; adopt protective routines & avoid rash risks");
                if (hasVedhaDosha) matchGrowthAreas.push(locUiEx.gro_vedha || "Vedha friction points detected; keep communication transparent & non-judgmental");

                if (matchGrowthAreas.length === 0) {
                    matchGrowthAreas.push(locUiEx.gro_fallback || "No major friction areas; maintain open, loving communication to preserve harmony");
                }

                // Final Verdict Logic
                let verdictBadgeText = locUiEx.verdict_high_title || "🌟 Highly Recommended Match";
                let verdictSubText = locUiEx.verdict_high_desc || "Exceptional cosmic synergy! This union enjoys strong emotional bonding, auspicious dosha immunity, and great long-term prosperity.";
                let verdictBg = "linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 100%)";
                let verdictBorder = "#86EFAC";
                let verdictColor = "#065F46";
                let verdictIcon = "✨";

                if (isAshtakootaPass && isManglikMatch && !hasRajjuDosha && !hasVedhaDosha) {
                    verdictBadgeText = locUiEx.verdict_high_title || "🌟 Highly Recommended Match";
                    verdictSubText = locUiEx.verdict_high_desc || "Exceptional cosmic synergy! This union enjoys strong emotional bonding, auspicious dosha immunity, and great long-term prosperity.";
                    verdictBg = "linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 100%)";
                    verdictBorder = "#86EFAC";
                    verdictColor = "#065F46";
                    verdictIcon = "✨";
                } else if (milanScore.total >= 16 && (!hasRajjuDosha || isManglikMatch)) {
                    verdictBadgeText = locUiEx.verdict_mod_title || "⚖️ Recommended with Remedies";
                    verdictSubText = locUiEx.verdict_mod_desc || "A favorable alliance with manageable friction areas. With mutual patience and minor Vedic remedies, this relationship will flourish.";
                    verdictBg = "linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 100%)";
                    verdictBorder = "#FDE68A";
                    verdictColor = "#92400E";
                    verdictIcon = "⚖️";
                } else {
                    verdictBadgeText = locUiEx.verdict_low_title || "⚠️ Requires Astrological Consultation";
                    verdictSubText = locUiEx.verdict_low_desc || "Multiple friction points detected across core compatibility pillars. We recommend detailed natal consultation before proceeding.";
                    verdictBg = "linear-gradient(145deg, #FEF2F2 0%, #FEE2E2 100%)";
                    verdictBorder = "#FECACA";
                    verdictColor = "#991B1B";
                    verdictIcon = "🛡️";
                }
                
                const greenTickSvg = `<div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.02);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>`;
                const redCrossSvg = `<div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.02);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>`;

                const lblYes = locUiEx.lbl_yes || "Yes";
                const lblNo = locUiEx.lbl_no || "No";
                const lblPillarsTitle = locUiEx.ms_5pillars_title || "5-Pillar Marriage Compatibility Matrix";
                const lblStrengthsTitle = locUiEx.ms_strengths_title || "Key Relationship Strengths";
                const lblGrowthTitle = locUiEx.ms_growth_title || "Areas Needing Care & Understanding";
                const lblDoshasTitle = locUiEx.ms_doshas_title || "Primary Doshas & Veto Check";
                const lblRemediesTitle = locUiEx.ms_remedies_title || "Combined Marriage Harmony Remedies";

                const p1Name = locUiEx.pil_emotional || "Emotional & Mental Harmony";
                const p2Name = locUiEx.pil_physical || "Physical & Genetic Vitality";
                const p3Name = locUiEx.pil_wealth || "Financial & Destiny Growth";
                const p4Name = locUiEx.pil_longevity || "Marital Shield & Longevity";
                const p5Name = locUiEx.pil_spiritual || "Temperament & Spiritual Sync";
                
                const matchingSummaryHtml = `
                    <div style="max-width: 850px; margin: 0 auto; font-family: var(--font-body); padding: 12px 0; width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px;">
                        
                        <!-- 1. Top Verdict Banner -->
                        <div style="background: ${verdictBg}; border: 1.5px solid ${verdictBorder}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
                            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
                                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; font-family: var(--font-display); color: ${verdictColor}; letter-spacing: -0.2px;">${verdictBadgeText}</h3>
                                <span style="background: rgba(255,255,255,0.9); border: 1px solid ${verdictBorder}; color: ${verdictColor}; padding: 3px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 800;">${toNativeNum(milanScore.total, currentLang)}/36 Gunas</span>
                            </div>
                            <p style="margin: 0; font-size: 0.9rem; color: ${verdictColor}; line-height: 1.5; font-weight: 500;">
                                ${verdictSubText}
                            </p>
                        </div>

                        <!-- 2. 5-Pillar Practical Compatibility Matrix -->
                        <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 16px; padding: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                            <div style="margin-bottom: 14px;">
                                <span style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #2563EB; font-family: var(--font-ui);">📊 360° LIFE SYNERGY</span>
                                <h4 style="margin: 2px 0 0 0; font-size: 1.05rem; font-weight: 800; color: #111827; font-family: var(--font-display); letter-spacing: -0.2px;">${lblPillarsTitle}</h4>
                            </div>
                            
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <!-- Pillar 1 -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; color:#374151; margin-bottom:4px;"><span>💖 ${p1Name}</span><span style="color:#2563EB;">${toNativeNum(p1_emotional, currentLang)}%</span></div>
                                    <div style="height:6px; background:#F3F4F6; border-radius:99px; overflow:hidden;"><div style="width:${p1_emotional}%; height:100%; background:linear-gradient(90deg, #60A5FA, #2563EB); border-radius:99px;"></div></div>
                                </div>
                                <!-- Pillar 2 -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; color:#374151; margin-bottom:4px;"><span>🧬 ${p2Name}</span><span style="color:#059669;">${toNativeNum(p2_physical, currentLang)}%</span></div>
                                    <div style="height:6px; background:#F3F4F6; border-radius:99px; overflow:hidden;"><div style="width:${p2_physical}%; height:100%; background:linear-gradient(90deg, #34D399, #059669); border-radius:99px;"></div></div>
                                </div>
                                <!-- Pillar 3 -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; color:#374151; margin-bottom:4px;"><span>📈 ${p3Name}</span><span style="color:#D97706;">${toNativeNum(p3_wealth, currentLang)}%</span></div>
                                    <div style="height:6px; background:#F3F4F6; border-radius:99px; overflow:hidden;"><div style="width:${p3_wealth}%; height:100%; background:linear-gradient(90deg, #FBBF24, #D97706); border-radius:99px;"></div></div>
                                </div>
                                <!-- Pillar 4 -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; color:#374151; margin-bottom:4px;"><span>🛡️ ${p4Name}</span><span style="color:#7C3AED;">${toNativeNum(p4_longevity, currentLang)}%</span></div>
                                    <div style="height:6px; background:#F3F4F6; border-radius:99px; overflow:hidden;"><div style="width:${p4_longevity}%; height:100%; background:linear-gradient(90deg, #A78BFA, #7C3AED); border-radius:99px;"></div></div>
                                </div>
                                <!-- Pillar 5 -->
                                <div>
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; color:#374151; margin-bottom:4px;"><span>✨ ${p5Name}</span><span style="color:#DB2777;">${toNativeNum(p5_spiritual, currentLang)}%</span></div>
                                    <div style="height:6px; background:#F3F4F6; border-radius:99px; overflow:hidden;"><div style="width:${p5_spiritual}%; height:100%; background:linear-gradient(90deg, #F472B6, #DB2777); border-radius:99px;"></div></div>
                                </div>
                            </div>
                        </div>

                        <!-- 3. Strengths & Growth Areas Split Grid -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
                            <!-- Strengths -->
                            <div style="background: linear-gradient(145deg, #F0FDF4 0%, #FFFFFF 100%); border: 1.5px solid #BBF7D0; border-radius: 14px; padding: 16px; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.02); display: flex; flex-direction: column; gap: 8px;">
                                <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #166534; display: flex; align-items: center; gap: 6px;">
                                    <span>🌟</span> ${lblStrengthsTitle}
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 6px;">
                                    ${matchStrengths.map(s => `
                                        <div style="font-size: 0.86rem; color: #14532D; font-weight: 600; line-height: 1.45; display: flex; align-items: flex-start; gap: 8px;">
                                            <div style="width: 5px; height: 5px; border-radius: 50%; background: #10B981; margin-top: 6px; flex-shrink: 0;"></div>
                                            <span>${s}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Growth Focus Areas -->
                            <div style="background: linear-gradient(145deg, #FFFBEB 0%, #FFFFFF 100%); border: 1.5px solid #FDE68A; border-radius: 14px; padding: 16px; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.02); display: flex; flex-direction: column; gap: 8px;">
                                <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #92400E; display: flex; align-items: center; gap: 6px;">
                                    <span>🎯</span> ${lblGrowthTitle}
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 6px;">
                                    ${matchGrowthAreas.map(g => `
                                        <div style="font-size: 0.86rem; color: #78350F; font-weight: 600; line-height: 1.45; display: flex; align-items: flex-start; gap: 8px;">
                                            <div style="width: 5px; height: 5px; border-radius: 50%; background: #F59E0B; margin-top: 6px; flex-shrink: 0;"></div>
                                            <span>${g}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- 4. Primary Doshas & Veto Check Table -->
                        <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); overflow: hidden; width: 100%; box-sizing: border-box;">
                            <div style="background: linear-gradient(145deg, #F8FAFC 0%, #F1F5F9 100%); padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.04);">
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; font-family: var(--font-display); color: #1E293B; letter-spacing: -0.2px;">${lblDoshasTitle}</h4>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                                <span style="font-size: 0.88rem; font-weight: 700; color: #374151;">Ashtakoota Guna Milan (${toNativeNum(milanScore.total, currentLang)}/36)</span>
                                <span>${isAshtakootaPass ? greenTickSvg : redCrossSvg}</span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                                <span style="font-size: 0.88rem; font-weight: 700; color: #374151;">Manglik Match Parity (${isManglikMatch ? lblYes : lblNo})</span>
                                <span>${isManglikMatch ? greenTickSvg : redCrossSvg}</span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                                <span style="font-size: 0.88rem; font-weight: 700; color: #374151;">Rajju Dosha (Duration & Health)</span>
                                <span style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: ${hasRajjuDosha ? '#E11D48' : '#059669'};">${hasRajjuDosha ? lblYes : lblNo}</span>
                                    ${hasRajjuDosha ? redCrossSvg : greenTickSvg}
                                </span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;">
                                <span style="font-size: 0.88rem; font-weight: 700; color: #374151;">Vedha Dosha (Mutual Obstruction)</span>
                                <span style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: ${hasVedhaDosha ? '#E11D48' : '#059669'};">${hasVedhaDosha ? lblYes : lblNo}</span>
                                    ${hasVedhaDosha ? redCrossSvg : greenTickSvg}
                                </span>
                            </div>
                        </div>

                        <!-- 5. Combined Harmony Remedies -->
                        <div style="background: linear-gradient(145deg, #F0FDF4 0%, #FFFFFF 100%); border: 1.5px solid #BBF7D0; border-radius: 16px; padding: 16px 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #166534; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                                <span>📿</span> ${lblRemediesTitle}
                            </div>
                            <ul style="padding-left: 18px; margin: 0; font-size: 0.86rem; color: #14532D; line-height: 1.55; font-weight: 500;">
                                <li>${locUiEx.rem_item_1 || "Perform Lord Shiva and Goddess Parvati (Gauri-Shankar) worship together for lifelong marital bliss."}</li>
                                <li>${locUiEx.rem_item_2 || "Maintain complete transparency in financial and emotional matters; never let third parties intervene in private decisions."}</li>
                                <li>${locUiEx.rem_item_3 || "Engage in shared charitable acts or feeding cows/birds on Tuesdays and Fridays to dissolve planetary friction."}</li>
                            </ul>
                        </div>

                        <!-- Disclaimer -->
                        <div style="text-align: center; padding: 0 16px;">
                            <p style="font-weight: 500; font-style: italic; color: #9CA3AF; font-size: 0.78rem; margin: 0; line-height: 1.45;">
                                * ${locUiEx.summary_disclaimer_txt || "This summary synthesizes Ashtakoota, Dashakoota, Manglik parity, and major classical doshas. For complex cases, consult an experienced astrologer."}
                            </p>
                        </div>
                    </div>
                `;

                // =========================================================
                // NEW: RAJ JOTAK (ROYAL UNION) UI GENERATION (COMPACT)
                // =========================================================
                const isHighGuna = milanScore.total >= 28;
                const isPerfectMaitri = milanScore.maitri.obt === 5;
                const isNoNadi = milanScore.nadi.obt === 8;
                const isNoBhakoot = milanScore.bhakoot.obt === 7;
                const isRajJotak = isHighGuna && isPerfectMaitri && isNoNadi && isNoBhakoot;

                let passedPillarsCount = (isHighGuna ? 1 : 0) + (isPerfectMaitri ? 1 : 0) + (isNoBhakoot ? 1 : 0) + (isNoNadi ? 1 : 0);

                const rjTitle = isRajJotak ? (locUiEx.rj_alert_true_title || "👑 Raj Jotak Formed (Royal Union)") : (locUiEx.rj_alert_false_title || "Standard Astrological Union");
                const rjDesc = isRajJotak ? (locUiEx.rj_alert_true_desc || "Exceptional! Your alignment creates a 'Raj Jotak'—a rare, highly auspicious cosmic bond granting sudden fortune, profound emotional peace, and an unshakeable team dynamic.") : (locUiEx.rj_alert_false_desc || "While this union holds positive compatibility, the strict 4-pillar planetary criteria for a 'Raj Jotak' (Royal Union) are partially met. This is standard in Vedic matchmaking and indicates a healthy, normal relationship.");
                const rjBg = isRajJotak ? "linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 100%)" : "linear-gradient(145deg, #F8FAFC 0%, #F1F5F9 100%)";
                const rjBorder = isRajJotak ? "#F59E0B" : "#CBD5E1";
                const rjColor = isRajJotak ? "#92400E" : "#334155";
                const rjIcon = isRajJotak ? "👑" : "⚖️";
                const rjBadge = isRajJotak ? (locUiEx.rj_badge_royal || "100% ROYAL ALIGNMENT") : `${toNativeNum(passedPillarsCount, currentLang)}/4 ${locUiEx.rj_badge_standard || "Pillars Met"}`;

                const createPillarCard = (icon, title, scoreText, isPassed, subText) => {
                    let cardBg = isPassed ? "linear-gradient(145deg, #F0FDF4 0%, #FFFFFF 100%)" : "linear-gradient(145deg, #FFFBEB 0%, #FFFFFF 100%)";
                    let cardBorder = isPassed ? "#86EFAC" : "#FDE68A";
                    let badgeBg = isPassed ? "#DCFCE7" : "#FEF3C7";
                    let badgeColor = isPassed ? "#166534" : "#92400E";
                    let statusLabel = isPassed ? (locUiEx.rj_status_met || "MET") : (locUiEx.rj_status_unmet || "PARTIAL");

                    return `
                    <div style="background: ${cardBg}; border: 1.2px solid ${cardBorder}; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.95rem;">${icon}</span>
                            <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 1.5px 6px; border-radius: 99px; font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px;">${statusLabel}</span>
                        </div>
                        <div>
                            <div style="font-size: 0.86rem; font-weight: 800; color: #111827; font-family: var(--font-display); letter-spacing: -0.2px;">${title}</div>
                            <div style="font-size: 0.78rem; font-weight: 800; color: ${isPassed ? '#059669' : '#D97706'}; margin-top: 1px;">${scoreText}</div>
                        </div>
                        <p style="margin: 0; font-size: 0.74rem; color: #6B7280; line-height: 1.35; font-weight: 500;">${subText}</p>
                    </div>
                    `;
                };

                const p1Card = createPillarCard("🏆", locUiEx.rj_p1_title || "Guna Milestone", `${toNativeNum(milanScore.total, currentLang)}/36 ${locUiEx.lbl_gun_milan_short || "Gunas"}`, isHighGuna, locUiEx.rj_p1_sub || "Requires 28+ points for auspicious energetic sync.");
                const p2Card = createPillarCard("🧠", locUiEx.rj_p2_title || "Graha Maitri", `${toNativeNum(milanScore.maitri.obt, currentLang)}/5 ${locUiEx.lbl_points_short || "Pts"}`, isPerfectMaitri, locUiEx.rj_p2_sub || "Requires 5/5 for complete intellectual & mental alignment.");
                const p3Card = createPillarCard("💖", locUiEx.rj_p3_title || "Bhakoot Harmony", `${toNativeNum(milanScore.bhakoot.obt, currentLang)}/7 ${locUiEx.lbl_points_short || "Pts"}`, isNoBhakoot, locUiEx.rj_p3_sub || "Requires 7/7 for emotional elasticity & wealth multiplier.");
                const p4Card = createPillarCard("🧬", locUiEx.rj_p4_title || "Nadi Vitality", `${toNativeNum(milanScore.nadi.obt, currentLang)}/8 ${locUiEx.lbl_points_short || "Pts"}`, isNoNadi, locUiEx.rj_p4_sub || "Requires 8/8 for genetic health, vitality & progeny blessings.");

                const matchRajJotakHtml = `
                    <div style="max-width: 850px; margin: 0 auto; font-family: var(--font-body); padding: 8px 0; display: flex; flex-direction: column; gap: 10px;">
                        
                        <!-- 1. Header Section -->
                        <div style="margin-bottom: 2px;">
                            <h2 style="font-family: var(--font-display); color: #111827; font-size: clamp(1.15rem, 4vw, 1.3rem); font-weight: 800; margin: 0 0 3px 0; border-left: 4px solid #F59E0B; padding-left: 10px; letter-spacing: -0.3px;">${locUiEx.rj_insight_title || "Raj Jotak <span style=\"color: #F59E0B;\">(Royal Union)</span>"}</h2>
                            <p style="color: #6B7280; font-size: 0.82rem; font-weight: 600; margin: 0 0 0 14px;">${locUiEx.rj_insight_subtitle || "Evaluating the rarest and most auspicious marital alignment"}</p>
                        </div>

                        <!-- 2. Royal Status Alert Banner -->
                        <div style="background: ${rjBg}; border: 1.2px solid ${rjBorder}; border-radius: 12px; padding: 14px 16px; text-align: center; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.03);">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 4px;">
                                <span style="font-size: 1.3rem;">${rjIcon}</span>
                                <span style="background: rgba(255,255,255,0.9); border: 1px solid ${rjBorder}; color: ${rjColor}; padding: 2px 8px; border-radius: 99px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4px;">${rjBadge}</span>
                            </div>
                            <div style="font-size: 1.05rem; font-weight: 800; font-family: var(--font-display); color: ${rjColor}; margin-bottom: 4px; letter-spacing: -0.2px;">${rjTitle}</div>
                            <p style="font-size: 0.84rem; color: ${rjColor}; font-weight: 500; line-height: 1.45; margin: 0; max-width: 580px; margin-left: auto; margin-right: auto;">${rjDesc}</p>
                        </div>

                        <!-- 3. The 4 Pillars 2x2 Interactive Micro-Grid -->
                        <div>
                            <div style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #D97706; margin-bottom: 6px; font-family: var(--font-ui);">⚡ ${locUiEx.rj_req_title || "The 4 Pillars of Raj Jotak"}</div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
                                ${p1Card}
                                ${p2Card}
                                ${p3Card}
                                ${p4Card}
                            </div>
                        </div>

                        <!-- 4. Astrological Foundations Chip Bar -->
                        <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.04); border-radius: 12px; padding: 12px 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                            <div style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #4B5563; margin-bottom: 8px; font-family: var(--font-ui);">🌙 ${locUiEx.rj_astro_title || "Astrological Foundations"}</div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px; text-align: center;">
                                    <div style="font-size: 0.62rem; color: #6B7280; font-weight: 800; text-transform: uppercase; margin-bottom: 2px;">${nNameShort}</div>
                                    <div style="font-size: 0.95rem; font-weight: 800; color: #1F2937; font-family: var(--font-display);">${bZodName}</div>
                                    <div style="font-size: 0.72rem; color: #4B5563; font-weight: 600; margin-top: 1px;">${getLocalNakshatra(panchang.nakshatra).split(' ')[0]} (${getLocalPlanet(nSignLord.substring(0,3))})</div>
                                </div>
                                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px; text-align: center;">
                                    <div style="font-size: 0.62rem; color: #6B7280; font-weight: 800; text-transform: uppercase; margin-bottom: 2px;">${pNameShort}</div>
                                    <div style="font-size: 0.95rem; font-weight: 800; color: #1F2937; font-family: var(--font-display);">${gZodName}</div>
                                    <div style="font-size: 0.72rem; color: #4B5563; font-weight: 600; margin-top: 1px;">${getLocalNakshatra(pPanchang.nakshatra).split(' ')[0]} (${getLocalPlanet(pSignLord.substring(0,3))})</div>
                                </div>
                            </div>
                        </div>

                        <!-- 5. Educational Insights Card -->
                        <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 14px 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 10px;">
                            <div>
                                <h3 style="color: #111827; margin: 0 0 4px 0; font-size: 0.92rem; font-weight: 800; font-family: var(--font-display);">${locUiEx.rj_what_title || "What exactly is Raj Jotak?"}</h3>
                                <p style="line-height: 1.45; margin: 0; font-size: 0.84rem; font-weight: 500; color: #4B5563;">${locUiEx.rj_what_desc || "In Vedic matchmaking, 'Raj Jotak' (Royal Union) is the pinnacle of auspicious alignments. It occurs when a couple achieves a high Ashtakoota score (28+) alongside perfect planetary friendship (Graha Maitri 5/5) without structural blemishes like Nadi or Bhakoot Dosha."}</p>
                            </div>
                            
                            <div style="height: 1px; background: rgba(0,0,0,0.04);"></div>
                            
                            <div>
                                <h3 style="color: #111827; margin: 0 0 4px 0; font-size: 0.92rem; font-weight: 800; font-family: var(--font-display);">${locUiEx.rj_impact_title || "The Destiny & Wealth Acceleration Effect"}</h3>
                                <p style="line-height: 1.45; margin: 0; font-size: 0.84rem; font-weight: 500; color: #4B5563;">${locUiEx.rj_impact_desc || "Partners in a Raj Jotak act as immense fortune multipliers. Post-marriage, they experience financial stability, profound mutual emotional safety, and a natural ability to conquer life's trials as a deeply unified team."}</p>
                            </div>

                            <div style="height: 1px; background: rgba(0,0,0,0.04);"></div>

                            <div>
                                <h3 style="color: #111827; margin: 0 0 4px 0; font-size: 0.92rem; font-weight: 800; font-family: var(--font-display);">${locUiEx.rj_advice_title || "Relationship Growth Key"}</h3>
                                <p style="line-height: 1.45; margin: 0; font-size: 0.84rem; font-weight: 500; color: #4B5563;">${locUiEx.rj_advice_desc || "Regardless of astrological alignment, lifelong partnership thrives on transparent communication, mutual compromise, and choosing love over ego daily."}</p>
                            </div>
                        </div>
                    </div>
                `;

                const dashboardHtml = `
                    <div class="top-nav-tabs match-nav-tabs visible">
                        <button class="top-tab match-tab active" data-target="match-panel-birth" data-i18n="tab_birth">Birth Details</button>
                        <button class="top-tab match-tab" data-target="match-panel-basicastro" data-i18n="tab_astro">Basic Astro</button>
                        <button class="top-tab match-tab" data-target="match-panel-planetary" data-i18n="tab_planetary">Planetary Positions</button>
                        <button class="top-tab match-tab" data-target="match-panel-charts" data-i18n="tab_charts">Charts</button>
                        <button class="top-tab match-tab" data-target="match-panel-ashtakoota" data-i18n="tab_ashtakoota">Ashtakoota Milan</button>
                        <button class="top-tab match-tab" data-target="match-panel-dashakoota" data-i18n="tab_dashakoota">Dashakoota</button>
                        <button class="top-tab match-tab" data-target="match-panel-bhakoot" data-i18n="tab_bhakoot">Bhakoot Insight</button>
                        <button class="top-tab match-tab" data-target="match-panel-manglik" data-i18n="tab_manglik">Match Manglik</button>
                        <button class="top-tab match-tab" data-target="match-panel-nadi" data-i18n="tab_nadi">Nadi Dosha</button>
                        <button class="top-tab match-tab" data-target="match-panel-vedha" data-i18n="tab_vedha">Vedha Dosha</button>
                        <button class="top-tab match-tab" data-target="match-panel-rajjotak" data-i18n="tab_raj_jotak">Raj Jotak</button>
                        <button class="top-tab match-tab" data-target="match-panel-summary" data-i18n="tab_summary">Matching Summary</button>
                    </div>
                    <div id="match-panel-birth" class="top-tab-panel match-tab-panel active">${compareHtml}</div>
                    <div id="match-panel-basicastro" class="top-tab-panel match-tab-panel">${basicAstroHtml}</div>
                    <div id="match-panel-planetary" class="top-tab-panel match-tab-panel">${planetaryComparisonHtml}</div>
                    <div id="match-panel-charts" class="top-tab-panel match-tab-panel">${matchChartsHtml}</div>
                    <div id="match-panel-ashtakoota" class="top-tab-panel match-tab-panel">${html}</div>
                    <div id="match-panel-dashakoota" class="top-tab-panel match-tab-panel">${dashakootaHtml}</div>
                    <div id="match-panel-bhakoot" class="top-tab-panel match-tab-panel">${bhakootInsightHtml}</div>
                    <div id="match-panel-manglik" class="top-tab-panel match-tab-panel">${matchManglikHtml}</div>
                    <div id="match-panel-nadi" class="top-tab-panel match-tab-panel">${matchNadiHtml}</div>
                    <div id="match-panel-vedha" class="top-tab-panel match-tab-panel">${matchVedhaHtml}</div>
                    <div id="match-panel-rajjotak" class="top-tab-panel match-tab-panel">${matchRajJotakHtml}</div>
                    <div id="match-panel-summary" class="top-tab-panel match-tab-panel">${matchingSummaryHtml}</div>
                `;
                dashboard.innerHTML = dashboardHtml;
                applyTranslations();
                setTimeout(() => { if (window.renderMatchChart) window.renderMatchChart(); }, 100);


                // Attach event listeners to the new Matchmaking tabs
                document.querySelectorAll(".match-tab").forEach(tab => {
                    tab.addEventListener("click", () => {
                        document.querySelectorAll(".match-tab").forEach(t => t.classList.remove("active"));
                        document.querySelectorAll(".match-tab-panel").forEach(p => p.classList.remove("active"));
                        tab.classList.add("active");
                        document.getElementById(tab.dataset.target).classList.add("active");
                    });
                });

                status.textContent = "✅ Matchmaking calculated successfully!";
                setTimeout(() => status.classList.remove("visible"), 3000);
                
                btn.classList.remove("loading");
                btn.disabled = false;
                toggleInputForm('collapse');
          } catch (error) {
            console.error("Calculation error:", error);
            status.textContent = "❌ Error: " + error.message;
          }

          btn.classList.remove("loading");
          btn.disabled = false;
        }, 600);
      }

      // Update birth details display


      // ===== UTILITY FUNCTIONS =====


      function getHouseFromSign(sign, lagna) {
        return ((sign - lagna + 12) % 12) + 1;
      }

      function getSignFromHouse(house, lagna) {
        return ((house - 1 + lagna - 1) % 12) + 1;
      }

      // ===== CHART RENDERING =====

      // North Indian Chart - High Detail Multi-Color Version
      function renderNorthChart(containerId, planets, lagna) {
        const container = document.getElementById(containerId);
        const size = 650;
        const center = size / 2;
        const outerSize = size * 0.395;
        const margin = 48;

        // House color mapping (Premium Gradient Theme)
        const houseColors = {
          1: `url(#btnGrad_${containerId})`, 4: `url(#btnGrad_${containerId})`, 7: `url(#btnGrad_${containerId})`, 10: `url(#btnGrad_${containerId})`, // Center houses gradient
          2: "#FFFFFF", 3: "#FFFFFF", 5: "#FFFFFF", 6: "#FFFFFF",
          8: "#FFFFFF", 9: "#FFFFFF", 11: "#FFFFFF", 12: "#FFFFFF", // Outer houses (White)
        };

        // House significations for display (Dynamic from JSON)
        const uiEx = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra) ? localizedParagraphs[currentLang].ui_extra : {};
        const houseDetails = {
          1: { num: uiEx.h_1 || "1st House", meaning: uiEx.h_1_d || "Self, Appearance", dir: "East" },
          2: { num: uiEx.h_2 || "2nd House", meaning: uiEx.h_2_d || "Wealth, Family", dir: "NE" },
          3: { num: uiEx.h_3 || "3rd House", meaning: uiEx.h_3_d || "Courage, Siblings", dir: "NE" },
          4: { num: uiEx.h_4 || "4th House", meaning: uiEx.h_4_d || "Home, Comforts", dir: "North" },
          5: { num: uiEx.h_5 || "5th House", meaning: uiEx.h_5_d || "Creativity, Children", dir: "NW" },
          6: { num: uiEx.h_6 || "6th House", meaning: uiEx.h_6_d || "Health, Enemies", dir: "NW" },
          7: { num: uiEx.h_7 || "7th House", meaning: uiEx.h_7_d || "Marriage, Partners", dir: "West" },
          8: { num: uiEx.h_8 || "8th House", meaning: uiEx.h_8_d || "Longevity, Mystery", dir: "SW" },
          9: { num: uiEx.h_9 || "9th House", meaning: uiEx.h_9_d || "Luck, Dharma", dir: "SW" },
          10: { num: uiEx.h_10 || "10th House", meaning: uiEx.h_10_d || "Career, Status", dir: "South" },
          11: { num: uiEx.h_11 || "11th House", meaning: uiEx.h_11_d || "Income, Gains", dir: "SE" },
          12: { num: uiEx.h_12 || "12th House", meaning: uiEx.h_12_d || "Losses, Foreign", dir: "SE" },
        };
        const tDir = (dirStr) => {
            const uiEx = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra) ? localizedParagraphs[currentLang].ui_extra : {};
            const dMap = {
                "E": uiEx.dir_E || "E", 
                "N": uiEx.dir_N || "N", 
                "W": uiEx.dir_W || "W", 
                "S": uiEx.dir_S || "S", 
                "North East": uiEx.dir_NE || "North East", 
                "North West": uiEx.dir_NW || "North West", 
                "South West": uiEx.dir_SW || "South West", 
                "South East": uiEx.dir_SE || "South East"
            };
            return dMap[dirStr] || dirStr;
        };

        // Calculate polygon points for each house
        const top = center - outerSize;
        const bottom = center + outerSize;
        const left = center - outerSize;
        const right = center + outerSize;
        // We want a square from 'left,top' to 'right,bottom'.
        const p_LT = { x: left, y: top };
        const p_RT = { x: right, y: top };
        const p_RB = { x: right, y: bottom };
        const p_LB = { x: left, y: bottom };

        const p_MT = { x: center, y: top };
        const p_MR = { x: right, y: center };
        const p_MB = { x: center, y: bottom };
        const p_ML = { x: left, y: center };

        const p_C = { x: center, y: center };

        const p_TL_mid = { x: (left + center) / 2, y: (top + center) / 2 };
        const p_TR_mid = { x: (right + center) / 2, y: (top + center) / 2 };
        const p_BL_mid = { x: (left + center) / 2, y: (bottom + center) / 2 };
        const p_BR_mid = { x: (right + center) / 2, y: (bottom + center) / 2 };

        function getOgeeFromMid(A, B, outTarget) {
          const mx = (A.x + B.x) / 2;
          const my = (A.y + B.y) / 2;
          const vx = outTarget.x - mx;
          const vy = outTarget.y - my;
          const k1 = 0.15;
          const c1x = A.x + (B.x - A.x) * 0.2 - vx * k1;
          const c1y = A.y + (B.y - A.y) * 0.2 - vy * k1;
          const k2 = 0.25;
          const c2x = A.x + (B.x - A.x) * 0.8 + vx * k2;
          const c2y = A.y + (B.y - A.y) * 0.8 + vy * k2;
          return `C ${c1x},${c1y} ${c2x},${c2y} ${B.x},${B.y}`;
        }

        function getOgeeToMid(A, B, outTarget) {
          const mx = (A.x + B.x) / 2;
          const my = (A.y + B.y) / 2;
          const vx = outTarget.x - mx;
          const vy = outTarget.y - my;
          const k1 = 0.25;
          const c1x = A.x + (B.x - A.x) * 0.2 + vx * k1;
          const c1y = A.y + (B.y - A.y) * 0.2 + vy * k1;
          const k2 = 0.15;
          const c2x = A.x + (B.x - A.x) * 0.8 - vx * k2;
          const c2y = A.y + (B.y - A.y) * 0.8 - vy * k2;
          return `C ${c1x},${c1y} ${c2x},${c2y} ${B.x},${B.y}`;
        }

        // Define house paths for manuscript style curved chart
        const housePaths = {
          1: `M ${p_MT.x},${p_MT.y} ${getOgeeFromMid(p_MT, p_TR_mid, p_RT)} L ${p_C.x},${p_C.y} L ${p_TL_mid.x},${p_TL_mid.y} ${getOgeeToMid(p_TL_mid, p_MT, p_LT)} Z`,
          2: `M ${p_MT.x},${p_MT.y} L ${p_LT.x},${p_LT.y} L ${p_TL_mid.x},${p_TL_mid.y} ${getOgeeToMid(p_TL_mid, p_MT, p_LT)} Z`,
          3: `M ${p_LT.x},${p_LT.y} L ${p_ML.x},${p_ML.y} ${getOgeeFromMid(p_ML, p_TL_mid, p_LT)} L ${p_TL_mid.x},${p_TL_mid.y} Z`,
          4: `M ${p_ML.x},${p_ML.y} ${getOgeeFromMid(p_ML, p_TL_mid, p_LT)} L ${p_C.x},${p_C.y} L ${p_BL_mid.x},${p_BL_mid.y} ${getOgeeToMid(p_BL_mid, p_ML, p_LB)} Z`,
          5: `M ${p_ML.x},${p_ML.y} L ${p_LB.x},${p_LB.y} L ${p_BL_mid.x},${p_BL_mid.y} ${getOgeeToMid(p_BL_mid, p_ML, p_LB)} Z`,
          6: `M ${p_LB.x},${p_LB.y} L ${p_MB.x},${p_MB.y} ${getOgeeFromMid(p_MB, p_BL_mid, p_LB)} L ${p_BL_mid.x},${p_BL_mid.y} Z`,
          7: `M ${p_MB.x},${p_MB.y} ${getOgeeFromMid(p_MB, p_BR_mid, p_RB)} L ${p_C.x},${p_C.y} L ${p_BL_mid.x},${p_BL_mid.y} ${getOgeeToMid(p_BL_mid, p_MB, p_LB)} Z`,
          8: `M ${p_MB.x},${p_MB.y} L ${p_RB.x},${p_RB.y} L ${p_BR_mid.x},${p_BR_mid.y} ${getOgeeToMid(p_BR_mid, p_MB, p_RB)} Z`,
          9: `M ${p_RB.x},${p_RB.y} L ${p_MR.x},${p_MR.y} ${getOgeeFromMid(p_MR, p_BR_mid, p_RB)} L ${p_BR_mid.x},${p_BR_mid.y} Z`,
          10: `M ${p_MR.x},${p_MR.y} ${getOgeeFromMid(p_MR, p_BR_mid, p_RB)} L ${p_C.x},${p_C.y} L ${p_TR_mid.x},${p_TR_mid.y} ${getOgeeToMid(p_TR_mid, p_MR, p_RT)} Z`,
          11: `M ${p_MR.x},${p_MR.y} L ${p_RT.x},${p_RT.y} L ${p_TR_mid.x},${p_TR_mid.y} ${getOgeeToMid(p_TR_mid, p_MR, p_RT)} Z`,
          12: `M ${p_RT.x},${p_RT.y} L ${p_MT.x},${p_MT.y} ${getOgeeFromMid(p_MT, p_TR_mid, p_RT)} L ${p_TR_mid.x},${p_TR_mid.y} Z`,
        };

        // House centers for text placement
        let __cx = center;
        let __cy = center;
        let __q = outerSize * 0.5; // distance from center to mid
        const hq = outerSize * 0.25; // half quadrant

        const cx = center;
        const cy = center;
        const q = outerSize * 0.5;

        // ୧. କେବଳ ରାଶି ନମ୍ବର (Number) ପାଇଁ ଲୋକେସନ୍
        const numberOffsets = {
          1:  { x:  0.0, y: -0.35 },
          2:  { x: -1.08, y: -1.25 },
          3:  { x: -1.2, y: -1.08 },
          4:  { x: -0.35, y:  0.0 },
          5:  { x: -1.25, y:  1.05 },
          6:  { x: -1.08, y:  1.20 },
          7:  { x:  0.0, y:  0.35 },
          8:  { x:  1.10, y:  1.25 },
          9:  { x:  1.19, y:  1.08 },
          10: { x:  0.35, y:  0.0 },
          11: { x:  1.25, y: -1.08 },
          12: { x:  1.05, y: -1.20 }
        };

        // ୨. କେବଳ ରାଶି ଆଇକନ୍ (Zodiac Symbol) ପାଇଁ ଲୋକେସନ୍ (ନମ୍ବର ଠାରୁ ଭିତର ଆଡ଼କୁ)
        const iconOffsets = {
          1:  { x:  0.0, y: -0.65 },
          2:  { x: -1.08, y: -1.45 },
          3:  { x: -1.38, y: -1.08 },
          4:  { x: -0.58, y:  0.0 },
          5:  { x: -1.47, y:  1.05 },
          6:  { x: -1.08, y:  1.38 },
          7:  { x:  0.0, y:  0.57 },
          8:  { x:  1.20, y:  1.42 },
          9:  { x:  1.35, y:  1.10 },
          10: { x:  0.56, y: 0.00 },
          11: { x:  1.46, y: -1.08 },
          12: { x:  1.08, y: -1.35 }
        };

        const numberCenters = {};
        const iconCenters = {};
        for (let i = 1; i <= 12; i++) {
            numberCenters[i] = {
                x: cx + (numberOffsets[i].x * q),
                y: cy + (numberOffsets[i].y * q)
            };
            iconCenters[i] = {
                x: cx + (iconOffsets[i].x * q),
                y: cy + (iconOffsets[i].y * q)
            };
        }

        // Planet placement coordinates (ମାନୁଆଲି ଆଡଜଷ୍ଟ୍ କରିବା ପାଇଁ)
        const planetOffsets = {
          1:  { x:  0.0,  y: -1.25 },
          2:  { x: -1.4,  y: -1.83 },
          3:  { x: -1.7,  y: -1.4  },
          4:  { x: -1.00, y:  0.0  },
          5:  { x: -1.8,  y:  1.0  },
          6:  { x: -1.10,  y:  1.55  },
          7:  { x:  0.0,  y:  1.00 },
          8:  { x:  1.2,  y:  1.63  },
          9:  { x:  1.7,  y:  1.4  },
          10: { x:  1.00, y:  0.0  },
          11: { x:  1.7,  y: -1.4  },
          12: { x:  0.9,  y: -1.85  }
        };

        const pCenter = {};
        for (let i = 1; i <= 12; i++) {
            pCenter[i] = {
                x: cx + (planetOffsets[i].x * q),
                y: cy + (planetOffsets[i].y * q)
            };
        }

        let svg = `
                <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="max-width: 100%; height: auto;" xmlns="http://www.w3.org/2000/svg" class="north-chart-svg">
                    <defs>
                        <!-- Gradients for each house color -->
                        <linearGradient id="yellowGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FFFFB3;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#FFFF80;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="purpleGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#EDD5F0;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#D4A8DB;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="pinkGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FFCCE0;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#F5A0C0;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="orangeGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FFE8CC;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#FFD699;stop-opacity:1" />
                        </linearGradient>
                        <filter id="houseShadow_${containerId}" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.2"/>
                        </filter>
                        <filter id="textShadow_${containerId}" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" flood-opacity="0.3"/>
                        </filter>
                        <filter id="glowEffect_${containerId}" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
                            <feComponentTransfer in="coloredBlur" result="dimmedBlur">
                                <feFuncA type="linear" slope="0.5"/>
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode in="dimmedBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                        <!-- New Gradients as per user request -->
                        <linearGradient id="btnGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FF6B00;stop-opacity:0.12" />
                            <stop offset="100%" style="stop-color:#F43F5E;stop-opacity:0.12" />
                        </linearGradient>
                        <linearGradient id="btnGradSolid_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FF6B00;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#F43F5E;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="redBorderGrad_${containerId}" x1="0" y1="0" x2="${size}" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" style="stop-color:#8B1D1F;stop-opacity:1" />
                            <stop offset="45%" style="stop-color:#C4131A;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#E83D23;stop-opacity:1" />
                        </linearGradient>
                        <filter id="emblemGlow_${containerId}" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="2" result="blur"/>
                            <feComponentTransfer in="blur" result="dimmedBlur">
                                <feFuncA type="linear" slope="0.4"/>
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode in="dimmedBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <!-- Outer Frame Background -->
                    <rect x="${margin - 10}" y="${margin - 10}" width="${size - (margin - 10) * 2}" height="${size - (margin - 10) * 2}" 
                          fill="#FDF8EE" stroke="url(#redBorderGrad_${containerId})" stroke-width="6" rx="10"/>
                    
                    <!-- Inner decorative border -->
                    <rect x="${margin}" y="${margin}" width="${size - margin * 2}" height="${size - margin * 2}" 
                          fill="none" stroke="url(#redBorderGrad_${containerId})" stroke-width="2" stroke-dasharray="5,3" rx="6" opacity="0.85"/>
                    
                    <!-- QUADRANT LABELS (Outside the chart) -->
                    <!-- Top: 1st Quadrant -->
                    <text x="${center}" y="${margin - 25}" text-anchor="middle" 
                          style="fill: #5D0000; font-weight: 700; font-size: 11px; font-family: var(--font-display); letter-spacing: 1px;">
                        ${(localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra && localizedParagraphs[currentLang].ui_extra.quad1) ? localizedParagraphs[currentLang].ui_extra.quad1 : "1st QUADRANT: SELF & PERSONAL IDENTITY"}
                    </text>
                    
                    <!-- Left: 2nd Quadrant -->
                    <text x="${margin - 18}" y="${center}" text-anchor="middle" 
                          transform="rotate(-90 ${margin - 18} ${center})"
                          style="fill: #5D0000; font-weight: 700; font-size: 10px; font-family: var(--font-display); letter-spacing: 1px;">
                        ${(localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra && localizedParagraphs[currentLang].ui_extra.quad2) ? localizedParagraphs[currentLang].ui_extra.quad2 : "2nd QUADRANT: FAMILY & RELATIONSHIPS"}
                    </text>
                    
                    <!-- Bottom: 3rd Quadrant -->
                    <text x="${center}" y="${size - margin + 28}" text-anchor="middle" 
                          style="fill: #5D0000; font-weight: 700; font-size: 10px; font-family: var(--font-display); letter-spacing: 1px;">
                        ${(localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra && localizedParagraphs[currentLang].ui_extra.quad3) ? localizedParagraphs[currentLang].ui_extra.quad3 : "3rd QUADRANT: INTERACTION WITH OTHERS"}
                    </text>
                    
                    <!-- Right: 4th Quadrant -->
                    <text x="${size - margin + 18}" y="${center}" text-anchor="middle" 
                          transform="rotate(90 ${size - margin + 18} ${center})"
                          style="fill: #5D0000; font-weight: 700; font-size: 10px; font-family: var(--font-display); letter-spacing: 1px;">
                        ${(localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra && localizedParagraphs[currentLang].ui_extra.quad4) ? localizedParagraphs[currentLang].ui_extra.quad4 : "4th QUADRANT: SOCIETY & PROFESSION"}
                    </text>
            `;

        // Draw filled house polygons
        for (let house = 1; house <= 12; house++) {
          const color = houseColors[house];

          svg += `<path id="chart-house-${house}" class="house-section interactable-house house-${house}" onclick="if(window.selectHouse) window.selectHouse(${house})" onmouseenter="if(window.handleHouseEnter) window.handleHouseEnter(event, ${house})" onmousemove="if(window.moveAstroTooltip) window.moveAstroTooltip(event)" onmouseleave="if(window.handleMouseLeave) window.handleMouseLeave()" d="${housePaths[house]}" 
            fill="${color}" 
            stroke="none" 
            data-house="${house}" 
            filter="url(#houseShadow_${containerId})"/>`;
        }

        // Draw the main diamond frame with custom borders
        svg += `
                <!-- Outer Square Frame -->
                <polygon points="${left},${top} ${right},${top} ${right},${bottom} ${left},${bottom}" 
                         fill="none" stroke="url(#redBorderGrad_${containerId})" stroke-width="2.5"/>
                
                <!-- Inner Diamond -->
                <path d="M ${p_MT.x},${p_MT.y} ${getOgeeFromMid(p_MT, p_TR_mid, p_RT)} L ${p_TR_mid.x},${p_TR_mid.y} ${getOgeeToMid(p_TR_mid, p_MR, p_RT)} L ${p_MR.x},${p_MR.y} ${getOgeeFromMid(p_MR, p_BR_mid, p_RB)} L ${p_BR_mid.x},${p_BR_mid.y} ${getOgeeToMid(p_BR_mid, p_MB, p_RB)} L ${p_MB.x},${p_MB.y} ${getOgeeFromMid(p_MB, p_BL_mid, p_LB)} L ${p_BL_mid.x},${p_BL_mid.y} ${getOgeeToMid(p_BL_mid, p_ML, p_LB)} L ${p_ML.x},${p_ML.y} ${getOgeeFromMid(p_ML, p_TL_mid, p_LT)} L ${p_TL_mid.x},${p_TL_mid.y} ${getOgeeToMid(p_TL_mid, p_MT, p_LT)} Z" 
                         fill="none" stroke="url(#btnGradSolid_${containerId})" stroke-width="2.5"/>
                
                <!-- Cross lines (Diagonals of outer square) -->
                <line x1="${left}" y1="${top}" x2="${right}" y2="${bottom}" stroke="url(#redBorderGrad_${containerId})" stroke-width="1.5" opacity="0.6"/>
                <line x1="${right}" y1="${top}" x2="${left}" y2="${bottom}" stroke="url(#redBorderGrad_${containerId})" stroke-width="1.5" opacity="0.6"/>
            `;

        // Direction labels at key positions
        const directions = [
          // Main Directions (ମଝି ଦିଗ ଗୁଡିକ)
          { x: center, y: top - 8, text: "E", size: 11 },
          { x: left - 12, y: center, text: "N", size: 11 },
          { x: center, y: bottom + 14, text: "W", size: 11 },
          { x: right + 12, y: center, text: "S", size: 11 },

          // North East (Top-Left)
          { x: left + 45, y: top - 6, text: "North East", size: 10 },
          {
            x: left - 8,
            y: top + 45,
            text: "North East",
            size: 10,
            rotate: -90,
          },

          // North West (Bottom-Left)
          {
            x: left - 8,
            y: bottom - 45,
            text: "North West",
            size: 10,
            rotate: -90,
          },
          { x: left + 45, y: bottom + 14, text: "North West", size: 10 },

          // South West (Bottom-Right)
          { x: right - 45, y: bottom + 14, text: "South West", size: 10 },
          {
            x: right + 8,
            y: bottom - 45,
            text: "South West",
            size: 10,
            rotate: 90,
          },

          // South East (Top-Right)
          {
            x: right + 8,
            y: top + 45,
            text: "South East",
            size: 10,
            rotate: 90,
          },
          { x: right - 45, y: top - 6, text: "South East", size: 10 },
        ];

        directions.forEach((dir) => {
          const transform = dir.rotate
            ? `transform="rotate(${dir.rotate} ${dir.x} ${dir.y})"`
            : "";
          svg += `<text x="${dir.x}" y="${dir.y}" text-anchor="middle" ${transform}
                              style="fill: #8B4513; font-weight: 700; font-size: ${dir.size}px; font-family: var(--font-ui);">${tDir(dir.text)}</text>`;
        });

        // New Position Only For numbers House Label
        const houseLabelPos = {
          1: { x: center, y: top + 33 },
          2: { x: center - q + 56, y: top + 14 },
          3: { x: left + 20, y: center - q + 59 }, // Increased 'y' to move it DOWN
          4: { x: left + 45, y: center - 14 },
          5: { x: left + 23, y: center + q - 82 }, // Decreased 'y' to move it UP
          6: { x: center - q + 58, y: bottom - 39 },
          7: { x: center, y: bottom - 58 },
          8: { x: center + q - 55, y: bottom - 39 },
          9: { x: right - 18, y: center + q - 89 }, // Decreased 'y' to move it UP
          10: { x: right - 45, y: center - 14 },
          11: { x: right - 21, y: center - q + 58 }, // Increased 'y' to move it DOWN
          12: { x: center + q - 54, y: top + 14 },
        };

        // Add content to each house
        for (let house = 1; house <= 12; house++) {
          const sign = getSignFromHouse(house, lagna);
          const zodiac = zodiacSigns[sign - 1];
          const details = houseDetails[house];

          // Adjust text positions based on house location
          const isCorner = [1, 2, 5, 8, 11].includes(house);
          const isSmall = [3, 4, 6, 7, 9, 10, 12].includes(house);
          const textScale = isSmall ? 0.8 : 1;

          const lblPos = houseLabelPos[house];
          const numParts = details.num.split(" "); // ଏହା "1st House" କୁ ଦୁଇ ଭାଗରେ ବାଣ୍ଟିବ

          // Layer 1: House Number (Positioned at corners/edges in two lines)
          svg += `<text text-anchor="middle" 
                              style="fill: #5D0000; font-weight: 800; font-size: ${10.5 * textScale}px; font-family: var(--font-ui); letter-spacing: 0.5px;">
                              <tspan x="${lblPos.x}" y="${lblPos.y}">${numParts[0]}</tspan>
                              <tspan x="${lblPos.x}" dy="12">${numParts[1]}</tspan>
                        </text>`;

          // Layer 2: Significations (Positioned directly under House Number)
          const meaningWords = details.meaning.split(/,\s*/);
          const line1 = meaningWords[0] || "";
          const line2 = meaningWords[1] || "";

          svg += `<text text-anchor="middle" 
                              style="fill: #111; font-size: ${7.5 * textScale}px; font-family: var(--font-ui); font-weight: 700; font-style: italic;">
                              <tspan x="${lblPos.x}" y="${lblPos.y + 24}">${line1}</tspan>
                              ${line2 ? `<tspan x="${lblPos.x}" dy="9">${line2}</tspan>` : ""}
                        </text>`;

          // Layer 4: Rashi Number & Symbol (Independent Positions)
          const numPos = numberCenters[house];
          const iconPos = iconCenters[house];

          // ୧. ରାଶି ନମ୍ବର
          svg += `<text x="${numPos.x}" y="${numPos.y + 6 * textScale}" text-anchor="middle" 
                              style="fill: #2C1810; font-weight: 800; font-size: ${16 * textScale}px; font-family: var(--font-display);" filter="url(#textShadow_${containerId})">
                              ${toNativeNum(sign, currentLang)}
                        </text>`;
                        
          // ୨. ରାଶି ଆଇକନ୍
          svg += `<svg x="${iconPos.x - 10 * textScale}" y="${iconPos.y - 10 * textScale}" width="${20 * textScale}" height="${20 * textScale}" class="svg-zodiac" style="opacity: 1;">${zodiac.symbol.replace(/class=".*?"/, "")}</svg>`;

          // Planets in this house
          const planetsHere = planets.filter(
            (p) => getHouseFromSign(p.sign, lagna) === house,
          );
          
          const pPos = pCenter[house]; // Fixed: using pCenter instead of undefined planetCenters
          const planetStartY = pPos.y; 

          planetsHere.forEach((planet, idx) => {
            const planetY = planetStartY + idx * 14;
            svg += `<text id="chart-planet-${planet.abbr}" class="planet-text interactable-planet" onclick="if(window.selectHouse) window.selectHouse(${house})" onmouseenter="if(window.handlePlanetEnter) window.handlePlanetEnter(event, '${planet.abbr}', ${house}, '${toNativeNum(Math.floor(planet.degree), currentLang)}°', ${planet.sign})" onmousemove="if(window.moveAstroTooltip) window.moveAstroTooltip(event)" onmouseleave="if(window.handleMouseLeavePlanet) window.handleMouseLeavePlanet('${planet.abbr}')" x="${pPos.x}" y="${planetY}" text-anchor="middle"
                  style="fill: ${planet.color}; font-size: ${11 * textScale}px; font-weight: 800; font-family: var(--font-ui);" 
                  filter="url(#glowEffect_${containerId})">
                  ${getLocalPlanet(planet.abbr)}
                </text>`;
          });
        }

        // Center Decoration
        svg += `
                <g transform="translate(${center}, ${center})">
                    <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="url(#btnGradSolid_${containerId})" stroke-width="2.5" filter="url(#houseShadow_${containerId})"/>
                    <text x="0" y="8" text-anchor="middle" 
                          style="fill: url(#redBorderGrad_${containerId}); font-size: 24px; font-family: Georgia, serif; font-weight: bold;">ॐ</text>
                </g>
            `;

        svg += `</svg>`;
        container.innerHTML = svg;
      }

      // South Indian Chart - Enhanced Multi-Color Version
      function renderSouthChart(containerId, planets, lagna) {
        const container = document.getElementById(containerId);
        const size = 650;
        const padding = 44;
        const gridSize = (size - padding * 2) / 4;

        // Sign colors for South Indian chart (Simple White/Beige theme)
        const signColors = {
          1: "#FFFFFF", 2: "#FFFFFF", 3: "#FFFFFF", 4: "#FFFFFF",
          5: "#FFFFFF", 6: "#FFFFFF", 7: "#FFFFFF", 8: "#FFFFFF",
          9: "#FFFFFF", 10: "#FFFFFF", 11: "#FFFFFF", 12: "#FFFFFF",
        };

        const signPositions = {
          12: { row: 0, col: 0 },
          1: { row: 0, col: 1 },
          2: { row: 0, col: 2 },
          3: { row: 0, col: 3 },
          11: { row: 1, col: 0 },
          4: { row: 1, col: 3 },
          10: { row: 2, col: 0 },
          5: { row: 2, col: 3 },
          9: { row: 3, col: 0 },
          8: { row: 3, col: 1 },
          7: { row: 3, col: 2 },
          6: { row: 3, col: 3 },
        };

        const uiEx = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra) ? localizedParagraphs[currentLang].ui_extra : {};
        const houseDetails = {
          1: uiEx.h_1_d ? uiEx.h_1_d.split(/,\s*/)[0] : "Self",
          2: uiEx.h_2_d ? uiEx.h_2_d.split(/,\s*/)[0] : "Wealth",
          3: uiEx.h_3_d ? uiEx.h_3_d.split(/,\s*/)[0] : "Courage",
          4: uiEx.h_4_d ? uiEx.h_4_d.split(/,\s*/)[0] : "Home",
          5: uiEx.h_5_d ? uiEx.h_5_d.split(/,\s*/)[0] : "Children",
          6: uiEx.h_6_d ? uiEx.h_6_d.split(/,\s*/)[0] : "Health",
          7: uiEx.h_7_d ? uiEx.h_7_d.split(/,\s*/)[0] : "Spouse",
          8: uiEx.h_8_d ? uiEx.h_8_d.split(/,\s*/)[0] : "Mystery",
          9: uiEx.h_9_d ? uiEx.h_9_d.split(/,\s*/)[0] : "Luck",
          10: uiEx.h_10_d ? uiEx.h_10_d.split(/,\s*/)[0] : "Career",
          11: uiEx.h_11_d ? uiEx.h_11_d.split(/,\s*/)[0] : "Gains",
          12: uiEx.h_12_d ? uiEx.h_12_d.split(/,\s*/)[0] : "Losses",
        };

        let svg = `
                <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="max-width: 100%; height: auto;" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="southChartBg_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FDF8EE;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#F5E6C8;stop-opacity:1" />
                        </linearGradient>
                        <filter id="cellShadow_${containerId}" x="-5%" y="-5%" width="110%" height="110%">
                            <feDropShadow dx="1" dy="1" stdDeviation="1" flood-opacity="0.15"/>
                        </filter>
                        <!-- Premium Gradients -->
                        <linearGradient id="btnGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FF6B00;stop-opacity:0.12" />
                            <stop offset="100%" style="stop-color:#F43F5E;stop-opacity:0.12" />
                        </linearGradient>
                        <linearGradient id="btnGradSolid_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FF6B00;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#F43F5E;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="redBorderGrad_${containerId}" x1="0" y1="0" x2="${size}" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" style="stop-color:#8B1D1F;stop-opacity:1" />
                            <stop offset="45%" style="stop-color:#C4131A;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#E83D23;stop-opacity:1" />
                        </linearGradient>
                        <filter id="emblemGlow_${containerId}" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="2" result="blur"/>
                            <feComponentTransfer in="blur" result="dimmedBlur">
                                <feFuncA type="linear" slope="0.4"/>
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode in="dimmedBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <!-- Outer Frame -->
                    <rect x="${padding - 12}" y="${padding - 12}" width="${size - (padding - 12) * 2}" height="${size - (padding - 12) * 2}" 
                          fill="#FDF8EE" stroke="url(#redBorderGrad_${containerId})" stroke-width="6" rx="10"/>
                    
                    <!-- Title at top -->
                    <text x="${size / 2}" y="${padding - 22}" text-anchor="middle" 
                          style="fill: #972022; font-weight: 800; font-size: 13px; font-family: var(--font-display); letter-spacing: 2px;">
                          SOUTH INDIAN CHART
                    </text>
            `;

        // Draw colored cells for each sign
        for (let sign = 1; sign <= 12; sign++) {
          const pos = signPositions[sign];
          if (!pos) continue;

          const x = padding + pos.col * gridSize;
          const y = padding + pos.row * gridSize;
          const color = signColors[sign];

          const houseNum = ((sign - lagna + 12) % 12) + 1;
          svg += `<rect id="chart-house-${houseNum}" class="house-section interactable-house house-${houseNum}" onclick="if(window.selectHouse) window.selectHouse(${houseNum})" onmouseenter="if(window.handleHouseEnter) window.handleHouseEnter(event, ${houseNum})" onmousemove="if(window.moveAstroTooltip) window.moveAstroTooltip(event)" onmouseleave="if(window.handleMouseLeave) window.handleMouseLeave()" x="${x}" y="${y}" width="${gridSize}" height="${gridSize}" 
                              fill="${color}" stroke="url(#redBorderGrad_${containerId})" stroke-width="2.5" filter="url(#cellShadow_${containerId})"/>`;
        }

        // Merged center (2x2)
        const centerX = padding + gridSize;
        const centerY = padding + gridSize;
        svg += `
                <rect x="${centerX}" y="${centerY}" width="${gridSize * 2}" height="${gridSize * 2}" 
                      fill="url(#btnGrad_${containerId})" stroke="url(#btnGradSolid_${containerId})" stroke-width="3"/>
                
                <!-- Decorative border in center -->
                <rect x="${centerX + 8}" y="${centerY + 8}" width="${gridSize * 2 - 16}" height="${gridSize * 2 - 16}" 
                      fill="none" stroke="url(#redBorderGrad_${containerId})" stroke-width="2" stroke-dasharray="5,3" rx="6" opacity="0.85"/>
                
                <!-- ═══ Premium Swastika Emblem with Bindus ═══ -->
                <g transform="translate(${centerX + gridSize}, ${centerY + gridSize - 12})" filter="url(#emblemGlow_${containerId})">
                    <!-- Swastika: two continuous strokes instead of six fragments,
                         so corners get smooth rounded joins -->
                    <path d="M 20,-20 L 0,-20 L 0,20 L -20,20
                             M 20,20  L 20,0  L -20,0 L -20,-20"
                          fill="none" stroke="url(#redBorderGrad_${containerId})"
                          stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>

                    <!-- Four Bindus -->
                    <g fill="url(#redBorderGrad_${containerId})">
                        <circle cx="-10" cy="-10" r="2.6"/>
                        <circle cx="10"  cy="-10" r="2.6"/>
                        <circle cx="10"  cy="10"  r="2.6"/>
                        <circle cx="-10" cy="10"  r="2.6"/>
                    </g>
                </g>

                <!-- ═══ KUNDALI Wordmark ═══ -->
                <g transform="translate(${centerX + gridSize}, ${centerY + gridSize + 38})">
                    <!-- Side flourishes -->
                    <g stroke="url(#redBorderGrad_${containerId})" stroke-width="1.5"
                       stroke-linecap="round" opacity="0.65">
                        <line x1="-66" y1="-5.5" x2="-52" y2="-5.5"/>
                        <line x1="52"  y1="-5.5" x2="66"  y2="-5.5"/>
                    </g>
                    <circle cx="-72" cy="-5.5" r="1.5" fill="url(#redBorderGrad_${containerId})" opacity="0.65"/>
                    <circle cx="72"  cy="-5.5" r="1.5" fill="url(#redBorderGrad_${containerId})" opacity="0.65"/>

                    <!-- dx="1.5" compensates for trailing letter-spacing so the word stays optically centered -->
                    <text x="0" y="0" dx="1.5" text-anchor="middle"
                          style="fill: url(#redBorderGrad_${containerId}); font-weight: 800; font-size: 16px; font-family: var(--font-display); letter-spacing: 3px;">
                          KUNDALI
                    </text>
                </g>
            `;

        // Add content to each sign cell
        for (let sign = 1; sign <= 12; sign++) {
          const pos = signPositions[sign];
          if (!pos) continue;

          const x = padding + pos.col * gridSize + gridSize / 2;
          const y = padding + pos.row * gridSize + gridSize / 2;
          const zodiac = zodiacSigns[sign - 1];
          const isLagna = sign === lagna;
          const houseNum = ((sign - lagna + 12) % 12) + 1;

          // Sign number (top-left)
          svg += `<text x="${x - gridSize / 3}" y="${y - gridSize / 3 + 5}" 
                              style="fill: #2C1810; font-weight: 800; font-size: 14px; font-family: var(--font-display);">${toNativeNum(sign, currentLang)}</text>`;

          // Zodiac symbol (top-right)
          svg += `<svg x="${x + gridSize / 4 - 10}" y="${y - gridSize / 3 - 10}" width="24" height="24" class="svg-zodiac" style="opacity: 1;">${zodiac.symbol.replace(/class=".*?"/, "")}</svg>`;

          // House info
          svg += `<text x="${x}" y="${y - gridSize / 6}" text-anchor="middle" 
                              style="fill: #222; font-weight: 700; font-size: 8px; font-family: var(--font-ui);">H${toNativeNum(houseNum, currentLang)}: ${houseDetails[houseNum]}</text>`;

          // Planets
          const planetsHere = planets.filter((p) => p.sign === sign);
          planetsHere.forEach((planet, idx) => {
            const offsetY = idx * 14 + 8;
            svg += `<text id="chart-planet-${planet.abbr}" class="planet-text interactable-planet" onclick="if(window.selectHouse) window.selectHouse(${houseNum})" onmouseenter="if(window.handlePlanetEnter) window.handlePlanetEnter(event, '${planet.abbr}', ${houseNum}, '${toNativeNum(Math.floor(planet.degree), currentLang)}°', ${planet.sign})" onmousemove="if(window.moveAstroTooltip) window.moveAstroTooltip(event)" onmouseleave="if(window.handleMouseLeavePlanet) window.handleMouseLeavePlanet('${planet.abbr}')" x="${x}" y="${y + offsetY}" text-anchor="middle" 
                                  style="fill: ${planet.color}; font-size: 11px; font-weight: 800; font-family: var(--font-ui);">${getLocalPlanet(planet.abbr)}</text>`;
          });
        }

        svg += `</svg>`;
        container.innerHTML = svg;
      }

      // East Indian Chart - Enhanced Multi-Color Version (Standard Layout)
      function renderEastChart(containerId, planets, lagna) {
        const container = document.getElementById(containerId);
        const size = 650;
        const padding = 46;
        const g = (size - padding * 2) / 3;

        // House colors for East Indian chart (Premium Gradient Theme)
        const houseColors = {
          1: `url(#btnGrad_${containerId})`, 4: `url(#btnGrad_${containerId})`, 7: `url(#btnGrad_${containerId})`, 10: `url(#btnGrad_${containerId})`, // Kendras (Gradient)
          2: "#FFFFFF", 3: "#FFFFFF", 5: "#FFFFFF", 6: "#FFFFFF",
          8: "#FFFFFF", 9: "#FFFFFF", 11: "#FFFFFF", 12: "#FFFFFF", // Others (White)
        };

        const houseDetails = {
          1: "Self", 2: "Wealth", 3: "Courage", 4: "Home",
          5: "Children", 6: "Health", 7: "Spouse", 8: "Mystery",
          9: "Luck", 10: "Career", 11: "Gains", 12: "Losses",
        };

        let svg = `
                <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="max-width: 100%; height: auto;" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="eastChartBg_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FDF8EE;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#F5E6C8;stop-opacity:1" />
                        </linearGradient>
                        <!-- Premium Gradients -->
                        <linearGradient id="btnGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FF6B00;stop-opacity:0.12" />
                            <stop offset="100%" style="stop-color:#F43F5E;stop-opacity:0.12" />
                        </linearGradient>
                        <linearGradient id="btnGradSolid_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FF6B00;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#F43F5E;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="redBorderGrad_${containerId}" x1="0" y1="0" x2="${size}" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" style="stop-color:#8B1D1F;stop-opacity:1" />
                            <stop offset="45%" style="stop-color:#C4131A;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#E83D23;stop-opacity:1" />
                        </linearGradient>
                        <filter id="emblemGlow_${containerId}" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="2" result="blur"/>
                            <feComponentTransfer in="blur" result="dimmedBlur">
                                <feFuncA type="linear" slope="0.4"/>
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode in="dimmedBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <rect x="${padding - 12}" y="${padding - 12}" width="${size - (padding - 12) * 2}" height="${size - (padding - 12) * 2}" 
                          fill="#FDF8EE" stroke="url(#redBorderGrad_${containerId})" stroke-width="6" rx="10"/>
                    
                    <text x="${size / 2}" y="${padding - 22}" text-anchor="middle" 
                          style="fill: #972022; font-weight: 800; font-size: 13px; font-family: var(--font-display); letter-spacing: 2px;">
                          EAST INDIAN CHART
                    </text>
            `;

        // Draw colored polygons for fixed signs (1 to 12)
        const p = padding;
        for (let sign = 1; sign <= 12; sign++) {
            const house = getHouseFromSign(sign, lagna);
            const color = houseColors[house];
            let pts = "";
            
            // Standard Anti-Clockwise Fixed Sign Mapping
            if (sign === 1) pts = `${p+g},${p} ${p+g*2},${p} ${p+g*2},${p+g} ${p+g},${p+g}`; // Top-Mid
            else if (sign === 2) pts = `${p},${p} ${p+g},${p} ${p+g},${p+g}`; // Top-Left (Top-Right Triangle)
            else if (sign === 3) pts = `${p},${p} ${p+g},${p+g} ${p},${p+g}`; // Top-Left (Bottom-Left Triangle)
            else if (sign === 4) pts = `${p},${p+g} ${p+g},${p+g} ${p+g},${p+g*2} ${p},${p+g*2}`; // Mid-Left
            else if (sign === 5) pts = `${p},${p+g*2} ${p+g},${p+g*2} ${p},${p+g*3}`; // Bottom-Left (Top-Left Triangle)
            else if (sign === 6) pts = `${p+g},${p+g*2} ${p+g},${p+g*3} ${p},${p+g*3}`; // Bottom-Left (Bottom-Right Triangle)
            else if (sign === 7) pts = `${p+g},${p+g*2} ${p+g*2},${p+g*2} ${p+g*2},${p+g*3} ${p+g},${p+g*3}`; // Bottom-Mid
            else if (sign === 8) pts = `${p+g*2},${p+g*2} ${p+g*2},${p+g*3} ${p+g*3},${p+g*3}`; // Bottom-Right (Bottom-Left Triangle)
            else if (sign === 9) pts = `${p+g*2},${p+g*2} ${p+g*3},${p+g*3} ${p+g*3},${p+g*2}`; // Bottom-Right (Top-Right Triangle)
            else if (sign === 10) pts = `${p+g*2},${p+g} ${p+g*3},${p+g} ${p+g*3},${p+g*2} ${p+g*2},${p+g*2}`; // Mid-Right
            else if (sign === 11) pts = `${p+g*3},${p} ${p+g*3},${p+g} ${p+g*2},${p+g}`; // Top-Right (Bottom-Right Triangle)
            else if (sign === 12) pts = `${p+g*2},${p} ${p+g*3},${p} ${p+g*2},${p+g}`; // Top-Right (Top-Left Triangle)
            
            const houseNum = ((sign - lagna + 12) % 12) + 1;
            svg += `<polygon id="chart-house-${houseNum}" class="house-section interactable-house house-${houseNum}" onclick="if(window.selectHouse) window.selectHouse(${houseNum})" onmouseenter="if(window.handleHouseEnter) window.handleHouseEnter(event, ${houseNum})" onmousemove="if(window.moveAstroTooltip) window.moveAstroTooltip(event)" onmouseleave="if(window.handleMouseLeave) window.handleMouseLeave()" points="${pts}" fill="${color}" stroke="none"/>`;
        }

        // Draw 3x3 Grid (Using solid color to fix Safari/iOS gradient line bug)
        for (let i = 0; i <= 3; i++) {
          const pos = padding + i * g;
          svg += `<line x1="${pos}" y1="${padding}" x2="${pos}" y2="${size - padding}" stroke="#d4151c" stroke-width="2.5"/>`;
          svg += `<line x1="${padding}" y1="${pos}" x2="${size - padding}" y2="${pos}" stroke="#d4151c" stroke-width="2.5"/>`;
        }

        // Draw 4 Corner Diagonals ONLY (No lines in middle boxes)
        svg += `<line x1="${p}" y1="${p}" x2="${p+g}" y2="${p+g}" stroke="#d4151c" stroke-width="2.5" opacity="0.8"/>`; // TL
        svg += `<line x1="${p+g*3}" y1="${p}" x2="${p+g*2}" y2="${p+g}" stroke="#d4151c" stroke-width="2.5" opacity="0.8"/>`; // TR
        svg += `<line x1="${p}" y1="${p+g*3}" x2="${p+g}" y2="${p+g*2}" stroke="#d4151c" stroke-width="2.5" opacity="0.8"/>`; // BL
        svg += `<line x1="${p+g*2}" y1="${p+g*2}" x2="${p+g*3}" y2="${p+g*3}" stroke="#d4151c" stroke-width="2.5" opacity="0.8"/>`; // BR

        // Center cell with Swastika
        const centerX = padding + g;
        const centerY = padding + g;
        svg += `
                <rect x="${centerX}" y="${centerY}" width="${g}" height="${g}" 
                      fill="url(#btnGrad_${containerId})" stroke="url(#redBorderGrad_${containerId})" stroke-width="3"/>
                <rect x="${centerX + 6}" y="${centerY + 6}" width="${g - 12}" height="${g - 12}" 
                      fill="none" stroke="url(#redBorderGrad_${containerId})" stroke-width="2" stroke-dasharray="5,3" rx="6" opacity="0.85"/>
                
                <!-- ═══ Premium Swastika Emblem with Bindus ═══ -->
                <g transform="translate(${centerX + g / 2}, ${centerY + g / 2 - 12})" filter="url(#emblemGlow_${containerId})">
                    <!-- Swastika: two continuous strokes instead of six fragments,
                         so corners get smooth rounded joins -->
                    <path d="M 20,-20 L 0,-20 L 0,20 L -20,20
                             M 20,20  L 20,0  L -20,0 L -20,-20"
                          fill="none" stroke="url(#redBorderGrad_${containerId})"
                          stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>

                    <!-- Four Bindus -->
                    <g fill="url(#redBorderGrad_${containerId})">
                        <circle cx="-10" cy="-10" r="2.6"/>
                        <circle cx="10"  cy="-10" r="2.6"/>
                        <circle cx="10"  cy="10"  r="2.6"/>
                        <circle cx="-10" cy="10"  r="2.6"/>
                    </g>
                </g>

                <!-- ═══ KUNDALI Wordmark ═══ -->
                <g transform="translate(${centerX + g / 2}, ${centerY + g / 2 + 38})">
                    <!-- Side flourishes -->
                    <g stroke="url(#redBorderGrad_${containerId})" stroke-width="1.5"
                       stroke-linecap="round" opacity="0.65">
                        <line x1="-66" y1="-5.5" x2="-52" y2="-5.5"/>
                        <line x1="52"  y1="-5.5" x2="66"  y2="-5.5"/>
                    </g>
                    <circle cx="-72" cy="-5.5" r="1.5" fill="url(#redBorderGrad_${containerId})" opacity="0.65"/>
                    <circle cx="72"  cy="-5.5" r="1.5" fill="url(#redBorderGrad_${containerId})" opacity="0.65"/>

                    <!-- dx="1.5" compensates for trailing letter-spacing so the word stays optically centered -->
                    <text x="0" y="0" dx="1.5" text-anchor="middle"
                          style="fill: url(#redBorderGrad_${containerId}); font-weight: 800; font-size: 16px; font-family: var(--font-display); letter-spacing: 3px;">
                          KUNDALI
                    </text>
                </g>
            `;

        // Perfectly Calculated Centers for Text Alignment
        const signCenters = {
            1: { x: p + g * 1.5, y: p + g * 0.25 },  // Aries
            2: { x: p + g * 0.65, y: p + g * 0.35 }, // Taurus
            3: { x: p + g * 0.35, y: p + g * 0.65 }, // Gemini
            4: { x: p + g * 0.5, y: p + g * 1.5 },   // Cancer
            5: { x: p + g * 0.35, y: p + g * 2.35 }, // Leo
            6: { x: p + g * 0.65, y: p + g * 2.65 }, // Virgo
            7: { x: p + g * 1.5, y: p + g * 2.75 },  // Libra
            8: { x: p + g * 2.35, y: p + g * 2.65 }, // Scorpio
            9: { x: p + g * 2.65, y: p + g * 2.35 }, // Sagittarius
            10: { x: p + g * 2.5, y: p + g * 1.5 },  // Capricorn
            11: { x: p + g * 2.65, y: p + g * 0.65 },// Aquarius
            12: { x: p + g * 2.35, y: p + g * 0.35 },// Pisces
        };

        // Add content to each sign
        for (let sign = 1; sign <= 12; sign++) {
            const house = getHouseFromSign(sign, lagna);
            const pos = signCenters[sign];
            const zodiac = zodiacSigns[sign - 1];

            // Adjust y offset based on shape to make it look centered
            let yOff = [1, 4, 7, 10].includes(sign) ? -15 : -10;

            // Ascendant Marker (Orange ASC)
            let ascMarker = house === 1 ? `<text x="${pos.x}" y="${pos.y + yOff - 14}" text-anchor="middle" style="fill: #EA580C; font-weight: 800; font-size: 11px; font-family: var(--font-display);">ASC</text>` : '';
            svg += ascMarker;

            // Sign number & symbol
            svg += `<text x="${pos.x - 10}" y="${pos.y + yOff}" text-anchor="middle" 
                                style="fill: #2C1810; font-weight: 800; font-size: 13px; font-family: var(--font-display);">${toNativeNum(sign, currentLang)}</text>`;
            svg += `<svg x="${pos.x + 2}" y="${pos.y + yOff - 10}" width="16" height="16" class="svg-zodiac" style="opacity: 1;">${zodiac.symbol.replace(/class=".*?"/, "")}</svg>`;

            // House signification
            svg += `<text x="${pos.x}" y="${pos.y + yOff + 12}" text-anchor="middle" 
                                style="fill: #222; font-weight: 700; font-size: 8px; font-family: var(--font-ui);">H${toNativeNum(house, currentLang)}: ${houseDetails[house].substring(0, 10)}</text>`;

            // Planets
            const planetsHere = planets.filter(p => p.sign === sign);
            planetsHere.forEach((planet, idx) => {
                const houseNum = ((sign - lagna + 12) % 12) + 1;
                svg += `<text id="chart-planet-${planet.abbr}" class="planet-text interactable-planet" onclick="if(window.selectHouse) window.selectHouse(${houseNum})" onmouseenter="if(window.handlePlanetEnter) window.handlePlanetEnter(event, '${planet.abbr}', ${houseNum}, '${toNativeNum(Math.floor(planet.degree), currentLang)}°', ${planet.sign})" onmousemove="if(window.moveAstroTooltip) window.moveAstroTooltip(event)" onmouseleave="if(window.handleMouseLeavePlanet) window.handleMouseLeavePlanet('${planet.abbr}')" x="${pos.x}" y="${pos.y + yOff + 24 + idx * 11}" text-anchor="middle" 
                                      style="font-size: 10px; font-weight: 800; fill: ${planet.color}; font-family: var(--font-ui);">${getLocalPlanet(planet.abbr)}</text>`;
            });
        }

        svg += `</svg>`;
        container.innerHTML = svg;
      }

      // West Indian Chart (Western Wheel Circular Format - Clean Outer Zodiac Rim Layout)
      function renderWestChart(containerId, planets, lagna) {
        const container = document.getElementById(containerId);
        const size = 680;
        const center = size / 2;
        
        // Multi-Ring Radiuses (Clean Zodiac Outermost Rim)
        const rZodOut = 300;
        const rZodIn = 240;
        const rHouseOut = 240;
        const rHouseIn = 35;
        const rCenter = 35;

        const uiEx = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra) ? localizedParagraphs[currentLang].ui_extra : {};
        const houseMeanings = {
          1: uiEx.h_1_d ? uiEx.h_1_d.split(/,\s*/)[0] : "Self",
          2: uiEx.h_2_d ? uiEx.h_2_d.split(/,\s*/)[0] : "Wealth",
          3: uiEx.h_3_d ? uiEx.h_3_d.split(/,\s*/)[0] : "Courage",
          4: uiEx.h_4_d ? uiEx.h_4_d.split(/,\s*/)[0] : "Home",
          5: uiEx.h_5_d ? uiEx.h_5_d.split(/,\s*/)[0] : "Children",
          6: uiEx.h_6_d ? uiEx.h_6_d.split(/,\s*/)[0] : "Health",
          7: uiEx.h_7_d ? uiEx.h_7_d.split(/,\s*/)[0] : "Spouse",
          8: uiEx.h_8_d ? uiEx.h_8_d.split(/,\s*/)[0] : "Mystery",
          9: uiEx.h_9_d ? uiEx.h_9_d.split(/,\s*/)[0] : "Luck",
          10: uiEx.h_10_d ? uiEx.h_10_d.split(/,\s*/)[0] : "Career",
          11: uiEx.h_11_d ? uiEx.h_11_d.split(/,\s*/)[0] : "Gains",
          12: uiEx.h_12_d ? uiEx.h_12_d.split(/,\s*/)[0] : "Losses",
        };

        // Sector Path Helper (Counter-Clockwise Sweep from startAngle to endAngle)
        function getArcSector(cx, cy, rInside, rOutside, startAngle, endAngle) {
          const toRad = Math.PI / 180;
          const sRad = startAngle * toRad;
          const eRad = endAngle * toRad;
          const x1 = cx + rOutside * Math.cos(sRad);
          const y1 = cy + rOutside * Math.sin(sRad);
          const x2 = cx + rOutside * Math.cos(eRad);
          const y2 = cy + rOutside * Math.sin(eRad);
          const x3 = cx + rInside * Math.cos(eRad);
          const y3 = cy + rInside * Math.sin(eRad);
          const x4 = cx + rInside * Math.cos(sRad);
          const y4 = cy + rInside * Math.sin(sRad);
          return `M ${x1} ${y1} A ${rOutside} ${rOutside} 0 0 0 ${x2} ${y2} L ${x3} ${y3} A ${rInside} ${rInside} 0 0 1 ${x4} ${y4} Z`;
        }

        let svg = `
          <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="max-width: 100%; height: auto;" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Planetary 3D Spheres & Gradients -->
              <radialGradient id="sphere_sun_${containerId}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#FFF7ED"/>
                <stop offset="40%" stop-color="#FB923C"/>
                <stop offset="100%" stop-color="#C2410C"/>
              </radialGradient>
              <radialGradient id="sphere_moon_${containerId}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="50%" stop-color="#E2E8F0"/>
                <stop offset="100%" stop-color="#64748B"/>
              </radialGradient>
              <radialGradient id="sphere_mars_${containerId}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#FECDD3"/>
                <stop offset="45%" stop-color="#F43F5E"/>
                <stop offset="100%" stop-color="#9F1239"/>
              </radialGradient>
              <radialGradient id="sphere_mercury_${containerId}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#DCFCE7"/>
                <stop offset="45%" stop-color="#22C55E"/>
                <stop offset="100%" stop-color="#14532D"/>
              </radialGradient>
              <radialGradient id="sphere_jupiter_${containerId}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#FEF3C7"/>
                <stop offset="40%" stop-color="#F59E0B"/>
                <stop offset="100%" stop-color="#92400E"/>
              </radialGradient>
              <radialGradient id="sphere_venus_${containerId}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#FCE7F3"/>
                <stop offset="45%" stop-color="#EC4899"/>
                <stop offset="100%" stop-color="#9D174D"/>
              </radialGradient>
              <radialGradient id="sphere_saturn_${containerId}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#E0E7FF"/>
                <stop offset="45%" stop-color="#6366F1"/>
                <stop offset="100%" stop-color="#312E81"/>
              </radialGradient>
              <radialGradient id="sphere_rahu_${containerId}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#F3E8FF"/>
                <stop offset="45%" stop-color="#9333EA"/>
                <stop offset="100%" stop-color="#581C87"/>
              </radialGradient>
              <radialGradient id="sphere_ketu_${containerId}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#FFEDD5"/>
                <stop offset="45%" stop-color="#EA580C"/>
                <stop offset="100%" stop-color="#7C2D12"/>
              </radialGradient>

              <!-- Central & Border Gradients -->
              <linearGradient id="redBorderGrad_${containerId}" x1="0" y1="0" x2="${size}" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#8B1D1F"/>
                <stop offset="45%" stop-color="#C4131A"/>
                <stop offset="100%" stop-color="#E83D23"/>
              </linearGradient>
              <linearGradient id="goldSpokeGrad_${containerId}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#F59E0B"/>
                <stop offset="100%" stop-color="#D97706"/>
              </linearGradient>

              <!-- Realistic 3D Saturn Ring Gradient -->
              <linearGradient id="saturnRingGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FDE68A;stop-opacity:1"/>
                <stop offset="50%" style="stop-color:#F59E0B;stop-opacity:1"/>
                <stop offset="100%" style="stop-color:#D97706;stop-opacity:1"/>
              </linearGradient>

              <!-- North Indian Style Gradient for Kendras -->
              <linearGradient id="btnGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF6B00;stop-opacity:0.13"/>
                <stop offset="100%" style="stop-color:#F43F5E;stop-opacity:0.13"/>
              </linearGradient>

              <!-- Soft Balanced Warm Gradient for 12 Zodiac Outer Ring -->
              <linearGradient id="peachZodiacGrad_${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFF3EB;stop-opacity:1"/>
                <stop offset="50%" style="stop-color:#FEE5D5;stop-opacity:1"/>
                <stop offset="100%" style="stop-color:#FDD7C6;stop-opacity:1"/>
              </linearGradient>

              <!-- Drop Shadows & Glow -->
              <filter id="houseShadow_${containerId}" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.15"/>
              </filter>
              <filter id="planetShadow_${containerId}" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="1" dy="1.5" stdDeviation="1.5" flood-opacity="0.25"/>
              </filter>
              <filter id="ascGlow_${containerId}" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Outer Decorative Frame (Square) -->
            <rect x="16" y="16" width="${size - 32}" height="${size - 32}" 
                  fill="#FDFBF7" stroke="url(#redBorderGrad_${containerId})" stroke-width="5" rx="14"/>
            <rect x="21" y="21" width="${size - 42}" height="${size - 42}" 
                  fill="none" stroke="url(#redBorderGrad_${containerId})" stroke-width="1.2" stroke-dasharray="4,3" rx="10" opacity="0.65"/>
        `;

        // ═══════════════════════════════════════════════════════════════
        // 1. OUTERMOST RING: 12 ZODIAC SIGNS (Radius 232 to 295)
        // ═══════════════════════════════════════════════════════════════
        for (let h = 1; h <= 12; h++) {
          const sign = getSignFromHouse(h, lagna);
          const zodiac = zodiacSigns[sign - 1];
          const midDeg = 270 - (h - 1) * 30;
          const sDeg = midDeg + 15;
          const eDeg = midDeg - 15;
          const midRad = (midDeg * Math.PI) / 180;

          // 12 Zodiac Ring with Soft Peach/Cream Gradient (#FDEFE7)
          const signBg = `url(#peachZodiacGrad_${containerId})`;
          const zPath = getArcSector(center, center, rZodIn, rZodOut, sDeg, eDeg);

          svg += `<path d="${zPath}" fill="${signBg}" stroke="none"/>`;

          // Zodiac Glyph, Sign Name & Number
          const rZodCenter = (rZodOut + rZodIn) / 2;
          const zx = center + rZodCenter * Math.cos(midRad);
          const zy = center + rZodCenter * Math.sin(midRad);

          // Tangential rotation for upright readable text
          let zRot = midDeg + 90;
          zRot = zRot % 360;
          if (zRot < 0) zRot += 360;
          
          let isFlipped = false;
          if (zRot > 90 && zRot < 270) {
              zRot -= 180;
              isFlipped = true;
          }

          let symY = isFlipped ? -24 : 6;
          let nameY = isFlipped ? 9 : -5;
          let numY = isFlipped ? 20 : -16;

          svg += `
            <g transform="translate(${zx}, ${zy}) rotate(${zRot})">
              <!-- Zodiac SVG Symbol -->
              <svg x="-8.5" y="${symY}" width="17" height="17" class="svg-zodiac" style="opacity: 1;">
                ${zodiac.symbol.replace(/class=".*?"/, "")}
              </svg>
              <!-- Sign Name -->
              <text x="0" y="${nameY}" text-anchor="middle" style="fill: #2C1810; font-weight: 800; font-size: 9.5px; font-family: var(--font-display); letter-spacing: 0.2px;">
                ${getLocalRashi(sign)}
              </text>
              <text x="0" y="${numY}" text-anchor="middle" style="fill: #5D0000; font-weight: 800; font-size: 8.5px; font-family: var(--font-ui);">
                ${toNativeNum(sign, currentLang)}
              </text>
            </g>
          `;
        }

        // ═══════════════════════════════════════════════════════════════
        // 2. INNER HOUSES & PLANET FIELDS (Radius 68 to 232)
        // ═══════════════════════════════════════════════════════════════
        for (let house = 1; house <= 12; house++) {
          const sign = getSignFromHouse(house, lagna);
          const midDeg = 270 - (house - 1) * 30;
          const sDeg = midDeg + 15;
          const eDeg = midDeg - 15;

          // Kendra houses (1, 4, 7, 10) use rich North Indian style gradient; others pure white
          const isKendra = [1, 4, 7, 10].includes(house);
          const houseBg = isKendra ? `url(#btnGrad_${containerId})` : "#FFFFFF";

          const hPath = getArcSector(center, center, rHouseIn, rHouseOut, sDeg, eDeg);
          svg += `<path id="chart-house-${house}" class="house-section interactable-house house-${house}" onclick="if(window.selectHouse) window.selectHouse(${house})" onmouseenter="if(window.handleHouseEnter) window.handleHouseEnter(event, ${house})" onmousemove="if(window.moveAstroTooltip) window.moveAstroTooltip(event)" onmouseleave="if(window.handleMouseLeave) window.handleMouseLeave()" d="${hPath}" fill="${houseBg}" stroke="none"/>`;
        }

        // Radial Spoke Boundary Lines between Houses (Matching Zodiac Ring Border)
        for (let h = 1; h <= 12; h++) {
          const spokeDeg = 270 - (h - 1) * 30 + 15;
          const spokeRad = (spokeDeg * Math.PI) / 180;
          const sx1 = center + rHouseIn * Math.cos(spokeRad);
          const sy1 = center + rHouseIn * Math.sin(spokeRad);
          const sx2 = center + rZodOut * Math.cos(spokeRad);
          const sy2 = center + rZodOut * Math.sin(spokeRad);

          svg += `<line x1="${sx1}" y1="${sy1}" x2="${sx2}" y2="${sy2}" stroke="url(#redBorderGrad_${containerId})" stroke-width="1.8" opacity="0.85"/>`;
        }

        // Concentric Dividing Rings
        svg += `
          <circle cx="${center}" cy="${center}" r="${rZodOut}" fill="none" stroke="url(#redBorderGrad_${containerId})" stroke-width="2.5"/>
          <circle cx="${center}" cy="${center}" r="${rHouseOut}" fill="none" stroke="url(#redBorderGrad_${containerId})" stroke-width="2"/>
          <circle cx="${center}" cy="${center}" r="194" fill="none" stroke="url(#redBorderGrad_${containerId})" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.75"/>
          <circle cx="${center}" cy="${center}" r="${rHouseIn}" fill="none" stroke="url(#redBorderGrad_${containerId})" stroke-width="2.2"/>
        `;

        // ═══════════════════════════════════════════════════════════════
        // 3. HOUSE LABELS & PLANETARY BADGES
        // ═══════════════════════════════════════════════════════════════
        for (let house = 1; house <= 12; house++) {
          const sign = getSignFromHouse(house, lagna);
          const midDeg = 270 - (house - 1) * 30;
          const midRad = (midDeg * Math.PI) / 180;

          // House Number and Meaning at outer perimeter of house sector (Radius ~217)
          const rHouseLabel = 217;
          const rx = center + rHouseLabel * Math.cos(midRad);
          const ry = center + rHouseLabel * Math.sin(midRad);

          svg += `
            <text text-anchor="middle" style="font-family: var(--font-ui);">
              <tspan x="${rx}" y="${ry - 1}" style="fill: #B91C1C; font-weight: 800; font-size: 9.5px; letter-spacing: 0.3px;">H${toNativeNum(house, currentLang)}</tspan>
              <tspan x="${rx}" dy="9.5" style="fill: #6B7280; font-weight: 600; font-size: 7.5px; letter-spacing: 0.2px;">${houseMeanings[house]}</tspan>
            </text>
          `;

          // Occupying Planets inside this House sector
          const planetsHere = planets.filter((p) => getHouseFromSign(p.sign, lagna) === house);
          const count = planetsHere.length;
          const isCrowded = count >= 5;

          planetsHere.forEach((planet, idx) => {
            let rP;
            if (count === 1) {
              rP = 135;
            } else if (count === 2) {
              rP = idx === 0 ? 154 : 106;
            } else if (count === 3) {
              rP = idx === 0 ? 162 : idx === 1 ? 128 : 94;
            } else if (count === 4) {
              rP = 164 - idx * 27;
            } else {
              // Strictly contained radial ladder down the center of each house sector
              const maxR = 168;
              const minR = 52; // 17px safety buffer above center Om circle (r=35)
              const step = (maxR - minR) / (count - 1);
              rP = maxR - idx * step;
            }

            // Always centered strictly on the house's own midRad (never crosses into neighbor houses)
            const pAngleRad = (midDeg * Math.PI) / 180;

            const px = center + rP * Math.cos(pAngleRad);
            const py = center + rP * Math.sin(pAngleRad);

            const pDegVal = (planet.degree !== undefined && !isNaN(planet.degree)) 
              ? planet.degree 
              : ((planet.longitude !== undefined && !isNaN(planet.longitude)) ? getDegreeInSign(planet.longitude) : 0);
            const degInt = Math.floor(pDegVal);
            const minInt = Math.floor((pDegVal - degInt) * 60);
            const degFormatted = `${toNativeNum(degInt, currentLang)}°${toNativeNum(minInt.toString().padStart(2, '0'), currentLang)}'`;

            // Sphere Gradient Mapping
            const sphereMap = {
              Sun: `url(#sphere_sun_${containerId})`,
              Moon: `url(#sphere_moon_${containerId})`,
              Mar: `url(#sphere_mars_${containerId})`,
              Mer: `url(#sphere_mercury_${containerId})`,
              Jup: `url(#sphere_jupiter_${containerId})`,
              Ven: `url(#sphere_venus_${containerId})`,
              Sat: `url(#sphere_saturn_${containerId})`,
              Rah: `url(#sphere_rahu_${containerId})`,
              Ket: `url(#sphere_ketu_${containerId})`
            };
            const sphereFill = sphereMap[planet.abbr] || `url(#sphere_sun_${containerId})`;

            // Tilt the badge slightly downwards in horizontal houses (10 and 4) to prevent overlap
            const pRot = (house === 10 || house === 4) ? 42 : 0;

            // Dynamic Content-Aware Badge Geometry
            const planetLabel = getLocalPlanet(planet.abbr);
            const orbR = isCrowded ? 6.8 : 8.5;
            const ringR = isCrowded ? 11.2 : 13.8;
            const ringRy = isCrowded ? 3.4 : 4.2;
            const orbCx = isCrowded ? -9.0 : -13.5;

            // Character-level proportional width calculation (Exact pixel-fit for all scripts & letters)
            const fullLabelStr = `${planetLabel} ${toNativeNum(degInt, currentLang)}°${planet.isRetrograde ? ' ®' : ''}`;
            const scaleFactor = isCrowded ? 0.86 : 1.0;
            let textW = 0;
            for (let c of fullLabelStr) {
              if ("MWmw".includes(c)) textW += 5.8 * scaleFactor;
              else if ("iltI!|:;.,'".includes(c)) textW += 2.0 * scaleFactor;
              else if ("frtjsJ-".includes(c)) textW += 2.8 * scaleFactor;
              else if (c === "°") textW += 3.2 * scaleFactor;
              else if (c === "®") textW += 4.8 * scaleFactor;
              else if (c >= "0" && c <= "9") textW += 3.4 * scaleFactor;
              else if (c === " ") textW += 2.2 * scaleFactor;
              else if (c >= "A" && c <= "Z") textW += 4.4 * scaleFactor;
              else textW += 3.9 * scaleFactor;
            }
            const padW = isCrowded ? 5.0 : 6.8;
            const rectW = Math.round(textW + padW);
            const rectH = isCrowded ? 11.4 : 13.6;

            const rectX = planet.abbr === 'Sat' ? (isCrowded ? '0.5' : '-1.5') : (isCrowded ? '-2.5' : '-3.8');
            const rectY = planet.abbr === 'Sat' ? (isCrowded ? '-3.2' : '-3.5') : (isCrowded ? '-5.7' : '-6.8');
            const txtX = planet.abbr === 'Sat' ? (isCrowded ? '3.2' : '2.5') : (isCrowded ? '0.5' : '0.2');
            const txtY = planet.abbr === 'Sat' ? (isCrowded ? '5.2' : '6.4') : (isCrowded ? '2.4' : '3.1');
            const fSize = isCrowded ? '6.4px' : '7.3px';
            const dSize = isCrowded ? '5.0px' : '5.8px';

            // Draw 3D Orb Globe + Label Pill
            svg += `
              <!-- Aspect Connection Ray -->
              <line x1="${center + rHouseIn * Math.cos(pAngleRad)}" y1="${center + rHouseIn * Math.sin(pAngleRad)}" 
                    x2="${px}" y2="${py}" stroke="${planet.color || '#D97706'}" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.4"/>
              
              <!-- Planet Fixed Location Container -->
              <g transform="translate(${px}, ${py})${pRot ? ` rotate(${pRot})` : ''}">
                <g id="chart-planet-${planet.abbr}" class="interactable-planet" onclick="if(window.selectHouse) window.selectHouse(${house}); if(window.highlightPlanet) window.highlightPlanet('${planet.abbr}');" 
                   onmouseenter="if(window.handlePlanetEnter) window.handlePlanetEnter(event, '${planet.abbr}', ${house}, '${degFormatted}', ${planet.sign})" 
                   onmousemove="if(window.moveAstroTooltip) window.moveAstroTooltip(event)" 
                   onmouseleave="if(window.handleMouseLeavePlanet) window.handleMouseLeavePlanet('${planet.abbr}')"
                   filter="url(#planetShadow_${containerId})">
                  
                  ${planet.abbr === 'Sat' ? `
                  <!-- Saturn 3D Ring (Back Half - Behind Planet Sphere) -->
                  <g transform="rotate(-28 ${orbCx} 0)">
                    <path d="M ${orbCx - ringR} 0 A ${ringR} ${ringRy} 0 0 1 ${orbCx + ringR} 0" fill="none" stroke="url(#saturnRingGrad_${containerId})" stroke-width="${isCrowded ? 2.4 : 3}" stroke-linecap="round" opacity="0.85"/>
                    <path d="M ${orbCx - ringR * 0.85} 0 A ${ringR * 0.85} ${ringRy * 0.85} 0 0 1 ${orbCx + ringR * 0.85} 0" fill="none" stroke="#FFFBEB" stroke-width="1.0" opacity="0.9"/>
                  </g>` : ''}

                  <!-- 3D Realistic Planet Orb -->
                  <circle cx="${orbCx}" cy="0" r="${orbR}" fill="${sphereFill}" stroke="#FFFFFF" stroke-width="1.2"/>

                  ${planet.abbr === 'Sat' ? `
                  <!-- Saturn 3D Ring (Front Half - In Front of Planet Sphere) -->
                  <g transform="rotate(-28 ${orbCx} 0)">
                    <path d="M ${orbCx + ringR} 0 A ${ringR} ${ringRy} 0 0 1 ${orbCx - ringR} 0" fill="none" stroke="url(#saturnRingGrad_${containerId})" stroke-width="${isCrowded ? 2.4 : 3}" stroke-linecap="round" opacity="0.95"/>
                    <path d="M ${orbCx + ringR * 0.85} 0 A ${ringR * 0.85} ${ringRy * 0.85} 0 0 1 ${orbCx - ringR * 0.85} 0" fill="none" stroke="#FFFBEB" stroke-width="1.0" opacity="0.95"/>
                  </g>` : ''}

                  <!-- Planet Name & Degree Typography Badge -->
                  <rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" rx="3.0" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.8" opacity="0.95"/>
                  <text x="${txtX}" y="${txtY}" style="fill: ${planet.color || '#1E293B'}; font-size: ${fSize}; font-weight: 800; font-family: var(--font-ui);">
                    ${planetLabel} <tspan style="font-size: ${dSize}; fill: #64748B; font-weight: 600;">${toNativeNum(degInt, currentLang)}°</tspan>${planet.isRetrograde ? `<tspan style="fill: #EF4444; font-size: ${isCrowded ? '5.2px' : '6.0px'}; font-weight: 900;"> ®</tspan>` : ''}
                  </text>
                </g>
              </g>
            `;
          });
        }

        // ═══════════════════════════════════════════════════════════════
        // 4. PROMINENT RED ASCENDANT (ASC) ARROW AT TOP (Image 1 Style)
        // ═══════════════════════════════════════════════════════════════
        svg += `
          <!-- Prominent Red ASC Marker at Top (12 o'clock / House 1) -->
          <g transform="translate(${center}, 16)" filter="url(#ascGlow_${containerId})">
            <line x1="0" y1="3" x2="0" y2="24" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round"/>
            <polygon points="0,0 -6,12 6,12" fill="#DC2626"/>
            <rect x="-24" y="-18" width="48" height="16" rx="4" fill="#DC2626" stroke="#FFFFFF" stroke-width="1.2"/>
            <text x="0" y="-6.5" text-anchor="middle" style="fill: #FFFFFF; font-weight: 900; font-size: 9px; font-family: var(--font-display); letter-spacing: 1px;">
              ▲ I ASC
            </text>
          </g>
        `;

        // ═══════════════════════════════════════════════════════════════
        // 5. CENTRAL SACRED OM (ॐ) HUB MANDALA
        // ═══════════════════════════════════════════════════════════════
        svg += `
          <g transform="translate(${center}, ${center})">
            <!-- Central Om Circle (Very slightly increased) -->
            <circle cx="0" cy="0" r="33" fill="#FFFFFF" stroke="url(#redBorderGrad_${containerId})" stroke-width="2.2" filter="url(#houseShadow_${containerId})"/>
            <circle cx="0" cy="0" r="26" fill="url(#btnGrad_${containerId})" stroke="url(#redBorderGrad_${containerId})" stroke-width="1.2" stroke-dasharray="3,2"/>
            
            <!-- Sacred Om Glyph -->
            <text x="0" y="10" text-anchor="middle" 
                  style="fill: url(#redBorderGrad_${containerId}); font-size: 30px; font-family: Georgia, serif; font-weight: bold; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));">
              ॐ
            </text>
          </g>
        `;

        svg += `</svg>`;
        container.innerHTML = svg;
      }

      // ===== TABLE RENDERING =====

      function formatDMS(decimalDegrees) {
        let d = Math.floor(decimalDegrees);
        let minFloat = (decimalDegrees - d) * 60;
        let m = Math.floor(minFloat);
        let s = Math.round((minFloat - m) * 60);
        if (s === 60) {
          m++;
          s = 0;
        }
        if (m === 60) {
          d++;
          m = 0;
        }
        return `${d.toString().padStart(2, "0")}°${m.toString().padStart(2, "0")}'${s.toString().padStart(2, "0")}"`;
      }


;

      // ===== ASHTAKAVARGA ENGINE (Parashara BPHS 337 Points) =====

window.currentRenderedPlanets = [];
      window.currentRenderedLagna = 1;

      window.showAstroTooltip = function(html, e) {
          const tip = document.getElementById('astroTooltip');
          if(!tip) return;
          tip.innerHTML = html;
          tip.style.opacity = 1;
          window.moveAstroTooltip(e);
      };

      window.moveAstroTooltip = function(e) {
          const tip = document.getElementById('astroTooltip');
          if(!tip) return;
          tip.style.left = Math.min(Math.max(e.clientX, 130), window.innerWidth - 130) + 'px';
          tip.style.top = e.clientY + 'px';
      };

      window.handleMouseLeave = function() {
          const tip = document.getElementById('astroTooltip');
          if(tip) tip.style.opacity = 0;
      };

      let isRaisingPlanet = false;

      window.handleMouseLeavePlanet = function(abbr) {
          if (isRaisingPlanet) return;
          window.handleMouseLeave();
          window.unhighlightPlanet(abbr);
      };

      window.handleHouseEnter = function(e, h) {
          let sign = ((h - 1 + window.currentRenderedLagna - 1) % 12) + 1;
          let signName = getLocalRashi(sign);
          let lord = zodiacSigns[sign - 1].ruler;
          
          let occ = window.currentRenderedPlanets.filter(p => getHouseFromSign(p.sign, window.currentRenderedLagna) === h);
          let occStr = occ.length ? occ.map(o => getLocalPlanet(o.abbr)).join(", ") : "None";

          let uiEx = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra) ? localizedParagraphs[currentLang].ui_extra : {};
          let lblHouse = uiEx.house_number || "House";
          let lblLord = uiEx.lord || "Lord";
          let lblOcc = uiEx.occ_planets || "Occupants";

          let html = `<div class="tooltip-title" style="font-weight:800; color:#B91C1C; font-size:0.82rem; margin-bottom:3px; font-family:var(--font-display); letter-spacing:-0.2px; white-space:nowrap;">${lblHouse} ${toNativeNum(h, currentLang)} · ${signName}</div>
                      <div class="tooltip-body" style="font-size:0.68rem; color:#4B5563; line-height:1.4; font-family:var(--font-ui); white-space:normal; word-break:break-word;">
                      <strong class="tooltip-label" style="color:#6B7280; font-weight:700;">${lblLord}:</strong> <span class="tooltip-val-lord">${getLocalPlanet(lord)}</span><br>
                      <strong class="tooltip-label" style="color:#6B7280; font-weight:700;">${lblOcc}:</strong> <span class="tooltip-val-occ" style="color:#1F2937; font-weight:600; display:inline; line-height:1.4;">${occStr}</span>
                      </div>`;
          window.showAstroTooltip(html, e);
      };

      window.handlePlanetEnter = function(e, abbr, house, deg, sign) {
          let pInfo = window.currentRenderedPlanets.find(p => p.abbr === abbr);
          if(!pInfo) return;
          let pName = getLocalPlanet(abbr);
          
          let uiEx = (localizedParagraphs[currentLang] && localizedParagraphs[currentLang].ui_extra) ? localizedParagraphs[currentLang].ui_extra : {};
          let lblHouse = uiEx.house_number || "House";
          let retStr = pInfo.isRetrograde ? `<span style='color:#D92D20; font-weight:700;'>${uiEx.retrograde || "Retrograde"}</span>` : (uiEx.direct || "Direct");

          let html = `<div class="tooltip-title" style="font-weight:800; color:#B91C1C; font-size:0.78rem; margin-bottom:2px; font-family:var(--font-display); letter-spacing:-0.2px;">${pName}</div>
                      <div class="tooltip-body" style="font-size:0.62rem; color:#4B5563; line-height:1.3; font-family:var(--font-ui); font-weight:500;">
                      <strong class="tooltip-val-sign" style="color:#1F2937;">${getLocalRashi(sign)}</strong> ${deg} · ${getLocalNakshatra(pInfo.nakshatra).split(' ')[0]}<br>
                      <span class="tooltip-val-house" style="color:#6B7280;">${lblHouse} ${toNativeNum(house, currentLang)} · ${retStr}</span>
                      </div>`;
          window.showAstroTooltip(html, e);
          window.highlightPlanet(abbr);
      };

      window.highlightPlanet = function(abbr) {
          if(!abbr) return;
          // Reset any previously highlighted planets back to default position
          document.querySelectorAll('.highlighted-planet').forEach(p => {
              if (p.id !== `chart-planet-${abbr}`) {
                  p.classList.remove('highlighted-planet');
              }
          });
          let el = document.getElementById(`chart-planet-${abbr}`);
          if(el) {
              el.classList.add('highlighted-planet');
              // Bring clicked/hovered planet to the top-most visual layer so it is never hidden behind neighbors
              const target = (el.parentElement && el.parentElement.tagName.toLowerCase() === 'g' && el.parentElement.getAttribute('transform')) ? el.parentElement : el;
              if (target && target.parentElement) {
                  isRaisingPlanet = true;
                  target.parentElement.appendChild(target);
                  setTimeout(() => { isRaisingPlanet = false; }, 80);
              }
          }
      };
      
      window.unhighlightPlanet = function(abbr) {
          if (isRaisingPlanet) return;
          if(abbr) {
              let el = document.getElementById(`chart-planet-${abbr}`);
              if(el) el.classList.remove('highlighted-planet');
          } else {
              document.querySelectorAll('.highlighted-planet').forEach(el => el.classList.remove('highlighted-planet'));
          }
      };

      // ===== LOCATION MODAL & CDN DATABASE ENGINE =====
      let globalLocationDatabase = null;
      let flatLocationSearchData = [];
      let activeLocationTargetPerson = 'native'; // 'native' | 'partner'
      let isLocationDbLoading = false;

      async function ensureLocationDatabaseLoaded() {
          if (globalLocationDatabase) return globalLocationDatabase;
          if (isLocationDbLoading) return null;
          isLocationDbLoading = true;

          const loadingIndicator = document.getElementById("locModalLoading");
          const errorContainer = document.getElementById("locModalError");
          const contentContainer = document.getElementById("locModalMainContent");

          if (loadingIndicator) loadingIndicator.style.display = "flex";
          if (errorContainer) errorContainer.style.display = "none";
          if (contentContainer) contentContainer.style.display = "none";

          try {
              const res = await fetch("https://raw.githubusercontent.com/santosh276/panchang-data/refs/heads/main/locations.json");
              if (!res.ok) throw new Error("Location database download failed");
              const data = await res.json();
              globalLocationDatabase = data;
              flattenLocationDatabase(data);
              populateCountryDropdown(data);
              if (loadingIndicator) loadingIndicator.style.display = "none";
              if (contentContainer) contentContainer.style.display = "flex";
              isLocationDbLoading = false;
              return data;
          } catch (err) {
              console.error("Location Database Error:", err);
              if (loadingIndicator) loadingIndicator.style.display = "none";
              if (errorContainer) {
                  errorContainer.style.display = "flex";
                  document.getElementById("locModalErrorText").innerText = "⚠️ Location database could not be loaded. Please check your internet connection or use Auto Detect GPS.";
              }
              isLocationDbLoading = false;
              return null;
          }
      }

      function flattenLocationDatabase(data) {
          let districtsArr = [];
          let blocksArr = [];
          let panchayatsArr = [];

          for (const [country, states] of Object.entries(data)) {
              for (const [state, stateData] of Object.entries(states)) {
                  if (Array.isArray(stateData)) {
                      for (const city of stateData) {
                          districtsArr.push({
                              label: `${city[0]}, ${state}, ${country}`,
                              name: city[0],
                              city: city[0],
                              state: state,
                              country: country,
                              type: 1,
                              lon: city[1], lat: city[2]
                          });
                      }
                  } else if (typeof stateData === 'object') {
                      for (const [district, districtData] of Object.entries(stateData)) {
                          if (districtData._coords) {
                              districtsArr.push({
                                  label: `${district} (District, ${state})`,
                                  name: district,
                                  city: district,
                                  state: state,
                                  country: country,
                                  type: 1,
                                  lon: districtData._coords[0], lat: districtData._coords[1]
                              });
                          }
                          for (const [block, blockData] of Object.entries(districtData)) {
                              if (block === "_coords") continue;
                              if (blockData._coords) {
                                  blocksArr.push({
                                      label: `${block} (Block, ${district}, ${state})`,
                                      name: block,
                                      city: block,
                                      state: state,
                                      country: country,
                                      type: 2,
                                      lon: blockData._coords[0], lat: blockData._coords[1]
                                  });
                              }
                              if (blockData._panchayats) {
                                  for (const p of blockData._panchayats) {
                                      panchayatsArr.push({
                                          label: `${p[0]} (Panchayat, ${block}, ${district})`,
                                          name: p[0],
                                          city: p[0],
                                          state: state,
                                          country: country,
                                          type: 3,
                                          lon: p[1], lat: p[2]
                                      });
                                  }
                              }
                          }
                      }
                  }
              }
          }
          flatLocationSearchData = [...districtsArr, ...blocksArr, ...panchayatsArr];
      }

      function populateCountryDropdown(data) {
          const countrySelect = document.getElementById("locSelectCountry");
          if (!countrySelect) return;
          countrySelect.innerHTML = '<option value="" disabled>Select Country</option>';
          const countries = Object.keys(data).sort();
          countries.forEach(c => {
              const opt = document.createElement("option");
              opt.value = c;
              opt.textContent = c;
              if (c === "India") opt.selected = true;
              countrySelect.appendChild(opt);
          });
          onCountryChange();
      }

      function onCountryChange() {
          const countrySelect = document.getElementById("locSelectCountry");
          const stateSelect = document.getElementById("locSelectState");
          const districtSelect = document.getElementById("locSelectDistrict");
          const blockSelect = document.getElementById("locSelectBlock");
          const panchayatSelect = document.getElementById("locSelectPanchayat");
          const districtLabel = document.getElementById("locLabelDistrict");
          const blockGroup = document.getElementById("locGroupBlock");
          const panchayatGroup = document.getElementById("locGroupPanchayat");

          if (!globalLocationDatabase || !countrySelect || !stateSelect) return;
          const country = countrySelect.value;
          const statesData = globalLocationDatabase[country] || {};

          stateSelect.innerHTML = '<option value="">Select State / Region</option>';
          districtSelect.innerHTML = '<option value="">Select Option</option>';
          blockSelect.innerHTML = '<option value="">Select Block</option>';
          panchayatSelect.innerHTML = '<option value="">Select Panchayat</option>';

          const stateNames = Object.keys(statesData).sort();
          stateNames.forEach(s => {
              const opt = document.createElement("option");
              opt.value = s;
              opt.textContent = s;
              stateSelect.appendChild(opt);
          });

          if (country === "India") {
              districtLabel.innerText = "DISTRICT";
              blockGroup.style.display = "block";
              panchayatGroup.style.display = "block";
          } else {
              districtLabel.innerText = "CITY";
              blockGroup.style.display = "none";
              panchayatGroup.style.display = "none";
          }
          validateManualSaveButton();
      }

      function onStateChange() {
          const countrySelect = document.getElementById("locSelectCountry");
          const stateSelect = document.getElementById("locSelectState");
          const districtSelect = document.getElementById("locSelectDistrict");
          const blockSelect = document.getElementById("locSelectBlock");
          const panchayatSelect = document.getElementById("locSelectPanchayat");

          if (!globalLocationDatabase || !countrySelect || !stateSelect) return;
          const country = countrySelect.value;
          const state = stateSelect.value;
          const stateData = globalLocationDatabase[country]?.[state];

          districtSelect.innerHTML = '<option value="">Select District / City</option>';
          blockSelect.innerHTML = '<option value="">Select Block</option>';
          panchayatSelect.innerHTML = '<option value="">Select Panchayat</option>';

          if (!stateData) return;

          if (country !== "India" && Array.isArray(stateData)) {
              stateData.forEach(c => {
                  const opt = document.createElement("option");
                  opt.value = c[0];
                  opt.textContent = c[0];
                  districtSelect.appendChild(opt);
              });
          } else if (typeof stateData === "object") {
              const distNames = Object.keys(stateData).sort();
              distNames.forEach(d => {
                  const opt = document.createElement("option");
                  opt.value = d;
                  opt.textContent = d;
                  districtSelect.appendChild(opt);
              });
          }
          validateManualSaveButton();
      }

      function onDistrictChange() {
          const countrySelect = document.getElementById("locSelectCountry");
          const stateSelect = document.getElementById("locSelectState");
          const districtSelect = document.getElementById("locSelectDistrict");
          const blockSelect = document.getElementById("locSelectBlock");
          const panchayatSelect = document.getElementById("locSelectPanchayat");

          if (!globalLocationDatabase || !countrySelect || !stateSelect || !districtSelect) return;
          const country = countrySelect.value;
          const state = stateSelect.value;
          const district = districtSelect.value;

          blockSelect.innerHTML = '<option value="">Select Block (Optional)</option>';
          panchayatSelect.innerHTML = '<option value="">Select Panchayat (Optional)</option>';

          if (country === "India") {
              const distData = globalLocationDatabase[country]?.[state]?.[district];
              if (distData && typeof distData === 'object') {
                  const blocks = Object.keys(distData).filter(k => k !== "_coords").sort();
                  blocks.forEach(b => {
                      const opt = document.createElement("option");
                      opt.value = b;
                      opt.textContent = b;
                      blockSelect.appendChild(opt);
                  });
              }
          }
          validateManualSaveButton();
      }

      function onBlockChange() {
          const countrySelect = document.getElementById("locSelectCountry");
          const stateSelect = document.getElementById("locSelectState");
          const districtSelect = document.getElementById("locSelectDistrict");
          const blockSelect = document.getElementById("locSelectBlock");
          const panchayatSelect = document.getElementById("locSelectPanchayat");

          if (!globalLocationDatabase) return;
          const country = countrySelect.value;
          const state = stateSelect.value;
          const district = districtSelect.value;
          const block = blockSelect.value;

          panchayatSelect.innerHTML = '<option value="">Select Panchayat (Optional)</option>';

          if (country === "India" && block) {
              const blkData = globalLocationDatabase[country]?.[state]?.[district]?.[block];
              if (blkData && blkData._panchayats && Array.isArray(blkData._panchayats)) {
                  const sortedPanchayats = [...blkData._panchayats].sort((a, b) => a[0].localeCompare(b[0]));
                  sortedPanchayats.forEach(p => {
                      const opt = document.createElement("option");
                      opt.value = p[0];
                      opt.textContent = p[0];
                      panchayatSelect.appendChild(opt);
                  });
              }
          }
          validateManualSaveButton();
      }

      function validateManualSaveButton() {
          const btn = document.getElementById("locModalSaveBtn");
          const country = document.getElementById("locSelectCountry")?.value;
          const state = document.getElementById("locSelectState")?.value;
          const district = document.getElementById("locSelectDistrict")?.value;
          if (!btn) return;

          let canSave = false;
          if (globalLocationDatabase && country && state && district) {
              canSave = true;
          }
          btn.disabled = !canSave;
          btn.style.opacity = canSave ? "1" : "0.5";
          btn.style.cursor = canSave ? "pointer" : "not-allowed";
      }

      let locSearchTimer = null; // Global timer for chunked algorithm

      function onLocationSearchInput(query) {
          const resultsBox = document.getElementById("locSearchResults");
          if (!resultsBox) return;

          // Cancel the previous animation frame if user is typing fast
          if (locSearchTimer) {
              if (window.cancelAnimationFrame) window.cancelAnimationFrame(locSearchTimer);
              else clearTimeout(locSearchTimer);
          }

          if (!query || query.trim().length < 2 || !flatLocationSearchData.length) {
              resultsBox.style.display = "none";
              resultsBox.innerHTML = "";
              return;
          }

          const lowerTerm = query.toLowerCase().trim();
          let matches = [];
          let i = 0;
          const total = flatLocationSearchData.length;

          // Chunked Fast Search Algorithm
          const processChunk = () => {
              const chunkEnd = Math.min(i + 10000, total);
              for (; i < chunkEnd; i++) {
                  const item = flatLocationSearchData[i];
                  if (item.name.toLowerCase().includes(lowerTerm) || item.label.toLowerCase().includes(lowerTerm)) {
                      matches.push(item);
                      if (matches.length >= 100) break; 
                  }
              }

              if (matches.length >= 100 || i >= total) {
                  matches.sort((a, b) => {
                      const aExact = a.name.toLowerCase() === lowerTerm;
                      const bExact = b.name.toLowerCase() === lowerTerm;
                      if (aExact && !bExact) return -1;
                      if (!aExact && bExact) return 1;
                      return a.type - b.type;
                  });

                  const topResults = matches.slice(0, 15);
                  if (topResults.length === 0) {
                      resultsBox.style.display = "none";
                      resultsBox.innerHTML = "";
                      return;
                  }

                  resultsBox.innerHTML = topResults.map((item, idx) => `
                      <div onclick='applyLocationChoice(${JSON.stringify(item)})' style="padding: 10px 14px; border-bottom: 1px solid rgba(0,0,0,0.04); cursor: pointer; transition: background 0.15s ease;" onmouseover="this.style.background='#FFF5F5'" onmouseout="this.style.background='#FFFFFF'">
                          <div style="font-weight: 700; color: #1F2937; font-size: 0.88rem;">${item.name}</div>
                          <div style="font-size: 0.72rem; color: #6B7280;">${item.label}</div>
                      </div>
                  `).join('');
                  resultsBox.style.display = "block";
              } else {
                  // Yield to the main thread to prevent UI freezing
                  if (window.requestAnimationFrame) {
                      locSearchTimer = window.requestAnimationFrame(processChunk);
                  } else {
                      locSearchTimer = setTimeout(processChunk, 0);
                  }
              }
          };

          processChunk();
      }

      function applyLocationChoice(item) {
          try {
              closeLocationModal(); // ତୁରନ୍ତ Modal କୁ ବନ୍ଦ କରିବା

              const prefix = activeLocationTargetPerson === 'native' ? 'native' : 'partner';
              const prefixCap = activeLocationTargetPerson === 'native' ? 'birth' : 'partnerBirth';

              const cityInput = document.getElementById(prefixCap === 'birth' ? 'birthCity' : 'partnerBirthCity');
              const stateInput = document.getElementById(prefixCap === 'birth' ? 'birthState' : 'partnerBirthState');
              const countryInput = document.getElementById(prefixCap === 'birth' ? 'birthCountry' : 'partnerBirthCountry');
              const latInput = document.getElementById(activeLocationTargetPerson === 'native' ? 'latitude' : 'partnerLatitude');
              const lngInput = document.getElementById(activeLocationTargetPerson === 'native' ? 'longitude' : 'partnerLongitude');
              const tzInput = document.getElementById(activeLocationTargetPerson === 'native' ? 'timezone' : 'partnerTimezone');
              const olsonInput = document.getElementById(activeLocationTargetPerson === 'native' ? 'olsonTimezone' : 'partnerOlsonTimezone');

              if (cityInput) {
                  cityInput.value = item.city || item.name || '';
                  cityInput.dispatchEvent(new Event('change', { bubbles: true }));
              }
              if (stateInput) stateInput.value = item.state || '';
              if (countryInput) countryInput.value = item.country || 'India';
              
              if (latInput && typeof item.lat !== 'undefined') {
                  latInput.value = item.lat;
                  latInput.dispatchEvent(new Event('change', { bubbles: true }));
              }
              if (lngInput && typeof item.lon !== 'undefined') {
                  lngInput.value = item.lon;
                  lngInput.dispatchEvent(new Event('change', { bubbles: true }));
              }

              // Dynamic Timezone Calculator for Global Support
              if (item.country === "India") {
                  if (tzInput) { 
                      tzInput.value = "+05:30"; 
                      tzInput.dispatchEvent(new Event('change', { bubbles: true })); 
                  }
                  if (olsonInput) { olsonInput.value = "Asia/Kolkata"; }
              } else if (item.lon !== undefined) {
                  // Longitude ରୁ Timezone ଗଣନା କରିବା (15 degree = 1 hour)
                  let offsetHours = item.lon / 15;
                  let hrs = Math.floor(Math.abs(offsetHours));
                  let mins = Math.round((Math.abs(offsetHours) - hrs) * 60);
                  // Snap to nearest 15 mins for standardized timezones
                  mins = Math.round(mins / 15) * 15;
                  if (mins === 60) { hrs += 1; mins = 0; }
                  
                  let sign = offsetHours >= 0 ? "+" : "-";
                  let tzString = `${sign}${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
                  
                  if (tzInput) {
                      tzInput.value = tzString;
                      tzInput.dispatchEvent(new Event('change', { bubbles: true })); 
                  }
                  if (olsonInput) { olsonInput.value = ""; } // Clear Olson so the engine relies on our calculated numeric TZ
              }

              // Trigger URL auto-save if available
              if (window.getAppShareUrl) {
                  const shareUrl = window.getAppShareUrl();
                  if (shareUrl) window.history.replaceState({}, '', shareUrl);
              }
          } catch(err) {
              console.error("Apply Location Error: ", err);
          }
      }

      function applyManualLocationSelection() {
          try {
              const country = document.getElementById("locSelectCountry")?.value;
              const state = document.getElementById("locSelectState")?.value;
              const district = document.getElementById("locSelectDistrict")?.value;
              const block = document.getElementById("locSelectBlock")?.value;
              const panchayat = document.getElementById("locSelectPanchayat")?.value;

              if (!globalLocationDatabase || !country || !state || !district) return;
              const targetData = globalLocationDatabase[country]?.[state];
              if (!targetData) return;

              let choice = { city: district, state: state, country: country, name: district, lat: 0, lon: 0 };

              if (country !== "India" && Array.isArray(targetData)) {
                  const cityData = targetData.find(c => c[0] === district);
                  if (cityData) {
                      choice.lat = cityData[2];
                      choice.lon = cityData[1];
                      choice.city = cityData[0];
                  }
              } else if (typeof targetData === "object") {
                  const distData = targetData[district];
                  if (distData) {
                      let locationFound = false;
                      
                      // 1. Check Panchayat
                      if (panchayat && block) {
                          const blkData = distData[block];
                          if (blkData && blkData._panchayats) {
                              const p = blkData._panchayats.find(x => x[0] === panchayat);
                              if (p) {
                                  choice.city = p[0];
                                  choice.name = p[0];
                                  choice.lat = p[2];
                                  choice.lon = p[1];
                                  locationFound = true;
                              }
                          }
                      }
                      // 2. Check Block
                      if (!locationFound && block) {
                          const blkData = distData[block];
                          if (blkData && blkData._coords) {
                              choice.city = block;
                              choice.name = block;
                              choice.lat = blkData._coords[1];
                              choice.lon = blkData._coords[0];
                              locationFound = true;
                          }
                      }
                      // 3. Fallback to District
                      if (!locationFound && distData._coords) {
                          choice.lat = distData._coords[1];
                          choice.lon = distData._coords[0];
                      }
                  }
              }

              applyLocationChoice(choice);
          } catch(err) {
              console.error("Manual Selection Error: ", err);
          }
      }

      function handleGpsAutoDetect() {
          const gpsStatus = document.getElementById("locGpsStatusText");
          if (!navigator.geolocation) {
              alert("Geolocation is not supported by your browser");
              return;
          }
          if (gpsStatus) gpsStatus.innerText = "Detecting exact satellite GPS coordinates...";

          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const lat = position.coords.latitude;
                  const lon = position.coords.longitude;
                  applyLocationChoice({
                      name: "GPS Location",
                      city: "GPS Location",
                      state: "",
                      country: "India",
                      lat: Math.round(lat * 10000) / 10000,
                      lon: Math.round(lon * 10000) / 10000
                  });
                  if (gpsStatus) gpsStatus.innerText = "Get location automatically from device GPS";
              },
              (error) => {
                  alert("Unable to retrieve GPS location. Please ensure location permissions are granted.");
                  if (gpsStatus) gpsStatus.innerText = "Get location automatically from device GPS";
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
      }

      function openLocationModal(targetPerson) {
          activeLocationTargetPerson = targetPerson || 'native';
          const modal = document.getElementById("locationModalGlobal");
          const searchInput = document.getElementById("locSearchInput");
          const resultsBox = document.getElementById("locSearchResults");

          if (modal) modal.style.display = "flex";
          if (searchInput) searchInput.value = "";
          if (resultsBox) { resultsBox.innerHTML = ""; resultsBox.style.display = "none"; }

          ensureLocationDatabaseLoaded();
      }

      function closeLocationModal() {
          const modal = document.getElementById("locationModalGlobal");
          if (modal) modal.style.display = "none";
      }

      // ===== CITY SEARCH AUTOCOMPLETE (UPGRADED WITH CDN DATABASE & CHUNKED ALGORITHM) =====

      function attachCityAutocomplete(inputId, suggestionsId, latId, lngId, tzId, olsonId, personPrefix) {
          const inputEl = document.getElementById(inputId);
          const suggestionsEl = document.getElementById(suggestionsId);
          if (!inputEl || !suggestionsEl) return;

          let inlineSearchTimer = null;

          inputEl.addEventListener("input", async (e) => {
              const query = e.target.value.toLowerCase().trim();
              if (query.length < 2) {
                  suggestionsEl.classList.remove("active");
                  suggestionsEl.innerHTML = "";
                  return;
              }

              // Load Global DB if not already loaded
              if (!globalLocationDatabase) {
                  suggestionsEl.innerHTML = `<div style="padding: 12px; font-size: 0.8rem; color: #6B7280; text-align: center; font-weight: 600;">Loading database...</div>`;
                  suggestionsEl.classList.add("active");
                  await ensureLocationDatabaseLoaded();
              }

              if (inlineSearchTimer) {
                  if (window.cancelAnimationFrame) window.cancelAnimationFrame(inlineSearchTimer);
                  else clearTimeout(inlineSearchTimer);
              }

              if (!flatLocationSearchData || flatLocationSearchData.length === 0) return;

              let matches = [];
              let i = 0;
              const total = flatLocationSearchData.length;

              const processChunk = () => {
                  const chunkEnd = Math.min(i + 10000, total);
                  for (; i < chunkEnd; i++) {
                      const item = flatLocationSearchData[i];
                      const nLow = item.name.toLowerCase();
                      const lLow = item.label.toLowerCase();
                      if (nLow.includes(query) || lLow.includes(query)) {
                          matches.push(item);
                          if (matches.length >= 300) break; // Scan deeper to ensure Panchayats are included
                      }
                  }

                  if (matches.length >= 300 || i >= total) {
                      matches.sort((a, b) => {
                          const aName = a.name.toLowerCase();
                          const bName = b.name.toLowerCase();
                          const aExact = aName === query;
                          const bExact = bName === query;
                          if (aExact && !bExact) return -1;
                          if (!aExact && bExact) return 1;

                          const aStarts = aName.startsWith(query);
                          const bStarts = bName.startsWith(query);
                          if (aStarts && !bStarts) return -1;
                          if (!aStarts && bStarts) return 1;

                          return a.type - b.type;
                      });

                      const topResults = matches.slice(0, 15);
                      if (topResults.length === 0) {
                          suggestionsEl.classList.remove("active");
                          suggestionsEl.innerHTML = "";
                          return;
                      }

                      suggestionsEl.innerHTML = topResults.map((item) => {
                          const typeLabel = item.type === 1 ? 'City' : (item.type === 2 ? 'Block' : 'Panchayat');
                          const typeColor = item.type === 1 ? '#2563EB' : (item.type === 2 ? '#D97706' : '#059669');
                          const typeBg = item.type === 1 ? '#EFF6FF' : (item.type === 2 ? '#FFFBEB' : '#ECFDF5');

                          return `
                              <div class="city-suggestion" data-item='${JSON.stringify(item).replace(/'/g, "&#39;")}'>
                                  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; pointer-events: none; gap: 6px;">
                                      <div style="font-weight: 800; color: #111827; font-size: 0.8rem; letter-spacing: -0.2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                                      <span style="font-size: 0.58rem; font-weight: 800; text-transform: uppercase; color: ${typeColor}; background: ${typeBg}; padding: 1px 5px; border-radius: 4px; letter-spacing: 0.3px; flex-shrink: 0;">${typeLabel}</span>
                                  </div>
                                  <div style="font-size: 0.66rem; color: #6B7280; line-height: 1.25; pointer-events: none; font-weight: 500; margin-top: 1px;">${item.label}</div>
                              </div>
                          `;
                      }).join("");
                      suggestionsEl.classList.add("active");
                  } else {
                      if (window.requestAnimationFrame) {
                          inlineSearchTimer = window.requestAnimationFrame(processChunk);
                      } else {
                          inlineSearchTimer = setTimeout(processChunk, 0);
                      }
                  }
              };

              processChunk();
          });

          suggestionsEl.addEventListener("click", (e) => {
              const suggestion = e.target.closest(".city-suggestion");
              if (suggestion) {
                  const item = JSON.parse(suggestion.dataset.item);
                  inputEl.value = item.city || item.name || '';
                  
                  const stateInput = document.getElementById(personPrefix === 'native' ? 'birthState' : 'partnerBirthState');
                  const countryInput = document.getElementById(personPrefix === 'native' ? 'birthCountry' : 'partnerBirthCountry');
                  
                  if (stateInput && item.state) stateInput.value = item.state;
                  if (countryInput && item.country) countryInput.value = item.country;

                  const latEl = document.getElementById(latId);
                  if(latEl) { latEl.value = item.lat; latEl.dispatchEvent(new Event('change', {bubbles: true})); }
                  
                  const lngEl = document.getElementById(lngId);
                  if(lngEl) { lngEl.value = item.lon; lngEl.dispatchEvent(new Event('change', {bubbles: true})); }
                  
                  const olsonEl = document.getElementById(olsonId);
                  if(olsonEl && item.country === 'India') { olsonEl.value = 'Asia/Kolkata'; }

                  const tzEl = document.getElementById(tzId);
                  if (tzEl && item.country === 'India') {
                      tzEl.value = "+05:30";
                      tzEl.dispatchEvent(new Event('change', {bubbles: true}));
                  }

                  suggestionsEl.classList.remove("active");

                  // Auto-update the Share URL with the new data
                  if (window.getAppShareUrl) {
                      const shareUrl = window.getAppShareUrl();
                      if (shareUrl) window.history.replaceState({}, '', shareUrl);
                  }
              }
          });
      }

      // Advanced Options Toggle
      const advancedBtn = document.getElementById("advancedOptionsBtn");
      if (advancedBtn) {
        advancedBtn.addEventListener("click", () => {
          const advancedDiv = document.getElementById("advancedOptions");
          if (
            advancedDiv.style.display === "none" ||
            advancedDiv.style.display === ""
          ) {
            advancedDiv.style.display = "grid"; // matches form-grid class display
            advancedBtn.innerHTML = langData[currentLang].ui["lbl_advanced_up"] || "Advanced options / Custom Location ⬆";
          } else {
            advancedDiv.style.display = "none";
            advancedBtn.innerHTML = langData[currentLang].ui["lbl_advanced_down"] || "Advanced options / Custom Location ⬇";
          }
        });
      }

      // Partner Advanced Options Toggle
      const partnerAdvancedBtn = document.getElementById("partneradvancedOptionsBtn");
      if (partnerAdvancedBtn) {
        partnerAdvancedBtn.addEventListener("click", () => {
          const partnerAdvancedDiv = document.getElementById("partneradvancedOptions");
          if (
            partnerAdvancedDiv.style.display === "none" ||
            partnerAdvancedDiv.style.display === ""
          ) {
            partnerAdvancedDiv.style.display = "grid"; // matches form-grid class display
            partnerAdvancedBtn.innerHTML = langData[currentLang].ui["lbl_advanced_up"] || "Advanced options / Custom Location ⬆";
          } else {
            partnerAdvancedDiv.style.display = "none";
            partnerAdvancedBtn.innerHTML = langData[currentLang].ui["lbl_advanced_down"] || "Advanced options / Custom Location ⬇";
          }
        });
      }

      document.addEventListener("click", (e) => {
        if (!e.target.closest(".city-input")) {
          citySuggestions.classList.remove("active");
        }
      });

      // ===== EVENT HANDLERS =====

      // Chart style toggles
      window.setChartStyle = function(style) {
       currentChartStyle = style;
       document.querySelectorAll(".chart-toggles .btn-toggle").forEach((b) => {
           if (b.dataset.chart === style) {
               b.classList.add("active");
           } else {
               b.classList.remove("active");
           }
       });

       try { if (typeof window.renderMatchChart === 'function') window.renderMatchChart(); } catch (e) { console.error(e); }
   };

      // ===== INITIALIZATION =====

      async function init() {
        // Strip out "Celebrity" from translations to match new UI context
        Object.keys(langData).forEach(lang => {
            if(langData[lang].ui) {
                if (langData[lang].ui.lbl_load_preset) {
                    langData[lang].ui.lbl_load_preset = langData[lang].ui.lbl_load_preset.replace(/Celebrity|सेलिब्रिटी|ସେଲିବ୍ରିଟି|সেলিব্রিটি|सेलिब्रिटी|સેલિબ્રિટી|ਸੇਲਿਬ੍ਰਿਟੀ|பிரபலங்களின் |సెలబ్రిటీల |ಸೆಲೆಬ್ರಿಟಿ |സെലിബ്രിറ്റി |চেলিব্ৰিটি /g, "").replace("Preset", "Profile").replace("ପ୍ରିସେଟ୍", "ପ୍ରୋଫାଇଲ୍").trim();
                }
                if (langData[lang].ui.lbl_load_preset_opt) {
                    langData[lang].ui.lbl_load_preset_opt = langData[lang].ui.lbl_load_preset_opt.replace(/Celebrity|सेलिब्रिटी|ସେଲିବ୍ରିଟି|সেলিব্রিটি|सेलिब्रिटी|સેલિબ્રિટી|ਸੇਲਿਬ੍ਰਿਟੀ|பிரபலங்களின் |సెలబ్రిటీల |ಸೆಲೆಬ್ರಿಟಿ |സെലിബ്രിറ്റി |চেলিব্ৰিটি /g, "").replace("Preset", "Profile").replace("ପ୍ରିସେଟ୍", "ପ୍ରୋଫାଇଲ୍").trim();
                }
            }
        });

        updatePresetDropdowns();

        attachCityAutocomplete("birthCity", "citySuggestions", "latitude", "longitude", "timezone", "olsonTimezone", "native");
        attachCityAutocomplete("partnerBirthCity", "partnerCitySuggestions", "partnerLatitude", "partnerLongitude", "partnerTimezone", "partnerOlsonTimezone", "partner");
        if(document.getElementById('appLanguageSelector')) {
            document.getElementById('appLanguageSelector').value = currentLang;
        }

        // --- URL Sharing Data Parser ---
        const urlP = new URLSearchParams(window.location.search);
        let encryptedData = urlP.get('data');
        if(encryptedData) {
            try {
                // Restore base64 padding if missing
                while (encryptedData.length % 4 !== 0) { encryptedData += '='; }
                
                // Decode Base64 safely
                const decodedStr = decodeURIComponent(escape(atob(encryptedData)));
                let dataObj = {};
                
                const parseAndSetPerson = (packedStr, prefix) => {
                    const parts = packedStr.split('|');
                    if(parts.length < 1) return false;
                    
                    const dStr = parts[2] || '';
                    const dateUnpack = dStr.length === 8 ? dStr.substring(0,4) + '-' + dStr.substring(4,6) + '-' + dStr.substring(6,8) : dStr;
                    
                    const tStr = parts[3] || '';
                    const timeUnpack = tStr.length >= 4 ? tStr.substring(0,2) + ':' + tStr.substring(2,4) + ':' + (tStr.substring(4,6) || '00') : tStr;

                    const safeSet = (id, val) => { 
                        const el = document.getElementById(id); 
                        if(el && val !== undefined && val !== null && val !== '') { 
                            el.value = val; 
                            const evt = new Event('change', {bubbles: true});
                            evt.isProgrammatic = true;
                            el.dispatchEvent(evt); 
                        } 
                    };

                    safeSet(prefix + 'Name', parts[0]);
                    safeSet(prefix === 'native' ? 'gender' : 'partnerGender', parts[1] === '0' ? 'female' : 'male');
                    safeSet(prefix === 'native' ? 'birthDate' : 'partnerBirthDate', dateUnpack);
                    
                    const dParts = dateUnpack.split('-');
                    if (dParts.length === 3) safeSet(prefix === 'native' ? 'birthDateDisplay' : 'partnerBirthDateDisplay', `${dParts[2]}/${dParts[1]}/${dParts[0]}`);

                    safeSet(prefix === 'native' ? 'birthTime' : 'partnerBirthTime', timeUnpack);
                    const tParts = timeUnpack.split(':');
                    if (tParts.length >= 2) {
                        let h24 = parseInt(tParts[0]);
                        let ampm = h24 >= 12 ? 'PM' : 'AM';
                        let h12 = h24 % 12 || 12;
                        safeSet(prefix === 'native' ? 'birthTimeDisplay' : 'partnerBirthTimeDisplay', `${String(h12).padStart(2,'0')}:${tParts[1]}:${tParts[2]||'00'}`);
                        safeSet(prefix === 'native' ? 'birthTimeAMPM' : 'partnerBirthTimeAMPM', ampm);
                    }

                    safeSet(prefix === 'native' ? 'latitude' : 'partnerLatitude', parts[4] || '');
                    safeSet(prefix === 'native' ? 'longitude' : 'partnerLongitude', parts[5] || '');
                    if (parts[6]) safeSet(prefix === 'native' ? 'timezone' : 'partnerTimezone', parts[6]);
                    safeSet(prefix === 'native' ? 'birthCity' : 'partnerBirthCity', parts[7] || '');
                    safeSet(prefix === 'native' ? 'birthState' : 'partnerBirthState', parts[8] || '');
                    safeSet(prefix === 'native' ? 'birthCountry' : 'partnerBirthCountry', parts[9] || '');
                    
                    return true;
                };

                let isMatch = decodedStr.includes('~');
                let success = false;
                
                if (isMatch) {
                    const [nativeStr, partnerStr] = decodedStr.split('~');
                    let s1 = parseAndSetPerson(nativeStr, 'native');
                    let s2 = parseAndSetPerson(partnerStr, 'partner');
                    success = s1 || s2;
                } else {
                    success = parseAndSetPerson(decodedStr, 'native');
                }

                if(success) {
                    const nName = document.getElementById("nativeName").value;
                    const nDate = document.getElementById("birthDate").value;
                    const nLat = document.getElementById("latitude").value;
                    const nLng = document.getElementById("longitude").value;
                    
                    let canCalculate = nName && nDate && nLat && nLng;
                    
                    if (isMatch) {
                        const pName = document.getElementById("partnerName").value;
                        const pDate = document.getElementById("partnerBirthDate").value;
                        const pLat = document.getElementById("partnerLatitude").value;
                        const pLng = document.getElementById("partnerLongitude").value;
                        if (!pName || !pDate || !pLat || !pLng) canCalculate = false;
                    }

                    if (canCalculate) {
                        // Highlight the calculate button & trigger computation
                        setTimeout(() => { 
                            const btn = document.getElementById("calculateBtn");
                            if (btn) {
                                btn.style.boxShadow = "0 0 15px var(--accent-glow)";
                                setTimeout(() => { btn.style.boxShadow = ""; }, 1000);
                            }
                            calculateKundli(); 
                        }, 800);
                    }
                }
            } catch(e) {
                console.error("Failed to parse shared link data", e);
            }
        }

        const nativeContainer = document.getElementById('nativeDetailsContainer');
        if (nativeContainer) {
            const resetBtn1 = (e) => { 
                if (!e.isProgrammatic && e.target.tagName !== 'BUTTON' && !e.target.id.includes('preset-selector')) {
                    resetProfileToggleButton(1); 
                }
            };
            nativeContainer.addEventListener('input', resetBtn1);
            nativeContainer.addEventListener('change', resetBtn1);
        }
        
        const partnerContainer = document.getElementById('partnerDetailsContainer');
        if (partnerContainer) {
            const resetBtn2 = (e) => { 
                if (!e.isProgrammatic && e.target.tagName !== 'BUTTON' && !e.target.id.includes('preset-selector')) {
                    resetProfileToggleButton(2); 
                }
            };
            partnerContainer.addEventListener('input', resetBtn2);
            partnerContainer.addEventListener('change', resetBtn2);
        }

        const formSection = document.querySelector('.input-form');
        if (formSection) {
            const updateUrlDynamically = (e) => {
                if (e && e.isProgrammatic) return; 
                try {
                    const shareUrl = window.getAppShareUrl && window.getAppShareUrl();
                    if (shareUrl) {
                        window.history.replaceState({}, '', shareUrl);
                    }
                } catch(err) {}
            };
            // URL dynamic listeners temporarily paused during development stage
            // formSection.addEventListener('input', updateUrlDynamically);
            // formSection.addEventListener('change', updateUrlDynamically);
        }

        await fetchLocalizedParagraphs(currentLang);
        applyTranslations();
      }


      document.addEventListener("DOMContentLoaded", init);
    
      // --- Touch support for chart tooltips on Mobile ---
      document.addEventListener("touchstart", (e) => {
        const tip = document.getElementById("astroTooltip");
        const planetEl = e.target.closest(".interactable-planet");
        const houseEl = e.target.closest(".interactable-house");
        
        if (planetEl && planetEl.id) {
            const abbr = planetEl.id.replace("chart-planet-", "");
            const t = e.touches[0];
            // Get the planet info from global rendered planets
            if (window.currentRenderedPlanets) {
                const pInfo = window.currentRenderedPlanets.find(p => p.abbr === abbr);
                if (pInfo) {
                    window.handlePlanetEnter({ clientX: t.clientX, clientY: t.clientY }, abbr, pInfo.house, Math.floor(pInfo.degree) + '°', pInfo.sign);
                }
            }
        } else if (houseEl && houseEl.dataset && houseEl.dataset.house) {
            const hNum = parseInt(houseEl.dataset.house);
            const t = e.touches[0];
            window.handleHouseEnter({ clientX: t.clientX, clientY: t.clientY }, hNum);
        } else if (tip) {
            tip.style.opacity = 0;   // Tap anywhere else to dismiss tooltip
            window.unhighlightPlanet();
        }
      }, { passive: true });

    
if(typeof fetchLocalizedParagraphs==="function"&&typeof window["fetchLocalizedParagraphs"]==="undefined")window["fetchLocalizedParagraphs"]=fetchLocalizedParagraphs;if(typeof toNativeNum==="function"&&typeof window["toNativeNum"]==="undefined")window["toNativeNum"]=toNativeNum;if(typeof getLocalizedArrayItem==="function"&&typeof window["getLocalizedArrayItem"]==="undefined")window["getLocalizedArrayItem"]=getLocalizedArrayItem;if(typeof getLocalPlanet==="function"&&typeof window["getLocalPlanet"]==="undefined")window["getLocalPlanet"]=getLocalPlanet;if(typeof getLocalRashi==="function"&&typeof window["getLocalRashi"]==="undefined")window["getLocalRashi"]=getLocalRashi;if(typeof getLocalNakshatra==="function"&&typeof window["getLocalNakshatra"]==="undefined")window["getLocalNakshatra"]=getLocalNakshatra;if(typeof getLocalYoga==="function"&&typeof window["getLocalYoga"]==="undefined")window["getLocalYoga"]=getLocalYoga;if(typeof getLocalKarana==="function"&&typeof window["getLocalKarana"]==="undefined")window["getLocalKarana"]=getLocalKarana;if(typeof getLocalStatus==="function"&&typeof window["getLocalStatus"]==="undefined")window["getLocalStatus"]=getLocalStatus;if(typeof applyTranslations==="function"&&typeof window["applyTranslations"]==="undefined")window["applyTranslations"]=applyTranslations;if(typeof changeAppLanguage==="function"&&typeof window["changeAppLanguage"]==="undefined")window["changeAppLanguage"]=changeAppLanguage;if(typeof r==="function"&&typeof window["r"]==="undefined")window["r"]=r;if(typeof A==="function"&&typeof window["A"]==="undefined")window["A"]=A;if(typeof triggerNativePicker==="function"&&typeof window["triggerNativePicker"]==="undefined")window["triggerNativePicker"]=triggerNativePicker;if(typeof handleNativeDateChange==="function"&&typeof window["handleNativeDateChange"]==="undefined")window["handleNativeDateChange"]=handleNativeDateChange;if(typeof handleNativeTimeChange==="function"&&typeof window["handleNativeTimeChange"]==="undefined")window["handleNativeTimeChange"]=handleNativeTimeChange;if(typeof handleDateDisplayInput==="function"&&typeof window["handleDateDisplayInput"]==="undefined")window["handleDateDisplayInput"]=handleDateDisplayInput;if(typeof handleTimeDisplayInput==="function"&&typeof window["handleTimeDisplayInput"]==="undefined")window["handleTimeDisplayInput"]=handleTimeDisplayInput;if(typeof updatePresetDropdowns==="function"&&typeof window["updatePresetDropdowns"]==="undefined")window["updatePresetDropdowns"]=updatePresetDropdowns;if(typeof saveCustomPreset==="function"&&typeof window["saveCustomPreset"]==="undefined")window["saveCustomPreset"]=saveCustomPreset;if(typeof resetProfileToggleButton==="function"&&typeof window["resetProfileToggleButton"]==="undefined")window["resetProfileToggleButton"]=resetProfileToggleButton;if(typeof handleProfileToggle==="function"&&typeof window["handleProfileToggle"]==="undefined")window["handleProfileToggle"]=handleProfileToggle;if(typeof deleteCustomPreset==="function"&&typeof window["deleteCustomPreset"]==="undefined")window["deleteCustomPreset"]=deleteCustomPreset;if(typeof clearProfile==="function"&&typeof window["clearProfile"]==="undefined")window["clearProfile"]=clearProfile;if(typeof loadPreset==="function"&&typeof window["loadPreset"]==="undefined")window["loadPreset"]=loadPreset;if(typeof loadPartnerPreset==="function"&&typeof window["loadPartnerPreset"]==="undefined")window["loadPartnerPreset"]=loadPartnerPreset;if(typeof resolveTimezoneOffset==="function"&&typeof window["resolveTimezoneOffset"]==="undefined")window["resolveTimezoneOffset"]=resolveTimezoneOffset;if(typeof getWeekdayFromDateStr==="function"&&typeof window["getWeekdayFromDateStr"]==="undefined")window["getWeekdayFromDateStr"]=getWeekdayFromDateStr;if(typeof calculateJulianDay==="function"&&typeof window["calculateJulianDay"]==="undefined")window["calculateJulianDay"]=calculateJulianDay;if(typeof normalizeAngle==="function"&&typeof window["normalizeAngle"]==="undefined")window["normalizeAngle"]=normalizeAngle;if(typeof getAyanamsa==="function"&&typeof window["getAyanamsa"]==="undefined")window["getAyanamsa"]=getAyanamsa;if(typeof jdToDate==="function"&&typeof window["jdToDate"]==="undefined")window["jdToDate"]=jdToDate;if(typeof jdToDateStr==="function"&&typeof window["jdToDateStr"]==="undefined")window["jdToDateStr"]=jdToDateStr;if(typeof getGeoLon==="function"&&typeof window["getGeoLon"]==="undefined")window["getGeoLon"]=getGeoLon;if(typeof calculateSunPosition==="function"&&typeof window["calculateSunPosition"]==="undefined")window["calculateSunPosition"]=calculateSunPosition;if(typeof calculateMoonPosition==="function"&&typeof window["calculateMoonPosition"]==="undefined")window["calculateMoonPosition"]=calculateMoonPosition;if(typeof calculatePlanetPosition==="function"&&typeof window["calculatePlanetPosition"]==="undefined")window["calculatePlanetPosition"]=calculatePlanetPosition;if(typeof calculateRahuPosition==="function"&&typeof window["calculateRahuPosition"]==="undefined")window["calculateRahuPosition"]=calculateRahuPosition;if(typeof calculateAscendant==="function"&&typeof window["calculateAscendant"]==="undefined")window["calculateAscendant"]=calculateAscendant;if(typeof getSignFromLongitude==="function"&&typeof window["getSignFromLongitude"]==="undefined")window["getSignFromLongitude"]=getSignFromLongitude;if(typeof getDegreeInSign==="function"&&typeof window["getDegreeInSign"]==="undefined")window["getDegreeInSign"]=getDegreeInSign;if(typeof getNakshatraFromLongitude==="function"&&typeof window["getNakshatraFromLongitude"]==="undefined")window["getNakshatraFromLongitude"]=getNakshatraFromLongitude;if(typeof getPlanetStatus==="function"&&typeof window["getPlanetStatus"]==="undefined")window["getPlanetStatus"]=getPlanetStatus;if(typeof getVargaSign==="function"&&typeof window["getVargaSign"]==="undefined")window["getVargaSign"]=getVargaSign;if(typeof calculateMC==="function"&&typeof window["calculateMC"]==="undefined")window["calculateMC"]=calculateMC;if(typeof calculateSripatiChalit==="function"&&typeof window["calculateSripatiChalit"]==="undefined")window["calculateSripatiChalit"]=calculateSripatiChalit;if(typeof generateAllCharts==="function"&&typeof window["generateAllCharts"]==="undefined")window["generateAllCharts"]=generateAllCharts;if(typeof calculateGochar==="function"&&typeof window["calculateGochar"]==="undefined")window["calculateGochar"]=calculateGochar;if(typeof calculateSunriseSunset==="function"&&typeof window["calculateSunriseSunset"]==="undefined")window["calculateSunriseSunset"]=calculateSunriseSunset;if(typeof formatTime==="function"&&typeof window["formatTime"]==="undefined")window["formatTime"]=formatTime;if(typeof getDecimalHours==="function"&&typeof window["getDecimalHours"]==="undefined")window["getDecimalHours"]=getDecimalHours;if(typeof calculatePanchang==="function"&&typeof window["calculatePanchang"]==="undefined")window["calculatePanchang"]=calculatePanchang;if(typeof getVarna==="function"&&typeof window["getVarna"]==="undefined")window["getVarna"]=getVarna;if(typeof getVashya==="function"&&typeof window["getVashya"]==="undefined")window["getVashya"]=getVashya;if(typeof getYunja==="function"&&typeof window["getYunja"]==="undefined")window["getYunja"]=getYunja;if(typeof getPayaNakBased==="function"&&typeof window["getPayaNakBased"]==="undefined")window["getPayaNakBased"]=getPayaNakBased;if(typeof populateSelect==="function"&&typeof window["populateSelect"]==="undefined")window["populateSelect"]=populateSelect;if(typeof decimalToDMS==="function"&&typeof window["decimalToDMS"]==="undefined")window["decimalToDMS"]=decimalToDMS;if(typeof dmsToDecimal==="function"&&typeof window["dmsToDecimal"]==="undefined")window["dmsToDecimal"]=dmsToDecimal;if(typeof syncDecimalToUI==="function"&&typeof window["syncDecimalToUI"]==="undefined")window["syncDecimalToUI"]=syncDecimalToUI;if(typeof syncUIToDecimal==="function"&&typeof window["syncUIToDecimal"]==="undefined")window["syncUIToDecimal"]=syncUIToDecimal;if(typeof toggleInputForm==="function"&&typeof window["toggleInputForm"]==="undefined")window["toggleInputForm"]=toggleInputForm;if(typeof escapeHtml==="function"&&typeof window["escapeHtml"]==="undefined")window["escapeHtml"]=escapeHtml;if(typeof calculateKundli==="function"&&typeof window["calculateKundli"]==="undefined")window["calculateKundli"]=calculateKundli;if(typeof getHouseFromSign==="function"&&typeof window["getHouseFromSign"]==="undefined")window["getHouseFromSign"]=getHouseFromSign;if(typeof getSignFromHouse==="function"&&typeof window["getSignFromHouse"]==="undefined")window["getSignFromHouse"]=getSignFromHouse;if(typeof renderNorthChart==="function"&&typeof window["renderNorthChart"]==="undefined")window["renderNorthChart"]=renderNorthChart;if(typeof getOgeeFromMid==="function"&&typeof window["getOgeeFromMid"]==="undefined")window["getOgeeFromMid"]=getOgeeFromMid;if(typeof getOgeeToMid==="function"&&typeof window["getOgeeToMid"]==="undefined")window["getOgeeToMid"]=getOgeeToMid;if(typeof renderSouthChart==="function"&&typeof window["renderSouthChart"]==="undefined")window["renderSouthChart"]=renderSouthChart;if(typeof renderEastChart==="function"&&typeof window["renderEastChart"]==="undefined")window["renderEastChart"]=renderEastChart;if(typeof renderWestChart==="function"&&typeof window["renderWestChart"]==="undefined")window["renderWestChart"]=renderWestChart;if(typeof getArcSector==="function"&&typeof window["getArcSector"]==="undefined")window["getArcSector"]=getArcSector;if(typeof formatDMS==="function"&&typeof window["formatDMS"]==="undefined")window["formatDMS"]=formatDMS;if(typeof ensureLocationDatabaseLoaded==="function"&&typeof window["ensureLocationDatabaseLoaded"]==="undefined")window["ensureLocationDatabaseLoaded"]=ensureLocationDatabaseLoaded;if(typeof flattenLocationDatabase==="function"&&typeof window["flattenLocationDatabase"]==="undefined")window["flattenLocationDatabase"]=flattenLocationDatabase;if(typeof populateCountryDropdown==="function"&&typeof window["populateCountryDropdown"]==="undefined")window["populateCountryDropdown"]=populateCountryDropdown;if(typeof onCountryChange==="function"&&typeof window["onCountryChange"]==="undefined")window["onCountryChange"]=onCountryChange;if(typeof onStateChange==="function"&&typeof window["onStateChange"]==="undefined")window["onStateChange"]=onStateChange;if(typeof onDistrictChange==="function"&&typeof window["onDistrictChange"]==="undefined")window["onDistrictChange"]=onDistrictChange;if(typeof onBlockChange==="function"&&typeof window["onBlockChange"]==="undefined")window["onBlockChange"]=onBlockChange;if(typeof validateManualSaveButton==="function"&&typeof window["validateManualSaveButton"]==="undefined")window["validateManualSaveButton"]=validateManualSaveButton;if(typeof onLocationSearchInput==="function"&&typeof window["onLocationSearchInput"]==="undefined")window["onLocationSearchInput"]=onLocationSearchInput;if(typeof applyLocationChoice==="function"&&typeof window["applyLocationChoice"]==="undefined")window["applyLocationChoice"]=applyLocationChoice;if(typeof applyManualLocationSelection==="function"&&typeof window["applyManualLocationSelection"]==="undefined")window["applyManualLocationSelection"]=applyManualLocationSelection;if(typeof handleGpsAutoDetect==="function"&&typeof window["handleGpsAutoDetect"]==="undefined")window["handleGpsAutoDetect"]=handleGpsAutoDetect;if(typeof openLocationModal==="function"&&typeof window["openLocationModal"]==="undefined")window["openLocationModal"]=openLocationModal;if(typeof closeLocationModal==="function"&&typeof window["closeLocationModal"]==="undefined")window["closeLocationModal"]=closeLocationModal;if(typeof attachCityAutocomplete==="function"&&typeof window["attachCityAutocomplete"]==="undefined")window["attachCityAutocomplete"]=attachCityAutocomplete;if(typeof init==="function"&&typeof window["init"]==="undefined")window["init"]=init;
})();