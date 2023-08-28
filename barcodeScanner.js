import {Html5QrcodeScanner} from 'html5-qrcode';

function docReady(fn) {
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {
    var resultContainer = document.getElementById('barcode-reader-results');
    var lastResult, countResults = 0;

    $('#collapseQRcode').on('show.bs.collapse', function () {
        $('#collapseBarcode').collapse('hide');
    });
    $('#collapseBarcode').on('show.bs.collapse', function () {
        $('#collapseQRcode').collapse('hide');
    });

    function onScanSuccess(decodedText, decodedResult) {
        html5QrcodeScanner.clear();
        if (decodedText !== lastResult) {
            ++countResults;
            lastResult = decodedText;
            $.ajax({
                url: "/equipment/findBySerialNumber",
                method: "POST",
                data: { serialNumber: decodedText },
                success: function(serialNumber) {
                    // Rediriger vers la page correspondant à l'id
                    window.location.href = window.location.origin + '/equipment/' + serialNumber;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("Une erreur est survenue : " + jqXHR.responseText + " - " + errorThrown);
                }
            });
        } else {
            alert('erreur lors de lecture de code a barre')
        }
    }
    var html5QrcodeScanner = new Html5QrcodeScanner("barcode-reader", {fps: 10, qrbox: {width: 500, height: 250}});
    html5QrcodeScanner.render(onScanSuccess);
    // Add custom styles to the video element
    const videoElement = document.querySelector('#barcode-reader video');
    videoElement.style.objectFit = 'none'; // Prevent the video from stretching to full width
    videoElement.style.width = '100%'; // Set the width of the video element
    videoElement.style.height = '50%'; // Calculate the height automatically based on the aspect ratio
    videoElement.style.maxHeight = '400px'; // Set the maximum height of the video element



});