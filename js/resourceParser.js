const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const romanNumerals = [
    'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'
];

let ResourceParser = function () {};

ResourceParser.prototype.setMarkup = function (markup) {
    this.markup = markup;
    this.parsed = {};
    return this;
};

ResourceParser.prototype._parseIfNotCached = function () {
    if (Object.keys(this.parsed).length === 0) {
        this.parsed = this._parse();
    }
}

ResourceParser.prototype.getHTML = function () {
    this._parseIfNotCached();

    return this.parsed.html;
}

// Single-dimensional array of the 6 boundaries (A* down to E) in marks
ResourceParser.prototype.getGradeBoundaries = function () {
    this._parseIfNotCached();

    return this.parsed.gradeBoundaries;
}

ResourceParser.prototype.getTotalMarks = function () {
    this._parseIfNotCached();

    return this.parsed.totalMarks;
}

ResourceParser.prototype._parse = function () {
    let html = '';

    this.lines = this.markup.split('\n');

    let indentLevels = 0;
    let levelParts = [
        1, 1, 1, 1 // one for each tier
    ]

    let totalMarks = 0;
    let ABoundary; // either percentage or string num marks
    let BBoundary; // same

    this.lines.forEach(function (line) {
        // Replace tabs with a single space
        line = line.replace(/\s\s+/g, ' ');

        if (line === '' || line === ' ') {
            return;
        }

        // Remove first space
        if (line[0] === ' ') {
            line = line.substring(1, line.length)
        }

        if (line[0] === '{') {
            indentLevels++;

            html += '\n<div class="level-' + indentLevels + '">';

            let marker;
            if (indentLevels === 1) {
                marker = levelParts[indentLevels - 1];
            } else if (indentLevels === 2) {
                marker = alphabet[levelParts[indentLevels - 1] - 2];
            } else if (indentLevels === 3) {
                marker = romanNumerals[levelParts[indentLevels - 1] - 2];
            } else if (indentLevels === 4) {
                marker = alphabet[levelParts[indentLevels - 1] - 2].toUpperCase();
            }

            html += '<span class="questionMarker">' + marker + ')</span>';

            levelParts[indentLevels]++;
        } else if (line[0] === '}') {
            indentLevels--;
            levelParts[indentLevels + 1] = 1;
            levelParts[indentLevels]++;
            html += '</div>';
        // } else if (/\/*(.+?)*\//.test(line) || (line[0] === '/' && line[1] === '/')) {
        //     // Ignore - comment
        } else {
            // If it's grade boundaries
            match = /\[boundaries\](.+?),(.+?)\[\/boundaries\]/.exec(line);
            if (match && line[0] === '[') {
                ABoundary = match[1];
                BBoundary = match[2];
                return;
            }

            // If it's the mark scheme image
            match = /\[ms\](.+?)\[\/ms\]/.exec(line);
            if (match) {
                const url = match[1];
                html += `<img at="${url}" class="ms">`;
                return;
            }

            // If it's a [numLines, numMarks]
            let match = /\[(.+?),(.+?)\]/.exec(line);
            if (match && line[0] === '[') {
                const answerLines = match[1];
                const marks = match[2];

                for (var i = 0; i < answerLines; i++) {
                    html += '<div class="line"></div>';
                }

                html += '<div class="marks">[' + marks + ']</div>';
                totalMarks += parseInt(marks);

                return;
            }

            // Otherwise, for text
            html += '<p>' +
                line
                    .replace(/\[b\](.+?)\[\/b\]/g, '<strong>$1</strong>')
                    .replace(/\[i\](.+?)\[\/i\]/g, '<em>$1</em>')
                    .replace(/\[u\](.+?)\[\/u\]/g, '<span style="text-decoration:underline">$1</span>')
                    .replace(/\[img (.+?) (.+?)w\]/g, '<img src="$1" alt="" width="$2" style="max-width:$2">')
                    .replace(/\[img (.+?)\]/g, '<img src="$1" alt="">')
                    .replace(/\[newline\]/g, '<br>')
                    .replace(/\[->\]/g, '<span>&#8594;</span>')
                    .replace(/\[>=\]/g, '<span>&ge;</span>')
                    .replace(/\[<=\]/g, '<span>&le;</span>')
                    .replace(/\[divide\]/g, '<span>&divide;</span>')
                    .replace(/\[plusorminus\]/g, '<span>&plusmn;</span>')
                    .replace(/\[Delta\]/g, '<span>&Delta;</span>')
                    .replace(/\[deg\]/g, '<span>&deg;</span>')
                    .replace(/\[pi\]/g, '<span>&pi;</span>')
                    .replace(/\[x\]/g, '&times;')
                    .replace(/\[e\]/g, '££')
                    .replace(/\[\/e\]/g, '££')
                    .replace(/\[eblock\]/g, '€€')
                    .replace(/\[\/eblock\]/g, '€€')
                    .replace(/\`(.)/g, '<sub>$1</sub>')
                + '</p>';
        }
    });

    return {
        html: html,
        gradeBoundaries: this._gradeBoundaries(ABoundary, BBoundary, totalMarks),
        totalMarks: totalMarks
    };
};

ResourceParser.prototype._gradeBoundaries = function (ABoundary, BBoundary, totalMarks) {
    // Convert percentages to marks
    if (ABoundary[ABoundary.length - 1] === '%') {
        ABoundary = parseFloat(ABoundary) / 100 * totalMarks;
        BBoundary = parseFloat(BBoundary) / 100 * totalMarks;
    }


    let difference = ABoundary - BBoundary;

    // The difference between any two grades is the same in most GCSEs/Alevels
    return [
        Math.round(ABoundary + (difference)), // A*
        Math.round(ABoundary),
        Math.round(BBoundary),
        Math.round(BBoundary - difference), // C
        Math.round(BBoundary - (difference * 2)), // D
        Math.round(BBoundary - (difference * 3)) // E 
    ];
};

module.exports = ResourceParser;