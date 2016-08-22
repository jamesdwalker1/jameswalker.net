module.exports = function ($scope, $timeout, Notes, $location) {
    function load() {
        Notes.getModuleList(function (modules) {
            // Callback may be called twice (first cache hit then live data)

            // Group modules into subjects
            $scope.list = {};

            let subject = '';
            modules.forEach(function (module) {
                if (module.subject !== subject) {
                    subject = module.subject;
                    $scope.list[subject] = [ module ];
                } else {
                    $scope.list[subject].push(module);
                }
            });
        });
    }

    load();
    setInterval(load, 60000);

    $scope.notePage = function (module) {
        const card = document.getElementById(`card-${module.subject}`);

        card.className = 'card card-clicked';

        $timeout(function () {
            $location.url(`/alevel/notes/${module.filename}/viewer/`);
        }, 300);
    };
};