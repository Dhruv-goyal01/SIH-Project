/**
 * NeuroBloom Dashboard Internationalization (i18n)
 * Supports: Assamese (অসমীয়া), English, Manipuri (মৈতৈলোন্), Mizo
 */

const TRANSLATIONS = {
  assamese: {
    // Header
    "greeting.morning": "সুপ্ৰভাত,",
    "greeting.afternoon": "শুভ অপৰাহ্ন,",
    "greeting.evening": "শুভ সন্ধ্যা,",

    // Side Panel - Profile & Badges
    "panel.streak_val": "১৪ দিন",
    "panel.streak_lbl": "ধাৰাবাহিকতা",
    "panel.location_val": "গুৱাহাটী",
    "panel.location_lbl": "স্থান",
    "panel.doctor_val": "ডাঃ বৰুৱা",
    "panel.doctor_lbl": "চিকিৎসক",

    // Side Panel - Nav Items
    "panel.menu_title": "মেনু আৰু ছেটিংছ",
    "panel.my_profile": "মোৰ প্ৰফাইল",
    "panel.faq": "সঘনাই সোধা প্ৰশ্ন (FAQ)",
    "panel.quick_faqs": "দ্ৰুত প্ৰশ্নোত্তৰ",

    // Side Panel - FAQs
    "faq.q1": "স্মৃতি ব্যায়ামবোৰে কেনেকৈ কাম কৰে?",
    "faq.a1": "দৈনিক খেল যেনে ফ্ৰেজ ৰিকল আৰু মেম'ৰি কাৰ্ডবোৰে স্নায়ুৰ সক্ৰিয়তা আৰু স্মৃতিশক্তি বৃদ্ধি কৰে। আপোনাৰ যত্ন লওঁতাই আপোনাৰ সকলো অগ্ৰগতি চাব পাৰে।",
    "faq.q2": "মই ভাষা সলনি কৰিব পাৰিমনে?",
    "faq.a2": "হয়! আপুনি যিকোনো সময়তে ডেচব'ৰ্ড বা ছেটিংছৰ পৰা অসমীয়া, ইংৰাজী, মৈতৈলোন্ আৰু মিজো ভাষা বাছনি কৰিব পাৰে।",
    "faq.q3": "মোৰ যত্ন লওঁতাই কেনেকৈ জাননী পায়?",
    "faq.a3": "সম্পূৰ্ণ কৰা খেলৰ ফলাফল আৰু তথ্য স্বয়ংক্ৰিয়ভাৱে কেয়াৰটেকাৰ প'ৰ্টেললৈ যায় যাতে পৰিয়ালৰ লোক সংযুক্ত থাকিব পাৰে।",

    // Side Panel - Settings & Theme
    "panel.settings": "ছেটিংছ",
    "panel.theme": "থিম",
    "theme.light": "দিনৰ পোহৰ",
    "theme.dark": "ৰাতিৰ আন্ধাৰ",
    "panel.language": "ভাষা",
    "panel.logout": "লগ আউট",

    // Daily Quest Card
    "quest.tag": "দৈনিক কুৱেষ্ট",
    "quest.streak_tag": "🔥 ১৪ দিনৰ ধাৰাবাহিকতা",
    "quest.title": "দৈনিক কুৱেষ্ট",
    "quest.meta": "",
    "quest.start": "কুৱেষ্ট আৰম্ভ কৰক",

    // Quest Modal Header & Nav
    "quest.modal_title": "আজিৰ দৈনিক কুৱেষ্ট",
    "quest.step_prefix": "প্ৰশ্ন",
    "quest.step_of": "ৰ",
    "quest.prev": "← পূৰ্বৱৰ্তী",
    "quest.next": "পৰৱৰ্তী কুৱেষ্ট →",
    "quest.finish": "কুৱেষ্ট শেষ কৰক ✨",
    "quest.feedback_default": "আপোনাৰ স্মৃতি পৰীক্ষা কৰিবলৈ ওপৰৰ এটা উত্তৰ বাছনি কৰক!",
    "quest.feedback_success": "অপূৰ্ব স্মৃতিশক্তি! এইটো একেবাৰে সঠিক উত্তৰ।",
    "quest.feedback_wrong": "সম্পূৰ্ণ শুদ্ধ নহয়! সহায়ক সংকেতটো পুনৰ মন দি চাওক।",
    "quest.feedback_done": "🎉 কুৱেষ্ট সমাপ্ত হ'ল! আজি আপুনি সফলতাৰে স্মৃতিশক্তি সতেজ কৰিলে।",

    // Quest Slide 1
    "q1.media_badge": "পৰিয়ালৰ এলবাম",
    "q1.category": "ব্যক্তিগত স্মৃতি · পৰিয়াল চিনাক্তকৰণ",
    "q1.title": "আপোনাৰ পৰিয়ালৰ এলবামত থকা এইগৰাকী কোন?",
    "q1.hint": "সংকেত: তেওঁ যোৱা দেওবাৰে আপোনাক লগ কৰিবলৈ আহিছিল আৰু অসমীয়া চাহ আৰু পিঠা আনিছিল।",
    "q1.optA": "আপোনাৰ জীয়াৰী, প্ৰিয়া",
    "q1.optB": "অৰুন্ধতী (আপুনি স্বয়ং!)",
    "q1.optC": "আপোনাৰ ভগ্নী, মীনাক্ষী",

    // Quest Slide 2
    "q2.category": "ব্যক্তিগত স্মৃতি · নিজ চহৰ",
    "q2.title": "আপোনাৰ বৰ্তমান বাস কৰা চহৰখন কোনখন?",
    "q2.hint": "সংকেত: ব্ৰহ্মপুত্ৰ নদীৰ কাষত অৱস্থিত কামাখ্যা মন্দিৰৰ চহৰ।",
    "q2.optA": "গুৱাহাটী, অসম",
    "q2.optB": "কলকাতা, পশ্চিমবংগ",
    "q2.optC": "শ্বিলং, মেঘালয়",

    // Quest Slide 3
    "q3.category": "স্বাস্থ্য যতন · প্ৰধান চিকিৎসক",
    "q3.title": "আপোনাৰ মুখ্য স্নায়ুৰোগ বিশেষজ্ঞ আৰু চিকিৎসক কোন?",
    "q3.hint": "সংকেত: তেওঁ প্ৰতি বৃহস্পতিবাৰে আপোনাৰ বৌদ্ধিক ব্যায়াম নিৰীক্ষণ কৰে।",
    "q3.optA": "ডাঃ বৰুৱা",
    "q3.optB": "ডাঃ শৰ্মা",
    "q3.optC": "ডাঃ সেন",

    // Games Section
    "games.section_title": "আপোনাৰ প্ৰিয় স্মৃতি খেলসমূহ",
    "games.phrase_builder_tag": "ভাষা",
    "games.phrase_builder_title": "বাক্য গঠন (Phrase Builder)",
    "games.phrase_builder_meta": "সহজ · স্তৰ ১",
    "games.memory_flash_tag": "মনোযোগ",
    "games.memory_flash_title": "মেম'ৰি ফ্লেছ (Memory Flash)",
    "games.memory_flash_meta": "দ্ৰুত · স্তৰ ১",
    "games.memory_card_tag": "যুক্তি",
    "games.memory_card_title": "স্মৃতি কাৰ্ড (Memory Card)",
    "games.memory_card_meta": "সহজ · স্তৰ ১",

    // Exercise Card
    "exercise.title": "দৈনিক ব্যায়ামৰ অগ্ৰগতি",
    "exercise.count": "৫ ৰ ভিতৰত ২",
    "exercise.message": "আপুনি বহুত ভাল কৰিছে! আজিৰ বাবে কেৱল আৰু ৩টা কাৰ্যকলাপ বাকী আছে।",
    "exercise.btn_start": "পৰৱৰ্তী আৰম্ভ কৰক: ৰাতিপুৱাৰ ধ্যান",
    "exercise.reminder": "সোঁৱৰণী নিৰ্ধাৰণ কৰা হৈছে: <strong>পুৱা ১১:৩০ বজাত</strong> (ঔষধৰ সময়)",

    // Notes Section
    "notes.title": "পৰিয়াল আৰু ডাক্তৰৰ বাৰ্তা",
    "notes.doctor_role": " (এইমছ গুৱাহাটী)",
    "notes.doctor_time": "পুৱা ১০:০০ বজাত",
    "notes.doctor_msg": "আজি মেম'ৰি মেচ খেলত অতি সুন্দৰ মনোযোগ দিছে, অৰুন্ধতী। এইদৰে প্ৰতিদিনে ৰাতিপুৱা খেল অব্যাহত ৰাখক!",
    "notes.family_role": " (জীয়াৰী)",
    "notes.family_time": "কালি",
    "notes.family_msg": "আমি আপোনাক বহুত ভাল পাওঁ, মা! এনেদৰে সুন্দৰ স্মৃতিৰ খেলবোৰ খেলি থাকক। ৰিয়ানে শ্বিলঙৰ পৰা নমস্কাৰ জনাইছে!",

    // Assistance Bar
    "assist.label": "বয়োজ্যেষ্ঠ সহায়ক নিয়ন্ত্ৰণ",
    "assist.tts_on": "পৰ্দাৰ পাঠ পঢ়ি শুনোৱা (অন)",
    "assist.tts_off": "পৰ্দাৰ পাঠ পঢ়ি শুনোৱা (অফ)",

    // Bottom Navigation
    "bnav.home": "গৃহ",
    "bnav.games": "খেলসমূহ",
    "bnav.camera": "কেমেৰা",
    "bnav.progress": "অগ্ৰগতি",
    "bnav.reminders": "সোঁৱৰণী",

    // Notification Toast
    "toast.camera": "কেমেৰা সক্ৰিয় হ'ল: মেম'ৰি স্কেনাৰ প্ৰস্তুত"
  },

  english: {
    // Header
    "greeting.morning": "Good Morning,",
    "greeting.afternoon": "Good Afternoon,",
    "greeting.evening": "Good Evening,",

    // Side Panel - Profile & Badges
    "panel.streak_val": "Day 14",
    "panel.streak_lbl": "Streak",
    "panel.location_val": "Guwahati",
    "panel.location_lbl": "Location",
    "panel.doctor_val": "Dr. Baruah",
    "panel.doctor_lbl": "Physician",

    // Side Panel - Nav Items
    "panel.menu_title": "Menu & Settings",
    "panel.my_profile": "My Profile",
    "panel.faq": "Frequently Asked Questions (FAQ)",
    "panel.quick_faqs": "Quick FAQs",

    // Side Panel - FAQs
    "faq.q1": "How do the memory exercises work?",
    "faq.a1": "Daily games like Phrase Recall and Memory Cards stimulate neuroplasticity and cognitive retention. Your caretaker can view all your completion trends.",
    "faq.q2": "Can I switch languages?",
    "faq.a2": "Yes! You can toggle between Assamese, English, Manipuri, and Mizo from the dashboard settings anytime.",
    "faq.q3": "How does my caretaker get alerts?",
    "faq.a3": "Care logs and completed game metrics sync to the Caretaker Portal automatically so your family stays connected.",

    // Side Panel - Settings & Theme
    "panel.settings": "Settings",
    "panel.theme": "Theme",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "panel.language": "Language",
    "panel.logout": "Log Out",

    // Daily Quest Card
    "quest.tag": "Daily Quest",
    "quest.streak_tag": "🔥 14-Day Streak",
    "quest.title": "Daily Quest",
    "quest.meta": "",
    "quest.start": "Start Quest",

    // Quest Modal Header & Nav
    "quest.modal_title": "Today's Daily Quest",
    "quest.step_prefix": "Question",
    "quest.step_of": "of",
    "quest.prev": "← Previous",
    "quest.next": "Next Quest →",
    "quest.finish": "Finish Quest ✨",
    "quest.feedback_default": "Select an answer above to check your memory!",
    "quest.feedback_success": "Wonderful memory! That is completely correct.",
    "quest.feedback_wrong": "Not quite! Take another gentle look at the hint.",
    "quest.feedback_done": "🎉 Quest complete! You successfully exercised your memory today.",

    // Quest Slide 1
    "q1.media_badge": "Family Album",
    "q1.category": "Personal Memory · Family Recognition",
    "q1.title": "Who is this in your family album?",
    "q1.hint": "Hint: She visited you last Sunday and brought Assamese tea and pitha.",
    "q1.optA": "Your Daughter, Priya",
    "q1.optB": "Arundhati (You!)",
    "q1.optC": "Your Sister, Meenakshi",

    // Quest Slide 2
    "q2.category": "Personal Memory · Hometown",
    "q2.title": "Which city is your current active residence?",
    "q2.hint": "Hint: Near the mighty Brahmaputra river with Kamakhya temple.",
    "q2.optA": "Guwahati, Assam",
    "q2.optB": "Kolkata, West Bengal",
    "q2.optC": "Shillong, Meghalaya",

    // Quest Slide 3
    "q3.category": "Care Routine · Primary Doctor",
    "q3.title": "Who is your primary neurologist and doctor?",
    "q3.hint": "Hint: They supervise your cognitive exercises every Thursday.",
    "q3.optA": "Dr. Baruah",
    "q3.optB": "Dr. Sharma",
    "q3.optC": "Dr. Sen",

    // Games Section
    "games.section_title": "Your Favorite Memory Games",
    "games.phrase_builder_tag": "Language",
    "games.phrase_builder_title": "Phrase Builder",
    "games.phrase_builder_meta": "Gentle · Level 1",
    "games.memory_flash_tag": "Focus",
    "games.memory_flash_title": "Memory Flash",
    "games.memory_flash_meta": "Quick · Level 1",
    "games.memory_card_tag": "Logic",
    "games.memory_card_title": "Memory Card",
    "games.memory_card_meta": "Easy · Level 1",

    // Exercise Card
    "exercise.title": "Daily Exercise Progress",
    "exercise.count": "2 of 5",
    "exercise.message": "You are doing great! Just 3 more activities left for today.",
    "exercise.btn_start": "Start Next: Morning Meditation",
    "exercise.reminder": "Reminder set for <strong>11:30 AM</strong> (Medicine time)",

    // Notes Section
    "notes.title": "Caretaker's Notes",
    "notes.doctor_role": " (AIMS Guwahati)",
    "notes.doctor_time": "10:00 AM",
    "notes.doctor_msg": "Wonderful focus on the Memory Match game today, Arundhati. Keep up this regular morning play!",
    "notes.family_role": " (Daughter)",
    "notes.family_time": "Yesterday",
    "notes.family_msg": "We love you, Ma! Keep playing these nice memory games. Riyan says hello from Shillong!",

    // Assistance Bar
    "assist.label": "Elderly Assistance Controls",
    "assist.tts_on": "Read Screen Out Loud (ON)",
    "assist.tts_off": "Read Screen Out Loud (OFF)",

    // Bottom Navigation
    "bnav.home": "Home",
    "bnav.games": "Games",
    "bnav.camera": "Camera",
    "bnav.progress": "Progress",
    "bnav.reminders": "Reminders",

    // Notification Toast
    "toast.camera": "Camera activated: Memory scanner ready"
  },

  manipuri: {
    // Header
    "greeting.morning": "য়াইফরে অয়ুক,",
    "greeting.afternoon": "য়াইফরে নুমিৎথাং,",
    "greeting.evening": "য়াইফরে নুমিদাং,",

    // Side Panel - Profile & Badges
    "panel.streak_val": "নুমিৎ ১৪",
    "panel.streak_lbl": "লেপ্পা লৈতনা",
    "panel.location_val": "গুৱাহাটী",
    "panel.location_lbl": "মফম",
    "panel.doctor_val": "ডাঃ বরুৱা",
    "panel.doctor_lbl": "অনাকপবা দাঃ",

    // Side Panel - Nav Items
    "panel.menu_title": "মেনু অমসুং সেটিং",
    "panel.my_profile": "ঐগী প্রোফাইল",
    "panel.faq": "হন্না-হন্না হংবা ৱাহংসিং (FAQ)",
    "panel.quick_faqs": "য়াংনা খংনবা ৱাহংসিং",

    // Side Panel - FAQs
    "faq.q1": "নিংশিংবগী এক্সরসাইজ অসিনা করম্না থবক তৌই?",
    "faq.a1": "নোংমগী সানবা ফ্রেশ রিকল অমসুং মেমোরি কার্ডনা ৱাখলবু ফনা থম্মী। নহাক্কী য়োকখৎপিবনা মপুংফাবা প্রোগ্রেস উবা ফংই।",
    "faq.q2": "ঐহাক্না লোন হোংদোকপা য়াব্রা?",
    "faq.a2": "হোই! নহাক্না সেটিং অমসুং ড্যাশবোর্ডতগী অসামিজ, ইংলিস, মৈতৈলোন্ অমসুং মিজো লোন খনব য়াই।",
    "faq.q3": "ঐগী য়োকখৎপিবদা করম্না ৱাফম য়ৌগনি?",
    "faq.a3": "সানবা লোইরবগী রিপোর্তশিং কেয়ারটেকার পোর্টালদা মশানা চৎতুনা ইমুং-মনুংগা শম্নহনগনি।",

    // Side Panel - Settings & Theme
    "panel.settings": "সেটিংস",
    "panel.theme": "থিম",
    "theme.light": "নুমিৎ মঙাল",
    "theme.dark": "নুমিদাং অমম্বা",
    "panel.language": "লোন",
    "panel.logout": "লোক আউৎ",

    // Daily Quest Card
    "quest.tag": "নোংমগী ক্বেস্ট",
    "quest.streak_tag": "🔥 নুমিৎ ১৪ লেপ্পা লৈতনা",
    "quest.title": "নোংমগী ক্বেস্ট",
    "quest.meta": "",
    "quest.start": "ক্বেস্ট হৌউ",

    // Quest Modal Header & Nav
    "quest.modal_title": "ঙসিগী নোংমগী ক্বেস্ট",
    "quest.step_prefix": "ৱাহং",
    "quest.step_of": "গী মনুংদা",
    "quest.prev": "← মমাংগী",
    "quest.next": "মথংগী ক্বেস্ট →",
    "quest.finish": "ক্বেস্ট লোইশিনবা ✨",
    "quest.feedback_default": "নিংশিংবা চাংয়েং তৌনবা মথক্কী পাউখুম অমা খল্লু!",
    "quest.feedback_success": "য়াম্না ফবা নিংশিংবা! পাউখুম অসি অচুম্বনি।",
    "quest.feedback_wrong": "চুমেদে! মঙালগী পাউতাক অমুক হন্না য়েংবীয়ু।",
    "quest.feedback_done": "🎉 ক্বেস্ট লোইরে! ঙসি নহাক্কী নিংশিংবা থৌনা হাপ্লে।",

    // Quest Slide 1
    "q1.media_badge": "ইমুংগী এলবাম",
    "q1.category": "মশাগী নিংশিংবা · ইমুং খঙদোকপা",
    "q1.title": "ইমুংগী এলবাম অসিদা লৈরিবা অসি কনানো?",
    "q1.hint": "পাউতাক: মহাক নোংমাইজিংদা নহাক্কী মফমদা চাহী অমসুং পিথা পুরকখি।",
    "q1.optA": "নহাক্কী মচা নুপি, প্রিয়া",
    "q1.optB": "অরুন্ধতী (নহাক মশামক!)",
    "q1.optC": "নহাক্কী ইচল, মীনাক্ষী",

    // Quest Slide 2
    "q2.category": "মশাগী নিংশিংবা · লৈরিবা সহর",
    "q2.title": "হৌজিক নহাক লৈরিবা সহর অসিবু করি কৌই?",
    "q2.hint": "পাউতাক: ব্রহ্মপুত্র তুরেল অমসুং কামাখ্যা লাইশঙ মনাক্তা লৈ।",
    "q2.optA": "গুৱাহাটী, আসাম",
    "q2.optB": "কলকাতা, ৱেস্ট বেঙ্গল",
    "q2.optC": "সিলং, মেঘালয়",

    // Quest Slide 3
    "q3.category": "অনাবা য়েংশিনবা · মরুওইবা দাঃ",
    "q3.title": "নহাক্কী মরুওইবা নিউরোলজিস্ত দাঃ অদু কনানো?",
    "q3.hint": "পাউতাক: মহাক্না শগোলসেন খুদিংগী নহাক্কী এক্সরসাইজ য়েংশিনবী।",
    "q3.optA": "ডাঃ বরুৱা",
    "q3.optB": "ডাঃ শর্মা",
    "q3.optC": "ডাঃ সেন",

    // Games Section
    "games.section_title": "নহাক্না পাম্বা নিংশিংবগী খেলশিং",
    "games.phrase_builder_tag": "লোন",
    "games.phrase_builder_title": "ৱাহৈ শেম্বা (Phrase Builder)",
    "games.phrase_builder_meta": "লাইবা · থাক ১",
    "games.memory_flash_tag": "ৱাখল",
    "games.memory_flash_title": "মেমোরি ফ্লেশ (Memory Flash)",
    "games.memory_flash_meta": "য়াংবা · থাক ১",
    "games.memory_card_tag": "লজিক",
    "games.memory_card_title": "মেমোরি কার্ড (Memory Card)",
    "games.memory_card_meta": "লাইবা · থাক ১",

    // Exercise Card
    "exercise.title": "নোংমগী এক্সরসাইজ প্রোগ্রেস",
    "exercise.count": "৫ গী মনুংদা ২",
    "exercise.message": "নহাক য়াম্না ফরে! ঙসিগীদমক অহুমখক ৱাৎলে।",
    "exercise.btn_start": "মথংগী হৌউ: অয়ুক্কী ধ্যান",
    "exercise.reminder": "নিংশিংহল্লে: <strong>অয়ুক ১১:৩০ দা</strong> (হিদাক চাবা মতম)",

    // Notes Section
    "notes.title": "ইমুং অমসুং দাঃ গী পাউ",
    "notes.doctor_role": " (এম্স গুৱাহাটী)",
    "notes.doctor_time": "অয়ুক ১০:০০",
    "notes.doctor_msg": "ঙসি মেমোরি মেচ খেলদা অরুন্ধতীনা য়াম্না নীংথিনা থৌনা হাপ্পে। অয়ুক খুদিংগী সানবীয়ু!",
    "notes.family_role": " (মচা নুপি)",
    "notes.family_time": "ঙরাং",
    "notes.family_msg": "ইমা, ঐখোয়না ইমাবু য়াম্না নুংশি! খেলশিং অসি মতম চুপ্পদা সানবীয়ু। রিয়ান্না সিলংদগী খুরুমজরি!",

    // Assistance Bar
    "assist.label": "অহলশিংগী মতেং পাংবা কন্ট্রোল",
    "assist.tts_on": "স্ক্রীন পাবা (অন)",
    "assist.tts_off": "স্ক্রীন পাবা (অফ)",

    // Bottom Navigation
    "bnav.home": "য়ুম",
    "bnav.games": "খেলশিং",
    "bnav.camera": "কেমেরা",
    "bnav.progress": "প্রোগ্রেস",
    "bnav.reminders": "নিংশিংবা",

    // Notification Toast
    "toast.camera": "কেমেরা থোরক্লে: মেমোরি স্কেনার শেম-শারে"
  },

  mizo: {
    // Header
    "greeting.morning": "Chibai Zing,",
    "greeting.afternoon": "Chibai Chhun,",
    "greeting.evening": "Chibai Tlai,",

    // Side Panel - Profile & Badges
    "panel.streak_val": "Ni 14",
    "panel.streak_lbl": "Zawnin",
    "panel.location_val": "Guwahati",
    "panel.location_lbl": "Hmun",
    "panel.doctor_val": "Dr. Baruah",
    "panel.doctor_lbl": "Daktawr",

    // Side Panel - Nav Items
    "panel.menu_title": "Menu leh Settings",
    "panel.my_profile": "Ka Profile",
    "panel.faq": "Zawhna Tlanglawn (FAQ)",
    "panel.quick_faqs": "Zawhna Rang",

    // Side Panel - FAQs
    "faq.q1": "Hriatna tihchakna hian engtin nge hna a thawh?",
    "faq.a1": "Phrase Recall leh Memory Card infiamna te hian thluak hriatna a tichak a. Enkawltu in i hmasawnna zawng zawng a hmu thei ang.",
    "faq.q2": "Tawng ka thlak thei em?",
    "faq.a2": "Thei e! Settings atangin Assamese, English, Manipuri leh Mizo tawng i thlang thei reng a ni.",
    "faq.q3": "Enkawltu in engtin nge hriattirna a dawn?",
    "faq.a3": "Infiamna zawh tawh te chu Caretaker Portal-ah a kal nghal zel a, chhungte nen an inbiakpawh reng thei a ni.",

    // Side Panel - Settings & Theme
    "panel.settings": "Settings",
    "panel.theme": "Rawng (Theme)",
    "theme.light": "Eng (Light)",
    "theme.dark": "Thim (Dark)",
    "panel.language": "Tawng (Language)",
    "panel.logout": "Chhuahna (Logout)",

    // Daily Quest Card
    "quest.tag": "Ni Tin Hna (Daily Quest)",
    "quest.streak_tag": "🔥 Ni 14 Zawnin",
    "quest.title": "Ni Tin Hna",
    "quest.meta": "",
    "quest.start": "Tan Rawh",

    // Quest Modal Header & Nav
    "quest.modal_title": "Vawiin Ni Tin Hna",
    "quest.step_prefix": "Zawhna",
    "quest.step_of": "a",
    "quest.prev": "← Hmasa",
    "quest.next": "A dawt leh →",
    "quest.finish": "Zo Rawh ✨",
    "quest.feedback_default": "I hriatna fiah turin a chunga chhanna pakhat hi thlang rawh!",
    "quest.feedback_success": "Hriatna tha tak a ni! A dik chiah e.",
    "quest.feedback_wrong": "A la dik chiah lo! A hriattirna thuruk hi en tha leh rawh.",
    "quest.feedback_done": "🎉 I zo ta! Vawiin chu i thluak hriatna i tichak tha hle mai.",

    // Quest Slide 1
    "q1.media_badge": "Chhungkaw Thlalak",
    "q1.category": "Mahni Hriatna · Chhungte",
    "q1.title": "I chhungkaw thlalak a mi hi tunge a nih?",
    "q1.hint": "Hriattirna: Pathianni liamta khan a rawn tlawh che a, thingpui leh chhang a rawn ken che.",
    "q1.optA": "I Fanute, Priya",
    "q1.optB": "Arundhati (Nangmah ngei!)",
    "q1.optC": "I Laizawn, Meenakshi",

    // Quest Slide 2
    "q2.category": "Mahni Hriatna · Khua",
    "q2.title": "Tunah hian khawi khua-ah nge i khawsak?",
    "q2.hint": "Hriattirna: Brahmaputra lui kiang leh Kamakhya biak in awmna hmun.",
    "q2.optA": "Guwahati, Assam",
    "q2.optB": "Kolkata, West Bengal",
    "q2.optC": "Shillong, Meghalaya",

    // Quest Slide 3
    "q3.category": "Enkawlna · Daktawr",
    "q3.title": "I thluak lam enkawltu daktawr ber tunge?",
    "q3.hint": "Hriattirna: Ningani tin i thluak chet vel a vil thin che.",
    "q3.optA": "Dr. Baruah",
    "q3.optB": "Dr. Sharma",
    "q3.optC": "Dr. Sen",

    // Games Section
    "games.section_title": "I Ngainat Ber Hriatna Infiamna Te",
    "games.phrase_builder_tag": "Tawng",
    "games.phrase_builder_title": "Tawngkam Siam (Phrase Builder)",
    "games.phrase_builder_meta": "Awlsam · Level 1",
    "games.memory_flash_tag": "Ngaihtuahna",
    "games.memory_flash_title": "Hriatna Rang (Memory Flash)",
    "games.memory_flash_meta": "Rang · Level 1",
    "games.memory_card_tag": "Hriatna",
    "games.memory_card_title": "Hriatna Card (Memory Card)",
    "games.memory_card_meta": "Awlsam · Level 1",

    // Exercise Card
    "exercise.title": "Ni Tin Thluak Sawizawina",
    "exercise.count": "5 zinga 2",
    "exercise.message": "I ti tha hle mai! Vawiin atan thil 3 chiah a bang tawh e.",
    "exercise.btn_start": "A dawt leh tan rawh: Zinglam Ngaihtuahna",
    "exercise.reminder": "Hriattirna siam: <strong>11:30 AM</strong> (Damdawi ei hun)",

    // Notes Section
    "notes.title": "Chhungte & Daktawr Lehkha",
    "notes.doctor_role": " (AIMS Guwahati)",
    "notes.doctor_time": "10:00 AM",
    "notes.doctor_msg": "Vawiin Memory Match infiamna ah khan i ti tha hle mai Arundhati. Zing tin ti ziah rawh aw!",
    "notes.family_role": " (Fanu)",
    "notes.family_time": "Nimin",
    "notes.family_msg": "Ka nu, kan hmangaih che! Hriatna infiamna te hi khel ziah rawh aw. Riyan-an Shillong atangin chibai a rawn buk a che!",

    // Assistance Bar
    "assist.label": "Kum Upate Tana Puihna",
    "assist.tts_on": "Screen chhiar riktirna (ON)",
    "assist.tts_off": "Screen chhiar riktirna (OFF)",

    // Bottom Navigation
    "bnav.home": "In",
    "bnav.games": "Infiamna",
    "bnav.camera": "Camera",
    "bnav.progress": "Hmasawnna",
    "bnav.reminders": "Hriattirna",

    // Notification Toast
    "toast.camera": "Camera a nung ta: Hriatna chhiartu a inpeih e"
  }
};

/**
 * Apply translations to all matching elements on the page
 * @param {string} lang - 'assamese' | 'english' | 'manipuri' | 'mizo'
 */
function applyDashboardLanguage(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.assamese;

  // Set html attribute
  document.documentElement.setAttribute('data-lang', lang);

  // 1. Text elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // 2. HTML elements with data-i18n-html (where bold or markup is present)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  // 3. Update dynamic greeting based on hour
  const headerGreeting = document.getElementById('header-greeting');
  if (headerGreeting) {
    const currentHour = new Date().getHours();
    let gKey = "greeting.morning";
    if (currentHour >= 12 && currentHour < 17) {
      gKey = "greeting.afternoon";
    } else if (currentHour >= 17) {
      gKey = "greeting.evening";
    }
    headerGreeting.textContent = dict[gKey] || dict["greeting.morning"];
  }

  // 4. Update quest navigation buttons if present
  const questStepLabel = document.getElementById('quest-step-label');
  if (questStepLabel && typeof currentQuestIndex !== 'undefined') {
    questStepLabel.textContent = `${dict["quest.step_prefix"]} ${currentQuestIndex + 1} ${dict["quest.step_of"]} 3`;
  }

  const questNextBtn = document.getElementById('quest-next-btn');
  if (questNextBtn && typeof currentQuestIndex !== 'undefined') {
    questNextBtn.textContent = (currentQuestIndex === 2) ? dict["quest.finish"] : dict["quest.next"];
  }

  const questPrevBtn = document.getElementById('quest-prev-btn');
  if (questPrevBtn) {
    questPrevBtn.textContent = dict["quest.prev"];
  }

  // 5. Update quest feedback if currently idle/unanswered
  const questFeedback = document.getElementById('quest-feedback');
  if (questFeedback && (!questFeedback.classList.contains('success') && !questFeedback.classList.contains('error'))) {
    questFeedback.textContent = dict["quest.feedback_default"];
  }

  // 6. Update TTS button text
  const ttsBtn = document.getElementById('btn-tts');
  if (ttsBtn && typeof ttsOn !== 'undefined') {
    ttsBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
      ${ttsOn ? dict["assist.tts_on"] : dict["assist.tts_off"]}
    `;
  }

  // 7. Sync active states of all language buttons
  document.querySelectorAll('.lang-option-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const btnLang = btn.id.replace('assist-lang-', '');
    btn.classList.toggle('active', btnLang === lang);
  });

  // Save preference
  localStorage.setItem('nb-lang', lang);
}

// Expose globally
window.applyDashboardLanguage = applyDashboardLanguage;
window.TRANSLATIONS = TRANSLATIONS;
