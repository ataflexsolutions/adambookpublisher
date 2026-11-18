(function ($) {
    "use strict";
    if (typeof $ === "undefined" || typeof $.fn === "undefined") {
        return;
    }

    function initHomeTyped() {
        if (typeof window.Typed === "undefined" || !$("#typed").length || !$("#typed-strings").length) {
            return;
        }
        var currImg = 0;
        function changeImg() {
            currImg++;
            if (currImg === 1) {
                $(".slider-home").delay(400).addClass("children-image").removeClass("adventure-image");
            } else if (currImg === 2) {
                $(".slider-home").delay(400).addClass("business-image").removeClass("children-image");
            } else if (currImg === 3) {
                $(".slider-home").delay(400).addClass("self-image").removeClass("business-image");
            } else if (currImg === 4) {
                $(".slider-home").delay(400).addClass("romance-image").removeClass("self-image");
            } else if (currImg === 5) {
                $(".slider-home").delay(400).addClass("mystery-image").removeClass("romance-image");
            } else if (currImg === 6) {
                $(".slider-home").delay(400).addClass("adventure-image").removeClass("mystery-image");
                currImg = 0;
            }
        }
        try {
            // eslint-disable-next-line no-new
            new Typed("#typed", {
                stringsElement: "#typed-strings",
                typeSpeed: 70,
                backSpeed: 30,
                contentType: "text",
                startDelay: 1000,
                backDelay: 2700,
                loop: true,
                preStringTyped: changeImg
            });
        } catch (err) {
            // Typed optional on non-home pages
        }
    }

    $(document).ready(function () {
        if (!sessionStorage.getItem("popupShown")) {
            setTimeout(function () {
                if ($("#popupforms").length && $.fn.modal) {
                    $("#popupforms").modal("show");
                }
                sessionStorage.setItem("popupShown", "true");
            }, 4000);
        }

        setTimeout(function () {
            if ($("#triggerClick").length) {
                $("#triggerClick").trigger("click");
            }
        }, 5000);

        // Responsive menu
        $(".menu-bottom").on("click", function () {
            $("html").toggleClass("menu-open");
            $(this).toggleClass("click");
        });

        // Mobile Services mega-menu accordion
        $(".has-mega > a").on("click", function (e) {
            if (window.matchMedia("(max-width: 991px)").matches) {
                e.preventDefault();
                $(this)
                    .parent()
                    .toggleClass("mega-open")
                    .siblings(".has-mega")
                    .removeClass("mega-open");
            }
        });

        if (typeof AOS !== "undefined") {
            AOS.init({ disable: "mobile" });
        }

        if ($.fn.validate) {
            $(".validate-popupform").validate();
            $(".app_contact_form").validate();
            $(".validate-autopopup").validate();
        }

        var currentIP = $("meta[name=ip2loc]").attr("content");
        if (currentIP) {
            var key = "5XpThOAEkfgOvEJ";
            $.ajax({
                method: "get",
                url: "https://pro.ip-api.com/json/" + currentIP,
                data: { key: key },
                success: function (data) {
                    if (data) {
                        $("input[name=ip2loc_ip]").val(data.query);
                        $("input[name=ip2loc_isp]").val(data.isp);
                        $("input[name=ip2loc_org]").val(data.org);
                        $("input[name=ip2loc_country]").val(data.country);
                        $("input[name=ip2loc_region]").val(data.regionName);
                        $("input[name=ip2loc_city]").val(data.city);
                    }
                }
            });
        }

        /* PORTFOLIO */
        $(".various").on("click", function () {
            var leadprice = $(this).attr("name");
            $(".popupform .leadprice").val(leadprice);
        });

        // FAQ accordion
        $(document).on("click", ".faq-accordion .accordion > li > a, .schema-faq-question", function (e) {
            e.preventDefault();
            var $item = $(this).closest("li, .schema-faq-section, .faq-item");
            $item.toggleClass("active open").siblings().removeClass("active open");
        });

        initHomeTyped();

        if (!$.fn.owlCarousel) {
            return;
        }

        $(".owl-testimonial").owlCarousel({
            loop: true,
            dots: false,
            margin: 15,
            responsiveClass: true,
            autoplay: true,
            autoplayTimeout: 8000,
            autoplaySpeed: 800,
            nav: false,
            navText: [
                '<i class="fas fa-arrow-left"></i>',
                '<i class="fas fa-arrow-right"></i>'
            ],
            responsive: {
                0: { items: 2 },
                360: { items: 1 },
                600: { items: 2 },
                1000: { items: 2 }
            }
        });

        $(".owl-books").owlCarousel({
            loop: true,
            dots: false,
            margin: 10,
            responsiveClass: true,
            autoplay: true,
            autoplayTimeout: 8000,
            autoplaySpeed: 800,
            nav: false,
            navText: [
                '<i class="fas fa-arrow-left"></i>',
                '<i class="fas fa-arrow-right"></i>'
            ],
            responsive: {
                0: { items: 3 },
                360: { items: 2 },
                600: { items: 3 },
                1000: { items: 5 }
            }
        });

        $(".owl-site-logo").owlCarousel({
            loop: true,
            nav: false,
            dots: false,
            margin: 30,
            responsiveClass: true,
            autoplay: true,
            autoplayHoverPause: true,
            autoplayTimeout: 8000,
            autoplaySpeed: 800,
            navText: [""],
            responsive: {
                0: { items: 6 },
                360: { items: 2 },
                600: { items: 6 },
                1000: { items: 6 }
            }
        });

        $(".owl-bbc").owlCarousel({
            loop: true,
            nav: false,
            dots: false,
            margin: 30,
            responsiveClass: true,
            autoplay: true,
            autoplayHoverPause: true,
            autoplayTimeout: 8000,
            autoplaySpeed: 800,
            navText: [""],
            responsive: {
                0: { items: 4 },
                360: { items: 1 },
                600: { items: 4 },
                1000: { items: 4 }
            }
        });

        $(".owl-home").owlCarousel({
            items: 1,
            loop: true,
            nav: false,
            dots: false,
            margin: 30,
            responsiveClass: true,
            autoplay: true,
            autoplayHoverPause: true,
            autoplayTimeout: 4000,
            autoplaySpeed: 800,
            touchDrag: false,
            mouseDrag: false,
            animateIn: "fadeIn",
            animateOut: "fadeOut"
        });
    });
})(window.jQuery || window.$);
