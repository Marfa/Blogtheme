#!/usr/bin/env node
/**
 * Revert authors on posts that clean-llms-index.js reassigned
 * from «Гостевой» (gostievoi) to Константин.
 *
 *   node scripts/revert-guest-authors.js
 *   node scripts/revert-guest-authors.js --dry-run
 *
 * Needs: GHOST_ADMIN_API_URL + GHOST_ADMIN_API_KEY (*.ghost.io)
 */
const crypto = require('crypto');

const DRY = process.argv.includes('--dry-run');
const SLUGS = [
  'skidka-gpt-6-astra-dlia-raboty',
  'airpods-5-protiv-airpods-4-chto-izmenilos-i-stoit-li-perehodit-na-novoe-pokolenie',
  'kak-uznat-est-li-vashi-dannye-v-darknete',
  'refbox-doska-referensov-kotoraia-vsegda-ostaiotsia-pered-glazami',
  'opensorsnye-alternativy-microsoft-excel',
  'sendnow-perevody-v-rossiiu-i-eshchio-190-stran-cherez-prilozhenie',
  'luchshie-pomodoro-taimery-dlia-android',
  'bankrotstvo-suprugov-kak-spisat-obshchie-dolgi',
  '5-luchshikh-prilozhenii-dlia-otslezhivaniia-severnogo-siianiia',
  'awz-media-player-universalnyi-mediapleer-s-instrumentami-redaktirovaniia',
  'osobennosti-seo-prodvizheniya-saytov-na-drupal-kotorye-chasto-upuskayut-iz-vidu',
  'kredit-nalichnymi-onlain-kak-proverit-usloviia',
  'idpay-chto-eto-za-servis-i-kogda-on-prigoditsia',
  'chto-takoe-webmin-i-kakie-u-nego-funktsii',
  'gpu-po-trebovaniiu-kak-zapuskat-ii-proekty-bez-sobstvennoi-servernoi',
  'skidka-ishchete-chto-to-novoe-na-rynke-proksi-v-2026-godu',
  'top-5-alternativ-prilozheniiu-kamera-na-pixel',
  'luchshie-privatnye-alternativy-google-docs',
  'kak-ispolzovat-neiroseti-pri-napisanii-esse-prakticheskoe-rukovodstvo',
  'luchshie-ekvalaizery-dlia-mac',
  'opensorsnye-alternativy-instagram',
  'srm-v-moskve-kogda-postavshchiki-perestayut-byt-golovnoy-bolyu',
  'kak-ispolzovat-samsung-smarttag-na-liubom-android-ustroistve',
  '4-alternativy-photoshop-dlia-linux',
  '4-utility-dlia-sinkhronizatsii-failov-mezhdu-linux-i-windows',
  'refine-pomozhet-tonko-nastroit-okruzhenie-gnome',
  'kak-byt-na-sviazi-bez-seti-i-mobilnogo-interneta-raskryvaem-vozmozhnosti-meshtastic',
  '10-ne-steam-prilozhenii-dlia-steam-deck',
  '5-prilozhienii-dlia-upravlieniia-oknami-na-mac',
  'kak-sozdat-effiektivnyi-liendingh-struktura-eliemienty-i-oshibki',
  'atla-vs-chz-sports-betting-tokens-battle-which-powers-2026-fan-tokens-best',
  'luchshiie-utility-dlia-sniatiia-blokirovki-frp-na-windows',
  '4-siervisa-dlia-dobavlieniia-effiekta-fade-in-out',
  'chto-takoie-vps-i-pochiemu-on-stal-niezamienimym-instrumientom-dlia-bizniesa-i-razrabotchikov',
  '4-prilozhieniia-dlia-dublirovaniia-ekrana-android-na-pk-chieriez-usb',
  'kak-zapisyvat-potokovoie-vidieo-biez-probliem-s-chiernym-ekranom',
  'youware-review-2026-what-is-youware-should-you-use-it',
  'kak-zakriepit-liubimyie-prilozhieniia-v-sietkie-prilozhienii',
  'koghda-tsifrovoi-assistient-i-azart-pieriesiekaiutsia-kak-rabotaiut-boty-v-stavkakh-na-sport',
  'funktsionalnost-crm-sistiem-2026-otchiety-intieghratsii-i-kontrol-protsiessov',
  '4-ai-instrumienta-dlia-zapisi-vstriech-v-google-meet',
  'kak-bolshiie-ekskavatory-uluchshaiut-effiektivnost-ziemlianykh-rabot',
  'biezopasnost-avtobietononasosa-chto-slieduiet-znat',
  'pochiemu-ghusienichnyie-krany-nieobkhodimy-dlia-bolshikh-proiektov',
  'layki-v-tvittere-kak-prevratit-reakciyu-v-realnyy-ohvat',
  'luchshiie-brauziery-dlia-vykhoda-v-darkniet',
  'steam-inventory-helper-razbor-vozmozhnostiei-i-nastroika-rasshirieniia',
  'luchshieie-po-dlia-sozdaniia-dorozhnykh-kart-na-mac',
  '5-altiernativ-notion-oriientirovannykh-na-konfidientsialnost',
  'luchshii-mobilnyi-ighrovoi-bustier-dlia-android-i-ios-v-2026-godu',
  'ai-instrumienty-dlia-prieobrazovaniia-skrinshotov-v-kod',
  'kreditka-dlya-nachinayushchih-polzovateley-chto-vazhno-znat-o-limite-i-stavke',
  '5-rasshirienii-chrome-dlia-pierieiezda-s-x-twitter-na-bluesky',
  'kak-avtomatichieski-mieniat-aktsientnyi-tsviet-v-ubuntu',
  'all-new-whiteout-survival-codes-for-december-2025',
  '6-luchshikh-ii-siervisov-dlia-sozdaniia-priezientatsii',
  'top-9-biesplatnykh-vidieoriedaktorov-dlia-mac',
  'kak-uprostit-ustanovku-ssl-siertifikatov-na-siervierie-iis',
  'institut-proghrammirovaniia-kak-vybrat-i-postupit-v-top-vuz',
  'hpe-msa-2060-sovriemiennaia-ghibridnaia-sistiema-khranieniia-dlia-bizniesa',
  '4-sposoba-biesplatno-prosmatrivat-faily-autocad-na-mac',
  'biezdiepozitnyie-bonusy-za-rieghistratsiiu-novyi-triend-na-rynkie-tsifrovykh-siervisov',
  'altiernativa-syncthing-dlia-android',
  'obzor-stellarium-zviozdnaia-karta-u-tiebia-na-kompiutierie',
  'vidjeomontazh-prostoj-i-ponjatnyj-rjedaktor-vidjeo',
  '5-instrumientov-dlia-monitoringha-proizvoditielnosti-sistiemy-linux-iz-tierminala',
  '7-prilozhienii-s-oboiami-dlia-android',
  'prieobrazuitie-foto-v-multiashnyi-stil-sozdaitie-multiashnuiu-viersiiu-siebia-onlain-biesplatno',
  'laifkhaki-vyviesti-usdt-iz-trust-wallet-i-sekonomit-na-komissiiakh',
  'fribiet-kak-vozmozhnost-kak-nachat-ighrat-biez-riskov-i-poluchit-maksimum-vyghody',
  'xnspy-rol-v-udaliennom-monitoringhie-i-upravlienii-tieliefonom',
  'chto-proiskhodit-koghda-dva-ustroistva-imieiut-odinakovyi-mac-adries',
  'simptomy-alghoritmichieskikh-sanktsii',
  'komissii-za-ghaz-v-ethereum-chto-eto-i-kak-oni-rabotaiut',
  'luchshiie-storonniie-brandmauery-dlia-mac',
  'kak-vybrat-chasy-dlya-iphone',
  'psikhologhiia-emotsionalnykh-viertikaliei',
  'v-poghonie-za-siomnym-zhiliom-v-astanie-kak-biezopasno-vybrat-khoroshuiu-kvartiru-v-ariendu',
  'ighrat-na-pokierok-iz-rossii-v-2025-ghodu',
  'luchshiie-rss-chitalki-dlia-iphone-i-mac',
  'lego-ninjago-vsieliennaia-nindzia-dlia-iunykh-stroitieliei',
  '11-prilozhienii-dlia-uchashchikhsia-pod-linux',
  'antidetekt-dlya-arbitrazha-effektivnaya-rabota-s-reklamnymi-akkauntami',
  'sport-biez-pota-i-travm-simuliatory-budushchiegho',
  'moddingh-v-football-manager-stal-kultovym-fanaty-sami-prodvighaiut-produkt',
  'pochiemu-stoit-kupit-vps-na-linux',
  '6-luchshikh-prilozhienii-dlia-borby-s-dumskrollinghom',
  'konstruktor-vidzhietov-widster-povyshaiem-konviersiiu-saita-biez-proghrammistov',
  'gravatar-pomozhiet-sinkhronizirovat-avatarku-uchiotnoi-zapisi-gnome-shell-i-nie-tolko',
  'kak-sdelat-perevod-v-belarus-cherez-servis-zolotaya-korona',
  'biesplatnyie-rieshieniia-s-otkrytym-kodom-dlia-otsliezhivaniia-vriemieni',
  'istorii-kambekov-samyie-iarkiie-vozvrashchieniia-v-sportie',
  'biez-sviazi-nie-ostaniemsia',
  'pochiemu-ghieimiery-i-polzovatieli-vybiraiut-markietplieisy-dlia-podpisok-i-akkauntov',
  'lolzteam-ot-chitov-k-tsifrovoi-ekonomikie',
  'kakiie-populiarnyie-ighrovyie-dvizhki-sushchiestvuiut-dlia-sozdaniia-mobilnykh-ighr-i-kak-vybrat-luchshii-instrumient',
  'kak-vybrat-telefon-samsung',
  'audiobookshelf-self-hosted-siervier-dlia-audioknigh-i-podkastov',
  'smartfon-do-30-000-rubliei-chto-pokupat-v-2025-ghodu',
  's-chiegho-nachat-obuchieniie-proghrammirovaniiu-dietiam',
  'chto-takoie-kde-connect-gid-dlia-chainikov',
  'luchshiie-prilozhieniia-dlia-sozdaniia-taimlaps-vidieo-na-mobilkakh',
  'kak-vybrat-shkolnyi-riukzak-soviety-ortopiedov-i-rieitinghi-roditieliei',
  'kak-antidetekt-brauzery-pomogayut-povysit-effektivnost-marketingovyh-kampaniy',
  'vniedrieniie-crm-sistiem-avtomatizatsiia-effiektivnost-i-rost-bizniesa',
  'top-18-rieshienii-dlia-sozdaniia-potriasaiushchikh-slaid-shou-iz-foto',
  'priemium-tiemy-i-plaghiny-dlia-wordpress-luchshiie-rieshieniia-2025-ghoda',
  'v-chiom-smysl-triokh-ili-chietyriokh-kamier-na-tieliefonie',
  'chto-dielaiet-smartfon-idiealnym-dlia-studientov-kolliedzha',
  'luchshiie-mobilnyie-prilozhieniia-dlia-sporta-i-fitniesa',
  'luchshiie-otkrytyie-bibliotieki-s-modieliami-dlia-obrabotki-dokumientov',
  'top-5-parsierov-pdf',
  'sliv-kursov-skachat-kursy-besplatno-i-bez-registracii',
  'top-9-rossiiskikh-korporativnykh-pochtovykh-siervisov',
  'remarked-crm-instrumient-dlia-rosta-riestorannogho-bizniesa',
  'top-7-muzykalnykh-plieierov-dlia-vosproizviedieniia-lossless-audio-na-windows'
];

function jwtForGhost(adminApiKey) {
  const [id, secret] = String(adminApiKey).split(':');
  if (!id || !secret) throw new Error('Admin API key must be id:secret');
  const signingKey = Buffer.from(secret, 'hex');
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: id })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })).toString('base64url');
  const data = `${header}.${payload}`;
  const sig = crypto.createHmac('sha256', signingKey).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function adminBase(apiUrl) {
  return String(apiUrl).replace(/\/$/, '');
}

async function adminJson(apiUrl, apiKey, path, options = {}) {
  const token = jwtForGhost(apiKey);
  const res = await fetch(`${adminBase(apiUrl)}${path}`, {
    ...options,
    headers: {
      Authorization: `Ghost ${token}`,
      Accept: 'application/json',
      'Accept-Version': 'v5.0',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${path}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : null;
}

async function main() {
  const apiUrl = process.env.GHOST_ADMIN_API_URL;
  const apiKey = process.env.GHOST_ADMIN_API_KEY;
  if (!apiUrl || !apiKey) throw new Error('Set GHOST_ADMIN_API_URL and GHOST_ADMIN_API_KEY');

  const guestData = await adminJson(apiUrl, apiKey, '/ghost/api/admin/users/?filter=slug:gostievoi&limit=1');
  const guest = guestData.users?.[0];
  if (!guest) throw new Error('Author gostievoi not found');
  console.log(`guest author: ${guest.id} ${guest.name}`);

  let ok = 0;
  let skip = 0;
  for (const slug of SLUGS) {
    const found = await adminJson(
      apiUrl,
      apiKey,
      `/ghost/api/admin/posts/?filter=slug:${encodeURIComponent(slug)}&limit=1&include=authors`,
    );
    const post = found.posts?.[0];
    if (!post) {
      console.log(`missing: ${slug}`);
      continue;
    }
    const already = (post.authors || []).some((a) => a.slug === 'gostievoi' || a.id === guest.id);
    if (already) {
      skip += 1;
      console.log(`already guest: ${slug}`);
      continue;
    }
    console.log(`revert → gostievoi: ${slug}`);
    if (DRY) {
      ok += 1;
      continue;
    }
    await adminJson(apiUrl, apiKey, `/ghost/api/admin/posts/${post.id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        posts: [{ authors: [{ id: guest.id }], updated_at: post.updated_at }],
      }),
    });
    ok += 1;
  }
  console.log(`done: reverted=${ok} already_guest=${skip} total=${SLUGS.length}${DRY ? ' (dry-run)' : ''}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
