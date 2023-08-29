
function docReady(fn) {
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {
    var resultContainer = document.getElementById('qr-reader-results');
    var lastResult, countResults = 0;

    function onScanSuccess(decodedText, decodedResult) {
        html5QrcodeScanner.clear();
        if (decodedText !== lastResult) {
            ++countResults;
            lastResult = decodedText;
            if (decodedText.startsWith('E')) {
                var idequipement = decodedText.slice(1);
                if (isNaN(idequipement)) {
                    alert('Identifiant non reconnue')
                } else {
                    window.location.href = window.location.origin + '/equipment/' + idequipement;
                }
            } else if (decodedText.startsWith('GE')) {
                var idgroupequipement = decodedText.slice(2);
                if (isNaN(idgroupequipement)) {
                    alert('Identifiant non reconnue')
                } else {
                    window.location.href = window.location.origin + '/equipment/group/' + idgroupequipement;
                }
            } else if (isImei(decodedText)) {
                $.ajax({
                    url: "/equipment/research",
                    method: "POST",
                    data: { imei: decodedText },
                    success: function(idmobile) {
                        // Rediriger vers la page correspondant à l'id
                        window.location.href = window.location.origin + '/equipment/' + idmobile;
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert("Une erreur est survenue : " + jqXHR.responseText + " - " + errorThrown);
                    }
                });
            } else {
                alert('erreur lors de lecture de la QrCode')
            }
        }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {fps: 10, qrbox: 250});
    html5QrcodeScanner.render(onScanSuccess);
});

function isImei(imei) {
    return /^\d{15}$/.test(imei);
}

