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

const scripts = [
    'https://anubhav-kaushik.github.io/tab-addons/widget-tab-type.js',
    'https://anubhav-kaushik.github.io/quiz-creator/js/action.js',
    'https://anubhav-kaushik.github.io/quiz-creator/js/quiz-creator.js',
    'https://anubhav-kaushik.github.io/marksCalc/tcs-marks-calc.js',
];

const styleSheets = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css',
    'https://anubhav-kaushik.github.io/tab-addons/widget-tab-type.css',
    'https://anubhav-kaushik.github.io/quiz-creator/css/quiz-style.css',
    'https://anubhav-kaushik.github.io/marksCalc/style.css',
]

addStyleSheets(styleSheets);
addScripts(scripts);

async function run(tier) {
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
