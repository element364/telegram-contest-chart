const handleClick = (element) => {
    if (!element) return;
    if (element.classList.contains('legend-icon-container')) {
        const legendItem = element.parentElement.classList
         legendItem.add('animated');
         legendItem.toggle('legend-item__off')
         legendItem.toggle('legend-item__on');

    } else {
        handleClick(element.parentElement);
    }
};

document.body.addEventListener('click', (e) => {
console.log(e.target);
handleClick(e.target);

});