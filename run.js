async function addStyleSheets(styles) {
    const head = document.querySelector('head');

    for (let style of styles) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = style;
        head.append(link);
    }
}

async function addScripts(scripts) {
    const body = document.querySelector('head');

    for (let script of scripts) {
        const scriptEl = document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.src = script
        body.append(scriptEl);
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
]

await addStyleSheets(styleSheets);
await addScripts(scripts);

async function run() {
    const result = main(page, '.section-cntnr', '.section-lbl', '.rw', markingScheme, 'tier1');
    console.table(result['scoreCard']);

    const mainBody = document.querySelector('body');
    mainBody.innerHTML = initialTabBlock().outerHTML;

    const finalData = {
        'Candidate Info': result['candidateInfo'],
        'Score Card': result['scoreCardHtml'],
        'Answer Key': result['answerKeyHtml'],
        'Quiz': createQuiz(result['answerKeyDict'], result['candidateInfo']['Exam Name'])
    }

    addTabs(finalData, '#tabs-widget-1 .tabs', '#tabs-widget-1 .tabs-content')

}

run()