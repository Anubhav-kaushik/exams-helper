function removeUnwantedCharacters(text) {
    text = text.replace('.', '')
    text = text.replace(' ', '')

    return text
}

function compareOptions(correctOption, choosenOption) {
    correctOption = removeUnwantedCharacters(correctOption)
    choosenOption = removeUnwantedCharacters(choosenOption)

    if (correctOption == choosenOption) {
        return true
    } else {
        return false
    }
}

function getQuestionId(row) {
    const tables = row.querySelectorAll('table');
    const ansTable = tables[1];
    const ansRows = ansTable.querySelectorAll('tr');
    const idRow = ansRows[0];

    const id = idRow.querySelectorAll('td')[1].innerText;

    return id;
}

function getOptions(row) {
    const tables = row.querySelectorAll('table');
    const quesTable = tables[0];
    const ansTable = tables[1];

    const rightOption = quesTable.querySelector('.rightAns').innerText[0];

    const ansRows = ansTable.querySelectorAll('tr');
    const ansRow = ansRows[ansRows.length - 1]
    const choosenOption = ansRow.querySelectorAll('td')[1].innerText[0];

    return [rightOption, choosenOption]
}

function calculateMarks(correct, incorrect, markingScheme) {
    const positiveNum = correct * markingScheme['correct'];
    const negativeNum = incorrect * markingScheme['incorrect'];

    return positiveNum - negativeNum
}

function findTotal(allSectionsAttempts, skipSectionName = null) {
    const total = {
        'Total Attempted': 0,
        'Correct Questions': 0,
        'Incorrect Questions': 0,
        'Marks Obtained': 0,
        'Out of': 0
    }

    for (let sectionName in allSectionsAttempts) {
        if (sectionName == skipSectionName) {
            continue
        }
        for (let index in total) {
            total[index] += allSectionsAttempts[sectionName][index];
        }
    }

    return total;
}

function createSummaryItem(subjectName, subjectMarksDetails, seq = 1) {
    const summaryItem = document.createElement('div');
    summaryItem.classList.add('summary-item');
    summaryItem.setAttribute('data-item-type', `accent-${seq}`);

    const flexGroup = document.createElement('div');
    flexGroup.classList.add('flex-group');

    const summaryItemTitle = document.createElement('h3');
    summaryItemTitle.classList.add('summary-item-title');
    summaryItemTitle.innerHTML = subjectName

    flexGroup.append(summaryItemTitle);
    summaryItem.append(flexGroup);

    const summaryScore = document.createElement('p');
    summaryScore.classList.add('summary-score');
    const marksObtained = document.createElement('span');
    marksObtained.innerHTML = subjectMarksDetails['Marks Obtained']
    const outOf = document.createElement('span');
    outOf.innerHTML = subjectMarksDetails['Out of']
    summaryScore.innerHTML = marksObtained.outerHTML + ' / ' + outOf.outerHTML

    summaryItem.append(summaryScore);

    return `${summaryItem.outerHTML}`
}

function createFinalScoreBlock(finalScore) {
    let content = `<div class="result-summary"> <div class="results grid-flow" data-spacing="large"> <h1 class="section-title">Your Result</h1> <p class="result-score"><span>{{total-marks-obtained}}</span> of {{out-of-total}}</p> <div class="grid-flow"> <p class="result-rank">Great</p> </div> </div> <div class="summary grid-flow" data-spacing="large"> <h2 class="section-title">Summary</h2> <div class="grid-flow">`

    const totalMarksObtained = finalScore['Marks Obtained'];
    const outOfTotal = finalScore['Out of'];

    content = content.replace('{{total-marks-obtained}}', `${totalMarksObtained}`)
    content = content.replace('{{out-of-total}}', `${outOfTotal}`);

    return content
}

function getScoreCardHTML(result) {
    let firstBlock = createFinalScoreBlock(result['Total']);

    let n = 1;
    for (const subjectName in result) {
        if (subjectName == 'Total') {
            continue;
        }
       
        const item = createSummaryItem(subjectName, result[subjectName], n)
        firstBlock += item;

        n++;
    }

    firstBlock += `</div> </div> </div>`

    const finalBlock = document.createElement('div');
    finalBlock.innerHTML = firstBlock;

    return finalBlock
}

function addResultToPage(result, infoContainerSelector = ".main-info-pnl") {
    const pageBody = document.querySelector(infoContainerSelector);
    pageBody.innerHTML = '';

    pageBody.innerHTML = getScoreCardHTML(result)
}

function markQues(ques, category) {
    const marks = {
        correct: 'correct',
        incorrect: 'incorrect',
        notAttempted: 'NA'
    }

    ques.setAttribute('data-mark', marks[category])
}

function getCandidateInfo(candidateInfoBlock) {
    const infoRows = candidateInfoBlock.querySelector('table').querySelectorAll('tr');
    const candidateInfo = {}

    for (let row of infoRows) {
        const data = row.querySelectorAll('td');
        candidateInfo[data[0].innerText] = data[1].innerText;
    }

    candidateInfo['answerSheetUrl'] = window.location.href;
    const examName = candidateInfoBlock.querySelector('strong').innerText;
    candidateInfo['Exam Name'] = examName;

    return candidateInfo
}

function deleteTicks(row) {
    const ticks = row.querySelectorAll('.tick');

    for (let tick of ticks) {
        tick.remove();
    }
}

function getQuestionDetails(quesRow) {
    let allRows = quesRow.querySelectorAll('tr');
    let quesDetails = {
        'questionId': '',
        'question': '',
        'correctOption': '',
        'otherOptions': []
    }

    quesDetails['questionId'] = getQuestionId(quesRow);

    let n = 0;
    for (let row of allRows) {
        if (row.innerHTML == '') continue;
        n += 1;

        if (n == 1) {
            const question = row.querySelectorAll('td')[1].innerHTML;
            quesDetails['question'] = question;
            break;
        }
    }

    const correct = quesRow.querySelector('.rightAns');
    let cText = correct.innerHTML;
    cText = cText.replace(/(\d*)([^\w])(\s)/, '');
    quesDetails['correctOption'] = cText;

    const others = quesRow.querySelectorAll('.wrngAns');

    for (let other of others) {
        let wText = other.innerHTML;
        wText = wText.replace(/(\d*)([^\w]*)/, '');
        quesDetails['otherOptions'].push(wText);
    }

    return quesDetails;
}

function getAnswerKeyHtml(page, ansKeySelector) {
    const answerKeyBlock = page.querySelector(ansKeySelector);
    answerKeyBlock.style.margin = '0';
    answerKeyBlock.style.padding = '0';
    answerKeyBlock.style.background = 'transparent';
    
    return answerKeyBlock
}

function main(page, sectionSelector, sectionNameSelector, mainRowSelector, markingScheme, examStage) {
    const allSections = page.querySelectorAll(sectionSelector);
    const allSectionsNames = [];
    const subjectwiseResult = {};
    const questionPaper = {};
    const candata = getCandidateInfo(page.querySelector('.main-info-pnl'));
    const answerKeyHTML = getAnswerKeyHtml(page, '.grp-cntnr');

    for (let section of allSections) {
        const allQuesRows = section.querySelectorAll(mainRowSelector);
        const sectionName = section.querySelector(sectionNameSelector).querySelector('.bold').innerText;
        allSectionsNames.push(sectionName);

        let correct = 0,
            incorrect = 0,
            notAttempted = 0,
            sectionData = [];

        for (let quesRow of allQuesRows) {
            let rightOption, choosenOption;
            [rightOption, choosenOption] = getOptions(quesRow);

            deleteTicks(quesRow);
            let questionData = getQuestionDetails(quesRow);
            sectionData.push(questionData);

            if (choosenOption == '-') {
                notAttempted += 1
                markQues(quesRow, 'notAttempted')
                continue
            }

            if (compareOptions(rightOption, choosenOption)) {
                correct += 1
                markQues(quesRow, 'correct')
            } else {
                incorrect += 1
                markQues(quesRow, 'incorrect')
            }
        }

        questionPaper[sectionName] = sectionData;

        let marks = calculateMarks(correct, incorrect, markingScheme[examStage])

        const response = {
            'Total Attempted': correct + incorrect,
            'Correct Questions': correct,
            'Incorrect Questions': incorrect,
            'Marks Obtained': marks,
            'Out of': (correct + incorrect + notAttempted) * markingScheme[examStage]['correct']
        }

        subjectwiseResult[sectionName] = response;
    }
    let skipSectionName = '';
    if (examStage == 'tier2') {
        skipSectionName = allSectionsNames[allSectionsNames.length - 1]
    }
    subjectwiseResult['Total'] = findTotal(subjectwiseResult, skipSectionName);

    const allInfo = {
        'candidateInfo': candata,
        'scoreCard': subjectwiseResult,
        'answerKeyDict': questionPaper,
        'answerKeyHtml': answerKeyHTML,
        'scoreCardHtml': getScoreCardHTML(subjectwiseResult)
    }

    const allInfoHTML = {
        'candidateInfo': '',
        'scoreCard': getScoreCardHTML(subjectwiseResult),
        'answerKeyHtml': answerKeyHTML
    }

    return allInfo;
}

// Execution

const page = document.querySelector('html')

const markingScheme = {
    tier2: {
        'correct': 3,
        'incorrect': 1
    },
    tier1: {
        'correct': 2,
        'incorrect': 0.5
    }
}

// const result = main(page, '.section-cntnr', '.section-lbl', '.rw', markingScheme, 'tier2');
// console.table(result['scoreCard']);

// addResultToPage(result['scoreCard'])