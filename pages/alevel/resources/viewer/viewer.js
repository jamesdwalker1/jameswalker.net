const ResourceParser = require('../../../../js/resourceParser');

module.exports = function ($scope, $routeParams, $http) {
    const url = `api/alevel-resources-worksheet.php?name=${$routeParams.filename}`;

    $scope.title = $routeParams.filename.replace(/;/g, ' > ').split('.jwrsc')[0];

    $http.get(url).then(function (res) {
        let rp = new ResourceParser();
        rp.setMarkup(res.data.file);
        document.getElementById('sheet').innerHTML = rp.getHTML();

        $scope.totalMarks = rp.getTotalMarks();
        $scope.gradeBoundaries = rp.getGradeBoundaries();
    });

    let markSchemeVisible = false;
    $scope.showMarkScheme = function () {
        // Images don't use the src="" tag to prevent loading if the 
        // user will never view it
        const ms = document.querySelectorAll('img.ms');
        ms.forEach(function (img) {

            if (!markSchemeVisible) { // load images
                const url = img.getAttribute('at');

                img.setAttribute('src', url);
                img.style.display = 'block';
            } else { // hide images
                img.style.display = 'none';
            }

        });

        markSchemeVisible = !markSchemeVisible;
    }
};