module.exports = function ($scope, $http) {
    $scope.showForm = true;

    $scope.upload = function () {
        $scope.showForm = false;

        const storage = firebase.storage();
        const storageRef = storage.ref();
        const imagesRef = storageRef.child('images');

        // Generate unique name (milliseconds since epoch in base-36)
        const random = Date.now().toString(36);
        const fileRef = storageRef.child(random + '.png');

        const fileUpload = document.getElementById('file-upload');

        const file = fileUpload.files[0];
        fileRef.put(file).then(function (snapshot) {
            localStorage.setItem('uploadName', snapshot.downloadURL);
            
            setTimeout(function () {
                window.close();
            }, 300); // let editor markup update
        });
    }
};