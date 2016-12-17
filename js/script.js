/**
 * Scroll event
 */
function scrollEvent() {
    var windowElement = $(window),
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
        /*if (y > navDistance && !navigationElement.hasClass("navbar-fixed-top")) {
            navigationElement.addClass("navbar-fixed-top");
        } else if (y <= navDistance && navigationElement.hasClass("navbar-fixed-top")) {
            navigationElement.removeClass("navbar-fixed-top");
    }*/

        ///////////////////////
        // Current menu item //
        ///////////////////////
        navActiveElement = null;
        navbarAnchorElements.each(function () {
            var anchorId = $(this).children().attr('href'),
                target = $(anchorId).offset().top - 80;

            // Update current active menu
            if (y >= target) {
                navActiveElement = $(this);
                currentAnchor = anchorId;
            }
        });

        // Apply classes to the current anchor
        if(navActiveElement == null)
            currentAnchor = "#top";
        if (lastAnchor != currentAnchor) {
            lastAnchor = currentAnchor;

            // Update classes
            navbarAnchorElements.removeClass("active", 200);
            if(navActiveElement != null)
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
 * Setup the javascript
 */
function setup() {
    scrollEvent();
    smoothAnchor();
}

$(document).ready(setup);