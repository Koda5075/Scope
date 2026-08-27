// Official VALORANT player titles and sprays, extracted from Riot's val-content-v1
// (`playerTitles` / `sprays`) — same origin as the localized names already used across
// Scope. Titles are pure text: the six-language `names` here ARE Riot's official
// `localizedNames` (en-US/fr-FR/de-DE/es-ES/it-IT/pt-BR), not our own translations.
//
// This is a curated spread (~100 of ~400 titles, a hand-picked set of sprays) standing
// in as the static catalog until the authenticated val-content-v1 endpoint is proxied
// through a backend — exactly like valorantAssets.js. When that lands, replace these
// arrays with the full live list; nothing else needs to change.
//
// Sprays: val-content-v1 doesn't expose a usable image (its `assetPath` is only filled
// for cards and game modes), so the artwork comes from valorant-api.com — the same
// media host already used for agents/maps/player cards — via the spray UUID. The
// `fulltransparenticon` variant is the transparent-background PNG, right for dropping
// onto a banner. URLs verified reachable (200) on 2026-08-28.

const SPRAY_MEDIA_BASE = 'https://media.valorant-api.com/sprays';

// Neutral no-op title every account starts with (free tier is locked to this one).
// id 'none' is a Scope sentinel, not a Riot UUID — nothing renders when it's selected.
export const DEFAULT_TITLE_ID = 'none';

export const PLAYER_TITLES = [
  { id: "1b4e3bf6-4850-3d9b-a02e-8182caf29b76", names: { en: ":3 Title", fr: "Titre :3", de: "Titel „:3“", es: "Título :3", it: "Titolo :3", pt: "Título :3" } },
  { id: "21054634-428a-ec43-e5b7-e99888f137e7", names: { en: "<3 Title", fr: "Titre <3", de: "Titel „<3“", es: "Título <3", it: "Titolo <3", pt: "Título <3" } },
  { id: "1ba98f24-4989-8778-f8a6-b7af353a1625", names: { en: "2021 VCT Champion Title", fr: "Titre Champion du VCT 2021", de: "Titel „VCT Champion 2021“", es: "Título Campeón del VCT 2021", it: "Titolo Campione del VCT 2021", pt: "Título Campeão do VCT 2021" } },
  { id: "a5d0a0db-47cf-d1c4-c441-2db1688457c8", names: { en: "2023 Game Changers Winner Title", fr: "Titre Vainqueur des Game Changers 2023", de: "Titel „Game Changers-Siegerin 2023“", es: "Título Ganadoras del Game Changers 2023", it: "Titolo Vincitrice Game Changers 2023", pt: "Título Vencedora Game Changers 2023" } },
  { id: "370f6946-4e0d-2cbd-25c0-d6bec31db6fb", names: { en: "2025 Game Changers Winner Title", fr: "Titre Vainqueur des Game Changers 2025", de: "Titel „Game Changers-Siegerin 2025“", es: "Título Ganadoras del Game Changers 2025", it: "Titolo Vincitrice Game Changers 2025", pt: "Título Vencedora Game Changers 2025" } },
  { id: "737723fc-4f7e-9676-d2d1-46ae2ca8684c", names: { en: "5th Title", fr: "Titre 5e", de: "Titel „5.“", es: "Título 5.º", it: "Titolo 5º posto", pt: "Título 5º" } },
  { id: "96bbed0e-426e-2f54-8ce1-ff820ca6b703", names: { en: "All Star Title", fr: "Titre All-Star", de: "Titel „All Star“", es: "Título Estrella", it: "Titolo Stella", pt: "Título All Star" } },
  { id: "31ebd73d-4566-c82e-96de-59946848b87f", names: { en: "Ate Title", fr: "Titre Au top", de: "Titel „Gegessen“", es: "Título Devoré", it: "Titolo Vai e spacca", pt: "Título Arraso" } },
  { id: "22054dab-4c22-8c93-a196-0bbbbebd744f", names: { en: "Bakán Title", fr: "Titre Bakán", de: "Titel „Bakán“", es: "Título Bakán", it: "Titolo Bakán", pt: "Título Bakán" } },
  { id: "82de8a03-4ec9-0879-109b-1da4f2b3b1e6", names: { en: "Beard Papi Title", fr: "Titre Papy Barbu", de: "Titel „Papabär“", es: "Título Papi Barbudo", it: "Titolo Papi barbuto", pt: "Título Papi Barbudo" } },
  { id: "0fa48078-4978-cea8-c417-13972c5f981d", names: { en: "Big Brain Title", fr: "Titre Gros cerveau", de: "Titel „Superhirn“", es: "Título Mente privilegiada", it: "Titolo Cervellone", pt: "Título Genial" } },
  { id: "184e2e0d-4df5-2979-9bb0-93b102cf38fd", names: { en: "Boomer Title", fr: "Titre Boomer", de: "Titel „Boomer“", es: "Título Boomer", it: "Titolo Boomer", pt: "Título Tiozão" } },
  { id: "9e6f13d8-49f3-db30-76bd-e69a0dba963e", names: { en: "Bounty Hunter Title", fr: "Titre Chasseur de primes", de: "Titel „Kopfgeldjäger“", es: "Título Cazarrecompensas", it: "Titolo Cacciatrice di taglie", pt: "Título Caçador de Recompensas" } },
  { id: "9aa2218c-4b4c-492f-e37d-b69c1a7e8897", names: { en: "Cachando todo Title", fr: "Titre Cachando todo", de: "Titel „Cachando todo“", es: "Título Cachando todo", it: "Titolo Cachando todo", pt: "Título Cachando Todo" } },
  { id: "58e5f5db-4b18-cf8a-afa2-b49574b34456", names: { en: "Champion Title", fr: "Titre Champion", de: "Titel „Champion“", es: "Título Campeón", it: "Titolo Campione", pt: "Título Campeão" } },
  { id: "2d284b12-4536-1d0e-b08c-e58850b2a76e", names: { en: "Chicken Title", fr: "Titre Poulet", de: "Titel „Huhn“", es: "Título Gallina", it: "Titolo Pollo", pt: "Título Frango" } },
  { id: "08ac32fb-450a-34b8-4aef-d88e50ebd3cb", names: { en: "Clutch Title", fr: "Titre Clutch", de: "Titel „Clutch“", es: "Título Clutch", it: "Titolo Clutch", pt: "Título Clutch" } },
  { id: "899e7754-4c86-8c16-a94e-f2bb6c0d808f", names: { en: "Cooked Title", fr: "Titre Dans les choux", de: "Titel „Gekocht“", es: "Título Papilla", it: "Titolo Cotto", pt: "Título Frito" } },
  { id: "fc78400c-4356-c491-ab14-3dbb9e481073", names: { en: "Cupcake Title", fr: "Titre Cupcake", de: "Titel „Cupcake“", es: "Título Pastelito", it: "Titolo Cupcake", pt: "Título Cupcake" } },
  { id: "e4bdb590-4888-86aa-a259-bebdb52fcbe7", names: { en: "Deadeye Title", fr: "Titre Tireur d'élite", de: "Titel „Meisterschütze“", es: "Título Certero", it: "Titolo Tiratore scelto", pt: "Título Certeiro" } },
  { id: "1fcfb3b1-4e5d-1745-eb41-59b8bad3d48a", names: { en: "Different Title", fr: "Titre Différence", de: "Titel „Anders“", es: "Título Diferente", it: "Titolo Differente", pt: "Título Diferente" } },
  { id: "0a4f7e1d-4478-e4fb-1bab-518d005034db", names: { en: "Disruption Title", fr: "Titre Mutation", de: "Titel „Störung“", es: "Título Disrupción", it: "Titolo Disturbo", pt: "Título Disrupção" } },
  { id: "f6ebd3df-4a26-747d-fb89-d8a3155fa8c2", names: { en: "Dreamwing Evori Title", fr: "Titre Rêvaile Evori", de: "Titel „Evori-Traumschwinge“", es: "Título Dreamwing Evori", it: "Titolo Evori Ala sognante", pt: "Título Asas Oníricas de Evori" } },
  { id: "e3cac239-4020-5fed-c5b8-3fac2e145625", names: { en: "Duality Title", fr: "Titre Dualité", de: "Titel „Dualität“", es: "Título Dualidad", it: "Titolo Dualismo", pt: "Título Dualidade" } },
  { id: "86375046-4f22-9dc8-f8d8-b3b4d029cd4b", names: { en: "Empress Title", fr: "Titre Impératrice", de: "Titel „Hoheit“", es: "Título Emperatriz", it: "Titolo Imperatrice", pt: "Título Imperatriz" } },
  { id: "33a012ba-406f-adfb-13a6-21a70e02d631", names: { en: "Fam Title", fr: "Titre Fam", de: "Titel „Fam“", es: "Título Los panas", it: "Titolo Compare", pt: "Título Galera" } },
  { id: "6966d46b-4fd1-3287-fd00-a790c9e7a3d8", names: { en: "Fire Title", fr: "Titre Feu", de: "Titel „Feuer“", es: "Título Fuego", it: "Titolo Fuoco", pt: "Título Fogo" } },
  { id: "95cd86c0-4911-548c-ad76-98a4dfb3d55b", names: { en: "Flaming Steed Title", fr: "Titre Destrier enflammé", de: "Titel „Flammenross“", es: "Título Corcel flameante", it: "Titolo Destriero fiammeggiante", pt: "Título Corcel Flamejante" } },
  { id: "48d870a2-4493-ebf8-7d6f-979be914dc43", names: { en: "Fortune Title", fr: "Titre Fortune", de: "Titel „Glückskeks“", es: "Título Fortuna", it: "Titolo Fortuna", pt: "Título Fortuna" } },
  { id: "bf94d3eb-4025-4e4a-9942-a2a17c0da2db", names: { en: "Full Auto Title", fr: "Titre Tir automatique", de: "Titel „Dauerfeuer“", es: "Título Disparo automático", it: "Titolo Fuoco automatico", pt: "Título Senta o Dedo" } },
  { id: "d67cef9b-43cd-bc8c-840d-039582975c2a", names: { en: "Gamer Title", fr: "Titre Joueur", de: "Titel „Gamer“", es: "Título Gamer", it: "Titolo Gamer", pt: "Título Gamer" } },
  { id: "5cb4bd7b-4ebd-ddac-d8d2-1faf3ca19239", names: { en: "Gifted Title", fr: "Titre Gâté", de: "Titel „Beschenkt“", es: "Título Regalito", it: "Titolo Dotato", pt: "Título Presentão" } },
  { id: "810b90a3-4399-1f96-9e86-ce853c932156", names: { en: "Goinmul Title", fr: "Titre Goinmul", de: "Titel „Goinmul“", es: "Título Goinmul", it: "Titolo Goinmul", pt: "Título Goinmul" } },
  { id: "41c01df4-4d3d-d08d-58d4-e198763019f2", names: { en: "Guilty Title", fr: "Titre Coupable", de: "Titel „Schuldig“", es: "Título Culpable", it: "Titolo Colpevole", pt: "Título Culpado" } },
  { id: "574b3440-46bd-fee9-0735-12b4e8a55acd", names: { en: "Harbinger Title", fr: "Titre Héraut", de: "Titel „Vorbote“", es: "Título Heraldo", it: "Titolo Araldo", pt: "Título Precursor" } },
  { id: "24e2431e-45b4-ef91-e3f5-f19012522a70", names: { en: "Hasty Title", fr: "Titre Véloce", de: "Titel „Stürmer“", es: "Título Veloz", it: "Titolo Rapido", pt: "Título Apressado" } },
  { id: "9f294ab8-4b0a-4c3f-711c-cb89ca4d3ad5", names: { en: "High Class Title", fr: "Titre Classe", de: "Titel „Elite“", es: "Título De categoría", it: "Titolo Alta classe", pt: "Título Alta Classe" } },
  { id: "566b6a77-4f72-af35-6d17-43be14e73cb7", names: { en: "Hotshot Title", fr: "Titre As des as", de: "Titel „Teufelskerl“", es: "Título De primera", it: "Titolo Asso", pt: "Título Bonzão" } },
  { id: "18d5ee78-4a55-d1bb-205f-29ac410b5a7d", names: { en: "Icy Title", fr: "Titre Glacé", de: "Titel „Eisklotz“", es: "Título Escarcha", it: "Titolo Ghiacciato", pt: "Título Congelado" } },
  { id: "eab22308-45da-2059-c14f-44b4c52237b1", names: { en: "Infinite Title", fr: "Titre Infini", de: "Titel „Unendlichkeit“", es: "Título Infinito", it: "Titolo Infinito", pt: "Título Infinito" } },
  { id: "ed96f7bd-4eed-de28-8c93-40bd313a3157", names: { en: "Last Player Standing Title", fr: "Titre Dernier joueur en vie", de: "Titel „Letzter lebender Spieler“", es: "Título Solo queda un jugador", it: "Titolo Ultimo giocatore rimasto", pt: "Título Último Jogador Vivo" } },
  { id: "dd9b86b1-4661-1c98-65ac-c09b70a88e74", names: { en: "Locked In Title", fr: "Titre LOCK//IN", de: "Titel „Gefangen“", es: "Título Dentro del LOCK//IN", it: "Titolo Fan del LOCK//IN", pt: "Título Locked In" } },
  { id: "21dda67e-46d9-081d-0436-fc93fbb1331d", names: { en: "Lucky Title", fr: "Titre Veinard", de: "Titel „Glückspilz“", es: "Título Con suerte", it: "Titolo Fortuna sfacciata", pt: "Título Sortudo" } },
  { id: "5ec06bbb-4de3-1b76-3d29-d0916be5d9d4", names: { en: "Melting Title", fr: "Titre C'est trop", de: "Titel „Verknallt“", es: "Título Melting", it: "Titolo Piango", pt: "Título Adorável" } },
  { id: "22478fe7-4724-da26-cbbc-1d96134d2e93", names: { en: "Mischievous Title", fr: "Titre Espiègle", de: "Titel „Verschmitzt“", es: "Título Trasto", it: "Titolo Combinaguai", pt: "Título Travessura" } },
  { id: "229907f5-41a1-855d-a1f6-c1a934c74ed1", names: { en: "No Breaks Title", fr: "Titre Pas de pause", de: "Titel „Vollgas“", es: "Título Sin frenos", it: "Titolo Senza freni", pt: "Título Sem Freio" } },
  { id: "f3009eb7-4416-39e0-4b66-edb914c7f950", names: { en: "NPC Title", fr: "Titre PNJ", de: "Titel „NPC“", es: "Título PNJ", it: "Titolo PNG", pt: "Título NPC" } },
  { id: "98b7a8a1-4f7d-798c-7b1c-14b285c9c4d3", names: { en: "One More Title", fr: "Titre Encore un", de: "Titel „One More“", es: "Título Una más", it: "Titolo Ancora uno", pt: "Título One More" } },
  { id: "4840f0c5-48ce-5ffe-406e-9aa6049c4f4c", names: { en: "Overheating Title", fr: "Titre Surchauffe", de: "Titel „Hitzkopf“", es: "Título Sobrecalentamiento", it: "Titolo Surriscaldamento", pt: "Título Superaquecimento" } },
  { id: "2178d2e2-402a-4d13-47d2-f8bf096067a3", names: { en: "Polar Clutch Title", fr: "Titre Clutch polaire", de: "Titel „Polargriff“", es: "Título Clutch polar", it: "Titolo Clutch polare", pt: "Título Clutch Polar" } },
  { id: "302f332d-4a9a-1f2c-9331-779b338fdcc7", names: { en: "Premier Beta Title", fr: "Titre Bêta de Premier", de: "Titel „Premier-Beta“", es: "Título Beta de Premier", it: "Titolo Beta di Premier", pt: "Título Premier Beta" } },
  { id: "6c468c03-434f-c305-b947-4e900102a4e2", names: { en: "PREMIER E7A3 CHAMPION // INT TITLE", fr: "TITRE CHAMPION DE PREMIER É7A3 // INT", de: "TITEL „PREMIER-E7A3-CHAMPION // FRTG“", es: "TÍTULO CAMP. PREMIER E7A3 // INTM", it: "TITOLO CAMPIONE PREMIER E7A3 // INT", pt: "TÍTULO CAMPEÃO PREMIER E7A3 // INT" } },
  { id: "bad41af7-4d45-4fdf-50bf-8792def106fd", names: { en: "PREMIER E8A1 CHAMPION // ELT Title", fr: "Titre CHAMPION DE PREMIER É8A1 // ÉLT", de: "Titel „PREMIER-E8A1-CHAMPION // ELT“", es: "Título CAMP. PREMIER E8A1 // ÉLT", it: "Titolo CAMPIONE PREMIER E8A1 // ÉLT", pt: "Título CAMPEÃO PREMIER E8A1 // ELT" } },
  { id: "32abb0ba-4ef4-7934-9766-a5a7185e1456", names: { en: "PREMIER E8A2 CHAMPION // CTD Title", fr: "Titre CHAMPION DE PREMIER É8A2 // CCR", de: "Titel „PREMIER-E8A2-CHAMPION // KNDT“", es: "Título CAMP. PREMIER E8A2 // CNTD", it: "Titolo CAMPIONE PREMIER E8A2 // SFD", pt: "Título CAMPEÃO PREMIER E8A2 // DES" } },
  { id: "ab11b87e-46c1-69a6-b857-dfb9b7b1c22b", names: { en: "PREMIER E8A3 CHAMPION // ADV Title", fr: "Titre CHAMPION DE PREMIER É8A3 // AVN", de: "Titel „PREMIER-E8A3-CHAMPION // PRF“", es: "Título CAMP. PREMIER E8A3 // AVNZ", it: "Titolo CAMPIONE PREMIER E8A3 // AVZ", pt: "Título CAMPEÃO E8A3 PREMIER // AV" } },
  { id: "01f5d936-4e0d-f9f3-dcee-16a46f822729", names: { en: "PREMIER E8A3 CHAMPION // OPN Title", fr: "Titre CHAMPION DE PREMIER É8A3 // OUV", de: "Titel „PREMIER-E8A3-CHAMPION // OFFN“", es: "Título CAMP. PREMIER E8A3 // ABRT", it: "Titolo CAMPIONE PREMIER E8A3 // APR", pt: "Título CAMPEÃO E8A3 PREMIER // ABR" } },
  { id: "ed115f7e-4ee8-c74f-a9ff-54bc27efa666", names: { en: "PREMIER E9A1 CHAMPION // INT Title", fr: "Titre CHAMPION DE PREMIER É9A1 // INT", de: "Titel „PREMIER E9A1 CHAMPION // FRTG“", es: "Título CAMP. PREMIER E9A1 // INTM", it: "Titolo CAMPIONE PREMIER E9A1 // INT", pt: "Título CAMPEÃO PREMIER E9A1 // INT" } },
  { id: "50947289-4ef9-5c46-3380-89b5cf89c22f", names: { en: "PREMIER E9A2 CHAMPION // CTD Title", fr: "Titre CHAMPION DE PREMIER É9A2 // CCR", de: "Titel „PREMIER E9A2 CHAMPION // KNDT“", es: "Título CAMP. PREMIER E9A2 // CNTD", it: "Titolo CAMPIONE PREMIER E9A2 // SFD", pt: "Título CAMPEÃO PREMIER E9A2 // DES" } },
  { id: "37895482-439c-6beb-0dbd-d09d6376545f", names: { en: "PREMIER E9A2 GRAND CHAMP Title", fr: "Titre GRAND CHAMPION DE PREMIER É9A2", de: "Titel „PREMIER E9A2 GROSSMEISTER“", es: "Título GRAN CAMP. PREMIER E9A2", it: "Titolo CAMPIONE ASSOLUTO PREMIER E9A2", pt: "Título GRANDE CAMPEÃO PREMIER E9A2" } },
  { id: "2776b715-4c89-e210-5f01-448784413eee", names: { en: "PREMIER E9A3 CHAMPION // INT Title", fr: "Titre CHAMPION DE PREMIER É9A3 // INT", de: "Titel „PREMIER E9A3 CHAMPION // FRTG“", es: "Título CAMP. PREMIER E9A3 // INTM", it: "Titolo CAMPIONE PREMIER E9A3 // INT", pt: "Título CAMPEÃO PREMIER E9A3 // INT" } },
  { id: "580557bc-43da-8548-741a-34a0da3785bd", names: { en: "PREMIER LAUNCH CHAMPION // ADV TITLE", fr: "TITRE CHAMP. LANCEMENT PREMIER /AVN", de: "TITEL „PREMIER-VERÖFF.-CHAMPION // PRF“", es: "TÍTULO CAMP. LANZAMIENTO PREMIER // AVNZ", it: "TITOLO CAMPIONE LANCIO PREMIER // AVZ", pt: "TÍTULO CAMPEÃO LANÇ. PREMIER // AV" } },
  { id: "2fbbc891-44cd-b604-e35a-f9ae5436ab76", names: { en: "PREMIER LAUNCH CHAMPION // OPN TITLE", fr: "TITRE CHAMP. LANCEMENT PREMIER /OUV", de: "TITEL „PREMIER-VERÖFF.-CHAMPION // OFFN“", es: "TÍTULO CAMP. LANZAMIENTO PREMIER // ABRT", it: "TITOLO CAMPIONE LANCIO PREMIER // APR", pt: "TÍTULO CAMPEÃO LANÇ. PREMIER // ABR" } },
  { id: "2df88072-4191-2baa-ad15-cbb6a9ceee61", names: { en: "PREMIER V25A1 CHAMPION // INT Title", fr: "Titre CHAMPION DE PREMIER V25A1 // INT", de: "Titel „PREMIER V25A1 CHAMPION // FRTG“", es: "Título CAMP. PREMIER V25A1 // INTM", it: "Titolo CAMPIONE PREMIER V25A1 // INT", pt: "Título CAMPEÃO PREMIER V25A1 // INT" } },
  { id: "b716a7be-44ed-4bf3-73b3-f08da1683ec2", names: { en: "PREMIER V25A2 CHAMPION // CTD Title", fr: "Titre CHAMPION DE PREMIER V25A2 // CCR", de: "Titel „PREMIER V25A2 CHAMPION // KNDT“", es: "Título CAMP. PREMIER V25A2 // CNTD", it: "Titolo CAMPIONE PREMIER V25A2 // SFD", pt: "Título CAMPEÃO PREMIER V25A2 // DES" } },
  { id: "e5dce9d2-4731-64af-0f19-d1be5a5c19d4", names: { en: "PREMIER V25A2 GRAND CHAMP Title", fr: "Titre GRAND CHAMPION DE PREMIER V25A2", de: "Titel „PREMIER V25A2 GROSSMEISTER“", es: "Título GRAN CAMP. PREMIER V25A2", it: "Titolo CAMPIONE ASSOLUTO PREMIER V25A2", pt: "Título GRANDE CAMPEÃO PREMIER V25A2" } },
  { id: "b76feb24-427f-5910-f9e3-0bb63d5787ff", names: { en: "PREMIER V25A3 CHAMPION // INT Title", fr: "Titre CHAMPION DE PREMIER V25A3 // INT", de: "Titel „PREMIER V25A3 CHAMPION // FRTG“", es: "Título CAMP. PREMIER V25A3 // INTM", it: "Titolo CAMPIONE PREMIER V25A3 // INT", pt: "Título CAMPEÃO PREMIER V25A3 // INT" } },
  { id: "a6ae9185-42a9-8a0b-7ce5-aaa4ca05eaca", names: { en: "PREMIER V25A4 CHAMPION // CTD Title", fr: "Titre CHAMPION DE PREMIER V25A4 // CCR", de: "Titel „PREMIER V25A4 CHAMPION // KNDT“", es: "Título CAMP. PREMIER V25A4 // CNTD", it: "Titolo CAMPIONE PREMIER V25A4 // SFD", pt: "Título CAMPEÃO PREMIER V25A4 // DES" } },
  { id: "7aa25edc-45a1-98d6-5201-e9aa17b93f27", names: { en: "PREMIER V25A4 GRAND CHAMP Title", fr: "Titre GRAND CHAMPION DE PREMIER V25A4", de: "Titel „PREMIER V25A4 GROSSMEISTER“", es: "Título GRAN CAMP. PREMIER V25A4", it: "Titolo CAMPIONE ASSOLUTO PREMIER V25A4", pt: "Título GRANDE CAMPEÃO PREMIER V25A4" } },
  { id: "6cb52604-468c-a15d-f0ca-04912d3d9066", names: { en: "PREMIER V25A5 CHAMPION // INT Title", fr: "Titre CHAMPION DE PREMIER V25A5 // INT", de: "Titel „PREMIER V25A5 CHAMPION // FRTG“", es: "Título CAMP. PREMIER V25A5 // INTM", it: "Titolo CAMPIONE PREMIER V25A5 // INT", pt: "Título CAMPEÃO PREMIER V25A5 // INT" } },
  { id: "674d62cf-4cfc-6b04-868e-7885ed44c02c", names: { en: "PREMIER V25A6 CHAMPION // CTD Title", fr: "Titre CHAMPION DE PREMIER V25A6 // CCR", de: "Titel „PREMIER V25A6 CHAMPION // KNDT“", es: "Título CAMP. PREMIER V25A6 // CNTD", it: "Titolo CAMPIONE PREMIER V25A6 // SFD", pt: "Título CAMPEÃO PREMIER V25A6 // DES" } },
  { id: "c3a4c3f3-4b9e-6938-b4b7-8fb2a5fa946b", names: { en: "PREMIER V25A6 GRAND CHAMP Title", fr: "Titre GRAND CHAMPION DE PREMIER V25A6", de: "Titel „PREMIER V25A6 GROSSMEISTER“", es: "Título GRAN CAMP. PREMIER V25A6", it: "Titolo CAMPIONE ASSOLUTO PREMIER V25A6", pt: "Título GRANDE CAMPEÃO PREMIER V25A6" } },
  { id: "9e68fb44-4269-ead6-3dc4-b89bcb63b5ea", names: { en: "PREMIER V26A1 CHAMPION // INT Title", fr: "Titre CHAMPION DE PREMIER V26A1 // INT", de: "Titel „PREMIER V26A1 CHAMPION // FRTG“", es: "Título CAMP. PREMIER V26A1 // INTM", it: "Titolo CAMPIONE PREMIER V26A1 // INT", pt: "Título CAMPEÃO PREMIER V26A1 // INT" } },
  { id: "2d32e67a-470e-9b19-ffba-018657c3310c", names: { en: "PREMIER V26A2 CHAMPION // CTD Title", fr: "Titre CHAMPION DE PREMIER V26A2 // CCR", de: "Titel „PREMIER V26A2 CHAMPION // KNDT“", es: "Título CAMP. PREMIER V26A2 // CNTD", it: "Titolo CAMPIONE PREMIER V26A2 // SFD", pt: "Título CAMPEÃO PREMIER V26A2 // DES" } },
  { id: "1915040f-4494-d472-9034-3c98f200696e", names: { en: "PREMIER V26A2 GRAND CHAMP Title", fr: "Titre GRAND CHAMPION DE PREMIER V26A2", de: "Titel „PREMIER V26A2 GROSSMEISTER“", es: "Título GRAN CAMP. PREMIER V26A2", it: "Titolo CAMPIONE ASSOLUTO PREMIER V26A2", pt: "Título GRANDE CAMPEÃO PREMIER V26A2" } },
  { id: "fa934387-4ba1-ead8-0b11-89b8413d3721", names: { en: "PREMIER V26A3 CHAMPION // INT Title", fr: "Titre CHAMPION DE PREMIER V26A3 // INT", de: "Titel „PREMIER V26A3 CHAMPION // FRTG“", es: "Título CAMP. PREMIER V26A3 // INTM", it: "Titolo CAMPIONE PREMIER V26A3 // INT", pt: "Título CAMPEÃO PREMIER V26A3 // INT" } },
  { id: "cf91e843-4c68-c3e4-e4f3-61842e844fa3", names: { en: "PREMIER V26A4 CHAMPION // CTD Title", fr: "Titre CHAMPION DE PREMIER V26A4 // CCR", de: "Titel „PREMIER V26A4 CHAMPION // KNDT“", es: "Título CAMP. PREMIER V26A4 // CNTD", it: "Titolo CAMPIONE PREMIER V26A4 // SFD", pt: "Título CAMPEÃO PREMIER V26A4 // DES" } },
  { id: "7f9fca41-443e-db60-871b-2796c1b1e5a0", names: { en: "PREMIER V26A4 GRAND CHAMP Title", fr: "Titre GRAND CHAMPION DE PREMIER V26A4", de: "Titel „PREMIER V26A4 GROSSMEISTER“", es: "Título GRAN CAMP. PREMIER V26A4", it: "Titolo CAMPIONE ASSOLUTO PREMIER V26A4", pt: "Título GRANDE CAMPEÃO PREMIER V26A4" } },
  { id: "c70f542b-4880-c65f-485e-ec8ffd055243", names: { en: "Proud Title", fr: "Titre Fierté", de: "Titel „Pride“", es: "Título Con orgullo", it: "Titolo Orgoglioso", pt: "Título Orgulho" } },
  { id: "abb03247-4478-1b95-50b3-648f4338aca9", names: { en: "Rawr Title", fr: "Titre Rawr", de: "Titel „Grrrrrrr“", es: "Título Grrr", it: "Titolo Grrr", pt: "Título Rawr" } },
  { id: "e23eaf20-4fb2-5c01-03b0-4fa7f14fbfbd", names: { en: "Revenant Title", fr: "Titre Revenant", de: "Titel „Wiedergänger“", es: "Título Aparición", it: "Titolo Redivivo", pt: "Título Revenã" } },
  { id: "1df241bc-4714-0a82-3dcc-a590431a3b5a", names: { en: "Rubbish Title", fr: "Titre N'imp", de: "Titel „Müll“", es: "Título Basura", it: "Titolo Rifiuto", pt: "Título Lixinho" } },
  { id: "25b17fb8-4818-08ab-e5da-a384dd6d4d8f", names: { en: "Serpent Title", fr: "Titre Serpent", de: "Titel „Schlange“", es: "Título Serpiente", it: "Titolo Serpente", pt: "Título Serpente" } },
  { id: "8198f12e-4899-0f25-8319-cbad87d9097b", names: { en: "Six Seven Title", fr: "Titre Six sept", de: "Titel „6 7“", es: "Título Seis, siete", it: "Titolo Six-Seven", pt: "Título Meia Sete" } },
  { id: "7009989e-447a-e5ec-fc57-39bd139a183c", names: { en: "Skirmish Legend Title", fr: "Titre Légende d'Escarmouche", de: "Titel „Skirmish-Legende“", es: "Título Leyenda de Escaramuza", it: "Titolo Leggenda di Schermaglia", pt: "Título Lenda do Duelo" } },
  { id: "5dc79611-42f8-24ad-9f5d-6d8288a7fe9a", names: { en: "Spicy Title", fr: "Titre Chaud bouillant", de: "Titel „Scharfes Teil“", es: "Título Picante", it: "Titolo Piccante", pt: "Título Picante" } },
  { id: "e5fc10fa-4e21-215f-962e-f799b321efcd", names: { en: "Stylish Title", fr: "Titre Stylé", de: "Titel „Stylish“", es: "Título Con estilo", it: "Titolo Trendy", pt: "Título Drip" } },
  { id: "fb1214b2-403a-4a9d-a6e6-1d90180b3307", names: { en: "Superstar Title", fr: "Titre Superstar", de: "Titel „Superstar“", es: "Título Superestrella", it: "Titolo Superstar", pt: "Título Celebridade" } },
  { id: "9f0ead27-4925-db1e-626f-ab95d9c45845", names: { en: "Team Player Title", fr: "Titre Esprit d'équipe", de: "Titel „Team-Spieler“", es: "Título Juego en equipo", it: "Titolo Giocatore di squadra", pt: "Título Colaborativo" } },
  { id: "9fbec649-47d4-e7d3-579e-2e924ad1743f", names: { en: "Thirsty Title", fr: "Titre Assoiffé", de: "Titel „Ausgetrocknet“", es: "Título Sed", it: "Titolo Assetato", pt: "Título Com Sede" } },
  { id: "189f8454-45f8-0a74-4b25-77aae468ac02", names: { en: "Trailblazer Title", fr: "Titre Éclaireur", de: "Titel „Bahnbrecher“", es: "Título Precursor", it: "Titolo Apripista", pt: "Título Predador Explosivo" } },
  { id: "19b138cf-4137-692c-c6ec-be9da98109be", names: { en: "Unc Title", fr: "Titre Unc", de: "Titel „Unc“", es: "Título Viejales", it: "Titolo Zio", pt: "Título Tio do Pavê" } },
  { id: "336516ab-475b-7e0c-74d1-9caaa4d580ac", names: { en: "Unmasked Title", fr: "Titre Démasqué", de: "Titel „Demaskiert“", es: "Título Desenmascarado", it: "Titolo Rivelazione", pt: "Título Desmascarado" } },
  { id: "0053beda-44f4-47f0-3ec5-68a20f7a0505", names: { en: "Unrated Title", fr: "Titre Non classé", de: "Titel „Ungewertet“", es: "Título Sin clasificar", it: "Titolo Non competitivo", pt: "Título Sem Classificação" } },
  { id: "89a407d7-4736-a86e-bc53-c98ec8aadf6d", names: { en: "Untouchable Title", fr: "Titre Intouchable", de: "Titel „Unantastbar“", es: "Título Intocable", it: "Titolo Intoccabile", pt: "Título Intocável" } },
  { id: "d11e42f8-45e9-7d71-720b-8c9c54c3b808", names: { en: "VCT Game Changer Title", fr: "Titre VCT Game Changer", de: "Titel „VCT Game Changer“", es: "Título VCT Game Changer", it: "Titolo VCT Game Changer", pt: "Título VCT Game Changer" } },
  { id: "75aaadc3-427a-e194-e8d0-fd8b76b4540f", names: { en: "VCT Masters Copenhagen Winner Title", fr: "Titre Vainq. VCT Masters Copenhague", de: "Titel „Sieger des VCT Masters Kopenhagen“", es: "Título Ganador del VCT Masters Copenhagen", it: "Titolo Vincitore VCT Masters Copenaghen", pt: "Vencedor VCT Masters Copenhagen" } },
  { id: "36313c61-4cc9-fddf-2944-03aec213e509", names: { en: "VCT Masters Santiago Winner Title", fr: "Titre Vainqueur VCT Masters Santiago", de: "Titel „Sieger des VCT Masters Santiago“", es: "Título Ganador del VCT Masters Santiago", it: "Titolo Vincitore VCT Masters Santiago", pt: "Título Vencedor VCT Masters Santiago" } },
  { id: "e79d9585-4ea7-f8f1-3d4e-31a1e2c71577", names: { en: "Vibin' Title", fr: "Titre Dans la vibe", de: "Titel „Entspannen“", es: "Título De chill", it: "Titolo Senza pensieri", pt: "Título De Boas" } },
  { id: "bec998ee-416d-ba4a-8afb-a4ba38c9e228", names: { en: "Watchdog Title", fr: "Titre Chien de garde", de: "Titel „Wachhund“", es: "Título Vigía", it: "Titolo Cane da guardia", pt: "Título Cão de Guarda" } },
  { id: "ae12f316-4d71-564e-ac02-57bf8df83335", names: { en: "WNGMN Title", fr: "Titre ALTG", de: "Titel „WNGMN“", es: "Título WNGMN", it: "Titolo WNGMN", pt: "Título WNGMN" } },
  { id: "77b12d01-4209-6b61-16aa-23a7382ae17b", names: { en: "Year One Title", fr: "Titre Année 1", de: "Titel „Jahr Eins“", es: "Título Año uno", it: "Titolo Primo anno", pt: "Título Ano Um" } },
  { id: "8fd54857-406f-a9e7-e700-80aa8f0f3467", names: { en: "β Title", fr: "Titre β", de: "Titel „β“", es: "Título β", it: "Titolo β", pt: "Título β" } },
];

export const SPRAYS = [
  { id: "7e2ba2e8-4597-060a-b41e-81acedca414e", names: { en: "Abilities Don't Kill Spray", fr: "Graffiti Les compétences ne tuent pas", de: "Graffiti „Fähigkeiten töten nicht“", es: "Grafiti Las habilidades no matan", it: "Spray Le abilità non uccidono", pt: "Spray Manda Mais Que Tá Pouco" } },
  { id: "43341e92-451f-c194-b4f6-0b926bdc3643", names: { en: "Thumbs Up Spray", fr: "Graffiti Pouce levé", de: "Graffiti „Daumen hoch“", es: "Grafiti Me gusta", it: "Spray Mi piace!", pt: "Spray Joinha" } },
  { id: "f20b1abe-478b-9a51-590c-30b08181fd79", names: { en: "Radianite Hazard Spray", fr: "Graffiti Danger : radianite", de: "Graffiti „Radianit-Gefahr“", es: "Grafiti Radianita peligrosa", it: "Spray Pericolo Radianite", pt: "Spray Perigo: Radianita" } },
  { id: "ed3208ac-454a-43a0-e77a-6e83328ddf0c", names: { en: "Bunny Hop Spray", fr: "Graffiti Saut de lapin", de: "Graffiti „Bunny Hop“", es: "Grafiti Saltando cual conejo", it: "Spray Bunny hopping", pt: "Spray Pula-Pula" } },
  { id: "2df9762d-452d-0c80-d1f3-12aa8f6ebcf3", names: { en: "Clutch or Kick Spray", fr: "Graffiti Clutch ou ça va barder", de: "Graffiti „Knapp oder Abgefahren“", es: "Grafiti Remontada o patada", it: "Spray Vinci o sei fuori", pt: "Spray Clutch ou Vaza" } },
  { id: "6550c96f-491d-7e4c-e923-84bf433d0b3f", names: { en: "Shock Heart Spray", fr: "Graffiti En plein cœurs", de: "Graffiti „Schockherz“", es: "Grafiti Corazón eléctrico", it: "Spray Dardo galante", pt: "Spray Coração Eletrizado" } },
  { id: "65e1df93-41ac-b192-d791-3382491f58cc", names: { en: "Gotta One Tap Spray", fr: "Graffiti Une balle, un mort", de: "Graffiti „Ein Schuss reicht“", es: "Grafiti De un toque", it: "Spray Un colpo mi basta", pt: "Spray Última Bala" } },
  { id: "67481014-423a-3175-4f5e-d0ba9422f887", names: { en: "Party's Here Spray", fr: "Graffiti Que la fête commence", de: "Graffiti „Partymuffel“", es: "Grafiti Aquí hay jarana", it: "Spray La festa è arrivata", pt: "Spray Vai Rolar a Festa" } },
  { id: "2d9be381-4686-b392-310e-8bb2a6707f7e", names: { en: "Pity Party Spray", fr: "Graffiti Apitoiement", de: "Graffiti „Arm dran“", es: "Grafiti Qué pena", it: "Spray Commiserazione", pt: "Spray Acordes de Dó" } },
  { id: "7e85d0ab-4cc5-d869-5485-798aae7e8656", names: { en: "Hot Seat Spray", fr: "Graffiti Siège en flammes", de: "Graffiti „Heißer Stuhl“", es: "Grafiti Calentando la silla", it: "Spray Poltrona che scotta", pt: "Spray Cadeira Chamuscante" } },
  { id: "fe86a4c5-4e92-324b-4c0d-a7a837d0d548", names: { en: "Cans On Spray", fr: "Graffiti À tue-tête", de: "Graffiti „Kopfhörer auf“", es: "Grafiti Cascos puestos", it: "Spray Cuffie", pt: "Spray Coloca o Fone" } },
  { id: "67af5786-4cb7-f2d7-07c6-0d874ffff5ce", names: { en: "Pixel TactiBunny Spray", fr: "Graffiti Lapin tueur en pixels", de: "Graffiti „Pixel-Taktihäschen“", es: "Grafiti Conejo tactinejo pixelado", it: "Spray Tatticoniglio pixellato", pt: "Spray Agente Coelhoso Pixelado" } },
  { id: "0dc378e3-4936-7c9f-a1ba-fd90999b3a10", names: { en: "A Prime Valentine's Gift Spray", fr: "Graffiti Cadeau de Saint-Valentin", de: "Graffiti „Ein Prime-tastisches Valentinsgeschenk“", es: "Grafiti Un excelente regalo de San Valentín", it: "Spray Regalo di San Valentino romantico", pt: "Spray Presentão de Namoro" } },
  { id: "47700b6e-439a-5a71-8b8c-c1bb0ec9a4a9", names: { en: "Party of 1 Spray", fr: "Graffiti Groupe de 1", de: "Graffiti „Zeit allein“", es: "Grafiti Mesa para uno", it: "Spray Gruppo da 1", pt: "Spray Mesa pra Um" } },
];

function localized(entry, lang) {
  return entry.names[lang] ?? entry.names.en;
}

// Free accounts can only ever be on DEFAULT_TITLE_ID; Scope+ unlocks the full list.
// Kept sorted by the English name for a browsable dropdown, matching how the data was
// curated.
export function getAllPlayerTitles(lang) {
  return PLAYER_TITLES.map((tt) => ({ id: tt.id, label: localized(tt, lang) }));
}

export function getPlayerTitleLabel(id, lang) {
  if (!id || id === DEFAULT_TITLE_ID) return null;
  const found = PLAYER_TITLES.find((tt) => tt.id === id);
  return found ? localized(found, lang) : null;
}

export function getAllSprays(lang) {
  return SPRAYS.map((sp) => ({
    id: sp.id,
    label: localized(sp, lang),
    icon: `${SPRAY_MEDIA_BASE}/${sp.id}/fulltransparenticon.png`,
  }));
}

export function getSprayIcon(id) {
  if (!id) return undefined;
  const found = SPRAYS.find((sp) => sp.id === id);
  return found ? `${SPRAY_MEDIA_BASE}/${found.id}/fulltransparenticon.png` : undefined;
}
