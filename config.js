// Character Creator Configuration File
const CONFIG = {
    // Sizes (Body type/age) with head offsets in pixels
    sizes: [
        { 
            id: 'child', 
            name: 'طفل (Child)', 
            path: 'pitures/bodies/Childbody.png',
            hairOffset: { x: 0, y: 0 },
            glassesOffset: { x: 0, y: 0 }
        },
        { 
            id: 'teenager', 
            name: 'شاب (Youth)', 
            path: 'pitures/bodies/teenbody.png',
            hairOffset: { x: 0, y: 0 },
            glassesOffset: { x: 0, y: 0 } // Reset to 0 since glasses are now size-specific
        },
        { 
            id: 'adult', 
            name: 'بالغ (Adult)', 
            path: 'pitures/bodies/adultbody.png',
            hairOffset: { x: 0, y: 0 },
            glassesOffset: { x: 0, y: 0 } // Reset to 0 since glasses are now size-specific
        }
    ],

    // Hairstyles (mapped to size-specific folders)
    hair: [
        { 
            id: 'short_1', 
            name: 'شعر قصير 1', 
            gender: 'male', 
            paths: { 
                child: 'pitures/hair/child/short hair1.png', 
                teenager: 'pitures/hair/teen/teen short hair1.png', 
                adult: 'pitures/hair/adult/adult short hair1.png' 
            } 
        },
        { 
            id: 'short_2', 
            name: 'شعر قصير 2', 
            gender: 'male', 
            paths: { 
                child: 'pitures/hair/child/short hair2.png', 
                teenager: 'pitures/hair/teen/teen short hair2.png', 
                adult: 'pitures/hair/adult/adult short hair2.png' 
            }
        },
        { 
            id: 'long_1', 
            name: 'شعر طويل 1', 
            gender: 'female', 
            paths: { 
                child: 'pitures/hair/child/long hair1.png', 
                teenager: 'pitures/hair/teen/teen long hair1.png', 
                adult: 'pitures/hair/adult/adult long hair1.png' 
            } 
        },
        { 
            id: 'long_2', 
            name: 'شعر طويل 2', 
            gender: 'female', 
            paths: { 
                child: 'pitures/hair/child/long hair2.png', 
                teenager: 'pitures/hair/teen/teen long hair2.png', 
                adult: 'pitures/hair/adult/adult long hair2.png' 
            } 
        }
    ],

    // Outfits / Clothes
    clothes: [
        { 
            id: 'casual', 
            name: 'ملابس عادية', 
            attribute: 'عادي',
            paths: { child: 'pitures/clothes/child normal.png', teenager: 'pitures/clothes/teen normal.png', adult: 'pitures/clothes/adult normal.png' } 
        },
        { 
            id: 'suit', 
            name: 'بدلة رسمية', 
            attribute: 'أنيق', 
            profession: 'المهني',
            paths: { child: 'pitures/clothes/child suite.png', teenager: 'pitures/clothes/teen suite.png', adult: 'pitures/clothes/adult suite.png' } 
        },
        { 
            id: 'lab_coat', 
            name: 'معطف مختبر', 
            attribute: 'المبتكر', 
            profession: 'العالم',
            paths: { child: 'pitures/clothes/child lab coat.png', teenager: 'pitures/clothes/teen lab coat.png', adult: 'pitures/clothes/adult lab coat.png' } 
        },
        { 
            id: 'barista', 
            name: 'زي باريستا', 
            attribute: 'المحترف', 
            profession: 'الباريستا',
            paths: { child: 'pitures/clothes/child barista.png', teenager: 'pitures/clothes/teen barista.png', adult: 'pitures/clothes/adult barista.png' } 
        },
        { 
            id: 'spacesuit', 
            name: 'ملابس فضاء', 
            attribute: 'الفلكي', 
            profession: 'رائد الفضاء',
            paths: { child: 'pitures/clothes/child astronaut.png', teenager: 'pitures/clothes/teen astronaut.png', adult: 'pitures/clothes/adult astronaut.png' } 
        },
        { 
            id: 'jumpsuit', 
            name: 'زي الطاهي', 
            attribute: 'المبدع', 
            profession: 'الشيف',
            paths: { child: 'pitures/clothes/child chef.png', teenager: 'pitures/clothes/teen chef (1).png', adult: 'pitures/clothes/adult chef.png' } 
        }
    ],

    // Accessories (now mapped to size-specific folders for glasses and flower)
    accessories: [
        { 
            id: 'mug', 
            name: 'كوب قهوة', 
            type: 'decorative', 
            paths: { child: 'pitures/accessories/Magh.png', teenager: 'pitures/accessories/Magh.png', adult: 'pitures/accessories/Magh.png' } 
        },
        { 
            id: 'flower', 
            name: 'وردة لطيفة', 
            type: 'decorative', 
            paths: { 
                child: 'pitures/accessories/child flower.png', 
                teenager: 'pitures/accessories/teen flower.png', 
                adult: 'pitures/accessories/adult flower.png' 
            } 
        },
        { 
            id: 'glasses', 
            name: 'نظارة بكسل', 
            type: 'decorative', 
            isGlasses: true, 
            paths: { 
                child: 'pitures/accessories/child glasses.png', 
                teenager: 'pitures/accessories/teen glasses.png', 
                adult: 'pitures/accessories/Adult glasses.png' 
            } 
        },
        { 
            id: 'laptop', 
            name: 'كمبيوتر محمول', 
            type: 'influencing', 
            attribute: 'التقني', 
            paths: { child: 'pitures/accessories/lap top.png', teenager: 'pitures/accessories/lap top.png', adult: 'pitures/accessories/lap top.png' } 
        },
        { 
            id: 'stethoscope', 
            name: 'سماعة طبيب', 
            type: 'influencing', 
            attribute: 'الطبي', 
            paths: { child: 'pitures/accessories/stethoscope.png', teenager: 'pitures/accessories/stethoscope.png', adult: 'pitures/accessories/stethoscope.png' } 
        }
    ],

    // Dynamic backgrounds behind the character
    backgrounds: [
        { id: 'clean_gray', name: 'رمادي هادئ', value: '#f3f4f6' },
        { id: 'sky_blue', name: 'سماء صيفية', value: '#e0f2fe' },
        { id: 'mint_green', name: 'نعناع هادئ', value: '#ecfdf5' },
        { id: 'pink_rose', name: 'وردي لطيف', value: '#fdf2f8' },
        { id: 'pastel_yellow', name: 'أصفر مشرق', value: '#fefce8' },
        { id: 'soft_purple', name: 'أرجواني ناعم', value: '#faf5ff' },
        { id: 'gradient_sunny', name: 'تدرج مشرق', value: 'linear-gradient(135deg, #fef9c3, #fbcfe8)' },
        { id: 'gradient_cool', name: 'تدرج بارد', value: 'linear-gradient(135deg, #e0f2fe, #e0e7ff)' }
    ],

    // Special Override Cases
    specialCharacters: [
        {
            id: 'jamony',
            name: 'جموني ماهر',
            description: 'أصغر أفراد عالم ماهر. تعشق أن يحملها الجميع، وتعتبر أي شيء جديد اكتشافًا يستحق أن تتذوقه.',
            conditions: {
                size: 'child',
                hair: 'short_1',
                clothes: 'casual',
                accessories: ['flower']
            }
        },
        {
            id: 'qahwaji',
            name: 'قهوجي ماهر',
            description: 'صانع قهوة محترف جدًا، والمالك الرسمي لمتجر «قهوجي ماهر» العريق.',
            conditions: {
                size: 'teenager',
                hair: 'short_1',
                clothes: 'barista',
                accessories: ['glasses', 'mug']
            }
        },
        {
            id: 'qombyutarji',
            name: 'كمبيوترجي ماهر',
            description: 'مصلح كمبيوترات ماهر جداً ويعشق حل المشاكل البرمجية والتقنية الصعبة بلمح البصر.',
            conditions: {
                size: 'teenager',
                hair: 'short_2',
                clothes: 'casual',
                accessories: ['glasses', 'laptop']
            }
        }
    ]
};
