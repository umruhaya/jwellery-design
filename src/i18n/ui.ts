const languages = {
	en: 'English',
	de: 'Deutsch', // German
	it: 'Italiano', // Italian
	es: 'Español', // Spanish
	fr: 'Français', // French
} as const

type LanguageKeys = keyof typeof languages

// Define all translation keys in a union type
type TranslationKey =
	| 'nav.home'
	| 'nav.about'
	| 'nav.twitter'
	| 'nav.gallery'
	| 'nav.shop'
	| 'hero.title'
	| 'hero.subtitle'
	| 'hero.callToAction'
	| 'hero.scrollToGallery'
	| 'lead.title'
	| 'lead.description'
	| 'lead.emailPlaceholder'
	| 'lead.gdprLabel'
	| 'lead.button'
	| 'lead.success'
	| 'lead.error'
	| 'gallery.title'
	| 'gallery.imgAlt'
	| 'gallery.itemTitle'
	| 'gallery.itemMaterial'
	| 'gallery.more'
	| 'gallery.modelAlt'
	| 'collection.title'
	| 'collection.rings'
	| 'collection.necklaces'
	| 'collection.gifts'
	| 'collection.bracelets'
	| 'collection.pendants'
	| 'collection.earrings'
	| 'beadsDance.title'
	| 'beadsDance.description'
	| 'beadsDance.cta'
	| 'gifts.title'
	| 'gifts.imgAlt'
	| 'gifts.description'
	| 'gifts.cta'
	| 'footer.impressum'
	| 'footer.privacy'
	| 'assistant.sendButton'
	| 'assistant.description'
	| 'assistant.input.placeholder'
	| 'aboutus.aboutus'
	| 'aboutus.title'
	| 'aboutus.subtitle'
	| 'steps.title'
	| 'steps.1.title'
	| 'steps.1.description'
	| 'steps.2.title'
	| 'steps.2.description'
	| 'steps.3.title'
	| 'steps.3.description'
	| 'steps.4.title'
	| 'steps.4.description'
	| 'menu.languageSwitcher'

// Utility type: ensures each language has all translation keys
type Translations = {
	[L in LanguageKeys]: {
		[K in TranslationKey]: string
	}
}

const ui: Translations = {
	en: {
		'nav.home': 'Home',
		'nav.about': 'About',
		'nav.twitter': 'Twitter',
		'nav.gallery': 'Gallery',
		'nav.shop': 'Shop',
		'hero.title': 'Bespoke jewelry, crafted for your story',
		'hero.subtitle':
			'Experience the CYO Live Atelier: luxury, artistry, and personal guidance - digitally and personally.',
		'hero.callToAction': 'Design Your Jewelry',
		'hero.scrollToGallery': 'Scroll to Gallery',
		'lead.title': 'Get in Touch',
		'lead.description':
			'After you submit your email, our team will reach out to you to learn about your preferences for jewelry design. We respect your privacy and comply with GDPR.',
		'lead.emailPlaceholder': 'Your email address',
		'lead.gdprLabel': 'I agree to receive emails',
		'lead.button': 'Sign Up',
		'lead.success': 'Thank you for signing up!',
		'lead.error': 'There was an error. Please try again.',
		'gallery.title': 'Gallery / Inspirations',
		'gallery.imgAlt': 'Perlée signature bracelet',
		'gallery.itemTitle': 'Perlée signature bracelet, medium model',
		'gallery.itemMaterial': 'Yellow Gold',
		'gallery.more': 'More creations',
		'gallery.modelAlt': 'Model with Perlée',
		'collection.title': 'Shop By Collection',
		"collection.rings": "Rings",
      "collection.necklaces": "Necklaces",
      "collection.gifts": "Gifts",
      "collection.bracelets": "Bracelets",
      "collection.pendants": "Pendants",
      "collection.earrings": "Earrings",
		'beadsDance.title': 'The golden beads come together in a graceful dance',
		'beadsDance.description':
			'CYO Design showcases the Perlée collection’s joyful spirit through vibrant movement and refined style.',
		'beadsDance.cta': 'Discover the graceful dance',
		'gifts.title': 'Enchanting gifts',
		'gifts.imgAlt': 'Gifts Jewelry',
		'gifts.description':
			'Thanks to the savoir-faire, creativity and excellence, CYO Design accompanies the happiest moments of life',
		'gifts.cta': 'Enter the timeless universe',
		'footer.impressum': 'Impressum',
		'footer.privacy': 'Privacy',
		'assistant.sendButton': 'Send',
		'assistant.description': `I will help you design your dream jewelry.
  Just upload an inspiration photo, or tell me about the jewelry you want.
  You can talk to me with text or voice. I will help you, step by step.`,
		'assistant.input.placeholder': 'Describe your dream jwellery...',
		'aboutus.aboutus': 'About Us',
	
		'aboutus.title': 'Inspired by you, crafted by us.',
		'aboutus.subtitle':
			'We combine decades of time-tested craftsmanship with the possibilities of artificial intelligence. Our promise: Personal consultation, constant availability, and visualizations until every detail is perfect. Until, together, we create the piece that perfectly reflects your vision.',
		'steps.title': 'CYO, in four steps',
		'steps.1.title': 'Share Inspiration',
		'steps.1.description': 'Talk to our AI, show your ideas, and see the first visualizations come to life.',
		'steps.2.title': 'Perfect the Design',
		'steps.2.description':
			"We'll refine every detail together until the piece of jewelry perfectly matches your vision.",
		'steps.3.title': 'Receive a Quote',
		'steps.3.description': 'Transparent, clear, and tailored specifically to you.',
		'steps.4.title': 'Crafting & Delivery',
		'steps.4.description':
			'Our master craftsmen transform your vision into a unique piece of jewelry – crafted with the highest precision and delivered directly to you.',
		'menu.languageSwitcher': 'Language Switcher',
	},
	de: {
		'nav.home': 'Startseite',
		'nav.about': 'Über uns',
		'nav.twitter': 'Twitter',
		'nav.gallery': 'Geschäft',
		'nav.shop': 'Shop',
		'hero.title': 'Individuelle Schmuckstücke, gefertigt für Ihre Geschichte',
		'hero.subtitle':
			'Erleben Sie das CYO Live Atelier: Luxus, Kunstfertigkeit und persönliche Beratung – digital und persönlich.',
		'hero.callToAction': 'Ihr Schmuckdesign starten',
		'hero.scrollToGallery': 'Zur Galerie scrollen',
		'lead.title': 'Kontakt aufnehmen',
		'lead.description':
			'Nach dem Absenden Ihrer E-Mail wird sich unser Team mit Ihnen in Verbindung setzen, um mehr über Ihre Schmuckwünsche zu erfahren. Wir respektieren Ihre Privatsphäre und handeln DSGVO-konform.',
		'lead.emailPlaceholder': 'Ihre E-Mail-Adresse',
		'lead.gdprLabel': 'Ich stimme dem Erhalt von E-Mails zu',
		'lead.button': 'Anmelden',
		'lead.success': 'Vielen Dank für Ihre Anmeldung!',
		'lead.error': 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
		'gallery.title': 'Galerie / Inspirationen',
		'gallery.imgAlt': 'Perlée Signatur-Armband',
		'gallery.itemTitle': 'Perlée Signatur-Armband, mittleres Modell',
		'gallery.itemMaterial': 'Gelbgold',
		'gallery.more': 'Weitere Kreationen',
		'gallery.modelAlt': 'Modell mit Perlée',
		'collection.title': 'Nach Kollektion einkaufen',
		 "collection.rings": "Ringe",
		  "collection.necklaces": "Halsketten",
      "collection.gifts": "Geschenke",
      "collection.bracelets": "Armbänder",
      "collection.pendants": "Anhänger",
      "collection.earrings": "Ohrringe",
	
		'beadsDance.title': 'Die goldenen Perlen tanzen in anmutiger Harmonie',
		'beadsDance.description':
			'CYO Design präsentiert die lebensfrohe Perlée-Kollektion durch lebendige Bewegung und raffinierte Eleganz.',
		'beadsDance.cta': 'Entdecken Sie den anmutigen Tanz',
		'gifts.title': 'Verzaubernde Geschenke',
		'gifts.imgAlt': 'Geschenk Schmuck',
		'gifts.description':
			'Dank Know-how, Kreativität und Exzellenz begleitet CYO Design die glücklichsten Momente des Lebens.',
		'gifts.cta': 'Treten Sie in das zeitlose Universum ein',
		'footer.impressum': 'Impressum',
		'footer.privacy': 'Datenschutz',
		'assistant.sendButton': 'Senden',
		'assistant.description': `Ich helfe Ihnen, Ihr Traum-Schmuckstück zu entwerfen.
  Laden Sie ein Inspirationsfoto hoch oder erzählen Sie mir, welches Schmuckstück Sie möchten.
  Sie können mit Text oder Stimme mit mir sprechen. Ich führe Sie Schritt für Schritt.`,
		'assistant.input.placeholder': 'Beschreiben Sie Ihr Traumschmuckstück...',
		'aboutus.aboutus': 'Über uns',
		'aboutus.title': 'Von dir inspiriert, von uns gestaltet.',
		'aboutus.subtitle':
			`Wir verbinden jahrzehntelang erprobte Handwerkskunst mit den Möglichkeiten künstlicher Intelligenz. Unser Versprechen: Persönliche Beratung, ständige Erreichbarkeit und Visualisierungen, bis jedes Detail stimmt. So lange, bis wir gemeinsam das Stück erschaffen, das deine Vision perfekt widerspiegelt.`,
		'steps.title': 'CYO, in vier Schritten',
		'steps.1.title': 'Inspiration teilen',
		'steps.1.description':
			'Sprich mit unserer KI, zeige deine Ideen und erlebe, wie erste Visualisierungen entstehen.',
		'steps.2.title': 'Design vollenden',
		'steps.2.description':
			'Wir verfeinern gemeinsam jedes Detail, bis das Schmuckstück genau deiner Vorstellung entspricht.',
		'steps.3.title': 'Angebot erhalten',
		'steps.3.description': 'Transparent, klar und individuell auf dich abgestimmt.',
		'steps.4.title': 'Fertigung & Lieferung',
		'steps.4.description':
			'Unsere Meister verwandeln deine Vision in ein einzigartiges Schmuckstück – gefertigt mit höchster Präzision und direkt zu dir geliefert.',
		'menu.languageSwitcher': 'Sprache ändern',
	},
	it: {
		'nav.home': 'Home',
		'nav.about': 'Chi siamo',
		'nav.twitter': 'Twitter',
		'nav.gallery': 'Galleria',
		'nav.shop':'Negozio',
		'hero.title': 'Gioielli su misura, creati per la tua storia',
		'hero.subtitle': "Vivi l'Atelier Live di CYO: lusso, maestria e guida personale, in digitale e di persona.",
		'hero.callToAction': 'Crea il tuo gioiello',
		'hero.scrollToGallery': 'Scorri alla galleria',
		'lead.title': 'Contattaci',
		'lead.description':
			'Dopo aver inviato la tua email, il nostro team ti contatterà per conoscere le tue preferenze sul design dei gioielli. Rispettiamo la tua privacy e siamo conformi al GDPR.',
		'lead.emailPlaceholder': 'Il tuo indirizzo email',
		'lead.gdprLabel': 'Accetto di ricevere email',
		'lead.button': 'Iscriviti',
		'lead.success': 'Grazie per esserti iscritto!',
		'lead.error': 'Si è verificato un errore. Per favore, riprova.',
		'gallery.title': 'Galleria / Ispirazioni',
		'gallery.imgAlt': 'Bracciale signature Perlée',
		'gallery.itemTitle': 'Bracciale signature Perlée, modello medio',
		'gallery.itemMaterial': 'Oro giallo',
		'gallery.more': 'Altre creazioni',
		'gallery.modelAlt': 'Modella con Perlée',
		'collection.title': 'Acquista per Collezione',
			 "collection.rings": "Anelli",
		  "collection.necklaces": "Collane",
      "collection.gifts": "Regali",
      "collection.bracelets": "Braccialetti",
      "collection.pendants": "Ciondoli",
      "collection.earrings": "Orecchini",
		'beadsDance.title': 'Le perle dorate si uniscono in una danza aggraziata',
		'beadsDance.description':
			'CYO Design mette in mostra lo spirito gioioso della collezione Perlée attraverso movimenti vibranti e uno stile raffinato.',
		'beadsDance.cta': 'Scopri la danza aggraziata',
		'gifts.title': 'Regali incantevoli',
		'gifts.imgAlt': 'Gioielli da regalo',
		'gifts.description':
			'Grazie al savoir-faire, alla creatività e all’eccellenza, CYO Design accompagna i momenti più felici della vita',
		'gifts.cta': "Entra nell'universo senza tempo",
		'footer.impressum': 'Note Legali',
		'footer.privacy': 'Privacy',
		'assistant.sendButton': 'Invia',
		'assistant.description': `Ti aiuterò a disegnare il gioiello dei tuoi sogni.
  Carica una foto di ispirazione o parlami del gioiello che desideri.
  Puoi parlarmi con testo o voce. Ti aiuterò, passo dopo passo.`,
		'assistant.input.placeholder': 'Descrivi il gioiello dei tuoi sogni...',
		'aboutus.aboutus': 'Chi Siamo',
		'aboutus.title': 'Ispirato da te, creato da noi.',
		'aboutus.subtitle':
			"Combiniamo decenni di artigianato collaudato con le possibilità dell'intelligenza artificiale. La nostra promessa: consulenza personale, disponibilità costante e visualizzazioni finché ogni dettaglio non è perfetto. Finché, insieme, non creiamo il pezzo che riflette perfettamente la tua visione.",
		'steps.title': 'CYO, in quattro passaggi',
		'steps.1.title': "Condividi l'ispirazione",
		'steps.1.description':
			'Parla con la nostra IA, mostra le tue idee e guarda le prime visualizzazioni prendere vita.',
		'steps.2.title': 'Perfeziona il design',
		'steps.2.description':
			'Perfezioneremo insieme ogni dettaglio finché il gioiello non corrisponderà perfettamente alla tua visione.',
		'steps.3.title': 'Ricevi un preventivo',
		'steps.3.description': 'Trasparente, chiaro e su misura per te.',
		'steps.4.title': 'Creazione e consegna',
		'steps.4.description':
			'I nostri maestri artigiani trasformano la tua visione in un gioiello unico, realizzato con la massima precisione e consegnato direttamente a te.',
		'menu.languageSwitcher': 'Cambia lingua',
	},
	es: {
		'nav.home': 'Inicio',
		'nav.about': 'Sobre nosotros',
		'nav.twitter': 'Twitter',
		'nav.gallery': 'Galería',
		'nav.shop':'Tienda',
		'hero.title': 'Joyas a medida, creadas para tu historia',
		'hero.subtitle': 'Experimenta el Atelier en Vivo de CYO: lujo, arte y guía personal, digital y personalmente.',
		'hero.callToAction': 'Diseña tu joya',
		'hero.scrollToGallery': 'Ir a la galería',
		'lead.title': 'Ponte en contacto',
		'lead.description':
			'Después de enviar tu correo electrónico, nuestro equipo se pondrá en contacto contigo para conocer tus preferencias de diseño de joyas. Respetamos tu privacidad y cumplimos con el RGPD.',
		'lead.emailPlaceholder': 'Tu dirección de correo electrónico',
		'lead.gdprLabel': 'Acepto recibir correos electrónicos',
		'lead.button': 'Registrarse',
		'lead.success': '¡Gracias por registrarte!',
		'lead.error': 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
		'gallery.title': 'Galería / Inspiraciones',
		'gallery.imgAlt': 'Brazalete signature Perlée',
		'gallery.itemTitle': 'Brazalete signature Perlée, modelo mediano',
		'gallery.itemMaterial': 'Oro amarillo',
		'gallery.more': 'Más creaciones',
		'gallery.modelAlt': 'Modelo con Perlée',
		'collection.title': 'Comprar por Colección',
			 "collection.rings": "Anillos",
		  "collection.necklaces": "Collares",
      "collection.gifts": "Regalos",
      "collection.bracelets": "Pulseras",
      "collection.pendants": "Colgantes",
      "collection.earrings": "Pendientes",
		'beadsDance.title': 'Las cuentas doradas se unen en una danza elegante',
		'beadsDance.description':
			'CYO Design muestra el espíritu alegre de la colección Perlée a través de un movimiento vibrante y un estilo refinado.',
		'beadsDance.cta': 'Descubre la danza elegante',
		'gifts.title': 'Regalos encantadores',
		'gifts.imgAlt': 'Joyas para regalar',
		'gifts.description':
			'Gracias al savoir-faire, la creatividad y la excelencia, CYO Design acompaña los momentos más felices de la vida',
		'gifts.cta': 'Entra en el universo atemporal',
		'footer.impressum': 'Aviso Legal',
		'footer.privacy': 'Privacidad',
		'assistant.sendButton': 'Enviar',
		'assistant.description': `Te ayudaré a diseñar la joya de tus sueños.
  Simplemente sube una foto de inspiración o cuéntame sobre la joya que deseas.
  Puedes hablarme por texto o por voz. Te ayudaré, paso a paso.`,
		'assistant.input.placeholder': 'Describe la joya de tus sueños...',
		'aboutus.aboutus': 'Sobre Nosotros',
		'aboutus.title': 'Inspirado en ti, creado por nosotros.',
		'aboutus.subtitle':
			'Combinamos décadas de artesanía probada con las posibilidades de la inteligencia artificial. Nuestra promesa: consulta personal, disponibilidad constante y visualizaciones hasta que cada detalle sea perfecto. Hasta que, juntos, creemos la pieza que refleje perfectamente tu visión.',
		'steps.title': 'CYO, en cuatro pasos',
		'steps.1.title': 'Comparte tu inspiración',
		'steps.1.description':
			'Habla con nuestra IA, muestra tus ideas y ve cómo cobran vida las primeras visualizaciones.',
		'steps.2.title': 'Perfecciona el diseño',
		'steps.2.description':
			'Refinaremos cada detalle juntos hasta que la joya coincida perfectamente con tu visión.',
		'steps.3.title': 'Recibe un presupuesto',
		'steps.3.description': 'Transparente, claro y adaptado específicamente a ti.',
		'steps.4.title': 'Fabricación y entrega',
		'steps.4.description':
			'Nuestros maestros artesanos transforman tu visión en una joya única, elaborada con la máxima precisión y entregada directamente a ti.',
		'menu.languageSwitcher': 'Cambiar idioma',
	},
	fr: {
		'nav.home': 'Accueil',
		'nav.about': 'À propos',
		'nav.twitter': 'Twitter',
		'nav.gallery': 'Galerie',
		'nav.shop': 'Boutique',
		'hero.title': 'Bijoux sur mesure, créés pour votre histoire',
		'hero.subtitle':
			"Découvrez l'Atelier Live CYO : luxe, art et accompagnement personnel - en numérique et en personne.",
		'hero.callToAction': 'Créez votre bijou',
		'hero.scrollToGallery': 'Voir la galerie',
		'lead.title': 'Contactez-nous',
		'lead.description':
			'Après avoir soumis votre e-mail, notre équipe vous contactera pour connaître vos préférences en matière de design de bijoux. Nous respectons votre vie privée et nous conformons au RGPD.',
		'lead.emailPlaceholder': 'Votre adresse e-mail',
		'lead.gdprLabel': "J'accepte de recevoir des e-mails",
		'lead.button': "S'inscrire",
		'lead.success': 'Merci pour votre inscription !',
		'lead.error': 'Une erreur est survenue. Veuillez réessayer.',
		'gallery.title': 'Galerie / Inspirations',
		'gallery.imgAlt': 'Bracelet signature Perlée',
		'gallery.itemTitle': 'Bracelet signature Perlée, modèle moyen',
		'gallery.itemMaterial': 'Or jaune',
		'gallery.more': 'Plus de créations',
		'gallery.modelAlt': 'Modèle avec Perlée',
		'collection.title': 'Acheter par Collection',
		"collection.rings": "Bagues",
		"collection.necklaces": "Colliers",
		"collection.gifts": "Cadeaux",
		"collection.bracelets": "Bracelets",
		"collection.pendants": "Pendentifs",
		"collection.earrings": "Boucles d’oreilles",
		'beadsDance.title': 'Les perles dorées s’unissent dans une danse gracieuse',
		'beadsDance.description':
			'CYO Design met en valeur l’esprit joyeux de la collection Perlée à travers un mouvement vibrant et un style raffiné.',
		'beadsDance.cta': 'Découvrez la danse gracieuse',
		'gifts.title': 'Cadeaux enchanteurs',
		'gifts.imgAlt': 'Bijoux cadeaux',
		'gifts.description':
			"Grâce au savoir-faire, à la créativité et à l'excellence, CYO Design accompagne les moments les plus heureux de la vie",
		'gifts.cta': 'Entrez dans l’univers intemporel',
		'footer.impressum': 'Mentions Légales',
		'footer.privacy': 'Confidentialité',
		'assistant.sendButton': 'Envoyer',
		'assistant.description': `Je vous aiderai à concevoir le bijou de vos rêves.
  Téléchargez simplement une photo d'inspiration ou parlez-moi du bijou que vous souhaitez.
  Vous pouvez me parler par texte ou par voix. Je vous aiderai, étape par étape.`,
		'assistant.input.placeholder': 'Décrivez le bijou de vos rêves...',
		'aboutus.aboutus': 'À Propos de Nous',
		'aboutus.title': 'Inspiré par vous, créé par nous.',
		'aboutus.subtitle':
			"Nous combinons des décennies de savoir-faire éprouvé avec les possibilités de l'intelligence artificielle. Notre promesse : une consultation personnelle, une disponibilité constante et des visualisations jusqu'à ce que chaque détail soit parfait. Jusqu'à ce que, ensemble, nous créions la pièce qui reflète parfaitement votre vision.",
		'steps.title': 'CYO, en quatre étapes',
		'steps.1.title': 'Partagez votre inspiration',
		'steps.1.description':
			'Parlez à notre IA, montrez vos idées et voyez les premières visualisations prendre vie.',
		'steps.2.title': 'Perfectionnez le design',
		'steps.2.description':
			'Nous affinerons ensemble chaque détail jusqu’à ce que le bijou corresponde parfaitement à votre vision.',
		'steps.3.title': 'Recevez un devis',
		'steps.3.description': 'Transparent, clair et spécialement conçu pour vous.',
		'steps.4.title': 'Fabrication et livraison',
		'steps.4.description':
			'Nos maîtres artisans transforment votre vision en un bijou unique – fabriqué avec la plus haute précision et livré directement chez vous.',
		'menu.languageSwitcher': 'Changer de langue',
	},
} as const

export const getTranslationForLocale = (language: string) => {
	const lang = (language in ui ? language : 'en') as keyof typeof ui
	return ui[lang]
}

/**
 * Prefix Path with a locale
 * @param locale
 * @returns
 */
export const getLocalePath = (locale: string) => (path: string) => locale === 'en' ? path : `/${locale}${path}`

export const getLanguageFromLocale = (locale: string) => {
	return locale in languages ? languages[locale as LanguageKeys] : 'English'
}

export const normalizeLocale = (locale: string) => (locale in languages ? locale : 'en') as LanguageKeys
