<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>Zonemation</title>
    <link rel="canonical" href="https://www.zonemation.com/">
    <meta property="og:url" content="https://www.zonemation.com/">
    <meta name="description" content="Zonemation website">
    <script type="application/ld+json">
        {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "name": "Zonemation",
            "url": "https://www.zonemation.com"
        }
    </script>
    <link rel="icon" href="uploads/default/logo.png">
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto&amp;display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Space+Grotesk&amp;display=swap">
    <link rel="stylesheet" href="assets/css/Carousel-Multi-Image--ISA-.css">
    <link rel="stylesheet" href="assets/css/Effective-Pricing-Cards.css">
    <link rel="stylesheet" href="assets/css/Faq-by-pomdre-faq.css">
    <link rel="stylesheet" href="assets/css/Faq-by-pomdre.css">
    <link rel="stylesheet" href="assets/css/Navbar-Centered-Brand-icons.css">
    <link rel="stylesheet" href="assets/css/Pricing-Yearly--Monthly-badges.css">
    <link rel="stylesheet" href="assets/css/Rowfcards-styles.css">
    <link rel="stylesheet" href="assets/css/styles.css">
    <style>
        .glowing-element {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.glowing-element svg {
    width: 65%;
    height: 65%;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
    opacity: 0.5;
    position: relative;
    display: block;
}
.background-container {
    position: fixed;
    bottom: 15%;
    left: 25%;
    width: 900px;
    height: 900px;
    overflow: hidden;
    opacity: 0.7;
    z-index: 1;
    filter: blur(150px);
    isolation: isolate;
    pointer-events: none;
    max-width: 100%;
    z-index: -1;
}
body {
    background-image: url(assets/grid.svg) !important;
    line-height: 1.6;
}
/* Grayscale filter applied by default */
.grayscale {
    filter: grayscale(100%);
    transition: filter 0.3s ease-in-out;
}

.grayscale:hover {
    filter: grayscale(0%);
}
    </style>
</head>

<body style="font-family: 'Space Grotesk';">

    @include('wpbox::website.partials.nav')
    <div class="background-container">
        <div class="glowing-element">
            @svg('glow')
        </div>
    </div>
    <div style="padding-top: 110px; ">
@yield('content')
    </div>
        
    
    
    
    @include('wpbox::website.partials.footer')
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/js/Carousel-Multi-Image--ISA--carousel-multi.js"></script>
    <script src="assets/js/Faq-by-pomdre-faq.js"></script>
</body>

</html>