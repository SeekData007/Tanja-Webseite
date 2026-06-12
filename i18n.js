/* Tanja Koller — i18n (SL ⇄ DE)
   Slovenian is captured from the DOM at startup; German lives in the
   dictionary below. main.js re-splits headings after each switch. */
'use strict';

window.TKI18N = (function () {

  const DE = {
    'meta.title': 'Tanja Koller — Energetikerin & Bioenergetikerin | Tieschen',
    'meta.desc': 'Zertifizierte Energetikerin Tanja Koller. Entdecken Sie die Ursache Ihrer Beschwerden — Harmonie für Seele, Körper und Geist. Methode Horst Krohne, Viva-Meter. Pichla 51, 8355 Tieschen.',
    'loader.tag': 'Harmonie für Seele, Körper und Geist',

    'nav.ponudba': 'Angebot', 'nav.energija': 'Energie', 'nav.cakre': 'Chakren',
    'nav.omeni': 'Über mich', 'nav.mnenja': 'Stimmen', 'nav.galerija': 'Galerie',
    'nav.cta': 'Termin',

    'hero.eyebrow': 'Energetisches Heilen · Bioenergetik',
    'hero.l1': 'Harmonie für Seele,',
    'hero.l2': 'Körper <em>und</em> Geist.',
    'hero.sub': 'Jede Krankheit hat eine Ursache. Wird sie erkannt und bewusst gemacht,<br class="br-desk"> erwachen im Körper die Selbstheilungskräfte.',
    'hero.cta1': 'Termin vereinbaren',
    'hero.cta2': 'Die Methode entdecken',
    'hero.s1': 'Hauptchakren', 'hero.s2': 'Minuten pro Therapie',
    'hero.s3': 'Frequenzen je Chakra', 'hero.s4': 'Therapien genügen meist',

    'marquee.a': 'Harmonie&ensp;·&ensp;Energie&ensp;·&ensp;Balance&ensp;·&ensp;<em>Selbstheilung</em>&ensp;·&ensp;',
    'marquee.b': 'Reservieren&ensp;·&ensp;Harmonisieren&ensp;·&ensp;<em>Aufblühen</em>&ensp;·&ensp;',

    'srv.kicker': 'Angebot',
    'srv.h2': 'Ich helfe Ihnen bei',
    'srv.1t': 'Schmerzen',
    'srv.1p': 'Beschwerden an Wirbelsäule und Organen, Kopfschmerzen, Migräne, Gelenkschmerzen sowie chronische Schmerzzustände.',
    'srv.2t': 'Allergien',
    'srv.2p': 'Auflösen und Löschen von Allergien — gegen Nahrungsmittel, Hausstaubmilben, Schwermetalle, Pollen, Gräser und Mitmenschen.',
    'srv.3t': 'Seelische Themen',
    'srv.3p': 'Burn-out, Stress, Stimmungs- und Lernstörungen, Persönlichkeits- und psychosomatische Störungen sowie Beziehungsthemen.',
    'srv.4t': 'Entgiftung',
    'srv.4p': 'Entgiften und Ausleiten von Schwermetallen, die sich durch Impfungen, Amalgamfüllungen und Zahnspangen ansammeln.',
    'srv.5t': 'Schlafplatz-Untersuchung',
    'srv.5p': 'Untersuchung von Schlafräumen und Betten auf Wasseradern, Erdstrahlen und Elektrosmog.',
    'srv.6t': 'Harmonisierung',
    'srv.6p': 'Ausgleich der Chakren, Meridiane und des Lebenskalenders — als Impuls zur Selbstheilung.',

    'fin.kicker': 'Interaktiver Berater',
    'fin.h2': 'Was belastet Sie?',
    'fin.lead': 'Wählen Sie aus, was Sie bei sich beobachten — und ich zeige Ihnen, in welchem Bereich ich Ihnen helfen kann.',

    'en.kicker': 'Geistheilung',
    'en.h2': 'Woher kommt Ihre Energie?',
    'en.lead': 'In einer Stunde verbrauchen wir rund <strong>1000 Watt</strong> Energie für Denken, Bewegung und alltägliche Tätigkeiten. Wissenschaftliche Untersuchungen zeigen: Wir schöpfen sie aus drei gleichwertigen Quellen.',
    'en.ring2': 'Drittel Energie',
    'en.l1t': 'Aufgenommene Nahrung',
    'en.l1p': 'Ein Drittel der Energie gewinnen wir über die Ernährung.',
    'en.l2t': 'Erdmagnetfeld',
    'en.l2p': 'Ein Drittel schenkt uns das Magnetfeld der Erde.',
    'en.l3t': 'Das System der sieben Chakren',
    'en.l3p': 'Ein Drittel fließt über die Chakren ein — in jedem entstehen rund 1000 elektromagnetische Frequenzen, die wir mit dem Viva-Meter präzise messen.',
    'en.sub': 'Wir existieren auf drei Ebenen',
    'en.lv1t': 'Körperliche Ebene',
    'en.lv1p': 'Das Nervensystem verzweigt sich im Körper und versorgt alle Organe und Funktionen.',
    'en.lv2t': 'Seelische Ebene',
    'en.lv2p': 'Die Meridiane fließen im Kreislauf — ihre Endpunkte liegen in Fingern und Zehen. Jeder Meridian versorgt ein bestimmtes Organsystem.',
    'en.lv3t': 'Geistige Ebene',
    'en.lv3p': 'Die Chakren steuern die Hormondrüsen und alle Abläufe im Körper. Durch ihren Ausgleich werden Schwachstellen reguliert — spürbar auf der körperlichen Ebene.',

    'ch.kicker': 'Eine interaktive Reise',
    'ch.h2': 'Der Aufstieg durch die sieben Chakren',
    'ch.lead': 'Scrollen Sie weiter — die Energie steigt vom Wurzelchakra zur Krone, wie bei der Harmonisierung. Tippen Sie ein Chakra an, um mehr zu erfahren.',

    'ab.kicker': 'Über mich',
    'ab.h2': 'Wie lassen sich Beschwerden lösen?',
    'ab.p1': 'Ich bin <strong>Tanja Koller</strong> und arbeite mit Bioenergie. Meine Arbeit beruht auf langjähriger eigener Erfahrung und der bewährten Methode von <a href="https://horstkrohne.de/" target="_blank" rel="noopener">Horst Krohne</a> — einem weltweit anerkannten deutschen Heiler, der fast 20 Jahre lang gemeinsam mit Ärzten, Psychologen und Energetikern aus aller Welt erforschte, wie Energien fließen und wie wir auf sie einwirken können.',
    'ab.p2': 'Meine Aufgabe und Fähigkeit ist es, <strong>die Ursache der Krankheit zu finden</strong>. Jede Krankheit hat eine Ursache — wird sie bewusst gemacht oder gelöscht, setzt die Selbstheilung ein. Die Ursache suche ich im System der Chakren, der Meridiane und im <strong>Lebenskalender</strong>, in dem alle Traumata, Konflikte und Schock-Ereignisse eingeprägt sind. Dort lässt sich bis aufs Jahr genau bestimmen, in welcher Lebensphase der Ursprung des Problems liegt.',
    'ab.p3': 'Bei meiner Arbeit verwende ich das <strong>Viva-Meter</strong>, mit dem ich in die für das Auge unsichtbaren Energiefelder eintrete und klare Ergebnisse erhalte. Die Besonderheit meiner Arbeit ist ein gezielter Impuls, der Ihre Selbstheilungskräfte aktiviert. Mehr über mich lesen Sie in der <a href="http://revijazarja.si/clanek/alter/5624da55ed46d/kar-danes-mislis-jutri-zivis" target="_blank" rel="noopener">Zeitschrift Zarja</a>.',
    'ab.cap': 'Tanja Koller · zertifizierte Energetikerin',
    'st.h': 'So läuft eine Therapie ab',
    'st.1t': 'Gespräch', 'st.1p': 'Wir lernen uns kennen und Sie schildern Ihr Anliegen.',
    'st.2t': 'Messung', 'st.2p': 'Mit dem Viva-Meter messe ich den Zustand der Chakren und Meridiane.',
    'st.3t': 'Ursachensuche', 'st.3p': 'Im Lebenskalender finde ich den Ursprung — bis aufs Jahr genau.',
    'st.4t': 'Harmonisierung', 'st.4p': 'Die Ursache wird gelöscht, der Impuls aktiviert Ihre Selbstheilungskräfte.',

    'vo.kicker': 'Erfahrungen',
    'vo.h2': 'Geschichten, die die Energie schreibt',

    'ga.kicker': 'Galerie',
    'ga.h2': 'Einblicke in meine Praxis',

    'fq.kicker': 'Häufige Fragen',
    'fq.h2': 'Was Sie am häufigsten wissen möchten',
    'fq.q1': 'Wie lange dauert eine Therapie?',
    'fq.a1': '<p>Eine Therapie dauert etwa 60 Minuten bei Erwachsenen und 30 Minuten bei Kindern. Wenn jemand eine längere Behandlung braucht, wird die Therapie angepasst.</p>',
    'fq.q2': 'Wie viele Therapien sind nötig?',
    'fq.a2': '<p>Jeder Mensch ist einzigartig und wird auch so behandelt. Beschwerden können kurzfristig oder chronisch sein oder aus einer bestimmten Lebensphase stammen (auch aus der Zeit vor der Geburt). Meist genügen höchstens 4 Therapien — erste Ergebnisse zeigt schon die Anfangstherapie, auf deren Basis wir das weitere Vorgehen vereinbaren.</p>',
    'fq.q3': 'Wie ist das bei Kindern?',
    'fq.a3': '<p>Kinder sprechen sehr schnell und gut auf die Therapien an, weil ihre Denkmuster noch nicht so festgefahren sind wie bei Erwachsenen. Bei Kindern behandle ich am häufigsten Allergien sowie Themen rund um Sprache, Verhalten, Hyperaktivität und Konzentration.</p>',
    'fq.q4': 'Was alles beeinflusst unsere Gesundheit?',
    'fq.a4': '<ul><li>negative Gefühle und Gedanken, die wir nähren,</li><li>Wasseradern, Erdstrahlen und Elektrosmog,</li><li>Schwermetalle (Amalgam, Aluminium, Phenol, Quecksilber …),</li><li>Mangel an Mineralstoffen und Vitaminen.</li></ul>',
    'fq.q5': 'Wo findet die Therapie statt?',
    'fq.a5': '<p>Die Therapien finden in meiner Praxis in Pichla 51, 8355 Tieschen statt — direkt an der slowenischen Grenze. Die Schlafplatz-Untersuchung mache ich bei Ihnen zu Hause.</p>',

    'bo.kicker': 'Terminvereinbarung',
    'bo.h2': 'Bringen Sie Ihren Körper in Harmonie',
    'bo.lead': 'Wenn wir die Krankheit verstehen, ihre Symptome kennen und beginnen, Seele und Geist zu heilen, können wir zum Glück gelangen. Zögern Sie nicht.',
    'bo.callt': 'Rufen Sie mich an',
    'bo.mailt': 'Schreiben Sie mir',
    'bo.lname': 'Vor- und Nachname', 'bo.lmail': 'E-Mail-Adresse',
    'bo.ltel': 'Telefonnummer', 'bo.ltopic': 'Bereich', 'bo.lmsg': 'Nachricht',
    'bo.o0': '— optional wählen —', 'bo.o1': 'Schmerzen', 'bo.o2': 'Allergien',
    'bo.o3': 'Seelische Themen', 'bo.o4': 'Entgiftung',
    'bo.o5': 'Schlafplatz-Untersuchung', 'bo.o6': 'Harmonisierung', 'bo.o7': 'Sonstiges',
    'bo.ph': 'Beschreiben Sie kurz, was Sie belastet …',
    'bo.btn': 'Anfrage senden',
    'bo.hint': 'Beim Klick öffnet sich Ihr E-Mail-Programm mit einer vorbereiteten Nachricht. Termine sind auch telefonisch möglich.',

    'lo.kicker': 'Standort',
    'lo.h2': 'Sie finden mich in Tieschen',
    'lo.addr': '<strong>Tanja Koller</strong><br>Pichla 51<br>8355 Tieschen, Österreich',
    'lo.note': 'Ein ruhiges Dorf in der Südoststeiermark, nahe der slowenischen Grenze — gut erreichbar aus Graz, Bad Radkersburg und Slowenien.',
    'lo.gmaps': 'Google Maps', 'lo.amaps': 'Apple Karten',

    'fi.title': 'Beginnen Sie Ihren Weg<br><em>zur Harmonie.</em>',
    'fi.cta': 'Vereinbaren Sie Ihren Termin',

    'ft.tag': 'Harmonie für Körper, Seele und Geist.<br>Zertifizierte Energetikerin.',
    'ft.kontakt': 'Kontakt', 'ft.links': 'Links',
    'ft.addr': 'Pichla 51, 8355 Tieschen, Österreich',
    'ft.l1': 'Die Methode von Horst Krohne',
    'ft.l2': 'Artikel in der Zeitschrift Zarja',
    'ft.legal': 'Energetisches Heilen ergänzt die ärztliche Versorgung und ersetzt sie nicht. Bitte besprechen Sie gesundheitliche Beschwerden auch mit Ihrem Arzt.',
    'ft.rights': 'Alle Rechte vorbehalten',
  };

  const SL = { 'meta.title': document.title,
               'meta.desc': document.querySelector('meta[name="description"]').content };

  /* capture Slovenian originals from the DOM so the dictionary
     only has to be maintained in one language */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    SL[el.dataset.i18n] = SL[el.dataset.i18n] ?? el.textContent;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    SL[el.dataset.i18nHtml] = SL[el.dataset.i18nHtml] ?? el.innerHTML;
  });
  document.querySelectorAll('[data-i18n-split]').forEach(el => {
    SL[el.dataset.i18nSplit] = SL[el.dataset.i18nSplit] ?? el.innerHTML;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    SL[el.dataset.i18nPh] = SL[el.dataset.i18nPh] ?? el.placeholder;
  });

  const DICTS = { sl: SL, de: DE };
  let lang = localStorage.getItem('tk-lang')
    || (navigator.language && navigator.language.toLowerCase().startsWith('de') ? 'de' : 'sl');

  function t(key) {
    return DICTS[lang][key] ?? SL[key] ?? '';
  }

  function apply() {
    const dict = DICTS[lang];
    const get = k => dict[k] ?? SL[k] ?? '';
    document.documentElement.lang = lang;
    document.title = get('meta.title');
    document.querySelector('meta[name="description"]').content = get('meta.desc');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = get(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = get(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-split]').forEach(el => { el.innerHTML = get(el.dataset.i18nSplit); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = get(el.dataset.i18nPh); });
    document.querySelectorAll('.nav__lang button').forEach(b =>
      b.classList.toggle('is-on', b.dataset.setlang === lang));
  }

  function setLang(next) {
    if (next === lang || !DICTS[next]) return;
    lang = next;
    localStorage.setItem('tk-lang', lang);
    apply();
    dispatchEvent(new CustomEvent('tk:lang', { detail: { lang } }));
  }

  document.querySelectorAll('.nav__lang button').forEach(b =>
    b.addEventListener('click', () => setLang(b.dataset.setlang)));

  apply(); /* applies DE immediately when stored/detected; SL is a no-op */

  return { get lang() { return lang; }, t, setLang };
})();
