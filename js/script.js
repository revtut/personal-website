/**
 * Scroll event
 */
function scrollEvent() {
    var windowElement = $(window),
        headerElement = $('header'),
        backTopElement = $('div.back-top'),
        navigationElement = $('nav'),
        navbarAnchorElements = $('nav a');

    var lastAnchor = "#top";
    var currentAnchor = lastAnchor;

    windowElement.scroll(function() {
        var y = windowElement.scrollTop(),
            height = screen.height;
        console.log("Height: " + height + " | Y: " + y);

        ////////////////////
        // Navigation bar //
        ////////////////////
        if (y > height && !navigationElement.hasClass("navbar-fixed-top")) {
            navigationElement.addClass("navbar-fixed-top");
        } else if (y <= height && navigationElement.hasClass("navbar-fixed-top")) {
            navigationElement.removeClass("navbar-fixed-top");
        }

        ///////////////////////
        // Current menu item //
        ///////////////////////
        navbarAnchorElements.each(function() {
            var anchorId = $(this).attr('href');
            var target = $(anchorId).offset().top - 80;

            // Update current active menu
            if (y >= target)
                currentAnchor = anchorId;
        });

        // Apply classes to the current anchor
        if (lastAnchor != currentAnchor) {
            lastAnchor = currentAnchor;

            // Update classes
            navbarAnchorElements.removeClass("active");
            $("#navigation-bar li a[href='" + currentAnchor + "']").addClass('active');

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

    smoothAnchorElements.click(function() {
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