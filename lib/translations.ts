export type Lang = "en" | "es" | "eu" | "fr" | "ca";

export type Dictionary = {
  nav: {
    story: string;
    experience: string;
    location: string;
    bookTable: string;
    telegramBooking: string;
    staff: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    statSeason: string;
    statHours: string;
    statRegion: string;
    ctaBook: string;
    ctaMenu: string;
  };
  house: {
    badge: string;
    title: string;
    description: string;
    caption: string;
    infoTitle: string;
    infoSubtitle: string;
    scheduleLabel: string;
    scheduleSub: string;
    seasonLabel: string;
    seasonVal: string;
    seasonSub: string;
    menuLabel: string;
    menuTraditional: string;
    menuKids: string;
    menuSub: string;
    policyLabel: string;
    policyText: string;
    terroirLabel: string;
    terroirTitle: string;
    terroirBadge: string;
  };
  experience: {
    badge: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Sub: string;
    card1Text: string;
    card2Title: string;
    card2Sub: string;
    card2Text: string;
    card3Title: string;
    card3Sub: string;
    card3Text: string;
  };
  booking: {
    badge: string;
    title: string;
    subtitle: string;
    telegramTitle: string;
    telegramSub: string;
    telegramAction: string;
    partyLabel: string;
    nameLabel: string;
    phoneLabel: string;
    dateLabel: string;
    timeLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitBtn: string;
    disclaimer: string;
    successTitle: string;
    successDesc: string;
  };
  visit: {
    badge: string;
    title: string;
    addressLabel: string;
    addressLine1: string;
    addressLine2: string;
    addressSub: string;
    channelsLabel: string;
    telLabel: string;
    telegramLabel: string;
    emailLabel: string;
  };
  footer: {
    description: string;
    navTitle: string;
    rights: string;
  };
  concierge: {
    buttonLabel: string;
    title: string;
    status: string;
    telegramBanner: string;
    welcomeMsg: string;
    welcomePrompt: string;
    inputPlaceholder: string;
  };
};

export const DICTIONARIES: Record<Lang, Dictionary> = {
  en: {
    nav: {
      story: "The House",
      experience: "Txotx & Menus",
      location: "Location",
      bookTable: "Reserve Table",
      telegramBooking: "Telegram Bot",
      staff: "Staff",
    },
    hero: {
      badge: "Aramaio, Álava · Basque Country",
      title: "From the orchard to the txotx.",
      subtitle: "Sagarretik txotxera",
      description:
        "An authentic family cider house founded in 1998. Natural organic cider, oak-barrel txotx ceremonies, wood charcoal grill dining, and traditional hospitality in the Aramaio valley.",
      statSeason: "Jan–May Txotx Season",
      statHours: "Thu–Sun 13:00–16:00 Lunch",
      statRegion: "Valley of Aramaio, Álava",
      ctaBook: "Request Table Reservation",
      ctaMenu: "Explore Menus & House",
    },
    house: {
      badge: "Origin & Heritage",
      title: "A stone cider house in the Aramaio Valley",
      description:
        "Founded in 1998, our historic farmhouse stables were transformed into a traditional sagardotegia. Our surrounding organic apple orchards are cultivated with care to produce 100% natural, unfiltered Basque cider.",
      caption: "The traditional wooden apple press outside the farmhouse",
      infoTitle: "Service & Visitor Information",
      infoSubtitle: "Essential details for your lunch reservation",
      scheduleLabel: "Operating Schedule",
      scheduleSub: "Thursday to Sunday · 13:00 to 16:00 (Lunch service)",
      seasonLabel: "Txotx Season",
      seasonVal: "January through May",
      seasonSub: "Direct barrel tasting. Bottled house cider served year-round.",
      menuLabel: "Menus & Rates",
      menuTraditional: "Traditional Sagardotegi Menu",
      menuKids: "Children's Menu",
      menuSub: "Txuleta steak, cod omelet, fried cod with peppers, Idiazabal cheese & cellar cider.",
      policyLabel: "Reservation Policy",
      policyText: "All tables are reviewed and confirmed by our family team. Large group celebrations may request a €10/guest deposit.",
      terroirLabel: "Orchard Terroir",
      terroirTitle: "Organic Apple Valley",
      terroirBadge: "Organic Álava",
    },
    experience: {
      badge: "Basque Dining Tradition",
      title: "Cider, embers, and the warmth of the table",
      subtitle: "Unrushed dining in the Basque cider-house rhythm paired with continuous cellar tastings.",
      card1Title: "Wood-Fired Dining",
      card1Sub: "Traditional Cider Table",
      card1Text: "Long shared wooden tables, charcoal-grilled Basque txuleta ribeye, salt cod omelet, and artisan Idiazabal cheese served amidst rustic stone architecture.",
      card2Title: "The Txotx Ritual",
      card2Sub: "Poured Straight From Barrel",
      card2Text: "Experience the ancestral Txotx shout from January to May. Stand by the giant kupelas as the cellar master opens the tap, pouring sparkling fresh cider straight into your glass.",
      card3Title: "Orchards & Heritage",
      card3Sub: "Group Visits & Countryside",
      card3Text: "Families, cuadrillas, and visitors explore our organic apple groves and valley views before gathering for an unforgettable meal in the heart of Álava.",
    },
    booking: {
      badge: "Online Table Request",
      title: "Reserve Your Table at Iturrieta",
      subtitle: "We open for lunch Thursday to Sunday (13:00 – 16:00). Submit your details below and our team will review availability and confirm your booking.",
      telegramTitle: "Instant Booking via Telegram",
      telegramSub: "Prefer booking via Telegram messenger? Use our automated bot.",
      telegramAction: "Open @IturrietaBookingBot →",
      partyLabel: "Party Size (Guests)",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number",
      dateLabel: "Date of Visit (Thu – Sun)",
      timeLabel: "Preferred Time (Lunch Shift)",
      notesLabel: "Notes & Special Requirements",
      notesPlaceholder: "Allergies, birthday celebration, high chair needed, etc.",
      submitBtn: "Send Reservation Request",
      disclaimer: "No immediate payment. Direct staff confirmation.",
      successTitle: "Request Received",
      successDesc: "Your table request has been submitted. Our team will check cellar space and confirm shortly.",
    },
    visit: {
      badge: "Location & Access",
      title: "In the heart of the Aramaio Valley",
      addressLabel: "Caserío Address",
      addressLine1: "Arraga auzoa, 2",
      addressLine2: "01169 Aramaio, Álava, Spain",
      addressSub: "30 minutes from Vitoria-Gasteiz · 45 minutes from Bilbao",
      channelsLabel: "Direct Channels",
      telLabel: "Telephone",
      telegramLabel: "Telegram Bot",
      emailLabel: "Email",
    },
    footer: {
      description: "A family cider house and organic apple orchards in Álava, Spain. Preserving ancestral Basque cider traditions since 1998.",
      navTitle: "Navigation & Staff",
      rights: "Sidrería Iturrieta. All rights reserved.",
    },
    concierge: {
      buttonLabel: "Concierge Assistant",
      title: "Iturrieta Concierge",
      status: "Online Assistant · Sagardotegia",
      telegramBanner: "Instant Telegram booking available:",
      welcomeMsg: "Welcome to Sidrería Iturrieta! How may I assist your visit?",
      welcomePrompt: "Ask about Txotx season dates, our traditional €45 menu, location in Aramaio, or table booking.",
      inputPlaceholder: "Ask a question about hours, menu, or booking...",
    },
  },
  es: {
    nav: {
      story: "La Casa",
      experience: "Txotx y Menús",
      location: "Ubicación",
      bookTable: "Reservar Mesa",
      telegramBooking: "Bot Telegram",
      staff: "Equipo",
    },
    hero: {
      badge: "Aramaio, Álava · País Vasco",
      title: "Del manzano al txotx.",
      subtitle: "Sagarretik txotxera",
      description:
        "Una sidrería familiar fundada en 1998. Sidra natural ecológica de nuestros propios manzanos, rito del txotx en kupela, parrilla de carbón y hospitalidad vasca en el valle de Aramaio.",
      statSeason: "Ene–May Temporada Txotx",
      statHours: "Jue–Dom 13:00–16:00 Comidas",
      statRegion: "Valle de Aramaio, Álava",
      ctaBook: "Solicitar Reserva de Mesa",
      ctaMenu: "Ver Menús y la Casa",
    },
    house: {
      badge: "Origen y Tradición",
      title: "Un caserío de piedra en el Valle de Aramaio",
      description:
        "Fundada en 1998, las antiguas cuadras de nuestro caserío se transformaron en una sagardotegi tradicional. Nuestros manzanos ecológicos se cuidan con esmero para elaborar sidra natural vasca.",
      caption: "La prensa tradicional de manzana frente al caserío",
      infoTitle: "Información de Servicio y Visitas",
      infoSubtitle: "Detalles esenciales para planificar tu comida",
      scheduleLabel: "Horario de Apertura",
      scheduleSub: "De jueves a domingo · 13:00 a 16:00 (Solo comidas)",
      seasonLabel: "Temporada de Txotx",
      seasonVal: "De enero a mayo",
      seasonSub: "Degustación directa de kupela. Sidra en botella el resto del año.",
      menuLabel: "Menús y Precios",
      menuTraditional: "Menú Tradicional de Sidrería",
      menuKids: "Menú Infantil",
      menuSub: "Chuleton a la brasa, tortilla de bacalao, bacalao frito, queso Idiazabal y sidra.",
      policyLabel: "Política de Reservas",
      policyText: "Todas las mesas son revisadas y confirmadas por nuestro equipo familiar. Grupos grandes pueden requerir fianza de 10€/persona.",
      terroirLabel: "Terruño y Manzanos",
      terroirTitle: "Valle de Manzanos Ecológicos",
      terroirBadge: "Ecológico Álava",
    },
    experience: {
      badge: "Tradición Gastronómica",
      title: "Sidra, brasas y el calor de la mesa",
      subtitle: "Comidas sin prisa al compás tradicional de sidrería con visitas constantes a las kupelas.",
      card1Title: "Comida a la Brasa",
      card1Sub: "La Mesa Tradicional",
      card1Text: "Mesas corridas de madera, chuleta de vaca a la brasa, tortilla de bacalao y queso Idiazabal en un comedor rústico de piedra.",
      card2Title: "El Rito del Txotx",
      card2Sub: "Directo de la Kupela",
      card2Text: "De enero a mayo, al grito de ¡Txotx!, degusta la sidra nueva directamente de las grandes barricas de roble.",
      card3Title: "Entorno y Manzanos",
      card3Sub: "Grupos y Cuadrillas",
      card3Text: "Familias y cuadrillas recorren nuestros manzanos ecológicos y el valle antes de disfrutar de una comida inolvidable.",
    },
    booking: {
      badge: "Solicitud de Mesa Online",
      title: "Reserva tu Mesa en Iturrieta",
      subtitle: "Abrimos para comidas de jueves a domingo (13:00 – 16:00). Envía tus datos y confirmaremos tu reserva en breve.",
      telegramTitle: "Reserva Inmediata vía Telegram",
      telegramSub: "¿Prefieres reservar por Telegram? Usa nuestro bot automático oficial.",
      telegramAction: "Abrir @IturrietaBookingBot →",
      partyLabel: "Número de Comensales",
      nameLabel: "Nombre y Apellidos",
      phoneLabel: "Teléfono de Contacto",
      dateLabel: "Fecha de Visita (Jue – Dom)",
      timeLabel: "Hora de Comida",
      notesLabel: "Notas o Necesidades Especiales",
      notesPlaceholder: "Alergias, celebración, trona para bebé, etc.",
      submitBtn: "Enviar Solicitud de Reserva",
      disclaimer: "Sin pago inmediato. Confirmación directa por el equipo.",
      successTitle: "Solicitud Recibida",
      successDesc: "Hemos recibido tu solicitud. Nuestro equipo revisará el aforo y te responderá enseguida.",
    },
    visit: {
      badge: "Ubicación y Acceso",
      title: "En el corazón del Valle de Aramaio",
      addressLabel: "Dirección del Caserío",
      addressLine1: "Arraga auzoa, 2",
      addressLine2: "01169 Aramaio, Álava, España",
      addressSub: "A 30 min de Vitoria-Gasteiz · A 45 min de Bilbao",
      channelsLabel: "Canales Directos",
      telLabel: "Teléfono",
      telegramLabel: "Bot de Telegram",
      emailLabel: "Correo Electrónico",
    },
    footer: {
      description: "Sidrería familiar y manzanos ecológicos en Álava. Conservando la tradición sidrera vasca desde 1998.",
      navTitle: "Navegación y Personal",
      rights: "Sidrería Iturrieta. Todos los derechos reservados.",
    },
    concierge: {
      buttonLabel: "Asistente Concierge",
      title: "Iturrieta Asistente",
      status: "En línea · Sidrería Iturrieta",
      telegramBanner: "Reserva también disponible en Telegram:",
      welcomeMsg: "¡Bienvenido a Sidrería Iturrieta! ¿En qué puedo ayudarte?",
      welcomePrompt: "Pregúntame sobre la temporada de txotx, el menú tradicional de 45€, cómo llegar o hacer una reserva.",
      inputPlaceholder: "Escribe tu consulta sobre horarios, menú o mesas...",
    },
  },
  eu: {
    nav: {
      story: "Etxea",
      experience: "Txotx eta Menuak",
      location: "Kokapena",
      bookTable: "Mahaia Eskatu",
      telegramBooking: "Telegram Bota",
      staff: "Lantaldea",
    },
    hero: {
      badge: "Aramaio, Araba · Euskal Herria",
      title: "Sagarretik txotxera.",
      subtitle: "Iturrieta Sagardotegia",
      description:
        "1998an sortutako familia-sagardotegia. Bertako sagarrekin egindako sagardo natural ekologikoa, txotx erritua, txingarretako janaria eta euskal harrera Aramaion.",
      statSeason: "Urt–Mai Txotx Garaia",
      statHours: "Osg–Iga 13:00–16:00 Bazkariak",
      statRegion: "Aramaioko Harana, Araba",
      ctaBook: "Mahaia Erreserbatu",
      ctaMenu: "Ezagutu Etxea eta Menua",
    },
    house: {
      badge: "Jatorria eta Tradizioa",
      title: "Harrizko baserria Aramaioko bailaran",
      description:
        "1998an baserriko ukuilu zaharrak sagardotegi tradizional bihurtu ziren. Gure sagasti ekologikoak mimoz zaintzen ditugu bertako sagardo naturala ekoizteko.",
      caption: "Baserri aurreko sagar prentsa tradizionala",
      infoTitle: "Zerbitzua eta Bisitak",
      infoSubtitle: "Bazkarirako jakin beharreko xehetasunak",
      scheduleLabel: "Ordutegia",
      scheduleSub: "Ostegunetik igandera · 13:00etatik 16:00etara (Bazkariak)",
      seasonLabel: "Txotx Garaia",
      seasonVal: "Urtarriletik maiatzera",
      seasonSub: "Kupeletik zuzenean dastatzeko aukera.",
      menuLabel: "Menuak eta Prezioak",
      menuTraditional: "Sagardotegiko Menu Tradizionala",
      menuKids: "Umeen Menua",
      menuSub: "Txuleta txingarretan, bakailao tortilla, bakailao frijitua, Idiazabal gazta eta sagardoa.",
      policyLabel: "Erreserba Politika",
      policyText: "Eskaera guztiak etxeko lantaldeak baieztatzen ditu banan-banan.",
      terroirLabel: "Lurra eta Sagastiak",
      terroirTitle: "Sagasti Ekologikoak",
      terroirBadge: "Araba Ekologikoa",
    },
    experience: {
      badge: "Euskal Tradizioa",
      title: "Sagardoa, txingarra eta mahaiko giroa",
      subtitle: "Bazkari lasaiak betiko sagardotegi giroan, kupeletara egindako bisitekin.",
      card1Title: "Txingarretako Bazkaria",
      card1Sub: "Mahai Tradizionala",
      card1Text: "Egurrezko mahai luzeak, idi txuleta parrillan, bakailao tortilla eta Idiazabal gazta.",
      card2Title: "Txotx Erritua",
      card2Sub: "Kupeletik Zuzenean",
      card2Text: "Urtarriletik maiatzera, Txotx! oihuarekin batera, dastatu sagardo berria kupeletik zuzenean.",
      card3Title: "Bailara eta Sagastiak",
      card3Sub: "Taldeak eta Koadrilak",
      card3Text: "Familia eta koadrilak gure sagastiak ezagutu eta bazkari gozoaz gozatzera etortzen dira.",
    },
    booking: {
      badge: "Mahaia Online Eskatu",
      title: "Eskatu zure mahaia Iturrietann",
      subtitle: "Ostegunetik igandera irekitzen dugu bazkarirako (13:00 – 16:00). Bidali zure datuak eta erantzungo dizugu.",
      telegramTitle: "Berehalako Erreserba Telegram bidez",
      telegramSub: "Telegram bidez erreserbatu nahi duzu? Erabili gure bot ofiziala.",
      telegramAction: "Ireki @IturrietaBookingBot →",
      partyLabel: "Pertsona Kopurua",
      nameLabel: "Izen-Abizenak",
      phoneLabel: "Telefonoa",
      dateLabel: "Eguna (Osg – Iga)",
      timeLabel: "Ordua",
      notesLabel: "Oharrak edo Behar Bereziak",
      notesPlaceholder: "Alergiak, ospakizunak, etab.",
      submitBtn: "Bidali Mahaiaren Eskaera",
      disclaimer: "Ordainketarik gabe. Etxeko lantaldeak baieztatua.",
      successTitle: "Eskaera Jaso Da",
      successDesc: "Zure eskaera jaso dugu. Laster emango dizugu erantzuna.",
    },
    visit: {
      badge: "Kokapena",
      title: "Aramaioko Bailararen Bihotzean",
      addressLabel: "Baserriaren Helbidea",
      addressLine1: "Arraga auzoa, 2",
      addressLine2: "01169 Aramaio, Araba",
      addressSub: "Gasteiztik 30 minutura · Bilbotik 45 minutura",
      channelsLabel: "Harreman Bideak",
      telLabel: "Telefonoa",
      telegramLabel: "Telegram Bota",
      emailLabel: "Posta Elektronikoa",
    },
    footer: {
      description: "Familia sagardotegia eta sagasti ekologikoak Aramaion. 1998tik euskal sagardo tradizioari eusten.",
      navTitle: "Nabigazioa eta Lantaldea",
      rights: "Iturrieta Sagardotegia. Eskubide guztiak erreserbatuta.",
    },
    concierge: {
      buttonLabel: "Laguntzaile Birtuala",
      title: "Iturrieta Laguntzailea",
      status: "Konektatuta · Sagardotegia",
      telegramBanner: "Erreserba Telegramez ere eskuragarri:",
      welcomeMsg: "Ongi etorri Iturrieta Sagardotegira! Zertan lagun zaitzaket?",
      welcomePrompt: "Galdetu txotx garaiari buruz, 45€ko menuaz edo mahaia eskatzeko moduez.",
      inputPlaceholder: "Idatzi zure galdera hemen...",
    },
  },
  fr: {
    nav: {
      story: "La Maison",
      experience: "Txotx & Menus",
      location: "Accès",
      bookTable: "Réserver",
      telegramBooking: "Bot Telegram",
      staff: "Personnel",
    },
    hero: {
      badge: "Aramaio, Álava · Pays Basque",
      title: "Du pommier au txotx.",
      subtitle: "Sagarretik txotxera",
      description:
        "Cidrerie familiale basque fondée en 1998. Cidre biologique naturel, rituel du txotx au tonneau, grillades au charbon de bois et convivialité dans la vallée d'Aramaio.",
      statSeason: "Jan–Mai Saison du Txotx",
      statHours: "Jeu–Dim 13h–16h Déjeuner",
      statRegion: "Vallée d'Aramaio, Álava",
      ctaBook: "Demander une Table",
      ctaMenu: "Découvrir la Maison et Menus",
    },
    house: {
      badge: "Origine & Terroir",
      title: "Un corps de ferme en pierre dans la vallée",
      description:
        "Fondée en 1998, notre cidrerie produit un cidre basque 100% naturel et biologique à partir de nos vergers entourant le caserío.",
      caption: "Le pressoir à pommes traditionnel en bois",
      infoTitle: "Informations Visiteurs",
      infoSubtitle: "Tout savoir pour votre déjeuner",
      scheduleLabel: "Horaires",
      scheduleSub: "Du jeudi au dimanche · 13h00 à 16h00 (Déjeuner)",
      seasonLabel: "Saison du Txotx",
      seasonVal: "De janvier à mai",
      seasonSub: "Dégustation directe au tonneau. Cidre en bouteille le reste de l'année.",
      menuLabel: "Menus & Tarifs",
      menuTraditional: "Menu Cidrerie Traditionnel",
      menuKids: "Menu Enfant",
      menuSub: "Côte de bœuf braisée, omelette à la morue, fromage Idiazabal et cidre.",
      policyLabel: "Conditions de Réservation",
      policyText: "Toutes les tables sont confirmées directement par l'équipe.",
      terroirLabel: "Terroir",
      terroirTitle: "Vergers Biologiques",
      terroirBadge: "Bio Álava",
    },
    experience: {
      badge: "Tradition Basque",
      title: "Cidre, braises et chaleur de la table",
      subtitle: "Un repas partagé au rythme traditionnel des cidreries basques.",
      card1Title: "Table au Feu de Bois",
      card1Sub: "Menu Convivial",
      card1Text: "Grandes tables en bois, côte de bœuf au grill et omelette à la morue dans un décor chaleureux.",
      card2Title: "Le Rituel du Txotx",
      card2Sub: "Directement au Tonneau",
      card2Text: "De janvier à mai, au cri de Txotx!, dégustez le cidre nouveau jaillissant directement des grands tonneaux.",
      card3Title: "Nature et Vergers",
      card3Sub: "Groupes et Familles",
      card3Text: "Promenez-vous dans nos vergers de montagne avant un déjeuner mémorable.",
    },
    booking: {
      badge: "Demande de Réservation",
      title: "Réservez votre Table à Iturrieta",
      subtitle: "Ouvert pour le déjeuner du jeudi au dimanche. Remplissez vos coordonnées ci-dessous.",
      telegramTitle: "Réservation Instantanée via Telegram",
      telegramSub: "Préférez-vous réserver par Telegram? Utilisez notre bot automatisé.",
      telegramAction: "Ouvrir @IturrietaBookingBot →",
      partyLabel: "Nombre de Convives",
      nameLabel: "Nom Complet",
      phoneLabel: "Téléphone",
      dateLabel: "Date de Visite",
      timeLabel: "Heure du Déjeuner",
      notesLabel: "Remarques Particulières",
      notesPlaceholder: "Allergies, anniversaire, chaise bébé...",
      submitBtn: "Envoyer la Demande",
      disclaimer: "Sans prépaiement. Confirmation par l'équipe.",
      successTitle: "Demande Transmise",
      successDesc: "Nous avons bien reçu votre demande et vous confirmerons votre table rapidement.",
    },
    visit: {
      badge: "Localisation",
      title: "Au cœur de la vallée d'Aramaio",
      addressLabel: "Adresse",
      addressLine1: "Arraga auzoa, 2",
      addressLine2: "01169 Aramaio, Álava, Espagne",
      addressSub: "À 30 min de Vitoria-Gasteiz · 45 min de Bilbao",
      channelsLabel: "Contacts Directs",
      telLabel: "Téléphone",
      telegramLabel: "Bot Telegram",
      emailLabel: "E-mail",
    },
    footer: {
      description: "Cidrerie basque familiale et vergers biologiques en Álava. Traditions ancestrales depuis 1998.",
      navTitle: "Navigation & Équipe",
      rights: "Sidrería Iturrieta. Tous droits réservés.",
    },
    concierge: {
      buttonLabel: "Assistant Concierge",
      title: "Iturrieta Concierge",
      status: "En ligne · Cidrerie Iturrieta",
      telegramBanner: "Réservation également possible sur Telegram:",
      welcomeMsg: "Bienvenue à la Sidrería Iturrieta! Comment puis-je vous renseigner?",
      welcomePrompt: "Posez vos questions sur la saison du txotx, nos menus ou les réservations.",
      inputPlaceholder: "Posez votre question ici...",
    },
  },
  ca: {
    nav: {
      story: "La Casa",
      experience: "Txotx i Menús",
      location: "Ubicació",
      bookTable: "Demanar Taula",
      telegramBooking: "Bot Telegram",
      staff: "Equip",
    },
    hero: {
      badge: "Aramaio, Àlaba · País Basc",
      title: "De la pomera al txotx.",
      subtitle: "Sagarretik txotxera",
      description:
        "Una sidreria familiar fundada el 1998. Sidra natural ecològica, ritu del txotx a la kupela, brasa i caliu al bonic vall d'Aramaio.",
      statSeason: "Gen–Mai Temporada Txotx",
      statHours: "Dij–Diu 13:00–16:00 Dinar",
      statRegion: "Vall d'Aramaio, Àlaba",
      ctaBook: "Sol·licitar Reserva de Taula",
      ctaMenu: "Veure Menús i la Casa",
    },
    house: {
      badge: "Origen i Tradició",
      title: "Un mas de pedra al cor d'Aramaio",
      description:
        "Fundada el 1998, el nostre mas elabora sidra tradicional 100% natural a partir de pomers ecològics de muntanya.",
      caption: "La premsa de fusta tradicional davant del mas",
      infoTitle: "Informació de Servei",
      infoSubtitle: "Detalls essencials per al teu dinar",
      scheduleLabel: "Horari d'Obertura",
      scheduleSub: "De dijous a diumenge · 13:00 a 16:00 (Només dinars)",
      seasonLabel: "Temporada de Txotx",
      seasonVal: "De gener a maig",
      seasonSub: "Degustació directa de bóta. Sidra embotellada la resta de l'any.",
      menuLabel: "Menús i Preus",
      menuTraditional: "Menú Tradicional de Sidreria",
      menuKids: "Menú Infantil",
      menuSub: "Mitjana a la brasa, truita de bacallà, formatge Idiazabal i sidra.",
      policyLabel: "Política de Reserves",
      policyText: "Totes les taules són confirmades directament per l'equip familiar.",
      terroirLabel: "Terreny i Pomers",
      terroirTitle: "Pomers Ecològics",
      terroirBadge: "Ecològic Àlaba",
    },
    experience: {
      badge: "Tradició Gastronòmica",
      title: "Sidra, brasa i caliu de taula",
      subtitle: "Dinars sense presses seguint el costum tradicional de les sidreries basques.",
      card1Title: "Dinar a la Brasa",
      card1Sub: "Taula Tradicional",
      card1Text: "Taules llargues de fusta, mitjana de vaca a la brasa i truita de bacallà en un ambient rústic.",
      card2Title: "El Ritu del Txotx",
      card2Sub: "Directe de la Kupela",
      card2Text: "De gener a maig, al crit de Txotx!, tasta la sidra nova brollant de les grans bótes.",
      card3Title: "Entorn i Pomers",
      card3Sub: "Grups i Famílies",
      card3Text: "Gaudiu dels nostres pomers de muntanya abans d'un àpat inoblidable.",
    },
    booking: {
      badge: "Sol·licitud de Taula Online",
      title: "Reserva la teva Taula a Iturrieta",
      subtitle: "Oberts per dinar de dijous a diumenge (13:00 – 16:00). Envieu les dades i us respondrem de seguida.",
      telegramTitle: "Reserva Immediata per Telegram",
      telegramSub: "Preferiu reservar per Telegram? Feu servir el nostre bot oficial.",
      telegramAction: "Obrir @IturrietaBookingBot →",
      partyLabel: "Comensals",
      nameLabel: "Nom Complet",
      phoneLabel: "Telèfon",
      dateLabel: "Data de Visita",
      timeLabel: "Hora de Dinar",
      notesLabel: "Notes Especials",
      notesPlaceholder: "Al·lèrgies, celebracions, cadireta...",
      submitBtn: "Enviar Sol·licitud",
      disclaimer: "Sense pagament previ. Confirmació directa.",
      successTitle: "Sol·licitud Rebuda",
      successDesc: "Hem rebut la sol·licitud i us confirmarem la disponibilitat al més aviat possible.",
    },
    visit: {
      badge: "Ubicació",
      title: "Al cor de la Vall d'Aramaio",
      addressLabel: "Adreça",
      addressLine1: "Arraga auzoa, 2",
      addressLine2: "01169 Aramaio, Àlaba",
      addressSub: "A 30 minuts de Vitoria-Gasteiz",
      channelsLabel: "Contacte",
      telLabel: "Telèfon",
      telegramLabel: "Bot Telegram",
      emailLabel: "Correu",
    },
    footer: {
      description: "Sidreria familiar i pomers ecològics a Àlaba. Tradició sidrera des de 1998.",
      navTitle: "Navegació i Equip",
      rights: "Sidrería Iturrieta. Tots els drets reservats.",
    },
    concierge: {
      buttonLabel: "Assistent Concierge",
      title: "Iturrieta Assistent",
      status: "En línia · Sidrería",
      telegramBanner: "Reserva també disponible a Telegram:",
      welcomeMsg: "Benvinguts a la Sidrería Iturrieta! En què us podem ajudar?",
      welcomePrompt: "Pregunteu sobre el txotx, el menú tradicional de 45€ o com reservar taula.",
      inputPlaceholder: "Feu la vostra consulta...",
    },
  },
};
