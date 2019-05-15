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
    let height = $("nav").outerHeight();
    let alert = $('#alert');
    if (alert.is(":visible")) {
        height += alert.outerHeight();
    }

    root.animate({
        scrollTop: $(anchor).offset().top - height + 1
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

    $(window).on('shown.bs.modal', function () {
        $('img').trigger("lookup");
    });
}

/**
 * Show alert if it has never been displayed
 */
function showAlert() {
    let alertCookieName = 'last_alert_id';
    let alert = $('#alert');
    let currentAlertID = alert.data('id');

    let lastAlertID = getCookie(alertCookieName);
    if (lastAlertID) {
        if (lastAlertID === currentAlertID) {
            return;
        }
    }

    setCookie(alertCookieName, "", -1);
    alert.removeClass('d-none');
}

/**
 * Closes the alert
 */
function closeAlert() {
    let alertCookieName = 'last_alert_id';
    let alert = $('#alert');
    let currentAlertID = alert.data('id');

    setCookie(alertCookieName, currentAlertID, 365);
    alert.addClass('d-none');
    $("nav").css("margin-top", 0);
}

/**
 * Get the value of a cookie
 * @param {String} name name of the cookie to get
 */
function getCookie(name) {
    var name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Set a cookie
 * @param {String} name name of the cookie to set
 * @param {String} value value of the cookie
 * @param {Number} expireDays number of days to expire the cookie
 */
function setCookie(name, value, expireDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * Setup the javascript
 */
function setup() {
    lazyImageLoading();
    scrollEvent();
    smoothAnchor();
    changeExtensionDisplay();
    $(".js-type-effect").each(function () {
        typeEffect($(this), 100);
    });
    $("[data-toggle='tooltip']").tooltip();
    $("#contactForm").submit(submitContact);
    showAlert();
}

$(document).ready(setup);