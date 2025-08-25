const languages = {
	en: 'English',
	de: 'Deutsch', // German
} as const

type LanguageKeys = keyof typeof languages

// Define all translation keys in a union type
type TranslationKey =
	| 'nav.home'
	| 'nav.about'
	| 'nav.twitter'
	| 'nav.gallery'
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
		'hero.title': 'Bespoke jewelry, crafted for your story',
		'hero.subtitle':
			'Experience the CYO Live Atelier: luxury, artistry, and personal guidance - digitally and personally.',
		'hero.callToAction': 'Design Your Jewelry',
		'hero.scrollToGallery': 'Scroll to Gallery',
		'lead.title': 'Get in Touch',
		'lead.description':
			'After you submit your email, our team will reach out to you to learn about your preferences for jewelry design. We respect your privacy and comply with GDPR.',
		'lead.emailPlaceholder': 'Your email address',
		'lead.gdprLabel':
			'I agree to receive emails and accept the <a href="/privacy" class="underline">privacy policy</a>.',
		'lead.button': 'Sign Up',
		'lead.success': 'Thank you for signing up!',
		'lead.error': 'There was an error. Please try again.',
		'gallery.title': 'Gallery / Inspirations',
		'gallery.imgAlt': 'Perlée signature bracelet',
		'gallery.itemTitle': 'Perlée signature bracelet, medium model',
		'gallery.itemMaterial': 'Yellow Gold',
		'gallery.more': 'More creations',
		'gallery.modelAlt': 'Model with Perlée',
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
		'steps.title': 'CYO, in four steps', // Assuming this is the title for the whole section
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
	},
	de: {
		'nav.home': 'Startseite',
		'nav.about': 'Über uns',
		'nav.twitter': 'Twitter',
		'nav.gallery': 'Galerie',
		'hero.title': 'Individuelle Schmuckstücke, gefertigt für Ihre Geschichte',
		'hero.subtitle':
			'Erleben Sie das CYO Live Atelier: Luxus, Kunstfertigkeit und persönliche Beratung – digital und persönlich.',
		'hero.callToAction': 'Ihr Schmuckdesign starten',
		'hero.scrollToGallery': 'Zur Galerie scrollen',
		'lead.title': 'Kontakt aufnehmen',
		'lead.description':
			'Nach dem Absenden Ihrer E-Mail wird sich unser Team mit Ihnen in Verbindung setzen, um mehr über Ihre Schmuckwünsche zu erfahren. Wir respektieren Ihre Privatsphäre und handeln DSGVO-konform.',
		'lead.emailPlaceholder': 'Ihre E-Mail-Adresse',
		'lead.gdprLabel':
			'Ich stimme dem Erhalt von E-Mails zu und akzeptiere die <a href="/de/privacy" class="underline">Datenschutzerklärung</a>.',
		'lead.button': 'Anmelden',
		'lead.success': 'Vielen Dank für Ihre Anmeldung!',
		'lead.error': 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
		'gallery.title': 'Galerie / Inspirationen',
		'gallery.imgAlt': 'Perlée Signatur-Armband',
		'gallery.itemTitle': 'Perlée Signatur-Armband, mittleres Modell',
		'gallery.itemMaterial': 'Gelbgold',
		'gallery.more': 'Weitere Kreationen',
		'gallery.modelAlt': 'Modell mit Perlée',
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
		'steps.title': 'CYO, in vier Schritten', // Assuming this is the title for the whole section
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
