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

        function showPopupFormSuccess($form) {
            var $pad = $form.closest(".notepad-pad, .popup-content, .custom-pop");
            var $host = $form.closest(".popup-content");
            if (!$host.length) $host = $form.parent();
            $host.html(
                '<div class="notepad-success">' +
                    '<p class="notepad-kicker">Adams Global Publishers</p>' +
                    "<h2>Thank You!</h2>" +
                    '<p class="notepad-lead">Your details were sent successfully. Our team will contact you shortly.</p>' +
                    '<button type="button" class="btn btn-blue notepad-submit" data-fancybox-close>Close</button>' +
                "</div>"
            );
            if ($pad.length) $pad.addClass("is-success");
        }

        function showPopupFormError($form, msg) {
            var $err = $form.find(".form-submit-error");
            if (!$err.length) {
                $err = $('<p class="form-submit-error" role="alert"></p>').appendTo($form);
            }
            $err.text(msg || "Something went wrong. Please try again.");
        }

        if ($.fn.validate) {
            $(".validate-popupform").validate({
                errorElement: "span",
                errorClass: "field-error",
                errorPlacement: function (error, element) {
                    var $field = element.closest(".notepad-field");
                    if ($field.length) {
                        $field.append(error);
                    } else {
                        error.insertAfter(element);
                    }
                },
                highlight: function (element) {
                    $(element).addClass("error is-invalid");
                },
                unhighlight: function (element) {
                    $(element).removeClass("error is-invalid");
                },
                messages: {
                    cn: "Please enter your name",
                    pn: "Please enter a valid phone number",
                    em: "Please enter a valid email",
                    msg: "Please tell us briefly about your book"
                },
                submitHandler: function (form) {
                    var $form = $(form);
                    var $btn = $form.find('[type="submit"]');
                    // Local file preview cannot run PHP — avoid opening raw sending.php
                    if (window.location.protocol === "file:") {
                        showPopupFormSuccess($form);
                        return false;
                    }

                    $btn.prop("disabled", true).addClass("is-loading");
                    $.ajax({
                        url: $form.attr("action") || "sending.php",
                        method: "POST",
                        data: $form.serialize(),
                        dataType: "json",
                        headers: { "X-Requested-With": "XMLHttpRequest" }
                    })
                        .done(function (res) {
                            if (res && res.ok) {
                                showPopupFormSuccess($form);
                            } else {
                                showPopupFormError(
                                    $form,
                                    (res && res.message) || "Unable to send right now."
                                );
                                $btn.prop("disabled", false).removeClass("is-loading");
                            }
                        })
                        .fail(function () {
                            // Fallback: classic submit if server isn't JSON-ready
                            form.submit();
                        });
                    return false;
                }
            });
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

        // Are You Ready section — soft mouse parallax
        (function initAmazingParallax() {
            var $sec = $("#ourAmazing");
            if (!$sec.length) return;
            var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (reduceMotion) return;
            var targetX = 0;
            var targetY = 0;
            var currX = 0;
            var currY = 0;
            var rafId = 0;

            function tick() {
                rafId = 0;
                currX += (targetX - currX) * 0.08;
                currY += (targetY - currY) * 0.08;
                $sec[0].style.setProperty("--amz-x", currX.toFixed(2) + "px");
                $sec[0].style.setProperty("--amz-y", currY.toFixed(2) + "px");
                if (Math.abs(targetX - currX) > 0.1 || Math.abs(targetY - currY) > 0.1) {
                    rafId = window.requestAnimationFrame(tick);
                }
            }

            $sec.on("mousemove", function (e) {
                var rect = this.getBoundingClientRect();
                var nx = (e.clientX - rect.left) / rect.width - 0.5;
                var ny = (e.clientY - rect.top) / rect.height - 0.5;
                targetX = nx * 18;
                targetY = ny * 12;
                if (!rafId) rafId = window.requestAnimationFrame(tick);
            });
            $sec.on("mouseleave", function () {
                targetX = 0;
                targetY = 0;
                if (!rafId) rafId = window.requestAnimationFrame(tick);
            });
        })();

        // Published books detail modal
        var $bookModal = $("#bookDetailModal");
        var $bookAmbient = $("#bookDetailAmbient");
        var $bookSpotlight = $("#bookDetailSpotlight");
        var $bookAmazon = $("#bookDetailAmazon");
        var $bookBadge = $("#bookDetailBadge");
        var $bookStars = $("#bookDetailStars");
        var bookCloseTimer = null;
        var bookOwl = null;

        function openBookModal($btn) {
            if (!$bookModal.length) return;
            if (bookCloseTimer) {
                clearTimeout(bookCloseTimer);
                bookCloseTimer = null;
            }

            var title = $btn.attr("data-title") || "";
            var author = $btn.attr("data-author") || "";
            var genre = $btn.attr("data-genre") || "";
            var desc = $btn.attr("data-desc") || "";
            var cover = $btn.attr("data-cover") || "";
            var amazon = ($btn.attr("data-amazon") || "").trim();
            var hasAmazon = !!amazon;

            $("#bookDetailTitle").text(title);
            $("#bookDetailAuthor").text(author);
            $("#bookDetailGenre").text(genre);
            $("#bookDetailDesc").text(desc);
            $("#bookDetailCover").attr("src", cover).attr("alt", title || "Book cover");
            if ($bookAmbient.length) {
                $bookAmbient.css("background-image", cover ? "url('" + cover + "')" : "none");
            }

            if (hasAmazon) {
                $bookAmazon.attr("href", amazon).prop("hidden", false);
                $bookBadge.text("Available on Amazon").removeClass("is-portfolio");
                $bookStars.removeClass("is-visible").attr("aria-hidden", "true");
            } else {
                $bookAmazon.attr("href", "#").prop("hidden", true);
                $bookBadge.text("Portfolio Showcase").addClass("is-portfolio");
                $bookStars.addClass("is-visible").attr("aria-hidden", "false");
            }

            $bookModal.prop("hidden", false);
            $("body").addClass("book-modal-open");
            if (bookOwl && bookOwl.trigger) {
                bookOwl.trigger("stop.owl.autoplay");
            }
            requestAnimationFrame(function () {
                $bookModal.addClass("is-open");
            });
        }

        function closeBookModal() {
            if (!$bookModal.length || $bookModal.prop("hidden")) return;
            $bookModal.removeClass("is-open");
            $("body").removeClass("book-modal-open");
            if (bookOwl && bookOwl.trigger) {
                bookOwl.trigger("play.owl.autoplay", [8000]);
            }
            bookCloseTimer = setTimeout(function () {
                $bookModal.prop("hidden", true);
                $("#bookDetailCover").attr("src", "");
                if ($bookAmbient.length) $bookAmbient.css("background-image", "none");
                bookCloseTimer = null;
            }, 320);
        }

        function updateBookParallax(e) {
            if (!$bookModal.hasClass("is-open")) return;
            var w = window.innerWidth || 1;
            var h = window.innerHeight || 1;
            var x = (e.clientX / w) * 100;
            var y = (e.clientY / h) * 100;
            if ($bookSpotlight.length) {
                $bookSpotlight.css({ left: x + "%", top: y + "%" });
            }
            var rx = ((e.clientY / h) - 0.5) * -14;
            var ry = ((e.clientX / w) - 0.5) * 22;
            $(".book-detail-book").css(
                "transform",
                "rotateY(" + (-18 + ry) + "deg) rotateX(" + (4 + rx) + "deg)"
            );
        }

        $(document).on("click", "[data-book-modal]", function (e) {
            e.preventDefault();
            e.stopPropagation();
            openBookModal($(this));
        });
        $(document).on("click", "[data-book-close]", function (e) {
            if (!$(this).is("[data-fancybox]")) {
                e.preventDefault();
            }
            closeBookModal();
        });
        $(document).on("keydown", function (e) {
            if (e.key === "Escape") closeBookModal();
        });
        $(document).on("mousemove", "#bookDetailModal", updateBookParallax);

        // Notepad pencil — cursor-follow only (smooth lerp)
        (function initNotepadPencil() {
            var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            var targetRot = -18;
            var targetX = 0;
            var targetY = 0;
            var currRot = -18;
            var currX = 0;
            var currY = 0;
            var $pens = null;
            var rafId = 0;

            function apply() {
                if (!$pens || !$pens.length) return;
                $pens[0].style.setProperty("--pen-rot", currRot.toFixed(2) + "deg");
                $pens[0].style.setProperty("--pen-x", currX.toFixed(2) + "px");
                $pens[0].style.setProperty("--pen-y", currY.toFixed(2) + "px");
            }

            function tick() {
                rafId = 0;
                currRot += (targetRot - currRot) * 0.14;
                currX += (targetX - currX) * 0.14;
                currY += (targetY - currY) * 0.14;
                apply();
                if (
                    Math.abs(targetRot - currRot) > 0.05 ||
                    Math.abs(targetX - currX) > 0.05 ||
                    Math.abs(targetY - currY) > 0.05
                ) {
                    rafId = window.requestAnimationFrame(tick);
                }
            }

            function requestTick() {
                if (!rafId) rafId = window.requestAnimationFrame(tick);
            }

            $(document).on("mousemove", ".notepad-scene", function (e) {
                if (reduceMotion) return;
                $pens = $(this).find(".notepad-pens");
                if (!$pens.length) return;
                var rect = this.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                var nx = (e.clientX - rect.left) / rect.width - 0.5;
                var ny = (e.clientY - rect.top) / rect.height - 0.5;
                targetRot = -18 + nx * 22;
                targetX = nx * 14;
                targetY = ny * 10;
                requestTick();
            });

            $(document).on("mouseleave", ".notepad-scene", function () {
                $pens = $(this).find(".notepad-pens");
                targetRot = -18;
                targetX = 0;
                targetY = 0;
                requestTick();
            });
        })();

        if (!$.fn.owlCarousel) {
            return;
        }

        $(".owl-testimonial").owlCarousel({
            loop: true,
            dots: false,
            margin: 24,
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
                0: { items: 1 },
                360: { items: 1 },
                600: { items: 2 },
                1000: { items: 2 }
            }
        });

        // Interactive process steps
        (function initProcessSteps() {
            var $root = $("#ourProcess");
            if (!$root.length) return;
            var $steps = $root.find("[data-process-step]");
            var $panels = $root.find("[data-process-panel]");
            var index = 0;
            var timer = null;
            var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            function setStep(i) {
                index = (i + $steps.length) % $steps.length;
                $steps.each(function (si) {
                    $(this)
                        .toggleClass("is-active", si === index)
                        .toggleClass("is-done", si < index)
                        .attr("aria-selected", si === index ? "true" : "false");
                });
                $panels
                    .addClass("is-visible")
                    .removeClass("is-current")
                    .eq(index)
                    .addClass("is-current");
                $root.attr("data-active-step", String(index));
            }

            function play() {
                if (reduceMotion || timer) return;
                timer = window.setInterval(function () {
                    setStep(index + 1);
                }, 4200);
            }

            function pause() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            $steps.on("click", function () {
                setStep(parseInt($(this).attr("data-process-step"), 10) || 0);
                pause();
                play();
            });

            $panels.on("click", function () {
                setStep(parseInt($(this).attr("data-process-panel"), 10) || 0);
                pause();
                play();
            });

            $root.on("mouseenter focusin", pause).on("mouseleave focusout", play);
            setStep(0);
            play();
        })();

        bookOwl = $(".owl-books").owlCarousel({
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
