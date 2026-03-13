/**
 * Portfolio Chatbot - Arthur Couffon
 * Assistant IA intégrable via <script src="chatbot.js"></script>
 * Auto-contenu : CSS + HTML + logique injectés automatiquement
 *
 * Config API Claude (désactivé par défaut) :
 *   window.CHATBOT_CONFIG = { useAPI: true, apiKey: 'sk-ant-...', model: 'claude-sonnet-4-20250514' }
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────────
  const CONFIG = Object.assign({
    useAPI: false,
    apiKey: '',
    model: 'claude-sonnet-4-20250514',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    useOllama: true,
    ollamaUrl: 'http://127.0.0.1:11434/api/chat',
    ollamaModel: 'mistral:7b',
    maxTokens: 512,
    storageKey: 'ac_chatbot_history',
    logKey: 'ac_chatbot_logs',
    typingDelay: 600,
    systemPrompt: `Tu es l'assistant virtuel d'Arthur Couffon, un créatif polyvalent spécialisé en 3D, Motion Design et DevOps/Cybersécurité. Tu es intégré à son portfolio.

Contexte :
- Compétences : Blender, Cinema 4D, After Effects, PowerShell, Python, OSINT, RGPD
- Formation : ICAN (Institut de Création et Animation Numériques)
- Projets notables : Atalante (bateau Ifremer, Bright Studio), Eclairion (bâtiment illuminé), Végétation (21 plantes animées), SEF, Animation Train (ICAN), Pub Fanta
- Services : Modélisation 3D, Animation, Motion Design, Automatisation, Audit sécurité
- Tarifs : TJM 350-550€ / Hourly $40-75
- Disponibilité : Freelance, disponible pour missions

Réponds de façon concise, professionnelle et chaleureuse. Détecte la langue du visiteur (français ou anglais) et réponds dans la même langue. Si tu ne peux pas répondre, propose de laisser un email pour qu'Arthur recontacte le visiteur.`
  }, window.CHATBOT_CONFIG || {});

  // ── CSS injection ──────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ac-bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    @keyframes ac-slide-up {
      from { opacity: 0; transform: translateY(24px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes ac-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ac-dot-pulse {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1); }
    }
    @keyframes ac-glow {
      0%, 100% { box-shadow: 0 0 8px rgba(124,58,237,0.4); }
      50% { box-shadow: 0 0 20px rgba(124,58,237,0.7); }
    }

    #ac-chat-toggle {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer;
      background: linear-gradient(135deg, #7c3aed, #2563eb);
      color: #fff; font-size: 24px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 24px rgba(124,58,237,0.45);
      transition: transform 0.3s, box-shadow 0.3s;
      animation: ac-glow 3s ease-in-out infinite;
    }
    #ac-chat-toggle:hover { transform: scale(1.1); box-shadow: 0 6px 32px rgba(124,58,237,0.6); }
    #ac-chat-toggle.ac-open { animation: none; }
    #ac-chat-toggle .ac-icon-chat,
    #ac-chat-toggle .ac-icon-close { position: absolute; transition: opacity 0.25s, transform 0.25s; }
    #ac-chat-toggle.ac-open .ac-icon-chat { opacity: 0; transform: rotate(90deg) scale(0.5); }
    #ac-chat-toggle.ac-open .ac-icon-close { opacity: 1; transform: rotate(0) scale(1); }
    #ac-chat-toggle:not(.ac-open) .ac-icon-close { opacity: 0; transform: rotate(-90deg) scale(0.5); }
    #ac-chat-toggle:not(.ac-open) .ac-icon-chat { opacity: 1; transform: rotate(0) scale(1); }

    #ac-chat-panel {
      position: fixed; bottom: 100px; right: 24px; z-index: 99998;
      width: 380px; max-height: 560px; border-radius: 16px;
      display: flex; flex-direction: column; overflow: hidden;
      background: rgba(15, 15, 25, 0.88);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(124,58,237,0.25);
      box-shadow: 0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset;
      transform-origin: bottom right;
      transition: opacity 0.3s, transform 0.3s;
    }
    #ac-chat-panel.ac-hidden { opacity: 0; transform: translateY(24px) scale(0.96); pointer-events: none; }
    #ac-chat-panel.ac-visible { animation: ac-slide-up 0.35s ease-out forwards; }

    #ac-chat-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.07);
      background: rgba(124,58,237,0.08);
    }
    .ac-avatar {
      width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #7c3aed, #2563eb);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px; color: #fff; font-family: system-ui, sans-serif;
    }
    .ac-header-text { flex: 1; }
    .ac-header-text h4 { margin: 0; font-size: 15px; font-weight: 600; color: #f0f0f5; font-family: system-ui, sans-serif; }
    .ac-header-text span { font-size: 12px; color: rgba(255,255,255,0.45); font-family: system-ui, sans-serif; }
    #ac-chat-header button {
      background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer;
      font-size: 18px; padding: 4px; border-radius: 6px; transition: color 0.2s, background 0.2s;
    }
    #ac-chat-header button:hover { color: #fff; background: rgba(255,255,255,0.08); }

    #ac-chat-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px;
      min-height: 260px; max-height: 360px;
      scrollbar-width: thin; scrollbar-color: rgba(124,58,237,0.3) transparent;
    }
    #ac-chat-messages::-webkit-scrollbar { width: 5px; }
    #ac-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #ac-chat-messages::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 4px; }

    .ac-msg { display: flex; gap: 8px; animation: ac-fade-in 0.3s ease-out; max-width: 100%; }
    .ac-msg.ac-user { flex-direction: row-reverse; }
    .ac-msg .ac-avatar-sm {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #7c3aed, #2563eb);
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; color: #fff; font-family: system-ui, sans-serif;
    }
    .ac-msg.ac-user .ac-avatar-sm { background: linear-gradient(135deg, #6366f1, #818cf8); }
    .ac-bubble {
      padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.5;
      font-family: system-ui, -apple-system, sans-serif; max-width: 75%; word-wrap: break-word;
    }
    .ac-msg.ac-bot .ac-bubble {
      background: rgba(255,255,255,0.06); color: #e2e2ea;
      border: 1px solid rgba(255,255,255,0.06); border-bottom-left-radius: 4px;
    }
    .ac-msg.ac-user .ac-bubble {
      background: linear-gradient(135deg, rgba(124,58,237,0.35), rgba(37,99,235,0.3));
      color: #f0f0f5; border: 1px solid rgba(124,58,237,0.2); border-bottom-right-radius: 4px;
    }

    .ac-typing { display: flex; gap: 5px; padding: 12px 16px; }
    .ac-typing span {
      width: 7px; height: 7px; border-radius: 50%; background: rgba(124,58,237,0.7);
      animation: ac-dot-pulse 1.4s infinite;
    }
    .ac-typing span:nth-child(2) { animation-delay: 0.2s; }
    .ac-typing span:nth-child(3) { animation-delay: 0.4s; }

    #ac-suggestions {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px;
    }
    #ac-suggestions button {
      background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.2);
      color: #c4b5fd; border-radius: 20px; padding: 6px 14px; font-size: 12px;
      cursor: pointer; transition: all 0.2s; font-family: system-ui, sans-serif; white-space: nowrap;
    }
    #ac-suggestions button:hover {
      background: rgba(124,58,237,0.25); border-color: rgba(124,58,237,0.4); color: #e9e0ff;
    }

    #ac-chat-input-area {
      display: flex; gap: 8px; padding: 12px 16px;
      border-top: 1px solid rgba(255,255,255,0.07); background: rgba(0,0,0,0.15);
    }
    #ac-chat-input {
      flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 10px 14px; color: #e2e2ea; font-size: 14px;
      font-family: system-ui, sans-serif; outline: none; resize: none;
      transition: border-color 0.2s;
    }
    #ac-chat-input::placeholder { color: rgba(255,255,255,0.3); }
    #ac-chat-input:focus { border-color: rgba(124,58,237,0.5); }
    #ac-chat-send {
      width: 40px; height: 40px; border-radius: 10px; border: none; cursor: pointer;
      background: linear-gradient(135deg, #7c3aed, #2563eb);
      color: #fff; font-size: 16px; display: flex; align-items: center; justify-content: center;
      transition: opacity 0.2s, transform 0.2s; flex-shrink: 0;
    }
    #ac-chat-send:hover { opacity: 0.9; transform: scale(1.05); }
    #ac-chat-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    @media (max-width: 480px) {
      #ac-chat-panel {
        width: calc(100vw - 16px); right: 8px; bottom: 90px;
        max-height: calc(100vh - 120px); border-radius: 14px;
      }
      #ac-chat-toggle { bottom: 16px; right: 16px; width: 54px; height: 54px; }
    }
  `;
  document.head.appendChild(style);

  // ── HTML injection ─────────────────────────────────────────────
  const container = document.createElement('div');
  container.id = 'ac-chatbot';
  container.innerHTML = `
    <div id="ac-chat-panel" class="ac-hidden">
      <div id="ac-chat-header">
        <div class="ac-avatar">AC</div>
        <div class="ac-header-text">
          <h4>Arthur's Assistant</h4>
          <span>En ligne · Portfolio</span>
        </div>
        <button id="ac-export-btn" title="Exporter les logs">⤓</button>
      </div>
      <div id="ac-chat-messages"></div>
      <div id="ac-suggestions"></div>
      <div id="ac-chat-input-area">
        <input id="ac-chat-input" type="text" placeholder="Écrivez votre message..." autocomplete="off" />
        <button id="ac-chat-send" disabled>➤</button>
      </div>
    </div>
    <button id="ac-chat-toggle">
      <span class="ac-icon-chat">💬</span>
      <span class="ac-icon-close">✕</span>
    </button>
  `;
  document.body.appendChild(container);

  // ── Éléments DOM ───────────────────────────────────────────────
  const panel = document.getElementById('ac-chat-panel');
  const toggle = document.getElementById('ac-chat-toggle');
  const messages = document.getElementById('ac-chat-messages');
  const suggestions = document.getElementById('ac-suggestions');
  const input = document.getElementById('ac-chat-input');
  const sendBtn = document.getElementById('ac-chat-send');
  const exportBtn = document.getElementById('ac-export-btn');

  let isOpen = false;
  let isTyping = false;

  // ── Base de connaissances ──────────────────────────────────────
  const KB = [
    {
      keys: ['compétence', 'competence', 'skill', 'savoir', 'expertise', 'technologie', 'tech', 'outil', 'tool', 'logiciel', 'software', 'stack'],
      fr: "Arthur maîtrise un éventail de compétences :\n\n🎨 **3D & Motion Design** : Blender, Cinema 4D, After Effects\n🔧 **DevOps & Automatisation** : PowerShell, Python, scripting avancé\n🔒 **Cybersécurité** : OSINT, conformité RGPD, audit de sécurité\n\nUn profil rare qui allie créativité visuelle et expertise technique.",
      en: "Arthur has a wide range of skills:\n\n🎨 **3D & Motion Design**: Blender, Cinema 4D, After Effects\n🔧 **DevOps & Automation**: PowerShell, Python, advanced scripting\n🔒 **Cybersecurity**: OSINT, GDPR compliance, security auditing\n\nA rare profile combining visual creativity with technical expertise."
    },
    {
      keys: ['projet', 'project', 'portfolio', 'réalisation', 'realisation', 'travail', 'work', 'réf', 'reference', 'exemple', 'example', 'show'],
      fr: "Voici les projets phares d'Arthur :\n\n🚢 **Atalante** — Modélisation du navire océanographique de l'Ifremer pour Bright Studio\n🏛️ **Eclairion** — Bâtiment illuminé, rendu architectural\n🌿 **Végétation** — Collection de 21 plantes animées réalistes\n⚡ **SEF** — Projet pour Bright Studio\n🚂 **Animation Train** — Projet de fin d'études ICAN\n🥤 **Pub Fanta** — Publicité 3D motion design\n\nConsultez la section projets du portfolio pour les visuels !",
      en: "Here are Arthur's key projects:\n\n🚢 **Atalante** — 3D model of Ifremer's research vessel for Bright Studio\n🏛️ **Eclairion** — Illuminated building, architectural rendering\n🌿 **Vegetation** — Collection of 21 realistic animated plants\n⚡ **SEF** — Project for Bright Studio\n🚂 **Train Animation** — ICAN graduation project\n🥤 **Fanta Ad** — 3D motion design commercial\n\nCheck the projects section for visuals!"
    },
    {
      keys: ['tarif', 'prix', 'price', 'rate', 'coût', 'cout', 'cost', 'budget', 'devis', 'quote', 'tjm', 'hourly', 'jour', 'day'],
      fr: "Les tarifs d'Arthur :\n\n📋 **TJM (Taux Journalier Moyen)** : 350 – 550 €\n⏱️ **Taux horaire** : 40 – 75 $\n\nLe tarif varie selon la complexité du projet, les délais et le volume. N'hésitez pas à décrire votre projet pour un devis personnalisé !",
      en: "Arthur's rates:\n\n📋 **Daily rate**: €350 – €550\n⏱️ **Hourly rate**: $40 – $75\n\nRates vary based on project complexity, timeline, and volume. Feel free to describe your project for a custom quote!"
    },
    {
      keys: ['service', 'offre', 'offer', 'prestation', 'mission', 'what do you do', 'que faites', 'proposer', 'propose'],
      fr: "Arthur propose les services suivants :\n\n🎨 **Modélisation 3D** — Objets, personnages, environnements (Blender, Cinema 4D)\n🎬 **Animation & Motion Design** — Publicités, présentations, contenus animés\n⚙️ **Automatisation** — Scripts PowerShell/Python, pipelines, DevOps\n🔒 **Audit Sécurité** — OSINT, conformité RGPD, analyse de vulnérabilités\n\nChaque mission est adaptée à vos besoins spécifiques.",
      en: "Arthur offers the following services:\n\n🎨 **3D Modeling** — Objects, characters, environments (Blender, Cinema 4D)\n🎬 **Animation & Motion Design** — Ads, presentations, animated content\n⚙️ **Automation** — PowerShell/Python scripts, pipelines, DevOps\n🔒 **Security Audit** — OSINT, GDPR compliance, vulnerability analysis\n\nEach project is tailored to your specific needs."
    },
    {
      keys: ['formation', 'étude', 'etude', 'education', 'école', 'ecole', 'school', 'diplôme', 'diplome', 'degree', 'ican', 'parcours', 'background'],
      fr: "Arthur est diplômé de l'**ICAN** (Institut de Création et Animation Numériques), une école spécialisée dans les métiers du numérique créatif à Paris. Sa formation couvre la 3D, le motion design et les technologies numériques.",
      en: "Arthur graduated from **ICAN** (Institut de Création et Animation Numériques), a school specializing in creative digital arts in Paris. His training covers 3D, motion design, and digital technologies."
    },
    {
      keys: ['contact', 'email', 'mail', 'joindre', 'reach', 'écrire', 'ecrire', 'write', 'message', 'appeler', 'call', 'rencontrer', 'meet'],
      fr: "Pour contacter Arthur, vous pouvez :\n\n📧 Laisser votre email ici et il vous recontactera rapidement\n💼 Utiliser le formulaire de contact du portfolio\n\nDécrivez brièvement votre projet et vos délais, Arthur reviendra vers vous sous 24h !",
      en: "To reach Arthur, you can:\n\n📧 Leave your email here and he'll get back to you promptly\n💼 Use the portfolio's contact form\n\nBriefly describe your project and timeline, and Arthur will respond within 24 hours!"
    },
    {
      keys: ['disponible', 'available', 'dispo', 'libre', 'free', 'quand', 'when', 'délai', 'delai', 'timeline', 'deadline'],
      fr: "Arthur est actuellement **disponible** en freelance pour de nouvelles missions ! Il peut démarrer rapidement selon la nature du projet. Décrivez votre besoin et il vous donnera un calendrier précis.",
      en: "Arthur is currently **available** as a freelancer for new projects! He can start quickly depending on the project scope. Describe your needs and he'll provide a precise timeline."
    },
    {
      keys: ['blender', '3d', 'modélisation', 'modelisation', 'modeling', 'render', 'rendu', 'texture', 'mesh'],
      fr: "Arthur est spécialisé en **modélisation 3D** avec Blender et Cinema 4D. Il réalise des modèles photoréalistes, des rendus architecturaux, des objets produits et des environnements complets. Ses projets Atalante et Végétation illustrent bien cette expertise.",
      en: "Arthur specializes in **3D modeling** with Blender and Cinema 4D. He creates photorealistic models, architectural renders, product visualizations, and complete environments. His Atalante and Vegetation projects showcase this expertise."
    },
    {
      keys: ['motion', 'animation', 'after effects', 'vidéo', 'video', 'pub', 'publicité', 'publicite', 'ad', 'commercial', 'fanta'],
      fr: "En **motion design**, Arthur utilise After Effects et les outils 3D pour créer des animations percutantes : publicités (comme sa Pub Fanta), présentations dynamiques, contenus pour les réseaux sociaux et animations de produits.",
      en: "In **motion design**, Arthur uses After Effects and 3D tools to create impactful animations: commercials (like his Fanta Ad), dynamic presentations, social media content, and product animations."
    },
    {
      keys: ['sécurité', 'securite', 'security', 'cyber', 'osint', 'rgpd', 'gdpr', 'audit', 'hack', 'protection', 'données', 'donnees', 'data', 'privacy'],
      fr: "Arthur possède une expertise en **cybersécurité** :\n\n🔍 **OSINT** — Recherche et analyse d'informations en sources ouvertes\n📋 **RGPD** — Mise en conformité, exercice des droits, audit data brokers\n🛡️ **Audit sécurité** — Analyse de vulnérabilités, hardening système\n\nUne compétence complémentaire précieuse pour tout projet numérique.",
      en: "Arthur has expertise in **cybersecurity**:\n\n🔍 **OSINT** — Open-source intelligence research and analysis\n📋 **GDPR** — Compliance, rights enforcement, data broker auditing\n🛡️ **Security Audit** — Vulnerability analysis, system hardening\n\nA valuable complementary skill for any digital project."
    },
    {
      keys: ['python', 'powershell', 'script', 'automatisation', 'automation', 'devops', 'code', 'développement', 'developpement', 'dev', 'programming'],
      fr: "Côté **DevOps & Automatisation**, Arthur développe des solutions en PowerShell et Python : pipelines d'automatisation, monitoring système, scripts de déploiement, APIs et outils sur mesure. Il combine cette expertise technique avec ses compétences créatives.",
      en: "On the **DevOps & Automation** side, Arthur builds solutions in PowerShell and Python: automation pipelines, system monitoring, deployment scripts, APIs, and custom tools. He combines this technical expertise with his creative skills."
    },
    {
      keys: ['bonjour', 'hello', 'hi', 'hey', 'salut', 'coucou', 'bonsoir', 'yo', 'good morning', 'good evening'],
      fr: "Bonjour ! 👋 Je suis l'assistant virtuel d'Arthur Couffon. Comment puis-je vous aider ? Vous pouvez me poser des questions sur ses compétences, projets, tarifs ou disponibilités.",
      en: "Hello! 👋 I'm Arthur Couffon's virtual assistant. How can I help you? Feel free to ask about his skills, projects, rates, or availability."
    },
    {
      keys: ['merci', 'thank', 'thanks', 'cool', 'super', 'parfait', 'perfect', 'great', 'génial', 'genial', 'awesome'],
      fr: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Arthur sera ravi d'échanger sur votre projet. 😊",
      en: "You're welcome! Feel free to ask if you have more questions. Arthur would love to discuss your project. 😊"
    },
    {
      keys: ['qui', 'who', 'arthur', 'présentation', 'presentation', 'about', 'profil', 'profile', 'toi', 'you'],
      fr: "Arthur Couffon est un **créatif polyvalent** basé en France, diplômé de l'ICAN. Il combine une expertise en 3D/Motion Design (Blender, Cinema 4D, After Effects) avec des compétences techniques en DevOps (PowerShell, Python) et cybersécurité (OSINT, RGPD). Il travaille en freelance et a collaboré avec des studios comme Bright Studio.",
      en: "Arthur Couffon is a **versatile creative** based in France, graduated from ICAN. He combines expertise in 3D/Motion Design (Blender, Cinema 4D, After Effects) with technical skills in DevOps (PowerShell, Python) and cybersecurity (OSINT, GDPR). He works as a freelancer and has collaborated with studios like Bright Studio."
    },
    {
      keys: ['atalante', 'ifremer', 'bateau', 'navire', 'ship', 'boat', 'bright'],
      fr: "Le projet **Atalante** est une modélisation 3D détaillée du navire océanographique de l'Ifremer, réalisée pour **Bright Studio**. Ce projet démontre la capacité d'Arthur à produire des modèles techniques complexes avec un haut niveau de fidélité.",
      en: "The **Atalante** project is a detailed 3D model of Ifremer's oceanographic research vessel, created for **Bright Studio**. This project demonstrates Arthur's ability to produce complex technical models with high fidelity."
    },
    {
      keys: ['végétation', 'vegetation', 'plante', 'plant', 'nature', 'arbre', 'tree', 'feuille', 'leaf'],
      fr: "Le projet **Végétation** est une collection de **21 plantes animées** réalistes, créées en 3D. Chaque plante est modélisée avec soin et dotée d'animations naturelles (vent, croissance). Un projet qui montre la maîtrise d'Arthur en modélisation organique.",
      en: "The **Vegetation** project is a collection of **21 realistic animated plants** created in 3D. Each plant is carefully modeled with natural animations (wind, growth). A project showcasing Arthur's mastery of organic modeling."
    }
  ];

  const DEFAULT_SUGGESTIONS = [
    { text: "Quels sont vos tarifs ?", lang: 'fr' },
    { text: "Montrez-moi vos projets 3D", lang: 'fr' },
    { text: "Êtes-vous disponible ?", lang: 'fr' },
    { text: "What services do you offer?", lang: 'en' }
  ];

  // ── Détection de langue ────────────────────────────────────────
  const EN_MARKERS = [
    'hello', 'hi', 'hey', 'how', 'what', 'when', 'where', 'why', 'who', 'which',
    'do you', 'can you', 'are you', 'is there', 'could', 'would', 'should',
    'please', 'thanks', 'thank', 'your', 'you', 'the', 'this', 'that',
    'available', 'offer', 'price', 'rate', 'project', 'skill', 'service',
    'work', 'about', 'show', 'tell', 'contact', 'reach', 'meet', 'need', 'want',
    'good', 'great', 'looking', 'interested', 'portfolio'
  ];

  function detectLang(text) {
    const lower = text.toLowerCase();
    let enScore = 0;
    for (const w of EN_MARKERS) {
      if (lower.includes(w)) enScore++;
    }
    return enScore >= 2 ? 'en' : 'fr';
  }

  // ── Moteur de réponses local ───────────────────────────────────
  function findLocalResponse(query) {
    const lower = query.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const lang = detectLang(query);

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of KB) {
      let score = 0;
      for (const key of entry.keys) {
        const normKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (lower.includes(normKey)) {
          score += normKey.length > 4 ? 3 : 1;
        }
      }
      // Bonus exact word match
      const words = lower.split(/\s+/);
      for (const key of entry.keys) {
        const normKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (words.includes(normKey)) score += 2;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && bestScore >= 1) {
      return bestMatch[lang] || bestMatch.fr;
    }

    // Fallback
    if (lang === 'en') {
      return "I'm Arthur's virtual assistant. I couldn't find a precise answer to your question. For a specific inquiry, feel free to leave your email or use the contact form, and Arthur will get back to you within 24 hours!";
    }
    return "Je suis l'assistant d'Arthur. Je n'ai pas trouvé de réponse précise à votre question. Pour une demande spécifique, n'hésitez pas à laisser votre email ou utiliser le formulaire de contact, Arthur vous recontactera sous 24h !";
  }

  // ── Appel API Claude (optionnel) ───────────────────────────────
  async function callClaudeAPI(userMessage, history) {
    if (!CONFIG.useAPI || !CONFIG.apiKey) return null;

    const apiMessages = history.slice(-10).map(m => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text
    }));
    apiMessages.push({ role: 'user', content: userMessage });

    try {
      const res = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CONFIG.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: CONFIG.model,
          max_tokens: CONFIG.maxTokens,
          system: CONFIG.systemPrompt,
          messages: apiMessages
        })
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data.content?.[0]?.text || null;
    } catch {
      return null;
    }
  }

  // ── Appel Ollama (local LLM) ──────────────────────────────────
  async function callOllamaAPI(userMessage, history) {
    if (!CONFIG.useOllama) return null;

    const messages = [
      { role: 'system', content: CONFIG.systemPrompt }
    ];
    history.slice(-8).forEach(m => {
      messages.push({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text
      });
    });
    messages.push({ role: 'user', content: userMessage });

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(CONFIG.ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: CONFIG.ollamaModel,
          messages: messages,
          stream: false,
          options: { num_predict: 400, temperature: 0.7 }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      if (!res.ok) return null;
      const data = await res.json();
      return data.message?.content || null;
    } catch {
      return null;
    }
  }

  // ── Gestion de l'historique ────────────────────────────────────
  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
    } catch { return []; }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(history));
    } catch { /* quota exceeded */ }
  }

  function logQuestion(question, response) {
    try {
      const logs = JSON.parse(localStorage.getItem(CONFIG.logKey)) || [];
      logs.push({
        timestamp: new Date().toISOString(),
        question,
        response: response.substring(0, 200),
        lang: detectLang(question),
        userAgent: navigator.userAgent
      });
      localStorage.setItem(CONFIG.logKey, JSON.stringify(logs));
    } catch { /* quota exceeded */ }
  }

  function exportLogs() {
    try {
      const logs = JSON.parse(localStorage.getItem(CONFIG.logKey)) || [];
      const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatbot-logs-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* noop */ }
  }

  // ── Rendu des messages ─────────────────────────────────────────
  function renderMessage(text, role) {
    const div = document.createElement('div');
    div.className = `ac-msg ac-${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'ac-avatar-sm';
    avatar.textContent = role === 'bot' ? 'AC' : '→';

    const bubble = document.createElement('div');
    bubble.className = 'ac-bubble';
    // Simple markdown-like bold
    bubble.innerHTML = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    div.appendChild(avatar);
    div.appendChild(bubble);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'ac-msg ac-bot';
    div.id = 'ac-typing';

    const avatar = document.createElement('div');
    avatar.className = 'ac-avatar-sm';
    avatar.textContent = 'AC';

    const typing = document.createElement('div');
    typing.className = 'ac-bubble ac-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';

    div.appendChild(avatar);
    div.appendChild(typing);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('ac-typing');
    if (el) el.remove();
  }

  function renderSuggestions(items) {
    suggestions.innerHTML = '';
    items.forEach(s => {
      const btn = document.createElement('button');
      btn.textContent = s.text;
      btn.addEventListener('click', () => handleSend(s.text));
      suggestions.appendChild(btn);
    });
  }

  // ── Logique d'envoi ────────────────────────────────────────────
  const history = loadHistory();

  async function handleSend(text) {
    const trimmed = (text || '').trim();
    if (!trimmed || isTyping) return;

    // Email detection - store for Arthur
    const emailMatch = trimmed.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
    if (emailMatch) {
      logQuestion(`[EMAIL CAPTURED] ${emailMatch[0]}`, trimmed);
    }

    // Render user message
    renderMessage(trimmed, 'user');
    history.push({ role: 'user', text: trimmed, time: Date.now() });
    input.value = '';
    sendBtn.disabled = true;
    suggestions.innerHTML = '';

    // Typing indicator
    isTyping = true;
    showTyping();

    // Get response: Ollama (local) → Claude API → local KB
    let response;
    if (CONFIG.useOllama) {
      response = await callOllamaAPI(trimmed, history);
    }
    if (!response && CONFIG.useAPI && CONFIG.apiKey) {
      response = await callClaudeAPI(trimmed, history);
    }
    if (!response) {
      await new Promise(r => setTimeout(r, CONFIG.typingDelay + Math.random() * 800));
      response = findLocalResponse(trimmed);
    }

    hideTyping();
    isTyping = false;

    renderMessage(response, 'bot');
    history.push({ role: 'bot', text: response, time: Date.now() });
    saveHistory(history);
    logQuestion(trimmed, response);

    // Show suggestions again after response
    renderSuggestions(DEFAULT_SUGGESTIONS);
  }

  // ── Événements ─────────────────────────────────────────────────
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    toggle.classList.toggle('ac-open', isOpen);
    panel.classList.toggle('ac-hidden', !isOpen);
    panel.classList.toggle('ac-visible', isOpen);
    if (isOpen) {
      input.focus();
      if (messages.children.length === 0) {
        // Welcome message
        renderMessage(
          "Bonjour ! 👋 Je suis l'assistant d'Arthur Couffon.\nComment puis-je vous aider ?",
          'bot'
        );
        renderSuggestions(DEFAULT_SUGGESTIONS);
      }
    }
  });

  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input.value);
    }
  });

  sendBtn.addEventListener('click', () => handleSend(input.value));

  exportBtn.addEventListener('click', exportLogs);

  // Restore history on load
  if (history.length > 0) {
    const recent = history.slice(-20);
    recent.forEach(m => renderMessage(m.text, m.role));
  }

  // ── API publique ───────────────────────────────────────────────
  window.ACChatbot = {
    open() { if (!isOpen) toggle.click(); },
    close() { if (isOpen) toggle.click(); },
    exportLogs,
    getLogs() {
      try { return JSON.parse(localStorage.getItem(CONFIG.logKey)) || []; }
      catch { return []; }
    },
    clearHistory() {
      localStorage.removeItem(CONFIG.storageKey);
      localStorage.removeItem(CONFIG.logKey);
      messages.innerHTML = '';
      history.length = 0;
    },
    send(text) { handleSend(text); }
  };

})();
