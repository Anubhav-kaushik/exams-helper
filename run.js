function addStyleSheets(styles) {
    const head = document.querySelector('head');

    for (let style of styles) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = style;
        head.append(link);
    }
}

function addScripts(scripts) {
    const body = document.querySelector('head');

    for (let script of scripts) {
        const scriptEl = document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.src = script
        body.append(scriptEl);
    }
}

async function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

async function startLoading(time) {
    const loadingScreen = document.createElement('div');
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';
    loadingScreen.style.position = 'absolute';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.zIndex = '1001';
    loadingScreen.style.background = 'black';

    let interval = 0.5,
        curTime = 0;

    loadingScreen.style.transition = `background ${interval}s`;

    const body = document.querySelector('body');
    body.appendChild(loadingScreen);
    body.style.overflow = 'hidden';

    while (curTime < time) {
        let h, s, l;
        h = Math.floor(Math.random() * 360);
        s = Math.floor(Math.random() * 100);
        l = Math.floor(Math.random() * 100);

        loadingScreen.style.background = `hsl(${h}, ${s}%, ${l}%)`
        await sleep(interval);

        curTime += interval;
    }
}

const scripts = [
    'https://anubhav-kaushik.github.io/tab-addons/widget-tab-type.js',
    'https://anubhav-kaushik.github.io/quiz-creator/js/action.js',
    'https://anubhav-kaushik.github.io/quiz-creator/js/quiz-creator.js',
    'https://anubhav-kaushik.github.io/marksCalc/tcs-marks-calc.js',
];

const styleSheets = [
    'https://anubhav-kaushik.github.io/tab-addons/widget-tab-type.css',
    'https://anubhav-kaushik.github.io/quiz-creator/css/quiz-style.css',
    'https://anubhav-kaushik.github.io/marksCalc/style.css',
]

addStyleSheets(styleSheets);
addScripts(scripts);

async function run(tier) {
    startLoading(3)
    await sleep(3);
    const result = main(page, '.section-cntnr', '.section-lbl', '.rw', markingScheme, tier);
    console.table(result['scoreCard']);

    const mainBody = document.querySelector('body');
    mainBody.innerHTML = initialTabBlock().outerHTML;

    const finalData = {
        'Candidate Info': result['candidateInfoHtml'],
        'Score Card': result['scoreCardHtml'],
        'Answer Key': result['answerKeyHtml'],
        'Quiz': createQuiz(result['answerKeyDict'], result['candidateInfo']['Exam Name'])
    }

    addTabs(finalData, '.tabs-widget .tabs', '.tabs-widget .tabs-content')
}


// const thisbody = document.querySelector('body');
// const sc = document.createElement('script');
// sc.setAttribute('src', 'https://anubhav-kaushik.github.io/marksCalc/run.js');
// thisbody.append(sc);

run('tier1')
