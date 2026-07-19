// Maher Character Creator State
let state = {
    size: 'medium', // Default to teenager/medium
    hair: 'short_1',
    clothes: 'casual',
    background: 'clean_gray', // Default background ID
    accessories: [] // Array of active accessory IDs
};

// Initialize Application UI
document.addEventListener('DOMContentLoaded', () => {
    // Render Customizer Options
    renderOptions('size', CONFIG.sizes, 'sizeOptions', false);
    renderOptions('hair', CONFIG.hair, 'hairOptions', false);
    renderOptions('clothes', CONFIG.clothes, 'clothesOptions', false);
    renderOptions('accessory', CONFIG.accessories, 'accessoryOptions', true);
    renderOptions('background', CONFIG.backgrounds, 'backgroundOptions', false);

    // Setup Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(`${btn.dataset.tab}Pane`);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // Control buttons events
    document.getElementById('randomizeBtn').addEventListener('click', randomizeCharacter);
    document.getElementById('generateNameBtn').addEventListener('click', revealIdentity);
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('resultModal').classList.remove('open');
    });
    document.getElementById('downloadImageBtn').addEventListener('click', downloadFinalImage);
    document.getElementById('shareBtn').addEventListener('click', copyLinkToClipboard);

    // Initial render preview
    updatePreview();
});

// Render UI Cards into Grid
function renderOptions(category, items, containerId, isMultiSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.dataset.id = item.id;
        
        // Setup initial active state
        const isActive = isMultiSelect 
            ? state.accessories.includes(item.id)
            : state[category] === item.id;
            
        if (isActive) card.classList.add('active');

        // Render card content
        let visualLabel = '';
        if (category === 'size') {
            const icons = { child: '👶', teenager: '🙋‍♂️', adult: '🧔' };
            visualLabel = `<span style="font-size: 1.6rem; margin-bottom: 5px;">${icons[item.id]}</span>`;
        } else if (category === 'hair') {
            const icons = { short_1: '👨‍💼', short_2: '💇‍♂️', long_1: '👩‍🦰', long_2: '👧' };
            visualLabel = `<span style="font-size: 1.6rem; margin-bottom: 5px;">${icons[item.id]}</span>`;
        } else if (category === 'clothes') {
            const icons = { casual: '👕', suit: '👔', lab_coat: '🥼', barista: '☕', spacesuit: '👩‍🚀', jumpsuit: '🛠️' };
            visualLabel = `<span style="font-size: 1.6rem; margin-bottom: 5px;">${icons[item.id]}</span>`;
        } else if (category === 'accessory') {
            const icons = { mug: '🍺', flower: '🌸', glasses: '👓', laptop: '💻', stethoscope: '🩺' };
            visualLabel = `<span style="font-size: 1.6rem; margin-bottom: 5px;">${icons[item.id]}</span>`;
        } else if (category === 'background') {
            visualLabel = `<div style="width: 30px; height: 30px; border-radius: 50%; background: ${item.value}; border: 1px solid rgba(0,0,0,0.15); margin-bottom: 5px;"></div>`;
        }

        card.innerHTML = `
            ${isMultiSelect ? '<div class="select-indicator"></div>' : ''}
            ${visualLabel}
            <span>${item.name}</span>
        `;

        // Card interaction handler
        card.addEventListener('click', () => {
            if (isMultiSelect) {
                toggleAccessory(item.id, card);
            } else {
                document.querySelectorAll(`#${containerId} .option-card`).forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                state[category] = item.id;
                updatePreview();
            }
        });

        container.appendChild(card);
    });
}

// Multi-select toggle for accessories
function toggleAccessory(id, cardElement) {
    const index = state.accessories.indexOf(id);
    if (index > -1) {
        state.accessories.splice(index, 1);
        cardElement.classList.remove('active');
    } else {
        state.accessories.push(id);
        cardElement.classList.add('active');
    }
    updatePreview();
}

// Update DOM image layers with body-size dependent offsets
function updatePreview() {
    const size = state.size; // 'child', 'teenager', 'adult'
    const sizeObj = CONFIG.sizes.find(s => s.id === size);
    
    // 0. Render Selected Background behind character
    const bgObj = CONFIG.backgrounds.find(b => b.id === state.background);
    const bgLayer = document.getElementById('bgLayer');
    if (bgObj && bgLayer) {
        bgLayer.style.background = bgObj.value;
    }

    // 1. Body Layer
    const bodyImg = document.getElementById('bodyLayer');
    if (sizeObj) {
        bodyImg.src = sizeObj.path;
        bodyImg.style.display = 'block';
    } else {
        bodyImg.style.display = 'none';
    }

    // 2. Hair Layer (Apply Offset & Custom Option Scale/Offset)
    const selectedHairObj = CONFIG.hair.find(h => h.id === state.hair);
    const hairImg = document.getElementById('hairLayer');
    if (selectedHairObj && selectedHairObj.paths[size]) {
        hairImg.src = selectedHairObj.paths[size];
        hairImg.style.display = 'block';
        
        let tx = 0;
        let ty = 0;
        let scale = 1;
        
        // Add size offset
        if (sizeObj && sizeObj.hairOffset) {
            tx += sizeObj.hairOffset.x;
            ty += sizeObj.hairOffset.y;
        }
        
        // Add hair style option specific offset and scale
        if (selectedHairObj.customScale) {
            scale = selectedHairObj.customScale;
        }
        if (selectedHairObj.customOffset) {
            tx += selectedHairObj.customOffset.x;
            ty += selectedHairObj.customOffset.y;
        }

        // Convert 400x400 canvas pixels to fluid percentage translations
        const pctX = (tx / 400) * 100;
        const pctY = (ty / 400) * 100;
        
        hairImg.style.transform = `translate(${pctX}%, ${pctY}%) scale(${scale})`;
        hairImg.style.transformOrigin = 'center center';
    } else {
        hairImg.style.display = 'none';
    }

    // 3. Clothes Layer
    const selectedClothesObj = CONFIG.clothes.find(c => c.id === state.clothes);
    const clothesImg = document.getElementById('clothesLayer');
    if (selectedClothesObj && selectedClothesObj.paths[size]) {
        clothesImg.src = selectedClothesObj.paths[size];
        clothesImg.style.display = 'block';
    } else {
        clothesImg.style.display = 'none';
    }

    // 4. Accessories Container (Render multiple active accessories stacked with offsets)
    const accContainer = document.getElementById('accessoriesContainer');
    accContainer.innerHTML = ''; // Clear old layers
    
    state.accessories.forEach(accId => {
        const accObj = CONFIG.accessories.find(a => a.id === accId);
        if (accObj && accObj.paths[size]) {
            const img = document.createElement('img');
            img.className = 'layer accessory-layer';
            img.src = accObj.paths[size];
            img.alt = accObj.name;
            
            // If accessory is glasses, apply glassesOffset
            if (accObj.isGlasses && sizeObj && sizeObj.glassesOffset) {
                const pctX = (sizeObj.glassesOffset.x / 400) * 100;
                const pctY = (sizeObj.glassesOffset.y / 400) * 100;
                img.style.transform = `translate(${pctX}%, ${pctY}%)`;
                img.style.transformOrigin = 'center center';
            }
            
            accContainer.appendChild(img);
        }
    });
}

// Randomize active states
function randomizeCharacter() {
    // Size
    state.size = CONFIG.sizes[Math.floor(Math.random() * CONFIG.sizes.length)].id;
    // Hair
    state.hair = CONFIG.hair[Math.floor(Math.random() * CONFIG.hair.length)].id;
    // Clothes
    state.clothes = CONFIG.clothes[Math.floor(Math.random() * CONFIG.clothes.length)].id;
    // Background
    state.background = CONFIG.backgrounds[Math.floor(Math.random() * CONFIG.backgrounds.length)].id;
    // Accessories (random subset)
    state.accessories = [];
    CONFIG.accessories.forEach(acc => {
        if (Math.random() > 0.6) {
            state.accessories.push(acc.id);
        }
    });

    // Sync Grids active classes
    syncGridActive('sizeOptions', state.size, false);
    syncGridActive('hairOptions', state.hair, false);
    syncGridActive('clothesOptions', state.clothes, false);
    syncGridActive('backgroundOptions', state.background, false);
    
    // Sync accessories multiselect
    const accContainer = document.getElementById('accessoryOptions');
    if (accContainer) {
        accContainer.querySelectorAll('.option-card').forEach(card => {
            const isActive = state.accessories.includes(card.dataset.id);
            card.classList.toggle('active', isActive);
        });
    }

    updatePreview();
    showToast('🎲 تم توليد خيارات عشوائية بنجاح!');
}

function syncGridActive(containerId, activeId, isMulti) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.option-card').forEach(card => {
        card.classList.toggle('active', card.dataset.id === activeId);
    });
}

// Personality Rule Engine
function calculateIdentity() {
    const { size, hair, clothes, accessories } = state;

    // 1. Check Special Overrides first
    for (const special of CONFIG.specialCharacters) {
        const cond = special.conditions;
        const sizeMatch = cond.size === size;
        const hairMatch = cond.hair === hair;
        const clothesMatch = cond.clothes === clothes;
        
        // Check if all required accessories are included
        const accsMatch = cond.accessories.every(accId => accessories.includes(accId));
        
        if (sizeMatch && hairMatch && clothesMatch && accsMatch) {
            return {
                name: special.name,
                description: special.description
            };
        }
    }

    // 2. Gender determination from Hair
    const hairObj = CONFIG.hair.find(h => h.id === hair);
    const isFemale = hairObj ? hairObj.gender === 'female' : false;

    // 3. Clothes mapping & Stethoscope Doctor upgrade
    const clothesObj = CONFIG.clothes.find(c => c.id === clothes);
    let profession = clothesObj ? (clothesObj.profession || clothesObj.attribute) : 'مكتشف';
    
    // Rule: Lab coat + Stethoscope = Doctor
    if (clothes === 'lab_coat' && accessories.includes('stethoscope')) {
        profession = 'طبيب';
    }

    // Dynamic Name generation
    let generatedName = `${profession} ماهر`;

    // 4. Constructing Descriptions
    // Baseline introduction depending on age and gender
    let pronoun = isFemale ? 'مبدعة' : 'مبدع';
    let ageIntro = '';
    
    if (size === 'child') {
        ageIntro = isFemale ? 'طفلة لطيفة ومبتكرة' : 'طفل لطيف ومبتكر';
    } else if (size === 'teenager') {
        ageIntro = isFemale ? 'شابة طموحة وذكية' : 'شاب طموح وذكي';
    } else {
        ageIntro = isFemale ? 'شخصية محترفة وناضجة' : 'شخصية محترفة وناضجة';
    }

    // Build sentence combining profession style
    let professionStyle = '';
    switch (clothes) {
        case 'casual':
            professionStyle = isFemale ? 'تعشق البساطة والحرية وتثق بخطواتها الواعدة.' : 'يعشق البساطة والحرية ويثق بخطواته الواعدة.';
            break;
        case 'suit':
            professionStyle = isFemale ? 'تتميز بالتأنق الشديد وتحب إدارة مهامها العملية بلمسة مهنية مذهلة.' : 'يتميز بالتأنق الشديد ويحب إدارة مهامه العملية بلمسة مهنية مذهلة.';
            break;
        case 'lab_coat':
            if (accessories.includes('stethoscope')) {
                professionStyle = isFemale ? 'تكرس وقتها للاعتناء بصحة المحيطين بها وتوزيع النصائح الطبية اللطيفة.' : 'يكرس وقته للاعتناء بصحة المحيطين به وتوزيع النصائح الطبية اللطيفة.';
            } else {
                professionStyle = isFemale ? 'تقضي وقتها في إجراء التجارب المعملية الشيقة وابتكار حلول علمية مبتكرة.' : 'يكرس وقته لإجراء التجارب المعملية الشيقة وابتكار حلول علمية مبتكرة.';
            }
            break;
        case 'barista':
            professionStyle = isFemale ? 'تصنع أطيب المشروبات الدافئة بدقة عالية وتسعد كل من يتذوق صنع يديها.' : 'يصنع أطيب المشروبات الدافئة بدقة عالية ويسعد كل من يتذوق صنع يديه.';
            break;
        case 'spacesuit':
            professionStyle = isFemale ? 'تحلق بأحلامها الكبيرة نحو النجوم والمجرات وتطمح لاستكشاف الفضاء البعيد.' : 'يحلق بأحلامه الكبيرة نحو النجوم والمجرات ويطمح لاستكشاف الفضاء البعيد.';
            break;
        case 'jumpsuit':
            professionStyle = isFemale ? 'تتفوق في العمل الميداني الدقيق وتصلح أي جهاز معطل بذكائها وتركيزها.' : 'يتفوق في العمل الميداني الدقيق ويصلح أي جهاز معطل بذكائه وتركيزه.';
            break;
    }

    // Incorporate influencing accessories
    let accessoryInfluence = '';
    const activeInfluencing = CONFIG.accessories.filter(a => a.type === 'influencing' && accessories.includes(a.id));
    
    if (activeInfluencing.length > 0) {
        const names = activeInfluencing.map(a => a.name).join(' و ');
        accessoryInfluence = isFemale 
            ? ` كما أنها تستعين بـ ${names} لتنجز أعمالها الرقمية والطبية بمهارة فائقة.` 
            : ` كما أنه يستعين بـ ${names} لينجز أعماله الرقمية والطبية بمهارة فائقة.`;
    }

    // Final clean sentence blend
    const description = `${ageIntro} ${professionStyle}${accessoryInfluence}`;

    return {
        name: generatedName,
        description: description
    };
}

// Reveal Identity modal
function revealIdentity() {
    const identity = calculateIdentity();
    
    document.getElementById('maherName').innerText = identity.name;
    document.getElementById('maherDesc').innerText = identity.description;

    // Clone character preview for modal
    const modalPreview = document.getElementById('modalPreview');
    const originalWrapper = document.getElementById('layerWrapper');
    
    modalPreview.innerHTML = '';
    const clonedWrapper = originalWrapper.cloneNode(true);
    clonedWrapper.id = 'modalLayerWrapper';
    modalPreview.appendChild(clonedWrapper);

    // Open Modal
    document.getElementById('resultModal').classList.add('open');
    showToast('✨ تم الكشف عن هوية ماهر!');
}

// Download final merged layers image with background and precise offsets
function downloadFinalImage() {
    const size = state.size;
    const sizeObj = CONFIG.sizes.find(s => s.id === size);
    const hairObj = CONFIG.hair.find(h => h.id === state.hair);
    const clothesObj = CONFIG.clothes.find(c => c.id === state.clothes);
    const bgObj = CONFIG.backgrounds.find(b => b.id === state.background);

    // Setup canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Keep pixel art sharp
    ctx.imageSmoothingEnabled = false;

    // 0. Draw selected background on canvas first
    if (bgObj) {
        const bgVal = bgObj.value;
        if (bgVal.startsWith('linear-gradient')) {
            const matches = bgVal.match(/#[0-9a-fA-F]{3,6}/g);
            if (matches && matches.length >= 2) {
                const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                grad.addColorStop(0, matches[0]);
                grad.addColorStop(1, matches[1]);
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = '#f3f4f6';
            }
        } else {
            ctx.fillStyle = bgVal;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Queue images and their corresponding offsets
    const layersToDraw = [];
    
    // 1. Body
    if (sizeObj) {
        layersToDraw.push({ src: sizeObj.path, offset: null, scale: 1 });
    }
    // 2. Hair
    if (hairObj && hairObj.paths[size]) {
        let tx = 0;
        let ty = 0;
        let scale = 1;
        if (sizeObj && sizeObj.hairOffset) {
            tx += sizeObj.hairOffset.x;
            ty += sizeObj.hairOffset.y;
        }
        if (hairObj.customScale) {
            scale = hairObj.customScale;
        }
        if (hairObj.customOffset) {
            tx += hairObj.customOffset.x;
            ty += hairObj.customOffset.y;
        }

        layersToDraw.push({ 
            src: hairObj.paths[size], 
            offset: { x: tx, y: ty },
            scale: scale 
        });
    }
    // 3. Clothes
    if (clothesObj && clothesObj.paths[size]) {
        layersToDraw.push({ src: clothesObj.paths[size], offset: null, scale: 1 });
    }
    // 4. Accessories
    state.accessories.forEach(accId => {
        const accObj = CONFIG.accessories.find(a => a.id === accId);
        if (accObj && accObj.paths[size]) {
            let offset = null;
            if (accObj.isGlasses && sizeObj && sizeObj.glassesOffset) {
                offset = sizeObj.glassesOffset;
            }
            layersToDraw.push({ 
                src: accObj.paths[size], 
                offset: offset,
                scale: 1 
            });
        }
    });

    if (layersToDraw.length === 0) {
        showToast('❌ لا توجد صور للتحميل!');
        return;
    }

    // Sequential drawing loop
    function drawLayerAtIndex(index) {
        if (index >= layersToDraw.length) {
            // Trigger download
            try {
                const pngURL = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                const identity = calculateIdentity();
                downloadLink.href = pngURL;
                downloadLink.download = `${identity.name}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                showToast('📥 تم تحميل شخصيتك الماهرة بنجاح!');
            } catch (err) {
                showToast('❌ عذراً، لا يمكن تحميل الصورة محلياً بسبب قيود أمان المتصفح (CORS).');
                console.error(err);
            }
            return;
        }

        const layer = layersToDraw[index];
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            ctx.save();
            
            // Set scaling center to middle of canvas (200, 200)
            if (layer.scale && layer.scale !== 1) {
                ctx.translate(200, 200);
                ctx.scale(layer.scale, layer.scale);
                ctx.translate(-200, -200);
            }

            let dx = 0;
            let dy = 0;
            if (layer.offset) {
                dx = layer.offset.x;
                dy = layer.offset.y;
            }

            ctx.drawImage(img, dx, dy, canvas.width, canvas.height);
            ctx.restore();
            drawLayerAtIndex(index + 1);
        };
        img.onerror = () => {
            drawLayerAtIndex(index + 1);
        };
        img.src = layer.src;
    }

    drawLayerAtIndex(0);
}

function copyLinkToClipboard() {
    const identity = calculateIdentity();
    const shareText = `قمت بتصميم شخصية ماهر كـ "${identity.name}"! صمم شخصيتك الخاصة الآن.`;
    const fullText = `${window.location.href}\n${shareText}`;

    // Robust Copy Fallback (works on file:// protocols where navigator.clipboard might be blocked)
    let copied = false;
    try {
        const textArea = document.createElement("textarea");
        textArea.value = fullText;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textArea);
    } catch (err) {
        console.error('Fallback copy failed', err);
    }

    if (copied) {
        showToast('🔗 تم نسخ رابط المشاركة بنجاح!');
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(fullText)
            .then(() => showToast('🔗 تم نسخ رابط المشاركة بنجاح!'))
            .catch(() => showToast('❌ عذراً، لم نتمكن من النسخ.'));
    } else {
        // Ultimate fallback: display share text in alert or prompt
        window.prompt('انسخ نص المشاركة من هنا:', fullText);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
