import * as THREE from "three";

/* =========================
   1. العناصر الأساسية
========================= */

const container = document.getElementById("seoulScene");
const seoulScreen = document.getElementById("seoulScreen");

if (!container || !seoulScreen) {
    throw new Error("Seoul scene container was not found.");
}

/* =========================
   2. إنشاء المشهد
========================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color("#090d1c");
scene.fog = new THREE.Fog("#090d1c", 25, 75);

/* =========================
   سماء سيول الليلية
========================= */

// إنشاء خلفية متدرجة
const skyCanvas = document.createElement("canvas");
skyCanvas.width = 512;
skyCanvas.height = 512;

const skyCtx = skyCanvas.getContext("2d");

const skyGradient = skyCtx.createLinearGradient(0, 0, 0, 512);

skyGradient.addColorStop(0, "#080D24");
skyGradient.addColorStop(0.45, "#172344");
skyGradient.addColorStop(0.75, "#302344");
skyGradient.addColorStop(1, "#512B45");

skyCtx.fillStyle = skyGradient;
skyCtx.fillRect(0, 0, 512, 512);

const skyTexture = new THREE.CanvasTexture(skyCanvas);

// قبة السماء
const skyDome = new THREE.Mesh(
    new THREE.SphereGeometry(220, 32, 24),
    new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false
    })
);

skyDome.position.set(0, 0, -65);
scene.add(skyDome);

/* =========================
   النجوم المتلألئة
========================= */

const starGeometry = new THREE.BufferGeometry();

const starPositions = [];
const starSizes = [];
const starPhases = [];

for (let i = 0; i < 300; i++) {

    const x = (Math.random() - 0.5) * 120;
    const y = 19 + Math.random() * 48;
    const z = -45 - Math.random() * 135;

    starPositions.push(x, y, z);

    starSizes.push(0.8 + Math.random() * 1.2);
    starPhases.push(Math.random() * Math.PI * 2);
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xE8E5FF,
    size: 2.2,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.85
});

const stars = new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(stars);

/* =========================
   الهلال
========================= */

const moonCanvas = document.createElement("canvas");
moonCanvas.width = 256;
moonCanvas.height = 256;

const moonCtx = moonCanvas.getContext("2d");

// رسم الهلال
moonCtx.fillStyle = "#FFF0C9";
moonCtx.beginPath();
moonCtx.arc(128, 128, 75, 0, Math.PI * 2);
moonCtx.fill();

moonCtx.globalCompositeOperation = "destination-out";

moonCtx.beginPath();
moonCtx.arc(158, 100, 72, 0, Math.PI * 2);
moonCtx.fill();

moonCtx.globalCompositeOperation = "source-over";

const moonTexture = new THREE.CanvasTexture(moonCanvas);

const moon = new THREE.Sprite(
    new THREE.SpriteMaterial({
        map: moonTexture,
        transparent: true,
        depthWrite: false
    })
);

moon.position.set(-9, 19, -25);
moon.scale.set(5, 5, 1);

scene.add(moon);

/* =========================
   السحب الليلية
========================= */

function createCloud(x, y, z, scale) {

    const cloud = new THREE.Group();

    const cloudMaterial = new THREE.MeshBasicMaterial({
        color: 0x77718F,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        fog: false
    });

    const cloudParts = [
        [-1.2, 0, 0, 1.5],
        [0, 0.25, 0, 1.8],
        [1.2, 0, 0, 1.4],
        [0.2, -0.25, 0, 1.7]
    ];

    cloudParts.forEach(([px, py, pz, size]) => {

        const part = new THREE.Mesh(
            new THREE.SphereGeometry(size, 12, 8),
            cloudMaterial
        );

        part.position.set(px, py, pz);
        part.scale.set(1.4, 0.55, 0.5);

        cloud.add(part);
    });

    cloud.position.set(x, y, z);
    cloud.scale.setScalar(scale);

    scene.add(cloud);
}

// توزيع السحب بالقرب من مجال الرؤية
createCloud(-8, 16, -18, 1.5);
createCloud(8, 18, -32, 1.8);
createCloud(-10, 20, -48, 1.3);
createCloud(11, 16, -55, 1.4);

/* =========================
   3. الكاميرا
========================= */

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);

camera.position.set(0, 3.2, 14);
camera.lookAt(0, 1, -12);

/* =========================
   4. محرك الرسم
========================= */

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "low-power"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(1, 1);

container.appendChild(renderer.domElement);

/* =========================
   5. الإضاءة
========================= */

const ambientLight = new THREE.AmbientLight(0x8290c5, 1.5);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x9aafff, 1.2);
moonLight.position.set(-8, 15, 8);
scene.add(moonLight);

/* =========================
   6. الأرض والشارع
========================= */

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 110),
    new THREE.MeshStandardMaterial({
        color: 0x25283a,
        roughness: 0.95
    })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.08;
scene.add(ground);

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(8.5, 110),
    new THREE.MeshStandardMaterial({
        color: 0x151824,
        roughness: 0.9
    })
);

road.rotation.x = -Math.PI / 2;
road.position.y = -0.04;
scene.add(road);

const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0xc4b9a4
});

for (let z = 8; z >= -65; z -= 7) {
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.025, 2.5),
        lineMaterial
    );

    line.position.set(0, 0.01, z);
    scene.add(line);
}

/* =========================
   7. الأرصفة
========================= */

const sidewalkMaterial = new THREE.MeshStandardMaterial({
    color: 0x45465a,
    roughness: 0.9
});

for (const side of [-1, 1]) {
    const sidewalk = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.18, 110),
        sidewalkMaterial
    );

    sidewalk.position.set(side * 5.35, 0.02, -35);
    scene.add(sidewalk);
}

/* =========================
   أعمدة إنارة الشارع
========================= */

function createStreetLight(x, z, side) {

    const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x303344,
        roughness: 0.7
    });

    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.09, 4.2, 6),
        poleMaterial
    );

    pole.position.set(x, 2.1, z);
    scene.add(pole);

    const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.09, 0.09),
        poleMaterial
    );

    arm.position.set(x - side * 0.4, 4.05, z);
    scene.add(arm);

    const lampMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd98a
    });

    const lamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.16, 0.3),
        lampMaterial
    );

    lamp.position.set(x - side * 0.78, 3.95, z);
    scene.add(lamp);

    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 8, 6),
        new THREE.MeshBasicMaterial({
            color: 0xffc76d,
            transparent: true,
            opacity: 0.18
        })
    );

    glow.position.set(x - side * 0.78, 3.8, z);
    scene.add(glow);
}


for (const side of [-1, 1]) {
    for (const z of [7, -9, -25, -41, -57]) {
        createStreetLight(side * 4.8, z, side);
    }
}

/* =========================
   منصة حفلة عيد الميلاد
========================= */

function createPartyPlatform() {

    const platform = new THREE.Group();

    // القاعدة السفلية
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(7.5, 0.3, 7.5),
        new THREE.MeshStandardMaterial({
            color: 0x29243b,
            roughness: 0.8
        })
    );

    base.position.y = 0.15;
    platform.add(base);

    // سطح المنصة
    const top = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 0.12, 7.2),
        new THREE.MeshStandardMaterial({
            color: 0x493047,
            roughness: 0.75
        })
    );

    top.position.y = 0.36;
    platform.add(top);

    // حواف ذهبية
    const borderMaterial = new THREE.MeshBasicMaterial({
        color: 0xe8b879
    });

    for (const z of [-3.55, 3.55]) {

        const border = new THREE.Mesh(
            new THREE.BoxGeometry(7.3, 0.06, 0.07),
            borderMaterial
        );

        border.position.set(0, 0.44, z);
        platform.add(border);
    }

    for (const x of [-3.55, 3.55]) {

        const border = new THREE.Mesh(
            new THREE.BoxGeometry(0.07, 0.06, 7.3),
            borderMaterial
        );

        border.position.set(x, 0.44, 0);
        platform.add(border);
    }

    platform.position.set(0, 0, -66);

    scene.add(platform);
}

createPartyPlatform();

/* =========================
   صناديق هدايا عيد الميلاد
========================= */

function createGiftBox(x, z, color, ribbonColor, size = 1) {

    const gift = new THREE.Group();

    const bodyHeight = 0.65 * size;

    // جسم الصندوق
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.85 * size,
            bodyHeight,
            0.8 * size
        ),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.65
        })
    );

    body.position.y = bodyHeight / 2;
    gift.add(body);

    // غطاء الصندوق
    const lid = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.95 * size,
            0.17 * size,
            0.9 * size
        ),
        new THREE.MeshStandardMaterial({
            color: ribbonColor,
            roughness: 0.55
        })
    );

    lid.position.y = bodyHeight + 0.085 * size;
    gift.add(lid);

    // شريط عمودي
    const verticalRibbon = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.14 * size,
            bodyHeight + 0.18 * size,
            0.82 * size
        ),
        new THREE.MeshBasicMaterial({
            color: ribbonColor
        })
    );

    verticalRibbon.position.y = (bodyHeight + 0.18 * size) / 2;
    gift.add(verticalRibbon);

    // شريط علوي
    const horizontalRibbon = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.97 * size,
            0.08 * size,
            0.14 * size
        ),
        new THREE.MeshBasicMaterial({
            color: ribbonColor
        })
    );

    horizontalRibbon.position.y = bodyHeight + 0.18 * size;
    gift.add(horizontalRibbon);

    // عقدة الهدية
    for (const direction of [-1, 1]) {

        const bow = new THREE.Mesh(
            new THREE.TorusGeometry(
                0.13 * size,
                0.045 * size,
                6,
                10
            ),
            new THREE.MeshBasicMaterial({
                color: ribbonColor
            })
        );

        bow.position.set(
            direction * 0.11 * size,
            bodyHeight + 0.3 * size,
            0
        );

        gift.add(bow);
    }

    gift.position.set(x, 0.43, z);
    scene.add(gift);
}

// توزيع الهدايا حول المنصة
createGiftBox(-2.3, -64.1, 0x9e315d, 0xffd98a, 1.1);
createGiftBox(2.3, -64.3, 0x354c86, 0xf3dce8, 0.9);
createGiftBox(-2.4, -67.5, 0x873d70, 0xe8b879, 0.85);
createGiftBox(2.3, -67.4, 0xd47791, 0x76334e, 1.05);

/* =========================
   بالونات حفلة عيد الميلاد
========================= */

function createBalloon(x, z, color, size = 1, height = 1.5) {

    const balloon = new THREE.Group();

    // جسم البالون
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.38 * size, 12, 10),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.35,
            metalness: 0.05
        })
    );

    body.scale.set(0.85, 1.2, 0.85);
    body.position.y = height + 0.5;
    balloon.add(body);

    // عقدة البالون
    const knot = new THREE.Mesh(
        new THREE.ConeGeometry(0.09 * size, 0.17 * size, 6),
        new THREE.MeshStandardMaterial({
            color: color
        })
    );

    knot.rotation.x = Math.PI;
    knot.position.y = height + 0.07 * size;
    balloon.add(knot);

    // خيط البالون
    const string = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.008, 0.008, height - 0.55, 5
        ),
        new THREE.MeshBasicMaterial({
            color: 0xe8d9dc
        })
    );

    string.position.y = (height + 0.55) / 2 + 0.5;
    balloon.add(string);

    balloon.position.set(x, 0.43, z);
    scene.add(balloon);
}

// المجموعة اليسرى
createBalloon(-3.15, -63.5, 0xe879a5, 1.1, 1.65);
createBalloon(-3.45, -64.1, 0x873d70, 0.9, 2.25);
createBalloon(-2.95, -64.7, 0x526da9, 0.95, 2.05);
createBalloon(-3.5, -65.1, 0xffd98a, 0.85, 1.75);

// المجموعة اليمنى
createBalloon(3.15, -63.5, 0xb52d55, 1.05, 1.8);
createBalloon(3.45, -64.1, 0xf3dce8, 0.9, 2.3);
createBalloon(2.95, -64.7, 0x7050a0, 1, 2.05);
createBalloon(3.5, -65.1, 0xe879a5, 0.85, 1.7);

/* =========================
   زينة وإضاءة الحفلة
========================= */

function createPartyLights() {

    // السلسلة المنحنية بين العمودين
    const points = [
        new THREE.Vector3(-4.05, 4.05, -57),
        new THREE.Vector3(-2.7, 4.65, -57),
        new THREE.Vector3(-1.3, 4.95, -57),
        new THREE.Vector3(0, 5.05, -57),
        new THREE.Vector3(1.3, 4.95, -57),
        new THREE.Vector3(2.7, 4.65, -57),
        new THREE.Vector3(4.05, 4.05, -57)
    ];

    const curve = new THREE.CatmullRomCurve3(points);

    const wire = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 40, 0.025, 5, false),
        new THREE.MeshBasicMaterial({
            color: 0x8b7181
        })
    );

    scene.add(wire);

    // اللمبات الملونة
    const colors = [
        0xffd98a,
        0xff8fbd,
        0x9ebaff,
        0xf3dce8,
        0xe8a4ff
    ];

    for (let i = 0; i < 13; i++) {

        const t = (i + 0.5) / 13;
        const position = curve.getPoint(t);

        const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 10, 8),
            new THREE.MeshBasicMaterial({
                color: colors[i % colors.length]
            })
        );

        bulb.position.copy(position);
        scene.add(bulb);
    }

    // إضاءة ناعمة على الساحة
    const warmLight = new THREE.PointLight(
        0xffc0a0, 2.5, 12
    );

    warmLight.position.set(0, 3.5, -64);
    scene.add(warmLight);

    const pinkLight = new THREE.PointLight(
        0xe879b5, 1.8, 9
    );

    pinkLight.position.set(-2.5, 2.5, -66);
    scene.add(pinkLight);

    const blueLight = new THREE.PointLight(
        0x829fff, 1.5, 9
    );

    blueLight.position.set(2.5, 2.5, -66);
    scene.add(blueLight);
}

createPartyLights();

/* =========================
   لوحة عيد الميلاد الرئيسية
========================= */

function createPartyBanner() {

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");

    // الخلفية
    const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
    gradient.addColorStop(0, "#7B1938");
    gradient.addColorStop(0.5, "#49305F");
    gradient.addColorStop(1, "#263E78");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    // الإطار
    ctx.strokeStyle = "#F3DCE8";
    ctx.lineWidth = 14;
    ctx.strokeRect(22, 22, 980, 468);

    // العنوان
    ctx.textAlign = "center";

    ctx.fillStyle = "#F3DCE8";
    ctx.font = "bold 78px sans-serif";
    ctx.fillText("HAPPY BIRTHDAY", 512, 145);

    // الاسم
    ctx.fillStyle = "#FFD98A";
    ctx.font = "bold 125px sans-serif";
    ctx.fillText("YUKI", 512, 295);

    // العمر
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 58px sans-serif";
    ctx.fillText("SWEET 17", 512, 395);

    // نجوم صغيرة
    ctx.fillStyle = "#FFD98A";

    for (const [x, y] of [
        [110, 110], [900, 100],
        [150, 390], [870, 400]
    ]) {
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
    }
    // قلوب وزينة صغيرة
   ctx.font = "75px sans-serif";
   ctx.fillStyle = "#FFB6D2";
   ctx.fillText("♥", 180, 260);

   ctx.fillStyle = "#FFD98A";
   ctx.fillText("✦", 820, 260);

   // نجوم إضافية
   ctx.font = "38px sans-serif";
   ctx.fillStyle = "#FFFFFF";
   ctx.fillText("✧", 300, 130);
   ctx.fillText("✧", 720, 130);
   ctx.fillText("✦", 120, 300);
   ctx.fillText("✦", 900, 300);

    const texture = new THREE.CanvasTexture(canvas);

    const banner = new THREE.Mesh(
        new THREE.PlaneGeometry(5.5, 2.75),
        new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        })
    );

    banner.position.set(0, 3.7, -69.7);
    
    // عمودا تثبيت اللافتة
    const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8b879,
        metalness: 0.45,
        roughness: 0.4
    });

    for (const x of [-2.85, 2.85]) {

        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.07, 0.09, 5, 8),
            poleMaterial
        );

        pole.position.set(x, 2.5, -69.7);
        scene.add(pole);
    }

    scene.add(banner);
}

createPartyBanner();

/* =========================
   كعكة عيد الميلاد
========================= */

function createBirthdayCake() {

    const cake = new THREE.Group();

    // قاعدة الطاولة
    const tableBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.2, 0.75, 12),
        new THREE.MeshStandardMaterial({
            color: 0x493047,
            roughness: 0.6
        })
    );

    tableBase.position.y = 0.8;
    cake.add(tableBase);

    // سطح الطاولة
    const tableTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.85, 0.85, 0.13, 20),
        new THREE.MeshStandardMaterial({
            color: 0xe8b879,
            metalness: 0.25,
            roughness: 0.4
        })
    );

    tableTop.position.y = 1.2;
    cake.add(tableTop);

    // الطبقة السفلية
    const bottomLayer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 0.55, 20),
        new THREE.MeshStandardMaterial({
            color: 0xd47791,
            roughness: 0.55
        })
    );

    bottomLayer.position.y = 1.55;
    cake.add(bottomLayer);

    // الطبقة العلوية
    const topLayer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.43, 0.43, 0.4, 20),
        new THREE.MeshStandardMaterial({
            color: 0xf3dce8,
            roughness: 0.5
        })
    );

    topLayer.position.y = 2.02;
    cake.add(topLayer);

    // كريمة فوق الكعكة
    const cream = new THREE.Mesh(
        new THREE.CylinderGeometry(0.46, 0.46, 0.09, 20),
        new THREE.MeshStandardMaterial({
            color: 0xffb6d2
        })
    );

    cream.position.y = 2.26;
    cake.add(cream);

    // الشموع
    for (const x of [-0.2, 0, 0.2]) {

        const candle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, 0.38, 8),
            new THREE.MeshStandardMaterial({
                color: 0xffd98a
            })
        );

        candle.position.set(x, 2.49, 0);
        cake.add(candle);

        // اللهب
        const flame = new THREE.Mesh(
            new THREE.SphereGeometry(0.075, 8, 8),
            new THREE.MeshBasicMaterial({
                color: 0xffa52e
            })
        );

        flame.scale.set(0.7, 1.5, 0.7);
        flame.position.set(x, 2.75, 0);
        cake.add(flame);
    }

    cake.position.set(0, 0.43, -66);
    scene.add(cake);
}

createBirthdayCake();

/* =========================
   قصاصات متساقطة للحفلة
========================= */

const partyFallingPieces = [];

function createFallingConfetti() {

    const colors = [
        0xffd98a,
        0xe879a5,
        0x9ebaff,
        0xf3dce8,
        0xa879d4,
        0xb52d55
    ];

    for (let i = 0; i < 32; i++) {

        const piece = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.09,
                0.16,
                0.025
            ),
            new THREE.MeshBasicMaterial({
                color: colors[i % colors.length]
            })
        );

        piece.position.set(
            (Math.random() - 0.5) * 6,
            2 + Math.random() * 7,
            -66 + (Math.random() - 0.5) * 6
        );

        piece.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        piece.userData.speed = 1 + Math.random() * 1.5;
        piece.userData.spin = 1 + Math.random() * 3;

        partyFallingPieces.push(piece);
        scene.add(piece);
    }
}

createFallingConfetti();

/* =========================
   قصاصات مستقرة على الأرض
========================= */

function createGroundConfetti() {

    const colors = [
        0xffd98a,
        0xe879a5,
        0x9ebaff,
        0xf3dce8,
        0xa879d4,
        0xb52d55
    ];

    for (let i = 0; i < 35; i++) {

        const piece = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.08 + Math.random() * 0.08,
                0.025,
                0.07 + Math.random() * 0.05
            ),
            new THREE.MeshBasicMaterial({
                color: colors[i % colors.length]
            })
        );

        piece.position.set(
            (Math.random() - 0.5) * 6.5,
            0.51,
            -66 + (Math.random() - 0.5) * 6.5
        );

        piece.rotation.y = Math.random() * Math.PI;

        scene.add(piece);
    }
}

createGroundConfetti();

function createExtraPartyLighting() {

    const lights = [
        {
            color: 0xffc477,
            position: [0, 3.5, -65],
            intensity: 8
        },
        {
            color: 0xff65ad,
            position: [-3, 2.5, -66],
            intensity: 6
        },
        {
            color: 0x668cff,
            position: [3, 2.5, -66],
            intensity: 6
        }
    ];

    lights.forEach((item) => {

        // مصدر الضوء
        const light = new THREE.PointLight(
            item.color,
            item.intensity,
            18
        );

        light.position.set(...item.position);
        scene.add(light);

     
    });
}

createExtraPartyLighting();

let lastConfettiTime = 0;

function animatePartyConfetti(time) {

    const delta = lastConfettiTime
        ? Math.min((time - lastConfettiTime) / 1000, 0.05)
        : 0;

    lastConfettiTime = time;

    partyFallingPieces.forEach((piece) => {

        piece.position.y -= piece.userData.speed * delta;

        piece.rotation.x += piece.userData.spin * delta;
        piece.rotation.z += piece.userData.spin * delta;

        // عندما تصل للأرض تعود من الأعلى
        if (piece.position.y <= 0.5) {

            piece.position.y = 6 + Math.random() * 4;

            piece.position.x =
                (Math.random() - 0.5) * 6;

            piece.position.z =
                -66 + (Math.random() - 0.5) * 6;
        }
    });
}

/* =========================
   8. إنشاء المباني المطوّرة
========================= */

function createBuilding(x, z, height, color) {

    const width = 4.3;
    const depth = 9;

    const building = new THREE.Group();

    // جسم المبنى
    const buildingBody = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.85
        })
    );

    buildingBody.position.y = height / 2;
    building.add(buildingBody);

    // تحديد واجهة المبنى المواجهة للشارع
    const frontX = x < 0
        ? width / 2 + 0.025
        : -width / 2 - 0.025;
    
    // تحديد المباني التي تحتوي على محلات
    const hasShop =
        (x < 0 && z === 1) ||
        (x > 0 && z === -13) ||
        (x < 0 && z === -27);

    // ألوان النوافذ
    const windowColors = [
        0xffd98a,
        0xffc76d,
        0xa9c9ff,
        0x6d789e
    ];

    // النوافذ وإطاراتها
    const rows = Math.ceil((height - 3) / 2.1) + 1;
    const rowSpacing = (height - 3) / (rows - 1);

    for (let row = 0; row < rows; row++) {
    
        for (let column = 0; column < 3; column++) {
             
            if (!hasShop && row === 0 && column === 1) {
               continue;
            }

            const windowZ = -2.8 + column * 2.7;
            const windowY = 1.5 + row * rowSpacing;

            // إطار النافذة
            const frame = new THREE.Mesh(
                new THREE.BoxGeometry(0.09, 1.05, 1.15),
                new THREE.MeshStandardMaterial({
                    color: 0x171827,
                    roughness: 0.7
                })
            );

            frame.position.set(
                frontX,
                windowY,
                windowZ
            );

            building.add(frame);

            // زجاج النافذة
            const isLit = Math.random() > 0.3;

            const windowMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(0.85, 0.75),
                new THREE.MeshBasicMaterial({
                    color: isLit
                        ? windowColors[
                            Math.floor(Math.random() * 3)
                        ]
                        : 0x20283d
                })
            );

            windowMesh.position.set(
                frontX + (x < 0 ? 0.052 : -0.052),
                windowY,
                windowZ
            );

            windowMesh.rotation.y = x < 0
                ? Math.PI / 2
                : -Math.PI / 2;

            building.add(windowMesh);
        }
    }
    
    // أبواب مداخل المباني السكنية
if (!hasShop) {

    const doorFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 2.35, 1.45),
        new THREE.MeshStandardMaterial({
            color: 0x171522,
            roughness: 0.8
        })
    );

    doorFrame.position.set(
        frontX + (x < 0 ? 0.07 : -0.07),
        1.18,
        -0.1
    );

    building.add(doorFrame);

    // جسم الباب
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 2.15, 1.2),
        new THREE.MeshStandardMaterial({
            color: 0x63364d,
            roughness: 0.75
        })
    );

    door.position.set(
        frontX + (x < 0 ? 0.17 : -0.17),
        1.12,
        -0.1
    );

    building.add(door);

    // مقبض الباب
    const handle = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshStandardMaterial({
            color: 0xe5bd80,
            metalness: 0.6,
            roughness: 0.4
        })
    );

    handle.position.set(
        frontX + (x < 0 ? 0.25 : -0.25),
        1.05,
        0.32
    );

    building.add(handle);
}

    // حافة علوية للمبنى
    const roofEdge = new THREE.Mesh(
        new THREE.BoxGeometry(
            width + 0.25,
            0.25,
            depth + 0.25
        ),
        new THREE.MeshStandardMaterial({
            color: 0x242335,
            roughness: 0.8
        })
    );

    roofEdge.position.y = height + 0.12;
    building.add(roofEdge);

    // إضافة المبنى للمشهد
    building.position.set(x, 0, z);
    scene.add(building);
}

/* =========================
   9. توزيع المباني
========================= */

const buildings = [
    // المباني الرئيسية
    [-7.5, 1, 12, 0x302b42],
    [7.5, 1, 9, 0x292f46],
    [-7.5, -13, 10, 0x383047],
    [7.5, -13, 13, 0x292d43],
    [-7.5, -27, 14, 0x292d43],
    [7.5, -27, 11, 0x393047],

    // المباني الممتدة نحو الحفلة
    [-7.5, -41, 10, 0x30364d],
    [7.5, -41, 12, 0x383047],
    [-7.5, -54.5, 9, 0x29364a],
    [7.5, -54.5, 11, 0x423047]
];

buildings.forEach(([x, z, height, color]) => {
    createBuilding(x, z, height, color);
});

/* =========================
   لافتات المحلات الكورية
========================= */

function createKoreanSign(x, z, side, text, color) {

    const canvas = document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 160;

    const ctx = canvas.getContext("2d");

    // خلفية اللافتة
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 160);

    // إطار اللافتة
    ctx.strokeStyle = "#F3DCE8";
    ctx.lineWidth = 7;
    ctx.strokeRect(9, 9, 494, 142);

    // الكتابة الكورية
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 58px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 80);

    const texture = new THREE.CanvasTexture(canvas);

    const signMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });

    // جسم اللافتة
    const sign = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.9, 2.75),
        new THREE.MeshBasicMaterial({
            color: color
        })
    );

    sign.position.set(x, 3.50, z);
    scene.add(sign);

    // واجهة اللافتة
    const face = new THREE.Mesh(
        new THREE.PlaneGeometry(2.6, 0.8),
        signMaterial
    );

    face.position.set(
        x + (side === -1 ? 0.09 : -0.09),
        3.50,
        z
    );

    face.rotation.y = side === -1
        ? Math.PI / 2
        : -Math.PI / 2;

    scene.add(face);
}

/* =========================
   توزيع اللافتات
========================= */

const koreanSigns = [
    [-5.25, 1, -1, "카페", "#8B294D"],
    [5.25, -13, 1, "편의점", "#263E78"],
    [-5.25, -27, -1, "서울", "#6D315C"]
];

koreanSigns.forEach(([x, z, side, text, color]) => {
    createKoreanSign(x, z, side, text, color);
});

/* =========================
   واجهات المحلات الكورية
========================= */

function createShop(x, z, side, color) {

    const glassMaterial = new THREE.MeshBasicMaterial({
        color: color
    });
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x292333,
        roughness: 0.7
    });

    // الواجهة الزجاجية
    const glass = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 2.8, 3.8),
        glassMaterial
    );

    glass.position.set(x, 1.55, z);
    scene.add(glass);

    // إطار علوي
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.16, 4),
        frameMaterial
    );

    topFrame.position.set(x, 3, z);
    scene.add(topFrame);

    // إطار سفلي
    const bottomFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.16, 4),
        frameMaterial
    );

    bottomFrame.position.set(x, 0.15, z);
    scene.add(bottomFrame);

    // إطار جانبي
    for (const offset of [-1.95, 1.95]) {

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 2.8, 0.14),
            frameMaterial
        );

        frame.position.set(x, 1.55, z + offset);
        scene.add(frame);
    }
    
}

/* =========================
   رسمة واجهة المقهى
========================= */

function createCafeArtwork(x, z, side) {

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;

    const ctx = canvas.getContext("2d");

    // عنوان المقهى
    ctx.fillStyle = "#F3DCE8";
    ctx.font = "bold 100px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COFFEE", 512, 140);

    // خطوط زخرفية
    ctx.fillStyle = "#E89AB9";
    ctx.fillRect(180, 175, 664, 8);

    // بخار القهوة
    ctx.strokeStyle = "#F3DCE8";
    ctx.lineWidth = 13;
    ctx.lineCap = "round";

    for (const offset of [-65, 0, 65]) {
        ctx.beginPath();
        ctx.moveTo(512 + offset, 290);
        ctx.quadraticCurveTo(
            470 + offset,
            235,
            512 + offset,
            205
        );
        ctx.stroke();
    }

    // جسم الكوب
    ctx.fillStyle = "#F3DCE8";
    ctx.beginPath();
    ctx.roundRect(355, 300, 290, 230, 25);
    ctx.fill();

    // القهوة داخل الكوب
    ctx.fillStyle = "#704052";
    ctx.beginPath();
    ctx.ellipse(500, 310, 145, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // مقبض الكوب
    ctx.strokeStyle = "#F3DCE8";
    ctx.lineWidth = 35;
    ctx.beginPath();
    ctx.arc(660, 405, 65, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // قاعدة الكوب
    ctx.fillStyle = "#E89AB9";
    ctx.fillRect(385, 545, 230, 12);

    // عبارة صغيرة
    ctx.fillStyle = "#F3DCE8";
    ctx.font = "36px sans-serif";
    ctx.fillText("A LITTLE MOMENT OF JOY", 512, 650);

    const texture = new THREE.CanvasTexture(canvas);

    const artwork = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 2.3),
        new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );

    artwork.position.set(
        x + (side === -1 ? 0.09 : -0.09),
        1.55,
        z
    );

    artwork.rotation.y = side === -1
        ? Math.PI / 2
        : -Math.PI / 2;

    scene.add(artwork);
}
/* =========================
   رسمة واجهة المتجر
========================= */

function createStoreArtwork(x, z, side) {

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;

    const ctx = canvas.getContext("2d");

    // العنوان
    ctx.fillStyle = "#F3DCE8";
    ctx.font = "bold 85px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MINI MART", 512, 115);

    // الرفوف
    for (let row = 0; row < 3; row++) {

        const y = 230 + row * 145;

        ctx.fillStyle = "#E89AB9";
        ctx.fillRect(170, y + 90, 684, 12);

        // المنتجات
        const colors = [
            "#E8A64D",
            "#7FA6D9",
            "#D66C86",
            "#8CB58A",
            "#E9D9B5"
        ];

        for (let i = 0; i < 7; i++) {

            ctx.fillStyle = colors[(i + row) % colors.length];

            ctx.fillRect(
                195 + i * 95,
                y,
                65,
                85
            );
        }
    }

    // العبارة السفلية
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("OPEN 24/7", 512, 690);

    const texture = new THREE.CanvasTexture(canvas);

    const artwork = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 2.3),
        new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );

    artwork.position.set(
        x + (side === -1 ? 0.09 : -0.09),
        1.55,
        z
    );

    artwork.rotation.y = side === -1
        ? Math.PI / 2
        : -Math.PI / 2;

    scene.add(artwork);
}
/* =========================
   رسمة واجهة محل سيول
========================= */

function createSeoulArtwork(x, z, side) {

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;

    const ctx = canvas.getContext("2d");

    // العنوان
    ctx.fillStyle = "#F3DCE8";
    ctx.font = "bold 90px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SEOUL NIGHT", 512, 120);

    // النجوم
    ctx.fillStyle = "#E89AB9";

    for (const [sx, sy] of [
        [180, 210], [820, 220], [270, 350],
        [750, 370], [360, 190], [650, 200]
    ]) {
        ctx.beginPath();
        ctx.arc(sx, sy, 9, 0, Math.PI * 2);
        ctx.fill();
    }

    // مباني المدينة
    const buildings = [
        [180, 420, 130, 190],
        [330, 350, 150, 260],
        [510, 390, 140, 220],
        [680, 320, 160, 290]
    ];

    for (const [bx, by, bw, bh] of buildings) {

        ctx.fillStyle = "#39466B";
        ctx.fillRect(bx, by, bw, bh);

        ctx.fillStyle = "#F4C987";

        for (let wy = by + 25; wy < by + bh - 15; wy += 45) {
            for (let wx = bx + 20; wx < bx + bw - 15; wx += 40) {
                ctx.fillRect(wx, wy, 16, 20);
            }
        }
    }

    // خط سفلي
    ctx.fillStyle = "#E89AB9";
    ctx.fillRect(150, 635, 724, 8);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "38px sans-serif";
    ctx.fillText("A CITY FULL OF LIGHTS", 512, 700);

    const texture = new THREE.CanvasTexture(canvas);

    const artwork = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 2.3),
        new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );

    artwork.position.set(
        x + (side === -1 ? 0.09 : -0.09),
        1.55,
        z
    );

    artwork.rotation.y = side === -1
        ? Math.PI / 2
        : -Math.PI / 2;

    scene.add(artwork);
}

/* =========================
   توزيع المحلات
========================= */

createShop(-5.32, 1, -1, 0x70465d);
createShop(5.32, -13, 1, 0x405477);
createShop(-5.32, -27, -1, 0x59466f);
createCafeArtwork(-5.32, 1, -1);
createStoreArtwork(5.32, -13, 1);
createSeoulArtwork(-5.32, -27, -1);

/* =========================
   سيارات الشارع
========================= */

function createCar(x, z, color) {

    const car = new THREE.Group();

    // جسم السيارة
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.65, 3.5),
        new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.55,
            metalness: 0.25
        })
    );

    body.position.y = 0.75;
    car.add(body);

    // الجزء العلوي
    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, 0.65, 1.8),
        new THREE.MeshStandardMaterial({
            color: 0x283449,
            roughness: 0.35,
            metalness: 0.2
        })
    );

    cabin.position.set(0, 1.35, -0.15);
    car.add(cabin);

    // النوافذ الأمامية والخلفية
    const glassMaterial = new THREE.MeshBasicMaterial({
        color: 0x9bbbd0
    });

    for (const zOffset of [-0.95, 0.75]) {

        const window = new THREE.Mesh(
            new THREE.BoxGeometry(1.25, 0.42, 0.06),
            glassMaterial
        );

        window.position.set(0, 1.4, zOffset);
        car.add(window);
    }

    // العجلات
    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x15151c,
        roughness: 0.9
    });

    for (const side of [-1, 1]) {
        for (const zOffset of [-1.1, 1.1]) {

            const wheel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.38, 0.38, 0.22, 12),
                wheelMaterial
            );

            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(
                side * 0.92,
                0.42,
                zOffset
            );

            car.add(wheel);
        }
    }

    // المصابيح الأمامية
    const headlightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffedbd
    });

    for (const side of [-1, 1]) {

        const light = new THREE.Mesh(
            new THREE.BoxGeometry(0.38, 0.18, 0.08),
            headlightMaterial
        );

        light.position.set(side * 0.55, 0.82, -1.78);
        car.add(light);
    }

    // المصابيح الخلفية
    const rearLightMaterial = new THREE.MeshBasicMaterial({
        color: 0xff334f
    });

    for (const side of [-1, 1]) {

        const light = new THREE.Mesh(
            new THREE.BoxGeometry(0.38, 0.18, 0.08),
            rearLightMaterial
        );

        light.position.set(side * 0.55, 0.82, 1.78);
        car.add(light);
    }

    car.position.set(x, 0, z);
    scene.add(car);
}

/* توزيع السيارات */

createCar(-2.8, -7, 0x8b294d);
createCar(2.8, -38, 0x344b78);


/* =========================
   إعلان عيد الميلاد - الكعكة
========================= */

function createCakeBillboard(x, z, side) {

    // تصميم الإعلان
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 650;

    const ctx = canvas.getContext("2d");

    // الخلفية
    const gradient = ctx.createLinearGradient(0, 0, 900, 650);
    gradient.addColorStop(0, "#351326");
    gradient.addColorStop(0.5, "#7B1938");
    gradient.addColorStop(1, "#241321");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 650);

    // الإطار
    ctx.strokeStyle = "#F3DCE8";
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 860, 610);

    ctx.strokeStyle = "#E89AB9";
    ctx.lineWidth = 3;
    ctx.strokeRect(38, 38, 824, 574);

    // الزخارف العلوية
    ctx.fillStyle = "#E89AB9";

    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.arc(100 + i * 88, 95, 7, 0, Math.PI * 2);
        ctx.fill();
    }

    // النص العلوي
    ctx.fillStyle = "#F3DCE8";
    ctx.font = "bold 58px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("A SPECIAL DAY", 450, 175);

    // طبق الكعكة
    ctx.fillStyle = "#E89AB9";
    ctx.beginPath();
    ctx.ellipse(450, 500, 230, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // جسم الكعكة
    ctx.fillStyle = "#F3DCE8";
    ctx.beginPath();
    ctx.roundRect(270, 330, 360, 155, 25);
    ctx.fill();

    // طبقة الكريمة
    ctx.fillStyle = "#E89AB9";
    ctx.beginPath();
    ctx.moveTo(270, 350);
    ctx.lineTo(630, 350);
    ctx.lineTo(630, 385);

    for (let i = 0; i < 7; i++) {
        ctx.lineTo(600 - i * 55, 385 + (i % 2) * 25);
    }

    ctx.lineTo(270, 350);
    ctx.fill();

    // تفاصيل الكعكة
    ctx.fillStyle = "#A52D58";

    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.arc(300 + i * 38, 425 + (i % 2) * 12, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // الشموع
    for (let i = 0; i < 3; i++) {

        const candleX = 370 + i * 80;

        ctx.fillStyle = ["#E89AB9", "#FFFFFF", "#D6A8FF"][i];
        ctx.fillRect(candleX, 235, 18, 95);

        // اللهب
        ctx.fillStyle = "#FFD27A";
        ctx.beginPath();
        ctx.ellipse(candleX + 9, 220, 10, 18, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // النص السفلي
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 35px sans-serif";
    ctx.fillText("LET THE CELEBRATION BEGIN", 450, 570);

    // تحويل التصميم إلى Texture
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });

    // مجموعة اللوحة
    const board = new THREE.Group();

    // خلفية اللوحة
    const backing = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 2.5, 0.18),
        new THREE.MeshStandardMaterial({
            color: 0x351326,
            metalness: 0.3,
            roughness: 0.6
        })
    );

    backing.position.y = 3.2;
    board.add(backing);

    // واجهة الإعلان
    const face = new THREE.Mesh(
        new THREE.PlaneGeometry(3.25, 2.35),
        material
    );

    face.position.set(0, 3.2, 0.105);
    board.add(face);

    // العمود
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.13, 1.9, 8),
        new THREE.MeshStandardMaterial({
            color: 0x777080,
            metalness: 0.7,
            roughness: 0.4
        })
    );

    pole.position.y = 0.95;
    board.add(pole);

    // القاعدة
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.15, 0.9),
        new THREE.MeshStandardMaterial({
            color: 0x38313e
        })
    );

    base.position.y = 0.12;
    board.add(base);

    // توجيه الإعلان نحو الشارع
    board.rotation.y = side === -1
        ? Math.PI / 2
        : -Math.PI / 2;

    board.position.set(x, 0, z);

    scene.add(board);
}

// إضافة الإعلان الأول
createCakeBillboard(-5.65, -6, -1);

/* =========================
   إعلان عيد الميلاد - 17 YUKI
========================= */

function createYukiBillboard(x, z, side) {

    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 650;

    const ctx = canvas.getContext("2d");

    // الخلفية
    const gradient = ctx.createLinearGradient(0, 0, 900, 650);
    gradient.addColorStop(0, "#101C3D");
    gradient.addColorStop(0.5, "#263E78");
    gradient.addColorStop(1, "#351326");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 650);

    // الإطار
    ctx.strokeStyle = "#E89AB9";
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 860, 610);

    ctx.strokeStyle = "#F3DCE8";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 820, 570);

    // زخارف
    ctx.fillStyle = "#E89AB9";

    for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 / 18) * i;
        const px = 450 + Math.cos(angle) * 330;
        const py = 325 + Math.sin(angle) * 230;

        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // النص العلوي
    ctx.fillStyle = "#F3DCE8";
    ctx.font = "bold 46px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TODAY IS YOUR DAY", 450, 145);

    // الرقم 17
    ctx.shadowColor = "#E89AB9";
    ctx.shadowBlur = 35;

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 260px sans-serif";
    ctx.fillText("17", 450, 405);

    ctx.shadowBlur = 0;

    // الاسم
    ctx.fillStyle = "#E89AB9";
    ctx.font = "bold 90px sans-serif";
    ctx.fillText("YUKI", 450, 525);

    // الزخرفة السفلية
    ctx.fillStyle = "#F3DCE8";
    ctx.font = "30px sans-serif";
    ctx.fillText("NOVEMBER 10", 450, 580);

    // تحويل التصميم إلى Texture
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });

    const board = new THREE.Group();

    // خلفية اللوحة
    const backing = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 2.5, 0.18),
        new THREE.MeshStandardMaterial({
            color: 0x101C3D,
            metalness: 0.3,
            roughness: 0.6
        })
    );

    backing.position.y = 3.2;
    board.add(backing);

    // واجهة الإعلان
    const face = new THREE.Mesh(
        new THREE.PlaneGeometry(3.25, 2.35),
        material
    );

    face.position.set(0, 3.2, 0.105);
    board.add(face);

    // العمود
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.13, 1.9, 8),
        new THREE.MeshStandardMaterial({
            color: 0x777080,
            metalness: 0.7,
            roughness: 0.4
        })
    );

    pole.position.y = 0.95;
    board.add(pole);

    // القاعدة
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.15, 0.9),
        new THREE.MeshStandardMaterial({
            color: 0x38313e
        })
    );

    base.position.y = 0.12;
    board.add(base);

    // توجيه الإعلان نحو الشارع
    board.rotation.y = side === -1
        ? Math.PI / 2
        : -Math.PI / 2;

    board.position.set(x, 0, z);

    scene.add(board);
}

// إضافة الإعلان الثاني
createYukiBillboard(5.65, -19, 1);

/* =========================
   إعلان المشروب الكوري
========================= */

function createDrinkBillboard(x, z, side) {

    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 650;

    const ctx = canvas.getContext("2d");

    // الخلفية
    const gradient = ctx.createLinearGradient(0, 0, 900, 650);
    gradient.addColorStop(0, "#174D42");
    gradient.addColorStop(0.5, "#75BFA0");
    gradient.addColorStop(1, "#D6E878");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 650);

    // الإطار
    ctx.strokeStyle = "#F5F0D0";
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 860, 610);

    ctx.strokeStyle = "#E6F2A0";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 820, 570);

    // دوائر زخرفية
    for (let i = 0; i < 16; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#E6F2A0" : "#F5F0D0";

        ctx.beginPath();
        ctx.arc(
            90 + (i % 8) * 105,
            i < 8 ? 90 : 560,
            7,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // العنوان
    ctx.fillStyle = "#F5F0D0";
    ctx.textAlign = "center";
    ctx.font = "bold 68px sans-serif";
    ctx.fillText("FRESH MOMENT", 450, 175);

    // كوب المشروب
    ctx.fillStyle = "#F5F0D0";
    ctx.beginPath();
    ctx.roundRect(330, 245, 240, 270, 35);
    ctx.fill();

    // المشروب داخل الكوب
    ctx.fillStyle = "#A8D85B";
    ctx.beginPath();
    ctx.roundRect(345, 330, 210, 170, 25);
    ctx.fill();

    // غطاء الكوب
    ctx.fillStyle = "#E6F2A0";
    ctx.fillRect(315, 235, 270, 25);

    // المصاصة
    ctx.strokeStyle = "#F5F0D0";
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(480, 250);
    ctx.lineTo(530, 155);
    ctx.stroke();

    // شرائح الليمون
    for (let i = 0; i < 3; i++) {

        const lemonX = 390 + i * 65;
        const lemonY = 380 + (i % 2) * 55;

        ctx.fillStyle = "#E6F2A0";
        ctx.beginPath();
        ctx.arc(lemonX, lemonY, 23, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#F5F0D0";
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    // النص السفلي
    ctx.fillStyle = "#174D42";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText("SEOUL DRINKS", 450, 570);

    // تحويل التصميم إلى Texture
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });

    const board = new THREE.Group();

    // خلفية اللوحة
    const backing = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 2.5, 0.18),
        new THREE.MeshStandardMaterial({
            color: 0x174D42,
            metalness: 0.3,
            roughness: 0.6
        })
    );

    backing.position.y = 3.2;
    board.add(backing);

    // واجهة الإعلان
    const face = new THREE.Mesh(
        new THREE.PlaneGeometry(3.25, 2.35),
        material
    );

    face.position.set(0, 3.2, 0.105);
    board.add(face);

    // العمود
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.13, 1.9, 8),
        new THREE.MeshStandardMaterial({
            color: 0x777080,
            metalness: 0.7,
            roughness: 0.4
        })
    );

    pole.position.y = 0.95;
    board.add(pole);

    // القاعدة
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.15, 0.9),
        new THREE.MeshStandardMaterial({
            color: 0x38313e
        })
    );

    base.position.y = 0.12;
    board.add(base);

    // توجيه الإعلان نحو الشارع
    board.rotation.y = side === -1
        ? Math.PI / 2
        : -Math.PI / 2;

    board.position.set(x, 0, z);

    scene.add(board);
}

// إضافة الإعلان
createDrinkBillboard(-5.65, -34, -1);

/* =========================
   لوحة اتجاه حفلة يوكِي
========================= */

function createPartyDirectionBillboard(x, z, side) {

    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 650;

    const ctx = canvas.getContext("2d");

    // الخلفية البرتقالية
    const gradient = ctx.createLinearGradient(0, 0, 900, 650);
    gradient.addColorStop(0, "#713B25");
    gradient.addColorStop(0.5, "#B86F3F");
    gradient.addColorStop(1, "#E0A66D");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 650);

    // الإطار
    ctx.strokeStyle = "#FFE0A8";
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 860, 610);

    ctx.strokeStyle = "#FFF3DC";
    ctx.lineWidth = 3;
    ctx.strokeRect(42, 42, 816, 566);

    // زخارف النجوم
    ctx.fillStyle = "#FFE0A8";

    for (let i = 0; i < 12; i++) {
        const px = 100 + (i % 6) * 140;
        const py = i < 6 ? 90 : 555;

        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // النص الرئيسي
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFF3DC";
    ctx.font = "bold 66px sans-serif";
    ctx.fillText("BIRTHDAY PARTY", 450, 180);

    // اسم يوكِي
    ctx.fillStyle = "#FFE0A8";
    ctx.font = "bold 78px sans-serif";
    ctx.fillText("YUKI'S 17TH", 450, 300);

    // السهم باتجاه اليسار
    ctx.fillStyle = "#FFF3DC";

    ctx.beginPath();
    ctx.moveTo(720, 390);
    ctx.lineTo(250, 390);
    ctx.lineTo(250, 340);
    ctx.lineTo(130, 440);
    ctx.lineTo(250, 540);
    ctx.lineTo(250, 490);
    ctx.lineTo(720, 490);
    ctx.closePath();
    ctx.fill();

    // الكتابة السفلية
    ctx.fillStyle = "#FFE0A8";
    ctx.font = "bold 29px sans-serif";
    ctx.fillText("FOLLOW THE LIGHTS", 450, 585);

    // تحويل التصميم إلى Texture
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });

    const board = new THREE.Group();

    // خلفية اللوحة
    const backing = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 2.5, 0.18),
        new THREE.MeshStandardMaterial({
            color: 0x713B25,
            metalness: 0.4,
            roughness: 0.5
        })
    );

    backing.position.y = 3.2;
    board.add(backing);

    // واجهة الإعلان
    const face = new THREE.Mesh(
        new THREE.PlaneGeometry(3.25, 2.35),
        material
    );

    face.position.set(0, 3.2, 0.105);
    board.add(face);

    // العمود
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.13, 1.9, 8),
        new THREE.MeshStandardMaterial({
            color: 0x777080,
            metalness: 0.7,
            roughness: 0.4
        })
    );

    pole.position.y = 0.95;
    board.add(pole);

    // القاعدة
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.15, 0.9),
        new THREE.MeshStandardMaterial({
            color: 0x38313e
        })
    );

    base.position.y = 0.12;
    board.add(base);

    // توجيه الإعلان نحو الشارع
    board.rotation.y = side === -1
        ? Math.PI / 2
        : -Math.PI / 2;

    board.position.set(x, 0, z);

    scene.add(board);
}

// إضافة لوحة الحفلة
createPartyDirectionBillboard(5.65, -48, 1);

/* =========================
   أحواض النباتات على الأرصفة
========================= */

function createPlanter(x, z) {

    const planter = new THREE.Group();

    // جسم الحوض
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.55, 1.4),
        new THREE.MeshStandardMaterial({
            color: 0x34313e,
            roughness: 0.9
        })
    );

    box.position.y = 0.32;
    planter.add(box);

    // التربة
    const soil = new THREE.Mesh(
        new THREE.BoxGeometry(0.94, 0.08, 1.22),
        new THREE.MeshStandardMaterial({
            color: 0x30251f
        })
    );

    soil.position.y = 0.62;
    planter.add(soil);

    // النباتات
    const leafColors = [
        0x477653,
        0x568b62,
        0x315c49
    ];

    for (let i = 0; i < 5; i++) {

        const leaf = new THREE.Mesh(
            new THREE.IcosahedronGeometry(
                0.28 + Math.random() * 0.12,
                1
            ),
            new THREE.MeshStandardMaterial({
                color: leafColors[i % leafColors.length],
                roughness: 0.9
            })
        );

        leaf.position.set(
            (Math.random() - 0.5) * 0.7,
            0.9 + Math.random() * 0.25,
            (Math.random() - 0.5) * 0.9
        );

        leaf.scale.y = 1.4;

        planter.add(leaf);
    }

    planter.position.set(x, 0, z);
    scene.add(planter);
}

// توزيع الأحواض على جانبي الشارع
createPlanter(-5.5, -20);
createPlanter(5.5, -6);
createPlanter(-5.5, -47.5);
createPlanter(5.5, -34);

/* =========================
   تفاصيل بلاط الأرصفة والحواف
========================= */

// مواد البلاط
const tileLineMaterial = new THREE.MeshBasicMaterial({
    color: 0x666579,
    transparent: true,
    opacity: 0.55
});

const curbMaterial = new THREE.MeshStandardMaterial({
    color: 0x777486,
    roughness: 0.85
});

// تفاصيل جانبي الشارع
for (const side of [-1, 1]) {

    // حافة الرصيف المرتفعة
    const curb = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.12, 110),
        curbMaterial
    );

    curb.position.set(side * 4.25, 0.14, -35);
    scene.add(curb);

    // فاصل طولي في البلاط
    const longLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.015, 110),
        tileLineMaterial
    );

    longLine.position.set(side * 5.35, 0.12, -35);
    scene.add(longLine);

    // فواصل عرضية بين قطع البلاط
    for (let z = 16; z >= -86; z -= 3.5) {

        const tileLine = new THREE.Mesh(
            new THREE.BoxGeometry(2.12, 0.015, 0.035),
            tileLineMaterial
        );

        tileLine.position.set(
            side * 5.35,
            0.12,
            z
        );

        scene.add(tileLine);
    }
}

/* =========================
   10. تغيير حجم المشهد
========================= */

function resizeScene() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

const resizeObserver = new ResizeObserver(resizeScene);
resizeObserver.observe(container);

/* =========================
   12. مفرقعات السماء الجانبية
========================= */

const sideFireworks = [];

function createSideFirework(x, z, delay) {

    const colors = [
        0xffd98a,
        0xe879a5,
        0x9ebaff,
        0xf3dce8,
        0xa879d4,
        0xff536b
    ];

    const particleCount = 75;

    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const particleColors = [];

    for (let i = 0; i < particleCount; i++) {

        const color = new THREE.Color(
            colors[Math.floor(Math.random() * colors.length)]
        );

        particleColors.push(color.r, color.g, color.b);

        velocities.push({
            x: (Math.random() - 0.5) * 9,
            y: (Math.random() - 0.5) * 9,
            z: (Math.random() - 0.5) * 5
        });
    }

    geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(particleColors, 3)
    );

    const particles = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            sizeAttenuation: true
        })
    );

    particles.frustumCulled = false;
    scene.add(particles);

    // الصاروخ الضوئي
    const rocket = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({
            color: 0xffd98a
        })
    );

    scene.add(rocket);

    const firework = {
        x,
        z,
        delay,
        elapsed: -delay,
        exploded: false,
        burstY: 11,
        particles,
        rocket,
        velocities,
        geometry,
        positions,
        duration: 2.2
    };

    sideFireworks.push(firework);
}

// مفرقعة اليسار
createSideFirework(-8.5, -82, 0);

// مفرقعة اليمين
createSideFirework(8.5, -82, 1.2);


/* =========================
   تحريك المفرقعات
========================= */

let lastFireworkTime = 0;

function animateSideFireworks(time) {

    const delta = lastFireworkTime
        ? Math.min((time - lastFireworkTime) / 1000, 0.05)
        : 0;

    lastFireworkTime = time;

    sideFireworks.forEach(firework => {

        firework.elapsed += delta;

        // إعادة دورة المفرقعة
        if (firework.elapsed > 5.5) {

            firework.elapsed = 0;
            firework.exploded = false;

            firework.particles.material.opacity = 0;
            firework.rocket.visible = true;

            firework.rocket.position.set(
                firework.x,
                2,
                firework.z
            );
        }

        if (firework.elapsed < 0) return;

        // مرحلة الصعود
        if (firework.elapsed < 1.1) {

            const progress = firework.elapsed / 1.1;

            firework.rocket.position.set(
                firework.x,
                2 + progress * firework.burstY,
                firework.z
            );

        }

        // لحظة الانفجار
        else if (!firework.exploded) {

            firework.exploded = true;
            firework.rocket.visible = false;

            const positions = firework.positions;

            for (let i = 0; i < firework.velocities.length; i++) {

                positions[i * 3] = firework.x;

                positions[i * 3 + 1] =
                    2 + firework.burstY;

                positions[i * 3 + 2] = firework.z;
            }

            firework.geometry.attributes.position.needsUpdate = true;

            firework.particles.material.opacity = 1;
        }

        // انتشار الشرارات
        if (firework.exploded) {

            const age = firework.elapsed - 1.1;

            const positions = firework.positions;

            for (let i = 0; i < firework.velocities.length; i++) {

                const velocity = firework.velocities[i];

                positions[i * 3] =
                    firework.x + velocity.x * age;

                positions[i * 3 + 1] =
                    2 + firework.burstY +
                    velocity.y * age -
                    2.5 * age * age;

                positions[i * 3 + 2] =
                    firework.z + velocity.z * age;
            }

            firework.geometry.attributes.position.needsUpdate = true;

            firework.particles.material.opacity =
                Math.max(0, 1 - age / firework.duration);
        }

    });
}

/* =========================
   المفرقعة المركزية
   HAPPY BIRTHDAY
========================= */

let birthdayFirework = null;

function createBirthdayFirework() {

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 105px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HAPPY BIRTHDAY", 512, 128);

    const image = ctx.getImageData(
        0, 0, 1024, 256
    ).data;

    const targets = [];

    for (let y = 0; y < 256; y += 4) {
        for (let x = 0; x < 1024; x += 4) {

            const alpha = image[(y * 1024 + x) * 4 + 3];

            if (alpha > 100) {

                targets.push({
                    x: (x / 1024 - 0.5) * 11,
                    y: 13 + (0.5 - y / 256) * 2.8
                });

            }
        }
    }

    const positions = new Float32Array(targets.length * 3);
    const colors = [];

    const palette = [
        0xffd98a,
        0xe879a5,
        0xf3dce8,
        0x9ebaff,
        0xa879d4
    ];

    targets.forEach((target, i) => {

        positions[i * 3] = 0;
        positions[i * 3 + 1] = 2;
        positions[i * 3 + 2] = -82;

        const color = new THREE.Color(
            palette[Math.floor(Math.random() * palette.length)]
        );

        colors.push(color.r, color.g, color.b);

    });

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
    );

    const particles = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            toneMapped: false
        })
    );

    particles.frustumCulled = false;
    scene.add(particles);

    const rocket = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshBasicMaterial({
            color: 0xffd98a,
            toneMapped: false
        })
    );

    rocket.position.set(0, 2, -82);
    scene.add(rocket);

    birthdayFirework = {
        targets,
        positions,
        geometry,
        particles,
        rocket,
        elapsed: 0,
        active: false,
        completed: false
    };
}

createBirthdayFirework();


/* =========================
   تحريك الكتابة النارية
========================= */

function animateBirthdayFirework(delta) {

    const firework = birthdayFirework;

    if (!firework || firework.completed) return;

    firework.elapsed += delta;

    const t = firework.elapsed;

    // صعود الصاروخ
    if (t < 1.2) {

        firework.rocket.position.y =
            2 + (t / 1.2) * 13;

        return;
    }

    // بداية تشكل الكتابة
    firework.rocket.visible = false;
    firework.active = true;

    const appearance = Math.min((t - 1.2) / 1.8, 1);

    const smooth = appearance * appearance * (3 - 2 * appearance);

    const positions = firework.positions;

    firework.targets.forEach((target, i) => {

        positions[i * 3] =
            target.x * smooth;

        positions[i * 3 + 1] =
            15 + (target.y - 15) * smooth;

        positions[i * 3 + 2] = -82;

    });

    firework.geometry.attributes.position.needsUpdate = true;

    // ظهور ثم اختفاء الكتابة
    let opacity = 1;

    if (t > 5) {
        opacity = Math.max(0, 1 - (t - 5) / 2);
    }

    firework.particles.material.opacity = opacity;

    if (t >= 7) {
        firework.completed = true;
        firework.particles.visible = false;
        firework.rocket.visible = false;
    }
}

/* =========================
   11. حركة الوصول النهائية
========================= */

let startTime = null;
let lastBirthdayTime = 0;

const travelDuration = 24000;

const startingZ = 14;
const endingZ = -50;

const startingTargetZ = -12;
const endingTargetZ = -76;

function animate(time) {

    if (startTime === null) {
        startTime = time;
    }

    const elapsed = Math.min(
        time - startTime,
        travelDuration
    );

    const progress = elapsed / travelDuration;

    // حركة ناعمة
    const smoothProgress =
        progress * progress * (3 - 2 * progress);

    // تحريك الكاميرا للأمام
    camera.position.z =
        startingZ -
        (startingZ - endingZ) * smoothProgress;

    // تحريك نقطة نظر الكاميرا معها
    const targetZ =
        startingTargetZ -
        (startingTargetZ - endingTargetZ) * smoothProgress;

    camera.lookAt(0, 1, targetZ);

    // تلألؤ النجوم
    starMaterial.opacity =
        0.75 + Math.sin(time * 0.0015) * 0.15;

    starMaterial.size =
        2.2 + Math.sin(time * 0.002) * 0.3;

    // حركة قصاصات الحفلة
    animatePartyConfetti(time);

    // المفرقعات الجانبية
    animateSideFireworks(time);

    // حساب وقت المفرقعة المركزية
    const birthdayDelta = lastBirthdayTime
        ? Math.min((time - lastBirthdayTime) / 1000, 0.05)
        : 0;

    lastBirthdayTime = time;

    // المفرقعة المركزية
    if (elapsed >= travelDuration) {
        animateBirthdayFirework(birthdayDelta);
    
    }
    renderer.render(scene, camera);
}

/* =========================
   12. تشغيل المشهد عند ظهوره
========================= */

const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            resizeScene();
            startTime = null;
            renderer.setAnimationLoop(animate);
        } else {
            renderer.setAnimationLoop(null);
        }
    });
}, {
    threshold: 0.05
});

visibilityObserver.observe(seoulScreen);
