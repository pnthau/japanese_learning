let database = {};

let currentUnit = "Unit 4";
let currentIndex = 0;

// Elements
const unitSelector = document.getElementById('unit-selector');
const wrapper = document.getElementById('card-wrapper');
const kanjiMainEl = document.getElementById('kanji-main');
const hanVietEl = document.getElementById('han-viet');
const onYomiEl = document.getElementById('on-yomi');
const kunYomiEl = document.getElementById('kun-yomi');
const radicalEl = document.getElementById('radical');
const mnemonicEl = document.getElementById('mnemonic');
const meaningEl = document.getElementById('meaning');
const examplesEl = document.getElementById('examples-list');
const progressBarEl = document.getElementById('progress-bar');



function renderCard(index, db) {
    if (!db || !db[currentUnit]) return;
    const data = db[currentUnit][index];
    wrapper.classList.remove('flipped');

    setTimeout(() => {
        kanjiMainEl.textContent = data.kanji;
        hanVietEl.textContent = data.hanViet;
        onYomiEl.textContent = data.onYomi;
        kunYomiEl.textContent = data.kunYomi;
        radicalEl.innerHTML = data.radical ? `Bộ: ${data.radical}` : '';
        mnemonicEl.innerHTML = data.mnemonic;
        meaningEl.textContent = data.meaning;

        examplesEl.innerHTML = '';
        data.examples.forEach(ex => {
            const div = document.createElement('div');
            div.className = 'example-item';
            div.textContent = '• ' + ex;
            examplesEl.appendChild(div);
        });

        const progress = ((index + 1) / db[currentUnit].length) * 100;
        progressBarEl.style.width = progress + '%';
    }, 150);
}

unitSelector.addEventListener('change', (e) => {
    currentUnit = e.target.value;
    currentIndex = 0;
    renderCard(currentIndex, database);
});

wrapper.addEventListener('click', () => wrapper.classList.toggle('flipped'));

document.getElementById('next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!database[currentUnit]) return;
    currentIndex = (currentIndex + 1) % database[currentUnit].length;
    renderCard(currentIndex, database);
});

document.getElementById('prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!database[currentUnit]) return;
    currentIndex = (currentIndex - 1 + database[currentUnit].length) % database[currentUnit].length;
    renderCard(currentIndex, database);
});

document.getElementById('audio-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!database[currentUnit]) return;
    const utterance = new SpeechSynthesisUtterance(database[currentUnit][currentIndex].kanji);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
});


async function loadDatabase() {
    try {
        const response = await fetch('kanji.json');
        database = await response.json();
        renderCard(currentIndex, database);
    } catch (err) {
        console.error("Error loading Kanji database:", err);
    }
}


loadDatabase();