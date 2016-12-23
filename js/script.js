/**
 * Scroll event
 */
function scrollEvent() {
    var windowElement = $(window),
        bodyElement = $('body'),
        navigationElement = $('nav'),
        navbarAnchorElements = $('nav li'),
        navActiveElement;

    var lastAnchor = "#top",
        currentAnchor = lastAnchor,
        navDistance = navigationElement.offset().top;

    windowElement.scroll(function () {
        var y = windowElement.scrollTop();

        ////////////////////
        // Navigation bar //
        ////////////////////
        if (y > navDistance && !navigationElement.hasClass("navbar-fixed-top")) {
            navigationElement.addClass("navbar-fixed-top");
            bodyElement.css("margin-top", navigationElement.height());
        } else if (y <= navDistance && navigationElement.hasClass("navbar-fixed-top")) {
            navigationElement.removeClass("navbar-fixed-top");
            bodyElement.css("margin-top", 0);
        }

        ///////////////////////
        // Current menu item //
        ///////////////////////
        navActiveElement = null;
        navbarAnchorElements.each(function () {
            var anchorId = $(this).children().attr('href'),
                target = $(anchorId).offset().top - navigationElement.height();

            // Update current active menu
            if (y >= target) {
                navActiveElement = $(this);
                currentAnchor = anchorId;
            }
        });

        // Apply classes to the current anchor
        if (navActiveElement == null)
            currentAnchor = "#top";
        if (lastAnchor != currentAnchor) {
            lastAnchor = currentAnchor;

            // Update classes
            navbarAnchorElements.removeClass("active", 200);
            if (navActiveElement != null)
                navActiveElement.addClass("active", 200);

            // Added hash to browser
            if (history.replaceState)
                history.replaceState(null, "", currentAnchor);
            else
                location.hash = currentAnchor;
        }
    });
}

/**
 * Enable smooth anchor scroll
 */
function smoothAnchor() {
    var root = $('html, body'),
        smoothAnchorElements = $('a.smooth-scroll');

    smoothAnchorElements.click(function () {
        this.blur();
        var href = $.attr(this, 'href');
        root.animate({
            scrollTop: $(href).offset().top - 79
        }, 500);
        return false;
    });
}

/**
 * Change the text of selected phone extension to its value
 */
function changeExtensionDisplay() {
    $('#ext').on('blur focus', function (e) {
        $(this.options).text(function () {
            return e.type === 'focus' ? this.getAttribute('data-default-text') : "+" + this.value;
        });
    }).children().attr('data-default-text', function () {
        return this.textContent;
    }).end().on('change', function () {
        $(this).blur();
    }).blur();
}

/**
 * Setup the javascript
 */
function setup() {
    scrollEvent();
    smoothAnchor();
    changeExtensionDisplay();
}

$(document).ready(setup);