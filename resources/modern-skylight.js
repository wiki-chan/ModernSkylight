/*----------------------------------------
 * Modern Skylight: Global scripts
 * Author(s): cafeinlove (at wiki-chan.net)
 * License: MIT License
 ----------------------------------------*/

void function(window, document, mw, $, undefined) {

    var my = {
        contentWrapper: document.getElementById("mw-content-text"),
        scrollSpeed: 400, // in millisecond
        toTopBreakpoint: 400 // in pixel
    };

    /**
     * Smooth scroll
     *
     * @description   Make internal links smooth scroll instead of instantly jump.
     *                Applied to all pages over the wiki.
     */
    void function smoothScroll() {
        // don't apply smoothScroll to NS_SPECIAL pages
        // otherwise it will break pages such as Special:Preferences
        if (mw.config.get("wgNamespaceNumber") === -1) return;

        var anchorPattern = /^#./;

        my.contentWrapper.addEventListener("click", function(event) {
            var target = event.target;

            if (target.tagName == "A" && anchorPattern.test(target.hash)) {
                animate(target.hash);
            }
        });

        function animate(hash) {
            // hash value of anchors pointing to a heading with unicode text
            // (e.g. == {Korean text} == ) contains dots and these should be
            // escaped with 2 slashes.
            var targetId = hash.replace(/\./g, "\\.");
            var targetEl = document.getElementById(targetId);

            if (!targetEl) return;

            var $root = $("html, body");

            $root.animate({
                scrollTop: $(targetEl).offset().top
            }, my.scrollSpeed);

            controlUrl("#" + hash);

            return false; // preveting default behaviour of <a href="#" />
        }

        /**
         * Change URL hash without page jump
         * Author: Lea Verou, 2011
         * http://lea.verou.me/2011/05/change-url-hash-without-page-jump/
         */
        function controlUrl(hash) {
            if (history.pushState) {
                history.pushState(null, null, hash);
            } else {
                location.hash = hash;
            }
        }
    }();

    /**
     * To Top Button
     *
     * @description   Append a button that allows user to navigate back
     *                to the top of the page.
     */
    void function toTopButton() {
        var button = document.createElement("a");

        button.id = "toTop";
        button.appendChild(document.createTextNode("\u2191"));

        document.body.appendChild(button);

        window.addEventListener("scroll", toggleButton);

        function toggleButton() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var button = document.getElementById("toTop");
            button.className = scrollTop > my.toTopBreakpoint ? "is-visible" : "";
        }
    }();

    /**
     * Wiki Tooltip
     *
     * @description   Display a tooltip on elements with `tooltip` class
     */
    void function wikiTooltip() {
        var tooltip, arrow, inner, text;
        var tooltipClass = "tooltip";
        var tooltipText;
        var isActive = false;

        document.body.addEventListener("mouseover", function(event) {
            var target = event.target;

            if (!isActive && target.classList.contains(tooltipClass)) {
                createTip(target);
            }
        });

        document.body.addEventListener("mouseout", function(event) {
            var target = event.target;

            if (isActive && target.classList.contains(tooltipClass)) {
                removeTip(target);
            }
        });

        function createTip(sourceEl) {
            if (!sourceEl.title) return;

            isActive = true;

            tooltipText = sourceEl.title;
            sourceEl.removeAttribute("title");

            tooltip = document.createElement("div");
            arrow = document.createElement("div");
            inner = document.createElement("div");
            text = document.createTextNode(tooltipText);

            document.body.appendChild(tooltip);
            tooltip.appendChild(arrow);
            tooltip.appendChild(inner);
            inner.appendChild(text);

            tooltip.id = "wikiTooltip";
            arrow.className = "arrow";
            inner.className = "inner";

            positionTip(sourceEl);
        }

        function positionTip(sourceEl) {
            var offset = $(sourceEl).offset();
            var pos = {
                top: offset.top - tooltip.offsetHeight,
                left: offset.left - (tooltip.offsetWidth - sourceEl.offsetWidth) / 2
            };

            tooltip.style.top = pos.top + "px";
            tooltip.style.left = pos.left + "px";

            tooltip.className = "is-visible";
        }

        function removeTip(sourceEl) {
            document.body.removeChild(tooltip);
            sourceEl.setAttribute("title", tooltipText);

            tooltip = undefined;
            tooltipText = undefined;

            isActive = false;
        }
    }();

}(window, document, window.mediaWiki, window.jQuery);