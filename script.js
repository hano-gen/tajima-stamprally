        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        // Region Data
        const regions = {
            toyooka: {
                name: '豊岡地域',
                center: { lat: 35.5456, lng: 134.8203 },
                icon: '🏢'
            },
            izushi: {
                name: '出石地域',
                center: { lat: 35.4621, lng: 134.8743 },
                icon: '🏯'
            },
            kinosaki: {
                name: '城崎地域',
                center: { lat: 35.6267, lng: 134.8007 },
                icon: '♨️'
            },
            tanto: {
                name: '但東地域',
                center: { lat: 35.4833, lng: 134.9833 },
                icon: '🌸'
            },
            hidaka: {
                name: '日高地域',
                center: { lat: 35.5167, lng: 134.7333 },
                icon: '⛷️'
            },
            takeno: {
                name: '竹野地域',
                center: { lat: 35.6333, lng: 134.7167 },
                icon: '🏖️'
            }
        };

        // POI Data (existing tourist spots with extended information)
        window.POIS = [
            {
                id: "izushi-castle",
                name: "出石城跡",
                lat: 35.46059,
                lng: 134.87461,
                radius_m: 50,
                description: "但馬の小京都を見下ろす城跡",
                detailedDescription: "慶長9年に小出吉英によって築かれた城。現在は石垣と櫓が残り、桜の名所としても知られています。",
                category: "culture",
                region: "izushi",
                points: 1,
                accessInfo: "JR豊岡駅からバスで30分、出石営業所下車徒歩10分",
                openingHours: "24時間見学可能",
                highlights: ["歴史", "城跡", "桜", "眺望"],
                address: "〒668-0214 兵庫県豊岡市出石町内町",
                mapLink: "https://maps.app.goo.gl/rjvib5be2Y8pm2D9A",
                stampimageURL: "./images/joseki_stamp.png",
                imageURL: "./images/joseki.jpg"
            },
            {
                id: "shinkoro",
                name: "辰鼓楼",
                lat: 35.46215626,
                lng: 134.87431924,
                radius_m: 50,
                description: "出石の代名詞と呼べる建築物",
                detailedDescription: "明治4年に建てられた時計台。出石のシンボルとして親しまれており、現在も正確な時を刻み続けています。",
                category: "culture",
                region: "izushi",
                points: 1,
                accessInfo: "JR豊岡駅からバスで30分、出石営業所下車徒歩5分",
                openingHours: "24時間見学可能",
                highlights: ["歴史", "建築", "シンボル", "写真撮影"],
                address: "〒668-0214 兵庫県豊岡市出石町内町",
                mapLink: "https://maps.app.goo.gl/2w9A7dghPr519Ajt9",
                stampimageURL: "./images/shinkoro_stamp.png",
                imageURL: "./images/"

            },
            {
                id: "eirakukan",
                name: "出石永楽館",
                lat: 35.461953,
                lng: 134.871503,
                radius_m: 50,
                description: "明治時代に建てられた芝居小屋",
                detailedDescription: "明治34年に建てられた近畿最古の芝居小屋。現在も歌舞伎や落語などの公演が行われています。",
                category: "culture",
                region: "izushi",
                points: 1,
                accessInfo: "JR豊岡駅からバスで30分、出石営業所下車徒歩5分",
                openingHours: "公演により異なる",
                highlights: ["歴史", "芸能", "建築", "文化"],
                address: "〒668-0214 兵庫県豊岡市出石町柳17-2",
                mapLink: "https://maps.app.goo.gl/4KVAbEH2a8eGxmSAA",
                stampimageURL: "./images/eirakukan_stamp.png",
                imageURL: "./images/"
            },
            {
                id: "karoyashiki",
                name: "家老屋敷",
                lat: 35.46190,
                lng: 134.87319,
                radius_m: 50,
                description: "江戸時代の武家屋敷",
                detailedDescription: "出石藩の家老屋敷として使われていた建物。当時の武家の生活を垣間見ることができます。",
                category: "culture",
                region: "izushi",
                points: 2,
                accessInfo: "JR豊岡駅からバスで30分、出石営業所下車徒歩8分",
                openingHours: "9:30-17:00（入館は16:30まで）",
                highlights: ["歴史", "武家屋敷", "文化", "建築"],
                address: "〒668-0214 兵庫県豊岡市出石町内町",
                mapLink: "https://maps.app.goo.gl/example",
                stampimageURL: "./images/karoyashiki_stamp.png",
                imageURL: "./images/"
            },
            {
                id: "meijikan",
                name: "出石明治館",
                lat: 35.46211,
                lng: 134.876885,
                radius_m: 50,
                description: "明治時代の洋風建築",
                detailedDescription: "明治20年に郡役所として建てられた洋風建築。現在は観光案内所として利用されています。",
                category: "culture",
                region: "izushi",
                points: 2,
                accessInfo: "JR豊岡駅からバスで30分、出石営業所下車徒歩3分",
                openingHours: "9:00-17:00",
                highlights: ["明治建築", "洋風", "歴史", "観光案内"],
                address: "〒668-0214 兵庫県豊岡市出石町内町",
                mapLink: "https://maps.app.goo.gl/uqXLP2SFSwAEr4MH6",
                stampimageURL: "./images/meijikan_stamp.png",
                imageURL: "./images/"
            },
            {
                id: "kinosaki-onsen",
                name: "城崎温泉",
                lat: 35.62388838,
                lng: 134.8131944,
                radius_m: 1000,
                description: "風情豊かな温泉街",
                detailedDescription: "風情豊かな温泉街で、7つの外湯めぐりが楽しめる。木造の情緒ある街並みを浴衣でそぞろ歩き、足湯や川沿いの風景、グルメも満喫。",
                category: "spring",
                region: "kinosaki",
                points: 1,
                accessInfo: "JR城崎温泉駅下車すぐ",
                openingHours: "外湯により異なる",
                highlights: ["温泉", "外湯めぐり", "浴衣", "風情"],
                address: "〒669-6103 兵庫県豊岡市城崎町今津283",
                mapLink: "https://maps.app.goo.gl/D1zRR89spAfvSxs49",
                stampimageURL: "/placeholder.svg?height=80&width=80",
                imageURL: "./images/"
            },
            {
                id: "marineworld",
                name: "城崎マリンワールド",
                lat: 35.65557026,
                lng: 134.8246191,
                radius_m: 100,
                description: "日本海を望む水族館",
                detailedDescription: "日本海を望む水族館。イルカやアシカのショー、ペンギン散歩、海中トンネルでのダイナミックな魚たちの観察、体験型のタッチプールが魅力。",
                category: "sea",
                region: "kinosaki",
                points: 1,
                accessInfo: "全但バス 日和山（マリンワールド）バス停で下車すぐ",
                openingHours: "9時30分〜16時30分",
                highlights: ["水族館", "イルカショー", "海の生き物", "体験"],
                address: "〒669-6192 兵庫県豊岡市瀬戸1090番地",
                mapLink: "https://maps.app.goo.gl/L2hnjNS7Yqf1pDHd8",
                stampimageURL: "/placeholder.svg?height=80&width=80",
                imageURL: "./images/"
            },
            {
                id: "bungeikan",
                name: "城崎文芸館",
                lat: 35.62530315,
                lng: 134.8106886,
                radius_m: 50,
                description: "城崎温泉ゆかりの作家に関する展示を行う施設",
                detailedDescription: "城崎温泉街の中心地にあり、城崎温泉ゆかりの作家に関する展示を行っている施設。1996年に開館し、2016年に展示内容をリニューアルしました。",
                category: "art",
                region: "kinosaki",
                points: 3,
                accessInfo: "JR城崎温泉駅より徒歩5分",
                openingHours: "9時00分〜17時00分　水曜日 定休日",
                highlights: ["文学", "作家", "展示", "文化"],
                address: "〒669-6101 兵庫県豊岡市城崎町湯島357-1",
                mapLink: "https://maps.app.goo.gl/oDHWqkqWdKr9u6SN8",
                stampimageURL: "/placeholder.svg?height=80&width=80",
                imageURL: "./images/"
            },
            {
                id: "gokurakuji",
                name: "極楽寺",
                lat: 35.62390352,
                lng: 134.805332,
                radius_m: 50,
                description: "城崎温泉郷の静かな寺院",
                detailedDescription: "城崎温泉郷の西南に位置する「極楽寺」は、1394年頃に金山明昶禅師によって創建され、阿弥陀如来を本尊とする静かな寺院です。",
                category: "temple",
                region: "kinosaki",
                points: 3,
                accessInfo: "JR城崎温泉駅より徒歩15分",
                openingHours: "8時00分〜17時00分",
                highlights: ["寺院", "禅宗", "石庭", "静寂"],
                address: "〒669-6101 兵庫県豊岡市城崎町湯島８０１",
                mapLink: "https://maps.app.goo.gl/HYU4VganVAzMqDjL9",
                stampimageURL: "/placeholder.svg?height=80&width=80",
                imageURL: "./images/"
            },
            {
                id: "toyooka-city",
                name: "豊岡市役所",
                lat: 35.54458027614293,
                lng: 134.82019192955596,
                radius_m: 100,
                description: "豊岡市の中心施設",
                detailedDescription: "豊岡市の行政の中心となる市役所。現代的な建築が特徴です。",
                category: "culture",
                region: "toyooka",
                points: 1,
                accessInfo: "JR豊岡駅から徒歩10分",
                openingHours: "8:30-17:15（平日のみ）",
                highlights: ["行政", "建築", "中心地"],
                address: "〒668-8666 兵庫県豊岡市中央町2-4",
                mapLink: "https://maps.app.goo.gl/example",
                stampimageURL: "/placeholder.svg?height=80&width=80",
                imageURL: "./images/"
            },
            {
                id: "hiyoriyama",
                name: "日和山海岸",
                lat: 35.6558832657704,
                lng: 134.826013931159,
                radius_m: 250,
                description: "城崎温泉駅から車で10分、日和山海岸はリアス式海岸の絶景スポ…",
                detailedDescription: "城崎温泉駅から車で10分、日和山海岸はリアス式海岸の絶景スポットです。断崖絶壁の眼下に広がる日本海や波しぶき、奇岩の数々を散歩道や橋からじっくりと楽しめます。<br>沖にある無人島「後ヶ島」は浦島太郎伝説の舞台で、玉手箱を開けた場所とされています。1950年には伝説を伝える東屋が建てられ、龍宮城のような姿が特徴です。この場所で、浦島太郎の物語に思いを馳せながら絶景を堪能できます。",
                category: "leisure",
                region: "toyooka",
                points: 1,
                accessInfo: "JR城崎温泉駅下車→全但バス 日和山（マリンワールド）バス停で下車",
                openingHours: "24時間営業",
                highlights: ["雄大な景観", "ジオパーク要素", "夕日スポット", "写真映え", "この場所で"],
                address: "〒669-6122 兵庫県豊岡市瀬戸",
                mapLink: "https://maps.app.goo.gl/ZDrPf784bt6PJaiU6",
                stampimageURL: "./images/hiyoriyama_stamp.png",
                imageURL: "./images/hiyoriyama.jpg"
            },
            {
                id: "keinohama",
                name: "気比の浜",
                lat: 35.643428362981,
                lng: 134.838291399336,
                radius_m: 250,
                description: "山陰海岸ジオパークの一部として、リアス式海岸の景観や多様な生…",
                detailedDescription: "山陰海岸ジオパークの一部として、リアス式海岸の景観や多様な生態系が魅力となっています。また、周辺には散策路が整備されており、四季折々の自然を感じながらのんびりとしたひとときを過ごすことができます。",
                category: "nature",
                region: "toyooka",
                points: 1,
                accessInfo: "JR城崎温泉駅→全但バス 小島停留所下車　徒歩10分 ",
                openingHours: "",
                highlights: ["遠浅で穏やかな海", "アウトドア", "また"],
                address: "〒669-6124 兵庫県豊岡市気比",
                mapLink: "https://maps.app.goo.gl/m2GUPwh1Zv8vawzW7",
                stampimageURL: "./images/keinohama_stamp.png",
                imageURL: "./images/keinohama.jpg"
            },
            {
                id: "kaban-street",
                name: "カバンストリート",
                lat: 35.5433760256889,
                lng: 134.823901704264,
                radius_m: 250,
                description: "豊岡市の伝統ある宵田商店街が、2005年に「カバンストリート…",
                detailedDescription: "豊岡市の伝統ある宵田商店街が、2005年に「カバンストリート」として再生された「かばんのまち」の象徴的スポットです。約200 mの通りに27店舗が並び、そのうち14店がかばん関連という構成です。かばん型のオブジェ、自動販売機、顔出さない看板など遊び心あふれるフォトスポットも満載で、イベント「カバストマルシェ」も開催されるなど、まち全体を体験できるエリアです。",
                category: "leisure",
                region: "toyooka",
                points: 1,
                accessInfo: "JR豊岡駅より徒歩15分",
                openingHours: "",
                highlights: ["約200", "かばん型のオブジェ", "自動販売機"],
                address: "〒668-0033 兵庫県豊岡市中央町８",
                mapLink: "https://maps.app.goo.gl/i9ratkYqVz9nT5p89",
                stampimageURL: "./images/kaban-street_stamp.png",
                imageURL: "./images/kaban-street.jpg"
            },
            {
                id: "genbudo",
                name: "玄武洞公園（ミュージアム）",
                lat: 35.5884858313395,
                lng: 134.805016477371,
                radius_m: 150,
                description: "160万年前の火山活動によって形成された六角形の柱状節理を持…",
                detailedDescription: "160万年前の火山活動によって形成された六角形の柱状節理を持つ玄武岩の景観は、国の天然記念物として保護されています。隣接するミュージアムでは、地質学・鉱物の展示に加え、ブラックライト展示や体験コーナーなども設けており、自然科学に触れながら壮大な造形美を味わえるスポットです。",
                category: "leisure",
                region: "toyooka",
                points: 1,
                accessInfo: "JR豊岡駅→全但バス 「玄武洞公園」下車",
                openingHours: "9時00分〜17時00分",
                highlights: ["地質学", "鉱物の展示に加え", "歴史"],
                address: "〒668-0801 兵庫県豊岡市赤石１３４７",
                mapLink: "https://maps.app.goo.gl/odWrg1962jd1VcY96",
                stampimageURL: "./images/genbudo_stamp.png",
                imageURL: "./images/genbudo.jpg"
            },
            {
                id: "konotori",
                name: "豊岡市立コウノトリ文化館",
                lat: 35.5513983998145,
                lng: 134.855072372932,
                radius_m: 50,
                description: "コウノトリ保護の拠点として「コウノトリの郷公園」内に設けられ…",
                detailedDescription: "コウノトリ保護の拠点として「コウノトリの郷公園」内に設けられた施設で、生態や歴史に関する展示が充実しています。繁殖活動の紹介や標本、解説パネルがあり、実際にコウノトリを見られる観察エリアも設置されています。",
                category: "nature",
                region: "toyooka",
                points: 1,
                accessInfo: "JR豊岡駅→全但バス 「コウノトリの郷公園」下車",
                openingHours: "9時00分〜17時00分　月曜日 定休日",
                highlights: ["繁殖活動の紹介や標本", "解説パネルがあり", "歴史"],
                address: "〒668-0814 兵庫県豊岡市祥雲寺１２７",
                mapLink: "https://maps.app.goo.gl/RCn1MyWYQDoxJWXK6",
                stampimageURL: "./images/konotori_stamp.png",
                imageURL: "./images/konotori.jpg"
            },
            {
                id: "tajima-airport",
                name: "コウノトリ但馬空港",
                lat: 35.5162430006642,
                lng: 134.789352077376,
                radius_m: 200,
                description: "地域のシンボルであるコウノトリのデザインを取り入れた装飾や展…",
                detailedDescription: "地域のシンボルであるコウノトリのデザインを取り入れた装飾や展示もある空港です。特にYS-11という国産旅客機の展示が話題となっており、飛行機を間近で見ながら学びも得られる、地域に根差した空港施設です。",
                category: "culture",
                region: "toyooka",
                points: 1,
                accessInfo: "JR豊岡駅→全但バス  「コウノトリ但馬空港」下車",
                openingHours: "駐車場 8時30分〜18時30分",
                highlights: ["歴史", "体験", "絶景"],
                address: "〒668-0081 兵庫県豊岡市岩井１５９８−３４ 字河谷1598-34",
                mapLink: "https://maps.app.goo.gl/T1e5Qtn2whUiRnsY6",
                stampimageURL: "./images/tajima-airport_stamp.png",
                imageURL: "./images/tajima-airport.jpg"
            },
            {
                id: "takenokaigan",
                name: "竹野海岸",
                lat: 35.6605053733725,
                lng: 134.764974896092,
                radius_m: 200,
                description: "山陰海岸ジオパークの一部で、日本海の透明な海と白い砂浜が美し…",
                detailedDescription: "山陰海岸ジオパークの一部で、日本海の透明な海と白い砂浜が美しい自然海岸です。シュノーケリングや磯観察、カヌー体験など多彩なアクティビティが楽しめ、奇岩・洞窟地形も豊富なため、自然の変化に富んだ地形と生態系を体験できるスポットです。",
                category: "leisure",
                region: "takeno",
                points: 1,
                accessInfo: "JR竹野駅より徒歩20分",
                openingHours: "",
                highlights: ["奇岩", "歴史", "体験"],
                address: "〒669-6201 兵庫県竹野町竹野",
                mapLink: "https://maps.app.goo.gl/3Kf84mhD4rVWB8dT7",
                stampimageURL: "./images/takenokaigan_stamp.png",
                imageURL: "./images/takenokaigan.jpg"
            },
            {
                id: "jajayama-park",
                name: "ジャジャ山公園",
                lat: 35.6581997918515,
                lng: 134.766237772917,
                radius_m: 100,
                description: "標高約90 mの小高い丘に位置する自然公園で、遊歩道や展望台…",
                detailedDescription: "標高約90 mの小高い丘に位置する自然公園で、遊歩道や展望台からは竹野浜や猫崎半島を一望できます。春の桜に彩られた花景色や四季折々の植栽、歴史を感じさせる石仏群もあり、散策と自然観察に最適な憩いの場です。",
                category: "nature",
                region: "takeno",
                points: 1,
                accessInfo: "JR竹野駅より徒歩20分",
                openingHours: "24時間営業",
                highlights: ["標高約90", "歴史", "体験"],
                address: "〒669-6201 兵庫県豊岡市竹野町竹野",
                mapLink: "https://maps.app.goo.gl/ruuxRbbp2GALjnat5",
                stampimageURL: "./images/jajayama-park_stamp.png",
                imageURL: "./images/jajayama-park.jpg"
            },
            {
                id: "nekosaki-hanto",
                name: "猫崎半島",
                lat: 35.6740600819522,
                lng: 134.76438722113,
                radius_m: 200,
                description: "日本海に突き出た形が猫の顔に似ているといわれる半島で、ポット…",
                detailedDescription: "日本海に突き出た形が猫の顔に似ているといわれる半島で、ポットホールや貝化石など地質学的見どころが多数存在します。灯台へ続くトレッキングコースもあり、270度の海景色を楽しめる絶景スポットです。",
                category: "nature",
                region: "takeno",
                points: 1,
                accessInfo: "JR竹野駅→車 5分",
                openingHours: "24時間営業",
                highlights: ["歴史", "体験", "絶景"],
                address: "〒669-6201 兵庫県豊岡市竹野町竹野",
                mapLink: "https://maps.app.goo.gl/9taQdS2BzurxyMoz9",
                stampimageURL: "./images/nekosaki-hanto_stamp.png",
                imageURL: "./images/nekosaki-hanto.jpg"
            },
            {
                id: "goyotikan",
                name: "竹野川湊館（御用地館）",
                lat: 35.6586704923848,
                lng: 134.761874024504,
                radius_m: 50,
                description: "北前船で栄えた歴史を伝える歴史資料館です。「住吉屋」という歴…",
                detailedDescription: "北前船で栄えた歴史を伝える歴史資料館です。「住吉屋」という歴史ある庄屋屋敷を改修した建物には、海運や交易に関する展示や書作品などがあり、地域の文化と歴史を体感できる施設です。",
                category: "nature",
                region: "takeno",
                points: 1,
                accessInfo: "JR竹野駅より徒歩15分",
                openingHours: "月・金・土・日 9時00分〜17時00分　　火・木 9時00分〜18時00分　水曜日 定休日",
                highlights: ["歴史", "体験", "絶景"],
                address: "〒669-6201 兵庫県豊岡市竹野町竹野４２２",
                mapLink: "https://maps.app.goo.gl/vjnT2f1d8qDKsdAR8",
                stampimageURL: "./images/goyotikan_stamp.png",
                imageURL: "./images/goyotikan.jpg"
            },
            {
                id: "kitamaekan",
                name: "北前館",
                lat: 35.6625008771209,
                lng: 134.761463510179,
                radius_m: 50,
                description: "1階に特産品売店やプロジェクションマッピングによる竹野の地形…",
                detailedDescription: "1階に特産品売店やプロジェクションマッピングによる竹野の地形成り立ち展示、北前船模型を備えた複合施設です。2階には「潮騒の露天風呂」と呼ばれる日本海を一望できる絶景温泉があり、効能のある塩化物温泉で癒し体験を提供します。サウナや物産コーナーもあり、自然と歴史、温泉が融合した充実した施設です。",
                category: "leisure",
                region: "takeno",
                points: 1,
                accessInfo: "JR竹野駅より徒歩15分",
                openingHours: "11時00分〜20時00分",
                highlights: ["自然と歴史", "歴史", "体験"],
                address: "〒669-6201 兵庫県豊岡市竹野町竹野５０−１２",
                mapLink: "https://maps.app.goo.gl/QbnEKMowQSVexjmY7",
                stampimageURL: "./images/kitamaekan_stamp.png",
                imageURL: "./images/kitamaekan.jpg"
            },
            {
                id: "hasakariiwa",
                name: "はさかり岩",
                lat: 35.6589393798926,
                lng: 134.740445324607,
                radius_m: 50,
                description: "竹野海岸にある奇岩の一つで、大きな岩の間に岩が挟まれたユニー…",
                detailedDescription: "竹野海岸にある奇岩の一つで、大きな岩の間に岩が挟まれたユニークな形状をしています。自然の力でできた造形美が見事で、周囲の透明な海とのコントラストが印象的な写真スポットとなっています。地元の観光案内にも取り上げられている景観です。",
                category: "nature",
                region: "takeno",
                points: 1,
                accessInfo: "JR竹野駅→車 10分",
                openingHours: "",
                highlights: ["歴史", "体験", "絶景"],
                address: "〒669-6217 兵庫県豊岡市竹野町濱須井但馬漁火ライン",
                mapLink: "https://maps.app.goo.gl/ztcLWvCh4CJ9YZqZ7",
                stampimageURL: "./images/hasakariiwa_stamp.png",
                imageURL: "./images/hasakariiwa.jpg"
            },
            {
                id: "kannabeyama",
                name: "神鍋山",
                lat: 35.507042943884,
                lng: 134.674866493427,
                radius_m: 50,
                description: "標高469.5ｍの火山で、近畿で唯一、火口がはっきり残ってい...",
                detailedDescription: "標高469.5ｍの火山で、近畿で唯一、火口がはっきり残っている山です。約2万5千年前の噴火でできたすり鉢状の火口は直径約750ｍ、深さ約40ｍにも及び、今も当時の迫力を伝えています。山頂までは30〜40分ほどで登ることができ、火口を一周する遊歩道からは、雄大な神鍋高原の景色が見渡せます。春は新緑、秋は紅葉が美しく、四季折々の自然を楽しめる人気のハイキングスポットです。",
                category: "nature",
                region: "hidaka",
                points: 1,
                accessInfo: "JR江原駅→全但バス 神鍋高原線 約30分",
                openingHours: "",
                highlights: ["自然"],
                address: "〒669-5372 兵庫県豊岡市日高町栗栖野59-78",
                mapLink: "https://maps.app.goo.gl/nhC7DrSWTQNS8gej6",
                stampimageURL: "./images/kannabeyama_stamp.png",
                imageURL: "./images/kannabeyama.jpg",
            },
            {
                id: "fuketsu",
                name: "神鍋風穴",
                lat: 35.5035954111565,
                lng: 134.671660770699,
                radius_m: 50,
                description: "神鍋山の噴火で生まれた溶岩の隙間から、年間を通じて冷たい風が...",
                detailedDescription: "神鍋山の噴火で生まれた溶岩の隙間から、年間を通じて冷たい風が吹き出す天然の風穴です。内部の気温は真夏でも約8℃とひんやりしており、一歩足を踏み入れると別世界の涼しさを体感できます。かつては天然の冷蔵庫として利用され、地元の暮らしを支えてきました。自然の神秘を実感できるスポットとして人気です。",
                category: "nature",
                region: "hidaka",
                points: 1,
                accessInfo: "JR江原駅→全但バス 神鍋高原線 約30分→徒歩 約5分",
                openingHours: "※見学にはガイドによる案内が必要",
                highlights: ["自然"],
                address: "〒669-5372 兵庫県豊岡市日高町栗栖野",
                mapLink: "https://maps.app.goo.gl/FMam1GG7emY3FjaJ9",
                stampimageURL: "./images/fuketsu_stamp.png",
                imageURL: "./images/fuketsu.jpg",
            },
            {
                id: "mitino-eki",
                name: "道の駅「神鍋高原」",
                lat: 35.4992070137943,
                lng: 134.674866728132,
                radius_m: 50,
                description: "神鍋高原観光の拠点となる道の駅で、地元農家が育てた新鮮な野菜...",
                detailedDescription: "神鍋高原観光の拠点となる道の駅で、地元農家が育てた新鮮な野菜や果物、名産品を買うことができます。館内のレストランでは、そば粉の風味豊かな「神鍋そば」や、肉の旨みが自慢の但馬牛を使った料理を味わえます。旅の途中で立ち寄るだけでなく、お土産探しや休憩にもぴったりな場所です。",
                category: "culture",
                region: "hidaka",
                points: 1,
                accessInfo: "JR江原駅→全但バス  神鍋高原行き",
                openingHours: "9時00分〜17時00分",
                highlights: ["グルメ"],
                address: "〒669-5372 兵庫県豊岡市日高町栗栖野59-13",
                mapLink: "https://maps.app.goo.gl/rneRMuABnaCA3KTg9",
                stampimageURL: "./images/mitino-eki_stamp.png",
                imageURL: "./images/mitino-eki.jpg",
            },
            {
                id: "yutorogi",
                name: "神鍋温泉ゆとろぎ",
                lat: 35.4993130763335,
                lng: 134.675318941548,
                radius_m: 50,
                description: "神鍋高原にある温泉施設で、登山やスキー、スポーツを楽しんだ後...",
                detailedDescription: "神鍋高原にある温泉施設で、登山やスキー、スポーツを楽しんだ後に汗を流すのに最適です。内湯のほかに開放感ある露天風呂も備え、雄大な自然の空気を感じながらリラックスできます。地元の人から観光客まで広く親しまれており、旅の疲れを癒す場として人気です。",
                category: "nature",
                region: "hidaka",
                points: 1,
                accessInfo: "JR江原駅→全但バス東河内・神鍋行きで25分、神鍋温泉ゆとろぎ前下車、徒歩3分",
                openingHours: "平日　13時00分～21時00分　土日祝　12時00分～21時00分　定休日　水曜日（祝日の場合は翌日休）",
                highlights: ["温泉", "自然"],
                address: "〒669-5372 兵庫県豊岡市日高町栗栖野59-13",
                mapLink: "https://maps.app.goo.gl/5Lepu2uDrxxraAtV7",
                stampimageURL: "./images/yutorogi_stamp.png",
                imageURL: "./images/yutorogi.jpg",
            },
            {
                id: "uemuranaomi-bokenkan",
                name: "植村直己冒険館（どんぐりbase）",
                lat: 35.4613729126889,
                lng: 134.732428183656,
                radius_m: 50,
                description: "世界的な冒険家・植村直己氏の偉業を伝える博物館です。北極点到...",
                detailedDescription: "世界的な冒険家・植村直己氏の偉業を伝える博物館です。北極点到達やエベレスト登頂など、数々の冒険を支えた装備品や記録映像が展示されており、挑戦する勇気や自然と向き合う姿勢を学ぶことができます。隣接する「どんぐりbase」では、ツリークライミングやクライミングウォールなど、自然の中で遊びながら体験できる施設もあり、子どもから大人まで楽しめます。",
                category: "culture",
                region: "hidaka",
                points: 1,
                accessInfo: "JR江原駅→全但バス 神鍋高原行 約25～35分",
                openingHours: "9時00分～17時00分 　 定休日　水曜日 （祝日の場合は翌日休）、12/29～1/3",
                highlights: ["自然", "体験"],
                address: "〒669-5346 兵庫県豊岡市日高町伊府785",
                mapLink: "https://maps.app.goo.gl/nYiDELCX1LvPNMgW6",
                stampimageURL: "./images/uemuranaomi-bokenkan_stamp.png",
                imageURL: "./images/uemuranaomi-bokenkan.jpg",
            },
            {
                id: "history-museum",
                name: "豊岡市立歴史博物館　但馬国府・国分寺館",
                lat: 35.4697132321012,
                lng: 134.767779341276,
                radius_m: 50,
                description: "古代から近世までの但馬の歴史を紹介する博物館です。特に奈良時...",
                detailedDescription: "古代から近世までの但馬の歴史を紹介する博物館です。特に奈良時代、この地に置かれた但馬国府や国分寺に関する資料が充実しており、出土した土器や木簡、古文書を通じて地域の歴史を学ぶことができます。勾玉づくりや土器づくりなどの体験も行われており、子どもから大人まで楽しく歴史に触れることができる施設です。",
                category: "culture",
                region: "hidaka",
                points: 1,
                accessInfo: "JR江原駅より徒歩10分",
                openingHours: "9時00分～17時00分（入館は16時30分まで）　定休日　水曜日（祝日の場合は翌日休）、12/28～1/4",
                highlights: ["寺", "歴史", "体験"],
                address: "〒669-5305 兵庫県豊岡市日高町祢布808",
                mapLink: "https://maps.app.goo.gl/hJ5TqdWAx9Nz9JXf8",
                stampimageURL: "./images/history-museum_stamp.png",
                imageURL: "./images/history-museum.jpg",
            },
            {
                id: "ase-kekoku",
                name: "阿瀬渓谷",
                lat: 35.4534385919691,
                lng: 134.666737860528,
                radius_m: 50,
                description: "阿瀬川上流に広がる美しい渓谷で、「阿瀬四十八滝」と呼ばれる数...",
                detailedDescription: "阿瀬川上流に広がる美しい渓谷で、「阿瀬四十八滝」と呼ばれる数多くの滝が点在します。その中でも「阿瀬五瀑」と称される名瀑（いもじが滝、源太夫滝、恐れ滝、龍王滝、不動滝）は特に見ごたえがあります。新緑や紅葉の季節には多くのハイカーが訪れ、清流のせせらぎや滝の音に包まれながら森林浴を楽しめます。自然の豊かさを体感できる癒しのスポットです。",
                category: "nature",
                region: "hidaka",
                points: 1,
                accessInfo: "JR江原駅→全但バス 金谷停留所下車→徒歩20分",
                openingHours: "",
                highlights: ["自然"],
                address: "〒669-5359 兵庫県豊岡市日高町羽尻",
                mapLink: "https://maps.app.goo.gl/bMRT1oUCx7JRseNs7",
                stampimageURL: "./images/ase-kekoku_stamp.png",
                imageURL: "./images/ase-kekoku.jpg",
            },
            {
                id: "shiruku-onsen",
                name: "シルク温泉やまびこ",
                lat: 35.4578829592464,
                lng: 134.966635768227,
                radius_m: 50,
                description: "天然温泉として知られ、なめらかな湯ざわりが特徴です。露天風呂...",
                detailedDescription: "天然温泉として知られ、なめらかな湯ざわりが特徴です。露天風呂やサウナのほか、宿泊施設やレストランも併設されており、日帰り入浴から長期滞在まで楽しめます。自然豊かな環境に囲まれ、四季折々の景色を眺めながら心身を癒すことができます。",
                category: "nature",
                region: "tanto",
                points: 1,
                accessInfo: " JR豊岡駅→全但バス 出石行き30分",
                openingHours: "日帰り入浴　6時00分～21時00分（受付は20時30分まで）　冬期間（1月～2月末）7時00分～21時00分　　定休日　毎月第3水曜日は全館休館日",
                highlights: ["温泉", "自然"],
                address: "〒668-0361 兵庫県豊岡市但東町正法寺165",
                mapLink: "https://maps.app.goo.gl/AccALsrC9eNDML9i8",
                stampimageURL: "./images/shiruku-onsen_stamp.png",
                imageURL: "./images/shiruku-onsen.jpg",
            },
            {
                id: "mongoru",
                name: "日本・モンゴル民族博物館",
                lat: 35.4925712174978,
                lng: 134.994733351998,
                radius_m: 50,
                description: "日本とモンゴル両国の歴史や文化をテーマにした全国でも珍しい博...",
                detailedDescription: "日本とモンゴル両国の歴史や文化をテーマにした全国でも珍しい博物館です。遊牧生活や衣食住の展示を通じ、モンゴル民族の暮らしを実感できます。体験コーナーもあり、子どもから大人まで楽しみながら異文化に触れられる施設です。",
                category: "culture",
                region: "tanto",
                points: 1,
                accessInfo: "JR豊岡駅→全但バス 出石行き「出石」→全但バス 奥藤行き「モンゴル博物館前」下車→徒歩2分",
                openingHours: "9時30分～17時00分（入館は16時30分まで）　定休日　水曜（祝日の場合は翌日休館）、年末年始（12月28日～1月4日）",
                highlights: ["歴史", "体験", "文化"],
                address: "〒668-0345 兵庫県豊岡市但東町中山711",
                mapLink: "https://maps.app.goo.gl/cXLZZGmz1mik3Kpp8",
                stampimageURL: "./images/mongoru_stamp.png",
                imageURL: "./images/mongoru.jpg",
            },
            {
                id: "sobanosato",
                name: "赤花そばの郷",
                lat: 35.4820137415595,
                lng: 135.002137575136,
                radius_m: 50,
                description: "全国的にも珍しい赤い花を咲かせるそば「赤花そば」を楽しめる地...",
                detailedDescription: "全国的にも珍しい赤い花を咲かせるそば「赤花そば」を楽しめる地域です。初夏には一面に赤い花畑が広がり、訪れる人を魅了します。秋には収穫されたそばを使った料理が味わえ、景観と食の両方を楽しめる観光スポットです。",
                category: "food",
                region: "tanto",
                points: 1,
                accessInfo: "JR「豊岡駅」「江原駅」「八鹿駅」より 全但バスで40分（出石で乗換）",
                openingHours: "10時00分～15時00分　　定休日　月～金（祝祭日除く）※予約があれば、営業日・時間外でも対応可能",
                highlights: ["文化"],
                address: "〒668-0352 兵庫県豊岡市但東町赤花159-1",
                mapLink: "https://maps.app.goo.gl/MLhrTzbJdrQL97PY9",
                stampimageURL: "./images/sobanosato_stamp.png",
                imageURL: "./images/sobanosato.jpg",
            },
            {
                id: "ankokuji",
                name: "ドウダンツツジの紅葉（但馬安國禅寺）",
                lat: 35.4555527972844,
                lng: 134.959359076906,
                radius_m: 50,
                description: "但馬安國禅寺はドウダンツツジの紅葉で有名です。庭一面が燃える...",
                detailedDescription: "但馬安國禅寺はドウダンツツジの紅葉で有名です。庭一面が燃えるような赤色に染まり、まるで絵画のような光景が広がります。歴史ある寺院の静けさと紅葉の鮮やかさが調和し、訪れる人々に深い感動を与える名所です。",
                category: "culture",
                region: "tanto",
                points: 1,
                accessInfo: "●舞鶴若狭道　福知山ICより約40分（福知山IC⇒国9号⇒野花より国426号⇒小谷より県252号）/n ●京都縦貫道　与謝天橋立ICより約40分 （与謝天野橋立IC⇒国176号⇒亀山より府道76号⇒県2号⇒国482号⇒国426号⇒小谷より県252号）/n ●播但、北近畿道　八鹿氷ノ山ICより約40分 （八鹿氷ノ山IC⇒国9号⇒国312号⇒下小田より県2号⇒国426号⇒小谷より県252号）/n ●播但道　和田山ICより約45分 （和田山IC⇒国312号⇒国9号⇒夜久野より県道56号⇒国426号⇒小谷より県252号）", 
                openingHours: "【2023一般公開時】　2023年11月6日（月）～11月22日（水）＊平日のみ　8時00分～17時00分（受付16時30分）　　定休日　イベント期間中：土曜日、日曜日、祝日",
                highlights: ["寺", "歴史"],
                address: "〒668-0324 兵庫県豊岡市但東町相田327",
                mapLink: "https://maps.app.goo.gl/zvqd18oJ2p9nkEMQA",
                stampimageURL: "./images/ankokuji_stamp.png",
                imageURL: "./images/ankokuji.jpg",
            },
            {
                id: "toui-giyu-museum",
                name: "東井義雄記念館",
                lat: 35.4706278304134,
                lng: 134.949934500153,
                radius_m: 50,
                description: "教育者・東井義雄の業績を伝える記念館です。子どもたちに寄り添...",
                detailedDescription: "教育者・東井義雄の業績を伝える記念館です。子どもたちに寄り添った教育実践の資料や直筆の書簡、写真などが展示されています。来館者は、教育にかけた情熱と生涯を通じた理念に触れ、学ぶことの大切さを改めて感じることができます。",
                category: "culture",
                region: "tanto",
                points: 1,
                accessInfo: "JR豊岡駅→全但バス 出石行きに乗車→全但バス「奥藤行」に乗車、「出合（であい）」で下車",
                openingHours: "10時00分～16時00分　　定休日　火曜日・祝祭日・年末年始",
                highlights: [],
                address: "〒668-0393 兵庫県豊岡市但東町出合150",
                mapLink: "https://maps.app.goo.gl/xjQLDFvz34nSHDQr6",
                stampimageURL: "./images/toui-giyu-museum_stamp.png",
                imageURL: "./images/toui-giyu-museum.jpg",
            },
            {
                id: "tantan-onsen",
                name: "たんたん温泉 福寿の湯",
                lat: 35.5137241737072,
                lng: 134.990739553266,
                radius_m: 50,
                description: "地下深くから湧き出る天然温泉で、やわらかな泉質が特徴です。地...",
                detailedDescription: "地下深くから湧き出る天然温泉で、やわらかな泉質が特徴です。地元の人々にも親しまれており、露天風呂や広々とした浴場で心地よいひとときを過ごせます。周辺観光と合わせて立ち寄れる癒しスポットとして人気です。",
                category: "nature",
                region: "tanto",
                points: 1,
                accessInfo: "自動車  中国自動車道（福崎I.C）→播但連絡道路（和田山I.C）→R312→R426→R482　　　または中国自動車道（吉川JCT）→舞鶴若狭自動車道（福知山I.C）→R9→R426→R482",
                openingHours: "【１月・2月】 平　日　14時00分～21時00分（受付は20時30分まで） 土日祝　11時00分～21時00分（受付は20時30分まで）/n 【3月～12月】 平　日　14時00分～21時30分（受付は21時00分まで） 土日祝　11時00分～22時00分（受付は21時30分まで）　 定休日　火曜日（祝日の場合は営業）", 
                highlights: ["温泉", "自然", "体験"],
                address: "〒668-0334 兵庫県豊岡市但東町坂野470",
                mapLink: "https://maps.app.goo.gl/Juqme7xZQZk4u7EG7",
                stampimageURL: "./images/tantan-onsen_stamp.png",
                imageURL: "./images/tantan-onsen.jpg",
            }
        ];

        // Course Data with multiple images
        window.COURSES = [
            {
                slug: "castle-town-walk",
                title: "出石 城下町散策コース",
                distance_km: 2.4,
                duration_min: 60,
                stamps_count: 5,
                difficulty: 2,
                thumbnails: [
                    "./images/joseki.png",
                    "./images/eirakukan.png",
                    "./images/course1-3.jpg"
                ],
                description: "但馬の小京都・出石をめぐる定番コース。歴史ある建物と美しい街並みを楽しめます。",
                poi_ids: ["izushi-castle", "shinkoro", "eirakukan", "karoyashiki", "meijikan"]
            },
            {
                slug: "kinosaki-hot-spring",
                title: "城崎温泉 外湯めぐりコース",
                distance_km: 1.8,
                duration_min: 90,
                stamps_count: 4,
                difficulty: 1,
                thumbnails: [
                    "./images/onsengai.jpg",
                    "./images/bungeikan.jpg"
                ],
                description: "7つの外湯で有名な城崎温泉を巡るリラックスコース。",
                poi_ids: ["kinosaki-onsen", "bungeikan", "gokurakuji", "marineworld"]
            },
            {
                slug: "marine-adventure",
                title: "海の冒険コース",
                distance_km: 3.2,
                duration_min: 120,
                stamps_count: 2,
                difficulty: 3,
                thumbnails: [
                    "/placeholder.svg?height=150&width=300",
                    "/placeholder.svg?height=150&width=300"
                ],
                description: "日本海の絶景と海の生き物に出会える冒険コース。",
                poi_ids: ["marineworld", "kinosaki-onsen"]
            }
        ];

        // App State
        class ToyookaStampApp {
            constructor() {
                this.currentMode = null;
                this.currentCourse = null;
                this.currentTab = 'map';
                this.nickname = localStorage.getItem('nickname') || null;
                this.userLocation = null;
                this.map = null;
                this.watchId = null;
                this.stampCollection = JSON.parse(localStorage.getItem('stampCollection') || '{}');
                this.courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                this.visitHistory = JSON.parse(localStorage.getItem('visitHistory') || '[]');
                this.hasLocationPermission = JSON.parse(localStorage.getItem('locationPermissionGranted') || 'false');
                this.permissionRequested = JSON.parse(localStorage.getItem('permissionRequested') || 'false');
                this.openAccordions = new Set();
                this.selectedSpot = null;
                this.carouselIntervals = new Map();
                // --- 地図アイコン定義（現在地・スポット） ---
                this.icons = {
                  // 現在地: パルスする青い点（DivIcon）
                  user: L.divIcon({
                    className: 'user-marker',
                    html: '<div class="dot"></div><div class="ring"></div>',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, -8]
                  }),

                  // スポット: 赤いピン（SVGアイコンをdata URIで埋め込み）
                  poi: L.icon({
                    iconUrl:
                      'data:image/svg+xml;charset=UTF-8,' +
                      encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
                          <path fill="#D64545" d="M12.5 0C5.596 0 0 5.596 0 12.5 0 21.875 12.5 41 12.5 41S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z"/>
                          <circle cx="12.5" cy="12.5" r="5.5" fill="white"/>
                        </svg>
                      `),
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [0, -36]
                  })
                };
                // マーカー参照用の索引
                this.markerIndex = Object.create(null);

                this.init();
            }

            init() {
                this.setupEventListeners();
                this.checkInitialState();
            }



            checkInitialState() {
                // Check location permission first
                if (!this.permissionRequested) {
                    this.showLocationPermission();
                    return;
                }

                // Check if nickname exists
                if (this.nickname) {
                    document.getElementById('user-nickname').textContent = this.nickname;
                    document.getElementById('user-nickname-hero').textContent = this.nickname;
                    document.getElementById('profile-username').textContent = this.nickname;

                    // Check URL hash for state
                    const hash = window.location.hash.substring(1);
                    const params = new URLSearchParams(hash);

                    if (params.get('tab')) {
                        this.currentTab = params.get('tab');
                        this.currentMode = params.get('mode') || 'free';
                        this.currentCourse = params.get('slug') || null;

                        this.showMainApp();
                        this.switchTab(this.currentTab);
                    } else {
                        // Show mode select first time
                        this.showModeSelect();
                    }
                } else {
                    // Show mode select for new users
                    this.showModeSelect();
                }

                // Start location tracking if permission granted
                if (this.hasLocationPermission) {
                    this.startLocationWatch();
                }
            }

            showLocationPermission() {
                document.getElementById('location-permission').classList.remove('hidden');
                document.getElementById('mode-select').classList.add('hidden');
                document.getElementById('start-gate').classList.add('hidden');
                document.getElementById('main-app').classList.add('hidden');
            }

            async handleLocationPermission() {
                const button = document.querySelector('.primary-button');
                button.innerHTML = `
                    <div class="spinner"></div>
                    位置情報を取得中...
                `;
                button.classList.add('loading');

                const granted = await this.requestLocationPermission();
                if (granted) {
                    this.permissionRequested = true;
                    this.hasLocationPermission = true;
                    localStorage.setItem('permissionRequested', 'true');
                    localStorage.setItem('locationPermissionGranted', 'true');
                    this.startLocationWatch();
                    this.checkInitialState();
                } else {
                    alert('位置情報の許可が必要です。ブラウザの設定から許可してください。');
                    button.innerHTML = `
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        位置情報の使用を許可
                    `;
                    button.classList.remove('loading');
                }
            }

            handleLocationDenied() {
                this.permissionRequested = true;
                this.hasLocationPermission = false;
                localStorage.setItem('permissionRequested', 'true');
                localStorage.setItem('locationPermissionGranted', 'false');
                this.checkInitialState();
            }

            async requestLocationPermission() {
                return new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.userLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            resolve(true);
                        },
                        () => {
                            resolve(false);
                        }
                    );
                });
            }

            startLocationWatch() {
                if (navigator.geolocation && this.hasLocationPermission) {
                    this.watchId = navigator.geolocation.watchPosition(
                        (position) => {
                            this.userLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            this.updateLocationUI();
                        },
                        (error) => {
                            console.warn('Location error:', error);
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 30000
                        }
                    );
                }
            }

            updateLocation() {
                if (this.hasLocationPermission) {
                    const btn = document.getElementById('location-update-btn');
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<div class="spinner"></div>';

                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.userLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            this.updateLocationUI();
                            btn.innerHTML = originalHTML;
                        },
                        () => {
                            btn.innerHTML = originalHTML;
                        }
                    );
                } else {
                    alert('位置情報の許可が必要です');
                }
            }

            updateLocationUI() {
                const locationStatus = document.getElementById('location-status');
                if (this.userLocation) {
                    locationStatus.className = 'location-status success';
                    locationStatus.innerHTML = `
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
                        </svg>
                        位置情報取得済み
                        <button class="location-update-btn" onclick="app.updateLocation()" id="location-update-btn">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                            更新
                        </button>
                    `;
                }

                // Update stamp distances and availability
                this.updateStampAvailability();

                // Update map if it exists
                if (this.map && this.userLocation) {
                    // Remove existing user marker
                    this.map.eachLayer(layer => {
                        if (layer.options && layer.options.isUserMarker) {
                            this.map.removeLayer(layer);
                        }
                    });

                    // Add new user marker
                    L.marker([this.userLocation.lat, this.userLocation.lng], {
                        icon: this.icons.user,
                        isUserMarker: true
                    })
                        .addTo(this.map)
                        .bindPopup('現在地', { autoPan: false });                }
            }

            updateStampAvailability() {
                if (!this.userLocation) return;

                // Update all stamp stands with distance information
                document.querySelectorAll('.stamp-stand').forEach(stampElement => {
                    const stampId = stampElement.dataset.stampId;
                    if (stampId) {
                        const poi = window.POIS.find(p => p.id === stampId);
                        if (poi) {
                            const distance = this.calculateDistance(
                                this.userLocation.lat, this.userLocation.lng,
                                poi.lat, poi.lng
                            );

                            const distanceBadge = stampElement.querySelector('.distance-badge');
                            if (distanceBadge) {
                                distanceBadge.textContent = `${Math.round(distance)}m`;
                                const isCollected = this.isStampCollected(stampId);
                                const canCollect = distance <= poi.radius_m && !isCollected;
                                distanceBadge.className = `distance-badge ${canCollect ? 'near' : 'far'}`;
                            }

                            // Update stamp availability
                            const isCollected = this.isStampCollected(stampId);
                            const canCollect = distance <= poi.radius_m && !isCollected;

                            if (canCollect) {
                                stampElement.classList.remove('stamp-unavailable');
                                stampElement.onclick = () => this.collectStamp(stampId);
                            } else if (!isCollected) {
                                stampElement.classList.add('stamp-unavailable');
                                stampElement.onclick = null;
                            }
                        }
                    }
                });
            }

            // Haversine distance calculation
            calculateDistance(lat1, lng1, lat2, lng2) {
                const R = 6371000; // Earth's radius in meters
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLng = (lng2 - lng1) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                        Math.sin(dLng/2) * Math.sin(dLng/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                return R * c;
            }

            setupEventListeners() {
                // Nickname input
                const nicknameInput = document.getElementById('nickname-input');
                const startBtn = document.getElementById('start-btn');
                const validation = document.getElementById('input-validation');

                if (nicknameInput) {
                    nicknameInput.addEventListener('input', (e) => {
                        const value = e.target.value.trim();
                        const isValid = value.length >= 1 && value.length <= 20;

                        startBtn.disabled = !isValid;

                        if (value.length === 0) {
                            validation.textContent = '1〜20文字で入力してください（絵文字も使用可能）';
                            validation.classList.remove('error');
                        } else if (value.length > 20) {
                            validation.textContent = '20文字以内で入力してください';
                            validation.classList.add('error');
                        } else {
                            validation.textContent = `${value.length}/20文字`;
                            validation.classList.remove('error');
                        }
                    });

                    startBtn.addEventListener('click', () => {
                        const nickname = nicknameInput.value.trim();
                        if (nickname.length >= 1 && nickname.length <= 20) {
                            this.setNickname(nickname);
                            this.showMainApp();
                            this.updateModeGuidance();
                        }
                    });
                }

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.key >= '1' && e.key <= '5') {
                        const tabs = ['map', 'nearby', 'courses', 'profile', 'settings'];
                        const tabIndex = parseInt(e.key) - 1;
                        if (tabs[tabIndex]) {
                            this.switchTab(tabs[tabIndex]);
                        }
                    }
                });

                // Hash change listener
                window.addEventListener('hashchange', () => {
                    this.handleHashChange();
                });
            }

            setNickname(nickname) {
                this.nickname = nickname;
                localStorage.setItem('nickname', nickname);
                document.getElementById('user-nickname').textContent = nickname;
                document.getElementById('user-nickname-hero').textContent = nickname;
                document.getElementById('profile-username').textContent = nickname;
            }

            showModeSelect() {
                document.getElementById('location-permission').classList.add('hidden');
                document.getElementById('mode-select').classList.remove('hidden');
                document.getElementById('start-gate').classList.add('hidden');
                document.getElementById('main-app').classList.add('hidden');
            }

            showStartGate() {
                document.getElementById('location-permission').classList.add('hidden');
                document.getElementById('mode-select').classList.add('hidden');
                document.getElementById('start-gate').classList.remove('hidden');
                document.getElementById('main-app').classList.add('hidden');
            }

            showMainApp() {
                document.getElementById('location-permission').classList.add('hidden');
                document.getElementById('mode-select').classList.add('hidden');
                document.getElementById('start-gate').classList.add('hidden');
                document.getElementById('main-app').classList.remove('hidden');

                this.renderCourses();
                this.updateContinueSection();
                this.updateProfileData();
                this.updateSettingsData();
            }

            selectMode(mode) {
                this.currentMode = mode;

                if (this.nickname) {
                    this.showMainApp();
                    this.updateModeGuidance();
                    this.updateHash();
                } else {
                    this.showStartGate();
                }
            }

            updateModeGuidance() {
                const guidance = document.getElementById('mode-guidance');
                if (this.currentMode === 'course') {
                    guidance.textContent = 'コースを選んで豊岡の魅力を発見しよう';
                } else {
                    guidance.textContent = 'マップタブで自由に観光地を巡ろう';
                }
            }

            switchTab(tab) {
                // Hide all screens
                document.querySelectorAll('.screen').forEach(screen => {
                    screen.classList.remove('active');
                });

                // Show selected screen
                const screenMap = {
                    'map': 'map-view',
                    'nearby': 'nearby-view',
                    'courses': 'courses-view',
                    'profile': 'profile-view',
                    'settings': 'settings-view'
                };

                const screenId = screenMap[tab] || 'landing';
                document.getElementById(screenId).classList.add('active');

                // Update tab bar
                document.querySelectorAll('.tab').forEach(tabBtn => {
                    tabBtn.setAttribute('data-active', 'false');
                });
                document.querySelector(`[data-tab="${tab}"]`).setAttribute('data-active', 'true');

                this.currentTab = tab;
                this.updateHash();

                // Render content based on tab
                if (tab === 'map') {
                    this.renderMapContent();
                    this.initializeMap();
                } else if (tab === 'nearby') {
                    this.renderNearbyContent();
                } else if (tab === 'profile') {
                    this.updateProfileData();
                } else if (tab === 'settings') {
                    this.updateSettingsData();
                }
            }

            initializeMap() {
                if (!this.map) {
                  // Initialize Leaflet map
                  this.map = L.map('map-container').setView([35.5456, 134.8203], 10);

                  // Tile layer
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                  }).addTo(this.map);

                  // POI markers + 索引登録
                  window.POIS.forEach(poi => {
                    const marker = L.marker([poi.lat, poi.lng], { icon: this.icons.poi })
                      .addTo(this.map)
                      .bindPopup(`
                        <div style="text-align: center;">
                          <h4>${poi.name}</h4>
                          <p>${poi.description}</p>
                          <button onclick="app.showSpotDetails('${poi.id}')"
                                  style="background: var(--brand-primary); color: white; border: none; padding: .5rem 1rem; border-radius: .25rem; cursor: pointer;">
                            詳細を見る
                          </button>
                        </div>
                      `);

                    marker._poiId = poi.id;
                    this.markerIndex[poi.id] = marker;
                  });

                  // 現在地マーカー
                  if (this.userLocation) {
                    L.marker([this.userLocation.lat, this.userLocation.lng], {
                      icon: this.icons.user,
                      isUserMarker: true
                    })
                      .addTo(this.map)
                      .bindPopup('現在地')
                      .openPopup();

                    this.map.setView([this.userLocation.lat, this.userLocation.lng], 12);
                  }
                } else {
                  // 非表示→表示のサイズ崩れ対策
                  this.map.invalidateSize();
                }
            }

            focusPoiOnMap(poiId, opts = {}) {
              const marker = this.markerIndex?.[poiId];
              if (!marker || !this.map) return;

              const latlng = marker.getLatLng();
              const zoom = Math.max(this.map.getZoom() || 0, opts.zoom || 16);

              // ポップアップの autoPan を一時的に止めて、中央からズレるのを防ぐ
              const popup = marker.getPopup && marker.getPopup();
              let prevAutoPan;
              if (popup) { prevAutoPan = popup.options.autoPan; popup.options.autoPan = false; }
              marker.openPopup();

              // きっちり中央へ
              this.map.setView(latlng, zoom, { animate: true });

              // 元に戻す
              if (popup) popup.options.autoPan = prevAutoPan;

              // ここから下の拡大系処理は不要なので入れません
              // （.poi-pop 付与、ZIndexOffset の一時変更 等）
            }



            renderMapContent() {
                const mapContent = document.getElementById('map-content');
                const mapDescription = document.getElementById('map-description');

                if (this.currentMode === 'course' && this.currentCourse) {
                    // Course mode: show spots in order
                    mapDescription.textContent = 'コースの順番に観光地を巡りましょう';
                    const course = window.COURSES.find(c => c.slug === this.currentCourse);
                    if (course) {
                        const coursePOIs = course.poi_ids.map(id => window.POIS.find(p => p.id === id)).filter(Boolean);
                        mapContent.innerHTML = this.renderCourseSpots(coursePOIs);
                    }
                } else {
                    // Free mode: show by regions
                    mapDescription.textContent = '地域別に観光地を確認できます';
                    mapContent.innerHTML = this.renderRegionAccordions();
                }
            }

            renderCourseSpots(spots) {
                return spots.map((spot, index) => {
                    const isCollected = this.isStampCollected(spot.id);
                    return `
                        <div class="tourist-spot" onclick="app.showSpotDetails('${spot.id}')">
                            <div class="spot-left">
                            <button class="spot-icon" type="button"
                                    onclick="event.stopPropagation(); app.focusPoiOnMap('${spot.id}')"
                                    title="地図でこのスポットへ移動">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </button>

                                <div class="spot-info">
                                    <h4>${index + 1}. ${spot.name}</h4>
                                    <p>${spot.description}</p>
                                </div>
                            </div>
                            <div class="spot-right">
                                <div class="badge points ${isCollected ? '' : 'outline'}">
                                    ${spot.points}pt
                                </div>
                                ${isCollected ? `
                                    <div class="badge visits">
                                        取得済み
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('');
            }

            renderRegionAccordions() {
                return Object.entries(regions).map(([regionId, region]) => {
                    const regionSpots = window.POIS.filter(spot => spot.region === regionId);
                    const achievement = this.getRegionAchievement(regionId);
                    const isOpen = this.openAccordions.has(regionId);

                    return `
                        <div class="accordion">
                            <div class="accordion-header ${isOpen ? 'active' : ''}" onclick="app.toggleAccordion('${regionId}')">
                                <div class="accordion-title">
                                    <span style="font-size: 1.5rem; margin-right: 0.5rem;">${region.icon}</span>
                                    ${region.name}
                                </div>
                                <div class="accordion-stats">
                                    <div class="accordion-achievement">
                                        ${achievement.collected}/${achievement.total} (${achievement.percentage}%)
                                    </div>
                                    <div class="accordion-arrow">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-content ${isOpen ? 'active' : ''}">
                                <div class="accordion-body">
                                    ${regionSpots.length > 0 ? regionSpots.map(spot => `
                                        <div class="tourist-spot" onclick="app.showSpotDetails('${spot.id}')">
                                            <div class="spot-left">
                                            <button class="spot-icon" type="button"
                                                    onclick="event.stopPropagation(); app.focusPoiOnMap('${spot.id}')"
                                                    title="地図でこのスポットへ移動">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                </svg>
                                            </button>
                                                <div class="spot-info">
                                                    <h4>${spot.name}</h4>
                                                    <p>${spot.description}</p>
                                                </div>
                                            </div>
                                            <div class="spot-right">
                                                <div class="badge points ${this.isStampCollected(spot.id) ? '' : 'outline'}">
                                                    ${spot.points}pt
                                                </div>
                                                ${this.isStampCollected(spot.id) ? `
                                                    <div class="badge visits">
                                                        取得済み
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                    `).join('') : `
                                        <div class="empty-state">
                                            <div class="empty-state-icon">📍</div>
                                            <p>この地域にはまだ観光スポットが登録されていません</p>
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            renderNearbyContent() {
                const stampContent = document.getElementById('stamp-content');

                // Update stats
                const collectedCount = Object.keys(this.stampCollection).length;
                const totalPoints = this.getTotalPoints();
                const achievementRate = this.getAchievementPercentage();

                document.getElementById('collected-count').textContent = collectedCount;
                document.getElementById('total-points').textContent = totalPoints;
                document.getElementById('achievement-rate').textContent = `${achievementRate}%`;

                if (this.currentMode === 'course' && this.currentCourse) {
                    // Course mode: show stamps in course order
                    const course = window.COURSES.find(c => c.slug === this.currentCourse);
                    if (course) {
                        const coursePOIs = course.poi_ids.map(id => window.POIS.find(p => p.id === id)).filter(Boolean);
                        stampContent.innerHTML = this.renderCourseStamps(coursePOIs);
                    }
                } else {
                    // Free mode: show by regions
                    stampContent.innerHTML = this.renderRegionStamps();
                }

                // Update stamp availability after rendering
                setTimeout(() => this.updateStampAvailability(), 100);
            }

            renderCourseStamps(spots) {
                return `
                    <div class="accordion">
                        <div class="accordion-header active">
                            <div class="accordion-title">
                                <span style="font-size: 1.5rem; margin-right: 0.5rem;">🗺️</span>
                                コーススタンプ
                            </div>
                            <div class="accordion-stats">
                                <div class="accordion-achievement">
                                    ${spots.filter(s => this.isStampCollected(s.id)).length}/${spots.length}
                                </div>
                            </div>
                        </div>
                        <div class="accordion-content active">
                            <div class="accordion-body">
                                <div class="stamp-grid">
                                    ${spots.map((stamp, index) => {
                                        const isCollected = this.isStampCollected(stamp.id);
                                        const distance = this.userLocation ? this.calculateDistance(
                                            this.userLocation.lat, this.userLocation.lng,
                                            stamp.lat, stamp.lng
                                        ) : null;

                                        return `
                                            <div class="stamp-stand ${!isCollected && (distance === null || distance > stamp.radius_m) ? 'stamp-unavailable' : ''}"
                                                 data-stamp-id="${stamp.id}"
                                                 onclick="app.collectStamp('${stamp.id}')">
                                                <div class="stamp-stand-circle ${isCollected ? 'stamp-stand-collected' : ''}">
                                                    <div class="stamp-stand-img" ${isCollected && stamp.stampimageURL ? `style="background-image: url('${stamp.stampimageURL}')"` : ''}>
                                                        ${isCollected && stamp.stampimageURL ? '' : index + 1}
                                                    </div>
                                                </div>
                                                <span class="stamp-stand-label">${stamp.name}</span>
                                                ${distance !== null ? `
                                                    <div class="distance-badge ${distance <= 1000 ? 'near' : 'far'}">
                                                        ${Math.round(distance)}m
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            renderRegionStamps() {
                return Object.entries(regions).map(([regionId, region]) => {
                    const regionSpots = window.POIS.filter(spot => spot.region === regionId);
                    const achievement = this.getRegionAchievement(regionId);
                    const isOpen = this.openAccordions.has(regionId);

                    return `
                        <div class="accordion">
                            <div class="accordion-header ${isOpen ? 'active' : ''}" onclick="app.toggleAccordion('${regionId}')">
                                <div class="accordion-title">
                                    <span style="font-size: 1.5rem; margin-right: 0.5rem;">${region.icon}</span>
                                    ${region.name}
                                </div>
                                <div class="accordion-stats">
                                    <div class="accordion-achievement">
                                        ${achievement.collected}/${achievement.total} (${achievement.percentage}%)
                                    </div>
                                    <div class="accordion-arrow">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-content ${isOpen ? 'active' : ''}">
                                <div class="accordion-body">
                                    ${regionSpots.length > 0 ? `
                                        <div class="stamp-grid">
                                            ${regionSpots.map(stamp => {
                                                const isCollected = this.isStampCollected(stamp.id);
                                                const distance = this.userLocation ? this.calculateDistance(
                                                    this.userLocation.lat, this.userLocation.lng,
                                                    stamp.lat, stamp.lng
                                                ) : null;

                                                return `
                                                    <div class="stamp-stand ${!isCollected && (distance === null || distance > stamp.radius_m) ? 'stamp-unavailable' : ''}"
                                                         data-stamp-id="${stamp.id}"
                                                         onclick="app.collectStamp('${stamp.id}')">
                                                        <div class="stamp-stand-circle ${isCollected ? 'stamp-stand-collected' : ''}">
                                                            <div class="stamp-stand-img" ${isCollected && stamp.stampimageURL ? `style="background-image: url('${stamp.stampimageURL}')"` : ''}>
                                                                ${isCollected && stamp.stampimageURL ? '' : this.getCategoryIcon(stamp.category)}
                                                            </div>
                                                        </div>
                                                        <span class="stamp-stand-label">${stamp.name}</span>
                                                        ${distance !== null ? `
                                                            <div class="distance-badge ${distance <= 1000 ? 'near' : 'far'}">
                                                                ${Math.round(distance)}m
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    ` : `
                                        <div class="empty-state">
                                            <div class="empty-state-icon">📍</div>
                                            <p>この地域にはまだ観光スポットが登録されていません</p>
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            getCategoryIcon(category) {
                const icons = {
                    'culture': '🏛️',
                    'spring': '♨️',
                    'sea': '🌊',
                    'art': '🎨',
                    'temple': '⛩️'
                };
                return icons[category] || '📍';
            }

            collectStamp(stampId) {
                if (!this.userLocation) {
                    alert('位置情報が取得できていません');
                    return false;
                }

                const stamp = window.POIS.find(s => s.id === stampId);
                if (!stamp) return false;

                // Distance check
                const distance = this.calculateDistance(
                    this.userLocation.lat, this.userLocation.lng,
                    stamp.lat, stamp.lng
                );

                if (distance > stamp.radius_m) {
                    alert(`${stamp.name}から${Math.round(distance)}m離れています。${stamp.radius_m}m以内に近づいてください。`);
                    return false;
                }

                // Check if already collected today
                const today = new Date().toDateString();
                if (this.stampCollection[stampId] === today) {
                    alert('今日は既にこのスタンプを取得済みです');
                    return false;
                }

                // Collect stamp
                this.stampCollection[stampId] = today;

                // Add to visit history
                const visit = {
                    spotId: stampId,
                    spotName: stamp.name,
                    category: stamp.category,
                    points: stamp.points,
                    timestamp: new Date().toISOString()
                };

                this.visitHistory.push(visit);
                this.saveData();

                // Show success message
                setTimeout(() => {
                    alert(`🎉 ${stamp.name}のスタンプを取得しました！\n+${stamp.points}ポイント`);
                }, 100);

                // Update UI immediately
                this.renderNearbyContent();
                this.updateProfileData();
                this.updateSettingsData();

                // Check course completion
                if (this.currentMode === 'course' && this.currentCourse) {
                    this.checkCourseCompletion();
                }

                return true;
            }

            checkCourseCompletion() {
                const course = window.COURSES.find(c => c.slug === this.currentCourse);
                if (!course) return;

                const allCollected = course.poi_ids.every(id => this.isStampCollected(id));
                if (allCollected) {
                    delete this.courseProgress[this.currentCourse];
                    this.saveData();

                    setTimeout(() => {
                        alert(`🎊 おめでとうございます！\n「${course.title}」を完走しました！`);
                    }, 500);
                }
            }

            isStampCollected(stampId) {
                return !!this.stampCollection[stampId];
            }

            getTotalPoints() {
                return this.visitHistory.reduce((total, visit) => total + visit.points, 0);
            }

            getAchievementPercentage() {
                const totalSpots = window.POIS.length;
                const collectedSpots = Object.keys(this.stampCollection).length;
                return totalSpots > 0 ? Math.round((collectedSpots / totalSpots) * 100) : 0;
            }

            getRegionAchievement(regionId) {
                const regionSpots = window.POIS.filter(spot => spot.region === regionId);
                const collectedSpots = regionSpots.filter(spot => this.isStampCollected(spot.id));
                return {
                    collected: collectedSpots.length,
                    total: regionSpots.length,
                    percentage: regionSpots.length > 0 ? Math.round((collectedSpots.length / regionSpots.length) * 100) : 0
                };
            }

            toggleAccordion(regionId) {
                if (this.openAccordions.has(regionId)) {
                    this.openAccordions.delete(regionId);
                } else {
                    this.openAccordions.add(regionId);
                }

                if (this.currentTab === 'map') {
                    this.renderMapContent();
                } else if (this.currentTab === 'nearby') {
                    this.renderNearbyContent();
                }
            }

            showSpotDetails(spotId) {
                const spot = window.POIS.find(s => s.id === spotId);
                if (!spot) return;

                this.selectedSpot = spotId;

                // Populate modal content
                document.getElementById('spot-modal-title').textContent = spot.name;
                document.getElementById('spot-modal-description').textContent = spot.description;
                document.getElementById('spot-modal-image').src = spot.imageURL;
                document.getElementById('spot-modal-detailed').textContent = spot.detailedDescription;
                document.getElementById('spot-modal-address').textContent = spot.address;
                document.getElementById('spot-modal-address').href = spot.mapLink || '#';
                document.getElementById('spot-modal-access').textContent = spot.accessInfo;
                document.getElementById('spot-modal-hours').textContent = spot.openingHours;
                document.getElementById('spot-modal-points').textContent = `${spot.points}ポイント`;

                // Update highlights
                const highlightsContainer = document.getElementById('spot-modal-highlights');
                highlightsContainer.innerHTML = spot.highlights.map(highlight => `
                    <div class="highlight-tag">${highlight}</div>
                `).join('');

                // Show modal
                document.getElementById('spot-detail-modal').classList.remove('hidden');
            }

            closeSpotDetail() {
                document.getElementById('spot-detail-modal').classList.add('hidden');
                this.selectedSpot = null;
            }

            updateProfileData() {
                const totalSpots = window.POIS.length;
                const collectedSpots = Object.keys(this.stampCollection).length;
                const totalPoints = this.getTotalPoints();
                const achievementRate = this.getAchievementPercentage();
                const visitCount = this.visitHistory.length;

                // Update profile card
                document.getElementById('profile-achievement').textContent = achievementRate;
                document.getElementById('profile-points').textContent = totalPoints;
                document.getElementById('profile-rank').textContent = this.getCurrentRank().name;
                document.getElementById('profile-progress-fill').style.width = `${achievementRate}%`;
                document.getElementById('profile-spots').textContent = collectedSpots;
                document.getElementById('profile-total-spots').textContent = totalSpots;

                // Update profile details
                document.getElementById('profile-visited').textContent = collectedSpots;
                document.getElementById('profile-total').textContent = totalSpots;
                document.getElementById('profile-visit-count').textContent = `${visitCount}回`;
                document.getElementById('profile-achievement-rate').textContent = `${achievementRate}%`;

                // Update badges
                this.updateBadges();

                // Update visit history
                this.updateVisitHistory();
            }

            getCurrentRank() {
                const points = this.getTotalPoints();
                if (points >= 15) return { name: 'Platinum', icon: '💎' };
                if (points >= 10) return { name: 'Gold', icon: '🥇' };
                if (points >= 6) return { name: 'Silver', icon: '🥈' };
                if (points >= 3) return { name: 'Bronze', icon: '🥉' };
                return { name: 'Beginner', icon: '🔰' };
            }

            updateBadges() {
                const badges = this.getBadgeConditions();
                const badgesGrid = document.getElementById('badges-grid');

                badgesGrid.innerHTML = badges.map(badge => `
                    <div class="badge-item ${badge.color} ${badge.achieved ? '' : 'grayscale'}"
                         onclick="app.showBadgeInfo('${badge.id}')">
                        <div class="badge-emoji">${badge.emoji}</div>
                        <div class="badge-label ${badge.color}">${badge.name}</div>
                        <div class="badge-condition">${badge.condition}</div>
                        ${badge.achieved ? '<div style="color: #059669; font-size: 0.75rem; margin-top: 0.25rem;">✓ 獲得済み</div>' : ''}
                    </div>
                `).join('');
            }

            getBadgeConditions() {
                const totalPoints = this.getTotalPoints();
                const collectedSpots = Object.keys(this.stampCollection).length;
                const visitCount = this.visitHistory.length;
                const achievementRate = this.getAchievementPercentage();

                return [
                    {
                        id: 'first-visit',
                        name: '初回訪問',
                        emoji: '🎯',
                        condition: '最初の観光地を訪問',
                        achieved: visitCount > 0,
                        color: 'green'
                    },
                    {
                        id: 'bronze',
                        name: 'Bronze',
                        emoji: '🥉',
                        condition: '3ポイント以上獲得',
                        achieved: totalPoints >= 3,
                        color: 'orange'
                    },
                    {
                        id: 'silver',
                        name: 'Silver',
                        emoji: '🥈',
                        condition: '6ポイント以上獲得',
                        achieved: totalPoints >= 6,
                        color: 'blue'
                    },
                    {
                        id: 'gold',
                        name: 'Gold',
                        emoji: '🥇',
                        condition: '10ポイント以上獲得',
                        achieved: totalPoints >= 10,
                        color: 'yellow'
                    },
                    {
                        id: 'platinum',
                        name: 'Platinum',
                        emoji: '💎',
                        condition: '15ポイント以上獲得',
                        achieved: totalPoints >= 15,
                        color: 'purple'
                    },
                    {
                        id: 'three-spots',
                        name: '3スポット',
                        emoji: '⭐',
                        condition: '3つの観光地を訪問',
                        achieved: collectedSpots >= 3,
                        color: 'blue'
                    },
                    {
                        id: 'half-complete',
                        name: '50%達成',
                        emoji: '👑',
                        condition: '全体の50%を達成',
                        achieved: achievementRate >= 50,
                        color: 'purple'
                    },
                    {
                        id: 'complete',
                        name: '全制覇',
                        emoji: '🏆',
                        condition: 'すべての観光地を訪問',
                        achieved: collectedSpots === window.POIS.length,
                        color: 'yellow'
                    },
                    {
                        id: 'explorer',
                        name: '探検家',
                        emoji: '🗺️',
                        condition: '10回以上訪問',
                        achieved: visitCount >= 10,
                        color: 'red'
                    }
                ];
            }

            showBadgeInfo(badgeId) {
                const badges = this.getBadgeConditions();
                const badge = badges.find(b => b.id === badgeId);
                if (badge) {
                    alert(`${badge.emoji} ${badge.name}\n\n獲得条件: ${badge.condition}\n\n${badge.achieved ? '✅ 獲得済み' : '❌ 未獲得'}`);
                }
            }

            updateVisitHistory() {
                const visitHistoryContainer = document.getElementById('visit-history');
                const sortedHistory = [...this.visitHistory].reverse();

                if (sortedHistory.length === 0) {
                    visitHistoryContainer.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">📍</div>
                            <p style="font-size: 1.125rem; font-weight: 500; color: #64748b; margin-bottom: 0.5rem;">まだ訪問履歴がありません</p>
                            <p style="font-size: 0.875rem; color: #64748b;">観光地を訪問してスタンプを集めましょう！</p>
                        </div>
                    `;
                } else {
                    visitHistoryContainer.innerHTML = `
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
                            <div style="text-align: center; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #5eead4; background: linear-gradient(135deg, #f0fdfa, #ccfbf1);">
                                <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; color: #0d9488;">${this.visitHistory.length}</div>
                                <div style="font-size: 0.75rem; color: #134e4a;">総訪問回数</div>
                            </div>
                            <div style="text-align: center; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #93c5fd; background: linear-gradient(135deg, #eff6ff, #dbeafe);">
                                <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; color: #2563eb;">${Object.keys(this.stampCollection).length}</div>
                                <div style="font-size: 0.75rem; color: #1e3a8a;">訪問スポット</div>
                            </div>
                            <div style="text-align: center; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #c4b5fd; background: linear-gradient(135deg, #faf5ff, #f3e8ff);">
                                <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; color: #7c3aed;">${this.getTotalPoints()}</div>
                                <div style="font-size: 0.75rem; color: #581c87;">総ポイント</div>
                            </div>
                        </div>
                        <div style="max-height: 24rem; overflow-y: auto;">
                            ${sortedHistory.slice(0, 5).map(visit => `
                                <div style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: linear-gradient(135deg, white, #f9fafb); border-radius: 0.75rem; border: 1px solid #f1f5f9; margin-bottom: 0.75rem; transition: all 0.2s;">
                                    <div style="width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #14b8a6, #10b981); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.25rem; height: 1.25rem; color: white;">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </div>
                                    <div style="flex: 1; min-width: 0;">
                                        <h4 style="font-weight: 700; color: #1f2937; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${visit.spotName}</h4>
                                        <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; color: #64748b;">
                                            <div style="display: flex; align-items: center; gap: 0.25rem;">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1rem; height: 1rem;">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                                ${new Date(visit.timestamp).toLocaleDateString('ja-JP')}
                                            </div>
                                        </div>
                                    </div>
                                    <div style="flex-shrink: 0;">
                                        <div style="background: #fef3c7; color: #92400e; border: 1px solid #fde047; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500;">+${visit.points}pt</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
            }

            updateSettingsData() {
                const achievementRate = this.getAchievementPercentage();
                const collectedSpots = Object.keys(this.stampCollection).length;
                const visitCount = this.visitHistory.length;

                document.getElementById('settings-achievement').textContent = `${achievementRate}%`;
                document.getElementById('settings-spots').textContent = `${collectedSpots}スポット`;
                document.getElementById('settings-visits').textContent = `${visitCount}回`;
            }

            renderCourses() {
                const courseGrid = document.getElementById('course-grid');
                const coursesGrid = document.getElementById('courses-grid');

                const courseHTML = window.COURSES.map(course => this.renderCourseCard(course)).join('');

                if (courseGrid) courseGrid.innerHTML = courseHTML;
                if (coursesGrid) coursesGrid.innerHTML = courseHTML;

                // Initialize carousels
                this.initializeCarousels();
            }

            renderCourseCard(course) {
                const stars = '★'.repeat(course.difficulty) + '☆'.repeat(5 - course.difficulty);

                return `
                    <div class="course-card" onclick="app.showCourseDetail('${course.slug}')">
                        <div class="course-carousel" id="carousel-${course.slug}">
                            <div class="carousel-container">
                                ${course.thumbnails.map((thumbnail, index) => `
                                    <div class="carousel-slide" style="background-image: url('${thumbnail}')">
                                        ${index === 0 ? '🏯' : ''}
                                    </div>
                                `).join('')}
                            </div>
                            <div class="carousel-indicators">
                                ${course.thumbnails.map((_, index) => `
                                    <div class="carousel-indicator ${index === 0 ? 'active' : ''}"
                                         onclick="event.stopPropagation(); app.setCarouselSlide('${course.slug}', ${index})"></div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="course-content">
                            <h3 class="course-title">${course.title}</h3>
                            <div class="course-badges">
                                <span class="course-badge distance">${course.distance_km}km</span>
                                <span class="course-badge time">${course.duration_min}分</span>
                                <span class="course-badge stamps">${course.stamps_count}スタンプ</span>
                                <span class="course-badge difficulty">
                                    <span class="difficulty-stars">${stars}</span>
                                </span>
                            </div>
                            <div class="course-actions">
                                <button class="btn btn-outline" onclick="event.stopPropagation(); app.showCourseDetail('${course.slug}')">
                                    詳細を見る
                                </button>
                                <button class="btn btn-primary" onclick="event.stopPropagation(); app.startCourseDirectly('${course.slug}')">
                                    このコースで始める
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            initializeCarousels() {
                // Clear existing intervals
                this.carouselIntervals.forEach(interval => clearInterval(interval));
                this.carouselIntervals.clear();

                // Initialize new carousels
                window.COURSES.forEach(course => {
                    if (course.thumbnails.length > 1) {
                        let currentSlide = 0;
                        const interval = setInterval(() => {
                            currentSlide = (currentSlide + 1) % course.thumbnails.length;
                            this.setCarouselSlide(course.slug, currentSlide);
                        }, 3000);
                        this.carouselIntervals.set(course.slug, interval);
                    }
                });
            }

            setCarouselSlide(courseSlug, slideIndex) {
                const carousel = document.getElementById(`carousel-${courseSlug}`);
                if (!carousel) return;

                const container = carousel.querySelector('.carousel-container');
                const indicators = carousel.querySelectorAll('.carousel-indicator');

                if (container && indicators.length > 0) {
                    container.style.transform = `translateX(-${slideIndex * 20}%)`;

                    indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === slideIndex);
                    });
                }
            }

            showCourseDetail(courseSlug) {
                const course = window.COURSES.find(c => c.slug === courseSlug);
                if (!course) return;

                document.getElementById('modal-course-title').textContent = course.title;
                document.getElementById('modal-course-description').textContent = course.description;

                // Update badges
                const stars = '★'.repeat(course.difficulty) + '☆'.repeat(5 - course.difficulty);
                document.getElementById('modal-course-badges').innerHTML = `
                    <span class="course-badge distance">${course.distance_km}km</span>
                    <span class="course-badge time">${course.duration_min}分</span>
                    <span class="course-badge stamps">${course.stamps_count}スタンプ</span>
                    <span class="course-badge difficulty">
                        <span class="difficulty-stars">${stars}</span>
                    </span>
                `;

                // Update timeline
                const timeline = document.getElementById('modal-poi-timeline');
                const pois = course.poi_ids.map(id => window.POIS.find(p => p.id === id)).filter(Boolean);
                timeline.innerHTML = pois.map((poi, index) => `
                    <div class="timeline-item">
                        <div class="timeline-number">${index + 1}</div>
                        <div class="timeline-content">
                            <h4>${poi.name}</h4>
                            <p>${poi.description}</p>
                        </div>
                    </div>
                `).join('');

                // Set up start button
                document.getElementById('modal-start-btn').onclick = () => {
                    this.startCourse(courseSlug);
                };

                document.getElementById('course-detail-modal').classList.remove('hidden');
            }

            closeCourseDetail() {
                document.getElementById('course-detail-modal').classList.add('hidden');
            }

            startCourse(courseSlug = null) {
                if (!courseSlug) {
                    const course = window.COURSES.find(c =>
                        c.title === document.getElementById('modal-course-title').textContent
                    );
                    courseSlug = course?.slug;
                }

                if (!courseSlug) return;

                // Check if switching from another course
                if (this.currentCourse && this.currentCourse !== courseSlug) {
                    if (!confirm('現在のコースの進捗が初期化されます。よろしいですか？')) {
                        return;
                    }
                }

                this.currentCourse = courseSlug;
                this.currentMode = 'course';
                this.courseProgress[courseSlug] = { started: new Date().toISOString() };
                this.saveData();

                this.closeCourseDetail();
                this.switchTab('nearby');
                this.updateHash();
                this.updateContinueSection();
            }

            startCourseDirectly(courseSlug) {
                this.startCourse(courseSlug);
            }

            continueCourse() {
                if (this.currentCourse) {
                    this.switchTab('nearby');
                }
            }

            updateContinueSection() {
                const continueSection = document.getElementById('continue-section');
                const coursesContinueSection = document.getElementById('courses-continue-section');

                if (this.currentMode === 'course' && this.currentCourse) {
                    const course = window.COURSES.find(c => c.slug === this.currentCourse);
                    if (course) {
                        const courseName = course.title;
                        document.getElementById('continue-course-name').textContent = courseName;
                        document.getElementById('courses-continue-name').textContent = courseName;

                        continueSection.classList.remove('hidden');
                        coursesContinueSection.classList.remove('hidden');
                        return;
                    }
                }

                continueSection.classList.add('hidden');
                coursesContinueSection.classList.add('hidden');
            }

            updateHash() {
                const params = new URLSearchParams();
                params.set('tab', this.currentTab);
                if (this.currentMode) params.set('mode', this.currentMode);
                if (this.currentCourse) params.set('slug', this.currentCourse);

                window.location.hash = params.toString();
            }

            handleHashChange() {
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);

                const tab = params.get('tab');
                const mode = params.get('mode');
                const slug = params.get('slug');

                if (mode) this.currentMode = mode;
                if (slug) this.currentCourse = slug;

                if (tab && tab !== this.currentTab) {
                    this.switchTab(tab, { suppressHash: true });
                } else {
                    // 同一タブの場合でも必要な再描画を行う
                    if (this.currentTab === 'map') {
                        this.renderMapContent();
                        this.initializeMap();
                    } else if (this.currentTab === 'nearby') {
                        this.renderNearbyContent();
                    } else if (this.currentTab === 'profile') {
                        this.updateProfileData();
                    } else if (this.currentTab === 'settings') {
                        this.updateSettingsData();
                    }
                }

                this.updateContinueSection();
                this.updateModeGuidance();
                }

            // 永続化
            saveData() {
                localStorage.setItem('stampCollection', JSON.stringify(this.stampCollection));
                localStorage.setItem('courseProgress', JSON.stringify(this.courseProgress));
                localStorage.setItem('visitHistory', JSON.stringify(this.visitHistory));
                if (this.nickname) localStorage.setItem('nickname', this.nickname);
                if (typeof this.permissionRequested === 'boolean') {
                    localStorage.setItem('permissionRequested', JSON.stringify(this.permissionRequested));
                }
                if (typeof this.hasLocationPermission === 'boolean') {
                    localStorage.setItem('locationPermissionGranted', JSON.stringify(this.hasLocationPermission));
                }
            }

            // データ書き出し
            exportData() {
            const payload = {
                exportedAt: new Date().toISOString(),
                nickname: this.nickname,
                mode: this.currentMode,
                course: this.currentCourse,
                stampCollection: this.stampCollection,
                courseProgress: this.courseProgress,
                visitHistory: this.visitHistory
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'toyooka-stamp-export.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            }

            // データ初期化
            resetData() {
                if (!confirm('すべてのローカルデータを削除します。よろしいですか？')) return;

                // 背景設定は残したい場合はここを保存
                const brushBg = localStorage.getItem('brushBgEnabled');

                localStorage.clear();

                if (brushBg !== null) {
                    localStorage.setItem('brushBgEnabled', brushBg);
                }

                // 内部状態も初期化
                this.currentMode = null;
                this.currentCourse = null;
                this.currentTab = 'map';
                this.nickname = null;
                this.userLocation = null;
                this.stampCollection = {};
                this.courseProgress = {};
                this.visitHistory = [];
                this.hasLocationPermission = false;
                this.permissionRequested = false;
                this.openAccordions.clear();

                // 画面をリロードしてクリーンに戻す
                window.location.hash = '';
                window.location.reload();
            }

            // 背景の筆ブラシ風トグル
            setBrushBgEnabled(enabled) {
                const body = document.body;
                if (enabled) {
                    body.classList.add('brush-bg');
                } else {
                    body.classList.remove('brush-bg');
                }
                localStorage.setItem('brushBgEnabled', JSON.stringify(enabled));
                const toggle = document.getElementById('brush-bg-toggle');
                if (toggle) toggle.checked = !!enabled;
              }
            }

            // ====== アプリ起動とグローバル関数のエクスポート ======
            const app = new ToyookaStampApp();
            window.app = app;

            // 背景設定の初期適用
            (function initBrushBg() {
                const saved = JSON.parse(localStorage.getItem('brushBgEnabled') || 'true');
                app.setBrushBgEnabled(saved);
            })();

            // UI から呼ばれる関数をグローバルへ
            window.switchTab = (tab) => app.switchTab(tab);
            // switchTab をハッシュ更新抑制付きでも使えるように拡張
            ToyookaStampApp.prototype.switchTab = function(tab, { suppressHash = false } = {}) {
                // 全画面を非表示
                document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));

                // 対応スクリーンID
                const screenMap = {
                    'map': 'map-view',
                    'nearby': 'nearby-view',
                    'courses': 'courses-view',
                    'profile': 'profile-view',
                    'settings': 'settings-view'
                };
                const screenId = screenMap[tab] || 'landing';
                const target = document.getElementById(screenId);
                if (target) target.classList.add('active');

                // タブバー状態
                document.querySelectorAll('.tab').forEach(t => t.setAttribute('data-active', 'false'));
                const btn = document.querySelector(`[data-tab="${tab}"]`);
                if (btn) btn.setAttribute('data-active', 'true');

                this.currentTab = tab;

                // タブに応じた描画
                if (tab === 'map') {
                    this.renderMapContent();
                    this.initializeMap();
                } else if (tab === 'nearby') {
                    this.renderNearbyContent();
                } else if (tab === 'profile') {
                    this.updateProfileData();
                } else if (tab === 'settings') {
                    this.updateSettingsData();
                }

                if (!suppressHash) this.updateHash();
            };

            window.selectMode = (mode) => app.selectMode(mode);
            window.showModeSelect = () => app.showModeSelect();
            window.continueCourse = () => app.continueCourse();
            window.startCourse = (slug) => app.startCourse(slug);
            window.closeCourseDetail = () => app.closeCourseDetail();
            window.closeSpotDetail = () => app.closeSpotDetail();
            window.toggleBrushBackground = () => {
                const chk = document.getElementById('brush-bg-toggle');
                app.setBrushBgEnabled(chk ? chk.checked : true);
            };
