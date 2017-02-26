/*----------------------------------------
 * Modern Skylight: Main page script
 * Author(s): cafeinlove (at wiki-chan.net)
 * License: MIT License
 ----------------------------------------*/

void function(window, document, mw, $, undefined) {

    var my = {
        createForm: [
            { template:"", text:"문서의 제목"},
            { template:"틀:서식/작품", text:"작품의 제목"},
            { template:"틀:서식/캐릭터", text:"캐릭터의 이름"},
            { template:"틀:서식/성우", text:"성우의 이름"},
            { template:"틀:서식/가수", text:"가수의 이름"},
            { template:"틀:서식/제작사", text:"제작사의 이름"}
        ]
    };

    /**
     * Accessible-Accordian-Class-Pure-JS-CSS
     * https://github.com/benbowes/Accessible-Accordian-Class-Pure-JS-CSS
     * Author: Ben Bowes
     * License: MIT License
     *
     * Modified to fit to wiki-chan.net by cafeinlove
     *
     * @description   Activate the accordion menu on the left side.
     */
    void function accessibleAccordion() {
     
        var Accordion = function(containerId) {
            this.panels = []; // Master list of collapsable panels
            this.container = document.getElementById(containerId);

            if (!this.container) return;

            this.panelElements = this.container.querySelectorAll(".accordion-section > a");
         
            for (var i = 0, j = this.panelElements.length; i < j; i++) {
                this.makePanel(this.panelElements[i], i);
            }
        };
         
        Accordion.prototype = {
            // resetPanels() - used for unselecting/collapsing AccordionPanels
            resetPanels: function() {
                this.panels.forEach(function(v) {
                    v.unselect();
                });
            },
            // makePanel( <HTMLElement>, <position index used for naming> )
            // Spawns a new AccordionPanel and pushes it into the master list of AccordionPanels controlled by Accordion
            makePanel: function(panelElement, index) {
                var panel = new AccordionPanel(panelElement, this, index);
                this.panels.push(panel);
            }
        };
         
        var AccordionPanel = function(headingEl, panelHolder, index) {
            // The AccordionPanel Class controls each of the collapsable panels spawned from Accordion Class
            var self = this;
         
            this.panelHolder = panelHolder;
            this.index = index;
            this.headingEl = headingEl; // this is the clickable heading
            this.contentEl = headingEl.nextElementSibling;
            this.isSelected = false;
         
            this.setupAccessibility();
         
            this.headingEl.addEventListener("click", function(event) {
                event.preventDefault();
         
                if (!self.isSelected) { // if already open, do nothing
                    self.panelHolder.resetPanels(); // close all panels
                    self.select(); // then open desired panel
                }
            });
         
            return this;
        };
         
        AccordionPanel.prototype = {
            setupAccessibility: function() {
                this.headingEl.setAttribute("role", "tab");
                this.headingEl.setAttribute("aria-selected", "false");
                this.headingEl.setAttribute("id", "accordionHeading" + this.index);
                this.headingEl.setAttribute("aria-controls", "accordionContent" + this.index);
                this.headingEl.setAttribute("tabindex", "0");
                this.headingEl.setAttribute("aria-expanded", "false"); // dynamic html attribute
         
                this.contentEl.setAttribute("id", "accordionContent" + this.index);
                this.contentEl.setAttribute("aria-labelledby", "accordionHeading" + this.index);
                this.contentEl.setAttribute("role", "tabpanel");
                this.contentEl.setAttribute("aria-hidden", "true"); // dynamic html attribute
            },
            select: function() {
                this.isSelected = true;
         
                this.headingEl.classList.add("active");
                this.headingEl.setAttribute("aria-expanded", "true");
                this.headingEl.setAttribute("aria-selected", "true");
         
                $(this.contentEl).stop(true, true).slideDown();
                this.contentEl.setAttribute("aria-hidden", "false");
            },
            unselect: function() {
                this.isSelected = false;
         
                this.headingEl.classList.remove("active");
                this.headingEl.setAttribute("aria-expanded", "false");
                this.headingEl.setAttribute("aria-selected", "false");
         
                $(this.contentEl).slideUp(); 
                this.contentEl.setAttribute("aria-hidden", "true");
            }
        };

        void function init() {
            // Create Accordian instance
            var myAccordion = new Accordion("accordion");

            // Open first panel on page load
            myAccordion.panels[0].select();
        }();
    }();

    /**
     * Toggle Create Form
     * 
     * @description   Make <createform />s toggleable.
     */
    void function toggleCreateForm() {
        var control = document.getElementById("create-control");
        var form = document.getElementById("create-form");

        if (!control || !form) return;
        
        var category = control.children;
        var preload = form.querySelector("input[name='preload']");
        var textbox = form.querySelector("input[name='title']");
        var activeIndex = 0;

        control.addEventListener("click", function(event) {
            event.preventDefault();

            var target = event.target;

            if (target.tagName == "A") {
                updateForm( getParentIndex(target.parentElement) );
            }
        });

        function updateForm(index) {
            category[activeIndex].className = "";
            category[index].className = "selected";
            activeIndex = index;

            preload.value = my.createForm[index].template;
            textbox.placeholder = my.createForm[index].text + "을 입력하고 엔터를 눌러 주세요.";
        }

        /**
         * Get element index as child
         * Author: mikemaccana, 2016
         * Reference: http://stackoverflow.com/questions/5913927/get-child-node-index
         * License: CC-BY-SA 3.0
         */
        function getParentIndex(element) {
            return Array.prototype.indexOf.call(element.parentNode.children, element);
        }
    }();

}(window, document, window.mediaWiki, window.jQuery);