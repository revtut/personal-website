var root = $("html, body");

/**
 * Enable smooth anchor scroll
 */
function smoothAnchor() {
    var smoothAnchorElements = $("a.js-smooth-scroll");

    smoothAnchorElements.click(function () {
        this.blur();
        var href = $.attr(this, "href");
        jumpToAnchor(href);
        return false;
    });
}

/**
 * Jump to an anchor
 * @param {string} anchor anchor to jump to
 */
function jumpToAnchor(anchor) {
    root.animate({
        scrollTop: $(anchor).offset().top - $("nav").height() + 1
    }, 500);
}

/**
 * Change the text of selected phone extension to its value
 */
function changeExtensionDisplay() {
    $("#ext").on("blur focus", function (e) {
        $(this.options).text(function () {
            return e.type === "focus" ? this.getAttribute("data-default-text") : "+" + this.value;
        });
    }).children().attr("data-default-text", function () {
        return this.textContent;
    }).end().on("change", function () {
        $(this).blur();
    }).blur();
}

/**
 * Submit the contact form
 */
function submitContact(event) {
    event.preventDefault();

    var resultMessageDiv = $("#submitResult");

    var $form = $(this);
    // Send message
    $.post(
        $form.attr("action"),
        $("form#contactForm").serialize(),
        function () {
            resultMessageDiv.find("a").after("<strong>Success!</strong>");
            resultMessageDiv.addClass("alert-success");
            resultMessageDiv.fadeIn("slow");
            $("#contactForm")[0].reset();
        }
    ).fail(function () {
        resultMessageDiv.find("a").after("<strong>Error!</strong> Your message could not be sent. Please try again.");
        resultMessageDiv.addClass("alert-danger");
        resultMessageDiv.fadeIn("slow");
    });
}

/**
 * Lazy image loading
 */
function lazyImageLoading() {
    $('img').unveil(200);

    $(window).on('shown.bs.modal', function() {
        $('img').trigger("lookup");
    });
}

/**
 * Setup the javascript
 */
function setup() {
    lazyImageLoading();
    scrollEvent();
    smoothAnchor();
    changeExtensionDisplay();
    $(".js-type-effect").each(function() {
        typeEffect($(this), 100);
    });
    $("[data-toggle='tooltip']").tooltip();
    $("#contactForm").submit(submitContact);
}

$(document).ready(setup);