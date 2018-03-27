/**
 * Applies the type effect to an input
 * @param input input to apply the type effect
 * @param delay delay to apply the effect
 */
function typeEffect(input, delay) {
    var fullText = input.text();
    input.text("");

    var i = 0;
    var effect = setInterval(function () {
        if (i < fullText.length) {
            input.text(input.text() + fullText[i++]);
        } else {
            clearInterval(effect);
            setTimeout(function () {
                typeEffect(input, delay);
            }, 5000);
        }
    }, delay);
}