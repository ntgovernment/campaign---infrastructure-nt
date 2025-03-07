/**
 * Fades out an element
 *
 * @param {object} el - element that's being faded out
 */
function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= 0.1) <= 0) {
            el.style.display = 'none';
        } else {
            requestAnimationFrame(fade);
        }
    })();
}

/**
 * Fades in an element with an optional display setting
 *
 * @param {object} el - element that's being faded in
 * @param {string} display - display type
 */
function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += 0.1) >= 1.1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}

(function () {
    initMegaMenu();
    initResponsiveMenu();
    initMmenu();
    initScrollToTop();
    initInPageNav();
    initImageComparison();
    initSideNav();
    // initMenuEdge();
    initSuperfish();
    initResponsiveTable();
    initFlickity();
    initCountUp();
    initInteractiveMap();
    initLinkCheck();
    toggleCarouselButton();
    initVideoControl();
})();

function initInteractiveMap() {
    const interactiveMapWrapper = document.getElementById("map-australia");

    if(!interactiveMapWrapper) {
        return false;
    }
    
    const NTWrapper = interactiveMapWrapper.getElementById("northern_territory");
    const allMapGroups = interactiveMapWrapper && interactiveMapWrapper.querySelectorAll(".region");

    if(interactiveMapWrapper && allMapGroups) {
        const regionLinks = document.querySelectorAll(".map-links > ul a");

        //Add Listener to navLinks to toggle map
        if(regionLinks.length > 0) {
            regionLinks.forEach(link => {
                link.addEventListener("mouseover", toggleMapRegion);
                link.addEventListener("focus", toggleMapRegion);
            });
        }

        //Add listener to map
        if(NTWrapper) {
            NTWrapper.addEventListener("mouseover", passEventFromMaptoLink);
            NTWrapper.addEventListener("click", passEventFromMaptoLink);
        }

        function passEventFromMaptoLink(e) {
            const closestGroup = e.target.closest(".region");

            if(closestGroup) {
                const closestGroupId = closestGroup.id;

                regionLinks && regionLinks.forEach(link => {
                    const dataMapRegion = link.getAttribute("data-map-region");
                    link.classList.remove("hover");

                    if(closestGroupId == dataMapRegion) {
                        link.dispatchEvent(new MouseEvent(e.type));
                        link.classList.add("hover");
                    }
                })
            }
        }

        function toggleMapRegion(e) {
            const dataMapRegion = e.target.getAttribute("data-map-region");

            regionLinks && regionLinks.forEach(link => {
                link.classList.remove("hover");
            });

            if(dataMapRegion) {
                allMapGroups.forEach(region => {
                    if(region.id == dataMapRegion) {
                        !region.classList.contains("active") && region.classList.add("active");
                    } else {
                        region.classList.contains("active") && region.classList.remove("active");
                    }
                });
            }
        }
    }
}

function initVideoControl() {
    var btns = document.querySelectorAll('.video-control');

    btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            handlePlayPause(btn);
        });
    });

    function handlePlayPause(e) {
        var videoID = e.getAttribute('data-video');
        if (videoID) {
            var video = document.getElementById(videoID);
            if (!video) {
                return false;
            }
        } else {
            return false;
        }
        
        if (e.classList.contains('pause')) {
            // switch icon
            e.classList.remove('pause');
            e.classList.add('play');

            // pause video
            video.pause();
        } else if (e.classList.contains('play')) {
            // switch icon
            e.classList.remove('play');
            e.classList.add('pause');

            // play video
            video.play();
        }
    }
}


function initPriorityNav() {
    var mainNav = document.querySelector('.ntg-main-nav');
    if (!mainNav) {
        return false;
    }

    new PriorityNav('.ntg-main-nav');
}

function initResponsiveMenu() {
    var mainNav = document.getElementById('mainmenu');
    if (!mainNav) {
        return false;
    }

    responsivemenu.init({
        wrapper: document.querySelector('#mainmenu'),
    });
}

function initMmenu() {
    const mmenuWrapper = document.getElementById('mmenu-wrapper');
    if (!mmenuWrapper) {
        return false;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const mmenu = new Mmenu('#mmenu-wrapper', {
            "offCanvas": {
                "position": "right-front"
            }
        });

        const API = mmenu.API;

        // closes the menu automatically if screen is resized above 992px
        window.addEventListener('resize', function () {
            if (window.matchMedia('(min-width: 992px)').matches) {
                API.close();
            }
        });
    });
}

function initMegaMenu() {
    ResponsiveHelper.addRange({
        '1200..': {
            on: function () {
                $('.ntg-main-nav__wrapper').accessibleMegaMenu('init');
                $('.ntg-main-nav__panel').css('display', 'block');
            },
            off: function () {
                $('.ntg-main-nav__wrapper').accessibleMegaMenu('destroy');
            },
        },
    });

    const header = document.querySelector('.page-header-container');
    const navLinks = document.querySelectorAll('.ntg-main-nav__link > a');
    const scrollSensor = 100;
    var openPanel = false;

    navLinks.forEach(function (link) {
        const config = {
            attributes: true
        };
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                // listen for changes in the link's attributes
                if (mutation.type === "attributes") {
                    var scrollPosition = scrollY;
                    for (i = 0; i < navLinks.length; i++) {
                        if (navLinks[i].classList.contains('open')) {
                            header.classList.add('header-scroll');
                            openPanel = true;
                            break;
                        } else {
                            if (scrollPosition <= scrollSensor) {
                                header.classList.remove('header-scroll');
                            }
                            openPanel = false;
                        }
                    }
                }
            }
        }
        // initialise MutationObserver
        const observer = new MutationObserver(callback);
        observer.observe(link, config);
    });

    // custom sticky header functionality - refer to sticky header plugin
    var lastScrollTop = 0;
    const delta = 5;
    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY;
        var scrollUp = (lastScrollTop > scrollTop);
        // ensure scroll is more than delta
        if (Math.abs(lastScrollTop - scrollTop) <= delta) {
            return false;
        }
        if (scrollUp) {
            // don't remove compact header styling at the top of the page if a panel is open
            if (scrollTop <= scrollSensor) {
                if (!openPanel) {
                    header.classList.remove('header-scroll');
                }
            }
        } else {
            // hide header if scrolling down and no panels are open
            if (scrollTop > scrollSensor) {
                if (!openPanel) {
                    header.classList.add('header-hide');
                }
            }
        }
        lastScrollTop = scrollTop;
    });

    window.addEventListener('resize', function () {
        const breakpoint = 1200;
        var scrollPosition = scrollY;
        if (window.matchMedia(`(max-width: ${breakpoint}px)`)) {
            if (scrollPosition <= scrollSensor) {
                header.classList.remove('header-scroll');
            }
        }
        if (window.matchMedia(`(min-width: ${breakpoint}px)`)) {
            if (openPanel) {
                header.classList.add('header-scroll');
            }
        }
    });

    /*
     * detects if there is only one group of links in the columns section
     * of a panel and adds a class that spreads the links across the width
     * of the panel
    */
    var panels = document.querySelectorAll('.ntg-main-nav__panel');
    panels.forEach(function (panel) {
        var columns = panel.querySelector('.ntg-main-nav__panel-columns');
        if (!columns) {
            return false;
        }
        var children = columns.childElementCount;
        if (children <= 1) {
            panel.classList.add('one-group');
        }
    });
}

function initSuperfish() {
    $(document).ready(function () {
        $('ul.sf-menu').superfish({
            // options
            delay: 250,
            speed: 250,
            speedOut: 250,
            cssArrows: false
        });
    });
}

// dynamically add all h2 elements on the page into anchor list
function initInPageNav() {
    var inPageNav = document.getElementById('in-page-nav');
    if (!inPageNav) {
        return false;
    }

    var list = inPageNav.querySelector('ul');
    document.querySelectorAll('#content h2').forEach(function (element, index) {
        if (index === 0) {
            return false;
        }

        var heading = element;
        if (element.querySelector('a')) {
            element = element.querySelector('a');
            heading = element.parentElement;
        }

        list.insertAdjacentHTML(
            'beforeend',
            '<li><a href="#' +
            element.innerText
                .replace(/&amp;/g, 'and')
                .replace(/[^a-z0-9 ]/gi, '')
                .replace(/\s/g, '-')
                .toLowerCase() +
            '">' +
            element.innerText +
            '</a></li>'
        );
        element.setAttribute(
            'id',
            element.innerText
                .replace(/&amp;/g, 'and')
                .replace(/[^a-z0-9 ]/gi, '')
                .replace(/\s/g, '-')
                .toLowerCase()
        );
    });
}

// adds accordion functionality to nested items in the side navigation
function initSideNav() {
    var sideNavParents = document.querySelectorAll('.ntg-side-nav__collapser');
    if (!sideNavParents) {
        return false;
    }

    for (var i = 0; i < sideNavParents.length; i++) {
        sideNavParents[i].addEventListener('click', function (e) {
            e.preventDefault();

            var thisNext = this.parentElement.getElementsByClassName('collapse')[0];

            if (thisNext.classList.contains('show')) {
                thisNext.classList.remove('show');
                this.classList.add('collapsed');
            } else {
                thisNext.classList.add('show');
                this.classList.remove('collapsed');
            }
        });
    }
}

function initScrollToTop() {
    var backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
        return false;
    }

    var backToTopLink = backToTop.querySelector('.back-to-top button');
    var footer = document.querySelector('.ntg-footer');
    var isGoUpOn = false;
    var scrollHighSensor = 500;

    window.addEventListener('scroll', function () {
        buttonUpService(this);
        checkFooterPosition();
    });

    window.addEventListener('resize', function () {
        checkFooterPosition();
    });

    backToTopLink.addEventListener('click', function (e) {
        e.preventDefault();
        // Workaround to ensure the focus is reset to the top of the page
        // when using keyboard
        document.querySelector('header a').focus({ preventScroll: true });
        scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    });

    /**
     * Checks the scroll position of the page and determines whether
     * the back to top button should be visible
     */
    function buttonUpService() {
        if (!isGoUpOn) {
            if (window.pageYOffset > scrollHighSensor) {
                isGoUpOn = true;
                fadeIn(backToTop);
            }
        } else {
            if (window.pageYOffset <= scrollHighSensor) {
                fadeOut(backToTop);
                isGoUpOn = false;
            }
        }
    }

    function checkFooterPosition() {
        var scrollBottom = document.body.clientHeight - document.documentElement.clientHeight - document.documentElement.scrollTop;
        var backToTopHeight = backToTop.offsetHeight;
        var backToTopOffset = parseFloat(getComputedStyle(backToTop).getPropertyValue('bottom'));
        if (scrollBottom < footer.offsetHeight - (backToTopHeight / 2) - backToTopOffset) {
            backToTop.style.marginBottom = footer.offsetHeight - scrollBottom - (backToTopHeight / 2) - backToTopOffset + 'px';
        } else {
            backToTop.style.marginBottom = 0;
        }
    }
}

function initImageComparison() {
    var imageComparison = document.querySelectorAll('.ntg-image-comparison__wrapper');
    if (!imageComparison) {
        return false;
    }

    imageComparison.forEach(function (element) {
        new Cocoen(element);
    });
}

function initResponsiveTable() {
    document.querySelectorAll('[class*="custom-table-"]').forEach(function (element) {
        responsiveCellHeaders(element);
        addTableAria(element);
    });
}

function initFlickity() {
    var carousels = document.querySelectorAll('.flickity-carousel');
    if (!carousels) {
        return false;
    }

    carousels.forEach(function (carousel) {
        var flkty = new Flickity(carousel, {
            // options
            cellAlign: 'center'
        });
    });

    /**
     * @todo Vanilla JS implementation of keyboard focus
     */
}

function toggleCarouselButton() {
    var carousels = document.querySelectorAll('.carousel');
    var paused = false;

    // filter out carousels that haven't been initialized
    var initializedCarousels = [];
    
    carousels.forEach((carousel) => {
        let carouselOptions = {
            ride: "carousel"
        };

        if(!isNaN(parseInt(carousel.getAttribute('data-bs-interval')))) {
            console.log(parseInt(carousel.getAttribute('data-bs-interval')))
            carouselOptions["interval"] = parseInt(carousel.getAttribute('data-bs-interval'));
        } else {
            carouselOptions["interval"] = false;
            carouselOptions["ride"] = false;
        }

        const car = new bootstrap.Carousel(carousel, carouselOptions);

        initializedCarousels.push(car);
    });


    initializedCarousels.forEach(function (carousel) {
        let bootstrapCarousel = carousel;

        const toggleButton = carousel._element.querySelector('.toggleCarouselBtn');

        if (toggleButton) {
            let playPauseIcon = toggleButton.querySelector('i');
            toggleButton.addEventListener('click', function (e) {
                if (paused) {
                    bootstrapCarousel.cycle();
                    bootstrapCarousel._config.ride = "carousel";
                    playPauseIcon.classList.remove("fa-play");
                    playPauseIcon.classList.add("fa-pause");
                    paused = false;
                }
                else {
                    bootstrapCarousel.pause();
                    bootstrapCarousel._config.ride = false;
                    playPauseIcon.classList.remove("fa-pause");
                    playPauseIcon.classList.add("fa-play");
                    paused = true;
                }
            })
        }

    })
}

function initCountUp() {
    var values = document.querySelectorAll('.count-up');

    values.forEach(function (value) {
        var target = value.innerHTML.replace(/[^\d.]/g, '');

        // default options
        var decimalPlaces = 0;
        var prefix = '';
        var suffix = '';

        // check for decimal places
        if (target.includes('.')) {
            decimalPlaces = target.split('.')[1].length;
        }

        // check for prefix
        if (value.hasAttribute('data-prefix')) {
            prefix = value.getAttribute('data-prefix');
        }

        // check for suffix
        if (value.hasAttribute('data-suffix')) {
            suffix = value.getAttribute('data-suffix');
        }

        const countUp = new CountUp(value, target, {
            decimalPlaces: decimalPlaces,
            duration: 3,
            prefix: prefix,
            suffix: suffix,
            enableScrollSpy: true,
            scrollSpyOnce: 1
        });
    });
}

function initLinkCheck() {
    var links = document.querySelectorAll('#content a');
    if(!links) {
        return false;
    }
    
    links.forEach(function(link) {
        if( location.hostname === link.hostname || !link.hostname.length ) {
            return false;
        } else {
            if(!link.querySelector('[class*="fa-external-link"]') && !link.querySelector('img')) {
                link.insertAdjacentHTML('beforeend', '<i class="far fa-external-link mx-05" aria-hidden="true"></i>');
            }
            link.setAttribute('rel', 'noopener');
            link.setAttribute('title', 'Opens in a new window');
            link.classList.add("link-external");
        }
    });
}