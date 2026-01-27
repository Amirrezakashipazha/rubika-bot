// export const apiHeader = {
//     'App-Version': `70000000`,
//     'App-Market': `web`,
//     'App-Package': process.env.NEXT_PUBLIC_PACKAGE ?? '',
//     'Content-Type': 'application/json',
//     'Accept-Language': 'fa',
//     apikey:
//         '897b2e8a3b67fe80f2d1e799cc810d2824115877e0ec21b71e6b8d98fd180f80' + '',
// };
// const MENU_BUILDER_URL = 'api/p/arrangement/v1/page/';

// import { MenuBuilderMainModel } from '../model/main.model';

export const fetchMenu = async () => {

    return [
        {
            id: 1,
            title: 'انگشت‌شمار',
            genre: 'درس و مشق‌طور',
            description: 'یک دو سه، بدو از مسابقه عقب نمونی،  به ترتیب روی عدد ها کلیک کن و بشمارشون',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/1beshmaresh/c6cd627b-48cc-40fa-be06-5a1d025e104d.webp'
        },
        {
            id: 2,
            title: 'تهران دانک',
            genre: 'زنگ ورزش',
            description: 'یه بسکتبال انگشتیمون نشه مشتی؟ زودتر شروع کن که منتظریم',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/2tehrandunk/218dc53e-3d79-431e-abbb-1b3839f7d806.webp'
        },
        {
            id: 3,
            title: 'عیساد',
            genre: 'جالب توجه',
            description: 'سازمان عیساد یک سازمان ضد ترورسیتی است که با ماموران موساد در سراسر دنیا مقابله می نماید، شما در نقش عبود میبایست ماموران موساد را از پشت با استفاده از سلاح لیزری خود خلع سلاح نمایید. موفق باشید',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/3Eisad/5ed74dd6-41d6-4f8e-bc8a-4ff8cb89f4f5.webp'
        },
        {
            id: 4,
            title: 'گلابتون',
            genre: 'درس و مشق‌طور',
            description: 'گلابی های باغ گلابتون انتظارتو میکشن که بچینیشون، با دقت و حوصله به گلابتون در این کار کمک کن',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/4golab/192c08bc-895c-4f2e-891d-87eaa3d549a9.webp'
        },
        {
            id: 5,
            title: 'میرزابنویس',
            genre: 'درس و مشق‌طور',
            description: 'ببین میرزا چی میگه همون رو بنویس! تمرینی مناسب برای افزایش سرعت تایپ در شبکه های اجتماعی',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/5mirza/1f376448-b33a-478b-a7d7-7fe6061b433b.webp'
        },
        {
            id: 6,
            title: 'فوتبالینا',
            genre: 'زنگ ورزش',
            description: 'با فوتبالینا همیشه سالمینا میدونستین؟ توپ رو تا دروازه برسون و شوت کن توی گل',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/6foot/83de23c9-387e-45cf-8c74-49ab73cb59f3.webp'
        },
        {
            id: 7,
            title: 'چک موز',
            genre: 'اشک‌آور',
            description: 'تا حالا به میوه ها چک زدی؟ این میوه ها توی صندوق شورش کردن با یه چک از وسط به نیم تقسیمشون کن تا بدونن رئیس کیه',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/7qach/9f74c8e3-9827-43f9-ac85-bc792e8690c2.webp'
        },
        {
            id: 8,
            title: 'دنگ کافه',
            genre: 'جالب توجه',
            description: 'سیروس و منصوره تازه باهم توی اپ دوستیابی آشنا شدن و نزدیک میدون آزادی باهم رفتن سر قرار. اما همون اول صحبت، سیروس گفت که دنگ کافه رو باید منصوره حساب کنه، حالا تو داور مسابقه سنگ کاغذ قیچی سیروس و منصوره برای حساب کردن دنگ کافه باش',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/8dongcafe1/1ac4d22f-22eb-4ef5-af08-b9abbc59dbd6.webp'
        },
        {
            id: 9,
            title: 'ناخدا جمشید',
            genre: 'بزن بزن',
            description: 'اسطوره دریا ها، مردی که مثل خورشید همیشه پشتش به ماست در خلیج همیشگی فارس با اجنبی ها درگیر شده',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/9jamshid/8de98096-55ca-42b6-a2e0-a552b15c26c3.webp'
        },
        {
            id: 10,
            title: 'مردم آزار',
            genre: 'اشک‌آور',
            description: 'به داراب کمک کن راه اش به پشت بوم رو پیدا کنه و بتونه به کبوتر هاش برسه، در راه ممکنه با همسایه های گیر دهنده برخورد کنی',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/10mardom/5ad87832-74f1-463c-8187-d7eb3a55e6eb.webp'
        },
        {
            id: 11,
            title: 'مستقیم آبادی',
            genre: 'بزن بزن',
            description: 'هرطور شده باید بتونی به آبادی خودت برسی تا دختر عموت رو که زن داییت قول اش رو بهت داده بود رو شوهر ندادن! منتها مراقب گاو ها باش، اونا خیلی بد پرواز می‌کنن اما چیزی جز یونجه توو دلشون نیست...',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/11mostaghim_abadi/cc27a329-9c12-41c2-ab36-6f9456a65645.webp'
        },
        {
            id: 12,
            title: 'دایی مظفر',
            genre: 'بزن بزن',
            description: 'دایی مظفر توو راه خونه توسط چنتا پیک موتوری خفت شده، همین الان تیزی رو بکش بیرون و نشونشون بده بچه دروازه دولاب چقدر میتونه خطرناک باشه',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/12khosro/c0549e31-f930-4cc5-ad16-87eb1bda40a1.webp'
        },
        {
            id: 13,
            title: 'هوشنگ',
            genre: 'درس و مشق‌طور',
            description: 'هوشنگ دانش آموز کلاس پنجم دبستان پسرانه "توشه آخرت" با معدل 19 در حال جواب دادن به سوالات ریاضی شما می باشد',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/13hosh/e7d35970-1294-40ac-b77c-bee944ac7309.webp'
        },
        {
            id: 14,
            title: 'ورود آقایان ممنوع',
            genre: 'بزن بزن',
            description: 'سفر بی انتها با آسانسور شرکت، همراه با همکار های محترمه! بهترین شبیه ساز مدیریت ورود و خروج از آسانسور در ایران',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/14vam/ee606554-8c27-4429-9f7a-0d1103524e76.webp'
        },
        {
            id: 15,
            title: 'بدوزش',
            genre: 'درس و مشق‌طور',
            description: 'لذت خیاطی در موبایل با استاد خلیل مهربان در بازی "بدوزش"، با هنر نمایی استاد خلیل و روح پر فتوح استاد ایشان',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/15beduz/a4931172-af68-4178-a7cd-171e222175c5.webp'
        },
        {
            id: 16,
            title: 'چی‌تابه',
            genre: 'جالب توجه',
            description: 'آشپزی با حروف درون مایتابه در چیتابه، حروف بهم ریخته رو به هم متصل کن و کلمه مورد نظر رو کشف کن',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/16chitabe/49fe0918-ebed-4581-9dd6-d1626bd3c417.webp'
        },
        {
            id: 17,
            title: 'فینگرک',
            genre: 'زنگ ورزش',
            description: 'یک فوتبال انگشتی جالب اما سخت، مخصوص تمرین دادن انگشت های زیبای شما',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/17Fingerak/8235a701-0cdb-4b27-820c-8417b8611cb7.webp'
        },
        {
            id: 18,
            title: 'زنبورچی',
            genre: 'تیراندازی',
            description: 'زنبورچی از نوادگان شیپورچی و صور اسرافیل است که به جنگ زنبور های صورت مهربان شتافته، تغذیه این بزرگوار از فلفل و سکه های طلایی رنگ چرخان است',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/18zanboor/fc8d32f3-271f-47ca-9a54-7cae7078562c.webp'
        },
        {
            id: 19,
            title: 'سه‌گوش',
            genre: 'جالب توجه',
            description: 'خرد کردن یاقوت های گران بها و تکه یخ های قطب شمال به منزله رفع بیکاری',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/19yaghoot/d72b3c79-fd16-4701-8e5b-2461f52e55b0.webp'
        },
        {
            id: 20,
            title: 'همای سعادت',
            genre: 'جالب توجه',
            description: 'یه کرکس توو سعادت آباد گم شده، این همون همای سعادته! بهش غذا بده و هواش رو داشته باش تا شاید روی شونه هات بشینه',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/20halghe/ddd59c9b-d6d4-46f5-9a59-08e987c9e022.webp'
        },
        {
            id: 21,
            title: 'حالا برعکس',
            genre: 'اشک‌آور',
            description: 'تاحالا برعکس روی کاسه ماست خوری نشستی؟ اگه جوابت خیر هست پس میتونی حالا برعکس رو بازی کنی و توی همون حالت به سوالات برعکس جواب بدی',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/21hala/6fd65e49-82d3-407a-a3ca-52fae9b71684.webp'
        },
        {
            id: 22,
            title: 'بوم بوم',
            genre: 'درس و مشق‌طور',
            description: 'مثلا روی صفحه بوم بوم کنه اما زوم نمیکنه فقط سرعت حرکت توپ رو کند تر میکنه که بتونی از موانع عبور کنی',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/22bom/08454c09-d8a7-48ce-8760-0591433e86de.webp'
        },
        {
            id: 23,
            title: 'چک بی محل',
            genre: 'بزن بزن',
            description: 'به علائم توجه کن و با کشیدن انگشت به سمت چپ و یا راست، صورت دوستان عزیز را گرم بنما',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/23chak/ed6546c0-da2d-4d27-a21a-8bf917b489f5.webp'
        },
        {
            id: 24,
            title: 'تخم کفتر گیر',
            genre: 'اشک‌آور',
            description: 'کچل کفتر باز حالا افتاده توو خیابونای تهران دنبال تخم کفتر مردم!',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/24tokhm_kaftar_gir/9d16a4cb-abce-407c-a46d-b0019d87be77.webp'
        },
        {
            id: 25,
            title: 'پل صدر',
            genre: 'زنگ ورزش',
            description: 'آموزش تضمینی پشت سر گذاشتن ترافیک در تهران بزرگ! همراه با مسابقات درگ با امبولانس و گشت ویژه',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/25polsadr/35a353bd-9200-48c1-bb91-924ced91221e.webp'
        },
        {
            id: 26,
            title: 'بکش بالا',
            genre: 'اشک‌آور',
            description: 'یه چایی تازه با طعم دهنده طبیعی عمو بایرام',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/26bekesh/aac2130b-4dfc-44bd-8603-9327df52b685.webp'
        },
        {
            id: 27,
            title: 'غلط اضافه',
            genre: 'جالب توجه',
            description: 'یه غلط اضافه ممکنه زندگیت رو تغییر بده پس همیشه حواست غلط های اضافه زندگیت باشه',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/27qalat/06207ea8-b551-423f-899d-7cbf536afc5d.webp'
        },
        {
            id: 28,
            title: 'خارپشته',
            genre: 'اشک‌آور',
            description: 'خار در برابر خار! حمله به خارهای داخل حلقه با خارپشته خار دار! بازی سرعتی همراه با جایزه',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/28khar/b3f85033-7a74-4349-bdd9-903439fe5846.webp'
        },
        {
            id: 29,
            title: 'غلام جاپنی',
            genre: 'زنگ ورزش',
            description: 'غلام که در دهه 70 شمسی جهت کار آرایشگری عازم جاپن شده بود تصمیم گرفت با پریدن به سوی اون بالا ها مدارج ترقی را بپیماید',
            icon: 'https://tlbxfiles.ir/gamecenter/stage/playground/game/icon/29qolam/531018e1-5a17-475c-a3b8-e8e85cfa4623.webp'
        }
    ]
    // const controller = new AbortController();
    // const timeout = setTimeout(() => controller.abort(), 15000); // 15 seconds

    // try {
    //     const res = await fetch(
    //         `${process.env.NEXT_PUBLIC_API_ENDPOINT}${MENU_BUILDER_URL}`,
    //         {
    //             method: "GET",
    //             headers: apiHeader,
    //             signal: controller.signal, // pass signal to fetch
    //         }
    //     );

    //     const menu: MenuBuilderMainModel = await res.json();
    //     return menu;
    // } catch (err) {
    //     if (err instanceof Error && err.name === "AbortError") {
    //         console.error("Fetch timed out");
    //     } else {
    //         console.error(err);
    //     }
    // }
    // finally {
    //     clearTimeout(timeout);
    // }

};
