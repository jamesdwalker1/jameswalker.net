module.exports = function ($scope) {
    $scope.file = '{"cards":{}}';
    $scope.cardIDList = '';

    $scope.add = function () {
        let cards = JSON.parse($scope.file).cards;

        let numChars = 2;
        if (cards.length > 600) {
            numChars = 3;
        }

        let unique = false;
        let rand;
        while (!unique) {
            rand = Math.random().toString(36).substring(2, 2 + numChars).toUpperCase();

            unique = cards[rand] === undefined;
        }

        cards[rand] = {
            front: $scope.front,
            back: $scope.back,
            difficulty: $scope.difficulty
        };

        $scope.cardIDList += `(${rand})`;
        $scope.front = '';
        $scope.back = '';

        $scope.file = JSON.stringify({
            cards: cards
        });
    }
};