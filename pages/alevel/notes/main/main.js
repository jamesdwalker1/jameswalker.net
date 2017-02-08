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
            const rawFilename = module.filename;console.log(rawFilename);

            // 'Subject;Module Name.jwmkp' -> 'Subject;Module-Name'
            const urlFriendlyName = rawFilename.replace(' ', '-').split('.')[0];

            $location.url(`/alevel/notes/${urlFriendlyName}/viewer/`);
        }, 300);
    };
};