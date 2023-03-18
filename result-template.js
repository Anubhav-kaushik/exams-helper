function createSummaryItem(subjectName, subjectMarksDetails, seq = 1) {
    const summaryItem = document.createElement('div');
    summaryItem.classList.append('summary-item');
    summaryItem.setAttribute('data-item-type', `accent-${seq}`);

    const flexGroup = document.createElement('div');
    flexGroup.classList.append('flex-group');

    const summaryIcon =
        '<svg class="summary-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M10.833 8.333V2.5l-6.666 9.167h5V17.5l6.666-9.167h-5Z" /></svg>'
    const summaryItemTitle = document.createElement('h3');
    summaryItemTitle.classList.append('summary-item-title');
    summaryItemTitle.innerHTML = subjectName

    flexGroup.appendChild(summaryIcon);
    flexGroup.appendChild(summaryItemTitle);
    summaryItem.append(flexGroup);

    const summaryScore = document.createElement('p');
    summaryScore.classList.append('summary-score');
    const marksObtained = document.createElement('span');
    marksObtained.innerHTML = subjectMarksDetails['Marks Obtained']
    const outOf = document.createElement('span');
    outOf.innerHTML = subjectMarksDetails['Out of']
    summaryScore.innerHTML = marksObtained + ' / ' + outOf

    summaryItem.append(summaryScore);

    return summaryItem
}

function createFinalScoreBlock(finalScore) {
    const content = `<main> <link rel="stylesheet" href="style.css"> <div class="result-summary"> <div class="results grid-flow" data-spacing="large"> <h1 class="section-title">Your Result</h1> <p class="result-score"><span>{{total-marks-obtained}}</span> of {{out-of-total}}</p> <div class="grid-flow"> <p class="result-rank">Great</p> </div> </div> <div class="summary grid-flow" data-spacing="large"> <h2 class="section-title">Summary</h2> <div class="grid-flow">`

    const totalMarksObtained = finalScore['Marks Obtained'];
    const outOfTotal = finalScore['Out of'];

    content.replace('{{total-marks-obtained}}', `${totalMarksObtained}`)
    content.replace('{{out-of-total}}', `${outOfTotal}`);

    return content
}

function getFinalTemplate(result) {
    const firstBlock = createFinalScoreBlock(result['Total']);

    let n = 0;
    for (const subjectName in result) {
        if (subjectName == 'Total') {
            continue;
        }
        n += 1
        const item = createSummaryItem(subjectName, result[subjectName], n)
        firstBlock += item;
    }

    firstBlock += `</div> </div> </div></main>`

    return firstBlock
}