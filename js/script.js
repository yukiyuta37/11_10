// =========================
// 1. إعدادات العد التنازلي
// =========================

const unlockDate = new Date("2026-11-13T01:00+02:00");


// =========================
// 2. عناصر الشاشات
// =========================

const welcomeScreen = document.getElementById("welcomeScreen");
const countdownScreen = document.getElementById("countdownScreen");
const unlockedScreen = document.getElementById("unlockedScreen");
const worldScreen = document.getElementById("worldScreen");
const messageScreen = document.getElementById("messageScreen");
const memoriesScreen = document.getElementById("memoriesScreen");
const apologyTransition = document.getElementById("apologyTransition");
const apologyScreen = document.getElementById("apologyScreen");
const questionsScreen = document.getElementById("questionsScreen");
const seoulTransition = document.getElementById("seoulTransition");
const seoulScreen = document.getElementById("seoulScreen");
const birthdayMusic = document.getElementById("birthdayMusic");

// =========================
// 3. عناصر العد التنازلي
// =========================

const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");


// =========================
// 4. أزرار التنقل
// =========================

const openButton = document.getElementById("openButton");
const enterWorldButton = document.getElementById("enterWorldButton");
const openMessageButton = document.getElementById("openMessageButton");
const memoriesNextButton = document.getElementById("memoriesNextButton");
const questionsNextButton = document.getElementById("questionsNextButton");
const apologyTransitionButton = document.getElementById("apologyTransitionButton");
const apologyContinueButton = document.getElementById("apologyContinueButton");
const visitSeoulButton = document.getElementById("visitSeoulButton");


// =========================
// 5. عناصر الفراشة والظرف
// =========================

const butterfly = document.getElementById("butterfly");
const butterflyHint = document.getElementById("butterflyHint");
const openEnvelopeButton = document.getElementById("openEnvelopeButton");
const envelope = document.getElementById("envelope");
const envelopeStage = document.getElementById("envelopeStage");


// =========================
// 6. التنقل بين الشاشات
// =========================

openButton.addEventListener("click", function () {

    birthdayMusic.volume = 0.5;
    birthdayMusic.play().catch(error => console.log("Music playback failed:", error));

    welcomeScreen.classList.add("screen-leaving");

    setTimeout(function () {
        welcomeScreen.hidden = true;
        welcomeScreen.classList.remove("screen-leaving");

        countdownScreen.hidden = false;
        countdownScreen.classList.add("screen-entering");

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                countdownScreen.classList.remove("screen-entering");
            });
        });

        updateCountdown();
    }, 700);

});

// اختصار الاختبار T

document.addEventListener("keydown", function (event) {

    if (event.key.toLowerCase() === "t") {

        // إيقاف العد التنازلي أثناء الاختبار
        clearInterval(countdownInterval);
        countdownInterval = null;

        welcomeScreen.hidden = true;
        countdownScreen.hidden = true;
        unlockedScreen.hidden = false;

    }

});


enterWorldButton.addEventListener("click", function () {
    unlockedScreen.hidden = true;
    worldScreen.hidden = false;
});


openMessageButton.addEventListener("click", function () {

    worldScreen.hidden = true;
    messageScreen.hidden = false;

    setTimeout(function () {
        butterfly.classList.add("fly");
    }, 2000);

});

// =========================
// 7. تحديث العد التنازلي
// =========================

let countdownInterval;

function updateCountdown() {

    const now = new Date();
    const difference = unlockDate - now;

    // إذا انتهى الموعد
    if (difference <= 0) {

        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";

        clearInterval(countdownInterval);
        countdownInterval = null;

        countdownScreen.classList.add("screen-leaving");

        setTimeout(function () {

            countdownScreen.hidden = true;
            countdownScreen.classList.remove("screen-leaving");

            unlockedScreen.hidden = false;
            unlockedScreen.classList.add("screen-entering");

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    unlockedScreen.classList.remove("screen-entering");
                });
            });

        }, 700);

        return;
    }

    // إذا لم ينتهِ الموعد بعد
    countdownScreen.hidden = false;
    unlockedScreen.hidden = true;

    const totalSeconds = Math.floor(difference / 1000);

    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    days.textContent = String(d).padStart(2, "0");
    hours.textContent = String(h).padStart(2, "0");
    minutes.textContent = String(m).padStart(2, "0");
    seconds.textContent = String(s).padStart(2, "0");

    // تشغيل المؤقت إذا لم يكن يعمل
    if (!countdownInterval) {
        countdownInterval = setInterval(updateCountdown, 1000);
    }

}

// =========================
// 8. حركة الفراشة
// =========================

openEnvelopeButton.disabled = true;

butterfly.addEventListener("animationend", function (event) {

    if (event.animationName !== "butterflyFlight") return;

    butterfly.classList.add("arrived");
    butterfly.classList.remove("fly");

    openEnvelopeButton.style.visibility = "visible";

    requestAnimationFrame(function () {
        openEnvelopeButton.style.opacity = "1";
    });

    butterflyHint.hidden = false;
    openEnvelopeButton.disabled = false;

});


// =========================
// 9. فتح الظرف والرسالة
// =========================

openEnvelopeButton.addEventListener("click", function () {

    if (openEnvelopeButton.disabled) return;

    openEnvelopeButton.disabled = true;
    openEnvelopeButton.hidden = true;

    butterfly.classList.add("to-side");
    butterflyHint.hidden = true;

    envelope.classList.add("open");
    envelopeStage.classList.add("opening");

    setTimeout(function () {

        envelopeStage.classList.add("letter-revealed");

        // =========================
        // إظهار رسالة عيد الميلاد
        // =========================

        const letterContent = document.getElementById("letterContent");

        letterContent.innerHTML = `
            <h2 class="letter-greeting">HAPPY BIRTHDAY YUKI 🥳</h2>

            <p>
                عيد ميلاد سعيد يوكي واحلى يوم بالسنه عيد ميلادك يوكي،
                عيد ميلااادد سعيد ليمونه!
                كل عام وانتي بخير وعقبال الميه سنه يا ست زنجبيله.
            </p>

            <p>
                يا رب تكوني بخير وهتنجحي يفندم وهتسوي اي شغله بدك اياها،
                تذكري انه لسه بالطريق وهتوصلي لشو بدك
                وما تنسي تحافظي على نفسك.
            </p>

            <p>
                وهتتعوضي وكل شيء هيصير بخير،
                وفخور فيكي يوكي والحمد الله اني عرفتك
                لانك افضل شخص واغلى شخص عندي والله.
            </p>

            <p>
                وهضل معك ما هتركك يوكي،
                وذا بس البدايه لسه في قصص ومغامرات كثير اشياء نسويهم،
                واكون معك باي شغله حزن او سعاده او غضب.
            </p>

            <p>
                بس تذكري انك مش لوحدك يوكي،
                ومن اليوم ذا هترجعي تحتفلي بعيد ميلادك
                وكل سنه هيكون احلى من السنه اللي قبلها.
            </p>

            <p>
                يوكي يا رب يحفظك لي بخير ويطيل بعمرك يوكي
                وتنجحي ويشفيك يوكي،
                عيد ميلاد سعيد وكل عام وانتي بخير ♥
            </p>
        `;

        // ظهور النص بعد استقرار الورقة
        setTimeout(function () {
            letterContent.classList.add("letter-text-visible");
        }, 1100);


        // =========================
        // زر الانتقال للذكريات
        // =========================

        setTimeout(function () {
            memoriesNextButton.classList.add("visible");
        }, 40000);


        // =========================
        // تلميحات الفراشة
        // =========================

        setTimeout(function () {

            const phrases = [
                "𝑆𝑚𝑖𝑙𝑒 𝑌𝑢𝑘𝑖",
                "웃어, 유키!",
                "笑って、ユキ！",
                "ابتسمي يوكي",
                "笑一笑，由纪！"
            ];

            let phraseIndex = 0;

            butterflyHint.textContent = phrases[phraseIndex];
            butterflyHint.hidden = false;
            butterflyHint.classList.add("bubble-visible");

            setInterval(function () {

                butterflyHint.style.opacity = "0";

                setTimeout(function () {

                    phraseIndex = (phraseIndex + 1) % phrases.length;

                    butterflyHint.textContent = phrases[phraseIndex];
                    butterflyHint.style.opacity = "1";

                }, 500);

            }, 3000);

        }, 700);

    }, 1200);

});


// =========================
// 10. قسم الذكريات
// =========================

const memoryPhotos = document.querySelectorAll(".memory-photo");


memoriesNextButton.addEventListener("click", function () {

    messageScreen.hidden = true;
    memoriesScreen.hidden = false;

    startMemoriesIntro();

});


// الانتقال من الذكريات إلى مفاجأة الاعتذار

questionsNextButton.addEventListener("click", function () {

    memoriesScreen.hidden = true;
    apologyTransition.hidden = false;

    requestAnimationFrame(function () {
        apologyTransition.classList.add("transition-show");
    });

});


// الانتقال من شاشة المفاجأة إلى رسالة الاعتذار

apologyTransitionButton.addEventListener("click", function () {

    if (apologyTransitionButton.disabled) return;

    apologyTransitionButton.disabled = true;

    apologyTransition.classList.add("transition-leave");

    setTimeout(function () {

        apologyTransition.hidden = true;

        apologyTransition.classList.remove(
            "transition-show",
            "transition-leave"
        );

        apologyTransitionButton.disabled = false;

        apologyScreen.hidden = false;

    }, 1000);

});


// الانتقال من رسالة الاعتذار إلى الأسئلة

apologyContinueButton.addEventListener("click", function () {

    apologyScreen.hidden = true;
    questionsScreen.hidden = false;

});


// =========================
// 11. عنوان الذكريات
// =========================

function startMemoriesIntro() {

    const memoriesTitle = document.getElementById("memoriesTitle");

    const introText = "Little moments, kept forever.";

    memoriesTitle.textContent = "";

    let index = 0;

    const typing = setInterval(function () {

        memoriesTitle.textContent += introText[index];

        index++;

        if (index >= introText.length) {

            clearInterval(typing);

            setTimeout(function () {

                const deleting = setInterval(function () {

                    memoriesTitle.textContent =
                        memoriesTitle.textContent.slice(0, -1);

                    if (memoriesTitle.textContent.length === 0) {

                        clearInterval(deleting);

                        setTimeout(function () {
                            startMemoryPhotos();
                        }, 500);

                    }

                }, 65);

            }, 1800);

        }

    }, 100);

}


// =========================
// 12. ظهور الصور وحركة القطة
// =========================

function startMemoryPhotos() {

    memoryPhotos.forEach(function (photo, index) {

        setTimeout(function () {
            photo.classList.add("drop-in");
        }, index * 1500);

    });


    const catStage = document.getElementById("catStage");
    const catBubble = document.getElementById("catBubble");


    // دخول القطة وجلوسها

    catStage.addEventListener("animationend", function (event) {

        if (event.animationName !== "catWalkIn") return;

        catStage.classList.add("cat-seated");


        // ظهور فقاعة الكلام

        setTimeout(function () {

            catBubble.textContent =
                "Happy Birthday, Yuki! I'll stay with you. ♡";

            catBubble.hidden = false;
            catBubble.classList.add("bubble-visible");


            // ظهور زر الانتقال بعد 7 ثوانٍ

            setTimeout(function () {

                questionsNextButton.classList.add("visible");

            }, 7000);

        }, 900);

    }, { once: true });


    catStage.classList.add("cat-enter");

}


// =========================
// 13. عارض الصور
// =========================

const photoViewerClose = document.getElementById("photoViewerClose");
const photoBackdrop = document.getElementById("photoBackdrop");
const photoViewer = document.getElementById("photoViewer");
const photoViewerImage = document.getElementById("photoViewerImage");
const photoViewerCaption = document.getElementById("photoViewerCaption");


// فتح الصورة عند الضغط عليها

document.querySelectorAll(".memory-photo img").forEach(function (img) {

    img.addEventListener("click", function () {

        photoViewerImage.src = img.src;
        photoViewerCaption.textContent = img.alt;

        photoBackdrop.classList.add("visible");

    });

});


// إغلاق عارض الصور

function closePhotoViewer() {

    if (photoBackdrop) {
        photoBackdrop.classList.remove("visible");
    }

}


if (photoViewerClose) {

    photoViewerClose.addEventListener("click", closePhotoViewer);

}


if (photoBackdrop) {

    photoBackdrop.addEventListener("click", function (event) {

        if (event.target === photoBackdrop) {
            closePhotoViewer();
        }

    });

}


if (photoViewer) {

    photoViewer.addEventListener("click", function (event) {
        event.stopPropagation();
    });

}


// الإغلاق بزر Escape

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closePhotoViewer();
    }

});

// =========================
// 14. قسم الأسئلة
// =========================


// تمدد خانات الإجابة تلقائيًا

const answerBoxes = document.querySelectorAll(
    ".question-card textarea"
);

answerBoxes.forEach(function (box) {

    box.addEventListener("input", function () {

        box.style.height = "auto";
        box.style.height = box.scrollHeight + "px";

    });

});


// اختيار إجابة السؤال الرابع

const foodChoice = document.getElementById("foodChoice");

document.addEventListener("click", function (event) {

    const option = event.target.closest(".food-option");

    if (!option) return;

    const foodOptions = document.querySelectorAll(".food-option");

    foodOptions.forEach(function (button) {

        button.classList.remove("selected");
        button.textContent = button.dataset.choice;

    });

    option.classList.add("selected");
    option.textContent = "✓ " + option.dataset.choice;

    foodChoice.value = option.dataset.choice;

});


// =========================
// 15. إرسال الإجابات عبر Formspree
// =========================

const questionsForm = document.getElementById("questionsForm");
const questionsFinishButton = document.getElementById("questionsFinishButton");
const questionsStatus = document.getElementById("questionsStatus");


questionsForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    // التأكد من اختيار إجابة السؤال الرابع

    if (!foodChoice.value) {

        questionsStatus.textContent =
            "اختاري إجابتك على السؤال الرابع أولًا ♡";

        return;

    }


    // التأكد من الموافقة على الإرسال

    if (!document.getElementById("answersConsent").checked) {

        questionsStatus.textContent =
            "لازم توافقين على إرسال الإجابات أولًا.";

        return;

    }


    // إيقاف الزر أثناء الإرسال

    questionsFinishButton.disabled = true;
    questionsFinishButton.textContent = "Sending...";

    questionsStatus.textContent = "Sending your answers... ♡";


    try {

        const response = await fetch(questionsForm.action, {

            method: "POST",

            body: new FormData(questionsForm),

            headers: {
                "Accept": "application/json"
            }

        });


        if (response.ok) {

            questionsStatus.textContent =
                "Your answers have reached me! Thank you ♡";


            // منع إعادة إرسال الإجابات

            questionsForm.querySelectorAll(
                "textarea, button, input"
            ).forEach(function (element) {

                element.disabled = true;

            });

            questionsFinishButton.textContent = "Sent successfully ♡";


            // ظهور زر الانتقال إلى سيول

            if (visitSeoulButton) {

                visitSeoulButton.hidden = false;

                setTimeout(function () {
                    visitSeoulButton.classList.add("visible");
                }, 500);

            }


        } else {

            throw new Error("Submission failed");

        }


    } catch (error) {

        console.error("Formspree Error:", error);

        questionsStatus.textContent =
            "Something went wrong. Please try again later.";

        questionsFinishButton.disabled = false;
        questionsFinishButton.textContent = "That's all! ✦";

    }

});


// =========================
// مؤقّت ظهور زر نهاية سيول
// =========================

let seoulEndingTimer;

function startSeoulEndingTimer() {

    clearTimeout(seoulEndingTimer);

    seoulEndingButton.hidden = true;

    seoulEndingTimer = setTimeout(function () {
        seoulEndingButton.hidden = false;
    }, 35000);

}


// =========================
// 16. الانتقال إلى سيول
// =========================

if (visitSeoulButton) {

    visitSeoulButton.addEventListener("click", function () {

        if (visitSeoulButton.disabled) return;

        visitSeoulButton.disabled = true;

        questionsScreen.hidden = true;

        seoulTransition.hidden = false;

        requestAnimationFrame(function () {
            seoulTransition.classList.add("transition-show");
        });

        setTimeout(function () {

            seoulTransition.classList.add("transition-leave");

            setTimeout(function () {

                seoulTransition.hidden = true;

                seoulTransition.classList.remove(
                    "transition-show",
                    "transition-leave"
                );

                seoulScreen.hidden = false;

                // تشغيل مؤقّت ظهور الزر
                startSeoulEndingTimer();

            }, 1000);

        }, 3500);

    });

}


// =========================
// 17. وضع الاختبار المؤقت
// مفتاح المسافة Space
// =========================

document.addEventListener("keydown", function (event) {

    if (event.code !== "Space" || event.repeat) return;

    const target = event.target;

    if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
    ) return;

    event.preventDefault();

    const screens = [
        "welcomeScreen",
        "countdownScreen",
        "unlockedScreen",
        "worldScreen",
        "messageScreen",
        "memoriesScreen",
        "apologyTransition",
        "apologyScreen",
        "questionsScreen",
        "seoulTransition",
        "seoulScreen"
    ];

    screens.forEach(function (id) {

        const screen = document.getElementById(id);

        if (screen) {
            screen.hidden = true;
        }

    });

    seoulScreen.hidden = false;

    // نفس المؤقّت المستخدم في الانتقال الطبيعي
    startSeoulEndingTimer();

});

// =========================
// الانتقال من سيول إلى النهاية
// =========================

const seoulEndingButton = document.getElementById("seoulEndingButton");
const endingScreen = document.getElementById("endingScreen");

if (seoulEndingButton && endingScreen) {

    seoulEndingButton.addEventListener("click", function () {

        seoulScreen.hidden = true;
        endingScreen.hidden = false;

    });

}
// =========================
// الانتقال من السؤال إلى التهنئة الأخيرة
// =========================

const showFinalMessage = document.getElementById("showFinalMessage");
const endingQuestion = document.getElementById("endingQuestion");
const finalBirthdayMessage = document.getElementById("finalBirthdayMessage");

if (showFinalMessage) {

    showFinalMessage.addEventListener("click", function () {

        endingQuestion.hidden = true;
        finalBirthdayMessage.hidden = false;

    });

}
