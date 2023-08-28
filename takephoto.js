$(document).ready(function () {


    $('input').on('change', function () {

        let fileInput = $(this)[0];

        if (fileInput && fileInput.files && fileInput.files[0].size >= 8 * 1024 * 1024) {
            alert('Le fichier sélectionné est supérieur à 8Mo !');
            $(this).val('');
            return;
        }

        if (fileInput && fileInput.files) {
            const file = fileInput.files[0];
            const allowedExtensions = ['pdf', 'doc', 'docx', 'xls','xlsx', 'txt', 'vsd', 'vsdx'];
            const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileType = file.type;
        
            if (!allowedExtensions.includes(fileExtension) && !allowedImageExtensions.includes(fileExtension)) {
                alert('Le fichier sélectionné n\'est pas dans un format valide !\nLes formats autorisés sont: \npdf, doc, docx, xls, xlsx, vsd, vsdx, txt, jpeg, jpg, png et gif.');
                $(this).val('');
                return;
            }
        }
    });

    $('.file-input').on('change', handleImageUpload);

    function handleImageUpload(event) {

        let fileInput = event.target;
        let photoEtiquette = fileInput.files[0];
    
        if (photoEtiquette && (photoEtiquette.type.includes("image"))) {
    
            if(photoEtiquette.size < 8 * 1024 * 1024){
                let formData = new FormData();
                formData.append('scannEtiquette', photoEtiquette);
            
                try {
                    document.getElementById("loadingMessage").style.display = "flex";

                    $.ajax({
                        url: "/equipment/extract-text",
                        type: 'POST',
                        data: formData,
                        mimeType: "multipart/form-data",
                        processData: false,
                        contentType: false,
                        success: function (idEquipement) {
                            $('.file-input').val('');

                            window.location.href = window.location.origin + '/equipment/' + idEquipement;
                            document.getElementById("loadingMessage").style.display = "none";
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            document.getElementById("loadingMessage").style.display = "none";
                            $('.file-input').val('');
                            alert("Une erreur est survenue : " + jqXHR.responseText + " - " + errorThrown);
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
});
