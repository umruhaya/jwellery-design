const languages = {
	en: 'English',
	fr: 'Français', // French
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
	| 'assistant.input.placeholder'

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
			'Experience the CYO Live Atelier: luxury, artistry, and personal guidance—digitally and personally.',
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
		'assistant.input.placeholder': 'Describe your dream jwellery...',
	},
	fr: {
		'nav.home': 'Accueil',
		'nav.about': 'À propos',
		'nav.twitter': 'Twitter',
		'nav.gallery': 'Galerie',
		'hero.title': 'Bijoux sur mesure, créés pour votre histoire',
		'hero.subtitle':
			'Découvrez l’Atelier Live CYO : luxe, art et accompagnement personnalisé – digital et en personne.',
		'hero.scrollToGallery': 'Faire défiler vers la galerie',
		'lead.title': 'Contactez-nous',
		'lead.description':
			'Après avoir soumis votre e-mail, notre équipe vous contactera pour en savoir plus sur vos souhaits en matière de bijoux. Nous respectons votre vie privée et sommes conformes au RGPD.',
		'lead.emailPlaceholder': 'Votre adresse e-mail',
		'lead.gdprLabel':
			'J’accepte de recevoir des e-mails et d’accepter la <a href="/privacy" class="underline">politique de confidentialité</a>.',
		'lead.button': 'S’inscrire',
		'lead.success': 'Merci pour votre inscription !',
		'lead.error': 'Une erreur est survenue. Veuillez réessayer.',
		'gallery.title': 'Galerie / Inspirations',
		'gallery.imgAlt': 'Bracelet signature Perlée',
		'gallery.itemTitle': 'Bracelet signature Perlée, modèle moyen',
		'gallery.itemMaterial': 'Or jaune',
		'gallery.more': 'Plus de créations',
		'gallery.modelAlt': 'Modèle avec Perlée',
		'beadsDance.title': 'Les perles dorées s’unissent dans une danse gracieuse',
		'beadsDance.description':
			'CYO Design présente l’esprit joyeux de la collection Perlée à travers un mouvement vibrant et un style raffiné.',
		'beadsDance.cta': 'Découvrez la danse gracieuse',
		'gifts.title': 'Cadeaux enchanteurs',
		'gifts.imgAlt': 'Bijoux cadeaux',
		'gifts.description':
			'Grâce au savoir-faire, à la créativité et à l’excellence, CYO Design accompagne les moments les plus heureux de la vie',
		'gifts.cta': 'Entrez dans l’univers intemporel',
		'footer.impressum': 'Mentions légales',
		'footer.privacy': 'Confidentialité',
		'assistant.sendButton': 'Envoyer',
		'assistant.input.placeholder': 'Décrivez votre bijou de rêve...',
	},
	de: {
		'nav.home': 'Startseite',
		'nav.about': 'Über uns',
		'nav.twitter': 'Twitter',
		'nav.gallery': 'Galerie',
		'hero.title': 'Individuelle Schmuckstücke, gefertigt für Ihre Geschichte',
		'hero.subtitle':
			'Erleben Sie das CYO Live Atelier: Luxus, Kunstfertigkeit und persönliche Beratung – digital und persönlich.',
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
		'assistant.input.placeholder': 'Beschreiben Sie Ihr Traumschmuckstück...',
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
